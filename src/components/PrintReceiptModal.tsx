import React from 'react';
import { X, Printer } from 'lucide-react';
import { Order, StoreSettings } from '../types/shop';
import { formatVND } from '../db/storage';

interface PrintReceiptModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  order,
  settings,
  onClose,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 font-sans">
        {/* Actions bar (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Xem Trước Phiếu Tiếp Nhận / Hóa Đơn
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu (Print)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="pt-4 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                {settings.storeName}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">{settings.address}</p>
              <p className="text-xs text-slate-600">
                Hotline Kỹ Thuật: <strong>{settings.hotline}</strong> · Email: {settings.email}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-indigo-600 font-mono">
                {order.orderCode}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </div>
              <div className="text-[11px] font-semibold uppercase mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 inline-block">
                {order.type === 'repair_appointment' ? 'PHIẾU DỊCH VỤ SỬA MÁY' : 'HÓA ĐƠN BÁN LẺ'}
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500">Khách hàng:</span>{' '}
              <strong className="text-slate-900">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Số điện thoại:</span>{' '}
              <strong className="text-slate-900 font-mono">{order.customerPhone}</strong>
            </div>
            {order.customerAddress && (
              <div className="col-span-2">
                <span className="text-slate-500">Địa chỉ giao / sửa:</span>{' '}
                <span className="text-slate-800">{order.customerAddress}</span>
              </div>
            )}
          </div>

          {/* Repair Details */}
          {order.type === 'repair_appointment' && order.repairDetails && (
            <div className="space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-slate-700">
                Chi Tiết Tiếp Nhận Thiết Bị
              </div>
              <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-white">
                <div>
                  <span className="text-slate-500">Dịch vụ:</span>{' '}
                  <strong className="text-indigo-600">{order.repairDetails.serviceName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Model thiết bị:</span>{' '}
                  <strong className="text-slate-900">{order.repairDetails.deviceType}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Tình trạng / Triệu chứng:</span>{' '}
                  <span className="text-slate-800">{order.repairDetails.issueDescription}</span>
                </div>
                {order.technicianNotes && (
                  <div className="pt-1 text-slate-700 border-t border-slate-100">
                    <span className="text-slate-500">Kỹ thuật viên ghi chú:</span>{' '}
                    <span>{order.technicianNotes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Items Table */}
          {order.type === 'product_order' && order.items && (
            <div className="space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-slate-700">
                Danh Sách Linh Kiện / Thiết Bị
              </div>
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-left">
                    <th className="p-2 border border-slate-200">Sản phẩm</th>
                    <th className="p-2 border border-slate-200 text-center">SL</th>
                    <th className="p-2 border border-slate-200 text-right">Đơn giá</th>
                    <th className="p-2 border border-slate-200 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((i, idx) => (
                    <tr key={idx} className="border border-slate-200">
                      <td className="p-2 border border-slate-200">
                        <div className="font-semibold text-slate-900">{i.name}</div>
                        {i.specsSnippet && <div className="text-[11px] text-slate-500">{i.specsSnippet}</div>}
                      </td>
                      <td className="p-2 border border-slate-200 text-center font-mono">{i.quantity}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono">{formatVND(i.price)}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono font-bold">
                        {formatVND(i.price * i.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center text-sm pt-3 border-t-2 border-slate-800">
            <div>
              <span className="text-xs text-slate-500">Hình thức thanh toán: </span>
              <strong className="text-slate-800 uppercase font-mono">
                {order.paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR' : order.paymentMethod === 'cod' ? 'Thu hộ COD' : 'Tiền mặt'}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 mr-2">Tổng thanh toán:</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {formatVND(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Warranty Terms */}
          <div className="p-3 bg-slate-50 rounded-lg text-[10px] text-slate-500 space-y-1 leading-relaxed border border-slate-200">
            <div className="font-bold text-slate-700">Điều khoản & Cam kết bảo hành:</div>
            <div>• Quý khách vui lòng giữ phiếu này để nhận máy hoặc đối chiếu bảo hành linh kiện chính hãng.</div>
            <div>• Thiết bị không bảo hành đối với các trường hợp bị rơi vỡ, vô nước, côn trùng xâm nhập hoặc tem bảo hành bị rách.</div>
            <div>• Sau 30 ngày kể từ ngày thông báo máy đã sửa xong, nếu quý khách không đến nhận hoặc liên hệ, trung tâm sẽ xử lý theo quy định thanh lý linh kiện.</div>
          </div>

          {/* Signature lines */}
          <div className="grid grid-cols-2 pt-6 text-center text-xs">
            <div>
              <div className="font-semibold text-slate-700">Khách Hàng Ký Tên</div>
              <div className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</div>
              <div className="h-16" />
              <div className="text-slate-800 font-medium">{order.customerName}</div>
            </div>

            <div>
              <div className="font-semibold text-slate-700">Đại Diện Nexus Tech Lab</div>
              <div className="text-[10px] text-slate-400 italic">(Kỹ thuật viên tiếp nhận)</div>
              <div className="h-16" />
              <div className="text-slate-800 font-medium">Kỹ Sư Trưởng Lab</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
