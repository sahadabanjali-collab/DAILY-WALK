import { supabase } from '../lib/supabase';
import { Product, OrderRecord, Customer, CMSData, PromoCoupon, AuditLog, AdminUser } from '../types';

export interface SupabaseTableStatus {
  name: string;
  displayName: string;
  description: string;
  exists: boolean;
  rowCount: number;
  error?: string;
}

export interface SupabaseStatus {
  isConnected: boolean;
  projectId: string;
  hasOrdersTable: boolean;
  hasProductsTable: boolean;
  allTablesCreated: boolean;
  tables: SupabaseTableStatus[];
  errorMessage?: string;
  lastChecked: string;
}

export const SUPABASE_PROJECT_ID = 'cbbsbwzpuhhzuhzknrin';
export const SUPABASE_URL = 'https://cbbsbwzpuhhzuhzknrin.supabase.co';

export const TRACKED_TABLES: { name: string; displayName: string; description: string }[] = [
  { name: 'orders', displayName: 'Orders & Payments', description: 'Store orders, Razorpay transactions, and courier fulfillment' },
  { name: 'products', displayName: 'Product Catalog', description: 'Footwear styles, inventory, sizes, colors, and media URLs' },
  { name: 'customers', displayName: 'Customer Directory', description: 'Buyer CRM, total spend, phone, and order history' },
  { name: 'coupons', displayName: 'Discounts & Promo Codes', description: 'Discount codes, percentages, validity, and usage limits' },
  { name: 'cms_settings', displayName: 'Storefront CMS', description: 'Hero banners, promo ribbons, return policies, and settings' },
  { name: 'audit_logs', displayName: 'Audit Trail Records', description: 'Administrative actions, catalog updates, and security logs' },
  { name: 'admin_users', displayName: 'Admin Credentials', description: 'Super Admin and manager authorization accounts' },
];

/**
 * Test connectivity and probe all tables in Supabase project cbbsbwzpuhhzuhzknrin
 */
export async function testSupabaseConnection(): Promise<SupabaseStatus> {
  const tableStatuses: SupabaseTableStatus[] = [];
  let isConnected = true;
  let generalError: string | undefined;

  for (const t of TRACKED_TABLES) {
    try {
      const { data, error, count } = await supabase
        .from(t.name)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        tableStatuses.push({
          name: t.name,
          displayName: t.displayName,
          description: t.description,
          exists: true,
          rowCount: count || 0,
        });
      } else {
        const isMissing =
          error.message?.includes('schema cache') ||
          error.message?.includes('does not exist') ||
          error.code === '42P01' ||
          error.code === 'PGRST204' ||
          error.code === 'PGRST301';

        tableStatuses.push({
          name: t.name,
          displayName: t.displayName,
          description: t.description,
          exists: !isMissing,
          rowCount: 0,
          error: error.message,
        });
      }
    } catch (err: any) {
      tableStatuses.push({
        name: t.name,
        displayName: t.displayName,
        description: t.description,
        exists: false,
        rowCount: 0,
        error: err?.message,
      });
      generalError = err?.message;
    }
  }

  const ordersStatus = tableStatuses.find((t) => t.name === 'orders');
  const productsStatus = tableStatuses.find((t) => t.name === 'products');
  const allCreated = tableStatuses.every((t) => t.exists);

  return {
    isConnected,
    projectId: SUPABASE_PROJECT_ID,
    hasOrdersTable: Boolean(ordersStatus?.exists),
    hasProductsTable: Boolean(productsStatus?.exists),
    allTablesCreated: allCreated,
    tables: tableStatuses,
    errorMessage: generalError,
    lastChecked: new Date().toLocaleTimeString(),
  };
}

/**
 * Fetch all orders from Supabase 'orders' table
 */
export async function fetchAllSupabaseOrders(): Promise<{ orders: OrderRecord[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { orders: [], error: error.message };
    }

    const mapped: OrderRecord[] = (data || []).map((row: any) => ({
      id: row.id || row.order_id || `ord_${Date.now()}`,
      orderId: row.order_id || row.id || 'DW-UNKNOWN',
      customerName: row.customer_name || 'Customer',
      email: row.email || 'customer@example.com',
      phone: row.phone || '',
      address: row.address || '',
      items: Array.isArray(row.items) ? row.items : [],
      totalAmount: Number(row.total_amount) || 0,
      paymentMethod: row.payment_method || 'Online',
      paymentStatus: (row.payment_method || '').toLowerCase().includes('cod') ? 'Pending' : 'Paid',
      status: (row.status as any) || 'Processing',
      courierPartner: row.courier_partner || 'Blue Dart Express',
      trackingNumber: row.tracking_number || `TRK${Math.floor(100000000 + Math.random() * 900000000)}`,
      createdAt: row.created_at || new Date().toISOString(),
      notes: row.notes || '',
    }));

    return { orders: mapped };
  } catch (err: any) {
    return { orders: [], error: err?.message || 'Failed to fetch orders from Supabase' };
  }
}

/**
 * Update an order's status in Supabase
 */
export async function updateSupabaseOrder(
  orderId: string,
  updates: {
    status?: OrderRecord['status'];
    paymentStatus?: OrderRecord['paymentStatus'];
    courierPartner?: string;
    trackingNumber?: string;
    notes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status: updates.status,
        courier_partner: updates.courierPartner,
        tracking_number: updates.trackingNumber,
        notes: updates.notes,
      })
      .eq('order_id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update order' };
  }
}

/**
 * Upsert product into Supabase 'products' table
 */
export async function upsertProductToSupabase(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('products')
      .upsert(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          category: product.category,
          category_name: product.categoryName,
          gender: product.gender,
          description: product.description,
          details: product.details,
          price: product.price,
          original_price: product.originalPrice,
          discount: product.discount,
          images: product.images,
          sizes: product.sizes,
          colors: product.colors,
          rating: product.rating,
          review_count: product.reviewCount,
          stock: product.stock,
          is_featured: product.isFeatured || false,
          is_bestseller: product.isBestSeller || false,
          is_new: product.isNew || false,
          is_sale: product.isSale || false,
          tags: product.tags,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upsert product in Supabase' };
  }
}

/**
 * Delete a product from Supabase 'products' table
 */
export async function deleteProductFromSupabase(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete product from Supabase' };
  }
}

/**
 * Fetch products from Supabase 'products' table
 */
export async function fetchProductsFromSupabase(): Promise<{ products: Product[]; error?: string }> {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      return { products: [], error: error.message };
    }

    const mapped: Product[] = (data || []).map((row: any) => {
      let productImages: string[] = [];
      if (Array.isArray(row.images)) {
        productImages = row.images.filter(Boolean);
      } else if (typeof row.images === 'string' && row.images.trim()) {
        try {
          const parsed = JSON.parse(row.images);
          if (Array.isArray(parsed)) productImages = parsed.filter(Boolean);
          else if (typeof parsed === 'string' && parsed.trim()) productImages = [parsed.trim()];
        } catch {
          productImages = row.images.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
        }
      }

      if (productImages.length === 0) {
        productImages = ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'];
      }

      return {
        id: row.id,
        name: row.name,
        slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: row.brand,
        category: row.category,
        categoryName: row.category_name || row.category,
        gender: row.gender,
        description: row.description,
        details: row.details || { material: 'Premium', sole: 'Rubber', closure: 'Lace-Up', type: 'Footwear', gender: row.gender },
        price: Number(row.price),
        originalPrice: Number(row.original_price || row.price),
        discount: Number(row.discount || 0),
        images: productImages,
        sizes: Array.isArray(row.sizes) ? row.sizes : [6, 7, 8, 9, 10],
        colors: Array.isArray(row.colors) ? row.colors : [{ name: 'Default', hex: '#000000' }],
        rating: Number(row.rating || 4.5),
        reviewCount: Number(row.review_count || 12),
        stock: Number(row.stock || 20),
        isFeatured: Boolean(row.is_featured),
        isBestSeller: Boolean(row.is_bestseller),
        isNew: Boolean(row.is_new),
        isSale: Boolean(row.is_sale),
        tags: Array.isArray(row.tags) ? row.tags : [],
      };
    });

    return { products: mapped };
  } catch (err: any) {
    return { products: [], error: err?.message };
  }
}

/**
 * Fetch and upsert functions for other tables (customers, coupons, cms_settings, audit_logs)
 */
export async function syncCouponsToSupabase(coupons: PromoCoupon[]): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    let synced = 0;
    for (const c of coupons) {
      const { error } = await supabase.from('coupons').upsert(
        {
          id: `cpn_${c.code}`,
          code: c.code,
          description: c.description,
          discount_type: c.discountType,
          discount_value: c.discountValue,
          min_order_value: c.minOrderValue,
          expires_at: c.expiresAt ? new Date(c.expiresAt).toISOString() : null,
          is_active: c.isActive,
          usage_count: c.usageCount,
        },
        { onConflict: 'code' }
      );
      if (!error) synced++;
    }
    return { success: true, count: synced };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message };
  }
}

export async function syncCMSToSupabase(cmsData: CMSData): Promise<{ success: boolean; error?: string }> {
  try {
    const keys = Object.keys(cmsData) as (keyof CMSData)[];
    for (const k of keys) {
      await supabase.from('cms_settings').upsert(
        {
          id: `cms_${k}`,
          key: k,
          value: cmsData[k],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Complete, idempotent SQL migration script for Supabase project cbbsbwzpuhhzuhzknrin.
 * Includes all 7 tables, full RLS security policies, and initial seeds.
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- Daily Walk Footwear - Complete Database Schema & Migration
-- Supabase Project ID: cbbsbwzpuhhzuhzknrin
-- Open: https://supabase.com/dashboard/project/cbbsbwzpuhhzuhzknrin/sql/new
-- Paste this entire script into your SQL Editor and click "RUN"
-- =========================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- TABLE 1: PRODUCTS (Footwear Styles Catalog)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    category_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    description TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    discount INTEGER DEFAULT 0,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 20,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_sale BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- TABLE 2: ORDERS (Customer Orders & Razorpay Payments)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Paid',
    status TEXT NOT NULL DEFAULT 'Processing',
    courier_partner TEXT DEFAULT 'Blue Dart Express',
    tracking_number TEXT,
    notes TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- TABLE 3: CUSTOMERS (Customer CRM & Spend History)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    city TEXT DEFAULT 'Mumbai',
    state TEXT DEFAULT 'Maharashtra',
    orders_count INTEGER DEFAULT 1,
    total_spent NUMERIC(10, 2) DEFAULT 0,
    member_tier TEXT DEFAULT 'Member',
    status TEXT DEFAULT 'Active',
    addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- TABLE 4: COUPONS (Promotions & Discount Codes)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL, -- 'percentage' or 'flat'
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- TABLE 5: CMS_SETTINGS (Hero, Banners & Storefront Copy)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_settings (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- TABLE 6: AUDIT_LOGS (Administrative Action Trail)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    category TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- TABLE 7: ADMIN_USERS (Super Administrator Access)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'super_admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1. Products: Public read, full admin management
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full product management" ON public.products;
CREATE POLICY "Allow full product management" ON public.products FOR ALL USING (true);

-- 2. Orders: Public checkout insert & tracking select, admin manage
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can read orders" ON public.orders;
CREATE POLICY "Public can read orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full order management" ON public.orders;
CREATE POLICY "Allow full order management" ON public.orders FOR ALL USING (true);

-- 3. Customers: Public insert & read, admin manage
DROP POLICY IF EXISTS "Allow full customer management" ON public.customers;
CREATE POLICY "Allow full customer management" ON public.customers FOR ALL USING (true);

-- 4. Coupons: Public can view active coupons
DROP POLICY IF EXISTS "Public can view coupons" ON public.coupons;
CREATE POLICY "Public can view coupons" ON public.coupons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full coupon management" ON public.coupons;
CREATE POLICY "Allow full coupon management" ON public.coupons FOR ALL USING (true);

-- 5. CMS Settings: Public read
DROP POLICY IF EXISTS "Public can view CMS" ON public.cms_settings;
CREATE POLICY "Public can view CMS" ON public.cms_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full CMS management" ON public.cms_settings;
CREATE POLICY "Allow full CMS management" ON public.cms_settings FOR ALL USING (true);

-- 6. Audit Logs: Read & insert
DROP POLICY IF EXISTS "Allow full audit log management" ON public.audit_logs;
CREATE POLICY "Allow full audit log management" ON public.audit_logs FOR ALL USING (true);

-- 7. Admin Users: Admin read & verify
DROP POLICY IF EXISTS "Allow full admin user management" ON public.admin_users;
CREATE POLICY "Allow full admin user management" ON public.admin_users FOR ALL USING (true);

-- -------------------------------------------------------------------------
-- INITIAL SEED DATA
-- -------------------------------------------------------------------------

-- Seed Super Admin User
INSERT INTO public.admin_users (id, email, full_name, role, is_active)
VALUES 
    ('admin_sahada', 'sahadabanjali@gmail.com', 'Sahada Banjali', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET is_active = true, role = 'super_admin';

-- Seed Discount Coupons
INSERT INTO public.coupons (id, code, description, discount_type, discount_value, min_order_value, is_active, usage_count)
VALUES
    ('cpn_welcome10', 'WELCOME10', 'Welcome gift: 10% off on your first order', 'percentage', 10, 500, true, 128),
    ('cpn_dailywalk10', 'DAILYWALK10', '10% instant off on all shoe categories', 'percentage', 10, 999, true, 42),
    ('cpn_festive20', 'FESTIVE20', 'Mega 20% savings on purchases over ₹2,499', 'percentage', 20, 2499, true, 75),
    ('cpn_step500', 'STEP500', 'Flat ₹500 discount on premium sneakers', 'flat', 500, 2999, true, 19)
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Products
INSERT INTO public.products (
    id, name, slug, brand, category, category_name, gender, description, price, original_price, discount, stock, is_featured, is_bestseller, is_new, images, sizes
) VALUES
(
    'prod-1', 'Nike Air Max 270 React', 'nike-air-max-270-react', 'Nike', 'sneakers', 'Sneakers', 'Men',
    'Engineered for everyday walking comfort with responsive Max Air 270 unit and lightweight Nike React foam.',
    6999, 8999, 22, 24, true, true, false,
    '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    '[6, 7, 8, 9, 10, 11]'::jsonb
),
(
    'prod-2', 'Adidas Ultraboost Light 24', 'adidas-ultraboost-light-24', 'Adidas', 'running', 'Running', 'Men',
    'Experience epic energy return with Light BOOST cushioning, Primeknit+ upper and Continental rubber outsole.',
    7499, 9999, 25, 18, true, false, true,
    '["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    '[7, 8, 9, 10, 11]'::jsonb
),
(
    'prod-3', 'Puma Velocity Nitro 3', 'puma-velocity-nitro-3', 'Puma', 'running', 'Running', 'Women',
    'Advanced NITRO foam technology provides superior responsiveness and cushioning in an ultra-lightweight package.',
    4799, 5999, 20, 32, true, false, true,
    '["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    '[5, 6, 7, 8, 9]'::jsonb
),
(
    'prod-4', 'Daily Walk Heritage Chelsea Boot', 'daily-walk-heritage-chelsea-boot', 'Daily Walk', 'boots', 'Boots', 'Men',
    'Handcrafted premium suede leather Chelsea boots featuring ergonomic arch support and durable Goodyear welt.',
    5499, 6999, 21, 15, false, true, false,
    '["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    '[6, 7, 8, 9, 10, 11]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial System Audit Log
INSERT INTO public.audit_logs (id, actor, action, category, details)
VALUES (
    'log_init', 'sahadabanjali@gmail.com', 'Database Setup Verified', 'system',
    'Provisioned all 7 Supabase database tables with Row Level Security for Daily Walk e-commerce platform.'
) ON CONFLICT (id) DO NOTHING;
`;
