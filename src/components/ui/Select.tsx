'use client';

/**
 * 选择器组件 — options 数组驱动
 *
 * ✅ 正确用法：
 * ```
 * <Select options={[{value:'a',label:'A'}]} value={val} onChange={e => setVal(e.target.value)} />
 * ```
 *
 * ❌ 禁止（shadcn 风格）：
 * ```
 * <Select onValueChange={fn}><SelectTrigger>...</SelectTrigger></Select>
 * ```
 */

import React, { createContext, useContext, useState } from 'react';

/* ========== 原 Select 组件（options-based API）+ shadcn 兼容 ========== */

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  /** shadcn 兼容：自定义值变更回调 */
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  value: controlledValue,
  onChange,
  onValueChange,
  children,
  ...props
}: SelectProps) {
  // shadcn 兼容模式：通过 children + onValueChange 渲染
  if (children) {
    const val = typeof controlledValue === 'string' ? controlledValue : '';
    const change = onValueChange || ((v: string) => {});
    return <SelectRoot value={val} onValueChange={change}>{children}</SelectRoot>;
  }

  // 原 options-based 模式
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#D1D5DB]">{label}</label>
      )}
      <select
        className={`
          w-full bg-[#181F32] border border-[#2A354D] rounded-lg px-3 py-2 text-sm
          text-[#F3F4F6] placeholder-[#6B7280]
          focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[#FF3B30] focus:ring-[#FF3B30]' : ''}
          ${className}
        `}
        value={controlledValue}
        onChange={onChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-[#FF3B30]">{error}</p>
      )}
    </div>
  );
}

/* ========== shadcn 兼容的 Select 子组件 ========== */

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
});

interface SelectRootProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  disabled?: boolean;
  name?: string;
}

export function SelectRoot({ value: controlledValue, onValueChange, defaultValue = '', children }: SelectRootProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const change = onValueChange || setInternalValue;

  return (
    <SelectContext.Provider value={{ value, onValueChange: change, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
}

export function SelectValue({ placeholder, className = '' }: { placeholder?: string; className?: string }) {
  const ctx = useContext(SelectContext);
  const displayText = ctx.value || placeholder || '';
  return (
    <span className={`text-sm ${ctx.value ? 'text-[#F3F4F6]' : 'text-[#6B7280]'} ${className}`}>
      {displayText}
    </span>
  );
}

export function SelectTrigger({ className = '', children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={`
        w-full inline-flex items-center justify-between bg-[#181F32] border border-[#2A354D] rounded-lg px-3 py-2 text-sm
        text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent
        ${className}
      `}
      {...props}
    >
      {children}
      <svg className="w-4 h-4 ml-2 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const ctx = useContext(SelectContext);
  if (!ctx.open) return null;
  return (
    <div
      className={`absolute z-50 mt-1 w-full bg-[#20293F] border border-[#2A354D] rounded-lg shadow-xl py-1 ${className}`}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, className = '', children, ...props }: { value: string; className?: string; children: React.ReactNode; [key: string]: any }) {
  const ctx = useContext(SelectContext);
  const selected = ctx.value === value;
  return (
    <div
      className={`
        px-3 py-2 text-sm cursor-pointer transition-colors
        ${selected ? 'bg-[#0066FF]/20 text-[#0066FF]' : 'text-[#D1D5DB] hover:bg-[#181F32]'}
        ${className}
      `}
      onClick={() => { ctx.onValueChange(value); ctx.setOpen(false); }}
      {...props}
    >
      {children}
    </div>
  );
}
