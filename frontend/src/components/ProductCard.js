import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { language, t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const isInWish = isInWishlist(product.id);

  return (
    <div 
      className="group flex flex-col relative border-2 border-[#0A0A0A] bg-white transition-all hover:shadow-[8px_8px_0_#0A0A0A] cursor-pointer"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[4/5] bg-gray-100 overflow-hidden border-b-2 border-[#0A0A0A]"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image_url}
          alt={productName}
          className="w-full h-full object-cover mix-blend-multiply"
          loading="lazy"
        />
        
        {/* Stickers */}
        {product.stickers && product.stickers.map((sticker, index) => (
          <span
            key={sticker}
            className={`absolute bottom-2 text-[10px] font-bold px-2 py-1 rounded-full ${
              sticker === 'COMFORT' || sticker === 'NEW'
                ? 'bg-white text-black border border-black'
                : 'bg-black text-white'
            }`}
            style={{ left: `${10 + index * 60}px` }}
          >
            {sticker}
          </span>
        ))}

        {/* Discount Badge */}
        {product.discount_percent && (
          <span className="absolute top-2 left-2 bg-[#0A0A0A] text-white text-xs font-black px-2 py-1">
            -{product.discount_percent}%
          </span>
        )}

        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
            isInWish ? 'bg-[#FF3B30] text-white' : 'bg-white/80 text-black hover:bg-[#FF3B30] hover:text-white'
          }`}
          data-testid={`wishlist-btn-${product.id}`}
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4" fill={isInWish ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-sm font-bold text-[#0A0A0A] uppercase truncate">
          {productName}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#FF3B30] font-black text-lg">
            {product.price.toFixed(2)} ₪
          </span>
          {product.old_price && (
            <span className="text-gray-400 line-through text-sm font-bold">
              {product.old_price.toFixed(2)} ₪
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="mt-3 w-full bg-[#0A0A0A] text-white py-2.5 font-bold text-sm uppercase hover:bg-[#FFDE00] hover:text-[#0A0A0A] transition-colors border-t-2 border-[#0A0A0A]"
          data-testid={`select-options-btn-${product.id}`}
        >
          {t({ ar: 'تحديد أحد الخيارات', en: 'Select Options' })}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
