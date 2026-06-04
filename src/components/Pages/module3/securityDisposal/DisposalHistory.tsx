'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, RefreshCw, Eye,
  Calendar, CheckCircle2, XCircle, Clock,
  Activity, FileText, DownloadCloud, Filter as FilterIcon,
  User, AlertCircle, Server
} from 'lucide-react';

interface HistoryItem {
  id: string;
  caseId: string;
  name: string;
  type: 'auto' | 'manual' | 'hybrid';
  status: 'success' | 'partial' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  endTime: string;
  duration: string;
  targetAsset: string;
  operator: string;
  affectedCount: number;
  steps: number;
}

const historyItems: HistoryItem[] = [
  {
    id: 'HIS-20260603001',
    caseId: 'SD-20260603002',
    name: '挖矿木马处置 (Kinsing)',
    type: 'auto',
    status: 'success',
    priority: 'high',
    startTime: '2026-06-03 07:30:12',
    endTime: '2026-06-03 07:32:40',
    duration: '2 分 28 秒',
    targetAsset: '终端-0128',
    operator: '系统自动',
    affectedCount: 1,
    steps: 6,
  },
  {
    id: 'HIS-20260602001',
    caseId: 'SD-20260602001',
    name: '钓鱼邮件批量删除',
    type: 'auto',
    status: 'success',
    priority: 'medium',
    startTime: '2026-06-02 06:00:00',
    endTime: '2026-06-02 06:08:23',
    duration: '8 分 23 秒',
    targetAsset: '邮件服务器',
    operator: '系统自动',
    affectedCount: 142,
    steps: 4,
  },
  {
    id: 'HIS-20260601001',
    caseId: 'SD-20260601001',
    name: 'DDoS 攻击流量清洗',
    type: 'hybrid',
    status: 'success',
    priority: 'high',
    startTime: '2026-06-01 14:35:20',
    endTime: '2026-06-01 14:42:30',
    duration: '7 分 10 秒',
    targetAsset: '边界防火墙',
    operator: '系统自动 + 人工确认',
    affectedCount: 0,
    steps: 4,
  },
  {
    id: 'HIS-20260531001',
    caseId: 'SD-20260531001',
    name: 'WebShell 查杀',
    type: 'manual',
    status: 'success',
    priority: 'critical',
    startTime: '2026-05-31 16:20:00',
    endTime: '2026-05-31 16:45:00',
    duration: '25 分钟',
    targetAsset: 'Web 服务器集群',
    operator: '安全工程师 - 李明',
    affectedCount: 3,
    steps: 8,
  },
  {
    id: 'HIS-20260530001',
    caseId: 'SD-20260530001',
    name: '违规账号冻结',
    type: 'manual',
    status: 'success',
    priority: 'medium',
    startTime: '2026-05-30 09:15:00',
    endTime: '2026-05-30 09:18:00',
    duration: '3 分钟',
    targetAsset: '域账号 - 张三',
    operator: '安全工程师 - 李工',
    affectedCount: 1,
    steps: 3,
  },
  {
    id: 'HIS-20260529001',
    caseId: 'SD-20260529001',
    name: '系统补丁安装',
    type: 'auto',
    status: 'partial',
    priority: 'high',
    startTime: '2026-05-29 02:00:00',
    endTime: '2026-05-29 02:30:00',
    duration: '30 分钟',
    targetAsset: '12 台服务器',
    operator: '系统自动',
    affectedCount: 10,
    steps: 4,
  },
];

const typeConfig = {
  auto: { label: '自动', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Activity className="w-3 h-3" /> },
  manual: { label: '人工', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: <User className="w-3 h-3" /> },
  hybrid: { label: '混合', color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: <Activity className="w-3 h-3" /> },
};

const statusConfig = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  partial: { label: '部分', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <AlertCircle className="w-3 h-3" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
};

const priorityColor = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

export function DisposalHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filtered = useMemo(() => {
    return historyItems.filter(item => {
      if (search && !item.name.includes(search) && !item.targetAsset.includes(search) && !item.id.includes(search)) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      return true;
    });
  }, [search, statusFilter, typeFilter]);

  const stats = {
    total: historyItems.length,
    success: historyItems.filter(item => item.status === 'success').length,
    partial: historyItems.filter(item => item.status === 'partial').length,
    failed: historyItems.filter(item => item.status === 'failed').length,
    totalAffected: historyItems.reduce((sum, item) => sum + item.affectedCount, 0),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总任务数" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="成功" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="部分成功" value={stats.partial} color="#EAB308" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="影响资产" value={stats.totalAffected} color="#FF6D00" icon={<Server className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">安全综合处置任务历史查询</h2>
            <p className="text-xs text-slate-500 mt-1">查看所有已完成的安全处置任务记录</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text" placeholder="搜索任务名称/资产/ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="success">成功</option>
            <option value="partial">部分成功</option>
            <option value="failed">失败</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="auto">自动处置</option>
            <option value="manual">人工处置</option>
            <option value="hybrid">混合处置</option>
          </select>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date" placeholder="开始日期"
              value={startDate} onChange={e => setStartDate(e.target.value)}
              className="flex-1 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-2 py-1.5 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date" placeholder="结束日期"
              value={endDate} onChange={e => setEndDate(e.target.value)}
              className="flex-1 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-2 py-1.5 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">历史任务 ({filtered.length})</h3>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {filtered.map(item => {
              const tc = typeConfig[item.type];
              const sc = statusConfig[item.status];
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{item.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColor[item.priority]}`}>
                      {item.priority === 'critical' ? '紧急' : item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${tc.bg} ${tc.color}`}>
                      {tc.icon}{tc.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{item.name}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Server className="w-3 h-3" />{item.targetAsset}</span>
                    <span>·</span>
                    <span>{item.operator}</span>
                    <span>·</span>
                    <span>{item.startTime.split(' ')[0]}</span>
                    <span>·</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedItem ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3 max-h-[600px] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selectedItem.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColor[selectedItem.priority]}`}>
                  {selectedItem.priority === 'critical' ? '紧急' : selectedItem.priority === 'high' ? '高' : selectedItem.priority === 'medium' ? '中' : '低'}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${typeConfig[selectedItem.type].bg} ${typeConfig[selectedItem.type].color}`}>
                  {typeConfig[selectedItem.type].icon}{typeConfig[selectedItem.type].label}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selectedItem.status].bg} ${statusConfig[selectedItem.status].color}`}>
                  {statusConfig[selectedItem.status].icon}{statusConfig[selectedItem.status].label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selectedItem.name}</h3>
              <p className="text-xs text-slate-400">关联案例：{selectedItem.caseId}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">目标资产</div>
                <div className="text-slate-200">{selectedItem.targetAsset}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">影响资产</div>
                <div className="text-slate-200 font-mono">{selectedItem.affectedCount} 个</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">操作人</div>
                <div className="text-slate-200">{selectedItem.operator}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">执行步数</div>
                <div className="text-slate-200 font-mono">{selectedItem.steps} 步</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selectedItem.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">结束时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selectedItem.endTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2 md:col-span-2">
                <div className="text-slate-500 mb-0.5">耗时</div>
                <div className="text-slate-200 font-mono">{selectedItem.duration}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" />查看详情
              </button>
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1">
                <Download className="w-3 h-3" />下载报告
              </button>
            </div>
          </div>
        ) : null}
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

export default DisposalHistory;
