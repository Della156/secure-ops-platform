'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, RefreshCw, Activity, Clock, ChevronRight,
  Target, AlertTriangle, Shield, Server, Network, Database, Lock,
  FileText, Eye, Zap, Crosshair, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';

type Tactic =
  | 'Initial Access' | 'Execution' | 'Persistence' | 'Privilege Escalation'
  | 'Defense Evasion' | 'Credential Access' | 'Discovery' | 'Lateral Movement'
  | 'Collection' | 'Command and Control' | 'Exfiltration' | 'Impact';

interface AttackBehavior {
  id: string;
  mitreId: string;
  technique: string;
  tactic: Tactic;
  description: string;
  timestamp: string;
  sourceIp: string;
  targetAsset: string;
  assetType: '主机' | '服务器' | '数据库' | '域控' | '网络设备' | '终端';
  evidence: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  killChainPhase: number; // 1-7
  confidence: number;
  count: number;
}

const behaviors: AttackBehavior[] = [
  { id: 'AB-001', mitreId: 'T1566.001', technique: '钓鱼邮件附件', tactic: 'Initial Access', description: '投递含宏代码的 Office 文档', timestamp: '2026-06-03 06:00:12', sourceIp: 'mail-srv-01', targetAsset: 'user-ws-2031', assetType: '终端', evidence: '邮件 ID: 88432，附件: invoice.docx (含 VBA 宏)', severity: 'high', killChainPhase: 1, confidence: 95, count: 3 },
  { id: 'AB-002', mitreId: 'T1059.001', technique: 'PowerShell 执行', tactic: 'Execution', description: '执行恶意 PowerShell 脚本下载 payload', timestamp: '2026-06-03 06:02:48', sourceIp: '10.10.7.31', targetAsset: 'user-ws-2031', assetType: '终端', evidence: 'EventID 4104: powershell.exe -ExecutionPolicy Bypass -enc ...', severity: 'critical', killChainPhase: 2, confidence: 100, count: 8 },
  { id: 'AB-003', mitreId: 'T1547.001', technique: '注册表 Run 键持久化', tactic: 'Persistence', description: '在 HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run 添加启动项', timestamp: '2026-06-03 06:04:18', sourceIp: '10.10.7.31', targetAsset: 'user-ws-2031', assetType: '终端', evidence: 'Sysmon EventID 13: HKCU\\...\\Run\\Updater -> C:\\Users\\...\\update.exe', severity: 'high', killChainPhase: 3, confidence: 90, count: 1 },
  { id: 'AB-004', mitreId: 'T1068', technique: '本地提权漏洞利用', tactic: 'Privilege Escalation', description: '利用 CVE-2024-30078 内核提权', timestamp: '2026-06-03 06:05:32', sourceIp: '10.10.7.31', targetAsset: 'user-ws-2031', assetType: '终端', evidence: 'EDR 告警: Win32k 漏洞利用检测，进程: svchost.exe', severity: 'critical', killChainPhase: 3, confidence: 88, count: 1 },
  { id: 'AB-005', mitreId: 'T1027', technique: '混淆文件/信息', tactic: 'Defense Evasion', description: 'Base64 编码 PowerShell 命令', timestamp: '2026-06-03 06:06:15', sourceIp: '10.10.7.31', targetAsset: 'user-ws-2031', assetType: '终端', evidence: 'Base64 解码后: (New-Object Net.WebClient).DownloadString(...)', severity: 'medium', killChainPhase: 2, confidence: 95, count: 5 },
  { id: 'AB-006', mitreId: 'T1003.001', technique: 'LSASS 凭据转储', tactic: 'Credential Access', description: '使用 Mimikatz 导出 LSASS 内存', timestamp: '2026-06-03 06:08:42', sourceIp: '10.10.7.31', targetAsset: 'user-ws-2031', assetType: '终端', evidence: 'Sysmon: mimikatz.exe 读取 lsass.dmp', severity: 'critical', killChainPhase: 4, confidence: 100, count: 2 },
  { id: 'AB-007', mitreId: 'T1018', technique: '远程系统发现', tactic: 'Discovery', description: '扫描内网主机（NetBIOS / ARP）', timestamp: '2026-06-03 06:10:18', sourceIp: '10.10.7.31', targetAsset: 'subnet 10.10.0.0/16', assetType: '网络设备', evidence: 'IDS: NetBIOS NS scan 23 主机', severity: 'high', killChainPhase: 5, confidence: 92, count: 23 },
  { id: 'AB-008', mitreId: 'T1021.002', technique: 'SMB 横向移动', tactic: 'Lateral Movement', description: '使用抓取的管理员凭据访问 file-srv-01', timestamp: '2026-06-03 06:12:48', sourceIp: '10.10.7.31', targetAsset: 'file-srv-01', assetType: '服务器', evidence: '事件 4624: Type 3 Logon, 10.10.7.31 -> 10.10.5.20', severity: 'critical', killChainPhase: 6, confidence: 95, count: 4 },
  { id: 'AB-009', mitreId: 'T1083', technique: '文件和目录发现', tactic: 'Discovery', description: '枚举 file-srv-01 共享目录', timestamp: '2026-06-03 06:13:52', sourceIp: '10.10.7.31', targetAsset: 'file-srv-01', assetType: '服务器', evidence: '4688: cmd.exe /c dir \\\\file-srv-01\\share$ /s', severity: 'high', killChainPhase: 5, confidence: 90, count: 12 },
  { id: 'AB-010', mitreId: 'T1005', technique: '本地数据收集', tactic: 'Collection', description: '压缩财务数据 23 GB', timestamp: '2026-06-03 06:18:32', sourceIp: '10.10.7.31', targetAsset: 'file-srv-01', assetType: '服务器', evidence: '7z.exe 压缩 finance-share.7z (23.4 GB)', severity: 'critical', killChainPhase: 7, confidence: 88, count: 1 },
  { id: 'AB-011', mitreId: 'T1071.001', technique: 'Web 协议 C2', tactic: 'Command and Control', description: 'HTTPS C2 回连 cdn.evil.com', timestamp: '2026-06-03 06:20:18', sourceIp: '10.10.7.31', targetAsset: 'firewall', assetType: '网络设备', evidence: 'FW 日志: TLS 连接 cdn.evil.com:443，每 5 分钟心跳', severity: 'high', killChainPhase: 7, confidence: 85, count: 18 },
  { id: 'AB-012', mitreId: 'T1041', technique: 'C2 通道数据外传', tactic: 'Exfiltration', description: '压缩数据通过 C2 通道外传', timestamp: '2026-06-03 06:24:18', sourceIp: '10.10.7.31', targetAsset: 'cdn.evil.com', assetType: '网络设备', evidence: 'NetFlow: 10.10.7.31 -> cdn.evil.com 出向 23 GB', severity: 'critical', killChainPhase: 7, confidence: 92, count: 1 },
];

const killChainPhases = [
  { num: 1, name: 'Reconnaissance', cn: '侦察' },
  { num: 2, name: 'Weaponization', cn: '武器化' },
  { num: 3, name: 'Delivery', cn: '投递' },
  { num: 4, name: 'Exploitation', cn: '利用' },
  { num: 5, name: 'Installation', cn: '安装' },
  { num: 6, name: 'Command & Control', cn: '命令控制' },
  { num: 7, name: 'Actions on Objectives', cn: '目标行动' },
];

const tacticColor: Record<Tactic, string> = {
  'Initial Access': '#FF6D00',
  'Execution': '#EAB308',
  'Persistence': '#9333EA',
  'Privilege Escalation': '#EF4444',
  'Defense Evasion': '#06B6D4',
  'Credential Access': '#EC4899',
  'Discovery': '#3B82F6',
  'Lateral Movement': '#0066FF',
  'Collection': '#84CC16',
  'Command and Control': '#F59E0B',
  'Exfiltration': '#DC2626',
  'Impact': '#991B1B',
};

const severityColor: Record<AttackBehavior['severity'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
};

const assetIcon = (type: string) => {
  const map: Record<string, React.ReactNode> = {
    '主机': <Server className="w-3.5 h-3.5" />,
    '服务器': <Server className="w-3.5 h-3.5" />,
    '数据库': <Database className="w-3.5 h-3.5" />,
    '域控': <Shield className="w-3.5 h-3.5" />,
    '网络设备': <Network className="w-3.5 h-3.5" />,
    '终端': <Server className="w-3.5 h-3.5" />,
  };
  return map[type] || <Server className="w-3.5 h-3.5" />;
};

export function AttackBehaviorAnalysis() {
  const [search, setSearch] = useState('');
  const [tacticFilter, setTacticFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('AB-002');
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  const filtered = useMemo(() => behaviors.filter(b => {
    if (search && !b.technique.includes(search) && !b.mitreId.toLowerCase().includes(search.toLowerCase()) && !b.targetAsset.includes(search)) return false;
    if (tacticFilter !== 'all' && b.tactic !== tacticFilter) return false;
    if (severityFilter !== 'all' && b.severity !== severityFilter) return false;
    return true;
  }), [search, tacticFilter, severityFilter]);

  const selected = selectedId ? behaviors.find(b => b.id === selectedId) : null;

  // 按 kill chain phase 分组
  const byPhase = killChainPhases.map(p => ({
    phase: p,
    behaviors: filtered.filter(b => b.killChainPhase === p.num),
  }));

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">攻击行为分析</h2>
            <p className="text-xs text-slate-500 mt-1">基于 MITRE ATT&CK 框架的攻击行为识别与分类</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Activity className="w-3.5 h-3.5" />AI 智能分析
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索技术/ID/目标"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={tacticFilter} onChange={e => setTacticFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部战术</option>
            <option value="Initial Access">初始访问</option>
            <option value="Execution">执行</option>
            <option value="Persistence">持久化</option>
            <option value="Privilege Escalation">权限提升</option>
            <option value="Defense Evasion">防御绕过</option>
            <option value="Credential Access">凭据访问</option>
            <option value="Discovery">发现</option>
            <option value="Lateral Movement">横向移动</option>
            <option value="Collection">收集</option>
            <option value="Command and Control">命令控制</option>
            <option value="Exfiltration">数据外传</option>
            <option value="Impact">影响</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部严重度</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      {/* Kill Chain 概览 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Cyber Kill Chain 时间线</h3>
        <div className="flex items-stretch gap-1">
          {byPhase.map(({ phase, behaviors: bs }) => {
            const isExpanded = expandedPhases.includes(phase.num);
            return (
              <div key={phase.num} className="flex-1 min-w-0">
                <button
                  onClick={() => setExpandedPhases(prev => prev.includes(phase.num) ? prev.filter(p => p !== phase.num) : [...prev, phase.num])}
                  className={`w-full p-2 rounded-t border ${bs.length > 0 ? 'bg-[#111625] border-blue-500/30' : 'bg-[#111625]/50 border-[#2A354D]'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 font-mono">Phase {phase.num}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                  </div>
                  <div className="text-xs text-white font-medium truncate">{phase.cn}</div>
                  <div className="text-[10px] text-slate-500 truncate">{phase.name}</div>
                  {bs.length > 0 && <div className="text-[10px] text-blue-400 font-mono mt-1">{bs.length} 行为</div>}
                </button>
                {isExpanded && bs.length > 0 && (
                  <div className="bg-[#111625] border-x border-b border-blue-500/30 rounded-b p-1 space-y-1">
                    {bs.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedId(b.id)}
                        className={`w-full text-left p-1.5 rounded text-xs ${selectedId === b.id ? 'bg-blue-500/20' : 'hover:bg-[#20293F]'}`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-mono text-[10px]">{b.mitreId}</span>
                          <span className="text-slate-200 truncate">{b.technique}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 行为列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">攻击行为列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filtered.map(b => {
              const tc = tacticColor[b.tactic];
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === b.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">{b.id}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{b.mitreId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${tc}20`, color: tc }}>
                      {b.tactic}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${
                      b.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      b.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                      b.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/40'
                    }`}>
                      {b.severity === 'critical' ? '严重' : b.severity === 'high' ? '高' : b.severity === 'medium' ? '中' : '低'}
                    </span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500">置信度 <span className="text-blue-400 font-mono">{b.confidence}%</span></span>
                    {b.count > 1 && <span className="text-[10px] text-orange-400">×{b.count}</span>}
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{b.technique}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{b.description}</div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                    <span className="font-mono">{b.timestamp}</span>
                    <span>·</span>
                    <span className="font-mono">{b.sourceIp}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-mono">{b.targetAsset}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 详情面板 */}
        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 font-mono">{selected.mitreId}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${tacticColor[selected.tactic]}20`, color: tacticColor[selected.tactic] }}>
                  {selected.tactic}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.technique}</h3>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">发生时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.timestamp}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">Kill Chain 阶段</div>
                <div className="text-slate-200 font-mono">Phase {selected.killChainPhase}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">来源 IP</div>
                <div className="text-blue-300 font-mono text-[10px]">{selected.sourceIp}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">目标资产</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.targetAsset}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">置信度</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${selected.confidence >= 90 ? 'bg-green-500' : selected.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${selected.confidence}%` }} />
                </div>
                <span className="text-sm text-white font-mono">{selected.confidence}%</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">检测证据</div>
              <div className="text-xs text-slate-200 bg-[#111625] border border-[#2A354D] rounded px-2 py-2 font-mono break-all leading-relaxed">
                {selected.evidence}
              </div>
            </div>

            <a href="#" className="flex items-center justify-between text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1.5 hover:bg-blue-500/20">
              查看 MITRE ATT&CK 详细技术说明
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Target className="w-3 h-3" />关联告警
              </button>
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3" />一键处置
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-8 text-center text-slate-500 text-sm">
            <Activity className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            选择一个行为查看详情
          </div>
        )}
      </div>
    </div>
  );
}

export default AttackBehaviorAnalysis;
