'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Trash2, Save, Play, Download, Upload, Settings, ArrowRight,
  Database, Server, Network, FileText, Cloud, GitBranch, Shield, Zap,
  ChevronRight, ChevronDown, CheckCircle2, AlertCircle, Clock, X,
  Edit3, Copy, Eye, RotateCcw, Layers, Activity, Target, Cpu
} from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'start' | 'stop_db' | 'restore_db' | 'switch_app' | 'verify' | 'notify' | 'rollback' | 'end';
  label: string;
  description: string;
  x: number;
  y: number;
  status?: 'pending' | 'running' | 'success' | 'failed';
  duration?: string;
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  condition?: 'success' | 'failure' | 'always';
}

const nodeTypes = [
  { type: 'start', label: '开始', color: '#22C55E', icon: <Activity className="w-4 h-4" /> },
  { type: 'stop_db', label: '停止数据库', color: '#FF6D00', icon: <Database className="w-4 h-4" /> },
  { type: 'restore_db', label: '恢复数据库', color: '#0066FF', icon: <Database className="w-4 h-4" /> },
  { type: 'switch_app', label: '应用切换', color: '#9333EA', icon: <Network className="w-4 h-4" /> },
  { type: 'verify', label: '业务验证', color: '#06B6D4', icon: <CheckCircle2 className="w-4 h-4" /> },
  { type: 'notify', label: '通知', color: '#EAB308', icon: <Settings className="w-4 h-4" /> },
  { type: 'rollback', label: '回滚', color: '#EF4444', icon: <RotateCcw className="w-4 h-4" /> },
  { type: 'end', label: '结束', color: '#94A3B8', icon: <Target className="w-4 h-4" /> },
];

const scenarios = [
  { id: 'SC-001', name: '核心数据库恢复演练', nodes: 8, status: '已审核', updatedAt: '2026-05-28' },
  { id: 'SC-002', name: '全机房断电应急', nodes: 12, status: '已审核', updatedAt: '2026-05-20' },
  { id: 'SC-003', name: '应用双活切换', nodes: 6, status: '草稿', updatedAt: '2026-06-02' },
];

const initialNodes: FlowNode[] = [
  { id: '1', type: 'start', label: '演练开始', description: '触发条件：定时 02:00', x: 60, y: 200, status: 'success' },
  { id: '2', type: 'stop_db', label: '停止主库写入', description: 'mysql-01: SET GLOBAL read_only=ON', x: 240, y: 200, status: 'success', duration: '12s' },
  { id: '3', type: 'restore_db', label: '从备份恢复数据', description: 'innobackupex --apply-log ...', x: 420, y: 200, status: 'running', duration: '5m 24s' },
  { id: '4', type: 'switch_app', label: '应用切到备库', description: 'app-01 ~ app-04 重连 mysql-slave-01', x: 600, y: 200 },
  { id: '5', type: 'verify', label: '业务验证', description: '运行 200 笔交易，检查一致性', x: 600, y: 100, status: 'pending' },
  { id: '6', type: 'verify', label: '数据一致性比对', description: 'pt-table-checksum', x: 600, y: 320, status: 'pending' },
  { id: '7', type: 'notify', label: '通知业务方', description: '短信+邮件+IM 推送', x: 780, y: 100, status: 'pending' },
  { id: '8', type: 'rollback', label: '回滚 (失败时)', description: '恢复主库，应用切回', x: 780, y: 320, status: 'pending' },
  { id: '9', type: 'end', label: '演练结束', description: '生成报告', x: 920, y: 200, status: 'pending' },
];

const initialEdges: FlowEdge[] = [
  { from: '1', to: '2', condition: 'always' },
  { from: '2', to: '3', condition: 'success' },
  { from: '3', to: '4', condition: 'success' },
  { from: '4', to: '5', condition: 'success' },
  { from: '4', to: '6', condition: 'success' },
  { from: '5', to: '7', condition: 'success' },
  { from: '6', to: '8', condition: 'failure' },
  { from: '5', to: '9', condition: 'success' },
  { from: '6', to: '9', condition: 'success' },
  { from: '7', to: '9', condition: 'always' },
  { from: '8', to: '9', condition: 'always' },
];

export function ScheduledTaskConfig() {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges] = useState<FlowEdge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>('3');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodeLibrary, setShowNodeLibrary] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
  };

  useEffect(() => {
    if (!draggedNode) return;
    const handleMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - rect.left - dragOffset.x);
      const newY = Math.max(0, e.clientY - rect.top - dragOffset.y);
      setNodes(prev => prev.map(n => n.id === draggedNode ? { ...n, x: newX, y: newY } : n));
    };
    const handleUp = () => setDraggedNode(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [draggedNode, dragOffset]);

  const selected = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const nodeTypeConfig = (type: string) => nodeTypes.find(nt => nt.type === type) || nodeTypes[0];

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">演练场景编排 — 核心数据库恢复演练</h2>
            <p className="text-xs text-slate-500 mt-1">拖拽式可视化编排演练节点，配置流转条件和回滚路径</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
              {scenarios.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nodes} 节点)</option>)}
            </select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Upload className="w-3.5 h-3.5" />导入
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Eye className="w-3.5 h-3.5" />模拟运行
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Save className="w-3.5 h-3.5" />保存
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧：节点库 */}
        {showNodeLibrary && (
          <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />节点库
              </h3>
              <button onClick={() => setShowNodeLibrary(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5">
              {nodeTypes.map(nt => (
                <div
                  key={nt.type}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('nodeType', nt.type)}
                  className="p-2 bg-[#111625] hover:bg-[#111625]/70 rounded cursor-move flex items-center gap-2 group"
                >
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${nt.color}20`, color: nt.color }}>
                    {nt.icon}
                  </div>
                  <span className="text-xs text-slate-300 flex-1">{nt.label}</span>
                  <Plus className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#2A354D] text-xs text-slate-500">
              提示：拖拽到画布添加节点
            </div>
          </div>
        )}

        {/* 中间：编排画布 */}
        <div className={`${showNodeLibrary ? 'lg:col-span-7' : 'lg:col-span-9'} bg-[#111625] border border-[#2A354D] rounded-lg overflow-hidden`}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A354D] bg-[#20293F]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>画布</span>
              <span>·</span>
              <span>{nodes.length} 节点 / {edges.length} 连线</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2 py-0.5 text-xs text-slate-400 hover:text-white">缩小</button>
              <span className="text-xs text-slate-500">100%</span>
              <button className="px-2 py-0.5 text-xs text-slate-400 hover:text-white">放大</button>
            </div>
          </div>
          <div
            ref={canvasRef}
            className="relative h-[600px] overflow-auto"
            style={{
              backgroundImage: 'radial-gradient(circle, #2A354D 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              const type = e.dataTransfer.getData('nodeType');
              if (!type || !canvasRef.current) return;
              const rect = canvasRef.current.getBoundingClientRect();
              const newNode: FlowNode = {
                id: String(Date.now()),
                type: type as any,
                label: nodeTypes.find(n => n.type === type)?.label || '新节点',
                description: '点击配置...',
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                status: 'pending',
              };
              setNodes(prev => [...prev, newNode]);
              setSelectedNode(newNode.id);
            }}
          >
            {/* 渲染 SVG 连线 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '1000px', minHeight: '600px' }}>
              <defs>
                <marker id="arrowhead-success" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#22C55E" />
                </marker>
                <marker id="arrowhead-failure" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#EF4444" />
                </marker>
                <marker id="arrowhead-always" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#94A3B8" />
                </marker>
              </defs>
              {edges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const x1 = fromNode.x + 140;
                const y1 = fromNode.y + 25;
                const x2 = toNode.x;
                const y2 = toNode.y + 25;
                const midX = (x1 + x2) / 2;
                const color = edge.condition === 'success' ? '#22C55E' : edge.condition === 'failure' ? '#EF4444' : '#94A3B8';
                return (
                  <g key={i}>
                    <path
                      d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeDasharray={edge.condition === 'failure' ? '4 4' : '0'}
                      markerEnd={`url(#arrowhead-${edge.condition})`}
                    />
                    {edge.label && (
                      <text x={midX} y={(y1 + y2) / 2 - 4} fill="#94A3B8" fontSize="10" textAnchor="middle">{edge.label}</text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* 渲染节点 */}
            {nodes.map(node => {
              const nt = nodeTypeConfig(node.type);
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onMouseDown={e => handleMouseDown(e, node.id)}
                  className={`absolute cursor-move select-none ${isSelected ? 'z-10' : ''}`}
                  style={{ left: node.x, top: node.y, width: 140 }}
                >
                  <div className={`bg-[#20293F] rounded-lg border-2 ${isSelected ? 'border-blue-500' : 'border-[#2A354D]'} p-2`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${nt.color}30`, color: nt.color }}>
                        {nt.icon}
                      </div>
                      <span className="text-xs text-white font-medium flex-1 truncate">{node.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{node.description}</div>
                    {node.status && (
                      <div className="mt-1.5 pt-1.5 border-t border-[#2A354D] flex items-center justify-between">
                        {node.status === 'running' && <span className="text-[10px] text-blue-400 flex items-center gap-1"><Activity className="w-2.5 h-2.5 animate-pulse" />{node.duration}</span>}
                        {node.status === 'success' && <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />{node.duration || '完成'}</span>}
                        {node.status === 'failed' && <span className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{node.duration || '失败'}</span>}
                        {node.status === 'pending' && <span className="text-[10px] text-slate-500">待执行</span>}
                      </div>
                    )}
                  </div>
                  <div className={`absolute -left-2 -top-2 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-semibold ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {node.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：节点配置 */}
        <div className="lg:col-span-3 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          {selected ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">节点配置</h3>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-[#2A354D] rounded" title="复制"><Copy className="w-3.5 h-3.5 text-slate-400" /></button>
                  <button className="p-1 hover:bg-[#2A354D] rounded" title="删除"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">节点 ID</label>
                  <div className="px-2 py-1.5 bg-[#111625] border border-[#2A354D] rounded text-sm text-slate-300 font-mono">#{selected.id}</div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">节点类型</label>
                  <div className="px-2 py-1.5 bg-[#111625] border border-[#2A354D] rounded text-sm text-slate-300 flex items-center gap-1.5">
                    <span style={{ color: nodeTypeConfig(selected.type).color }}>{nodeTypeConfig(selected.type).icon}</span>
                    {nodeTypeConfig(selected.type).label}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">节点名称</label>
                  <input
                    type="text"
                    value={selected.label}
                    onChange={e => setNodes(prev => prev.map(n => n.id === selected.id ? { ...n, label: e.target.value } : n))}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">节点描述</label>
                  <textarea
                    value={selected.description}
                    onChange={e => setNodes(prev => prev.map(n => n.id === selected.id ? { ...n, description: e.target.value } : n))}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none resize-none"
                    rows={3}
                  />
                </div>

                {selected.type === 'restore_db' && (
                  <>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">备份源</label>
                      <select className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded">
                        <option>2026-06-02 02:00 全量备份</option>
                        <option>2026-06-02 06:00 增量备份</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">目标实例</label>
                      <input
                        type="text"
                        defaultValue="mysql-slave-01"
                        className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">超时时间（秒）</label>
                      <input
                        type="number"
                        defaultValue={600}
                        className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded"
                      />
                    </div>
                  </>
                )}

                {selected.type === 'verify' && (
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">验证脚本</label>
                    <select className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded">
                      <option>业务交易验证 (200 笔)</option>
                      <option>数据一致性比对</option>
                      <option>性能基准测试</option>
                    </select>
                  </div>
                )}

                <div className="pt-3 border-t border-[#2A354D] space-y-2">
                  <div className="text-xs text-slate-500">连接条件</div>
                  <div className="text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-center justify-between bg-[#111625] rounded px-2 py-1.5">
                      <span className="flex items-center gap-1.5 text-green-400"><CheckCircle2 className="w-3 h-3" />成功时</span>
                      <span className="text-slate-500">→ 下一节点</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#111625] rounded px-2 py-1.5">
                      <span className="flex items-center gap-1.5 text-red-400"><AlertCircle className="w-3 h-3" />失败时</span>
                      <span className="text-slate-500">→ 回滚节点</span>
                    </div>
                  </div>
                </div>

                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
                  <Save className="w-3.5 h-3.5" />保存节点配置
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 text-sm py-12">
              <Edit3 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              选择一个节点进行配置
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScheduledTaskConfig;
