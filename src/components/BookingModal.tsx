import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, Copy, Check } from 'lucide-react';
import { ServiceItem } from '../types/shop';
import { createRepairBooking } from '../db/storage';
import { useTheme } from '../context/ThemeContext';

interface BookingModalProps {
  services: ServiceItem[];
  preselectedService?: ServiceItem | null;
  onClose: () => void;
  onSuccess: (orderCode: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  services,
  preselectedService,
  onClose,
  onSuccess,
}) => {
  const { isDark } = useTheme();
  const [selectedServiceId, setSelectedServiceId] = useState(
    preselectedService ? preselectedService.id : services[0]?.id || ''
  );
  const [deviceType, setDeviceType] = useState('Laptop Asus / Dell / HP / Lenovo');
  const [issueDescription, setIssueDescription] = useState('');
  const [serviceLocation, setServiceLocation] = useState<'at_shop' | 'on_site'>('at_shop');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Vui lòng điền họ tên và số điện thoại liên hệ.');
      return;
    }
    if (!issueDescription.trim()) {
      setErrorMsg('Vui lòng mô tả sơ lược tình trạng máy tính cần sửa.');
      return;
    }

    const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

    const order = createRepairBooking({
      customerName,
      customerPhone,
      customerAddress,
      customerEmail,
      serviceId: currentService.id,
      serviceName: currentService.name,
      deviceType,
      issueDescription,
      serviceLocation,
      appointmentDate,
      appointmentTime,
      estimatedPrice: currentService.rawPrice || 250000,
    });

    setBookingSuccessCode(order.orderCode);
    onSuccess(order.orderCode);
  };

  const handleCopy = () => {
    if (bookingSuccessCode) {
      navigator.clipboard.writeText(bookingSuccessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-left">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer border ${
            isDark
              ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {bookingSuccessCode ? (
          <div className="py-6 text-center space-y-4">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border ${
                isDark
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Đặt Lịch Sửa Chữa Thành Công!
            </h3>

            <p className={`text-sm max-w-md mx-auto font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Kỹ thuật viên của Nexus Tech Lab đã tiếp nhận thông tin và sẽ gọi điện xác nhận trong vòng 10 phút.
            </p>

            <div
              className={`p-4 rounded-2xl border max-w-sm mx-auto space-y-2 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/50 border-sky-200'
              }`}
            >
              <div className={`text-xs uppercase tracking-wider font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Mã Phiếu Tiếp Nhận (Dùng Để Tra Cứu)
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-2xl font-extrabold font-mono tracking-wider ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                  {bookingSuccessCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                  }`}
                  title="Sao chép mã"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Hoàn Tất
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                <Wrench className="w-3.5 h-3.5" />
                <span>Tiếp Nhận Dịch Vụ Kỹ Thuật</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Đặt Lịch Khám & Sửa Máy Tính
              </h2>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Kiểm tra lỗi miễn phí 100% · Báo giá minh bạch trước khi sửa · Bảo hành dài hạn
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* Gói dịch vụ */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Gói dịch vụ mong muốn:
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                }`}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.priceEstimate})
                  </option>
                ))}
              </select>
            </div>

            {/* Loại thiết bị & Địa điểm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Loại máy tính / Thiết bị:
                </label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm border focus:outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                  }`}
                >
                  <option value="Laptop Asus / Dell / HP / Lenovo / Acer">Laptop Windows (Dell, Asus, HP...)</option>
                  <option value="Apple MacBook Pro / MacBook Air">MacBook (Air / Pro / M1/M2/M3)</option>
                  <option value="PC Desktop Gaming / Đồ họa">PC Gaming / Máy bàn đồ họa</option>
                  <option value="PC Văn phòng / Đồng bộ Dell HP">PC Văn phòng đồng bộ</option>
                  <option value="Linh kiện lẻ (VGA, Ổ cứng, Nguồn...)">Linh kiện lẻ cần cứu/sửa</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Hình thức tiếp nhận:
                </label>
                <select
                  value={serviceLocation}
                  onChange={(e) => setServiceLocation(e.target.value as 'at_shop' | 'on_site')}
                  className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm border focus:outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                  }`}
                >
                  <option value="at_shop">Mang máy tới Showroom (Kiểm tra lấy liền)</option>
                  <option value="on_site">Kỹ thuật viên tới tận nơi (Nội thành)</option>
                </select>
              </div>
            </div>

            {/* Triệu chứng lỗi */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Mô tả triệu chứng hư hỏng của máy: *
              </label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Ví dụ: Máy bấm nguồn quạt quay nhưng không lên hình, sọc màn hình, máy quá nóng sập nguồn khi mở game..."
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
                }`}
              />
            </div>

            {/* Ngày & Giờ hẹn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Ngày hẹn dự kiến:
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm border focus:outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Khung giờ thuận tiện:
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm border focus:outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                  }`}
                >
                  <option value="09:00">09:00 Sáng</option>
                  <option value="10:30">10:30 Sáng</option>
                  <option value="14:00">14:00 Chiều</option>
                  <option value="16:30">16:30 Chiều</option>
                  <option value="19:00">19:00 Tối</option>
                </select>
              </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className={`pt-2 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Thông Tin Liên Hệ Khách Hàng
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Họ và tên của bạn *"
                    className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm border focus:outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500 placeholder:text-slate-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Số điện thoại nhận tin SMS *"
                    className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm border focus:outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500 placeholder:text-slate-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Địa chỉ nhà (nếu chọn kỹ thuật viên đến tận nơi)"
                  className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm border focus:outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500 placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Xác Nhận Đặt Lịch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

