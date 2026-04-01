import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = [
  { id: 'HOODIES', name_ar: 'HOODIES', name_en: 'HOODIES' },
  { id: 'POLO T-SHIRTS', name_ar: 'POLO T-SHIRTS', name_en: 'POLO T-SHIRTS' },
  { id: 'SWEATERS', name_ar: 'SWEATERS', name_en: 'SWEATERS' },
  { id: 'T-SHIRTS', name_ar: 'T-SHIRTS', name_en: 'T-SHIRTS' },
];

const Categories = ({ onCategorySelect, selectedCategory }) => {
  const { t } = useLanguage();

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8" data-testid="categories-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`bg-[#0A0A0A] text-white rounded-2xl py-6 px-4 flex items-center justify-center text-center uppercase tracking-wide transition-all duration-200 active:scale-[0.97] ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-white' 
                  : 'hover:bg-[#1a1a1a]'
              }`}
              style={{ fontFamily: "'Anton', 'Helvetica Neue', Arial, sans-serif", fontSize: '15px', letterSpacing: '1.5px' }}
              data-testid={`category-btn-${category.id}`}
            >
              {category.name_ar}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
