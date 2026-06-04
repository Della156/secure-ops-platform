'use client';

import { useState } from 'react';
import { Server, Database, Laptop, Router, Shield, AlertTriangle, Search, Filter, Plus } from 'lucide-react';

const mockAssets = [
  { id: 'asset-001', name: 'Web服务器-01', type: 'server', status: 'normal', riskLevel: 'low', ip: '192.168.1.10', os: 'Linux' },
  { id: 'asset-002', name: '数据库-01', type: 'database', status: 'warning', riskLevel: 'medium', ip: '192.168.1.20', os: 'Linux' },
  { id: 'asset-003', name: '终端PC-001', type: 'terminal', status: 'normal', riskLevel: 'low', ip: '192.168.2.101', os: 'Windows' },
  { id: 'asset-004', name: '防火墙-01', type: 'network', status: 'normal', riskLevel: 'low', ip: '192.168.1.1', os: 'FortiOS' },
  { id: 'asset-005', name: 'Web服务器-02', type: 'server', status: 'critical', riskLevel: 'high', ip: '192.168.1.11', os: 'Linux' },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'server': return <Server className="w-4 h-4" />;
    case 'database': return <Database className="w-4 h-4" />;
    case 'terminal': return <Laptop className="w-4 h-4" />;
    case 'network': return <Router className="w-4 h-4" />;
    default: return <Server className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getTypeText = (type: string) => {
  switch (type) {
    case 'server': return '服务器';
    case 'database': return '数据库';
    case 'terminal': return '终端';
    case 'network': return '网络设备';
    default: return '其他';
  }
};

export function AssetManagementView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);

  const filteredAssets = mockAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockAssets.length,
    normal: mockAssets.filter(a => a.status === 'normal').length,
    warning: mockAssets.filter(a => a.status === 'warning').length,
    critical: mockAssets.filter(a => a.status === 'critical').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">资产管理视图</h1>
          <p className="text-slate-400 mt-1">管理和监控所有资产设备</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <Plus className="w-4 h-4" />添加资产
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">资产总数</span>
            <Server className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">运行正常</span>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.normal}</div>
        </div>
        <div className="bg-[#20293F] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">存在告警</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.warning}</div>
        </div>
        <div className="bg-[#20293F] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">严重异常</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2">{stats.critical}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索资产名称..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Filter className="w-3.5 h-3.5" />筛选
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">资产名称</th>
                <th className="text-left px-4 py-2.5">类型</th>
                <th className="text-left px-4 py-2.5">IP地址</th>
                <th className="text-left px-4 py-2.5">操作系统</th>
                <th className="text-left px-4 py-2.5">状态</th>
                <th className="text-left px-4 py-2.5">风险等级</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr 
                  key={asset.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedAsset.id === asset.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <td className="px-4 py-3 text-white font-medium">{asset.name}</td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-2">
                    {getTypeIcon(asset.type)}
                    {getTypeText(asset.type)}
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.ip}</td>
                  <td className="px-4 py-3 text-slate-400">{asset.os}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(asset.status)}`} />
                      <span className={`text-xs ${
                        asset.status === 'normal' ? 'text-green-400' :
                        asset.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {asset.status === 'normal' ? '正常' : asset.status === 'warning' ? '警告' : '严重'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      asset.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                      asset.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {asset.riskLevel === 'high' ? '高' : asset.riskLevel === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">资产详情</h3>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                <div className={`w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center`}>
                  {getTypeIcon(selectedAsset.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedAsset.name}</p>
                  <span className="text-slate-500 text-xs">{selectedAsset.id}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">资产类型</p>
                  <p className="text-slate-300">{getTypeText(selectedAsset.type)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">IP地址</p>
                  <p className="text-slate-300 font-mono">{selectedAsset.ip}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">操作系统</p>
                  <p className="text-slate-300">{selectedAsset.os}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">当前状态</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedAsset.status)}`} />
                    <span className={`${
                      selectedAsset.status === 'normal' ? 'text-green-400' :
                      selectedAsset.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedAsset.status === 'normal' ? '运行正常' : 
                       selectedAsset.status === 'warning' ? '存在告警' : '严重异常'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">风险等级</p>
                  <span className={`text-sm ${
                    selectedAsset.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                    selectedAsset.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  } px-2 py-1 rounded`}>
                    {selectedAsset.riskLevel === 'high' ? '高风险' : selectedAsset.riskLevel === 'medium' ? '中风险' : '低风险'}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  编辑资产
                </button>
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                  删除资产
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}