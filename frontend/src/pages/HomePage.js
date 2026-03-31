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
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FFDE00] border-t-transparent"></div>
              <div className="text-xl font-bold mt-4">{t({ ar: 'جاري التحميل...', en: 'Loading...' })}</div>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-4 text-center">
                  <p className="text-lg font-bold">
                    {t({ ar: 'نتائج البحث عن:', en: 'Search results for:' })} "{searchQuery}"
                    <span className="text-[#FFDE00] mr-2">
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
