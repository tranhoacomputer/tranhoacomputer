import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Wrench,
  MapPin,
  Phone,
  Clock,
  LayoutDashboard,
  Flame,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Cpu,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sun,
  Moon,
  Percent,
  User,
  UserCheck,
  LogIn
} from 'lucide-react';
import { StoreSettings, WebsiteContent, UserAccount } from '../types/shop';
import { useTheme } from '../context/ThemeContext';

interface MegaHeaderProps {
  settings: StoreSettings;
  websiteContent?: WebsiteContent;
  currentUser?: UserAccount | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenStoreLocator: () => void;
  onOpenTradeIn: () => void;
  onOpenPCBuilder: () => void;
  onOpenInstallmentModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenUserAccount?: () => void;
  onToggleAdmin: () => void;
  isAdminOpen: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onSelectCategory: (cat: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const MegaHeader: React.FC<MegaHeaderProps> = ({
  settings,
  websiteContent,
  currentUser,
  cartCount,
  onOpenCart,
  onOpenBooking,
  onOpenTracker,
  onOpenStoreLocator,
  onOpenTradeIn,
  onOpenPCBuilder,
  onOpenInstallmentModal,
  onOpenAuthModal,
  onOpenUserAccount,
  onToggleAdmin,
  isAdminOpen,
  searchQuery,
  onSearchChange,
  selectedCity,
  onSelectCity,
  onSelectCategory,
  onScrollToSection,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cities = [
    settings.targetProvince || 'Thái Nguyên',
    'Hà Nội',
    'Bắc Ninh',
    'Bắc Giang',
    'Vĩnh Phúc',
    'Hải Phòng',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
  ];

  const hotKeywords = [
    'Laptop Gaming',
    'MacBook M3',
    'RTX 4070 Ti',
    'Trả góp 0%',
    'Phú Thịnh - Thái Nguyên',
    'PC 15 triệu',
  ];

  const showAnnouncement = websiteContent ? websiteContent.showAnnouncement : true;
  const announcementText = websiteContent?.announcementText || settings.announcementText;

  return (
    <header
      className={`sticky top-0 z-40 w-full text-left transition-colors duration-200 ${
        isDark
          ? 'bg-slate-950 border-b border-slate-800 shadow-xl'
          : 'bg-white border-b border-slate-200 shadow-xs'
      }`}
    >
      {/* 1. TOP MARQUEE PROMOTION BAR */}
      {showAnnouncement && (
        <div
          className={`text-xs py-1.5 px-4 border-b ${
            isDark
              ? 'bg-gradient-to-r from-sky-950 via-slate-900 to-cyan-950 border-slate-800/80 text-slate-300'
              : 'bg-gradient-to-r from-sky-800 via-sky-700 to-cyan-800 border-sky-900 text-white'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span
                className={`flex items-center gap-1 font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded border animate-pulse ${
                  isDark
                    ? 'bg-sky-950/80 text-sky-400 border-sky-700'
                    : 'bg-white text-sky-800 border-sky-300 shadow-xs'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                {settings.targetProvince ? `ĐẶC QUYỀN ${settings.targetProvince.toUpperCase()}` : 'HOT SALE'}
              </span>
              <span className={`truncate font-medium ${isDark ? 'text-slate-200' : 'text-white'}`}>
                {announcementText}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-5 text-[11px] font-semibold shrink-0">
              <span className={`flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-200'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Chính hãng VNA
              </span>
              <span className={`flex items-center gap-1 ${isDark ? 'text-sky-300' : 'text-sky-100'}`}>
                <Truck className="w-3.5 h-3.5" /> Giao {settings.provinceExpressHours || '1-2h'} tại {settings.targetProvince || 'nội thành'}
              </span>
              <button
                type="button"
                onClick={onOpenInstallmentModal}
                className={`flex items-center gap-1 cursor-pointer underline-offset-2 hover:underline ${
                  isDark ? 'text-amber-300' : 'text-amber-200'
                }`}
              >
                <Percent className="w-3.5 h-3.5" /> Trả góp 0% duyệt 5P
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN MEGA HEADER ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Chain Tag */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => onScrollToSection('hero')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName}
                className="h-10 sm:h-11 w-auto max-w-[160px] object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-sky-500/30 ring-2 ring-sky-400/40 shrink-0 group-hover:scale-105 transition-transform">
                {/* Microchip Circuit SVG Overlay */}
                <svg className="absolute inset-0 w-full h-full p-1 opacity-40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 5 L35 14 L35 26 L20 35 L5 26 L5 14 Z" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="4" fill="#ffffff" />
                  <path d="M20 5 L20 16 M20 24 L20 35 M5 14 L16 20 M24 20 L35 26" stroke="#ffffff" strokeWidth="1" />
                </svg>
                <span className="relative z-10 font-mono tracking-tighter text-sm font-black drop-shadow">TH</span>
              </div>
            )}

            <div className="flex flex-col">
              <div className="text-base sm:text-lg font-black tracking-tight font-mono flex items-center gap-1.5 transition-colors">
                <span className={`truncate font-black tracking-wide ${
                  isDark
                    ? 'bg-gradient-to-r from-white via-sky-200 to-cyan-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-slate-950 via-sky-900 to-blue-800 bg-clip-text text-transparent'
                }`}>
                  {settings.storeName || 'TRẦN HOA COMPUTER'}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  PRO
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wider hidden sm:block ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {settings.tagline || `HỆ THỐNG MÁY TÍNH & PHÒNG LAB KỸ THUẬT ${settings.targetProvince?.toUpperCase() || 'HẢI PHÒNG'}`}
              </span>
            </div>
          </button>

          {/* Location Selector (Target Province focus) */}
          <div className="relative hidden xl:block">
            <button
              type="button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
              <div className="text-left">
                <div className={`text-[10px] leading-none ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Khu vực:
                </div>
                <div
                  className={`font-bold leading-none mt-0.5 flex items-center gap-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <span className="text-sky-600 dark:text-sky-400">{selectedCity || settings.targetProvince || 'Hải Phòng'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </button>

            {cityDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-1.5 w-48 rounded-xl shadow-2xl py-1 z-50 border ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 font-mono border-b border-slate-200 dark:border-slate-800">
                  Chọn Tỉnh / Thành Phố
                </div>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      (selectedCity || settings.targetProvince) === city
                        ? isDark
                          ? 'text-sky-400 font-bold bg-slate-800/60'
                          : 'text-sky-700 font-bold bg-sky-50'
                        : isDark
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{city}</span>
                    {city === settings.targetProvince && (
                      <span className="text-[9px] px-1 rounded bg-sky-500 text-white font-mono">
                        Chính
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Smart Search Bar with Hot Keyword tags */}
        <div className="flex-1 max-w-xl mx-2 relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Tìm laptop, PC gaming, card màn hình hay giao hỏa tốc tại ${settings.targetProvince || 'Hải Phòng'}...`}
              className={`w-full rounded-full pl-11 pr-24 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-900 border border-slate-700 focus:border-sky-400 text-white placeholder:text-slate-500'
                  : 'bg-slate-50 border border-slate-300 focus:border-sky-500 focus:bg-white text-slate-900 placeholder:text-slate-500 shadow-inner'
              }`}
            />
            <Search
              className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <button
              type="button"
              onClick={() => onScrollToSection('products')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-sm"
            >
              Tìm Kiếm
            </button>
          </div>

          {/* Hot search suggestions */}
          <div className="flex items-center gap-2 mt-1 px-3 text-[11px] truncate">
            <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Gợi ý:
            </span>
            {hotKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => onSearchChange(kw)}
                className={`transition-colors underline-offset-2 hover:underline truncate font-medium cursor-pointer ${
                  isDark
                    ? 'text-slate-300 hover:text-sky-400'
                    : 'text-slate-700 hover:text-sky-600'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Header Utilities Group */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* HOTLINE MIỄN PHÍ */}
          {/* Hotline 24/7 (0963284044) */}
          <a
            href={`tel:${(settings.hotline || '0963284044').replace(/\s+/g, '')}`}
            className={`hidden 2xl:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-500'
            }`}
            title={`Gọi Hotline tư vấn miễn phí: ${settings.hotline || '0963284044'}`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-none">
              <div className="text-[9px] text-slate-400 font-medium">Tư Vấn Cửa Hàng</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">{settings.hotline || '0963284044'}</div>
            </div>
          </a>

          {/* CƠ SỞ DUY NHẤT */}
          <button
            type="button"
            onClick={onOpenStoreLocator}
            className={`hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-500'
            }`}
            title="Địa chỉ duy nhất tại Phú Thịnh - Thái Nguyên"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="text-left leading-none">
              <div className="text-[9px] text-amber-500 font-bold">Cơ Sở Duy Nhất</div>
              <div className="text-xs font-bold mt-0.5">Phú Thịnh - TN</div>
            </div>
          </button>

          {/* TRA CỨU ĐƠN HÀNG */}
          <button
            type="button"
            onClick={onOpenTracker}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-500'
            }`}
            title="Tra cứu đơn hàng hoặc tiến độ sửa máy"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Tra Cứu</span>
          </button>

          {/* Theme Mode Toggle (Chế độ Sáng / Chế độ Tối) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-sky-300 border-slate-700 shadow-xs'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200 shadow-xs'
            }`}
            title={isDark ? 'Chuyển sang Chế độ Sáng (nền trắng)' : 'Chuyển sang Chế độ Tối (nền đen)'}
            aria-label="Đổi giao diện Sáng / Tối"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="hidden xl:inline">Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-600 fill-sky-600" />
                <span className="hidden xl:inline">Tối</span>
              </>
            )}
          </button>

          {/* TRẢ GÓP 0% QUICK BUTTON */}
          {onOpenInstallmentModal && (
            <button
              type="button"
              onClick={onOpenInstallmentModal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
              }`}
              title="Mua trả góp 0% lãi suất qua CCCD hoặc Thẻ tín dụng"
            >
              <Percent className="w-4 h-4 text-amber-500" />
              <span>Trả Góp 0%</span>
            </button>
          )}

          {/* USER ACCOUNT / LOGIN BUTTON */}
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenUserAccount}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
                  : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-slate-900'
              }`}
              title="Quản lý tài khoản & lịch sử đơn hàng"
            >
              <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-[10px] text-slate-400 leading-none">Thành viên</div>
                <div className="text-xs font-bold leading-none mt-1 truncate max-w-[90px]">
                  {currentUser.name}
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Đăng nhập hoặc đăng ký tài khoản nhanh"
            >
              <LogIn className="w-4 h-4 text-sky-500" />
              <span className="hidden sm:inline">Đăng Nhập</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-sky-500/20"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline">Giỏ Hàng</span>
            {cartCount > 0 && (
              <span className="bg-white text-sky-700 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Switch */}
          <button
            type="button"
            onClick={onToggleAdmin}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isAdminOpen
                ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                : isDark
                ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
            title="Trang Quản Trị Hệ Thống (Admin Control Panel)"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. SUB-NAV STRIP (CATEGORIES & RETAIL ECOSYSTEM SHORTCUTS) */}
      <div
        className={`border-t px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800/80 text-slate-300'
            : 'bg-sky-50/70 border-slate-200 text-slate-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 text-xs font-bold whitespace-nowrap">
          {/* Trả góp 0% */}
          {onOpenInstallmentModal && (
            <button
              type="button"
              onClick={onOpenInstallmentModal}
              className={`flex items-center gap-1.5 cursor-pointer font-bold ${
                isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>Trả Góp 0% Lãi Suất (Duyệt 5P)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onScrollToSection('flash-sale')}
            className={`flex items-center gap-1.5 cursor-pointer ${
              isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-700 hover:text-sky-800'
            }`}
          >
            <Flame className="w-4 h-4 fill-current text-sky-500" />
            <span>Giờ Vàng Giá Sốc</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('laptop')}
            className={`transition-colors cursor-pointer ${
              isDark ? 'hover:text-white' : 'hover:text-sky-700'
            }`}
          >
            Laptop Chính Hãng
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('pc_gaming')}
            className={`transition-colors cursor-pointer ${
              isDark ? 'hover:text-white' : 'hover:text-sky-700'
            }`}
          >
            PC Gaming Lắp Ráp
          </button>

          <button
            type="button"
            onClick={onOpenPCBuilder}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'text-sky-300 hover:text-sky-200' : 'text-sky-700 hover:text-sky-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Build PC Theo Ngân Sách</span>
          </button>

          <button
            type="button"
            onClick={onOpenTradeIn}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thu Cũ Đổi Mới (Trợ giá 5TR)</span>
          </button>

          <button
            type="button"
            onClick={() => onScrollToSection('services')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Sửa Chữa & Phòng Lab (30P Lấy Ngay)</span>
          </button>

          <button
            type="button"
            onClick={onOpenStoreLocator}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'hover:text-white' : 'hover:text-sky-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span>Hệ Thống 38 Showroom</span>
          </button>

          <button
            type="button"
            onClick={onOpenTracker}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'hover:text-white' : 'hover:text-sky-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>Tra Cứu Tiến Độ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
