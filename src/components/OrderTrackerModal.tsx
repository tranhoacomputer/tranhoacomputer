import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';
import { Order } from '../types/shop';
import { formatVND } from '../db/storage';
import { useTheme } from '../context/ThemeContext';

interface OrderTrackerModalProps {
  orders: Order[];
  onClose: () => void;
  initialQuery?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  orders,
  onClose,
  initialQuery = '',
}) => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState(initialQuery);
  const [matchedOrders, setMatchedOrders] = useState<Order[]>(() => {
    if (!initialQuery) return [];
    return orders.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(initialQuery.toLowerCase()) ||
        o.customerPhone.includes(initialQuery)
    );
  });
  const [searched, setSearched] = useState(Boolean(initialQuery));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const results = orders.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(clean) ||
        o.customerPhone.toLowerCase().includes(clean)
    );
    setMatchedOrders(results);
    setSearched(true);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                : 'bg-amber-50 border-amber-300 text-amber-700'
            }`}
          >
            Chờ tiếp nhận
          </span>
        );
      case 'processing':
        return (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'bg-sky-950/80 border-sky-800 text-sky-400'
                : 'bg-sky-50 border-sky-300 text-sky-700'
            }`}
          >
            Đang kiểm tra kỹ thuật
          </span>
        );
      case 'repairing':
        return (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'bg-indigo-950/80 border-indigo-800 text-indigo-400'
                : 'bg-indigo-50 border-indigo-300 text-indigo-700'
            }`}
          >
            Đang tiến hành sửa chữa
          </span>
        );
      case 'completed':
        return (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700'
            }`}
          >
            Sẵn sàng bàn giao / Hoàn tất
          </span>
        );
      case 'cancelled':
        return (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                : 'bg-rose-50 border-rose-300 text-rose-700'
            }`}
          >
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-left">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 border transition-colors ${
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

        {/* Header */}
        <div className="space-y-1">
          <div
            className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-sky-400' : 'text-sky-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hệ Thống Tra Cứu Trực Tuyến 24/7</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Tra Cứu Tiến Độ Sửa Chữa & Đơn Hàng
          </h2>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Nhập Số Điện Thoại hoặc Mã Phiếu (ví dụ: <code className="text-sky-600 font-bold">FIX-4402</code>, <code className="text-sky-600 font-bold">NEX-8821</code>, <code className={isDark ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>0988776655</code>)
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập mã phiếu FIX-... hoặc số điện thoại..."
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono border focus:outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
              }`}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            Tra Cứu Ngay
          </button>
        </form>

        {/* Results Area */}
        <div className="mt-6 space-y-6">
          {searched && matchedOrders.length === 0 && (
            <div
              className={`p-8 text-center rounded-2xl space-y-2 border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Không tìm thấy phiếu sửa chữa hay đơn hàng phù hợp
              </div>
              <p className={`text-xs max-w-sm mx-auto font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Vui lòng kiểm tra lại số điện thoại hoặc mã phiếu. Bạn cũng có thể liên hệ hotline <strong>0908.888.999</strong> để được kỹ thuật viên hỗ trợ ngay.
              </p>
            </div>
          )}

          {matchedOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl p-5 sm:p-6 space-y-4 border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* Order Header Summary */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {order.orderCode}
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({order.type === 'repair_appointment' ? 'Phiếu sửa chữa máy' : 'Đơn mua hàng'})
                    </span>
                  </div>
                  <div className={`text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Khách hàng: <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{order.customerName}</strong> · ĐT: {order.customerPhone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Repair Device Info or Items */}
              {order.type === 'repair_appointment' && order.repairDetails && (
                <div
                  className={`p-3.5 rounded-xl space-y-1.5 text-xs border ${
                    isDark
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-sky-50/50 border-sky-100'
                  }`}
                >
                  <div className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Wrench className="w-4 h-4 text-sky-600" />
                    <span>Dịch vụ: {order.repairDetails.serviceName}</span>
                  </div>
                  <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    • Thiết bị: <span className="font-bold">{order.repairDetails.deviceType}</span>
                  </div>
                  <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    • Triệu chứng: {order.repairDetails.issueDescription}
                  </div>
                  <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    • Hẹn lúc: {order.repairDetails.appointmentTime} ngày {order.repairDetails.appointmentDate}
                  </div>
                </div>
              )}

              {order.type === 'product_order' && order.items && (
                <div
                  className={`p-3.5 rounded-xl space-y-2 text-xs border ${
                    isDark
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-sky-50/50 border-sky-100'
                  }`}
                >
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sản phẩm đặt mua:</div>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      <span>• {item.name} (x{item.quantity})</span>
                      <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technician Notes Callout */}
              {order.technicianNotes && (
                <div
                  className={`p-3 rounded-xl text-xs space-y-1 border ${
                    isDark
                      ? 'bg-sky-950/40 border-sky-900/50 text-slate-300'
                      : 'bg-sky-50 border-sky-200 text-slate-700'
                  }`}
                >
                  <div className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                    <span>Ghi Chú Kỹ Thuật Viên Phụ Trách:</span>
                  </div>
                  <p className="leading-relaxed font-medium">
                    {order.technicianNotes}
                  </p>
                </div>
              )}

              {/* Real-time Milestone Timeline */}
              <div className="pt-2">
                <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Tiến Trình Thực Tế (Milestones)
                </div>

                <div
                  className={`relative border-l-2 ml-3 space-y-5 py-1 ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  {order.trackingTimeline.map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <span
                        className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 ${
                          isDark ? 'border-slate-950' : 'border-white'
                        } ${step.completed ? 'bg-sky-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
                      />
                      <div className={`text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {step.time}
                      </div>
                      <div
                        className={`text-sm font-bold mt-0.5 ${
                          step.completed
                            ? isDark
                              ? 'text-white'
                              : 'text-slate-900'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.title}
                      </div>
                      <p className={`text-xs mt-0.5 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {step.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Payment Status */}
              <div
                className={`pt-3 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Hình thức thanh toán: </span>
                  <span className={`uppercase font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {order.paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR' : order.paymentMethod === 'cod' ? 'Thanh toán khi nhận (COD)' : 'Thanh toán tại quầy'}
                  </span>
                  <span className="ml-2 font-bold">
                    {order.paymentStatus === 'paid' ? (
                      <span className="text-emerald-600">(Đã thanh toán)</span>
                    ) : (
                      <span className="text-amber-600">(Chưa thanh toán)</span>
                    )}
                  </span>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Tổng: {formatVND(order.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

