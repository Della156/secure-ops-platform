'use client';

import React, { useState } from 'react';
import {
  GitBranch, Eye, ZoomIn, ZoomOut, RefreshCw, Download,
  ArrowRight, AlertCircle, Shield, Server, Database, User,
  FileText, Lock, Unlock, Zap, Target, ChevronDown, ChevronRight
} from 'lucide-react';

interface AttackPhase {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
  description: string;
  timestamp: string;
  details: { label: string; value: string }[];
}

interface AttackNode {
  id: string;
  type: 'asset' | 'attack' | 'action' | 'indicator';
  label: string;
  sublabel: string;
  status: 'compromised' | 'targeted' | 'protected' | 'unknown';
  x: number;
  y: number;
}

interface AttackEdge {
  from: string;
  to: string;
  label?: string;
}

const mockAttackPhases: AttackPhase[] = [
  { id: 'P1', name: '侦察阶段', icon: <Target className="w-5 h-5" />, status: 'completed', description: '攻击者通过端口扫描、目录枚举等方式收集目标信息', timestamp: '2026-06-02 16:30:00', details: [{ label: '扫描端口', value: '80, 443, 22' }, { label: '发现服务', value: 'Apache 2.4.41' }, { label: '指纹识别', value: '成功' }] },
  { id: 'P2', name: '武器化', icon: <Zap className="w-5 h-5" />, status: 'completed', description: '攻击者准备攻击载荷，构造恶意请求', timestamp: '2026-06-02 16:35:00', details: [{ label: '载荷类型', value: 'SQL注入' }, { label: '编码方式', value: 'URL编码' }, { label: '绕过技术', value: 'WAF绕过' }] },
  { id: 'P3', name: '投递阶段', icon: <FileText className="w-5 h-5" />, status: 'completed', description: '通过漏洞或社会工程手段投递攻击载荷', timestamp: '2026-06-02 16:38:23', details: [{ label: '攻击向量', value: '/api/users' }, { label: '请求方法', value: 'POST' }, { label: 'Payload大小', value: '2.3KB' }] },
  { id: 'P4', name: '漏洞利用', icon: <Unlock className="w-5 h-5" />, status: 'completed', description: '利用目标系统漏洞获取初始访问权限', timestamp: '2026-06-02 16:38:45', details: [{ label: '漏洞类型', value: 'SQL注入' }, { label: 'CVE编号', value: 'CVE-2024-12345' }, { label: '权限提升', value: '成功' }] },
  { id: 'P5', name: '安装阶段', icon: <Server className="w-5 h-5" />, status: 'current', description: '在目标系统中安装持久化机制', timestamp: '2026-06-02 16:40:12', details: [{ label: '植入类型', value: 'Web Shell' }, { label: '路径', value: '/var/www/shell.php' }, { label: '权限', value: 'www-data' }] },
  { id: 'P6', name: '命令控制', icon: <Lock className="w-5 h-5" />, status: 'pending', description: '建立与攻击者C2服务器的通信', timestamp: '-', details: [] },
  { id: 'P7', name: '行动目标', icon: <Database className="w-5 h-5" />, status: 'pending', description: '执行攻击的最终目标（数据窃取、破坏等）', timestamp: '-', details: [] },
];

const mockAttackNodes: AttackNode[] = [
  { id: 'N1', type: 'asset', label: 'DMZ区域', sublabel: '网络边界', status: 'protected', x: 10, y: 50 },
  { id: 'N2', type: 'asset', label: 'WEB服务器', sublabel: 'Apache 2.4', status: 'compromised', x: 30, y: 30 },
  { id: 'N3', type: 'attack', label: 'SQL注入', sublabel: 'CVE-2024-12345', status: 'targeted', x: 30, y: 70 },
  { id: 'N4', type: 'asset', label: '数据库', sublabel: 'MySQL 8.0', status: 'targeted', x: 50, y: 50 },
  { id: 'N5', type: 'action', label: '数据泄露', sublabel: '2.3GB数据', status: 'compromised', x: 70, y: 30 },
  { id: 'N6', type: 'indicator', label: 'C2服务器', sublabel: '203.156.89.42', status: 'unknown', x: 70, y: 70 },
  { id: 'N7', type: 'asset', label: '内部网络', sublabel: '业务系统', status: 'protected', x: 90, y: 50 },
];

const mockAttackEdges: AttackEdge[] = [
  { from: 'N1', to: 'N2', label: '80/TCP' },
  { from: 'N3', to: 'N2', label: 'EXPLOIT' },
  { from: 'N2', to: 'N4', label: '3306/TCP' },
  { from: 'N4', to: 'N5', label: 'DATA' },
  { from: 'N5', to: 'N6', label: 'C2' },
  { from: 'N4', to: 'N7', label: 'LAN' },
];

function PhaseCard({ phase, expanded, onToggle }: { phase: AttackPhase; expanded: boolean; onToggle: () => void }) {
  const statusConfig = {
    completed: { bg: 'bg-green-500/10', border: 'border-green-500/30', iconColor: 'text-green-400' },
    current: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', iconColor: 'text-yellow-400', glow: 'animate-pulse' },
    pending: { bg: 'bg-gray-500/10', border: 'border-gray-500/30', iconColor: 'text-gray-400' },
  };
  const config = statusConfig[phase.status];

  return (
    <div className={`bg-[#20293F] border rounded-lg overflow-hidden ${config.border}`}>
      <div className={`p-4 cursor-pointer hover:bg-[#111625] ${phase.status === 'current' ? config.glow : ''}`} onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg} ${config.iconColor}`}>
            {phase.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-sm">{phase.name}</span>
              {phase.status === 'current' && (
                <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400">进行中</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{phase.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">{phase.timestamp}</div>
            {expanded ? <ChevronDown className="w-4 h-4 text-gray-500 mt-1" /> : <ChevronRight className="w-4 h-4 text-gray-500 mt-1" />}
          </div>
        </div>
      </div>

      {expanded && phase.details.length > 0 && (
        <div className="bg-[#111625] px-4 py-3 border-t">
          <div className="grid grid-cols-3 gap-4 text-xs">
            {phase.details.map((detail, i) => (
              <div key={i}>
                <span className="text-gray-500">{detail.label}</span>
                <div className="text-white mt-1">{detail.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AttackGraph({ nodes, edges }: { nodes: AttackNode[]; edges: AttackEdge[] }) {
  const nodeConfig = {
    asset: { bg: 'bg-blue-500/20', border: 'border-blue-500', icon: <Server className="w-4 h-4 text-blue-400" /> },
    attack: { bg: 'bg-red-500/20', border: 'border-red-500', icon: <AlertCircle className="w-4 h-4 text-red-400" /> },
    action: { bg: 'bg-orange-500/20', border: 'border-orange-500', icon: <Zap className="w-4 h-4 text-orange-400" /> },
    indicator: { bg: 'bg-purple-500/20', border: 'border-purple-500', icon: <Target className="w-4 h-4 text-purple-400" /> },
  };

  const statusConfig = {
    compromised: { statusDot: 'bg-red-500' },
    targeted: { statusDot: 'bg-yellow-500' },
    protected: { statusDot: 'bg-green-500' },
    unknown: { statusDot: 'bg-gray-500' },
  };

  return (
    <div className="relative h-[300px] bg-[#111625] rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {edges.map((edge, i) => {
          const from = nodes.find(n => n.id === edge.from);
          const to = nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;
          return (
            <g key={i}>
              <line
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <polygon
                points={`${to.x - 1.5}%,${to.y}% ${to.x - 3}%,${to.y - 1}% ${to.x - 3}%,${to.y + 1}%`}
                fill="#3B82F6"
                transform={`translate(${to.x}%, ${to.y}%) rotate(45) translate(-${to.x}%, -${to.y}%)`}
              />
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => {
        const config = nodeConfig[node.type];
        const status = statusConfig[node.status];
        return (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${config.bg} ${config.border} border rounded-lg p-2 cursor-pointer hover:scale-110 transition-transform`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="flex flex-col items-center">
              {config.icon}
              <span className="text-[10px] text-white mt-1 font-medium">{node.label}</span>
              <span className="text-[9px] text-gray-400">{node.sublabel}</span>
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${status.statusDot}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AttackChainVisualization() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('P3');
  const [zoom, setZoom] = useState(100);

  const completedCount = mockAttackPhases.filter(p => p.status === 'completed').length;
  const currentCount = mockAttackPhases.filter(p => p.status === 'current').length;
  const pendingCount = mockAttackPhases.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-400" />
            攻击链全景与可视化分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">可视化展示攻击链各个阶段，追踪攻击路径</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(Math.max(50, zoom - 20))} className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F]">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm text-gray-400 w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(150, zoom + 20))} className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F]">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出图表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '已完成阶段', value: completedCount, total: mockAttackPhases.length, color: 'green', icon: <Shield className="w-4 h-4" /> },
          { label: '当前阶段', value: currentCount, total: mockAttackPhases.length, color: 'yellow', icon: <Eye className="w-4 h-4" /> },
          { label: '待进行阶段', value: pendingCount, total: mockAttackPhases.length, color: 'gray', icon: <Target className="w-4 h-4" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-${stat.color}-400`}>{stat.icon}</span>
                <span className="text-gray-400 text-xs">{stat.label}</span>
              </div>
              <span className="text-sm text-gray-500">{stat.value}/{stat.total}</span>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${stat.color}-500 rounded-full`}
                  style={{ width: `${(stat.value / stat.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-orange-400" />
            攻击链阶段分析
          </h3>
          <div className="space-y-3">
            {mockAttackPhases.map((phase, index) => (
              <div key={phase.id} className="relative">
                {index < mockAttackPhases.length - 1 && (
                  <div className="absolute left-[22px] top-[44px] w-0.5 h-[calc(100%-44px)] bg-[#2A354D]" />
                )}
                <PhaseCard
                  phase={phase}
                  expanded={expandedPhase === phase.id}
                  onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            攻击路径可视化
          </h3>
          <AttackGraph nodes={mockAttackNodes} edges={mockAttackEdges} />
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            {[
              { label: '资产节点', color: 'bg-blue-500' },
              { label: '攻击节点', color: 'bg-red-500' },
              { label: '行动节点', color: 'bg-orange-500' },
              { label: '指示器', color: 'bg-purple-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">攻击链摘要</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {[
            { label: '攻击类型', value: 'SQL注入攻击', icon: <AlertCircle className="w-4 h-4 text-red-400" /> },
            { label: '攻击来源', value: '203.156.89.42 (俄罗斯)', icon: <User className="w-4 h-4 text-blue-400" /> },
            { label: '首次检测时间', value: '2026-06-02 16:30:00', icon: <FileText className="w-4 h-4 text-green-400" /> },
            { label: '影响范围', value: 'WEB服务器、数据库', icon: <Server className="w-4 h-4 text-purple-400" /> },
          ].map((item, i) => (
            <div key={i} className="bg-[#111625] rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 mb-1">{item.icon} {item.label}</div>
              <div className="text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttackChainVisualization;