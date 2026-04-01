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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery]);

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

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name_ar.toLowerCase().includes(query) ||
      product.name_en.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-white fade-in" data-testid="home-page">
      <Header 
        onMenuToggle={() => setSidebarOpen(true)} 
        onSearch={handleSearch}
      />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      <main>
        {/* Custom Design Banner */}
        <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-2">
          <div className="max-w-7xl mx-auto">
            <a
              href="https://wa.me/972593606672?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A8%D8%AF%D9%8A%20%D8%A3%D8%B7%D9%84%D8%A8%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AE%D8%A7%D8%B5"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#0A0A0A] text-white rounded-2xl p-5 relative overflow-hidden group"
              data-testid="custom-design-banner"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold leading-tight">
                    {t({ ar: 'اطلب تصميمك الخاص', en: 'Order Your Custom Design' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t({ ar: 'صمّم قطعتك الفريدة معنا', en: 'Create your unique piece with us' })}
                  </p>
                </div>
                <span className="text-2xl text-white/30 group-hover:text-white/60 transition-colors font-light">&larr;</span>
              </div>
            </a>
          </div>
        </div>

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
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FFFFFF] border-t-transparent"></div>
              <div className="text-xl font-bold mt-4">{t({ ar: 'جاري التحميل...', en: 'Loading...' })}</div>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-4 text-center">
                  <p className="text-lg font-bold">
                    {t({ ar: 'نتائج البحث عن:', en: 'Search results for:' })} "{searchQuery}"
                    <span className="text-[#FFFFFF] mr-2">
                      ({filteredProducts.length} {t({ ar: 'منتج', en: 'products' })})
                    </span>
                  </p>
                </div>
              )}
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12" data-testid="empty-state">
                  <div className="text-6xl mb-4">🔍</div>
                  <div className="text-2xl font-bold mb-2">
                    {searchQuery 
                      ? t({ ar: 'لا توجد نتائج', en: 'No results found' })
                      : t({ ar: 'لا توجد منتجات', en: 'No products found' })
                    }
                  </div>
                  {searchQuery && (
                    <p className="text-gray-600 mt-2">
                      {t({ ar: 'جرب البحث بكلمات مختلفة', en: 'Try searching with different keywords' })}
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" data-testid="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
