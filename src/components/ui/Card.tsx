import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', subtitle }) => {
  return (
    <div className={`glass-card p-6 flex flex-col ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-xl font-bold text-text-primary tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};
