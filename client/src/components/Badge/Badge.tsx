import React from 'react';
import './Badge.scss';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'navy' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  return (
    <span className={`pk-badge pk-badge--${variant} ${className}`}>
      {children}
    </span>
  );
};
