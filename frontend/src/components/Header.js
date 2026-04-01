import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, Globe } from 'lucide-react';

const Header = ({ onMenuToggle, onSearch }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header 
      className={`header-animate sticky top-0 z-50 bg-[#0A0A0A] text-white border-b-2 border-white/20 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-lg' : 'py-4'
      }`} 
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-2 md:gap-4">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate('/')}
            data-testid="logo"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_wear-confidence-6/artifacts/sldpn8jr_1000319426.jpg"
              alt="RIVO - Wear Confidence"
              className="h-16 md:h-20 lg:h-24 w-auto object-contain"
            />
          </div>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4 bg-white rounded-full px-4 py-2 items-center gap-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#FFFFFF]"
            data-testid="search-form"
          >
            <Search className="text-black w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t({ ar: 'ابحث عن منتج...', en: 'Search for a product...' })}
              className="flex-1 bg-transparent text-black outline-none text-sm"
              data-testid="search-input"
            />
          </form>

          {/* Actions - New Order: Cart, Language, Menu */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            {/* Cart - First */}
            <button
              onClick={() => navigate('/checkout')}
              className="relative hover:text-[#FFFFFF] transition-all duration-300 hover:scale-110 active:scale-95"
              data-testid="cart-btn"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span 
                  className="bg-[#FF3B30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-2 -right-2 animate-pulse"
                  data-testid="cart-count"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Language Toggle - Second */}
            <button
              onClick={toggleLanguage}
              className="hover:text-[#FFFFFF] transition-all duration-300 hover:scale-110 active:scale-95"
              data-testid="language-toggle-btn"
              aria-label="Toggle Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Menu Toggle - Last (Left) */}
            <button
              onClick={onMenuToggle}
              className="hover:text-[#FFFFFF] transition-all duration-300 hover:scale-110 active:scale-95"
              data-testid="sidebar-toggle-btn"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form 
          onSubmit={handleSearch}
          className="md:hidden flex mt-3 bg-white rounded-full px-4 py-2 items-center gap-2"
        >
          <Search className="text-black w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t({ ar: 'ابحث عن منتج...', en: 'Search for a product...' })}
            className="flex-1 bg-transparent text-black outline-none text-sm"
          />
        </form>
      </div>
    </header>
  );
};

export default Header;
