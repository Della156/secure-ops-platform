'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Edit, Trash2,
  Play, Pause, CheckCircle2, XCircle, Clock, FileText, Server, Database,
  Activity, AlertCircle, ChevronRight, ChevronDown, Calendar, User,
  Zap, Shield, ArrowRight, ListTree, Network, Terminal
} from 'lucide-react';

interface DrillRecord {
  id: string;
  drillName: string;
  drillType: '全链路' | '单系统' | '数据库' | '应用' | '网络';
  startTime: string;
  endTime: string;
  duration: string;
  status: 'completed' | 'running' | 'failed' | 'paused';
  totalSteps: number;
  successSteps: number;
  failedSteps: number;
  triggeredBy: string;
  result: 'success' | 'partial' | 'failed';
  env: '生产' | '测试' | '灾备';
}

const records: DrillRecord[] = [
  { id: 'DR-2026060301', drillName: '金融核心系统全链路灾备切换演练', drillType: '全链路', startTime: '2026-06-03 09:00:00', endTime: '2026-06-03 10:35:00', duration: '01:35:00', status: 'completed', totalSteps: 18, successSteps: 18, failedSteps: 0, triggeredBy: '张伟 (灾备主管)', result: 'success', env: '生产' },
  { id: 'DR-2026060202', drillName: 'Oracle 数据库 RPO/RTO 演练', drillType: '数据库', startTime: '2026-06-02 14:00:00', endTime: '2026-06-02 16:12:00', duration: '02:12:00', status: 'completed', totalSteps: 24, successSteps: 22, failedSteps: 2, triggeredBy: '王芳 (DBA)', result: 'partial', env: '生产' },
  { id: 'DR-2026060201', drillName: '防火墙故障切换演练', drillType: '单系统', startTime: '2026-06-02 10:30:00', endTime: '2026-06-02 10:48:00', duration: '00:18:00', status: 'completed', totalSteps: 8, successSteps: 8, failedSteps: 0, triggeredBy: '李娜 (网络)', result: 'success', env: '生产' },
  { id: 'DR-2026060103', drillName: '邮件系统异地灾备切换', drillType: '应用', startTime: '2026-06-01 22:00:00', endTime: '2026-06-01 22:25:00', duration: '00:25:00', status: 'failed', totalSteps: 12, successSteps: 5, failedSteps: 7, triggeredBy: '陈磊 (运维)', result: 'failed', env: '生产' },
  { id: 'DR-2026060101', drillName: '域控制器 AD 容灾演练', drillType: '单系统', startTime: '2026-06-01 09:00:00', endTime: '2026-06-01 09:42:00', duration: '00:42:00', status: 'completed', totalSteps: 16, successSteps: 16, failedSteps: 0, triggeredBy: '刘洋 (系统)', result: 'success', env: '生产' },
  { id: 'DR-2026053101', drillName: '核心交换机 HA 切换演练', drillType: '网络', startTime: '2026-05-31 16:00:00', endTime: '2026-05-31 16:18:00', duration: '00:18:00', status: 'completed', totalSteps: 10, successSteps: 10, failedSteps: 0, triggeredBy: '张伟 (灾备主管)', result: 'success', env: '生产' },
  { id: 'DR-2026053002', drillName: '财务系统月度数据恢复演练', drillType: '应用', startTime: '2026-05-30 02:00:00', endTime: '2026-05-30 04:25:00', duration: '02:25:00', status: 'running', totalSteps: 14, successSteps: 9, failedSteps: 0, triggeredBy: '王芳 (DBA)', result: 'partial', env: '测试' },
  { id: 'DR-2026052901', drillName: 'Web 集群自动伸缩演练', drillType: '应用', startTime: '2026-05-29 11:00:00', endTime: '2026-05-29 11:30:00', duration: '00:30:00', status: 'paused', totalSteps: 8, successSteps: 3, failedSteps: 0, triggeredBy: '陈磊 (运维)', result: 'partial', env: '测试' },
];

const statusConfig = {
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
  running: { label: '进行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
  paused: { label: '已暂停', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
};

const resultConfig = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20' },
  partial: { label: '部分', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const typeColor: Record<DrillRecord['drillType'], string> = {
  '全链路': '#0066FF',
  '单系统': '#9333EA',
  '数据库': '#22C55E',
  '应用': '#FF6D00',
  '网络': '#06B6D4',
};

// 单个演练的步骤详情
const stepTemplates: Record<string, Array<{name: string; result: 'success' | 'failed' | 'running'; duration: string; output: string}>> = {
  'DR-2026060301': [
    { name: '预检：检查灾备环境健康状态', result: 'success', duration: '00:05:00', output: '灾备中心 12 节点全部健康，存储容量 68%，网络延迟 2.3ms' },
    { name: '快照：源端数据库一致性快照', result: 'success', duration: '00:08:00', output: '快照 SCN=4218573623 一致性 OK，文件大小 2.3TB' },
    { name: '传输：数据同步至灾备中心', result: 'success', duration: '00:42:00', output: '传输带宽 850Mbps，实际传输 2.1TB，校验和一致' },
    { name: '恢复：灾备端数据库启动', result: 'success', duration: '00:12:00', output: '数据库启动成功，应用 OPEN 模式' },
    { name: '切换：应用连接串切换', result: 'success', duration: '00:08:00', output: '应用 128 个连接全部切换至灾备端，无中断' },
    { name: '验证：业务交易验证', result: 'success', duration: '00:15:00', output: '交易验证通过 5421 笔/分钟，对账无差异' },
    { name: '回切：原生产恢复后回切', result: 'success', duration: '00:05:00', output: '回切成功，业务恢复至原生产' },
  ],
  'DR-2026060202': [
    { name: '预检：Oracle 实例状态', result: 'success', duration: '00:03:00', output: '实例 OPEN，归档正常' },
    { name: '备份：RMAN 全量备份', result: 'success', duration: '00:18:00', output: '备份集大小 458GB，备份完成' },
    { name: '传输：备份集至灾备', result: 'success', duration: '00:22:00', output: '传输完成，校验通过' },
    { name: '恢复：RESTORE DATABASE', result: 'success', duration: '00:35:00', output: '数据文件恢复完成' },
    { name: '恢复：RECOVER DATABASE', result: 'failed', duration: '00:18:00', output: '归档日志缺失 2026-06-02 14:35-14:42 共 7 个文件' },
    { name: '补偿：手工恢复归档', result: 'success', duration: '00:12:00', output: '从备份获取缺失归档，恢复继续' },
    { name: '启动：OPEN RESETLOGS', result: 'success', duration: '00:05:00', output: '数据库以 RESETLOGS 模式打开' },
  ],
};

export function DrillProcessRecord() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('DR-2026060301');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['DR-2026060301']));

  const filtered = records.filter(r => {
    if (search && !r.drillName.includes(search) && !r.id.includes(search)) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (typeFilter !== 'all' && r.drillType !== typeFilter) return false;
    return true;
  });

  const selected = selectedId ? records.find(r => r.id === selectedId) : null;
  const selectedSteps = selectedId ? stepTemplates[selectedId] : null;

  const stats = {
    total: records.length,
    completed: records.filter(r => r.status === 'completed').length,
    failed: records.filter(r => r.status === 'failed').length,
    successRate: ((records.filter(r => r.result === 'success').length / records.length) * 100).toFixed(1),
  };

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="演练记录" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="已完成" value={stats.completed} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="成功率" value={`${stats.successRate}%`} color="#FF6D00" icon={<Shield className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">演练过程记录</h2>
            <p className="text-xs text-slate-500 mt-1">全链路 / 单系统 / 数据库 / 应用 / 网络 — 5 大类演练执行轨迹</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建演练
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
              type="text" placeholder="搜索演练/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="全链路">全链路</option>
            <option value="单系统">单系统</option>
            <option value="数据库">数据库</option>
            <option value="应用">应用</option>
            <option value="网络">网络</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="completed">已完成</option>
            <option value="running">进行中</option>
            <option value="failed">失败</option>
            <option value="paused">已暂停</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 演练列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">演练记录 ({filtered.length})</h3>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filtered.map(r => {
              const sc = statusConfig[r.status];
              const rc = resultConfig[r.result];
              const isExp = expanded.has(r.id);
              return (
                <div key={r.id} className="border-b border-[#2A354D]">
                  <div
                    onClick={() => { setSelectedId(r.id); toggle(r.id); }}
                    className={`px-4 py-3 cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-blue-400 font-mono">{r.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${typeColor[r.drillType]}20`, color: typeColor[r.drillType] }}>
                        {r.drillType}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300">
                        {r.env}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${rc.bg} ${rc.color}`}>
                        结果: {rc.label}
                      </span>
                      <div className="flex-1" />
                      <span className="text-[10px] text-slate-500 font-mono">{r.duration}</span>
                      {isExp ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                    </div>
                    <div className="text-sm text-white font-medium mb-1.5">{r.drillName}</div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span><User className="w-2.5 h-2.5 inline mr-0.5" />{r.triggeredBy}</span>
                      <span>·</span>
                      <span>{r.startTime} ~ {r.endTime}</span>
                      <span>·</span>
                      <span className="text-green-400">成功 {r.successSteps}</span>
                      <span className="text-red-400">失败 {r.failedSteps}</span>
                      <span>·</span>
                      <span>总步骤 {r.totalSteps}</span>
                    </div>
                    {/* 进度条 */}
                    <div className="mt-1.5 h-1 bg-[#111625] rounded-full overflow-hidden flex">
                      <div className="h-full bg-green-500" style={{ width: `${(r.successSteps / r.totalSteps) * 100}%` }} />
                      <div className="h-full bg-red-500" style={{ width: `${(r.failedSteps / r.totalSteps) * 100}%` }} />
                    </div>
                  </div>
                  {/* 展开步骤 */}
                  {isExp && stepTemplates[r.id] && (
                    <div className="px-4 py-2 bg-[#111625] border-t border-[#2A354D]">
                      <div className="text-[10px] text-slate-500 mb-2 flex items-center gap-1"><ListTree className="w-3 h-3" />执行步骤</div>
                      {stepTemplates[r.id].map((s, i) => (
                        <div key={i} className="flex items-start gap-2 py-1.5 border-b border-[#2A354D] last:border-0">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                            s.result === 'success' ? 'bg-green-500/20 text-green-400' : s.result === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {s.result === 'success' ? '✓' : s.result === 'failed' ? '✗' : '●'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-200">步骤 {i + 1}: {s.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{s.output}</div>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono shrink-0">{s.duration}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 详情面板 */}
        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${typeColor[selected.drillType]}20`, color: typeColor[selected.drillType] }}>
                  {selected.drillType}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.drillName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">结束时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.endTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">总耗时</div>
                <div className="text-blue-300 font-mono">{selected.duration}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">执行人</div>
                <div className="text-yellow-300 text-[10px]">{selected.triggeredBy}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                <div className="text-[10px] text-slate-400">成功</div>
                <div className="text-xl font-bold text-green-400">{selected.successSteps}</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                <div className="text-[10px] text-slate-400">失败</div>
                <div className="text-xl font-bold text-red-400">{selected.failedSteps}</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                <div className="text-[10px] text-slate-400">总步骤</div>
                <div className="text-xl font-bold text-blue-400">{selected.totalSteps}</div>
              </div>
            </div>

            {/* 步骤时间线 */}
            {selectedSteps && (
              <div>
                <div className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Activity className="w-3 h-3" />执行时间线</div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {selectedSteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        s.result === 'success' ? 'bg-green-500' : s.result === 'failed' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'
                      }`} />
                      <span className="text-slate-300 flex-1 truncate">{s.name}</span>
                      <span className="text-slate-500 font-mono shrink-0">{s.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Eye className="w-3 h-3" />完整日志
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
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

export default DrillProcessRecord;
