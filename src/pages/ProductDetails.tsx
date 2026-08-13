import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { SizeSelector } from '../components/product/SizeSelector';
import { ColorSelector } from '../components/product/ColorSelector';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { PriceDisplay } from '../components/common/PriceDisplay';
import { RatingStars } from '../components/common/RatingStars';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';
import { ProductDetailsSkeleton } from '../components/common/LoadingSkeleton';
import { Heart, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, Check, Sparkles } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    // Simulate realistic product lookup
    const found = MOCK_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    if (found) {
      setProduct(found);
      setSelectedSize(null);
      setSelectedColor(found.colors[0]?.name || null);
      setQuantity(1);
      setSizeError(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(false);
  }, [slug]);

  if (loading) return <ProductDetailsSkeleton />;

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <h2 className="text-2xl font-extrabold text-[#111111]">Product Not Found</h2>
        <p className="text-sm text-[#777777] my-3">
          The shoe style you are looking for is no longer available or URL is invalid.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-[#E53935]"
        >
          Return to Footwear Store
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    const added = addToCart(product, selectedSize, selectedColor, quantity);
    if (added) {
      navigate('/checkout');
    }
  };

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="py-8 bg-[#F7F7F7]/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#777777] font-medium mb-6">
          <Link to="/" className="hover:text-[#111111]">
            Home
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#111111] capitalize">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs">
          {/* Left: Product Image Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Meta & Purchase Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-[#111111] text-white text-[10px] font-extrabold uppercase rounded-md tracking-wider">
                  {product.brand}
                </span>
                {product.isBestSeller && (
                  <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-extrabold uppercase rounded-md tracking-wider">
                    BEST SELLER
                  </span>
                )}
                {product.isNew && (
                  <span className="px-2.5 py-0.5 bg-[#E53935] text-white text-[10px] font-extrabold uppercase rounded-md tracking-wider">
                    NEW RELEASE
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-2">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  In Stock ({product.stock} available)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5]">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                size="xl"
              />
              <p className="text-[11px] text-[#777777] font-bold mt-1">
                Inclusive of all taxes. Free shipping on orders above ₹1,999.
              </p>
            </div>

            {/* Color Swatches */}
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={(col) => setSelectedColor(col)}
            />

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={(s) => {
                setSelectedSize(s);
                setSizeError(false);
              }}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              error={sizeError}
            />

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#111111] block">
                Quantity:
              </label>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                maxStock={product.stock}
                size="md"
              />
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-4 px-6 bg-[#111111] hover:bg-[#E53935] text-white text-sm font-extrabold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-4 px-6 bg-[#E53935] hover:bg-red-700 text-white text-sm font-extrabold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-2 border ${
                inWishlist
                  ? 'bg-red-50 text-[#E53935] border-red-200'
                  : 'bg-white text-[#222222] border-[#E5E5E5] hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#E53935]' : ''}`} />
              <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E5E5E5] text-center text-[11px] font-bold text-[#777777]">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#F7F7F7]">
                <Truck className="w-4 h-4 text-[#E53935]" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#F7F7F7]">
                <RotateCcw className="w-4 h-4 text-[#E53935]" />
                <span>15-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#F7F7F7]">
                <ShieldCheck className="w-4 h-4 text-[#E53935]" />
                <span>100% Authentic Product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xs">
          {/* Tabs Bar */}
          <div className="flex items-center gap-4 sm:gap-8 border-b border-[#E5E5E5] pb-3 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-sm font-extrabold pb-2 transition-colors relative ${
                activeTab === 'description' ? 'text-[#111111]' : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Description
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E53935]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`text-sm font-extrabold pb-2 transition-colors relative ${
                activeTab === 'details' ? 'text-[#111111]' : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Specifications
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E53935]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-extrabold pb-2 transition-colors relative ${
                activeTab === 'reviews' ? 'text-[#111111]' : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Reviews ({product.reviewCount})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E53935]" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="space-y-4 text-sm text-[#222222] leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              <p>
                Crafted specifically for modern lifestyles, this pair delivers responsive cushioning, superior traction on urban surfaces, and high durability.
              </p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#777777]">Brand</span>
                <span className="font-bold text-[#111111]">{product.details.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#777777]">Upper Material</span>
                <span className="font-bold text-[#111111]">{product.details.material}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#777777]">Sole Material</span>
                <span className="font-bold text-[#111111]">{product.details.sole}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#777777]">Closure Type</span>
                <span className="font-bold text-[#111111]">{product.details.closure}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#777777]">Ideal For</span>
                <span className="font-bold text-[#111111]">{product.gender}</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4 bg-[#F7F7F7] p-4 rounded-2xl border border-[#E5E5E5]">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#111111]">{product.rating}</p>
                  <RatingStars rating={product.rating} showNumber={false} size="sm" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111111]">Customer Satisfaction Rating</p>
                  <p className="text-xs text-[#777777]">Based on {product.reviewCount} verified purchases</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl sm:text-3xl font-black text-[#111111] mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
