'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, Building2, Users, Search, Download, Upload } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface OrgNode {
  id: string;
  name: string;
  type: 'org' | 'dept' | 'team';
  parentId: string | null;
  leader?: string;
  members: number;
  children?: OrgNode[];
  expanded?: boolean;
}

export function OrgTreeConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);

  const orgTree: OrgNode[] = [
    {
      id: 'org-001', name: '安全运维中心', type: 'org', parentId: null, leader: '张三', members: 120,
      children: [
        { id: 'dept-001', name: '安全分析部', type: 'dept', parentId: 'org-001', leader: '李四', members: 45,
          children: [
            { id: 'team-001', name: '威胁分析组', type: 'team', parentId: 'dept-001', leader: '王五', members: 15 },
            { id: 'team-002', name: '漏洞研究组', type: 'team', parentId: 'dept-001', leader: '赵六', members: 12 },
            { id: 'team-003', name: '数据分析组', type: 'team', parentId: 'dept-001', leader: '钱七', members: 18 },
          ]
        },
        { id: 'dept-002', name: '安全运营部', type: 'dept', parentId: 'org-001', leader: '孙八', members: 50,
          children: [
            { id: 'team-004', name: '应急响应组', type: 'team', parentId: 'dept-002', leader: '周九', members: 20 },
            { id: 'team-005', name: '运维监控组', type: 'team', parentId: 'dept-002', leader: '吴十', members: 15 },
            { id: 'team-006', name: '资产管理组', type: 'team', parentId: 'dept-002', leader: '郑十一', members: 15 },
          ]
        },
        { id: 'dept-003', name: '安全研发部', type: 'dept', parentId: 'org-001', leader: '王十二', members: 25,
          children: [
            { id: 'team-007', name: '平台开发组', type: 'team', parentId: 'dept-003', leader: '陈十三', members: 15 },
            { id: 'team-008', name: '工具开发组', type: 'team', parentId: 'dept-003', leader: '刘十四', members: 10 },
          ]
        },
      ]
    },
  ];

  const toggleExpand = (node: OrgNode) => {
    node.expanded = !node.expanded;
  };

  const renderNode = (node: OrgNode, level = 0) => (
    <div key={node.id}>
      <div 
        className={`flex items-center gap-2 py-2 px-2 rounded hover:bg-[#111625] cursor-pointer ${
          selectedNode?.id === node.id ? 'bg-[#111625]' : ''
        }`}
        onClick={() => {
          setSelectedNode(node);
          if (node.children) toggleExpand(node);
        }}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {node.children && (
          <button onClick={(e) => { e.stopPropagation(); toggleExpand(node); }}>
            {node.expanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          </button>
        )}
        {!node.children && <span className="w-4" />}
        {node.type === 'org' && <Building2 className="w-4 h-4 text-blue-400" />}
        {node.type === 'dept' && <Building2 className="w-4 h-4 text-green-400" />}
        {node.type === 'team' && <Users className="w-4 h-4 text-purple-400" />}
        <span className="text-sm text-white">{node.name}</span>
        <span className="text-xs text-gray-500 ml-auto">{node.members} 人</span>
      </div>
      {node.children && node.expanded && node.children.map(child => renderNode(child, level + 1))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">组织架构树配置</h2>
          <p className="text-sm text-gray-400 mt-1">实现组织架构的树形图可视化展示与编辑</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            导入
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            导出
          </button>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            新增组织
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-[#20293F] border border-[#2A354D] rounded-lg">
          <div className="px-4 py-3 bg-[#111625] border-b border-[#2A354D]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索组织..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="p-2">
            {orgTree.map(node => renderNode(node))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{selectedNode.name}</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#111625] rounded-lg p-3">
                  <div className="text-xs text-gray-500">负责人</div>
                  <div className="text-sm text-white mt-1">{selectedNode.leader || '-'}</div>
                </div>
                <div className="bg-[#111625] rounded-lg p-3">
                  <div className="text-xs text-gray-500">成员数量</div>
                  <div className="text-sm text-white mt-1">{selectedNode.members} 人</div>
                </div>
                <div className="bg-[#111625] rounded-lg p-3">
                  <div className="text-xs text-gray-500">组织类型</div>
                  <div className="text-sm text-white mt-1">
                    {selectedNode.type === 'org' ? '组织' : selectedNode.type === 'dept' ? '部门' : '小组'}
                  </div>
                </div>
                <div className="bg-[#111625] rounded-lg p-3">
                  <div className="text-xs text-gray-500">组织ID</div>
                  <div className="text-sm text-white mt-1">{selectedNode.id}</div>
                </div>
              </div>
              <div className="bg-[#111625] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">子组织</h4>
                {selectedNode.children && selectedNode.children.length > 0 ? (
                  <div className="space-y-2">
                    {selectedNode.children.map(child => (
                      <div key={child.id} className="flex items-center justify-between py-2 border-b border-[#2A354D]">
                        <div className="flex items-center gap-2">
                          {child.type === 'dept' && <Building2 className="w-4 h-4 text-green-400" />}
                          {child.type === 'team' && <Users className="w-4 h-4 text-purple-400" />}
                          <span className="text-sm text-white">{child.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{child.members} 人</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">暂无子组织</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Building2 className="w-12 h-12 mb-3 opacity-50" />
              <p>请选择一个组织节点查看详情</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="新增组织">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">组织名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入组织名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">组织类型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="org">组织</option>
              <option value="dept">部门</option>
              <option value="team">小组</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">上级组织</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="">无（顶级组织）</option>
              <option value="org-001">安全运维中心</option>
              <option value="dept-001">安全分析部</option>
              <option value="dept-002">安全运营部</option>
              <option value="dept-003">安全研发部</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">负责人</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入负责人姓名" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={3} placeholder="请输入组织描述" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#20293F] text-gray-300 rounded hover:bg-[#2A354D]">取消</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default OrgTreeConfig;