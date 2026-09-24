import React, { useState } from 'react';
import { ShoppingBag, Search, Wrench, ShieldCheck, Menu, X, LayoutDashboard, Clock } from 'lucide-react';
import { StoreSettings } from '../types/shop';

interface NavbarProps {
  settings: StoreSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onToggleAdmin: () => void;
  isAdminOpen: boolean;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenBooking,
  onOpenTracker,
  onToggleAdmin,
  isAdminOpen,
  activeSection,
  onNavigateSection,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Announcement Bar */}
      {bannerVisible && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-indigo-200 border-b border-indigo-900/50 px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex-1 flex items-center justify-center gap-2 text-center truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">{settings.announcementText}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors shrink-0 ml-2"
            aria-label="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (isAdminOpen) onToggleAdmin();
              onNavigateSection('hero');
            }}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors font-mono">
              NEXUS<span className="text-indigo-500">.</span>TECH
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => {
              if (isAdminOpen) onToggleAdmin();
              onNavigateSection('hero');
            }}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeSection === 'hero' && !isAdminOpen ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Trang chủ
          </button>
          <button
            type="button"
            onClick={() => {
              if (isAdminOpen) onToggleAdmin();
              onNavigateSection('products');
            }}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeSection === 'products' && !isAdminOpen ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Sản phẩm & Linh kiện
          </button>
          <button
            type="button"
            onClick={() => {
              if (isAdminOpen) onToggleAdmin();
              onNavigateSection('services');
            }}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeSection === 'services' && !isAdminOpen ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Dịch vụ sửa chữa
          </button>
          <button
            type="button"
            onClick={onOpenTracker}
            className="cursor-pointer transition-colors hover:text-white flex items-center gap-1.5 text-slate-300"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tra cứu tiến độ</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (isAdminOpen) onToggleAdmin();
              onNavigateSection('contact');
            }}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeSection === 'contact' && !isAdminOpen ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Showroom & Liên hệ
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Toggle / Input */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tìm PC, Laptop, RTX 4070..."
                  autoFocus
                  className="bg-transparent text-xs sm:text-sm text-white focus:outline-none w-36 sm:w-48 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(false)}
                  className="text-slate-400 hover:text-white ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                title="Tìm kiếm sản phẩm"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Repair Booking Button */}
          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-950" />
            <span>Đặt Lịch Sửa Chữa</span>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Control Switcher */}
          <button
            type="button"
            onClick={onToggleAdmin}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              isAdminOpen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
            }`}
            title="Khu vực Quản trị Toàn Quyền"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isAdminOpen ? 'Xem Cửa Hàng' : 'Quản Trị Admin'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-900 cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => {
                if (isAdminOpen) onToggleAdmin();
                onNavigateSection('hero');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              Trang chủ
            </button>
            <button
              type="button"
              onClick={() => {
                if (isAdminOpen) onToggleAdmin();
                onNavigateSection('products');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              Sản phẩm & Linh kiện
            </button>
            <button
              type="button"
              onClick={() => {
                if (isAdminOpen) onToggleAdmin();
                onNavigateSection('services');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              Dịch vụ sửa chữa kỹ thuật
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-indigo-400 hover:bg-slate-900 rounded-lg font-medium"
            >
              Tra cứu tiến độ sửa máy
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-amber-400 hover:bg-slate-900 rounded-lg font-medium"
            >
              Đặt lịch sửa chữa ngay
            </button>
            <button
              type="button"
              onClick={() => {
                if (isAdminOpen) onToggleAdmin();
                onNavigateSection('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              Showroom & Liên hệ
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
