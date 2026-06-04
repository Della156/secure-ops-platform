'use client';

import { useSystem } from '@/contexts/SystemContext';
import { menuData } from '@/data/menuData';
import { getPageComponent } from '@/data/pageRegistry';
import { PageShell } from '@/components/PageShell';
import { Skeleton } from '@/components/Common/Skeleton';

// 菜单信息查找工具
function findMenuInfo(menuId: string) {
  for (const item of menuData) {
    // 一级菜单
    if (item.id === menuId) {
      return { title: item.label, breadcrumb: [{ label: item.label }] };
    }
    // 二级菜单
    if (item.children) {
      for (const sub of item.children) {
        if (sub.id === menuId) {
          return {
            title: sub.label,
            breadcrumb: [
              { label: item.label },
              { label: sub.label },
            ],
          };
        }
        // 三级菜单
        if (sub.children) {
          const third = sub.children.find((t) => t.id === menuId);
          if (third) {
            return {
              title: third.label,
              breadcrumb: [
                { label: item.label },
                { label: sub.label },
                { label: third.label },
              ],
            };
          }
        }
      }
    }
  }
  return { title: '首页', breadcrumb: [] };
}

/**
 * PageContent 组件
 * 
 * 统一页面渲染入口：
 * - 根据 activeMenu 查找对应页面组件
 * - 包裹统一的 PageShell（含面包屑、标题、描述）
 * - 未注册的页面显示占位内容（含风险卡片）
 */
export function PageContent() {
  const { activeMenu } = useSystem();

  // 尝试从注册表获取页面组件
  const PageComponent = getPageComponent(activeMenu);
  const { title, breadcrumb } = findMenuInfo(activeMenu);

  // 首页仪表盘特殊处理（全屏，无 PageShell 包裹）
  if (activeMenu === 'dashboard') {
    return <PageComponent />;
  }

  // 如果页面已注册（不是默认占位页），使用 PageShell 包裹渲染
  // 判断标准：组件不在 DefaultPlaceholder 中显示（即有具体的页面组件）
  if (PageComponent !== DefaultPlaceholder) {
    return (
      <PageShell title={title} breadcrumb={breadcrumb}>
        <PageComponent />
      </PageShell>
    );
  }

  // 未注册页面 / 首页 → 显示默认占位（含风险卡片）
  return <DefaultPlaceholder />;
}

/**
 * 默认首页占位（含风险评分卡片）
 */
function DefaultPlaceholder() {
  const { activeMenu, highPriorityTodos, riskScore } = useSystem();

  const getMenuTitle = () => {
    const info = findMenuInfo(activeMenu);
    return info.title;
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
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">{getMenuTitle()}</h1>
        <p className="text-[#9CA3AF]">{getPageDescription()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9CA3AF] text-sm">安全风险评分</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              riskScore >= 70 ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
              riskScore >= 40 ? 'bg-[#FF9100]/20 text-[#FF9100]' :
              'bg-[#00C853]/20 text-[#00C853]'
            }`}>
              {riskScore >= 70 ? '高危' : riskScore >= 40 ? '中危' : '低危'}
            </span>
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">{riskScore}</p>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9CA3AF] text-sm">高危待办</span>
            <span className="bg-[#FF3B30]/20 text-[#FF3B30] text-xs px-2 py-1 rounded-full">
              {highPriorityTodos.length} 项
            </span>
          </div>
          <p className="text-3xl font-bold text-[#FF3B30]">{highPriorityTodos.length}</p>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9CA3AF] text-sm">自动化任务</span>
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">1,284</p>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9CA3AF] text-sm">今日执行</span>
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">98.5%</p>
        </div>
      </div>
    </div>
  );
}
