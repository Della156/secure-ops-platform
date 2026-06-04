'use client';

import React, { useState, useMemo } from 'react';
import { X, Clock, CheckCircle2, Play, ChevronRight, AlertCircle, Zap } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';
import type { HighPriorityTodo } from '@/types';

interface TodoCenterProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 高优待办中心
 * - 完整 UI（替代 TopHeader 占位抽屉）
 * - 优先级 / 业务模块 / 状态 多维筛选
 * - 关键操作：查看详情 / 开始处理 / 完成
 * - 完成后 dispatchBusEvent(todo.completed) 推进业务流
 */
export function TodoCenter({ open, onClose }: TodoCenterProps) {
  const { highPriorityTodos, removeHighPriorityTodo, setActiveMenu, dispatchBusEvent, addHighPriorityTodo } = useSystem();
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [selectedTodo, setSelectedTodo] = useState<HighPriorityTodo | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return highPriorityTodos;
    return highPriorityTodos.filter((t) => t.severity === filter);
  }, [highPriorityTodos, filter]);

  const counts = useMemo(
    () => ({
      all: highPriorityTodos.length,
      critical: highPriorityTodos.filter((t) => t.severity === 'critical').length,
      high: highPriorityTodos.filter((t) => t.severity === 'high').length,
      medium: highPriorityTodos.filter((t) => t.severity === 'medium').length,
    }),
    [highPriorityTodos]
  );

  const handleStart = (todo: HighPriorityTodo) => {
    setActiveMenu('menu-3'); // 跳到自动运营模块
    setSelectedTodo(null);
    onClose();
  };

  const handleComplete = (todo: HighPriorityTodo) => {
    // 派发 todo.completed 事件，推进业务流
    dispatchBusEvent({
      type: 'todo.completed',
      source: 'user',
      bizId: todo.id,
      payload: { todoId: todo.id, result: 'success' },
    } as any);
    // 演示：完成一个高优待办后，自动派发一个 report.generated 关联事件
    setTimeout(() => {
      dispatchBusEvent({
        type: 'report.generated',
        source: 'system',
        bizId: todo.id,
        payload: { reportId: 'REP-' + Date.now(), type: 'incident', findings: 0 },
      } as any);
    }, 100);
    removeHighPriorityTodo(todo.id);
    setSelectedTodo(null);
  };

  // 演示：派发一个示例待办（用于演示事件总线）
  const handleDemoDispatch = () => {
    const newTodo: HighPriorityTodo = {
      id: 'TD-DEMO-' + Date.now(),
      title: '【演示】检测到异常外联行为，需人工确认',
      severity: 'high',
      source: '威胁监测',
      createdAt: new Date().toISOString(),
    };
    addHighPriorityTodo(newTodo);
    dispatchBusEvent({
      type: 'todo.created',
      source: 'system',
      bizId: newTodo.id,
      payload: {
        todoId: newTodo.id,
        title: newTodo.title,
        priority: 'high',
        module: '威胁监测',
        linkMenuId: 'menu-3',
      },
    } as any);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-screen w-[440px] bg-app-bg-card border-l border-app-border-base flex flex-col theme-transition"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-app-border-base">
          <div>
            <h2 className="text-base font-semibold text-app-text-primary">高优待办中心</h2>
            <p className="text-[10px] text-app-text-muted mt-0.5">{counts.all} 项待办 · 按优先级处理</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-app-bg-surface">
            <X className="w-4 h-4 text-app-text-secondary" />
          </button>
        </div>

        {/* 优先级筛选 */}
        <div className="flex items-center gap-1 p-3 border-b border-app-border-base">
          {[
            { key: 'all', label: '全部', color: 'text-app-text-primary' },
            { key: 'critical', label: '紧急', color: 'text-red-400' },
            { key: 'high', label: '高', color: 'text-orange-400' },
            { key: 'medium', label: '中', color: 'text-yellow-400' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-2.5 h-7 text-xs rounded-md transition-colors ${
                filter === f.key ? 'bg-app-bg-surface text-app-text-primary' : 'text-app-text-secondary hover:text-app-text-primary'
              }`}
            >
              {f.label}
              {counts[f.key as keyof typeof counts] > 0 && (
                <span className="ml-1.5 text-[10px] text-app-text-muted">{counts[f.key as keyof typeof counts]}</span>
              )}
            </button>
          ))}
          <button
            onClick={handleDemoDispatch}
            className="ml-auto px-2 h-7 text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md hover:bg-cyan-500/30 transition-colors flex items-center gap-1"
            title="演示：派发一个示例待办，触发事件总线"
          >
            <Zap className="w-2.5 h-2.5" />
            演示派发
          </button>
        </div>

        {/* 待办列表 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-10 h-10 mx-auto text-app-text-muted mb-2" />
              <p className="text-sm text-app-text-muted">该优先级暂无待办</p>
            </div>
          ) : (
            filtered.map((t) => {
              const sev =
                t.severity === 'critical'
                  ? { bg: 'bg-red-500/15', text: 'text-red-400', label: '紧急' }
                  : t.severity === 'high'
                  ? { bg: 'bg-orange-500/15', text: 'text-orange-400', label: '高' }
                  : { bg: 'bg-yellow-500/15', text: 'text-yellow-400', label: '中' };
              return (
                <div
                  key={t.id}
                  className="p-3 bg-app-bg-deep border border-app-border-base rounded-lg hover:border-app-text-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedTodo(t)}
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${sev.bg} ${sev.text} flex-shrink-0`}>{sev.label}</span>
                    <span className="text-[10px] text-app-text-muted">{t.source}</span>
                    <span className="ml-auto text-[10px] text-app-text-muted font-mono">{t.id}</span>
                  </div>
                  <p className="text-sm text-app-text-primary leading-snug">{t.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-app-text-muted flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(t.createdAt).toLocaleString('zh-CN', { hour12: false })}
                    </p>
                    <ChevronRight className="w-3 h-3 text-app-text-muted" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 详情弹窗 */}
        {selectedTodo && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedTodo(null)}>
            <div
              className="bg-app-bg-card border border-app-border-base rounded-xl p-5 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-app-text-primary mb-2">{selectedTodo.title}</h3>
              <p className="text-xs text-app-text-muted mb-4">来源: {selectedTodo.source}</p>
              <div className="space-y-2">
                <button
                  onClick={() => handleStart(selectedTodo)}
                  className="w-full flex items-center gap-2 px-3 h-9 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm rounded-lg transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  开始处理（跳到对应模块）
                </button>
                <button
                  onClick={() => handleComplete(selectedTodo)}
                  className="w-full flex items-center gap-2 px-3 h-9 bg-green-500/20 text-green-400 border border-green-500/30 text-sm rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  标记完成（派发完成事件）
                </button>
                <button
                  onClick={() => setSelectedTodo(null)}
                  className="w-full px-3 h-9 text-app-text-secondary text-sm rounded-lg hover:bg-app-bg-surface transition-colors"
                >
                  取消
                </button>
              </div>
              <p className="text-[10px] text-app-text-muted mt-3 leading-relaxed flex items-start gap-1">
                <AlertCircle className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" />
                点击"开始处理"会跳到自动运营模块；点击"标记完成"会派发 todo.completed 事件，事件总线将推进相关业务流。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoCenter;
