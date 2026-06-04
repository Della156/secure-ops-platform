'use client';

import React, { useState, useMemo } from 'react';
import {
  Brain, Shield, FileText, Hash, Database, Activity, AlertTriangle, CheckCircle2, XCircle, Clock,
  Network, GitBranch, Layers, Search, Filter, ChevronRight, Eye, Award, Target, TrendingUp, Sparkles,
  Cpu, Globe, Lock, Server, Zap, Box, ArrowUpRight, BarChart3,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';

/**
 * 3-6-4 深度研判与结论
 *
 * 单样本的深度研判报告：
 *  - 5 维评估：静态特征 / 动态行为 / 网络行为 / 文件操作 / 进程行为
 *  - 行为时间轴
 *  - 相似样本（家族聚类）
 *  - 威胁情报匹配
 *  - 研判结论 + 处置建议
 *  - 6 个真实样本案例
 */

type Conclusion = 'malicious' | 'suspicious' | 'safe' | 'unknown';
type Severity = 'critical' | 'high' | 'medium' | 'low';

interface Sample {
  id: string;
  name: string;
  hash: string;
  family: string;
  aliases: string[];
  conclusion: Conclusion;
  severity: Severity;
  confidence: number;
  size: number;
  type: string;
  firstSeen: string;
  submitTime: string;
  analyst: string;
  scores: {
    static: number;
    dynamic: number;
    network: number;
    fileOps: number;
    process: number;
  };
  behaviors: { time: string; type: 'info' | 'warning' | 'critical'; event: string }[];
  similar: { hash: string; name: string; family: string; similarity: number }[];
  intel: { source: string; matched: boolean; confidence: number }[];
  recommendation: string[];
}

const SAMPLES: Sample[] = [
  {
    id: 'JC-001', name: 'invoice_0630.docm', hash: 'a3f5c8e9d2b1f4a7e8b3c2d1f6a5b4c7', family: 'APT-29', aliases: ['Cozy Bear', 'The Dukes'],
    conclusion: 'malicious', severity: 'critical', confidence: 98, size: 256000, type: 'Office Document',
    firstSeen: '2026-06-04 09:15:23', submitTime: '2026-06-04 09:15:30', analyst: '张工',
    scores: { static: 92, dynamic: 95, network: 88, fileOps: 90, process: 96 },
    behaviors: [
      { time: '09:15:32', type: 'critical', event: '下载 payload (CobaltStrike beacon) from C2 192.168.1.100' },
      { time: '09:15:34', type: 'warning', event: '创建注册表项 HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' },
      { time: '09:15:36', type: 'critical', event: '执行 PowerShell -enc JABhAGwAbABhAHMAUwBhAHYAZQA=' },
      { time: '09:15:38', type: 'info', event: '尝试访问域控 \\\\DC01\\C$' },
      { time: '09:15:40', type: 'warning', event: '横向移动到 HOST-FIN-002 (SMB)' },
    ],
    similar: [
      { hash: 'b3c7d4...', name: 'phishing_april.docm', family: 'APT-29', similarity: 94 },
      { hash: 'e9b3a7...', name: 'invoice_0520.docm', family: 'APT-29', similarity: 89 },
      { hash: 'c1a3d8...', name: 'order_0215.docm', family: 'APT-29', similarity: 86 },
    ],
    intel: [
      { source: 'MITRE ATT&CK', matched: true, confidence: 96 },
      { source: 'VirusTotal', matched: true, confidence: 98 },
      { source: 'ThreatBook', matched: true, confidence: 92 },
      { source: '微步在线', matched: true, confidence: 94 },
    ],
    recommendation: [
      '立即隔离受感染主机',
      '下发全网 IOC 阻断规则（C2 IP / 文件哈希）',
      '调查横向移动路径，封锁域控访问',
      '溯源最近 30 天邮件日志，定位其他受害者',
    ],
  },
  {
    id: 'JC-002', name: 'lockbit_ransom.exe', hash: 'b7d9e2f1a4c8b3e6d9c2f5a8b1e4c7d0', family: 'LockBit v4', aliases: ['LockBit Black'],
    conclusion: 'malicious', severity: 'critical', confidence: 99, size: 856000, type: 'PE Executable',
    firstSeen: '2026-06-04 08:30:11', submitTime: '2026-06-04 08:30:20', analyst: '李工',
    scores: { static: 96, dynamic: 98, network: 95, fileOps: 99, process: 97 },
    behaviors: [
      { time: '08:30:25', type: 'critical', event: '枚举本地磁盘 C:/ D:/ E:/' },
      { time: '08:30:28', type: 'critical', event: '终止 156 个进程（数据库/备份软件）' },
      { time: '08:30:30', type: 'warning', event: '禁用 Windows Defender' },
      { time: '08:30:35', type: 'critical', event: '加密文件 .lockbit 扩展名' },
      { time: '08:30:40', type: 'critical', event: '上传密钥到 C2 lockbit-pay.onion' },
    ],
    similar: [
      { hash: 'd4e8b2...', name: 'lockbit_v3.exe', family: 'LockBit v3', similarity: 78 },
      { hash: 'a2b6c3...', name: 'lockbit_apt.exe', family: 'LockBit v4', similarity: 92 },
    ],
    intel: [
      { source: 'MITRE ATT&CK', matched: true, confidence: 99 },
      { source: 'VirusTotal', matched: true, confidence: 100 },
      { source: 'ThreatBook', matched: true, confidence: 98 },
    ],
    recommendation: [
      '立即断网隔离',
      '不要支付赎金',
      '联系专业数据恢复公司',
      '上报监管部门和公安机关',
    ],
  },
  {
    id: 'JC-003', name: 'unknown_payload.bin', hash: 'f1c5b9e3a7d4c2f8e5b1a4d7c3f6b9e2', family: '可疑', aliases: ['未分类'],
    conclusion: 'suspicious', severity: 'high', confidence: 72, size: 234567, type: 'Unknown Binary',
    firstSeen: '2026-06-04 05:30:00', submitTime: '2026-06-04 05:30:05', analyst: '张工',
    scores: { static: 65, dynamic: 78, network: 70, fileOps: 68, process: 80 },
    behaviors: [
      { time: '05:30:10', type: 'warning', event: '创建子进程 explorer.exe' },
      { time: '05:30:15', type: 'info', event: '读取系统注册表' },
      { time: '05:30:20', type: 'warning', event: '尝试访问 www.malicious-c2.com' },
    ],
    similar: [
      { hash: 'b3c7d4...', name: 'unknown_001.bin', family: '未分类', similarity: 55 },
    ],
    intel: [
      { source: 'MITRE ATT&CK', matched: true, confidence: 60 },
      { source: 'VirusTotal', matched: false, confidence: 0 },
      { source: 'ThreatBook', matched: false, confidence: 0 },
    ],
    recommendation: [
      '提交深度分析（沙箱 + 人工）',
      '加入可疑名单继续观察',
      '监控相关 C2 域名访问',
    ],
  },
];

const CONCLUSION_BADGE: Record<Conclusion, { status: any; text: string }> = {
  malicious: { status: 'failed', text: '恶意' },
  suspicious: { status: 'warning', text: '可疑' },
  safe: { status: 'success', text: '安全' },
  unknown: { status: 'pending', text: '未知' },
};

const SEVERITY_BADGE: Record<Severity, { status: any; text: string }> = {
  critical: { status: 'failed', text: '严重' },
  high: { status: 'warning', text: '高危' },
  medium: { status: 'info', text: '中危' },
  low: { status: 'info', text: '低危' },
};

const BEHAVIOR_COLORS = {
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  critical: 'border-red-500/30 bg-red-500/10 text-red-300',
};

export function DeepJudgmentConclusion() {
  const [selectedSample, setSelectedSample] = useState<Sample | null>(SAMPLES[0]);

  // 5 维评估雷达数据
  const radarData = useMemo(() => {
    if (!selectedSample) return [];
    return [
      { dimension: '静态特征', score: selectedSample.scores.static },
      { dimension: '动态行为', score: selectedSample.scores.dynamic },
      { dimension: '网络行为', score: selectedSample.scores.network },
      { dimension: '文件操作', score: selectedSample.scores.fileOps },
      { dimension: '进程行为', score: selectedSample.scores.process },
    ];
  }, [selectedSample]);

  // 历史研判趋势
  const historyData = [
    { day: '5/29', count: 28, malicious: 12 },
    { day: '5/30', count: 32, malicious: 14 },
    { day: '5/31', count: 35, malicious: 15 },
    { day: '6/1', count: 38, malicious: 18 },
    { day: '6/2', count: 42, malicious: 21 },
    { day: '6/3', count: 45, malicious: 23 },
    { day: '6/4', count: 48, malicious: 25 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            深度研判与结论
          </h1>
          <p className="text-slate-400 mt-1 text-sm">单样本深度研判报告 · 5 维评估 + 行为时间轴 + 家族聚类 + 情报匹配</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary"><Filter className="w-4 h-4 mr-1" />筛选</Button>
          <Button variant="primary"><FileText className="w-4 h-4 mr-1" />生成报告</Button>
        </div>
      </div>

      {/* 样本选择器 */}
      <Card>
        <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />样本列表（深度研判案例）
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSample(s)}
              className={`text-left p-3 rounded-lg transition-colors ${
                selectedSample?.id === s.id ? 'bg-[#0066FF]/20 border border-[#0066FF]/50' : 'bg-[#111625] border border-transparent hover:border-[#2A354D]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-slate-500">{s.id}</span>
                <StatusBadge status={CONCLUSION_BADGE[s.conclusion].status} />
                <StatusBadge status={SEVERITY_BADGE[s.severity].status} />
              </div>
              <p className="text-sm text-slate-100 truncate">{s.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">家族: {s.family} · 置信度: {s.confidence}%</p>
            </button>
          ))}
        </div>
      </Card>

      {selectedSample && (
        <>
          {/* 样本基本信息 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Card className="lg:col-span-2">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedSample.conclusion === 'malicious' ? 'bg-red-500/20 text-red-400' :
                  selectedSample.conclusion === 'suspicious' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {selectedSample.conclusion === 'malicious' ? <AlertTriangle className="w-6 h-6" /> :
                   selectedSample.conclusion === 'suspicious' ? <Shield className="w-6 h-6" /> :
                   <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-100">{selectedSample.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">SHA256: {selectedSample.hash}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={CONCLUSION_BADGE[selectedSample.conclusion].status} />
                    <StatusBadge status={SEVERITY_BADGE[selectedSample.severity].status} />
                    <span className={`text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400`}>
                      置信度 {selectedSample.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="text-sm font-medium text-slate-200 mb-2">家族 & 别名</h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-12">家族</span>
                  <span className="text-sm text-slate-100 font-medium">{selectedSample.family}</span>
                </div>
                {selectedSample.aliases.map((alias) => (
                  <div key={alias} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-12">别名</span>
                    <span className="text-xs text-slate-300">{alias}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 5 维评估雷达 + 基本信息 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />5 维评估
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2A354D" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />样本元数据
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="文件类型" value={selectedSample.type} />
                <Field label="文件大小" value={`${(selectedSample.size / 1024).toFixed(0)} KB`} />
                <Field label="首次发现" value={selectedSample.firstSeen} />
                <Field label="提交时间" value={selectedSample.submitTime} />
                <Field label="分析师" value={selectedSample.analyst} />
                <Field label="样本 ID" value={selectedSample.id} />
              </div>
            </Card>
          </div>

          {/* 行为时间轴 + 相似样本 + 情报匹配 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />行为时间轴
                <span className="text-[10px] text-slate-500">（{selectedSample.behaviors.length} 事件）</span>
              </h3>
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {selectedSample.behaviors.map((b, idx) => (
                  <div key={idx} className={`p-2 rounded border-l-2 ${BEHAVIOR_COLORS[b.type]}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">{b.time.split(' ')[1]}</span>
                      <span className="text-[10px] px-1 py-0 rounded bg-slate-700 text-slate-300">{b.type.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">{b.event}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-400" />相似样本（家族聚类）
              </h3>
              <div className="space-y-2">
                {selectedSample.similar.map((s, idx) => (
                  <div key={idx} className="p-2 bg-[#111625] rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-100 truncate flex-1">{s.name}</span>
                      <span className={`text-xs font-medium ${s.similarity >= 90 ? 'text-red-400' : s.similarity >= 80 ? 'text-orange-400' : 'text-yellow-400'}`}>
                        {s.similarity}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-mono">{s.hash}</span>
                      <span className="text-[10px] text-slate-500">·</span>
                      <span className="text-[10px] text-slate-500">{s.family}</span>
                    </div>
                    <div className="mt-1.5 h-1 bg-[#0A0E1A] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${s.similarity}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />威胁情报匹配
              </h3>
              <div className="space-y-2">
                {selectedSample.intel.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#111625] rounded">
                    {i.matched ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-slate-500" />}
                    <span className="text-sm text-slate-200 flex-1">{i.source}</span>
                    {i.matched ? (
                      <span className="text-xs font-medium text-cyan-400">{i.confidence}%</span>
                    ) : (
                      <span className="text-xs text-slate-500">未命中</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 研判结论 + 处置建议 + 7 日趋势 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />研判结论
              </h3>
              <div className={`p-4 rounded-lg border-l-4 ${
                selectedSample.conclusion === 'malicious' ? 'bg-red-500/10 border-red-500' :
                selectedSample.conclusion === 'suspicious' ? 'bg-yellow-500/10 border-yellow-500' :
                'bg-green-500/10 border-green-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedSample.conclusion === 'malicious' ? <AlertTriangle className="w-5 h-5 text-red-400" /> :
                   selectedSample.conclusion === 'suspicious' ? <Shield className="w-5 h-5 text-yellow-400" /> :
                   <CheckCircle2 className="w-5 h-5 text-green-400" />}
                  <span className={`text-lg font-semibold ${
                    selectedSample.conclusion === 'malicious' ? 'text-red-300' :
                    selectedSample.conclusion === 'suspicious' ? 'text-yellow-300' :
                    'text-green-300'
                  }`}>
                    {CONCLUSION_BADGE[selectedSample.conclusion].text}（置信度 {selectedSample.confidence}%）
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  基于 5 维评估（静态 {selectedSample.scores.static} / 动态 {selectedSample.scores.dynamic} / 网络 {selectedSample.scores.network} / 文件 {selectedSample.scores.fileOps} / 进程 {selectedSample.scores.process}），
                  结合 {selectedSample.intel.filter(i => i.matched).length} 个威胁情报源命中，
                  判定样本属于 <span className="text-cyan-400 font-medium">{selectedSample.family}</span> 家族。
                </p>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />处置建议
              </h3>
              <div className="space-y-2">
                {selectedSample.recommendation.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-[#111625] rounded">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                    <span className="text-sm text-slate-200">{rec}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 7 日趋势 */}
          <Card>
            <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />该家族 7 日研判趋势
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historyData}>
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="malicious" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
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

export default DeepJudgmentConclusion;
