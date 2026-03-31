import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Heart, ShoppingCart } from 'lucide-react';

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
    <div className="min-h-screen bg-white" data-testid="product-detail-page">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategorySelect={() => navigate('/')}
        selectedCategory="all"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-[4/5] border-2 border-[#0A0A0A] overflow-hidden">
            <img
              src={product.image_url}
              alt={productName}
              className="w-full h-full object-cover"
            />
            {product.discount_percent && (
              <span className="absolute top-4 left-4 bg-[#0A0A0A] text-white text-sm font-black px-3 py-1.5">
                -{product.discount_percent}%
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#0A0A0A] uppercase mb-2">
                {productName}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#FF3B30]">
                  {product.price.toFixed(2)} ₪
                </span>
                {product.old_price && (
                  <span className="text-xl text-gray-400 line-through font-bold">
                    {product.old_price.toFixed(2)} ₪
                  </span>
                )}
              </div>
            </div>

            {productDescription && (
              <p className="text-gray-700 leading-relaxed">
                {productDescription}
              </p>
            )}

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-bold mb-2">
                {t({ ar: 'المقاس', en: 'Size' })}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 border-2 border-[#0A0A0A] font-bold transition-colors ${
                      selectedSize === size
                        ? 'bg-[#0A0A0A] text-white'
                        : 'bg-white text-[#0A0A0A] hover:bg-[#FFDE00]'
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
              <label className="block text-sm font-bold mb-2">
                {t({ ar: 'اللون', en: 'Color' })}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2 border-2 border-[#0A0A0A] font-bold transition-colors ${
                      selectedColor === color
                        ? 'bg-[#0A0A0A] text-white'
                        : 'bg-white text-[#0A0A0A] hover:bg-[#FFDE00]'
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
              <label className="block text-sm font-bold mb-2">
                {t({ ar: 'الكمية', en: 'Quantity' })}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-[#0A0A0A] font-bold hover:bg-[#FFDE00] transition-colors"
                  data-testid="quantity-decrease-btn"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center" data-testid="quantity-value">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-[#0A0A0A] font-bold hover:bg-[#FFDE00] transition-colors"
                  data-testid="quantity-increase-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#0A0A0A] text-white py-4 font-bold text-lg uppercase hover:bg-[#FFDE00] hover:text-[#0A0A0A] transition-colors border-2 border-[#0A0A0A] flex items-center justify-center gap-2"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {t({ ar: 'إضافة إلم السلة', en: 'Add to Cart' })}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`px-6 py-4 border-2 border-[#0A0A0A] transition-colors ${
                  isInWish
                    ? 'bg-[#FF3B30] text-white'
                    : 'bg-white text-[#0A0A0A] hover:bg-[#FF3B30] hover:text-white'
                }`}
                data-testid="toggle-wishlist-btn"
                aria-label="Toggle Wishlist"
              >
                <Heart className="w-6 h-6" fill={isInWish ? 'currentColor' : 'none'} />
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
