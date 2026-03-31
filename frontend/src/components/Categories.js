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
    <div className="py-6 overflow-x-auto" data-testid="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`category-item bg-[#FFDE00] text-[#0A0A0A] min-h-[120px] sm:min-h-[140px] md:aspect-square flex items-center justify-center p-4 text-center font-black text-sm md:text-base border-2 border-[#0A0A0A] shadow-[4px_4px_0_#0A0A0A] uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#0A0A0A] active:translate-y-0 active:shadow-[2px_2px_0_#0A0A0A] ${
                selectedCategory === category.id ? '-translate-y-1 shadow-[6px_6px_0_#0A0A0A]' : ''
              }`}
              style={{ fontFamily: "'Anton', 'Cairo', sans-serif" }}
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
