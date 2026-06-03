'use client';

import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import type { FlowNode, NodeTypeConfig } from './types';

export interface NodeConfigPanelProps {
  node: FlowNode | null;
  nodeType: NodeTypeConfig | null;
  onNodeChange?: (node: FlowNode) => void;
  onCopy?: (node: FlowNode) => void;
  onDelete?: (node: FlowNode) => void;
  /** 业务自定义配置面板（在通用字段下方渲染） */
  renderNodeConfig?: (props: { node: FlowNode; onChange: (patch: Partial<FlowNode>) => void }) => React.ReactNode;
  /** 空状态文案 */
  emptyText?: string;
}

/**
 * 节点配置面板
 *
 * 渲染选中节点的属性：
 * - 节点 ID（只读）
 * - 节点类型（只读）
 * - 节点名称（可编辑）
 * - 节点描述（可编辑）
 * - 业务自定义配置（renderNodeConfig 注入）
 * - 复制/删除操作
 */
export function NodeConfigPanel({
  node,
  nodeType,
  onNodeChange,
  onCopy,
  onDelete,
  renderNodeConfig,
  emptyText = '未选中任何节点',
}: NodeConfigPanelProps) {
  if (!node || !nodeType) {
    return (
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">节点配置</h3>
        <div className="text-xs text-slate-500 py-8 text-center">{emptyText}</div>
      </div>
    );
  }

  const update = (patch: Partial<FlowNode>) => {
    onNodeChange?.({ ...node, ...patch });
  };

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 max-h-[680px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">节点配置</h3>
        <div className="flex items-center gap-1">
          {onCopy && (
            <button
              onClick={() => onCopy(node)}
              className="p-1.5 hover:bg-[#2A354D] rounded text-slate-400 hover:text-white"
              title="复制节点"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(node)}
              className="p-1.5 hover:bg-[#2A354D] rounded text-red-400 hover:text-red-300"
              title="删除节点"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* 节点 ID（只读） */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">节点 ID</label>
          <div className="px-2 py-1.5 bg-[#111625] border border-[#2A354D] rounded text-sm text-slate-300 font-mono">
            #{node.id}
          </div>
        </div>

        {/* 节点类型（只读） */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">节点类型</label>
          <div className="px-2 py-1.5 bg-[#111625] border border-[#2A354D] rounded text-sm text-slate-300 flex items-center gap-1.5">
            <span style={{ color: nodeType.color }}>{nodeType.icon}</span>
            {nodeType.label}
          </div>
        </div>

        {/* 节点名称 */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">节点名称</label>
          <input
            type="text"
            value={node.label}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
          />
        </div>

        {/* 节点描述 */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">节点描述</label>
          <textarea
            value={node.description || ''}
            onChange={(e) => update({ description: e.target.value })}
            className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none resize-none"
            rows={3}
            placeholder="描述此节点的作用..."
          />
        </div>

        {/* 节点状态（仅在有状态时显示） */}
        {node.status && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">运行状态</label>
            <div className="px-2 py-1.5 bg-[#111625] border border-[#2A354D] rounded text-sm flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${
                  node.status === 'success'
                    ? 'bg-green-500/20 text-green-400 border-green-500/40'
                    : node.status === 'failed'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : node.status === 'running'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                }`}
              >
                {node.status === 'success' && '已完成'}
                {node.status === 'failed' && '失败'}
                {node.status === 'running' && '运行中'}
                {node.status === 'pending' && '待执行'}
              </span>
              {node.duration && <span className="text-slate-400 text-xs">{node.duration}</span>}
            </div>
          </div>
        )}

        {/* 业务自定义配置 */}
        {renderNodeConfig && (
          <div className="pt-3 border-t border-[#2A354D]">
            {renderNodeConfig({ node, onChange: update })}
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeConfigPanel;
