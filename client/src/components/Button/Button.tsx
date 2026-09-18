import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const classes = [
    'pk-button',
    `pk-button--${variant}`,
    `pk-button--${size}`,
    fullWidth ? 'pk-button--block' : '',
    isLoading ? 'pk-button--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <span className="spinner" style={{ width: '1rem', height: '1rem' }} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn-icon btn-icon--left">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="btn-icon btn-icon--right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
