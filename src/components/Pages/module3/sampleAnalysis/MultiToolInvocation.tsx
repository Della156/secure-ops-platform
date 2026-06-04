'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, Plus, Eye, Settings, Play, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const toolchains = [
  {
    id: 'TC-001',
    name: '恶意软件深度分析链',
    tools: ['静态分析', '动态分析', '沙箱检测', '反病毒引擎'],
    toolStatus: ['completed', 'completed', 'completed', 'completed'],
    totalTime: '00:25:30',
    status: 'completed',
  },
  {
    id: 'TC-002',
    name: '勒索软件检测链',
    tools: ['静态分析', '动态分析', '沙箱检测', '反病毒引擎'],
    toolStatus: ['completed', 'completed', 'running', 'pending'],
    totalTime: '00:15:20',
    status: 'running',
  },
  {
    id: 'TC-003',
    name: '可疑文件快速检测',
    tools: ['静态分析', '反病毒引擎'],
    toolStatus: ['completed', 'failed'],
    totalTime: '00:05:10',
    status: 'failed',
  },
];

const tools = ['静态分析', '动态分析', '沙箱检测', '反病毒引擎', '行为分析', '内存取证'];

const toolStatusConfig = {
  pending: { icon: <Clock className="w-3 h-3" />, color: 'text-slate-500' },
  running: { icon: <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />, color: 'text-blue-400' },
  completed: { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-green-400' },
  failed: { icon: <XCircle className="w-3 h-3" />, color: 'text-red-400' },
};

export function MultiToolInvocation() {
  const [search, setSearch] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newChain, setNewChain] = useState({ name: '', tools: [], timeout: '30', failureStrategy: 'skip' });

  const filtered = toolchains.filter(t => t.name.includes(search) || t.id.includes(search));

  const handleAddTool = (tool: string) => {
    if (!newChain.tools.includes(tool)) {
      setNewChain(prev => ({ ...prev, tools: [...prev.tools, tool] }));
    }
  };

  const handleRemoveTool = (tool: string) => {
    setNewChain(prev => ({ ...prev, tools: prev.tools.filter(t => t !== tool) }));
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="多类型分析工具调用" description="管理和配置分析工具调用链"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="config" onClick={() => setShowConfigModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Settings className="w-4 h-4" /> 配置调用链
          </button>,
        ]}
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text" placeholder="搜索调用链名称..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#20293F] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filtered.map(chain => (
          <div key={chain.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-blue-400">{chain.id}</span>
                <span className="text-sm text-white font-medium">{chain.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  chain.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  chain.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {chain.status === 'completed' ? '已完成' : chain.status === 'running' ? '运行中' : '失败'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">总耗时: {chain.totalTime}</span>
                <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                  <Eye className="w-3 h-3" />详情
                </button>
                <button className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                  <Play className="w-3 h-3" />运行
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                {chain.tools.map((tool, index) => {
                  const status = chain.toolStatus[index];
                  const config = toolStatusConfig[status as keyof typeof toolStatusConfig];
                  return (
                    <div key={tool} className="flex items-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111625] rounded-md">
                        <span className={config.color}>{config.icon}</span>
                        <span className="text-xs text-white">{tool}</span>
                      </div>
                      {index < chain.tools.length - 1 && (
                        <svg className="w-4 h-4 text-slate-600 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">配置调用链</h3>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">链名称</label>
                <input
                  type="text" value={newChain.name} onChange={e => setNewChain(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  placeholder="输入调用链名称"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">工具选择（拖拽排序）</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tools.map(tool => (
                    <button
                      key={tool} onClick={() => newChain.tools.includes(tool) ? handleRemoveTool(tool) : handleAddTool(tool)}
                      className={`px-3 py-1.5 text-xs rounded-md transition ${
                        newChain.tools.includes(tool)
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#111625] text-slate-400 border border-[#2A354D] hover:border-blue-500'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                {newChain.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newChain.tools.map((tool, index) => (
                      <div key={`${tool}-${index}`} className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        <Plus className="w-3 h-3" />
                        {index + 1}. {tool}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">超时设置（分钟）</label>
                  <input
                    type="number" value={newChain.timeout} onChange={e => setNewChain(prev => ({ ...prev, timeout: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">失败策略</label>
                  <select
                    value={newChain.failureStrategy} onChange={e => setNewChain(prev => ({ ...prev, failureStrategy: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                  >
                    <option value="skip">跳过继续</option>
                    <option value="stop">终止链</option>
                    <option value="retry">重试3次</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#2A354D]">
              <button onClick={() => setShowConfigModal(false)} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-md">
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiToolInvocation;
