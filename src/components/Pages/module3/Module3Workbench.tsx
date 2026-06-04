'use client';

import React, { useEffect } from 'react';
import { ModuleWorkbench } from '@/components/Pages/_shared/ModuleWorkbench';
import { Shield, AlertTriangle, Bug, FileText, Activity, Crosshair } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';

/**
 * 模块 3 - 网络安全自动运营（工作台）
 * 业务流程：威胁监测 → 研判分析 → 处置响应 → 溯源分析 → 报告生成
 * 演示重点：dispatch 完整业务流转事件
 */
export function Module3Workbench() {
  const { dispatchBusEvent } = useSystem();

  // 模块进入时，自动派发一个完整业务流演示（仅一次）
  useEffect(() => {
    const hasMark = sessionStorage.getItem('module3-demo-fired');
    if (hasMark) return;
    sessionStorage.setItem('module3-demo-fired', '1');

    // 异步派发 5 个事件，模拟告警生命周期
    setTimeout(() => {
      dispatchBusEvent({
        type: 'alert.created',
        source: 'agent',
        bizId: 'ALT-M3-DEMO-001',
        payload: { alertId: 'ALT-M3-DEMO-001', level: 'critical', title: '检测到 APT 攻击链', source: '威胁监测' },
      } as any);
    }, 200);
    setTimeout(() => {
      dispatchBusEvent({
        type: 'agent.dispatched',
        source: 'system',
        bizId: 'ALT-M3-DEMO-001',
        payload: { agentId: 'triage-agent', taskId: 'ALT-M3-DEMO-001', module: 'sampleJudgment' },
      } as any);
    }, 600);
    setTimeout(() => {
      dispatchBusEvent({
        type: 'alert.triaged',
        source: 'agent',
        bizId: 'ALT-M3-DEMO-001',
        payload: { alertId: 'ALT-M3-DEMO-001', conclusion: 'true_positive', confidence: 0.95 },
      } as any);
    }, 1200);
    setTimeout(() => {
      dispatchBusEvent({
        type: 'alert.handled',
        source: 'agent',
        bizId: 'ALT-M3-DEMO-001',
        payload: { alertId: 'ALT-M3-DEMO-001', action: 'isolate_host', operator: 'triage-agent' },
      } as any);
    }, 1800);
    setTimeout(() => {
      dispatchBusEvent({
        type: 'report.generated',
        source: 'system',
        bizId: 'ALT-M3-DEMO-001',
        payload: { reportId: 'REP-M3-001', type: 'incident', findings: 8 },
      } as any);
    }, 2400);
  }, [dispatchBusEvent]);

  return (
    <ModuleWorkbench
      moduleId="menu-3"
      title="网络安全自动运营"
      subtitle="130 个运营策略 · 业务流：威胁监测 → 研判分析 → 处置响应 → 溯源分析 → 报告生成"
      accentColor="#FF9100"
      kpis={[
        { label: '今日告警', value: 86, unit: '条', trend: 'down', delta: -12, color: '#FF9100', icon: AlertTriangle },
        { label: '待研判', value: 7, unit: '条', trend: 'up', delta: 2, color: '#EF4444', icon: Crosshair },
        { label: '已处置', value: 73, unit: '条', trend: 'up', delta: 18, color: '#00C853', icon: Shield },
        { label: 'SLA达成', value: '94.2', unit: '%', trend: 'up', delta: 1.5, color: '#22C55E', icon: Activity },
      ]}
      flow={[
        { key: 'monitor', label: '威胁监测', count: 86, status: 'completed', linkMenuId: 'menu-3-1-1' },
        { key: 'triage', label: '研判分析', count: 7, status: 'active', linkMenuId: 'menu-3-6-1' },
        { key: 'disposal', label: '处置响应', count: 4, status: 'active', linkMenuId: 'menu-3-9-1' },
        { key: 'trace', label: '溯源分析', count: 2, status: 'pending', linkMenuId: 'menu-3-7-1' },
        { key: 'report', label: '报告生成', count: 12, status: 'pending', linkMenuId: 'menu-3-14-1' },
      ]}
      trend={[
        { day: '5/29', value: 92 },
        { day: '5/30', value: 78 },
        { day: '5/31', value: 105 },
        { day: '6/1', value: 88 },
        { day: '6/2', value: 95 },
        { day: '6/3', value: 110 },
        { day: '6/4', value: 86 },
      ]}
      quickEntries={[
        { label: '样本研判驾驶舱', menuId: 'menu-3-6-1', icon: Crosshair, desc: 'AI 研判' },
        { label: '告警监测', menuId: 'menu-3-1-1', icon: AlertTriangle, desc: '实时告警' },
        { label: '病毒处置', menuId: 'menu-3-10-1', icon: Bug, desc: '病毒闭环' },
        { label: '告警日报', menuId: 'menu-3-14-1', icon: FileText, desc: '报告生成' },
      ]}
    />
  );
}

export default Module3Workbench;
