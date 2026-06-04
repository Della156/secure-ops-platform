'use client';

import { useState } from 'react';
import { Database, Plus, Search, Filter, Edit3, Trash2, Folder } from 'lucide-react';

const mockAssets = [
  { id: 'data-001', name: '用户数据库', type: 'database', size: '1.2 GB', status: 'active', lastUpdated: '2024-01-15' },
  { id: 'data-002', name: '日志存储', type: 'storage', size: '50 GB', status: 'active', lastUpdated: '2024-01-14' },
  { id: 'data-003', name: '备份数据', type: 'backup', size: '10 GB', status: 'active', lastUpdated: '2024-01-13' },
  { id: 'data-004', name: '配置文件', type: 'file', size: '500 MB', status: 'active', lastUpdated: '2024-01-15' },
  { id: 'data-005', name: '历史数据', type: 'archive', size: '100 GB', status: 'archived', lastUpdated: '2024-01-10' },
];

const getTypeText = (type: string) => {
  switch (type) {
    case 'database': return '数据库';
    case 'storage': return '存储';
    case 'backup': return '备份';
    case 'file': return '文件';
    case 'archive': return '归档';
    default: return '其他';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'archived': return 'bg-gray-500';
    case 'locked': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export function DataAssetManagementView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);

  const filteredAssets = mockAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockAssets.length,
    active: mockAssets.filter(a => a.status === 'active').length,
    archived: mockAssets.filter(a => a.status === 'archived').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">数据资产管理</h1>
          <p className="text-slate-400 mt-1">管理和监控数据资产</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <Plus className="w-4 h-4" />新增数据资产
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">资产总数</span>
            <Database className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">活跃资产</span>
            <Database className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.active}</div>
        </div>
        <div className="bg-[#20293F] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">已归档</span>
            <Folder className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-400 mt-2">{stats.archived}</div>
        </div>
        <div className="bg-[#20293F] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">总容量</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">161.7 GB</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索数据资产..."
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
                <th className="text-left px-4 py-2.5">容量</th>
                <th className="text-left px-4 py-2.5">状态</th>
                <th className="text-left px-4 py-2.5">更新时间</th>
                <th className="text-right px-4 py-2.5">操作</th>
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
                  <td className="px-4 py-3 text-slate-400">{getTypeText(asset.type)}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.size}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(asset.status)}`} />
                      <span className={`text-xs ${asset.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                        {asset.status === 'active' ? '活跃' : '已归档'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{asset.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-400" />
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
                  <p className="text-xs text-slate-500">容量大小</p>
                  <p className="text-slate-300 font-mono">{selectedAsset.size}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">当前状态</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedAsset.status)}`} />
                    <span className={`${selectedAsset.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                      {selectedAsset.status === 'active' ? '活跃' : '已归档'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">最后更新时间</p>
                  <p className="text-slate-300">{selectedAsset.lastUpdated}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  编辑资产
                </button>
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                  下载资产
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}