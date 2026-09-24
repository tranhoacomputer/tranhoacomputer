import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp, ChevronUp } from 'lucide-react';
import { StoreSettings } from '../types/shop';
import { useTheme } from '../context/ThemeContext';

interface FloatingContactWidgetProps {
  settings: StoreSettings;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ settings }) => {
  const { isDark } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hotlineFormatted = (settings.hotline || '0963284044').replace(/\s+/g, '');
  const zaloNumber = (settings.zalo || '84963284044').replace(/\s+/g, '');

  return (
    <aside
      aria-label="Liên hệ nhanh và hỗ trợ"
      className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-30 flex flex-col items-end gap-2.5"
    >
      {/* 1. Zalo Chat Floating Button */}
      <a
        href={`https://zalo.me/${zaloNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 group text-xs font-bold"
        title="Chat tư vấn qua Zalo"
      >
        <div className="w-5 h-5 rounded-full bg-white text-blue-600 font-extrabold text-[10px] flex items-center justify-center">
          Z
        </div>
        <span className="hidden sm:inline">Chat Zalo</span>
      </a>

      {/* 2. Hotline Call Quick Action */}
      <a
        href={`tel:${hotlineFormatted}`}
        className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 text-xs font-bold"
        title={`Gọi tổng đài miễn phí: ${settings.hotline}`}
      >
        <Phone className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">{settings.hotline || '1800 6868'}</span>
      </a>

      {/* 3. Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={`p-2.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
          }`}
          title="Cuộn lên đầu trang"
          aria-label="Lên đầu trang"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
};
