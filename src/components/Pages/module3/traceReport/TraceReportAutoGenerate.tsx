'use client';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, X, CheckCircle2, Play, Edit, FileText, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const reportTemplates = [
  { id: 'TPL-001', name: '详细溯源报告', description: '包含完整的攻击时间线、IOC列表、攻击者画像和处置建议' },
  { id: 'TPL-002', name: '简洁溯源报告', description: '重点突出IOC和处置建议，适合快速响应' },
  { id: 'TPL-003', name: '管理层报告', description: '可视化图表和高层摘要，适合非技术人员' },
];

const mockGeneratingReport = {
  id: 'RG-001',
  name: 'APT攻击溯源报告',
  progress: 65,
  steps: [
    { name: '事件概述', done: true },
    { name: '分析过程', done: true },
    { name: '根因结论', done: true },
    { name: '处置建议', inProgress: true },
    { name: 'IOC清单', done: false },
  ],
};

export function TraceReportAutoGenerate() {
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(mockGeneratingReport.progress);

  useEffect(() => {
    if (isGenerating && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 5, 100));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, progress]);

  const filteredTemplates = reportTemplates.filter(t => {
    if (search && !t.name.includes(search) && !t.id.includes(search)) return false;
    return true;
  });

  const startGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="溯源报告自动生成" description="选择模板生成溯源分析报告"
        actions={[
          <button key="preview" onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <Eye className="w-4 h-4" /> 预览报告
          </button>,
          <button key="add" onClick={startGenerate} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg">
            <Play className="w-4 h-4" /> 生成报告
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> 报告模板
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索模板..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-full"
              />
            </div>
            <div className="space-y-2">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedTemplate.id === template.id ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-[#111625] hover:bg-[#0F1729]'}`}
                >
                  <div className="text-sm text-white font-medium">{template.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{template.description}</div>
                </div>
              ))}
            </div>
          </div>

          {isGenerating && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Play className="w-4 h-4 text-green-400" /> 生成进度
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{mockGeneratingReport.name}</span>
                <span className="text-sm font-semibold text-white">{progress}%</span>
              </div>
              <div className="w-full bg-[#111625] rounded-full h-2 mb-4">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-2">
                {mockGeneratingReport.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#111625] rounded-lg">
                    {step.done ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                     step.inProgress ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> :
                     <div className="w-4 h-4 rounded-full border-2 border-slate-500" />}
                    <span className={`text-sm ${step.done ? 'text-slate-300' : step.inProgress ? 'text-white' : 'text-slate-500'}`}>{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Edit className="w-4 h-4 text-yellow-400" /> 报告内容预览
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#111625] rounded-lg">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> 事件概述
                </div>
                <div className="text-sm text-white">2026年6月3日，核心网络区域检测到APT组织攻击，涉及3台服务器被入侵。</div>
              </div>

              <div className="p-4 bg-[#111625] rounded-lg">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <Target className="w-3 h-3" /> 分析过程
                </div>
                <div className="text-sm text-white">通过多源日志分析，确定攻击始于钓鱼邮件，随后通过横向移动渗透至核心区域。</div>
              </div>

              <div className="p-4 bg-[#111625] rounded-lg">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> 根因结论
                </div>
                <div className="text-sm text-white">系统补丁未及时更新导致漏洞被利用，缺乏网络分段控制使得攻击横向扩散。</div>
              </div>

              <div className="p-4 bg-[#111625] rounded-lg">
                <div className="text-xs text-slate-400 mb-1">处置建议</div>
                <div className="text-sm text-white">1. 立即隔离受感染服务器；2. 补丁修复已知漏洞；3. 加强网络分段和访问控制。</div>
              </div>

              <div className="p-4 bg-[#111625] rounded-lg">
                <div className="text-xs text-slate-400 mb-1">IOC清单</div>
                <div className="text-sm text-white font-mono space-y-1">
                  <div>IP: 192.168.1.100</div>
                  <div>Domain: malicious.example.com</div>
                  <div>MD5: d41d8cd98f00b204e9800998ecf8427e</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">报告预览</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-white text-slate-800 p-6 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">溯源分析报告</h1>
                <p className="text-slate-600 mb-4">报告编号: RG-001 | 生成时间: 2026-06-03</p>
                <h2 className="text-lg font-semibold mb-2">事件概述</h2>
                <p className="mb-4">检测到APT组织攻击...</p>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg">
                  关闭
                </button>
                <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                  确认预览
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TraceReportAutoGenerate;
