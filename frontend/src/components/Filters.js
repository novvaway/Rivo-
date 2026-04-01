import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

const Filters = ({ sortBy, onSortChange }) => {
  const { t } = useLanguage();

  return (
    <div className="py-4" data-testid="filters-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sort dropdown - bordered rounded box */}
        <div className="flex justify-center mb-3">
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-white text-[#333] border border-[#ddd] rounded-xl px-6 py-3 text-sm font-normal pr-10 cursor-pointer w-full min-w-[220px] text-center"
              data-testid="sort-select"
            >
              <option value="default">{t({ ar: 'ترتيب حسب:   افتراضي', en: 'Sort by: Default' })}</option>
              <option value="price_asc">{t({ ar: 'السعر: من الأقل للأعلى', en: 'Price: Low to High' })}</option>
              <option value="price_desc">{t({ ar: 'السعر: من الأعلى للأقل', en: 'Price: High to Low' })}</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
