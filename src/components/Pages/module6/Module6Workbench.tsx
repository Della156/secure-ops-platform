'use client';

import React from 'react';
import { ModuleWorkbench } from '@/components/Pages/_shared/ModuleWorkbench';
import { Settings, KeyRound, Users, Database, Shield, Cpu } from 'lucide-react';

/**
 * 模块 6 - 运维配置中心（工作台）
 * 业务流程：配置变更 → 权限审批 → 灰度发布 → 监控告警 → 归档审计
 */
export function Module6Workbench() {
  return (
    <ModuleWorkbench
      moduleId="menu-6"
      title="运维配置中心"
      subtitle="57 个配置项 · 业务流：配置变更 → 权限审批 → 灰度发布 → 监控告警 → 归档审计"
      accentColor="#F472B6"
      kpis={[
        { label: '配置项', value: 57, unit: '个', trend: 'up', delta: 2, color: '#F472B6', icon: Settings },
        { label: '用户账号', value: 1284, unit: '个', trend: 'stable', delta: 0, color: '#3B82F6', icon: Users },
        { label: '凭据数', value: 86, unit: '个', trend: 'stable', delta: 0, color: '#A855F7', icon: KeyRound },
        { label: '巡检通过', value: '100', unit: '%', trend: 'stable', delta: 0, color: '#22C55E', icon: Shield },
      ]}
      flow={[
        { key: 'change', label: '配置变更', count: 18, status: 'active', linkMenuId: 'menu-6-1-1' },
        { key: 'approve', label: '权限审批', count: 6, status: 'active', linkMenuId: 'menu-6-2-1' },
        { key: 'gray', label: '灰度发布', count: 4, status: 'pending', linkMenuId: 'menu-6-3-1' },
        { key: 'monitor', label: '监控告警', count: 12, status: 'completed', linkMenuId: 'menu-6-4-1' },
        { key: 'audit', label: '归档审计', count: 96, status: 'completed', linkMenuId: 'menu-6-5-1' },
      ]}
      trend={[
        { day: '5/29', value: 12 },
        { day: '5/30', value: 8 },
        { day: '5/31', value: 15 },
        { day: '6/1', value: 10 },
        { day: '6/2', value: 14 },
        { day: '6/3', value: 18 },
        { day: '6/4', value: 12 },
      ]}
      quickEntries={[
        { label: '账号管理', menuId: 'menu-6-1-1', icon: Users, desc: '用户/角色' },
        { label: '凭据管理', menuId: 'menu-6-2-1', icon: KeyRound, desc: '密钥托管' },
        { label: '资源台账', menuId: 'menu-6-3-1', icon: Database, desc: '资源清单' },
        { label: '智能体配置', menuId: 'menu-6-4-1', icon: Cpu, desc: 'AI 智能体' },
      ]}
    />
  );
}

export default Module6Workbench;
