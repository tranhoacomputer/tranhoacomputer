import React, { useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Truck,
  Wrench,
  CheckCircle2,
  Award,
  ChevronRight,
  Star,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { StoreSettings } from '../types/shop';
import {
  BadgeBoCongThuong,
  BadgeVietQR,
  BadgeVNPay,
  BadgeMoMo,
  BadgeVisaMaster,
  BadgeHomeCredit,
  BadgeHDSaison,
  BadgeDMCA,
  BadgeSSL,
  IconInstallmentZero,
  IconExpressSpeed,
  IconRepairLab,
} from './TechRealisticIcons';

interface TechStoreRichContentProps {
  settings: StoreSettings;
  onSelectBrand?: (brand: string) => void;
  onOpenInstallmentModal?: () => void;
  onOpenBookingModal?: () => void;
  onOpenStoreLocator?: () => void;
}

export const TechStoreRichContent: React.FC<TechStoreRichContentProps> = ({
  settings,
  onSelectBrand,
  onOpenInstallmentModal,
  onOpenBookingModal,
  onOpenStoreLocator,
}) => {
  const { isDark } = useTheme();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Top Tech Brands
  const topBrands = [
    { name: 'Apple', logoText: 'Apple', origin: 'Mỹ', tag: 'MacBook M3 / M4' },
    { name: 'ASUS', logoText: 'ROG & TUF', origin: 'Đài Loan', tag: 'Gaming Số 1' },
    { name: 'Lenovo', logoText: 'Legion & ThinkPad', origin: 'Quốc tế', tag: 'Bền Bỉ Chuẩn Quân Đội' },
    { name: 'Dell', logoText: 'Alienware & XPS', origin: 'Mỹ', tag: 'Hiệu Năng Doanh Nghiệp' },
    { name: 'MSI', logoText: 'MSI Gaming', origin: 'Đài Loan', tag: 'Tản Nhiệt Đỉnh Cao' },
    { name: 'Acer', logoText: 'Predator & Nitro', origin: 'Đài Loan', tag: 'Cấu Hình Vô Địch Tầm Giá' },
    { name: 'NVIDIA', logoText: 'GeForce RTX', origin: 'Mỹ', tag: 'DLSS 3.5 & Ray Tracing' },
    { name: 'Intel', logoText: 'Core Ultra', origin: 'Mỹ', tag: 'AI Boost NPU 2026' },
    { name: 'AMD', logoText: 'Ryzen 9000 Series', origin: 'Mỹ', tag: 'Đa Nhân Đồ Họa' },
    { name: 'Corsair', logoText: 'Corsair Gaming', origin: 'Mỹ', tag: 'Nguồn & Tản Nhiệt AIO' },
  ];

  // Articles & Buying Guides
  const articles = [
    {
      id: 'guide-1',
      title: 'Tư Vấn Chọn Cấu Hình PC Gaming 2026: Cân Đối CPU Core Ultra & Card RTX 4070 Ti Super',
      desc: 'Phân tích chi tiết tỷ lệ nghẽn cổ chai (bottleneck), tối ưu công suất nguồn PSU chuẩn ATX 3.1 và lưu lượng gió trong thùng máy.',
      category: 'Tư Vấn Cấu Hình',
      date: 'Tháng 3, 2026',
      readTime: '5 phút đọc',
      badge: 'Hot Đọc Nhiều',
    },
    {
      id: 'guide-2',
      title: 'Top 5 Laptop Gaming Sinh Viên Dưới 25 Triệu Đáng Mua Nhất: Màn 144Hz, VGA RTX 4050/4060',
      desc: 'Đánh giá thực tế độ bền bản lề, nhiệt độ tản nhiệt khi render video 4K và khả năng nâng cấp RAM lên tới 64GB.',
      category: 'Đánh Giá Laptop',
      date: 'Tháng 3, 2026',
      readTime: '6 phút đọc',
      badge: 'Sinh Viên',
    },
    {
      id: 'guide-3',
      title: 'Quy Trình Duyệt Trả Góp 0% Bằng CCCD Gắn Chip: Nhận Máy Sau 5 Phút Tại Cửa Hàng',
      desc: 'Chi tiết thủ tục không cần chứng minh thu nhập, lãi suất 0% trọn đời kỳ hạn 6-12 tháng, không giữ giấy tờ tùy thân gốc.',
      category: 'Chính Sách & Trả Góp',
      date: 'Hôm nay',
      readTime: '4 phút đọc',
      badge: 'Trả Góp 0%',
    },
    {
      id: 'guide-4',
      title: 'Khi Nào Cần Vệ Sinh Laptop & Thay Keo Tản Nhiệt Kim Loại Lỏng? Lưu Ý Từ Phòng Lab',
      desc: 'Hướng dẫn nhận biết dấu hiệu quá nhiệt, tiếng quạt rít và chu kỳ bảo dưỡng định kỳ miễn phí trọn đời cho khách hàng.',
      category: 'Kỹ Thuật Lab',
      date: 'Cập nhật 2026',
      readTime: '4 phút đọc',
      badge: 'Bảo Dưỡng Lab',
    },
  ];

  // Verified Customer Testimonials
  const testimonials = [
    {
      name: 'Nguyễn Hoàng Long',
      role: 'Kiến Trúc Sư / Đồ Họa 3D',
      location: settings.targetProvince || 'Thái Nguyên',
      comment:
        'Đặt bộ PC Workstation RTX 4070 Ti Super, kỹ thuật viên bên shop ship tận nhà sau đúng 75 phút. Đi dây nguồn cực gọn gàng, test stress test Furmark ổn định mới nhận tiền. Rất an tâm!',
      rating: 5,
      product: 'PC E-Power Creator 3D Max',
      date: '2 ngày trước',
    },
    {
      name: 'Trần Thị Thu Trang',
      role: 'Sinh Viên Đại Học Sư Phạm Thái Nguyên',
      location: settings.targetProvince || 'Thái Nguyên',
      comment:
        'Làm hồ sơ trả góp 0% bằng CCCD gắn chip chỉ mất đúng 5 phút duyệt online trên web. Lúc đến nhận máy được nhân viên hỗ trợ cài sẵn bộ Adobe bản quyền và dán màn hình miễn phí.',
      rating: 5,
      product: 'ASUS ROG Zephyrus G16',
      date: 'Tuần trước',
    },
    {
      name: 'Vũ Đức Mạnh',
      role: 'Gamer & Streamer',
      location: 'Thái Nguyên',
      comment:
        'Laptop bị lỗi màn hình sọc, mang qua phòng lab kỹ thuật tại Phú Thịnh kiểm tra và thay màn hình chính hãng lấy liền sau 45 phút. Khách được ký tên trực tiếp lên mainboard, rất minh bạch!',
      rating: 5,
      product: 'Dịch vụ thay màn hình 165Hz Lab',
      date: '3 ngày trước',
    },
  ];

  // FAQs
  const faqs = [
    {
      q: `Cửa hàng có giao hàng hỏa tốc trong ngày tại ${settings.targetProvince || 'Thái Nguyên'} không?`,
      a: `Có. Cửa hàng cam kết giao hỏa tốc chỉ trong 1 - 2 giờ cho toàn bộ các khu vực tại ${settings.targetProvince || 'Thái Nguyên'}. Đơn hàng từ ${settings.provinceFreeShipThreshold ? (settings.provinceFreeShipThreshold / 1000).toLocaleString('vi-VN') + '.000₫' : '500.000₫'} được MIỄN PHÍ vận chuyển và có kỹ thuật viên giao hàng tận nơi hướng dẫn cài đặt. Các tỉnh khác giao qua Viettel Post / GHTK có bảo hiểm 100%.`,
    },
    {
      q: 'Mua hàng trả góp 0% lãi suất cần những thủ tục và giấy tờ gì?',
      a: 'Bạn chỉ cần có CCCD gắn chip từ 18 tuổi trở lên (hoặc Thẻ tín dụng Visa/MasterCard). Hồ sơ được duyệt trực tiếp online trong vòng 5 phút qua các đối tác tài chính uy tín (Home Credit, HD SAISON, Mcredit). Bạn không cần chứng minh thu nhập và không bị giữ giấy tờ tùy thân.',
    },
    {
      q: 'Chính sách bảo hành 1 đổi 1 và bảo dưỡng máy như thế nào?',
      a: 'Toàn bộ máy mới được hưởng chính sách "1 ĐỔI 1 TRONG 30 NGÀY" nếu có bất kỳ lỗi phần cứng nào từ nhà sản xuất. Ngoài ra, khách hàng mua máy tại hệ thống được tặng gói "VỆ SINH & TRA KEO TẢN NHIỆT TRỌN ĐỜI MÁY MIỄN PHÍ" tại cửa hàng Phú Thịnh - Thái Nguyên.',
    },
    {
      q: 'Tôi có được mở hộp kiểm tra hàng và bật máy thử trước khi thanh toán tiền không?',
      a: 'Hoàn toàn được! Dù bạn mua hỏa tốc nội thành hay ship COD toàn quốc, chính sách của chúng tôi là "ĐỒNG KIỂM 100%". Bạn được mở hộp, kiểm tra nguyên seal, cắm sạc bật nguồn test màn hình trước khi thanh toán cho nhân viên giao vận.',
    },
    {
      q: 'Chương trình Thu Cũ Đổi Mới (Trade-In) trợ giá ra sao?',
      a: 'Chúng tôi hỗ trợ thu mua mọi dòng laptop, PC cũ với mức giá sát thị trường và TRỢ GIÁ THÊM LÊN ĐẾN 5.000.000₫ khi bạn nâng cấp lên máy mới. Kỹ thuật viên sẽ định giá minh bạch và trừ trực tiếp tiền mặt vào hóa đơn mua máy mới.',
    },
  ];

  return (
    <div className="space-y-16 w-full text-left">
      {/* ================= 1. CAM KẾT VÀNG & ĐẶC QUYỀN KHÁCH HÀNG ================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
              <h2 className={`text-xl sm:text-2xl font-black font-mono uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Cam Kết Dịch Vụ Chuẩn 5 Sao
              </h2>
            </div>
            <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Quyền lợi tối đa cho khách hàng khi mua sắm và sửa chữa tại hệ thống
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Phục vụ hơn 500.000 khách hàng toàn quốc</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center mb-3.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              1 Đổi 1 Trong 30 Ngày
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Đổi ngay máy mới nguyên hộp nếu phát sinh bất kỳ lỗi phần cứng nào từ nhà sản xuất trong tháng đầu tiên.
            </p>
            <div className="mt-3 text-[11px] font-bold text-sky-500 flex items-center gap-1">
              <span>Bảo hành tận tâm</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 2 */}
          <div
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mb-3.5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Hoàn Tiền 200% Hàng Giả
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              100% hàng phân phối chính hãng VNA, nguyên tem hải quan. Cam kết bồi thường gấp đôi nếu phát hiện tráo linh kiện.
            </p>
            <div className="mt-3 text-[11px] font-bold text-amber-500 flex items-center gap-1">
              <span>Chứng chỉ VNA chính ngạch</span>
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 3 */}
          <div
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mb-3.5">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Vệ Sinh Tra Keo Trọn Đời
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Miễn phí vệ sinh bụi bẩn, tra keo tản nhiệt cao cấp Thermal Grizzly và bảo dưỡng trọn đời tại tất cả chi nhánh.
            </p>
            <div className="mt-3 text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <span>Keo xịn chuẩn Gaming</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 4 */}
          <div
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center mb-3.5">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Hỏa Tốc 1 - 2 Giờ Nội Thành
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Đội ngũ xe hỏa tốc nội bộ giao nhanh trong 1 - 2 giờ, kỹ thuật viên hỗ trợ bóc hộp và cài phần mềm tại chỗ.
            </p>
            <div className="mt-3 text-[11px] font-bold text-cyan-500 flex items-center gap-1">
              <span>Đồng kiểm trước khi trả tiền</span>
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. TOP THƯƠNG HIỆU CÔNG NGHỆ CHÍNH HÃNG ================= */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-black font-mono uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Thương Hiệu Đồng Hành Hàng Đầu
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Ủy quyền phân phối chính hãng đầy đủ hóa đơn VAT & chế độ bảo hành vàng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {topBrands.map((brand) => (
            <button
              key={brand.name}
              type="button"
              onClick={() => onSelectBrand && onSelectBrand(brand.name)}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.03] cursor-pointer group ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-sky-500'
                  : 'bg-white hover:bg-sky-50/50 border-slate-200 hover:border-sky-400 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black font-mono uppercase group-hover:text-sky-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {brand.name}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {brand.origin}
                </span>
              </div>
              <div className={`text-xs font-bold mt-1 truncate ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
                {brand.logoText}
              </div>
              <div className={`text-[10px] mt-1 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {brand.tag}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ================= 3. GÓC TƯ VẤN & CẨM NANG CÔNG NGHỆ CHUYÊN SÂU ================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-black font-mono uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Góc Tư Vấn & Cẩm Nang Công Nghệ
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Chia sẻ kiến thức phần cứng, kinh nghiệm chọn mua và mẹo bảo dưỡng từ kỹ thuật viên
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <article
              key={art.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-sky-500 font-mono">
                  {art.category}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {art.date} · {art.readTime}
                </span>
              </div>

              <h3 className={`text-sm sm:text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {art.title}
              </h3>

              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {art.desc}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                  art.badge === 'Trả Góp 0%'
                    ? 'bg-amber-500/10 text-amber-500'
                    : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}>
                  {art.badge}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (art.badge === 'Trả Góp 0%' && onOpenInstallmentModal) {
                      onOpenInstallmentModal();
                    } else if (art.badge === 'Bảo Dưỡng Lab' && onOpenBookingModal) {
                      onOpenBookingModal();
                    }
                  }}
                  className="text-xs font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= 4. KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI ================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className={`text-xl font-black font-mono uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Đánh Giá Khách Hàng Thực Tế
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              100% đánh giá xác thực từ người mua hàng và sử dụng dịch vụ tại chi nhánh
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>4.9 / 5.0 (Hơn 12.800 lượt bình chọn)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>

                <p className={`text-xs leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  "{item.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.name}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.role} · {item.location}
                  </div>
                </div>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã Mua Hàng
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. HỎI ĐÁP & THẮC MẮC PHỔ BIẾN (FAQS) ================= */}
      <section className="space-y-5">
        <div>
          <h2 className={`text-xl font-black font-mono uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Câu Hỏi Thường Gặp (FAQs)
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Giải đáp nhanh chóng các thắc mắc về chính sách giao nhận, bảo hành và trả góp
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-colors overflow-hidden ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${
                      isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 6. HỆ THỐNG ĐỐI TÁC THANH TOÁN, TÀI CHÍNH & CHỨNG NHẬN ================= */}
      <section
        className={`p-6 sm:p-8 rounded-3xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột 1: Đối tác thanh toán */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Phương Thức Thanh Toán Đa Dạng
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Hỗ trợ quẹt thẻ không phụ phí, chuyển khoản VietQR tự động 24/7, ví điện tử MoMo, VNPAY-QR và tiền mặt khi nhận hàng (COD).
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <BadgeVietQR />
              <BadgeVNPay />
              <BadgeMoMo />
              <BadgeVisaMaster />
            </div>
          </div>

          {/* Cột 2: Đối tác trả góp 0% */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Đối Tác Trả Góp 0% Lãi Suất
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Liên kết các công ty tài chính hàng đầu Việt Nam, hỗ trợ duyệt hồ sơ 5 phút qua CCCD gắn chip không giữ giấy tờ.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <BadgeHomeCredit />
              <BadgeHDSaison />
              <button
                type="button"
                onClick={onOpenInstallmentModal}
                className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-bold hover:bg-amber-500/20 cursor-pointer"
              >
                Bảng tính góp 0% →
              </button>
            </div>
          </div>

          {/* Cột 3: Chứng nhận bảo mật & Pháp lý */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Chứng Nhận & Bản Quyền
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Website thương mại điện tử đã thông báo với Bộ Công Thương, cam kết thông tin minh bạch và mã hóa dữ liệu SSL 256-Bit.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <BadgeBoCongThuong />
              <BadgeDMCA />
              <BadgeSSL />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
