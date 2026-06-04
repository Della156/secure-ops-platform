'use client';

import React, { useState } from 'react';
import {
  FileText, Download, Printer, Share2, ZoomIn, ZoomOut,
  RotateCcw, ChevronLeft, ChevronRight, Bookmark,
  AlertTriangle, CheckCircle2, Clock, User, Calendar
} from 'lucide-react';

export function ReportPreview() {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(prev => prev - 10);
  };

  const reportInfo = {
    title: '2026年6月安全态势分析报告',
    author: '张工',
    date: '2026-06-02',
    pages: 45,
    size: '2.3 MB',
    status: '已发布',
  };

  const reportSections = [
    { title: '一、执行摘要', pages: 1 },
    { title: '二、安全态势概述', pages: 2-5 },
    { title: '三、威胁态势分析', pages: 6-12 },
    { title: '四、漏洞态势分析', pages: 13-20 },
    { title: '五、事件态势分析', pages: 21-28 },
    { title: '六、合规态势分析', pages: 29-35 },
    { title: '七、改进建议', pages: 36-42 },
    { title: '八、附录', pages: 43-45 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            报告预览
          </h2>
          <p className="text-sm text-gray-400 mt-1">在线预览安全分析报告内容</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`bg-[#111625] border border-[#2A354D] text-sm px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
              bookmarked ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'text-gray-300 hover:bg-[#20293F]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {bookmarked ? '已收藏' : '收藏'}
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            分享
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5" />
            打印
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            下载PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="bg-[#111625] px-4 py-3 flex items-center justify-between border-b border-[#2A354D]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 hover:bg-[#20293F] rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <span className="text-sm text-gray-300">
                {currentPage} / {reportInfo.pages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(reportInfo.pages, prev + 1))}
                disabled={currentPage === reportInfo.pages}
                className="p-1.5 hover:bg-[#20293F] rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleZoomOut} className="p-1.5 hover:bg-[#20293F] rounded">
                <ZoomOut className="w-4 h-4 text-gray-400" />
              </button>
              <span className="text-sm text-gray-400 w-16 text-center">{zoom}%</span>
              <button onClick={handleZoomIn} className="p-1.5 hover:bg-[#20293F] rounded">
                <ZoomIn className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1.5 hover:bg-[#20293F] rounded" onClick={() => setZoom(100)}>
                <RotateCcw className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-white/5" style={{ minHeight: '600px' }}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">{reportInfo.title}</h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {reportInfo.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {reportInfo.date}
                  </span>
                </div>
              </div>

              <div className="text-gray-300 space-y-4">
                <h2 className="text-xl font-semibold text-white">一、执行摘要</h2>
                <p className="text-sm leading-relaxed">
                  本月整体安全态势稳定，共检测到安全事件156起，较上月下降12%。
                  高危漏洞数量为34个，已修复28个，修复率达82%。
                </p>
                <p className="text-sm leading-relaxed">
                  威胁方面，外部攻击主要集中在Web应用层，占比45%；内部异常行为监测发现12起可疑操作。
                </p>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: '安全事件', value: '156起', change: '-12%', trend: 'down' },
                    { label: '高危漏洞', value: '34个', change: '+5%', trend: 'up' },
                    { label: '修复率', value: '82%', change: '+8%', trend: 'up' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#111625] rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                      <div className={`text-xs mt-1 ${stat.trend === 'down' ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">报告信息</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">标题</span>
                <span className="text-white">{reportInfo.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">作者</span>
                <span className="text-white flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {reportInfo.author}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">日期</span>
                <span className="text-white flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {reportInfo.date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">页数</span>
                <span className="text-white">{reportInfo.pages} 页</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">大小</span>
                <span className="text-white">{reportInfo.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">状态</span>
                <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-400">
                  {reportInfo.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">目录</h3>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {reportSections.map((section, i) => (
                <button
                  key={i}
                  onClick={() => {}}
                  className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white transition-all"
                >
                  <span>{section.title}</span>
                  <span className="text-gray-500">P{section.pages}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">关键指标</h3>
            <div className="space-y-3">
              {[
                { label: '安全事件数量', value: '156', trend: '-12%', status: 'good' },
                { label: '高危漏洞', value: '34', trend: '+5%', status: 'warning' },
                { label: '漏洞修复率', value: '82%', trend: '+8%', status: 'good' },
                { label: '合规达标率', value: '95%', trend: '+2%', status: 'good' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white">{item.value}</span>
                      <span className={`text-xs ${item.status === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {item.trend}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(100, parseInt(item.value))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPreview;