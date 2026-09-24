import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { NavItem } from './types';
import { mockActivities, mockMetrics } from './data';
import { MetricProgressBar } from './components/MetricProgressBar';

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Bảng điều khiển', iconName: 'LayoutDashboard', active: true },
  { id: 'projects', label: 'Dự án', iconName: 'FolderGit2', badge: '12' },
  { id: 'documents', label: 'Tài liệu', iconName: 'FileText' },
  { id: 'team', label: 'Thành viên nhóm', iconName: 'Users' },
  { id: 'integrations', label: 'Tích hợp dịch vụ', iconName: 'Layers', badge: 'Mới' },
  { id: 'settings', label: 'Cài đặt hệ thống', iconName: 'Settings' },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Pagination state for Recent Activities
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalItems = mockActivities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentActivities = mockActivities.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getTabTitle = (tabId: string) => {
    const found = navItems.find((n) => n.id === tabId);
    return found ? found.label : 'Bảng điều khiển';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return 'bg-emerald-100 text-emerald-800';
      case 'Chờ duyệt':
        return 'bg-amber-100 text-amber-800';
      case 'Đang xử lý':
        return 'bg-blue-100 text-blue-800';
      case 'Đã lưu trữ':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'folder':
        return <FolderGit2 className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'file':
        return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const getIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'LayoutDashboard':
        return <LayoutDashboard className={className} />;
      case 'FolderGit2':
        return <FolderGit2 className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Settings':
        return <Settings className={className} />;
      default:
        return <LayoutDashboard className={className} />;
    }
  };

  return (
    <div id="app-container" className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out md:static
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-20' : 'md:w-64'}
          w-72 shadow-lg md:shadow-none`}
      >
        {/* Sidebar Header / Logo */}
        <div
          id="sidebar-header"
          className="flex items-center justify-between h-16 px-4 border-b border-slate-100"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold text-lg shrink-0 shadow-sm">
              Q
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-slate-900 tracking-tight truncate text-base">
                  Quản Trị Hệ Thống
                </span>
                <span className="text-xs text-slate-500 font-medium truncate">
                  Không gian Doanh nghiệp
                </span>
              </div>
            )}
          </div>

          {/* Close button on Mobile */}
          <button
            id="mobile-close-button"
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md md:hidden"
            aria-label="Đóng thanh bên"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav id="sidebar-nav" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${collapsed ? 'md:justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                  {getIcon(item.iconName)}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? 'bg-indigo-200/60 text-indigo-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Desktop Collapse Toggle & User Profile */}
        <div id="sidebar-footer" className="p-3 border-t border-slate-100 space-y-2">
          {/* Desktop Collapse / Expand Button */}
          <button
            id="desktop-collapse-toggle"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center gap-2 w-full p-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors justify-center"
            title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-500" />
                <span>Thu gọn thanh bên</span>
              </>
            )}
          </button>

          {/* User Profile Card */}
          <div
            id="user-profile-card"
            className={`flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200/70 ${
              collapsed ? 'md:justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center font-medium text-xs text-slate-700 shrink-0">
              NA
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  Nguyễn Văn An
                </p>
                <p className="text-xs text-slate-500 truncate leading-tight">
                  an.nguyen@doanhnghiep.vn
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                id="logout-button"
                type="button"
                title="Đăng xuất"
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div id="main-content-wrapper" className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header
          id="top-navbar"
          className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200 shrink-0"
        >
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile Only) */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <h1 id="page-title" className="text-lg font-semibold text-slate-900 leading-tight">
                {getTabTitle(activeTab)}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Không gian làm việc &gt; Tổng quan &gt; {getTabTitle(activeTab)}
              </p>
            </div>
          </div>

          {/* Top Actions: Search, Notifications */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div id="global-search-container" className="relative hidden sm:block w-48 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="global-search-input"
                type="text"
                placeholder="Tìm kiếm dự án, tài liệu..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <button
              id="notification-bell-button"
              type="button"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            </button>

            <a
              id="view-php-site-link"
              href="/index.php"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors border border-slate-200"
              title="Mở giao diện website PHP cPanel"
            >
              <span>Xem Web PHP</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              id="header-action-button"
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition-colors"
            >
              <span>Tạo mới</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main
          id="main-scroll-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 space-y-6"
        >
          {/* Header Metric / Summary Cards Grid with Progress Bars at top */}
          <section id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockMetrics.map((metric) => (
              <div
                key={metric.id}
                id={metric.id}
                className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                {/* Thanh tiến trình (Progress Bar) đặt ở đầu mỗi metric card */}
                <MetricProgressBar
                  id={`${metric.id}-progress`}
                  percent={metric.progressPercent}
                  label={metric.progressStatus}
                  colorClass={metric.progressColor}
                  trackClass={metric.trackColor}
                />

                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {metric.title}
                  </span>
                  {metric.iconName === 'FolderGit2' && <FolderGit2 className={`w-4 h-4 ${metric.iconColor}`} />}
                  {metric.iconName === 'Clock' && <Clock className={`w-4 h-4 ${metric.iconColor}`} />}
                  {metric.iconName === 'Users' && <Users className={`w-4 h-4 ${metric.iconColor}`} />}
                  {metric.iconName === 'CheckCircle2' && <CheckCircle2 className={`w-4 h-4 ${metric.iconColor}`} />}
                </div>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                <p className={`text-xs ${metric.changeColor} mt-1 font-medium flex items-center gap-1`}>
                  <span>{metric.changeText}</span>
                </p>
              </div>
            ))}
          </section>

          {/* Responsive Content Table / List */}
          <section
            id="recent-activities-section"
            className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Hoạt động &amp; Cập nhật gần đây
                </h2>
                <p className="text-xs text-slate-500">
                  Tổng hợp các thay đổi mã nguồn, tài liệu và hoạt động mới nhất.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="filter-activity-button"
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Bộ lọc</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table id="activity-table" className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Tên đối tượng</th>
                    <th scope="col" className="px-5 py-3.5">Phân loại</th>
                    <th scope="col" className="px-5 py-3.5">Trạng thái</th>
                    <th scope="col" className="px-5 py-3.5">Thời gian cập nhật</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-900 flex items-center gap-2">
                        {getActivityIcon(act.iconType)}
                        <span className="truncate">{act.name}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{act.category}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                            act.status
                          )}`}
                        >
                          {act.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{act.dateModified}</td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button type="button" className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Control */}
            <div
              id="activity-pagination-control"
              className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white gap-3 text-xs sm:text-sm text-slate-600"
            >
              <div id="pagination-info" className="text-slate-500 text-xs sm:text-sm">
                Hiển thị{' '}
                <span className="font-semibold text-slate-900">{startIndex + 1}</span>{' '}
                đến{' '}
                <span className="font-semibold text-slate-900">{endIndex}</span>{' '}
                trong tổng số{' '}
                <span className="font-semibold text-slate-900">{totalItems}</span>{' '}
                hoạt động
              </div>

              <div id="pagination-actions" className="flex items-center gap-1 sm:gap-2">
                {/* Previous Page Button */}
                <button
                  id="pagination-prev-btn"
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
                  }`}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Trước</span>
                </button>

                {/* Page Number Buttons */}
                <div id="pagination-pages" className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        id={`pagination-page-btn-${pageNum}`}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={`min-w-8 h-8 px-2 flex items-center justify-center text-xs rounded-lg font-medium transition-colors ${
                          isCurrent
                            ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  id="pagination-next-btn"
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
                  }`}
                  aria-label="Trang sau"
                >
                  <span>Sau</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

