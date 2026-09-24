import React from 'react';
import { X, ArrowRightLeft, ShoppingBag } from 'lucide-react';
import { Product } from '../types/shop';
import { formatVND } from '../db/storage';
import { TechVisual } from './TechVisual';
import { useTheme } from '../context/ThemeContext';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (p: Product) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
}) => {
  const { isDark } = useTheme();

  if (!isOpen || products.length < 2) return null;

  const [p1, p2] = products.slice(0, 2);

  const specRows = [
    { label: 'Thương hiệu', val1: p1.brand || 'CHÍNH HÃNG', val2: p2.brand || 'CHÍNH HÃNG' },
    { label: 'Giá ưu đãi', val1: formatVND(p1.price), val2: formatVND(p2.price), isPrice: true },
    { label: 'Trả góp', val1: p1.installmentZero ? 'Trả góp 0%' : 'Lãi suất chuẩn', val2: p2.installmentZero ? 'Trả góp 0%' : 'Lãi suất chuẩn' },
    { label: 'Vi xử lý (CPU)', val1: p1.specs.cpu || '—', val2: p2.specs.cpu || '—' },
    { label: 'Card đồ họa (GPU)', val1: p1.specs.gpu || '—', val2: p2.specs.gpu || '—' },
    { label: 'Bộ nhớ RAM', val1: p1.specs.ram || '—', val2: p2.specs.ram || '—' },
    { label: 'Ổ cứng SSD', val1: p1.specs.storage || '—', val2: p2.specs.storage || '—' },
    { label: 'Màn hình hiển thị', val1: p1.specs.screen || 'Cần xuất màn rời', val2: p2.specs.screen || 'Cần xuất màn rời' },
    { label: 'Trọng lượng / Case', val1: p1.specs.weight || p1.specs.case || '—', val2: p2.specs.weight || p2.specs.case || '—' },
    { label: 'Bảo hành chính hãng', val1: p1.specs.warranty || '24 Tháng', val2: p2.specs.warranty || '24 Tháng' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-left">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between border-b pb-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border ${
                isDark
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  : 'bg-sky-50 text-sky-600 border-sky-200'
              }`}
            >
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <div
                className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-sky-400' : 'text-sky-600'
                }`}
              >
                CÔNG CỤ ĐỐI CHIẾU THÔNG SỐ
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                So Sánh Cấu Hình Chi Tiết
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side by side comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <th
                  className={`p-3 w-1/4 font-mono uppercase text-[11px] font-bold ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Thông số
                </th>
                <th className="p-3 w-3/8">
                  <div
                    className={`h-32 rounded-xl p-2 mb-2 flex items-center justify-center border ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/50 border-sky-100'
                    }`}
                  >
                    <TechVisual category={p1.category} name={p1.name} className="w-full h-full" />
                  </div>
                  <div className={`font-bold text-sm line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {p1.name}
                  </div>
                  <div
                    className={`font-black font-mono text-base mt-1 ${
                      isDark ? 'text-sky-400' : 'text-sky-600'
                    }`}
                  >
                    {formatVND(p1.price)}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(p1);
                      onClose();
                    }}
                    className="mt-2 w-full py-1.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Chọn Mua</span>
                  </button>
                </th>
                <th
                  className={`p-3 w-3/8 border-l ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div
                    className={`h-32 rounded-xl p-2 mb-2 flex items-center justify-center border ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/50 border-sky-100'
                    }`}
                  >
                    <TechVisual category={p2.category} name={p2.name} className="w-full h-full" />
                  </div>
                  <div className={`font-bold text-sm line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {p2.name}
                  </div>
                  <div
                    className={`font-black font-mono text-base mt-1 ${
                      isDark ? 'text-sky-400' : 'text-sky-600'
                    }`}
                  >
                    {formatVND(p2.price)}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(p2);
                      onClose();
                    }}
                    className="mt-2 w-full py-1.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Chọn Mua</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {specRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    idx % 2 === 0
                      ? isDark
                        ? 'bg-slate-950/40'
                        : 'bg-sky-50/30'
                      : ''
                  }
                >
                  <td
                    className={`p-3 font-semibold font-mono text-[11px] ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {row.label}
                  </td>
                  <td
                    className={`p-3 font-medium ${
                      row.isPrice
                        ? isDark
                          ? 'font-bold font-mono text-sky-400'
                          : 'font-bold font-mono text-sky-600'
                        : isDark
                        ? 'text-slate-200'
                        : 'text-slate-900'
                    }`}
                  >
                    {row.val1}
                  </td>
                  <td
                    className={`p-3 border-l font-medium ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    } ${
                      row.isPrice
                        ? isDark
                          ? 'font-bold font-mono text-sky-400'
                          : 'font-bold font-mono text-sky-600'
                        : isDark
                        ? 'text-slate-200'
                        : 'text-slate-900'
                    }`}
                  >
                    {row.val2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

