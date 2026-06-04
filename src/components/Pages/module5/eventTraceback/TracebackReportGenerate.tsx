'use client';

import React, { useState } from 'react';
import {
  FileText, Download, Settings, CheckCircle2,
  Clock, User, MapPin, AlertTriangle,
  ChevronRight, Printer, Share2, Eye,
  ListChecks, Zap, Database
} from 'lucide-react';

interface ReportSection {
  id: string;
  title: string;
  description: string;
  selected: boolean;
}

const reportSections: ReportSection[] = [
  { id: 's1', title: '事件概述', description: '事件基本信息、时间线摘要', selected: true },
  { id: 's2', title: '详细时间线', description: '完整的事件发展时间线', selected: true },
  { id: 's3', title: '证据链路', description: '关联的日志、告警证据链', selected: true },
  { id: 's4', title: '分析结论', description: '安全分析人员的分析结论', selected: true },
  { id: 's5', title: '处置建议', description: '针对事件的处置建议和措施', selected: true },
  { id: 's6', title: '统计分析', description: '事件相关的统计数据图表', selected: false },
  { id: 's7', title: '附件材料', description: '相关的日志文件、截图等', selected: false },
];

export function TracebackReportGenerate() {
  const [sections, setSections] = useState(reportSections);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const selectedCount = sections.filter(s => s.selected).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            回溯报告生成
          </h2>
          <p className="text-sm text-gray-400 mt-1">生成事件回溯分析报告，支持多种格式导出</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          报告设置
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">报告格式</label>
            <div className="flex gap-2">
              {[
                { id: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
                { id: 'word', label: 'Word', icon: <FileText className="w-4 h-4" /> },
                { id: 'html', label: 'HTML', icon: <FileText className="w-4 h-4" /> },
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() => setReportFormat(format.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                    reportFormat === format.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#111625] text-gray-400 hover:bg-[#20293F]'
                  }`}
                >
                  {format.icon}
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">选项设置</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]"
                />
                <span className="text-xs text-gray-300">包含图表</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAttachments}
                  onChange={(e) => setIncludeAttachments(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]"
                />
                <span className="text-xs text-gray-300">包含附件</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">报告信息</label>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">事件ID</span>
                <span className="text-white">EVT-2026-0602-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">生成时间</span>
                <span className="text-white">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">选择章节</span>
                <span className="text-white">{selectedCount}/{sections.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-green-400" />
          章节选择 ({selectedCount}/{sections.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`p-4 rounded-lg text-left transition-all ${
                section.selected
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : 'bg-[#111625] border border-[#2A354D] hover:border-[#3A455D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  section.selected ? 'bg-blue-500' : 'bg-[#2A354D]'
                }`}>
                  {section.selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm font-medium ${section.selected ? 'text-blue-400' : 'text-white'}`}>
                  {section.title}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-7">{section.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-400" />
          生成报告
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-4 h-4" />
              预计耗时: 2-3秒
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Database className="w-4 h-4" />
              数据来源: 7条日志
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating || generated}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm px-6 py-2 rounded flex items-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </>
              ) : generated ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  已生成
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  生成报告
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {generated && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">报告生成成功</h4>
                <p className="text-xs text-gray-400">报告已准备就绪，可随时下载或预览</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                预览
              </button>
              <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" />
                打印
              </button>
              <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                分享
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                下载PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">报告模板</h3>
          <div className="space-y-2">
            {['标准模板', '详细模板', '简洁模板'].map((template, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {template}
                <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">最近报告</h3>
          <div className="space-y-2">
            {[
              { name: 'EVT-2026-0602-001.pdf', size: '2.3 MB', time: '刚刚' },
              { name: 'EVT-2026-0601-003.pdf', size: '1.8 MB', time: '昨天' },
              { name: 'EVT-2026-0531-002.pdf', size: '3.1 MB', time: '2天前' },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-300">{report.name}</span>
                </div>
                <span className="text-xs text-gray-500">{report.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TracebackReportGenerate;