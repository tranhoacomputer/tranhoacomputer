import React, { useState } from 'react';
import {
  X,
  CreditCard,
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  Percent,
  Clock,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';
import { Product, StoreSettings, UserAccount, InstallmentDetails, CartItem } from '../types/shop';
import { formatVND, createProductOrder } from '../db/storage';
import { useTheme } from '../context/ThemeContext';

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  cartItems?: CartItem[];
  settings: StoreSettings;
  currentUser?: UserAccount | null;
  onSuccess: (orderCode: string) => void;
}

export const InstallmentModal: React.FC<InstallmentModalProps> = ({
  isOpen,
  onClose,
  product,
  cartItems,
  settings,
  currentUser,
  onSuccess,
}) => {
  const { isDark } = useTheme();

  // Installment configuration
  const [method, setMethod] = useState<'id_card' | 'credit_card'>('id_card');
  const [provider, setProvider] = useState<string>('Home Credit (Duyệt 5P)');
  const [termMonths, setTermMonths] = useState<number>(6);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);

  // Form fields
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('Từ 8 - 15 triệu');
  const [pickupOption, setPickupOption] = useState<'in_store' | 'local_express'>('in_store');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate base price
  const basePrice = product
    ? product.price
    : cartItems && cartItems.length > 0
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 15490000;

  const downPaymentAmount = Math.round((basePrice * downPaymentPercent) / 100);
  const loanAmount = Math.max(0, basePrice - downPaymentAmount);
  const monthlyPayment = Math.round(loanAmount / termMonths);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Vui lòng nhập họ tên và số điện thoại liên hệ thẩm định hồ sơ.');
      return;
    }

    setIsSubmitting(true);

    const installmentDetails: InstallmentDetails = {
      method,
      provider,
      termMonths,
      downPaymentPercent,
      downPaymentAmount,
      loanAmount,
      monthlyPayment,
      interestRate: 0,
      idCardNumber: idCardNumber.trim() || undefined,
      monthlyIncome,
    };

    const itemsToOrder: CartItem[] = product
      ? [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl,
            specsSnippet: product.specs.cpu || 'Cấu hình tiêu chuẩn',
          },
        ]
      : cartItems && cartItems.length > 0
      ? cartItems
      : [
          {
            productId: 'demo-pc',
            name: 'Gói Trả Góp Sản Phẩm Máy Tính Công Nghệ 0%',
            price: basePrice,
            quantity: 1,
            imageUrl: '',
          },
        ];

    const order = createProductOrder({
      customerName,
      customerPhone,
      customerAddress: customerAddress || `Nhận tại showroom ${settings.targetProvince || 'Hải Phòng'}`,
      customerId: currentUser?.id,
      items: itemsToOrder,
      totalAmount: basePrice,
      paymentMethod: 'installment_0',
      fulfillmentType: pickupOption,
      installmentDetails,
      notes: `Hồ sơ trả góp 0%: Trả trước ${downPaymentPercent}% (${formatVND(downPaymentAmount)}), kỳ hạn ${termMonths} tháng qua ${provider}. Thu nhập: ${monthlyIncome}.`,
    });

    setIsSubmitting(false);
    onSuccess(order.orderCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in text-left">
      <div
        className={`w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl flex flex-col transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight">
                  MUA TRẢ GÓP 0% LÃI SUẤT
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  DUYỆT 5 PHÚT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chính sách trả góp 0% độc quyền tại {settings.targetProvince || 'Hải Phòng'} · Hỗ trợ qua CCCD hoặc Thẻ Tín Dụng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Summary Mini Card */}
        <div className="px-5 sm:px-6 pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase font-mono block">
                Sản phẩm đăng ký trả góp:
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {product ? product.name : cartItems ? `Giỏ hàng (${cartItems.length} sản phẩm)` : 'Thiết bị công nghệ'}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block font-mono">Giá niêm yết</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatVND(basePrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Chọn hình thức trả góp */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
              <span>1. Chọn phương thức trả góp 0%</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMethod('id_card');
                  setProvider('Home Credit (Duyệt 5P)');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  method === 'id_card'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Qua CCCD Gắn Chip
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Không cần thẻ tín dụng, chỉ cần CCCD từ 18 tuổi, duyệt online trong 5 phút.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('credit_card');
                  setProvider('Thẻ Tín Dụng Quốc Tế 0% (Visa/Mastercard)');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  method === 'credit_card'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Qua Thẻ Tín Dụng (Visa/Mastercard)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Hỗ trợ 28 ngân hàng lớn, không cần chứng minh thu nhập, duyệt tự động 100%.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Đối tác tài chính */}
          {method === 'id_card' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Chọn đối tác thẩm định:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Home Credit (Duyệt 5P)', 'FE Credit 0%', 'HD Saison'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProvider(p)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer truncate ${
                      provider === p
                        ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ngân hàng phát hành thẻ:
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
              >
                <option value="Vietcombank (0% Lãi Suất)">Vietcombank (0% Lãi Suất)</option>
                <option value="Techcombank (0% Lãi Suất)">Techcombank (0% Lãi Suất)</option>
                <option value="MB Bank (0% Lãi Suất)">MB Bank (0% Lãi Suất)</option>
                <option value="VPBank (0% Lãi Suất)">VPBank (0% Lãi Suất)</option>
                <option value="TPBank (0% Lãi Suất)">TPBank (0% Lãi Suất)</option>
                <option value="Sacombank (0% Lãi Suất)">Sacombank (0% Lãi Suất)</option>
                <option value="ACB (0% Lãi Suất)">ACB (0% Lãi Suất)</option>
                <option value="Ngân hàng Quốc tế khác">Ngân hàng Quốc tế khác (Visa/Master/JCB)</option>
              </select>
            </div>
          )}

          {/* Step 2: Chọn trả trước & kỳ hạn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trả trước */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Số tiền trả trước:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 10, 20, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDownPaymentPercent(pct)}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer font-mono ${
                      downPaymentPercent === pct
                        ? 'border-sky-500 bg-sky-500 text-white font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between font-mono pt-0.5">
                <span>Tiền trả trước:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">
                  {formatVND(downPaymentAmount)}
                </span>
              </div>
            </div>

            {/* Kỳ hạn */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Kỳ hạn trả góp:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTermMonths(m)}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer font-mono ${
                      termMonths === m
                        ? 'border-sky-500 bg-sky-500 text-white font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m} Tháng
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between font-mono pt-0.5">
                <span>Số tiền vay góp:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatVND(loanAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Bảng tính chi tiết minh bạch */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent border border-sky-500/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-sky-500/20">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Góp mỗi tháng (0% Lãi suất):
              </span>
              <span className="text-lg font-black text-sky-600 dark:text-sky-400 font-mono">
                {formatVND(monthlyPayment)} <span className="text-xs font-normal">/ tháng</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono pt-1">
              <div>
                <span className="block text-[10px] text-slate-400">LÃI SUẤT THỰC</span>
                <span className="font-bold text-emerald-500">0% Chuẩn VNA</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">PHÍ BẢO HIỂM</span>
                <span className="font-bold text-emerald-500">0₫ (Miễn phí)</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">CHÊNH LỆCH VỚI MUA THẲNG</span>
                <span className="font-bold text-emerald-500">0₫</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">THỜI GIAN DUYỆT</span>
                <span className="font-bold text-sky-500">5 - 15 phút</span>
              </div>
            </div>
          </div>

          {/* Step 3: Thông tin người mua */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                3. Thông tin người đăng ký trả góp
              </label>
              {currentUser && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã tự động điền từ tài khoản
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Họ và tên: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Số điện thoại thẩm định: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ví dụ: 0988 123 456"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {method === 'id_card' && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Số CCCD (12 số):
                  </label>
                  <input
                    type="text"
                    value={idCardNumber}
                    onChange={(e) => setIdCardNumber(e.target.value)}
                    placeholder="Nhập 12 số CCCD để duyệt hồ sơ nhanh"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Thu nhập hàng tháng:
                </label>
                <select
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                >
                  <option value="Dưới 8 triệu">Dưới 8 triệu</option>
                  <option value="Từ 8 - 15 triệu">Từ 8 - 15 triệu (Dễ duyệt nhất)</option>
                  <option value="Từ 15 - 30 triệu">Từ 15 - 30 triệu</option>
                  <option value="Trên 30 triệu">Trên 30 triệu</option>
                </select>
              </div>
            </div>

            {/* Hình thức nhận máy */}
            <div className="pt-1">
              <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                Hình thức nhận sản phẩm sau khi duyệt:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPickupOption('in_store')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-2 ${
                    pickupOption === 'in_store'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Ghé Showroom tại {settings.targetProvince || 'Hải Phòng'} nhận máy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupOption('local_express')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-2 ${
                    pickupOption === 'local_express'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Giao tận nhà tại {settings.targetProvince || 'Hải Phòng'} (Hỏa tốc 1-2h)</span>
                </button>
              </div>
            </div>

            {pickupOption === 'local_express' && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Địa chỉ nhận máy tận nơi tại {settings.targetProvince || 'tỉnh thành'}:
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ví dụ: Số 12 Đường Lạch Tray, Quận Ngô Quyền, Hải Phòng"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <PhoneCall className="w-4 h-4 text-sky-500" />
              <span>Hotline tư vấn trả góp: <strong>{settings.installmentHotline || settings.hotline}</strong></span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Đóng
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
              >
                <span>Xác Nhận Đăng Ký Trả Góp 0%</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
