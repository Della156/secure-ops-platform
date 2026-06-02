'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Server, Activity, Database, FileText, Lightbulb, ChevronDown, ChevronUp, Network, Shield, Zap } from 'lucide-react';

interface LogEntry {
  time: string;
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  source: string;
}

interface CorrelationAnalysis {
  component: string;
  status: 'normal' | 'warning' | 'error';
  relatedEvents: string[];
  impact: string;
}

interface RootCause {
  id: string;
  description: string;
  confidence: number;
  severity: 'high' | 'medium' | 'low';
  evidence: string[];
}

interface PropagationNode {
  id: string;
  name: string;
  type: 'source' | 'propagation' | 'impact';
  status: 'normal' | 'warning' | 'error';
  connections: string[];
}

const mockLogs: LogEntry[] = [
  { time: '10:30:01', level: 'critical', message: '数据库主节点连接中断', source: 'db.monitor' },
  { time: '10:30:02', level: 'error', message: '应用服务器请求超时率达85%', source: 'app.service' },
  { time: '10:30:03', level: 'warn', message: '网络交换机端口流量异常', source: 'network.switch' },
  { time: '10:30:04', level: 'error', message: '负载均衡器健康检查失败', source: 'lb.service' },
  { time: '10:30:05', level: 'warn', message: '内存使用率超过90%', source: 'system.memory' },
];

const mockCorrelations: CorrelationAnalysis[] = [
  {
    component: '网络层',
    status: 'error',
    relatedEvents: ['交换机端口异常', '丢包率上升'],
    impact: '导致应用服务器与数据库通信中断'
  },
  {
    component: '数据库层',
    status: 'error',
    relatedEvents: ['主节点连接中断', '复制延迟增加'],
    impact: '应用无法读取/写入数据'
  },
  {
    component: '应用层',
    status: 'warning',
    relatedEvents: ['请求超时', '连接池耗尽'],
    impact: '用户请求无法正常处理'
  },
];

const mockRootCauses: RootCause[] = [
  {
    id: 'RC-001',
    description: '核心交换机端口硬件故障',
    confidence: 95,
    severity: 'high',
    evidence: ['端口流量骤降为0', 'SNMP告警：端口Down', '线缆测试失败']
  },
  {
    id: 'RC-002',
    description: '数据库主节点网卡故障',
    confidence: 88,
    severity: 'high',
    evidence: ['网卡状态异常', 'ping延迟>1000ms', '系统日志显示网卡重置']
  },
];

const mockPropagationChain: PropagationNode[] = [
  { id: 'SRC-01', name: '核心交换机', type: 'source', status: 'error', connections: ['PROP-01'] },
  { id: 'PROP-01', name: '网络连接', type: 'propagation', status: 'error', connections: ['SRC-01', 'PROP-02', 'PROP-03'] },
  { id: 'PROP-02', name: '数据库主节点', type: 'propagation', status: 'error', connections: ['PROP-01', 'IMP-01'] },
  { id: 'PROP-03', name: '应用服务器', type: 'propagation', status: 'warning', connections: ['PROP-01', 'IMP-02'] },
  { id: 'IMP-01', name: '数据服务不可用', type: 'impact', status: 'error', connections: ['PROP-02'] },
  { id: 'IMP-02', name: '业务中断', type: 'impact', status: 'error', connections: ['PROP-03'] },
];

const recommendations = [
  { priority: 1, action: '立即更换故障交换机端口', severity: 'high', estimatedTime: '15分钟' },
  { priority: 2, action: '切换数据库主备节点', severity: 'high', estimatedTime: '5分钟' },
  { priority: 3, action: '重启应用服务器连接池', severity: 'medium', estimatedTime: '3分钟' },
  { priority: 4, action: '检查备用网络链路状态', severity: 'medium', estimatedTime: '2分钟' },
];

export function CompFaultDiag() {
  const [expandedSection, setExpandedSection] = useState<string | null>('correlation');

  const levelColors: Record<string, string> = {
    info: 'text-blue-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
    critical: 'text-red-500',
  };

  const severityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const nodeStatusColors: Record<string, string> = {
    normal: 'bg-green-500/20 border-green-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    error: 'bg-red-500/20 border-red-500/30',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">综合故障诊断</h2>
        <p className="text-sm text-gray-400 mt-1">多维度关联分析、故障根因识别、故障传播链生成、综合处置建议</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">严重故障</p>
              <p className="text-xl font-semibold text-red-400">{mockLogs.filter(l => l.level === 'critical' || l.level === 'error').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告信息</p>
              <p className="text-xl font-semibold text-yellow-400">{mockLogs.filter(l => l.level === 'warn').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">根因识别</p>
              <p className="text-xl font-semibold text-green-400">{mockRootCauses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">处置建议</p>
              <p className="text-xl font-semibold text-blue-400">{recommendations.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'correlation' ? null : 'correlation')}
          >
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">多维度关联分析</span>
            </div>
            {expandedSection === 'correlation' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {expandedSection === 'correlation' && (
            <div className="px-4 pb-4">
              <div className="space-y-3">
                {mockCorrelations.map((corr, idx) => (
                  <div key={idx} className="bg-[#111827] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 rounded text-xs ${nodeStatusColors[corr.status]}`}>
                        {corr.status === 'error' ? '异常' : corr.status === 'warning' ? '警告' : '正常'}
                      </span>
                      <span className="text-white font-medium">{corr.component}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-2">关联事件</p>
                        <ul className="space-y-1">
                          {corr.relatedEvents.map((evt, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                              <Activity className="w-3 h-3 text-gray-400" />
                              {evt}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-2">影响范围</p>
                        <p className="text-sm text-gray-300">{corr.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'rootcause' ? null : 'rootcause')}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">故障根因识别</span>
            </div>
            {expandedSection === 'rootcause' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {expandedSection === 'rootcause' && (
            <div className="px-4 pb-4">
              <div className="space-y-3">
                {mockRootCauses.map((rc, idx) => (
                  <div key={idx} className="bg-[#111827] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 rounded text-xs ${severityColors[rc.severity]}`}>
                        {rc.severity === 'high' ? '高风险' : rc.severity === 'medium' ? '中风险' : '低风险'}
                      </span>
                      <span className="text-white font-medium">{rc.description}</span>
                      <span className="ml-auto text-sm text-green-400 font-medium">置信度 {rc.confidence}%</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">证据链</p>
                      <div className="flex flex-wrap gap-2">
                        {rc.evidence.map((ev, i) => (
                          <span key={i} className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'propagation' ? null : 'propagation')}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">故障传播链</span>
            </div>
            {expandedSection === 'propagation' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {expandedSection === 'propagation' && (
            <div className="px-4 pb-4">
              <div className="relative">
                <div className="flex flex-col gap-3">
                  {mockPropagationChain.map((node, idx) => (
                    <div key={node.id} className="flex items-center gap-4">
                      <div className={`min-w-[120px] p-3 rounded-lg border ${nodeStatusColors[node.status]}`}>
                        <div className="text-xs text-gray-400 mb-1">
                          {node.type === 'source' ? '故障源' : node.type === 'propagation' ? '传播节点' : '影响结果'}
                        </div>
                        <div className="text-white text-sm font-medium">{node.name}</div>
                      </div>
                      {idx < mockPropagationChain.length - 1 && (
                        <div className="text-gray-500">→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">综合处置建议</span>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`border rounded-lg p-4 ${severityColors[rec.severity]}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-xs font-bold">
                    {rec.priority}
                  </span>
                  <span className="text-sm font-medium">{rec.action}</span>
                  <span className="ml-auto text-xs px-2 py-1 rounded bg-black/20">
                    预计 {rec.estimatedTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
