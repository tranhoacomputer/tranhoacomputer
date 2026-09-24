import React, { useState } from 'react';
import { X, Cpu, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { formatVND } from '../db/storage';
import { Product, PCBuildPackage } from '../types/shop';
import { useTheme } from '../context/ThemeContext';

interface PCBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomBuildToCart: (buildProduct: Product) => void;
  buildPackages?: PCBuildPackage[];
}

export const PCBuilderModal: React.FC<PCBuilderModalProps> = ({
  isOpen,
  onClose,
  onAddCustomBuildToCart,
  buildPackages,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  // Preset Build Packages
  const defaultBuilds = [
    {
      id: 'build-esport',
      name: 'PC Gaming ESPORT HERO - i3 12100F / RX 6600 8GB',
      price: 12490000,
      originalPrice: 14200000,
      target: 'Chiến mượt mà CS2, Valorant, Liên Minh Huyền Thoại, FIFA Online 4 trên 180 FPS.',
      specs: {
        cpu: 'Intel Core i3-12100F (4 nhân, 8 luồng)',
        mainboard: 'ASUS PRIME H610M-K D4',
        ram: '16GB (2x8GB) Kingston Fury Beast DDR4 3200MHz',
        gpu: 'ASRock AMD Radeon RX 6600 Challenger 8GB',
        storage: '512GB SSD Kingston NV2 PCIe 4.0 NVMe',
        psu: 'Aigo VK550 550W',
        case: 'Xigmatek NYX 3F Black (3 quạt RGB)',
        cooling: 'Tản nhiệt khí Jonsbo CR-1000 EVO RGB',
      },
    },
    {
      id: 'build-2k',
      name: 'PC Gaming E-POWER BATTLESHIP - i5 13400F / RTX 4060 8GB',
      price: 18990000,
      originalPrice: 22500000,
      target: 'Cân mượt mà Black Myth Wukong, Cyberpunk 2077, GTA V, đồ họa Premiere Pro 2K.',
      specs: {
        cpu: 'Intel Core i5-13400F (10 nhân, 16 luồng)',
        mainboard: 'Gigabyte B760M GAMING PLUS D4',
        ram: '16GB (2x8GB) Corsair Vengeance Pro RGB 3200MHz',
        gpu: 'MSI GeForce RTX 4060 VENTUS 2X 8GB OC',
        storage: '512GB SSD M.2 PCIe Gen4 NVMe (3500MB/s)',
        psu: 'Cooler Master Elite V4 600W 80 Plus',
        case: 'Xigmatek Aqua M Black 3 Fan RGB',
        cooling: 'Tản nhiệt khí Thermalright Assassin X 120 Refined SE',
      },
    },
    {
      id: 'build-streamer',
      name: 'PC Creator & Streamer TITAN - Ryzen 7 7700X / RTX 4070 Super',
      price: 32900000,
      originalPrice: 36500000,
      target: 'Chuyên dụng live stream đa nền tảng, render 3D kiến trúc, chơi game 2K/4K max settings.',
      specs: {
        cpu: 'AMD Ryzen 7 7700X (8 nhân, 16 luồng, 5.4GHz)',
        mainboard: 'MSI B650M GAMING PLUS WIFI DDR5',
        ram: '32GB (2x16GB) G.Skill Ripjaws S5 DDR5 6000MHz',
        gpu: 'ASUS Dual GeForce RTX 4070 Super 12GB GDDR6X',
        storage: '1TB SSD Kingston KC3000 Gen4 (7000MB/s)',
        psu: 'Deepcool PN750M 750W 80 Plus Gold Modular',
        case: 'NZXT H5 Flow Black',
        cooling: 'Tản nhiệt nước AIO Deepcool LT520 240mm RGB',
      },
    },
    {
      id: 'build-flagship',
      name: 'PC GODLIKE ULTRA - i7 14700F / RTX 4080 Super 16GB / 64GB RAM',
      price: 49990000,
      originalPrice: 54900000,
      target: 'Cỗ máy tối thượng cho huấn luyện mô hình AI, thiết kế Maya/Houdini và game 4K Ray Tracing đỉnh cao.',
      specs: {
        cpu: 'Intel Core i7-14700F (20 nhân, 28 luồng, up to 5.4GHz)',
        mainboard: 'ASUS ROG STRIX B760-F GAMING WIFI',
        ram: '64GB (2x32GB) Corsair Dominator Platinum DDR5 6000MHz',
        gpu: 'GIGABYTE GeForce RTX 4080 Super WINDFORCE V2 16GB',
        storage: '2TB SSD Samsung 990 PRO Gen4 (7450MB/s)',
        psu: 'Corsair RM850e 850W 80 Plus Gold ATX 3.0',
        case: 'Lian Li O11 Vision Chrome Tempered Glass',
        cooling: 'Tản nhiệt nước AIO Lian Li Galahad II Trinity 360',
      },
    },
  ];

  const presetBuilds = buildPackages && buildPackages.length > 0 ? buildPackages : defaultBuilds;

  const [selectedBuildId, setSelectedBuildId] = useState('build-2k');
  const activeBuild = presetBuilds.find((b) => b.id === selectedBuildId) || presetBuilds[1];

  const handleAddToCart = () => {
    const buildProduct: Product = {
      id: `custom-${activeBuild.id}-${Date.now()}`,
      name: activeBuild.name,
      category: 'pc_gaming',
      brand: 'NEXUS E-POWER',
      price: activeBuild.price,
      originalPrice: activeBuild.originalPrice,
      inStock: true,
      stockCount: 10,
      rating: 5.0,
      reviewCount: 30,
      imageUrl: '',
      badge: 'Bộ PC Tự Chọn',
      installmentZero: true,
      specs: activeBuild.specs,
      description: `Bộ dàn PC được tối ưu hóa theo gói: ${activeBuild.name}. ${activeBuild.target}`,
      isFeatured: true,
    };

    onAddCustomBuildToCart(buildProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-left">
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between border-b pb-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border ${
                isDark
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  : 'bg-sky-50 text-sky-600 border-sky-200'
              }`}
            >
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'text-sky-400' : 'text-sky-600'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>CÔNG CỤ XÂY DỰNG CẤU HÌNH MÁY TÍNH TIÊU CHUẨN</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Build PC Theo Ngân Sách & Nhu Cầu
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Tabs Selector */}
        <div>
          <label className={`text-xs font-bold block mb-2 font-mono uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Chọn gói cấu hình tối ưu theo tầm giá:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {presetBuilds.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBuildId(b.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedBuildId === b.id
                    ? isDark
                      ? 'bg-sky-600/20 border-sky-500 text-white shadow-md'
                      : 'bg-sky-50 border-sky-500 text-sky-950 ring-1 ring-sky-500 shadow-xs'
                    : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className={`text-[11px] font-mono font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                  {b.id === 'build-esport' && '12.5 TRIỆU'}
                  {b.id === 'build-2k' && '19 TRIỆU (HOT)'}
                  {b.id === 'build-streamer' && '33 TRIỆU'}
                  {b.id === 'build-flagship' && '50 TRIỆU'}
                </div>
                <div className={`text-xs font-bold mt-0.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{b.name.split(' - ')[0]}</div>
                <div className={`text-[11px] font-mono font-bold mt-1 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                  {formatVND(b.price)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Build Detailed Configuration Table */}
        <div
          className={`rounded-2xl p-5 space-y-4 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.name}</h3>
              <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>{activeBuild.target}</p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-black font-mono ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                {formatVND(activeBuild.price)}
              </div>
              <div className="text-xs text-slate-400 line-through font-mono">
                {formatVND(activeBuild.originalPrice)}
              </div>
            </div>
          </div>

          {/* Component Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bộ vi xử lý:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.cpu}</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bo mạch chủ:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.mainboard}</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bộ nhớ RAM:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.ram}</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Card đồ họa:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.gpu}</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ổ cứng SSD:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.storage}</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nguồn máy tính:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.psu}</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Vỏ thùng Case:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.case}</span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className={`font-bold w-24 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tản nhiệt:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeBuild.specs.cooling}</span>
            </div>
          </div>

          {/* Assembly Commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-bold">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Check className="w-4 h-4 shrink-0" />
              <span>Miễn phí 100% công lắp & đi dây giấu gọn</span>
            </div>
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
              <Check className="w-4 h-4 shrink-0" />
              <span>Stress test nhiệt độ 30 phút trước khi giao</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <Check className="w-4 h-4 shrink-0" />
              <span>Bảo hành chính hãng 1 đổi 1 tận nơi 36T</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className={`flex items-center justify-between pt-2 border-t ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            * Cấu hình linh kiện có thể tùy biến linh hoạt tại quầy theo nhu cầu
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 font-semibold text-xs rounded-xl cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm Dàn PC Vào Giỏ Hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
