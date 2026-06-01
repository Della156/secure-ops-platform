'use client';

import { useSystem } from '@/contexts/SystemContext';
import { menuData } from '@/data/menuData';
import { PageRouter } from '@/components/Pages/PageRouter';

export function PageContent() {
  const { activeMenu } = useSystem();

  // 检查是否是模块1的三级菜单
  const isModule1ThirdLevelMenu = () => {
    for (const item of menuData) {
      if (item.id === 'menu-1' && item.children) {
        for (const sub of item.children) {
          if (sub.children) {
            const third = sub.children.find((t) => t.id === activeMenu);
            if (third) return true;
          }
        }
      }
    }
    return false;
  };

  // 如果是模块1的三级菜单，使用PageRouter
  if (isModule1ThirdLevelMenu()) {
    return <PageRouter />;
  }

  // 否则显示默认页面
  return <DefaultPage />;
}

function DefaultPage() {
  const { activeMenu, highPriorityTodos, riskScore } = useSystem();

  const getMenuTitle = () => {
    for (const item of menuData) {
      if (item.id === activeMenu) return item.label;
      if (item.children) {
        const child = item.children.find((c) => c.id === activeMenu);
        if (child) return child.label;
        for (const sub of item.children) {
          if (sub.children) {
            const third = sub.children.find((t) => t.id === activeMenu);
            if (third) return `${sub.label} / ${third.label}`;
          }
        }
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
        for (const sub of item.children) {
          if (sub.children) {
            const third = sub.children.find((t) => t.id === activeMenu);
            if (third) return `三级菜单：${third.label}`;
          }
        }
      }
    }
    return '网络安全智能化运维平台';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{getMenuTitle()}</h1>
        <p className="text-slate-400">{getPageDescription()}</p>
      </div>

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
          </div>
          <p className="text-3xl font-bold text-white">1,284</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">今日执行</span>
          </div>
          <p className="text-3xl font-bold text-white">98.5%</p>
        </div>
      </div>
    </div>
  );
}
