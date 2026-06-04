'use client';

import React, { useState } from 'react';
import { Search, Bell, User, ChevronRight, Home, Command, RefreshCw } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';
import { menuData } from '@/data/menuData';
import { GlobalSearch } from '@/components/Common/GlobalSearch';
import { ThemeSwitcher } from '@/components/Common/ThemeSwitcher';
import { useGlobalShortcut } from '@/hooks/useGlobalShortcut';
import { useMounted } from '@/hooks/useMounted';

function findMenuPath(menuId: string): { title: string; path: { id: string; label: string }[] } | null {
  for (const l1 of menuData) {
    if (l1.id === menuId) return { title: l1.label, path: [{ id: l1.id, label: l1.label }] };
    if (l1.children) {
      for (const l2 of l1.children) {
        if (l2.id === menuId)
          return { title: l2.label, path: [{ id: l1.id, label: l1.label }, { id: l2.id, label: l2.label }] };
        if (l2.children) {
          for (const l3 of l2.children) {
            if (l3.id === menuId)
              return {
                title: l3.label,
                path: [
                  { id: l1.id, label: l1.label },
                  { id: l2.id, label: l2.label },
                  { id: l3.id, label: l3.label },
                ],
              };
          }
        }
      }
    }
  }
  return null;
}

/**
 * 顶部 Header
 * - 面包屑（首页 / 二级 / 三级）
 * - 全局搜索（Cmd+K 唤起）
 * - 高优待办铃铛
 * - 用户头像菜单
 */
export function TopHeader() {
  const { activeMenu, setActiveMenu, highPriorityTodos, isCalculatingRisk, recalculateRiskScore } = useSystem();
  const [searchOpen, setSearchOpen] = useState(false);
  const [todoDrawerOpen, setTodoDrawerOpen] = useState(false);
  const mounted = useMounted();

  const info = findMenuPath(activeMenu);
  const path = info?.path || [{ id: 'dashboard', label: '首页' }];

  return (
    <>
      <header className="h-14 bg-app-bg-card border-b border-app-border-base flex items-center px-4 sticky top-0 z-40 theme-transition">
        {/* 面包屑 */}
        <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className="flex items-center gap-1 text-app-text-secondary hover:text-app-text-primary transition-colors flex-shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
            <span>首页</span>
          </button>
          {path.map((p, i) => (
            <React.Fragment key={p.id}>
              <ChevronRight className="w-3.5 h-3.5 text-app-text-muted flex-shrink-0" />
              <button
                onClick={() => setActiveMenu(p.id)}
                className={`truncate transition-colors ${
                  i === path.length - 1 ? 'text-app-text-primary font-medium' : 'text-app-text-secondary hover:text-app-text-primary'
                }`}
              >
                {p.label}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 全局搜索按钮 */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 h-8 bg-app-bg-deep border border-app-border-base rounded-lg text-app-text-secondary hover:border-app-text-secondary transition-colors text-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">搜索菜单...</span>
            <kbd className="hidden md:flex items-center gap-0.5 ml-2 text-[10px] text-app-text-muted">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* 风险评分刷新 */}
          {mounted && (
            <button
              onClick={() => recalculateRiskScore('manual')}
              disabled={isCalculatingRisk}
              className="p-1.5 rounded-md text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-surface transition-colors"
              title="刷新风险评分"
            >
              <RefreshCw className={`w-4 h-4 ${isCalculatingRisk ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* 主题切换 */}
          <ThemeSwitcher />

          {/* 高优待办铃铛 */}
          <button
            onClick={() => setTodoDrawerOpen(true)}
            className="relative p-1.5 rounded-md text-app-text-secondary hover:text-app-text-primary hover:bg-app-bg-surface transition-colors"
            title="高优待办"
          >
            <Bell className="w-4 h-4" />
            {mounted && highPriorityTodos.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-[#FF3B30] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                {highPriorityTodos.length}
              </span>
            )}
          </button>

          {/* 用户头像 */}
          <div className="flex items-center gap-2 pl-2 border-l border-app-border-base">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-medium">
              ZS
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-app-text-primary leading-tight">主理人</p>
              <p className="text-[10px] text-app-text-secondary">超级管理员</p>
            </div>
          </div>
        </div>
      </header>

      {/* 全局搜索弹窗 */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 高优待办抽屉（占位 - 阶段 3 完善） */}
      {todoDrawerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50" onClick={() => setTodoDrawerOpen(false)}>
          <div
            className="absolute right-0 top-0 h-screen w-[400px] bg-[#20293F] border-l border-[#2A354D] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-slate-100 mb-3">高优待办 · {highPriorityTodos.length} 项</h3>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
              {highPriorityTodos.map((t) => (
                <div key={t.id} className="p-2.5 bg-[#111625] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      t.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      t.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {t.priority === 'critical' ? '紧急' : t.priority === 'high' ? '高' : '中'}
                    </span>
                    <span className="text-[10px] text-slate-500">{t.module}</span>
                  </div>
                  <p className="text-sm text-slate-200">{t.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{t.time}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">阶段 3 将支持点击跳转 / 一键处理</p>
          </div>
        </div>
      )}
    </>
  );
}

export default TopHeader;
