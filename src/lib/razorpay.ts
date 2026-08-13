declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export async function openRazorpayCheckout(params: {
  amount: number;
  name: string;
  email: string;
  phone: string;
  description: string;
  onSuccess: (paymentDetails: { paymentId: string; orderId?: string; signature?: string }) => void;
  onDismiss?: () => void;
  onError?: (error: string) => void;
}) {
  try {
    const env = (import.meta as any).env || {};
    const key = env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TNwJSx1mVIIGCa';

    let orderId = '';

    // Step 1: Request Razorpay order from backend API
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: params.amount,
          currency: 'INR',
          receipt: `order_rcpt_${Date.now()}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          orderId = data.id;
        }
      }
    } catch (e) {
      console.warn('Backend order creation warning:', e);
    }

    // Step 2: Ensure Razorpay JS SDK is present
    if (typeof window === 'undefined' || !window.Razorpay) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay Checkout SDK'));
        document.body.appendChild(script);
      });
    }

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK could not be loaded');
    }

    // Step 3: Configure and launch Razorpay modal
    const options: RazorpayOptions = {
      key,
      amount: Math.round(params.amount * 100), // amount in paise
      currency: 'INR',
      name: 'Daily Walk Footwear',
      description: params.description || 'Footwear Purchase',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
      ...(orderId ? { order_id: orderId } : {}),
      prefill: {
        name: params.name,
        email: params.email,
        contact: params.phone,
      },
      theme: {
        color: '#111827',
      },
      handler: async (response) => {
        if (response.razorpay_payment_id) {
          try {
            await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
          } catch (e) {
            console.warn('Payment verification notice:', e);
          }
        }

        params.onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || orderId,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          if (params.onDismiss) params.onDismiss();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err: any) {
    console.error('Razorpay modal launch error:', err);
    if (params.onError) {
      params.onError(err?.message || 'Failed to initialize Razorpay payment');
    }
  }
}
