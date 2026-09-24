import React from 'react';
import { ShoppingCart, Eye, Star, Check, Gift, ArrowRightLeft } from 'lucide-react';
import { Product } from '../types/shop';
import { formatVND } from '../db/storage';
import { TechVisual } from './TechVisual';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onCompare?: (product: Product) => void;
  onOpenInstallment?: (product: Product) => void;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  onCompare,
  onOpenInstallment,
  isCompared = false,
}) => {
  const { isDark } = useTheme();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const getCategoryLabel = (cat: Product['category']) => {
    switch (cat) {
      case 'pc_gaming':
        return 'PC Lắp Ráp';
      case 'laptop':
        return 'Laptop';
      case 'component':
        return 'Linh Kiện';
      case 'accessory':
        return 'Phụ Kiện';
      default:
        return 'Sản phẩm';
    }
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className={`group rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 cursor-pointer text-left ${
        isDark
          ? 'bg-slate-900 border border-slate-800 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-950/30'
          : 'bg-white border border-slate-200 hover:border-sky-400 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Visual Image Slot */}
      <div className={`relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-sky-50/40'}`}>
        <TechVisual
          category={product.category}
          name={product.name}
          badge={product.badge}
          className="w-full h-48 sm:h-52"
        />

        {/* Top Badges: Discount & Installment 0% */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="text-[10px] font-bold text-white bg-sky-600 px-2 py-0.5 rounded font-mono shadow-sm">
              Giảm {product.discountPercent}%
            </span>
          ) : product.badge ? (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isDark
                  ? 'text-sky-300 bg-sky-950/90 border-sky-800'
                  : 'text-sky-800 bg-sky-50 border-sky-300'
              }`}
            >
              {product.badge}
            </span>
          ) : null}

          {product.installmentZero && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenInstallment) onOpenInstallment(product);
              }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                isDark
                  ? 'text-amber-300 bg-amber-950/90 border-amber-800/80 hover:bg-amber-900'
                  : 'text-amber-800 bg-amber-50 border-amber-300 hover:bg-amber-100'
              }`}
              title="Xem bảng tính trả góp 0%"
            >
              Góp 0% Duyệt 5P
            </button>
          )}
        </div>

        {/* Stock status indicator */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs ${
            product.inStock
              ? isDark
                ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/60'
                : 'text-emerald-700 bg-emerald-50 border border-emerald-300'
              : isDark
              ? 'text-slate-400 bg-slate-900/80'
              : 'text-slate-600 bg-slate-100 border border-slate-300'
          }`}
        >
          {product.inStock ? `Còn ${product.stockCount} máy` : 'Tạm hết hàng'}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
        {/* Brand & Category line */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span
              className={`uppercase tracking-wider text-[10px] font-bold font-mono ${
                isDark ? 'text-sky-400' : 'text-sky-700'
              }`}
            >
              {product.brand || getCategoryLabel(product.category)}
            </span>
            <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-400'}>
              ·
            </span>
            <span className={`text-[11px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Bảo hành {product.specs.warranty?.split(' ')[0] || '24'}T
            </span>
          </div>

          <span className="flex items-center text-amber-500 text-[11px] font-bold shrink-0">
            <Star className="w-3 h-3 fill-amber-500 mr-0.5 inline" />
            {product.rating}
          </span>
        </div>

        {/* Product Title */}
        <h3
          className={`text-sm sm:text-base font-bold transition-colors line-clamp-2 leading-snug ${
            isDark
              ? 'text-white group-hover:text-sky-300'
              : 'text-slate-900 group-hover:text-sky-600'
          }`}
        >
          {product.name}
        </h3>

        {/* Core Specs Snippet */}
        <div className="flex flex-wrap gap-1 text-[11px] font-mono">
          {product.specs.cpu && (
            <span
              className={`px-2 py-0.5 rounded border truncate max-w-[150px] font-medium ${
                isDark
                  ? 'bg-slate-950 text-slate-200 border-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {product.specs.cpu.split('(')[0]}
            </span>
          )}
          {product.specs.ram && (
            <span
              className={`px-2 py-0.5 rounded border font-medium ${
                isDark
                  ? 'bg-slate-950 text-slate-200 border-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {product.specs.ram.split(' ')[0]}
            </span>
          )}
          {product.specs.gpu && (
            <span
              className={`px-2 py-0.5 rounded border truncate max-w-[140px] font-medium ${
                isDark
                  ? 'bg-slate-950 text-slate-200 border-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {product.specs.gpu.split(' ')[0]} {product.specs.gpu.split(' ')[1]}
            </span>
          )}
          {product.specs.storage && (
            <span
              className={`px-2 py-0.5 rounded border truncate max-w-[120px] font-medium ${
                isDark
                  ? 'bg-slate-950 text-slate-200 border-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {product.specs.storage.split(' ')[0]} {product.specs.storage.split(' ')[1]}
            </span>
          )}
        </div>

        {/* Gift promo badge */}
        {product.giftPromotion && (
          <div
            className={`p-2 rounded-lg border flex items-start gap-1.5 text-[11px] ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-amber-300'
                : 'bg-amber-50/80 border-amber-200 text-amber-900 font-medium'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{product.giftPromotion}</span>
          </div>
        )}

        {/* Price & Action Row */}
        <div
          className={`pt-2.5 flex items-center justify-between gap-2 border-t ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div>
            <div
              className={`text-base sm:text-lg font-black font-mono tabular-nums leading-none ${
                isDark ? 'text-sky-400' : 'text-sky-600'
              }`}
            >
              {formatVND(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div
                className={`text-[11px] line-through font-mono tabular-nums mt-1 ${
                  isDark ? 'text-slate-500' : 'text-slate-500 font-medium'
                }`}
              >
                {formatVND(product.originalPrice)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare(product);
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer text-xs ${
                  isCompared
                    ? 'bg-sky-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                }`}
                title="So sánh với sản phẩm khác"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
              }`}
              title="Xem thông số kỹ thuật"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : product.inStock
                  ? 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã Thêm</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Mua Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

