import React, { useState, useMemo, useRef } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { Product, Brand, CategorySlug, Gender } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  UploadCloud,
  Download,
  Star,
  Sparkles,
  AlertCircle,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  Tag,
  PackageCheck,
  ChevronDown,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const BRANDS: Brand[] = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'New Balance', 'Daily Walk'];
const CATEGORIES: { slug: CategorySlug; name: string }[] = [
  { slug: 'sneakers', name: 'Sneakers' },
  { slug: 'running', name: 'Running' },
  { slug: 'sports', name: 'Sports' },
  { slug: 'casual', name: 'Casual' },
  { slug: 'formal', name: 'Formal' },
  { slug: 'boots', name: 'Boots' },
  { slug: 'sandals', name: 'Sandals' },
  { slug: 'kids', name: 'Kids' },
];
const GENDERS: Gender[] = ['Men', 'Women', 'Kids', 'Unisex'];

const AVAILABLE_SIZES = [5, 6, 7, 8, 9, 10, 11, 12];

export const STOCK_IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
];

/**
 * Safely cleans and normalizes an image URL entered by the user.
 * Preserves query params and commas within URLs, strips wrappers and adds protocol if needed.
 */
export function normalizeImageUrl(input: string): string {
  if (!input) return '';
  let str = input.trim();
  // Strip enclosing quotes, brackets, or angle brackets
  str = str.replace(/^["'`<(\[]+|["'`>)\]]+$/g, '');
  // Extract URL from markdown format ![alt](url) or HTML tags if pasted
  const urlMatch = str.match(/https?:\/\/[^\s"'<>)]+/i);
  if (urlMatch) {
    str = urlMatch[0];
  } else if (/^\/\//.test(str)) {
    str = 'https:' + str;
  } else if (/^www\./i.test(str)) {
    str = 'https://' + str;
  }
  return str;
}

/**
 * Safely parses multiple image URLs strictly line-by-line (\n),
 * ensuring commas inside URL query parameters (e.g., w=1000,q=80) are never split or ruined.
 */
export function parseImageUrls(rawText: string): string[] {
  if (!rawText) return [];
  const lines = rawText.split(/\r?\n/);
  const result: string[] = [];
  for (const line of lines) {
    const cleaned = normalizeImageUrl(line);
    if (cleaned && (cleaned.startsWith('http') || cleaned.startsWith('/') || cleaned.startsWith('data:image'))) {
      result.push(cleaned);
    }
  }
  return result;
}

export const AdminProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts, syncProductsWithSupabase, isSyncing } =
    useStoreData();
  const { showToast } = useToast();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // New Image Input & Live Preview State
  const [urlInput, setUrlInput] = useState('');
  const [urlPreviewState, setUrlPreviewState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [showBulkImageEditor, setShowBulkImageEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    brand: Brand;
    category: CategorySlug;
    gender: Gender;
    price: number;
    originalPrice: number;
    discount: number;
    stock: number;
    description: string;
    material: string;
    sole: string;
    closure: string;
    images: string[];
    selectedSizes: number[];
    isFeatured: boolean;
    isBestSeller: boolean;
    isNew: boolean;
    isSale: boolean;
    tagsText: string;
    primaryColorName: string;
    primaryColorHex: string;
  }>({
    name: '',
    brand: 'Daily Walk',
    category: 'sneakers',
    gender: 'Men',
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    stock: 25,
    description: 'Engineered for exceptional daily comfort, responsive cushioning, and durable traction.',
    material: 'Breathable Mesh & Synthetic',
    sole: 'Durable Anti-Slip Rubber',
    closure: 'Lace-Up',
    images: [STOCK_IMAGE_PRESETS[0]],
    selectedSizes: [6, 7, 8, 9, 10],
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    isSale: false,
    tagsText: 'daily, walking, lightweight, breathable',
    primaryColorName: 'Core Black',
    primaryColorHex: '#111111',
  });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (selectedGender !== 'all' && p.gender !== selectedGender) return false;

      if (stockFilter === 'in_stock' && p.stock <= 0) return false;
      if (stockFilter === 'low_stock' && (p.stock >= 10 || p.stock === 0)) return false;
      if (stockFilter === 'out_of_stock' && p.stock > 0) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedGender, stockFilter]);

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setUrlInput('');
    setUrlPreviewState('idle');
    setShowBulkImageEditor(false);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      gender: p.gender,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      stock: p.stock,
      description: p.description,
      material: p.details?.material || 'Synthetic & Mesh',
      sole: p.details?.sole || 'Rubber',
      closure: p.details?.closure || 'Lace-Up',
      images: p.images && p.images.length > 0 ? [...p.images] : [STOCK_IMAGE_PRESETS[0]],
      selectedSizes: p.sizes || [7, 8, 9, 10],
      isFeatured: Boolean(p.isFeatured),
      isBestSeller: Boolean(p.isBestSeller),
      isNew: Boolean(p.isNew),
      isSale: Boolean(p.isSale),
      tagsText: (p.tags || []).join(', '),
      primaryColorName: p.colors?.[0]?.name || 'Classic Black',
      primaryColorHex: p.colors?.[0]?.hex || '#000000',
    });
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setUrlInput('');
    setUrlPreviewState('idle');
    setShowBulkImageEditor(false);
    setFormData({
      name: '',
      brand: 'Daily Walk',
      category: 'sneakers',
      gender: 'Men',
      price: 3499,
      originalPrice: 4499,
      discount: 22,
      stock: 30,
      description: 'Crafted with premium materials for unmatched step-in comfort and all-day stability.',
      material: 'Engineered Knit & Leather Accents',
      sole: 'High-Grip Traction Outsole',
      closure: 'Lace-Up',
      images: [STOCK_IMAGE_PRESETS[Math.floor(Math.random() * STOCK_IMAGE_PRESETS.length)]],
      selectedSizes: [6, 7, 8, 9, 10, 11],
      isFeatured: true,
      isBestSeller: false,
      isNew: true,
      isSale: false,
      tagsText: 'new, comfort, footwear',
      primaryColorName: 'Core Black',
      primaryColorHex: '#111111',
    });
    setIsAddModalOpen(true);
  };

  // Add an image URL to current product images
  const handleAddImageUrl = (urlToAdd?: string) => {
    const raw = urlToAdd || urlInput;
    const cleaned = normalizeImageUrl(raw);
    if (!cleaned) {
      showToast('Invalid URL', 'Please enter a valid image address.', 'error');
      return;
    }

    if (!cleaned.startsWith('http') && !cleaned.startsWith('/') && !cleaned.startsWith('data:image')) {
      showToast('Invalid URL', 'Image link must start with http:// or https://', 'error');
      return;
    }

    // Check if duplicate
    if (formData.images.includes(cleaned)) {
      showToast('Already Added', 'This image is already in the product gallery.', 'info');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, cleaned],
    }));

    setUrlInput('');
    setUrlPreviewState('idle');
    showToast('Image Added', 'Image URL successfully attached to product.', 'success');
  };

  // Remove an image from gallery
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const remaining = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: remaining.length > 0 ? remaining : [STOCK_IMAGE_PRESETS[0]],
      };
    });
    showToast('Image Removed', 'Removed photo from product.', 'info');
  };

  // Set selected image as the primary cover photo
  const handleSetPrimaryCover = (indexToPromote: number) => {
    if (indexToPromote === 0) return;
    setFormData((prev) => {
      const chosen = prev.images[indexToPromote];
      const others = prev.images.filter((_, idx) => idx !== indexToPromote);
      return {
        ...prev,
        images: [chosen, ...others],
      };
    });
    showToast('Primary Cover Updated', 'Image set as main store display photo.', 'success');
  };

  // Upload local image file from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select an image file (PNG, JPG, WebP, SVG).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, dataUrl],
        }));
        showToast('Image Uploaded', `Uploaded "${file.name}" to gallery.`, 'success');
      }
    };
    reader.onerror = () => {
      showToast('Upload Failed', 'Failed to read the local image file.', 'error');
    };
    reader.readAsDataURL(file);

    if (e.target) {
      e.target.value = '';
    }
  };

  // Submit Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Validation Error', 'Product title is required', 'error');
      return;
    }

    // Sanitize every image URL without chopping parameters or commas
    const cleanedImages = (formData.images || [])
      .map((u) => normalizeImageUrl(u))
      .filter((u) => u.startsWith('http') || u.startsWith('/') || u.startsWith('data:image'));

    const finalImages = cleanedImages.length > 0 ? cleanedImages : [STOCK_IMAGE_PRESETS[0]];

    const tagsList = formData.tagsText
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const categoryObj = CATEGORIES.find((c) => c.slug === formData.category);

    const payload = {
      name: formData.name.trim(),
      slug: formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      brand: formData.brand,
      category: formData.category,
      categoryName: categoryObj?.name || 'Footwear',
      gender: formData.gender,
      description: formData.description.trim(),
      details: {
        material: formData.material.trim(),
        sole: formData.sole.trim(),
        closure: formData.closure.trim(),
        type: `${formData.gender} ${categoryObj?.name || 'Footwear'}`,
        gender: formData.gender,
      },
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      discount: Number(formData.discount),
      stock: Number(formData.stock),
      images: finalImages,
      sizes: formData.selectedSizes.length > 0 ? formData.selectedSizes : [7, 8, 9],
      colors: [
        {
          name: formData.primaryColorName || 'Core Black',
          hex: formData.primaryColorHex || '#111111',
        },
      ],
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isNew: formData.isNew,
      isSale: formData.isSale,
      tags: tagsList,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
      showToast('Product Updated', `"${payload.name}" updated successfully`, 'success');
      setEditingProduct(null);
    } else {
      await addProduct(payload);
      showToast('Product Created', `"${payload.name}" added to catalog`, 'success');
      setIsAddModalOpen(false);
    }
  };

  // Delete product confirmation
  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    await deleteProduct(deletingProductId);
    showToast('Product Deleted', 'Product removed from store catalog', 'info');
    setDeletingProductId(null);
  };

  // Sync to Supabase trigger
  const handleSyncSupabase = async () => {
    showToast('Syncing with Supabase', 'Pushing products to project cbbsbwzpuhhzuhzknrin...', 'info');
    const res = await syncProductsWithSupabase();
    if (res.success) {
      showToast('Supabase Sync Success', res.message, 'success');
    } else {
      showToast('Supabase Notice', res.message, 'warning');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Brand', 'Category', 'Gender', 'Price', 'Original Price', 'Stock', 'Sizes'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.brand,
      p.category,
      p.gender,
      p.price,
      p.originalPrice,
      p.stock,
      `"${(p.sizes || []).join(';')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daily_walk_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Catalog Exported', 'Downloaded products CSV file', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Product Catalog Management</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Add, edit, inspect stock, and sync footwear models with Supabase table <code className="text-gray-700">products</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncSupabase}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
            title="Push all products to Supabase project cbbsbwzpuhhzuhzknrin"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'Syncing...' : 'Sync to Supabase'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white hover:bg-[#E53935] rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Query */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shoe name, brand, or tag..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">All Brands</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock (&gt;0)</option>
              <option value="low_stock">Low Stock (&lt;10)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Results count & reset filters */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> of{' '}
            {products.length} footwear models
          </div>
          {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || stockFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBrand('all');
                setStockFilter('all');
              }}
              className="text-xs text-[#E53935] hover:underline font-bold"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-3 font-semibold">Brand & Cat</th>
                <th className="py-3 px-3 font-semibold">Gender</th>
                <th className="py-3 px-3 font-semibold">Price</th>
                <th className="py-3 px-3 font-semibold">Discount</th>
                <th className="py-3 px-3 font-semibold">Stock</th>
                <th className="py-3 px-3 font-semibold">Badges</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <p className="font-bold text-sm text-gray-600">No products found</p>
                    <p className="text-xs mt-1">Try modifying your search criteria or add a new shoe.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Product Title & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images && p.images[0] ? p.images[0] : STOCK_IMAGE_PRESETS[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.failed) {
                              target.dataset.failed = 'true';
                              target.src = STOCK_IMAGE_PRESETS[0];
                            }
                          }}
                        />
                        <div className="min-w-0 max-w-[200px]">
                          <div className="font-black text-gray-900 truncate">{p.name}</div>
                          <div className="text-[11px] text-gray-400 font-medium truncate">SKU: {p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Brand & Category */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-800">{p.brand}</div>
                      <div className="text-[11px] text-gray-500 font-medium">{p.categoryName || p.category}</div>
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-3 text-gray-700 font-medium">{p.gender}</td>

                    {/* Price */}
                    <td className="py-3 px-3">
                      <div className="font-black text-gray-900">₹{p.price.toLocaleString()}</div>
                      {p.originalPrice > p.price && (
                        <div className="text-[11px] text-gray-400 line-through font-medium">
                          ₹{p.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-3">
                      {p.discount > 0 ? (
                        <span className="text-emerald-700 font-bold">{p.discount}% OFF</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Stock Control */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })}
                          className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <span
                          className={`min-w-[24px] text-center font-black ${
                            p.stock === 0 ? 'text-red-600' : p.stock < 10 ? 'text-amber-600' : 'text-gray-900'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProduct(p.id, { stock: p.stock + 1 })}
                          className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Badges toggles */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateProduct(p.id, { isFeatured: !p.isFeatured })}
                          className={`p-1 rounded transition-colors ${
                            p.isFeatured ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-500'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          onClick={() => updateProduct(p.id, { isBestSeller: !p.isBestSeller })}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            p.isBestSeller ? 'bg-orange-50 text-orange-700' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Toggle Best Seller"
                        >
                          Best
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View in storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {editingProduct ? 'Edit Shoe Product' : 'Add New Shoe to Catalog'}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {editingProduct
                    ? `Updating ${editingProduct.name} (ID: ${editingProduct.id})`
                    : 'Fill details to add shoes to storefront and Supabase database'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nike Air Zoom Pegasus 40"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Brand, Category, Gender Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Brand</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value as Brand })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategorySlug })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const orig = formData.originalPrice || p;
                      const disc = orig > p ? Math.round(((orig - p) / orig) * 100) : 0;
                      setFormData({ ...formData, price: p, discount: disc });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.originalPrice}
                    onChange={(e) => {
                      const orig = Number(e.target.value);
                      const disc = orig > formData.price ? Math.round(((orig - formData.price) / orig) * 100) : 0;
                      setFormData({ ...formData, originalPrice: orig, discount: disc });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white"
                />
              </div>

              {/* Specifications: Material, Sole, Closure */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Upper Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Sole Type</label>
                  <input
                    type="text"
                    value={formData.sole}
                    onChange={(e) => setFormData({ ...formData, sole: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Closure</label>
                  <input
                    type="text"
                    value={formData.closure}
                    onChange={(e) => setFormData({ ...formData, closure: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* Shoe Sizes Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Available UK Sizes (click to toggle)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((sz) => {
                    const active = formData.selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            selectedSizes: active
                              ? formData.selectedSizes.filter((s) => s !== sz)
                              : [...formData.selectedSizes, sz].sort((a, b) => a - b),
                          });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold border transition-colors ${
                          active
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Imagery & Gallery Management */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                  <div>
                    <label className="block text-xs font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-gray-700" />
                      <span>Product Images ({formData.images.length})</span>
                    </label>
                    <p className="text-[11px] text-gray-500 font-medium">
                      The first photo is the <strong>Primary Cover</strong> shown on store cards and search results.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-400 text-gray-800 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload from Device</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBulkImageEditor(!showBulkImageEditor)}
                      className="text-[11px] text-gray-600 hover:text-gray-900 font-bold underline"
                    >
                      {showBulkImageEditor ? 'Hide Bulk URLs' : 'Bulk Edit URLs'}
                    </button>
                  </div>
                </div>

                {/* Method 1: Add Image by URL with Live Test Preview */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-700">
                    Add Image by URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUrlInput(val);
                          setUrlPreviewState(val.trim() ? 'idle' : 'idle');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/... or www...)"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-gray-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl()}
                      disabled={!urlInput.trim()}
                      className="px-4 py-2 bg-[#111111] text-white hover:bg-[#E53935] disabled:opacity-40 disabled:hover:bg-[#111111] rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add URL</span>
                    </button>
                  </div>

                  {/* Live URL Preview Test Box */}
                  {urlInput.trim() && (
                    <div className="p-2.5 bg-white rounded-xl border border-gray-200 flex items-center gap-3 animate-fade-in">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={normalizeImageUrl(urlInput)}
                          alt="URL Live Preview"
                          className="w-full h-full object-contain"
                          onLoad={() => setUrlPreviewState('valid')}
                          onError={() => setUrlPreviewState('invalid')}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold truncate text-gray-900 font-mono">
                          {normalizeImageUrl(urlInput)}
                        </div>
                        {urlPreviewState === 'valid' && (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valid Image URL — Ready to Add</span>
                          </div>
                        )}
                        {urlPreviewState === 'invalid' && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Preview Warning: Link cannot be loaded directly (may be blocked or non-image)</span>
                          </div>
                        )}
                        {urlPreviewState === 'idle' && (
                          <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                            Testing URL connection...
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddImageUrl()}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shrink-0"
                      >
                        Confirm &amp; Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Bulk Textarea Editor (If Toggled) */}
                {showBulkImageEditor && (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                      <span>Multi-Line Image URLs Editor</span>
                      <span className="text-[10px] text-gray-400 font-normal">One URL per line (commas in URLs are preserved)</span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.images.join('\n')}
                      onChange={(e) => {
                        const parsed = parseImageUrls(e.target.value);
                        setFormData({
                          ...formData,
                          images: parsed.length > 0 ? parsed : [STOCK_IMAGE_PRESETS[0]],
                        });
                      }}
                      placeholder="https://...&#10;https://..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:bg-white"
                    />
                  </div>
                )}

                {/* Current Images Gallery Cards */}
                <div>
                  <div className="text-[11px] font-bold text-gray-600 mb-2 flex items-center justify-between">
                    <span>Attached Photos ({formData.images.length})</span>
                    <span className="text-[10px] text-gray-400 font-normal">Click "Make Cover" to set the primary store image</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`group relative bg-white rounded-xl border p-2 flex flex-col justify-between transition-all ${
                          idx === 0
                            ? 'border-gray-900 shadow-xs ring-1 ring-gray-900/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Cover Badge */}
                        <div className="flex items-center justify-between mb-1.5">
                          {idx === 0 ? (
                            <span className="px-1.5 py-0.5 bg-gray-900 text-white text-[9px] font-black rounded uppercase tracking-wider">
                              ★ Cover
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400">
                              #{idx + 1}
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <a
                              href={imgUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-gray-700 p-0.5"
                              title="Open image in new tab"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-gray-400 hover:text-red-600 p-0.5"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Thumbnail */}
                        <div className="aspect-square w-full rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center p-1.5 border border-gray-100">
                          <img
                            src={imgUrl}
                            alt={`Product preview ${idx + 1}`}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.failed) {
                                target.dataset.failed = 'true';
                                target.src = STOCK_IMAGE_PRESETS[0];
                              }
                            }}
                          />
                        </div>

                        {/* Set as Cover button if not primary */}
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryCover(idx)}
                            className="mt-2 w-full py-1 text-[10px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Footwear Presets (One-click add) */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-[11px] font-bold text-gray-600 mb-2 flex items-center justify-between">
                    <span>Quick Footwear Presets (Click to add high-res styles):</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {STOCK_IMAGE_PRESETS.map((presetUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddImageUrl(presetUrl)}
                        className="aspect-square bg-white rounded-xl border border-gray-200 hover:border-[#111111] hover:shadow-xs p-1 flex items-center justify-center group transition-all relative overflow-hidden"
                        title={`Add Preset Style #${i + 1}`}
                      >
                        <img
                          src={presetUrl}
                          alt={`Preset #${i + 1}`}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-gray-900/80 text-[8px] text-white font-bold text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          + Add
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles for Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-gray-900"
                  />
                  <span>Featured Shoe</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 rounded text-gray-900"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 rounded text-gray-900"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSale}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="w-4 h-4 rounded text-gray-900"
                  />
                  <span>Special Sale</span>
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Shoe Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-gray-200 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Delete Product?</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Are you sure you want to remove this footwear model from the catalog and Supabase database?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
