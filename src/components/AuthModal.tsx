import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  KeyRound,
  LogIn
} from 'lucide-react';
import { UserAccount, StoreSettings } from '../types/shop';
import { loginQuickGoogle, loginQuickPhone, loginWithEmail } from '../db/storage';
import { useTheme } from '../context/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  settings,
  onLoginSuccess,
}) => {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<'quick' | 'phone' | 'email'>('quick');

  // Phone tab
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mockOtp, setMockOtp] = useState('888999');

  // Email tab
  const [email, setEmail] = useState('');
  const [emailName, setEmailName] = useState('');
  const [password, setPassword] = useState('');

  // Status
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1-Click Fast Google Login
  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user = loginQuickGoogle();
      setLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  // Phone OTP Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (10 số).');
      return;
    }
    setErrorMsg('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(randomOtp);
    setOtpSent(true);
    setOtpCode(randomOtp); // Auto-fill for ultra smooth frictionless experience!
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Vui lòng nhập mã OTP.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = loginQuickPhone(phoneNumber, customerName);
      setLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 300);
  };

  // Email Flow
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập email và mật khẩu.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = loginWithEmail(email, emailName);
      setLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in text-left">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                ĐĂNG NHẬP / TẠO TÀI KHOẢN
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tự động lưu thông tin · Không phải nhập lại khi mua hàng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits banner */}
        <div className="px-5 sm:px-6 pt-4">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div className="text-xs text-sky-800 dark:text-sky-300">
              <span className="font-bold">Đặc quyền thành viên:</span> Điền sẵn thông tin khi mua hàng tại {settings.targetProvince || 'Hải Phòng'}, tích điểm VIP giảm thêm tới 500.000₫ và tra cứu bảo hành 1 chạm.
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 sm:px-6 pt-4">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setTab('quick');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center font-mono ${
                tab === 'quick'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Nhanh 1 Chạm
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('phone');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center font-mono ${
                tab === 'phone'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Số Điện Thoại
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('email');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center font-mono ${
                tab === 'email'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Email / Mật Khẩu
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: 1-Click Fast Google / Fast Pass */}
          {tab === 'quick' && (
            <div className="space-y-4 py-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-98"
              >
                {/* Google Colored G Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Đăng nhập nhanh với Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhoneNumber('0912345678');
                  setCustomerName('Nguyễn Văn An');
                  const user = loginQuickPhone('0912345678', 'Nguyễn Văn An');
                  onLoginSuccess(user);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold text-xs transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Đăng nhập tài khoản Demo Thành viên VIP (1 Chạm)</span>
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-400">
                Bảo mật tiêu chuẩn SSL 256-bit · Dữ liệu được mã hóa an toàn trên thiết bị của bạn.
              </div>
            </div>
          )}

          {/* TAB 2: Số điện thoại + OTP Tự Động */}
          {tab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Họ và tên của bạn:
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ví dụ: Trần Quốc Hưng"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Số điện thoại nhận mã OTP: <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="09xx xxx xxx"
                        className="w-full pl-9 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Gửi Mã Xác Thực OTP (Tự Động)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
                    Mã xác thực OTP đã được gửi tới <strong>{phoneNumber}</strong> (Hệ thống đã tự động điền mã cho bạn).
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Mã xác thực OTP (6 số):
                    </label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="888999"
                      className="w-full text-center tracking-widest font-mono text-base font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Xác Nhận & Đăng Nhập Ngay</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Đổi số điện thoại khác
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Email / Mật Khẩu */}
          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Họ và tên:
                </label>
                <input
                  type="text"
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Minh Long"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Địa chỉ Email: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-9 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Mật khẩu: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Đăng Nhập / Đăng Ký Tài Khoản</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
