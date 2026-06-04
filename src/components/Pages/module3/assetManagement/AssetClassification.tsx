'use client';

import { useState } from 'react';
import { Server, Database, Laptop, Router, Shield, BarChart3 } from 'lucide-react';

const mockCategories = [
  { id: 'server', name: '服务器', count: 45, icon: Server, color: 'bg-blue-500' },
  { id: 'database', name: '数据库', count: 12, icon: Database, color: 'bg-purple-500' },
  { id: 'terminal', name: '终端设备', count: 256, icon: Laptop, color: 'bg-green-500' },
  { id: 'network', name: '网络设备', count: 38, icon: Router, color: 'bg-orange-500' },
];

const mockAssetsByCategory = {
  server: [
    { name: 'Web服务器-01', ip: '192.168.1.10', status: 'normal' },
    { name: 'Web服务器-02', ip: '192.168.1.11', status: 'warning' },
    { name: '应用服务器-01', ip: '192.168.1.12', status: 'normal' },
  ],
  database: [
    { name: 'MySQL主库', ip: '192.168.1.20', status: 'normal' },
    { name: 'MySQL从库', ip: '192.168.1.21', status: 'normal' },
    { name: 'Redis缓存', ip: '192.168.1.22', status: 'warning' },
  ],
  terminal: [
    { name: 'PC-001', ip: '192.168.2.101', status: 'normal' },
    { name: 'PC-002', ip: '192.168.2.102', status: 'normal' },
    { name: 'PC-003', ip: '192.168.2.103', status: 'critical' },
  ],
  network: [
    { name: '防火墙-01', ip: '192.168.1.1', status: 'normal' },
    { name: '交换机-01', ip: '192.168.1.2', status: 'normal' },
    { name: '路由器-01', ip: '192.168.1.3', status: 'normal' },
  ],
};

export function AssetClassification() {
  const [selectedCategory, setSelectedCategory] = useState('server');

  const stats = {
    totalAssets: Object.values(mockAssetsByCategory).reduce((sum, arr) => sum + arr.length, 0),
    normalCount: Object.values(mockAssetsByCategory).flat().filter(a => a.status === 'normal').length,
    warningCount: Object.values(mockAssetsByCategory).flat().filter(a => a.status === 'warning').length,
    criticalCount: Object.values(mockAssetsByCategory).flat().filter(a => a.status === 'critical').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">资产分类管理</h1>
          <p className="text-slate-400 mt-1">按类别管理和查看资产</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">资产总数</span>
            <BarChart3 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.totalAssets}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">运行正常</span>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.normalCount}</div>
        </div>
        <div className="bg-[#20293F] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">存在告警</span>
            <Shield className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.warningCount}</div>
        </div>
        <div className="bg-[#20293F] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">严重异常</span>
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2">{stats.criticalCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">资产分类</h3>
          <div className="space-y-2">
            {mockCategories.map(category => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedCategory === category.id 
                      ? 'bg-blue-500/20 ring-1 ring-blue-500/40' 
                      : 'bg-[#20293F] hover:bg-[#111625]/50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={`w-10 h-10 rounded-lg ${category.color}/20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${category.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{category.name}</p>
                    <p className="text-slate-500 text-xs">{category.count} 台</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">
            {mockCategories.find(c => c.id === selectedCategory)?.name}列表
          </h3>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#111625] text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-4 py-2.5">资产名称</th>
                  <th className="text-left px-4 py-2.5">IP地址</th>
                  <th className="text-left px-4 py-2.5">状态</th>
                </tr>
              </thead>
              <tbody>
                {mockAssetsByCategory[selectedCategory as keyof typeof mockAssetsByCategory].map((asset, index) => (
                  <tr key={index} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-white font-medium">{asset.name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{asset.ip}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        asset.status === 'normal' ? 'bg-green-500/20 text-green-400' :
                        asset.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {asset.status === 'normal' ? '正常' : asset.status === 'warning' ? '警告' : '严重'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}