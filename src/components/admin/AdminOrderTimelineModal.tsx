import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  User,
  Phone,
  MapPin,
  DollarSign,
  Package,
  Wrench,
  Printer
} from 'lucide-react';
import { Order, TrackingStep } from '../../types/shop';
import {
  formatVND,
  updateOrderStatus,
  updateOrderPaymentStatus,
  addOrderTrackingStep
} from '../../db/storage';

interface AdminOrderTimelineModalProps {
  order: Order;
  onClose: () => void;
  onPrintReceipt: (order: Order) => void;
}

export const AdminOrderTimelineModal: React.FC<AdminOrderTimelineModalProps> = ({
  order,
  onClose,
  onPrintReceipt,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);

  // New step form
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepNote, setNewStepNote] = useState('');
  const [newStepCompleted, setNewStepCompleted] = useState(true);

  // Quick status change
  const handleStatusChange = (newStatus: Order['status']) => {
    updateOrderStatus(currentOrder.id, newStatus);
    setCurrentOrder((prev) => ({
      ...prev,
      status: newStatus,
      paymentStatus: newStatus === 'completed' ? 'paid' : prev.paymentStatus,
    }));
  };

  const handlePaymentChange = (newPayStatus: 'unpaid' | 'paid' | 'refunded') => {
    updateOrderPaymentStatus(currentOrder.id, newPayStatus);
    setCurrentOrder((prev) => ({
      ...prev,
      paymentStatus: newPayStatus,
    }));
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;

    const now = new Date();
    const timeFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    const step: TrackingStep = {
      title: newStepTitle.trim(),
      note: newStepNote.trim(),
      time: timeFormatted,
      completed: newStepCompleted,
    };

    addOrderTrackingStep(currentOrder.id, step);

    setCurrentOrder((prev) => ({
      ...prev,
      trackingTimeline: [...(prev.trackingTimeline || []), step],
    }));

    setNewStepTitle('');
    setNewStepNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white font-mono">
                {currentOrder.orderCode}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  currentOrder.type === 'repair_appointment'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-sky-950 text-sky-400 border border-sky-800'
                }`}
              >
                {currentOrder.type === 'repair_appointment' ? 'LỊCH HẸN SỬA CHỮA' : 'ĐƠN HÀNG MUA MÁY'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Khởi tạo lúc: {new Date(currentOrder.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrintReceipt(currentOrder)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Phiếu</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customer & Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentOrder.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-emerald-400 font-bold">{currentOrder.customerPhone}</span>
            </div>
            {currentOrder.customerAddress && (
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span className="truncate">{currentOrder.customerAddress}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-300 pt-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Tổng tiền: </span>
              <span className="font-bold text-sky-400 font-mono text-sm">{formatVND(currentOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                Trạng thái tiến trình:
              </label>
              <select
                value={currentOrder.status}
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:border-sky-500 focus:outline-hidden"
              >
                <option value="pending">Chờ tiếp nhận (Pending)</option>
                <option value="processing">Đang kiểm tra / Chuẩn bị (Processing)</option>
                <option value="repairing">Đang sửa chữa bo mạch (Repairing)</option>
                <option value="completed">Đã hoàn tất & Giao khách (Completed)</option>
                <option value="cancelled">Đã hủy bỏ (Cancelled)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                Trạng thái thanh toán:
              </label>
              <select
                value={currentOrder.paymentStatus}
                onChange={(e) => handlePaymentChange(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:border-sky-500 focus:outline-hidden"
              >
                <option value="unpaid">Chưa thanh toán (Unpaid)</option>
                <option value="paid">Đã thanh toán đủ (Paid)</option>
                <option value="refunded">Đã hoàn tiền (Refunded)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Repair details if any */}
        {currentOrder.repairDetails && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs space-y-1">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Thiết bị: {currentOrder.repairDetails.deviceType}</span>
            </div>
            <div className="text-slate-300">
              Dịch vụ: <span className="font-semibold text-white">{currentOrder.repairDetails.serviceName}</span>
            </div>
            <div className="text-slate-400">
              Mô tả lỗi: <span className="text-slate-200">{currentOrder.repairDetails.issueDescription}</span>
            </div>
            <div className="text-slate-400">
              Lịch hẹn: <span className="text-white font-mono">{currentOrder.repairDetails.appointmentTime} ngày {currentOrder.repairDetails.appointmentDate}</span>
            </div>
          </div>
        )}

        {/* Live Tracking Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Tiến Trình Thời Gian Thực (Live Customer Tracking)</span>
            </h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Khách tra cứu mã {currentOrder.orderCode} sẽ thấy ngay
            </span>
          </div>

          {/* Timeline steps */}
          <div className="space-y-3 pl-2 border-l-2 border-slate-800 ml-2">
            {(currentOrder.trackingTimeline || []).map((step, idx) => (
              <div key={idx} className="relative pl-6">
                <div
                  className={`absolute -left-[17px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  ✓
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{step.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono font-normal">({step.time})</span>
                </div>
                {step.note && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.note}</p>
                )}
              </div>
            ))}
          </div>

          {/* Form to add new milestone step */}
          <form onSubmit={handleAddStep} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Mốc Tiến Trình Mới</span>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Tiêu đề mốc kiểm tra / sửa chữa:</label>
              <input
                type="text"
                required
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="VD: Kỹ thuật viên đã bung máy kiểm tra bo mạch & sấy khô"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Ghi chú chi tiết cho khách hàng xem:</label>
              <input
                type="text"
                value={newStepNote}
                onChange={(e) => setNewStepNote(e.target.value)}
                placeholder="VD: Đã thay keo tản nhiệt Arctic MX-4, nhiệt độ CPU giảm từ 95°C xuống 68°C"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newStepCompleted}
                  onChange={(e) => setNewStepCompleted(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300 text-[11px] font-medium">Đánh dấu bước này đã hoàn thành</span>
              </label>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Cập Nhật Cho Khách</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
