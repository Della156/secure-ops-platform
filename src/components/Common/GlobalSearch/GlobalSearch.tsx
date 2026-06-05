'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, X, CornerDownLeft, Hash, ArrowUp, ArrowDown, Command } from 'lucide-react';
import { menuData } from '@/data/menuData';
import { useSystem } from '@/contexts/SystemContext';

interface SearchHit {
  id: string;
  label: string;
  breadcrumb: string;
  level: 1 | 2 | 3;
  parentPath: string[];
  /** 跳转目标：1/2 级菜单点击时优先跳到第一个子菜单（pageRegistry 中只有 3 级 menuId 有 entry） */
  firstChildId?: string;
}

/** 展平菜单为可搜索列表（保留完整路径用于面包屑） */
function flattenMenu(): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const lvl1 of menuData) {
    // 1 级菜单：firstChildId = 第一个 3 级子菜单（绕过 2 级，直接跳到具体页面，避开 GenericStub）
    // 因为 pageRegistry 只为 3 级 menuId 有 entry，1/2 级 menuId 会走 fallback DefaultPage
    let l1FirstChild: string | undefined;
    if (lvl1.children && lvl1.children.length > 0) {
      const firstL2 = lvl1.children[0];
      if (firstL2.children && firstL2.children.length > 0) {
        l1FirstChild = firstL2.children[0].id;
      } else {
        l1FirstChild = firstL2.id; // 退而求其次：如果该 2 级无 3 级子
      }
    }
    hits.push({
      id: lvl1.id,
      label: lvl1.label,
      breadcrumb: lvl1.label,
      level: 1,
      parentPath: [],
      firstChildId: l1FirstChild,
    });
    if (lvl1.children) {
      for (const lvl2 of lvl1.children) {
        // 2 级菜单：firstChildId = 第一个 3 级子菜单（如果存在）
        const l2FirstChild = lvl2.children && lvl2.children.length > 0 ? lvl2.children[0].id : undefined;
        hits.push({
          id: lvl2.id,
          label: lvl2.label,
          breadcrumb: `${lvl1.label} / ${lvl2.label}`,
          level: 2,
          parentPath: [lvl1.label],
          firstChildId: l2FirstChild,
        });
        if (lvl2.children) {
          for (const lvl3 of lvl2.children) {
            hits.push({
              id: lvl3.id,
              label: lvl3.label,
              breadcrumb: `${lvl1.label} / ${lvl2.label} / ${lvl3.label}`,
              level: 3,
              parentPath: [lvl1.label, lvl2.label],
            });
          }
        }
      }
    }
  }
  return hits;
}

/** 简单模糊匹配：query 任意字符按序命中 label 即返回 */
function fuzzyMatch(query: string, text: string): { score: number; matched: boolean } {
  if (!query) return { score: 0, matched: false };
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  // 精确包含 → 最高分
  if (t.includes(q)) return { score: 100 - t.indexOf(q), matched: true };
  // 字符按序匹配
  let qi = 0;
  let score = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      score += 1;
    }
  }
  if (qi === q.length) return { score, matched: true };
  return { score: 0, matched: false };
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 全局搜索组件（Cmd/Ctrl + K 唤起）
 * - 模糊搜索全部 705 个菜单项
 * - 键盘上下选择、Enter 跳转、Esc 关闭
 * - 分组：1 级目录 / 2 级 / 3 级
 */
export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setActiveMenu } = useSystem();

  // 全部菜单数据
  const allHits = useMemo(() => flattenMenu(), []);

  // 搜索结果
  const results = useMemo(() => {
    if (!query.trim()) {
      // 无 query 时显示：1 级目录 + 2 级目录（高频）
      return allHits.filter((h) => h.level === 1 || h.level === 2).slice(0, 12);
    }
    const matched = allHits
      .map((h) => {
        const base = fuzzyMatch(query, h.label);
        // 1/2 级菜单作为"分组"：点击时会跳到第一个子菜单
        // 排序时压低分数，让 3 级菜单（具体功能）排前面
        const adjusted = h.level < 3 ? { ...base, score: base.score - 50 } : base;
        return { hit: h, match: adjusted };
      })
      .filter((m) => m.match.matched)
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 30)
      .map((m) => m.hit);
    return matched;
  }, [query, allHits]);

  // 打开时聚焦 + 重置
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // active 变化时滚动到可视区
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const handleSelect = useCallback(
    (hit: SearchHit) => {
      // 1/2 级菜单（且存在子菜单）：跳到第一个子项（pageRegistry 中只有 3 级 menuId 有 entry）
      // 3 级菜单：直接跳到自身
      const targetId = hit.level < 3 && hit.firstChildId ? hit.firstChildId : hit.id;
      setActiveMenu(targetId);
      onClose();
    },
    [setActiveMenu, onClose]
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[activeIdx]) handleSelect(results[activeIdx]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [results, activeIdx, handleSelect, onClose]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="w-[640px] max-w-[92vw] bg-[#20293F] border border-[#2A354D] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 搜索框 */}
        <div className="flex items-center gap-2 px-4 h-12 border-b border-[#2A354D]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={handleKey}
            placeholder="搜索菜单（705 项）·支持中文模糊匹配"
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 outline-none text-sm"
          />
          <kbd className="hidden md:flex items-center gap-1 text-[10px] text-slate-500 border border-[#2A354D] rounded px-1.5 py-0.5">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
          <button onClick={onClose} className="p-1 hover:bg-[#181F32] rounded">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* 结果列表 */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="text-center text-slate-500 py-12 text-sm">没有匹配结果</div>
          ) : (
            <>
              <div className="px-4 py-1.5 text-[10px] text-slate-500 uppercase">
                {query ? `${results.length} 个结果` : '常用入口'}
              </div>
              {results.map((hit, i) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={hit.id}
                    data-idx={i}
                    onClick={() => handleSelect(hit)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex items-center gap-2 mx-2 px-3 py-2 rounded-lg cursor-pointer ${
                      isActive ? 'bg-[#0066FF]/15' : 'hover:bg-[#181F32]'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                        hit.level === 1 ? 'bg-blue-500/20' : hit.level === 2 ? 'bg-cyan-500/20' : 'bg-slate-500/20'
                      }`}
                    >
                      <Hash className={`w-3 h-3 ${hit.level === 1 ? 'text-blue-400' : hit.level === 2 ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-100 truncate">{highlight(hit.label, query)}</div>
                      {hit.level > 1 && <div className="text-[10px] text-slate-500 truncate">{hit.breadcrumb}</div>}
                    </div>
                    {isActive && <CornerDownLeft className="w-3 h-3 text-blue-400" />}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* 底部快捷键提示 */}
        <div className="flex items-center gap-3 px-4 h-9 border-t border-[#2A354D] text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-2.5 h-2.5" />
            <ArrowDown className="w-2.5 h-2.5" />
            选择
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5" />
            打开
          </span>
          <span className="ml-auto">Esc 关闭</span>
        </div>
      </div>
    </div>
  );
}

/** 简易高亮：把匹配到的字符 wrap 在 span */
function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.substring(0, idx)}
      <span className="text-blue-400 font-semibold">{text.substring(idx, idx + query.length)}</span>
      {text.substring(idx + query.length)}
    </>
  );
}

export default GlobalSearch;
