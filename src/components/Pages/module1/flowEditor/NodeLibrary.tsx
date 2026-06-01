'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, Eye, Copy, 
  Package, Server, Shield, Database, Terminal, 
  Cloud, GitBranch, CheckCircle, XCircle, AlertTriangle,
  ChevronRight, Tag, Filter, X
} from 'lucide-react';

// 节点分类类型
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

// 节点数据类型
interface NodeItem {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  version: string;
  author: string;
  status: 'active' | 'deprecated' | 'draft';
  createdAt: string;
  usageCount: number;
  icon: React.ReactNode;
  inputs?: { name: string; type: string; required: boolean; description: string }[];
  outputs?: { name: string; type: string; description: string }[];
}

// 模拟分类数据
const mockCategories: Category[] = [
  { id: 'security', name: '安全防护', icon: <Shield className="w-4 h-4" />, count: 12 },
  { id: 'device', name: '设备管理', icon: <Server className="w-4 h-4" />, count: 8 },
  { id: 'data', name: '数据处理', icon: <Database className="w-4 h-4" />, count: 15 },
  { id: 'network', name: '网络操作', icon: <Cloud className="w-4 h-4" />, count: 6 },
  { id: 'script', name: '脚本执行', icon: <Terminal className="w-4 h-4" />, count: 10 },
  { id: 'logic', name: '逻辑控制', icon: <GitBranch className="w-4 h-4" />, count: 5 },
];

// 模拟节点数据
const mockNodes: NodeItem[] = [
  {
    id: 'NODE-001',
    name: '防火墙规则同步',
    description: '同步防火墙配置规则到所有安全设备',
    category: 'security',
    tags: ['防火墙', '配置', '同步'],
    version: 'v2.1.0',
    author: 'admin',
    status: 'active',
    createdAt: '2026-05-15',
    usageCount: 45,
    icon: <Shield className="w-5 h-5 text-green-400" />,
    inputs: [
      { name: 'targetDevices', type: 'array', required: true, description: '目标设备列表' },
      { name: 'rules', type: 'object', required: true, description: '防火墙规则配置' },
    ],
    outputs: [
      { name: 'result', type: 'boolean', description: '同步是否成功' },
      { name: 'details', type: 'object', description: '同步详情' },
    ],
  },
  {
    id: 'NODE-002',
    name: '安全事件分析',
    description: '分析安全事件日志并生成报告',
    category: 'security',
    tags: ['安全', '日志', '分析'],
    version: 'v1.5.2',
    author: 'security-team',
    status: 'active',
    createdAt: '2026-05-18',
    usageCount: 32,
    icon: <Shield className="w-5 h-5 text-blue-400" />,
    inputs: [
      { name: 'eventLogs', type: 'array', required: true, description: '事件日志数据' },
    ],
    outputs: [
      { name: 'analysisReport', type: 'object', description: '分析报告' },
      { name: 'riskLevel', type: 'string', description: '风险等级' },
    ],
  },
  {
    id: 'NODE-003',
    name: '设备状态检查',
    description: '检查网络设备的在线状态和健康度',
    category: 'device',
    tags: ['设备', '监控', '健康'],
    version: 'v3.0.1',
    author: 'ops-team',
    status: 'active',
    createdAt: '2026-05-20',
    usageCount: 67,
    icon: <Server className="w-5 h-5 text-purple-400" />,
    inputs: [
      { name: 'deviceIds', type: 'array', required: true, description: '设备ID列表' },
    ],
    outputs: [
      { name: 'statuses', type: 'array', description: '设备状态列表' },
    ],
  },
  {
    id: 'NODE-004',
    name: '数据备份任务',
    description: '备份指定的数据库或文件',
    category: 'data',
    tags: ['备份', '数据', '存储'],
    version: 'v1.2.0',
    author: 'data-team',
    status: 'active',
    createdAt: '2026-05-22',
    usageCount: 28,
    icon: <Database className="w-5 h-5 text-yellow-400" />,
    inputs: [
      { name: 'source', type: 'string', required: true, description: '备份源' },
      { name: 'destination', type: 'string', required: true, description: '备份目标' },
    ],
    outputs: [
      { name: 'backupPath', type: 'string', description: '备份文件路径' },
      { name: 'success', type: 'boolean', description: '是否成功' },
    ],
  },
  {
    id: 'NODE-005',
    name: '网络端口扫描',
    description: '扫描指定IP的开放端口',
    category: 'network',
    tags: ['网络', '端口', '扫描'],
    version: 'v0.8.0',
    author: 'security-team',
    status: 'draft',
    createdAt: '2026-05-25',
    usageCount: 0,
    icon: <Cloud className="w-5 h-5 text-orange-400" />,
    inputs: [
      { name: 'targetIp', type: 'string', required: true, description: '目标IP地址' },
      { name: 'portRange', type: 'string', required: false, description: '端口范围' },
    ],
    outputs: [
      { name: 'openPorts', type: 'array', description: '开放端口列表' },
    ],
  },
  {
    id: 'NODE-006',
    name: 'Shell脚本执行',
    description: '在远程主机上执行Shell命令',
    category: 'script',
    tags: ['脚本', 'Shell', '执行'],
    version: 'v4.1.0',
    author: 'admin',
    status: 'active',
    createdAt: '2026-05-10',
    usageCount: 89,
    icon: <Terminal className="w-5 h-5 text-cyan-400" />,
    inputs: [
      { name: 'command', type: 'string', required: true, description: '要执行的命令' },
      { name: 'targetHost', type: 'string', required: true, description: '目标主机' },
    ],
    outputs: [
      { name: 'stdout', type: 'string', description: '标准输出' },
      { name: 'stderr', type: 'string', description: '错误输出' },
      { name: 'exitCode', type: 'number', description: '退出码' },
    ],
  },
  {
    id: 'NODE-007',
    name: '条件判断节点',
    description: '根据条件进行分支判断',
    category: 'logic',
    tags: ['逻辑', '条件', '分支'],
    version: 'v1.0.0',
    author: 'system',
    status: 'active',
    createdAt: '2026-05-01',
    usageCount: 156,
    icon: <GitBranch className="w-5 h-5 text-pink-400" />,
    inputs: [
      { name: 'condition', type: 'boolean', required: true, description: '判断条件' },
    ],
    outputs: [],
  },
  {
    id: 'NODE-008',
    name: '旧版日志采集',
    description: '已废弃的日志采集节点，请使用新版',
    category: 'data',
    tags: ['日志', '采集', '废弃'],
    version: 'v0.5.0',
    author: 'admin',
    status: 'deprecated',
    createdAt: '2026-04-15',
    usageCount: 12,
    icon: <Database className="w-5 h-5 text-red-400" />,
    inputs: [],
    outputs: [],
  },
];

export function NodeLibrary() {
  const [nodes, setNodes] = useState<NodeItem[]>(mockNodes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // 获取所有标签
  const allTags = Array.from(new Set(nodes.flatMap(node => node.tags)));

  // 过滤数据
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || node.category === selectedCategory;
    const matchesTag = !selectedTag || node.tags.includes(selectedTag);
    const matchesStatus = !statusFilter || node.status === statusFilter;
    return matchesSearch && matchesCategory && matchesTag && matchesStatus;
  });

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      deprecated: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const labels = {
      active: '可用',
      draft: '草稿',
      deprecated: '已废弃',
    };
    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      draft: <AlertTriangle className="w-3 h-3" />,
      deprecated: <XCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    return mockCategories.find(c => c.id === categoryId)?.name || categoryId;
  };

  // 打开详情
  const handleViewDetail = (node: NodeItem) => {
    setSelectedNode(node);
    setShowDetail(true);
  };

  // 复制节点
  const handleCopyNode = (node: NodeItem) => {
    alert(`已复制节点: ${node.name}`);
  };

  return (
    <div className="p-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">自动化能力节点库</h1>
        <p className="text-slate-400">浏览和管理可用于流程编排的自动化节点</p>
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
                placeholder="搜索节点名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>

            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部分类</option>
              {mockCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
              ))}
            </select>

            {/* 状态筛选 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="active">可用</option>
              <option value="draft">草稿</option>
              <option value="deprecated">已废弃</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* 视图切换 */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                网格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                列表
              </button>
            </div>

            {/* 新增按钮 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建节点
            </button>
          </div>
        </div>

        {/* 标签筛选 */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-slate-400 text-sm flex items-center gap-1">
            <Tag className="w-4 h-4" />
            标签:
          </span>
          <button
            onClick={() => setSelectedTag('')}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
              !selectedTag
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex gap-6">
        {/* 左侧分类导航 */}
        <div className="w-64 shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              分类导航
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  全部节点
                </span>
                <span className="text-slate-500">{nodes.length}</span>
              </button>
              {mockCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat.icon}
                    {cat.name}
                  </span>
                  <span className="text-slate-500">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1">
          {/* 结果统计 */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              找到 <span className="text-white font-medium">{filteredNodes.length}</span> 个节点
            </p>
          </div>

          {viewMode === 'grid' ? (
            /* 网格视图 */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNodes.map(node => (
                <div
                  key={node.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer"
                  onClick={() => handleViewDetail(node)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      {node.icon}
                    </div>
                    {getStatusBadge(node.status)}
                  </div>
                  <h3 className="text-white font-medium mb-1">{node.name}</h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{node.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {node.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {node.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded text-xs">
                        +{node.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>v{node.version}</span>
                    <span>{node.usageCount} 次使用</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewDetail(node); }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      详情
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyNode(node); }}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      复制
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 列表视图 */
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">节点</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">分类</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">版本</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">使用次数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">更新时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredNodes.map(node => (
                    <tr key={node.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-800 rounded-lg">
                            {node.icon}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{node.name}</div>
                            <div className="text-slate-500 text-xs truncate max-w-xs">{node.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">{getCategoryName(node.category)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(node.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">v{node.version}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">{node.usageCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-400 text-sm">{node.createdAt}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetail(node)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                            title="详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyNode(node)}
                            className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                            title="复制"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredNodes.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-500">暂无匹配的节点</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 详情弹窗 */}
      {showDetail && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  {selectedNode.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedNode.name}</h3>
                  <p className="text-slate-400 text-sm">ID: {selectedNode.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedNode.status)}
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <p className="text-slate-300 mb-4">{selectedNode.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedNode.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">版本</p>
                  <p className="text-white font-medium">v{selectedNode.version}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">作者</p>
                  <p className="text-white font-medium">{selectedNode.author}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">使用次数</p>
                  <p className="text-white font-medium">{selectedNode.usageCount}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">分类</p>
                  <p className="text-white font-medium">{getCategoryName(selectedNode.category)}</p>
                </div>
              </div>

              {/* 输入参数 */}
              {selectedNode.inputs && selectedNode.inputs.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    输入参数
                  </h4>
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-slate-400 font-medium">参数名</th>
                          <th className="px-4 py-2 text-left text-slate-400 font-medium">类型</th>
                          <th className="px-4 py-2 text-left text-slate-400 font-medium">必填</th>
                          <th className="px-4 py-2 text-left text-slate-400 font-medium">描述</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {selectedNode.inputs.map((input, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-white font-mono">{input.name}</td>
                            <td className="px-4 py-2 text-blue-400">{input.type}</td>
                            <td className="px-4 py-2">
                              {input.required ? (
                                <span className="text-red-400 text-xs">是</span>
                              ) : (
                                <span className="text-slate-500 text-xs">否</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-slate-400">{input.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 输出参数 */}
              {selectedNode.outputs && selectedNode.outputs.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    输出参数
                  </h4>
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-slate-400 font-medium">参数名</th>
                          <th className="px-4 py-2 text-left text-slate-400 font-medium">类型</th>
                          <th className="px-4 py-2 text-left text-slate-400 font-medium">描述</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {selectedNode.outputs.map((output, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-white font-mono">{output.name}</td>
                            <td className="px-4 py-2 text-green-400">{output.type}</td>
                            <td className="px-4 py-2 text-slate-400">{output.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                关闭
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                使用此节点
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新建节点弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">新建节点</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">节点名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入节点名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">节点描述</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入节点描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">分类</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {mockCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
