'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Shield, RefreshCw, Eye } from 'lucide-react';

interface ComplianceRule {
  id: string;
  ruleName: string;
  category: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'warning';
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

const mockRules: ComplianceRule[] = [
  { id: 'RULE-001', ruleName: '方案审批流程合规', category: '流程合规', description: '方案是否按照标准审批流程提交', severity: 'high', status: 'pass' },
  { id: 'RULE-002', ruleName: '变更风险评估完整', category: '风险管控', description: '方案是否包含完整的风险评估报告', severity: 'high', status: 'fail' },
  { id: 'RULE-003', ruleName: '回滚方案明确', category: '风险管控', description: '方案是否包含明确的回滚策略', severity: 'medium', status: 'warning' },
  { id: 'RULE-004', ruleName: '安全措施合规', category: '安全合规', description: '方案是否符合安全规范要求', severity: 'high', status: 'pass' },
  { id: 'RULE-005', ruleName: '测试方案完整', category: '质量保障', description: '方案是否包含充分的测试计划', severity: 'medium', status: 'pass' },
  { id: 'RULE-006', ruleName: '资源需求明确', category: '资源保障', description: '方案是否明确所需资源', severity: 'low', status: 'warning' },
];

export function PlanComplianceCheck() {
  const [selectedPlan, setSelectedPlan] = useState(mockPlans[0]);
  const [rules, setRules] = useState(mockRules);
  const [isChecking, setIsChecking] = useState(false);

  const stats = {
    total: rules.length,
    pass: rules.filter(r => r.status === 'pass').length,
    fail: rules.filter(r => r.status === 'fail').length,
    warning: rules.filter(r => r.status === 'warning').length,
  };

  const runComplianceCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // 模拟随机改变一些状态
      setRules(prev => prev.map(rule => {
        if (Math.random() > 0.7) {
          const newStatus = ['pass', 'fail', 'warning'][Math.floor(Math.random() * 3)] as any;
          return { ...rule, status: newStatus };
        }
        return rule;
      }));
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'pass') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'fail') return <XCircle className="w-5 h-5 text-red-400" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'pass') return 'border-green-500/30 bg-green-500/5';
    if (status === 'fail') return 'border-red-500/30 bg-red-500/5';
    return 'border-yellow-500/30 bg-yellow-500/5';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500/20 text-red-400';
    if (severity === 'medium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业方案合规性校验</h2>
        <p className="text-sm text-gray-400 mt-1">作业方案合规性检查、不合规项提示</p>
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
            onClick={runComplianceCheck}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {isChecking ? '校验中...' : '执行合规性校验'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">规则总数</p>
          <p className="text-xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.pass}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.warning}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">不通过</p>
              <p className="text-xl font-semibold text-red-400">{stats.fail}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 ${getStatusColor(rule.status)}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(rule.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{rule.ruleName}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(rule.severity)}`}>
                      {rule.severity === 'high' ? '高' : rule.severity === 'medium' ? '中' : '低'}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">{rule.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 text-sm rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
                详情
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}