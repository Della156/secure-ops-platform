'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Edit, Trash2, Play, Save, Download, Upload,
  Play as PlayIcon, Check, GitBranch, GitMerge, Zap, Layers, ArrowLeft,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { FlowOrchestrator } from '@/components/FlowOrchestrator';
import type { FlowNode, NodeTypeConfig } from '@/components/FlowOrchestrator/types';

/**
 * 自动化剧本/流程编排管理（5.自动化流程编排器）
 *
 * 双模式：
 * - list 模式：流程列表（搜索/筛选/新建/编辑/删除）
 * - canvas 模式：可视化编排（节点库 + 画布 + 配置面板）
 *
 * 设计：canvas 模式使用共享 FlowOrchestrator 组件，与演练场景编排统一风格。
 */

interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'inactive';
  version: string;
  createdAt: string;
  updatedAt: string;
}

const nodeTypes: NodeTypeConfig[] = [
  { type: 'start', label: '开始节点', color: '#22C55E', icon: <PlayIcon className="w-4 h-4" />, description: '流程入口' },
  { type: 'task', label: '任务节点', color: '#0066FF', icon: <Layers className="w-4 h-4" />, description: '执行自动化任务' },
  { type: 'condition', label: '条件分支', color: '#FF9100', icon: <GitBranch className="w-4 h-4" />, description: '逻辑判断分支' },
  { type: 'parallel', label: '并行执行', color: '#6366F1', icon: <GitMerge className="w-4 h-4" />, description: '多任务并行' },
  { type: 'loop', label: '循环节点', color: '#FF9100', icon: <Zap className="w-4 h-4" />, description: '循环执行任务' },
  { type: 'end', label: '结束节点', color: '#EF4444', icon: <Check className="w-4 h-4" />, description: '流程出口' },
];

const mockFlows: Flow[] = [
  { id: 'FLOW-001', name: '安全事件响应流程', description: '处理安全告警事件的自动化流程', status: 'active', version: 'v1.2', createdAt: '2026-05-15 10:00', updatedAt: '2026-05-25 14:30' },
  { id: 'FLOW-002', name: '漏洞扫描与修复', description: '自动扫描漏洞并执行修复脚本', status: 'active', version: 'v2.0', createdAt: '2026-05-18 09:15', updatedAt: '2026-05-26 11:20' },
  { id: 'FLOW-003', name: '设备配置备份', description: '定期备份网络设备配置', status: 'draft', version: 'v0.5', createdAt: '2026-05-20 16:45', updatedAt: '2026-05-24 13:10' },
  { id: 'FLOW-004', name: '日志采集与分析', description: '采集各设备日志并分析异常', status: 'inactive', version: 'v1.0', createdAt: '2026-04-10 09:00', updatedAt: '2026-05-12 17:00' },
];

const initialCanvasNodes: FlowNode[] = [
  { id: '1', type: 'start', label: '开始', description: '流程入口', x: 100, y: 200 },
  { id: '2', type: 'task', label: '接收告警', description: '从 SIEM 接收告警', x: 280, y: 200 },
  { id: '3', type: 'condition', label: '判断级别', description: '高/中/低 风险判断', x: 460, y: 200 },
  { id: '4', type: 'task', label: '高风险处置', description: '立即阻断 + 通知', x: 640, y: 120 },
  { id: '5', type: 'task', label: '低风险记录', description: '记录到日志库', x: 640, y: 280 },
  { id: '6', type: 'end', label: '结束', description: '流程结束', x: 820, y: 200 },
];

const initialCanvasEdges = [
  { from: '1', to: '2', condition: 'always' as const },
  { from: '2', to: '3', condition: 'success' as const },
  { from: '3', to: '4', condition: 'success' as const },
  { from: '3', to: '5', condition: 'always' as const },
  { from: '4', to: '6', condition: 'always' as const },
  { from: '5', to: '6', condition: 'always' as const },
];

export function FlowOrchestration() {
  const [flows, setFlows] = useState<Flow[]>(mockFlows);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'canvas'>('list');
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [canvasNodes, setCanvasNodes] = useState<FlowNode[]>(initialCanvasNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Flow | null>(null);
  const [formData, setFormData] = useState<Partial<Flow>>({ name: '', description: '' });

  const filteredFlows = flows.filter((item) => {
    const matchName = !searchName || item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchStatus;
  });

  const handleOpenModal = (item?: Flow) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    if (editingItem) {
      setFlows(flows.map((f) => (f.id === editingItem.id
        ? { ...f, ...formData, updatedAt: new Date().toLocaleString('zh-CN') } as Flow
        : f)));
    } else {
      const newFlow: Flow = {
        id: `FLOW-${String(flows.length + 1).padStart(3, '0')}`,
        name: formData.name,
        description: formData.description || '',
        status: 'draft',
        version: 'v0.1',
        createdAt: new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN'),
      };
      setFlows([...flows, newFlow]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个流程吗？')) {
      setFlows(flows.filter((f) => f.id !== id));
    }
  };

  const statusBadge = (status: Flow['status']) => {
    const map: Record<Flow['status'], { status: any; text: string }> = {
      draft: { status: 'pending', text: '草稿' },
      active: { status: 'success', text: '运行中' },
      inactive: { status: 'info', text: '已停用' },
    };
    const m = map[status];
    return <StatusBadge status={m.status} />;
  };

  const columns = [
    { key: 'id', title: 'ID', width: '120px' },
    { key: 'name', title: '流程名称' },
    { key: 'description', title: '描述' },
    { key: 'version', title: '版本', width: '80px' },
    { key: 'status', title: '状态', width: '100px', render: (item: Flow) => statusBadge(item.status) },
    { key: 'updatedAt', title: '更新时间', width: '160px' },
    {
      key: 'actions', title: '操作', width: '240px',
      render: (item: Flow) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedFlow(item); setViewMode('canvas'); }}>
            <Edit className="w-3.5 h-3.5 mr-1" />编辑
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
            <Trash2 className="w-3.5 h-3.5 mr-1" />删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      {viewMode === 'list' ? (
        <>
          <div>
            <h1 className="text-2xl font-bold text-slate-50">自动化剧本/流程编排管理</h1>
            <p className="text-slate-400 mt-1 text-sm">创建、管理和编排自动化安全流程</p>
          </div>

          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="搜索流程名称..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-36">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  options={[
                    { value: '', label: '全部状态' },
                    { value: 'draft', label: '草稿' },
                    { value: 'active', label: '运行中' },
                    { value: 'inactive', label: '已停用' },
                  ]}
                />
              </div>
              <div className="flex-1" />
              <Button variant="primary" onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-1" />新建流程
              </Button>
            </div>
          </Card>

          <Card padding="none">
            <Table columns={columns} data={filteredFlows} rowKey="id" />
          </Card>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setViewMode('list')}>
                <ArrowLeft className="w-4 h-4 mr-1" />返回列表
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-50">{selectedFlow?.name || '未选择流程'}</h1>
                <p className="text-slate-400 text-xs mt-0.5">
                  版本: {selectedFlow?.version} · 状态:
                  <span className="ml-1">
                    {selectedFlow && statusBadge(selectedFlow.status)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <FlowOrchestrator
            nodeTypes={nodeTypes}
            nodes={canvasNodes}
            edges={initialCanvasEdges}
            onNodesChange={setCanvasNodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onCopyNode={() => {}}
            onDeleteNode={() => {}}
            libraryColSpan={2}
            configColSpan={3}
            canvasHeight={620}
            renderNodeConfig={({ node, onChange }) => {
              if (node.type === 'task') {
                return (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">关联任务</label>
                      <Select
                        value={node.linkedTask || ''}
                        onChange={(e) => onChange({ linkedTask: e.target.value })}
                        options={[
                          { value: '', label: '选择任务...' },
                          { value: 'firewall_sync', label: '防火墙配置同步' },
                          { value: 'ids_collect', label: 'IDS 日志采集' },
                          { value: 'device_monitor', label: '网络设备监控' },
                          { value: 'vuln_scan', label: '漏洞扫描' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">超时时间（秒）</label>
                      <Input
                        type="number"
                        value={node.timeout || 60}
                        onChange={(e) => onChange({ timeout: parseInt(e.target.value) || 60 })}
                      />
                    </div>
                  </div>
                );
              }
              if (node.type === 'condition') {
                return (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">条件表达式</label>
                      <textarea
                        rows={4}
                        value={node.condition || ''}
                        onChange={(e) => onChange({ condition: e.target.value })}
                        placeholder="例: riskLevel == 'high'"
                        className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none resize-none font-mono"
                      />
                    </div>
                  </div>
                );
              }
              if (node.type === 'parallel') {
                return (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">并行任务数</label>
                      <Input
                        type="number"
                        value={node.parallelCount || 3}
                        onChange={(e) => onChange({ parallelCount: parseInt(e.target.value) || 3 })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">汇聚策略</label>
                      <Select
                        value={node.joinStrategy || 'all'}
                        onChange={(e) => onChange({ joinStrategy: e.target.value })}
                        options={[
                          { value: 'all', label: '全部完成' },
                          { value: 'any', label: '任一完成' },
                          { value: 'majority', label: '多数完成' },
                        ]}
                      />
                    </div>
                  </div>
                );
              }
              if (node.type === 'loop') {
                return (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">循环类型</label>
                      <Select
                        value={node.loopType || 'count'}
                        onChange={(e) => onChange({ loopType: e.target.value })}
                        options={[
                          { value: 'count', label: '按次数' },
                          { value: 'condition', label: '按条件' },
                          { value: 'collection', label: '按集合' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">次数 / 条件</label>
                      <Input
                        value={node.loopValue || '10'}
                        onChange={(e) => onChange({ loopValue: e.target.value })}
                        placeholder="10 或 status == 'failed'"
                      />
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? '编辑流程' : '新建流程'}
        width="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">流程名称</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入流程名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">流程描述</label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入流程描述"
              className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-[#2A354D]">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleSave}>保存</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FlowOrchestration;
