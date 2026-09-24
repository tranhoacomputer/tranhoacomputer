import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MessageCircle,
  Truck,
  CreditCard,
  Wrench,
  RotateCcw,
  Search,
  ChevronRight,
} from 'lucide-react';
import { StoreSettings, WebsiteContent } from '../types/shop';
import { useTheme } from '../context/ThemeContext';
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
  BadgeViettelPost,
  BadgeGHTK,
  BadgeGHN,
  BadgeJTExpress,
} from './TechRealisticIcons';

interface FooterProps {
  settings: StoreSettings;
  websiteContent?: WebsiteContent;
  onOpenAdmin: () => void;
  onOpenTracker?: () => void;
  onOpenBooking?: () => void;
  onOpenTradeIn?: () => void;
  onOpenPCBuilder?: () => void;
  onOpenInstallment?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  websiteContent,
  onOpenAdmin,
  onOpenTracker,
  onOpenBooking,
  onOpenTradeIn,
  onOpenPCBuilder,
  onOpenInstallment,
  onSelectCategory,
}) => {
  const { isDark } = useTheme();

  const storeName = settings.storeName || 'TRẦN HOA COMPUTER';
  const soleAddress = 'Phú Thịnh - Thái Nguyên';
  const consultationPhone = '0963284044';
  const supportEmail = 'hotrokhachhang@tranhoacomputer.site';
  const zaloUrl = 'https://zalo.me/84963284044';
  const zaloDisplay = 'zalo.me/84963284044';

  return (
    <footer
      className={`border-t text-left transition-colors relative overflow-hidden ${
        isDark ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      {/* 1. THANH CAM KẾT VÀNG */}
      <div
        className={`border-b py-5 ${
          isDark
            ? 'bg-slate-900/60 border-slate-800/80'
            : 'bg-slate-50/80 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 border ${
                  isDark
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}
              >
                <MapPin className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <div className={`text-xs font-bold font-mono uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Cơ Sở Duy Nhất
                </div>
                <div className="text-[11px] text-sky-500 font-medium mt-0.5">Phú Thịnh - Thái Nguyên</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 border ${
                  isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}
              >
                <Phone className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className={`text-xs font-bold font-mono uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tư Vấn Trực Tiếp
                </div>
                <div className="text-[11px] text-emerald-500 font-mono font-bold mt-0.5">{consultationPhone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 border ${
                  isDark
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    : 'bg-sky-50 text-sky-600 border-sky-200'
                }`}
              >
                <Truck className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <div className={`text-xs font-bold font-mono uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Giao Toàn Quốc
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Ship COD đồng kiểm hàng</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 border ${
                  isDark
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-purple-50 text-purple-600 border-purple-200'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className={`text-xs font-bold font-mono uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Bảo Hành Chính Hãng
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">1 đổi 1 trong 30 ngày</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KHU VỰC THÔNG TIN CHÍNH - BỐ CỤC GỌN GÀNG, ĐƠN GIẢN, CHUYÊN NGHIỆP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* CỘT 1: THÔNG TIN CỬA HÀNG DUY NHẤT (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Header tên cửa hàng */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md font-mono shrink-0">
                TH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {storeName}
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded font-mono shrink-0">
                    CỬA HÀNG DUY NHẤT
                  </span>
                </div>
                <div className="text-[11px] font-mono text-sky-500 font-semibold">
                  MÁY TÍNH & LINH KIỆN CÔNG NGHỆ CHÍNH HÃNG
                </div>
              </div>
            </div>

            {/* Khung Lưu ý cảnh báo địa chỉ duy nhất */}
            <div
              className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                isDark
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[11px] text-amber-600 dark:text-amber-400 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>THÔNG BÁO ĐỊA CHỈ CHÍNH THỨC</span>
              </div>
              <p>
                <strong>Lưu ý:</strong> Cửa hàng hoạt động tại địa chỉ duy nhất ở <strong>Phú Thịnh - Thái Nguyên</strong>, không có bất kỳ chi nhánh nào khác trên cả nước.
              </p>
            </div>

            {/* Chi tiết liên hệ chính xác */}
            <div className={`space-y-3 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {/* ĐỊA CHỈ DUY NHẤT */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className={`text-[10px] font-mono font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ĐỊA CHỈ CỬA HÀNG DUY NHẤT
                  </div>
                  <div className="font-bold text-sky-500 text-sm">
                    {soleAddress}
                  </div>
                </div>
              </div>

              {/* SỐ ĐIỆN THOẠI TƯ VẤN CỬA HÀNG */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className={`text-[10px] font-mono font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    SỐ ĐIỆN THOẠI TƯ VẤN CỬA HÀNG
                  </div>
                  <a
                    href={`tel:${consultationPhone}`}
                    className="font-bold text-emerald-500 text-sm hover:underline font-mono inline-flex items-center gap-1.5"
                  >
                    <span>{consultationPhone}</span>
                    <span className="text-[10px] font-sans font-normal px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      Bấm gọi ngay
                    </span>
                  </a>
                </div>
              </div>

              {/* LINK ZALO HỖ TRỢ */}
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className={`text-[10px] font-mono font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ZALO HỖ TRỢ KỸ THUẬT & BÁO GIÁ
                  </div>
                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-500 hover:underline font-mono inline-flex items-center gap-1"
                  >
                    <span>{zaloDisplay}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* EMAIL HỖ TRỢ KHÁCH HÀNG */}
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <div className={`text-[10px] font-mono font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    EMAIL HỖ TRỢ KHÁCH HÀNG
                  </div>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="font-semibold text-sky-500 hover:underline font-mono text-xs break-all"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>

              {/* GIỜ MỞ CỬA TIẾP NHẬN */}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className={`text-[10px] font-mono font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    GIỜ MỞ CỬA TIẾP NHẬN
                  </div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    08:00 - 21:30 (Mở cửa tất cả các ngày trong tuần & ngày lễ)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 2: TIỆN ÍCH KHÁCH HÀNG NHANH (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h4
              className={`text-xs font-bold uppercase tracking-wider font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Tiện Ích Khách Hàng Nhanh
            </h4>

            <div className="space-y-2.5 text-xs">
              {/* Thu Cũ Đổi Mới */}
              <button
                type="button"
                onClick={onOpenTradeIn}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer group flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 hover:border-amber-500/50'
                    : 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="font-bold text-amber-600 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Thu Cũ Đổi Mới - Trợ Giá 5 Triệu</span>
                  </div>
                  <div className={`text-[11px] mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Định giá nhanh laptop & PC cũ trừ vào máy mới
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Build PC */}
              <button
                type="button"
                onClick={onOpenPCBuilder}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer group flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 hover:border-sky-500/50'
                    : 'bg-slate-50 hover:bg-sky-50/50 border-slate-200 hover:border-sky-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sky-600 flex items-center gap-1.5">
                    <span>⚙️</span>
                    <span>Build PC Chuyên Nghiệp Theo Ngân Sách</span>
                  </div>
                  <div className={`text-[11px] mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Chọn cấu hình từ 12 triệu đến 50 triệu hoặc tự chọn linh kiện
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Đặt Lịch Sửa Máy */}
              <button
                type="button"
                onClick={onOpenBooking}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer group flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Đặt Lịch Sửa Máy Lấy Liền Trong 30 Phút</span>
                  </div>
                  <div className={`text-[11px] mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Ưu tiên kiểm tra máy ngay tại Phú Thịnh - Thái Nguyên
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Tra Cứu Đơn & Máy Sửa */}
              <button
                type="button"
                onClick={onOpenTracker}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer group flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 hover:border-indigo-500/50'
                    : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="font-bold text-indigo-500 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Tra Cứu Tiến Độ Sửa Máy & Bảo Hành</span>
                  </div>
                  <div className={`text-[11px] mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Nhập số điện thoại để xem trạng thái xử lý
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Hướng dẫn Trả góp 0% */}
              <button
                type="button"
                onClick={onOpenInstallment}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer group flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 hover:border-purple-500/50'
                    : 'bg-slate-50 hover:bg-purple-50/50 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div>
                  <div className="font-bold text-purple-500 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Hỗ Trợ Mua Trả Góp 0% Lãi Suất</span>
                  </div>
                  <div className={`text-[11px] mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Thủ tục duyệt online trong 5 phút qua CCCD gắn chip
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>
          </div>

          {/* CỘT 3: THANH TOÁN & GIAO HÀNG TOÀN QUỐC (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Thanh toán */}
            <div className="space-y-2">
              <h4
                className={`text-xs font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Phương Thức Thanh Toán
              </h4>
              <div className="flex flex-wrap items-center gap-1.5">
                <BadgeVietQR className="h-6 w-auto" />
                <BadgeVNPay className="h-6 w-auto" />
                <BadgeMoMo className="h-6 w-auto" />
                <BadgeVisaMaster className="h-6 w-auto" />
                <BadgeHomeCredit className="h-6 w-auto" />
                <BadgeHDSaison className="h-6 w-auto" />
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Thanh toán chuyển khoản VietQR, tiền mặt khi nhận hàng (Ship COD), thẻ và trả góp 0%.
              </p>
            </div>

            {/* Vận chuyển */}
            <div className="space-y-2 pt-2 border-t dark:border-slate-800">
              <h4
                className={`text-xs font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Đối Tác Vận Chuyển Toàn Quốc
              </h4>
              <div className="flex flex-wrap items-center gap-1.5">
                <BadgeViettelPost className="h-6 w-auto" />
                <BadgeGHTK className="h-6 w-auto" />
                <BadgeGHN className="h-6 w-auto" />
                <BadgeJTExpress className="h-6 w-auto" />
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Giao hàng tận nơi toàn quốc. Đóng thùng xốp bóng khí, quý khách được <strong>đồng kiểm tra máy trước khi thanh toán</strong>.
              </p>
            </div>

            {/* Chứng nhận pháp lý */}
            <div className="space-y-1.5 pt-2 border-t dark:border-slate-800">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Chứng nhận & Bảo mật
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <BadgeBoCongThuong className="h-7 w-auto" />
                <BadgeDMCA className="h-6 w-auto" />
                <BadgeSSL className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DÒNG BẢN QUYỀN & TRUY CẬP HỆ THỐNG */}
      <div
        className={`border-t py-3.5 text-xs ${
          isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-sky-500">© 2026 {storeName}</span>
            <span className="mx-2 opacity-40">|</span>
            <span>Địa chỉ duy nhất: <strong>{soleAddress}</strong></span>
            <span className="hidden md:inline mx-2 opacity-40">|</span>
            <span className="hidden md:inline">Hotline: <strong className="text-emerald-500 font-mono">{consultationPhone}</strong></span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Zalo Hỗ Trợ</span>
            </a>

            <button
              type="button"
              onClick={onOpenAdmin}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
              }`}
            >
              Quản Trị Hệ Thống
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
