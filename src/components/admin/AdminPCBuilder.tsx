import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Layers,
  X
} from 'lucide-react';
import { PCBuildPackage } from '../../types/shop';
import { upsertPCBuildPackage, deletePCBuildPackage, formatVND } from '../../db/storage';
import { initialSeedDatabase } from '../../db/seedData';

interface AdminPCBuilderProps {
  packages?: PCBuildPackage[];
}

export const AdminPCBuilder: React.FC<AdminPCBuilderProps> = ({ packages = [] }) => {
  const [packageList, setPackageList] = useState<PCBuildPackage[]>(
    packages.length > 0 ? packages : initialSeedDatabase.pcBuildPackages
  );

  React.useEffect(() => {
    if (packages && packages.length > 0) {
      setPackageList(packages);
    }
  }, [packages]);

  const [editingPackage, setEditingPackage] = useState<PCBuildPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenAdd = () => {
    const newPkg: PCBuildPackage = {
      id: `build-${Date.now()}`,
      name: 'Dàn PC Gaming Chiến Game Mới',
      price: 15000000,
      originalPrice: 17500000,
      target: 'Phù hợp chơi mượt mà mọi game Esport và đồ họa Adobe Premiere Pro.',
      specs: {
        cpu: 'Intel Core i5-12400F',
        mainboard: 'ASUS PRIME B760M-K',
        ram: '16GB DDR4 3200MHz',
        gpu: 'NVIDIA GeForce RTX 3060 12GB',
        storage: '512GB SSD NVMe M.2',
        psu: '600W 80 Plus Bronze',
        case: 'Case Gaming LED RGB',
        cooling: 'Tản nhiệt khí tháp LED RGB',
      },
    };
    setEditingPackage(newPkg);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: PCBuildPackage) => {
    setEditingPackage({
      ...pkg,
      specs: { ...pkg.specs },
    });
    setIsModalOpen(true);
  };

  const handleDelete = (pkgId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói cấu hình PC này?')) {
      deletePCBuildPackage(pkgId);
      showToast('Đã xóa gói cấu hình PC thành công!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    upsertPCBuildPackage(editingPackage);
    setIsModalOpen(false);
    setEditingPackage(null);
    showToast('Đã lưu cấu hình PC thành công!');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <span>Quản Lý Cấu Hình PC Builder ({packageList.length} Dàn Mẫu)</span>
            </h2>
            <span className="text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded">
              Đồng Bộ Modal Build PC Khách
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Thiết lập các bộ PC lắp sẵn theo tầm giá từ Esport đến Flagship 4K. Khách hàng có thể chọn mua ngay 1 chạm.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Dàn PC Mới</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Package List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {packageList.map((pkg) => (
          <div
            key={pkg.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white font-mono leading-tight">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    🎯 {pkg.target}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-black text-sky-400 font-mono">
                    {formatVND(pkg.price)}
                  </div>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <div className="text-xs text-slate-500 line-through font-mono">
                      {formatVND(pkg.originalPrice)}
                    </div>
                  )}
                </div>
              </div>

              {/* Specs List */}
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1">
                  <span className="text-slate-400 font-medium">Vi xử lý (CPU):</span>
                  <span className="text-slate-200 font-semibold text-right">{pkg.specs.cpu}</span>
                </div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1">
                  <span className="text-slate-400 font-medium">Bo mạch chủ (Main):</span>
                  <span className="text-slate-200 font-semibold text-right">{pkg.specs.mainboard}</span>
                </div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1">
                  <span className="text-slate-400 font-medium">Bộ nhớ (RAM):</span>
                  <span className="text-slate-200 font-semibold text-right">{pkg.specs.ram}</span>
                </div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1">
                  <span className="text-slate-400 font-medium">Card đồ họa (VGA):</span>
                  <span className="text-sky-300 font-semibold text-right">{pkg.specs.gpu}</span>
                </div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1">
                  <span className="text-slate-400 font-medium">Ổ cứng (SSD):</span>
                  <span className="text-slate-200 font-semibold text-right">{pkg.specs.storage}</span>
                </div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1">
                  <span className="text-slate-400 font-medium">Nguồn (PSU):</span>
                  <span className="text-slate-200 font-semibold text-right">{pkg.specs.psu}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 font-medium">Vỏ Case & Tản:</span>
                  <span className="text-slate-200 font-semibold text-right truncate">
                    {pkg.specs.case} · {pkg.specs.cooling}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(pkg)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Sửa Dàn PC</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pkg.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/80 border border-red-900/60 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>{editingPackage.id.includes('Date') ? 'Thêm Bộ PC Mới' : 'Sửa Cấu Hình Bộ PC'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tên dàn máy PC:
                </label>
                <input
                  type="text"
                  required
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                  placeholder="VD: PC Gaming ESPORT HERO - i3 12100F / RX 6600 8GB"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Giá bán thực tế (VND):
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Giá gốc niêm yết (VND):
                  </label>
                  <input
                    type="number"
                    value={editingPackage.originalPrice || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Đối tượng sử dụng & game mục tiêu (Target):
                </label>
                <input
                  type="text"
                  required
                  value={editingPackage.target}
                  onChange={(e) => setEditingPackage({ ...editingPackage, target: e.target.value })}
                  placeholder="VD: Chiến mượt mà CS2, Valorant, LMHT, FIFA Online 4 trên 180 FPS."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Specs Breakdown */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="text-xs font-bold text-sky-400 font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>LINH KIỆN CHI TIẾT TRONG BỘ MÁY</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CPU (Vi xử lý):</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.cpu}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, cpu: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Mainboard (Bo mạch):</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.mainboard}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, mainboard: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">RAM (Bộ nhớ):</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.ram}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, ram: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">GPU (Card đồ họa):</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.gpu}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, gpu: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ổ cứng SSD:</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.storage}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, storage: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nguồn (PSU):</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.psu}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, psu: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Vỏ Case:</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.case}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, case: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tản nhiệt (Cooling):</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.specs.cooling}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          specs: { ...editingPackage.specs, cooling: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-md"
                >
                  Lưu Gói PC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
