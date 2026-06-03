'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import type { NodeTypeConfig } from './types';

export interface NodeLibraryProps {
  nodeTypes: NodeTypeConfig[];
  onAddNode?: (type: string) => void;
  onDragStart?: (e: React.DragEvent, type: string) => void;
}

/**
 * 节点库组件
 *
 * 渲染可拖拽的节点类型卡片。卡片显示图标 + 标签 + 描述。
 * 支持两种使用模式：
 * - 拖拽到画布（onDragStart 触发，设置 dataTransfer）
 * - 点击添加（onAddNode 触发）
 */
export function NodeLibrary({ nodeTypes, onAddNode, onDragStart }: NodeLibraryProps) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">节点库</h3>
        <span className="text-xs text-slate-500">{nodeTypes.length} 种</span>
      </div>
      <div className="space-y-1.5">
        {nodeTypes.map((nt) => (
          <div
            key={nt.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('nodeType', nt.type);
              e.dataTransfer.effectAllowed = 'move';
              onDragStart?.(e, nt.type);
            }}
            onClick={() => onAddNode?.(nt.type)}
            className="group flex items-center gap-2 p-2 bg-[#181F32] hover:bg-[#1F2A3F] rounded-lg border border-[#2A354D] cursor-grab active:cursor-grabbing hover:border-blue-500 transition-colors"
          >
            <div
              className="w-6 h-6 rounded flex items-center justify-center shrink-0"
              style={{ background: `${nt.color}20`, color: nt.color }}
            >
              {nt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-300 font-medium truncate">{nt.label}</div>
              {nt.description && (
                <div className="text-[10px] text-slate-500 truncate">{nt.description}</div>
              )}
            </div>
            <Plus className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 shrink-0" />
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[#2A354D] text-[10px] text-slate-500">
        提示：拖拽到画布添加节点，或点击直接添加
      </div>
    </div>
  );
}

export default NodeLibrary;
