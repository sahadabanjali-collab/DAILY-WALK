import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import { Product, OrderRecord, Customer, CMSData, PromoCoupon, AuditLog } from '../types';
import {
  fetchAllSupabaseOrders,
  updateSupabaseOrder,
  upsertProductToSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
  testSupabaseConnection,
  SupabaseStatus,
  syncCouponsToSupabase,
  syncCMSToSupabase,
} from '../services/adminSupabaseService';

const LOCAL_PRODUCTS_KEY = 'daily_walk_catalog_products_v2';
const LOCAL_CMS_KEY = 'daily_walk_cms_config_v2';
const LOCAL_COUPONS_KEY = 'daily_walk_coupons_v2';
const LOCAL_ORDERS_KEY = 'daily_walk_all_orders_v2';
const LOCAL_AUDIT_KEY = 'daily_walk_admin_audit_logs_v2';

const DEFAULT_CMS_DATA: CMSData = {
  announcement: {
    text1: '⚡ FREE SHIPPING ON ORDERS ABOVE ₹1,999',
    text2: 'EASY 15-DAY RETURNS & EXCHANGES',
    link: '/shop?sale=true',
    isActive: true,
  },
  hero: {
    badge: 'UP TO 40% OFF SEASONAL COLLECTION',
    titleLine1: 'Step Into Your',
    titleHighlight: 'Everyday Style',
    subtitle:
      'Discover stylish, comfortable footwear designed to keep you moving every day — from ultra-cushioned runners to handcrafted formal leathers.',
    primaryBtnText: 'Shop Men',
    primaryBtnLink: '/men',
    secondaryBtnText: 'Shop Women',
    secondaryBtnLink: '/women',
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  },
  promoBanner: {
    title: 'Festival Footwear Rush',
    subtitle: 'Limited edition drops from Nike, Adidas & Puma at exclusive member prices.',
    discountText: 'FLAT 25% OFF',
    ctaText: 'Explore Collection',
    ctaLink: '/shop?sale=true',
    imageUrl:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
  },
  storeSettings: {
    freeShippingThreshold: 1999,
    shippingFee: 149,
    returnPeriodDays: 15,
    supportPhone: '+91 98765 43210',
    supportEmail: 'support@dailywalk.com',
  },
};

const DEFAULT_COUPONS: PromoCoupon[] = [
  {
    code: 'DAILYWALK10',
    description: '10% instant off on all shoe categories',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 42,
  },
  {
    code: 'WELCOME10',
    description: 'Welcome gift: 10% off on your first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 128,
  },
  {
    code: 'FESTIVE20',
    description: 'Mega 20% savings on purchases over ₹2,499',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 2499,
    expiresAt: '2026-11-30',
    isActive: true,
    usageCount: 75,
  },
  {
    code: 'STEP500',
    description: 'Flat ₹500 discount on premium sneakers & formal wear',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 2999,
    expiresAt: '2026-12-15',
    isActive: true,
    usageCount: 19,
  },
];

const SEED_ORDERS: OrderRecord[] = [
  {
    id: 'ord_init_1',
    orderId: 'DW-89210',
    customerName: 'Sahada Banjali',
    email: 'sahadabanjali@gmail.com',
    phone: '+91 98765 43210',
    address: 'Level 4, Express Towers, Nariman Point, Mumbai, Maharashtra 400021',
    items: [
      {
        product: {
          id: 'prod-1',
          name: 'Nike Air Max 270',
          price: 6999,
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80'],
        },
        selectedSize: 8,
        selectedColor: 'Red Accent',
        quantity: 1,
      },
    ],
    totalAmount: 6999,
    paymentMethod: 'RAZORPAY (pay_P39aN82v)',
    paymentStatus: 'Paid',
    status: 'Delivered',
    courierPartner: 'Blue Dart Express',
    trackingNumber: 'BD749201948IN',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    notes: 'Priority air delivery requested.',
  },
  {
    id: 'ord_init_2',
    orderId: 'DW-89211',
    customerName: 'David Kumar',
    email: 'david.kumar@example.com',
    phone: '+91 91234 56789',
    address: '14, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103',
    items: [
      {
        product: {
          id: 'prod-2',
          name: 'Nike Revolution 7',
          price: 3499,
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80'],
        },
        selectedSize: 9,
        selectedColor: 'Pure White',
        quantity: 1,
      },
      {
        product: {
          id: 'prod-4',
          name: 'Puma Velocity Nitro 2',
          price: 4999,
          images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80'],
        },
        selectedSize: 9,
        selectedColor: 'Electric Blue',
        quantity: 1,
      },
    ],
    totalAmount: 8498,
    paymentMethod: 'RAZORPAY (pay_Q88xZ10p)',
    paymentStatus: 'Paid',
    status: 'Shipped',
    courierPartner: 'Delhivery',
    trackingNumber: 'DLV9923847291',
    createdAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    notes: 'Signature verification on delivery.',
  },
  {
    id: 'ord_init_3',
    orderId: 'DW-89212',
    customerName: 'Ananya Sharma',
    email: 'ananya.s@example.com',
    phone: '+91 99887 76655',
    address: 'B-402, Lotus Towers, Baner, Pune, Maharashtra 411045',
    items: [
      {
        product: {
          id: 'prod-7',
          name: 'Adidas Ultraboost Light',
          price: 8999,
          images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=500&q=80'],
        },
        selectedSize: 6,
        selectedColor: 'Core Black',
        quantity: 1,
      },
    ],
    totalAmount: 8999,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Processing',
    courierPartner: 'Shadowfax',
    trackingNumber: 'SFX28374920',
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    notes: 'Verify cash amount at doorstep.',
  },
];

interface StoreDataContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> | Product) => Promise<{ success: boolean; id: string; error?: string }>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetProducts: () => void;
  syncProductsWithSupabase: () => Promise<{ success: boolean; message: string }>;
  syncAllToSupabase: () => Promise<{ success: boolean; message: string }>;
  
  orders: OrderRecord[];
  updateOrderStatus: (
    orderId: string,
    status: OrderRecord['status'],
    details?: { courierPartner?: string; trackingNumber?: string; notes?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  recordNewOrder: (order: OrderRecord) => void;
  refreshOrdersFromSupabase: () => Promise<void>;

  cmsData: CMSData;
  updateCMS: (section: keyof CMSData, updates: any) => void;
  resetCMS: () => void;

  coupons: PromoCoupon[];
  addCoupon: (coupon: PromoCoupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;
  validateCoupon: (code: string, currentSubtotal: number) => { valid: boolean; discount: number; message: string };

  customers: Customer[];

  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string, category?: AuditLog['category']) => void;

  supabaseStatus: SupabaseStatus | null;
  refreshSupabaseStatus: () => Promise<void>;
  isSyncing: boolean;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached products:', e);
    }
    return MOCK_PRODUCTS;
  });

  // 2. CMS state
  const [cmsData, setCmsData] = useState<CMSData>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_CMS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_CMS_DATA;
  });

  // 3. Coupons state
  const [coupons, setCoupons] = useState<PromoCoupon[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_COUPONS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_COUPONS;
  });

  // 4. Orders state
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SEED_ORDERS;
  });

  // 5. Audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_AUDIT_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
        actor: 'sahadabanjali@gmail.com',
        action: 'System Initialized',
        category: 'system',
        details: 'Admin panel and Supabase client connected to project cbbsbwzpuhhzuhzknrin',
      },
    ];
  });

  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper to append audit log
  const addAuditLog = useCallback(
    (action: string, details: string, category: AuditLog['category'] = 'system') => {
      const newEntry: AuditLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        actor: 'sahadabanjali@gmail.com',
        action,
        category,
        details,
      };
      setAuditLogs((prev) => {
        const updated = [newEntry, ...prev.slice(0, 99)];
        localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  // Check Supabase status on mount
  const refreshSupabaseStatus = useCallback(async () => {
    const status = await testSupabaseConnection();
    setSupabaseStatus(status);
  }, []);

  // Fetch orders from Supabase on mount
  const refreshOrdersFromSupabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetchAllSupabaseOrders();
      if (res.orders.length > 0) {
        // Merge with seed/local orders
        setOrders((prev) => {
          const map = new Map<string, OrderRecord>();
          // Put fetched first
          res.orders.forEach((o) => map.set(o.orderId, o));
          // Supplement with any existing not in fetched
          prev.forEach((o) => {
            if (!map.has(o.orderId)) map.set(o.orderId, o);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      console.warn('Supabase orders fetch warning:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Try fetching products from Supabase on start
  useEffect(() => {
    refreshSupabaseStatus();
    refreshOrdersFromSupabase();

    async function probeRemoteProducts() {
      try {
        const res = await fetchProductsFromSupabase();
        if (res.products && res.products.length > 0) {
          setProducts(res.products);
          localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(res.products));
        }
      } catch (e) {
        // Table may not exist yet, fallback works fine
      }
    }
    probeRemoteProducts();
  }, [refreshSupabaseStatus, refreshOrdersFromSupabase]);

  // Product CRUD
  const addProduct = async (
    productInput: Omit<Product, 'id'> | Product
  ): Promise<{ success: boolean; id: string; error?: string }> => {
    const newId = 'id' in productInput && productInput.id ? productInput.id : `prod-${Date.now()}`;
    const slug =
      productInput.slug ||
      productInput.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      ...productInput,
      id: newId,
      slug,
      rating: productInput.rating || 4.5,
      reviewCount: productInput.reviewCount || 1,
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });

    addAuditLog('Created Product', `Added "${newProduct.name}" (₹${newProduct.price}) to catalog`, 'product');

    // Attempt Supabase upsert asynchronously
    upsertProductToSupabase(newProduct).catch((err) => {
      console.warn('Note: Product saved locally. Supabase error:', err);
    });

    return { success: true, id: newId };
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Product>
  ): Promise<{ success: boolean; error?: string }> => {
    let updatedProduct: Product | undefined;

    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          updatedProduct = { ...p, ...updates };
          return updatedProduct;
        }
        return p;
      });
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });

    if (updatedProduct) {
      addAuditLog('Updated Product', `Modified details for "${updatedProduct.name}" (ID: ${id})`, 'product');
      upsertProductToSupabase(updatedProduct).catch((err) => {
        console.warn('Note: Product updated locally. Supabase update warning:', err);
      });
    }

    return { success: true };
  };

  const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered));
      return filtered;
    });

    addAuditLog('Deleted Product', `Removed "${target?.name || id}" from store catalog`, 'product');

    deleteProductFromSupabase(id).catch((err) => {
      console.warn('Note: Product removed locally. Supabase deletion warning:', err);
    });

    return { success: true };
  };

  const resetProducts = () => {
    setProducts(MOCK_PRODUCTS);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
    addAuditLog('Reset Products', 'Restored default catalog shoe products', 'product');
  };

  // Bulk sync all products to Supabase
  const syncProductsWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    let successCount = 0;
    let failCount = 0;

    for (const p of products) {
      const res = await upsertProductToSupabase(p);
      if (res.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    setIsSyncing(false);
    refreshSupabaseStatus();

    if (failCount === 0) {
      addAuditLog('Synced Products to Supabase', `Successfully uploaded ${successCount} products`, 'system');
      return { success: true, message: `Successfully synced ${successCount} products to Supabase!` };
    } else {
      return {
        success: successCount > 0,
        message: `Synced ${successCount} products (${failCount} tables pending schema creation in Supabase).`,
      };
    }
  };

  // Sync all store data (products, coupons, CMS) to Supabase tables
  const syncAllToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    let totalSynced = 0;
    try {
      for (const p of products) {
        const res = await upsertProductToSupabase(p);
        if (res.success) totalSynced++;
      }
      const cRes = await syncCouponsToSupabase(coupons);
      totalSynced += cRes.count;
      await syncCMSToSupabase(cmsData);

      addAuditLog('Full Supabase Sync', `Synchronized ${totalSynced} records to Supabase tables`, 'system');
      await refreshSupabaseStatus();
      return { success: true, message: `Successfully synchronized ${totalSynced} records to Supabase.` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Sync encountered errors' };
    } finally {
      setIsSyncing(false);
    }
  };

  // Order Records Management
  const updateOrderStatus = async (
    orderId: string,
    status: OrderRecord['status'],
    details?: { courierPartner?: string; trackingNumber?: string; notes?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.orderId === orderId || ord.id === orderId) {
          return {
            ...ord,
            status,
            courierPartner: details?.courierPartner || ord.courierPartner,
            trackingNumber: details?.trackingNumber || ord.trackingNumber,
            notes: details?.notes || ord.notes,
          };
        }
        return ord;
      });
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });

    addAuditLog(
      'Updated Order Status',
      `Order ${orderId} changed to "${status}" (Courier: ${details?.courierPartner || 'Standard'})`,
      'order'
    );

    // Update in Supabase
    updateSupabaseOrder(orderId, {
      status,
      courierPartner: details?.courierPartner,
      trackingNumber: details?.trackingNumber,
      notes: details?.notes,
    }).catch((e) => console.warn('Supabase order update note:', e));

    return { success: true };
  };

  const recordNewOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.orderId !== newOrder.orderId)];
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
    addAuditLog(
      'New Order Received',
      `Order #${newOrder.orderId} placed by ${newOrder.customerName} (₹${newOrder.totalAmount})`,
      'order'
    );
  };

  // CMS Management
  const updateCMS = (section: keyof CMSData, updates: any) => {
    setCmsData((prev) => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          ...updates,
        },
      };
      localStorage.setItem(LOCAL_CMS_KEY, JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Updated CMS', `Configured storefront section "${String(section)}"`, 'cms');
  };

  const resetCMS = () => {
    setCmsData(DEFAULT_CMS_DATA);
    localStorage.setItem(LOCAL_CMS_KEY, JSON.stringify(DEFAULT_CMS_DATA));
    addAuditLog('Reset CMS', 'Restored storefront CMS to factory settings', 'cms');
  };

  // Coupons Management
  const addCoupon = (newCoupon: PromoCoupon) => {
    setCoupons((prev) => {
      const updated = [newCoupon, ...prev.filter((c) => c.code !== newCoupon.code)];
      localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Created Coupon', `New discount code "${newCoupon.code}" created`, 'cms');
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) => {
      const updated = prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c));
      localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Toggled Coupon', `Discount code "${code}" active status updated`, 'cms');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => {
      const updated = prev.filter((c) => c.code !== code);
      localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Deleted Coupon', `Discount code "${code}" removed`, 'cms');
  };

  const validateCoupon = (
    code: string,
    currentSubtotal: number
  ): { valid: boolean; discount: number; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid promo code. Please check spelling.' };
    }

    if (!found.isActive) {
      return { valid: false, discount: 0, message: 'This promo code is currently inactive.' };
    }

    if (currentSubtotal < found.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value of ₹${found.minOrderValue.toLocaleString()} required for this coupon.`,
      };
    }

    let discount = 0;
    if (found.discountType === 'percentage') {
      discount = Math.round((currentSubtotal * found.discountValue) / 100);
    } else {
      discount = found.discountValue;
    }

    return {
      valid: true,
      discount,
      message: `Coupon "${found.code}" applied! You saved ₹${discount.toLocaleString()}`,
    };
  };

  // Customers (Aggregated from orders + known user profiles)
  const customers: Customer[] = React.useMemo(() => {
    const customerMap = new Map<string, Customer>();

    // Seed customer sahadabanjali
    customerMap.set('sahadabanjali@gmail.com', {
      id: 'cust-sahada',
      fullName: 'Sahada Banjali',
      email: 'sahadabanjali@gmail.com',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      state: 'Maharashtra',
      ordersCount: 3,
      totalSpent: 16998,
      memberTier: 'VIP Club',
      joinedDate: 'Oct 2026',
      status: 'VIP',
    });

    // Seed customer David
    customerMap.set('david.kumar@example.com', {
      id: 'cust-david',
      fullName: 'David Kumar',
      email: 'david.kumar@example.com',
      phone: '+91 91234 56789',
      city: 'Bengaluru',
      state: 'Karnataka',
      ordersCount: 2,
      totalSpent: 11997,
      memberTier: 'Gold',
      joinedDate: 'Nov 2026',
      status: 'Active',
    });

    // Aggregate from all actual orders
    orders.forEach((ord) => {
      const email = ord.email?.trim().toLowerCase();
      if (!email) return;

      const existing = customerMap.get(email);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += ord.totalAmount;
        if (existing.totalSpent > 15000) existing.status = 'VIP';
      } else {
        const parts = ord.address ? ord.address.split(',') : [];
        const city = parts[parts.length - 3]?.trim() || 'Mumbai';
        const state = parts[parts.length - 2]?.trim() || 'Maharashtra';

        customerMap.set(email, {
          id: `cust_${Math.random().toString(36).substring(2, 8)}`,
          fullName: ord.customerName || 'Shoe Enthusiast',
          email,
          phone: ord.phone || '',
          city,
          state,
          ordersCount: 1,
          totalSpent: ord.totalAmount,
          memberTier: ord.totalAmount > 10000 ? 'Gold' : 'Member',
          joinedDate: new Date(ord.createdAt).toLocaleDateString('en-IN', {
            month: 'short',
            year: 'numeric',
          }),
          status: ord.totalAmount > 15000 ? 'VIP' : 'Active',
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <StoreDataContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        syncProductsWithSupabase,
        syncAllToSupabase,
        orders,
        updateOrderStatus,
        recordNewOrder,
        refreshOrdersFromSupabase,
        cmsData,
        updateCMS,
        resetCMS,
        coupons,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        validateCoupon,
        customers,
        auditLogs,
        addAuditLog,
        supabaseStatus,
        refreshSupabaseStatus,
        isSyncing,
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return context;
};
