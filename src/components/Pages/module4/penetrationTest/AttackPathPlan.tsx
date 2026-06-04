'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Map, Target, Crosshair, AlertTriangle, Shield, ArrowRight, Server, Database, Cloud, Network, Lock, Eye } from 'lucide-react';

type NodeType = 'entry' | 'host' | 'database' | 'cloud' | 'network' | 'target' | 'obstacle';

interface AttackPathNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  compromised: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  controls: string[];
  description: string;
}

interface AttackPathEdge {
  from: string;
  to: string;
  technique: string;
  success: number;
  detected: number;
}

const NODES: AttackPathNode[] = [
  { id: 'N1', label: '钓鱼邮件', type: 'entry', x: 5, y: 50, compromised: true, difficulty: 'easy', controls: ['邮件过滤', '安全意识培训'], description: '钓鱼邮件投递到员工' },
  { id: 'N2', label: '员工 PC-001', type: 'host', x: 20, y: 50, compromised: true, difficulty: 'easy', controls: ['EDR', '应用白名单'], description: '员工终端，被钓鱼邮件植入' },
  { id: 'N3', label: '内网域控制器', type: 'network', x: 40, y: 35, compromised: true, difficulty: 'medium', controls: ['MFA', '账户锁定'], description: '横向移动跳板' },
  { id: 'N4', label: '办公服务器', type: 'host', x: 40, y: 65, compromised: true, difficulty: 'medium', controls: ['补丁管理', '日志审计'], description: '办公应用服务器' },
  { id: 'N5', label: '业务数据库', type: 'database', x: 65, y: 50, compromised: false, difficulty: 'hard', controls: ['数据库防火墙', '加密存储'], description: '核心业务数据' },
  { id: 'N6', label: '云存储', type: 'cloud', x: 80, y: 30, compromised: false, difficulty: 'hard', controls: ['IAM', '对象存储审计'], description: '客户数据云存储' },
  { id: 'N7', label: '核心备份', type: 'target', x: 80, y: 70, compromised: false, difficulty: 'extreme', controls: ['离线备份', '异地容灾'], description: '核心系统备份' },
  { id: 'N8', label: 'WAF', type: 'obstacle', x: 30, y: 20, compromised: true, difficulty: 'medium', controls: ['WAF 规则'], description: '已绕过' },
];

const EDGES: AttackPathEdge[] = [
  { from: 'N1', to: 'N2', technique: '邮件附件宏', success: 85, detected: 30 },
  { from: 'N2', to: 'N3', technique: 'Pass-the-Hash', success: 70, detected: 60 },
  { from: 'N2', to: 'N4', technique: '横向 SMB', success: 75, detected: 45 },
  { from: 'N3', to: 'N5', technique: 'SQL 提权', success: 50, detected: 70 },
  { from: 'N3', to: 'N6', technique: '云 API 调用', success: 45, detected: 80 },
  { from: 'N4', to: 'N7', technique: '备份服务入侵', success: 35, detected: 85 },
];

const NODE_STYLE: Record<NodeType, { color: string; bg: string; icon: any }> = {
  entry: { color: 'text-blue-400', bg: 'bg-blue-500/30 border-blue-500/60', icon: Target },
  host: { color: 'text-cyan-400', bg: 'bg-cyan-500/30 border-cyan-500/60', icon: Server },
  database: { color: 'text-purple-400', bg: 'bg-purple-500/30 border-purple-500/60', icon: Database },
  cloud: { color: 'text-sky-400', bg: 'bg-sky-500/30 border-sky-500/60', icon: Cloud },
  network: { color: 'text-green-400', bg: 'bg-green-500/30 border-green-500/60', icon: Network },
  target: { color: 'text-red-400', bg: 'bg-red-500/30 border-red-500/60', icon: Lock },
  obstacle: { color: 'text-yellow-400', bg: 'bg-yellow-500/30 border-yellow-500/60', icon: Shield },
};

/**
 * 4-10-3 攻击路径规划（业务深度）
 */
export function AttackPathPlan() {
  const [selectedNode, setSelectedNode] = useState<AttackPathNode | null>(NODES[4]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Map className="w-6 h-6 text-blue-400" />
            攻击路径规划
          </h1>
          <p className="text-slate-400 mt-1 text-sm">8 节点 · 6 攻击边 · 攻击链可视化 · AI 路径推荐</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Eye className="w-4 h-4 mr-1" />实时监控</Button>
          <Button variant="primary"><Target className="w-4 h-4 mr-1" />规划路径</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-slate-200 mb-3">攻击路径图</h3>
          <div className="relative h-[480px] bg-[#0F1729] rounded-lg p-4 overflow-hidden">
            {/* SVG 边线层 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {EDGES.map((e, i) => {
                const from = NODES.find((n) => n.id === e.from)!;
                const to = NODES.find((n) => n.id === e.to)!;
                const color = e.success >= 70 ? '#EF4444' : e.success >= 50 ? '#F97316' : '#6B7280';
                return (
                  <g key={i}>
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke={color}
                      strokeWidth="0.3"
                      strokeDasharray={e.detected > 60 ? '0.5,0.5' : '0'}
                      opacity={0.7}
                    />
                    <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 1} fill="#9CA3AF" fontSize="1.5" textAnchor="middle">
                      {e.technique}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* 节点层 */}
            {NODES.map((n) => {
              const St = NODE_STYLE[n.type];
              const Icon = St.icon;
              const isSelected = selectedNode?.id === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                    isSelected ? 'scale-110 z-10' : 'hover:scale-105'
                  }`}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div className={`w-12 h-12 rounded-full ${St.bg} border-2 flex items-center justify-center backdrop-blur-sm ${
                    n.compromised ? 'animate-pulse' : ''
                  }`}>
                    <Icon className={`w-5 h-5 ${St.color}`} />
                  </div>
                  <div className="mt-1 text-[10px] text-center text-slate-300 font-medium whitespace-nowrap">{n.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 mt-3 text-[10px]">
            {Object.entries(NODE_STYLE).map(([k, v]) => {
              const Icon = v.icon;
              return (
                <div key={k} className="flex items-center gap-1 px-2 py-1 rounded bg-[#111625]">
                  <Icon className={`w-3 h-3 ${v.color}`} />
                  <span className="text-slate-300">
                    {k === 'entry' ? '入口' : k === 'host' ? '主机' : k === 'database' ? '数据库' : k === 'cloud' ? '云' : k === 'network' ? '网络' : k === 'target' ? '目标' : '障碍'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {selectedNode && (
          <Card>
            <h3 className="text-sm font-medium text-slate-200 mb-3">节点详情：{selectedNode.label}</h3>
            <div className="space-y-2">
              <Field label="节点 ID" value={selectedNode.id} />
              <Field label="类型" value={NODE_STYLE[selectedNode.type].color.replace('text-', '')} />
              <Field label="难度" value={
                selectedNode.difficulty === 'easy' ? '简单' : selectedNode.difficulty === 'medium' ? '中等' : selectedNode.difficulty === 'hard' ? '困难' : '极难'
              } />
              <Field label="状态" value={selectedNode.compromised ? '已攻破' : '未攻破'} />
              <Field label="描述" value={selectedNode.description} />
              <div>
                <p className="text-xs text-slate-500 mb-1">防护控制</p>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.controls.map((c, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3">攻击边详情</h3>
        <div className="space-y-2">
          {EDGES.map((e, i) => {
            const from = NODES.find((n) => n.id === e.from)!;
            const to = NODES.find((n) => n.id === e.to)!;
            return (
              <div key={i} className="p-2.5 rounded bg-[#111625] flex items-center gap-3">
                <span className="text-sm text-slate-200">{from.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="text-sm text-slate-200">{to.label}</span>
                <span className="text-xs text-cyan-400 ml-auto">{e.technique}</span>
                <span className={`text-xs ${e.success >= 70 ? 'text-red-400' : e.success >= 50 ? 'text-orange-400' : 'text-green-400'}`}>
                  成功率 {e.success}%
                </span>
                <span className="text-xs text-yellow-400">检出 {e.detected}%</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="p-2.5 bg-[#111625] rounded-lg"><p className="text-xs text-slate-500">{label}</p><p className="text-sm text-slate-200 mt-0.5 font-mono">{value}</p></div>;
}

export default AttackPathPlan;
