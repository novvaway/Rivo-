import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Categories from '@/components/Categories';
import Filters from '@/components/Filters';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (sortBy !== 'default') {
        params.append('sort_by', sortBy);
      }
      
      const response = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      <main>
        <Categories 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        <Filters 
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="text-center py-12" data-testid="loading-state">
              <div className="text-xl font-bold">{t({ ar: 'جاري التحميل...', en: 'Loading...' })}</div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-state">
              <div className="text-xl font-bold">{t({ ar: 'لا توجد منتجات', en: 'No products found' })}</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
