import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

const Filters = ({ sortBy, onSortChange }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 py-4" data-testid="filters-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-wrap gap-2">
          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] rounded-full px-6 py-2 text-sm font-bold pr-10 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
              data-testid="sort-select"
            >
              <option value="default">{t({ ar:'ترتيب حسب: افتراضي', en: 'Sort by: Default' })}</option>
              <option value="price_asc">{t({ ar: 'السعر: من الأقل للأعلى', en: 'Price: Low to High' })}</option>
              <option value="price_desc">{t({ ar: 'السعر: من الأعلى للأقل', en: 'Price: High to Low' })}</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
