'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';
import { useMounted } from '@/hooks/useMounted';

type Theme = 'dark' | 'light' | 'system';

const THEME_OPTIONS: { value: Theme; label: string; icon: any; desc: string }[] = [
  { value: 'dark', label: '深色', icon: Moon, desc: '经典深色主题（XSOAR 风格）' },
  { value: 'light', label: '浅色', icon: Sun, desc: '明亮工作区' },
  { value: 'system', label: '跟随系统', icon: Monitor, desc: '跟随操作系统偏好' },
];

/**
 * 主题切换器（深/浅/跟随）
 * - 真实切换 <html data-theme="...">
 * - localStorage 持久化
 * - 外壳（Layout / Sidebar / TopHeader）+ UI 组件库 + 侧栏全部响应主题
 * - 业务页面硬编码深色，暂保持原样
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useSystem();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = THEME_OPTIONS.find((o) => o.value === theme) || THEME_OPTIONS[0];
  const CurrentIcon = current.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 p-1.5 rounded-md text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-surface transition-colors"
        title={`当前主题：${current.label}`}
      >
        {mounted ? <CurrentIcon className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-app-bg-card border border-app-border-base rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-app-border-base">
            <p className="text-xs text-app-text-secondary">主题切换</p>
          </div>
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 px-3 py-2 text-left transition-colors ${
                  active ? 'bg-app-bg-surface' : 'hover:bg-app-bg-surface'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${active ? 'text-app-text-primary' : 'text-app-text-secondary'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-app-text-primary">{opt.label}</p>
                  <p className="text-[10px] text-app-text-muted mt-0.5">{opt.desc}</p>
                </div>
                {active && <Check className="w-3.5 h-3.5 text-app-text-primary flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
          <div className="px-3 py-2 border-t border-app-border-base bg-app-bg-surface/50">
            <p className="text-[10px] text-app-text-muted leading-relaxed">
              提示：外壳、侧栏、UI 组件已适配浅色主题，业务页面暂保持深色。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
