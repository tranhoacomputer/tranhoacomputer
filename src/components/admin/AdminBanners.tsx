import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { HeroBanner } from '../../types/shop';
import { upsertBanner, deleteBanner } from '../../db/storage';
import { initialSeedDatabase } from '../../db/seedData';

interface AdminBannersProps {
  banners?: HeroBanner[];
}

export const AdminBanners: React.FC<AdminBannersProps> = ({ banners = [] }) => {
  const [bannerList, setBannerList] = useState<HeroBanner[]>(
    banners.length > 0 ? banners : initialSeedDatabase.banners
  );

  // Sync state if prop changes
  React.useEffect(() => {
    if (banners && banners.length > 0) {
      setBannerList(banners);
    }
  }, [banners]);

  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenAdd = () => {
    const newBanner: HeroBanner = {
      id: `banner-${Date.now()}`,
      badge: 'KHUYẾN MÃI MỚI',
      title: 'TIÊU ĐỀ BANNER QUẢNG CÁO MỚI',
      subtitle: 'Mô tả chi tiết chương trình ưu đãi, quà tặng và chế độ bảo hành đặc quyền.',
      ctaText: 'Khám Phá Ngay',
      ctaAction: 'flash_sale',
      actionLink: 'flash_sale',
      isActive: true,
      active: true,
      order: bannerList.length + 1,
    };
    setEditingBanner(newBanner);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBanner({ ...banner });
    setIsModalOpen(true);
  };

  const handleToggleActive = (banner: HeroBanner) => {
    const isNowActive = !(banner.isActive ?? banner.active ?? true);
    const updated = { ...banner, isActive: isNowActive, active: isNowActive };
    upsertBanner(updated);
    showToast(`Đã ${isNowActive ? 'bật hiển thị' : 'tạm ẩn'} banner thành công!`);
  };

  const handleDelete = (bannerId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này khỏi trang chủ?')) {
      deleteBanner(bannerId);
      showToast('Đã xóa banner thành công!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    const finalBanner: HeroBanner = {
      ...editingBanner,
      isActive: editingBanner.isActive ?? editingBanner.active ?? true,
      active: editingBanner.isActive ?? editingBanner.active ?? true,
    };
    upsertBanner(finalBanner);
    setIsModalOpen(false);
    setEditingBanner(null);
    showToast('Đã lưu banner thành công!');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-sky-400" />
              <span>Quản Lý Slider & Banner Trang Chủ</span>
            </h2>
            <span className="text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded">
              {bannerList.filter((b) => (b.isActive ?? b.active ?? true)).length} đang hiển thị
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toàn quyền thêm, sửa, đổi liên kết và bật/tắt các slide banner chiến dịch quảng cáo trên trang chủ.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Banner Mới</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bannerList.map((banner, index) => (
          <div
            key={banner.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              (banner.isActive ?? banner.active ?? true)
                ? 'bg-slate-900 border-slate-800 shadow-md'
                : 'bg-slate-900/40 border-slate-800/50 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-mono">
                  Slide {index + 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer font-medium transition-colors ${
                      (banner.isActive ?? banner.active ?? true)
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {(banner.isActive ?? banner.active ?? true) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{(banner.isActive ?? banner.active ?? true) ? 'Đang hiện' : 'Đang ẩn'}</span>
                  </button>
                </div>
              </div>

              {/* Banner Card Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40 border border-slate-800 space-y-2">
                <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono">
                  {banner.badge}
                </div>
                <h4 className="text-base font-black text-white leading-tight font-mono">
                  {banner.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {banner.subtitle}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-sky-400 font-bold inline-flex items-center gap-1">
                    {banner.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Hành động: {banner.actionLink || 'flash_sale'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(banner)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Sửa Banner</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(banner.id)}
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
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                <span>{editingBanner.id.includes('Date') ? 'Thêm Banner Mới' : 'Chỉnh Sửa Banner'}</span>
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
                  Huy hiệu nổi bật (Badge trên đầu):
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.badge}
                  onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                  placeholder="VD: SIÊU SALE ĐẠI TIỆC"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tiêu đề chính lớn (Headline):
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="VD: TUẦN LỄ LAPTOP GAMING AI & RTX 40-SERIES"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mô tả ưu đãi & quà tặng (Subtitle):
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="VD: Trợ giá đến 10.000.000đ khi thu cũ đổi mới, tặng balo Predator chính hãng..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Chữ trên nút bấm (CTA):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.ctaText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    placeholder="VD: Săn Deal Ngay"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Hành động khi khách click:
                  </label>
                  <select
                    value={editingBanner.actionLink || 'flash_sale'}
                    onChange={(e) => {
                      const link = e.target.value;
                      let act: HeroBanner['ctaAction'] = 'flash_sale';
                      if (link === 'flash_sale') act = 'flash_sale';
                      else if (link === 'laptop' || link === 'pc_gaming' || link === 'component') act = 'category';
                      else if (link === 'repair') act = 'booking';
                      else if (link === 'pc_builder') act = 'pc_builder';
                      else if (link === 'trade_in') act = 'trade_in';

                      setEditingBanner({
                        ...editingBanner,
                        actionLink: link,
                        ctaAction: act,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                  >
                    <option value="flash_sale">Cuộn đến Giờ Vàng Flash Sale</option>
                    <option value="laptop">Lọc danh mục Laptop</option>
                    <option value="pc_gaming">Lọc danh mục PC Gaming</option>
                    <option value="component">Lọc danh mục Linh Kiện</option>
                    <option value="repair">Mở Đặt Lịch Sửa Chữa Lab</option>
                    <option value="pc_builder">Mở Công Cụ Tự Build PC</option>
                    <option value="trade_in">Mở Thu Cũ Đổi Mới</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingBanner.isActive ?? editingBanner.active ?? true}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      isActive: e.target.checked,
                      active: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-sky-500 rounded bg-slate-950 border-slate-700 focus:ring-sky-500"
                />
                <span className="text-slate-300 font-semibold">Hiển thị banner này trên trang chủ</span>
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
                  Lưu Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
