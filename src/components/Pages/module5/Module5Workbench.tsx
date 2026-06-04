'use client';

import React from 'react';
import { ModuleWorkbench } from '@/components/Pages/_shared/ModuleWorkbench';
import { Users, MessageSquare, ClipboardCheck, AlertOctagon, Workflow, UserCheck } from 'lucide-react';

/**
 * 模块 5 - 网络安全人机协同工作台（工作台）
 * 业务流程：告警推送 → 人工认领 → 协同研判 → 决策审批 → 结果归档
 */
export function Module5Workbench() {
  return (
    <ModuleWorkbench
      moduleId="menu-5"
      title="网络安全人机协同工作台"
      subtitle="40 个工作台 · 业务流：告警推送 → 人工认领 → 协同研判 → 决策审批 → 结果归档"
      accentColor="#06B6D4"
      kpis={[
        { label: '工作台', value: 40, unit: '个', trend: 'stable', delta: 0, color: '#06B6D4', icon: Workflow },
        { label: '今日协同', value: 45, unit: '次', trend: 'up', delta: 8, color: '#3B82F6', icon: Users },
        { label: '待认领', value: 6, unit: '条', trend: 'up', delta: 2, color: '#FF9100', icon: MessageSquare },
        { label: '待审批', value: 3, unit: '条', trend: 'down', delta: -1, color: '#A855F7', icon: ClipboardCheck },
      ]}
      flow={[
        { key: 'push', label: '告警推送', count: 45, status: 'completed', linkMenuId: 'menu-5-1-1' },
        { key: 'claim', label: '人工认领', count: 6, status: 'active', linkMenuId: 'menu-5-2-1' },
        { key: 'collab', label: '协同研判', count: 4, status: 'active', linkMenuId: 'menu-5-3-1' },
        { key: 'approve', label: '决策审批', count: 3, status: 'pending', linkMenuId: 'menu-5-4-1' },
        { key: 'archive', label: '结果归档', count: 38, status: 'pending', linkMenuId: 'menu-5-5-1' },
      ]}
      trend={[
        { day: '5/29', value: 32 },
        { day: '5/30', value: 28 },
        { day: '5/31', value: 42 },
        { day: '6/1', value: 35 },
        { day: '6/2', value: 38 },
        { day: '6/3', value: 48 },
        { day: '6/4', value: 45 },
      ]}
      quickEntries={[
        { label: '工作台驾驶舱', menuId: 'menu-5-1-1', icon: Workflow, desc: '协同总览' },
        { label: '告警认领', menuId: 'menu-5-2-1', icon: AlertOctagon, desc: '待办认领' },
        { label: '研判协作', menuId: 'menu-5-3-1', icon: Users, desc: '群组讨论' },
        { label: '决策审批', menuId: 'menu-5-4-1', icon: UserCheck, desc: '审批流' },
      ]}
    />
  );
}

export default Module5Workbench;
