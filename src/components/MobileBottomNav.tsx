import React from 'react';
import { Home, Grid, Percent, ShoppingBag, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UserAccount } from '../types/shop';

interface MobileBottomNavProps {
  activeTab?: string;
  cartCount: number;
  currentUser?: UserAccount | null;
  onGoHome: () => void;
  onOpenCategories: () => void;
  onOpenInstallment: () => void;
  onOpenCart: () => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  currentUser,
  onGoHome,
  onOpenCategories,
  onOpenInstallment,
  onOpenCart,
  onOpenAccount,
}) => {
  const { isDark } = useTheme();

  return (
    <nav
      aria-label="Điều hướng nhanh trên điện thoại"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t px-2 flex items-center justify-around transition-colors backdrop-blur-lg ${
        isDark
          ? 'bg-slate-950/95 border-slate-800 text-slate-400'
          : 'bg-white/95 border-slate-200 text-slate-600'
      } shadow-[0_-4px_16px_rgba(0,0,0,0.08)]`}
    >
      {/* 1. Trang Chủ */}
      <button
        type="button"
        onClick={onGoHome}
        className="flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] active:scale-95 transition-transform cursor-pointer group"
      >
        <div className="p-1 rounded-lg group-hover:text-sky-500 transition-colors">
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold tracking-tight mt-0.5 group-hover:text-sky-500">
          Trang Chủ
        </span>
      </button>

      {/* 2. Danh Mục */}
      <button
        type="button"
        onClick={onOpenCategories}
        className="flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] active:scale-95 transition-transform cursor-pointer group"
      >
        <div className="p-1 rounded-lg group-hover:text-sky-500 transition-colors">
          <Grid className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold tracking-tight mt-0.5 group-hover:text-sky-500">
          Danh Mục
        </span>
      </button>

      {/* 3. Trả Góp 0% */}
      <button
        type="button"
        onClick={onOpenInstallment}
        className="flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] active:scale-95 transition-transform cursor-pointer group"
      >
        <div className="relative p-1 rounded-lg text-amber-500 group-hover:text-amber-400 transition-colors">
          <Percent className="w-5 h-5" />
          <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-amber-500 text-white text-[8px] font-black rounded-full uppercase leading-none shadow-xs">
            0%
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-tight mt-0.5 text-amber-600 dark:text-amber-400">
          Góp 0%
        </span>
      </button>

      {/* 4. Giỏ Hàng */}
      <button
        type="button"
        onClick={onOpenCart}
        className="flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] active:scale-95 transition-transform cursor-pointer group relative"
      >
        <div className="relative p-1 rounded-lg group-hover:text-sky-500 transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 bg-sky-500 text-white text-[10px] font-black rounded-full flex items-center justify-center tabular-nums shadow-sm animate-bounce">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-tight mt-0.5 group-hover:text-sky-500">
          Giỏ Hàng
        </span>
      </button>

      {/* 5. Tài Khoản */}
      <button
        type="button"
        onClick={onOpenAccount}
        className="flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] active:scale-95 transition-transform cursor-pointer group"
      >
        <div className="p-1 rounded-lg group-hover:text-sky-500 transition-colors">
          {currentUser ? (
            <div className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <span className="text-[10px] font-bold tracking-tight mt-0.5 group-hover:text-sky-500 truncate max-w-[60px]">
          {currentUser ? 'Tôi' : 'Tài Khoản'}
        </span>
      </button>
    </nav>
  );
};
