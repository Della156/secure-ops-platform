'use client';

import React, { useState } from 'react';
import { Search, Plus, Download, RefreshCw, Filter, Eye, Edit, FileText, CheckCircle2, XCircle, Award, Sparkles, Brain, Send, Copy, Save, ListTree, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface ReportTemplate {
  id: string; name: string; category: '日常' | '应急' | '变更' | '加固' | '复盘';
  description: string; sections: string[]; used: number; outputFormats: ('PDF' | 'Word' | 'HTML')[];
  coverColor: string; aiDraftable: boolean; lastUsed: string;
}

const templates: ReportTemplate[] = [
  { id: 'TPL-001', name: '日常维护作业标准报告', category: '日常', description: '日常维护类作业的标准化执行报告', sections: ['执行概述', '操作详情', '时间线', '变更清单', '结果验证', '改进建议'], used: 86, outputFormats: ['PDF', 'Word', 'HTML'], coverColor: '#0066FF', aiDraftable: true, lastUsed: '2 小时前' },
  { id: 'TPL-002', name: '应急处置作业快速报告', category: '应急', description: '应急场景下的快速报告（30 分钟内出稿）', sections: ['事件概述', '应急响应', '处置过程', '影响评估', '后续跟进'], used: 28, outputFormats: ['PDF', 'Word'], coverColor: '#EF4444', aiDraftable: true, lastUsed: '1 天前' },
  { id: 'TPL-003', name: '配置变更标准报告', category: '变更', description: '配置变更类作业的标准化报告（含变更前后对比）', sections: ['变更概述', '变更前后对比', '风险评估', '回滚方案', '变更验证'], used: 64, outputFormats: ['PDF', 'Word', 'HTML'], coverColor: '#EAB308', aiDraftable: true, lastUsed: '4 小时前' },
  { id: 'TPL-004', name: '安全加固实施报告', category: '加固', description: '安全加固类作业的实施结果报告', sections: ['加固背景', '加固项清单', '实施过程', '效果对比', '遗留问题'], used: 42, outputFormats: ['PDF', 'Word'], coverColor: '#9333EA', aiDraftable: true, lastUsed: '昨天' },
  { id: 'TPL-005', name: '故障复盘报告', category: '复盘', description: '失败作业的复盘改进报告', sections: ['事件回顾', '时间线', '根因分析', '影响评估', '改进措施', '预防计划'], used: 18, outputFormats: ['PDF', 'Word', 'HTML'], coverColor: '#FF6D00', aiDraftable: true, lastUsed: '3 天前' },
  { id: 'TPL-006', name: '高风险作业专项报告', category: '变更', description: 'P0/P1 高风险作业的专项报告', sections: ['作业背景', '风险评估', '审批流程', '执行过程', '异常处理', '合规检查', 'CISO 签字'], used: 24, outputFormats: ['PDF'], coverColor: '#EAB308', aiDraftable: false, lastUsed: '5 天前' },
];

const categoryColor: Record<ReportTemplate['category'], string> = {
  '日常': '#0066FF', '应急': '#EF4444', '变更': '#EAB308', '加固': '#9333EA', '复盘': '#FF6D00',
};

const generationTrend = [
  { day: '05-28', count: 12 },
  { day: '05-29', count: 18 },
  { day: '05-30', count: 15 },
  { day: '05-31', count: 22 },
  { day: '06-01', count: 28 },
  { day: '06-02', count: 32 },
  { day: '06-03', count: 25 },
];

const reportHistory = [
  { id: 'SR-99821', name: '防火墙策略变更报告（2026-06-03）', template: 'TPL-003', generated: '2026-06-03 12:15:00', generatedBy: 'AI 智能', size: '1.2 MB', format: 'PDF', status: 'completed' },
  { id: 'SR-99820', name: 'APT 应急处置快速报告', template: 'TPL-002', generated: '2026-06-02 18:45:00', generatedBy: 'AI 智能', size: '485 KB', format: 'PDF', status: 'completed' },
  { id: 'SR-99819', name: 'AD 域账号权限调整报告', template: 'TPL-003', generated: '2026-06-03 08:32:00', generatedBy: 'AI 智能', size: '892 KB', format: 'Word', status: 'completed' },
  { id: 'SR-99818', name: 'Web 集群补丁安装报告', template: 'TPL-001', generated: '2026-06-03 10:18:00', generatedBy: 'AI 智能', size: '1.5 MB', format: 'PDF', status: 'completed' },
  { id: 'SR-99817', name: '5 月日常维护汇总报告', template: 'TPL-001', generated: '2026-06-01 18:00:00', generatedBy: 'AI 智能', size: '3.2 MB', format: 'PDF', status: 'completed' },
  { id: 'SR-99816', name: '主机加固项目复盘报告', template: 'TPL-004', generated: '2026-05-31 16:00:00', generatedBy: '陈磊', size: '2.1 MB', format: 'PDF', status: 'completed' },
];

export function StdReportAutoGen() {
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
    setTimeout(() => setGenerating(false), 2500);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="报告模板" value={templates.length} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="本月生成" value={152} color="#22C55E" icon={<Sparkles className="w-4 h-4" />} />
        <StatBox label="AI 草拟" value={138} color="#9333EA" icon={<Brain className="w-4 h-4" />} />
        <StatBox label="平均时长" value="2.5 min" color="#FF6D00" icon={<Calendar className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">报告生成趋势（7 天）</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={generationTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Bar dataKey="count" fill="#0066FF" name="生成数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">标准化报告自动生成</h2>
            <p className="text-xs text-slate-500 mt-1">6 大类模板 + AI 智能草拟 — 30 秒出标准作业报告</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建模板
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md">
              <Brain className="w-3.5 h-3.5" />AI 智能
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="搜索模板" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类别</option>
            <option value="日常">日常</option><option value="应急">应急</option><option value="变更">变更</option>
            <option value="加固">加固</option><option value="复盘">复盘</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(t => (
            <div key={t.id} onClick={() => setSelectedTplId(t.id)}
              className={`bg-[#20293F] border-2 rounded-lg p-3 cursor-pointer transition-all ${selectedTplId === t.id ? 'border-blue-500' : 'border-[#2A354D] hover:border-blue-500/50'}`}>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded flex items-center justify-center shrink-0" style={{ background: `${t.coverColor}20`, color: t.coverColor }}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-slate-500 font-mono">{t.id} · {t.category}</div>
                  <div className="text-sm text-white font-medium">{t.name}</div>
                </div>
                {t.aiDraftable && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">AI</span>}
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
                <span className="text-slate-500">使用 {t.used}</span>
              </div>
            </div>
          ))}
        </div>

        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[selected.category]}20`, color: categoryColor[selected.category] }}>{selected.category}</span>
                {selected.aiDraftable && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">AI 可草拟</span>}
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

            <button onClick={handleGenerate} disabled={generating}
              className="w-full px-3 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm font-medium rounded-md flex items-center justify-center gap-2">
              {generating ? (
                <><RefreshCw className="w-4 h-4 animate-spin" />AI 正在生成报告...</>
              ) : (
                <><Sparkles className="w-4 h-4" />AI 一键生成报告</>
              )}
            </button>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Edit className="w-3 h-3" />编辑
              </button>
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Copy className="w-3 h-3" />复制
              </button>
            </div>
          </div>
        ) : null}
      </div>

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

export default StdReportAutoGen;
