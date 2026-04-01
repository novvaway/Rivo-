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
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Area - 65% of card */}
      <div 
        className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image_url}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discount_percent && (
          <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {product.discount_percent}%-
          </span>
        )}

        {/* Heart Icon - white circle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
            isInWish 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500'
          }`}
          data-testid={`wishlist-btn-${product.id}`}
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4" fill={isInWish ? 'currentColor' : 'none'} />
        </button>

        {/* Stickers */}
        {product.stickers && product.stickers.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {product.stickers.map((sticker) => (
              <span
                key={sticker}
                className="bg-white/90 backdrop-blur-sm text-[10px] font-medium text-gray-700 px-2 py-0.5 rounded-full"
              >
                {sticker}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info - clean bottom section */}
      <div 
        className="p-3.5 flex flex-col gap-1"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <h3 className="text-sm text-[#333] font-normal truncate">
          {productName}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-[#0A0A0A] font-bold text-base">
            ₪ {product.price.toFixed(2)}
          </span>
          {product.old_price && (
            <span className="text-gray-400 line-through text-xs">
              ₪ {product.old_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
