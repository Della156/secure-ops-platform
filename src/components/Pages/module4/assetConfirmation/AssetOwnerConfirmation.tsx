'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, CheckCircle2, XCircle, User, RefreshCw, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const owners = [
  { id: 'OWNER-001', name: 'admin', department: 'IT部门', email: 'admin@company.com', phone: '13800138001', confirmedAssets: 156, totalAssets: 160 },
  { id: 'OWNER-002', name: 'dba', department: '数据中心', email: 'dba@company.com', phone: '13800138002', confirmedAssets: 45, totalAssets: 45 },
  { id: 'OWNER-003', name: 'user1', department: '开发部', email: 'user1@company.com', phone: '13800138003', confirmedAssets: 23, totalAssets: 35 },
  { id: 'OWNER-004', name: 'user2', department: '运维部', email: 'user2@company.com', phone: '13800138004', confirmedAssets: 89, totalAssets: 95 },
];

const pendingAssets = [
  { id: 'ASSET-003', name: 'api-gateway-01', owner: 'user1', type: '网络设备', ip: '192.168.1.103', pendingDays: 3 },
  { id: 'ASSET-005', name: 'backup-server-01', owner: 'user2', type: '服务器', ip: '192.168.1.105', pendingDays: 5 },
];

export function AssetOwnerConfirmation() {
  const [search, setSearch] = useState('');

  const filteredOwners = owners.filter(owner => {
    if (search && !owner.name.includes(search) && !owner.department.includes(search)) return false;
    return true;
  });

  const handleConfirm = (assetId: string) => {
    alert(`确认资产 ${assetId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产责任人确认" description="管理和确认资产责任人"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新增责任人
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text" placeholder="搜索责任人姓名或部门..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
                />
              </div>
            </div>
            <div className="divide-y divide-[#2A354D]">
              {filteredOwners.map(owner => (
                <div key={owner.id} className="p-4 hover:bg-[#111625]/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <User className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{owner.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-500/20 text-gray-400">{owner.department}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${owner.confirmedAssets === owner.totalAssets ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {owner.confirmedAssets === owner.totalAssets ? '全部确认' : `${owner.totalAssets - owner.confirmedAssets} 项待确认`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />{owner.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />{owner.phone}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{owner.confirmedAssets} / {owner.totalAssets}</div>
                      <div className="text-xs text-slate-400">已确认/总数</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-white font-medium">待确认资产</h3>
            <span className="text-xs text-yellow-400 ml-2">({pendingAssets.length})</span>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {pendingAssets.map(asset => (
              <div key={asset.id} className="p-4 hover:bg-[#111625]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{asset.name}</span>
                  <span className="text-xs text-yellow-400">待确认 {asset.pendingDays} 天</span>
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  {asset.type} | {asset.ip} | 责任人: {asset.owner}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleConfirm(asset.id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                    <CheckCircle2 className="w-3 h-3" /> 确认
                  </button>
                  <button className="px-2 py-1.5 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
                    <XCircle className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetOwnerConfirmation;