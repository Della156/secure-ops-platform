'use client';

import React, { useState, useMemo } from 'react';
import {
  Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize2, Download,
  Server, Globe, Database, Shield, Network, FileText, Eye,
  ChevronRight, Clock, Target, AlertTriangle, Activity,
  Zap, Crosshair, Box, User, Key, Layers, ArrowRight
} from 'lucide-react';

interface AttackNode {
  id: string;
  label: string;
  type: 'attacker' | 'c2' | 'host' | 'server' | 'database' | 'dc' | 'file';
  ip: string;
  x: number;
  y: number;
  stage: number; // 0=外部，1=初始入侵，2=提权，3=横向，4=目标
  risk: 'critical' | 'high' | 'medium';
  compromised: boolean;
  details: { ts: string; action: string; technique: string };
}

interface AttackEdge {
  from: string;
  to: string;
  label: string;
  technique: string;
  mitre: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
}

const nodes: AttackNode[] = [
  { id: 'n1', label: '钓鱼邮件', type: 'attacker', ip: 'attacker@evil.com', x: 80, y: 280, stage: 0, risk: 'critical', compromised: true, details: { ts: '06:00:12', action: '投递钓鱼邮件', technique: 'T1566.001' } },
  { id: 'n2', label: 'C2 服务器', type: 'c2', ip: '203.0.113.45', x: 80, y: 100, stage: 0, risk: 'critical', compromised: true, details: { ts: '06:24:18', action: 'C2 通信外传', technique: 'T1041' } },
  { id: 'n3', label: '用户终端', type: 'host', ip: '10.10.7.31', x: 320, y: 280, stage: 1, risk: 'critical', compromised: true, details: { ts: '06:02:48', action: '执行恶意 PowerShell', technique: 'T1059.001' } },
  { id: 'n4', label: '文件服务器', type: 'file', ip: '10.10.5.20', x: 560, y: 100, stage: 3, risk: 'high', compromised: true, details: { ts: '06:12:48', action: 'SMB 横向访问', technique: 'T1021.002' } },
  { id: 'n5', label: '应用服务器', type: 'server', ip: '10.10.2.18', x: 560, y: 280, stage: 3, risk: 'high', compromised: true, details: { ts: '06:14:32', action: '远程服务执行', technique: 'T1021.004' } },
  { id: 'n6', label: '核心数据库', type: 'database', ip: '10.10.3.5', x: 560, y: 460, stage: 4, risk: 'critical', compromised: false, details: { ts: '06:18:32', action: '已拦截', technique: 'T1005' } },
  { id: 'n7', label: 'AD 域控', type: 'dc', ip: '10.10.4.10', x: 800, y: 280, stage: 4, risk: 'critical', compromised: false, details: { ts: '未触发', action: '防御中', technique: 'T1003.006' } },
  { id: 'n8', label: '备份 NAS', type: 'server', ip: '10.10.5.40', x: 800, y: 100, stage: 4, risk: 'high', compromised: false, details: { ts: '未触发', action: '网络隔离', technique: 'T1485' } },
];

const edges: AttackEdge[] = [
  { from: 'n1', to: 'n3', label: '钓鱼邮件', technique: 'Spear Phishing', mitre: 'T1566.001', timestamp: '06:00:12', status: 'success' },
  { from: 'n3', to: 'n3', label: '执行 Payload', technique: 'PowerShell', mitre: 'T1059.001', timestamp: '06:02:48', status: 'success' },
  { from: 'n3', to: 'n3', label: '凭据转储', technique: 'LSASS Dump', mitre: 'T1003.001', timestamp: '06:08:42', status: 'success' },
  { from: 'n3', to: 'n4', label: 'SMB 横向', technique: 'SMB Login', mitre: 'T1021.002', timestamp: '06:12:48', status: 'success' },
  { from: 'n3', to: 'n5', label: 'WMI 远程', technique: 'WMI Exec', mitre: 'T1047', timestamp: '06:14:32', status: 'success' },
  { from: 'n4', to: 'n5', label: '远程服务', technique: 'RDP', mitre: 'T1021.001', timestamp: '06:15:18', status: 'success' },
  { from: 'n5', to: 'n6', label: 'SQL 注入', technique: 'SQLi', mitre: 'T1190', timestamp: '06:18:32', status: 'blocked' },
  { from: 'n3', to: 'n2', label: 'C2 通信', technique: 'HTTPS', mitre: 'T1071.001', timestamp: '06:20:18', status: 'success' },
  { from: 'n2', to: 'n2', label: '数据外传', technique: 'Exfil', mitre: 'T1041', timestamp: '06:24:18', status: 'success' },
];

const nodeTypeConfig: Record<AttackNode['type'], { icon: React.ReactNode; color: string; bg: string }> = {
  attacker: { icon: <User className="w-4 h-4" />, color: '#EF4444', bg: '#7F1D1D' },
  c2: { icon: <Globe className="w-4 h-4" />, color: '#DC2626', bg: '#7F1D1D' },
  host: { icon: <Server className="w-4 h-4" />, color: '#0066FF', bg: '#1E3A8A' },
  server: { icon: <Server className="w-4 h-4" />, color: '#9333EA', bg: '#581C87' },
  database: { icon: <Database className="w-4 h-4" />, color: '#FF6D00', bg: '#7C2D12' },
  dc: { icon: <Shield className="w-4 h-4" />, color: '#22C55E', bg: '#14532D' },
  file: { icon: <FileText className="w-4 h-4" />, color: '#EAB308', bg: '#713F12' },
};

const stageLabels = [
  { num: 0, name: '外部', color: '#EF4444' },
  { num: 1, name: '初始入侵', color: '#FF6D00' },
  { num: 2, name: '提权', color: '#EAB308' },
  { num: 3, name: '横向移动', color: '#0066FF' },
  { num: 4, name: '目标行动', color: '#9333EA' },
];

export function TraceResultVisualization() {
  const [selectedNode, setSelectedNode] = useState<string | null>('n3');
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [showBlocked, setShowBlocked] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [zoom, setZoom] = useState(1);

  const selected = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  // 按 stage 统计
  const stageStats = useMemo(() => {
    return stageLabels.map(s => ({
      ...s,
      count: nodes.filter(n => n.stage === s.num).length,
      compromised: nodes.filter(n => n.stage === s.num && n.compromised).length,
    }));
  }, []);

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">TR-2026060301 溯源结果可视化</h2>
              <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded">6 跳</span>
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded">5 已沦陷</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">APT-29 (Cozy Bear) · 6 跳攻击链 · 置信度 92% · 攻击耗时 24 分钟</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAnimate(!animate)} className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded-md ${animate ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {animate ? <><Pause className="w-3.5 h-3.5" />暂停动画</> : <><Play className="w-3.5 h-3.5" />播放</>}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RotateCcw className="w-3.5 h-3.5" />重置
            </button>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 rounded-md">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-500 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 rounded-md">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
      </div>

      {/* 阶段统计 */}
      <div className="grid grid-cols-5 gap-2">
        {stageStats.map(s => (
          <div key={s.num} className="bg-[#20293F] border border-[#2A354D] rounded p-2 text-center" style={{ borderColor: `${s.color}40` }}>
            <div className="text-[10px] text-slate-500 mb-0.5">阶段 {s.num}</div>
            <div className="text-sm font-medium" style={{ color: s.color }}>{s.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              <span className="text-red-400">{s.compromised}</span> / {s.count} 沦陷
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 攻击路径画布 */}
        <div className="lg:col-span-3 bg-[#111625] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A354D] bg-[#20293F]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-red-400" />攻击路径图
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                <input type="checkbox" checked={showBlocked} onChange={e => setShowBlocked(e.target.checked)} className="accent-blue-500" />
                显示拦截事件
              </label>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{nodes.length} 节点 / {edges.length} 边</span>
            </div>
          </div>

          <div className="relative overflow-auto" style={{ height: '600px' }}>
            <svg width="1000" height="600" viewBox="0 0 1000 600" style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }} className="w-full">
              {/* 阶段背景 */}
              {stageLabels.map((s, i) => {
                const x = i * 200 + 20;
                return (
                  <g key={s.num}>
                    <rect x={x} y={20} width={180} height={560} fill={`${s.color}05`} stroke={`${s.color}30`} strokeDasharray="4 4" rx="4" />
                    <text x={x + 90} y={40} fill={s.color} fontSize="11" textAnchor="middle" fontWeight="600">
                      阶段 {s.num} · {s.name}
                    </text>
                  </g>
                );
              })}

              {/* 边 */}
              {edges.map((e, i) => {
                if (e.status === 'blocked' && !showBlocked) return null;
                const from = nodes.find(n => n.id === e.from);
                const to = nodes.find(n => n.id === e.to);
                if (!from || !to) return null;
                const isSelfLoop = e.from === e.to;
                const color = e.status === 'success' ? '#EF4444' : e.status === 'blocked' ? '#22C55E' : '#94A3B8';
                const dashArray = e.status === 'blocked' ? '4 4' : '0';
                const isSelected = selectedEdge === `${e.from}-${e.to}-${i}`;

                if (isSelfLoop) {
                  return (
                    <g key={i}>
                      <circle
                        cx={from.x + 80}
                        cy={from.y - 30}
                        r="20"
                        fill="none"
                        stroke={color}
                        strokeWidth={isSelected ? 3 : 1.5}
                        strokeDasharray={dashArray}
                        onClick={() => setSelectedEdge(`${e.from}-${e.to}-${i}`)}
                        className="cursor-pointer"
                      />
                      <text x={from.x + 80} y={from.y - 50} fill={color} fontSize="10" textAnchor="middle">
                        {e.mitre}
                      </text>
                    </g>
                  );
                }

                return (
                  <g key={i}>
                    <line
                      x1={from.x + 80}
                      y1={from.y + 25}
                      x2={to.x}
                      y2={to.y + 25}
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={dashArray}
                      onClick={() => setSelectedEdge(`${e.from}-${e.to}-${i}`)}
                      className="cursor-pointer"
                    />
                    {e.status === 'success' && animate && (
                      <circle r="3" fill={color}>
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          path={`M ${from.x + 80} ${from.y + 25} L ${to.x} ${to.y + 25}`}
                        />
                      </circle>
                    )}
                    <text
                      x={(from.x + 80 + to.x) / 2}
                      y={(from.y + to.y) / 2 - 5}
                      fill={color}
                      fontSize="9"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {e.label}
                    </text>
                  </g>
                );
              })}

              {/* 节点 */}
              {nodes.map(n => {
                const cfg = nodeTypeConfig[n.type];
                const isSelected = selectedNode === n.id;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    onClick={() => setSelectedNode(n.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="160"
                      height="50"
                      rx="6"
                      fill={n.compromised ? cfg.bg : '#1F2937'}
                      stroke={isSelected ? '#3B82F6' : n.compromised ? cfg.color : '#4B5563'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <foreignObject x="8" y="6" width="20" height="20">
                      <div style={{ color: cfg.color }}>{cfg.icon}</div>
                    </foreignObject>
                    <text x="32" y="20" fill="white" fontSize="12" fontWeight="600">{n.label}</text>
                    <text x="32" y="36" fill="#94A3B8" fontSize="10" fontFamily="monospace">{n.ip}</text>
                    {n.compromised && (
                      <>
                        <circle cx="148" cy="8" r="4" fill="#EF4444">
                          {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />}
                        </circle>
                      </>
                    )}
                    {!n.compromised && (
                      <circle cx="148" cy="8" r="4" fill="#22C55E" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 详情 */}
        <div className="space-y-4">
          {selected ? (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: nodeTypeConfig[selected.type].color }}>{nodeTypeConfig[selected.type].icon}</span>
                  <h3 className="text-base font-semibold text-white">{selected.label}</h3>
                </div>
                <p className="text-xs text-slate-500 font-mono">{selected.ip}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">状态</div>
                  <div className={selected.compromised ? 'text-red-400' : 'text-green-400'}>
                    {selected.compromised ? '⚠ 已沦陷' : '✓ 已防御'}
                  </div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">风险等级</div>
                  <div className={`${
                    selected.risk === 'critical' ? 'text-red-400' :
                    selected.risk === 'high' ? 'text-orange-400' : 'text-yellow-400'
                  }`}>
                    {selected.risk === 'critical' ? '严重' : selected.risk === 'high' ? '高' : '中'}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">沦陷/防御动作</div>
                <div className="text-xs text-slate-200 bg-[#111625] border border-[#2A354D] rounded px-2 py-1.5 font-mono break-all">
                  <div className="text-slate-500 text-[10px] mb-1">{selected.details.ts}</div>
                  {selected.details.action}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">关联技术</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded font-mono">
                    {selected.details.technique}
                  </span>
                </div>
              </div>

              {selected.compromised ? (
                <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />立即隔离处置
                </button>
              ) : (
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />查看防护策略
                </button>
              )}
            </div>
          ) : null}

          {/* 攻击时间线 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />攻击时间线
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {edges.map((e, i) => {
                const from = nodes.find(n => n.id === e.from);
                const to = nodes.find(n => n.id === e.to);
                if (!from || !to) return null;
                return (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className={`shrink-0 w-2 h-2 rounded-full mt-1 ${e.status === 'success' ? 'bg-red-500' : e.status === 'blocked' ? 'bg-green-500' : 'bg-slate-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-400 font-mono text-[10px]">{e.timestamp}</div>
                      <div className="text-slate-200">
                        <span className="font-mono text-[10px]">{from.ip}</span>
                        <ChevronRight className="w-3 h-3 inline mx-0.5 text-slate-500" />
                        <span className="font-mono text-[10px]">{to.ip}</span>
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        {e.label} <span className="text-purple-400 font-mono">[{e.mitre}]</span>
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

export default TraceResultVisualization;
