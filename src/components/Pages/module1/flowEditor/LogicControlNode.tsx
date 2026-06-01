'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, Eye, Copy, 
  GitBranch, GitMerge, Repeat, ArrowRightLeft, 
  CheckCircle, AlertTriangle, FileJson, Settings,
  X, ChevronRight
} from 'lucide-react';

// 逻辑节点类型
interface LogicNodeType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'active' | 'deprecated' | 'draft';
  version: string;
  usageCount: number;
  configTemplate: Record<string, any>;
}

// 模拟数据
const mockLogicNodes: LogicNodeType[] = [
  {
    id: 'LOGIC-001',
    name: '条件分支',
    description: '根据条件表达式进行分支判断，支持 if-else-if-else 结构',
    icon: <GitBranch className="w-5 h-5 text-[#0066FF]" />,
    category: 'branch',
    status: 'active',
    version: 'v2.0.1',
    usageCount: 342,
    configTemplate: {
      conditions: [
        { expression: '', branch: '分支1' },
        { expression: '', branch: '分支2' }
      ],
      defaultBranch: '默认分支'
    }
  },
  {
    id: 'LOGIC-002',
    name: '并行执行',
    description: '同时运行多个任务，支持并行控制和超时设置',
    icon: <GitMerge className="w-5 h-5 text-[#6366F1]" />,
    category: 'parallel',
    status: 'active',
    version: 'v1.5.0',
    usageCount: 189,
    configTemplate: {
      maxParallel: 5,
      timeout: 300,
      waitAll: true,
      failFast: false
    }
  },
  {
    id: 'LOGIC-003',
    name: '循环执行',
    description: '重复执行任务，支持 for 循环和 while 循环两种模式',
    icon: <Repeat className="w-5 h-5 text-[#FF9100]" />,
    category: 'loop',
    status: 'active',
    version: 'v1.8.3',
    usageCount: 256,
    configTemplate: {
      mode: 'for',
      maxIterations: 100,
      breakCondition: '',
      continueOnError: false
    }
  },
  {
    id: 'LOGIC-004',
    name: '数据转换',
    description: '转换和处理流程数据，支持 JSON 转换和数据映射',
    icon: <ArrowRightLeft className="w-5 h-5 text-[#00C853]" />,
    category: 'transform',
    status: 'active',
    version: 'v1.2.0',
    usageCount: 145,
    configTemplate: {
      mappings: [],
      script: '',
      outputFormat: 'json'
    }
  },
  {
    id: 'LOGIC-005',
    name: '子流程调用',
    description: '调用另一个已定义的流程作为子流程',
    icon: <FileJson className="w-5 h-5 text-[#00BCD4]" />,
    category: 'subflow',
    status: 'active',
    version: 'v1.6.2',
    usageCount: 98,
    configTemplate: {
      flowId: '',
      inputMapping: {},
      outputMapping: {}
    }
  },
  {
    id: 'LOGIC-006',
    name: '等待节点',
    description: '暂停流程执行，等待指定时间或外部事件',
    icon: <Settings className="w-5 h-5 text-[#FF9100]" />,
    category: 'wait',
    status: 'draft',
    version: 'v0.9.0',
    usageCount: 0,
    configTemplate: {
      waitMode: 'duration',
      duration: 60,
      eventName: ''
    }
  },
  {
    id: 'LOGIC-007',
    name: '旧版条件判断',
    description: '已废弃的条件判断节点，请使用新版条件分支',
    icon: <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />,
    category: 'branch',
    status: 'deprecated',
    version: 'v0.5.0',
    usageCount: 23,
    configTemplate: {
      condition: '',
      trueAction: '',
      falseAction: ''
    }
  }
];

// 分类数据
const categories = [
  { id: 'all', name: '全部节点', count: mockLogicNodes.length },
  { id: 'branch', name: '分支逻辑', count: mockLogicNodes.filter(n => n.category === 'branch').length },
  { id: 'parallel', name: '并行逻辑', count: mockLogicNodes.filter(n => n.category === 'parallel').length },
  { id: 'loop', name: '循环逻辑', count: mockLogicNodes.filter(n => n.category === 'loop').length },
  { id: 'transform', name: '数据转换', count: mockLogicNodes.filter(n => n.category === 'transform').length },
  { id: 'subflow', name: '子流程', count: mockLogicNodes.filter(n => n.category === 'subflow').length },
  { id: 'wait', name: '等待控制', count: mockLogicNodes.filter(n => n.category === 'wait').length },
];

export function LogicControlNode() {
  const [nodes, setNodes] = useState<LogicNodeType[]>(mockLogicNodes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<LogicNodeType | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 过滤数据
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    const matchesStatus = !statusFilter || node.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      draft: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      deprecated: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      active: '可用',
      draft: '草稿',
      deprecated: '已废弃',
    };
    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      draft: <AlertTriangle className="w-3 h-3" />,
      deprecated: <AlertTriangle className="w-3 h-3" />,
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
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  // 打开详情
  const handleViewDetail = (node: LogicNodeType) => {
    setSelectedNode(node);
    setShowDetail(true);
  };

  // 复制节点
  const handleCopyNode = (node: LogicNodeType) => {
    alert(`已复制节点配置: ${node.name}`);
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">流程逻辑控制节点</h1>
        <p className="text-[#9CA3AF]">管理和配置流程编排中的逻辑控制节点</p>
      </div>

      {/* 操作栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索逻辑节点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-72"
              />
            </div>

            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
              ))}
            </select>

            {/* 状态筛选 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="active">可用</option>
              <option value="draft">草稿</option>
              <option value="deprecated">已废弃</option>
            </select>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建逻辑节点
          </button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧分类统计 */}
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 sticky top-8">
            <h3 className="text-[#F3F4F6] font-semibold mb-4">逻辑节点分类</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#0066FF]/10 text-[#0066FF] border border-blue-500/30'
                      : 'text-[#D1D5DB] hover:bg-[#181F32] border border-transparent'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[#6B7280]">{cat.count}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#2A354D]">
              <h4 className="text-[#F3F4F6] font-medium mb-3 text-sm">快速统计</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">总计使用</span>
                  <span className="text-[#F3F4F6] font-medium">
                    {mockLogicNodes.reduce((sum, n) => sum + n.usageCount, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">活跃节点</span>
                  <span className="text-[#00C853] font-medium">
                    {mockLogicNodes.filter(n => n.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">废弃节点</span>
                  <span className="text-[#FF3B30] font-medium">
                    {mockLogicNodes.filter(n => n.status === 'deprecated').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧节点列表 */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[#9CA3AF] text-sm">
              找到 <span className="text-[#F3F4F6] font-medium">{filteredNodes.length}</span> 个逻辑节点
            </p>
          </div>

          <div className="space-y-4">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5 hover:border-[#2A354D] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#181F32] rounded-lg shrink-0">
                      {node.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[#F3F4F6] font-medium text-lg">{node.name}</h3>
                        {getStatusBadge(node.status)}
                      </div>
                      <p className="text-[#9CA3AF] text-sm mb-3">{node.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[#6B7280]">版本:</span>
                          <span className="text-[#D1D5DB]">v{node.version}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#6B7280]">分类:</span>
                          <span className="text-[#0066FF]">{getCategoryName(node.category)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#6B7280]">使用次数:</span>
                          <span className="text-[#00C853]">{node.usageCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewDetail(node)}
                      className="p-2 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyNode(node)}
                      className="p-2 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded-lg transition-colors"
                      title="复制配置"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded-lg transition-colors"
                      title="编辑配置"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 配置模板预览 */}
                <div className="mt-4 pt-4 border-t border-[#2A354D]">
                  <div className="flex items-center gap-2 mb-2">
                    <FileJson className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#9CA3AF] text-sm font-medium">配置模板预览</span>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 font-mono text-xs text-[#9CA3AF] overflow-x-auto">
                    <pre>{JSON.stringify(node.configTemplate, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ))}

            {filteredNodes.length === 0 && (
              <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-12 text-center">
                <p className="text-[#6B7280]">暂无匹配的逻辑节点</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      {showDetail && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#181F32] rounded-lg">
                  {selectedNode.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#F3F4F6]">{selectedNode.name}</h3>
                  <p className="text-[#9CA3AF] text-sm">ID: {selectedNode.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedNode.status)}
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <p className="text-[#D1D5DB] mb-6">{selectedNode.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#181F32] rounded-lg p-4">
                  <p className="text-[#6B7280] text-xs mb-1">版本</p>
                  <p className="text-[#F3F4F6] font-medium">v{selectedNode.version}</p>
                </div>
                <div className="bg-[#181F32] rounded-lg p-4">
                  <p className="text-[#6B7280] text-xs mb-1">分类</p>
                  <p className="text-[#F3F4F6] font-medium">{getCategoryName(selectedNode.category)}</p>
                </div>
                <div className="bg-[#181F32] rounded-lg p-4">
                  <p className="text-[#6B7280] text-xs mb-1">使用次数</p>
                  <p className="text-[#F3F4F6] font-medium">{selectedNode.usageCount}</p>
                </div>
                <div className="bg-[#181F32] rounded-lg p-4">
                  <p className="text-[#6B7280] text-xs mb-1">状态</p>
                  <p className="text-[#F3F4F6] font-medium">
                    {selectedNode.status === 'active' ? '可用' : 
                     selectedNode.status === 'draft' ? '草稿' : '已废弃'}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-[#F3F4F6] font-medium mb-3 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  配置模板
                </h4>
                <div className="bg-[#111625] rounded-lg p-4 font-mono text-sm text-[#D1D5DB] overflow-x-auto">
                  <pre>{JSON.stringify(selectedNode.configTemplate, null, 2)}</pre>
                </div>
              </div>

              <div className="bg-[#0066FF]/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-[#0066FF] font-medium mb-2">使用说明</h4>
                <ul className="text-[#9CA3AF] text-sm space-y-1 list-disc list-inside">
                  <li>将此节点拖拽到流程画布中</li>
                  <li>根据配置模板填写必要参数</li>
                  <li>连接上下游节点以构建完整流程</li>
                  <li>测试验证逻辑正确性</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                关闭
              </button>
              <button
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                使用此节点
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新建逻辑节点弹窗 */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">新建逻辑节点</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">节点名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入节点名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">节点描述</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入节点描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">节点类型</label>
                <select className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">配置模板 (JSON)</label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder='{"key": "value"}'
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
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
