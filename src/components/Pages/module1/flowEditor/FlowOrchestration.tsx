'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, Play, Save, Download, Upload, 
  Layers, Settings, X, Check, MoreHorizontal, Workflow, 
  GitMerge, GitBranch, Zap
} from 'lucide-react';

// 流程数据类型
interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'inactive';
  version: string;
  createdAt: string;
  updatedAt: string;
}

// 节点类型
interface Node {
  id: string;
  type: 'task' | 'condition' | 'parallel' | 'loop' | 'start' | 'end';
  name: string;
  x: number;
  y: number;
  config?: Record<string, any>;
}

// 连接类型
interface Connection {
  id: string;
  from: string;
  to: string;
}

// 模拟流程数据
const mockFlows: Flow[] = [
  { 
    id: 'FLOW-001', 
    name: '安全事件响应流程', 
    description: '处理安全告警事件的自动化流程', 
    status: 'active', 
    version: 'v1.2', 
    createdAt: '2026-05-15 10:00:00',
    updatedAt: '2026-05-25 14:30:00'
  },
  { 
    id: 'FLOW-002', 
    name: '漏洞扫描与修复', 
    description: '自动扫描漏洞并执行修复脚本', 
    status: 'active', 
    version: 'v2.0', 
    createdAt: '2026-05-18 09:15:00',
    updatedAt: '2026-05-26 11:20:00'
  },
  { 
    id: 'FLOW-003', 
    name: '设备配置备份', 
    description: '定期备份网络设备配置', 
    status: 'draft', 
    version: 'v0.5', 
    createdAt: '2026-05-20 16:45:00',
    updatedAt: '2026-05-24 13:10:00'
  },
];

// 模拟画布节点
const mockNodes: Node[] = [
  { id: 'node-1', type: 'start', name: '开始', x: 100, y: 200 },
  { id: 'node-2', type: 'task', name: '接收告警', x: 250, y: 200 },
  { id: 'node-3', type: 'condition', name: '判断级别', x: 400, y: 200 },
  { id: 'node-4', type: 'task', name: '高风险处置', x: 550, y: 120 },
  { id: 'node-5', type: 'task', name: '低风险记录', x: 550, y: 280 },
  { id: 'node-6', type: 'end', name: '结束', x: 700, y: 200 },
];

// 模拟连接
const mockConnections: Connection[] = [
  { id: 'conn-1', from: 'node-1', to: 'node-2' },
  { id: 'conn-2', from: 'node-2', to: 'node-3' },
  { id: 'conn-3', from: 'node-3', to: 'node-4' },
  { id: 'conn-4', from: 'node-3', to: 'node-5' },
  { id: 'conn-5', from: 'node-4', to: 'node-6' },
  { id: 'conn-6', from: 'node-5', to: 'node-6' },
];

export function FlowOrchestration() {
  const [flows, setFlows] = useState<Flow[]>(mockFlows);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Flow | null>(null);
  const [formData, setFormData] = useState<Partial<Flow>>({
    name: '',
    description: '',
  });
  const [viewMode, setViewMode] = useState<'list' | 'canvas'>('list');
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showNodePanel, setShowNodePanel] = useState(false);

  // 过滤数据
  const filteredFlows = flows.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchStatus;
  });

  // 打开新增/编辑模态框
  const handleOpenModal = (item?: Flow) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  // 保存数据
  const handleSave = () => {
    if (!formData.name) return;

    if (editingItem) {
      // 编辑
      setFlows(flows.map(item => item.id === editingItem.id ? { 
        ...item, 
        ...formData,
        updatedAt: new Date().toLocaleString('zh-CN')
      } as Flow : item));
    } else {
      // 新增
      const newItem: Flow = {
        id: `FLOW-${String(flows.length + 1).padStart(3, '0')}`,
        name: formData.name,
        description: formData.description || '',
        status: 'draft',
        version: 'v0.1',
        createdAt: new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN'),
      };
      setFlows([...flows, newItem]);
    }
    setIsModalOpen(false);
  };

  // 删除数据
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个流程吗？')) {
      setFlows(flows.filter(item => item.id !== id));
    }
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    const labels = {
      draft: '草稿',
      active: '运行中',
      inactive: '已停用',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // 获取节点图标
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'start':
        return <Play className="w-4 h-4 text-green-400" />;
      case 'end':
        return <Check className="w-4 h-4 text-red-400" />;
      case 'condition':
        return <GitBranch className="w-4 h-4 text-yellow-400" />;
      case 'parallel':
        return <GitMerge className="w-4 h-4 text-purple-400" />;
      case 'loop':
        return <Zap className="w-4 h-4 text-orange-400" />;
      default:
        return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  // 进入画布编辑模式
  const handleOpenCanvas = (flow: Flow) => {
    setSelectedFlow(flow);
    setViewMode('canvas');
  };

  // 返回列表
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedFlow(null);
  };

  // 点击节点
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setShowNodePanel(true);
  };

  return (
    <div className="p-8">
      {viewMode === 'list' ? (
        <>
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">自动化剧本/流程编排管理</h1>
            <p className="text-slate-400">创建、管理和编排自动化安全流程</p>
          </div>

          {/* 操作栏 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {/* 搜索框 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="搜索流程名称..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>

                {/* 状态筛选 */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部状态</option>
                  <option value="draft">草稿</option>
                  <option value="active">运行中</option>
                  <option value="inactive">已停用</option>
                </select>
              </div>

              {/* 新增按钮 */}
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                新建流程
              </button>
            </div>
          </div>

          {/* 数据表格 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">流程名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">描述</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">版本</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">更新时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredFlows.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                        {item.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.updatedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenCanvas(item)}
                          className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors"
                          title="编排画布"
                        >
                          <Workflow className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFlows.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-500">暂无数据</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* 画布模式头部 */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                返回列表
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedFlow?.name}</h1>
                <p className="text-slate-400 text-sm">{selectedFlow?.description}</p>
              </div>
            </div>

            {/* 操作栏 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Save className="w-4 h-4" />
                    保存
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    运行
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                    <Upload className="w-4 h-4" />
                    导入
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    导出
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">版本: {selectedFlow?.version}</span>
                  <span className="text-slate-400 text-sm">|</span>
                  <span className="text-slate-400 text-sm">状态: {selectedFlow?.status === 'active' ? '运行中' : selectedFlow?.status === 'draft' ? '草稿' : '已停用'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 画布区域 */}
          <div className="flex gap-4">
            {/* 节点库面板 */}
            <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 shrink-0">
              <h3 className="text-white font-semibold mb-4">节点库</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-move hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Play className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">开始节点</span>
                  </div>
                  <p className="text-slate-500 text-xs">流程入口</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-move hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">任务节点</span>
                  </div>
                  <p className="text-slate-500 text-xs">执行自动化任务</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-move hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm">条件分支</span>
                  </div>
                  <p className="text-slate-500 text-xs">逻辑判断分支</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-move hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <GitMerge className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">并行执行</span>
                  </div>
                  <p className="text-slate-500 text-xs">多任务并行</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-move hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="text-white text-sm">循环节点</span>
                  </div>
                  <p className="text-slate-500 text-xs">循环执行任务</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-move hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-red-400" />
                    <span className="text-white text-sm">结束节点</span>
                  </div>
                  <p className="text-slate-500 text-xs">流程出口</p>
                </div>
              </div>
            </div>

            {/* 主画布 */}
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="relative h-[600px] bg-slate-950" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                {/* 绘制连接线条 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {mockConnections.map(conn => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    if (!fromNode || !toNode) return null;
                    const x1 = fromNode.x + 120;
                    const y1 = fromNode.y + 30;
                    const x2 = toNode.x;
                    const y2 = toNode.y + 30;
                    const midX = (x1 + x2) / 2;
                    return (
                      <path
                        key={conn.id}
                        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                        stroke="#475569"
                        strokeWidth="2"
                        fill="none"
                      />
                    );
                  })}
                </svg>

                {/* 渲染节点 */}
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute p-4 rounded-lg border-2 cursor-move transition-all ${
                      selectedNode?.id === node.id 
                        ? 'border-blue-500 bg-slate-800/90' 
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                    style={{ left: node.x, top: node.y, width: '240px' }}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getNodeIcon(node.type)}
                      <span className="text-white font-medium text-sm">{node.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-xs">ID: {node.id}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-700 rounded-full" />
                        <div className="w-2 h-2 bg-slate-700 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 节点配置面板 */}
            {showNodePanel && selectedNode && (
              <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-4 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">节点配置</h3>
                  <button
                    onClick={() => setShowNodePanel(false)}
                    className="p-1 text-slate-400 hover:text-white rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">节点名称</label>
                    <input
                      type="text"
                      value={selectedNode.name}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">节点类型</label>
                    <input
                      type="text"
                      value={selectedNode.type}
                      disabled
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400"
                    />
                  </div>
                  {selectedNode.type === 'task' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">关联任务</label>
                      <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>选择任务...</option>
                        <option>防火墙配置同步任务</option>
                        <option>IDS日志采集任务</option>
                        <option>网络设备监控</option>
                      </select>
                    </div>
                  )}
                  {selectedNode.type === 'condition' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">条件表达式</label>
                      <textarea
                        rows={4}
                        placeholder="输入条件表达式..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-800">
                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      应用配置
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* 新增/编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {editingItem ? '编辑流程' : '新建流程'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">流程名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入流程名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">流程描述</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入流程描述"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
