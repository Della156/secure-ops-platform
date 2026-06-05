'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Plus, Play, Pause, Square, RefreshCw, X,
  Server, Globe, Database, Cloud, Cpu, Layers, Wifi, Shield,
  Activity, Clock, CheckCircle2, XCircle, AlertCircle, Loader2,
  Calendar, Settings, FileText, Target, BarChart3, Zap
} from 'lucide-react';

/**
 * 4.6-3 漏洞扫描执行
 *
 * 扫描任务创建 / 调度 / 监控：
 * - 创建扫描任务（指定资产范围 + 扫描策略 + 调度）
 * - 实时监控正在执行的扫描（进度、漏洞数）
 * - 历史任务检索
 */

type ScanStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
type ScanType = 'full' | 'quick' | 'incremental' | 'compliance' | 'web' | 'auth';

interface ScanTask {
  id: string;
  name: string;
  scanner: string;
  scannerType: 'host' | 'web' | 'database' | 'cloud' | 'container';
  targetCount: number;
  targetPreview: string;
  scanType: ScanType;
  status: ScanStatus;
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  vulnFound: { critical: number; high: number; medium: number; low: number };
  schedule: 'now' | 'once' | 'daily' | 'weekly' | 'monthly';
  createdBy: string;
}

const activeTasks: ScanTask[] = [
  {
    id: 'ST-2026-0001',
    name: '核心业务系统紧急扫描',
    scanner: 'Nessus 企业版',
    scannerType: 'host',
    targetCount: 87,
    targetPreview: '10.1.0.0/24, 10.2.0.0/24',
    scanType: 'full',
    status: 'running',
    progress: 67,
    startTime: '2026-06-02 14:00:00',
    vulnFound: { critical: 2, high: 8, medium: 23, low: 45 },
    schedule: 'now',
    createdBy: '张伟',
  },
  {
    id: 'ST-2026-0002',
    name: 'Web 应用 OWASP Top 10 扫描',
    scanner: 'AWVS Web 扫描',
    scannerType: 'web',
    targetCount: 12,
    targetPreview: 'https://*.company.com',
    scanType: 'web',
    status: 'running',
    progress: 34,
    startTime: '2026-06-02 14:30:00',
    vulnFound: { critical: 0, high: 3, medium: 7, low: 12 },
    schedule: 'now',
    createdBy: '李娜',
  },
  {
    id: 'ST-2026-0003',
    name: '数据库弱口令专项',
    scanner: 'SQLmap 专项',
    scannerType: 'database',
    targetCount: 24,
    targetPreview: '10.1.30.0/24',
    scanType: 'auth',
    status: 'queued',
    progress: 0,
    startTime: '2026-06-02 15:30:00',
    vulnFound: { critical: 0, high: 0, medium: 0, low: 0 },
    schedule: 'now',
    createdBy: '王强',
  },
];

const historyTasks: ScanTask[] = [
  {
    id: 'ST-2026-0000', name: '周一全网基线扫描', scanner: 'Qualys VMDR', scannerType: 'host',
    targetCount: 1302, targetPreview: '10.0.0.0/8', scanType: 'full',
    status: 'completed', progress: 100, startTime: '2026-06-01 02:00:00', endTime: '2026-06-01 06:42:00', duration: '4h42m',
    vulnFound: { critical: 5, high: 23, medium: 87, low: 156 }, schedule: 'daily', createdBy: '系统',
  },
  {
    id: 'ST-2026-9989', name: '周末漏洞巡检', scanner: 'Nessus 企业版', scannerType: 'host',
    targetCount: 856, targetPreview: '10.1.0.0/16', scanType: 'incremental',
    status: 'completed', progress: 100, startTime: '2026-05-31 22:00:00', endTime: '2026-06-01 02:15:00', duration: '4h15m',
    vulnFound: { critical: 1, high: 8, medium: 32, low: 78 }, schedule: 'weekly', createdBy: '系统',
  },
  {
    id: 'ST-2026-9988', name: '等保合规检测', scanner: 'OpenVAS', scannerType: 'host',
    targetCount: 200, targetPreview: '等保三级资产', scanType: 'compliance',
    status: 'failed', progress: 45, startTime: '2026-05-30 18:00:00',
    vulnFound: { critical: 0, high: 0, medium: 0, low: 0 }, schedule: 'once', createdBy: '赵敏',
  },
];

const scanTypeLabels: Record<ScanType, string> = {
  full: '全面扫描',
  quick: '快速扫描',
  incremental: '增量扫描',
  compliance: '合规扫描',
  web: 'Web 应用',
  auth: '认证扫描',
};

const statusConfig: Record<ScanStatus, { label: string; color: string; bg: string }> = {
  queued: { label: '排队中', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' },
  running: { label: '运行中', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  paused: { label: '已暂停', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  cancelled: { label: '已取消', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' },
};

const scannerTypeIcons = {
  host: <Server className="w-4 h-4" />,
  web: <Globe className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  cloud: <Cloud className="w-4 h-4" />,
  container: <Layers className="w-4 h-4" />,
};

export function VulnScanExecute() {
  const [tab, setTab] = useState<'active' | 'history' | 'create'>('active');
  const [searchKw, setSearchKw] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchKw) return historyTasks;
    return historyTasks.filter(t => t.name.includes(searchKw) || t.id.includes(searchKw));
  }, [searchKw]);

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            漏洞扫描执行
          </h2>
          <span className="text-xs text-gray-500">
            {activeTasks.filter(t => t.status === 'running').length} 个运行中 · {activeTasks.filter(t => t.status === 'queued').length} 个排队
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            新建扫描任务
          </button>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-[#2A354D]">
        {[
          { v: 'active' as const, l: '活跃任务', count: activeTasks.length },
          { v: 'history' as const, l: '历史任务', count: historyTasks.length },
          { v: 'create' as const, l: '创建任务', count: 0 },
        ].map(t => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              tab === t.v
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.l} {t.count > 0 && <span className="ml-1 text-[10px] text-gray-500">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* 活跃任务 */}
      {tab === 'active' && (
        <div className="space-y-3">
          {activeTasks.map(t => {
            const status = statusConfig[t.status as keyof typeof statusConfig];
            const totalVuln = t.vulnFound.critical + t.vulnFound.high + t.vulnFound.medium + t.vulnFound.low;
            return (
              <div key={t.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      {scannerTypeIcons[t.scannerType]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{t.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {t.id} · {t.scanner} · {t.targetCount} 个目标
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${status.bg} ${status.color} flex items-center gap-1`}>
                    {t.status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                    {status.label}
                  </span>
                </div>

                <div className="text-[10px] text-gray-500 mb-2 font-mono">{t.targetPreview}</div>

                {t.status === 'running' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <span>扫描进度</span>
                      <span>{t.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {t.status === 'running' && totalVuln > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: '严重', value: t.vulnFound.critical, color: 'red' },
                      { label: '高危', value: t.vulnFound.high, color: 'orange' },
                      { label: '中危', value: t.vulnFound.medium, color: 'yellow' },
                      { label: '低危', value: t.vulnFound.low, color: 'blue' },
                    ].map((v, i) => (
                      <div key={i} className="bg-[#111625] rounded p-2 text-center">
                        <div className={`text-lg font-bold text-${v.color}-400`}>{v.value}</div>
                        <div className="text-[10px] text-gray-500">{v.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-3 border-t border-[#2A354D]">
                  <span>开始: {t.startTime}</span>
                  <div className="flex items-center gap-1">
                    {t.status === 'running' && (
                      <>
                        <button className="px-2 py-1 text-yellow-400 hover:bg-yellow-500/10 rounded flex items-center gap-1">
                          <Pause className="w-3 h-3" />
                          暂停
                        </button>
                        <button className="px-2 py-1 text-red-400 hover:bg-red-500/10 rounded flex items-center gap-1">
                          <Square className="w-3 h-3" />
                          停止
                        </button>
                      </>
                    )}
                    {t.status === 'queued' && (
                      <button className="px-2 py-1 text-red-400 hover:bg-red-500/10 rounded flex items-center gap-1">
                        <X className="w-3 h-3" />
                        取消排队
                      </button>
                    )}
                    <button className="px-2 py-1 text-blue-400 hover:bg-blue-500/10 rounded">查看详情</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 历史任务 */}
      {tab === 'history' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="p-3 border-b border-[#2A354D] flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchKw}
                onChange={e => setSearchKw(e.target.value)}
                placeholder="搜索任务名 / ID..."
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
              />
            </div>
            <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-[#2A354D] bg-[#111625]/30">
                <th className="text-left py-2 px-3 font-medium">任务 ID</th>
                <th className="text-left py-2 px-3 font-medium">任务名称</th>
                <th className="text-left py-2 px-3 font-medium">扫描器</th>
                <th className="text-center py-2 px-3 font-medium">目标</th>
                <th className="text-center py-2 px-3 font-medium">类型</th>
                <th className="text-center py-2 px-3 font-medium">状态</th>
                <th className="text-center py-2 px-3 font-medium">严重</th>
                <th className="text-center py-2 px-3 font-medium">高危</th>
                <th className="text-center py-2 px-3 font-medium">中危</th>
                <th className="text-center py-2 px-3 font-medium">低危</th>
                <th className="text-center py-2 px-3 font-medium">耗时</th>
                <th className="text-center py-2 px-3 font-medium">创建人</th>
                <th className="text-center py-2 px-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(t => {
                const status = statusConfig[t.status as keyof typeof statusConfig];
                return (
                  <tr key={t.id} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                    <td className="py-2 px-3 font-mono text-xs text-blue-400">{t.id}</td>
                    <td className="py-2 px-3 text-white">{t.name}</td>
                    <td className="py-2 px-3 text-gray-300 text-xs">{t.scanner}</td>
                    <td className="py-2 px-3 text-center text-gray-400">{t.targetCount}</td>
                    <td className="py-2 px-3 text-center text-gray-400 text-xs">{scanTypeLabels[t.scanType]}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${status.bg} ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="py-2 px-3 text-center text-red-400 font-medium">{t.vulnFound.critical}</td>
                    <td className="py-2 px-3 text-center text-orange-400 font-medium">{t.vulnFound.high}</td>
                    <td className="py-2 px-3 text-center text-yellow-400">{t.vulnFound.medium}</td>
                    <td className="py-2 px-3 text-center text-blue-400">{t.vulnFound.low}</td>
                    <td className="py-2 px-3 text-center text-gray-500 text-xs">{t.duration || '-'}</td>
                    <td className="py-2 px-3 text-center text-gray-400 text-xs">{t.createdBy}</td>
                    <td className="py-2 px-3 text-center">
                      <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">报告</button>
                      <button className="text-xs text-green-400 hover:text-green-300">复用</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 创建任务 */}
      {tab === 'create' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-5 max-w-3xl">
          <h3 className="text-base font-medium text-white mb-4">创建扫描任务</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">任务名称 *</label>
              <input type="text" placeholder="例如：核心域季度扫描" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">扫描器 *</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                  <option>Nessus 企业版 (10.1.10.50)</option>
                  <option>AWVS Web 扫描 (10.1.10.51)</option>
                  <option>Qualys VMDR (云)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">扫描类型 *</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                  {Object.entries(scanTypeLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">目标资产范围 *</label>
              <textarea
                rows={3}
                placeholder="支持以下格式：&#10;1. IP 段：10.1.0.0/24&#10;2. IP 列表：10.1.0.1, 10.1.0.2&#10;3. 资产组：核心服务器组&#10;4. 资产标签：tag:production"
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">调度 *</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                  <option value="now">立即执行</option>
                  <option value="once">定时执行</option>
                  <option value="daily">每日循环</option>
                  <option value="weekly">每周循环</option>
                  <option value="monthly">每月循环</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">凭证</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                  <option>默认 Linux 凭证</option>
                  <option>Windows 域账户</option>
                  <option>数据库管理员</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">扫描策略</label>
              <div className="grid grid-cols-2 gap-2">
                {['基线配置检测', '弱口令检测', 'CVE 库匹配', '自定义插件'].map((s, i) => (
                  <label key={i} className="flex items-center gap-2 bg-[#111625] border border-[#2A354D] rounded p-2 text-xs">
                    <input type="checkbox" defaultChecked={i < 2} className="rounded" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-[#2A354D]">
            <button className="px-4 py-1.5 text-sm text-gray-400">取消</button>
            <button className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              启动扫描
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VulnScanExecute;
