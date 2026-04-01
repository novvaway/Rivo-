import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Trash2, ShoppingBag, MapPin, Tag, Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, clearCart } = useCart();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [shippingZone, setShippingZone] = useState('');
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    payment_method: 'cash_on_delivery',
    notes: ''
  });

  const shippingZones = [
    { id: 'west_bank', name_ar: 'الضفة الغربية', name_en: 'West Bank', price: 20 },
    { id: 'inside', name_ar: 'الداخل (48)', name_en: 'Inside (48)', price: 30 },
    { id: 'jerusalem', name_ar: 'القدس', name_en: 'Jerusalem', price: 25 },
  ];

  const shippingCost = shippingZones.find(z => z.id === shippingZone)?.price || 0;

  const handleQuantityChange = (itemId, newQuantity) => {
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'RIVO10') {
      setDiscount(cartTotal * 0.1);
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      setDiscount(0);
    }
  };

  const finalTotal = cartTotal - discount + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!orderForm.customer_name || !orderForm.customer_phone || !orderForm.customer_address) {
      alert(t({ ar: 'يرجى ملء جميع الحقول المطلوبة', en: 'Please fill in all required fields' }));
      return;
    }

    if (!shippingZone) {
      alert(t({ ar: 'يرجى اختيار منطقة التوصيل', en: 'Please select a delivery zone' }));
      return;
    }

    try {
      const orderData = {
        ...orderForm,
        items: cart,
        total_amount: finalTotal
      };

      await axios.post(`${API}/orders`, orderData);

      const message = generateWhatsAppMessage(orderData);
      const whatsappUrl = `https://wa.me/972593606672?text=${encodeURIComponent(message)}`;
      
      clearCart();
      window.open(whatsappUrl, '_blank');
      
      alert(t({ 
        ar: 'تم إرسال طلبك بنجاح! سيتم فتح واتساب للتواصل', 
        en: 'Your order has been submitted successfully! WhatsApp will open to contact us' 
      }));
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(t({ ar: 'حدث خطأ. يرجى المحاولة مرة أخرى', en: 'An error occurred. Please try again' }));
    }
  };

  const generateWhatsAppMessage = (orderData) => {
    let message = `*${t({ ar: 'طلب جديد من RIVO', en: 'New Order from RIVO' })}*\n\n`;
    message += `${t({ ar: 'الاسم', en: 'Name' })}: ${orderData.customer_name}\n`;
    message += `${t({ ar: 'الهاتف', en: 'Phone' })}: ${orderData.customer_phone}\n`;
    message += `${t({ ar: 'العنوان', en: 'Address' })}: ${orderData.customer_address}\n\n`;
    
    message += `*${t({ ar: 'المنتجات', en: 'Products' })}:*\n`;
    orderData.items.forEach((item, index) => {
      const itemName = language === 'ar' ? item.product_name_ar : item.product_name_en;
      message += `${index + 1}. ${itemName}\n`;
      message += `   ${t({ ar: 'المقاس', en: 'Size' })}: ${item.size} | ${t({ ar: 'اللون', en: 'Color' })}: ${item.color} | ${t({ ar: 'الكمية', en: 'Qty' })}: ${item.quantity}\n`;
      message += `   ${t({ ar: 'السعر', en: 'Price' })}: ${(item.price * item.quantity).toFixed(2)} ₪\n\n`;
    });
    
    if (discount > 0) {
      message += `${t({ ar: 'الخصم', en: 'Discount' })}: -${discount.toFixed(2)} ₪\n`;
    }
    const selectedZone = shippingZones.find(z => z.id === shippingZone);
    if (selectedZone) {
      message += `${t({ ar: 'منطقة التوصيل', en: 'Delivery Zone' })}: ${language === 'ar' ? selectedZone.name_ar : selectedZone.name_en} (${selectedZone.price} ₪)\n`;
    }
    message += `*${t({ ar: 'المجموع الكلي', en: 'Total' })}*: ${orderData.total_amount.toFixed(2)} ₪\n\n`;
    message += `${t({ ar: 'طريقة الدفع', en: 'Payment Method' })}: ${orderData.payment_method === 'cash_on_delivery' ? t({ ar: 'دفع عند الاستلام', en: 'Cash on Delivery' }) : t({ ar: 'تحويل بنكي', en: 'Bank Transfer' })}\n`;
    
    if (orderData.notes) {
      message += `\n${t({ ar: 'ملاحظات', en: 'Notes' })}: ${orderData.notes}`;
    }
    
    return message;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]" data-testid="checkout-page">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategorySelect={() => navigate('/')}
        selectedCategory="all"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] mb-6">
          {t({ ar: 'سلة التسوق', en: 'Shopping Cart' })}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm" data-testid="empty-cart">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-200 mb-4" />
            <p className="text-lg text-gray-500 mb-6">
              {t({ ar: 'سلة التسوق فارغة', en: 'Your cart is empty' })}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#0A0A0A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#222] transition-colors"
              data-testid="continue-shopping-btn"
            >
              {t({ ar: 'متابعة التسوق', en: 'Continue Shopping' })}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 bg-white rounded-2xl p-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
                  data-testid={`cart-item-${item.id}`}
                >
                  {/* Product Image - left side, gray background */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#f0f0f0] rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.image_url}
                      alt={language === 'ar' ? item.product_name_ar : item.product_name_en}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Middle - name, details, price */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[#0A0A0A] text-sm sm:text-base truncate">
                        {language === 'ar' ? item.product_name_ar : item.product_name_en}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#0A0A0A] text-base">
                        ₪ {(item.price * item.quantity).toFixed(2)}
                      </span>
                      {/* Quantity controls + delete */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#0A0A0A] rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-white text-sm font-medium hover:bg-[#222] transition-colors"
                            data-testid={`decrease-qty-${item.id}`}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-white text-sm font-semibold" data-testid={`item-qty-${item.id}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-white text-sm font-medium hover:bg-[#222] transition-colors"
                            data-testid={`increase-qty-${item.id}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                          data-testid={`remove-item-${item.id}`}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1 space-y-4">
              {/* Shipping Zone Selector */}
              <div className="bg-white rounded-2xl p-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#0A0A0A]" />
                  <span className="text-sm font-semibold text-[#0A0A0A]">{t({ ar: 'منطقة التوصيل', en: 'Delivery Zone' })}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{t({ ar: 'توصيل لجميع المناطق - اختر منطقتك', en: 'Delivery to all areas - choose your zone' })}</p>
                <div className="space-y-2">
                  {shippingZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setShippingZone(zone.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                        shippingZone === zone.id
                          ? 'bg-[#0A0A0A] text-white'
                          : 'bg-[#f5f5f5] text-[#333] hover:bg-[#eee]'
                      }`}
                      data-testid={`shipping-zone-${zone.id}`}
                    >
                      <span className="font-medium">{language === 'ar' ? zone.name_ar : zone.name_en}</span>
                      <span className={`font-bold ${shippingZone === zone.id ? 'text-white' : 'text-[#0A0A0A]'}`}>
                        ₪ {zone.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-white rounded-2xl p-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">{t({ ar: 'كود الخصم', en: 'Coupon Code' })}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t({ ar: 'أدخل الكود', en: 'Enter code' })}
                    className="flex-1 border border-[#0A0A0A] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0A0A0A]"
                    data-testid="coupon-input"
                    disabled={couponApplied}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      couponApplied
                        ? 'bg-gray-100 text-[#0A0A0A]'
                        : 'bg-[#0A0A0A] text-white hover:bg-[#222]'
                    }`}
                    data-testid="apply-coupon-btn"
                    disabled={couponApplied}
                  >
                    {couponApplied ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Applied
                      </span>
                    ) : (
                      t({ ar: 'تطبيق', en: 'Apply' })
                    )}
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_1px_8px_rgba(0,0,0,0.06)] sticky top-24">
                <h2 className="text-lg font-bold text-[#0A0A0A] mb-4">
                  {t({ ar: 'ملخص الطلب', en: 'Order Summary' })}
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{t({ ar: 'المجموع الفرعي', en: 'Subtotal' })} ({cart.reduce((s, i) => s + i.quantity, 0)} {t({ ar: 'منتج', en: 'items' })})</span>
                    <span className="font-medium text-[#0A0A0A]">₪ {cartTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#8B0000]">
                      <span>{t({ ar: 'الخصم', en: 'Discount' })}</span>
                      <span className="font-medium">- ₪ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>{t({ ar: 'الشحن', en: 'Shipping' })}</span>
                    <span className="font-medium text-[#0A0A0A]">
                      {shippingZone 
                        ? `₪ ${shippingCost.toFixed(2)}` 
                        : t({ ar: 'اختر المنطقة', en: 'Select zone' })
                      }
                    </span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between pt-1">
                    <span className="text-base font-bold text-[#0A0A0A]">{t({ ar: 'الإجمالي', en: 'Total' })}</span>
                    <span className="text-xl font-bold text-[#0A0A0A]" data-testid="cart-total">₪ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowOrderForm(!showOrderForm)}
                  className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-2xl font-bold text-base mt-5 hover:bg-[#222] transition-colors"
                  data-testid="proceed-checkout-btn"
                >
                  {t({ ar: 'إتمام الشراء', en: 'CHECKOUT' })}
                </button>
              </div>

              {/* Order Form */}
              {showOrderForm && (
                <div className="bg-white rounded-2xl p-5 shadow-[0_1px_8px_rgba(0,0,0,0.06)]" data-testid="order-form">
                  <h2 className="text-lg font-bold text-[#0A0A0A] mb-4">
                    {t({ ar: 'معلومات التوصيل', en: 'Delivery Information' })}
                  </h2>
                  <form onSubmit={handleSubmitOrder} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {t({ ar: 'الاسم *', en: 'Name *' })}
                      </label>
                      <input
                        type="text"
                        value={orderForm.customer_name}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A] transition-colors"
                        required
                        data-testid="customer-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {t({ ar: 'رقم الهاتف *', en: 'Phone Number *' })}
                      </label>
                      <input
                        type="tel"
                        value={orderForm.customer_phone}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A] transition-colors"
                        required
                        data-testid="customer-phone-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {t({ ar: 'العنوان *', en: 'Address *' })}
                      </label>
                      <textarea
                        value={orderForm.customer_address}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_address: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A] transition-colors"
                        rows="2"
                        required
                        data-testid="customer-address-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {t({ ar: 'طريقة الدفع', en: 'Payment Method' })}
                      </label>
                      <select
                        value={orderForm.payment_method}
                        onChange={(e) => setOrderForm({ ...orderForm, payment_method: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A] transition-colors"
                        data-testid="payment-method-select"
                      >
                        <option value="cash_on_delivery">
                          {t({ ar: 'دفع عند الاستلام', en: 'Cash on Delivery' })}
                        </option>
                        <option value="bank_transfer">
                          {t({ ar: 'تحويل بنكي', en: 'Bank Transfer' })}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {t({ ar: 'ملاحظات', en: 'Notes' })}
                      </label>
                      <textarea
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A] transition-colors"
                        rows="2"
                        data-testid="order-notes-input"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-2xl font-bold text-base hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
                      data-testid="submit-order-btn"
                    >
                      {t({ ar: 'إرسال الطلب عبر واتساب', en: 'Send Order via WhatsApp' })}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
