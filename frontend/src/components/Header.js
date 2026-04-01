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
      className={`sticky top-0 z-50 bg-[#0A0A0A] text-white border-b border-white/10 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-3'
      }`} 
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isScrolled ? (
          /* === SCROLLED STATE: Single row — Menu + Search + Cart === */
          <div className="flex items-center gap-3" data-testid="header-scrolled">
            <button
              onClick={onMenuToggle}
              className="hover:text-white/80 transition-all duration-200 active:scale-95 shrink-0"
              data-testid="sidebar-toggle-btn"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <form 
              onSubmit={handleSearch}
              className="flex flex-1 bg-white/10 rounded-full px-4 py-2 items-center gap-2"
              data-testid="search-form-scrolled"
            >
              <Search className="text-white/60 w-4 h-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t({ ar: 'ابحث عن منتج...', en: 'Search for a product...' })}
                className="flex-1 bg-transparent text-white outline-none text-sm placeholder-white/50"
                data-testid="search-input-scrolled"
              />
            </form>

            <button
              onClick={() => navigate('/checkout')}
              className="relative hover:text-white/80 transition-all duration-200 active:scale-95 shrink-0"
              data-testid="cart-btn"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span 
                  className="bg-[#FF3B30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-2 -right-2"
                  data-testid="cart-count"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        ) : (
          /* === DEFAULT STATE: Two rows === */
          <>
            {/* Row 1: Menu + Language on edges, Logo in center */}
            <div className="flex justify-between items-center" data-testid="header-default-row1">
              <div className="flex items-center gap-3">
                <button
                  onClick={onMenuToggle}
                  className="hover:text-white/80 transition-all duration-200 active:scale-95"
                  data-testid="sidebar-toggle-btn"
                  aria-label="Toggle Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  onClick={toggleLanguage}
                  className="hover:text-white/80 transition-all duration-200 active:scale-95"
                  data-testid="language-toggle-btn"
                  aria-label="Toggle Language"
                >
                  <Globe className="w-5 h-5" />
                </button>
              </div>

              <div 
                className="cursor-pointer"
                onClick={() => navigate('/')}
                data-testid="logo"
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_wear-confidence-6/artifacts/sldpn8jr_1000319426.jpg"
                  alt="RIVO"
                  className="h-14 md:h-18 lg:h-20 w-auto object-contain"
                />
              </div>

              <div className="w-[70px]" />
            </div>

            {/* Row 2: Search bar + Cart */}
            <div className="flex items-center gap-3 mt-3" data-testid="header-default-row2">
              <form 
                onSubmit={handleSearch}
                className="flex flex-1 bg-white rounded-full px-4 py-2 items-center gap-2"
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

              <button
                onClick={() => navigate('/checkout')}
                className="relative hover:text-white/80 transition-all duration-200 active:scale-95 shrink-0"
                data-testid="cart-btn"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span 
                    className="bg-[#FF3B30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-2 -right-2"
                    data-testid="cart-count"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
