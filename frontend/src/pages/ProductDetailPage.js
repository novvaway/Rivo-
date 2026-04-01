import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Heart, ShoppingBag, Star, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      setSelectedSize(response.data.sizes[0]);
      setSelectedColor(response.data.colors[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert(t({ ar: 'يرجى اختيار المقاس واللون', en: 'Please select size and color' }));
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      product_id: product.id,
      product_name_ar: product.name_ar,
      product_name_en: product.name_en,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: product.price,
      image_url: product.image_url
    };

    addToCart(cartItem);
    alert(t({ ar: 'تم إضافة المنتج إلى السلة', en: 'Product added to cart' }));
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert(t({ ar: 'يرجى اختيار المقاس واللون', en: 'Please select size and color' }));
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      product_id: product.id,
      product_name_ar: product.name_ar,
      product_name_en: product.name_en,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: product.price,
      image_url: product.image_url
    };

    addToCart(cartItem);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl font-bold">{t({ ar: 'جاري التحميل...', en: 'Loading...' })}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl font-bold">{t({ ar: 'لم يتم العثور على المنتج', en: 'Product not found' })}</div>
        </div>
        <Footer />
      </div>
    );
  }

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productDescription = language === 'ar' ? product.description_ar : product.description_en;
  const isInWish = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-[#fafafa]" data-testid="product-detail-page">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategorySelect={() => navigate('/')}
        selectedCategory="all"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-gray-400 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-gray-700 transition-colors">
            {t({ ar: 'الرئيسية', en: 'Home' })}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-600">{productName}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          
          {/* Product Image - Open, no box */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main image - floating on white */}
              <div className="relative bg-white rounded-3xl p-6 flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={productName}
                  className="w-full max-h-[480px] object-contain"
                  loading="lazy"
                />
                {/* 3D oval shadow under product */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/5 rounded-[50%] blur-md" />
              </div>

              {/* Discount badge */}
              {product.discount_percent && (
                <span className="absolute top-4 left-4 bg-black/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {product.discount_percent}%-
                </span>
              )}

              {/* Heart */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isInWish 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/90 text-gray-400 hover:text-red-500 shadow-sm'
                }`}
                data-testid="toggle-wishlist-btn"
                aria-label="Toggle Wishlist"
              >
                <Heart className="w-5 h-5" fill={isInWish ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3">
                {productName}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">
                  ₪ {product.price.toFixed(2)}
                </span>
                {product.old_price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₪ {product.old_price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Status bar - stock & rating */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>4.8</span>
              </div>
              <span className="w-px h-4 bg-gray-200" />
              <span>
                {product.in_stock 
                  ? t({ ar: 'متوفر في المخزون', en: 'In Stock' })
                  : t({ ar: 'غير متوفر', en: 'Out of Stock' })
                }
              </span>
              {product.stickers && product.stickers.length > 0 && (
                <>
                  <span className="w-px h-4 bg-gray-200" />
                  <span>{product.stickers.join(' / ')}</span>
                </>
              )}
            </div>

            {productDescription && (
              <p className="text-gray-600 leading-relaxed text-sm">
                {productDescription}
              </p>
            )}

            <hr className="border-gray-100" />

            {/* Size Selection - rounded pills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t({ ar: 'المقاس', en: 'Size' })}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-[44px] px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-[#0A0A0A] text-white shadow-md'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    data-testid={`size-btn-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t({ ar: 'اللون', en: 'Color' })}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 h-[44px] rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedColor === color
                        ? 'bg-[#0A0A0A] text-white shadow-md'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    data-testid={`color-btn-${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t({ ar: 'الكمية', en: 'Quantity' })}
              </label>
              <div className="flex items-center bg-gray-100 rounded-xl w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-black transition-colors text-lg font-medium"
                  data-testid="quantity-decrease-btn"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-[#0A0A0A]" data-testid="quantity-value">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-black transition-colors text-lg font-medium"
                  data-testid="quantity-increase-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2">
              {/* Cart Icon - Outlined */}
              <button
                onClick={handleAddToCart}
                className="w-14 h-14 flex items-center justify-center border-2 border-[#0A0A0A] rounded-2xl text-[#0A0A0A] hover:bg-gray-50 transition-colors shrink-0"
                data-testid="add-to-cart-btn"
                aria-label="Add to Cart"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>

              {/* Buy Now - Primary CTA */}
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#0A0A0A] text-white h-14 rounded-2xl font-bold text-base hover:bg-[#222] transition-colors"
                data-testid="buy-now-btn"
              >
                {t({ ar: 'اشتري الآن', en: 'Buy Now' })}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
