import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Plus, Edit, Trash2, LogOut, X, Upload } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    category: 'HOODIES',
    price: '',
    old_price: '',
    image_url: '',
    description_ar: '',
    description_en: '',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['أسود', 'أبيض', 'رمادي'],
    stickers: [],
    in_stock: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/products`, {
        withCredentials: true
      });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/admin/upload-image`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setFormData(prev => ({ ...prev, image_url: data.image_url }));
    } catch (error) {
      alert('فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      old_price: formData.old_price ? parseFloat(formData.old_price) : null
    };

    try {
      if (editingProduct) {
        await axios.put(
          `${BACKEND_URL}/api/admin/products/${editingProduct.id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${BACKEND_URL}/api/admin/products`,
          payload,
          { withCredentials: true }
        );
      }
      
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.detail || 'حدث خطأ');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name_ar: product.name_ar,
      name_en: product.name_en,
      category: product.category,
      price: product.price.toString(),
      old_price: product.old_price ? product.old_price.toString() : '',
      image_url: product.image_url,
      description_ar: product.description_ar || '',
      description_en: product.description_en || '',
      sizes: product.sizes,
      colors: product.colors,
      stickers: product.stickers || [],
      in_stock: product.in_stock
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      await axios.delete(
        `${BACKEND_URL}/api/admin/products/${productId}`,
        { withCredentials: true }
      );
      fetchProducts();
    } catch (error) {
      alert('فشل حذف المنتج');
    }
  };

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      category: 'HOODIES',
      price: '',
      old_price: '',
      image_url: '',
      description_ar: '',
      description_en: '',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['أسود', 'أبيض', 'رمادي'],
      stickers: [],
      in_stock: true
    });
    setImageFile(null);
  };

  const openAddModal = () => {
    resetForm();
    setEditingProduct(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFFFFF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0A0A0A] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: "'Cairo', sans-serif" }}>
              RIVO - لوحة التحكم
            </h1>
            <p className="text-sm text-gray-400">مرحباً، عبدالمنعم {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-[#0A0A0A] p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-2">إجمالي المنتجات</h3>
            <p className="text-3xl font-black">{products.length}</p>
          </div>
          <div className="bg-white border-2 border-[#0A0A0A] p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-2">المنتجات المتوفرة</h3>
            <p className="text-3xl font-black text-green-600">
              {products.filter(p => p.in_stock).length}
            </p>
          </div>
          <div className="bg-white border-2 border-[#0A0A0A] p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-2">غير المتوفرة</h3>
            <p className="text-3xl font-black text-red-600">
              {products.filter(p => !p.in_stock).length}
            </p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">المنتجات</h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#FFFFFF] text-[#0A0A0A] px-6 py-3 font-bold border-2 border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة منتج جديد
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white border-2 border-[#0A0A0A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFFFFF]">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-black">الصورة</th>
                  <th className="px-4 py-3 text-right text-sm font-black">الاسم</th>
                  <th className="px-4 py-3 text-right text-sm font-black">الفئة</th>
                  <th className="px-4 py-3 text-right text-sm font-black">السعر</th>
                  <th className="px-4 py-3 text-right text-sm font-black">الخصم</th>
                  <th className="px-4 py-3 text-right text-sm font-black">الحالة</th>
                  <th className="px-4 py-3 text-center text-sm font-black">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t-2 border-gray-200">
                    <td className="px-4 py-3">
                      <img
                        src={product.image_url}
                        alt={product.name_ar}
                        className="w-16 h-16 object-cover border border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold">{product.name_ar}</div>
                      <div className="text-sm text-gray-600">{product.name_en}</div>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold">{product.price.toFixed(2)} ₪</div>
                      {product.old_price && (
                        <div className="text-sm text-gray-400 line-through">
                          {product.old_price.toFixed(2)} ₪
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.discount_percent ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold">
                          -{product.discount_percent}%
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-bold ${
                          product.in_stock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.in_stock ? 'متوفر' : 'غير متوفر'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#0A0A0A] w-full max-w-2xl my-8">
            <div className="bg-[#FFFFFF] px-6 py-4 flex justify-between items-center border-b-2 border-[#0A0A0A]">
              <h3 className="text-xl font-black">
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">الاسم بالعربي *</label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#0A0A0A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">الاسم بالإنجليزي *</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#0A0A0A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">الفئة *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#0A0A0A]"
                    required
                  >
                    <option value="HOODIES">HOODIES</option>
                    <option value="POLO T-SHIRTS">POLO T-SHIRTS</option>
                    <option value="SWEATERS">SWEATERS</option>
                    <option value="T-SHIRTS">T-SHIRTS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">السعر (₪) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#0A0A0A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">السعر القديم (₪)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#0A0A0A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">الحالة *</label>
                  <select
                    value={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border-2 border-[#0A0A0A]"
                  >
                    <option value="true">متوفر</option>
                    <option value="false">غير متوفر</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">الألوان (افصل بفاصلة)</label>
                <input
                  type="text"
                  value={formData.colors.join(', ')}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(c => c.trim()) })}
                  className="w-full px-3 py-2 border-2 border-[#0A0A0A]"
                  placeholder="أسود, أبيض, رمادي"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">رفع صورة *</label>
                <div className="border-2 border-dashed border-[#0A0A0A] p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                  {uploading && <p className="text-sm mt-2">جاري الرفع...</p>}
                  {formData.image_url && !uploading && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#0A0A0A] text-white py-3 font-bold uppercase hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-colors border-2 border-[#0A0A0A]"
                  disabled={uploading || !formData.image_url}
                >
                  {editingProduct ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border-2 border-[#0A0A0A] font-bold hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
