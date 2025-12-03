import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-16" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto text-black fill-current">
            {/* Geometric M Logo */}
            <path d="M10 10 H 30 L 50 45 L 70 10 H 90 V 90 H 70 V 50 L 50 80 L 30 50 V 90 H 10 V 10 Z" />
        </svg>
        <div className="font-bold text-sm tracking-[0.2em] mt-1 uppercase text-black whitespace-nowrap">
            MAJENIL GROUP
        </div>
    </div>
  );
};