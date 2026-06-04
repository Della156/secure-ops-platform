'use client';

import React from 'react';
import { ModuleWorkbench } from '@/components/Pages/_shared/ModuleWorkbench';
import { Wrench, Activity, Shield, Database, AlertTriangle, FileCheck } from 'lucide-react';

/**
 * 模块 2 - 网络安全自动运维（工作台）
 * 业务流程：异常检测 → 智能诊断 → 策略执行 → 修复验证 → 报告归档
 */
export function Module2Workbench() {
  return (
    <ModuleWorkbench
      moduleId="menu-2"
      title="网络安全自动运维"
      subtitle="238 个运维场景 · 业务流：异常检测 → 智能诊断 → 策略执行 → 修复验证 → 报告归档"
      accentColor="#00C853"
      kpis={[
        { label: '运维场景', value: 238, unit: '类', trend: 'up', delta: 5, color: '#00C853', icon: Wrench },
        { label: '自动化率', value: '96.8', unit: '%', trend: 'up', delta: 1.2, color: '#22C55E', icon: Activity },
        { label: '执行中', value: 18, unit: '任务', trend: 'stable', delta: 0, color: '#0066FF', icon: Shield },
        { label: '今日告警', value: 7, unit: '条', trend: 'down', delta: -3, color: '#FF9100', icon: AlertTriangle },
      ]}
      flow={[
        { key: 'detect', label: '异常检测', count: 1248, status: 'completed', linkMenuId: 'menu-2-7-1' },
        { key: 'diagnose', label: '智能诊断', count: 18, status: 'active', linkMenuId: 'menu-2-7-2' },
        { key: 'execute', label: '策略执行', count: 12, status: 'active', linkMenuId: 'menu-2-7-3' },
        { key: 'verify', label: '修复验证', count: 8, status: 'pending', linkMenuId: 'menu-2-7-4' },
        { key: 'archive', label: '报告归档', count: 96, status: 'pending', linkMenuId: 'menu-2-7-5' },
      ]}
      trend={[
        { day: '5/29', value: 120 },
        { day: '5/30', value: 145 },
        { day: '5/31', value: 168 },
        { day: '6/1', value: 142 },
        { day: '6/2', value: 178 },
        { day: '6/3', value: 198 },
        { day: '6/4', value: 185 },
      ]}
      quickEntries={[
        { label: '防火墙策略', menuId: 'menu-2-7-1', icon: Shield, desc: '运维工单' },
        { label: '网络诊断', menuId: 'menu-2-7-2', icon: Activity, desc: '智能诊断' },
        { label: '基线管理', menuId: 'menu-2-3-1', icon: Database, desc: 'OS 基线' },
        { label: '质量评估', menuId: 'menu-2-30-1', icon: FileCheck, desc: '作业辅助' },
      ]}
    />
  );
}

export default Module2Workbench;
