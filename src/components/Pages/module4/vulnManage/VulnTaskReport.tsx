'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, FileText, Plus, Calendar, BarChart3,
  Filter, Eye, Send, Mail, Printer, RefreshCw, Layers,
  Bug, TrendingUp, Activity, Target, Clock, CheckCircle2
} from 'lucide-react';

/**
 * 4.6-12 漏洞管理任务报告
 *
 * 报告生成 / 模板管理 / 定时报告：
 * - 预置报告模板
 * - 生成自定义报告
 * - 历史报告列表
 * - 订阅/发送报告
 */

type ReportStatus = 'generating' | 'completed' | 'failed' | 'scheduled';

interface ReportTemplate {
  id: string;
  name: string;
  category: 'scan' | 'rectify' | 'compliance' | 'executive' | 'custom';
  description: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  sections: string[];
  format: ('PDF' | 'Word' | 'Excel' | 'HTML')[];
  lastGenerated?: string;
  estimatedTime: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'TPL-001',
    name: '每日漏洞扫描简报',
    category: 'scan',
    description: '每日扫描发现的漏洞数量、等级分布、TOP 资产',
    frequency: 'daily',
    sections: ['扫描概览', '漏洞统计', 'TOP 资产', '修复建议'],
    format: ['PDF', 'HTML'],
    lastGenerated: '2026-06-02 08:00',
    estimatedTime: '2 分钟',
  },
  {
    id: 'TPL-002',
    name: '每周漏洞管理周报',
    category: 'scan',
    description: '本周漏洞发现、修复情况、趋势分析',
    frequency: 'weekly',
    sections: ['本周概览', '新增漏洞', '修复情况', '趋势图', '下周计划'],
    format: ['PDF', 'Word', 'HTML'],
    lastGenerated: '2026-06-01 18:00',
    estimatedTime: '5 分钟',
  },
  {
    id: 'TPL-003',
    name: '月度漏洞态势分析报告',
    category: 'executive',
    description: '面向管理层，含风险趋势、合规状态、建议',
    frequency: 'monthly',
    sections: ['风险态势', '合规状态', '重大事件', '预算建议', '行动计划'],
    format: ['PDF', 'Word'],
    lastGenerated: '2026-06-01 09:00',
    estimatedTime: '15 分钟',
  },
  {
    id: 'TPL-004',
    name: '等保合规检查报告',
    category: 'compliance',
    description: '等保 2.0 合规性检测报告',
    frequency: 'quarterly',
    sections: ['合规总览', '差距分析', '整改建议', '证据链'],
    format: ['PDF'],
    lastGenerated: '2026-04-01 10:00',
    estimatedTime: '30 分钟',
  },
  {
    id: 'TPL-005',
    name: '紧急漏洞专项报告',
    category: 'scan',
    description: '严重高危漏洞专项分析',
    frequency: 'once',
    sections: ['漏洞详情', '影响范围', '修复方案', '验证结果'],
    format: ['PDF', 'Word', 'HTML'],
    estimatedTime: '10 分钟',
  },
  {
    id: 'TPL-006',
    name: '漏洞整改跟踪报告',
    category: 'rectify',
    description: '整改进度、复测结果、闭环率',
    frequency: 'weekly',
    sections: ['整改进度', '复测结果', '闭环率', '逾期任务'],
    format: ['PDF', 'Excel'],
    lastGenerated: '2026-05-30 17:00',
    estimatedTime: '8 分钟',
  },
  {
    id: 'TPL-007',
    name: '部门漏洞分布报告',
    category: 'scan',
    description: '各业务部门漏洞分布与责任划分',
    frequency: 'monthly',
    sections: ['部门排行', 'TOP 部门', '责任清单'],
    format: ['PDF', 'Excel'],
    estimatedTime: '5 分钟',
  },
  {
    id: 'TPL-008',
    name: 'CVE 趋势分析报告',
    category: 'scan',
    description: 'CVE 披露趋势、影响产品、行业对比',
    frequency: 'quarterly',
    sections: ['CVE 趋势', '产品分布', '行业对比', '预测'],
    format: ['PDF'],
    estimatedTime: '20 分钟',
  },
];

// 历史报告
interface Report {
  id: string;
  name: string;
  template: string;
  status: ReportStatus;
  generatedAt: string;
  generatedBy: string;
  size: string;
  pages: number;
  format: string;
  subscribers: number;
}

const historyReports: Report[] = [
  { id: 'RPT-20260602-001', name: '每日漏洞扫描简报-20260602', template: '每日漏洞扫描简报', status: 'completed', generatedAt: '2026-06-02 08:00:00', generatedBy: '系统', size: '2.3 MB', pages: 12, format: 'PDF', subscribers: 23 },
  { id: 'RPT-20260601-001', name: '每周漏洞管理周报-W22', template: '每周漏洞管理周报', status: 'completed', generatedAt: '2026-06-01 18:00:00', generatedBy: '系统', size: '8.7 MB', pages: 45, format: 'PDF', subscribers: 18 },
  { id: 'RPT-20260601-002', name: '月度漏洞态势分析-202605', template: '月度漏洞态势分析报告', status: 'completed', generatedAt: '2026-06-01 09:00:00', generatedBy: '系统', size: '15.2 MB', pages: 78, format: 'PDF', subscribers: 12 },
  { id: 'RPT-20260531-001', name: '漏洞整改跟踪报告-W21', template: '漏洞整改跟踪报告', status: 'completed', generatedAt: '2026-05-30 17:00:00', generatedBy: '张伟', size: '4.5 MB', pages: 23, format: 'Excel', subscribers: 8 },
  { id: 'RPT-20260530-001', name: '紧急漏洞专项报告-CVE-2024-3094', template: '紧急漏洞专项报告', status: 'completed', generatedAt: '2026-05-30 14:00:00', generatedBy: '李娜', size: '6.8 MB', pages: 32, format: 'PDF', subscribers: 35 },
  { id: 'RPT-20260530-002', name: '等保合规检查报告-Q2', template: '等保合规检查报告', status: 'failed', generatedAt: '2026-05-30 10:00:00', generatedBy: '系统', size: '-', pages: 0, format: 'PDF', subscribers: 15 },
  { id: 'RPT-20260528-001', name: 'CVE 趋势分析-2025H1', template: 'CVE 趋势分析报告', status: 'completed', generatedAt: '2026-05-28 15:00:00', generatedBy: '张伟', size: '23.4 MB', pages: 120, format: 'PDF', subscribers: 5 },
  { id: 'RPT-20260528-002', name: '部门漏洞分布-202604', template: '部门漏洞分布报告', status: 'completed', generatedAt: '2026-05-28 11:00:00', generatedBy: '系统', size: '3.2 MB', pages: 18, format: 'Excel', subscribers: 25 },
];

const categoryLabels: Record<string, { l: string; c: string }> = {
  scan: { l: '扫描', c: 'text-blue-400 bg-blue-500/10' },
  rectify: { l: '整改', c: 'text-green-400 bg-green-500/10' },
  compliance: { l: '合规', c: 'text-purple-400 bg-purple-500/10' },
  executive: { l: '高管', c: 'text-orange-400 bg-orange-500/10' },
  custom: { l: '自定义', c: 'text-gray-400 bg-gray-500/10' },
};

const frequencyLabels: Record<string, string> = {
  once: '一次性',
  daily: '每日',
  weekly: '每周',
  monthly: '每月',
  quarterly: '每季',
};

const statusConfig: Record<ReportStatus, { l: string; c: string }> = {
  generating: { l: '生成中', c: 'text-blue-400 bg-blue-500/10' },
  completed: { l: '已生成', c: 'text-green-400 bg-green-500/10' },
  failed: { l: '失败', c: 'text-red-400 bg-red-500/10' },
  scheduled: { l: '已计划', c: 'text-yellow-400 bg-yellow-500/10' },
};

export function VulnTaskReport() {
  const [tab, setTab] = useState<'templates' | 'history' | 'new'>('templates');
  const [searchKw, setSearchKw] = useState('');

  const filteredTemplates = useMemo(() => {
    if (!searchKw) return reportTemplates;
    return reportTemplates.filter(t => t.name.includes(searchKw) || t.description.includes(searchKw));
  }, [searchKw]);

  const filteredHistory = useMemo(() => {
    if (!searchKw) return historyReports;
    return historyReports.filter(r => r.name.includes(searchKw) || r.id.includes(searchKw));
  }, [searchKw]);

  const totalReports = historyReports.length;
  const successReports = historyReports.filter(r => r.status === 'completed').length;
  const totalSubscribers = historyReports.reduce((acc, r) => acc + r.subscribers, 0);
  const totalPages = historyReports.reduce((acc, r) => acc + r.pages, 0);

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            漏洞管理任务报告
          </h2>
          <span className="text-xs text-gray-500">{reportTemplates.length} 个模板 · {totalReports} 份历史报告</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('new')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            新建报告
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '历史报告', value: totalReports, color: 'blue', icon: <FileText className="w-4 h-4" /> },
          { label: '成功生成', value: successReports, color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: '总订阅', value: totalSubscribers, color: 'orange', icon: <Mail className="w-4 h-4" />, sub: '人/份' },
          { label: '总页数', value: totalPages, color: 'purple', icon: <Layers className="w-4 h-4" />, sub: '份报告' },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tab */}
      <div className="flex border-b border-[#2A354D]">
        {[
          { v: 'templates' as const, l: '报告模板', count: reportTemplates.length },
          { v: 'history' as const, l: '历史报告', count: totalReports },
          { v: 'new' as const, l: '创建自定义报告', count: 0 },
        ].map(t => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={`px-4 py-2 text-sm border-b-2 ${tab === t.v ? 'border-blue-500 text-white' : 'border-transparent text-gray-500'}`}
          >
            {t.l} {t.count > 0 && <span className="text-[10px] text-gray-500">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* 模板列表 */}
      {tab === 'templates' && (
        <>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchKw}
                onChange={e => setSearchKw(e.target.value)}
                placeholder="搜索模板..."
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredTemplates.map(tpl => {
              const cat = categoryLabels[tpl.category];
              return (
                <div key={tpl.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">{tpl.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${cat.c}`}>{cat.l}</span>
                      </div>
                      <p className="text-xs text-gray-400">{tpl.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mt-3 mb-3">
                    <div>
                      <div className="text-gray-500 text-[10px]">频率</div>
                      <div className="text-white">{frequencyLabels[tpl.frequency]}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px]">预计耗时</div>
                      <div className="text-white">{tpl.estimatedTime}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px]">格式</div>
                      <div className="flex gap-1 mt-0.5">
                        {tpl.format.map(f => (
                          <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px]">最近生成</div>
                      <div className="text-white text-[11px]">{tpl.lastGenerated || '未生成'}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-gray-500 text-[10px] mb-1">包含章节</div>
                    <div className="flex flex-wrap gap-1">
                      {tpl.sections.map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[#111625] text-gray-400 border border-[#2A354D]">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-3 border-t border-[#2A354D]">
                    <button className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs py-1.5 rounded flex items-center justify-center gap-1">
                      <Send className="w-3 h-3" />
                      立即生成
                    </button>
                    <button className="px-2 py-1.5 text-gray-400 hover:text-white" title="预览">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="px-2 py-1.5 text-gray-400 hover:text-white" title="订阅">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button className="px-2 py-1.5 text-gray-400 hover:text-white" title="编辑">
                      <Filter className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 历史报告 */}
      {tab === 'history' && (
        <>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchKw}
                onChange={e => setSearchKw(e.target.value)}
                placeholder="搜索报告..."
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
              />
            </div>
            <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              批量下载
            </button>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-[#2A354D] bg-[#111625]/30">
                  <th className="text-left py-2 px-3 font-medium">报告 ID</th>
                  <th className="text-left py-2 px-3 font-medium">报告名称</th>
                  <th className="text-left py-2 px-3 font-medium">模板</th>
                  <th className="text-center py-2 px-3 font-medium">状态</th>
                  <th className="text-center py-2 px-3 font-medium">大小</th>
                  <th className="text-center py-2 px-3 font-medium">页数</th>
                  <th className="text-center py-2 px-3 font-medium">订阅</th>
                  <th className="text-left py-2 px-3 font-medium">生成时间</th>
                  <th className="text-left py-2 px-3 font-medium">生成人</th>
                  <th className="text-center py-2 px-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map(r => {
                  const s = statusConfig[r.status];
                  return (
                    <tr key={r.id} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                      <td className="py-2 px-3 font-mono text-xs text-blue-400">{r.id}</td>
                      <td className="py-2 px-3 text-white max-w-xs truncate">{r.name}</td>
                      <td className="py-2 px-3 text-gray-400 text-xs">{r.template}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.c}`}>{s.l}</span>
                      </td>
                      <td className="py-2 px-3 text-center text-gray-400 text-xs">{r.size}</td>
                      <td className="py-2 px-3 text-center text-gray-400">{r.pages}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="text-orange-400">{r.subscribers}</span>
                      </td>
                      <td className="py-2 px-3 text-gray-500 text-xs">{r.generatedAt}</td>
                      <td className="py-2 px-3 text-gray-400 text-xs">{r.generatedBy}</td>
                      <td className="py-2 px-3 text-center">
                        <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">下载</button>
                        <button className="text-xs text-green-400 hover:text-green-300">预览</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 创建自定义报告 */}
      {tab === 'new' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-5 max-w-3xl">
          <h3 className="text-base font-medium text-white mb-4">创建自定义报告</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">报告名称 *</label>
              <input type="text" placeholder="例如：2026 Q2 漏洞管理总结" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">基于模板</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                  <option>空白报告</option>
                  {reportTemplates.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">输出格式</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5">
                  <option>PDF</option>
                  <option>Word</option>
                  <option>Excel</option>
                  <option>HTML</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">时间范围 *</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="datetime-local" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
                <input type="datetime-local" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">包含章节</label>
              <div className="grid grid-cols-2 gap-2">
                {['概览统计', '漏洞分布', 'TOP 资产', '修复情况', '复测结果', '趋势分析', '部门排行', '风险评估'].map((s, i) => (
                  <label key={s} className="flex items-center gap-2 bg-[#111625] border border-[#2A354D] rounded p-2 text-xs">
                    <input type="checkbox" defaultChecked={i < 4} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">订阅通知</label>
              <input type="text" placeholder="邮箱列表（多个用逗号分隔）" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-[#2A354D]">
            <button className="px-4 py-1.5 text-sm text-gray-400">取消</button>
            <button className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded">保存为模板</button>
            <button className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded">立即生成</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VulnTaskReport;
