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
            <div key={category.id} className="flex flex-col items-center gap-2">
              <button
                onClick={() => onCategorySelect(category.id)}
                className={`w-full bg-[#0A0A0A] text-white rounded-2xl min-h-[100px] sm:min-h-[120px] flex items-center justify-center p-4 text-center uppercase transition-all duration-200 active:scale-[0.97] ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-[#0A0A0A] ring-offset-2' 
                    : 'hover:bg-[#1a1a1a]'
                }`}
                style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '1px' }}
                data-testid={`category-btn-${category.id}`}
              >
                {category.name_ar}
              </button>
              <span 
                className="text-[#333] text-xs uppercase tracking-wide font-normal"
              >
                {category.name_en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
