import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Trash2, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, clearCart } = useCart();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    payment_method: 'cash_on_delivery',
    notes: ''
  });

  const handleQuantityChange = (itemId, newQuantity) => {
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!orderForm.customer_name || !orderForm.customer_phone || !orderForm.customer_address) {
      alert(t({ ar: 'يرجى ملء جميع الحقول المطلوبة', en: 'Please fill in all required fields' }));
      return;
    }

    try {
      const orderData = {
        ...orderForm,
        items: cart,
        total_amount: cartTotal
      };

      await axios.post(`${API}/orders`, orderData);

      // Prepare WhatsApp message
      const message = generateWhatsAppMessage(orderData);
      const whatsappUrl = `https://wa.me/972593606672?text=${encodeURIComponent(message)}`;
      
      // Clear cart and redirect
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
    
    message += `*${t({ ar: 'المجموع الكلي', en: 'Total' })}*: ${orderData.total_amount.toFixed(2)} ₪\n\n`;
    message += `${t({ ar: 'طريقة الدفع', en: 'Payment Method' })}: ${orderData.payment_method === 'cash_on_delivery' ? t({ ar: 'دفع عند الاستلام', en: 'Cash on Delivery' }) : t({ ar: 'تحويل بنكي', en: 'Bank Transfer' })}\n`;
    
    if (orderData.notes) {
      message += `\n${t({ ar: 'ملاحظات', en: 'Notes' })}: ${orderData.notes}`;
    }
    
    return message;
  };

  return (
    <div className="min-h-screen bg-white" data-testid="checkout-page">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategorySelect={() => navigate('/')}
        selectedCategory="all"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-black text-[#0A0A0A] mb-8 uppercase">
          {t({ ar: 'سلة التسوق', en: 'Shopping Cart' })}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-cart">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-bold text-gray-600 mb-6">
              {t({ ar: 'سلة التسوق فارغة', en: 'Your cart is empty' })}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#0A0A0A] text-white px-8 py-3 font-bold uppercase hover:bg-[#FFDE00] hover:text-[#0A0A0A] transition-colors border-2 border-[#0A0A0A]"
              data-testid="continue-shopping-btn"
            >
              {t({ ar: 'متابعة التسوق', en: 'Continue Shopping' })}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 border-2 border-[#0A0A0A] p-4 bg-white"
                  data-testid={`cart-item-${item.id}`}
                >
                  <img
                    src={item.image_url}
                    alt={language === 'ar' ? item.product_name_ar : item.product_name_en}
                    className="w-24 h-24 object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {language === 'ar' ? item.product_name_ar : item.product_name_en}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t({ ar: 'المقاس', en: 'Size' })}: {item.size} | {t({ ar: 'اللون', en: 'Color' })}: {item.color}
                    </p>
                    <p className="text-lg font-black text-[#FF3B30] mt-1">
                      {item.price.toFixed(2)} ₪
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 border-2 border-[#0A0A0A] font-bold hover:bg-[#FFDE00] transition-colors"
                        data-testid={`decrease-qty-${item.id}`}
                      >
                        -
                      </button>
                      <span className="font-bold w-8 text-center" data-testid={`item-qty-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 border-2 border-[#0A0A0A] font-bold hover:bg-[#FFDE00] transition-colors"
                        data-testid={`increase-qty-${item.id}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="mr-auto text-[#FF3B30] hover:text-red-700 transition-colors"
                        data-testid={`remove-item-${item.id}`}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border-2 border-[#0A0A0A] p-6 bg-white sticky top-24">
                <h2 className="text-xl font-black mb-4 uppercase">
                  {t({ ar: 'ملخص الطلب', en: 'Order Summary' })}
                </h2>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>{t({ ar: 'عدد المنتجات', en: 'Items' })}</span>
                    <span className="font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black border-t-2 border-[#0A0A0A] pt-2">
                    <span>{t({ ar: 'المجموع', en: 'Total' })}</span>
                    <span className="text-[#FF3B30]" data-testid="cart-total">{cartTotal.toFixed(2)} ₪</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrderForm(!showOrderForm)}
                  className="w-full bg-[#0A0A0A] text-white py-3 font-bold uppercase hover:bg-[#FFDE00] hover:text-[#0A0A0A] transition-colors border-2 border-[#0A0A0A]"
                  data-testid="proceed-checkout-btn"
                >
                  {t({ ar: 'إتمام الطلب', en: 'Proceed to Checkout' })}
                </button>
              </div>

              {/* Order Form */}
              {showOrderForm && (
                <div className="border-2 border-[#0A0A0A] p-6 bg-white mt-6" data-testid="order-form">
                  <h2 className="text-xl font-black mb-4 uppercase">
                    {t({ ar: 'معلومات التوصيل', en: 'Delivery Information' })}
                  </h2>
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">
                        {t({ ar: 'الاسم *', en: 'Name *' })}
                      </label>
                      <input
                        type="text"
                        value={orderForm.customer_name}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                        className="w-full border-2 border-[#0A0A0A] px-3 py-2"
                        required
                        data-testid="customer-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">
                        {t({ ar: 'رقم الهاتف *', en: 'Phone Number *' })}
                      </label>
                      <input
                        type="tel"
                        value={orderForm.customer_phone}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                        className="w-full border-2 border-[#0A0A0A] px-3 py-2"
                        required
                        data-testid="customer-phone-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">
                        {t({ ar: 'العنوان *', en: 'Address *' })}
                      </label>
                      <textarea
                        value={orderForm.customer_address}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_address: e.target.value })}
                        className="w-full border-2 border-[#0A0A0A] px-3 py-2"
                        rows="3"
                        required
                        data-testid="customer-address-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">
                        {t({ ar: 'طريقة الدفع', en: 'Payment Method' })}
                      </label>
                      <select
                        value={orderForm.payment_method}
                        onChange={(e) => setOrderForm({ ...orderForm, payment_method: e.target.value })}
                        className="w-full border-2 border-[#0A0A0A] px-3 py-2"
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
                      <label className="block text-sm font-bold mb-1">
                        {t({ ar: 'ملاحظات', en: 'Notes' })}
                      </label>
                      <textarea
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                        className="w-full border-2 border-[#0A0A0A] px-3 py-2"
                        rows="2"
                        data-testid="order-notes-input"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#25D366] text-white py-3 font-bold uppercase hover:bg-[#1fad50] transition-colors border-2 border-[#0A0A0A]"
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
