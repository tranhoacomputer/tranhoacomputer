import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface TechVisualProps {
  type?: 'pc_gaming' | 'laptop' | 'component' | 'accessory' | 'repair' | 'hero' | string;
  category?: 'pc_gaming' | 'laptop' | 'component' | 'accessory' | 'repair' | 'hero' | string;
  className?: string;
  title?: string;
  name?: string;
  badge?: string;
}

export const TechVisual: React.FC<TechVisualProps> = ({
  type,
  category,
  className = 'w-full h-48',
  title = '',
  name = '',
}) => {
  const { isDark } = useTheme();
  const actualType = category || type || 'laptop';

  if (actualType === 'pc_gaming') {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center transition-colors duration-200 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950'
            : 'bg-gradient-to-br from-sky-50 via-white to-sky-100/70'
        } ${className}`}
      >
        {/* Subtle geometric grid backdrop */}
        <div
          className={`absolute inset-0 bg-[size:16px_16px] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)]'
              : 'bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)]'
          }`}
        />

        {/* PC Case Vector Graphic */}
        <svg
          viewBox="0 0 200 200"
          className="w-36 h-36 drop-shadow-[0_8px_16px_rgba(2,132,199,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Case Outline */}
          <rect
            x="50"
            y="30"
            width="100"
            height="140"
            rx="10"
            fill={isDark ? '#0f172a' : '#f1f5f9'}
            stroke={isDark ? '#38bdf8' : '#0284c7'}
            strokeWidth="2.5"
          />
          {/* Tempered Glass Window */}
          <rect
            x="58"
            y="38"
            width="84"
            height="110"
            rx="6"
            fill={isDark ? '#082f49' : '#e0f2fe'}
            fillOpacity={isDark ? '0.7' : '0.8'}
            stroke={isDark ? '#38bdf8' : '#0284c7'}
            strokeWidth="1.5"
          />
          {/* Internal GPU with glowing accents */}
          <rect
            x="66"
            y="85"
            width="68"
            height="20"
            rx="3"
            fill={isDark ? '#0369a1' : '#bae6fd'}
            stroke={isDark ? '#38bdf8' : '#0284c7'}
            strokeWidth="1.5"
          />
          <line
            x1="72"
            y1="95"
            x2="128"
            y2="95"
            stroke={isDark ? '#e0f2fe' : '#0369a1'}
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* AIO Cooler Pump RGB Ring */}
          <circle
            cx="100"
            cy="62"
            r="14"
            fill={isDark ? '#0f172a' : '#ffffff'}
            stroke="#0ea5e9"
            strokeWidth="2"
          />
          <circle cx="100" cy="62" r="8" fill="#38bdf8" />
          {/* Front Airflow Grille */}
          <line
            x1="65"
            y1="156"
            x2="135"
            y2="156"
            stroke={isDark ? '#475569' : '#94a3b8'}
            strokeWidth="2"
          />
          <line
            x1="65"
            y1="161"
            x2="135"
            y2="161"
            stroke={isDark ? '#475569' : '#94a3b8'}
            strokeWidth="2"
          />
          {/* Power Button Glow */}
          <circle cx="140" cy="38" r="2.5" fill="#0ea5e9" />
        </svg>

        <span
          className={`absolute bottom-2 right-3 text-[10px] font-mono tracking-wider font-semibold ${
            isDark ? 'text-sky-300/80' : 'text-sky-800'
          }`}
        >
          RTX 40-SERIES · LIQUID
        </span>
      </div>
    );
  }

  if (actualType === 'laptop') {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center transition-colors duration-200 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/60'
            : 'bg-gradient-to-br from-sky-50 via-white to-sky-100/70'
        } ${className}`}
      >
        <div
          className={`absolute inset-0 bg-[size:16px_16px] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)]'
              : 'bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)]'
          }`}
        />

        {/* Laptop Vector Graphic */}
        <svg
          viewBox="0 0 200 200"
          className="w-36 h-36 drop-shadow-[0_8px_16px_rgba(14,165,233,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Screen Lid */}
          <rect
            x="45"
            y="45"
            width="110"
            height="74"
            rx="6"
            fill={isDark ? '#0284c7' : '#e0f2fe'}
            fillOpacity={isDark ? '0.2' : '0.9'}
            stroke={isDark ? '#38bdf8' : '#0284c7'}
            strokeWidth="2"
          />
          <rect
            x="51"
            y="51"
            width="98"
            height="62"
            rx="3"
            fill={isDark ? '#0f172a' : '#ffffff'}
            stroke={isDark ? '#0284c7' : '#bae6fd'}
            strokeWidth="1"
          />
          {/* Display Code / Graph lines */}
          <path
            d="M58 85 L75 72 L95 90 L115 65 L135 80"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="115" cy="65" r="3.5" fill="#38bdf8" />
          {/* Bottom Base / Keyboard Deck */}
          <path
            d="M30 126 L170 126 L160 144 L40 144 Z"
            fill={isDark ? '#1e293b' : '#f1f5f9'}
            stroke={isDark ? '#475569' : '#cbd5e1'}
            strokeWidth="2"
          />
          {/* Trackpad */}
          <rect
            x="85"
            y="132"
            width="30"
            height="9"
            rx="2"
            fill={isDark ? '#0f172a' : '#e2e8f0'}
            stroke={isDark ? '#334155' : '#94a3b8'}
          />
        </svg>

        <span
          className={`absolute bottom-2 right-3 text-[10px] font-mono tracking-wider font-semibold ${
            isDark ? 'text-sky-300/80' : 'text-sky-800'
          }`}
        >
          OLED 240Hz · AI ENGINE
        </span>
      </div>
    );
  }

  if (actualType === 'component') {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center transition-colors duration-200 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-zinc-950 to-sky-950/70'
            : 'bg-gradient-to-br from-sky-50 via-white to-cyan-100/60'
        } ${className}`}
      >
        <div
          className={`absolute inset-0 bg-[size:16px_16px] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)]'
              : 'bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)]'
          }`}
        />

        {/* Component / GPU / SSD Vector */}
        <svg
          viewBox="0 0 200 200"
          className="w-36 h-36 drop-shadow-[0_8px_16px_rgba(14,165,233,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circuit PCB Board */}
          <rect
            x="40"
            y="65"
            width="120"
            height="70"
            rx="6"
            fill={isDark ? '#082f49' : '#f0f9ff'}
            stroke="#0ea5e9"
            strokeWidth="2"
          />
          {/* Gold Connector Fingers */}
          <rect x="55" y="135" width="90" height="8" rx="1" fill="#f59e0b" stroke="#d97706" />
          {/* Microchip Processor */}
          <rect
            x="85"
            y="80"
            width="40"
            height="40"
            rx="4"
            fill={isDark ? '#0f172a' : '#ffffff'}
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          <circle cx="105" cy="100" r="10" fill={isDark ? '#0284c7' : '#bae6fd'} stroke="#38bdf8" />
          {/* Capacitors */}
          <circle cx="55" cy="80" r="5" fill="#0ea5e9" stroke="#38bdf8" />
          <circle cx="55" cy="100" r="5" fill="#0ea5e9" stroke="#38bdf8" />
          <circle cx="55" cy="120" r="5" fill="#0ea5e9" stroke="#38bdf8" />
        </svg>

        <span
          className={`absolute bottom-2 right-3 text-[10px] font-mono tracking-wider font-semibold ${
            isDark ? 'text-sky-300/80' : 'text-sky-800'
          }`}
        >
          GEN4 NVME / GPU
        </span>
      </div>
    );
  }

  if (actualType === 'repair') {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center transition-colors duration-200 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-950'
            : 'bg-gradient-to-br from-sky-50 via-white to-sky-100/70'
        } ${className}`}
      >
        <div
          className={`absolute inset-0 bg-[size:16px_16px] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)]'
              : 'bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)]'
          }`}
        />

        {/* Repair Tools Vector */}
        <svg
          viewBox="0 0 200 200"
          className="w-36 h-36 drop-shadow-[0_8px_16px_rgba(14,165,233,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Motherboard Base */}
          <rect
            x="45"
            y="45"
            width="110"
            height="110"
            rx="8"
            fill={isDark ? '#0f172a' : '#f8fafc'}
            stroke={isDark ? '#0ea5e9' : '#0284c7'}
            strokeWidth="2"
          />
          {/* CPU Socket */}
          <rect
            x="75"
            y="75"
            width="50"
            height="50"
            rx="4"
            fill={isDark ? '#1e293b' : '#e0f2fe'}
            stroke="#0ea5e9"
            strokeWidth="2"
          />
          {/* Precision Screwdriver tool */}
          <path
            d="M125 55 L165 95 L155 105 L115 65 Z"
            fill="#0ea5e9"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <line
            x1="115"
            y1="65"
            x2="105"
            y2="75"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Heat paste drop */}
          <circle cx="100" cy="100" r="6" fill="#38bdf8" />
        </svg>

        <span
          className={`absolute bottom-2 right-3 text-[10px] font-mono tracking-wider font-semibold ${
            isDark ? 'text-sky-300/80' : 'text-sky-800'
          }`}
        >
          LAB TECH · 30 MIN
        </span>
      </div>
    );
  }

  // Accessory / Default
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center transition-colors duration-200 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950'
          : 'bg-gradient-to-br from-sky-50 via-white to-sky-100/70'
      } ${className}`}
    >
      <div
        className={`absolute inset-0 bg-[size:16px_16px] ${
          isDark
            ? 'bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)]'
        }`}
      />

      {/* Keyboard / Mouse Vector */}
      <svg
        viewBox="0 0 200 200"
        className="w-36 h-36 drop-shadow-[0_8px_16px_rgba(14,165,233,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="35"
          y="70"
          width="130"
          height="60"
          rx="8"
          fill={isDark ? '#0f172a' : '#f1f5f9'}
          stroke={isDark ? '#38bdf8' : '#0284c7'}
          strokeWidth="2"
        />
        {/* Keycap grid */}
        <rect x="45" y="78" width="16" height="12" rx="2" fill="#0ea5e9" />
        <rect x="67" y="78" width="16" height="12" rx="2" fill={isDark ? '#334155' : '#cbd5e1'} />
        <rect x="89" y="78" width="16" height="12" rx="2" fill={isDark ? '#334155' : '#cbd5e1'} />
        <rect x="111" y="78" width="16" height="12" rx="2" fill={isDark ? '#334155' : '#cbd5e1'} />
        <rect x="133" y="78" width="18" height="12" rx="2" fill="#0ea5e9" />
        {/* Spacebar */}
        <rect
          x="65"
          y="108"
          width="70"
          height="14"
          rx="2"
          fill="#38bdf8"
          fillOpacity={isDark ? '0.4' : '0.6'}
          stroke="#0ea5e9"
          strokeWidth="1"
        />
      </svg>

      <span
        className={`absolute bottom-2 right-3 text-[10px] font-mono tracking-wider font-semibold ${
          isDark ? 'text-sky-300/80' : 'text-sky-800'
        }`}
      >
        CUSTOM MECHANICAL
      </span>
    </div>
  );
};

