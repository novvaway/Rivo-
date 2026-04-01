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
      className={`sticky top-0 z-50 bg-[#0A0A0A] text-white transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-3'
      }`} 
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Menu+Lang | Logo | Cart */}
        <div className="flex justify-between items-center">
          {/* Left: Menu + Language */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuToggle}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              data-testid="sidebar-toggle-btn"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={toggleLanguage}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              data-testid="language-toggle-btn"
              aria-label="Toggle Language"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Logo */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
            onClick={() => navigate('/')}
            data-testid="logo"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_wear-confidence-6/artifacts/sldpn8jr_1000319426.jpg"
              alt="RIVO"
              className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-10' : 'h-14 md:h-16'}`}
              loading="eager"
            />
          </div>

          {/* Right: Cart */}
          <button
            onClick={() => navigate('/checkout')}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            data-testid="cart-btn"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span 
                className="bg-[#FF3B30] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full absolute -top-1 -right-1"
                data-testid="cart-count"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="flex mt-3 bg-white rounded-full px-4 py-2.5 items-center gap-2"
          data-testid="search-form"
        >
          <Search className="text-gray-400 w-4 h-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t({ ar: 'ابحث عن منتج...', en: 'Search for a product...' })}
            className="flex-1 bg-transparent text-black outline-none text-sm"
            data-testid="search-input"
          />
        </form>
      </div>
    </header>
  );
};

export default Header;
