'use client';

import { useState } from 'react';
import { Server, Database, Laptop, Router, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

const mockAssets = [
  { id: 'asset-001', name: 'Web服务器-01', type: 'server', status: 'normal', riskLevel: 'low', lastCheck: '2分钟前' },
  { id: 'asset-002', name: '数据库-01', type: 'database', status: 'warning', riskLevel: 'medium', lastCheck: '5分钟前' },
  { id: 'asset-003', name: '终端PC-001', type: 'terminal', status: 'normal', riskLevel: 'low', lastCheck: '1分钟前' },
  { id: 'asset-004', name: '防火墙-01', type: 'network', status: 'normal', riskLevel: 'low', lastCheck: '3分钟前' },
  { id: 'asset-005', name: 'Web服务器-02', type: 'server', status: 'critical', riskLevel: 'high', lastCheck: '刚刚' },
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

const getStatusText = (status: string) => {
  switch (status) {
    case 'normal': return '正常';
    case 'warning': return '警告';
    case 'critical': return '严重';
    default: return '未知';
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

export function AssetStatusDashboard() {
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);

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
          <h1 className="text-2xl font-bold text-slate-50">资产状态大屏</h1>
          <p className="text-slate-400 mt-1">实时监控资产健康状态，保障业务稳定运行</p>
        </div>
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
            <CheckCircle2 className="w-4 h-4 text-green-400" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">资产名称</th>
                <th className="text-left px-4 py-2.5">类型</th>
                <th className="text-left px-4 py-2.5">状态</th>
                <th className="text-left px-4 py-2.5">风险等级</th>
                <th className="text-left px-4 py-2.5">最后检查</th>
              </tr>
            </thead>
            <tbody>
              {mockAssets.map(asset => (
                <tr 
                  key={asset.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedAsset.id === asset.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <td className="px-4 py-3 text-white font-medium">{asset.name}</td>
                  <td className="px-4 py-3 text-slate-400">{getTypeText(asset.type)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(asset.status)} ${asset.status === 'critical' ? 'animate-pulse' : ''}`} />
                      <span className={`text-xs ${
                        asset.status === 'normal' ? 'text-green-400' :
                        asset.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {getStatusText(asset.status)}
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
                  <td className="px-4 py-3 text-slate-500 text-xs">{asset.lastCheck}</td>
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
                <div className={`w-10 h-10 rounded-lg ${
                  selectedAsset.status === 'normal' ? 'bg-green-500/20' :
                  selectedAsset.status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                } flex items-center justify-center`}>
                  {getTypeIcon(selectedAsset.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedAsset.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    selectedAsset.status === 'normal' ? 'bg-green-500/20 text-green-400' :
                    selectedAsset.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {getStatusText(selectedAsset.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">资产类型</p>
                  <p className="text-slate-300">{getTypeText(selectedAsset.type)}</p>
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
                <div>
                  <p className="text-xs text-slate-500">最后检查时间</p>
                  <p className="text-slate-300">{selectedAsset.lastCheck}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">资产ID</p>
                  <p className="text-slate-300 font-mono text-sm">{selectedAsset.id}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  查看详情
                </button>
                {selectedAsset.status !== 'normal' && (
                  <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                    处理告警
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}