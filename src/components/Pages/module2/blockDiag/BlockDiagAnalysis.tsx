'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, Lightbulb, Target, Users, Server, Database, CheckCircle } from 'lucide-react';

interface BlockLogItem {
  id: string;
  sourceIp: string;
  targetIp: string;
  timestamp: string;
  policyId: string;
  blockReason: string;
  severity: 'high' | 'medium' | 'low';
}

interface PolicyMatch {
  policyId: string;
  policyName: string;
  matchScore: number;
  matchReason: string;
}

interface RootCause {
  category: string;
  description: string;
  confidence: number;
}

interface ImpactAssessment {
  affectedServices: string[];
  affectedUsers: number;
  businessImpact: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

const mockBlockLogs: BlockLogItem[] = [
  { 
    id: 'BLOCK-001', 
    sourceIp: '192.168.1.100', 
    targetIp: '10.0.0.50', 
    timestamp: '2026-06-02 09:15:30', 
    policyId: 'POL-005', 
    blockReason: 'SQL注入尝试', 
    severity: 'high' 
  },
  { 
    id: 'BLOCK-002', 
    sourceIp: '203.0.113.45', 
    targetIp: '10.0.0.55', 
    timestamp: '2026-06-02 09:18:22', 
    policyId: 'POL-012', 
    blockReason: '异常请求频率', 
    severity: 'medium' 
  },
  { 
    id: 'BLOCK-003', 
    sourceIp: '198.51.100.23', 
    targetIp: '10.0.0.60', 
    timestamp: '2026-06-02 09:22:10', 
    policyId: 'POL-008', 
    blockReason: '未授权访问尝试', 
    severity: 'high' 
  },
];

const mockPolicyMatches: PolicyMatch[] = [
  { 
    policyId: 'POL-005', 
    policyName: 'SQL注入防护策略', 
    matchScore: 95, 
    matchReason: '检测到典型SQL注入特征' 
  },
  { 
    policyId: 'POL-012', 
    policyName: '速率限制策略', 
    matchScore: 88, 
    matchReason: '请求频率超过阈值' 
  },
];

const mockRootCauses: RootCause[] = [
  { 
    category: '攻击检测', 
    description: '检测到恶意SQL注入尝试，触发安全策略', 
    confidence: 92 
  },
  { 
    category: '配置问题', 
    description: '部分策略阈值设置可能过严，导致误判', 
    confidence: 75 
  },
];

const mockImpact: ImpactAssessment = {
  affectedServices: ['Web应用', '数据库服务'],
  affectedUsers: 150,
  businessImpact: '可能影响正常用户访问',
  urgency: 'high',
};

export function BlockDiagAnalysis() {
  const [activeTab, setActiveTab] = useState<'logs' | 'policy' | 'cause' | 'impact'>('logs');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'high': return 'border-orange-500/50 bg-orange-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全阻断诊断</h2>
        <p className="text-sm text-gray-400 mt-1">阻断日志分析、策略匹配、原因定位、影响评估</p>
      </div>

      <div className="flex gap-2 mb-6 bg-[#1E2736] border border-[#2A354D] rounded-lg p-1">
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          阻断日志分析
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'policy' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          策略匹配
        </button>
        <button
          onClick={() => setActiveTab('cause')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'cause' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          原因定位
        </button>
        <button
          onClick={() => setActiveTab('impact')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'impact' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          影响评估
        </button>
      </div>

      {activeTab === 'logs' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">阻断日志分析</h3>
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111827]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">日志ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">源IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">目标IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间戳</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">策略ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">阻断原因</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">严重程度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {mockBlockLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#2A354D]/30">
                    <td className="px-4 py-4 text-sm text-blue-400">{log.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{log.sourceIp}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{log.targetIp}</td>
                    <td className="px-4 py-4 text-sm text-gray-400">{log.timestamp}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{log.policyId}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{log.blockReason}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(log.severity)}`}>
                        {log.severity === 'high' ? '高' : log.severity === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'policy' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">策略匹配</h3>
          <div className="grid gap-4">
            {mockPolicyMatches.map((policy) => (
              <div key={policy.policyId} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{policy.policyName}</p>
                      <p className="text-sm text-gray-400">策略ID: {policy.policyId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">匹配度</p>
                    <p className="text-lg font-semibold text-green-400">{policy.matchScore}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span>{policy.matchReason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cause' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">原因定位</h3>
          <div className="grid gap-4">
            {mockRootCauses.map((cause, index) => (
              <div key={index} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-medium">{cause.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">置信度</p>
                    <p className="text-lg font-semibold text-blue-400">{cause.confidence}%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{cause.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">影响评估</h3>
          <div className={`bg-[#1E2736] border rounded-lg p-4 ${getUrgencyColor(mockImpact.urgency)}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">受影响服务</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockImpact.affectedServices.map((service, idx) => (
                    <span key={idx} className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">受影响用户</span>
                </div>
                <p className="text-2xl font-semibold text-white">{mockImpact.affectedUsers}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">紧急程度</span>
                </div>
                <p className="text-lg font-semibold text-yellow-400">
                  {mockImpact.urgency === 'critical' ? '紧急' : 
                   mockImpact.urgency === 'high' ? '高' : 
                   mockImpact.urgency === 'medium' ? '中' : '低'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">业务影响</p>
              <p className="text-gray-300">{mockImpact.businessImpact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
