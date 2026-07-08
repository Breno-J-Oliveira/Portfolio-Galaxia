import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: 'var(--color-primary)' }}
    >
      {/* Stylized Z logo */}
      <path
        d="M 15 20 L 85 20 L 85 35 L 35 35 L 35 45 L 85 45 L 85 60 L 35 60 L 35 80 L 15 80 L 15 65 L 65 65 L 65 55 L 15 55 Z"
        fill="currentColor"
      />
    </svg>
  );
};
