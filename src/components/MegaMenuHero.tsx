import React, { useState, useEffect } from 'react';
import {
  Flame,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Tag,
  Gift,
  Laptop,
  Cpu,
  Monitor,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import { StoreSettings, HeroBanner } from '../types/shop';
import { useTheme } from '../context/ThemeContext';
import {
  IconLaptopGaming,
  IconPCGaming,
  IconCPU,
  IconRepairLab,
  IconTradeIn,
  IconInstallmentZero,
  IconVGA,
  IconKeyboard,
  IconMonitor,
  IconExpressSpeed,
} from './TechRealisticIcons';

interface MegaMenuHeroProps {
  settings: StoreSettings;
  banners?: HeroBanner[];
  onSelectCategory: (cat: string) => void;
  onOpenTradeIn: () => void;
  onOpenPCBuilder: () => void;
  onOpenBooking: () => void;
  onExploreFlashSale: () => void;
  onOpenInstallment?: () => void;
}

export const MegaMenuHero: React.FC<MegaMenuHeroProps> = ({
  settings,
  banners,
  onSelectCategory,
  onOpenTradeIn,
  onOpenPCBuilder,
  onOpenBooking,
  onExploreFlashSale,
  onOpenInstallment,
}) => {
  const { isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // High-converting retail slider items (CellphoneS / GearVN / Phong Vũ standards)
  const slidesData = [
    {
      id: 'slide-1',
      tabTitle: 'PC Gaming RTX 4070',
      tabSubtitle: 'Giảm 4.5 Triệu',
      badge: 'DÀN PC GAMING KHỦNG',
      badgeTag: 'HOT DEAL TUẦN NÀY',
      title: 'PC Gaming RTX 4070 Ti Super 16GB',
      subtitle: 'Trang bị Core i7 14700KF, RAM 32GB DDR5 Bus 6000MHz, SSD 1TB Gen4 x4 NVMe 7000MB/s.',
      originalPrice: '38.500.000₫',
      salePrice: '33.990.000₫',
      discountAmount: 'TIẾT KIỆM 4.510.000₫',
      perks: [
        'Tặng tản nhiệt nước AIO 360mm ARGB + Chuột Gaming Esports 26.000 DPI',
        'Trả góp 0% duyệt hồ sơ 5 phút qua CCCD gắn chip (Không giữ giấy tờ)',
        `Bảo hành 1 đổi 1 tận nơi 30 ngày & Giao hỏa tốc 1-2h tại ${settings.targetProvince || 'Hải Phòng'}`,
      ],
      ctaText: 'Đặt Mua Dàn PC Ngay',
      action: () => onSelectCategory('pc_gaming'),
      visualType: 'pc_gaming',
      specs: [
        { label: 'GPU', value: 'RTX 4070 Ti Super 16G' },
        { label: 'CPU', value: 'Intel Core i7 14700KF' },
        { label: 'RAM', value: '32GB DDR5 Dual Channel' },
        { label: 'TẢN', value: 'AIO 360mm Infinity Mirror' },
      ],
      bgGradientDark: 'from-slate-950 via-sky-950/40 to-slate-900',
      bgGradientLight: 'from-sky-50 via-white to-sky-100/60',
      borderGlow: 'border-sky-500/40',
    },
    {
      id: 'slide-2',
      tabTitle: 'Laptop ROG Strix G16',
      tabSubtitle: 'Tặng Màn Hình 165Hz',
      badge: 'LAPTOP GAMING CHÍNH HÃNG VNA',
      badgeTag: 'ĐẶC QUYỀN HỌC SINH/SV',
      title: 'ASUS ROG Strix G16 (2026 Edition)',
      subtitle: 'Màn hình 2.5K 240Hz 100% DCI-P3, Core i9 14900HX, RTX 4060 8GB VRAM TGP 140W max công suất.',
      originalPrice: '35.990.000₫',
      salePrice: '30.490.000₫',
      discountAmount: 'GIẢM 5.500.000₫',
      perks: [
        'Tặng kèm Màn hình Gaming 24 inch 165Hz hoặc Balo ROG Archer trị giá 1.800.000₫',
        'Bảo hành chính hãng 24 tháng toàn cầu tại ASUS Service Center',
        'Tặng gói vệ sinh tra keo tản nhiệt kim loại lỏng trọn đời máy',
      ],
      ctaText: 'Xem Cấu Hình Chi Tiết',
      action: () => onSelectCategory('laptop'),
      visualType: 'laptop_gaming',
      specs: [
        { label: 'MÀN', value: '16" 2.5K 240Hz 100% DCI-P3' },
        { label: 'CPU', value: 'Intel Core i9 14900HX' },
        { label: 'GPU', value: 'NVIDIA RTX 4060 8GB 140W' },
        { label: 'BẢO HÀNH', value: '2 Năm Chính Hãng' },
      ],
      bgGradientDark: 'from-slate-950 via-purple-950/40 to-slate-900',
      bgGradientLight: 'from-purple-50 via-white to-sky-50',
      borderGlow: 'border-purple-500/40',
    },
    {
      id: 'slide-3',
      tabTitle: 'MacBook Air M3',
      tabSubtitle: 'Chỉ Từ 24.890K',
      badge: 'APPLE CHÍNH HÃNG VNA',
      badgeTag: 'TRẢ GÓP 0% LÃI SUẤT',
      title: 'Apple MacBook Air M3 13.6 inch 2026',
      subtitle: 'Thời lượng pin 18 giờ liên tục, thiết kế nhôm Unibody siêu mỏng 11.3mm, hỗ trợ xuất 2 màn hình ngoài.',
      originalPrice: '27.990.000₫',
      salePrice: '24.890.000₫',
      discountAmount: 'TIẾT KIỆM 3.100.000₫',
      perks: [
        'Giảm thêm 500.000₫ khi thanh toán qua VietQR hoặc VNPAY',
        'Thu cũ đổi mới trợ giá thêm đến 2.000.000₫ tiền mặt',
        'Bảo hành 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi nhà sản xuất',
      ],
      ctaText: 'Săn Ngay MacBook M3',
      action: () => onSelectCategory('laptop'),
      visualType: 'macbook',
      specs: [
        { label: 'CHIP', value: 'Apple Silicon M3 8-Core' },
        { label: 'PIN', value: '18 Giờ Sử Dụng' },
        { label: 'MÀN', value: 'Liquid Retina 500 Nits' },
        { label: 'TRỌNG LƯỢNG', value: '1.24 kg Siêu Nhẹ' },
      ],
      bgGradientDark: 'from-slate-950 via-cyan-950/40 to-slate-900',
      bgGradientLight: 'from-cyan-50 via-white to-sky-50',
      borderGlow: 'border-cyan-500/40',
    },
    {
      id: 'slide-4',
      tabTitle: 'Sửa Chữa 30 Phút',
      tabSubtitle: 'Trực Tiếp Tại Lab',
      badge: 'PHÒNG LAB KỸ THUẬT TIÊU CHUẨN ISO',
      badgeTag: 'LẤY LIỀN KHÔNG GIỮ MÁY',
      title: 'Dịch Vụ Sửa Chữa Chuyên Sâu Lấy Ngay 30P',
      subtitle: 'Quan sát kỹ thuật viên thao tác trực tiếp qua kính phòng lab. Khách hàng ký tên niêm phong toàn bộ linh kiện.',
      originalPrice: '500.000₫',
      salePrice: 'MIỄN PHÍ KHÁM',
      discountAmount: 'TẶNG VỆ SINH 150K',
      perks: [
        'Miễn phí đo đạc xung nhịp, quét virus và kiểm tra tổng quát toàn diện máy',
        'Tra keo tản nhiệt gốm cao cấp Thermal Grizzly Kryonaut giảm ngay 10 - 15°C',
        'Bảo hành linh kiện thay thế từ 6 - 36 tháng 1 đổi 1 ngay lập tức',
      ],
      ctaText: 'Đặt Lịch Tiếp Nhận Ngay',
      action: onOpenBooking,
      visualType: 'repair_lab',
      specs: [
        { label: 'THỜI GIAN', value: '15 - 30 Phút Lấy Liền' },
        { label: 'MINH BẠCH', value: 'Ký Tên Mọi Linh Kiện' },
        { label: 'KỸ THUẬT', value: 'Kỹ Sư Đào Tạo Chính Hãng' },
        { label: 'BẢO HÀNH', value: 'Tới 36 Tháng Lỗi Đổi Mới' },
      ],
      bgGradientDark: 'from-slate-950 via-emerald-950/40 to-slate-900',
      bgGradientLight: 'from-emerald-50 via-white to-sky-50',
      borderGlow: 'border-emerald-500/40',
    },
    {
      id: 'slide-5',
      tabTitle: 'Thu Cũ Đổi Mới',
      tabSubtitle: 'Trợ Giá 5 Triệu',
      badge: 'CHƯƠNG TRÌNH TRADE-IN TIÊU CHUẨN',
      badgeTag: 'ĐỊNH GIÁ TRONG 5 PHÚT',
      title: 'Thu Cũ Đổi Mới Lên Đời Laptop & PC Mới',
      subtitle: 'Thu mua mọi dòng máy tính cũ kể cả rơi vỡ, trầy xước. Không phân biệt mua ở đâu, trợ giá thẳng tiền mặt.',
      originalPrice: 'Giá Cũ',
      salePrice: '+5.000.000₫',
      discountAmount: 'TRỢ GIÁ TỐI ĐA',
      perks: [
        'Kỹ thuật viên test máy và định giá minh bạch công khai trong 5 phút',
        'Trợ giá lên đến 5.000.000₫ trừ trực tiếp vào đơn mua sản phẩm mới',
        'Hỗ trợ chuyển toàn bộ dữ liệu cá nhân sang máy mới miễn phí 100%',
      ],
      ctaText: 'Định Giá Máy Cũ Ngay',
      action: onOpenTradeIn,
      visualType: 'trade_in',
      specs: [
        { label: 'THỦ TỤC', value: 'Chỉ Cần Máy Cũ' },
        { label: 'ĐỊNH GIÁ', value: 'Nhanh Trong 5 Phút' },
        { label: 'TRỢ GIÁ', value: 'Lên Đến 5.000.000₫' },
        { label: 'DỮ LIỆU', value: 'Backup & Chuyển Free' },
      ],
      bgGradientDark: 'from-slate-950 via-amber-950/40 to-slate-900',
      bgGradientLight: 'from-amber-50 via-white to-amber-50',
      borderGlow: 'border-amber-500/40',
    },
  ];

  // Auto slider progress counter
  useEffect(() => {
    setSlideProgress(0);
    const intervalTime = 6000;
    const stepTime = 60;
    const increment = (stepTime / intervalTime) * 100;

    const progressTimer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % slidesData.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(progressTimer);
  }, [currentSlide, slidesData.length]);

  const activeSlide = slidesData[currentSlide];

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left space-y-3">
      {/* ================= MOBILE QUICK CATEGORIES SCROLL STRIP ================= */}
      <div className="block lg:hidden overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
        <div className="flex items-center gap-2 min-w-max">
          <button
            type="button"
            onClick={() => onSelectCategory('laptop')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <IconLaptopGaming className="w-4 h-4 shrink-0" />
            <span>Laptop Chính Hãng</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('pc_gaming')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <IconPCGaming className="w-4 h-4 shrink-0" />
            <span>PC Gaming</span>
          </button>
          <button
            type="button"
            onClick={onOpenPCBuilder}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
              isDark ? 'bg-slate-900 border-sky-500/50 text-sky-400' : 'bg-sky-50 border-sky-300 text-sky-800 shadow-xs'
            }`}
          >
            <IconCPU className="w-4 h-4 shrink-0" />
            <span>Build PC Tự Chọn</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('component')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <IconVGA className="w-4 h-4 shrink-0" />
            <span>VGA & Linh Kiện</span>
          </button>
          <button
            type="button"
            onClick={onOpenBooking}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
              isDark ? 'bg-slate-900 border-emerald-500/50 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
            }`}
          >
            <IconRepairLab className="w-4 h-4 shrink-0" />
            <span>Sửa Chữa 30P</span>
          </button>
          <button
            type="button"
            onClick={onOpenTradeIn}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
              isDark ? 'bg-slate-900 border-amber-500/50 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
            }`}
          >
            <IconTradeIn className="w-4 h-4 shrink-0" />
            <span>Thu Cũ 5TR</span>
          </button>
        </div>
      </div>

      {/* ================= DESKTOP 3-COLUMN HERO GRID (Standard Retailer Layout) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 relative">
        {/* ================= COLUMN 1: INTERACTIVE MEGA CATEGORY SIDEBAR (3 cols) ================= */}
        <div
          className={`hidden lg:block lg:col-span-3 rounded-2xl p-2.5 space-y-1 relative z-30 transition-colors border ${
            isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
          }`}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider font-mono flex items-center justify-between border-b mb-1 ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5 text-sky-500">
              <Layers className="w-3.5 h-3.5" />
              DANH MỤC SẢN PHẨM
            </span>
            <span className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-sky-950 text-sky-400' : 'bg-sky-100 text-sky-700'}`}>
              38 Chi Nhánh
            </span>
          </div>

          {/* Category Item 1: Laptop */}
          <div
            onMouseEnter={() => setHoveredCategory('laptop')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
              hoveredCategory === 'laptop'
                ? isDark
                  ? 'bg-sky-500/20 text-sky-400 font-bold'
                  : 'bg-sky-50 text-sky-700 font-bold'
                : isDark
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
            onClick={() => onSelectCategory('laptop')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <IconLaptopGaming className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs leading-none">Laptop Chính Hãng</div>
                <div className={`text-[10px] mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Gaming, Mỏng nhẹ, MacBook
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Category Item 2: PC Gaming */}
          <div
            onMouseEnter={() => setHoveredCategory('pc_gaming')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
              hoveredCategory === 'pc_gaming'
                ? isDark
                  ? 'bg-sky-500/20 text-sky-400 font-bold'
                  : 'bg-sky-50 text-sky-700 font-bold'
                : isDark
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
            onClick={() => onSelectCategory('pc_gaming')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <IconPCGaming className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs leading-none">PC Gaming & Đồ Họa</div>
                <div className={`text-[10px] mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Dàn máy lắp sẵn tối ưu
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Category Item 3: Build PC */}
          <div
            onMouseEnter={() => setHoveredCategory('pc_builder')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
              hoveredCategory === 'pc_builder'
                ? isDark
                  ? 'bg-sky-500/20 text-sky-400 font-bold'
                  : 'bg-sky-50 text-sky-700 font-bold'
                : isDark
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
            onClick={onOpenPCBuilder}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <IconCPU className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs leading-none text-sky-400 dark:text-sky-300">
                  Build PC Theo Ngân Sách
                </div>
                <div className={`text-[10px] mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Tự chọn linh kiện & giá
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Category Item 4: Linh Kiện */}
          <div
            onMouseEnter={() => setHoveredCategory('component')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
              hoveredCategory === 'component'
                ? isDark
                  ? 'bg-sky-500/20 text-sky-400 font-bold'
                  : 'bg-sky-50 text-sky-700 font-bold'
                : isDark
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
            onClick={() => onSelectCategory('component')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <IconVGA className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs leading-none">Linh Kiện Máy Tính</div>
                <div className={`text-[10px] mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  VGA RTX, CPU, RAM, SSD
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Category Item 5: Phụ Kiện Gear */}
          <div
            onMouseEnter={() => setHoveredCategory('accessory')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
              hoveredCategory === 'accessory'
                ? isDark
                  ? 'bg-sky-500/20 text-sky-400 font-bold'
                  : 'bg-sky-50 text-sky-700 font-bold'
                : isDark
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
            onClick={() => onSelectCategory('accessory')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <IconKeyboard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs leading-none">Gaming Gear & Màn Hình</div>
                <div className={`text-[10px] mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Bàn phím cơ, Chuột, Màn 144Hz
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Category Item 6: Sửa Chữa 30P */}
          <div
            onMouseEnter={() => setHoveredCategory('repair')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
              hoveredCategory === 'repair'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                  : 'bg-emerald-50 text-emerald-700 font-bold'
                : isDark
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
            onClick={onOpenBooking}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <IconRepairLab className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs leading-none text-emerald-400">
                  Sửa Chữa Lấy Ngay 30P
                </div>
                <div className={`text-[10px] mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Phòng lab kỹ thuật chuẩn ISO
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Category Item 7: Thu Cũ Đổi Mới */}
          <div
            onMouseEnter={() => setHoveredCategory('trade_in')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
              hoveredCategory === 'trade_in'
                ? isDark
                  ? 'bg-amber-500/20 text-amber-400 font-bold'
                  : 'bg-amber-50 text-amber-700 font-bold'
                : isDark
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
            onClick={onOpenTradeIn}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <IconTradeIn className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs leading-none text-amber-400">
                  Thu Cũ Đổi Mới
                </div>
                <div className={`text-[10px] mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Trợ giá lên đến 5.000.000₫
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* ================= HOVER MEGA FLYOUT PANEL ================= */}
          {hoveredCategory && (
            <div
              className={`absolute left-[calc(100%+8px)] top-0 w-[540px] rounded-2xl p-5 shadow-2xl border z-50 transition-all duration-200 animate-in fade-in ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-sky-950/40' : 'bg-white border-slate-200 text-slate-800 shadow-xl'
              }`}
              onMouseEnter={() => setHoveredCategory(hoveredCategory)}
            >
              {hoveredCategory === 'laptop' && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="font-bold text-sm text-sky-400 flex items-center gap-2">
                      <IconLaptopGaming className="w-4 h-4" />
                      LAPTOP CHÍNH HÃNG VNA
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('laptop')}
                      className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Xem tất cả <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">Thương Hiệu Hàng Đầu</div>
                      <div className="space-y-1.5">
                        {['Apple MacBook', 'ASUS ROG / TUF', 'Lenovo Legion / LOQ', 'Acer Predator / Nitro', 'Dell Alienware / XPS', 'MSI Gaming Series', 'HP Omen / Victus'].map((b) => (
                          <div
                            key={b}
                            onClick={() => onSelectCategory('laptop')}
                            className="cursor-pointer hover:text-sky-400 transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">Phân Loại & Mức Giá</div>
                      <div className="space-y-1.5">
                        {['Laptop Gaming Đồ Họa', 'Ultrabook Mỏng Nhẹ', 'Laptop Sinh Viên - Học Tập', 'Dưới 15 Triệu', '15 - 25 Triệu', '25 - 40 Triệu', 'Trên 40 Triệu (Hi-End)'].map((p) => (
                          <div
                            key={p}
                            onClick={() => onSelectCategory('laptop')}
                            className="cursor-pointer hover:text-sky-400 transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl flex items-center justify-between border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50 border-sky-200'}`}>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-semibold">Tặng Balo ROG + Chuột không dây trị giá 1.2TR</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">HOT</span>
                  </div>
                </div>
              )}

              {hoveredCategory === 'pc_gaming' && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="font-bold text-sm text-sky-400 flex items-center gap-2">
                      <IconPCGaming className="w-4 h-4" />
                      DÀN PC GAMING LẮP SẴN TỐI ƯU
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('pc_gaming')}
                      className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Xem tất cả <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">Phân Khúc Cấu Hình</div>
                      <div className="space-y-1.5">
                        {['PC Esport LoL / Valorant', 'PC AAA RTX 4060 Ti', 'PC Render Đồ Họa 3D', 'PC Giả Lập Nox 20 Tabs', 'PC Mini ITX Nhỏ Gọn', 'Dàn PC Hi-End Tản Custom'].map((pc) => (
                          <div
                            key={pc}
                            onClick={() => onSelectCategory('pc_gaming')}
                            className="cursor-pointer hover:text-sky-400 transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            <span>{pc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">Khoảng Ngân Sách</div>
                      <div className="space-y-1.5">
                        {['PC Giá Rẻ Dưới 10 Triệu', 'PC 10 - 15 Triệu (i5 + GTX)', 'PC 15 - 25 Triệu (i5 + RTX)', 'PC 25 - 40 Triệu (i7 + RTX)', 'Dàn Máy > 50 Triệu'].map((b) => (
                          <div
                            key={b}
                            onClick={() => onSelectCategory('pc_gaming')}
                            className="cursor-pointer hover:text-sky-400 transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl flex items-center justify-between border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50 border-sky-200'}`}>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold">Tặng tản nhiệt AIO + Bảo hành 1 đổi 1 tận nơi 30 ngày</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">VNA</span>
                  </div>
                </div>
              )}

              {hoveredCategory === 'component' && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="font-bold text-sm text-sky-400 flex items-center gap-2">
                      <IconVGA className="w-4 h-4" />
                      LINH KIỆN MÁY TÍNH CHÍNH HÃNG
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('component')}
                      className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Xem tất cả <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">Bộ Phận Cốt Lõi</div>
                      <div className="space-y-1.5">
                        {['Card Màn Hình (VGA RTX 40 Series)', 'Bộ Vi Xử Lý (CPU Intel / AMD)', 'Bo Mạch Chủ (Mainboard B760/Z790)', 'Bộ Nhớ Trong (RAM DDR4 / DDR5)', 'Ổ Cứng SSD M.2 PCIe Gen4'].map((c) => (
                          <div
                            key={c}
                            onClick={() => onSelectCategory('component')}
                            className="cursor-pointer hover:text-sky-400 transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">Nguồn & Tản Nhiệt</div>
                      <div className="space-y-1.5">
                        {['Nguồn Máy Tính (PSU 80 Plus Gold)', 'Tản Nhiệt Nước AIO 240/360', 'Vỏ Case Kính Cường Lực ARGB', 'Bộ Fan Led RGB Đồng Bộ', 'Keo Tản Nhiệt Cao Cấp'].map((c) => (
                          <div
                            key={c}
                            onClick={() => onSelectCategory('component')}
                            className="cursor-pointer hover:text-sky-400 transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(hoveredCategory === 'repair' || hoveredCategory === 'trade_in' || hoveredCategory === 'pc_builder' || hoveredCategory === 'accessory') && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="font-bold text-sm text-sky-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      DỊCH VỤ ĐẶC QUYỀN TRẦN HOA COMPUTER
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-[11px] text-emerald-400 uppercase tracking-wider mb-2">Phòng Lab Sửa Chữa 30P</div>
                      <div className="space-y-1.5">
                        <div onClick={onOpenBooking} className="cursor-pointer hover:text-emerald-400">✓ Vệ sinh tra keo tản nhiệt (15 phút)</div>
                        <div onClick={onOpenBooking} className="cursor-pointer hover:text-emerald-400">✓ Thay pin zin chính hãng bảo hành 12T</div>
                        <div onClick={onOpenBooking} className="cursor-pointer hover:text-emerald-400">✓ Nâng cấp RAM, SSD lấy liền tại lab</div>
                        <div onClick={onOpenBooking} className="cursor-pointer hover:text-emerald-400">✓ Khắc phục sự cố mất nguồn, lỗi VGA</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-amber-400 uppercase tracking-wider mb-2">Thu Cũ & Góp 0%</div>
                      <div className="space-y-1.5">
                        <div onClick={onOpenTradeIn} className="cursor-pointer hover:text-amber-400">✓ Thu máy cũ không kể ngoại hình</div>
                        <div onClick={onOpenTradeIn} className="cursor-pointer hover:text-amber-400">✓ Trợ giá lên đời đến 5.000.000₫</div>
                        <div onClick={onOpenInstallment} className="cursor-pointer hover:text-amber-400">✓ Trả góp 0% qua Home Credit / CCCD</div>
                        <div onClick={onOpenPCBuilder} className="cursor-pointer hover:text-sky-400">✓ Tự thiết kế cấu hình PC tương thích</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= COLUMN 2: CENTER HERO PROMO BANNER SLIDER (6 cols) ================= */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl overflow-hidden shadow-md border border-slate-800 relative min-h-[380px] sm:min-h-[400px]">
          {/* Main Slide Card */}
          <div
            className={`flex-1 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br transition-all duration-700 ${
              isDark ? activeSlide.bgGradientDark : activeSlide.bgGradientLight
            }`}
          >
            {/* Ambient Background Flare */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            {/* Top Row: Badges & Countdown */}
            <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider bg-rose-600 text-white flex items-center gap-1 shadow-sm animate-pulse">
                  <Flame className="w-3 h-3 fill-current" />
                  {activeSlide.badgeTag}
                </span>
                <span className={`text-[11px] font-bold font-mono tracking-wide ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
                  {activeSlide.badge}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded-full">
                <Zap className="w-3 h-3 fill-current" />
                <span>HOT 2026</span>
              </div>
            </div>

            {/* Middle Row: Content & Visual Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-3 relative z-10">
              {/* Left Details (7 cols) */}
              <div className="sm:col-span-7 space-y-2.5 text-left">
                <h1
                  className={`text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {activeSlide.title}
                </h1>

                {/* Price Row */}
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-rose-500 font-mono tracking-tight">
                    {activeSlide.salePrice}
                  </span>
                  {activeSlide.originalPrice && activeSlide.originalPrice !== activeSlide.salePrice && (
                    <span className="text-xs line-through text-slate-400 font-medium">
                      {activeSlide.originalPrice}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono">
                    {activeSlide.discountAmount}
                  </span>
                </div>

                {/* Perks Checklist */}
                <div className="space-y-1.5 pt-1">
                  {activeSlide.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className={`line-clamp-1 ${isDark ? 'text-slate-300' : 'text-slate-700'} font-medium`}>
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={activeSlide.action}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{activeSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Visual Showcase (5 cols) */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-xl backdrop-blur-xs flex items-center justify-center w-full max-w-[210px] sm:max-w-none">
                  {/* Dynamic Hardware Icon Showcase */}
                  {activeSlide.visualType === 'pc_gaming' && (
                    <div className="relative group">
                      <IconPCGaming className="w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[9px] font-black font-mono px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                        ARGB
                      </span>
                    </div>
                  )}

                  {activeSlide.visualType === 'laptop_gaming' && (
                    <div className="relative group">
                      <IconLaptopGaming className="w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[9px] font-black font-mono px-1.5 py-0.5 rounded-full shadow-md">
                        240Hz
                      </span>
                    </div>
                  )}

                  {activeSlide.visualType === 'macbook' && (
                    <div className="relative group">
                      <IconLaptopGaming className="w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[9px] font-black font-mono px-1.5 py-0.5 rounded-full shadow-md">
                        M3 Max
                      </span>
                    </div>
                  )}

                  {activeSlide.visualType === 'repair_lab' && (
                    <div className="relative group">
                      <IconRepairLab className="w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-black font-mono px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
                        30 PHÚT
                      </span>
                    </div>
                  )}

                  {activeSlide.visualType === 'trade_in' && (
                    <div className="relative group">
                      <IconTradeIn className="w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black font-mono px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                        +5.000K
                      </span>
                    </div>
                  )}
                </div>

                {/* Specs Pill Badges */}
                <div className="grid grid-cols-2 gap-1.5 w-full mt-2">
                  {activeSlide.specs.slice(0, 2).map((s, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[10px] text-center truncate"
                    >
                      <span className="text-slate-400 font-mono">{s.label}: </span>
                      <span className="font-bold text-sky-400 truncate">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center justify-between pt-1 relative z-10">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700' : 'bg-white/90 hover:bg-slate-100 text-slate-900 border-slate-300'
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-[11px] font-mono text-slate-400 font-bold">
                {currentSlide + 1} / {slidesData.length}
              </div>

              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slidesData.length)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700' : 'bg-white/90 hover:bg-slate-100 text-slate-900 border-slate-300'
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ================= 5 QUICK SLIDE TABS AT BOTTOM (Signature CellphoneS / GearVN Style) ================= */}
          <div
            className={`grid grid-cols-5 border-t ${
              isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {slidesData.map((s, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setCurrentSlide(idx);
                    setSlideProgress(0);
                  }}
                  className={`relative p-2.5 text-left transition-colors cursor-pointer border-r last:border-r-0 ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  } ${
                    isActive
                      ? isDark
                        ? 'bg-slate-800/90 text-white'
                        : 'bg-white text-sky-900 font-bold shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {/* Active Progress Bar */}
                  {isActive && (
                    <div
                      className="absolute top-0 left-0 h-1 bg-sky-500 transition-all duration-75"
                      style={{ width: `${slideProgress}%` }}
                    />
                  )}
                  <div className="text-[11px] font-bold truncate">{s.tabTitle}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-sky-400 font-semibold' : 'text-slate-500'}`}>
                    {s.tabSubtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= COLUMN 3: RIGHT PROMO MINI BANNERS (3 cols) ================= */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
          {/* Mini Banner 1: Thu cũ đổi mới */}
          <button
            type="button"
            onClick={onOpenTradeIn}
            className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer group border flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-amber-950/40 border-slate-800 hover:border-amber-500 shadow-md'
                : 'bg-gradient-to-br from-white to-amber-50/60 border-slate-200 hover:border-amber-400 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  THU CŨ ĐỔI MỚI
                </span>
                <IconTradeIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className={`text-sm font-black mt-2 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Trợ Giá Lên Đến 5 Triệu
              </h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Định giá máy cũ chỉ trong 5 phút. Trừ thẳng tiền mặt khi lên đời máy mới.
              </p>
            </div>
            <div className="mt-2.5 text-xs font-bold text-amber-500 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Định giá máy ngay</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Mini Banner 2: Trả góp 0% */}
          <button
            type="button"
            onClick={onOpenInstallment}
            className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer group border flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-sky-950/40 border-slate-800 hover:border-sky-500 shadow-md'
                : 'bg-gradient-to-br from-white to-sky-50/60 border-slate-200 hover:border-sky-400 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded bg-sky-500 text-white">
                  GÓP 0% LÃI SUẤT
                </span>
                <IconInstallmentZero className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className={`text-sm font-black mt-2 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Duyệt Hồ Sơ Chỉ 5 Phút
              </h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Chỉ cần CCCD gắn chip qua Home Credit / HD SAISON hoặc thẻ tín dụng.
              </p>
            </div>
            <div className="mt-2.5 text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Bảng tính góp 0%</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Mini Banner 3: Sửa máy 30P */}
          <button
            type="button"
            onClick={onOpenBooking}
            className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer group border flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-emerald-950/40 border-slate-800 hover:border-emerald-500 shadow-md'
                : 'bg-gradient-to-br from-white to-emerald-50/60 border-slate-200 hover:border-emerald-400 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded bg-emerald-600 text-white">
                  PHÒNG LAB ISO
                </span>
                <IconRepairLab className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className={`text-sm font-black mt-2 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Sửa Máy Lấy Liền 30P
              </h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Quan sát trực tiếp kỹ thuật. Khách ký tên lên từng linh kiện bo mạch.
              </p>
            </div>
            <div className="mt-2.5 text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Đặt lịch kiểm tra</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
