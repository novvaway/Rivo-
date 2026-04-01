import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Heart, ShoppingBag, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex flex-col" data-testid="product-detail-page">
      {/* Top Bar: Back + Name + Heart */}
      <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100"
          data-testid="back-btn"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
        </button>
        <h2 className="text-sm font-bold text-[#0A0A0A] uppercase truncate max-w-[200px]">
          {productName}
        </h2>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            isInWish ? 'bg-red-50' : 'bg-gray-100'
          }`}
          data-testid="toggle-wishlist-btn"
        >
          <Heart className={`w-5 h-5 ${isInWish ? 'text-red-500' : 'text-gray-500'}`} fill={isInWish ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Product Image - compact */}
        <div className="relative bg-[#f2f2f2] mx-4 rounded-2xl overflow-hidden" style={{ height: '45vh', minHeight: '260px', maxHeight: '380px' }}>
          <img
            src={product.image_url}
            alt={productName}
            className="w-full h-full object-contain p-4"
            loading="lazy"
          />
          {product.discount_percent && (
            <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              {product.discount_percent}%-
            </span>
          )}
        </div>

        {/* Info Section - compact */}
        <div className="px-5 pt-4 space-y-3">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0A0A0A]">
              ₪ {product.price.toFixed(2)}
            </span>
            {product.old_price && (
              <span className="text-base text-gray-400 line-through">
                ₪ {product.old_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-lg font-bold text-[#0A0A0A] leading-tight">
            {productName}
          </h1>

          {/* Tags/Stickers */}
          {product.stickers && product.stickers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.stickers.map((sticker) => (
                <span key={sticker} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#0A0A0A] text-white">
                  {sticker}
                </span>
              ))}
              {product.in_stock && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 text-gray-600">
                  {t({ ar: 'متوفر', en: 'In Stock' })}
                </span>
              )}
            </div>
          )}

          {/* Size Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
              {t({ ar: 'المقاس', en: 'Size' })}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[40px] h-[40px] px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'bg-[#0A0A0A] text-white'
                      : 'bg-gray-100 text-gray-500'
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
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
              {t({ ar: 'اللون', en: 'Color' })}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 h-[40px] rounded-xl text-sm font-medium transition-all ${
                    selectedColor === color
                      ? 'bg-[#0A0A0A] text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  data-testid={`color-btn-${color}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          {productDescription && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {productDescription}
            </p>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar: Quantity + Add to Bag */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 z-50">
        <div className="flex items-center bg-gray-100 rounded-xl">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-12 flex items-center justify-center text-gray-600 text-lg font-medium"
            data-testid="quantity-decrease-btn"
          >-</button>
          <span className="w-8 text-center font-semibold text-sm" data-testid="quantity-value">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-12 flex items-center justify-center text-gray-600 text-lg font-medium"
            data-testid="quantity-increase-btn"
          >+</button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#0A0A0A] text-white h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          data-testid="add-to-cart-btn"
        >
          <ShoppingBag className="w-4 h-4" />
          {t({ ar: 'أضف إلى السلة', en: 'ADD TO SHOPPING BAG' })}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
