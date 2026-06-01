'use client';

import React, { useState } from 'react';
import { Plus, Save, Play, Trash2, Copy, ChevronRight, Circle, Square, GitBranch, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'start' | 'action' | 'condition' | 'end';
  label: string;
  x: number;
  y: number;
}

interface FlowEdge {
  from: string;
  to: string;
}

const initialNodes: FlowNode[] = [
  { id: 'start', type: 'start', label: '开始', x: 400, y: 50 },
  { id: 'action1', type: 'action', label: '获取防火墙配置', x: 350, y: 150 },
  { id: 'condition1', type: 'condition', label: '配置变更检测', x: 350, y: 270 },
  { id: 'action2', type: 'action', label: '同步配置', x: 200, y: 390 },
  { id: 'action3', type: 'action', label: '发送告警通知', x: 500, y: 390 },
  { id: 'end', type: 'end', label: '结束', x: 400, y: 510 },
];

const initialEdges: FlowEdge[] = [
  { from: 'start', to: 'action1' },
  { from: 'action1', to: 'condition1' },
  { from: 'condition1', to: 'action2' },
  { from: 'condition1', to: 'action3' },
  { from: 'action2', to: 'end' },
  { from: 'action3', to: 'end' },
];

export function FlowOrchestration() {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges] = useState<FlowEdge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getNodeColor = (type: string) => {
    const colors = {
      start: 'bg-[#00C853]',
      action: 'bg-[#0066FF]',
      condition: 'bg-[#FF9100]',
      end: 'bg-[#FF3B30]',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getNodeIcon = (type: string) => {
    const icons = {
      start: <Play className="w-5 h-5" />,
      action: <Circle className="w-5 h-5" />,
      condition: <GitBranch className="w-5 h-5" />,
      end: <Square className="w-5 h-5" />,
    };
    return icons[type as keyof typeof icons];
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(nodeId);
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedNode) {
      setNodes(prevNodes => prevNodes.map(node => {
        if (node.id === selectedNode) {
          return {
            ...node,
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
          };
        }
        return node;
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedNode(null);
  };

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">流程编排器</h1>
          <p className="text-[#9CA3AF]">可视化编排自动化工作流程</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
            <Copy className="w-4 h-4" />
            复制流程
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            保存流程
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
            <Play className="w-4 h-4" />
            运行流程
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="w-64 bg-[#20293F] border border-[#2A354D] rounded-xl p-4 flex-shrink-0">
          <h3 className="text-sm font-medium text-[#D1D5DB] mb-4">节点类型</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#181F32] rounded-lg cursor-pointer hover:bg-[#2A354D] transition-colors">
              <div className="p-2 bg-[#00C853] rounded-lg">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#F3F4F6]">开始节点</p>
                <p className="text-xs text-[#9CA3AF]">流程入口</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#181F32] rounded-lg cursor-pointer hover:bg-[#2A354D] transition-colors">
              <div className="p-2 bg-[#0066FF] rounded-lg">
                <Circle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#F3F4F6]">动作节点</p>
                <p className="text-xs text-[#9CA3AF]">执行操作</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#181F32] rounded-lg cursor-pointer hover:bg-[#2A354D] transition-colors">
              <div className="p-2 bg-[#FF9100] rounded-lg">
                <GitBranch className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#F3F4F6]">条件节点</p>
                <p className="text-xs text-[#9CA3AF]">分支判断</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#181F32] rounded-lg cursor-pointer hover:bg-[#2A354D] transition-colors">
              <div className="p-2 bg-[#FF3B30] rounded-lg">
                <Square className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#F3F4F6]">结束节点</p>
                <p className="text-xs text-[#9CA3AF]">流程出口</p>
              </div>
            </div>
          </div>

          {selectedNode && (
            <div className="mt-6 pt-6 border-t border-[#2A354D]">
              <h3 className="text-sm font-medium text-[#D1D5DB] mb-3">节点配置</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">节点名称</label>
                  <input
                    type="text"
                    defaultValue={nodes.find(n => n.id === selectedNode)?.label}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">执行超时</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#FF3B30]/20 text-[#FF3B30] rounded-lg text-sm hover:bg-[#FF3B30]/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  删除节点
                </button>
              </div>
            </div>
          )}
        </div>

        <div 
          className="flex-1 bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg className="absolute inset-0 w-full h-full">
            {edges.map((edge, index) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              
              return (
                <line
                  key={index}
                  x1={fromNode.x + 40}
                  y1={fromNode.y + 20}
                  x2={toNode.x + 40}
                  y2={toNode.y}
                  stroke="#2A354D"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2A354D" />
              </marker>
            </defs>
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute cursor-move transition-shadow ${selectedNode === node.id ? 'ring-2 ring-[#0066FF]' : ''}`}
              style={{ left: node.x, top: node.y }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            >
              <div className={`flex items-center gap-3 px-4 py-2 ${getNodeColor(node.type)} rounded-lg text-white`}>
                {getNodeIcon(node.type)}
                <span className="text-sm font-medium whitespace-nowrap">{node.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}