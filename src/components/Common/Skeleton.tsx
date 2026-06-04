'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  /** 圆角 */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** 动画模式 */
  animate?: 'pulse' | 'shimmer';
}

const ROUNDED = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

/**
 * 基础骨架屏（脉冲动画 + 高光横扫）
 */
export function Skeleton({ className = '', rounded = 'md', animate = 'pulse' }: SkeletonProps) {
  return (
    <div
      className={`${ROUNDED[rounded]} ${
        animate === 'pulse' ? 'animate-pulse' : ''
      } bg-[#181F32] relative overflow-hidden ${className}`}
    >
      {animate === 'shimmer' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
            animation: 'shimmer 1.6s infinite',
          }}
        />
      )}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

/** 卡片骨架 */
export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3" rounded="sm" />
      ))}
    </div>
  );
}

/** KPI 卡片骨架 */
export function KPISkeleton() {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
      <Skeleton className="h-3 w-16 mb-3" />
      <Skeleton className="h-7 w-20" />
    </div>
  );
}

/** 表格骨架 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 space-y-2">
      <Skeleton className="h-4 w-full mb-3" rounded="sm" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-3" rounded="sm" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** 图表骨架（占位） */
export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
      <Skeleton className="h-4 w-1/4 mb-3" />
      <Skeleton className="w-full" style={{ height }} rounded="md" />
    </div>
  );
}

export default Skeleton;
