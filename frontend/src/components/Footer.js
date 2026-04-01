import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle } from 'lucide-react';
import { AiOutlineInstagram, AiOutlineMail, AiOutlineWhatsApp } from 'react-icons/ai';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0A0A0A] text-white pt-12 pb-24 px-6 mt-20 border-t-4 border-white/20" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-end mb-8 fade-in">
          <img 
            src="https://customer-assets.emergentagent.com/job_wear-confidence-6/artifacts/sldpn8jr_1000319426.jpg"
            alt="RIVO - Wear Confidence"
            className="h-32 md:h-36 w-auto object-contain"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold mb-4">{t({ ar: 'روابط سريعة', en: 'Quick Links' })}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FFFFFF] transition-colors text-sm">
                  {t({ ar: 'جميع المنتجات', en: 'All Products' })}
                </a>
              </li>
              <li>
                <a href="/checkout" className="text-gray-400 hover:text-[#FFFFFF] transition-colors text-sm">
                  {t({ ar: 'سلة التسوق', en: 'Shopping Cart' })}
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold mb-4">{t({ ar: 'خدمة العملاء', en: 'Customer Service' })}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FFFFFF] transition-colors text-sm">
                  {t({ ar: 'سياسة الإرجاع والاستبدال', en: 'Return & Exchange Policy' })}
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold mb-4">{t({ ar: 'تواصل معنا', en: 'Contact Us' })}</h4>
            <div className="space-y-3">
              <a 
                href="https://www.instagram.com/rivo.ps?igsh=MXZpOXgyOGtxbnhkeQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#FFFFFF] transition-colors text-sm justify-center md:justify-end"
              >
                <AiOutlineInstagram className="w-5 h-5" />
                <span>@rivo.ps</span>
              </a>
              <a 
                href="mailto:rivo12666@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-[#FFFFFF] transition-colors text-sm justify-center md:justify-end"
              >
                <AiOutlineMail className="w-5 h-5" />
                <span>rivo12666@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/972593606672"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#FFFFFF] transition-colors text-sm justify-center md:justify-end"
              >
                <AiOutlineWhatsApp className="w-5 h-5" />
                <span>+972 59-360-6672</span>
              </a>
            </div>
          </div>
        </div>

        {/* Platform Badge */}
        <div className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500 pt-6 border-t border-white/10">
          <span>{t({ ar: 'جميع الحقوق محفوظة © 2026 RIVO', en: '© 2024 RIVO. All rights reserved.' })}</span>
          <a 
            href="https://www.instagram.com/novaway.co?igsh=c2w1NjQ2OWMxcWY1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-600 hover:text-[#FFFFFF] transition-colors"
          >
            Made with Novaway.co
          </a>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/972593606672?text=مرحبا، أنا مهتم بمنتجات RIVO"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-50"
        data-testid="whatsapp-fab"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
};

export default Footer;
