import React from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Mail,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { StoreBranch } from '../types/shop';

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStore?: (storeName: string) => void;
  branches?: StoreBranch[];
}

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const storeName = 'TRẦN HOA COMPUTER';
  const soleAddress = 'Phú Thịnh - Thái Nguyên';
  const consultationPhone = '0963284044';
  const supportEmail = 'hotrokhachhang@tranhoacomputer.site';
  const zaloUrl = 'https://zalo.me/84963284044';
  const zaloDisplay = 'zalo.me/84963284044';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in text-left">
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-start justify-between border-b pb-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border ${
                isDark
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-amber-400' : 'text-amber-600'
                }`}
              >
                <span>THÔNG BÁO ĐỊA CHỈ HOẠT ĐỘNG CHÍNH THỨC</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Cửa Hàng Duy Nhất Tại Thái Nguyên
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

        {/* CẢNH BÁO QUAN TRỌNG: CỬA HÀNG DUY NHẤT - KHÔNG CÓ BẤT CỨ CHI NHÁNH NÀO TRÊN TOÀN QUỐC */}
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
            isDark
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-amber-50/90 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold uppercase font-mono text-xs text-amber-500">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-amber-500" />
            <span>CẢNH BÁO CHỐNG MẠO DANH CHI NHÁNH</span>
          </div>
          <p className="font-medium">
            Kính gửi Quý khách hàng: Hiện tại <strong>{storeName}</strong> chỉ có <strong>DUY NHẤT 01 ĐỊA CHỈ</strong> tại <strong>Phú Thịnh - Thái Nguyên</strong>. Chúng tôi <strong>KHÔNG CÓ BẤT CỨ CHI NHÁNH NÀO TRÊN TOÀN QUỐC</strong>. Mọi trang web, cơ sở hoặc cá nhân tự xưng là chi nhánh ủy quyền tại Hà Nội, TP.HCM hay các tỉnh thành khác đều hoàn toàn không chính xác.
          </p>
        </div>

        {/* THẺ ĐỊA CHỈ & THÔNG TIN LIÊN LẠC CHÍNH THỨC */}
        <div
          className={`p-5 rounded-2xl space-y-4 border ${
            isDark
              ? 'bg-slate-950 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {storeName} - Trụ Sở & Cửa Hàng Duy Nhất
              </h3>
              <p className="text-xs text-sky-500 font-medium">
                Trung tâm bán lẻ máy tính, laptop & bảo dưỡng sửa chữa
              </p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ĐANG MỞ CỬA TIẾP NHẬN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Địa chỉ duy nhất */}
            <div className="flex items-start gap-2.5 sm:col-span-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Địa chỉ cửa hàng duy nhất:
                </span>
                <span className="text-sky-500 font-bold text-sm">{soleAddress}</span>
              </div>
            </div>

            {/* Số điện thoại tư vấn */}
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Số điện thoại tư vấn cửa hàng:
                </span>
                <a
                  href={`tel:${consultationPhone}`}
                  className="font-mono font-bold text-emerald-500 text-sm hover:underline"
                >
                  {consultationPhone}
                </a>
              </div>
            </div>

            {/* Link Zalo hỗ trợ */}
            <div className="flex items-start gap-2.5">
              <MessageCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Link Zalo hỗ trợ kỹ thuật:
                </span>
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-blue-500 hover:underline flex items-center gap-1"
                >
                  <span>{zaloDisplay}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Email hỗ trợ */}
            <div className="flex items-start gap-2.5 sm:col-span-2">
              <Mail className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Email hỗ trợ khách hàng:
                </span>
                <a
                  href={`mailto:${supportEmail}`}
                  className="font-mono text-sky-500 hover:underline font-semibold"
                >
                  {supportEmail}
                </a>
              </div>
            </div>

            {/* Giờ làm việc */}
            <div className="flex items-start gap-2.5 sm:col-span-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Thời gian hoạt động:
                </span>
                <span>08:00 - 21:30 (Mở cửa tất cả các ngày trong tuần, kể cả Thứ 7, Chủ Nhật & Ngày Lễ)</span>
              </div>
            </div>
          </div>

          {/* Dịch vụ nổi bật tại cửa hàng */}
          <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-slate-800">
            <span
              className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border font-medium ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Phòng Lab sửa chữa & nâng cấp lấy liền 30P
            </span>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border font-medium ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Lắp ráp PC Gaming theo yêu cầu
            </span>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border font-medium ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Vệ sinh tra keo tản nhiệt miễn phí
            </span>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border font-medium ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Thu cũ đổi mới trợ giá cao
            </span>
          </div>
        </div>

        {/* HƯỚNG DẪN KHÁCH HÀNG Ở XA (TOÀN QUỐC) */}
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
            isDark
              ? 'bg-sky-500/10 border-sky-500/20 text-sky-200'
              : 'bg-sky-50 border-sky-200 text-sky-900'
          }`}
        >
          <Truck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block uppercase font-mono text-[11px]">
              DÀNH CHO KHÁCH HÀNG NGOÀI THÁI NGUYÊN (63 TỈNH THÀNH)
            </span>
            <p className="mt-0.5">
              Dù chỉ có 01 cửa hàng duy nhất tại Thái Nguyên, chúng tôi phục vụ giao hàng toàn quốc qua <strong>Viettel Post, GHTK, GHN, J&T</strong>. Hàng hóa được đóng thùng xốp bóng khí, có bảo hiểm 100% giá trị. Quý khách <strong>được mở hộp kiểm tra máy trước khi thanh toán tiền (Ship COD)</strong>. Hỗ trợ kỹ thuật từ xa trọn đời qua UltraViewer và Zalo Video.
            </p>
          </div>
        </div>

        {/* HÀNH ĐỘNG NHANH */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <a
            href={`tel:${consultationPhone}`}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi Hotline: {consultationPhone}</span>
          </a>
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Nhắn Zalo: {zaloDisplay}</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
