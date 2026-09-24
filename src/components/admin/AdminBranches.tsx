import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Phone,
  Clock,
  Search,
  Building2,
  X
} from 'lucide-react';
import { StoreBranch } from '../../types/shop';
import { upsertBranch, deleteBranch } from '../../db/storage';
import { initialSeedDatabase } from '../../db/seedData';

interface AdminBranchesProps {
  branches?: StoreBranch[];
}

export const AdminBranches: React.FC<AdminBranchesProps> = ({ branches = [] }) => {
  const [branchList, setBranchList] = useState<StoreBranch[]>(
    branches.length > 0 ? branches : initialSeedDatabase.branches
  );

  React.useEffect(() => {
    if (branches && branches.length > 0) {
      setBranchList(branches);
    }
  }, [branches]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');
  const [editingBranch, setEditingBranch] = useState<StoreBranch | null>(null);
  const [featuresInput, setFeaturesInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredBranches = branchList.filter((b) => {
    if (selectedCityFilter !== 'all' && b.city !== selectedCityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    const newBranch: StoreBranch = {
      id: `st-${Date.now()}`,
      name: 'Siêu Thị & Phòng Lab Kỹ Thuật Mới',
      city: 'hcm',
      cityName: 'TP. Hồ Chí Minh',
      address: '',
      hotline: '1800.8198',
      hours: '08:00 - 21:30 (Mở cửa cả ngày lễ)',
      features: ['Phòng lab sửa chữa lấy ngay 30P', 'Trả góp 0% duyệt 5 phút'],
      isMain: false,
    };
    setEditingBranch(newBranch);
    setFeaturesInput(newBranch.features.join(', '));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: StoreBranch) => {
    setEditingBranch({ ...branch });
    setFeaturesInput(branch.features ? branch.features.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleDelete = (branchId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chi nhánh siêu thị này?')) {
      deleteBranch(branchId);
      showToast('Đã xóa chi nhánh thành công!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    const parsedFeatures = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const toSave: StoreBranch = {
      ...editingBranch,
      features: parsedFeatures,
    };

    upsertBranch(toSave);
    setIsModalOpen(false);
    setEditingBranch(null);
    showToast('Đã lưu chi nhánh thành công!');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              <span>Quản Lý Địa Chỉ Cửa Hàng & Phòng Lab Kỹ Thuật</span>
            </h2>
            <span className="text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded">
              Cơ sở Phú Thịnh - Thái Nguyên
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý địa chỉ cửa hàng duy nhất tại Phú Thịnh - Thái Nguyên, hotline 0963284044 và email hotrokhachhang@tranhoacomputer.site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chi Nhánh Mới</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên chi nhánh, tuyến đường, quận huyện..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'hcm', label: 'TP.HCM' },
            { id: 'hn', label: 'Hà Nội' },
            { id: 'danang', label: 'Đà Nẵng' },
            { id: 'cantho', label: 'Cần Thơ' },
            { id: 'other', label: 'Tỉnh Khác' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCityFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCityFilter === tab.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {branch.name}
                  </h3>
                  {branch.isMain && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500 text-white font-mono uppercase">
                      Trọng Điểm Flagship
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                  {branch.cityName}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono font-bold text-emerald-400">{branch.hotline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{branch.hours}</span>
                </div>
              </div>

              {/* Feature badges */}
              {branch.features && branch.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {branch.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-md font-medium"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(branch)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Sửa</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(branch.id)}
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
      {isModalOpen && editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>{editingBranch.id.includes('Date') ? 'Thêm Chi Nhánh Mới' : 'Sửa Thông Tin Chi Nhánh'}</span>
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
                  Tên chi nhánh showroom / phòng lab:
                </label>
                <input
                  type="text"
                  required
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  placeholder="VD: Showroom Flagship & Lab Trung Tâm Quận 10"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Khu vực / Tỉnh thành:
                  </label>
                  <select
                    value={editingBranch.city}
                    onChange={(e) => {
                      const c = e.target.value as StoreBranch['city'];
                      let cName = 'TP. Hồ Chí Minh';
                      if (c === 'hn') cName = 'Hà Nội';
                      else if (c === 'danang') cName = 'Đà Nẵng';
                      else if (c === 'cantho') cName = 'Cần Thơ';
                      else if (c === 'other') cName = 'Hải Phòng';
                      setEditingBranch({ ...editingBranch, city: c, cityName: cName });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                  >
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                    <option value="danang">Đà Nẵng</option>
                    <option value="cantho">Cần Thơ</option>
                    <option value="other">Tỉnh khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tên hiển thị tỉnh thành:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBranch.cityName}
                    onChange={(e) => setEditingBranch({ ...editingBranch, cityName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Địa chỉ số nhà, tên đường, phường quận:
                </label>
                <input
                  type="text"
                  required
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  placeholder="VD: 182 Đường 3/2, Phường 12, Quận 10, TP. Hồ Chí Minh"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Hotline chi nhánh:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBranch.hotline}
                    onChange={(e) => setEditingBranch({ ...editingBranch, hotline: e.target.value })}
                    placeholder="1800.8198 (Nhánh 1)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Giờ mở cửa phục vụ:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBranch.hours}
                    onChange={(e) => setEditingBranch({ ...editingBranch, hours: e.target.value })}
                    placeholder="08:00 - 21:30"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tiện ích nổi bật (Phân cách bằng dấu phẩy):
                </label>
                <textarea
                  rows={2}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Phòng lab sửa chữa lấy ngay 30P, Khu trải nghiệm PC Gaming 4K, Có chỗ đỗ ô tô miễn phí"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingBranch.isMain || false}
                  onChange={(e) => setEditingBranch({ ...editingBranch, isMain: e.target.checked })}
                  className="w-4 h-4 text-sky-500 rounded bg-slate-950 border-slate-700 focus:ring-sky-500"
                />
                <span className="text-slate-300 font-semibold">Đánh dấu là Trung Tâm Trọng Điểm Flagship</span>
              </label>

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
                  Lưu Chi Nhánh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
