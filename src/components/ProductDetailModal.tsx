import React, { useState } from 'react';
import { X, ShoppingCart, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Product } from '../types/shop';
import { formatVND } from '../db/storage';
import { TechVisual } from './TechVisual';
import { useTheme } from '../context/ThemeContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenInstallment?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenInstallment,
}) => {
  const { isDark } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl text-left border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors cursor-pointer border ${
            isDark
              ? 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border-slate-700'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200 shadow-xs'
          }`}
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Visual Showcase */}
          <div className="space-y-4">
            <div
              className={`rounded-2xl overflow-hidden border p-3 flex items-center justify-center ${
                isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-sky-50/40'
              }`}
            >
              <TechVisual
                category={product.category}
                name={product.name}
                badge={product.badge}
                className="w-full h-64"
              />
            </div>

            {/* Quality Commitment Trust Badges */}
            <div
              className={`p-4 rounded-2xl space-y-2.5 text-xs border ${
                isDark
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                  : 'bg-sky-50/50 border-sky-100 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cam kết chính hãng 100% · Bảo hành 1 đổi 1</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Giao hàng siêu tốc trong 2 giờ tại nội thành</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Đổi trả miễn phí 7 ngày nếu lỗi phần cứng</span>
              </div>
            </div>
          </div>

          {/* Details & Specs Sheet */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              <div
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isDark ? 'text-sky-400' : 'text-sky-600'
                }`}
              >
                {product.category.replace('_', ' ')}
              </div>
              <h2
                className={`text-xl font-bold mt-1 leading-snug ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className={`text-2xl font-extrabold font-mono tabular-nums ${
                    isDark ? 'text-sky-400' : 'text-sky-600'
                  }`}
                >
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-500 line-through font-mono tabular-nums font-medium">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className={`mt-3 text-xs sm:text-sm leading-relaxed font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {product.description}
              </p>

              {/* Specs Table */}
              <div className="mt-5 space-y-2">
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}
                >
                  Thông Số Kỹ Thuật Chi Tiết
                </div>
                <div
                  className={`divide-y rounded-xl overflow-hidden border text-xs font-mono ${
                    isDark
                      ? 'divide-slate-800 border-slate-800 bg-slate-950/50'
                      : 'divide-slate-200 border-slate-200 bg-slate-50'
                  }`}
                >
                  {Object.entries(product.specs).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <div key={key} className="flex px-3 py-2">
                        <span
                          className={`w-28 capitalize shrink-0 font-semibold ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {key}:
                        </span>
                        <span className={isDark ? 'text-slate-200' : 'text-slate-900 font-medium'}>
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div
              className={`pt-4 border-t flex items-center gap-3 ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div
                className={`flex items-center rounded-xl border ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white'
                    : 'border-slate-200 bg-slate-100 text-slate-900'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`px-3 py-1.5 font-bold transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-mono font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className={`px-3 py-1.5 font-bold transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : product.inStock
                    ? 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-md'
                    : isDark
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã Thêm Vào Giỏ Hàng!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm Vào Giỏ · {formatVND(product.price * quantity)}</span>
                  </>
                )}
              </button>

              {onOpenInstallment && product.inStock && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenInstallment(product);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Trả Góp 0%</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

