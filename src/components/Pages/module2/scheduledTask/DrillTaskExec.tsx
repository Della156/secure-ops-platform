'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, XCircle, RotateCcw, Download, Maximize2, Filter,
  Activity, Server, Database, Network, CheckCircle2, AlertCircle,
  Clock, Cpu, HardDrive, Wifi, ChevronRight, FileText, Zap, Eye
} from 'lucide-react';

interface ExecStep {
  id: string;
  name: string;
  host: string;
  type: 'stop' | 'restore' | 'switch' | 'verify' | 'notify' | 'rollback';
  status: 'success' | 'running' | 'pending' | 'failed';
  startTime: string;
  endTime: string | null;
  duration: string;
  progress: number;
  details: string;
}

interface LogEntry {
  ts: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  node: string;
  msg: string;
}

const initialSteps: ExecStep[] = [
  { id: 'S1', name: '触发演练', host: 'scheduler-01', type: 'verify', status: 'success', startTime: '02:00:00', endTime: '02:00:01', duration: '1.2s', progress: 100, details: '定时调度触发演练 DR-2026-054' },
  { id: 'S2', name: '通知业务方', host: 'notify-svc', type: 'notify', status: 'success', startTime: '02:00:01', endTime: '02:00:08', duration: '7.3s', progress: 100, details: '推送 12 个相关人员（短信+邮件+IM）' },
  { id: 'S3', name: '主库设为只读', host: 'mysql-01', type: 'stop', status: 'success', startTime: '02:00:08', endTime: '02:00:14', duration: '6.1s', progress: 100, details: 'SET GLOBAL read_only=ON; FLUSH TABLES' },
  { id: 'S4', name: '全量备份验证', host: 'mysql-01', type: 'verify', status: 'success', startTime: '02:00:14', endTime: '02:00:32', duration: '18.4s', progress: 100, details: '备份文件完整性校验 MD5: 8f3c2b... PASS' },
  { id: 'S5', name: '应用层停止写入', host: 'app-01~04', type: 'stop', status: 'success', startTime: '02:00:32', endTime: '02:00:38', duration: '6.2s', progress: 100, details: '4 台应用服务器全部停止写入' },
  { id: 'S6', name: '恢复主库到备库', host: 'mysql-slave-01', type: 'restore', status: 'running', startTime: '02:00:38', endTime: null, duration: '进行中 5m 24s', progress: 68, details: 'innobackupex --apply-log /backup/2026-06-02-full/' },
  { id: 'S7', name: '启动备库读写', host: 'mysql-slave-01', type: 'switch', status: 'pending', startTime: '-', endTime: null, duration: '未开始', progress: 0, details: 'SET GLOBAL read_only=OFF' },
  { id: 'S8', name: '应用切换到备库', host: 'app-01~04', type: 'switch', status: 'pending', startTime: '-', endTime: null, duration: '未开始', progress: 0, details: '修改连接池配置并重启' },
  { id: 'S9', name: '业务验证 (200 笔)', host: 'verify-svc', type: 'verify', status: 'pending', startTime: '-', endTime: null, duration: '未开始', progress: 0, details: '执行 200 笔模拟交易，验证一致性' },
  { id: 'S10', name: '数据一致性比对', host: 'verify-svc', type: 'verify', status: 'pending', startTime: '-', endTime: null, duration: '未开始', progress: 0, details: 'pt-table-checksum 主从校验' },
  { id: 'S11', name: '生成演练报告', host: 'report-svc', type: 'verify', status: 'pending', startTime: '-', endTime: null, duration: '未开始', progress: 0, details: '汇总演练数据生成 PDF 报告' },
  { id: 'S12', name: '通知业务方恢复', host: 'notify-svc', type: 'notify', status: 'pending', startTime: '-', endTime: null, duration: '未开始', progress: 0, details: '推送演练完成通知' },
];

const initialLogs: LogEntry[] = [
  { ts: '02:00:00.142', level: 'INFO', node: 'scheduler', msg: 'Drill DR-2026-054 started by scheduler' },
  { ts: '02:00:00.231', level: 'INFO', node: 'scheduler', msg: 'Loading scenario: core_db_recovery_v2' },
  { ts: '02:00:00.872', level: 'INFO', node: 'controller', msg: 'Drill graph initialized, 12 steps total' },
  { ts: '02:00:01.001', level: 'INFO', node: 'controller', msg: 'Step S1 [触发演练] started' },
  { ts: '02:00:01.243', level: 'INFO', node: 'controller', msg: 'Step S1 [触发演练] completed in 1.2s' },
  { ts: '02:00:01.412', level: 'INFO', node: 'notify-svc', msg: 'Sending notifications to 12 people via 3 channels' },
  { ts: '02:00:08.039', level: 'INFO', node: 'notify-svc', msg: 'All notifications sent successfully' },
  { ts: '02:00:08.512', level: 'INFO', node: 'mysql-01', msg: 'Executing: SET GLOBAL read_only=ON' },
  { ts: '02:00:14.038', level: 'INFO', node: 'mysql-01', msg: 'read_only enabled, connections redirected' },
  { ts: '02:00:14.241', level: 'INFO', node: 'verify-svc', msg: 'Verifying backup integrity (md5)' },
  { ts: '02:00:32.518', level: 'INFO', node: 'verify-svc', msg: 'Backup integrity PASS (md5: 8f3c2b...)' },
  { ts: '02:00:32.842', level: 'INFO', node: 'controller', msg: 'Stopping write access on app-01~04' },
  { ts: '02:00:38.117', level: 'INFO', node: 'controller', msg: 'All 4 app servers confirmed write-stopped' },
  { ts: '02:00:38.512', level: 'INFO', node: 'mysql-slave-01', msg: 'Starting recovery: innobackupex --apply-log' },
  { ts: '02:01:24.331', level: 'INFO', node: 'mysql-slave-01', msg: 'Apply log step 1/3 completed' },
  { ts: '02:02:48.602', level: 'WARN', node: 'mysql-slave-01', msg: 'Slow operation: apply log step 2/3 (waiting for I/O)' },
  { ts: '02:05:32.114', level: 'INFO', node: 'mysql-slave-01', msg: 'Apply log step 2/3 completed' },
  { ts: '02:05:50.241', level: 'INFO', node: 'mysql-slave-01', msg: 'Progress: 68% (apply log 2/3 done, redo log applying...)' },
  { ts: '02:06:18.502', level: 'INFO', node: 'mysql-slave-01', msg: 'Estimated time remaining: 2m 30s' },
];

const hostMetrics = [
  { host: 'mysql-slave-01', cpu: 78, mem: 65, net: 245, disk: 420, status: 'running' },
  { host: 'mysql-01', cpu: 12, mem: 28, net: 8, disk: 2, status: 'idle' },
  { host: 'app-01~04', cpu: 5, mem: 22, net: 12, disk: 1, status: 'idle' },
];

const participants = [
  { name: '张工', role: '总指挥', dept: '运维部', status: '在线' },
  { name: '李工', role: 'DBA', dept: '运维部', status: '在线' },
  { name: '王工', role: '应用负责人', dept: '业务部', status: '在线' },
  { name: '赵工', role: '安全审计', dept: '安全部', status: '在线' },
  { name: '陈工', role: '业务验证', dept: '测试部', status: '在线' },
];

export function DrillTaskExec() {
  const [steps] = useState(initialSteps);
  const [logs, setLogs] = useState(initialLogs);
  const [running, setRunning] = useState(true);
  const [logFilter, setLogFilter] = useState('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const messages = [
        'mysql-slave-01: applying redo log batch 1248/1832',
        'verify-svc: monitoring transaction consistency',
        'Recovery in progress, RTO target 60min, current elapsed 6m24s',
        'mysql-slave-01: checkpoint reached at log sequence 92847562',
        'verify-svc: 142 connection attempts received, all OK',
        'Progress: 71% (redo log 1248/1832)',
      ];
      setLogs(prev => [...prev.slice(-200), {
        ts: new Date().toISOString().slice(11, 19) + '.000',
        level: ['INFO', 'DEBUG'][Math.floor(Math.random() * 2)] as any,
        node: ['mysql-slave-01', 'verify-svc', 'controller'][Math.floor(Math.random() * 3)],
        msg: messages[Math.floor(Math.random() * messages.length)],
      }]);
    }, 3000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter(l => logFilter === 'all' || l.level === logFilter);
  const completedSteps = steps.filter(s => s.status === 'success').length;
  const totalSteps = steps.length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">DR-2026-054 核心数据库恢复演练</h2>
              <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded">进行中</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">已运行 6 分 24 秒 · RTO 目标 60 分钟 · 当前 5 步已完成</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-400 px-2 py-1 bg-green-500/10 rounded">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />实时监控中
            </span>
            <button onClick={() => setRunning(!running)} className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded-md ${running ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {running ? <><Pause className="w-3.5 h-3.5" />暂停</> : <><Play className="w-3.5 h-3.5" />继续</>}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RotateCcw className="w-3.5 h-3.5" />回滚
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md">
              <XCircle className="w-3.5 h-3.5" />中止
            </button>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">整体进度</span>
            <span className="text-slate-300 font-mono">{completedSteps}/{totalSteps} ({overallProgress}%)</span>
          </div>
          <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 步骤列表 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">执行步骤</h3>
            <div className="space-y-2">
              {steps.map(step => {
                const statusColor = step.status === 'success' ? 'border-green-500/40 bg-green-500/5' :
                  step.status === 'running' ? 'border-blue-500/40 bg-blue-500/5' :
                  step.status === 'failed' ? 'border-red-500/40 bg-red-500/5' : 'border-[#2A354D]';
                const iconColor = step.status === 'success' ? 'text-green-400' :
                  step.status === 'running' ? 'text-blue-400 animate-pulse' :
                  step.status === 'failed' ? 'text-red-400' : 'text-slate-500';
                return (
                  <div key={step.id} className={`border rounded p-2.5 ${statusColor}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${step.status === 'success' ? 'bg-green-500/20 text-green-400' : step.status === 'running' ? 'bg-blue-500/20 text-blue-400' : step.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
                        {step.id}
                      </span>
                      {step.status === 'success' && <CheckCircle2 className={`w-3.5 h-3.5 ${iconColor}`} />}
                      {step.status === 'running' && <Activity className={`w-3.5 h-3.5 ${iconColor}`} />}
                      {step.status === 'pending' && <Clock className={`w-3.5 h-3.5 ${iconColor}`} />}
                      {step.status === 'failed' && <AlertCircle className={`w-3.5 h-3.5 ${iconColor}`} />}
                      <span className="text-sm text-white font-medium flex-1">{step.name}</span>
                      <span className="text-xs text-slate-400 font-mono">{step.duration}</span>
                    </div>
                    <div className="mt-1.5 ml-8 text-[11px] text-slate-500">
                      <span className="text-slate-400">主机：</span>{step.host} · <span className="text-slate-400">详情：</span>{step.details}
                    </div>
                    {step.status === 'running' && (
                      <div className="mt-1.5 ml-8">
                        <div className="h-1 bg-[#111625] rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${step.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：实时日志 + 主机 + 人员 */}
        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">参与人员</h3>
            <div className="space-y-1.5">
              {participants.map(p => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-semibold">
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="text-slate-200">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.role} · {p.dept}</div>
                    </div>
                  </div>
                  <span className="text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">主机资源</h3>
            <div className="space-y-3">
              {hostMetrics.map(h => (
                <div key={h.host}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-mono">{h.host}</span>
                    <span className={`text-[10px] ${h.status === 'running' ? 'text-blue-400' : 'text-slate-500'}`}>
                      {h.status === 'running' ? '执行中' : '空闲'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    <MetricMini label="CPU" value={`${h.cpu}%`} color={h.cpu > 70 ? '#EF4444' : h.cpu > 40 ? '#EAB308' : '#22C55E'} />
                    <MetricMini label="MEM" value={`${h.mem}%`} color={h.mem > 70 ? '#EF4444' : h.mem > 40 ? '#EAB308' : '#22C55E'} />
                    <MetricMini label="NET" value={`${h.net}MB/s`} color="#0066FF" />
                    <MetricMini label="DISK" value={`${h.disk}MB/s`} color="#9333EA" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 终端日志 */}
      <div className="bg-[#111625] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A354D] bg-[#20293F]">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-green-400" />演练实时执行日志
          </h3>
          <div className="flex items-center gap-1">
            {(['all', 'INFO', 'WARN', 'ERROR'] as const).map(f => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-1.5 py-0.5 text-[10px] rounded ${logFilter === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {f === 'all' ? '全部' : f}
              </button>
            ))}
            <button className="p-1 hover:bg-[#2A354D] rounded ml-1" title="下载">
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
        <div className="h-[320px] overflow-y-auto p-2 font-mono text-[11px] leading-relaxed">
          {filteredLogs.map((l, i) => (
            <div key={i} className="flex gap-2 hover:bg-[#20293F]/50 px-1">
              <span className="text-slate-500 shrink-0">{l.ts}</span>
              <span className={`shrink-0 w-12 ${
                l.level === 'ERROR' ? 'text-red-400' :
                l.level === 'WARN' ? 'text-yellow-400' :
                l.level === 'INFO' ? 'text-blue-400' : 'text-slate-500'
              }`}>{l.level}</span>
              <span className="text-purple-400 shrink-0">[{l.node}]</span>
              <span className="text-slate-300 break-all">{l.msg}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}

function MetricMini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#111625] rounded px-1.5 py-1 text-center">
      <div className="text-[9px] text-slate-500">{label}</div>
      <div className="font-mono" style={{ color }}>{value}</div>
    </div>
  );
}

export default DrillTaskExec;
