'use client';

import React, { useState, useMemo } from 'react';
import {
  Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize2, Download,
  Server, Globe, Database, Shield, Network, FileText, Eye,
  ChevronRight, Clock, Target, AlertTriangle, Activity,
  Zap, Crosshair, Box, User, Key, Layers, ArrowRight,
  MapPin, Workflow, RotateCw
} from 'lucide-react';

interface PathNode {
  id: string;
  label: string;
  type: 'attacker' | 'workstation' | 'server' | 'dc' | 'file' | 'database' | 'backup';
  ip: string;
  x: number;
  y: number;
  compromised: boolean;
  riskScore: number;
  role: string;
  hops: number; // 距离初始入侵的跳数
  timestamp: string;
}

interface PathEdge {
  from: string;
  to: string;
  technique: string;
  mitre: string;
  timestamp: string;
  bytesIn: number;
  bytesOut: number;
  status: 'success' | 'failed' | 'blocked';
  user: string;
}

const nodes: PathNode[] = [
  { id: 'attacker', label: '外部攻击者', type: 'attacker', ip: '203.0.113.45', x: 60, y: 280, compromised: true, riskScore: 100, role: '初始入侵源', hops: 0, timestamp: '06:00:12' },
  { id: 'ws1', label: '员工终端', type: 'workstation', ip: '10.10.7.31', x: 240, y: 280, compromised: true, riskScore: 95, role: '钓鱼邮件目标', hops: 1, timestamp: '06:02:48' },
  { id: 'ws2', label: '员工终端', type: 'workstation', ip: '10.10.7.45', x: 240, y: 100, compromised: true, riskScore: 78, role: '横向邻居', hops: 2, timestamp: '06:12:15' },
  { id: 'ws3', label: '员工终端', type: 'workstation', ip: '10.10.7.32', x: 240, y: 460, compromised: false, riskScore: 35, role: '同网段', hops: 0, timestamp: '未沦陷' },
  { id: 'fs1', label: '文件服务器', type: 'file', ip: '10.10.5.20', x: 460, y: 100, compromised: true, riskScore: 88, role: '凭据滥用', hops: 2, timestamp: '06:12:48' },
  { id: 'app1', label: '应用服务器', type: 'server', ip: '10.10.2.18', x: 460, y: 280, compromised: true, riskScore: 90, role: 'WMI 远程', hops: 2, timestamp: '06:14:32' },
  { id: 'app2', label: '应用服务器', type: 'server', ip: '10.10.2.20', x: 460, y: 460, compromised: true, riskScore: 72, role: 'PsExec 扩散', hops: 3, timestamp: '06:15:18' },
  { id: 'db1', label: '核心数据库', type: 'database', ip: '10.10.3.5', x: 680, y: 100, compromised: false, riskScore: 92, role: '目标高价值', hops: 4, timestamp: '已防御' },
  { id: 'db2', label: '业务数据库', type: 'database', ip: '10.10.3.10', x: 680, y: 280, compromised: true, riskScore: 85, role: 'SQL 注入', hops: 3, timestamp: '06:18:32' },
  { id: 'dc', label: 'AD 域控', type: 'dc', ip: '10.10.4.10', x: 680, y: 460, compromised: false, riskScore: 98, role: '关键资产', hops: 4, timestamp: '已防御' },
  { id: 'backup', label: '备份 NAS', type: 'backup', ip: '10.10.5.40', x: 900, y: 280, compromised: false, riskScore: 80, role: '最后目标', hops: 5, timestamp: '已隔离' },
];

const edges: PathEdge[] = [
  { from: 'attacker', to: 'ws1', technique: '钓鱼邮件', mitre: 'T1566.001', timestamp: '06:00:12', bytesIn: 4582, bytesOut: 124, status: 'success', user: 'zhang.wei' },
  { from: 'ws1', to: 'ws2', technique: 'SMB 登录', mitre: 'T1021.002', timestamp: '06:12:15', bytesIn: 458, bytesOut: 12, status: 'success', user: 'zhang.wei' },
  { from: 'ws1', to: 'fs1', technique: 'SMB 登录', mitre: 'T1021.002', timestamp: '06:12:48', bytesIn: 45820, bytesOut: 124, status: 'success', user: 'admin' },
  { from: 'ws1', to: 'app1', technique: 'WMI 远程', mitre: 'T1047', timestamp: '06:14:32', bytesIn: 1240, bytesOut: 89, status: 'success', user: 'admin' },
  { from: 'fs1', to: 'app1', technique: 'RDP', mitre: 'T1021.001', timestamp: '06:15:18', bytesIn: 12800, bytesOut: 240, status: 'success', user: 'admin' },
  { from: 'app1', to: 'app2', technique: 'PsExec', mitre: 'T1569.002', timestamp: '06:16:42', bytesIn: 320, bytesOut: 64, status: 'success', user: 'admin' },
  { from: 'app1', to: 'db2', technique: 'SQL 注入', mitre: 'T1190', timestamp: '06:18:32', bytesIn: 0, bytesOut: 0, status: 'success', user: 'sa' },
  { from: 'db2', to: 'db1', technique: '横向尝试', mitre: 'T1021', timestamp: '06:19:18', bytesIn: 0, bytesOut: 0, status: 'blocked', user: 'sa' },
  { from: 'ws2', to: 'dc', technique: 'Kerberoasting', mitre: 'T1558.003', timestamp: '09:32:18', bytesIn: 85, bytesOut: 2048, status: 'success', user: 'li.na' },
  { from: 'fs1', to: 'backup', technique: 'SMB 访问', mitre: 'T1021.002', timestamp: '09:15:24', bytesIn: 0, bytesOut: 0, status: 'blocked', user: 'admin' },
];

const nodeTypeConfig: Record<PathNode['type'], { icon: React.ReactNode; color: string; bg: string }> = {
  attacker: { icon: <User className="w-4 h-4" />, color: '#EF4444', bg: '#7F1D1D' },
  workstation: { icon: <Server className="w-4 h-4" />, color: '#0066FF', bg: '#1E3A8A' },
  server: { icon: <Server className="w-4 h-4" />, color: '#9333EA', bg: '#581C87' },
  dc: { icon: <Shield className="w-4 h-4" />, color: '#22C55E', bg: '#14532D' },
  file: { icon: <FileText className="w-4 h-4" />, color: '#EAB308', bg: '#713F12' },
  database: { icon: <Database className="w-4 h-4" />, color: '#FF6D00', bg: '#7C2D12' },
  backup: { icon: <Layers className="w-4 h-4" />, color: '#06B6D4', bg: '#164E63' },
};

export function AttackPathVisualization() {
  const [selectedNode, setSelectedNode] = useState<string | null>('app1');
  const [animate, setAnimate] = useState(true);
  const [zoom, setZoom] = useState(0.85);
  const [view, setView] = useState<'kill-chain' | 'asset-priority'>('kill-chain');

  const selected = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  // 按跳数分组（kill chain 视角）
  const byHops = useMemo(() => {
    const groups: Record<number, PathNode[]> = {};
    nodes.forEach(n => {
      if (!groups[n.hops]) groups[n.hops] = [];
      groups[n.hops].push(n);
    });
    return Object.entries(groups).map(([hop, list]) => ({ hop: Number(hop), list })).sort((a, b) => a.hop - b.hop);
  }, []);

  // 资产优先级视角
  const byPriority = useMemo(() => [...nodes].sort((a, b) => b.riskScore - a.riskScore).slice(0, 8), []);

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">横向渗透攻击路径可视化</h2>
            <p className="text-xs text-slate-500 mt-1">APT-29 攻击链 5 跳：钓鱼 → 提权 → 横向 → 收集 → 影响 · 已沦陷 7/11 节点</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-[#111625] border border-[#2A354D] rounded-md overflow-hidden">
              <button onClick={() => setView('kill-chain')} className={`px-3 py-1.5 text-xs ${view === 'kill-chain' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Kill Chain</button>
              <button onClick={() => setView('asset-priority')} className={`px-3 py-1.5 text-xs ${view === 'asset-priority' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>资产优先级</button>
            </div>
            <button onClick={() => setAnimate(!animate)} className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded-md ${animate ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {animate ? <><Pause className="w-3.5 h-3.5" />暂停</> : <><Play className="w-3.5 h-3.5" />播放</>}
            </button>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 rounded-md">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-500 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 rounded-md">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出报告
            </button>
          </div>
        </div>
      </div>

      {/* 路径统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {byHops.map(({ hop, list }) => {
          const colors = ['#EF4444', '#FF6D00', '#EAB308', '#0066FF', '#9333EA', '#22C55E'];
          return (
            <div key={hop} className="bg-[#20293F] border border-[#2A354D] rounded p-2" style={{ borderColor: `${colors[hop] || '#94A3B8'}40` }}>
              <div className="text-[10px] text-slate-500 mb-0.5">跳数 {hop}</div>
              <div className="text-sm font-medium" style={{ color: colors[hop] || '#94A3B8' }}>{list.length} 节点</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                <span className="text-red-400">{list.filter(n => n.compromised).length}</span> / {list.length} 沦陷
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 攻击路径画布 */}
        <div className="lg:col-span-3 bg-[#111625] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A354D] bg-[#20293F]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-red-400" />
              横向渗透路径图
            </h3>
            <div className="text-xs text-slate-500">{nodes.length} 节点 / {edges.length} 边</div>
          </div>
          <div className="relative overflow-auto" style={{ height: '600px' }}>
            <svg width="1100" height="600" viewBox="0 0 1100 600" style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }} className="w-full">
              {/* 跳数分组背景 */}
              {view === 'kill-chain' && byHops.map(({ hop, list }) => {
                const x = hop * 200 + 20;
                const colors = ['#EF4444', '#FF6D00', '#EAB308', '#0066FF', '#9333EA', '#22C55E'];
                return (
                  <g key={hop}>
                    <rect x={x} y={20} width={180} height={560} fill={`${colors[hop] || '#94A3B8'}05`} stroke={`${colors[hop] || '#94A3B8'}30`} strokeDasharray="4 4" rx="4" />
                    <text x={x + 90} y={40} fill={colors[hop] || '#94A3B8'} fontSize="11" textAnchor="middle" fontWeight="600">
                      跳 {hop}
                    </text>
                  </g>
                );
              })}

              {/* 边 */}
              {edges.map((e, i) => {
                const from = nodes.find(n => n.id === e.from);
                const to = nodes.find(n => n.id === e.to);
                if (!from || !to) return null;
                const color = e.status === 'success' ? '#EF4444' : e.status === 'blocked' ? '#22C55E' : '#94A3B8';
                const dashArray = e.status === 'blocked' ? '4 4' : '0';
                return (
                  <g key={i}>
                    <line
                      x1={from.x + 90}
                      y1={from.y + 25}
                      x2={to.x}
                      y2={to.y + 25}
                      stroke={color}
                      strokeWidth="1.5"
                      strokeDasharray={dashArray}
                    />
                    {e.status === 'success' && animate && (
                      <circle r="3" fill={color}>
                        <animateMotion
                          dur="2.5s"
                          repeatCount="indefinite"
                          path={`M ${from.x + 90} ${from.y + 25} L ${to.x} ${to.y + 25}`}
                        />
                      </circle>
                    )}
                    <text
                      x={(from.x + 90 + to.x) / 2}
                      y={(from.y + to.y) / 2 - 4}
                      fill={color}
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {e.mitre}
                    </text>
                  </g>
                );
              })}

              {/* 节点 */}
              {nodes.map(n => {
                const cfg = nodeTypeConfig[n.type as keyof typeof nodeTypeConfig];
                const isSelected = selectedNode === n.id;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    onClick={() => setSelectedNode(n.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="0" y="0" width="180" height="50"
                      rx="6"
                      fill={n.compromised ? cfg.bg : '#1F2937'}
                      stroke={isSelected ? '#3B82F6' : n.compromised ? cfg.color : '#4B5563'}
                      strokeWidth={isSelected ? 2.5 : 1}
                    />
                    <foreignObject x="8" y="6" width="20" height="20">
                      <div style={{ color: cfg.color }}>{cfg.icon}</div>
                    </foreignObject>
                    <text x="32" y="20" fill="white" fontSize="12" fontWeight="600">{n.label}</text>
                    <text x="32" y="36" fill="#94A3B8" fontSize="10" fontFamily="monospace">{n.ip}</text>
                    {n.compromised && (
                      <circle cx="170" cy="8" r="4" fill="#EF4444">
                        {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />}
                      </circle>
                    )}
                    {!n.compromised && (
                      <circle cx="170" cy="8" r="4" fill="#22C55E" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 详情 + 时间线 */}
        <div className="space-y-4">
          {selected && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: nodeTypeConfig[selected.type as keyof typeof nodeTypeConfig].color }}>{nodeTypeConfig[selected.type as keyof typeof nodeTypeConfig].icon}</span>
                  <h3 className="text-base font-semibold text-white">{selected.label}</h3>
                </div>
                <p className="text-xs text-slate-500 font-mono">{selected.ip}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">状态</div>
                  <div className={selected.compromised ? 'text-red-400' : 'text-green-400'}>
                    {selected.compromised ? '⚠ 已沦陷' : '✓ 防御中'}
                  </div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">距离起点</div>
                  <div className="text-slate-200 font-mono">{selected.hops} 跳</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">风险评分</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${selected.riskScore >= 90 ? 'bg-red-500' : selected.riskScore >= 70 ? 'bg-orange-500' : 'bg-yellow-500'}`} style={{ width: `${selected.riskScore}%` }} />
                  </div>
                  <span className="text-sm text-white font-mono">{selected.riskScore}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-0.5">角色</div>
                <div className="text-xs text-slate-200 bg-[#111625] border border-[#2A354D] rounded px-2 py-1.5">{selected.role}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-0.5">沦陷时间</div>
                <div className="text-xs text-orange-300 font-mono">{selected.timestamp}</div>
              </div>

              {selected.compromised ? (
                <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />立即隔离
                </button>
              ) : (
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />查看防护
                </button>
              )}
            </div>
          )}

          {/* 资产优先级（资产视角） */}
          {view === 'asset-priority' && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2">高价值资产</h3>
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                {byPriority.map((n, i) => {
                  const cfg = nodeTypeConfig[n.type as keyof typeof nodeTypeConfig];
                  return (
                    <div
                      key={n.id}
                      onClick={() => setSelectedNode(n.id)}
                      className={`p-2 bg-[#111625] rounded cursor-pointer ${selectedNode === n.id ? 'ring-1 ring-blue-500' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-mono">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-200 truncate">{n.label}</span>
                            <span className={`text-[10px] font-mono ${n.riskScore >= 90 ? 'text-red-400' : n.riskScore >= 70 ? 'text-orange-400' : 'text-yellow-400'}`}>{n.riskScore}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{n.ip}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 攻击时间线 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />时间线
            </h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {edges.map((e, i) => {
                const from = nodes.find(n => n.id === e.from);
                const to = nodes.find(n => n.id === e.to);
                if (!from || !to) return null;
                return (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className={`shrink-0 w-2 h-2 rounded-full mt-1 ${e.status === 'success' ? 'bg-red-500' : e.status === 'blocked' ? 'bg-green-500' : 'bg-slate-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-400 font-mono text-[10px]">{e.timestamp}</div>
                      <div className="text-slate-200 text-[10px]">
                        <span className="font-mono">{from.ip.split('.').pop()}</span>
                        <ArrowRight className="w-2.5 h-2.5 inline mx-0.5" />
                        <span className="font-mono">{to.ip.split('.').pop()}</span>
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        {e.technique} <span className="text-purple-400 font-mono">[{e.mitre}]</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttackPathVisualization;
