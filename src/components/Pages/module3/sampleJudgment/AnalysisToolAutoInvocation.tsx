'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain, Settings, Play, Pause, RefreshCw, Activity, CheckCircle2, XCircle, AlertTriangle, Clock,
  Zap, FileText, Hash, Server, Database, Search, Filter, Download, Plus, Wrench, GitBranch, Cpu, BarChart3, Eye, Loader2, Target,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/Common/StatusBadge';

/**
 * 3-6-3 分析工具自动调用
 *
 * 6 大工具：YARA / Cuckoo / VirusTotal / Hybrid / 静态分析 / 沙箱
 * - 工具能力矩阵
 * - 智能编排（单工具 / 多工具链 / 自动选型）
 * - 调用队列
 * - 工具健康度
 */

type ToolType = 'yara' | 'cuckoo' | 'virustotal' | 'hybrid' | 'static' | 'sandbox';
type ToolStatus = 'online' | 'busy' | 'offline' | 'error';
type InvocationMode = 'single' | 'chain' | 'auto';
type QueueStatus = 'queued' | 'running' | 'completed' | 'failed';

interface Tool {
  id: string;
  name: ToolType;
  fullName: string;
  vendor: string;
  status: ToolStatus;
  endpoint: string;
  capabilities: Record<string, number>; // 10 维度 0-100
  avgResponse: number; // 秒
  successRate: number; // %
  todayInvocations: number;
  queueLength: number;
  health: 'healthy' | 'degraded' | 'critical';
}

const TOOLS: Tool[] = [
  { id: 'TL-YARA', name: 'yara', fullName: 'YARA 规则引擎', vendor: 'VirusTotal', status: 'online', endpoint: 'grpc://yara-engine:8080', capabilities: { 静态特征: 98, 动态行为: 0, 网络流量: 0, 文件操作: 95, 进程行为: 0, 威胁情报: 92, 家族聚类: 88, 熵值分析: 95, 字符串提取: 100, 元数据分析: 90 }, avgResponse: 1.2, successRate: 99.5, todayInvocations: 234, queueLength: 2, health: 'healthy' },
  { id: 'TL-CUCKOO', name: 'cuckoo', fullName: 'Cuckoo 动态沙箱', vendor: 'Cuckoo', status: 'busy', endpoint: 'cuckoo://sandbox:8000', capabilities: { 静态特征: 0, 动态行为: 98, 网络流量: 95, 文件操作: 92, 进程行为: 96, 威胁情报: 0, 家族聚类: 85, 熵值分析: 0, 字符串提取: 60, 元数据分析: 75 }, avgResponse: 120, successRate: 88.2, todayInvocations: 56, queueLength: 8, health: 'healthy' },
  { id: 'TL-VT', name: 'virustotal', fullName: 'VirusTotal 云扫描', vendor: 'Google', status: 'online', endpoint: 'https://www.virustotal.com/api/v3', capabilities: { 静态特征: 100, 动态行为: 0, 网络流量: 0, 文件操作: 0, 进程行为: 0, 威胁情报: 100, 家族聚类: 95, 熵值分析: 0, 字符串提取: 100, 元数据分析: 100 }, avgResponse: 3.5, successRate: 99.9, todayInvocations: 456, queueLength: 0, health: 'healthy' },
  { id: 'TL-HYB', name: 'hybrid', fullName: 'Hybrid Analysis', vendor: 'CrowdStrike', status: 'online', endpoint: 'https://hybrid-analysis.com/api/v2', capabilities: { 静态特征: 90, 动态行为: 95, 网络流量: 92, 文件操作: 88, 进程行为: 94, 威胁情报: 96, 家族聚类: 90, 熵值分析: 0, 字符串提取: 85, 元数据分析: 88 }, avgResponse: 45, successRate: 97.8, todayInvocations: 89, queueLength: 3, health: 'healthy' },
  { id: 'TL-STA', name: 'static', fullName: 'PE 静态分析器', vendor: '自研', status: 'online', endpoint: 'grpc://static-analyzer:9090', capabilities: { 静态特征: 96, 动态行为: 0, 网络流量: 0, 文件操作: 88, 进程行为: 0, 威胁情报: 80, 家族聚类: 75, 熵值分析: 98, 字符串提取: 96, 元数据分析: 100 }, avgResponse: 0.8, successRate: 99.2, todayInvocations: 312, queueLength: 1, health: 'healthy' },
  { id: 'TL-SBX', name: 'sandbox', fullName: 'CAPE 高级沙箱', vendor: 'Stratosphere', status: 'error', endpoint: 'cape://sandbox-cluster:8001', capabilities: { 静态特征: 85, 动态行为: 96, 网络流量: 98, 文件操作: 90, 进程行为: 95, 威胁情报: 88, 家族聚类: 82, 熵值分析: 0, 字符串提取: 78, 元数据分析: 80 }, avgResponse: 180, successRate: 75.5, todayInvocations: 23, queueLength: 0, health: 'critical' },
];

interface QueueItem {
  id: string;
  sampleName: string;
  mode: InvocationMode;
  tools: ToolType[];
  status: QueueStatus;
  progress: number;
  submitTime: string;
  duration: number;
}

const INITIAL_QUEUE: QueueItem[] = [
  { id: 'IQ-001', sampleName: 'APT-29 phishing', mode: 'auto', tools: ['yara', 'virustotal', 'hybrid', 'cuckoo'], status: 'running', progress: 65, submitTime: '10:30:15', duration: 47 },
  { id: 'IQ-002', sampleName: 'LockBit v4', mode: 'chain', tools: ['static', 'yara', 'virustotal', 'hybrid', 'cuckoo'], status: 'running', progress: 80, submitTime: '10:35:00', duration: 30 },
  { id: 'IQ-003', sampleName: 'unknown.bin', mode: 'auto', tools: ['yara', 'virustotal', 'cuckoo'], status: 'queued', progress: 0, submitTime: '10:38:22', duration: 0 },
  { id: 'IQ-004', sampleName: 'emotet.dll', mode: 'single', tools: ['yara'], status: 'completed', progress: 100, submitTime: '10:15:00', duration: 3 },
  { id: 'IQ-005', sampleName: 'crypt32.dll', mode: 'chain', tools: ['static', 'virustotal', 'hybrid'], status: 'failed', progress: 33, submitTime: '10:20:00', duration: 15 },
  { id: 'IQ-006', sampleName: 'mirai.elf', mode: 'auto', tools: ['static', 'virustotal', 'sandbox'], status: 'queued', progress: 0, submitTime: '10:40:00', duration: 0 },
];

const TOOL_DISPLAY: Record<ToolType, { label: string; icon: any; color: string }> = {
  yara: { label: 'YARA', icon: FileText, color: 'text-blue-400 bg-blue-500/10' },
  cuckoo: { label: 'Cuckoo', icon: Brain, color: 'text-purple-400 bg-purple-500/10' },
  virustotal: { label: 'VirusTotal', icon: Search, color: 'text-cyan-400 bg-cyan-500/10' },
  hybrid: { label: 'Hybrid', icon: GitBranch, color: 'text-orange-400 bg-orange-500/10' },
  static: { label: 'Static', icon: Cpu, color: 'text-green-400 bg-green-500/10' },
  sandbox: { label: 'CAPE', icon: Server, color: 'text-red-400 bg-red-500/10' },
};

const STATUS_BADGE: Record<ToolStatus, { status: any; text: string }> = {
  online: { status: 'success', text: '在线' },
  busy: { status: 'running', text: '繁忙' },
  offline: { status: 'info', text: '离线' },
  error: { status: 'failed', text: '故障' },
};

const MODE_BADGE: Record<InvocationMode, { label: string; color: string }> = {
  single: { label: '单工具', color: 'text-blue-400 bg-blue-500/10' },
  chain: { label: '工具链', color: 'text-purple-400 bg-purple-500/10' },
  auto: { label: 'AI 选型', color: 'text-cyan-400 bg-cyan-500/10' },
};

const CAPABILITY_DIMENSIONS = ['静态特征', '动态行为', '网络流量', '文件操作', '进程行为', '威胁情报', '家族聚类', '熵值分析', '字符串提取', '元数据分析'];

const QUEUE_BADGE: Record<QueueStatus, { status: any; text: string }> = {
  queued: { status: 'pending', text: '排队' },
  running: { status: 'running', text: '运行' },
  completed: { status: 'success', text: '完成' },
  failed: { status: 'failed', text: '失败' },
};

const HEALTH_BADGE = {
  healthy: { status: 'success', text: '健康' },
  degraded: { status: 'warning', text: '降级' },
  critical: { status: 'failed', text: '严重' },
};

const RADAR_COLORS = ['#3B82F6', '#A855F7', '#06B6D4', '#F97316', '#10B981', '#EF4444'];

export function AnalysisToolAutoInvocation() {
  const [tools, setTools] = useState<Tool[]>(TOOLS);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(null);

  // 实时推进队列
  useEffect(() => {
    const timer = setInterval(() => {
      setQueue((prev) => prev.map((q) => {
        if (q.status !== 'running') return q;
        const np = Math.min(100, q.progress + 5);
        if (np >= 100) return { ...q, progress: 100, status: 'completed' as QueueStatus, duration: q.duration + 1 };
        return { ...q, progress: np, duration: q.duration + 1 };
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // KPI
  const online = tools.filter(t => t.status === 'online' || t.status === 'busy').length;
  const totalInvocations = tools.reduce((s, t) => s + t.todayInvocations, 0);
  const avgSuccess = Math.round(tools.reduce((s, t) => s + t.successRate, 0) / tools.length * 10) / 10;
  const avgResponse = Math.round(tools.reduce((s, t) => s + t.avgResponse, 0) / tools.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-400" />
            分析工具自动调用
          </h1>
          <p className="text-slate-400 mt-1 text-sm">6 大分析工具智能调度 · 单工具 / 工具链 / AI 自动选型</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><RefreshCw className="w-4 h-4 mr-1" />健康检查</Button>
          <Button variant="primary"><Plus className="w-4 h-4 mr-1" />新建调用</Button>
        </div>
      </div>

      {/* 4 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="在线工具" value={`${online} / ${tools.length}`} color="text-green-400" icon={CheckCircle2} sub="实时监测" />
        <KPI label="今日调用" value={totalInvocations} color="text-blue-400" icon={Activity} sub="跨所有工具" />
        <KPI label="平均成功率" value={`${avgSuccess}%`} color="text-cyan-400" icon={Target} sub="质量评估" />
        <KPI label="平均响应" value={`${avgResponse}s`} color="text-purple-400" icon={Clock} sub="较昨日 -0.5s" />
      </div>

      {/* 6 工具卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => {
          const Icon = TOOL_DISPLAY[tool.name].icon;
          return (
            <Card key={tool.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TOOL_DISPLAY[tool.name].color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{tool.fullName}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{tool.vendor}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={STATUS_BADGE[tool.status].status} />
                  <StatusBadge status={HEALTH_BADGE[tool.health].status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <Field label="今日调用" value={String(tool.todayInvocations)} />
                <Field label="队列长度" value={String(tool.queueLength)} />
                <Field label="响应时间" value={`${tool.avgResponse}s`} />
                <Field label="成功率" value={`${tool.successRate}%`} />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#2A354D]">
                <Button variant="ghost" size="sm">
                  <Play className="w-3.5 h-3.5 mr-1" />调用
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-3.5 h-3.5 mr-1" />配置
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTool(tool)}>
                  <Eye className="w-3.5 h-3.5 mr-1" />详情
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 工具能力矩阵 - 雷达图 */}
      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />工具能力矩阵（10 维度 × 6 工具）
        </h3>
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart>
            <PolarGrid stroke="#2A354D" />
            <PolarAngleAxis dataKey="dim" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            {tools.map((tool, idx) => {
              const data = CAPABILITY_DIMENSIONS.map(dim => ({ dim, val: tool.capabilities[dim] || 0 }));
              return (
                <Radar key={tool.id} name={TOOL_DISPLAY[tool.name].label} dataKey="val" data={data} stroke={RADAR_COLORS[idx]} fill={RADAR_COLORS[idx]} fillOpacity={0.05} strokeWidth={1.5} />
              );
            })}
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* 调用队列 */}
      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />调用队列
          <span className="text-[10px] text-slate-500">（每 3 秒推进）</span>
        </h3>
        <div className="space-y-2">
          {queue.map((q) => (
            <div key={q.id} className="p-3 bg-[#111625] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-500 w-12">{q.id}</span>
                  <span className="text-sm text-slate-100">{q.sampleName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${MODE_BADGE[q.mode].color}`}>{MODE_BADGE[q.mode].label}</span>
                  <StatusBadge status={QUEUE_BADGE[q.status].status} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">耗时 {q.duration}s</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedQueue(q)}>
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* 工具链 */}
              <div className="flex items-center gap-1 mb-2">
                {q.tools.map((t, idx) => {
                  const Td = TOOL_DISPLAY[t];
                  const TIcon = Td.icon;
                  return (
                    <React.Fragment key={t}>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${Td.color}`}>
                        <TIcon className="w-3 h-3" />
                        <span className="text-[10px]">{Td.label}</span>
                      </span>
                      {idx < q.tools.length - 1 && <span className="text-slate-600">→</span>}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* 进度条 */}
              {q.status === 'running' && (
                <div className="h-1.5 bg-[#0A0E1A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${q.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 工具详情抽屉 */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setSelectedTool(null)}>
          <div className="relative bg-[#111625] border-l border-[#2A354D] w-full max-w-2xl h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${TOOL_DISPLAY[selectedTool.name].color}`}>
                    {(() => { const I = TOOL_DISPLAY[selectedTool.name].icon; return <I className="w-6 h-6" />; })()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">{selectedTool.fullName}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedTool.vendor} · {selectedTool.id}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTool(null)}>关闭</Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="接入点" value={selectedTool.endpoint} />
                <Field label="平均响应" value={`${selectedTool.avgResponse}s`} />
                <Field label="成功率" value={`${selectedTool.successRate}%`} />
                <Field label="今日调用" value={String(selectedTool.todayInvocations)} />
                <Field label="队列长度" value={String(selectedTool.queueLength)} />
                <Field label="健康度" value={HEALTH_BADGE[selectedTool.health].text} />
              </div>

              <Card>
                <h4 className="text-sm font-medium text-slate-200 mb-3">能力评分（10 维度）</h4>
                <div className="space-y-2">
                  {CAPABILITY_DIMENSIONS.map((dim) => {
                    const score = selectedTool.capabilities[dim] || 0;
                    return (
                      <div key={dim} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-24">{dim}</span>
                        <div className="flex-1 h-1.5 bg-[#0A0E1A] rounded-full overflow-hidden">
                          <div className={`h-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-slate-600'}`} style={{ width: `${score}%` }} />
                        </div>
                        <span className="text-xs text-slate-200 w-10 text-right">{score}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* 队列详情抽屉 */}
      {selectedQueue && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setSelectedQueue(null)}>
          <div className="relative bg-[#111625] border-l border-[#2A354D] w-full max-w-xl h-full overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-100">{selectedQueue.sampleName}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedQueue(null)}>关闭</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Field label="任务 ID" value={selectedQueue.id} />
              <Field label="调用模式" value={MODE_BADGE[selectedQueue.mode].label} />
              <Field label="提交时间" value={selectedQueue.submitTime} />
              <Field label="耗时" value={`${selectedQueue.duration}s`} />
              <Field label="进度" value={`${selectedQueue.progress}%`} />
              <Field label="状态" value={QUEUE_BADGE[selectedQueue.status].text} />
            </div>
            <h4 className="text-sm font-medium text-slate-200 mb-2">工具链执行顺序</h4>
            <div className="space-y-2">
              {selectedQueue.tools.map((t, idx) => {
                const Td = TOOL_DISPLAY[t];
                const TIcon = Td.icon;
                return (
                  <div key={t} className="flex items-center gap-2 p-2 bg-[#111625] rounded">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center">{idx + 1}</span>
                    <TIcon className={`w-4 h-4 ${Td.color.split(' ')[0]}`} />
                    <span className="text-sm text-slate-200">{Td.label}</span>
                    <span className="ml-auto text-[10px] text-slate-500">~{tools.find(x => x.name === t)?.avgResponse}s</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, color, icon: Icon, sub }: { label: string; value: number | string; color: string; icon: any; sub?: string }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 bg-[#111625] rounded-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5 break-all">{value}</p>
    </div>
  );
}

export default AnalysisToolAutoInvocation;
