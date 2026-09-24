import React, { useState } from 'react';
import {
  Download,
  FolderArchive,
  Database,
  FileCode,
  FileText,
  Server,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Copy,
  Terminal,
  Play,
  Clock,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { ShopDatabase } from '../../types/shop';
import {
  createCpanelZipBundle,
  generateSqlDump,
  generateInstallPhp,
  generateApiPhp,
  generateHtaccess,
  generateReadme,
} from '../../utils/cpanelBundleGenerator';

interface AdminCpanelDeployProps {
  db: ShopDatabase;
  isDark?: boolean;
}

export const AdminCpanelDeploy: React.FC<AdminCpanelDeployProps> = ({ db, isDark = true }) => {
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick_zip' | 'sql_preview' | 'instructions'>('quick_zip');
  const [copiedText, setCopiedText] = useState(false);

  // Download ZIP
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await createCpanelZipBundle(db);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cpanel_public_html_deployment_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess('Đã tạo tệp ZIP trọn gói thành công! Hãy đưa tệp này lên thư mục public_html trên cPanel và giải nén.');
      setTimeout(() => setDownloadSuccess(null), 6000);
    } catch (err) {
      console.error(err);
      alert('Không thể tạo tệp ZIP: ' + (err as any)?.message);
    } finally {
      setIsZipping(false);
    }
  };

  // Download SQL
  const handleDownloadSql = () => {
    const sql = generateSqlDump(db);
    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_tranhoa_computer.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Đã tải tệp database.sql! Bạn có thể nhập trực tiếp vào phpMyAdmin trên cPanel.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  // Download install.php
  const handleDownloadInstallPhp = () => {
    const php = generateInstallPhp();
    const blob = new Blob([php], { type: 'application/x-httpd-php;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'install.php';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy SQL to clipboard
  const handleCopySql = () => {
    const sql = generateSqlDump(db);
    navigator.clipboard.writeText(sql);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30 border-slate-800'
            : 'bg-gradient-to-br from-white via-sky-50/50 to-blue-50 border-sky-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Đóng Gói cPanel public_html & Tự Động Tạo CSDL
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  1-Click Ready
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Tạo ngay tệp <b>.zip</b> hoàn chỉnh để tải lên thư mục <b>public_html</b> trên hosting cPanel.
                Website sẽ chạy ngay lập tức khi giải nén, đồng thời hỗ trợ <b>install.php</b> tự động tạo bảng MySQL.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {isZipping ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang nén tệp ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải Tệp ZIP Cho cPanel (public_html)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadSql}
              className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Tải database.sql</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Subtabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('quick_zip')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'quick_zip'
              ? 'bg-sky-500 text-white shadow-xs'
              : isDark
              ? 'bg-slate-900 text-slate-400 hover:text-white'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Gói Tệp Triển Khai ({isZipping ? 'Đang nén' : '6 Tệp Cốt Lõi'})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('instructions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'instructions'
              ? 'bg-sky-500 text-white shadow-xs'
              : isDark
              ? 'bg-slate-900 text-slate-400 hover:text-white'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Hướng Dẫn 3 Bước Đưa Lên cPanel</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sql_preview')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sql_preview'
              ? 'bg-sky-500 text-white shadow-xs'
              : isDark
              ? 'bg-slate-900 text-slate-400 hover:text-white'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Cấu Trúc Bảng MySQL (7 Bảng)</span>
        </button>
      </div>

      {/* Subtab 1: Gói Tệp Triển Khai */}
      {activeTab === 'quick_zip' && (
        <div className="space-y-6">
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Các Thành Phần Được Tự Động Đóng Gói Vào Tệp ZIP
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Người dùng chỉ việc tải 1 tệp duy nhất và giải nén ngay trong thư mục public_html
                </p>
              </div>

              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">
                Tương thích mọi Hosting PHP/cPanel
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                {
                  name: 'index.html',
                  desc: 'Trang chủ cửa hàng toàn diện (Single Page App) với đầy đủ 38 chi nhánh, linh kiện, PC Builder',
                  badge: 'Giao Diện Chính',
                  icon: FileCode,
                  action: null,
                },
                {
                  name: 'install.php',
                  desc: 'Trình cài đặt tự động 1-Click: Kết nối MySQL, tạo các bảng và nhập toàn bộ dữ liệu mẫu',
                  badge: 'Auto Installer',
                  icon: Sparkles,
                  action: handleDownloadInstallPhp,
                  actionLabel: 'Tải riêng',
                },
                {
                  name: 'api.php',
                  desc: 'Cổng tiếp nhận đơn hàng, đồng bộ dữ liệu vào CSDL cPanel và hỗ trợ fallback offline',
                  badge: 'REST Backend',
                  icon: Server,
                  action: null,
                },
                {
                  name: 'database.sql',
                  desc: 'Kịch bản SQL đầy đủ cấu trúc 7 bảng dữ liệu và toàn bộ sản phẩm, dịch vụ sửa chữa',
                  badge: 'MySQL Dump',
                  icon: Database,
                  action: handleDownloadSql,
                  actionLabel: 'Tải SQL',
                },
                {
                  name: '.htaccess',
                  desc: 'Cấu hình tối ưu máy chủ Apache/LiteSpeed: Bật nén Gzip, điều hướng SPA, tăng tốc độ mở web',
                  badge: 'Server Config',
                  icon: FileText,
                  action: null,
                },
                {
                  name: 'README_cPanel.txt',
                  desc: 'Tài liệu hướng dẫn tiếng Việt chi tiết từng bước cho người quản trị tải và giải nén trên cPanel',
                  badge: 'Hướng Dẫn',
                  icon: FileText,
                  action: null,
                },
              ].map((file) => {
                const IconComp = file.icon;
                return (
                  <div
                    key={file.name}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono font-bold text-xs text-sky-400">
                          <IconComp className="w-4 h-4" />
                          <span>{file.name}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {file.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {file.desc}
                      </p>
                    </div>

                    {file.action && (
                      <button
                        type="button"
                        onClick={file.action}
                        className="text-[11px] font-semibold text-sky-500 hover:text-sky-400 text-left cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>{file.actionLabel}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Hướng dẫn 3 bước đưa lên cPanel */}
      {activeTab === 'instructions' && (
        <div className="space-y-4">
          <div
            className={`p-6 rounded-2xl border space-y-6 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Quy Trình Đưa Lên cPanel & Khởi Chạy Website Trong 2 Phút
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bước 1 */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black text-sm flex items-center justify-center font-mono">
                  1
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tải Lên Thư Mục public_html
                </h4>
                <ul className={`text-xs space-y-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>• Đăng nhập trang quản trị cPanel hosting.</li>
                  <li>• Vào mục <b>File Manager (Trình Quản Lý Tệp)</b>.</li>
                  <li>• Nhấp đúp vào thư mục <b>public_html</b>.</li>
                  <li>• Bấm nút <b>Upload</b> và tải tệp ZIP vừa tải về lên.</li>
                </ul>
              </div>

              {/* Bước 2 */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center font-mono">
                  2
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Giải Nén Tệp (Extract)
                </h4>
                <ul className={`text-xs space-y-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>• Quay lại thư mục <b>public_html</b>.</li>
                  <li>• Nhấp chuột phải vào tệp ZIP vừa tải lên.</li>
                  <li>• Chọn <b>Extract (Giải Nén)</b>.</li>
                  <li>• Các tệp <i>index.html</i>, <i>install.php</i>, <i>api.php</i> sẽ nằm ngay trong thư mục gốc.</li>
                </ul>
              </div>

              {/* Bước 3 */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center font-mono">
                  3
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Chạy Ngay Hoặc Tạo CSDL
                </h4>
                <ul className={`text-xs space-y-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>
                    • <b>Cách 1 (Chạy Ngay):</b> Mở <code>https://tênmiền.com</code>. Trang web chạy tức thì!
                  </li>
                  <li>
                    • <b>Cách 2 (MySQL Auto-Install):</b> Mở <code>https://tênmiền.com/install.php</code> để kết nối MySQL tự động.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Cấu trúc bảng MySQL */}
      {activeTab === 'sql_preview' && (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Kịch Bản Tạo Bảng MySQL Tự Động (database.sql)
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Gồm 7 bảng: shop_settings, products, services, orders, branches, website_cms, vouchers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedText ? 'Đã sao chép!' : 'Sao chép SQL'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tệp .SQL</span>
                </button>
              </div>
            </div>

            {/* SQL Preview Box */}
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
                <code>{generateSqlDump(db)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
