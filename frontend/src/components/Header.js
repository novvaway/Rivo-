import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, Globe } from 'lucide-react';

const categories = [
  { id: 'HOODIES', name: 'HOODIES' },
  { id: 'POLO T-SHIRTS', name: 'POLO T-SHIRTS' },
  { id: 'SWEATERS', name: 'SWEATERS' },
  { id: 'T-SHIRTS', name: 'T-SHIRTS' },
];

const Header = ({ onMenuToggle, onCategorySelect, selectedCategory }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <header 
      className={`header-animate sticky top-0 z-50 bg-[#0A0A0A] text-white border-b-2 border-[#FFDE00] transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-lg' : 'py-4'
      }`} 
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Normal Header - Show when not scrolled */}
        <div className={`transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
          <div className="flex justify-between items-center gap-2 md:gap-4">
            {/* Logo */}
            <div 
              className="flex flex-col items-end cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => navigate('/')}
              data-testid="logo"
            >
              <div className="text-xl md:text-2xl lg:text-3xl font-black text-[#D4AF37] tracking-wider">RIVO</div>
              <div className="text-[8px] md:text-[10px] lg:text-xs text-[#D4AF37] tracking-widest">WEAR CONFIDENCE</div>
            </div>

            {/* Search Bar - Desktop */}
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl mx-4 bg-white rounded-full px-4 py-2 items-center gap-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#FFDE00]"
              data-testid="search-form"
            >
              <Search className="text-black w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t({ ar: 'ابحث عن منتج...', en: 'Search for a product...' })}
                className="flex-1 bg-transparent text-black outline-none text-sm"
                data-testid="search-input"
              />
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              <button
                onClick={toggleLanguage}
                className="hover:text-[#FFDE00] transition-all duration-300 hover:scale-110 active:scale-95"
                data-testid="language-toggle-btn"
                aria-label="Toggle Language"
              >
                <Globe className="w-5 h-5" />
              </button>

              <button
                onClick={onMenuToggle}
                className="hover:text-[#FFDE00] transition-all duration-300 hover:scale-110 active:scale-95"
                data-testid="sidebar-toggle-btn"
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={() => navigate('/checkout')}
                className="relative hover:text-[#FFDE00] transition-all duration-300 hover:scale-110 active:scale-95"
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t({ ar: 'ابحث عن منتج...', en: 'Search for a product...' })}
              className="flex-1 bg-transparent text-black outline-none text-sm"
            />
          </form>
        </div>

        {/* Scrolled Header - Show when scrolled */}
        <div className={`transition-all duration-300 ${isScrolled ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between gap-3">
            {/* Left Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onMenuToggle}
                className="hover:text-[#FFDE00] transition-all duration-300 hover:scale-110 active:scale-95 bg-[#1a1a1a] p-2 rounded-full"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="relative hover:text-[#FFDE00] transition-all duration-300 hover:scale-110 active:scale-95 bg-[#1a1a1a] p-2 rounded-full"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="bg-[#FF3B30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-1 -right-1">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Bar - Center */}
            <form 
              onSubmit={handleSearch}
              className="flex-1 max-w-md bg-white rounded-full px-4 py-1.5 flex items-center gap-2"
            >
              <Search className="text-black w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t({ ar: 'ابحث عن منتج...', en: 'Search...' })}
                className="flex-1 bg-transparent text-black outline-none text-sm"
              />
            </form>

            {/* Right Action */}
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#FFDE00] transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <div className="text-lg md:text-xl font-black text-[#D4AF37] tracking-wider">RIVO</div>
            </button>
          </div>

          {/* Categories Row - Scrolled */}
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategorySelect(category.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`bg-[#FFDE00] text-[#0A0A0A] px-3 py-1.5 text-[10px] md:text-xs font-black border border-[#0A0A0A] uppercase transition-all duration-200 hover:bg-white ${
                  selectedCategory === category.id ? 'bg-white' : ''
                }`}
                style={{ fontFamily: "'Anton', 'Cairo', sans-serif" }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
