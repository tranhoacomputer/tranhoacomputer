import React, { useState, useEffect } from 'react';
import {
  loadDatabase,
  subscribeToDatabaseChanges,
  formatVND,
} from './db/storage';
import { ShopDatabase, Product, ServiceItem, CartItem, UserAccount } from './types/shop';
import { useTheme } from './context/ThemeContext';
import { MegaHeader } from './components/MegaHeader';
import { MegaMenuHero } from './components/MegaMenuHero';
import { FlashSaleSection } from './components/FlashSaleSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ServiceCard } from './components/ServiceCard';
import { BookingModal } from './components/BookingModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { TradeInModal } from './components/TradeInModal';
import { PCBuilderModal } from './components/PCBuilderModal';
import { StoreLocatorModal } from './components/StoreLocatorModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { InstallmentModal } from './components/InstallmentModal';
import { AuthModal } from './components/AuthModal';
import { UserAccountModal } from './components/UserAccountModal';
import { TechStoreRichContent } from './components/TechStoreRichContent';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { Footer } from './components/Footer';
import {
  Wrench,
  ShieldCheck,
  Cpu,
  MapPin,
  Phone,
  Clock,
  Mail,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  ArrowRightLeft,
  X,
  CreditCard,
  Truck,
  Flame,
  Award,
  Percent,
} from 'lucide-react';

export function App() {
  const { isDark } = useTheme();
  const [db, setDb] = useState<ShopDatabase>(() => loadDatabase());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(() => db.settings.targetProvince || 'Hải Phòng');

  // Product filtering, brands & sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  // Comparison State (like TGDD / FPT Shop)
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerInitialCode, setTrackerInitialCode] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isPCBuilderOpen, setIsPCBuilderOpen] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);

  // Installment & Auth Modals state
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);
  const [installmentProduct, setInstallmentProduct] = useState<Product | null>(null);
  const [installmentCartItems, setInstallmentCartItems] = useState<CartItem[] | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserAccountOpen, setIsUserAccountOpen] = useState(false);

  // Cart state stored in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Reactive DB subscription
  useEffect(() => {
    const unsubscribe = subscribeToDatabaseChanges((updatedDb) => {
      setDb(updatedDb);
    });
    return unsubscribe;
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_cart_items', JSON.stringify(cart));
  }, [cart]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
          specsSnippet: product.specs.cpu || product.specs.gpu || Object.values(product.specs)[0],
        },
      ];
    });

    setToastMsg(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Compare Handler
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 2) {
        setToastMsg('Bạn chỉ có thể so sánh tối đa 2 sản phẩm cùng lúc');
        setTimeout(() => setToastMsg(null), 2500);
        return [prev[1], product];
      }
      return [...prev, product];
    });
  };

  // Filtered Products
  const brandsList = ['all', 'ASUS', 'Apple', 'Lenovo', 'Dell', 'NEXUS', 'Samsung', 'Logitech'];

  const filteredProducts = db.products
    .filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesSpecs = Object.values(p.specs).some((v) => v?.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesSpecs) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  const cartTotalCount = cart.reduce((s, i) => s + i.quantity, 0);

  // If Admin panel is open, render Admin workspace
  if (isAdminOpen) {
    return (
      <AdminPanel
        db={db}
        onExitAdmin={() => setIsAdminOpen(false)}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col pb-16 lg:pb-0 selection:bg-sky-500 selection:text-white transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Toast Notification (Relocated to top right with close button, preventing obstruction of bottom floating actions) */}
      {toastMsg && (
        <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-sky-500/80 backdrop-blur-md animate-in slide-in-from-top-3">
          <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="max-w-xs">{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="ml-2 text-slate-400 hover:text-white p-1 rounded cursor-pointer transition-colors"
            title="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Product Comparison Dock (TGDD / FPT Shop feature) */}
      {comparedProducts.length > 0 && (
        <div
          className={`fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-md text-xs font-semibold border-2 border-sky-500 ${
            isDark ? 'bg-slate-900/95 text-white' : 'bg-white/95 text-slate-900 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-sky-500" />
            <span>Đang so sánh ({comparedProducts.length}/2 sản phẩm)</span>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.map((p) => (
              <span
                key={p.id}
                className={`px-2.5 py-1 rounded-lg border max-w-[150px] truncate text-[11px] font-bold ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-200'
                    : 'bg-sky-50 border-sky-200 text-sky-900'
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length >= 2 ? (
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Xem So Sánh Chi Tiết
              </button>
            ) : (
              <span className={`text-[11px] italic font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                (Chọn thêm 1 sản phẩm để đối chiếu)
              </span>
            )}
            <button
              type="button"
              onClick={() => setComparedProducts([])}
              className={`p-1 cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              title="Đóng so sánh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. MEGA TOP HEADER (Location, Smart Search, Utilities, Hot Links) */}
      <MegaHeader
        settings={db.settings}
        websiteContent={db.websiteContent}
        currentUser={db.currentUser}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => {
          setBookingService(null);
          setIsBookingOpen(true);
        }}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
        onOpenInstallmentModal={() => {
          setInstallmentProduct(null);
          setInstallmentCartItems(cart);
          setIsInstallmentOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenUserAccount={() => setIsUserAccountOpen(true)}
        onToggleAdmin={() => setIsAdminOpen(true)}
        isAdminOpen={isAdminOpen}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToSection={(secId) => {
          document.getElementById(secId)?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. MEGA MENU & HERO CAMPAIGN SLIDER (Left menu + Center slider + Right mini banners) */}
      {db.websiteContent?.sectionVisibility?.showHeroSlider !== false && (
        <MegaMenuHero
          settings={db.settings}
          banners={db.banners}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenTradeIn={() => setIsTradeInOpen(true)}
          onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
          onOpenBooking={() => {
            setBookingService(null);
            setIsBookingOpen(true);
          }}
          onExploreFlashSale={() => {
            document.getElementById('flash-sale')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenInstallment={() => {
            setInstallmentProduct(null);
            setInstallmentCartItems(cart.length > 0 ? cart : undefined);
            setIsInstallmentOpen(true);
          }}
        />
      )}

      {/* 3. FLASH SALE "GIỜ VÀNG GIÁ SỐC" WITH LIVE COUNTDOWN TIMER */}
      {db.websiteContent?.sectionVisibility?.showFlashSale !== false && db.websiteContent?.flashSaleActive !== false && (
        <FlashSaleSection
          products={db.products}
          title={db.websiteContent?.flashSaleTitle}
          subtitle={db.websiteContent?.flashSaleSubtitle}
          hours={db.websiteContent?.flashSaleHours}
          onAddToCart={handleAddToCart}
          onViewDetails={(p) => setSelectedProduct(p)}
          onOpenInstallment={(p) => {
            setInstallmentProduct(p);
            setIsInstallmentOpen(true);
          }}
        />
      )}

      {/* 4. MAIN CONTENT WORKSPACE */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 w-full text-left">
        {/* BANNER ĐẶC QUYỀN BÁN HÀNG TỈNH / THÀNH PHỐ */}
        {db.websiteContent?.sectionVisibility?.showShowroomsStrip !== false && (
          <div
            className={`p-5 sm:p-6 rounded-3xl border transition-all ${
              isDark
                ? 'bg-gradient-to-r from-sky-950/40 via-slate-900 to-cyan-950/40 border-sky-900/40 shadow-xl'
                : 'bg-gradient-to-r from-sky-50 via-white to-cyan-50 border-sky-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-sky-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base sm:text-lg font-black font-mono uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Trung Tâm Phân Phối Trọng Điểm: {db.settings.targetProvince || 'Hải Phòng'}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Phục Vụ 24/7
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {db.settings.provinceDeliveryNotice || `Giao hỏa tốc 1 - 2 giờ toàn bộ nội thành ${db.settings.targetProvince || 'Hải Phòng'} · Hỗ trợ kỹ thuật viên kiểm tra tận nơi`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setInstallmentProduct(null);
                    setInstallmentCartItems(cart);
                    setIsInstallmentOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Trả Góp 0% Lãi Suất</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsStoreLocatorOpen(true)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>Xem Showroom Trực Tiếp</span>
                </button>
              </div>
            </div>

            {/* 4 Phương thức phục vụ chuẩn tỉnh thành */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-sky-950/80 text-sky-400' : 'bg-sky-100 text-sky-700'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Mua Tại Cửa Hàng</div>
                  <div className={`text-[11px] mt-0.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Trải nghiệm máy thực tế tại showroom, kỹ thuật viên cài phần mềm miễn phí
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-sky-950/80 text-sky-400' : 'bg-sky-100 text-sky-700'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Hỏa Tốc {db.settings.provinceExpressHours || '1-2H'}</div>
                  <div className={`text-[11px] mt-0.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Giao nhanh nội thành {db.settings.targetProvince || 'Hải Phòng'}, miễn phí ship từ {formatVND(db.settings.provinceFreeShipThreshold || 500000)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>3. Ship COD & VietQR</div>
                  <div className={`text-[11px] mt-0.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Đồng kiểm trước khi thanh toán, hỗ trợ tiền mặt hoặc quét mã VietQR 24/7
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-amber-950/80 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>4. Trả Góp 0% Lãi Suất</div>
                  <div className={`text-[11px] mt-0.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Duyệt hồ sơ online 5 phút qua CCCD hoặc thẻ tín dụng. Hotline: {db.settings.installmentHotline || db.settings.hotline}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCT CATALOG SECTION ================= */}
        {db.websiteContent?.sectionVisibility?.showCatalog !== false && (
        <section id="products" className="space-y-6 scroll-mt-24">
          {/* Section Header */}
          <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <div>
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider ${
                  isDark ? 'text-sky-400' : 'text-sky-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{db.websiteContent?.catalogBadge || 'KHO HÀNG CHÍNH HÃNG VNA - 38 SIÊU THỊ'}</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {db.websiteContent?.catalogTitle || 'Laptop, PC Gaming & Linh Kiện Tuyển Chọn'}
              </h2>
              <p className={`text-xs sm:text-sm mt-1 max-w-xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {db.websiteContent?.catalogSubtitle || 'Tất cả sản phẩm đều được kiểm tra nhiệt độ kỹ lưỡng, cài sẵn Windows bản quyền và bảo hành 1 đổi 1 tận nơi.'}
              </p>
            </div>

            {/* Filter Tabs & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`flex items-center rounded-2xl p-1 text-xs border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'laptop', label: 'Laptop' },
                  { id: 'pc_gaming', label: 'PC Lắp Ráp' },
                  { id: 'component', label: 'Linh Kiện' },
                  { id: 'accessory', label: 'Phụ Kiện' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                      selectedCategory === tab.id
                        ? 'bg-sky-500 text-white shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div
                className={`flex items-center rounded-2xl px-3 py-1.5 text-xs border ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`bg-transparent focus:outline-none cursor-pointer font-semibold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <option value="default" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    Sắp xếp mặc định
                  </option>
                  <option value="price_asc" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    Giá: Thấp đến Cao
                  </option>
                  <option value="price_desc" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    Giá: Cao đến Thấp
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand Filter Pills (TGDD / FPT Shop Signature) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className={`text-xs font-bold shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Thương hiệu:
            </span>
            {brandsList.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-xs'
                }`}
              >
                {brand === 'all' ? 'Tất cả thương hiệu' : brand}
              </button>
            ))}
          </div>

          {/* Product Grid: 3-column desktop */}
          {filteredProducts.length === 0 ? (
            <div
              className={`py-16 text-center rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
              }`}
            >
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Không tìm thấy sản phẩm phù hợp với bộ lọc
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(p) => setSelectedProduct(p)}
                  onCompare={handleToggleCompare}
                  isCompared={comparedProducts.some((p) => p.id === product.id)}
                  onOpenInstallment={(p) => {
                    setInstallmentProduct(p);
                    setIsInstallmentOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </section>
        )}

        {/* ================= REPAIR SERVICES & LAB SECTION ================= */}
        {db.websiteContent?.sectionVisibility?.showServices !== false && (
        <section id="services" className="space-y-6 pt-4 scroll-mt-24">
          <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-5 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>{db.websiteContent?.servicesBadge || 'TRUNG TÂM KỸ THUẬT TIÊU CHUẨN ISO'}</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {db.websiteContent?.servicesTitle || 'Dịch Vụ Sửa Chữa & Bảo Dưỡng Máy Tính Lấy Liền'}
              </h2>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {db.websiteContent?.servicesSubtitle || 'Khách hàng quan sát trực tiếp kỹ thuật viên thao tác trong 30-60 phút. Ký tên lên từng linh kiện, cam kết không tráo đổi đồ.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setBookingService(null);
                setIsBookingOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md whitespace-nowrap"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Đặt Lịch Khám Máy Lấy Ngay</span>
            </button>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {db.services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookService={(srv) => {
                  setBookingService(srv);
                  setIsBookingOpen(true);
                }}
              />
            ))}
          </div>

          {/* Retail Chain Trust Pledges (4 Badges) */}
          {db.websiteContent?.sectionVisibility?.showTrustPledges !== false && (
          <div
            className={`mt-8 p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {(db.websiteContent?.trustPledges && db.websiteContent.trustPledges.length > 0
              ? db.websiteContent.trustPledges
              : [
                  { id: 'p1', title: '100% Minh Bạch', description: 'Báo giá trước khi sửa chữa. Khách hàng ký nhận bo mạch và linh kiện.', iconType: 'shield' },
                  { id: 'p2', title: 'Lấy Liền 30-60 Phút', description: 'Xử lý sự cố phần cứng, thay màn hình, vệ sinh máy ngay tại phòng lab mở.', iconType: 'clock' },
                  { id: 'p3', title: 'Trả Góp 0% Lãi Suất', description: 'Hỗ trợ trả góp qua thẻ tín dụng và CCCD gắn chip chỉ 5 phút duyệt.', iconType: 'card' },
                  { id: 'p4', title: '1 Đổi 1 Trong 30 Ngày', description: 'Lỗi phần cứng do nhà sản xuất được đổi máy mới ngay lập tức.', iconType: 'award' },
                ]
            ).map((pledge, pIdx) => {
              const icons = [ShieldCheck, Clock, CreditCard, Award];
              const IconComp = icons[pIdx % icons.length];
              const colorClasses = [
                isDark ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
                isDark ? 'bg-sky-950 text-sky-400 border-sky-800/60' : 'bg-sky-50 text-sky-600 border-sky-200',
                isDark ? 'bg-sky-950 text-sky-400 border-sky-800/60' : 'bg-sky-50 text-sky-600 border-sky-200',
                isDark ? 'bg-amber-950 text-amber-400 border-amber-800/60' : 'bg-amber-50 text-amber-600 border-amber-200',
              ];
              return (
                <div key={pledge.id || pIdx} className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-2xl shrink-0 border ${colorClasses[pIdx % colorClasses.length]}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {pledge.title}
                    </h4>
                    <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {pledge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </section>
        )}

        {/* ================= COMPREHENSIVE STORE CONTENT & BUYING GUIDES ================= */}
        {db.websiteContent?.sectionVisibility?.showTechArticles !== false && (
        <TechStoreRichContent
          settings={db.settings}
          onSelectBrand={(brand) => {
            setSelectedBrand(brand);
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenInstallmentModal={() => {
            setInstallmentProduct(null);
            setInstallmentCartItems(cart.length > 0 ? cart : undefined);
            setIsInstallmentOpen(true);
          }}
          onOpenBookingModal={() => {
            setBookingService(null);
            setIsBookingOpen(true);
          }}
          onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
        />
        )}

      </main>

      {/* Upgraded Professional Global Footer */}
      <Footer
        settings={db.settings}
        websiteContent={db.websiteContent}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenBooking={() => {
          setBookingService(null);
          setIsBookingOpen(true);
        }}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
        onOpenInstallment={() => {
          setInstallmentProduct(null);
          setInstallmentCartItems(cart.length > 0 ? cart : undefined);
          setIsInstallmentOpen(true);
        }}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenInstallment={(prod) => {
            setInstallmentProduct(prod);
            setIsInstallmentOpen(true);
          }}
        />
      )}

      {isBookingOpen && (
        <BookingModal
          services={db.services}
          preselectedService={bookingService}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={(code) => {
            setTrackerInitialCode(code);
            setToastMsg(`Đã tạo lịch hẹn thành công với mã ${code}!`);
          }}
        />
      )}

      {isTrackerOpen && (
        <OrderTrackerModal
          orders={db.orders}
          initialQuery={trackerInitialCode}
          onClose={() => setIsTrackerOpen(false)}
        />
      )}

      {isTradeInOpen && (
        <TradeInModal
          isOpen={isTradeInOpen}
          onClose={() => setIsTradeInOpen(false)}
          onSuccess={(code) => {
            setTrackerInitialCode(code);
            setToastMsg(`Đăng ký thu cũ đổi mới thành công với mã ${code}!`);
          }}
        />
      )}

      {isPCBuilderOpen && (
        <PCBuilderModal
          isOpen={isPCBuilderOpen}
          onClose={() => setIsPCBuilderOpen(false)}
          buildPackages={db.pcBuildPackages}
          onAddCustomBuildToCart={(buildProduct) => {
            handleAddToCart(buildProduct);
            setToastMsg(`Đã thêm dàn ${buildProduct.name} vào giỏ hàng!`);
          }}
        />
      )}

      {isStoreLocatorOpen && (
        <StoreLocatorModal
          isOpen={isStoreLocatorOpen}
          onClose={() => setIsStoreLocatorOpen(false)}
          branches={db.branches}
        />
      )}

      {isCompareModalOpen && (
        <ProductCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          products={comparedProducts}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* 0% Installment Registration Modal */}
      {isInstallmentOpen && (
        <InstallmentModal
          isOpen={isInstallmentOpen}
          onClose={() => {
            setIsInstallmentOpen(false);
            setInstallmentProduct(null);
            setInstallmentCartItems(undefined);
          }}
          product={installmentProduct}
          cartItems={installmentCartItems}
          settings={db.settings}
          currentUser={db.currentUser}
          onSuccess={(orderCode) => {
            setTrackerInitialCode(orderCode);
            setToastMsg(`Đã tạo hồ sơ trả góp 0% thành công! Mã đơn: ${orderCode}`);
          }}
        />
      )}

      {/* Fast 1-Click Authentication Modal */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          settings={db.settings}
          onLoginSuccess={(user: UserAccount) => {
            setToastMsg(`Chào mừng ${user.name}! Đăng nhập thành công.`);
          }}
        />
      )}

      {/* User Profile & Order History Modal */}
      {isUserAccountOpen && db.currentUser && (
        <UserAccountModal
          isOpen={isUserAccountOpen}
          onClose={() => setIsUserAccountOpen(false)}
          currentUser={db.currentUser}
          orders={db.orders}
          settings={db.settings}
          onLogout={() => {
            setToastMsg('Đã đăng xuất tài khoản.');
          }}
          onSelectOrderTracking={(orderCode) => {
            setIsUserAccountOpen(false);
            setTrackerInitialCode(orderCode);
            setIsTrackerOpen(true);
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        settings={db.settings}
        branches={db.branches}
        currentUser={db.currentUser}
        onOpenAuthModal={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
        onOpenInstallmentModal={(items) => {
          setIsCartOpen(false);
          setInstallmentProduct(null);
          setInstallmentCartItems(items);
          setIsInstallmentOpen(true);
        }}
        onOrderSuccess={(code) => {
          setTrackerInitialCode(code);
          setToastMsg(`Đặt hàng thành công! Mã đơn của bạn là ${code}`);
        }}
      />

      {/* Floating Fast Support Widget (Hotline + Zalo + Scroll To Top) */}
      <FloatingContactWidget settings={db.settings} />

      {/* Mobile-First Bottom Ergonomic Navigation Bar (Thumb Zone) */}
      <MobileBottomNav
        cartCount={cartTotalCount}
        currentUser={db.currentUser}
        onGoHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCategories={() => {
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenInstallment={() => {
          setInstallmentProduct(null);
          setInstallmentCartItems(cart.length > 0 ? cart : undefined);
          setIsInstallmentOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => {
          if (db.currentUser) {
            setIsUserAccountOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
      />
    </div>
  );
}

export default App;
