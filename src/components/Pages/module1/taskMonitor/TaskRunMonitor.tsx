'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Pause, Play, XCircle, RotateCcw, Download, Maximize2,
  Clock, Server, Activity, ChevronRight, Filter, RefreshCw, Cpu,
  HardDrive, Wifi, Database, CheckCircle2, AlertCircle
} from 'lucide-react';

interface NodeStep {
  id: string;
  name: string;
  status: 'success' | 'running' | 'pending' | 'failed';
  startTime: string;
  endTime: string | null;
  duration: string;
  host: string;
}

interface LogEntry {
  ts: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  node: string;
  msg: string;
}

const currentNodes: NodeStep[] = [
  { id: 'N1', name: '任务初始化', status: 'success', startTime: '09:42:18', endTime: '09:42:19', duration: '1.2s', host: 'scheduler-01' },
  { id: 'N2', name: '目标资产发现', status: 'success', startTime: '09:42:19', endTime: '09:43:05', duration: '46s', host: 'controller-01' },
  { id: 'N3', name: '凭据校验', status: 'success', startTime: '09:43:05', endTime: '09:43:12', duration: '7s', host: 'auth-svc' },
  { id: 'N4', name: 'SSH 连接建立', status: 'success', startTime: '09:43:12', endTime: '09:43:18', duration: '6s', host: 'agent-01' },
  { id: 'N5', name: '基线规则下发', status: 'success', startTime: '09:43:18', endTime: '09:43:24', duration: '6s', host: 'agent-01' },
  { id: 'N6', name: '基线检查执行', status: 'running', startTime: '09:43:24', endTime: null, duration: '进行中 17m', host: 'agent-01' },
  { id: 'N7', name: '结果采集', status: 'pending', startTime: '-', endTime: null, duration: '未开始', host: '-' },
  { id: 'N8', name: '结果聚合', status: 'pending', startTime: '-', endTime: null, duration: '未开始', host: '-' },
  { id: 'N9', name: '报告生成', status: 'pending', startTime: '-', endTime: null, duration: '未开始', host: '-' },
  { id: 'N10', name: '通知推送', status: 'pending', startTime: '-', endTime: null, duration: '未开始', host: '-' },
];

const initialLogs: LogEntry[] = [
  { ts: '09:42:18.142', level: 'INFO', node: 'scheduler', msg: 'Task RUN-2026060301 started by system scheduler' },
  { ts: '09:42:18.235', level: 'DEBUG', node: 'scheduler', msg: 'Loading task definition from registry: baseline_check_v2' },
  { ts: '09:42:18.872', level: 'INFO', node: 'controller', msg: 'Task graph initialized, 10 nodes total' },
  { ts: '09:42:19.001', level: 'INFO', node: 'controller', msg: 'Node N1 [任务初始化] started' },
  { ts: '09:42:19.243', level: 'INFO', node: 'controller', msg: 'Node N1 [任务初始化] completed in 1.2s' },
  { ts: '09:43:05.412', level: 'INFO', node: 'controller', msg: 'Discovered 12 target hosts in subnet 192.168.2.0/24' },
  { ts: '09:43:05.618', level: 'INFO', node: 'auth', msg: 'Validating credentials for 12 hosts...' },
  { ts: '09:43:12.039', level: 'INFO', node: 'auth', msg: 'All 12 hosts credentials validated successfully' },
  { ts: '09:43:12.512', level: 'INFO', node: 'agent-01', msg: 'Establishing SSH connection to 12 hosts' },
  { ts: '09:43:18.847', level: 'INFO', node: 'agent-01', msg: 'All 12 SSH connections established' },
  { ts: '09:43:24.103', level: 'INFO', node: 'agent-01', msg: 'Loading baseline rules: CIS-CentOS-Linux-7-v3.0.0' },
  { ts: '09:43:24.518', level: 'INFO', node: 'agent-01', msg: 'Rule set has 247 rules, distributing to hosts...' },
  { ts: '09:50:12.331', level: 'INFO', node: 'agent-01', msg: 'host server-01: 235/247 rules checked' },
  { ts: '09:52:48.602', level: 'WARN', node: 'agent-01', msg: 'host server-08: rule cis-1.4.2 (audit log config) timeout after 30s, skipping' },
  { ts: '09:55:32.114', level: 'WARN', node: 'agent-01', msg: 'host server-08: 218/247 rules checked (3 timeouts)' },
  { ts: '10:00:18.241', level: 'INFO', node: 'agent-01', msg: 'Progress: 67% (8/12 hosts completed)' },
  { ts: '10:00:18.502', level: 'INFO', node: 'agent-01', msg: 'Estimated time remaining: 8m 24s' },
  { ts: '10:00:45.123', level: 'ERROR', node: 'agent-01', msg: 'host server-05: rule cis-2.2.1 (NTP sync) check failed' },
  { ts: '10:00:45.341', level: 'INFO', node: 'agent-01', msg: 'Retrying rule cis-2.2.1 (attempt 2/3)...' },
  { ts: '10:01:15.778', level: 'INFO', node: 'agent-01', msg: 'host server-05: rule cis-2.2.1 succeeded on retry' },
];

const targetHosts = [
  { name: 'server-01', ip: '192.168.2.10', status: 'completed', progress: 100, time: '1m 24s' },
  { name: 'server-02', ip: '192.168.2.11', status: 'completed', progress: 100, time: '1m 18s' },
  { name: 'server-03', ip: '192.168.2.12', status: 'completed', progress: 100, time: '1m 32s' },
  { name: 'server-04', ip: '192.168.2.13', status: 'completed', progress: 100, time: '1m 21s' },
  { name: 'server-05', ip: '192.168.2.14', status: 'completed', progress: 100, time: '1m 56s' },
  { name: 'server-06', ip: '192.168.2.15', status: 'completed', progress: 100, time: '1m 29s' },
  { name: 'server-07', ip: '192.168.2.16', status: 'completed', progress: 100, time: '1m 33s' },
  { name: 'server-08', ip: '192.168.2.17', status: 'running', progress: 88, time: '1m 45s' },
  { name: 'server-09', ip: '192.168.2.18', status: 'running', progress: 72, time: '1m 12s' },
  { name: 'server-10', ip: '192.168.2.19', status: 'running', progress: 65, time: '1m 08s' },
  { name: 'server-11', ip: '192.168.2.20', status: 'running', progress: 45, time: '0m 52s' },
  { name: 'server-12', ip: '192.168.2.21', status: 'pending', progress: 0, time: '等待中' },
];

const resourceMetrics = [
  { label: 'CPU 使用率', value: 68, icon: <Cpu className="w-3.5 h-3.5" />, color: '#0066FF' },
  { label: '内存使用率', value: 45, icon: <HardDrive className="w-3.5 h-3.5" />, color: '#00C853' },
  { label: '网络 IO', value: 32, icon: <Wifi className="w-3.5 h-3.5" />, color: '#9333EA' },
  { label: '磁盘 IO', value: 18, icon: <Database className="w-3.5 h-3.5" />, color: '#EAB308' },
];

export function TaskRunMonitor() {
  const [logs, setLogs] = useState(initialLogs);
  const [running, setRunning] = useState(true);
  const [logFilter, setLogFilter] = useState<string>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const next: LogEntry = {
        ts: new Date().toISOString().slice(11, 23),
        level: ['INFO', 'DEBUG', 'WARN'][Math.floor(Math.random() * 3)] as any,
        node: 'agent-01',
        msg: [
          'Processing rule cis-1.5.2 on host server-08...',
          'host server-09: rule check batch completed (50/247)',
          'Progress: 68% (8/12 hosts completed)',
          'host server-10: checking password policy rules...',
          'Resource usage: CPU 68%, MEM 45%',
          'host server-11: starting rule execution...',
        ][Math.floor(Math.random() * 6)],
      };
      setLogs(prev => [...prev.slice(-200), next]);
    }, 2000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter(l => logFilter === 'all' || l.level === logFilter);

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">任务运行监控 — RUN-2026060301</h2>
            <p className="text-xs text-slate-500 mt-1">核心服务器基线检查 · 12 台主机 · 已运行 18 分 42 秒</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-400 px-2 py-1 bg-green-500/10 rounded">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />运行中
            </span>
            <button
              onClick={() => setRunning(!running)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded-md ${running ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {running ? <><Pause className="w-3.5 h-3.5" />暂停</> : <><Play className="w-3.5 h-3.5" />继续</>}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RotateCcw className="w-3.5 h-3.5" />重试
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <XCircle className="w-3.5 h-3.5" />停止
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Maximize2 className="w-3.5 h-3.5" />全屏
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 左侧：执行节点甘特图 + 资源 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 节点甘特图 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">执行节点甘特图</h3>
              <span className="text-xs text-slate-500">5/10 节点已完成</span>
            </div>
            <div className="space-y-1.5">
              {currentNodes.map(node => (
                <div key={node.id} className="flex items-center gap-2 text-xs">
                  <div className="w-24 text-slate-300 truncate">{node.name}</div>
                  <div className="flex-1 h-6 bg-[#111625] rounded relative overflow-hidden">
                    {node.status === 'success' && (
                      <div className="absolute inset-y-0 left-0 bg-green-500/30 border-l-2 border-green-500" style={{ width: '100%' }} />
                    )}
                    {node.status === 'running' && (
                      <div className="absolute inset-y-0 left-0 bg-blue-500/30 border-l-2 border-blue-500" style={{ width: '68%' }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/20 animate-pulse" />
                      </div>
                    )}
                    {node.status === 'pending' && (
                      <div className="absolute inset-y-0 left-0 bg-slate-700/20 border-l-2 border-slate-600" style={{ width: '2%' }} />
                    )}
                    {node.status === 'failed' && (
                      <div className="absolute inset-y-0 left-0 bg-red-500/30 border-l-2 border-red-500" style={{ width: '40%' }} />
                    )}
                    <div className="absolute inset-0 flex items-center px-2 text-[10px] text-slate-300">
                      {node.duration}
                    </div>
                  </div>
                  <div className="w-32 text-slate-500 text-right">
                    {node.status === 'success' && <span className="text-green-400">✓ {node.endTime}</span>}
                    {node.status === 'running' && <span className="text-blue-400">⟳ {node.startTime}</span>}
                    {node.status === 'pending' && <span className="text-slate-600">未开始</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 目标主机执行情况 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">目标主机执行情况</h3>
            <div className="grid grid-cols-2 gap-2">
              {targetHosts.map(h => (
                <div key={h.name} className="bg-[#111625] border border-[#2A354D] rounded p-2.5 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-200 truncate">{h.name}</span>
                      <span className={`text-[10px] ${
                        h.status === 'completed' ? 'text-green-400' :
                        h.status === 'running' ? 'text-blue-400' : 'text-slate-500'
                      }`}>
                        {h.status === 'completed' ? '完成' : h.status === 'running' ? '执行中' : '等待'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-1 bg-[#20293F] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${h.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${h.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 w-7 text-right">{h.progress}%</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{h.ip} · {h.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：终端日志 + 资源 */}
        <div className="space-y-4">
          {/* 资源使用 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">执行资源</h3>
            <div className="space-y-3">
              {resourceMetrics.map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      {m.icon}{m.label}
                    </span>
                    <span className="font-mono" style={{ color: m.color }}>{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 终端日志 */}
          <div className="bg-[#111625] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A354D] bg-[#20293F]">
              <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-green-400" />实时执行日志
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
              </div>
            </div>
            <div className="h-[480px] overflow-y-auto p-2 font-mono text-[11px] leading-relaxed">
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
      </div>
    </div>
  );
}

export default TaskRunMonitor;
