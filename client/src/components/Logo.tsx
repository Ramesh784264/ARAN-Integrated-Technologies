import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconDimensions = {
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 56, height: 56 }
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Engineering ARAN Hexagon Mark */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="logoOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA733" />
            <stop offset="50%" stopColor="#FF8A00" />
            <stop offset="100%" stopColor="#E07600" />
          </linearGradient>
          <linearGradient id="logoNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B3E7A" />
            <stop offset="100%" stopColor="#041D3B" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF8A00" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Hexagonal Shield */}
        <path
          d="M50 8 L86 28 V72 L50 92 L14 72 V28 Z"
          fill="url(#logoNavy)"
          stroke="#FF8A00"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Internal Concentric Blueprint Guide Ring */}
        <circle cx="50" cy="50" r="32" stroke="#ffffff" strokeOpacity="0.12" strokeDasharray="3 3" strokeWidth="1.5" />

        {/* Dynamic Stylized Engineering 'A' with Chevron Structure */}
        <path
          d="M50 19 L72 68 H61 L50 44 L39 68 H28 Z"
          fill="url(#logoOrange)"
          filter="url(#glow)"
        />

        {/* High-Tech Horizontal Grid Beam representing CCTV scan line & solar beam */}
        <line x1="36" y1="55" x2="64" y2="55" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        
        {/* Optical Sensor Aperture / Energy Core */}
        <circle cx="50" cy="55" r="4" fill="#041D3B" stroke="#FF8A00" strokeWidth="2.2" />
        <circle cx="50" cy="55" r="1.5" fill="#FFFFFF" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold tracking-wider text-xl sm:text-2xl text-white">
              ARAN
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-brand-gray-300 font-semibold font-mono">
            Integrated Technologies
          </span>
        </div>
      )}
    </div>
  );
};
