import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0A0A0A] text-white pt-12 pb-24 px-6 mt-20 border-t-4 border-[#FFDE00]" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-end mb-8 fade-in">
          <div className="text-3xl md:text-4xl font-black text-[#D4AF37] tracking-wider">RIVO</div>
          <div className="text-sm md:text-base text-[#D4AF37] tracking-widest">WEAR CONFIDENCE</div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold mb-4">{t({ ar: 'روابط سريعة', en: 'Quick Links' })}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FFDE00] transition-colors text-sm">
                  {t({ ar: 'جميع المنتجات', en: 'All Products' })}
                </a>
              </li>
              <li>
                <a href="/checkout" className="text-gray-400 hover:text-[#FFDE00] transition-colors text-sm">
                  {t({ ar: 'سلة التسوق', en: 'Shopping Cart' })}
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold mb-4">{t({ ar: 'خدمة العملاء', en: 'Customer Service' })}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FFDE00] transition-colors text-sm">
                  {t({ ar: 'سياسة الإرجاع والاستبدال', en: 'Return & Exchange Policy' })}
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold mb-4">{t({ ar: 'تواصل معنا', en: 'Contact Us' })}</h4>
            <div className="space-y-2">
              <a 
                href="https://www.instagram.com/rivo.ps?igsh=MXZpOXgyOGtxbnhkeQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-[#FFDE00] transition-colors text-sm"
              >
                Instagram: @rivo.ps
              </a>
              <a 
                href="mailto:rivo12666@gmail.com"
                className="block text-gray-400 hover:text-[#FFDE00] transition-colors text-sm"
              >
                {t({ ar: 'البريد الإلكتروني', en: 'Email' })}: rivo12666@gmail.com
              </a>
              <a 
                href="https://wa.me/972593606672"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-[#FFDE00] transition-colors text-sm"
              >
                {t({ ar: 'واتساب', en: 'WhatsApp' })}: +972 59-360-6672
              </a>
            </div>
          </div>
        </div>

        {/* Platform Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-6 border-t border-white/10">
          <span>{t({ ar: 'جميع الحقوق محفوظة © 2024 RIVO', en: '© 2024 RIVO. All rights reserved.' })}</span>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/972593606672?text=مرحبا، أنا مهتم بمنتجات RIVO"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-50 animate-pulse"
        data-testid="whatsapp-fab"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
};

export default Footer;
