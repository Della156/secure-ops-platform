'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Settings, Database, Network, Server, FileText,
  Shield, Activity, CheckCircle2, AlertCircle, Clock, RefreshCw,
  Download, Filter, Layers, GitBranch, Zap, Eye, ChevronRight,
  Wifi, Cloud, Cpu, HardDrive
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: '网络流量' | '主机日志' | 'EDR' | '认证日志' | 'DNS' | 'DHCP' | '代理' | 'WAF' | '云审计' | '邮件';
  vendor: string;
  endpoint: string;
  protocol: 'Syslog' | 'Kafka' | 'HTTP/HTTPS' | 'JDBC' | 'WinRM' | 'API';
  status: 'connected' | 'syncing' | 'disconnected' | 'error';
  lastSync: string;
  eventsToday: number;
  eventsTotal: number;
  lag: number; // seconds
  retention: number; // days
  schemas: number; // 字段数
  enabled: boolean;
  health: 'excellent' | 'good' | 'fair' | 'poor';
}

const sources: DataSource[] = [
  { id: 'DS-001', name: '核心交换机 NetFlow', type: '网络流量', vendor: 'Cisco', endpoint: '10.10.1.1:9996', protocol: 'Syslog', status: 'connected', lastSync: '2s 前', eventsToday: 4852361, eventsTotal: 1840000000, lag: 2, retention: 90, schemas: 24, enabled: true, health: 'excellent' },
  { id: 'DS-002', name: '全量主机 Sysmon 日志', type: '主机日志', vendor: 'Microsoft', endpoint: 'wec-01.internal:5986', protocol: 'WinRM', status: 'connected', lastSync: '3s 前', eventsToday: 12800000, eventsTotal: 4800000000, lag: 3, retention: 180, schemas: 38, enabled: true, health: 'excellent' },
  { id: 'DS-003', name: 'CrowdStrike Falcon EDR', type: 'EDR', vendor: 'CrowdStrike', endpoint: 'https://falcon.crowdstrike.com/api', protocol: 'API', status: 'connected', lastSync: '5s 前', eventsToday: 856000, eventsTotal: 320000000, lag: 5, retention: 90, schemas: 56, enabled: true, health: 'excellent' },
  { id: 'DS-004', name: 'Windows 安全日志 (4624/4625)', type: '认证日志', vendor: 'Microsoft', endpoint: 'wec-02.internal:5986', protocol: 'WinRM', status: 'connected', lastSync: '1s 前', eventsToday: 3480000, eventsTotal: 1280000000, lag: 1, retention: 365, schemas: 32, enabled: true, health: 'excellent' },
  { id: 'DS-005', name: 'BIND DNS 查询日志', type: 'DNS', vendor: 'ISC', endpoint: '10.10.8.10:514', protocol: 'Syslog', status: 'connected', lastSync: '2s 前', eventsToday: 6820000, eventsTotal: 2480000000, lag: 2, retention: 30, schemas: 18, enabled: true, health: 'excellent' },
  { id: 'DS-006', name: 'DHCP 分配日志', type: 'DHCP', vendor: 'Infoblox', endpoint: '10.10.8.20:514', protocol: 'Syslog', status: 'connected', lastSync: '5s 前', eventsToday: 125000, eventsTotal: 45000000, lag: 5, retention: 90, schemas: 14, enabled: true, health: 'good' },
  { id: 'DS-007', name: 'Squid 代理访问日志', type: '代理', vendor: 'Squid', endpoint: '10.10.8.30:514', protocol: 'Syslog', status: 'connected', lastSync: '8s 前', eventsToday: 1250000, eventsTotal: 458000000, lag: 8, retention: 60, schemas: 16, enabled: true, health: 'good' },
  { id: 'DS-008', name: 'WAF 攻击日志', type: 'WAF', vendor: 'F5', endpoint: 'waf-01.internal:8443', protocol: 'API', status: 'connected', lastSync: '4s 前', eventsToday: 285000, eventsTotal: 102000000, lag: 4, retention: 90, schemas: 28, enabled: true, health: 'excellent' },
  { id: 'DS-009', name: 'AWS CloudTrail', type: '云审计', vendor: 'Amazon', endpoint: 's3://aws-cloudtrail-logs', protocol: 'API', status: 'syncing', lastSync: '12s 前', eventsToday: 85000, eventsTotal: 31000000, lag: 12, retention: 365, schemas: 42, enabled: true, health: 'good' },
  { id: 'DS-010', name: '阿里云 ActionTrail', type: '云审计', vendor: 'Alibaba', endpoint: 'https://actiontrail.aliyuncs.com', protocol: 'API', status: 'connected', lastSync: '10s 前', eventsToday: 42000, eventsTotal: 15000000, lag: 10, retention: 365, schemas: 38, enabled: true, health: 'good' },
  { id: 'DS-011', name: '邮件网关日志', type: '邮件', vendor: 'Proofpoint', endpoint: '10.10.8.40:514', protocol: 'Syslog', status: 'connected', lastSync: '6s 前', eventsToday: 285000, eventsTotal: 102000000, lag: 6, retention: 180, schemas: 22, enabled: true, health: 'excellent' },
  { id: 'DS-012', name: '防火墙日志 (Palo Alto)', type: '网络流量', vendor: 'Palo Alto', endpoint: 'pa-01.internal:514', protocol: 'Syslog', status: 'connected', lastSync: '3s 前', eventsToday: 1850000, eventsTotal: 658000000, lag: 3, retention: 90, schemas: 32, enabled: true, health: 'excellent' },
  { id: 'DS-013', name: 'VPN 认证日志', type: '认证日志', vendor: 'Cisco ASA', endpoint: '10.10.8.50:514', protocol: 'Syslog', status: 'error', lastSync: '5分钟前', eventsToday: 0, eventsTotal: 12500000, lag: 300, retention: 30, schemas: 12, enabled: false, health: 'poor' },
  { id: 'DS-014', name: '数据库审计 (Oracle)', type: '主机日志', vendor: 'Oracle', endpoint: 'dbaudit-01.internal:1521', protocol: 'JDBC', status: 'connected', lastSync: '2s 前', eventsToday: 428000, eventsTotal: 156000000, lag: 2, retention: 365, schemas: 26, enabled: true, health: 'excellent' },
  { id: 'DS-015', name: 'Kafka 集群总线', type: '网络流量', vendor: 'Confluent', endpoint: 'kafka-01:9092', protocol: 'Kafka', status: 'connected', lastSync: '实时', eventsToday: 28000000, eventsTotal: 10000000000, lag: 0, retention: 7, schemas: 0, enabled: true, health: 'excellent' },
];

const typeIcon: Record<DataSource['type'], React.ReactNode> = {
  '网络流量': <Network className="w-3.5 h-3.5" />,
  '主机日志': <Server className="w-3.5 h-3.5" />,
  'EDR': <Shield className="w-3.5 h-3.5" />,
  '认证日志': <Layers className="w-3.5 h-3.5" />,
  'DNS': <Wifi className="w-3.5 h-3.5" />,
  'DHCP': <Wifi className="w-3.5 h-3.5" />,
  '代理': <Cloud className="w-3.5 h-3.5" />,
  'WAF': <Shield className="w-3.5 h-3.5" />,
  '云审计': <Cloud className="w-3.5 h-3.5" />,
  '邮件': <FileText className="w-3.5 h-3.5" />,
};

const healthColor: Record<DataSource['health'], string> = {
  excellent: 'text-green-400',
  good: 'text-blue-400',
  fair: 'text-yellow-400',
  poor: 'text-red-400',
};

const statusConfig = {
  connected: { label: '已连接', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  syncing: { label: '同步中', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
  disconnected: { label: '未连接', color: 'text-slate-500', bg: 'bg-slate-500/20', icon: <AlertCircle className="w-3 h-3" /> },
  error: { label: '错误', color: 'text-red-400', bg: 'bg-red-500/20', icon: <AlertCircle className="w-3 h-3" /> },
};

export function MultiSourceIntegration() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('DS-001');

  const filtered = useMemo(() => sources.filter(s => {
    if (search && !s.name.includes(search) && !s.vendor.includes(search)) return false;
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    return true;
  }), [search, typeFilter]);

  const selected = selectedId ? sources.find(s => s.id === selectedId) : null;
  const stats = {
    total: sources.length,
    connected: sources.filter(s => s.status === 'connected').length,
    eventsToday: sources.reduce((sum, s) => sum + s.eventsToday, 0),
    avgLag: Math.round(sources.filter(s => s.enabled).reduce((s, d) => s + d.lag, 0) / sources.filter(s => s.enabled).length),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="数据源总数" value={stats.total} color="#0066FF" icon={<Database className="w-4 h-4" />} />
        <StatBox label="已连接" value={stats.connected} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="今日事件" value={`${(stats.eventsToday / 10000).toFixed(0)}万`} color="#9333EA" icon={<Zap className="w-4 h-4" />} />
        <StatBox label="平均延迟" value={`${stats.avgLag}s`} color="#EAB308" icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">多源信息整合</h2>
            <p className="text-xs text-slate-500 mt-1">15 类数据源统一接入：网络流量 / 主机日志 / EDR / 认证 / DNS / 代理 / WAF / 云审计 / 邮件</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />添加数据源
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />健康检查
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出配置
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索数据源/厂商"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="网络流量">网络流量</option>
            <option value="主机日志">主机日志</option>
            <option value="EDR">EDR</option>
            <option value="认证日志">认证日志</option>
            <option value="DNS">DNS</option>
            <option value="DHCP">DHCP</option>
            <option value="代理">代理</option>
            <option value="WAF">WAF</option>
            <option value="云审计">云审计</option>
            <option value="邮件">邮件</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">数据源列表 ({filtered.length})</h3>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[#111625] text-slate-400">
              <tr>
                <th className="text-left px-3 py-2">名称</th>
                <th className="text-left px-3 py-2">类型</th>
                <th className="text-left px-3 py-2">协议</th>
                <th className="text-left px-3 py-2">状态</th>
                <th className="text-right px-3 py-2">今日事件</th>
                <th className="text-right px-3 py-2">延迟</th>
                <th className="text-right px-3 py-2">健康</th>
                <th className="text-left px-3 py-2">最后同步</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const sc = statusConfig[s.status as keyof typeof statusConfig];
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer ${selectedId === s.id ? 'bg-[#111625]' : ''}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="text-white">{s.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{s.id} · {s.vendor}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        {typeIcon[s.type]}{s.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300 font-mono text-[10px]">{s.protocol}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-200 font-mono">{(s.eventsToday / 10000).toFixed(0)}万</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`${s.lag < 5 ? 'text-green-400' : s.lag < 15 ? 'text-yellow-400' : 'text-red-400'} font-mono`}>{s.lag}s</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`text-[10px] ${healthColor[s.health]}`}>
                        {s.health === 'excellent' ? '优秀' : s.health === 'good' ? '良好' : s.health === 'fair' ? '一般' : '差'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 text-[10px]">{s.lastSync}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selected.status as keyof typeof statusConfig].bg} ${statusConfig[selected.status as keyof typeof statusConfig].color}`}>
                  {statusConfig[selected.status as keyof typeof statusConfig].icon}{statusConfig[selected.status as keyof typeof statusConfig].label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
              <p className="text-xs text-slate-500">{selected.vendor}</p>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">端点</div>
              <div className="text-xs text-blue-300 font-mono break-all">{selected.endpoint}</div>
              <div className="text-[10px] text-slate-500 mt-1">协议: <span className="text-slate-300">{selected.protocol}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">今日事件</div>
                <div className="text-slate-200 font-mono">{(selected.eventsToday / 10000).toFixed(0)}万</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">累计事件</div>
                <div className="text-slate-200 font-mono">{(selected.eventsTotal / 100000000).toFixed(1)}亿</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">延迟</div>
                <div className={selected.lag < 5 ? 'text-green-400 font-mono' : selected.lag < 15 ? 'text-yellow-400 font-mono' : 'text-red-400 font-mono'}>{selected.lag}s</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">保留期</div>
                <div className="text-slate-200 font-mono">{selected.retention}天</div>
              </div>
            </div>

            {selected.schemas > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-1.5">字段 schema</div>
                <div className="bg-[#111625] border border-[#2A354D] rounded p-2 text-[10px] font-mono text-slate-300">
                  src_ip, src_port, dst_ip, dst_port, protocol, action, bytes, packets, ts, user_agent, ...
                  <div className="text-blue-400 mt-1">共 {selected.schemas} 个字段</div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Settings className="w-3 h-3" />配置
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                <Eye className="w-3 h-3" />查看数据
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default MultiSourceIntegration;
