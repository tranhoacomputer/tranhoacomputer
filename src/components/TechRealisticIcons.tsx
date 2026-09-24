import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. LAPTOP GAMING: Realistic RGB Backlit Keyboard, Dual Vents, Thin Bezel Screen
export const IconLaptopGaming: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="l_screen" x1="12" y1="10" x2="52" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284c7" />
        <stop offset="0.5" stopColor="#38bdf8" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="l_body" x1="4" y1="44" x2="60" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="0.5" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="l_rgb" x1="18" y1="46" x2="46" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.5" stopColor="#a855f7" />
        <stop offset="1" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    {/* Screen Lid */}
    <rect x="11" y="9" width="42" height="31" rx="3.5" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
    <rect x="13.5" y="11.5" width="37" height="25" rx="1.5" fill="url(#l_screen)" />
    {/* Screen Graphic Flare */}
    <path d="M15 34 L26 21 L34 29 L48 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    <circle cx="48" cy="14" r="2" fill="#38bdf8" />
    {/* Screen Camera / Mic */}
    <circle cx="32" cy="10.2" r="0.8" fill="#94a3b8" />
    {/* Base Chassis */}
    <path d="M4 44 C4 42.5 5.5 41.5 7 41.5 L57 41.5 C58.5 41.5 60 42.5 60 44 L56.5 53.5 C56 55 54.5 56 53 56 L11 56 C9.5 56 8 55 7.5 53.5 Z" fill="url(#l_body)" stroke="#64748b" strokeWidth="1.2" />
    {/* RGB Keyboard Deck */}
    <rect x="16" y="44" width="32" height="5" rx="1" fill="url(#l_rgb)" opacity="0.9" />
    {/* Precision Trackpad */}
    <rect x="27" y="50" width="10" height="4.5" rx="0.8" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
    {/* Front LED status bar */}
    <line x1="22" y1="55" x2="42" y2="55" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// 2. LAPTOP ULTRABOOK / VĂN PHÒNG: Minimalist Unibody Aluminum, Crisp Display
export const IconLaptopOffice: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="o_screen" x1="12" y1="12" x2="52" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f8fafc" />
        <stop offset="1" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="o_metal" x1="6" y1="43" x2="58" y2="53" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e2e8f0" />
        <stop offset="0.5" stopColor="#94a3b8" />
        <stop offset="1" stopColor="#64748b" />
      </linearGradient>
    </defs>
    {/* Screen */}
    <rect x="12" y="11" width="40" height="28" rx="3" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.2" />
    <rect x="14" y="13" width="36" height="23" rx="1" fill="url(#o_screen)" />
    {/* Productivity Visual on Screen */}
    <rect x="18" y="18" width="16" height="3" rx="1" fill="#0284c7" />
    <rect x="18" y="24" width="28" height="2" rx="0.5" fill="#94a3b8" />
    <rect x="18" y="28" width="22" height="2" rx="0.5" fill="#cbd5e1" />
    <circle cx="39" cy="20" r="4" fill="#38bdf8" />
    {/* Slim Hinge & Unibody Bottom */}
    <rect x="26" y="39" width="12" height="2" rx="0.5" fill="#475569" />
    <path d="M6 43 C6 42 7 41.5 8 41.5 L56 41.5 C57 41.5 58 42 58 43 L55 52 C54.5 53 53.5 53.5 52 53.5 L12 53.5 C10.5 53.5 9.5 53 9 52 Z" fill="url(#o_metal)" stroke="#94a3b8" strokeWidth="1" />
    {/* Sleek trackpad */}
    <rect x="26" y="47" width="12" height="4.5" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.6" />
  </svg>
);

// 3. PC GAMING / WORKSTATION: Glass Case, Dual ARGB Fans, Liquid AIO, Discrete GPU
export const IconPCGaming: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="pc_case" x1="16" y1="6" x2="48" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" />
        <stop offset="1" stopColor="#090d16" />
      </linearGradient>
      <linearGradient id="pc_glass" x1="18" y1="10" x2="42" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0369a1" stopOpacity="0.4" />
        <stop offset="1" stopColor="#0f172a" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="fan_glow" x1="36" y1="14" x2="44" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    {/* Outer Chassis */}
    <rect x="15" y="8" width="34" height="48" rx="4" fill="url(#pc_case)" stroke="#38bdf8" strokeWidth="1.5" />
    {/* Tempered Glass Side */}
    <rect x="18" y="11" width="28" height="42" rx="2.5" fill="url(#pc_glass)" stroke="#475569" strokeWidth="1" />
    {/* Top Exhaust Vent */}
    <line x1="22" y1="6" x2="42" y2="6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    {/* CPU Cooler Pump with ARGB Circle */}
    <circle cx="28" cy="22" r="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
    <circle cx="28" cy="22" r="2.5" fill="#a855f7" />
    {/* Radiator Braided Tubes */}
    <path d="M28 17 C28 13 36 13 36 16" stroke="#0ea5e9" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    {/* Massive Graphic Card (GPU) */}
    <rect x="20" y="32" width="24" height="7" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
    <circle cx="25" cy="35.5" r="2" fill="#0f172a" />
    <circle cx="32" cy="35.5" r="2" fill="#0f172a" />
    <circle cx="39" cy="35.5" r="2" fill="#0f172a" />
    {/* Power Supply Shroud & Logo */}
    <rect x="18" y="44" width="28" height="9" fill="#0b1120" />
    <line x1="22" y1="48.5" x2="34" y2="48.5" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
    {/* Chassis Feet */}
    <rect x="18" y="56" width="6" height="2" rx="0.5" fill="#64748b" />
    <rect x="40" y="56" width="6" height="2" rx="0.5" fill="#64748b" />
  </svg>
);

// 4. MÀN HÌNH GAMING (MONITOR): Curved, Frameless, Ambient Glow, Ergonomic Stand
export const IconMonitor: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="mon_display" x1="10" y1="12" x2="54" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0369a1" />
        <stop offset="0.5" stopColor="#0284c7" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Ambient Glow behind display */}
    <path d="M10 14 Q32 10 54 14 L52 38 Q32 35 12 38 Z" fill="#38bdf8" opacity="0.25" filter="blur(3px)" />
    {/* Curved Display Panel */}
    <path d="M10 13 Q32 10 54 13 L52 39 Q32 36 12 39 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
    <path d="M12 15 Q32 12.5 52 15 L50.5 37 Q32 34.5 13.5 37 Z" fill="url(#mon_display)" />
    {/* Display Vivid Wave */}
    <path d="M16 28 Q24 20 32 26 T48 22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
    <circle cx="48" cy="22" r="2.5" fill="#f59e0b" />
    {/* Stand Column */}
    <path d="M30 39 L29 51 L35 51 L34 39 Z" fill="#475569" stroke="#64748b" strokeWidth="1" />
    {/* V-Shape Gaming Base */}
    <path d="M18 55 L32 50 L46 55 L43 56 L32 52 L21 56 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
  </svg>
);

// 5. CARD MÀN HÌNH (VGA / GPU): Triple Fan, Copper Heatpipes, PCIe Gold Contacts
export const IconVGA: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="vga_shroud" x1="6" y1="18" x2="58" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="0.5" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Backplate / Shroud */}
    <rect x="6" y="18" width="52" height="26" rx="3.5" fill="url(#vga_shroud)" stroke="#0ea5e9" strokeWidth="1.5" />
    {/* Copper Heatpipe accents */}
    <line x1="12" y1="19" x2="52" y2="19" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    {/* Fan 1 */}
    <circle cx="17" cy="31" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
    <circle cx="17" cy="31" r="3" fill="#38bdf8" />
    {/* Fan 2 */}
    <circle cx="32" cy="31" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
    <circle cx="32" cy="31" r="3" fill="#a855f7" />
    {/* Fan 3 */}
    <circle cx="47" cy="31" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
    <circle cx="47" cy="31" r="3" fill="#38bdf8" />
    {/* PCIe Gold Pins Connector */}
    <rect x="18" y="44" width="28" height="4" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
    <line x1="24" y1="44" x2="24" y2="48" stroke="#78350f" strokeWidth="0.8" />
    <line x1="30" y1="44" x2="30" y2="48" stroke="#78350f" strokeWidth="0.8" />
    <line x1="36" y1="44" x2="36" y2="48" stroke="#78350f" strokeWidth="0.8" />
    <line x1="42" y1="44" x2="42" y2="48" stroke="#78350f" strokeWidth="0.8" />
    {/* IO Metal Bracket */}
    <rect x="4" y="14" width="3" height="34" rx="1" fill="#94a3b8" />
  </svg>
);

// 6. CPU / BỘ VI XỬ LÝ: Metallic Heatspreader, LGA Gold Pins, PCB Substrate
export const IconCPU: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="cpu_ihs" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e2e8f0" />
        <stop offset="0.5" stopColor="#94a3b8" />
        <stop offset="1" stopColor="#475569" />
      </linearGradient>
    </defs>
    {/* Green PCB Substrate */}
    <rect x="10" y="10" width="44" height="44" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
    {/* Gold Alignment Triangle */}
    <path d="M12 12 L16 12 L12 16 Z" fill="#fbbf24" />
    {/* Integrated Heat Spreader (IHS) */}
    <rect x="17" y="17" width="30" height="30" rx="3" fill="url(#cpu_ihs)" stroke="#cbd5e1" strokeWidth="1.2" />
    {/* Core Laser Engraving */}
    <rect x="23" y="23" width="18" height="18" rx="1.5" fill="#334155" stroke="#38bdf8" strokeWidth="1" />
    <circle cx="32" cy="32" r="4" fill="#0284c7" />
    {/* Golden Pin Edges */}
    <circle cx="14" cy="22" r="1" fill="#fbbf24" />
    <circle cx="14" cy="32" r="1" fill="#fbbf24" />
    <circle cx="14" cy="42" r="1" fill="#fbbf24" />
    <circle cx="50" cy="22" r="1" fill="#fbbf24" />
    <circle cx="50" cy="32" r="1" fill="#fbbf24" />
    <circle cx="50" cy="42" r="1" fill="#fbbf24" />
  </svg>
);

// 7. BÀN PHÍM CƠ (MECHANICAL KEYBOARD): RGB Per-Key, Rotary Knob, Solid Case
export const IconKeyboard: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="kb_rgb" x1="10" y1="20" x2="54" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.3" stopColor="#818cf8" />
        <stop offset="0.6" stopColor="#ec4899" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    {/* Aluminum Case Frame */}
    <rect x="8" y="18" width="48" height="28" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
    {/* Volume Rotary Knob */}
    <circle cx="50" cy="23" r="2.5" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
    {/* Row 1 Keys */}
    <rect x="12" y="22" width="5" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="19" y="22" width="5" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="26" y="22" width="5" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="33" y="22" width="5" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="40" y="22" width="6" height="4" rx="1" fill="url(#kb_rgb)" />
    {/* Row 2 Keys */}
    <rect x="12" y="28" width="6" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="20" y="28" width="5" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="27" y="28" width="5" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="34" y="28" width="5" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="41" y="28" width="11" height="4" rx="1" fill="url(#kb_rgb)" />
    {/* Row 3 - Spacebar Row */}
    <rect x="12" y="34" width="7" height="4" rx="1" fill="url(#kb_rgb)" />
    <rect x="21" y="34" width="22" height="4" rx="1" fill="#38bdf8" />
    <rect x="45" y="34" width="7" height="4" rx="1" fill="url(#kb_rgb)" />
    {/* Cable Accent */}
    <path d="M32 18 L32 12 Q32 8 36 8 L40 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// 8. CHUỘT GAMING (GAMING MOUSE): Ergonomic Curve, Illuminated Scroll Wheel, Thumb Grip
export const IconMouse: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="mouse_body" x1="20" y1="12" x2="44" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="0.6" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Mouse Body Contour */}
    <path
      d="M22 18 C22 13 26 9 32 9 C38 9 42 13 42 18 L43 38 C43 47 38 53 32 53 C26 53 21 47 21 38 Z"
      fill="url(#mouse_body)"
      stroke="#38bdf8"
      strokeWidth="1.5"
    />
    {/* Main Click Split Line */}
    <line x1="32" y1="9" x2="32" y2="28" stroke="#64748b" strokeWidth="1.2" />
    {/* Scroll Wheel with LED Light */}
    <rect x="30" y="15" width="4" height="9" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
    {/* DPI Toggle Button */}
    <rect x="30.5" y="27" width="3" height="3" rx="0.5" fill="#f59e0b" />
    {/* Ergonomic Thumb Rest Groove */}
    <path d="M21 30 C19 33 19 39 21 42" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
    {/* Rear RGB Palm Logo */}
    <circle cx="32" cy="42" r="3.5" fill="#a855f7" opacity="0.85" />
  </svg>
);

// 9. TAI NGHE & ÂM THANH (AUDIO / HEADSET): Memory Foam Earcups, Suspension Band, Boom Mic
export const IconHeadset: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Steel Headband Arch */}
    <path
      d="M16 34 C16 20 23 12 32 12 C41 12 48 20 48 34"
      stroke="#38bdf8"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    {/* Padded Suspension Cushion */}
    <path
      d="M20 28 C20 18 25 15 32 15 C39 15 44 18 44 28"
      stroke="#64748b"
      strokeWidth="2"
      fill="none"
    />
    {/* Left Earcup */}
    <rect x="12" y="30" width="8" height="18" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
    <rect x="17" y="32" width="4" height="14" rx="2" fill="#38bdf8" opacity="0.8" />
    {/* Right Earcup */}
    <rect x="44" y="30" width="8" height="18" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
    <rect x="43" y="32" width="4" height="14" rx="2" fill="#38bdf8" opacity="0.8" />
    {/* Flexible Boom Microphone */}
    <path
      d="M16 44 C16 52 24 54 28 54"
      stroke="#94a3b8"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="28" y="52" width="6" height="4" rx="1.5" fill="#f43f5e" />
  </svg>
);

// 10. TẢN NHIỆT AIO / LINH KIỆN: Infinite Mirror Pump, Dual Tubes, Copper Base
export const IconCooling: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Pump Block Body */}
    <rect x="16" y="16" width="32" height="32" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
    {/* Infinite Mirror Outer Ring */}
    <circle cx="32" cy="32" r="11" stroke="#0284c7" strokeWidth="1.5" />
    {/* ARGB Middle Ring */}
    <circle cx="32" cy="32" r="7" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
    {/* Center Core Emblem */}
    <circle cx="32" cy="32" r="3.5" fill="#06b6d4" />
    {/* Dual Braided Radiator Tubes */}
    <path d="M26 16 C26 9 14 11 14 6" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M38 16 C38 9 50 11 50 6" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Copper Cold Plate Base */}
    <rect x="20" y="48" width="24" height="3" rx="1" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
  </svg>
);

// 11. PHÒNG LAB SỬA CHỮA (REPAIR LAB / HARDWARE): Multimeter, Precision Driver, Clean Traces
export const IconRepairLab: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Circuit Board Trace Background */}
    <path d="M12 20 L24 20 L30 26 L46 26" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
    <circle cx="12" cy="20" r="2" fill="#10b981" />
    <circle cx="46" cy="26" r="2" fill="#10b981" />
    {/* Precision Screwdriver */}
    <g transform="rotate(45 32 32)">
      {/* Handle */}
      <rect x="29" y="8" width="6" height="24" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.2" />
      <line x1="29" y1="14" x2="35" y2="14" stroke="#e0f2fe" strokeWidth="1" />
      <line x1="29" y1="20" x2="35" y2="20" stroke="#e0f2fe" strokeWidth="1" />
      {/* Steel Shaft */}
      <rect x="30.5" y="32" width="3" height="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
      {/* Magnetic Hex Bit */}
      <polygon points="30.5,50 33.5,50 32,56" fill="#64748b" />
    </g>
    {/* Digital Spark of Repair Success */}
    <circle cx="48" cy="46" r="6" fill="#10b981" opacity="0.25" />
    <circle cx="48" cy="46" r="3" fill="#10b981" />
  </svg>
);

// 12. THU CŨ ĐỔI MỚI (TRADE-IN): Dual Device Renewal Loop with High-Value Token
export const IconTradeIn: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Renewal Loop Arrow Top */}
    <path
      d="M18 24 C22 14 36 12 46 20"
      stroke="#f59e0b"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <polygon points="48,16 52,24 43,24" fill="#f59e0b" />
    {/* Renewal Loop Arrow Bottom */}
    <path
      d="M46 40 C42 50 28 52 18 44"
      stroke="#10b981"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <polygon points="16,48 12,40 21,40" fill="#10b981" />
    {/* Center Gold Value Shield / Token */}
    <circle cx="32" cy="32" r="11" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
    <path d="M29 26 L35 32 L29 38" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 13. TRẢ GÓP 0% LÃI SUẤT (ZERO INTEREST SHIELD): Bank-grade Crest & 0% Emblem
export const IconInstallmentZero: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="shield_grad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
    </defs>
    {/* Trust Security Shield */}
    <path
      d="M32 8 L50 14 C50 32 42 48 32 56 C22 48 14 32 14 14 Z"
      fill="url(#shield_grad)"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    {/* Big 0% Typography */}
    <text
      x="32"
      y="38"
      fontSize="17"
      fontWeight="900"
      fontFamily="system-ui, sans-serif"
      fill="#ffffff"
      textAnchor="middle"
      letterSpacing="-0.5"
    >
      0%
    </text>
    {/* Checkmark Ribbon */}
    <circle cx="48" cy="46" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
    <path d="M45 46 L47 48 L51 44" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 14. GIAO HỎA TỐC 1-2H (SPEED EXPRESS DELIVERY): Fast Van with Speed Trails
export const IconExpressSpeed: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Speed Trails */}
    <line x1="6" y1="26" x2="16" y2="26" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="4" y1="33" x2="18" y2="33" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="8" y1="40" x2="15" y2="40" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
    {/* Van Body */}
    <path
      d="M20 22 C20 20 22 18 24 18 L42 18 C44 18 46 20 46 22 L46 26 L54 28 C56 29 57 31 57 33 L57 43 C57 44.5 55.5 46 54 46 L51 46 C51 41 43 41 43 46 L31 46 C31 41 23 41 23 46 L20 46 C18.5 46 17 44.5 17 43 L17 25 C17 23.5 18.5 22 20 22 Z"
      fill="#0284c7"
      stroke="#38bdf8"
      strokeWidth="1.8"
    />
    {/* Cab Window */}
    <path d="M46 24 L52 29 L46 29 Z" fill="#e0f2fe" />
    {/* Wheels */}
    <circle cx="27" cy="46" r="4.5" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
    <circle cx="47" cy="46" r="4.5" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
    {/* Lightning Bolt on Van */}
    <path d="M33 24 L29 32 L34 32 L31 40 L39 30 L34 30 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
  </svg>
);

// ================= REALISTIC PAYMENT & CERTIFICATE BADGES =================

// Con dấu ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
export const BadgeBoCongThuong: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => (
  <svg viewBox="0 0 140 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="140" height="48" rx="8" fill="#1e3a8a" />
    <rect x="2" y="2" width="136" height="44" rx="6" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
    {/* Seal Emblem */}
    <circle cx="26" cy="24" r="14" fill="#dc2626" stroke="#fef08a" strokeWidth="1.5" />
    <polygon points="26,14 28,21 35,21 29,25 31,32 26,28 21,32 23,25 17,21 24,21" fill="#fef08a" />
    {/* Typography */}
    <text x="46" y="19" fontSize="8" fontWeight="800" fill="#fef08a" fontFamily="system-ui, sans-serif" letterSpacing="0.5">
      ĐÃ THÔNG BÁO
    </text>
    <text x="46" y="31" fontSize="9" fontWeight="900" fill="#ffffff" fontFamily="system-ui, sans-serif" letterSpacing="0.2">
      BỘ CÔNG THƯƠNG
    </text>
    <text x="46" y="40" fontSize="6.5" fontWeight="600" fill="#93c5fd" fontFamily="monospace">
      CHÍNH HÃNG 100%
    </text>
  </svg>
);

// VietQR Badge
export const BadgeVietQR: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 96 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="96" height="36" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
    {/* VietQR Visual Logo */}
    <path d="M12 10 H22 V20 H12 Z" fill="#0066b3" />
    <path d="M15 13 H19 V17 H15 Z" fill="#ffffff" />
    <circle cx="20" cy="24" r="2.5" fill="#ed1c24" />
    <text x="28" y="23" fontSize="13" fontWeight="900" fill="#0066b3" fontFamily="system-ui, sans-serif">
      Viet<tspan fill="#ed1c24">QR</tspan>
    </text>
  </svg>
);

// VNPAY Badge
export const BadgeVNPay: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 96 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="96" height="36" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
    <circle cx="20" cy="18" r="8" fill="#005baa" />
    <polygon points="20,12 25,22 15,22" fill="#ed1c24" />
    <text x="34" y="24" fontSize="12" fontWeight="900" fill="#005baa" fontFamily="system-ui, sans-serif">
      VN<tspan fill="#ed1c24">PAY</tspan>
    </text>
  </svg>
);

// MoMo Badge
export const BadgeMoMo: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 76 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="76" height="36" rx="6" fill="#a50064" />
    <circle cx="18" cy="18" r="7" fill="#ffffff" />
    <circle cx="18" cy="18" r="3.5" fill="#a50064" />
    <text x="30" y="24" fontSize="13" fontWeight="900" fill="#ffffff" fontFamily="system-ui, sans-serif">
      momo
    </text>
  </svg>
);

// Visa & Mastercard Badge
export const BadgeVisaMaster: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="110" height="36" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
    {/* Visa text */}
    <text x="12" y="24" fontSize="14" fontWeight="900" fontStyle="italic" fill="#1a1f71" fontFamily="system-ui, sans-serif">
      VISA
    </text>
    {/* Divider */}
    <line x1="56" y1="8" x2="56" y2="28" stroke="#e2e8f0" strokeWidth="1" />
    {/* Mastercard dual interlocking circles */}
    <circle cx="75" cy="18" r="7.5" fill="#eb001b" />
    <circle cx="85" cy="18" r="7.5" fill="#f79e1b" fillOpacity="0.88" />
  </svg>
);

// Home Credit Trả Góp Badge
export const BadgeHomeCredit: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 115 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="115" height="36" rx="6" fill="#e11932" />
    <text x="10" y="23" fontSize="11" fontWeight="900" fill="#ffffff" fontFamily="system-ui, sans-serif">
      HOME CREDIT
    </text>
  </svg>
);

// HD SAISON Trả Góp Badge
export const BadgeHDSaison: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 105 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="105" height="36" rx="6" fill="#004a99" />
    <text x="10" y="23" fontSize="11" fontWeight="900" fill="#ffffff" fontFamily="system-ui, sans-serif">
      HD SAISON
    </text>
  </svg>
);

// DMCA Protected Badge
export const BadgeDMCA: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="36" rx="6" fill="#1e293b" />
    <rect x="4" y="4" width="42" height="28" rx="4" fill="#0284c7" />
    <text x="10" y="22" fontSize="10" fontWeight="900" fill="#ffffff" fontFamily="monospace">
      DMCA
    </text>
    <text x="52" y="22" fontSize="9" fontWeight="800" fill="#94a3b8" fontFamily="system-ui, sans-serif">
      PROTECTED
    </text>
  </svg>
);

// SSL 256-Bit Encryption Badge
export const BadgeSSL: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="36" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="1" />
    <circle cx="16" cy="18" r="6" fill="#10b981" />
    <path d="M14 18 L15.5 19.5 L18.5 16.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <text x="28" y="17" fontSize="8" fontWeight="800" fill="#d1fae5" fontFamily="system-ui, sans-serif">
      SSL SECURE
    </text>
    <text x="28" y="27" fontSize="7.5" fontWeight="700" fill="#6ee7b7" fontFamily="monospace">
      256-BIT ENCRYPTION
    </text>
  </svg>
);

// Viettel Post Shipping Badge
export const BadgeViettelPost: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 115 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="115" height="36" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
    <circle cx="18" cy="18" r="8" fill="#ee0033" />
    <path d="M14 18 L22 13 L22 23 Z" fill="#ffffff" />
    <text x="32" y="19" fontSize="10" fontWeight="900" fill="#ee0033" fontFamily="system-ui, sans-serif">
      viettel<tspan fill="#f37021">post</tspan>
    </text>
    <text x="32" y="27" fontSize="7" fontWeight="700" fill="#64748b" fontFamily="system-ui, sans-serif">
      CHUYỂN PHÁT NHANH
    </text>
  </svg>
);

// Giao Hàng Tiết Kiệm Badge
export const BadgeGHTK: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="36" rx="6" fill="#005832" />
    <circle cx="16" cy="18" r="6.5" fill="#f47920" />
    <path d="M13 18 L19 14 L19 22 Z" fill="#ffffff" />
    <text x="28" y="23" fontSize="13" fontWeight="900" fill="#ffffff" fontFamily="system-ui, sans-serif">
      GHTK
    </text>
  </svg>
);

// Giao Hàng Nhanh (GHN) Badge
export const BadgeGHN: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 95 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="95" height="36" rx="6" fill="#f26522" />
    <text x="10" y="24" fontSize="14" fontWeight="900" fill="#ffffff" fontFamily="system-ui, sans-serif">
      GHN<tspan fontSize="8" fontWeight="600" fill="#fed7aa"> Express</tspan>
    </text>
  </svg>
);

// J&T Express Badge
export const BadgeJTExpress: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => (
  <svg viewBox="0 0 95 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="95" height="36" rx="6" fill="#ed1c24" />
    <text x="12" y="24" fontSize="14" fontWeight="900" fontStyle="italic" fill="#ffffff" fontFamily="system-ui, sans-serif">
      J&T<tspan fontSize="8" fontStyle="normal" fontWeight="700"> Express</tspan>
    </text>
  </svg>
);

