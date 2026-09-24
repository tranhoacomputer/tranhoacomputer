import React from 'react';
import { ArrowRight, Wrench, ShieldCheck, Zap, Cpu, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types/shop';
import { TechVisual } from './TechVisual';

interface HeroProps {
  settings: StoreSettings;
  onExploreProducts: () => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreProducts,
  onOpenBooking,
  onOpenTracker,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 pt-8 pb-16 lg:py-20 border-b border-slate-800">
      {/* Subtle radial ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Kicker / Badge */}
            <div className="inline-flex items-center gap-2 text-xs text-indigo-400 font-mono tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{settings.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              {settings.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {settings.heroSubtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onExploreProducts}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Xem Sản Phẩm & PC</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <Wrench className="w-4 h-4" />
                <span>Đặt Lịch Sửa Chữa</span>
              </button>

              <button
                type="button"
                onClick={onOpenTracker}
                className="inline-flex items-center justify-center px-4 py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                <span>Tra cứu tiến độ máy →</span>
              </button>
            </div>

            {/* Claim-to-Proof Quantitative Adjacency Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  12,500+
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Thiết bị sửa thành công
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                  30 Phút
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Chẩn đoán & báo giá trực tiếp
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono tabular-nums">
                  36 Tháng
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Bảo hành linh kiện 1 đổi 1
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Tech Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-sm">
              <TechVisual type="pc_gaming" className="w-full h-64 sm:h-72 rounded-xl" />

              {/* Showcase Card Details */}
              <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 tracking-wider">
                    FLAGSHIP BUILD · 2026
                  </span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Có sẵn tại showroom
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  NEXUS TITAN X - RTX 4070 Ti Super 16GB
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Core i7-14700F</span>
                  <span>·</span>
                  <span>32GB DDR5 6000</span>
                  <span>·</span>
                  <span>SSD 1TB Gen4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
