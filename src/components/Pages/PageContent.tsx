'use client';

import { useSystem } from '@/contexts/SystemContext';
import { menuData } from '@/data/menuData';
import { AlertTriangle, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  high: { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  medium: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
};

export function PageContent() {
  const { activeMenu, highPriorityTodos, riskScore } = useSystem();

  const getMenuTitle = () => {
    for (const item of menuData) {
      if (item.id === activeMenu) return item.label;
      if (item.children) {
        const child = item.children.find((c) => c.id === activeMenu);
        if (child) return child.label;
      }
    }
    return '首页';
  };

  const getPageDescription = () => {
    for (const item of menuData) {
      if (item.id === activeMenu) {
        if (item.children) return `${item.label} — 包含 ${item.children.length} 个子模块`;
        return item.label;
      }
      if (item.children) {
        const child = item.children.find((c) => c.id === activeMenu);
        if (child) return `二级菜单：${child.label}`;
      }
    }
    return '网络安全智能化运维平台';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{getMenuTitle()}</h1>
        <p className="text-slate-400">{getPageDescription()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">系统风险评分</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              riskScore > 90 ? 'bg-red-500/20 text-red-400' :
              riskScore > 75 ? 'bg-orange-500/20 text-orange-400' :
              'bg-emerald-500/20 text-emerald-400'
            }`}>
              {riskScore > 75 ? '关注' : '正常'}
            </span>
          </div>
          <p className={`text-3xl font-bold ${
            riskScore > 90 ? 'text-red-400' :
            riskScore > 75 ? 'text-orange-400' :
            'text-emerald-400'
          }`}>
            {riskScore}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">高危待办</span>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
              {highPriorityTodos.length} 项
            </span>
          </div>
          <p className="text-3xl font-bold text-red-400">{highPriorityTodos.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">自动化任务</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">1,284</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">今日执行</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">98.5%</p>
        </div>
      </div>

      {/* High Priority Todos */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          高危待办任务
        </h2>
        <div className="space-y-3">
          {highPriorityTodos.map((todo) => {
            const config = severityConfig[todo.severity];
            const Icon = config.icon;
            return (
              <div
                key={todo.id}
                className={`flex items-center gap-4 p-4 rounded-lg ${config.bg} border ${config.border}`}
              >
                <Icon className={`w-5 h-5 ${config.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${config.color}`}>{todo.title}</p>
                  <p className="text-sm text-slate-400">
                    来源：{todo.source} · {todo.createdAt}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.color}`}>
                  {todo.severity === 'critical' ? '紧急' : todo.severity === 'high' ? '高' : '中'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Placeholder */}
      <div className="mt-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
        <p className="text-slate-500 text-lg">
          当前页面：{getMenuTitle()}
        </p>
        <p className="text-slate-600 text-sm mt-2">
          页面内容占位区域 — 后续根据具体需求开发
        </p>
      </div>
    </div>
  );
}