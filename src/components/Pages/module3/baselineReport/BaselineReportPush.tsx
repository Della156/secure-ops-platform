'use client';

import React, { useState } from 'react';
import { Search, Plus, Eye, Play, CheckCircle2, X, Send, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const reports = [
  { id: 'RP-001', name: '主机安全基线报告', cycle: '每日', generateTime: '08:00', pushStatus: 'success', lastPushTime: '2026-06-03 08:05' },
  { id: 'RP-002', name: '网络安全基线报告', cycle: '每周', generateTime: '09:00', pushStatus: 'success', lastPushTime: '2026-06-02 09:10' },
  { id: 'RP-003', name: '数据库基线报告', cycle: '每日', generateTime: '07:00', pushStatus: 'pending', lastPushTime: '--' },
  { id: 'RP-004', name: '系统安全基线报告', cycle: '每月', generateTime: '08:00', pushStatus: 'failed', lastPushTime: '2026-06-01 08:30' },
];

const pushHistory = [
  { id: 'PH-001', reportName: '主机安全基线报告', pushTime: '2026-06-03 08:05', target: '安全运维组', status: 'success' },
  { id: 'PH-002', reportName: '网络安全基线报告', pushTime: '2026-06-02 09:10', target: '管理层', status: 'success' },
  { id: 'PH-003', reportName: '系统安全基线报告', pushTime: '2026-06-01 08:30', target: '安全运维组', status: 'failed' },
];

export function BaselineReportPush() {
  const [activeTab, setActiveTab] = useState('reports');
  const [search, setSearch] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const filteredReports = reports.filter(r => {
    if (search && !r.name.includes(search) && !r.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线防护报告生成与推送" description="管理基线报告的生成和推送"
        actions={[
          <button key="add" onClick={() => setShowPreviewModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建报告任务
          </button>,
        ]}
      />

      <div className="flex gap-2">
        <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded-lg text-sm transition ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-[#20293F] text-slate-400 hover:bg-[#2A354D]'}`}>
          报告记录
        </button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm transition ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-[#20293F] text-slate-400 hover:bg-[#2A354D]'}`}>
          推送记录
        </button>
      </div>

      {activeTab === 'reports' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索报告名称..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">周期</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">生成时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送状态</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">最后推送</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-sm text-blue-400 font-mono">{report.id}</td>
                    <td className="px-4 py-3 text-sm text-white">{report.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{report.cycle}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{report.generateTime}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={report.pushStatus === 'success' ? 'completed' : report.pushStatus === 'failed' ? 'failed' : 'pending'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{report.lastPushTime}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <Eye className="w-3 h-3" />预览
                        </button>
                        <button className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                          <Send className="w-3 h-3" />推送
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">记录ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送目标</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {pushHistory.map(record => (
                  <tr key={record.id} className="hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-sm text-blue-400 font-mono">{record.id}</td>
                    <td className="px-4 py-3 text-sm text-white">{record.reportName}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{record.pushTime}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{record.target}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${record.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {record.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {record.status === 'success' ? '成功' : '失败'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">报告预览</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#111625] rounded-lg p-6">
                <div className="text-center mb-4 pb-4 border-b border-[#2A354D]">
                  <h2 className="text-xl font-bold text-white">基线防护报告</h2>
                  <p className="text-xs text-slate-400 mt-1">报告周期：2026年6月</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">检查项总数：</span>
                    <span className="text-white">100</span>
                  </div>
                  <div>
                    <span className="text-slate-400">合规率：</span>
                    <span className="text-green-400">85%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">不合规项：</span>
                    <span className="text-red-400">15</span>
                  </div>
                  <div>
                    <span className="text-slate-400">风险等级：</span>
                    <span className="text-yellow-400">中</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">选择推送目标</span>
                <select className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-2 focus:border-blue-500 outline-none">
                  <option>安全运维组</option>
                  <option>管理层</option>
                  <option>值班群</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#2A354D]">
              <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-md">
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center gap-2">
                <Send className="w-4 h-4" />推送报告
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BaselineReportPush;