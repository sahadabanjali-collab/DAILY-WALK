import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DailyWalkLogo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon - Interlocking Gradient Pill Cross */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="dw-grad-v" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00B4D8" />
              <stop offset="50%" stopColor="#4895EF" />
              <stop offset="100%" stopColor="#3F37C9" />
            </linearGradient>
            <linearGradient id="dw-grad-h" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3F37C9" />
              <stop offset="50%" stopColor="#4361EE" />
              <stop offset="100%" stopColor="#00B4D8" />
            </linearGradient>
          </defs>

          {/* Top-to-bottom vertical pill loop */}
          <path
            d="M 40,20 C 40,10 60,10 60,20 L 60,80 C 60,90 40,90 40,80 Z"
            fill="url(#dw-grad-v)"
          />
          {/* Left-to-right horizontal pill loop */}
          <path
            d="M 20,40 C 10,40 10,60 20,60 L 80,60 C 90,60 90,40 80,40 Z"
            fill="url(#dw-grad-h)"
            style={{ mixBlendMode: 'multiply', opacity: 0.9 }}
          />
          {/* Inner cutout for geometric cross style */}
          <rect x="42" y="42" width="16" height="16" rx="4" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col">
        <div className={`font-black tracking-wider uppercase leading-none font-sans text-[#111111] group-hover:text-[#E53935] transition-colors ${textSizes[size]}`}>
          DAILY WALK
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#3F37C9] uppercase mt-0.5">
            SINCE 2026
          </span>
        )}
      </div>
    </Link>
  );
};
