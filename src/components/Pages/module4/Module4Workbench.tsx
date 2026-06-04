'use client';

import React from 'react';
import { ModuleWorkbench } from '@/components/Pages/_shared/ModuleWorkbench';
import { ShieldCheck, Bug, Target, Database, FileCheck2, Layers } from 'lucide-react';

/**
 * 模块 4 - 网络安全标准场景自动化（工作台）
 * 业务流程：场景选择 → 资产准备 → 工具调度 → 任务执行 → 结果验证
 */
export function Module4Workbench() {
  return (
    <ModuleWorkbench
      moduleId="menu-4"
      title="网络安全标准场景自动化"
      subtitle="94 个标准场景 · 业务流：场景选择 → 资产准备 → 工具调度 → 任务执行 → 结果验证"
      accentColor="#A855F7"
      kpis={[
        { label: '标准场景', value: 94, unit: '个', trend: 'up', delta: 2, color: '#A855F7', icon: Layers },
        { label: '扫描覆盖率', value: '92.1', unit: '%', trend: 'up', delta: 1.5, color: '#22C55E', icon: ShieldCheck },
        { label: '本月漏洞', value: 128, unit: '个', trend: 'up', delta: 23, color: '#F97316', icon: Bug },
        { label: '基线合规率', value: '88.6', unit: '%', trend: 'stable', delta: 0.2, color: '#3B82F6', icon: FileCheck2 },
      ]}
      flow={[
        { key: 'select', label: '场景选择', count: 94, status: 'completed', linkMenuId: 'menu-4-1-1' },
        { key: 'prepare', label: '资产准备', count: 1284, status: 'completed', linkMenuId: 'menu-4-2-1' },
        { key: 'dispatch', label: '工具调度', count: 18, status: 'active', linkMenuId: 'menu-4-3-1' },
        { key: 'execute', label: '任务执行', count: 12, status: 'active', linkMenuId: 'menu-4-4-1' },
        { key: 'verify', label: '结果验证', count: 8, status: 'pending', linkMenuId: 'menu-4-5-1' },
      ]}
      trend={[
        { day: '5/29', value: 88 },
        { day: '5/30', value: 92 },
        { day: '5/31', value: 85 },
        { day: '6/1', value: 90 },
        { day: '6/2', value: 93 },
        { day: '6/3', value: 95 },
        { day: '6/4', value: 92 },
      ]}
      quickEntries={[
        { label: '漏洞管理', menuId: 'menu-4-6-1', icon: Bug, desc: '漏洞闭环' },
        { label: '基线管理', menuId: 'menu-4-7-1', icon: ShieldCheck, desc: '等保 2.0' },
        { label: '补丁管理', menuId: 'menu-4-8-1', icon: Database, desc: '补丁闭环' },
        { label: '渗透测试', menuId: 'menu-4-10-1', icon: Target, desc: '红蓝攻防' },
      ]}
    />
  );
}

export default Module4Workbench;
