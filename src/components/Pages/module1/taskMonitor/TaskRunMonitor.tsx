'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal, Pause, Play, XCircle, RotateCcw, Download, Maximize2,
  Clock, Server, Activity, ChevronRight, Filter, RefreshCw, Cpu,
  HardDrive, Wifi, Database, CheckCircle2, AlertCircle, Info,
  AlertTriangle, Debug, Copy, Check, ChevronDown, ChevronUp, Search,
  Square, CheckSquare, Gauge, Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface NodeStep {
  id: string;
  name: string;
  status: 'success' | 'running' | 'pending' | 'failed' | 'skipped';
  startTime: string;
  endTime: string | null;
  duration: string;
  host: string;
  inputParams: { name: string; value: string }[];
  outputResult: string;
  retryCount: number;
  dependencies: string[];
}

interface LogEntry {
  ts: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  node: string;
  msg: string;
}

interface TargetHost {
  name: string;
  ip: string;
  status: 'completed' | 'running' | 'pending' | 'failed' | 'skipped';
  progress: number;
  time: string;
  errors: number;
  warnings: number;
}

interface ResourceMetric {
  time: string;
  cpu: number;
  memory: number;
  network: number;
  disk: number;
}

const initialNodes: NodeStep[] = [
  {
    id: 'N1', name: '任务初始化', status: 'success', startTime: '09:42:18', endTime: '09:42:19',
    duration: '1.2s', host: 'scheduler-01',
    inputParams: [{ name: 'taskId', value: 'RUN-2026060301' }, { name: 'policy', value: 'baseline_check_v2' }],
    outputResult: 'Task initialized successfully', retryCount: 0, dependencies: []
  },
  {
    id: 'N2', name: '目标资产发现', status: 'success', startTime: '09:42:19', endTime: '09:43:05',
    duration: '46s', host: 'controller-01',
    inputParams: [{ name: 'subnet', value: '192.168.2.0/24' }, { name: 'scanMode', value: 'active' }],
    outputResult: 'Discovered 12 hosts', retryCount: 0, dependencies: ['N1']
  },
  {
    id: 'N3', name: '凭据校验', status: 'success', startTime: '09:43:05', endTime: '09:43:12',
    duration: '7s', host: 'auth-svc',
    inputParams: [{ name: 'credentialSet', value: 'default' }],
    outputResult: 'All credentials validated', retryCount: 0, dependencies: ['N2']
  },
  {
    id: 'N4', name: 'SSH连接建立', status: 'success', startTime: '09:43:12', endTime: '09:43:18',
    duration: '6s', host: 'agent-01',
    inputParams: [{ name: 'hostList', value: '12 hosts' }, { name: 'timeout', value: '30s' }],
    outputResult: '12 SSH connections established', retryCount: 0, dependencies: ['N3']
  },
  {
    id: 'N5', name: '基线规则下发', status: 'success', startTime: '09:43:18', endTime: '09:43:24',
    duration: '6s', host: 'agent-01',
    inputParams: [{ name: 'ruleSet', value: 'CIS-CentOS-Linux-7-v3.0.0' }, { name: 'ruleCount', value: '247' }],
    outputResult: 'Rules distributed to all hosts', retryCount: 0, dependencies: ['N4']
  },
  {
    id: 'N6', name: '基线检查执行', status: 'running', startTime: '09:43:24', endTime: null,
    duration: '进行中 20m', host: 'agent-01',
    inputParams: [{ name: 'parallelism', value: '4' }, { name: 'timeout', value: '120s' }],
    outputResult: '', retryCount: 1, dependencies: ['N5']
  },
  {
    id: 'N7', name: '结果采集', status: 'pending', startTime: '-', endTime: null,
    duration: '未开始', host: '-',
    inputParams: [], outputResult: '', retryCount: 0, dependencies: ['N6']
  },
  {
    id: 'N8', name: '结果聚合', status: 'pending', startTime: '-', endTime: null,
    duration: '未开始', host: '-',
    inputParams: [], outputResult: '', retryCount: 0, dependencies: ['N7']
  },
  {
    id: 'N9', name: '报告生成', status: 'pending', startTime: '-', endTime: null,
    duration: '未开始', host: '-',
    inputParams: [], outputResult: '', retryCount: 0, dependencies: ['N8']
  },
  {
    id: 'N10', name: '通知推送', status: 'pending', startTime: '-', endTime: null,
    duration: '未开始', host: '-',
    inputParams: [], outputResult: '', retryCount: 0, dependencies: ['N9']
  },
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

const initialHosts: TargetHost[] = [
  { name: 'server-01', ip: '192.168.2.10', status: 'completed', progress: 100, time: '1m 24s', errors: 0, warnings: 2 },
  { name: 'server-02', ip: '192.168.2.11', status: 'completed', progress: 100, time: '1m 18s', errors: 0, warnings: 1 },
  { name: 'server-03', ip: '192.168.2.12', status: 'completed', progress: 100, time: '1m 32s', errors: 1, warnings: 3 },
  { name: 'server-04', ip: '192.168.2.13', status: 'completed', progress: 100, time: '1m 21s', errors: 0, warnings: 0 },
  { name: 'server-05', ip: '192.168.2.14', status: 'completed', progress: 100, time: '1m 56s', errors: 0, warnings: 4 },
  { name: 'server-06', ip: '192.168.2.15', status: 'completed', progress: 100, time: '1m 29s', errors: 0, warnings: 1 },
  { name: 'server-07', ip: '192.168.2.16', status: 'completed', progress: 100, time: '1m 33s', errors: 0, warnings: 2 },
  { name: 'server-08', ip: '192.168.2.17', status: 'running', progress: 88, time: '1m 45s', errors: 0, warnings: 3 },
  { name: 'server-09', ip: '192.168.2.18', status: 'running', progress: 72, time: '1m 12s', errors: 0, warnings: 1 },
  { name: 'server-10', ip: '192.168.2.19', status: 'running', progress: 65, time: '1m 08s', errors: 1, warnings: 0 },
  { name: 'server-11', ip: '192.168.2.20', status: 'running', progress: 45, time: '0m 52s', errors: 0, warnings: 2 },
  { name: 'server-12', ip: '192.168.2.21', status: 'pending', progress: 0, time: '等待中', errors: 0, warnings: 0 },
];

const generateResourceMetrics = (): ResourceMetric[] => {
  const metrics: ResourceMetric[] = [];
  const now = new Date();
  for (let i = 19; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 1000);
    metrics.push({
      time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      cpu: 45 + Math.random() * 30 + (i < 5 ? 10 : 0),
      memory: 35 + Math.random() * 20,
      network: 20 + Math.random() * 30,
      disk: 10 + Math.random() * 20,
    });
  }
  return metrics;
};

const resourceMetricsHistory = generateResourceMetrics();

export function TaskRunMonitor() {
  const [logs, setLogs] = useState(initialLogs);
  const [running, setRunning] = useState(true);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState('');
  const [selectedNode, setSelectedNode] = useState<NodeStep | null>(null);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [expandedHostSection, setExpandedHostSection] = useState(true);
  const [resourceMetrics, setResourceMetrics] = useState(resourceMetricsHistory);
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
          'host server-08: 240/247 rules checked',
          'host server-09: 180/247 rules checked',
        ][Math.floor(Math.random() * 8)],
      };
      setLogs(prev => [...prev.slice(-200), next]);
    }, 2000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setResourceMetrics(prev => {
        const newMetrics = [...prev.slice(1)];
        const now = new Date();
        newMetrics.push({
          time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.min(100, Math.max(30, resourceMetrics[resourceMetrics.length - 1]?.cpu || 50 + (Math.random() - 0.5) * 10)),
          memory: Math.min(100, Math.max(30, resourceMetrics[resourceMetrics.length - 1]?.memory || 40 + (Math.random() - 0.5) * 5)),
          network: Math.min(100, Math.max(10, resourceMetrics[resourceMetrics.length - 1]?.network || 25 + (Math.random() - 0.5) * 15)),
          disk: Math.min(100, Math.max(5, resourceMetrics[resourceMetrics.length - 1]?.disk || 15 + (Math.random() - 0.5) * 10)),
        });
        return newMetrics;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [running]);

  const filteredLogs = logs.filter(l => {
    const matchFilter = logFilter === 'all' || l.level === logFilter;
    const matchSearch = !logSearch || l.msg.toLowerCase().includes(logSearch.toLowerCase()) ||
                        l.node.toLowerCase().includes(logSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  const toggleSelectHost = (name: string) => {
    setSelectedHosts(prev => prev.includes(name) ? prev.filter(h => h !== name) : [...prev, name]);
  };

  const toggleSelectAllHosts = () => {
    const allHosts = initialHosts.map(h => h.name);
    setSelectedHosts(prev => prev.length === allHosts.length ? [] : allHosts);
  };

  const handleBatchRetry = () => {
    alert(`正在重试选中的 ${selectedHosts.length} 台主机...`);
    setSelectedHosts([]);
  };

  const handleBatchSkip = () => {
    alert(`正在跳过选中的 ${selectedHosts.length} 台主机...`);
    setSelectedHosts([]);
  };

  const handleExportLogs = () => {
    const csv = logs.map(l => `${l.ts},${l.level},${l.node},"${l.msg}"`).join('\n');
    const blob = new Blob([`timestamp,level,node,message\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-logs-${Date.now()}.csv`;
    a.click();
  };

  const copyLog = (log: LogEntry) => {
    navigator.clipboard.writeText(`${log.ts} [${log.level}] [${log.node}] ${log.msg}`);
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'success': return { bg: '#00C853', border: '#00C853', text: '#fff' };
      case 'running': return { bg: '#0066FF', border: '#0066FF', text: '#fff' };
      case 'pending': return { bg: '#4A5570', border: '#4A5570', text: '#fff' };
      case 'failed': return { bg: '#FF3B30', border: '#FF3B30', text: '#fff' };
      case 'skipped': return { bg: '#FF9100', border: '#FF9100', text: '#fff' };
      default: return { bg: '#4A5570', border: '#4A5570', text: '#fff' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      case 'running': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'skipped': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const drawConnections = useCallback(() => {
    const connections = [];
    const nodePositions: Record<string, { x: number; y: number }> = {};
    const cols = 5;
    const rows = 2;
    const spacingX = 140;
    const spacingY = 100;
    const startX = 60;
    const startY = 40;

    initialNodes.forEach((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      nodePositions[node.id] = {
        x: startX + col * spacingX,
        y: startY + row * spacingY,
      };
    });

    initialNodes.forEach(node => {
      node.dependencies.forEach(depId => {
        const source = nodePositions[depId];
        const target = nodePositions[node.id];
        if (source && target) {
          connections.push(
            <path
              key={`${depId}-${node.id}`}
              d={`M ${source.x + 40} ${source.y + 20} C ${source.x + 60} ${source.y + 20}, ${target.x - 60} ${target.y + 20}, ${target.x - 10} ${target.y + 20}`}
              stroke="#3A4560"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          );
        }
      });
    });

    return { connections, nodePositions };
  }, []);

  const { connections, nodePositions } = drawConnections();

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-[#F3F4F6]">任务运行监控 — RUN-2026060301</h2>
              <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
                running ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-[#FF9100]/20 text-[#FF9100]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${running ? 'bg-[#00C853] animate-pulse' : 'bg-[#FF9100]'}`} />
                {running ? '运行中' : '已暂停'}
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">核心服务器基线检查 · 12 台主机 · 已运行 20 分 35 秒</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRunning(!running)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
                running 
                  ? 'bg-[#FF9100] hover:bg-[#FFA000] text-white' 
                  : 'bg-[#00C853] hover:bg-[#00B048] text-white'
              }`}
            >
              {running ? <><Pause className="w-4 h-4" />暂停</> : <><Play className="w-4 h-4" />继续</>}
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm transition-colors">
              <RotateCcw className="w-4 h-4" />重试
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#FF3B30] hover:bg-[#FF6B5A] text-white rounded-lg text-sm transition-colors">
              <XCircle className="w-4 h-4" />停止
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm transition-colors">
              <Maximize2 className="w-4 h-4" />全屏
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4 overflow-hidden">
        {/* 左侧：DAG拓扑图 */}
        <div className="xl:col-span-1 bg-[#20293F] border border-[#2A354D] rounded-xl p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0066FF]" />
              DAG 执行拓扑图
            </h3>
            <span className="text-xs text-[#9CA3AF]">{initialNodes.filter(n => n.status === 'success').length}/{initialNodes.length} 完成</span>
          </div>
          
          <div className="flex-1 overflow-auto">
            <svg viewBox="0 0 720 220" className="w-full">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3A4560" />
                </marker>
              </defs>
              {connections}
              {initialNodes.map(node => {
                const pos = nodePositions[node.id];
                const colors = getNodeColor(node.status);
                return (
                  <g key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer">
                    <rect
                      x={pos?.x || 0}
                      y={pos?.y || 0}
                      width="80"
                      height="40"
                      rx="6"
                      fill={colors.bg}
                      stroke={colors.border}
                      strokeWidth="2"
                      className="transition-all hover:stroke-white/50"
                    />
                    <text
                      x={(pos?.x || 0) + 40}
                      y={(pos?.y || 0) + 16}
                      textAnchor="middle"
                      fill={colors.text}
                      fontSize="10"
                      fontWeight="500"
                    >
                      {node.id}
                    </text>
                    <text
                      x={(pos?.x || 0) + 40}
                      y={(pos?.y || 0) + 28}
                      textAnchor="middle"
                      fill={colors.text}
                      fontSize="9"
                    >
                      {node.name}
                    </text>
                    {node.status === 'running' && (
                      <circle
                        cx={(pos?.x || 0) + 70}
                        cy={(pos?.y || 0) + 10}
                        r="4"
                        fill="#fff"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 中间：目标主机 + 节点详情 */}
        <div className="xl:col-span-1 space-y-4 overflow-hidden flex flex-col">
          {/* 目标主机 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden flex flex-col flex-1">
            <div className="p-4 border-b border-[#2A354D]">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setExpandedHostSection(!expandedHostSection)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#F3F4F6]"
                >
                  <Server className="w-4 h-4 text-[#0066FF]" />
                  目标主机管理
                  {expandedHostSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSelectAllHosts}
                    className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#F3F4F6]"
                  >
                    {selectedHosts.length === initialHosts.length ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    全选
                  </button>
                  <span className="text-xs text-[#9CA3AF]">{selectedHosts.length} 已选</span>
                </div>
              </div>
            </div>
            
            {expandedHostSection && (
              <>
                {selectedHosts.length > 0 && (
                  <div className="px-4 py-2 bg-[#181F32] border-b border-[#2A354D] flex items-center gap-2">
                    <button
                      onClick={handleBatchRetry}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg text-xs"
                    >
                      <RotateCcw className="w-3 h-3" />
                      批量重试
                    </button>
                    <button
                      onClick={handleBatchSkip}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9100] hover:bg-[#FFA000] text-white rounded-lg text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      批量跳过
                    </button>
                    <button
                      onClick={() => setSelectedHosts([])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-xs"
                    >
                      取消选择
                    </button>
                  </div>
                )}
                
                <div className="flex-1 overflow-auto p-2 space-y-1">
                  {initialHosts.map(host => (
                    <div
                      key={host.name}
                      className={`bg-[#181F32] border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedHosts.includes(host.name) 
                          ? 'border-[#0066FF] bg-[#0066FF]/10' 
                          : 'border-[#2A354D] hover:border-[#3A4560]'
                      }`}
                      onClick={() => toggleSelectHost(host.name)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedHosts.includes(host.name)}
                          onChange={(e) => e.stopPropagation()}
                          className="rounded border-[#3A4560] bg-[#111625] text-[#4D94FF] focus:ring-[#0066FF]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#F3F4F6] font-medium">{host.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              host.status === 'completed' ? 'bg-[#00C853]/20 text-[#00C853]' :
                              host.status === 'running' ? 'bg-[#0066FF]/20 text-[#0066FF]' :
                              host.status === 'failed' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                              'bg-[#4A5570]/20 text-[#9CA3AF]'
                            }`}>
                              {host.status === 'completed' ? '完成' : host.status === 'running' ? '执行中' : host.status === 'failed' ? '失败' : '等待'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex-1">
                              <div className="h-1.5 bg-[#20293F] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    host.status === 'completed' ? 'bg-[#00C853]' :
                                    host.status === 'running' ? 'bg-[#0066FF]' :
                                    host.status === 'failed' ? 'bg-[#FF3B30]' : 'bg-[#4A5570]'
                                  }`}
                                  style={{ width: `${host.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-[#9CA3AF] w-12 text-right">{host.progress}%</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-[#9CA3AF]">
                            <span className="font-mono">{host.ip}</span>
                            <span>·</span>
                            <span>{host.time}</span>
                            {host.errors > 0 && (
                              <span className="flex items-center gap-0.5 text-[#FF3B30]">
                                <XCircle className="w-3 h-3" />{host.errors}
                              </span>
                            )}
                            {host.warnings > 0 && (
                              <span className="flex items-center gap-0.5 text-[#FF9100]">
                                <AlertTriangle className="w-3 h-3" />{host.warnings}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 节点详情面板 */}
          {selectedNode && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
                  {getStatusIcon(selectedNode.status)}
                  节点详情 - {selectedNode.id}
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[#9CA3AF] hover:text-[#F3F4F6]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">节点名称</span>
                  <span className="text-[#F3F4F6]">{selectedNode.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">状态</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs ${
                    selectedNode.status === 'success' ? 'bg-[#00C853]/20 text-[#00C853]' :
                    selectedNode.status === 'running' ? 'bg-[#0066FF]/20 text-[#0066FF]' :
                    selectedNode.status === 'failed' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                    'bg-[#4A5570]/20 text-[#9CA3AF]'
                  }`}>
                    {selectedNode.status === 'success' ? '成功' : selectedNode.status === 'running' ? '运行中' : selectedNode.status === 'failed' ? '失败' : '等待'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">执行主机</span>
                  <span className="text-[#F3F4F6]">{selectedNode.host}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">开始时间</span>
                  <span className="text-[#F3F4F6]">{selectedNode.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">结束时间</span>
                  <span className="text-[#F3F4F6]">{selectedNode.endTime || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">耗时</span>
                  <span className="text-[#F3F4F6]">{selectedNode.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">重试次数</span>
                  <span className="text-[#F3F4F6]">{selectedNode.retryCount}</span>
                </div>
                
                {selectedNode.inputParams.length > 0 && (
                  <div>
                    <span className="text-[#9CA3AF] block mb-1">输入参数</span>
                    <div className="bg-[#181F32] rounded-lg p-2 space-y-1">
                      {selectedNode.inputParams.map((param, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-[#9CA3AF]">{param.name}</span>
                          <span className="text-[#F3F4F6] font-mono">{param.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedNode.outputResult && (
                  <div>
                    <span className="text-[#9CA3AF] block mb-1">输出结果</span>
                    <div className="bg-[#181F32] rounded-lg p-2 text-xs text-[#F3F4F6]">
                      {selectedNode.outputResult}
                    </div>
                  </div>
                )}
                
                {selectedNode.dependencies.length > 0 && (
                  <div>
                    <span className="text-[#9CA3AF] block mb-1">依赖节点</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.dependencies.map(dep => (
                        <span key={dep} className="px-2 py-0.5 bg-[#0066FF]/20 text-[#0066FF] rounded text-xs">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：资源趋势 + 实时日志 */}
        <div className="xl:col-span-1 space-y-4 overflow-hidden flex flex-col">
          {/* 资源趋势图 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-[#0066FF]" />
              资源使用趋势
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resourceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    axisLine={{ stroke: '#2A354D' }}
                    tickLine={{ stroke: '#2A354D' }}
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    axisLine={{ stroke: '#2A354D' }}
                    tickLine={{ stroke: '#2A354D' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181F32', border: '1px solid #2A354D' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="cpu" stroke="#0066FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="memory" stroke="#00C853" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="network" stroke="#9333EA" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#0066FF] rounded" />
                <span className="text-xs text-[#9CA3AF]">CPU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#00C853] rounded" />
                <span className="text-xs text-[#9CA3AF]">内存</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#9333EA] rounded" />
                <span className="text-xs text-[#9CA3AF]">网络</span>
              </div>
            </div>
          </div>

          {/* 实时日志 */}
          <div className="bg-[#111625] border border-[#2A354D] rounded-xl overflow-hidden flex-1 flex flex-col">
            <div className="px-4 py-2 border-b border-[#2A354D] bg-[#20293F]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00C853]" />
                  实时执行日志
                </h3>
                <button
                  onClick={handleExportLogs}
                  className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#F3F4F6]"
                  title="导出日志"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="px-3 py-2 border-b border-[#2A354D] bg-[#20293F]">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="搜索日志..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 bg-[#181F32] border border-[#2A354D] rounded-lg text-xs text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {(['all', 'INFO', 'WARN', 'ERROR'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setLogFilter(f)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        logFilter === f 
                          ? 'bg-[#0066FF] text-white' 
                          : 'bg-[#181F32] text-[#9CA3AF] hover:text-[#F3F4F6]'
                      }`}
                    >
                      {f === 'all' ? '全部' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-2 font-mono text-xs leading-relaxed">
              {filteredLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-2 hover:bg-[#20293F]/50 px-1 py-0.5 rounded"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    copyLog(log);
                  }}
                  title="右键复制"
                >
                  <span className="text-[#6B7280] shrink-0 w-20">{log.ts}</span>
                  <span className={`shrink-0 w-14 ${
                    log.level === 'ERROR' ? 'text-[#FF3B30]' :
                    log.level === 'WARN' ? 'text-[#FF9100]' :
                    log.level === 'INFO' ? 'text-[#00C853]' : 'text-[#6B7280]'
                  }`}>{log.level}</span>
                  <span className="text-[#9333EA] shrink-0 w-16">[{log.node}]</span>
                  <span className="text-[#D1D5DB] break-all">{log.msg}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
            
            <div className="px-3 py-2 border-t border-[#2A354D] bg-[#20293F] flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF]">{filteredLogs.length} 条日志</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${running ? 'bg-[#00C853] animate-pulse' : 'bg-[#FF9100]'}`} />
                <span className="text-[#9CA3AF]">{running ? '实时更新中' : '已暂停'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}