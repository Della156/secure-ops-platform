'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Edit, FileText,
  CheckCircle2, XCircle, Clock, Activity, Calendar, User, Shield,
  ChevronRight, ChevronDown, BarChart3, Server, Database, Network,
  Sparkles, Save, Send, Copy, Trash2, BookOpen, ListTree, Award
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line
} from 'recharts';

interface ReportTemplate {
  id: string;
  name: string;
  category: '执行报告' | '合规报告' | '复盘报告' | '高管简报' | '问题分析';
  sections: string[];
  used: number;
  lastUsed: string;
  outputFormats: ('PDF' | 'Word' | 'HTML' | 'Markdown')[];
  customizable: boolean;
  coverColor: string;
  description: string;
}

const templates: ReportTemplate[] = [
  { id: 'TPL-001', name: '标准演练执行报告', category: '执行报告', sections: ['执行概述', '步骤详情', '时间线', '资源消耗', '异常记录', '改进建议'], used: 124, lastUsed: '2 小时前', outputFormats: ['PDF', 'Word', 'HTML'], customizable: true, coverColor: '#0066FF', description: '完整记录演练全过程的执行报告' },
  { id: 'TPL-002', name: '金融行业合规演练报告', category: '合规报告', sections: ['合规对标', '执行情况', '差距分析', '改进计划', '签署证明'], used: 38, lastUsed: '3 天前', outputFormats: ['PDF', 'Word'], customizable: true, coverColor: '#22C55E', description: '符合《商业银行数据资产安全管理》等保要求的合规演练报告' },
  { id: 'TPL-003', name: '灾备演练复盘报告', category: '复盘报告', sections: ['演练目标', '实际效果', 'RPO/RTO', '问题复盘', 'ROOT CAUSE', '改进行动'], used: 56, lastUsed: '昨天', outputFormats: ['PDF', 'Word', 'HTML'], customizable: true, coverColor: '#FF6D00', description: '复盘演练中暴露的问题和根因分析' },
  { id: 'TPL-004', name: '高管简报（一页纸）', category: '高管简报', sections: ['一句话结论', '关键指标', '风险点', '建议'], used: 89, lastUsed: '5 小时前', outputFormats: ['PDF', 'HTML'], customizable: false, coverColor: '#9333EA', description: '适合高管查阅的一页纸摘要' },
  { id: 'TPL-005', name: '失败问题深度分析', category: '问题分析', sections: ['失败现象', '时间线', 'ROOT CAUSE', '影响范围', '短期止血', '长期改进'], used: 12, lastUsed: '1 周前', outputFormats: ['PDF', 'Word', 'Markdown'], customizable: true, coverColor: '#EF4444', description: '失败演练的深度问题分析报告' },
  { id: 'TPL-006', name: '演练知识沉淀报告', category: '复盘报告', sections: ['场景描述', '执行过程', '经验教训', '知识沉淀', '复用建议'], used: 23, lastUsed: '4 天前', outputFormats: ['PDF', 'Markdown', 'HTML'], customizable: true, coverColor: '#06B6D4', description: '将演练经验沉淀为可复用知识' },
];

const reportHistory = [
  { id: 'RPT-2026060301', name: '金融核心系统灾备切换演练报告', template: 'TPL-001', generated: '2026-06-03 10:48:32', generatedBy: '张伟', size: '2.3 MB', format: 'PDF', status: 'completed' },
  { id: 'RPT-2026060302', name: '高管简报：6 月演练情况', template: 'TPL-004', generated: '2026-06-03 09:15:00', generatedBy: '陈磊', size: '485 KB', format: 'HTML', status: 'completed' },
  { id: 'RPT-2026060201', name: 'Oracle RPO/RTO 演练执行报告', template: 'TPL-001', generated: '2026-06-02 16:15:00', generatedBy: '王芳', size: '1.8 MB', format: 'PDF', status: 'completed' },
  { id: 'RPT-2026060202', name: 'Oracle 演练失败问题分析', template: 'TPL-005', generated: '2026-06-02 16:30:00', generatedBy: '王芳', size: '1.2 MB', format: 'Word', status: 'completed' },
  { id: 'RPT-2026060101', name: '域控制器 AD 演练复盘报告', template: 'TPL-003', generated: '2026-06-01 10:00:00', generatedBy: '刘洋', size: '3.1 MB', format: 'PDF', status: 'completed' },
  { id: 'RPT-2026053101', name: '5 月演练合规报告', template: 'TPL-002', generated: '2026-05-31 18:00:00', generatedBy: '张伟', size: '4.5 MB', format: 'PDF', status: 'completed' },
  { id: 'RPT-2026053001', name: '财务演练知识沉淀', template: 'TPL-006', generated: '2026-05-30 09:00:00', generatedBy: '王芳', size: '685 KB', format: 'Markdown', status: 'completed' },
];

// AI 自动生成内容示例
const aiSuggestions = {
  '执行概述': '本次金融核心系统灾备切换演练共执行 18 个步骤，耗时 01:35:00，成功率 100%，验证了生产到灾备中心的全链路切换能力。',
  'RPO/RTO': '实测 RPO（数据丢失量）= 0 秒，RTO（恢复时间）= 8 分 12 秒，达到预期 RPO≤30 秒、RTO≤15 分钟的目标。',
  'ROOT CAUSE': 'Oracle 恢复失败根因：归档日志 7 个文件（14:35-14:42）未上传至备份服务器。改进建议：增加归档日志上传实时校验告警。',
  '改进建议': [
    'P1：归档日志上传增加 5xx 重试与超时告警（1 周内）',
    'P1：灾备中心预装 RMAN catalog，避免恢复时缺失元数据（2 周内）',
    'P2：增加演练预检查清单的强制性（1 个月内）',
    'P2：建立演练后 24 小时复盘会议机制',
    'P3：建立演练知识库（基于历史失败案例）',
  ],
};

const statsData = [
  { month: '1月', count: 12, success: 11 },
  { month: '2月', count: 15, success: 14 },
  { month: '3月', count: 18, success: 16 },
  { month: '4月', count: 22, success: 21 },
  { month: '5月', count: 28, success: 25 },
  { month: '6月', count: 8, success: 8 },
];

const qualityRadar = [
  { dimension: '完整性', value: 92 },
  { dimension: '准确性', value: 88 },
  { dimension: '可读性', value: 85 },
  { dimension: '可操作性', value: 78 },
  { dimension: '合规性', value: 95 },
  { dimension: '复用性', value: 80 },
];

export function DrillReportGen() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTplId, setSelectedTplId] = useState<string | null>('TPL-001');
  const [generating, setGenerating] = useState(false);

  const filtered = templates.filter(t => {
    if (search && !t.name.includes(search)) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const selected = selectedTplId ? templates.find(t => t.id === selectedTplId) : null;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="p-6 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="报告模板" value={templates.length} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="本月生成" value={8} color="#22C55E" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="累计生成" value={342} color="#FF6D00" icon={<BookOpen className="w-4 h-4" />} />
        <StatBox label="平均质量" value="89" color="#9333EA" icon={<Award className="w-4 h-4" />} />
        <StatBox label="AI 草拟" value={6} color="#06B6D4" icon={<Sparkles className="w-4 h-4" />} />
      </div>

      {/* 月度趋势 + 质量雷达 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">报告生成趋势（6 月）</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Bar dataKey="success" stackId="a" fill="#22C55E" name="成功" />
              <Bar dataKey="count" stackId="b" fill="#0066FF" name="总数" fillOpacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">报告质量维度</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={qualityRadar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">演练报告生成</h2>
            <p className="text-xs text-slate-500 mt-1">基于模板 + AI 自动生成演练报告（PDF / Word / HTML / Markdown）</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建模板
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md">
              <Sparkles className="w-3.5 h-3.5" />AI 智能生成
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索模板名称"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类别</option>
            <option value="执行报告">执行报告</option>
            <option value="合规报告">合规报告</option>
            <option value="复盘报告">复盘报告</option>
            <option value="高管简报">高管简报</option>
            <option value="问题分析">问题分析</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 模板列表 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTplId(t.id)}
              className={`bg-[#20293F] border-2 rounded-lg p-3 cursor-pointer transition-all ${
                selectedTplId === t.id ? 'border-blue-500' : 'border-[#2A354D] hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded flex items-center justify-center shrink-0" style={{ background: `${t.coverColor}20`, color: t.coverColor }}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-slate-500 font-mono">{t.id} · {t.category}</div>
                  <div className="text-sm text-white font-medium">{t.name}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-2 mb-2">{t.description}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {t.sections.slice(0, 4).map(s => (
                  <span key={s} className="text-[9px] px-1.5 py-0.5 bg-[#111625] text-slate-400 rounded">{s}</span>
                ))}
                {t.sections.length > 4 && <span className="text-[9px] text-slate-500">+{t.sections.length - 4}</span>}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex gap-1">
                  {t.outputFormats.map(f => (
                    <span key={f} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono">{f}</span>
                  ))}
                </div>
                <span className="text-slate-500">使用 {t.used} 次</span>
              </div>
            </div>
          ))}
        </div>

        {/* 模板详情 / 生成面板 */}
        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{selected.category}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2 flex items-center gap-1"><ListTree className="w-3 h-3" />报告章节</div>
              <div className="space-y-1">
                {selected.sections.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs px-2 py-1 bg-[#111625] rounded">
                    <span className="text-blue-400 font-mono w-4">{i + 1}.</span>
                    <span className="text-slate-200">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">使用次数</div>
                <div className="text-blue-300 font-mono">{selected.used}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">最后使用</div>
                <div className="text-slate-200 text-[10px]">{selected.lastUsed}</div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full px-3 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm font-medium rounded-md flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI 正在生成报告...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  使用此模板生成报告
                </>
              )}
            </button>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Edit className="w-3 h-3" />编辑模板
              </button>
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Copy className="w-3 h-3" />复制
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* 历史报告 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">报告生成历史（最近 7 天）</h3>
          <span className="text-xs text-slate-500">共 {reportHistory.length} 份</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {reportHistory.map(r => (
            <div key={r.id} className="px-4 py-2.5 border-b border-[#2A354D] hover:bg-[#111625]/50 flex items-center gap-3">
              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{r.name}</div>
                <div className="text-[10px] text-slate-500">
                  <span className="text-blue-400 font-mono">{r.id}</span> · {r.generatedBy} · {r.generated} · {r.size}
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">{r.format}</span>
              <button className="text-blue-400 hover:text-blue-300"><Download className="w-3.5 h-3.5" /></button>
              <button className="text-slate-400 hover:text-slate-300"><Eye className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
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

export default DrillReportGen;
