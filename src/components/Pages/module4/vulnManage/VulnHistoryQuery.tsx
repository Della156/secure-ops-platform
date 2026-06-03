'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Filter, Calendar, Clock, Activity, CheckCircle2,
  XCircle, AlertCircle, FileText, Eye, BarChart3, ChevronDown
} from 'lucide-react';

/**
 * 4.6-10 漏洞管理任务历史查询
 *
 * 历史任务多维度检索：
 * - 时间范围 / 类型 / 状态 / 执行人
 * - 高级筛选
 * - 历史趋势统计
 */

type TaskType = 'scan' | 'rectify' | 'retest' | 'assess' | 'sync';
type TaskStatus = 'completed' | 'failed' | 'cancelled';

interface HistoryTask {
  id: string;
  type: TaskType;
  name: string;
  target: string;
  status: TaskStatus;
  startTime: string;
  endTime: string;
  duration: string;
  executor: string;
  creator: string;
  vulnFound: { critical: number; high: number; medium: number; low: number };
  affectedAssets: number;
  logSize: string;
}

// 大量 mock 数据
const historyTasks: HistoryTask[] = [
  { id: 'H-1001', type: 'scan', name: '周一全网基线扫描', target: '10.0.0.0/8', status: 'completed', startTime: '2026-06-01 02:00', endTime: '2026-06-01 06:42', duration: '4h 42m', executor: 'Nessus-01', creator: '系统', vulnFound: { critical: 5, high: 23, medium: 87, low: 156 }, affectedAssets: 423, logSize: '156 MB' },
  { id: 'H-1002', type: 'scan', name: 'Web 应用专项扫描', target: 'https://*.company.com', status: 'completed', startTime: '2026-05-31 22:00', endTime: '2026-06-01 02:15', duration: '4h 15m', executor: 'AWVS-01', creator: '李娜', vulnFound: { critical: 1, high: 8, medium: 32, low: 78 }, affectedAssets: 156, logSize: '89 MB' },
  { id: 'H-1003', type: 'rectify', name: 'Linux 内核批量升级', target: '35 台服务器', status: 'completed', startTime: '2026-05-30 18:00', endTime: '2026-05-30 22:30', duration: '4h 30m', executor: 'Ansible-01', creator: '赵敏', vulnFound: { critical: 0, high: 0, medium: 0, low: 0 }, affectedAssets: 35, logSize: '23 MB' },
  { id: 'H-1004', type: 'retest', name: '月度复测扫描', target: '200 个漏洞', status: 'completed', startTime: '2026-05-30 14:00', endTime: '2026-05-30 18:00', duration: '4h 0m', executor: 'Nessus-02', creator: '系统', vulnFound: { critical: 2, high: 5, medium: 18, low: 0 }, affectedAssets: 87, logSize: '67 MB' },
  { id: 'H-1005', type: 'assess', name: '等保合规评估', target: '三级资产', status: 'completed', startTime: '2026-05-29 09:00', endTime: '2026-05-29 17:00', duration: '8h 0m', executor: 'Risk-Engine', creator: '张伟', vulnFound: { critical: 0, high: 12, medium: 34, low: 89 }, affectedAssets: 200, logSize: '12 MB' },
  { id: 'H-1006', type: 'scan', name: '应急漏洞扫描', target: '互联网资产', status: 'completed', startTime: '2026-05-28 14:00', endTime: '2026-05-28 16:30', duration: '2h 30m', executor: 'Nessus-01', creator: '王强', vulnFound: { critical: 3, high: 7, medium: 12, low: 23 }, affectedAssets: 56, logSize: '34 MB' },
  { id: 'H-1007', type: 'sync', name: 'NVD 漏洞库同步', target: '全量', status: 'completed', startTime: '2026-05-28 04:00', endTime: '2026-05-28 04:15', duration: '15m', executor: 'NVD-API', creator: '系统', vulnFound: { critical: 0, high: 0, medium: 0, low: 0 }, affectedAssets: 0, logSize: '256 MB' },
  { id: 'H-1008', type: 'rectify', name: 'Apache Struts 补丁部署', target: 'APP-SERVER-08', status: 'failed', startTime: '2026-05-27 22:00', endTime: '2026-05-27 22:18', duration: '18m (失败)', executor: 'Ansible-02', creator: '李娜', vulnFound: { critical: 0, high: 0, medium: 0, low: 0 }, affectedAssets: 0, logSize: '2 MB' },
  { id: 'H-1009', type: 'scan', name: '数据库弱口令专项', target: '10.1.30.0/24', status: 'failed', startTime: '2026-05-27 18:00', endTime: '2026-05-27 18:12', duration: '12m (失败)', executor: 'SQLmap-01', creator: '王强', vulnFound: { critical: 0, high: 0, medium: 0, low: 0 }, affectedAssets: 0, logSize: '1 MB' },
  { id: 'H-1010', type: 'retest', name: '高危漏洞复测', target: '20 个高危', status: 'completed', startTime: '2026-05-27 14:00', endTime: '2026-05-27 16:30', duration: '2h 30m', executor: 'Nessus-01', creator: '系统', vulnFound: { critical: 1, high: 3, medium: 0, low: 0 }, affectedAssets: 18, logSize: '45 MB' },
  { id: 'H-1011', type: 'scan', name: '周末漏洞巡检', target: '10.1.0.0/16', status: 'completed', startTime: '2026-05-26 22:00', endTime: '2026-05-27 02:00', duration: '4h 0m', executor: 'Qualys-Cloud', creator: '系统', vulnFound: { critical: 1, high: 6, medium: 28, low: 67 }, affectedAssets: 234, logSize: '123 MB' },
  { id: 'H-1012', type: 'assess', name: '供应链风险评估', target: '2024 Q2', status: 'completed', startTime: '2026-05-25 09:00', endTime: '2026-05-25 18:00', duration: '9h 0m', executor: 'Risk-Engine', creator: '张伟', vulnFound: { critical: 0, high: 5, medium: 12, low: 0 }, affectedAssets: 89, logSize: '8 MB' },
];

const typeLabels: Record<TaskType, string> = {
  scan: '扫描',
  rectify: '整改',
  retest: '复测',
  assess: '评估',
  sync: '同步',
};

const typeColors: Record<TaskType, string> = {
  scan: 'text-blue-400 bg-blue-500/10',
  rectify: 'text-green-400 bg-green-500/10',
  retest: 'text-purple-400 bg-purple-500/10',
  assess: 'text-orange-400 bg-orange-500/10',
  sync: 'text-cyan-400 bg-cyan-500/10',
};

const statusLabels: Record<TaskStatus, string> = {
  completed: '完成',
  failed: '失败',
  cancelled: '取消',
};

const statusColors: Record<TaskStatus, string> = {
  completed: 'text-green-400 bg-green-500/10',
  failed: 'text-red-400 bg-red-500/10',
  cancelled: 'text-gray-400 bg-gray-500/10',
};

export function VulnHistoryQuery() {
  const [searchKw, setSearchKw] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filtered = useMemo(() => {
    return historyTasks.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (searchKw && !t.name.includes(searchKw) && !t.id.includes(searchKw) && !t.target.includes(searchKw) && !t.executor.includes(searchKw)) return false;
      return true;
    });
  }, [searchKw, typeFilter, statusFilter]);

  // 统计
  const total = historyTasks.length;
  const completed = historyTasks.filter(t => t.status === 'completed').length;
  const failed = historyTasks.filter(t => t.status === 'failed').length;
  const totalVuln = historyTasks.reduce((acc, t) => acc + t.vulnFound.critical + t.vulnFound.high + t.vulnFound.medium + t.vulnFound.low, 0);
  const totalCritical = historyTasks.reduce((acc, t) => acc + t.vulnFound.critical, 0);
  const successRate = (completed / total * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            漏洞管理任务历史查询
          </h2>
          <span className="text-xs text-gray-500">共 {total} 条记录</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '历史任务', value: total, color: 'blue', icon: <Activity className="w-4 h-4" /> },
          { label: '成功率', value: `${successRate}%`, color: 'green', icon: <CheckCircle2 className="w-4 h-4" />, sub: `${completed} 成功` },
          { label: '失败任务', value: failed, color: 'red', icon: <XCircle className="w-4 h-4" /> },
          { label: '发现漏洞', value: totalVuln, color: 'orange', icon: <AlertCircle className="w-4 h-4" />, sub: `严重 ${totalCritical}` },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* 趋势图 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          30 天任务趋势
        </h3>
        <div className="grid grid-cols-30 gap-0.5" style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}>
          {Array.from({ length: 30 }, (_, i) => {
            const count = Math.floor(Math.random() * 8);
            const failed = Math.random() < 0.15 ? 1 : 0;
            return (
              <div key={i} className="flex flex-col gap-0.5">
                <div
                  className={`h-${count > 0 ? Math.min(count * 4, 24) : 0} rounded-sm ${failed ? 'bg-red-500/50' : 'bg-blue-500/50'}`}
                  style={{ height: `${Math.max(count * 4, 2)}px` }}
                  title={`${i + 1}日: ${count} 个${failed ? ' (含 1 个失败)' : ''}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2">
          <span>5/04</span>
          <span>5/14</span>
          <span>5/24</span>
          <span>6/02</span>
        </div>
      </div>

      {/* 筛选 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={searchKw}
              onChange={e => setSearchKw(e.target.value)}
              placeholder="搜索任务名 / ID / 目标 / 执行器..."
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
            />
          </div>
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm rounded px-2 py-1.5">
            <option value="7d">近 7 天</option>
            <option value="30d">近 30 天</option>
            <option value="90d">近 90 天</option>
            <option value="custom">自定义...</option>
          </select>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            高级筛选
            <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex border border-[#2A354D] rounded overflow-hidden">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 text-xs ${typeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
            >
              全部类型
            </button>
            {(Object.keys(typeLabels) as TaskType[]).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 text-xs ${typeFilter === t ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>
          <div className="flex border border-[#2A354D] rounded overflow-hidden">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
            >
              全部状态
            </button>
            {(Object.keys(statusLabels) as TaskStatus[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-xs ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#2A354D]">
            <input placeholder="创建人" className="bg-[#111625] border border-[#2A354D] text-white text-xs rounded px-2 py-1.5" />
            <input placeholder="执行器" className="bg-[#111625] border border-[#2A354D] text-white text-xs rounded px-2 py-1.5" />
            <input placeholder="开始时间" type="datetime-local" className="bg-[#111625] border border-[#2A354D] text-white text-xs rounded px-2 py-1.5" />
            <input placeholder="结束时间" type="datetime-local" className="bg-[#111625] border border-[#2A354D] text-white text-xs rounded px-2 py-1.5" />
          </div>
        )}
      </div>

      {/* 历史任务列表 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-[#2A354D] bg-[#111625]/30">
              <th className="text-left py-2 px-3 font-medium">任务 ID</th>
              <th className="text-left py-2 px-3 font-medium">任务名称</th>
              <th className="text-center py-2 px-3 font-medium">类型</th>
              <th className="text-left py-2 px-3 font-medium">目标</th>
              <th className="text-center py-2 px-3 font-medium">状态</th>
              <th className="text-center py-2 px-3 font-medium">严重</th>
              <th className="text-center py-2 px-3 font-medium">高危</th>
              <th className="text-center py-2 px-3 font-medium">中危</th>
              <th className="text-center py-2 px-3 font-medium">低危</th>
              <th className="text-left py-2 px-3 font-medium">耗时</th>
              <th className="text-left py-2 px-3 font-medium">执行器</th>
              <th className="text-center py-2 px-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                <td className="py-2 px-3 font-mono text-xs text-blue-400">{t.id}</td>
                <td className="py-2 px-3 text-white max-w-xs">
                  <div className="truncate">{t.name}</div>
                  <div className="text-[10px] text-gray-500">{t.creator} · {t.startTime}</div>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeColors[t.type]}`}>{typeLabels[t.type]}</span>
                </td>
                <td className="py-2 px-3 text-gray-400 font-mono text-[11px] max-w-xs truncate">{t.target}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[t.status]}`}>{statusLabels[t.status]}</span>
                </td>
                <td className="py-2 px-3 text-center text-red-400 font-medium">{t.vulnFound.critical}</td>
                <td className="py-2 px-3 text-center text-orange-400 font-medium">{t.vulnFound.high}</td>
                <td className="py-2 px-3 text-center text-yellow-400">{t.vulnFound.medium}</td>
                <td className="py-2 px-3 text-center text-blue-400">{t.vulnFound.low}</td>
                <td className="py-2 px-3 text-gray-500 text-xs">{t.duration}</td>
                <td className="py-2 px-3 text-gray-400 text-xs">{t.executor}</td>
                <td className="py-2 px-3 text-center">
                  <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">报告</button>
                  <button className="text-xs text-green-400 hover:text-green-300">复用</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-[#2A354D] flex items-center justify-between text-xs text-gray-500">
          <span>共 {filtered.length} 条</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 bg-[#111625] border border-[#2A354D] rounded text-gray-400">上一页</button>
            <span>1 / 12</span>
            <button className="px-2 py-1 bg-[#111625] border border-[#2A354D] rounded text-gray-400">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VulnHistoryQuery;
