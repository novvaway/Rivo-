import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, Globe } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Will implement search functionality
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A] text-white py-4 border-b-2 border-[#FFDE00]" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <div 
            className="flex flex-col items-end cursor-pointer"
            onClick={() => navigate('/')}
            data-testid="logo"
          >
            <div className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-wider">RIVO</div>
            <div className="text-[10px] md:text-xs text-[#D4AF37] tracking-widest">WEAR CONFIDENCE</div>
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4 bg-white rounded-full px-4 py-2 items-center gap-2"
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
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hover:text-[#FFDE00] transition-colors"
              data-testid="language-toggle-btn"
              aria-label="Toggle Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="hover:text-[#FFDE00] transition-colors"
              data-testid="sidebar-toggle-btn"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/checkout')}
              className="relative hover:text-[#FFDE00] transition-colors"
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
    </header>
  );
};

export default Header;
