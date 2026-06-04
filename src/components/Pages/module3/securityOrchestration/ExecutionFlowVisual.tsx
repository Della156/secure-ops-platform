'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, X, CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react';

const mockFlow = {
  id: 'FLOW-001',
  name: '安全编排流程 A',
  status: 'running',
  startTime: '2024-01-15 10:00:00',
  duration: '15分钟',
  nodes: [
    { id: 'N1', name: '触发条件检测', status: 'completed', type: 'start', duration: '2秒' },
    { id: 'N2', name: '告警数据聚合', status: 'completed', type: 'process', duration: '15秒' },
    { id: 'N3', name: '威胁等级评估', status: 'completed', type: 'process', duration: '8秒' },
    { id: 'N4', name: '资产关联分析', status: 'running', type: 'process', duration: '3分钟', progress: 65 },
    { id: 'N5', name: '决策策略匹配', status: 'pending', type: 'process', duration: '-' },
    { id: 'N6', name: '处置动作执行', status: 'pending', type: 'action', duration: '-' },
    { id: 'N7', name: '结果反馈记录', status: 'pending', type: 'end', duration: '-' },
  ],
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'start': return <Play className="w-4 h-4" />;
    case 'end': return <CheckCircle2 className="w-4 h-4" />;
    case 'action': return <AlertCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/40';
    case 'running': return 'text-blue-400 bg-blue-500/20 border-blue-500/40';
    case 'pending': return 'text-slate-500 bg-slate-500/20 border-slate-500/40';
    default: return 'text-slate-400 bg-slate-500/20 border-slate-500/40';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-4 h-4" />;
    case 'running': return <Clock className="w-4 h-4 animate-pulse" />;
    case 'pending': return <Clock className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export function ExecutionFlowVisual() {
  const [flow] = useState(mockFlow);
  const [selectedNode, setSelectedNode] = useState(flow.nodes[3]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">执行流程可视化</h1>
          <p className="text-slate-400 mt-1">实时展示编排流程的执行状态和节点详情</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Pause className="w-3.5 h-3.5" />暂停
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <RotateCcw className="w-3.5 h-3.5" />重试
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md">
            <X className="w-3.5 h-3.5" />终止
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{flow.name}</h3>
                <p className="text-xs text-slate-500 mt-1">流程ID: {flow.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500">开始时间</p>
                  <p className="text-sm text-slate-300">{flow.startTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">运行时长</p>
                  <p className="text-sm text-blue-400">{flow.duration}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 border rounded text-xs bg-blue-500/20 text-blue-400 border-blue-500/40`}>
                  <Clock className="w-3.5 h-3.5 animate-pulse" />运行中
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[38px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-slate-500" />
              <div className="space-y-4">
                {flow.nodes.map((node, index) => (
                  <div 
                    key={node.id}
                    className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedNode.id === node.id 
                        ? 'bg-blue-500/20 ring-1 ring-blue-500/40' 
                        : 'hover:bg-[#111625]/50'
                    }`}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className={`relative z-10 w-19 h-19 rounded-lg border flex items-center justify-center ${getStatusColor(node.status)}`}>
                      {getStatusIcon(node.status)}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{node.name}</span>
                        <span className="text-xs text-slate-500">{node.type === 'start' ? '开始' : node.type === 'end' ? '结束' : node.type === 'action' ? '动作' : '处理'}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">节点ID: {node.id}</span>
                        <span className="text-xs text-slate-500">耗时: {node.duration}</span>
                      </div>
                      {node.status === 'running' && node.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">执行进度</span>
                            <span className="text-blue-400">{node.progress}%</span>
                          </div>
                          <div className="h-1 bg-[#111625] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${node.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {index < flow.nodes.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-slate-600 mt-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">节点详情</h3>
          {selectedNode && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getStatusColor(selectedNode.status)}`}>
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedNode.name}</p>
                  <p className="text-xs text-slate-500">{selectedNode.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">节点类型</p>
                  <p className="text-slate-300 text-sm">
                    {selectedNode.type === 'start' ? '开始节点' : selectedNode.type === 'end' ? '结束节点' : selectedNode.type === 'action' ? '动作节点' : '处理节点'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">执行状态</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs ${getStatusColor(selectedNode.status)}`}>
                    {getStatusIcon(selectedNode.status)}
                    {selectedNode.status === 'completed' ? '已完成' : selectedNode.status === 'running' ? '执行中' : '等待中'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">耗时</p>
                  <p className="text-slate-300 text-sm">{selectedNode.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">进度</p>
                  <p className="text-slate-300 text-sm">{selectedNode.progress !== undefined ? `${selectedNode.progress}%` : '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">执行日志</p>
                <div className="bg-[#111625] rounded-lg p-3 text-xs text-slate-400 font-mono max-h-40 overflow-y-auto">
                  {selectedNode.status === 'running' ? (
                    <div>
                      <p>[10:15:02] 节点开始执行</p>
                      <p>[10:15:03] 正在处理资产数据...</p>
                      <p>[10:15:05] 已关联 12 个资产</p>
                      <p>[10:15:08] 分析影响范围中...</p>
                    </div>
                  ) : selectedNode.status === 'completed' ? (
                    <div>
                      <p>[10:00:05] 节点开始执行</p>
                      <p>[10:00:08] 执行完成</p>
                      <p>[10:00:08] 输出: 威胁等级=高</p>
                    </div>
                  ) : (
                    <p>等待执行...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}