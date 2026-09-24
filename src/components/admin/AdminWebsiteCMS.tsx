import React, { useState } from 'react';
import {
  Globe,
  Flame,
  Sparkles,
  Wrench,
  MapPin,
  ShieldCheck,
  Clock,
  CreditCard,
  Award,
  Save,
  CheckCircle2,
  Bell,
  FileText,
  Layers,
  Building2,
  Tag,
  Plus,
  Trash2,
  Share2,
  HelpCircle,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';
import { WebsiteContent, TrustPledge, DiscountVoucher, SectionVisibilityCMS } from '../../types/shop';
import { updateWebsiteContent } from '../../db/storage';
import { initialSeedDatabase } from '../../db/seedData';

interface AdminWebsiteCMSProps {
  content?: WebsiteContent;
}

export const AdminWebsiteCMS: React.FC<AdminWebsiteCMSProps> = ({ content }) => {
  const [activeSubTab, setActiveSubTab] = useState<'layout' | 'branding' | 'copywriting' | 'vouchers' | 'pledges'>('layout');

  const [form, setForm] = useState<WebsiteContent>({
    ...(content || initialSeedDatabase.websiteContent),
    sectionVisibility: {
      showMarquee: true,
      showHeroSlider: true,
      showShowroomsStrip: true,
      showFlashSale: true,
      showCatalog: true,
      showPCBuilder: true,
      showServices: true,
      showTechArticles: true,
      showShowroomsMap: true,
      showTrustPledges: true,
      ...(content?.sectionVisibility || initialSeedDatabase.websiteContent.sectionVisibility),
    },
    vouchers: content?.vouchers || initialSeedDatabase.websiteContent.vouchers || [],
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newVoucherModal, setNewVoucherModal] = useState(false);
  const [newVoucher, setNewVoucher] = useState<Partial<DiscountVoucher>>({
    code: '',
    discountType: 'fixed',
    discountValue: 200000,
    minOrderValue: 2000000,
    usageLimit: 100,
    usedCount: 0,
    expiresAt: '2026-12-31',
    active: true,
  });

  const handlePledgeChange = (index: number, field: keyof TrustPledge, value: string) => {
    const updated = [...(form.trustPledges || initialSeedDatabase.websiteContent.trustPledges)];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setForm({ ...form, trustPledges: updated });
  };

  const handleToggleSection = (sectionKey: keyof SectionVisibilityCMS) => {
    const current = form.sectionVisibility || {};
    const updated = {
      ...current,
      [sectionKey]: current[sectionKey] === false ? true : false,
    };
    setForm({ ...form, sectionVisibility: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục toàn bộ nội dung hiển thị về mặc định của hệ thống?')) {
      setForm({ ...initialSeedDatabase.websiteContent });
      updateWebsiteContent(initialSeedDatabase.websiteContent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucher.code) return;
    const item: DiscountVoucher = {
      id: `vouch-${Date.now()}`,
      code: newVoucher.code.trim().toUpperCase(),
      discountType: newVoucher.discountType || 'fixed',
      discountValue: Number(newVoucher.discountValue) || 100000,
      minOrderValue: Number(newVoucher.minOrderValue) || 1000000,
      usageLimit: Number(newVoucher.usageLimit) || 100,
      usedCount: 0,
      expiresAt: newVoucher.expiresAt || '2026-12-31',
      active: true,
    };
    const updated = [...(form.vouchers || []), item];
    setForm({ ...form, vouchers: updated });
    setNewVoucherModal(false);
    setNewVoucher({
      code: '',
      discountType: 'fixed',
      discountValue: 200000,
      minOrderValue: 2000000,
      usageLimit: 100,
      usedCount: 0,
      expiresAt: '2026-12-31',
      active: true,
    });
  };

  const handleDeleteVoucher = (id: string) => {
    const updated = (form.vouchers || []).filter((v) => v.id !== id);
    setForm({ ...form, vouchers: updated });
  };

  const handleToggleVoucherActive = (id: string) => {
    const updated = (form.vouchers || []).map((v) =>
      v.id === id ? { ...v, active: !v.active } : v
    );
    setForm({ ...form, vouchers: updated });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <span>Quản Trị CMS & Tùy Chỉnh Giao Diện Chuyên Sâu</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
              PRO CMS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toàn quyền kiểm soát bố cục trang chủ, thông điệp truyền thông, thương hiệu và chương trình khuyến mãi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc Định</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi CMS</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Đã lưu thành công toàn bộ cấu hình CMS lên trang web chính thức!</span>
        </div>
      )}

      {/* Modern Subtabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('layout')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'layout'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Bố Cục Khối Trang Chủ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('branding')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'branding'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>2. Thương Hiệu, Pháp Lý & MXH</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('copywriting')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'copywriting'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Tiêu Đề Chiến Dịch & Flash Sale</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('vouchers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'vouchers'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>4. Mã Giảm Giá & Voucher ({form.vouchers?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pledges')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'pledges'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>5. Cam Kết Vàng 5 Sao ({form.trustPledges?.length || 4})</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= TAB 1: BỐ CỤC KHỐI TRANG CHỦ ================= */}
        {activeSubTab === 'layout' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Bật / Tắt Các Khối Hiển Thị Ngoài Trang Chủ</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tùy chỉnh bật hoặc tạm ẩn từng khối nội dung để phù hợp với từng chiến dịch bán hàng cụ thể
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {[
                  { key: 'showMarquee', label: '1. Thanh Chạy Chữ Thông Báo Khuyến Mãi (Top Marquee)', desc: 'Thanh chữ chạy màu xanh đỉnh đầu trang web' },
                  { key: 'showHeroSlider', label: '2. Khối Hero Slider & 3 Dịch Vụ Nổi Bật', desc: 'Banner trượt chính + 5 tabs chuyển slide + 3 mini banner' },
                  { key: 'showShowroomsStrip', label: '3. Dải 38 Siêu Thị Chi Nhánh Toàn Quốc', desc: 'Thanh định vị cửa hàng và liên hệ nhanh' },
                  { key: 'showFlashSale', label: '4. Giờ Vàng Giá Sốc (Flash Sale Countdown)', desc: 'Đồng hồ đếm ngược và bảng sản phẩm giảm giá chớp nhoáng' },
                  { key: 'showCatalog', label: '5. Kho Hàng Sản Phẩm & Phụ Kiện (Catalog)', desc: 'Danh sách sản phẩm phân loại Laptop, PC, Linh kiện' },
                  { key: 'showPCBuilder', label: '6. Cấu Hình PC Lắp Ráp Theo Giá & Mục Đích', desc: '4 bộ PC lắp sẵn tối ưu: Học tập, Esport, AAA, Render AI' },
                  { key: 'showServices', label: '7. Bảng Giá Dịch Vụ Sửa Chữa & Phòng Lab ISO', desc: 'Bảng giá sửa chữa minh bạch, 30 phút lấy liền' },
                  { key: 'showTechArticles', label: '8. Cẩm Nang Chọn Máy & Tư Vấn Kỹ Thuật', desc: 'Bài viết kinh nghiệm mua sắm, vệ sinh máy tính' },
                  { key: 'showShowroomsMap', label: '9. Bản Đồ & Hệ Thống 38 Showroom', desc: 'Danh sách chi nhánh, giờ mở cửa, số điện thoại hotline' },
                  { key: 'showTrustPledges', label: '10. Khối 4 Cam Kết Vàng Uy Tín Dịch Vụ', desc: 'Bảo hành 1 đổi 1, Lấy liền 30P, Góp 0%, Hoàn tiền 200%' },
                ].map((item) => {
                  const isChecked = form.sectionVisibility?.[item.key as keyof SectionVisibilityCMS] !== false;
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleSection(item.key as keyof SectionVisibilityCMS)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-slate-950 border-sky-500/50 hover:border-sky-400'
                          : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isChecked ? (
                            <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <span>{item.label}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>

                      <div
                        className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                          isChecked ? 'bg-sky-500 justify-end' : 'bg-slate-800 justify-start'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: THƯƠNG HIỆU, PHÁP LÝ & MẠNG XÃ HỘI ================= */}
        {activeSubTab === 'branding' && (
          <div className="space-y-5">
            {/* Thông Tin Pháp Lý & ĐKKD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Thông Tin Doanh Nghiệp & Giấy Phép Hoạt Động (Bộ Công Thương)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Mã Số Thuế (Doanh Nghiệp):
                  </label>
                  <input
                    type="text"
                    value={form.taxNumber || ''}
                    onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
                    placeholder="VD: 0201988291"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Giấy Phép Đăng Ký Kinh Doanh:
                  </label>
                  <input
                    type="text"
                    value={form.businessLicense || ''}
                    onChange={(e) => setForm({ ...form, businessLicense: e.target.value })}
                    placeholder="VD: Số 0201988291 cấp bởi Sở KH&ĐT TP. Hải Phòng"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Chứng Nhận Bộ Công Thương:
                  </label>
                  <input
                    type="text"
                    value={form.bctCertificateNumber || ''}
                    onChange={(e) => setForm({ ...form, bctCertificateNumber: e.target.value })}
                    placeholder="VD: Đã Thông Báo Bộ Công Thương (Quyết định số 9482/TB-BCT)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Hotline Khiếu Nại & CSKH (Dành cho Giám Đốc):
                  </label>
                  <input
                    type="text"
                    value={form.complaintHotline || ''}
                    onChange={(e) => setForm({ ...form, complaintHotline: e.target.value })}
                    placeholder="VD: 0988.66.99.22 (Trưởng phòng CSKH)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Mạng Xã Hội */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Kênh Truyền Thông & Mạng Xã Hội (Social Media)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Facebook Fanpage:
                  </label>
                  <input
                    type="text"
                    value={form.facebookFanpage || ''}
                    onChange={(e) => setForm({ ...form, facebookFanpage: e.target.value })}
                    placeholder="https://facebook.com/tranhoacomputer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    TikTok Shop:
                  </label>
                  <input
                    type="text"
                    value={form.tiktokShop || ''}
                    onChange={(e) => setForm({ ...form, tiktokShop: e.target.value })}
                    placeholder="https://tiktok.com/@tranhoacomputer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Kênh YouTube Review:
                  </label>
                  <input
                    type="text"
                    value={form.youtubeChannel || ''}
                    onChange={(e) => setForm({ ...form, youtubeChannel: e.target.value })}
                    placeholder="https://youtube.com/@tranhoacomputer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Chân Trang & Copyright */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Nội Dung Chân Trang (Footer Copy & Copyright)</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Lời Giới Thiệu Chân Trang:
                  </label>
                  <input
                    type="text"
                    value={form.footerDescription}
                    onChange={(e) => setForm({ ...form, footerDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Dòng Bản Quyền & Tuyên Bố Pháp Lý:
                  </label>
                  <input
                    type="text"
                    value={form.footerCopyright}
                    onChange={(e) => setForm({ ...form, footerCopyright: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: TIÊU ĐỀ CHIẾN DỊCH & FLASH SALE ================= */}
        {activeSubTab === 'copywriting' && (
          <div className="space-y-5">
            {/* Top Bar Marquee */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-950 text-sky-400 rounded-lg">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Thanh Chạy Chữ Thông Báo Khuyến Mãi (Top Bar)</h3>
                    <p className="text-[11px] text-slate-400">Hiển thị ở dòng trên cùng của website</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300 font-medium">Bật dải này:</span>
                  <input
                    type="checkbox"
                    checked={form.showAnnouncement !== false}
                    onChange={(e) => setForm({ ...form, showAnnouncement: e.target.checked })}
                    className="w-4 h-4 text-sky-500 rounded bg-slate-950 border-slate-700 focus:ring-sky-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nội dung dòng chữ chạy:
                </label>
                <input
                  type="text"
                  value={form.announcementText}
                  onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                  placeholder="VD: 🔥 ĐẠI TIỆC CÔNG NGHỆ: Giảm đến 50% cho Laptop Gaming & Phụ kiện VNA..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                />
              </div>
            </div>

            {/* Flash Sale */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-950 text-rose-400 rounded-lg">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Khu Vực Giờ Vàng Giá Sốc (Flash Sale)</h3>
                    <p className="text-[11px] text-slate-400">Đồng hồ đếm ngược và bảng sản phẩm giảm giá chớp nhoáng</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300 font-medium">Bật Flash Sale:</span>
                  <input
                    type="checkbox"
                    checked={form.flashSaleActive !== false}
                    onChange={(e) => setForm({ ...form, flashSaleActive: e.target.checked })}
                    className="w-4 h-4 text-sky-500 rounded bg-slate-950 border-slate-700 focus:ring-sky-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tiêu đề chiến dịch Flash Sale:
                  </label>
                  <input
                    type="text"
                    value={form.flashSaleTitle}
                    onChange={(e) => setForm({ ...form, flashSaleTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Thời gian đếm ngược (Số giờ):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={form.flashSaleHours || 3}
                    onChange={(e) => setForm({ ...form, flashSaleHours: parseInt(e.target.value) || 3 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Lời dẫn phụ Flash Sale:
                  </label>
                  <input
                    type="text"
                    value={form.flashSaleSubtitle}
                    onChange={(e) => setForm({ ...form, flashSaleSubtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Catalog Section Heading */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Tiêu Đề Khu Vực 1: Kho Hàng Sản Phẩm Tuyển Chọn</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Huy hiệu nhỏ (Badge):</label>
                  <input
                    type="text"
                    value={form.catalogBadge}
                    onChange={(e) => setForm({ ...form, catalogBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tiêu đề lớn:</label>
                  <input
                    type="text"
                    value={form.catalogTitle}
                    onChange={(e) => setForm({ ...form, catalogTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mô tả ngắn bên dưới:</label>
                  <input
                    type="text"
                    value={form.catalogSubtitle}
                    onChange={(e) => setForm({ ...form, catalogSubtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Services Section Heading */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Tiêu Đề Khu Vực 2: Dịch Vụ Sửa Chữa & Phòng Lab Kỹ Thuật</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Huy hiệu nhỏ (Badge):</label>
                  <input
                    type="text"
                    value={form.servicesBadge}
                    onChange={(e) => setForm({ ...form, servicesBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tiêu đề lớn:</label>
                  <input
                    type="text"
                    value={form.servicesTitle}
                    onChange={(e) => setForm({ ...form, servicesTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mô tả ngắn bên dưới:</label>
                  <input
                    type="text"
                    value={form.servicesSubtitle}
                    onChange={(e) => setForm({ ...form, servicesSubtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: MÃ GIẢM GIÁ & VOUCHER ================= */}
        {activeSubTab === 'vouchers' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-sky-400" />
                    <span>Danh Sách Mã Giảm Giá (Vouchers) Đang Áp Dụng</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Khách hàng có thể nhập các mã này khi thanh toán giỏ hàng để được khấu trừ trực tiếp
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNewVoucherModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo Mã Mới</span>
                </button>
              </div>

              {/* Vouchers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-2.5 px-3">Mã Voucher</th>
                      <th className="py-2.5 px-3">Mức Giảm</th>
                      <th className="py-2.5 px-3">Đơn Tối Thiểu</th>
                      <th className="py-2.5 px-3">Lượt Đã Dùng</th>
                      <th className="py-2.5 px-3">Hạn Dùng</th>
                      <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                      <th className="py-2.5 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(form.vouchers || []).map((v) => (
                      <tr key={v.id} className="hover:bg-slate-850/50">
                        <td className="py-3 px-3 font-mono font-bold text-sky-400 text-sm">
                          {v.code}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-rose-400">
                          {v.discountType === 'percent'
                            ? `-${v.discountValue}%`
                            : `-${v.discountValue.toLocaleString('vi-VN')}₫`}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {v.minOrderValue.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {v.usedCount} / {v.usageLimit}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                          {v.expiresAt}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleVoucherActive(v.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              v.active
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {v.active ? 'Đang Bật' : 'Tạm Khóa'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteVoucher(v.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Xóa mã này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Add Voucher */}
            {newVoucherModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-md space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-sky-400" />
                      <span>Thêm Mã Khuyến Mãi Mới</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setNewVoucherModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddVoucher} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Mã Code (Chữ in hoa không dấu):
                      </label>
                      <input
                        type="text"
                        required
                        value={newVoucher.code}
                        onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
                        placeholder="VD: HAIPHONG2026, SUMMER500"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Loại Giảm:</label>
                        <select
                          value={newVoucher.discountType}
                          onChange={(e) =>
                            setNewVoucher({
                              ...newVoucher,
                              discountType: e.target.value as 'fixed' | 'percent',
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-hidden"
                        >
                          <option value="fixed">Số tiền cố định (₫)</option>
                          <option value="percent">Phần trăm (%)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Giá Trị Giảm:</label>
                        <input
                          type="number"
                          required
                          value={newVoucher.discountValue}
                          onChange={(e) =>
                            setNewVoucher({ ...newVoucher, discountValue: Number(e.target.value) })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Đơn Tối Thiểu (₫):
                        </label>
                        <input
                          type="number"
                          value={newVoucher.minOrderValue}
                          onChange={(e) =>
                            setNewVoucher({ ...newVoucher, minOrderValue: Number(e.target.value) })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Số Lượt Tối Đa:
                        </label>
                        <input
                          type="number"
                          value={newVoucher.usageLimit}
                          onChange={(e) =>
                            setNewVoucher({ ...newVoucher, usageLimit: Number(e.target.value) })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setNewVoucherModal(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold cursor-pointer"
                      >
                        Lưu Mã Voucher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: CAM KẾT VÀNG 5 SAO ================= */}
        {activeSubTab === 'pledges' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>4 Cam Kết Vàng Chất Lượng Dịch Vụ Ngoài Trang Chủ</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Xây dựng niềm tin với khách hàng khi mua sắm và sửa chữa tại 38 chi nhánh
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(form.trustPledges || initialSeedDatabase.websiteContent.trustPledges).map(
                  (pledge, idx) => (
                    <div
                      key={pledge.id}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-sky-400">
                          CAM KẾT #{idx + 1}
                        </span>
                        <div className="p-1.5 rounded-lg bg-slate-900 text-sky-400">
                          {pledge.iconType === 'shield' && <ShieldCheck className="w-4 h-4" />}
                          {pledge.iconType === 'clock' && <Clock className="w-4 h-4" />}
                          {pledge.iconType === 'card' && <CreditCard className="w-4 h-4" />}
                          {pledge.iconType === 'award' && <Award className="w-4 h-4" />}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Tiêu đề cam kết:
                        </label>
                        <input
                          type="text"
                          value={pledge.title}
                          onChange={(e) => handlePledgeChange(idx, 'title', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Mô tả chi tiết:
                        </label>
                        <textarea
                          rows={2}
                          value={pledge.description}
                          onChange={(e) => handlePledgeChange(idx, 'description', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
