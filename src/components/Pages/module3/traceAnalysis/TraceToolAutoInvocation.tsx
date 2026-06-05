'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Play, Pause, Settings, Zap, Cpu, Server, Network,
  Database, Globe, Shield, Terminal, Eye, Download, CheckCircle2,
  AlertCircle, Clock, Activity, ChevronRight, Box, Layers, Wrench,
  Workflow, FileCode, ArrowRight, RefreshCw
} from 'lucide-react';

interface TraceTool {
  id: string;
  name: string;
  type: '流量分析' | '日志分析' | '样本分析' | '威胁情报' | '资产查询' | '拓扑分析' | 'EDR' | '沙箱';
  vendor: string;
  version: string;
  endpoint: string;
  status: 'online' | 'offline' | 'busy' | 'maintenance';
  capacity: number; // 0-100
  latency: number; // ms
  successRate: number;
  totalCalls: number;
  todayCalls: number;
  avgDuration: number; // seconds
  capabilities: string[];
  enabled: boolean;
}

const tools: TraceTool[] = [
  { id: 'TT-001', name: 'Wireshark 流量回溯', type: '流量分析', vendor: 'Wireshark Foundation', version: '4.2.0', endpoint: 'https://trace-net-01:9090/api', status: 'online', capacity: 45, latency: 120, successRate: 98, totalCalls: 1845, todayCalls: 42, avgDuration: 18, capabilities: ['PCAP 解析', '协议还原', '会话提取', 'DNS 重放'], enabled: true },
  { id: 'TT-002', name: 'Splunk 日志检索', type: '日志分析', vendor: 'Splunk Inc.', version: '9.2.1', endpoint: 'https://splunk-01:8089/services', status: 'online', capacity: 68, latency: 230, successRate: 99, totalCalls: 5621, todayCalls: 156, avgDuration: 8, capabilities: ['SPL 查询', '多源关联', '时间窗统计', '告警触发'], enabled: true },
  { id: 'TT-003', name: 'VirusTotal 样本查询', type: '威胁情报', vendor: 'Google', version: 'API v3', endpoint: 'https://www.virustotal.com/api/v3', status: 'online', capacity: 22, latency: 580, successRate: 96, totalCalls: 892, todayCalls: 28, avgDuration: 4, capabilities: ['哈希查询', '行为分析', '家族识别', 'IOC 关联'], enabled: true },
  { id: 'TT-004', name: '微步在线 X情报', type: '威胁情报', vendor: '微步在线', version: 'API v2', endpoint: 'https://api.threatbook.cn/v3', status: 'online', capacity: 15, latency: 350, successRate: 97, totalCalls: 1247, todayCalls: 38, avgDuration: 3, capabilities: ['IP 信誉', '域名信誉', '样本分析', '家族归因'], enabled: true },
  { id: 'TT-005', name: 'Cuckoo 沙箱', type: '样本分析', vendor: 'Cuckoo Sandbox', version: '2.0.7', endpoint: 'https://sandbox-01:8000', status: 'busy', capacity: 92, latency: 450, successRate: 89, totalCalls: 234, todayCalls: 12, avgDuration: 180, capabilities: ['动态执行', 'API 监控', '网络行为', '自启动检测'], enabled: true },
  { id: 'TT-006', name: 'CrowdStrike EDR', type: 'EDR', vendor: 'CrowdStrike', version: 'Falcon 6.50', endpoint: 'https://falcon.crowdstrike.com', status: 'online', capacity: 38, latency: 180, successRate: 99, totalCalls: 3128, todayCalls: 89, avgDuration: 5, capabilities: ['进程监控', '文件监控', '注册表', '网络连接'], enabled: true },
  { id: 'TT-007', name: 'CMDB 资产查询', type: '资产查询', vendor: '自研', version: 'v3.2', endpoint: 'https://cmdb.internal/api', status: 'online', capacity: 12, latency: 45, successRate: 100, totalCalls: 8932, todayCalls: 234, avgDuration: 1, capabilities: ['IP 反查', '主机属性', '负责人查询', '应用归属'], enabled: true },
  { id: 'TT-008', name: '网络拓扑分析', type: '拓扑分析', vendor: '自研', version: 'v2.5', endpoint: 'https://topo.internal/api', status: 'online', capacity: 28, latency: 320, successRate: 94, totalCalls: 562, todayCalls: 18, avgDuration: 25, capabilities: ['路径计算', '可达性分析', 'ACL 影响', 'VLAN 拓扑'], enabled: true },
  { id: 'TT-009', name: 'Microsoft Defender', type: 'EDR', vendor: 'Microsoft', version: '2024.4', endpoint: 'https://api.securitycenter.microsoft.com', status: 'online', capacity: 55, latency: 220, successRate: 98, totalCalls: 1456, todayCalls: 42, avgDuration: 6, capabilities: ['威胁检测', 'EDR 调查', '高级搜索', '响应动作'], enabled: true },
  { id: 'TT-010', name: 'CarbonBlack EDR', type: 'EDR', vendor: 'VMware', version: '7.3.0', endpoint: 'https://cb.carbonblack.io', status: 'maintenance', capacity: 0, latency: 0, successRate: 92, totalCalls: 723, todayCalls: 0, avgDuration: 7, capabilities: ['进程追踪', '威胁狩猎', 'IOC 扫描', '隔离响应'], enabled: false },
  { id: 'TT-011', name: 'ELK 日志聚合', type: '日志分析', vendor: 'Elastic', version: '8.12', endpoint: 'https://elk-01:9200', status: 'online', capacity: 48, latency: 150, successRate: 97, totalCalls: 4285, todayCalls: 112, avgDuration: 6, capabilities: ['DSL 查询', '聚合统计', '可视化', '告警'], enabled: true },
  { id: 'TT-012', name: 'MaxMind GeoIP', type: '威胁情报', vendor: 'MaxMind', endpoint: 'https://geoip.maxmind.com', version: 'API v2', status: 'online', capacity: 8, latency: 90, successRate: 99, totalCalls: 2138, todayCalls: 58, avgDuration: 1, capabilities: ['IP 地理', 'ASN 查询', '运营商', '时区'], enabled: true },
];

const toolTypeIcon: Record<TraceTool['type'], React.ReactNode> = {
  '流量分析': <Network className="w-3.5 h-3.5" />,
  '日志分析': <FileCode className="w-3.5 h-3.5" />,
  '样本分析': <Box className="w-3.5 h-3.5" />,
  '威胁情报': <Globe className="w-3.5 h-3.5" />,
  '资产查询': <Database className="w-3.5 h-3.5" />,
  '拓扑分析': <Layers className="w-3.5 h-3.5" />,
  'EDR': <Shield className="w-3.5 h-3.5" />,
  '沙箱': <Cpu className="w-3.5 h-3.5" />,
};

const statusConfig = {
  online: { label: '在线', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  offline: { label: '离线', color: 'text-slate-500', bg: 'bg-slate-500/20', icon: <AlertCircle className="w-3 h-3" /> },
  busy: { label: '繁忙', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: <Activity className="w-3 h-3 animate-pulse" /> },
  maintenance: { label: '维护中', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <Settings className="w-3 h-3" /> },
};

const callChain = [
  { step: 1, tool: 'CMDB 资产查询', action: 'IP 反查资产信息', duration: '0.8s', result: '10.10.7.31 → user-ws-2031' },
  { step: 2, tool: 'CrowdStrike EDR', action: '查询进程活动', duration: '1.2s', result: '发现 svchost.exe 异常' },
  { step: 3, tool: 'Splunk 日志检索', action: '关联 4624/4625 事件', duration: '2.4s', result: '发现 8 次失败登录后 1 次成功' },
  { step: 4, tool: '微步在线 X情报', action: '查询 C2 IP 信誉', duration: '1.5s', result: 'cdn.evil.com 为高危 C2' },
  { step: 5, tool: 'VirusTotal 样本查询', action: '查询文件哈希', duration: '0.6s', result: 'update.exe 命中 32/72 引擎' },
  { step: 6, tool: '网络拓扑分析', action: '计算攻击路径', duration: '4.2s', result: '绘制 6 跳攻击链' },
  { step: 7, tool: 'Cuckoo 沙箱', action: '动态执行样本', duration: '180s', result: '确认勒索行为' },
];

export function TraceToolAutoInvocation() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('TT-001');

  const filtered = useMemo(() => tools.filter(t => {
    if (search && !t.name.includes(search) && !t.vendor.includes(search)) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    return true;
  }), [search, typeFilter]);

  const selected = selectedId ? tools.find(t => t.id === selectedId) : null;

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">溯源工具自动调用</h2>
            <p className="text-xs text-slate-500 mt-1">为溯源分析自动调度 12 类溯源工具：流量/日志/样本/情报/资产/拓扑/EDR/沙箱</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Wrench className="w-3.5 h-3.5" />添加工具
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
              type="text" placeholder="搜索工具名/厂商"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="流量分析">流量分析</option>
            <option value="日志分析">日志分析</option>
            <option value="样本分析">样本分析</option>
            <option value="威胁情报">威胁情报</option>
            <option value="资产查询">资产查询</option>
            <option value="拓扑分析">拓扑分析</option>
            <option value="EDR">EDR</option>
            <option value="沙箱">沙箱</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 工具网格 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">已注册工具 ({filtered.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
            {filtered.map(t => {
              const sc = statusConfig[t.status as keyof typeof statusConfig];
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`bg-[#111625] border rounded p-3 cursor-pointer ${selectedId === t.id ? 'border-blue-500' : 'border-[#2A354D] hover:border-blue-500/50'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center">
                        {toolTypeIcon[t.type]}
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium line-clamp-1">{t.name}</div>
                        <div className="text-[10px] text-slate-500">{t.vendor} · v{t.version}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
                    <div>
                      <div className="text-slate-500 mb-0.5">容量</div>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1 bg-[#20293F] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.capacity > 80 ? 'bg-red-500' : t.capacity > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${t.capacity}%` }} />
                        </div>
                        <span className="text-slate-300 font-mono w-7 text-right">{t.capacity}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-0.5">成功率</div>
                      <div className="text-slate-200 font-mono">{t.successRate}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-0.5">今日调用</div>
                      <div className="text-blue-300 font-mono">{t.todayCalls} 次</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-0.5">平均耗时</div>
                      <div className="text-slate-200 font-mono">{t.avgDuration}s</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {t.capabilities.slice(0, 3).map(cap => (
                      <span key={cap} className="text-[10px] px-1.5 py-0.5 bg-[#20293F] text-slate-400 rounded">{cap}</span>
                    ))}
                    {t.capabilities.length > 3 && <span className="text-[10px] text-slate-500">+{t.capabilities.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 工具详情 + 调用链 */}
        <div className="space-y-4">
          {selected && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-slate-500 font-mono">{selected.id}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selected.status as keyof typeof statusConfig].bg} ${statusConfig[selected.status as keyof typeof statusConfig].color}`}>
                    {statusConfig[selected.status as keyof typeof statusConfig].icon}{statusConfig[selected.status as keyof typeof statusConfig].label}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
                <p className="text-xs text-slate-500">{selected.vendor} · v{selected.version}</p>
              </div>

              <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
                <div className="text-[10px] text-slate-500 mb-0.5">端点地址</div>
                <div className="text-xs text-blue-300 font-mono break-all">{selected.endpoint}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">累计调用</div>
                  <div className="text-slate-200 font-mono">{selected.totalCalls.toLocaleString()}</div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">今日调用</div>
                  <div className="text-blue-300 font-mono">{selected.todayCalls}</div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">平均延迟</div>
                  <div className="text-slate-200 font-mono">{selected.latency}ms</div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-slate-500 mb-0.5">平均耗时</div>
                  <div className="text-slate-200 font-mono">{selected.avgDuration}s</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">能力清单</div>
                <div className="flex flex-wrap gap-1">
                  {selected.capabilities.map(cap => (
                    <span key={cap} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded">{cap}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Settings className="w-3 h-3" />配置
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" />测试调用
                </button>
              </div>
            </div>
          )}

          {/* 工具调用链示例 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-blue-400" />
              工具调用链示例
            </h3>
            <p className="text-xs text-slate-500 mb-3">溯源任务 TR-2026060301</p>
            <div className="space-y-1.5">
              {callChain.map((c, i) => (
                <div key={c.step} className="flex items-start gap-2">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-mono mt-0.5">
                    {c.step}
                  </div>
                  <div className="flex-1 min-w-0 bg-[#111625] rounded p-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-white font-medium">{c.tool}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.duration}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mb-0.5">{c.action}</div>
                    <div className="text-[10px] text-green-400">→ {c.result}</div>
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

export default TraceToolAutoInvocation;
