'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, ChevronDown, Check } from 'lucide-react';

interface RolePermission {
  id: string;
  roleName: string;
  permissions: { module: string; actions: string[] }[];
}

export function RoleResourcePermission() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const mockData: RolePermission[] = [
    {
      id: 'R001',
      roleName: '超级管理员',
      permissions: [
        { module: '数据同步配置', actions: ['查看', '新增', '编辑', '删除', '执行'] },
        { module: '权限配置', actions: ['查看', '新增', '编辑', '删除'] },
        { module: '系统监控', actions: ['查看', '操作'] },
      ]
    },
    {
      id: 'R002',
      roleName: '安全管理员',
      permissions: [
        { module: '数据同步配置', actions: ['查看'] },
        { module: '权限配置', actions: ['查看', '编辑'] },
        { module: '系统监控', actions: ['查看'] },
      ]
    },
    {
      id: 'R003',
      roleName: '运维工程师',
      permissions: [
        { module: '数据同步配置', actions: ['查看', '执行'] },
        { module: '系统监控', actions: ['查看', '操作'] },
      ]
    },
    {
      id: 'R004',
      roleName: '安全分析师',
      permissions: [
        { module: '系统监控', actions: ['查看'] },
        { module: '告警管理', actions: ['查看', '处理'] },
      ]
    },
  ];

  const filteredData = mockData.filter(item => 
    item.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allModules = ['数据同步配置', '权限配置', '系统监控', '告警管理', '日志查询', '报表中心'];
  const allActions = ['查看', '新增', '编辑', '删除', '执行', '处理'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">角色资源权限</h2>
          <p className="text-sm text-gray-400 mt-1">细粒度控制角色对资源的访问权限</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
          <Plus className="w-4 h-4" />
          新增权限
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索角色名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredData.map(role => (
          <div key={role.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between px-4 py-3 bg-[#111625] cursor-pointer"
              onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
            >
              <span className="font-medium text-white">{role.roleName}</span>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-blue-400">
                  <Edit className="w-3 h-3" />
                  编辑
                </button>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedRole === role.id ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {expandedRole === role.id && (
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {allModules.map(module => {
                    const modulePerms = role.permissions.find(p => p.module === module);
                    return (
                      <div key={module} className="bg-[#111625] rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-2">{module}</div>
                        <div className="flex flex-wrap gap-1">
                          {allActions.map(action => {
                            const hasAction = modulePerms?.actions.includes(action);
                            return (
                              <span 
                                key={action}
                                className={`px-2 py-0.5 rounded text-xs ${hasAction ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}
                              >
                                {hasAction && <Check className="w-3 h-3 inline mr-1" />}
                                {action}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleResourcePermission;