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
  const textSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl sm:text-[26px] tracking-tight',
    lg: 'text-3xl sm:text-4xl tracking-tight',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-1.5 group select-none ${className}`}>
      <span className={`font-black uppercase font-heading text-[#111111] transition-colors leading-none flex items-center ${textSizes[size]}`}>
        <span>DAILY</span>
        <span className="ml-1 text-[#111111] group-hover:text-black transition-colors">WALK</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] ml-1 self-end mb-1"></span>
      </span>

      {showTagline && (
        <span className="sr-only">Authentic Footwear</span>
      )}
    </Link>
  );
};
