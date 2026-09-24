import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  Globe,
  Image as ImageIcon,
  MapPin,
  Cpu,
  FolderArchive,
  Sun,
  Moon,
  Menu,
  X,
  FileCode,
} from 'lucide-react';
import { ShopDatabase, Product, ServiceItem, Order, Customer, StoreSettings } from '../types/shop';
import {
  formatVND,
  upsertProduct,
  deleteProduct,
  upsertService,
  deleteService,
  updateOrderStatus,
  deleteOrder,
  updateCustomer,
  updateSettings,
  exportDatabaseToJson,
  importDatabaseFromJson,
  resetDatabaseToDefault
} from '../db/storage';
import { MetricProgressBar } from './MetricProgressBar';
import { PrintReceiptModal } from './PrintReceiptModal';
import { AdminWebsiteCMS } from './admin/AdminWebsiteCMS';
import { AdminBanners } from './admin/AdminBanners';
import { AdminBranches } from './admin/AdminBranches';
import { AdminPCBuilder } from './admin/AdminPCBuilder';
import { AdminOrderTimelineModal } from './admin/AdminOrderTimelineModal';
import { AdminCpanelDeploy } from './admin/AdminCpanelDeploy';

interface AdminPanelProps {
  db: ShopDatabase;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ db, onExitAdmin }) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'cpanel_deploy'
    | 'website_cms'
    | 'banners'
    | 'branches'
    | 'pc_builder'
    | 'products'
    | 'services'
    | 'orders'
    | 'customers'
    | 'settings'
  >('overview');

  // Day & Night mode preference for Admin Panel
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('admin_theme_preference') as 'dark' | 'light') || 'dark';
  });

  const toggleAdminTheme = () => {
    const next = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(next);
    localStorage.setItem('admin_theme_preference', next);
  };

  // Responsive Mobile Navigation Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals & form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [timelineOrder, setTimelineOrder] = useState<Order | null>(null);
  const [techNoteOrder, setTechNoteOrder] = useState<{ id: string; note: string } | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...db.settings });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  React.useEffect(() => {
    setSettingsForm({ ...db.settings });
  }, [db.settings]);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'product_order' | 'repair_appointment'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');

  // File upload for JSON Restore
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Calculate overview metrics
  const totalRevenue = db.orders
    .filter((o) => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = db.orders.filter((o) => o.status === 'pending').length;
  const repairingCount = db.orders.filter((o) => o.status === 'repairing' || o.status === 'processing').length;
  const completedOrdersCount = db.orders.filter((o) => o.status === 'completed').length;
  const completionRate = db.orders.length > 0 ? Math.round((completedOrdersCount / db.orders.length) * 100) : 100;

  // Handler: Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    upsertProduct(editingProduct);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Handler: Save Service
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    upsertService(editingService);
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  // Handler: Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedMsg('Đã lưu cài đặt cửa hàng thành công!');
    setTimeout(() => setSettingsSavedMsg(''), 2500);
  };

  // Handler: Import Database from file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDatabaseFromJson(content);
        setImportStatus(result);
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  interface AdminNavItem {
    id:
      | 'overview'
      | 'cpanel_deploy'
      | 'website_cms'
      | 'banners'
      | 'branches'
      | 'pc_builder'
      | 'products'
      | 'services'
      | 'orders'
      | 'customers'
      | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
    badge?: string;
    count?: number;
  }

  const navItems: AdminNavItem[] = [
    { id: 'overview', label: 'Tổng Quan & Thống Kê', icon: LayoutDashboard, category: 'Báo Cáo & Chỉ Số' },
    { id: 'cpanel_deploy', label: 'Triển Khai cPanel (ZIP)', icon: FolderArchive, category: 'Báo Cáo & Chỉ Số', badge: '1-Click' },
    { id: 'website_cms', label: 'Biên Tập Nội Dung Web', icon: Globe, category: 'Giao Diện & CMS', badge: 'CMS' },
    { id: 'banners', label: 'Slider & Banner Hero', icon: ImageIcon, category: 'Giao Diện & CMS', count: db.banners?.length || 4 },
    { id: 'branches', label: 'Địa Chỉ Cửa Hàng & Lab', icon: MapPin, category: 'Giao Diện & CMS', count: db.branches?.length || 1 },
    { id: 'pc_builder', label: 'Cấu Hình PC Builder', icon: Cpu, category: 'Giao Diện & CMS', count: db.pcBuildPackages?.length || 4 },
    { id: 'products', label: 'Quản Lý Sản Phẩm', icon: Package, category: 'Kinh Doanh & Dịch Vụ', count: db.products.length },
    { id: 'services', label: 'Dịch Vụ Sửa Chữa', icon: Wrench, category: 'Kinh Doanh & Dịch Vụ', count: db.services.length },
    {
      id: 'orders',
      label: 'Đơn Hàng & Lịch Sửa',
      icon: ShoppingBag,
      category: 'Kinh Doanh & Dịch Vụ',
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} mới` : undefined,
      count: pendingOrdersCount === 0 ? db.orders.length : undefined,
    },
    { id: 'customers', label: 'Khách Hàng (CRM)', icon: Users, category: 'Kinh Doanh & Dịch Vụ', count: db.customers.length },
    { id: 'settings', label: 'Cài Đặt & Sao Lưu CSDL', icon: Settings, category: 'Hệ Thống' },
  ];

  const groupedCategories = ['Báo Cáo & Chỉ Số', 'Giao Diện & CMS', 'Kinh Doanh & Dịch Vụ', 'Hệ Thống'];

  return (
    <div
      className={`min-h-screen flex flex-col text-left transition-colors duration-200 ${
        adminTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Admin Topbar */}
      <header
        className={`sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b transition-colors ${
          adminTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
              adminTheme === 'dark'
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-sky-500/30 font-mono shrink-0">
            TH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base font-bold ${adminTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {db.settings.storeName || 'TRẦN HOA COMPUTER'} · Quản Trị
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                Live Data (LocalStorage)
              </span>
            </div>
            <div className={`text-xs truncate max-w-[200px] sm:max-w-md ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Quản lý 38 siêu thị, kho linh kiện, cPanel public_html & CMS chuyên sâu
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Day / Night Theme Mode Switch */}
          <button
            type="button"
            onClick={toggleAdminTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              adminTheme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
            }`}
            title="Chuyển đổi giao diện Ban ngày / Ban đêm"
          >
            {adminTheme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">Ban Ngày</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                <span className="hidden sm:inline">Ban Đêm</span>
              </>
            )}
          </button>

          {/* Direct cPanel One-Click Shortcut */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('cpanel_deploy');
              setIsMobileMenuOpen(false);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Tải ZIP cPanel</span>
          </button>

          <button
            type="button"
            onClick={onExitAdmin}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              adminTheme === 'dark'
                ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-300'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xem Cửa Hàng</span>
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`relative w-4/5 max-w-xs h-full p-4 overflow-y-auto z-50 flex flex-col justify-between ${
              adminTheme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800 shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs font-mono font-bold">
                    TH
                  </div>
                  <span>Menu Quản Trị</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {groupedCategories.map((cat) => (
                <div key={cat} className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 font-mono">
                    {cat}
                  </div>
                  {navItems
                    .filter((item) => item.category === cat)
                    .map((item) => {
                      const IconComp = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id as any);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-sky-500 text-white font-bold'
                              : adminTheme === 'dark'
                              ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComp className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-bold">
                              {item.badge}
                            </span>
                          ) : item.count !== undefined ? (
                            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {item.count}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Bản quyền © 2026</span>
              <span className="text-emerald-400 font-bold">Ready for cPanel</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Workspace with Sidebar Tabs */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar (Desktop) */}
        <aside
          className={`hidden md:block w-64 border-r p-4 space-y-4 shrink-0 transition-colors ${
            adminTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          {groupedCategories.map((cat) => (
            <div key={cat} className="space-y-1">
              <div
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 font-mono ${
                  cat === 'Giao Diện & CMS'
                    ? 'text-sky-400'
                    : adminTheme === 'dark'
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {cat}
              </div>

              {navItems
                .filter((item) => item.category === cat)
                .map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-500 text-white font-bold shadow-xs'
                          : adminTheme === 'dark'
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <IconComp className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            item.id === 'cpanel_deploy'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-sky-950 text-sky-400 border border-sky-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : item.count !== undefined ? (
                        <span
                          className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                            adminTheme === 'dark'
                              ? 'bg-slate-950 text-slate-400'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
            </div>
          ))}
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* ======================= TAB 1: OVERVIEW ======================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-xl font-bold ${adminTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Tổng Quan Hoạt Động Cửa Hàng
                </h2>
                <p className={`text-xs mt-0.5 ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Thống kê doanh số bán máy tính, linh kiện và tiến độ xử lý lịch hẹn sửa chữa
                </p>
              </div>

              {/* 4 Metric Cards with Progress Bars at Top */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                    adminTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <MetricProgressBar
                    percent={Math.min(100, Math.round((totalRevenue / 100000000) * 100))}
                    label="Chỉ tiêu doanh thu tháng"
                    colorClass="bg-emerald-500"
                    trackClass={adminTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-xs font-semibold uppercase ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Doanh Thu Đã Thu
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-emerald-500 font-mono mt-1 tabular-nums">
                        {formatVND(totalRevenue)}
                      </div>
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className={`text-[11px] mt-2 ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Từ các đơn mua và dịch vụ hoàn tất
                  </div>
                </div>

                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                    adminTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <MetricProgressBar
                    percent={db.orders.length > 0 ? Math.round(((db.orders.length - pendingOrdersCount) / db.orders.length) * 100) : 100}
                    label="Tiến độ xử lý đơn"
                    colorClass="bg-indigo-500"
                    trackClass={adminTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-xs font-semibold uppercase ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Tổng Đơn & Phiếu
                      </div>
                      <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 tabular-nums ${adminTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {db.orders.length}
                      </div>
                    </div>
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-500 font-medium mt-2">
                    {pendingOrdersCount} phiếu mới đang chờ tiếp nhận
                  </div>
                </div>

                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                    adminTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <MetricProgressBar
                    percent={repairingCount > 0 ? 65 : 100}
                    label="Tải phòng lab kỹ thuật"
                    colorClass="bg-amber-500"
                    trackClass={adminTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-xs font-semibold uppercase ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Máy Đang Sửa Tại Lab
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-amber-500 font-mono mt-1 tabular-nums">
                        {repairingCount}
                      </div>
                    </div>
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                      <Wrench className="w-5 h-5" />
                    </div>
                  </div>
                  <div className={`text-[11px] mt-2 ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Kỹ thuật viên đang kiểm tra & thay thế
                  </div>
                </div>

                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors ${
                    adminTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <MetricProgressBar
                    percent={completionRate}
                    label="Tỷ lệ hoàn thành đúng hạn"
                    colorClass="bg-sky-500"
                    trackClass={adminTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-xs font-semibold uppercase ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Tỷ Lệ Bàn Giao
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-sky-500 font-mono mt-1 tabular-nums">
                        {completionRate}%
                      </div>
                    </div>
                    <div className="p-2.5 bg-sky-500/10 text-sky-500 rounded-xl">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className={`text-[11px] mt-2 ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {completedOrdersCount} đơn máy đã bàn giao thành công
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Table */}
              <div
                className={`rounded-2xl border p-5 space-y-4 transition-colors ${
                  adminTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider font-mono ${
                      adminTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Đơn Hàng & Lịch Sửa Chữa Mới Nhất Cần Xử Lý
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-sky-500 hover:text-sky-600 cursor-pointer"
                  >
                    Xem tất cả →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead
                      className={`border-b font-mono transition-colors ${
                        adminTheme === 'dark'
                          ? 'bg-slate-950 text-slate-400 border-slate-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <tr>
                        <th className="p-3">Mã phiếu</th>
                        <th className="p-3">Khách hàng</th>
                        <th className="p-3">Loại dịch vụ / Đơn</th>
                        <th className="p-3">Tổng phí</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y transition-colors ${
                        adminTheme === 'dark' ? 'divide-slate-800/60' : 'divide-slate-100'
                      }`}
                    >
                      {db.orders.slice(0, 5).map((o) => (
                        <tr
                          key={o.id}
                          className={`transition-colors ${
                            adminTheme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td
                            className={`p-3 font-mono font-bold ${
                              adminTheme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {o.orderCode}
                          </td>
                          <td className="p-3">
                            <div
                              className={`font-semibold ${
                                adminTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                              }`}
                            >
                              {o.customerName}
                            </div>
                            <div className={`text-[11px] ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {o.customerPhone}
                            </div>
                          </td>
                          <td className={`p-3 ${adminTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                            {o.type === 'repair_appointment'
                              ? `Sửa: ${o.repairDetails?.deviceType || 'Máy tính'}`
                              : `Mua: ${o.items?.length || 1} sản phẩm`}
                          </td>
                          <td className="p-3 font-mono font-semibold text-emerald-500">
                            {formatVND(o.totalAmount)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                o.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                                  : o.status === 'repairing'
                                  ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/30'
                                  : o.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                  : adminTheme === 'dark'
                                  ? 'bg-slate-800 text-slate-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {o.status === 'pending'
                                ? 'Chờ duyệt'
                                : o.status === 'repairing'
                                ? 'Đang sửa'
                                : o.status === 'completed'
                                ? 'Hoàn thành'
                                : o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => setPrintingOrder(o)}
                              className={`p-1.5 rounded cursor-pointer transition-colors ${
                                adminTheme === 'dark'
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                              title="In phiếu tiếp nhận"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateOrderStatus(
                                  o.id,
                                  o.status === 'pending' ? 'repairing' : o.status === 'repairing' ? 'completed' : 'completed'
                                );
                              }}
                              className="px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-[11px] font-semibold cursor-pointer shadow-xs"
                            >
                              Chuyển Trạng Thái
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: CPANEL DEPLOYMENT & AUTO DATABASE ======================= */}
          {activeTab === 'cpanel_deploy' && (
            <AdminCpanelDeploy db={db} isDark={adminTheme === 'dark'} />
          )}

          {/* ======================= TAB: WEBSITE CMS ======================= */}
          {activeTab === 'website_cms' && (
            <AdminWebsiteCMS content={db.websiteContent} />
          )}

          {/* ======================= TAB: HERO BANNERS ======================= */}
          {activeTab === 'banners' && (
            <AdminBanners banners={db.banners} />
          )}

          {/* ======================= TAB: STORE BRANCHES ======================= */}
          {activeTab === 'branches' && (
            <AdminBranches branches={db.branches} />
          )}

          {/* ======================= TAB: PC BUILDER PACKAGES ======================= */}
          {activeTab === 'pc_builder' && (
            <AdminPCBuilder packages={db.pcBuildPackages} />
          )}

          {/* ======================= TAB 2: PRODUCTS CRUD ======================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Quản Lý Sản Phẩm & Linh Kiện</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Thêm mới, sửa giá, điều chỉnh tồn kho và cập nhật thông số kỹ thuật
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: '',
                      category: 'pc_gaming',
                      price: 15000000,
                      originalPrice: 17000000,
                      inStock: true,
                      stockCount: 5,
                      rating: 5.0,
                      reviewCount: 1,
                      imageUrl: '',
                      badge: 'Mới về',
                      specs: {
                        cpu: 'Intel Core i5 / AMD Ryzen 5',
                        ram: '16GB DDR5',
                        storage: '512GB SSD NVMe',
                        warranty: '36 Tháng',
                      },
                      description: 'Mô tả chi tiết cấu hình và công năng sản phẩm...',
                      isFeatured: true,
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>
              </div>

              {/* Product Search Bar */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Tìm tên máy, chip CPU, VGA..."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Products Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                      <tr>
                        <th className="p-3">Tên sản phẩm</th>
                        <th className="p-3">Danh mục</th>
                        <th className="p-3">Giá bán</th>
                        <th className="p-3">Tồn kho</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {db.products
                        .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/40">
                            <td className="p-3 max-w-xs">
                              <div className="font-semibold text-white truncate">{p.name}</div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {p.specs.cpu || p.specs.gpu || p.description}
                              </div>
                            </td>
                            <td className="p-3 font-mono uppercase text-indigo-400 text-[11px]">
                              {p.category}
                            </td>
                            <td className="p-3 font-mono font-bold text-white">
                              {formatVND(p.price)}
                            </td>
                            <td className="p-3 font-mono">
                              <span className="font-semibold text-slate-200">{p.stockCount}</span> máy
                            </td>
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => {
                                  upsertProduct({ ...p, inStock: !p.inStock });
                                }}
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                                  p.inStock
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                                }`}
                              >
                                {p.inStock ? 'Còn hàng' : 'Hết hàng'}
                              </button>
                            </td>
                            <td className="p-3 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                                title="Chỉnh sửa sản phẩm"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Bạn có chắc muốn xóa "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-red-900 text-red-300 rounded cursor-pointer"
                                title="Xóa sản phẩm"
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
            </div>
          )}

          {/* ======================= TAB 3: SERVICES CRUD ======================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Quản Lý Gói Dịch Vụ Kỹ Thuật</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Thêm, sửa bảng giá sửa chữa, bảo dưỡng và cam kết bảo hành linh kiện
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingService({
                      id: `srv-${Date.now()}`,
                      name: '',
                      category: 'repair',
                      priceEstimate: 'Từ 200.000₫',
                      rawPrice: 200000,
                      turnaroundTime: '30 - 60 Phút',
                      warrantyMonths: 6,
                      iconName: 'Wrench',
                      description: 'Mô tả quy trình xử lý lỗi...',
                      highlights: ['Báo giá trước khi làm', 'Bảo hành chu đáo'],
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Dịch Vụ Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {db.services.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-amber-400 uppercase">
                          {s.category}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {s.turnaroundTime}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{s.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {s.description}
                      </p>
                      <div className="mt-2 text-xs font-mono font-bold text-emerald-400">
                        Giá: {s.priceEstimate}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingService({ ...s });
                          setIsServiceModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa dịch vụ "${s.name}"?`)) {
                            deleteService(s.id);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-red-400"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB 4: ORDERS & BOOKINGS ======================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Quản Lý Đơn Hàng & Lịch Hẹn Sửa Máy</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Theo dõi trạng thái, cập nhật ghi chú kỹ thuật và in phiếu tiếp nhận dịch vụ
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs"
                  >
                    <option value="all">Tất cả loại đơn</option>
                    <option value="repair_appointment">Chỉ phiếu sửa máy</option>
                    <option value="product_order">Chỉ đơn mua linh kiện</option>
                  </select>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs"
                  >
                    <option value="all">Mọi trạng thái</option>
                    <option value="pending">Chờ tiếp nhận</option>
                    <option value="processing">Đang kiểm tra</option>
                    <option value="repairing">Đang sửa chữa</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Order List */}
              <div className="space-y-4">
                {db.orders
                  .filter((o) => (orderFilter === 'all' ? true : o.type === orderFilter))
                  .filter((o) => (orderStatusFilter === 'all' ? true : o.status === orderStatusFilter))
                  .map((order) => (
                    <div
                      key={order.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold font-mono text-white">
                            {order.orderCode}
                          </span>
                          <span className="text-xs font-mono uppercase text-slate-400">
                            {order.type === 'repair_appointment' ? 'Phiếu sửa máy' : 'Đơn hàng mua linh kiện'}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 font-semibold"
                          >
                            <option value="pending">Chờ tiếp nhận (Pending)</option>
                            <option value="processing">Đang kiểm tra (Processing)</option>
                            <option value="repairing">Đang sửa chữa (Repairing)</option>
                            <option value="completed">Hoàn thành & Bàn giao (Completed)</option>
                            <option value="cancelled">Đã hủy (Cancelled)</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setPrintingOrder(order)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                            title="In hóa đơn / Phiếu biên nhận"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Xác nhận xóa vĩnh viễn đơn ${order.orderCode}?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-red-900 text-red-300 rounded cursor-pointer"
                            title="Xóa đơn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer & Issue/Items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                          <div>
                            <span className="text-slate-500">Khách hàng: </span>
                            <strong className="text-white">{order.customerName}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Số điện thoại: </span>
                            <strong className="text-slate-300 font-mono">{order.customerPhone}</strong>
                          </div>
                          {order.customerAddress && (
                            <div>
                              <span className="text-slate-500">Địa chỉ: </span>
                              <span className="text-slate-300">{order.customerAddress}</span>
                            </div>
                          )}
                          <div className="pt-1">
                            <span className="text-slate-500">Thanh toán: </span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              {formatVND(order.totalAmount)}
                            </span>
                            <span className="ml-2 text-slate-400">
                              ({order.paymentMethod === 'vietqr' ? 'VietQR' : order.paymentMethod === 'cod' ? 'COD' : 'Tiền mặt'})
                            </span>
                          </div>
                        </div>

                        {/* Repair / Product Content */}
                        <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                          {order.type === 'repair_appointment' && order.repairDetails ? (
                            <>
                              <div className="font-semibold text-amber-400">
                                🔧 {order.repairDetails.serviceName}
                              </div>
                              <div className="text-slate-300">
                                • Model: <strong>{order.repairDetails.deviceType}</strong>
                              </div>
                              <div className="text-slate-300">
                                • Triệu chứng: {order.repairDetails.issueDescription}
                              </div>
                              <div className="text-slate-400">
                                • Hẹn lúc: {order.repairDetails.appointmentTime} - {order.repairDetails.appointmentDate}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-semibold text-indigo-400">
                                📦 Sản phẩm đặt mua:
                              </div>
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="text-slate-300 flex justify-between">
                                  <span>• {item.name} (x{item.quantity})</span>
                                  <span className="font-mono text-white">{formatVND(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Technician notes editable & Live Tracking Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-xs text-slate-400 shrink-0">Ghi chú kỹ thuật:</span>
                          <input
                            type="text"
                            defaultValue={order.technicianNotes || ''}
                            onBlur={(e) => updateOrderStatus(order.id, order.status, e.target.value)}
                            placeholder="Nhập ghi chú tình trạng máy để khách tra cứu xem được..."
                            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-hidden focus:border-sky-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setTimelineOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Cập Nhật Tiến Trình Live ({order.trackingTimeline?.length || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ======================= TAB 5: CUSTOMERS CRM ======================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Quản Lý Khách Hàng (CRM)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Danh sách khách hàng, lịch sử tích lũy chi tiêu và ghi chú chăm sóc khách hàng
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                      <tr>
                        <th className="p-3">Họ và tên</th>
                        <th className="p-3">Số điện thoại</th>
                        <th className="p-3">Hạng thành viên</th>
                        <th className="p-3">Số đơn/lần sửa</th>
                        <th className="p-3">Tổng chi tiêu</th>
                        <th className="p-3">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {db.customers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-semibold text-white">{c.name}</td>
                          <td className="p-3 font-mono text-slate-300">{c.phone}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                c.rank === 'VIP Kim Cương'
                                  ? 'bg-purple-950 text-purple-400 border border-purple-800'
                                  : c.rank === 'VIP Vàng'
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : c.rank === 'VIP Bạc'
                                  ? 'bg-slate-800 text-slate-200'
                                  : 'bg-slate-950 text-slate-400'
                              }`}
                            >
                              {c.rank}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-300">{c.orderCount}</td>
                          <td className="p-3 font-mono font-bold text-emerald-400">
                            {formatVND(c.totalSpent)}
                          </td>
                          <td className="p-3 text-slate-400 max-w-xs truncate">
                            {c.notes || 'Khách hàng liên hệ qua website'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 6: SETTINGS & BACKUP ======================= */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold text-white">Cài Đặt Cửa Hàng & Sao Lưu CSDL</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tùy chỉnh thông tin liên hệ, ngân hàng VietQR và xuất/nhập tệp JSON sao lưu
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{settingsSavedMsg}</span>
                </div>
              )}

              {/* Form Settings */}
              <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                {/* 1. THƯƠNG HIỆU & NHẬN DIỆN */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-2">
                    1. Tên Thương Hiệu & Logo (Cập nhật trực tiếp lên toàn bộ web)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Tên thương hiệu:</label>
                      <input
                        type="text"
                        value={settingsForm.storeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                        placeholder="NEXUS COMPUTER & GAMING GEAR"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Khẩu hiệu / Slogan:</label>
                      <input
                        type="text"
                        value={settingsForm.tagline || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        placeholder="Hệ Thống PC & Laptop Gaming Chuyên Nghiệp"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Link URL Logo thương hiệu (Image URL):</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settingsForm.logoUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                          placeholder="https://... (Để trống sẽ hiển thị logo biểu tượng công nghệ mặc định)"
                          className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                        />
                        {settingsForm.logoUrl && (
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={settingsForm.logoUrl}
                              alt="Logo Preview"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. BÁN HÀNG TẠI MỘT TỈNH THÀNH (LOCAL PROVINCE FOCUS) */}
                <div>
                  <h3 className="text-sm font-bold text-sky-400 uppercase font-mono tracking-wider border-b border-slate-800 pb-2">
                    2. Cấu Hình Bán Hàng Trọng Tâm Tại Tỉnh / Thành Phố
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Tỉnh / Thành phố trọng điểm:</label>
                      <input
                        type="text"
                        value={settingsForm.targetProvince || 'Hải Phòng'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, targetProvince: e.target.value })}
                        placeholder="Hải Phòng, Hà Nội, TP. Hồ Chí Minh..."
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                      {/* Quick province chips */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {['Hải Phòng', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Quảng Ninh', 'Hải Dương', 'Bình Dương'].map((prov) => (
                          <button
                            key={prov}
                            type="button"
                            onClick={() => setSettingsForm({
                              ...settingsForm,
                              targetProvince: prov,
                              provinceDeliveryNotice: `Giao hỏa tốc 1 - 2 giờ toàn bộ nội thành ${prov} · Miễn phí lắp đặt tận nhà`,
                            })}
                            className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                              settingsForm.targetProvince === prov
                                ? 'bg-sky-500 text-white border-sky-400 font-bold'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {prov}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Thời gian giao hỏa tốc tại tỉnh:</label>
                      <input
                        type="text"
                        value={settingsForm.provinceExpressHours || '1 - 2 giờ'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, provinceExpressHours: e.target.value })}
                        placeholder="1 - 2 giờ, 30 phút..."
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Cam kết giao hàng tại tỉnh (Hiển thị nổi bật trang chủ):</label>
                      <input
                        type="text"
                        value={settingsForm.provinceDeliveryNotice || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, provinceDeliveryNotice: e.target.value })}
                        placeholder="Giao hỏa tốc 1 - 2 giờ nội thành · Hỗ trợ kỹ thuật viên qua tận nhà test máy"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Đơn hàng miễn phí ship nội thành tỉnh (₫):</label>
                      <input
                        type="number"
                        value={settingsForm.provinceFreeShipThreshold || 500000}
                        onChange={(e) => setSettingsForm({ ...settingsForm, provinceFreeShipThreshold: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Hotline tư vấn trả góp 0%:</label>
                      <input
                        type="text"
                        value={settingsForm.installmentHotline || settingsForm.hotline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, installmentHotline: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. BẬT / TẮT PHƯƠNG THỨC MUA HÀNG & THANH TOÁN */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 uppercase font-mono tracking-wider border-b border-slate-800 pb-2">
                    3. Bật / Tắt Phương Thức Mua Hàng & Thanh Toán
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3">
                    {/* In store */}
                    <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-white">Mua tại cửa hàng</div>
                        <div className="text-[11px] text-slate-400">Khách ghé showroom nhận máy</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableInStorePickup !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableInStorePickup: e.target.checked })}
                        className="w-4 h-4 accent-sky-500 cursor-pointer"
                      />
                    </label>

                    {/* Local Express */}
                    <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-white">Hỏa tốc nội thành tỉnh</div>
                        <div className="text-[11px] text-slate-400">Giao 1-2h tại {settingsForm.targetProvince || 'Hải Phòng'}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableLocalExpress !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableLocalExpress: e.target.checked })}
                        className="w-4 h-4 accent-sky-500 cursor-pointer"
                      />
                    </label>

                    {/* COD Nationwide */}
                    <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-white">Ship COD toàn quốc</div>
                        <div className="text-[11px] text-slate-400">Đồng kiểm tra trước khi trả tiền</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableCodDelivery !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableCodDelivery: e.target.checked })}
                        className="w-4 h-4 accent-sky-500 cursor-pointer"
                      />
                    </label>

                    {/* COD Cash */}
                    <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-white">Thanh toán khi nhận hàng</div>
                        <div className="text-[11px] text-slate-400">Tiền mặt COD tận nơi</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableCodPayment !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableCodPayment: e.target.checked })}
                        className="w-4 h-4 accent-sky-500 cursor-pointer"
                      />
                    </label>

                    {/* VietQR */}
                    <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-white">Chuyển khoản VietQR</div>
                        <div className="text-[11px] text-slate-400">Tạo mã QR thanh toán 24/7</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableVietQR !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableVietQR: e.target.checked })}
                        className="w-4 h-4 accent-sky-500 cursor-pointer"
                      />
                    </label>

                    {/* Installment 0% */}
                    <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-amber-400">Trả góp lãi suất 0%</div>
                        <div className="text-[11px] text-slate-400">Qua CCCD hoặc Thẻ tín dụng</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableInstallment !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableInstallment: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* 4. LIÊN HỆ & SHOWROOM */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-2">
                    4. Thông Tin Liên Hệ & Showroom Trụ Sở
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Số Hotline / Zalo chính:</label>
                      <input
                        type="text"
                        value={settingsForm.hotline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Thông báo thanh đầu trang (Announcement Bar):</label>
                      <input
                        type="text"
                        value={settingsForm.announcementText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Địa chỉ showroom trụ sở chính:</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. CẤU HÌNH NGÂN HÀNG VIETQR */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-2">
                    5. Cấu Hình Ngân Hàng Thanh Toán VietQR
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Ngân hàng (Ví dụ: MB BANK, VCB):</label>
                      <input
                        type="text"
                        value={settingsForm.bankName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Số tài khoản:</label>
                      <input
                        type="text"
                        value={settingsForm.bankAccount}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bankAccount: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Tên chủ tài khoản:</label>
                      <input
                        type="text"
                        value={settingsForm.bankAccountName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bankAccountName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-sky-500/25"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Toàn Bộ Cấu Hình Hệ Thống</span>
                  </button>
                </div>
              </form>

              {/* Database Backup & Restore JSON Box */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-slate-800 pb-2">
                  Sao Lưu & Khôi Phục Cơ Sở Dữ Liệu (Backup JSON)
                </h3>
                <p className="text-xs text-slate-400">
                  Toàn bộ cơ sở dữ liệu (Sản phẩm, Dịch vụ, Đơn hàng, Khách hàng) được lưu trữ an toàn trong trình duyệt. Bạn có thể xuất tệp JSON để đưa lên GitHub hoặc chuyển qua máy tính khác bất cứ lúc nào!
                </p>

                {importStatus && (
                  <div
                    className={`p-3 text-xs rounded-xl border ${
                      importStatus.success
                        ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                        : 'bg-red-950 border-red-800 text-red-300'
                    }`}
                  >
                    {importStatus.message}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Export Button */}
                  <button
                    type="button"
                    onClick={exportDatabaseToJson}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Xuất Tệp JSON Sao Lưu</span>
                  </button>

                  {/* Import Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>Nhập Tệp JSON CSDL</span>
                  </button>

                  {/* Reset to Seed Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Khôi phục về cơ sở dữ liệu mẫu ban đầu? Các dữ liệu tự nhập sẽ được nạp lại mặc định.')) {
                        resetDatabaseToDefault();
                        setSettingsSavedMsg('Đã khôi phục dữ liệu mẫu ban đầu thành công!');
                        setTimeout(() => setSettingsSavedMsg(''), 2500);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold rounded-xl border border-rose-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-rose-400" />
                    <span>Đặt Lại CSDL Mẫu Gốc</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================= MODAL: EDIT PRODUCT ======================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingProduct.id.includes('prod-') && db.products.some((p) => p.id === editingProduct.id)
                  ? 'Chỉnh Sửa Sản Phẩm'
                  : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Tên sản phẩm / Model PC: *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300">Phân loại:</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="pc_gaming">PC Lắp Ráp / Gaming</option>
                    <option value="laptop">Laptop Doanh Nhân & Gaming</option>
                    <option value="component">Linh Kiện Máy Tính (VGA, RAM, SSD)</option>
                    <option value="accessory">Phụ Kiện (Phím, Chuột, Tai Nghe)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Huy hiệu (Badge):</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="Bán chạy, Mới, Flagship..."
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300">Giá bán (₫): *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Giá gốc niêm yết (₫):</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Số lượng tồn kho:</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1 font-mono"
                  />
                </div>
              </div>

              {/* Specs Fields */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="font-semibold text-indigo-400">Thông Số Kỹ Thuật (Specs):</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="CPU (ví dụ: Intel Core i7-14700F)"
                    value={editingProduct.specs.cpu || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, cpu: e.target.value },
                      })
                    }
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="VGA (ví dụ: RTX 4070 Ti Super 16GB)"
                    value={editingProduct.specs.gpu || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, gpu: e.target.value },
                      })
                    }
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="RAM (ví dụ: 32GB DDR5 6000MHz)"
                    value={editingProduct.specs.ram || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, ram: e.target.value },
                      })
                    }
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Ổ cứng (ví dụ: 1TB NVMe Gen4)"
                    value={editingProduct.specs.storage || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, storage: e.target.value },
                      })
                    }
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Thời hạn bảo hành (ví dụ: 36 Tháng)"
                    value={editingProduct.specs.warranty || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: { ...editingProduct.specs, warranty: e.target.value },
                      })
                    }
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs col-span-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Mô tả sản phẩm:</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: EDIT SERVICE ======================= */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Chỉnh Sửa Gói Dịch Vụ Sửa Chữa</h3>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Tên gói dịch vụ: *</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300">Chi phí hiển thị:</label>
                  <input
                    type="text"
                    value={editingService.priceEstimate}
                    onChange={(e) => setEditingService({ ...editingService, priceEstimate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Thời gian xử lý:</label>
                  <input
                    type="text"
                    value={editingService.turnaroundTime}
                    onChange={(e) => setEditingService({ ...editingService, turnaroundTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Mô tả dịch vụ:</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
                >
                  Lưu Gói Dịch Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: PRINT RECEIPT ======================= */}
      {printingOrder && (
        <PrintReceiptModal
          order={printingOrder}
          settings={db.settings}
          onClose={() => setPrintingOrder(null)}
        />
      )}

      {/* ======================= MODAL: LIVE TRACKING TIMELINE ======================= */}
      {timelineOrder && (
        <AdminOrderTimelineModal
          order={timelineOrder}
          onClose={() => setTimelineOrder(null)}
          onPrintReceipt={(ord) => {
            setTimelineOrder(null);
            setPrintingOrder(ord);
          }}
        />
      )}
    </div>
  );
};
