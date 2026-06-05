'use client';

import React, { useState } from 'react';
import { Save, Play, Upload, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NodeLibrary } from './NodeLibrary';
import { FlowCanvas } from './FlowCanvas';
import { NodeConfigPanel } from './NodeConfigPanel';
import type { FlowNode, FlowEdge, NodeTypeConfig, FlowScenario } from './types';

export interface FlowOrchestratorProps {
  // ===== 基础数据 =====
  /** 节点库定义（拖拽卡片 + 画布节点样式） */
  nodeTypes: NodeTypeConfig[];
  /** 节点列表 */
  nodes: FlowNode[];
  /** 边列表 */
  edges: FlowEdge[];
  /** 节点更新回调 */
  onNodesChange?: (nodes: FlowNode[]) => void;
  /** 边更新回调 */
  onEdgesChange?: (edges: FlowEdge[]) => void;
  /** 当前选中节点 ID */
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;

  // ===== 场景管理（可选） =====
  /** 场景列表（启用场景切换器） */
  scenarios?: FlowScenario[];
  /** 当前场景 ID */
  currentScenarioId?: string;
  onScenarioChange?: (scenarioId: string) => void;
  onScenarioAdd?: () => void;
  onScenarioDelete?: (scenarioId: string) => void;

  // ===== 工具栏（可选） =====
  /** 显示"保存"按钮 */
  showSave?: boolean;
  onSave?: () => void;
  /** 显示"运行"按钮 */
  showRun?: boolean;
  onRun?: () => void;
  /** 显示"导入/导出"按钮 */
  showImportExport?: boolean;
  onImport?: () => void;
  onExport?: () => void;
  /** 工具栏额外按钮（任意 React 节点） */
  toolbarExtra?: React.ReactNode;

  // ===== 配置面板 =====
  /** 业务自定义节点配置（在通用字段下方渲染） */
  renderNodeConfig?: (props: { node: FlowNode; onChange: (patch: Partial<FlowNode>) => void }) => React.ReactNode;
  /** 节点复制回调 */
  onCopyNode?: (node: FlowNode) => void;
  /** 节点删除回调 */
  onDeleteNode?: (node: FlowNode) => void;

  // ===== 布局控制 =====
  /** 节点库列宽（grid col-span），默认 2（共 12）*/
  libraryColSpan?: 1 | 2 | 3;
  /** 配置面板列宽（grid col-span），默认 3（共 12）*/
  configColSpan?: 2 | 3 | 4;
  /** 画布高度 */
  canvasHeight?: number;
  /** 显示缩放控件 */
  showZoom?: boolean;
  /** 画布顶部附加信息 */
  canvasHeaderInfo?: React.ReactNode;

  // ===== 自定义渲染覆盖 =====
  /** 顶部工具栏整体覆盖（如果传入，则完全替代默认工具栏） */
  renderToolbar?: () => React.ReactNode;
}

/**
 * FlowOrchestrator 顶层组件
 *
 * 提供统一的"流程编排器"布局：
 * - 顶部：场景切换器 + 工具栏（保存/运行/导入/导出/自定义）
 * - 左侧：节点库（可拖拽）
 * - 中间：画布（节点 + SVG 连线 + 拖拽 + 缩放）
 * - 右侧：节点配置面板
 *
 * 所有"流程编排/场景编排/规则编排"页面都应使用此组件。
 */
export function FlowOrchestrator({
  nodeTypes,
  nodes,
  edges,
  onNodesChange,
  selectedNodeId,
  onSelectNode,
  scenarios,
  currentScenarioId,
  onScenarioChange,
  onScenarioAdd,
  onScenarioDelete,
  showSave = true,
  onSave,
  showRun = true,
  onRun,
  showImportExport = true,
  onImport,
  onExport,
  toolbarExtra,
  renderNodeConfig,
  onCopyNode,
  onDeleteNode,
  libraryColSpan = 2,
  configColSpan = 3,
  canvasHeight = 600,
  showZoom = true,
  canvasHeaderInfo,
  renderToolbar,
}: FlowOrchestratorProps) {
  const currentScenario = scenarios?.find((s) => s.id === currentScenarioId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedNodeType = selectedNode
    ? nodeTypes.find((nt) => nt.type === selectedNode.type) || null
    : null;

  // 拖放 / 点击 添加节点
  const handleAddNode = (type: string, x?: number, y?: number) => {
    if (!onNodesChange) return;
    const nt = nodeTypes.find((n) => n.type === type);
    if (!nt) return;
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type,
      label: nt.label,
      description: '点击配置...',
      x: x ?? 100,
      y: y ?? 100,
      status: 'pending',
      ...(nt.defaultData || {}),
    };
    onNodesChange([...nodes, newNode]);
    onSelectNode(newNode.id);
  };

  // 处理节点更新（配置面板回调）
  const handleNodeChange = (updated: FlowNode) => {
    if (!onNodesChange) return;
    onNodesChange(nodes.map((n) => (n.id === updated.id ? updated : n)));
  };

  // 复制节点
  const handleCopyNode = (node: FlowNode) => {
    if (!onNodesChange) return;
    const newNode: FlowNode = {
      ...node,
      id: `node-${Date.now()}`,
      x: node.x + 40,
      y: node.y + 40,
    };
    onNodesChange([...nodes, newNode]);
    onSelectNode(newNode.id);
    onCopyNode?.(node);
  };

  // 删除节点
  const handleDeleteNode = (node: FlowNode) => {
    if (!onNodesChange) return;
    onNodesChange(nodes.filter((n) => n.id !== node.id));
    if (selectedNodeId === node.id) onSelectNode(null);
    onDeleteNode?.(node);
  };

  // 画布列宽（中间部分 = 12 - library - config）
  const canvasColSpan = 12 - libraryColSpan - configColSpan;

  return (
    <div className="space-y-4">
      {/* 顶部工具栏 */}
      {renderToolbar ? (
        renderToolbar()
      ) : (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* 左侧：场景选择器（如果启用） */}
            <div className="flex items-center gap-2 flex-wrap">
              {scenarios && scenarios.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">场景：</span>
                  <div className="relative">
                    <select
                      value={currentScenarioId || ''}
                      onChange={(e) => onScenarioChange?.(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-1.5 bg-[#111625] border border-[#2A354D] rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {scenarios.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  </div>
                  {currentScenario && (
                    <span className="text-[10px] text-slate-500">
                      {currentScenario.nodes.length} 节点 / {currentScenario.edges.length} 连线
                    </span>
                  )}
                </div>
              )}
              {onScenarioAdd && (
                <Button variant="secondary" size="sm" onClick={onScenarioAdd}>
                  + 新建场景
                </Button>
              )}
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-2">
              {toolbarExtra}
              {showImportExport && (
                <>
                  {onImport && (
                    <Button variant="secondary" size="sm" onClick={onImport}>
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      导入
                    </Button>
                  )}
                  {onExport && (
                    <Button variant="secondary" size="sm" onClick={onExport}>
                      <Download className="w-3.5 h-3.5 mr-1" />
                      导出
                    </Button>
                  )}
                </>
              )}
              {showSave && onSave && (
                <Button variant="secondary" size="sm" onClick={onSave}>
                  <Save className="w-3.5 h-3.5 mr-1" />
                  保存
                </Button>
              )}
              {showRun && onRun && (
                <Button variant="primary" size="sm" onClick={onRun}>
                  <Play className="w-3.5 h-3.5 mr-1" />
                  运行
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 三栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧：节点库 */}
        <div className={`lg:col-span-${libraryColSpan}`}>
          <NodeLibrary
            nodeTypes={nodeTypes}
            onAddNode={(type) => handleAddNode(type, 100, 100)}
          />
        </div>

        {/* 中间：画布 */}
        <div className={`lg:col-span-${canvasColSpan}`}>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onNodesChange={onNodesChange}
            onDrop={(type, x, y) => handleAddNode(type, x, y)}
            canvasHeight={canvasHeight}
            showZoom={showZoom}
            headerInfo={canvasHeaderInfo}
          />
        </div>

        {/* 右侧：配置面板 */}
        <div className={`lg:col-span-${configColSpan}`}>
          <NodeConfigPanel
            node={selectedNode}
            nodeType={selectedNodeType}
            onNodeChange={handleNodeChange}
            onCopy={onCopyNode ? handleCopyNode : undefined}
            onDelete={onDeleteNode ? handleDeleteNode : undefined}
            renderNodeConfig={renderNodeConfig}
            emptyText="点击画布上的节点查看配置"
          />
        </div>
      </div>
    </div>
  );
}

export default FlowOrchestrator;
