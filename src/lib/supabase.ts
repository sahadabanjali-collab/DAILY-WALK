import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};

const SUPABASE_URL =
  env.VITE_SUPABASE_URL || 'https://cbbsbwzpuhhzuhzknrin.supabase.co';
const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_b8Z8_R2C0xUcUHTrK57KtA_Bk1RhcmX';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseOrderPayload {
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  items: any[];
  total_amount: number;
  payment_method: string;
  created_at?: string;
}

export async function createSupabaseOrder(orderData: {
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: any[];
  totalAmount: number;
  paymentMethod: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: SupabaseOrderPayload = {
      order_id: orderData.orderId,
      customer_name: orderData.fullName,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      items: orderData.items,
      total_amount: orderData.totalAmount,
      payment_method: orderData.paymentMethod,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('orders').insert([payload]);

    if (error) {
      console.warn('Supabase order insert warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Supabase exception:', err);
    return { success: false, error: err?.message || 'Connection error' };
  }
}
