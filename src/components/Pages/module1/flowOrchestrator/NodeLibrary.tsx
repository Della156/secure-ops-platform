'use client';

import React, { useState } from 'react';
import { Search, Plus, Download, Upload, FolderOpen, Code, Database, MessageSquare, Shield, Server, Network } from 'lucide-react';

interface NodeCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  nodes: NodeItem[];
}

interface NodeItem {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
}

const mockCategories: NodeCategory[] = [
  {
    id: 'network',
    name: '网络操作',
    icon: <Network className="w-5 h-5" />,
    nodes: [
      { id: 'node-1', name: 'SSH连接', description: '建立SSH连接到目标设备', category: 'network', tags: ['SSH', '连接', '设备'] },
      { id: 'node-2', name: 'API调用', description: '调用RESTful API接口', category: 'network', tags: ['API', 'REST', 'HTTP'] },
      { id: 'node-3', name: 'SNMP查询', description: '通过SNMP协议获取设备信息', category: 'network', tags: ['SNMP', '设备', '监控'] },
      { id: 'node-4', name: 'TCP扫描', description: '扫描目标主机端口', category: 'network', tags: ['TCP', '端口', '扫描'] },
    ],
  },
  {
    id: 'data',
    name: '数据处理',
    icon: <Database className="w-5 h-5" />,
    nodes: [
      { id: 'node-5', name: '数据库查询', description: '执行SQL查询语句', category: 'data', tags: ['SQL', '数据库', '查询'] },
      { id: 'node-6', name: '数据转换', description: '转换数据格式', category: 'data', tags: ['转换', '格式', 'JSON'] },
      { id: 'node-7', name: '数据过滤', description: '根据条件过滤数据', category: 'data', tags: ['过滤', '条件', '筛选'] },
      { id: 'node-8', name: '数据聚合', description: '聚合统计数据', category: 'data', tags: ['聚合', '统计', '分组'] },
    ],
  },
  {
    id: 'security',
    name: '安全操作',
    icon: <Shield className="w-5 h-5" />,
    nodes: [
      { id: 'node-9', name: '漏洞扫描', description: '扫描目标系统漏洞', category: 'security', tags: ['漏洞', '扫描', '安全'] },
      { id: 'node-10', name: '恶意软件检测', description: '检测恶意软件', category: 'security', tags: ['恶意软件', '检测', '威胁'] },
      { id: 'node-11', name: '访问控制', description: '管理访问权限', category: 'security', tags: ['权限', 'ACL', '访问'] },
      { id: 'node-12', name: '加密解密', description: '加密或解密数据', category: 'security', tags: ['加密', '解密', 'AES'] },
    ],
  },
  {
    id: 'notification',
    name: '通知告警',
    icon: <MessageSquare className="w-5 h-5" />,
    nodes: [
      { id: 'node-13', name: '发送邮件', description: '发送邮件通知', category: 'notification', tags: ['邮件', '通知', 'SMTP'] },
      { id: 'node-14', name: '发送短信', description: '发送短信告警', category: 'notification', tags: ['短信', '告警', 'SMS'] },
      { id: 'node-15', name: 'Webhook通知', description: '发送Webhook请求', category: 'notification', tags: ['Webhook', '回调', 'API'] },
      { id: 'node-16', name: '日志记录', description: '记录日志到文件', category: 'notification', tags: ['日志', '记录', '文件'] },
    ],
  },
  {
    id: 'system',
    name: '系统操作',
    icon: <Server className="w-5 h-5" />,
    nodes: [
      { id: 'node-17', name: '执行命令', description: '执行系统命令', category: 'system', tags: ['命令', 'Shell', '脚本'] },
      { id: 'node-18', name: '文件操作', description: '读取或写入文件', category: 'system', tags: ['文件', '读写', 'IO'] },
      { id: 'node-19', name: '进程管理', description: '管理系统进程', category: 'system', tags: ['进程', '管理', 'PID'] },
      { id: 'node-20', name: '定时任务', description: '创建定时任务', category: 'system', tags: ['定时', '计划', 'Cron'] },
    ],
  },
];

export function NodeLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('network');
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);

  const filteredCategories = mockCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node =>
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(category => category.nodes.length > 0);

  const activeNodes = filteredCategories.find(c => c.id === activeCategory)?.nodes || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">节点库管理</h1>
          <p className="text-[#9CA3AF]">浏览和管理可编排的节点库</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            导入节点
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            创建节点
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="搜索节点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-56 flex-shrink-0">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <h3 className="text-sm font-medium text-[#D1D5DB] mb-4">节点分类</h3>
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[#0066FF]/20 text-[#0066FF]'
                      : 'text-[#D1D5DB] hover:bg-[#181F32]'
                  }`}
                >
                  <span className={activeCategory === category.id ? 'text-[#0066FF]' : 'text-[#9CA3AF]'}>
                    {category.icon}
                  </span>
                  <span className="text-sm">{category.name}</span>
                  <span className="ml-auto text-xs text-[#6B7280] bg-[#181F32] px-2 py-0.5 rounded-full">
                    {category.nodes.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2A354D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#9CA3AF]" />
                <h3 className="text-lg font-semibold text-[#F3F4F6]">
                  {filteredCategories.find(c => c.id === activeCategory)?.name || '节点列表'}
                </h3>
              </div>
              <span className="text-sm text-[#9CA3AF]">
                共 {activeNodes.length} 个节点
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 bg-[#181F32] rounded-xl cursor-pointer transition-all ${
                    selectedNode?.id === node.id
                      ? 'ring-2 ring-[#0066FF] border border-[#0066FF]/50'
                      : 'border border-transparent hover:border-[#2A354D]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-[#F3F4F6] font-medium">{node.name}</h4>
                    <Code className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <p className="text-sm text-[#9CA3AF] mb-3 line-clamp-2">{node.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {node.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#2A354D]/50 rounded text-xs text-[#D1D5DB]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {activeNodes.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Search className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
                <p className="text-[#6B7280]">未找到匹配的节点</p>
              </div>
            )}
          </div>
        </div>

        {selectedNode && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
              <h3 className="text-sm font-medium text-[#D1D5DB] mb-4">节点详情</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">节点名称</label>
                  <p className="text-[#F3F4F6] font-medium">{selectedNode.name}</p>
                </div>

                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">描述</label>
                  <p className="text-sm text-[#D1D5DB]">{selectedNode.description}</p>
                </div>

                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">分类</label>
                  <span className="px-2 py-1 bg-[#0066FF]/20 text-[#0066FF] rounded text-xs">
                    {selectedNode.category}
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-2">标签</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#181F32] rounded text-xs text-[#D1D5DB]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A354D]">
                  <label className="block text-xs text-[#9CA3AF] mb-2">输入参数</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-[#181F32] rounded">
                      <span className="text-sm text-[#D1D5DB]">target</span>
                      <span className="text-xs text-[#0066FF]">string</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#181F32] rounded">
                      <span className="text-sm text-[#D1D5DB]">options</span>
                      <span className="text-xs text-[#6366F1]">object</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A354D]">
                  <label className="block text-xs text-[#9CA3AF] mb-2">输出结果</label>
                  <div className="flex items-center justify-between p-2 bg-[#181F32] rounded">
                    <span className="text-sm text-[#D1D5DB]">result</span>
                    <span className="text-xs text-[#00C853]">any</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
                  添加到画布
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}