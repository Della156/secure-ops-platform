'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, X, CheckCircle2, Send, Share2, Users, Copy, Lock, Unlock } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const reports = [
  { id: 'RP-001', name: 'APT攻击溯源报告', cycle: '即时', status: 'completed', lastPush: '2026-06-03 08:30', targets: ['安全运维组', '管理层'] },
  { id: 'RP-002', name: '勒索病毒溯源报告', cycle: '即时', status: 'running', lastPush: '-', targets: ['安全运维组'] },
  { id: 'RP-003', name: '每周安全态势报告', cycle: '每周', status: 'pending', lastPush: '2026-06-02 09:00', targets: ['安全运维组', '研发部'] },
  { id: 'RP-004', name: '数据泄露分析报告', cycle: '即时', status: 'failed', lastPush: '2026-06-01 16:00', targets: ['安全运维组', '法务部'] },
];

const pushHistory = [
  { id: 'PH-001', reportName: 'APT攻击溯源报告', pushTime: '2026-06-03 08:30', target: '安全运维组', status: 'success', readCount: 5 },
  { id: 'PH-002', reportName: 'APT攻击溯源报告', pushTime: '2026-06-03 08:35', target: '管理层', status: 'success', readCount: 3 },
  { id: 'PH-003', reportName: '数据泄露分析报告', pushTime: '2026-06-01 16:00', target: '安全运维组', status: 'failed', readCount: 0 },
];

const teamOptions = [
  { id: 'T001', name: '安全运维组' },
  { id: 'T002', name: '管理层' },
  { id: 'T003', name: '研发部' },
  { id: 'T004', name: '法务部' },
  { id: 'T005', name: '人力资源部' },
];

export function TraceReportPush() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('reports');
  const [showPushModal, setShowPushModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>(['T001']);
  const [shareLink, setShareLink] = useState('https://security.example.com/report/RP-001/abc123');
  const [sharePermission, setSharePermission] = useState<'view' | 'comment'>('view');
  const [copied, setCopied] = useState(false);

  const filteredReports = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    return true;
  });

  const toggleTarget = (id: string) => {
    setSelectedTargets(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="溯源报告自动推送与共享" description="管理报告推送和在线共享"
        actions={[
          <button key="share" onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <Share2 className="w-4 h-4" /> 生成共享链接
          </button>,
          <button key="push" onClick={() => setShowPushModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Send className="w-4 h-4" /> 推送报告
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索报告..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111625]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">报告名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送周期</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">推送目标</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
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
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {report.targets.map((t, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-[#111625] rounded-full text-slate-300">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={report.status} pulse={report.status === 'running'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{report.lastPush}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedReport(report); setShowPushModal(true); }} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <Send className="w-3 h-3" /> 推送
                        </button>
                        <button className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                          <Eye className="w-3 h-3" /> 详情
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">已读</th>
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
                      <span className={`text-xs px-2 py-1 rounded ${record.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {record.status === 'success' ? '成功' : '失败'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{record.readCount} 人</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPushModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">推送报告</h3>
              <button onClick={() => setShowPushModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">选择报告</label>
                <select className="w-full px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none">
                  {reports.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <Users className="w-3 h-3" /> 推送目标
                </label>
                <div className="space-y-2">
                  {teamOptions.map(team => (
                    <label key={team.id} className="flex items-center gap-2 p-2 hover:bg-[#111625] rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTargets.includes(team.id)}
                        onChange={() => toggleTarget(team.id)}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className="text-sm text-white">{team.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowPushModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg">
                  取消
                </button>
                <button onClick={() => setShowPushModal(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2">
                  <Send className="w-4 h-4" /> 确认推送
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">生成共享链接</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">共享链接</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={shareLink} readOnly
                    className="flex-1 px-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg"
                  />
                  <button onClick={handleCopy} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg flex items-center gap-2">
                    <Copy className="w-4 h-4" /> {copied ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">访问权限</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 hover:bg-[#111625] rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="permission"
                      value="view"
                      checked={sharePermission === 'view'}
                      onChange={() => setSharePermission('view')}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white">仅查看</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 hover:bg-[#111625] rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="permission"
                      value="comment"
                      checked={sharePermission === 'comment'}
                      onChange={() => setSharePermission('comment')}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <Unlock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white">可评论</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowShareModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-lg">
                  取消
                </button>
                <button onClick={() => setShowShareModal(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                  生成链接
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TraceReportPush;
