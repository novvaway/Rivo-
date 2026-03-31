import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

const categories = [
  { id: 'all', name_ar: 'جميع المنتجات', name_en: 'All Products' },
  { id: 'HOODIES', name_ar: 'هوديز', name_en: 'Hoodies' },
  { id: 'POLO T-SHIRTS', name_ar: 'قمصان بولو', name_en: 'Polo T-Shirts' },
  { id: 'SWEATERS', name_ar: 'سويترات', name_en: 'Sweaters' },
  { id: 'T-SHIRTS', name_ar: 'تيشيرتات', name_en: 'T-Shirts' },
];

const Sidebar = ({ isOpen, onClose, onCategorySelect, selectedCategory }) => {
  const { t, language } = useLanguage();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[59] transition-opacity"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-[#0A0A0A] text-white z-[60] p-6 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="sidebar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white hover:text-[#FFDE00] transition-colors"
          data-testid="sidebar-close-btn"
          aria-label="Close Menu"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-end mb-8 mt-2">
          <img 
            src="https://customer-assets.emergentagent.com/job_wear-confidence-6/artifacts/sldpn8jr_1000319426.jpg"
            alt="RIVO - Wear Confidence"
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategorySelect(category.id);
                onClose();
              }}
              className={`w-full text-right text-lg font-bold py-3 border-b border-white/10 hover:text-[#FFDE00] transition-colors block ${
                selectedCategory === category.id ? 'text-[#FFDE00]' : ''
              }`}
              data-testid={`sidebar-category-${category.id}`}
            >
              {language === 'ar' ? category.name_ar : category.name_en}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
