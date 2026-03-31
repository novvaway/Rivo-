import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#0A0A0A] mb-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            RIVO
          </h1>
          <p className="text-sm text-gray-600">لوحة التحكم</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-[#0A0A0A] p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0A] text-white py-3 font-bold uppercase hover:bg-[#FFDE00] hover:text-[#0A0A0A] transition-colors border-2 border-[#0A0A0A] disabled:opacity-50"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-[#FFDE00] transition-colors"
          >
            العودة للموقع
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
