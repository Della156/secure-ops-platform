'use client';

import React, { useState } from 'react';
import { Calendar, Download, FileText, CheckCircle } from 'lucide-react';

export function LoginLogExport() {
  const [exportType, setExportType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [status, setStatus] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">登录日志导出</h2>
          <p className="text-sm text-gray-400 mt-1">导出登录日志数据到文件</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">导出范围</label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部日志</option>
              <option value="today">今日日志</option>
              <option value="week">本周日志</option>
              <option value="month">本月日志</option>
              <option value="custom">自定义时间范围</option>
            </select>
          </div>

          {exportType === 'custom' && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">开始时间</label>
                <input
                  type="datetime-local"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">结束时间</label>
                <input
                  type="datetime-local"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          {exportType !== 'custom' && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">登录状态</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">全部状态</option>
                  <option value="success">成功</option>
                  <option value="failed">失败</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">导出格式</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </>
          )}
        </div>

        {exportType === 'custom' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">登录状态</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="success">成功</option>
                <option value="failed">失败</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">导出格式</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileText className="w-4 h-4" />
            <span>预计导出: 1,234 条记录</span>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              exported
                ? 'bg-green-600/20 text-green-400'
                : exporting
                ? 'bg-blue-600/50 text-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {exported ? (
              <>
                <CheckCircle className="w-4 h-4" />
                导出成功
              </>
            ) : exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                导出中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                开始导出
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">导出历史</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 bg-[#111625] rounded">
            <div>
              <span className="text-sm text-white">login_logs_20260604.csv</span>
              <span className="text-xs text-gray-500 ml-2">2.4 MB</span>
            </div>
            <span className="text-xs text-gray-400">2026-06-04 10:30:00</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-[#111625] rounded">
            <div>
              <span className="text-sm text-white">login_logs_20260603.xlsx</span>
              <span className="text-xs text-gray-500 ml-2">5.1 MB</span>
            </div>
            <span className="text-xs text-gray-400">2026-06-03 15:20:00</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-[#111625] rounded">
            <div>
              <span className="text-sm text-white">login_logs_20260602.csv</span>
              <span className="text-xs text-gray-500 ml-2">3.8 MB</span>
            </div>
            <span className="text-xs text-gray-400">2026-06-02 09:45:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginLogExport;