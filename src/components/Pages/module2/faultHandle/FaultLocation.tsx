'use client';

import React, { useState } from 'react';
import { Search, MapPin, Server, Network, Database, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ComponentNode {
  id: string;
  name: string;
  type: 'server' | 'network' | 'database' | 'service';
  status: 'normal' | 'warning' | 'error';
  latency: number;
  error?: string;
}

const mockNodes: ComponentNode[] = [
  { id: 'node-1', name: 'prod-db', type: 'database', status: 'error', latency: 1500, error: '连接超时' },
  { id: 'node-2', name: 'app-01', type: 'server', status: 'warning', latency: 200 },
  { id: 'node-3', name: 'app-02', type: 'server', status: 'normal', latency: 50 },
  { id: 'node-4', name: 'fw-01', type: 'network', status: 'normal', latency: 10 },
  { id: 'node-5', name: 'lb-01', type: 'network', status: 'normal', latency: 5 },
  { id: 'node-6', name: 'redis-01', type: 'service', status: 'normal', latency: 2 },
];

export function FaultLocation() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);

  const filteredNodes = mockNodes.filter(item =>
    !searchKeyword || item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    if (status === 'error') return <AlertCircle className="w-5 h-5 text-red-400" />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'server') return <Server className="w-4 h-4" />;
    if (type === 'network') return <Network className="w-4 h-4" />;
    if (type === 'database') return <Database className="w-4 h-4" />;
    return <Server className="w-4 h-4" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">故障定位分析</h2>
        <p className="text-sm text-gray-400 mt-1">故障影响范围定位、链路追踪、日志分析</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">系统拓扑图</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索节点..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-sm"
              />
            </div>
          </div>

          <div className="relative h-64 bg-[#111827] rounded-lg p-4">
            <div 
              className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setSelectedNode(mockNodes[4])}
            >
              <div className={`p-3 rounded-full ${mockNodes[4].status === 'error' ? 'bg-red-500/20' : mockNodes[4].status === 'warning' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                {getStatusIcon(mockNodes[4].status)}
              </div>
              <span className="text-xs text-gray-400 mt-2">{mockNodes[4].name}</span>
            </div>

            <div 
              className="absolute top-1/2 left-4 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setSelectedNode(mockNodes[3])}
            >
              <div className={`p-3 rounded-full ${mockNodes[3].status === 'error' ? 'bg-red-500/20' : mockNodes[3].status === 'warning' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                {getStatusIcon(mockNodes[3].status)}
              </div>
              <span className="text-xs text-gray-400 mt-2">{mockNodes[3].name}</span>
            </div>

            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setSelectedNode(mockNodes[0])}
            >
              <div className={`p-3 rounded-full ${mockNodes[0].status === 'error' ? 'bg-red-500/20' : mockNodes[0].status === 'warning' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                {getStatusIcon(mockNodes[0].status)}
              </div>
              <span className="text-xs text-gray-400 mt-2">{mockNodes[0].name}</span>
            </div>

            <div 
              className="absolute bottom-8 left-1/4 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setSelectedNode(mockNodes[1])}
            >
              <div className={`p-3 rounded-full ${mockNodes[1].status === 'error' ? 'bg-red-500/20' : mockNodes[1].status === 'warning' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                {getStatusIcon(mockNodes[1].status)}
              </div>
              <span className="text-xs text-gray-400 mt-2">{mockNodes[1].name}</span>
            </div>

            <div 
              className="absolute bottom-8 right-1/4 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setSelectedNode(mockNodes[2])}
            >
              <div className={`p-3 rounded-full ${mockNodes[2].status === 'error' ? 'bg-red-500/20' : mockNodes[2].status === 'warning' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                {getStatusIcon(mockNodes[2].status)}
              </div>
              <span className="text-xs text-gray-400 mt-2">{mockNodes[2].name}</span>
            </div>

            <div 
              className="absolute bottom-8 right-4 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setSelectedNode(mockNodes[5])}
            >
              <div className={`p-3 rounded-full ${mockNodes[5].status === 'error' ? 'bg-red-500/20' : mockNodes[5].status === 'warning' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                {getStatusIcon(mockNodes[5].status)}
              </div>
              <span className="text-xs text-gray-400 mt-2">{mockNodes[5].name}</span>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="12%" x2="50%" y2="35%" stroke="#3B82F6" strokeWidth="2" />
              <line x1="50%" y1="35%" x2="15%" y2="50%" stroke="#3B82F6" strokeWidth="2" />
              <line x1="50%" y1="35%" x2="50%" y2="50%" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#F59E0B" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#10B981" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="90%" y2="75%" stroke="#10B981" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">节点详情</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(selectedNode.type)}
                <span className="text-white font-medium">{selectedNode.name}</span>
                {getStatusIcon(selectedNode.status)}
              </div>
              <div className="bg-[#111827] rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">状态</span>
                  <span className={`text-xs ${selectedNode.status === 'error' ? 'text-red-400' : selectedNode.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {selectedNode.status === 'error' ? '异常' : selectedNode.status === 'warning' ? '警告' : '正常'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">延迟</span>
                  <span className="text-xs text-gray-300">{selectedNode.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">类型</span>
                  <span className="text-xs text-gray-300">{selectedNode.type}</span>
                </div>
              </div>
              {selectedNode.error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">错误信息</span>
                  </div>
                  <p className="text-sm text-red-300 mt-1">{selectedNode.error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <MapPin className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">点击节点查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}