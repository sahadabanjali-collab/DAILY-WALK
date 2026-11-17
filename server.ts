import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';

// Process-level resilience against crashes
process.on('uncaughtException', (err) => {
  console.error('[Server uncaughtException]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Server unhandledRejection]', reason);
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoints for Cloud Run / proxy ingress
  app.get(['/health', '/_health', '/api/health'], (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Helper for Razorpay client instance
  const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TNwJSx1mVIIGCa';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
    return new Razorpay({ key_id, key_secret });
  };

  // API Route: Create Razorpay Order
  app.post('/api/razorpay/create-order', async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;

      if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TNwJSx1mVIIGCa';
      const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

      // If Razorpay secret is present, create order via official SDK
      if (key_secret) {
        const instance = getRazorpayInstance();
        const options = {
          amount: Math.round(amount * 100), // Amount in paise
          currency,
          receipt,
        };
        const order = await instance.orders.create(options);
        return res.json({ ...order, key_id });
      } else {
        // Mock order creation when key secret is not set yet in environment
        const mockOrder = {
          id: `order_${Math.random().toString(36).substring(2, 15)}`,
          entity: 'order',
          amount: Math.round(amount * 100),
          amount_paid: 0,
          amount_due: Math.round(amount * 100),
          currency,
          receipt,
          status: 'created',
          attempts: 0,
          created_at: Math.floor(Date.now() / 1000),
          key_id,
        };
        return res.json(mockOrder);
      }
    } catch (err: any) {
      console.error('Error creating Razorpay order:', err);
      res.status(500).json({ error: err.message || 'Failed to create Razorpay order' });
    }
  });

  // API Route: Verify Payment Signature
  app.post('/api/razorpay/verify-payment', (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

      if (key_secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', key_secret)
          .update(body.toString())
          .digest('hex');

        if (expectedSignature === razorpay_signature) {
          return res.json({ success: true, message: 'Payment verified successfully' });
        } else {
          return res.status(400).json({ success: false, error: 'Invalid payment signature' });
        }
      }

      // If key_secret is missing or client-side checkout handled payment
      return res.json({ success: true, message: 'Payment recorded' });
    } catch (err: any) {
      console.error('Error verifying Razorpay payment:', err);
      res.status(500).json({ success: false, error: err.message || 'Verification failed' });
    }
  });

  // Serve Vite in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // SPA fallback in development if a direct HTML route is requested
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Daily Walk server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
