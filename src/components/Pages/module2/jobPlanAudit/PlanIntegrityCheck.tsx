'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, ListChecks, RefreshCw } from 'lucide-react';

interface IntegrityItem {
  id: string;
  itemName: string;
  category: string;
  required: boolean;
  status: 'complete' | 'missing' | 'partial';
  description: string;
}

interface PlanInfo {
  id: string;
  name: string;
}

const mockPlans: PlanInfo[] = [
  { id: 'JPA-001', name: '系统补丁升级方案' },
  { id: 'JPA-002', name: '网络架构优化方案' },
  { id: 'JPA-003', name: '数据库迁移方案' },
];

const mockItems: IntegrityItem[] = [
  { id: 'ITEM-001', itemName: '方案概述', category: '基础信息', required: true, status: 'complete', description: '方案的目的、范围、背景介绍' },
  { id: 'ITEM-002', itemName: '实施方案', category: '执行计划', required: true, status: 'complete', description: '具体的实施步骤和时间安排' },
  { id: 'ITEM-003', itemName: '风险评估报告', category: '风险管控', required: true, status: 'missing', description: '潜在风险分析和应对措施' },
  { id: 'ITEM-004', itemName: '回滚方案', category: '风险管控', required: true, status: 'partial', description: '失败时的回滚策略' },
  { id: 'ITEM-005', itemName: '测试计划', category: '质量保障', required: true, status: 'complete', description: '测试范围和验收标准' },
  { id: 'ITEM-006', itemName: '资源需求清单', category: '资源保障', required: false, status: 'missing', description: '所需的人员、设备、软件等资源' },
  { id: 'ITEM-007', itemName: '审批流程', category: '流程管理', required: true, status: 'complete', description: '审批节点和责任人' },
  { id: 'ITEM-008', itemName: '应急预案', category: '风险管控', required: true, status: 'missing', description: '突发情况的处理预案' },
];

export function PlanIntegrityCheck() {
  const [selectedPlan, setSelectedPlan] = useState(mockPlans[0]);
  const [items, setItems] = useState(mockItems);
  const [isChecking, setIsChecking] = useState(false);

  const stats = {
    total: items.length,
    required: items.filter(i => i.required).length,
    complete: items.filter(i => i.status === 'complete').length,
    missing: items.filter(i => i.status === 'missing').length,
    partial: items.filter(i => i.status === 'partial').length,
    requiredComplete: items.filter(i => i.required && i.status === 'complete').length,
  };

  const runIntegrityCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'complete') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'missing') return <XCircle className="w-5 h-5 text-red-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusText = (status: string) => {
    if (status === 'complete') return '已完整';
    if (status === 'missing') return '缺失';
    return '部分完整';
  };

  const getStatusColor = (status: string) => {
    if (status === 'complete') return 'border-green-500/30 bg-green-500/5';
    if (status === 'missing') return 'border-red-500/30 bg-red-500/5';
    return 'border-yellow-500/30 bg-yellow-500/5';
  };

  const progress = Math.round((stats.complete / stats.total) * 100);
  const requiredProgress = Math.round((stats.requiredComplete / stats.required) * 100);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业方案完整性审核</h2>
        <p className="text-sm text-gray-400 mt-1">作业方案完整性检查、缺失项提示</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">选择方案：</label>
            <select
              value={selectedPlan.id}
              onChange={(e) => setSelectedPlan(mockPlans.find(p => p.id === e.target.value)!)}
              className="px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mockPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={runIntegrityCheck}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ListChecks className="w-4 h-4" />}
            {isChecking ? '检查中...' : '执行完整性检查'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">整体完整性</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>完整度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-400">{stats.complete}</p>
              <p className="text-xs text-gray-400">已完整</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-yellow-400">{stats.partial}</p>
              <p className="text-xs text-gray-400">部分完整</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-red-400">{stats.missing}</p>
              <p className="text-xs text-gray-400">缺失</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">必填项完整性</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>完整度</span>
              <span>{requiredProgress}%</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-3">
              <div className={`h-3 rounded-full transition-all ${requiredProgress === 100 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${requiredProgress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-white">{stats.required}</p>
              <p className="text-xs text-gray-400">必填项总数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-400">{stats.requiredComplete}</p>
              <p className="text-xs text-gray-400">已完成必填项</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 ${getStatusColor(item.status)}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{item.itemName}</span>
                    {item.required && <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">必填</span>}
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">{item.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                item.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                item.status === 'missing' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {getStatusText(item.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}