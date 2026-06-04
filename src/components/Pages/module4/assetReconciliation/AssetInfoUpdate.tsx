'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Save, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const updates = [
  { id: 'UPDATE-001', assetId: 'ASSET-001', assetName: 'web-server-01', field: 'IP地址', oldValue: '192.168.1.101', newValue: '192.168.1.102', status: 'pending', updateTime: '2026-06-03 08:00', operator: 'admin' },
  { id: 'UPDATE-002', assetId: 'ASSET-003', assetName: 'api-gateway-01', field: '责任人', oldValue: 'admin', newValue: 'user1', status: 'approved', updateTime: '2026-06-03 07:30', operator: 'admin' },
  { id: 'UPDATE-003', assetId: 'ASSET-005', assetName: 'backup-server-01', field: '状态', oldValue: '在线', newValue: '离线', status: 'rejected', updateTime: '2026-06-02 16:00', operator: 'user2' },
  { id: 'UPDATE-004', assetId: 'ASSET-002', assetName: 'db-server-01', field: '位置', oldValue: '数据中心A区', newValue: '数据中心B区', status: 'pending', updateTime: '2026-06-03 09:00', operator: 'admin' },
];

export function AssetInfoUpdate() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredUpdates = updates.filter(update => {
    if (search && !update.assetName.includes(search) && !update.assetId.includes(search)) return false;
    if (statusFilter && update.status !== statusFilter) return false;
    return true;
  });

  const handleApprove = (updateId: string) => {
    alert(`批准更新 ${updateId}`);
  };

  const handleReject = (updateId: string) => {
    alert(`拒绝更新 ${updateId}`);
  };

  const handleApply = () => {
    alert('应用所有待批准更新');
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产信息更新" description="管理资产信息更新请求"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="apply" onClick={handleApply} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <CheckCircle2 className="w-4 h-4" /> 应用更新
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索资产名称或ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            >
              <option value="">全部状态</option>
              <option value="pending">待批准</option>
              <option value="approved">已批准</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">更新ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">资产ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">资产名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">更新字段</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">原值</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">新值</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作人</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredUpdates.map(update => (
                <tr key={update.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{update.id}</td>
                  <td className="px-4 py-3 text-sm text-white font-mono">{update.assetId}</td>
                  <td className="px-4 py-3 text-sm text-white">{update.assetName}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{update.field}</td>
                  <td className="px-4 py-3 text-sm text-red-400 line-through">{update.oldValue}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{update.newValue}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      update.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      update.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {update.status === 'pending' ? '待批准' : update.status === 'approved' ? '已批准' : '已拒绝'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{update.operator}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {update.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(update.id)} className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                            <CheckCircle2 className="w-3 h-3" /> 批准
                          </button>
                          <button onClick={() => handleReject(update.id)} className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
                            <X className="w-3 h-3" /> 拒绝
                          </button>
                        </>
                      )}
                      {update.status !== 'pending' && (
                        <button className="flex items-center gap-1 text-xs text-gray-400">
                          <Edit2 className="w-3 h-3" /> 编辑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssetInfoUpdate;