'use client';

import React, { useState } from 'react';
import {
  Search, Filter, Plus, Settings, Activity, Cpu, Brain, Zap,
  Target, CheckCircle2, AlertCircle, Clock, Eye, Play, Pause,
  RefreshCw, Download, ChevronRight, User, Shield, Network,
  TrendingUp, Database, Code, Server, FileText, Workflow
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';

interface DetectionRule {
  id: string;
  name: string;
  category: '登录异常' | '数据异常' | '权限异常' | '时间异常' | '行为异常' | '网络异常';
  algorithm: '统计基线' | '机器学习' | '深度学习' | '规则引擎' | '聚类分析';
  description: string;
  threshold: string;
  precision: number; // 0-100
  recall: number; // 0-100
  f1Score: number;
  triggers: number; // 30天触发次数
  truePositives: number;
  falsePositives: number;
  status: 'active' | 'training' | 'paused' | 'draft';
  lastTrained: string;
  modelVersion: string;
  enabled: boolean;
}

const rules: DetectionRule[] = [
  { id: 'DR-001', name: '登录地点异常检测', category: '登录异常', algorithm: '统计基线', description: '基于用户历史登录地点，构建地理基线，检测跨城市/国家异常登录', threshold: '距离 > 800km 且 时间 < 1h', precision: 94, recall: 88, f1Score: 91, triggers: 156, truePositives: 142, falsePositives: 14, status: 'active', lastTrained: '2026-05-15', modelVersion: 'v3.2', enabled: true },
  { id: 'DR-002', name: '数据下载量异常', category: '数据异常', algorithm: '统计基线', description: '基于用户日均下载量基线 (滚动 30 天均值 × 3σ)', threshold: '下载量 > 3σ (动态)', precision: 89, recall: 92, f1Score: 90.5, triggers: 234, truePositives: 215, falsePositives: 19, status: 'active', lastTrained: '2026-05-20', modelVersion: 'v2.1', enabled: true },
  { id: 'DR-003', name: '工作时间异常检测', category: '时间异常', algorithm: '统计基线', description: '检测非工作时间（23:00-6:00）账号活动', threshold: '23:00-6:00 活动 > 5 次/周', precision: 76, recall: 84, f1Score: 80, triggers: 312, truePositives: 262, falsePositives: 50, status: 'active', lastTrained: '2026-04-10', modelVersion: 'v1.5', enabled: true },
  { id: 'DR-004', name: '横向移动行为检测', category: '行为异常', algorithm: '机器学习', description: '随机森林模型，基于进程/网络/SMB 事件检测横向移动', threshold: '概率 > 0.85', precision: 96, recall: 78, f1Score: 86, triggers: 89, truePositives: 78, falsePositives: 11, status: 'active', lastTrained: '2026-06-01', modelVersion: 'RF-v4.1', enabled: true },
  { id: 'DR-005', name: '权限滥用检测', category: '权限异常', algorithm: '规则引擎', description: '基于 RBAC 策略检测权限范围外访问尝试', threshold: '访问角色外资源', precision: 99, recall: 65, f1Score: 78.5, triggers: 45, truePositives: 42, falsePositives: 3, status: 'active', lastTrained: '规则固化', modelVersion: 'v2.0', enabled: true },
  { id: 'DR-006', name: '账号被盗用检测', category: '登录异常', algorithm: '深度学习', description: 'LSTM 模型，基于行为序列检测账号被盗用', threshold: '异常分数 > 0.9', precision: 92, recall: 86, f1Score: 89, triggers: 28, truePositives: 24, falsePositives: 4, status: 'active', lastTrained: '2026-05-28', modelVersion: 'LSTM-v2.3', enabled: true },
  { id: 'DR-007', name: 'DLP 数据外传检测', category: '数据异常', algorithm: '规则引擎', description: '基于敏感数据标签 (PCI/PII) 检测外发', threshold: '外发文件命中敏感标签', precision: 95, recall: 91, f1Score: 93, triggers: 412, truePositives: 392, falsePositives: 20, status: 'active', lastTrained: '规则固化', modelVersion: 'v3.5', enabled: true },
  { id: 'DR-008', name: '命令注入检测', category: '行为异常', algorithm: '机器学习', description: 'SVM 模型，检测命令行中的注入模式', threshold: '分类分数 > 0.8', precision: 97, recall: 72, f1Score: 83, triggers: 18, truePositives: 13, falsePositives: 5, status: 'active', lastTrained: '2026-05-15', modelVersion: 'SVM-v1.8', enabled: true },
  { id: 'DR-009', name: '内部威胁狩猎（实验）', category: '行为异常', algorithm: '深度学习', description: 'Transformer 模型，跨多维度关联分析内部威胁', threshold: '异常分数 > 0.95', precision: 88, recall: 82, f1Score: 85, triggers: 0, truePositives: 0, falsePositives: 0, status: 'training', lastTrained: '训练中', modelVersion: 'Transformer-v1.0-rc1', enabled: true },
  { id: 'DR-010', name: '用户聚类分析', category: '行为异常', algorithm: '聚类分析', description: 'DBSCAN 聚类，识别偏离群体的孤立用户', threshold: '噪声点 + 离群点', precision: 72, recall: 88, f1Score: 79, triggers: 56, truePositives: 49, falsePositives: 7, status: 'paused', lastTrained: '2026-03-20', modelVersion: 'DBSCAN-v1.2', enabled: false },
];

const algorithmColor: Record<DetectionRule['algorithm'], string> = {
  '统计基线': '#0066FF',
  '机器学习': '#9333EA',
  '深度学习': '#FF6D00',
  '规则引擎': '#22C55E',
  '聚类分析': '#EAB308',
};

const statusConfig = {
  active: { label: '运行中', color: 'text-green-400', bg: 'bg-green-500/20' },
  training: { label: '训练中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  paused: { label: '已暂停', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  draft: { label: '草稿', color: 'text-slate-500', bg: 'bg-slate-500/20' },
};

// 检测能力雷达图
const capabilityRadar = [
  { capability: '登录异常', value: 92 },
  { capability: '数据异常', value: 88 },
  { capability: '权限异常', value: 95 },
  { capability: '时间异常', value: 80 },
  { capability: '行为异常', value: 90 },
  { capability: '网络异常', value: 75 },
];

// 趋势数据
const detectionTrend = [
  { day: '05-28', triggers: 18, truePos: 15, falsePos: 3 },
  { day: '05-29', triggers: 22, truePos: 19, falsePos: 3 },
  { day: '05-30', triggers: 15, truePos: 12, falsePos: 3 },
  { day: '05-31', triggers: 28, truePos: 25, falsePos: 3 },
  { day: '06-01', triggers: 35, truePos: 32, falsePos: 3 },
  { day: '06-02', triggers: 42, truePos: 38, falsePos: 4 },
  { day: '06-03', triggers: 24, truePos: 22, falsePos: 2 },
];

export function AutoAnomalyDetection() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [algorithmFilter, setAlgorithmFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('DR-001');

  const filtered = rules.filter(r => {
    if (search && !r.name.includes(search) && !r.id.includes(search)) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (algorithmFilter !== 'all' && r.algorithm !== algorithmFilter) return false;
    return true;
  });

  const selected = selectedId ? rules.find(r => r.id === selectedId) : null;
  const stats = {
    total: rules.length,
    active: rules.filter(r => r.status === 'active').length,
    avgPrecision: (rules.reduce((s, r) => s + r.precision, 0) / rules.length).toFixed(1),
    avgRecall: (rules.reduce((s, r) => s + r.recall, 0) / rules.length).toFixed(1),
    totalTriggers: rules.reduce((s, r) => s + r.triggers, 0),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="检测规则" value={stats.total} color="#0066FF" icon={<Shield className="w-4 h-4" />} />
        <StatBox label="运行中" value={stats.active} color="#22C55E" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="平均精度" value={`${stats.avgPrecision}%`} color="#9333EA" icon={<Target className="w-4 h-4" />} />
        <StatBox label="平均召回" value={`${stats.avgRecall}%`} color="#FF6D00" icon={<TrendingUp className="w-4 h-4" />} />
        <StatBox label="30 天触发" value={stats.totalTriggers} color="#EAB308" icon={<Zap className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">异常行为自动检测</h2>
            <p className="text-xs text-slate-500 mt-1">10 类检测规则 / 5 种算法 / 6 大维度 / 模型持续训练</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新增规则
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Brain className="w-3.5 h-3.5" />AI 训练
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
              type="text" placeholder="搜索规则/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类别</option>
            <option value="登录异常">登录异常</option>
            <option value="数据异常">数据异常</option>
            <option value="权限异常">权限异常</option>
            <option value="时间异常">时间异常</option>
            <option value="行为异常">行为异常</option>
            <option value="网络异常">网络异常</option>
          </select>
          <select value={algorithmFilter} onChange={e => setAlgorithmFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部算法</option>
            <option value="统计基线">统计基线</option>
            <option value="机器学习">机器学习</option>
            <option value="深度学习">深度学习</option>
            <option value="规则引擎">规则引擎</option>
            <option value="聚类分析">聚类分析</option>
          </select>
        </div>
      </div>

      {/* 趋势图 + 能力雷达 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">检测触发趋势（7 天）</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={detectionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Bar dataKey="truePos" fill="#22C55E" name="真正例" />
              <Bar dataKey="falsePos" fill="#EF4444" name="假正例" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">检测能力雷达</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={capabilityRadar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="capability" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
              <Radar name="能力" dataKey="value" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 规则列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">检测规则 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(r => {
              const sc = statusConfig[r.status as keyof typeof statusConfig];
              const ac = algorithmColor[r.algorithm];
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{r.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${ac}20`, color: ac }}>
                      {r.algorithm}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {r.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">{r.modelVersion}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{r.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1 mb-1.5">{r.description}</div>
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div className="text-slate-500">精度 <span className="text-green-400 font-mono">{r.precision}%</span></div>
                    <div className="text-slate-500">召回 <span className="text-blue-400 font-mono">{r.recall}%</span></div>
                    <div className="text-slate-500">F1 <span className="text-purple-400 font-mono">{r.f1Score}</span></div>
                    <div className="text-slate-500">触发 <span className="text-orange-400 font-mono">{r.triggers}次</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 详情 */}
        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${algorithmColor[selected.algorithm]}20`, color: algorithmColor[selected.algorithm] }}>
                  {selected.algorithm}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">触发阈值</div>
              <div className="text-xs text-blue-300 font-mono">{selected.threshold}</div>
            </div>

            {/* 模型指标 */}
            <div>
              <div className="text-xs text-slate-500 mb-2">模型性能指标</div>
              <div className="space-y-2">
                <MetricBar label="精度 (Precision)" value={selected.precision} color="#22C55E" />
                <MetricBar label="召回 (Recall)" value={selected.recall} color="#3B82F6" />
                <MetricBar label="F1 分数" value={selected.f1Score} color="#A855F7" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">真正例</div>
                <div className="text-green-400 font-mono">{selected.truePositives}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">假正例</div>
                <div className="text-red-400 font-mono">{selected.falsePositives}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">训练时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.lastTrained}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">模型版本</div>
                <div className="text-blue-300 font-mono text-[10px]">{selected.modelVersion}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Settings className="w-3 h-3" />配置
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                <Brain className="w-3 h-3" />重新训练
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

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default AutoAnomalyDetection;
