'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

const colorMap = {
  default: { border: 'border-[#2A354D]', text: 'text-white' },
  blue: { border: 'border-blue-500/30', text: 'text-blue-400' },
  green: { border: 'border-green-500/30', text: 'text-green-400' },
  yellow: { border: 'border-yellow-500/30', text: 'text-yellow-400' },
  red: { border: 'border-red-500/30', text: 'text-red-400' },
  purple: { border: 'border-purple-500/30', text: 'text-purple-400' },
};

export function StatsCard({ title, value, icon, color = 'default', subtitle, trend, trendValue, onClick }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`bg-[#1E2736] border ${c.border} rounded-lg p-4 ${onClick ? 'cursor-pointer hover:bg-[#253042] transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{title}</p>
        {icon && <div className={c.text}>{icon}</div>}
      </div>
      <p className={`text-2xl font-semibold mt-1 ${c.text}`}>{value}</p>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className={`text-xs ${
              trend === 'up' ? 'text-green-400' :
              trend === 'down' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue || ''}
            </span>
          )}
          {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export function StatsCardGrid({ children, cols = 5 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-4 mb-6`}>
      {children}
    </div>
  );
}
