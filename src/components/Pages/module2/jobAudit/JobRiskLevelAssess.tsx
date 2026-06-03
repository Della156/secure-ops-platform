'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskRule {
  id: string;
  name: string;
  factor: string;
  weight: number;
  threshold: number;
  enabled: boolean;
}

interface JobRisk {
  id: string;
  name: string;
  type: string;
  applicant: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: { name: string; score: number; weight: number }[];
}

const mockRiskRules: RiskRule[] = [
  { id: 'RULE-001', name: '操作类型风险', factor: '涉及核心系统', weight: 30, threshold: 80, enabled: true },
  { id: 'RULE-002', name: '时间窗口风险', factor: '非工作时间', weight: 25, threshold: 70, enabled: true },
  { id: 'RULE-003', name: '影响范围风险', factor: '影响设备数', weight: 25, threshold: 60, enabled: true },
  { id: 'RULE-004', name: '历史记录风险', factor: '失败率', weight: 20, threshold: 50, enabled: false },
];

const mockJobs: JobRisk[] = [
  { id: 'JOB-001', name: '数据库备份作业', type: '备份', applicant: '张三', riskScore: 25, riskLevel: 'low', factors: [{ name: '操作类型', score: 10, weight: 30 }, { name: '时间窗口', score: 5, weight: 25 }, { name: '影响范围', score: 8, weight: 25 }, { name: '历史记录', score: 2, weight: 20 }] },
  { id: 'JOB-002', name: '系统升级作业', type: '升级', applicant: '李四', riskScore: 72, riskLevel: 'high', factors: [{ name: '操作类型', score: 28, weight: 30 }, { name: '时间窗口', score: 18, weight: 25 }, { name: '影响范围', score: 20, weight: 25 }, { name: '历史记录', score: 6, weight: 20 }] },
  { id: 'JOB-003', name: '配置变更作业', type: '配置', applicant: '王五', riskScore: 55, riskLevel: 'medium', factors: [{ name: '操作类型', score: 15, weight: 30 }, { name: '时间窗口', score: 15, weight: 25 }, { name: '影响范围', score: 20, weight: 25 }, { name: '历史记录', score: 5, weight: 20 }] },
];

const riskDistribution = [
  { name: '低风险', value: 45, color: '#10B981' },
  { name: '中风险', value: 30, color: '#F59E0B' },
  { name: '高风险', value: 18, color: '#EF4444' },
  { name: '严重风险', value: 7, color: '#7C3AED' },
];

export function JobRiskLevelAssess() {
  const [rules] = useState(mockRiskRules);
  const [jobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<JobRisk | null>(mockJobs[0]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'critical': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return '低风险';
      case 'medium': return '中风险';
      case 'high': return '高风险';
      case 'critical': return '严重风险';
      default: return level;
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low': return <ShieldCheck className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <ShieldAlert className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 60) return 'text-yellow-400';
    if (score < 80) return 'text-red-400';
    return 'text-purple-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业风险等级判定</h2>
        <p className="text-sm text-gray-400 mt-1">风险自动判定、等级规则配置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {riskDistribution.map((item, index) => (
              <div key={index} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-400">{item.name}</span>
                </div>
                <p className="text-xl font-semibold text-white">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">风险分布</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value">
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">作业风险列表</h3>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedJob?.id === job.id 
                      ? 'bg-blue-600/20 border-blue-500/50' 
                      : 'bg-[#111827] border-[#2A354D] hover:bg-[#2A354D]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{job.id}</span>
                      <span className="text-white font-medium">{job.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(job.riskLevel)}`}>
                        {getRiskLevelText(job.riskLevel)}
                      </span>
                      <span className={`text-lg font-semibold ${getScoreColor(job.riskScore)}`}>{job.riskScore}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    类型: {job.type} | 申请人: {job.applicant}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedJob && (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-4">风险因子分析</h3>
              <div className="space-y-3">
                {selectedJob.factors.map((factor, index) => (
                  <div key={index} className="bg-[#111827] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{factor.name}</span>
                      <span className={`text-sm font-medium ${getScoreColor(factor.score)}`}>{factor.score}分</span>
                    </div>
                    <div className="h-2 bg-[#2A354D] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${factor.score}%`,
                          backgroundColor: factor.score < 30 ? '#10B981' : factor.score < 60 ? '#F59E0B' : factor.score < 80 ? '#EF4444' : '#7C3AED',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">权重 {factor.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              风险规则配置
            </h3>
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-[#111827] border border-[#2A354D] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">{rule.name}</span>
                    <span className="text-xs text-gray-500">权重: {rule.weight}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{rule.factor}</div>
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
        </div>
      </div>
    </div>
  );
}