'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * 全局快捷键 hook
 * - Cmd+K (mac) / Ctrl+K (win/linux) 唤起
 * - 返回 [open, setOpen]
 */
export function useGlobalShortcut(): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd+K (mac) 或 Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      // 单独的 / 键聚焦搜索（暂不实现，避免与输入框冲突）
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return [open, setOpen];
}

/**
 * 通用快捷键 hook
 * @param key 键盘按键
 * @param modifiers 修饰键
 * @param callback 触发回调
 */
export function useShortcut(
  key: string,
  modifiers: { meta?: boolean; ctrl?: boolean; shift?: boolean; alt?: boolean },
  callback: () => void
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (modifiers.meta && !e.metaKey) return;
      if (modifiers.ctrl && !e.ctrlKey) return;
      if (modifiers.shift && !e.shiftKey) return;
      if (modifiers.alt && !e.altKey) return;
      // 全部条件满足才触发
      const ok =
        (!modifiers.meta || e.metaKey) &&
        (!modifiers.ctrl || e.ctrlKey) &&
        (!modifiers.shift || e.shiftKey) &&
        (!modifiers.alt || e.altKey);
      if (!ok) return;
      e.preventDefault();
      callback();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, modifiers.meta, modifiers.ctrl, modifiers.shift, modifiers.alt, callback]);
}

export default useGlobalShortcut;
