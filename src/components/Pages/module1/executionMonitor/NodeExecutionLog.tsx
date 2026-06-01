'use client';

import React, { useState } from 'react';
import { ChevronRight, Terminal, Code, FileText, ArrowRight, CheckCircle2, XCircle, Clock, Copy } from 'lucide-react';

interface ExecutionNode {
  id: string;
  name: string;
  type: 'task' | 'condition' | 'parallel' | 'loop';
  status: 'success' | 'failed' | 'running' | 'pending';
  startTime: string;
  endTime: string | null;
  duration: string;
  input: Record<string, any>;
  output: Record<string, any>;
  logs: LogEntry[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

const mockNodes: ExecutionNode[] = [
  {
    id: 'node-001',
    name: '初始化环境',
    type: 'task',
    status: 'success',
    startTime: '10:30:00',
    endTime: '10:30:05',
    duration: '5s',
    input: { environment: 'production', timeout: 300 },
    output: { status: 'ready', nodeId: 'env-123' },
    logs: [
      { id: 'log-001', timestamp: '10:30:00', level: 'info', message: '开始初始化环境' },
      { id: 'log-002', timestamp: '10:30:02', level: 'info', message: '加载配置文件' },
      { id: 'log-003', timestamp: '10:30:05', level: 'success', message: '环境初始化完成' },
    ],
  },
  {
    id: 'node-002',
    name: '连接防火墙',
    type: 'task',
    status: 'success',
    startTime: '10:30:05',
    endTime: '10:30:12',
    duration: '7s',
    input: { host: '192.168.1.1', port: 22 },
    output: { connectionId: 'conn-456', status: 'connected' },
    logs: [
      { id: 'log-004', timestamp: '10:30:05', level: 'info', message: '正在连接 192.168.1.1:22' },
      { id: 'log-005', timestamp: '10:30:08', level: 'success', message: 'SSH 连接建立成功' },
      { id: 'log-006', timestamp: '10:30:10', level: 'info', message: '认证成功' },
      { id: 'log-007', timestamp: '10:30:12', level: 'success', message: '防火墙连接就绪' },
    ],
  },
  {
    id: 'node-003',
    name: '获取当前配置',
    type: 'task',
    status: 'running',
    startTime: '10:30:12',
    endTime: null,
    duration: '15s',
    input: { format: 'json', includeDefaults: false },
    output: {},
    logs: [
      { id: 'log-008', timestamp: '10:30:12', level: 'info', message: '正在获取配置...' },
      { id: 'log-009', timestamp: '10:30:18', level: 'info', message: '已下载 2.5MB 数据' },
      { id: 'log-010', timestamp: '10:30:25', level: 'info', message: '正在解析配置...' },
    ],
  },
  {
    id: 'node-004',
    name: '验证配置变更',
    type: 'condition',
    status: 'pending',
    startTime: '-',
    endTime: null,
    duration: '-',
    input: {},
    output: {},
    logs: [],
  },
  {
    id: 'node-005',
    name: '应用新配置',
    type: 'task',
    status: 'pending',
    startTime: '-',
    endTime: null,
    duration: '-',
    input: {},
    output: {},
    logs: [],
  },
];

export function NodeExecutionLog() {
  const [selectedNode, setSelectedNode] = useState<ExecutionNode>(mockNodes[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'input' | 'output' | 'logs'>('logs');

  const getStatusConfig = (status: string) => {
    const configs = {
      success: { label: '成功', color: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30', icon: CheckCircle2 },
      failed: { label: '失败', color: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30', icon: XCircle },
      running: { label: '运行中', color: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30', icon: Clock },
      pending: { label: '等待', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Clock },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'task': return FileText;
      case 'condition': return Code;
      case 'parallel': return ArrowRight;
      case 'loop': return ArrowRight;
      default: return FileText;
    }
  };

  const getLogLevelColor = (level: string) => {
    const colors = {
      info: 'text-[#0066FF]',
      warn: 'text-[#FF9100]',
      error: 'text-[#FF3B30]',
      success: 'text-[#00C853]',
    };
    return colors[level as keyof typeof colors] || 'text-[#9CA3AF]';
  };

  const getLogLevelBg = (level: string) => {
    const colors = {
      info: 'bg-[#0066FF]/10',
      warn: 'bg-[#FF9100]/10',
      error: 'bg-[#FF3B30]/10',
      success: 'bg-[#00C853]/10',
    };
    return colors[level as keyof typeof colors] || 'bg-[#181F32]';
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务节点执行日志查看</h1>
        <p className="text-[#9CA3AF]">查看任务节点的执行详情、输入输出和日志信息</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] bg-[#181F32]/50">
              <h3 className="text-sm font-semibold text-[#F3F4F6]">执行链</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {mockNodes.map((node, index) => {
                  const statusConfig = getStatusConfig(node.status);
                  const Icon = getNodeIcon(node.type);
                  const StatusIcon = statusConfig.icon;
                  const isSelected = selectedNode.id === node.id;
                  const isLast = index === mockNodes.length - 1;

                  return (
                    <div key={node.id} className="relative">
                      <div
                        onClick={() => setSelectedNode(node)}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#0066FF]/10 border border-blue-500/30' : 'bg-[#181F32]/50 border border-transparent hover:bg-[#181F32]'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            node.status === 'success' ? 'bg-[#00C853]/20 text-[#00C853]' :
                            node.status === 'failed' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                            node.status === 'running' ? 'bg-[#0066FF]/20 text-[#0066FF]' :
                            'bg-[#2A354D] text-[#6B7280]'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#F3F4F6] truncate">{node.name}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-xs border ${statusConfig.color}`}>{statusConfig.label}</span>
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            {node.startTime !== '-' ? `${node.startTime} · ${node.duration}` : '等待执行'}
                          </div>
                        </div>
                      </div>
                      {!isLast && (
                        <div className="absolute left-7 top-10 bottom-0 w-0.5 bg-[#2A354D]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] bg-[#181F32]/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#F3F4F6]">{selectedNode.name}</h3>
                  <p className="text-sm text-[#6B7280]">节点 ID: {selectedNode.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const statusConfig = getStatusConfig(selectedNode.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="border-b border-[#2A354D]">
              <div className="flex">
                {[
                  { id: 'overview', label: '概览', icon: FileText },
                  { id: 'input', label: '输入', icon: Code },
                  { id: 'output', label: '输出', icon: Code },
                  { id: 'logs', label: '日志', icon: Terminal },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id ? 'text-[#0066FF] border-b-2 border-blue-500' : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#181F32]/50 rounded-lg p-4">
                      <div className="text-sm text-[#9CA3AF] mb-1">节点类型</div>
                      <div className="text-[#F3F4F6] font-medium">{selectedNode.type === 'task' ? '任务' : selectedNode.type === 'condition' ? '条件' : selectedNode.type === 'parallel' ? '并行' : '循环'}</div>
                    </div>
                    <div className="bg-[#181F32]/50 rounded-lg p-4">
                      <div className="text-sm text-[#9CA3AF] mb-1">开始时间</div>
                      <div className="text-[#F3F4F6] font-medium">{selectedNode.startTime}</div>
                    </div>
                    <div className="bg-[#181F32]/50 rounded-lg p-4">
                      <div className="text-sm text-[#9CA3AF] mb-1">结束时间</div>
                      <div className="text-[#F3F4F6] font-medium">{selectedNode.endTime || '-'}</div>
                    </div>
                    <div className="bg-[#181F32]/50 rounded-lg p-4">
                      <div className="text-sm text-[#9CA3AF] mb-1">执行时长</div>
                      <div className="text-[#F3F4F6] font-medium">{selectedNode.duration}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'input' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#D1D5DB]">输入参数</h4>
                    <button
                      onClick={() => handleCopy(JSON.stringify(selectedNode.input, null, 2))}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-xs transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      复制
                    </button>
                  </div>
                  <pre className="bg-[#111625] border border-[#2A354D] rounded-lg p-4 overflow-x-auto text-sm font-mono text-[#D1D5DB]">
                    {JSON.stringify(selectedNode.input, null, 2)}
                  </pre>
                </div>
              )}

              {activeTab === 'output' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#D1D5DB]">输出结果</h4>
                    <button
                      onClick={() => handleCopy(JSON.stringify(selectedNode.output, null, 2))}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-xs transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      复制
                    </button>
                  </div>
                  <pre className="bg-[#111625] border border-[#2A354D] rounded-lg p-4 overflow-x-auto text-sm font-mono text-[#D1D5DB]">
                    {JSON.stringify(selectedNode.output, null, 2) || '暂无输出'}
                  </pre>
                </div>
              )}

              {activeTab === 'logs' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#D1D5DB]">执行日志</h4>
                    <div className="text-xs text-[#6B7280]">{selectedNode.logs.length} 条日志</div>
                  </div>
                  <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
                    {selectedNode.logs.length > 0 ? (
                      <div className="space-y-1">
                        {selectedNode.logs.map(log => (
                          <div key={log.id} className={`flex items-start gap-3 px-2 py-1.5 rounded ${getLogLevelBg(log.level)}`}>
                            <span className="text-[#6B7280] flex-shrink-0">[{log.timestamp}]</span>
                            <span className={`flex-shrink-0 font-medium ${getLogLevelColor(log.level)}`}>{log.level.toUpperCase()}</span>
                            <span className="text-[#D1D5DB]">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[#6B7280]">
                        暂无日志
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
