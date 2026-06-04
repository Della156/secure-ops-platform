'use client';

import React from 'react';
import { ModuleWorkbench } from '@/components/Pages/_shared/ModuleWorkbench';
import { Terminal, Activity, Zap, Users, Box, Server } from 'lucide-react';

/**
 * 模块 1 - 网络安全自动任务配置（工作台）
 * 业务流程：任务接入 → 任务编排 → 任务执行 → 任务监控 → 任务报告
 */
export function Module1Workbench() {
  return (
    <ModuleWorkbench
      moduleId="menu-1"
      title="网络安全自动任务配置"
      subtitle="53 个任务类型 · 业务流：任务接入 → 编排 → 执行 → 监控 → 报告"
      accentColor="#0066FF"
      kpis={[
        { label: '已注册任务', value: 53, unit: '类', trend: 'up', delta: 3, color: '#0066FF', icon: Terminal },
        { label: '今日执行', value: 1284, unit: '次', trend: 'up', delta: 12, color: '#00C853', icon: Activity },
        { label: '任务成功率', value: '98.5', unit: '%', trend: 'stable', delta: 0, color: '#22C55E', icon: Zap },
        { label: '调度引擎', value: 3, unit: '集群', trend: 'stable', delta: 0, color: '#A855F7', icon: Server },
      ]}
      flow={[
        { key: 'register', label: '任务接入', count: 53, status: 'completed', linkMenuId: 'menu-1-1-1' },
        { key: 'repo', label: '仓库管理', count: 48, status: 'completed', linkMenuId: 'menu-1-2-1' },
        { key: 'orchestrate', label: '流程编排', count: 32, status: 'active', linkMenuId: 'menu-1-5-1' },
        { key: 'execute', label: '执行监控', count: 12, status: 'active', linkMenuId: 'menu-1-3-3' },
        { key: 'report', label: '任务报告', count: 8, status: 'pending', linkMenuId: 'menu-1-3-6' },
      ]}
      trend={[
        { day: '5/29', value: 980 },
        { day: '5/30', value: 1050 },
        { day: '5/31', value: 1180 },
        { day: '6/1', value: 1100 },
        { day: '6/2', value: 1220 },
        { day: '6/3', value: 1310 },
        { day: '6/4', value: 1284 },
      ]}
      quickEntries={[
        { label: '任务接入管理', menuId: 'menu-1-1-1', icon: Box, desc: '管理自动化任务' },
        { label: '任务编排', menuId: 'menu-1-5-1', icon: Terminal, desc: '可视化编排' },
        { label: '运行监控', menuId: 'menu-1-3-3', icon: Activity, desc: '实时监控' },
        { label: '资源管理', menuId: 'menu-1-7-1', icon: Server, desc: '主机/终端' },
      ]}
    />
  );
}

export default Module1Workbench;
