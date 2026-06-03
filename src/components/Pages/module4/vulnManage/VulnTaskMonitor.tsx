'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Filter, RefreshCw, Play, Pause, Square,
  Activity, Clock, CheckCircle2, XCircle, AlertCircle, Loader2,
  Server, Globe, Database, Cloud, Cpu, Layers, BarChart3, Zap
} from 'lucide-react';

/**
 * 4.6-9 漏洞管理任务状态监控
 *
 * 实时监控所有漏洞相关任务的执行状态：
 * - 扫描任务
 * - 整改任务
 * - 复测任务
 * - 风险评估任务
 */

type TaskType = 'scan' | 'rectify' | 'retest' | 'assess' | 'sync';
type TaskStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

interface Task {
  id: string;
  type: TaskType;
  name: string;
  target: string;
  status: TaskStatus;
  progress: number;
  startTime: string;
  duration: string;
  throughput: number; // 处理速率（个/分钟）
  totalItems: number;
  processedItems: number;
  errors: number;
  warnings: number;
  executor: string;
  cpu: number;
  memory: number;
}

const activeTasks: Task[] = [
  { id: 'T-9001', type: 'scan', name: '核心域主机漏洞扫描', target: '10.1.0.0/16 (87 个 IP)', status: 'running', progress: 67, startTime: '2026-06-02 14:00', duration: '52 分钟', throughput: 23, totalItems: 87, processedItems: 58, errors: 0, warnings: 2, executor: 'Nessus-01', cpu: 78, memory: 65 },
  { id: 'T-9002', type: 'rectify', name: '批量补丁部署', target: '20 台服务器', status: 'running', progress: 45, startTime: '2026-06-02 13:30', duration: '1h 22m', throughput: 1.5, totalItems: 20, processedItems: 9, errors: 1, warnings: 3, executor: 'Ansible', cpu: 45, memory: 38 },
  { id: 'T-9003', type: 'retest', name: '批量复测扫描', target: '15 个漏洞', status: 'running', progress: 33, startTime: '2026-06-02 14:20', duration: '12 分钟', throughput: 0.8, totalItems: 15, processedItems: 5, errors: 0, warnings: 0, executor: 'Nessus-02', cpu: 56, memory: 42 },
  { id: 'T-9004', type: 'assess', name: 'WebLogic 风险评估', target: 'CVE-2023-21839', status: 'running', progress: 12, startTime: '2026-06-02 14:50', duration: '2 分钟', throughput: 0, totalItems: 1, processedItems: 0, errors: 0, warnings: 0, executor: 'Risk-Engine', cpu: 23, memory: 18 },
  { id: 'T-9005', type: 'sync', name: 'NVD 漏洞库同步', target: '全量', status: 'queued', progress: 0, startTime: '待执行 16:00', duration: '-', throughput: 0, totalItems: 234567, processedItems: 0, errors: 0, warnings: 0, executor: 'NVD-API', cpu: 0, memory: 0 },
  { id: 'T-9006', type: 'rectify', name: 'WordPress 插件升级', target: 'WEB-CMS-01', status: 'paused', progress: 60, startTime: '2026-06-02 12:00', duration: '已暂停 1h 5m', throughput: 0, totalItems: 1, processedItems: 0, errors: 0, warnings: 1, executor: '手动', cpu: 0, memory: 0 },
  { id: 'T-9007', type: 'scan', name: '数据库弱口令专项', target: '10.1.30.0/24', status: 'failed', progress: 32, startTime: '2026-06-02 11:00', duration: '失败于 18 分钟', throughput: 0, totalItems: 24, processedItems: 8, errors: 1, warnings: 0, executor: 'SQLmap', cpu: 0, memory: 0 },
  { id: 'T-9008', type: 'retest', name: 'CVE-2024-3094 复测', target: '23 台主机', status: 'completed', progress: 100, startTime: '2026-06-02 10:00', duration: '15 分钟', throughput: 1.5, totalItems: 23, processedItems: 23, errors: 0, warnings: 0, executor: 'Nessus-01', cpu: 0, memory: 0 },
];

const typeConfig: Record<TaskType, { l: string; c: string; icon: React.ReactNode }> = {
  scan: { l: '扫描', c: 'text-blue-400 bg-blue-500/10', icon: <Zap className="w-3 h-3" /> },
  rectify: { l: '整改', c: 'text-green-400 bg-green-500/10', icon: <Activity className="w-3 h-3" /> },
  retest: { l: '复测', c: 'text-purple-400 bg-purple-500/10', icon: <CheckCircle2 className="w-3 h-3" /> },
  assess: { l: '评估', c: 'text-orange-400 bg-orange-500/10', icon: <BarChart3 className="w-3 h-3" /> },
  sync: { l: '同步', c: 'text-cyan-400 bg-cyan-500/10', icon: <RefreshCw className="w-3 h-3" /> },
};

const statusConfig: Record<TaskStatus, { l: string; c: string; icon: React.ReactNode }> = {
  queued: { l: '排队', c: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: <Clock className="w-3 h-3" /> },
  running: { l: '运行', c: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  paused: { l: '暂停', c: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: <Pause className="w-3 h-3" /> },
  completed: { l: '完成', c: 'bg-green-500/10 text-green-400 border-green-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  failed: { l: '失败', c: 'bg-red-500/10 text-red-400 border-red-500/30', icon: <XCircle className="w-3 h-3" /> },
  cancelled: { l: '取消', c: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: <Square className="w-3 h-3" /> },
};

export function VulnTaskMonitor() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKw, setSearchKw] = useState('');

  const filtered = useMemo(() => {
    return activeTasks.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (searchKw && !t.name.includes(searchKw) && !t.id.includes(searchKw)) return false;
      return true;
    });
  }, [typeFilter, statusFilter, searchKw]);

  // 统计
  const total = activeTasks.length;
  const running = activeTasks.filter(t => t.status === 'running').length;
  const queued = activeTasks.filter(t => t.status === 'queued').length;
  const failed = activeTasks.filter(t => t.status === 'failed').length;
  const completed = activeTasks.filter(t => t.status === 'completed').length;

  // 按类型统计
  const typeStats = useMemo(() => {
    const m: Record<string, number> = { scan: 0, rectify: 0, retest: 0, assess: 0, sync: 0 };
    activeTasks.filter(t => t.status === 'running').forEach(t => { m[t.type]++; });
    return m;
  }, []);

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            漏洞管理任务状态监控
          </h2>
          <span className="text-xs text-gray-500">{running} 个运行中 · {queued} 个排队</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: '总任务', value: total, color: 'blue', icon: <Layers className="w-4 h-4" /> },
          { label: '运行中', value: running, color: 'blue', icon: <Activity className="w-4 h-4" />, sub: '实时执行' },
          { label: '排队中', value: queued, color: 'gray', icon: <Clock className="w-4 h-4" /> },
          { label: '已失败', value: failed, color: 'red', icon: <XCircle className="w-4 h-4" />, sub: '需处理' },
          { label: '已完成', value: completed, color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* 任务类型分布 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">运行中任务类型分布</h3>
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(typeConfig) as TaskType[]).map(t => (
            <div key={t} className="bg-[#111625] rounded p-2 text-center">
              <div className={`text-lg font-bold ${typeConfig[t].c.split(' ')[0]}`}>{typeStats[t]}</div>
              <div className="text-[10px] text-gray-500">{typeConfig[t].l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 筛选 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchKw}
            onChange={e => setSearchKw(e.target.value)}
            placeholder="搜索任务名 / ID..."
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
          />
        </div>
        <div className="flex border border-[#2A354D] rounded overflow-hidden">
          {[
            { v: 'all', l: '全部' },
            ...(Object.keys(typeConfig) as TaskType[]).map(t => ({ v: t, l: typeConfig[t].l })),
          ].map(f => (
            <button
              key={f.v}
              onClick={() => setTypeFilter(f.v)}
              className={`px-2.5 py-1 text-xs ${typeFilter === f.v ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
            >
              {f.l}
            </button>
          ))}
        </div>
        <div className="flex border border-[#2A354D] rounded overflow-hidden">
          {[
            { v: 'all', l: '全部' },
            ...(Object.keys(statusConfig) as TaskStatus[]).map(s => ({ v: s, l: statusConfig[s].l })),
          ].map(f => (
            <button
              key={f.v}
              onClick={() => setStatusFilter(f.v)}
              className={`px-2.5 py-1 text-xs ${statusFilter === f.v ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-2">
        {filtered.map(t => {
          const tc = typeConfig[t.type];
          const sc = statusConfig[t.status];
          return (
            <div key={t.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tc.c}`}>
                    {tc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-mono">{t.id}</span>
                      <span className="text-sm font-medium text-white">{t.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${tc.c}`}>{tc.l}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      目标: <span className="text-white font-mono text-[11px]">{t.target}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${sc.c}`}>
                  {sc.icon} {sc.l}
                </span>
              </div>

              {t.status === 'running' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span>进度 {t.processedItems}/{t.totalItems}</span>
                    <span>{t.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                <div>
                  <div className="text-gray-500 text-[10px]">开始</div>
                  <div className="text-white text-[11px]">{t.startTime}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">耗时</div>
                  <div className="text-white text-[11px]">{t.duration}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">速率</div>
                  <div className="text-white text-[11px]">{t.throughput > 0 ? `${t.throughput} 个/分` : '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">CPU / 内存</div>
                  <div className="text-white text-[11px]">{t.cpu}% / {t.memory}%</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">执行器</div>
                  <div className="text-white text-[11px]">{t.executor}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">错误 / 警告</div>
                  <div className="text-[11px]">
                    {t.errors > 0 ? <span className="text-red-400">{t.errors}</span> : <span className="text-gray-500">0</span>}
                    {' / '}
                    {t.warnings > 0 ? <span className="text-yellow-400">{t.warnings}</span> : <span className="text-gray-500">0</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 pt-3 mt-3 border-t border-[#2A354D]">
                {t.status === 'running' && (
                  <>
                    <button className="text-xs text-yellow-400 hover:text-yellow-300 mr-2 flex items-center gap-1">
                      <Pause className="w-3 h-3" /> 暂停
                    </button>
                    <button className="text-xs text-red-400 hover:text-red-300 mr-2 flex items-center gap-1">
                      <Square className="w-3 h-3" /> 停止
                    </button>
                  </>
                )}
                {t.status === 'paused' && (
                  <button className="text-xs text-green-400 hover:text-green-300 mr-2 flex items-center gap-1">
                    <Play className="w-3 h-3" /> 继续
                  </button>
                )}
                {t.status === 'failed' && (
                  <button className="text-xs text-blue-400 hover:text-blue-300 mr-2 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> 重试
                  </button>
                )}
                <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">查看日志</button>
                <button className="text-xs text-gray-400 hover:text-gray-300">详情</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VulnTaskMonitor;
