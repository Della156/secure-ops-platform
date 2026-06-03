'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Plus, Edit3, Trash2, Settings, Play, Pause,
  RefreshCw, Maximize2, Filter, X, Server, Wifi, Cloud, Database,
  CheckCircle2, XCircle, AlertCircle, Clock, Activity, Cpu,
  HardDrive, Network, ChevronRight, Shield, Zap, Globe
} from 'lucide-react';

/**
 * 4.6-2 漏洞扫描工具管理
 *
 * 扫描器配置 / 状态 / 调度：
 * - 已注册扫描器列表（多类型）
 * - 状态监控：在线/离线/扫描中
 * - 调度策略：周期性/一次性
 * - 凭证管理：SSH/WMI/SNMP
 */

type ScannerType = 'host' | 'web' | 'database' | 'cloud' | 'iot' | 'container' | 'wireless';
type ScannerStatus = 'online' | 'offline' | 'scanning' | 'error';

interface Scanner {
  id: string;
  name: string;
  type: ScannerType;
  vendor: string;
  version: string;
  host: string;
  port: number;
  status: ScannerStatus;
  cpu: number;
  memory: number;
  lastScan: string;
  lastVulnCount: number;
  schedule: 'daily' | 'weekly' | 'monthly' | 'once' | 'none';
  enabled: boolean;
  description: string;
}

const scanners: Scanner[] = [
  { id: 'SC-001', name: 'Nessus 企业版', type: 'host', vendor: 'Tenable', version: '10.7.2', host: '10.1.10.50', port: 8834, status: 'scanning', cpu: 67, memory: 78, lastScan: '2026-06-02 14:00', lastVulnCount: 89, schedule: 'weekly', enabled: true, description: '企业级漏洞扫描器，覆盖全网主机' },
  { id: 'SC-002', name: 'AWVS Web 扫描', type: 'web', vendor: 'Acunetix', version: '24.3.24', host: '10.1.10.51', port: 3443, status: 'online', cpu: 23, memory: 45, lastScan: '2026-06-02 12:00', lastVulnCount: 124, schedule: 'daily', enabled: true, description: 'Web 应用漏洞扫描' },
  { id: 'SC-003', name: 'Qualys VMDR', type: 'host', vendor: 'Qualys', version: 'Cloud', host: 'cloud.qualys.com', port: 443, status: 'online', cpu: 0, memory: 0, lastScan: '2026-06-02 16:00', lastVulnCount: 234, schedule: 'daily', enabled: true, description: '云端扫描服务' },
  { id: 'SC-004', name: 'SQLmap 专项', type: 'database', vendor: 'Open Source', version: '1.8.4', host: '10.1.10.52', port: 0, status: 'scanning', cpu: 89, memory: 56, lastScan: '2026-06-02 13:30', lastVulnCount: 18, schedule: 'monthly', enabled: true, description: 'SQL 注入专项检测' },
  { id: 'SC-005', name: 'Trivy 容器扫描', type: 'container', vendor: 'Aqua Security', version: '0.50.1', host: '10.1.10.53', port: 0, status: 'online', cpu: 12, memory: 23, lastScan: '2026-06-02 15:00', lastVulnCount: 67, schedule: 'daily', enabled: true, description: '容器镜像安全扫描' },
  { id: 'SC-006', name: 'AWS Inspector', type: 'cloud', vendor: 'Amazon', version: 'Cloud', host: 'aws.amazon.com/inspector', port: 443, status: 'online', cpu: 0, memory: 0, lastScan: '2026-06-02 16:30', lastVulnCount: 45, schedule: 'daily', enabled: true, description: 'AWS 云资产漏洞评估' },
  { id: 'SC-007', name: 'OpenVAS', type: 'host', vendor: 'Greenbone', version: '22.7', host: '10.1.10.54', port: 9390, status: 'offline', cpu: 0, memory: 0, lastScan: '2026-05-30 18:00', lastVulnCount: 78, schedule: 'weekly', enabled: false, description: '开源漏洞扫描器（已停用）' },
  { id: 'SC-008', name: 'Kismet 无线扫描', type: 'wireless', vendor: 'Open Source', version: '2023-07-R1', host: '10.1.10.55', port: 0, status: 'error', cpu: 0, memory: 0, lastScan: '2026-05-28 10:00', lastVulnCount: 12, schedule: 'monthly', enabled: true, description: '无线网络安全审计' },
];

const typeConfig: Record<ScannerType, { label: string; icon: React.ReactNode; color: string }> = {
  host: { label: '主机', icon: <Server className="w-4 h-4" />, color: '#3B82F6' },
  web: { label: 'Web', icon: <Globe className="w-4 h-4" />, color: '#10B981' },
  database: { label: '数据库', icon: <Database className="w-4 h-4" />, color: '#8B5CF6' },
  cloud: { label: '云', icon: <Cloud className="w-4 h-4" />, color: '#EC4899' },
  iot: { label: 'IoT', icon: <Cpu className="w-4 h-4" />, color: '#F59E0B' },
  container: { label: '容器', icon: <Layers className="w-4 h-4" />, color: '#06B6D4' },
  wireless: { label: '无线', icon: <Wifi className="w-4 h-4" />, color: '#EF4444' },
};

const statusConfig: Record<ScannerStatus, { label: string; color: string; bg: string; ring: string }> = {
  online: { label: '在线', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', ring: 'ring-green-500/30' },
  offline: { label: '离线', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30', ring: 'ring-gray-500/30' },
  scanning: { label: '扫描中', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', ring: 'ring-blue-500/30' },
  error: { label: '异常', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', ring: 'ring-red-500/30' },
};

const scheduleLabels: Record<string, string> = {
  daily: '每日',
  weekly: '每周',
  monthly: '每月',
  once: '一次性',
  none: '未调度',
};

export function VulnScannerManager() {
  const [searchKw, setSearchKw] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    return scanners.filter(s => {
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (searchKw && !s.name.toLowerCase().includes(searchKw.toLowerCase()) && !s.host.toLowerCase().includes(searchKw.toLowerCase())) return false;
      return true;
    });
  }, [searchKw, typeFilter, statusFilter]);

  const totalScanners = scanners.length;
  const onlineCount = scanners.filter(s => s.status === 'online' || s.status === 'scanning').length;
  const scanningCount = scanners.filter(s => s.status === 'scanning').length;
  const errorCount = scanners.filter(s => s.status === 'error' || s.status === 'offline').length;

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            漏洞扫描工具管理
          </h2>
          <span className="text-xs text-gray-500">
            共 {totalScanners} 个扫描器 · {onlineCount} 在线
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            新增扫描器
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            健康检查
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '扫描器总数', value: totalScanners, color: 'blue', icon: <Settings className="w-4 h-4" /> },
          { label: '在线', value: onlineCount, color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: '扫描中', value: scanningCount, color: 'blue', icon: <Activity className="w-4 h-4" /> },
          { label: '异常/离线', value: errorCount, color: 'red', icon: <XCircle className="w-4 h-4" /> },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* 筛选栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchKw}
            onChange={e => setSearchKw(e.target.value)}
            placeholder="搜索名称或主机..."
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
          />
        </div>
        <div className="flex border border-[#2A354D] rounded overflow-hidden">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 text-xs ${typeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
          >
            全部类型
          </button>
          {(Object.keys(typeConfig) as ScannerType[]).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 text-xs flex items-center gap-1 ${
                typeFilter === t ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'
              }`}
            >
              {typeConfig[t].icon}
              {typeConfig[t].label}
            </button>
          ))}
        </div>
        <div className="flex border border-[#2A354D] rounded overflow-hidden">
          {['all', 'online', 'scanning', 'error', 'offline'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 text-xs ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'
              }`}
            >
              {s === 'all' ? '全部状态' : statusConfig[s as ScannerStatus].label}
            </button>
          ))}
        </div>
      </div>

      {/* 扫描器列表 - 卡片网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(s => {
          const type = typeConfig[s.type];
          const status = statusConfig[s.status];
          return (
            <div key={s.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}20`, color: type.color }}
                  >
                    {type.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{s.name}</div>
                    <div className="text-[10px] text-gray-500">{s.vendor} · v{s.version}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${status.bg} ${status.color} flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text-', 'bg-')} ${
                    s.status === 'scanning' ? 'animate-pulse' : ''
                  }`} />
                  {status.label}
                </span>
              </div>

              <div className="text-[10px] text-gray-500 mb-3 line-clamp-2">{s.description}</div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <div className="text-gray-500 text-[10px]">主机</div>
                  <div className="text-gray-300 font-mono">{s.host}{s.port ? `:${s.port}` : ''}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">调度</div>
                  <div className="text-gray-300">{scheduleLabels[s.schedule]}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">最近扫描</div>
                  <div className="text-gray-300">{s.lastScan.split(' ')[0]}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">最近漏洞</div>
                  <div className="text-orange-400 font-medium">{s.lastVulnCount} 个</div>
                </div>
              </div>

              {s.status === 'scanning' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <span>CPU {s.cpu}%</span>
                    <span>内存 {s.memory}%</span>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500" style={{ width: `${s.cpu}%` }} />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 pt-3 border-t border-[#2A354D]">
                <button
                  disabled={!s.enabled}
                  className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs py-1.5 rounded disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  立即扫描
                </button>
                <button className="px-2 py-1.5 text-gray-400 hover:text-white" title="编辑">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button className="px-2 py-1.5 text-gray-400 hover:text-white" title="调度">
                  <Clock className="w-3.5 h-3.5" />
                </button>
                <button className="px-2 py-1.5 text-gray-400 hover:text-red-400" title="删除">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 新增扫描器弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-[#2A354D] flex items-center justify-between">
              <h3 className="text-base font-medium text-white">注册新扫描器</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">名称 *</label>
                  <input type="text" placeholder="例如：Nessus 集群" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">类型 *</label>
                  <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                    <option value="host">主机扫描</option>
                    <option value="web">Web 扫描</option>
                    <option value="database">数据库扫描</option>
                    <option value="cloud">云扫描</option>
                    <option value="container">容器扫描</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">厂商 *</label>
                  <input type="text" placeholder="Tenable" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">版本</label>
                  <input type="text" placeholder="10.7.2" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">API 地址 *</label>
                  <input type="text" placeholder="https://10.1.10.50:8834" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">API Token *</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">调度策略</label>
                  <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                    <option value="once">一次性</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">执行时间</label>
                  <input type="time" defaultValue="02:00" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">描述</label>
                <textarea rows={2} className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
              </div>
            </div>
            <div className="p-4 border-t border-[#2A354D] flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-sm text-gray-400">取消</button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded">测试连接</button>
              <button className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VulnScannerManager;
