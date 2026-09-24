import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingBag, Eye, Gift } from 'lucide-react';
import { Product } from '../types/shop';
import { formatVND } from '../db/storage';
import { TechVisual } from './TechVisual';
import { useTheme } from '../context/ThemeContext';

interface FlashSaleSectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  hours?: number;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onOpenInstallment?: (product: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  title = 'GIỜ VÀNG GIÁ SỐC',
  subtitle = 'Áp dụng mua trực tiếp tại các chi nhánh và đặt giao hỏa tốc 1 - 2 giờ',
  hours = 3,
  onAddToCart,
  onViewDetails,
  onOpenInstallment,
}) => {
  const { isDark } = useTheme();
  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: hours || 2,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale);

  if (flashProducts.length === 0) return null;

  return (
    <section id="flash-sale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 scroll-mt-24 text-left">
      <div
        className={`border-2 rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-gradient-to-r from-sky-950 via-slate-900 to-cyan-950 border-sky-500/60 shadow-2xl'
            : 'bg-gradient-to-r from-sky-50 via-sky-100/50 to-cyan-50 border-sky-300 shadow-xl'
        }`}
      >
        {/* Glow accent */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-sky-500/15' : 'bg-sky-400/25'
          }`}
        />

        {/* Header Bar with Countdown */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b ${
            isDark ? 'border-sky-900/60' : 'border-sky-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500 text-white shadow-lg animate-bounce">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-xl sm:text-2xl font-black uppercase tracking-tight font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {title}
                </h2>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase font-mono shadow-xs">
                  SỐ LƯỢNG CÓ HẠN
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-sky-200' : 'text-slate-700'}`}>
                {subtitle}
              </p>
            </div>
          </div>

          {/* Countdown Clock Box */}
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 shrink-0 border ${
              isDark
                ? 'bg-slate-950/80 border-sky-800/60'
                : 'bg-white border-sky-300 shadow-xs'
            }`}
          >
            <Clock className={`w-4 h-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
            <span
              className={`text-xs font-bold mr-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Kết thúc sau:
            </span>
            <div className="flex items-center gap-1 font-mono text-sm font-black">
              <span className="bg-sky-500 text-white px-2 py-1 rounded-md shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className={isDark ? 'text-sky-400' : 'text-sky-600'}>:</span>
              <span className="bg-sky-500 text-white px-2 py-1 rounded-md shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className={isDark ? 'text-sky-400' : 'text-sky-600'}>:</span>
              <span className="bg-sky-500 text-white px-2 py-1 rounded-md shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {flashProducts.map((p) => {
            const soldCount = p.flashSaleSold || 15;
            const totalCount = p.flashSaleTotal || 20;
            const progressPercent = Math.min(100, Math.round((soldCount / totalCount) * 100));

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-4 flex flex-col justify-between transition-all group ${
                  isDark
                    ? 'bg-slate-900 border border-slate-800 hover:border-sky-400 shadow-lg'
                    : 'bg-white border border-slate-200 hover:border-sky-400 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-white bg-sky-600 px-2 py-0.5 rounded-lg font-mono shadow-xs">
                      Giảm {p.discountPercent || 20}%
                    </span>
                    {p.installmentZero && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                          isDark
                            ? 'text-emerald-300 bg-emerald-950 border-emerald-800/80'
                            : 'text-emerald-800 bg-emerald-50 border-emerald-300'
                        }`}
                      >
                        Trả góp 0%
                      </span>
                    )}
                  </div>

                  {/* Visual Image container */}
                  <div
                    onClick={() => onViewDetails(p)}
                    className={`relative w-full h-44 rounded-xl overflow-hidden flex items-center justify-center p-3 cursor-pointer group-hover:scale-[1.02] transition-transform ${
                      isDark ? 'bg-slate-950' : 'bg-sky-50/50'
                    }`}
                  >
                    <TechVisual
                      category={p.category}
                      name={p.name}
                      badge={p.badge}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Brand & Name */}
                  <div className="mt-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                        isDark ? 'text-sky-400' : 'text-sky-700'
                      }`}
                    >
                      {p.brand || 'CHÍNH HÃNG'}
                    </span>
                    <h3
                      onClick={() => onViewDetails(p)}
                      className={`text-sm font-bold transition-colors line-clamp-2 mt-0.5 cursor-pointer leading-snug ${
                        isDark
                          ? 'text-white group-hover:text-sky-300'
                          : 'text-slate-900 group-hover:text-sky-600'
                      }`}
                    >
                      {p.name}
                    </h3>
                  </div>

                  {/* Specs highlight pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.specs.cpu && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono truncate max-w-[140px] font-medium ${
                          isDark
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {p.specs.cpu.split('(')[0]}
                      </span>
                    )}
                    {p.specs.ram && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          isDark
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {p.specs.ram.split(' ')[0]}
                      </span>
                    )}
                    {p.specs.gpu && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono truncate max-w-[130px] font-medium ${
                          isDark
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {p.specs.gpu.split(' ')[0]} {p.specs.gpu.split(' ')[1]}
                      </span>
                    )}
                  </div>

                  {/* Gift Promotion Banner if any */}
                  {p.giftPromotion && (
                    <div
                      className={`mt-2.5 p-2 rounded-lg border flex items-start gap-1.5 text-[11px] ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-amber-300'
                          : 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{p.giftPromotion}</span>
                    </div>
                  )}

                  {/* Price Row */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span
                      className={`text-lg font-black font-mono tabular-nums ${
                        isDark ? 'text-sky-400' : 'text-sky-600'
                      }`}
                    >
                      {formatVND(p.price)}
                    </span>
                    {p.originalPrice && (
                      <span
                        className={`text-xs line-through font-mono tabular-nums ${
                          isDark ? 'text-slate-500' : 'text-slate-500 font-medium'
                        }`}
                      >
                        {formatVND(p.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Progress Burning Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold font-mono">
                      <span
                        className={`flex items-center gap-1 ${
                          isDark ? 'text-sky-300' : 'text-sky-700'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 fill-current text-sky-500" />
                        Đã bán {soldCount}/{totalCount} suất
                      </span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-slate-800' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={`mt-4 pt-3 border-t flex flex-col gap-2 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(p)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi Tiết</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddToCart(p)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Mua Ngay</span>
                    </button>
                  </div>

                  {onOpenInstallment && (
                    <button
                      type="button"
                      onClick={() => onOpenInstallment(p)}
                      className="w-full py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[11px] font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Trả góp 0% chỉ từ {formatVND(Math.round(p.price / 6))}/tháng</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

