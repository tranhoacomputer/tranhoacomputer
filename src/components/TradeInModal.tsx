import React, { useState } from 'react';
import { X, RefreshCw, Sparkles } from 'lucide-react';
import { formatVND, createRepairBooking } from '../db/storage';
import { useTheme } from '../context/ThemeContext';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const TradeInModal: React.FC<TradeInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const [deviceType, setDeviceType] = useState('laptop_gaming');
  const [brand, setBrand] = useState('ASUS');
  const [modelName, setModelName] = useState('');
  const [condition, setCondition] = useState<'grade_a' | 'grade_b' | 'grade_c'>('grade_a');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Chi nhánh Quận 10 - 182 Đường 3/2');

  // Calculate estimated buyback value
  const baseValueMap: Record<string, number> = {
    laptop_gaming: 8500000,
    laptop_office: 4500000,
    macbook: 12500000,
    pc_desktop: 6000000,
  };

  const conditionMultiplier: Record<string, number> = {
    grade_a: 1.0,
    grade_b: 0.85,
    grade_c: 0.65,
  };

  const baseVal = baseValueMap[deviceType] || 6000000;
  const estimatedValue = Math.round(baseVal * conditionMultiplier[condition]);
  const subsidyBonus = 2000000; // Trợ giá lên đời 2 triệu

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    // Create a trade-in inspection booking
    const order = createRepairBooking({
      customerName,
      customerPhone,
      customerAddress: selectedBranch,
      serviceId: 'srv-trade-in',
      serviceName: `Thu Cũ Đổi Mới: ${brand} ${modelName || 'Thiết bị cũ'}`,
      deviceType: `${deviceType.toUpperCase()} - ${brand}`,
      issueDescription: `Khách đăng ký thẩm định thu cũ đổi mới. Định giá tham khảo: ${formatVND(estimatedValue)} + Trợ giá: ${formatVND(subsidyBonus)}. Tình trạng: ${condition === 'grade_a' ? 'Loại 1 (Đẹp)' : condition === 'grade_b' ? 'Loại 2 (Trầy nhẹ)' : 'Loại 3 (Cũ)'}`,
      serviceLocation: 'at_shop',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: 'Trong ngày',
      estimatedPrice: 0,
    });

    onSuccess(order.orderCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-left">
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between border-b pb-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border ${
                isDark
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  : 'bg-sky-50 text-sky-600 border-sky-200'
              }`}
            >
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <div
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-sky-400' : 'text-sky-600'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>CHƯƠNG TRÌNH ĐỘC QUYỀN TOÀN HỆ THỐNG</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Thu Cũ Đổi Mới - Trợ Giá Lên Đến 5 Triệu
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

        {/* Trade-in step wizard form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Step 1: Device Type */}
          <div>
            <label className={`font-bold block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              1. Chọn loại thiết bị máy tính cũ của bạn:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'laptop_gaming', label: 'Laptop Gaming' },
                { id: 'laptop_office', label: 'Laptop Văn Phòng' },
                { id: 'macbook', label: 'MacBook Apple' },
                { id: 'pc_desktop', label: 'Dàn PC Desktop' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDeviceType(t.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                    deviceType === t.id
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                2. Thương hiệu máy:
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                }`}
              >
                <option value="ASUS">ASUS (ROG / TUF / Vivobook)</option>
                <option value="Apple">Apple (MacBook Pro / Air)</option>
                <option value="Dell">Dell (Alienware / Inspiron / XPS)</option>
                <option value="Lenovo">Lenovo (Legion / ThinkPad / LOQ)</option>
                <option value="MSI">MSI Gaming / Creator</option>
                <option value="HP">HP (Victus / Omen / Pavilion)</option>
                <option value="Khac">Thương hiệu khác / PC Tự Ráp</option>
              </select>
            </div>

            <div>
              <label className={`font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Model máy hoặc cấu hình (nếu nhớ):
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Ví dụ: TUF F15 i7-11800H, RTX 3050"
                className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Step 3: Condition selection */}
          <div>
            <label className={`font-bold block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              3. Tình trạng ngoại hình & hoạt động:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'grade_a',
                  title: 'Loại 1: Hoàn Hảo (99%)',
                  desc: 'Màn hình đẹp, không trầy xước nặng, tính năng hoàn hảo.',
                },
                {
                  id: 'grade_b',
                  title: 'Loại 2: Đã Qua Dùng',
                  desc: 'Trầy xước nhẹ theo thời gian, mọi tính năng hoạt động tốt.',
                },
                {
                  id: 'grade_c',
                  title: 'Loại 3: Có Hao Mòn',
                  desc: 'Pin chai hoặc bàn phím cấn, vỏ trầy xước nhiều.',
                },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    condition === c.id
                      ? isDark
                        ? 'bg-sky-500/20 border-sky-500 text-white'
                        : 'bg-sky-50 border-sky-500 text-sky-950 ring-1 ring-sky-500'
                      : isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.title}</div>
                  <div className={`text-[11px] mt-1 leading-snug font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Valuation Calculation Card */}
          <div
            className={`p-4 rounded-2xl space-y-3 border ${
              isDark
                ? 'bg-gradient-to-r from-sky-950/40 via-slate-950 to-slate-950 border-sky-500/40'
                : 'bg-gradient-to-r from-sky-50 via-sky-50/50 to-white border-sky-200'
            }`}
          >
            <div className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center justify-between ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
              <span>Định Giá Dự Kiến & Trợ Giá Lên Đời:</span>
              <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded font-bold">
                ƯU ĐÃI NỔI BẬT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Giá thu cũ máy ước tính:</div>
                <div className={`text-lg font-black font-mono mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatVND(estimatedValue)}
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Trợ giá lên đời máy mới:</div>
                <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">
                  + {formatVND(subsidyBonus)}
                </div>
              </div>
            </div>

            <div
              className={`pt-1 flex items-center justify-between text-xs border-t ${
                isDark ? 'border-slate-800' : 'border-sky-200'
              }`}
            >
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Tổng số tiền trừ trực tiếp vào máy mới:
              </span>
              <span className={`text-xl font-black font-mono ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                {formatVND(estimatedValue + subsidyBonus)}
              </span>
            </div>
          </div>

          {/* Customer contact to reserve valuation appointment */}
          <div className={`space-y-3 border-t pt-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              4. Thông tin nhận mã trợ giá & hẹn kiểm tra tại siêu thị:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Họ và tên của bạn *"
                className={`rounded-xl px-3 py-2 text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
                }`}
              />
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Số điện thoại Zalo *"
                className={`rounded-xl px-3 py-2 text-xs border focus:outline-none font-mono ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
                }`}
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
              }`}
            >
              <option value="Chi nhánh Quận 10 - 182 Đường 3/2, TP.HCM">
                TP.HCM: 182 Đường 3/2, Phường 12, Quận 10 (Showroom & Lab lớn)
              </option>
              <option value="Chi nhánh Cầu Giấy - 26 Thái Hà, Đống Đa, Hà Nội">
                Hà Nội: 26 Thái Hà, Quận Đống Đa
              </option>
              <option value="Chi nhánh Đà Nẵng - 132 Nguyễn Văn Linh, Đà Nẵng">
                Đà Nẵng: 132 Nguyễn Văn Linh, Hải Châu
              </option>
              <option value="Kỹ thuật viên đến tận nhà kiểm tra">
                Hỗ trợ kỹ thuật viên đến thẩm định tận nhà (Miễn phí tại TP.HCM & Hà Nội)
              </option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 font-semibold rounded-xl cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Nhận Mã Trợ Giá & Hẹn Thẩm Định
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

