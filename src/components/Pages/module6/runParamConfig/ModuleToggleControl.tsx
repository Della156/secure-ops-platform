'use client';

import React, { useState } from 'react';
import { Save, Power, ToggleLeft, ToggleRight, RefreshCw, AlertTriangle } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled';
  dependencies?: string[];
}

export function ModuleToggleControl() {
  const [modules, setModules] = useState<Module[]>([
    { id: 'auto-task', name: '自动任务管理', description: '自动化任务编排与执行', status: 'enabled' },
    { id: 'situation-screen', name: '安全态势大屏', description: '实时安全态势可视化展示', status: 'enabled' },
    { id: 'threat-intel', name: '威胁情报', description: '威胁情报收集与分析', status: 'enabled' },
    { id: 'asset-management', name: '资产管理', description: 'IT资产全生命周期管理', status: 'enabled' },
    { id: 'vulnerability', name: '漏洞管理', description: '漏洞扫描与修复跟踪', status: 'disabled' },
    { id: 'compliance', name: '合规管理', description: '安全合规检查与报告', status: 'enabled' },
    { id: 'audit-log', name: '审计日志', description: '操作审计与日志管理', status: 'enabled' },
    { id: 'report-center', name: '报表中心', description: '安全报表生成与导出', status: 'disabled' },
    { id: 'api-service', name: 'API服务', description: '对外数据接口服务', status: 'enabled' },
    { id: 'mobile-app', name: '移动端应用', description: '移动端安全运维APP', status: 'disabled' },
  ]);

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'enabled' ? 'disabled' : 'enabled' } : m
    ));
  };

  const enabledCount = modules.filter(m => m.status === 'enabled').length;
  const disabledCount = modules.filter(m => m.status === 'disabled').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">功能模块控制</h2>
          <p className="text-sm text-gray-400 mt-1">实现按需启用/停用各功能模块</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{modules.length}</div>
          <div className="text-xs text-gray-500 mt-1">模块总数</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{enabledCount}</div>
          <div className="text-xs text-gray-500 mt-1">已启用</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{disabledCount}</div>
          <div className="text-xs text-gray-500 mt-1">已停用</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">3</div>
          <div className="text-xs text-gray-500 mt-1">待更新</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-[#111625] flex items-center gap-2">
          <Power className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">模块列表</span>
          <button className="ml-auto p-1 hover:bg-[#20293F] rounded text-gray-400 hover:text-blue-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-[#2A354D]">
          {modules.map((module) => (
            <div key={module.id} className="px-4 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-[#111625]">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{module.name}</span>
                  {module.status === 'disabled' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">已停用</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">{module.description}</div>
                {module.dependencies && module.dependencies.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-500">依赖: {module.dependencies.join(', ')}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleModule(module.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  module.status === 'enabled' 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                }`}
              >
                {module.status === 'enabled' ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span className="text-sm">启用</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span className="text-sm">停用</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-yellow-400">注意事项</div>
            <ul className="text-xs text-gray-300 mt-1 space-y-1">
              <li>• 停用模块后，相关功能将对所有用户不可用</li>
              <li>• 部分模块存在依赖关系，停用主模块可能影响依赖模块</li>
              <li>• 模块状态变更后需要重新登录才能生效</li>
              <li>• 建议在业务低峰期进行模块状态变更</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuleToggleControl;