'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Network, Server, Database, Building2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EvalTask {
  id: string;
  name: string;
  assetCount: number;
  businessCount: number;
  maxImpactLevel: 'critical' | 'high' | 'medium' | 'low';
  status: 'completed' | 'running' | 'pending';
}

interface Asset {
  id: string;
  name: string;
  type: 'core' | 'important' | 'general';
  category: 'server' | 'database' | 'network' | 'application';
}

const mockTasks: EvalTask[] = [
  { id: 'EVAL-001', name: 'DDoS攻击影响评估', assetCount: 24, businessCount: 8, maxImpactLevel: 'critical', status: 'completed' },
  { id: 'EVAL-002', name: '数据泄露影响评估', assetCount: 15, businessCount: 5, maxImpactLevel: 'high', status: 'completed' },
  { id: 'EVAL-003', name: '异常登录影响评估', assetCount: 8, businessCount: 3, maxImpactLevel: 'medium', status: 'running' },
];

const mockAssets: Asset[] = [
  { id: 'AST-001', name: '核心数据库-主库', type: 'core', category: 'database' },
  { id: 'AST-002', name: '核心数据库-备库', type: 'core', category: 'database' },
  { id: 'AST-003', name: '应用服务器-01', type: 'important', category: 'server' },
  { id: 'AST-004', name: '应用服务器-02', type: 'important', category: 'server' },
  { id: 'AST-005', name: '边界防火墙', type: 'core', category: 'network' },
  { id: 'AST-006', name: '负载均衡器', type: 'important', category: 'network' },
];

const businessImpactData = [
  { name: '财务系统', value: 100, color: '#EF4444' },
  { name: 'OA系统', value: 75, color: '#F59E0B' },
  { name: '邮件系统', value: 60, color: '#3B82F6' },
  { name: 'ERP系统', value: 85, color: '#8B5CF6' },
];

const assetTypeData = [
  { name: '服务器', value: 45 },
  { name: '数据库', value: 30 },
  { name: '网络设备', value: 15 },
  { name: '应用', value: 10 },
];

export function ImpactRangeEval() {
  const [tasks] = useState(mockTasks);
  const [assets] = useState(mockAssets);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getImpactText = (level: string) => {
    switch (level) {
      case 'critical': return '严重';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return level;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'server': return <Server className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core': return 'text-red-400';
      case 'important': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'core': return '核心';
      case 'important': return '重要';
      default: return '一般';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">影响范围自动评估</h2>
        <p className="text-sm text-gray-400 mt-1">资产关联分析、影响范围可视化、评估报告导出</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">受影响资产数</span>
          </div>
          <p className="text-2xl font-semibold text-white">47</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">受影响业务数</span>
          </div>
          <p className="text-2xl font-semibold text-green-400">16</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-gray-400 text-sm">最高影响等级</span>
          </div>
          <p className="text-2xl font-semibold text-red-400">严重</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">评估任务数</span>
          </div>
          <p className="text-2xl font-semibold text-white">3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">业务影响程度</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip />
                <Bar dataKey="value">
                  {businessImpactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">资产类型分布</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetTypeData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {assetTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-medium text-gray-300">评估任务列表</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="搜索任务..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm w-48"
                />
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">关联资产数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">影响业务数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最高影响等级</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{task.assetCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{task.businessCount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs border ${getImpactColor(task.maxImpactLevel)}`}>
                      {getImpactText(task.maxImpactLevel)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded text-blue-400 transition-colors" title="查看详情">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">受影响资产树</h3>
          <div className="space-y-2">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-[#111827] rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400">{getCategoryIcon(asset.category)}</span>
                  <div>
                    <span className="text-white text-sm">{asset.name}</span>
                    <div className="text-xs text-gray-500">{asset.category}</div>
                  </div>
                </div>
                <span className={`text-xs font-medium ${getTypeColor(asset.type)}`}>
                  {getTypeText(asset.type)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}