import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  ArrowRight,
  CheckCircle2,
  QrCode,
  CreditCard,
  Building2,
  Truck,
  Percent,
  Sparkles,
  LogIn,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CartItem, StoreSettings, UserAccount, StoreBranch, PaymentMethod, FulfillmentType } from '../types/shop';
import { formatVND, createProductOrder } from '../db/storage';
import { useTheme } from '../context/ThemeContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  settings: StoreSettings;
  branches?: StoreBranch[];
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
  onOpenInstallmentModal?: (cartItems: CartItem[]) => void;
  onOrderSuccess: (orderCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  branches = [],
  currentUser,
  onOpenAuthModal,
  onOpenInstallmentModal,
  onOrderSuccess,
}) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState('');

  // Fulfillment & payment options
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('local_express');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Checkout form
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [notes, setNotes] = useState('');
  const [createdOrderCode, setCreatedOrderCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerPhone) setCustomerPhone(currentUser.phone);
      if (!customerAddress) setCustomerAddress(currentUser.address || '');
      if (!customerEmail) setCustomerEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Set default branch if available
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      const matchTarget = branches.find((b) =>
        b.cityName?.toLowerCase().includes((settings.targetProvince || 'Hải Phòng').toLowerCase())
      );
      setSelectedBranchId(matchTarget ? matchTarget.id : branches[0].id);
    }
  }, [branches, settings.targetProvince]);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = voucherCode.trim().toUpperCase();
    if (clean === 'CHAOMOI') {
      setDiscountAmount(200000);
      setVoucherMsg('Áp dụng mã CHAOMOI: Giảm 200.000₫!');
    } else if (clean === 'NEXUSVIP') {
      setDiscountAmount(500000);
      setVoucherMsg('Áp dụng mã VIP: Giảm 500.000₫!');
    } else {
      setDiscountAmount(0);
      setVoucherMsg('Mã voucher không hợp lệ.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Vui lòng điền họ tên và số điện thoại liên hệ nhận hàng.');
      return;
    }

    if (fulfillmentType !== 'in_store' && !customerAddress.trim()) {
      setErrorMsg('Vui lòng điền địa chỉ giao hàng tận nơi.');
      return;
    }

    // If installment_0 is clicked, open dedicated installment modal
    if (paymentMethod === 'installment_0') {
      if (onOpenInstallmentModal) {
        onOpenInstallmentModal(items);
        onClose();
        return;
      }
    }

    const newOrder = createProductOrder({
      customerName,
      customerPhone,
      customerAddress:
        fulfillmentType === 'in_store'
          ? `Nhận tại: ${selectedBranch?.name || 'Showroom chi nhánh'}`
          : customerAddress,
      customerEmail,
      customerId: currentUser?.id,
      items,
      totalAmount: finalTotal,
      paymentMethod,
      fulfillmentType,
      pickupBranchId: fulfillmentType === 'in_store' ? selectedBranchId : undefined,
      pickupBranchName: fulfillmentType === 'in_store' ? selectedBranch?.name : undefined,
      notes:
        notes +
        (discountAmount > 0 ? ` (Đã áp dụng voucher giảm ${formatVND(discountAmount)})` : '') +
        (fulfillmentType === 'local_express' ? ` [Hỏa tốc ${settings.provinceExpressHours || '1-2h'} nội thành ${settings.targetProvince}]` : ''),
    });

    setCreatedOrderCode(newOrder.orderCode);
    setStep('success');
    onClearCart();
    onOrderSuccess(newOrder.orderCode);
  };

  // VietQR URL
  const vietQrUrl = `https://img.vietqr.io/image/${settings.bankName.replace(/\s+/g, '')}-${settings.bankAccount}-compact2.png?amount=${finalTotal}&addInfo=${encodeURIComponent(createdOrderCode || 'NEXUS')}&accountName=${encodeURIComponent(settings.bankAccountName)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen max-w-md shadow-2xl flex flex-col justify-between transition-colors border-l ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step === 'cart'
                  ? 'Giỏ Hàng Của Bạn'
                  : step === 'checkout'
                  ? 'Đặt Hàng & Thanh Toán'
                  : 'Đặt Hàng Thành Công'}
              </h2>
              {step === 'cart' && (
                <span className={`text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  ({items.reduce((sum, i) => sum + i.quantity, 0)} món)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div
                      className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl ${
                        isDark ? 'bg-slate-800 text-slate-400' : 'bg-sky-50 text-sky-600'
                      }`}
                    >
                      🛒
                    </div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Giỏ hàng đang trống
                    </div>
                    <p className={`text-xs max-w-xs mx-auto font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Hãy chọn sản phẩm máy tính, laptop hoặc linh kiện ưng ý để thêm vào giỏ.
                    </p>
                  </div>
                ) : (
                  <div className={`divide-y space-y-3 ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {items.map((item) => (
                      <div key={item.productId} className="pt-3 first:pt-0 flex items-start gap-3">
                        <div
                          className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 text-xl ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50 border-sky-100'
                          }`}
                        >
                          💻
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className={`text-xs sm:text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {item.name}
                          </h4>
                          <div className={`text-xs font-mono font-bold tabular-nums ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                            {formatVND(item.price)}
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-2 pt-1">
                            <div
                              className={`flex items-center rounded-lg border ${
                                isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-50'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.productId, -1)}
                                className={`px-2 py-0.5 text-xs font-bold ${
                                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                -
                              </button>
                              <span className={`px-2 py-0.5 text-xs font-mono font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.productId, 1)}
                                className={`px-2 py-0.5 text-xs font-bold ${
                                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.productId)}
                              className="text-slate-400 hover:text-red-500 p-1 text-xs cursor-pointer"
                              title="Xóa khỏi giỏ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Voucher input */}
                {items.length > 0 && (
                  <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <form onSubmit={handleApplyVoucher} className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Mã voucher (nhập CHAOMOI)..."
                        className={`flex-1 rounded-xl px-3 py-1.5 text-xs font-mono border focus:outline-none ${
                          isDark
                            ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                        }`}
                      />
                      <button
                        type="submit"
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                        }`}
                      >
                        Áp Dụng
                      </button>
                    </form>
                    {voucherMsg && (
                      <p className={`text-[11px] mt-1.5 font-medium ${discountAmount > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {voucherMsg}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {step === 'checkout' && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {/* User login helper banner */}
                {currentUser ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium truncate">
                        Đã tự động điền thông tin của <strong>{currentUser.name}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                      {currentUser.rank}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="text-xs text-sky-800 dark:text-sky-300 font-medium">
                        Bạn có tài khoản?
                      </span>
                    </div>
                    {onOpenAuthModal && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Đăng nhập 1 chạm
                      </button>
                    )}
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 1. HÌNH THỨC NHẬN HÀNG */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    1. Phương thức nhận hàng:
                  </label>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {/* Hỏa tốc trong tỉnh */}
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('local_express')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        fulfillmentType === 'local_express'
                          ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Hỏa tốc {settings.provinceExpressHours || '1-2h'} tại {settings.targetProvince || 'Hải Phòng'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-500">Miễn phí ship</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Kỹ thuật viên giao tận nhà, hỗ trợ khui hộp và cài đặt theo yêu cầu.
                        </p>
                      </div>
                    </button>

                    {/* Mua tại cửa hàng */}
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('in_store')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        fulfillmentType === 'in_store'
                          ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Nhận tại Siêu Thị / Showroom
                          </span>
                          <span className="text-[10px] font-bold text-sky-500">Giữ máy trước</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Đến xem máy thực tế, test linh kiện trực tiếp cùng kỹ thuật viên.
                        </p>
                      </div>
                    </button>

                    {/* Ship COD toàn quốc */}
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('nationwide_cod')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        fulfillmentType === 'nationwide_cod'
                          ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Ship COD Toàn Quốc
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">Đồng kiểm tra</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Đóng gói niêm phong chống sốc, kiểm tra máy trước khi thanh toán.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Chọn chi nhánh nếu chọn in_store */}
                {fulfillmentType === 'in_store' && branches.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                      <span>Chọn chi nhánh nhận máy:</span>
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} - {b.cityName} ({b.address})
                        </option>
                      ))}
                    </select>
                    {selectedBranch && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                        Hotline showroom: <strong>{selectedBranch.hotline}</strong> · Mở cửa:{' '}
                        {selectedBranch.hours}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. THÔNG TIN KHÁCH HÀNG */}
                <div className="space-y-3 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    2. Thông tin người nhận:
                  </label>

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
                      Số điện thoại nhận hàng: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ví dụ: 0912 345 678"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                    />
                  </div>

                  {fulfillmentType !== 'in_store' && (
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        Địa chỉ nhận hàng chi tiết: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder={`Số nhà, tên đường tại ${settings.targetProvince || 'tỉnh thành'} hoặc toàn quốc`}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Ghi chú thêm cho kỹ thuật viên:
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Cài sẵn Win 11, chia ổ đĩa D, giao giờ hành chính..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* 3. PHƯƠNG THỨC THANH TOÁN */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    3. Hình thức thanh toán:
                  </label>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-2 text-sky-500" />
                      <span>Tiền Mặt (COD)</span>
                      <span className="text-[10px] font-normal text-slate-400">Đồng kiểm tra hàng</span>
                    </button>

                    {/* VietQR */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vietqr')}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                        paymentMethod === 'vietqr'
                          ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mb-2 text-emerald-500" />
                      <span>Chuyển Khoản VietQR</span>
                      <span className="text-[10px] font-normal text-slate-400">Quét mã 24/7 tức thì</span>
                    </button>

                    {/* Trả góp 0% */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('installment_0');
                        if (onOpenInstallmentModal) {
                          onOpenInstallmentModal(items);
                        }
                      }}
                      className={`col-span-2 p-3 rounded-2xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        paymentMethod === 'installment_0'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                          <Percent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Mua Trả Góp 0% Lãi Suất</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold">
                              CCCD / THẺ
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Góp từ 0đ · Duyệt online 5 phút · Nhận máy ngay
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 'success' && (
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
                  Đơn Hàng Đã Được Khởi Tạo!
                </h3>

                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Cảm ơn bạn! Đơn hàng <strong className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{createdOrderCode}</strong> đã được lưu vào hệ thống.
                </p>

                {paymentMethod === 'vietqr' && (
                  <div
                    className={`p-4 rounded-2xl border space-y-3 text-left ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/50 border-sky-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <QrCode className="w-4 h-4" />
                      <span>Mã Chuyển Khoản VietQR Tự Động</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-center shadow-xs">
                      <img
                        src={vietQrUrl}
                        alt="Mã thanh toán VietQR"
                        className="max-h-56 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className={`text-[11px] space-y-1 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <div>• Ngân hàng: <strong>{settings.bankName}</strong></div>
                      <div>• Số TK: <strong>{settings.bankAccount}</strong></div>
                      <div>• Chủ TK: <strong>{settings.bankAccountName}</strong></div>
                      <div>• Số tiền: <strong className="text-emerald-600">{formatVND(finalTotal)}</strong></div>
                      <div>• Nội dung CK: <strong className="text-sky-600">{createdOrderCode}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div
            className={`p-4 sm:p-5 border-t space-y-3 ${
              isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {step === 'cart' && items.length > 0 && (
              <>
                <div className="space-y-1 text-xs">
                  <div className={`flex justify-between font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>Tạm tính:</span>
                    <span className={`font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatVND(rawSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Voucher giảm giá:</span>
                      <span className="font-mono tabular-nums">-{formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div
                    className={`flex justify-between text-sm font-bold pt-1 border-t ${
                      isDark ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900'
                    }`}
                  >
                    <span>Tổng cộng:</span>
                    <span className={`font-mono tabular-nums ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>{formatVND(finalTotal)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenInstallmentModal) {
                        onOpenInstallmentModal(items);
                        onClose();
                      } else {
                        setStep('checkout');
                        setPaymentMethod('installment_0');
                      }
                    }}
                    className="px-3 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Trả Góp 0%
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-md shadow-sky-500/20"
                  >
                    <span>Tiến Hành Đặt Hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 'checkout' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
                  }`}
                >
                  Quay Lại
                </button>

                <button
                  type="button"
                  onClick={handleCheckoutSubmit}
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Xác Nhận Đặt Hàng · {formatVND(finalTotal)}
                </button>
              </div>
            )}

            {step === 'success' && (
              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer"
              >
                Tiếp Tục Mua Sắm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
