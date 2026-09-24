import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  ShoppingBag,
  Clock,
  LogOut,
  Save,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserAccount, Order, StoreSettings } from '../types/shop';
import { formatVND, updateUserProfile, logoutUser } from '../db/storage';
import { useTheme } from '../context/ThemeContext';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  orders: Order[];
  settings: StoreSettings;
  onLogout: () => void;
  onSelectOrderTracking: (orderCode: string) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  settings,
  onLogout,
  onSelectOrderTracking,
}) => {
  const { isDark } = useTheme();

  // Profile editable fields
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [address, setAddress] = useState(currentUser.address || '');
  const [city, setCity] = useState(currentUser.city || settings.targetProvince || 'Hải Phòng');
  const [savedMsg, setSavedMsg] = useState('');

  if (!isOpen) return null;

  // Filter orders of this customer
  const userOrders = orders.filter(
    (o) =>
      o.customerId === currentUser.id ||
      o.customerPhone === currentUser.phone ||
      (o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      email,
      address,
      city,
    });
    setSavedMsg('Đã lưu thông tin mặc định thành công! Thông tin này sẽ tự động điền khi bạn đặt hàng.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const getRankBadgeColor = (rank: UserAccount['rank']) => {
    switch (rank) {
      case 'VIP Kim Cương':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'VIP Vàng':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'VIP Bạc':
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
      default:
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
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
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-sky-500/25">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getRankBadgeColor(
                    currentUser.rank
                  )}`}
                >
                  {currentUser.rank}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser.email} · {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                logoutUser();
                onLogout();
                onClose();
              }}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer title"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-5 sm:px-6 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
              Tổng chi tiêu
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatVND(currentUser.totalSpent || 0)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
              Đơn hàng & Lịch sửa
            </span>
            <span className="text-sm sm:text-base font-black text-sky-600 dark:text-sky-400 font-mono">
              {userOrders.length} đơn
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
              Địa bàn ưu tiên
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate block">
              {city || settings.targetProvince || 'Hải Phòng'}
            </span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="p-5 sm:px-6 space-y-4">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Thông tin giao hàng & liên hệ mặc định
              </h4>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>

            {savedMsg && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{savedMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Họ và tên:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Số điện thoại:
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Tỉnh / Thành phố:
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ví dụ: Hải Phòng"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Địa chỉ giao hàng mặc định (Số nhà, Tên đường, Phường/Xã):
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ví dụ: Số 152 Đường Lạch Tray, Quận Ngô Quyền, Hải Phòng"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>
            </div>
          </form>

          {/* Orders History */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Lịch sử đơn hàng của bạn ({userOrders.length})
            </h4>

            {userOrders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                Bạn chưa có đơn hàng nào. Hãy chọn mua sản phẩm hoặc đặt lịch sửa chữa để nhận ưu đãi VIP!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                          #{ord.orderCode}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                          {ord.type === 'repair_appointment' ? 'Phiếu sửa máy' : ord.paymentMethod === 'installment_0' ? 'Đơn trả góp 0%' : 'Đơn mua hàng'}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Ngày đặt: {new Date(ord.createdAt).toLocaleDateString('vi-VN')} · Tổng tiền:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {formatVND(ord.totalAmount)}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectOrderTracking(ord.orderCode);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>Tra cứu tiến trình</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
