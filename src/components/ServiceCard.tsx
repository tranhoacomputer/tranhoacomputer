import React from 'react';
import { Wrench, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types/shop';
import { useTheme } from '../context/ThemeContext';

interface ServiceCardProps {
  service: ServiceItem;
  onBookService: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookService }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 text-left border ${
        isDark
          ? 'bg-slate-900 border-slate-800 hover:border-sky-400 shadow-lg'
          : 'bg-white border-slate-200 hover:border-sky-400 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="space-y-4">
        {/* Header with Icon & Time badge */}
        <div className="flex items-center justify-between">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              isDark
                ? 'bg-sky-950/80 border-sky-800/80 text-sky-400'
                : 'bg-sky-50 border-sky-200 text-sky-600'
            }`}
          >
            <Wrench className="w-6 h-6" />
          </div>

          <div
            className={`flex items-center gap-1.5 text-xs font-mono font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{service.turnaroundTime}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className={`text-lg font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {service.name}
          </h3>
          <p className={`text-xs mt-2 leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {service.description}
          </p>
        </div>

        {/* Highlights List */}
        <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          {service.highlights.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Price Estimate & Action */}
      <div className={`pt-5 mt-4 border-t flex items-center justify-between gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <div className={`text-[11px] uppercase tracking-wider font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Chi phí tham khảo
          </div>
          <div className={`text-sm font-bold font-mono ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
            {service.priceEstimate}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onBookService(service)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Đặt Lịch Ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

