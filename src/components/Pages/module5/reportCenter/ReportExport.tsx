'use client';

import React, { useState } from 'react';
import {
  Download, FileText, Settings, CheckCircle2,
  Clock, Database, AlertTriangle, ChevronRight,
  FileImage, FileCode, FileSpreadsheet
} from 'lucide-react';

export function ReportExport() {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [includeLinks, setIncludeLinks] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const formats = [
    { id: 'pdf', label: 'PDF', icon: <FileText className="w-5 h-5" />, description: '适合打印和分享' },
    { id: 'word', label: 'Word', icon: <FileText className="w-5 h-5" />, description: '适合编辑和修改' },
    { id: 'html', label: 'HTML', icon: <FileCode className="w-5 h-5" />, description: '适合网页展示' },
    { id: 'image', label: '图片', icon: <FileImage className="w-5 h-5" />, description: '适合嵌入文档' },
    { id: 'excel', label: 'Excel', icon: <FileSpreadsheet className="w-5 h-5" />, description: '适合数据分析' },
  ];

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-green-400" />
            报告导出
          </h2>
          <p className="text-sm text-gray-400 mt-1">将报告导出为多种格式，满足不同需求</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          选择导出格式
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`p-4 rounded-lg text-center transition-all ${
                selectedFormat === format.id
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : 'bg-[#111625] border border-[#2A354D] hover:border-[#3A455D]'
              }`}
            >
              <div className={`mx-auto mb-2 ${selectedFormat === format.id ? 'text-blue-400' : 'text-gray-400'}`}>
                {format.icon}
              </div>
              <div className={`text-sm font-medium ${selectedFormat === format.id ? 'text-blue-400' : 'text-white'}`}>
                {format.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{format.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">导出选项</h3>
          <div className="space-y-3">
            {[
              { label: '包含图表', checked: includeCharts, onChange: setIncludeCharts, description: '在导出中包含所有图表和图形' },
              { label: '包含附件', checked: includeAttachments, onChange: setIncludeAttachments, description: '在导出中包含所有附件文件' },
              { label: '保留链接', checked: includeLinks, onChange: setIncludeLinks, description: '保留文档中的超链接' },
            ].map((option, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(e) => option.onChange(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#111625] border-[#2A354D] mt-0.5"
                />
                <div>
                  <div className="text-sm text-gray-300">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">导出信息</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">报告名称</span>
              <span className="text-white">2026年6月安全态势分析报告</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">导出格式</span>
              <span className="text-white uppercase">{selectedFormat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">预计大小</span>
              <span className="text-white">2.3 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">预计时间</span>
              <span className="text-white">2-3秒</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">页数</span>
              <span className="text-white">45页</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-orange-400" />
          开始导出
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-4 h-4" />
              预计耗时: 2-3秒
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Database className="w-4 h-4" />
              数据来源: 最新数据
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-4 py-2 rounded hover:bg-[#20293F]">
              预览报告
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || exported}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm px-6 py-2 rounded flex items-center gap-2"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  导出中...
                </>
              ) : exported ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  导出成功
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  导出报告
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {exported && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">导出成功</h4>
                <p className="text-xs text-gray-400">报告已成功导出，可随时下载</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-white">2026年6月安全态势分析报告.pdf</div>
                <div className="text-xs text-gray-400">大小: 2.3 MB</div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                下载
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">导出历史</h3>
          <div className="space-y-2">
            {[
              { name: '2026年6月安全态势分析报告.pdf', time: '刚刚', size: '2.3 MB' },
              { name: 'Q2季度安全审计报告.pdf', time: '昨天', size: '5.1 MB' },
              { name: '漏洞扫描月度报告.pdf', time: '2天前', size: '1.8 MB' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-300">{item.name}</span>
                </div>
                <div className="text-xs text-gray-500">{item.size}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">批量导出</h3>
          <div className="space-y-2">
            {['按日期范围', '按报告类型', '按作者筛选'].map((option, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {option}
                <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportExport;