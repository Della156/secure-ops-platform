'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Settings, Zap, Shield, Play, RotateCcw } from 'lucide-react';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface PendingJob {
  id: string;
  name: string;
  applicant: string;
  applyTime: string;
  complianceCheck: { passed: boolean; issues: string[] };
  ruleMatches: string[];
}

const mockRules: ComplianceRule[] = [
  { id: 'RULE-001', name: '工作时间限制', description: '非工作时间作业需额外审批', enabled: true, priority: 'high' },
  { id: 'RULE-002', name: '风险等级匹配', description: '高风险作业需高级别权限', enabled: true, priority: 'high' },
  { id: 'RULE-003', name: '资质验证', description: '操作人需具备相应资质', enabled: true, priority: 'medium' },
  { id: 'RULE-004', name: '变更窗口检查', description: '检查是否在允许的变更窗口内', enabled: false, priority: 'low' },
];

const mockPendingJobs: PendingJob[] = [
  {
    id: 'AUD-001',
    name: '数据库备份作业',
    applicant: '张三',
    applyTime: '2026-06-02 10:30:00',
    complianceCheck: { passed: true, issues: [] },
    ruleMatches: ['RULE-001', 'RULE-003'],
  },
  {
    id: 'AUD-002',
    name: '服务器重启作业',
    applicant: '李四',
    applyTime: '2026-06-02 09:15:00',
    complianceCheck: { passed: false, issues: ['非工作时间操作', '缺少应急方案'] },
    ruleMatches: ['RULE-001', 'RULE-002'],
  },
];

export function AutoJobAudit() {
  const [rules] = useState(mockRules);
  const [pendingJobs] = useState(mockPendingJobs);
  const [autoAuditRunning, setAutoAuditRunning] = useState(false);

  const handleRunAutoAudit = () => {
    setAutoAuditRunning(true);
    setTimeout(() => setAutoAuditRunning(false), 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业申请自动审核</h2>
        <p className="text-sm text-gray-400 mt-1">合规性校验、审核规则匹配、审核结论输出</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                自动审核控制
              </h3>
              <button
                onClick={handleRunAutoAudit}
                disabled={autoAuditRunning}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {autoAuditRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {autoAuditRunning ? '审核中...' : '立即自动审核'}
              </button>
            </div>

            <div className="space-y-3">
              {pendingJobs.map((job) => (
                <div key={job.id} className="bg-[#111827] border border-[#2A354D] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-white">{job.name}</h4>
                      <p className="text-xs text-gray-500">申请人: {job.applicant} · {job.applyTime}</p>
                    </div>
                    {job.complianceCheck.passed ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="w-4 h-4" /> 通过
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-xs">
                        <XCircle className="w-4 h-4" /> 不通过
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">匹配规则:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.ruleMatches.map((ruleId) => (
                        <span key={ruleId} className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                          {ruleId}
                        </span>
                      ))}
                    </div>
                  </div>

                  {!job.complianceCheck.passed && job.complianceCheck.issues.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">问题列表:</p>
                      <ul className="space-y-1">
                        {job.complianceCheck.issues.map((issue, i) => (
                          <li key={i} className="flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              审核规则配置
            </h3>
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-[#111827] border border-[#2A354D] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">{rule.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(rule.priority)}`}>
                      {rule.priority === 'high' ? '高' : rule.priority === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{rule.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${rule.enabled ? 'text-green-400' : 'text-gray-500'}`}>
                      {rule.enabled ? '已启用' : '已禁用'}
                    </span>
                    <div className={`w-8 h-4 rounded-full transition-colors ${rule.enabled ? 'bg-blue-600' : 'bg-gray-700'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-4.5' : 'translate-x-0.5'} mt-0.5`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              审核统计
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">今日待审核</span>
                <span className="text-sm font-medium text-white">{pendingJobs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">自动通过</span>
                <span className="text-sm font-medium text-green-400">{pendingJobs.filter(j => j.complianceCheck.passed).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">自动驳回</span>
                <span className="text-sm font-medium text-red-400">{pendingJobs.filter(j => !j.complianceCheck.passed).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
