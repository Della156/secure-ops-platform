'use client';

import React, { useRef, useState } from 'react';
import { Activity, CheckCircle2, AlertCircle, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { FlowNode, FlowEdge, NodeTypeConfig } from './types';
import { statusToStyle, conditionToColor } from './types';

export interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  nodeTypes: NodeTypeConfig[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onNodesChange?: (nodes: FlowNode[]) => void;
  onDrop?: (type: string, x: number, y: number) => void;
  /** 节点宽度（px） */
  nodeWidth?: number;
  /** 画布高度 */
  canvasHeight?: number;
  /** 是否显示画布缩放控件 */
  showZoom?: boolean;
  /** 顶部附加信息（节点数/连线数等） */
  headerInfo?: React.ReactNode;
}

/**
 * 流程画布组件
 *
 * 功能：
 * - SVG 连线渲染（条件分支：success=绿实线，failure=红虚线，always=灰实线）
 * - 节点拖拽（mousedown + mousemove + mouseup）
 * - 节点点击选中
 * - 节点状态徽章（pending/running/success/failed）
 * - 画布缩放控件（可选）
 */
export function FlowCanvas({
  nodes,
  edges,
  nodeTypes,
  selectedNodeId,
  onSelectNode,
  onNodesChange,
  onDrop,
  nodeWidth = 140,
  canvasHeight = 600,
  showZoom = true,
  headerInfo,
}: FlowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);

  // 节点类型配置查询
  const nodeTypeConfig = (type: string): NodeTypeConfig => {
    return nodeTypes.find((n) => n.type === type) || {
      type, label: type, color: '#94A3B8', icon: null,
    };
  };

  // 拖拽逻辑
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggedNode(nodeId);
    setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y });
    onSelectNode(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !canvasRef.current || !onNodesChange) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    onNodesChange(
      nodes.map((n) => (n.id === draggedNode ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // 缩放
  const zoomIn = () => setZoom((z) => Math.min(150, z + 10));
  const zoomOut = () => setZoom((z) => Math.max(50, z - 10));
  const resetZoom = () => setZoom(100);

  return (
    <div className="bg-[#111625] border border-[#2A354D] rounded-lg overflow-hidden flex flex-col">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A354D] bg-[#20293F]">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>画布</span>
          <span>·</span>
          <span>{nodes.length} 节点 / {edges.length} 连线</span>
          {headerInfo}
        </div>
        {showZoom && (
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              className="p-1 hover:bg-[#2A354D] rounded text-slate-400 hover:text-white"
              title="缩小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-500 min-w-[40px] text-center">{zoom}%</span>
            <button
              onClick={zoomIn}
              className="p-1 hover:bg-[#2A354D] rounded text-slate-400 hover:text-white"
              title="放大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1 hover:bg-[#2A354D] rounded text-slate-400 hover:text-white"
              title="重置"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 画布区 */}
      <div
        ref={canvasRef}
        className="relative overflow-auto"
        style={{
          height: canvasHeight,
          backgroundImage: 'radial-gradient(circle, #2A354D 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          cursor: draggedNode ? 'grabbing' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => onSelectNode(null)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const type = e.dataTransfer.getData('nodeType');
          if (!type || !canvasRef.current || !onDrop) return;
          const rect = canvasRef.current.getBoundingClientRect();
          onDrop(type, e.clientX - rect.left, e.clientY - rect.top);
        }}
      >
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: '0 0' }}>
          {/* SVG 连线层 */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ minWidth: '1000px', minHeight: canvasHeight }}
          >
            <defs>
              <marker id="fo-arrowhead-success" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#22C55E" />
              </marker>
              <marker id="fo-arrowhead-failure" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#EF4444" />
              </marker>
              <marker id="fo-arrowhead-always" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#94A3B8" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.x + nodeWidth;
              const y1 = fromNode.y + 25;
              const x2 = toNode.x;
              const y2 = toNode.y + 25;
              const midX = (x1 + x2) / 2;
              const cond = edge.condition || 'always';
              const color = conditionToColor[cond];
              return (
                <g key={edge.id || `edge-${i}`}>
                  <path
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray={cond === 'failure' ? '4 4' : '0'}
                    markerEnd={`url(#fo-arrowhead-${cond})`}
                  />
                  {edge.label && (
                    <text x={midX} y={(y1 + y2) / 2 - 4} fill="#94A3B8" fontSize="10" textAnchor="middle">
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 节点层 */}
          {nodes.map((node) => {
            const nt = nodeTypeConfig(node.type);
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node.id);
                }}
                className={`absolute cursor-move select-none ${isSelected ? 'z-10' : ''}`}
                style={{ left: node.x, top: node.y, width: nodeWidth }}
              >
                <div
                  className={`bg-[#20293F] rounded-lg border-2 ${
                    isSelected ? 'border-blue-500' : 'border-[#2A354D]'
                  } p-2 transition-colors`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={{ background: `${nt.color}30`, color: nt.color }}
                    >
                      {nt.icon}
                    </div>
                    <span className="text-xs text-white font-medium flex-1 truncate">{node.label}</span>
                  </div>
                  {node.description && (
                    <div className="text-[10px] text-slate-500 line-clamp-1">{node.description}</div>
                  )}
                  {node.status && (
                    <div className="mt-1.5 pt-1.5 border-t border-[#2A354D] flex items-center justify-between">
                      {node.status === 'running' && (
                        <span className="text-[10px] text-blue-400 flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5 animate-pulse" />
                          {node.duration || '运行中'}
                        </span>
                      )}
                      {node.status === 'success' && (
                        <span className="text-[10px] text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {node.duration || '完成'}
                        </span>
                      )}
                      {node.status === 'failed' && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {node.duration || '失败'}
                        </span>
                      )}
                      {node.status === 'pending' && (
                        <span className="text-[10px] text-slate-500">{statusToStyle.pending.label}</span>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`absolute -left-2 -top-2 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-semibold ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {node.id.length > 4 ? node.id.slice(-2) : node.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlowCanvas;
