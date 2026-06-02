'use client';

import React from 'react';
import { Construction, FileText, Clock, Hash } from 'lucide-react';
import { menuData } from '@/data/menuData';

/**
 * 通用占位页面
 *
 * 用于 menuData 中已定义、但 pageRegistry 暂未注册深度实现的页面。
 * 业务深度实现将后续按优先级逐个补充（每个模块业务特性不同）。
 *
 * 设计原则（已与用户确认）：
 * 1. 骨架优先：先确保所有菜单可访问，避免"开发中"白屏
 * 2. 复用优先：71 个页面共享 1 个组件
 * 3. 渐进增强：后续按 menuId 单独写深度实现
 */

function findMenuPath(menuId: string): { title: string; parentTitle: string; group: string } {
  for (const lv1 of menuData) {
    if (lv1.id === menuId) {
      return { title: lv1.label, parentTitle: '', group: lv1.label };
    }
    if (lv1.children) {
      for (const lv2 of lv1.children) {
        if (lv2.id === menuId) {
          return { title: lv2.label, parentTitle: lv1.label, group: lv2.label };
        }
        if (lv2.children) {
          const lv3 = lv2.children.find((c) => c.id === menuId);
          if (lv3) {
            return { title: lv3.label, parentTitle: lv2.label, group: lv1.label };
          }
        }
      }
    }
  }
  return { title: menuId, parentTitle: '', group: '' };
}

export interface GenericStubProps {
  menuId: string;
  /** 可选：覆盖菜单中的标题 */
  title?: string;
  /** 可选：业务上下文提示 */
  hint?: string;
}

export function GenericStub({ menuId, title, hint }: GenericStubProps) {
  const { title: defaultTitle, parentTitle, group } = findMenuPath(menuId);
  const displayTitle = title || defaultTitle;
  const fullBreadcrumb = parentTitle ? `${group} / ${parentTitle} / ${displayTitle}` : displayTitle;

  return (
    <div className="space-y-4">
      {/* 标题区 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <FileText className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white">{displayTitle}</h2>
            {parentTitle && (
              <p className="text-sm text-gray-400 mt-1 truncate">{fullBreadcrumb}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {menuId}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                占位页面
              </span>
            </div>
          </div>
        </div>

        {hint && (
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">{hint}</p>
        )}

        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-yellow-500/5 border border-yellow-500/20 rounded-md">
          <Construction className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-yellow-200/80">
            此页面为通用占位，业务功能将在后续迭代中按优先级实现。
          </p>
        </div>
      </div>
    </div>
  );
}
