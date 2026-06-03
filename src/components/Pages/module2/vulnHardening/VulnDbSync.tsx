'use client';

import React, { useState } from 'react';
import { Database, RefreshCw, Plus, Edit2, Trash2, Link, ExternalLink, CheckCircle } from 'lucide-react';

interface VulnDbSource {
  id: string;
  name: string;
  type: 'CVE' | 'CNNVD' | 'CNVD' | 'Custom';
  status: 'syncing' | 'synced' | 'error';
  lastSync: string;
  vulnCount: number;
  syncInterval: string;
}

interface VulnItem {
  id: string;
  cveId: string;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  published: string;
  patched: boolean;
}

const mockDbSources: VulnDbSource[] = [
  { id: 'DB-001', name: 'CVE漏洞库', type: 'CVE', status: 'synced', lastSync: '2026-05-29 14:30:00', vulnCount: 12580, syncInterval: '每小时' },
  { id: 'DB-002', name: 'CNNVD漏洞库', type: 'CNNVD', status: 'syncing', lastSync: '2026-05-29 14:00:00', vulnCount: 8920, syncInterval: '每6小时' },
  { id: 'DB-003', name: 'CNVD漏洞库', type: 'CNVD', status: 'synced', lastSync: '2026-05-29 12:00:00', vulnCount: 6750, syncInterval: '每日' },
];

const mockVulnItems: VulnItem[] = [
  { id: 'VULN-001', cveId: 'CVE-2024-21762', name: 'Apache HTTP Server 远程代码执行漏洞', severity: 'Critical', published: '2024-02-14', patched: false },
  { id: 'VULN-002', cveId: 'CVE-2024-12345', name: 'OpenSSL 拒绝服务漏洞', severity: 'High', published: '2024-03-20', patched: true },
  { id: 'VULN-003', cveId: 'CNNVD-202404-1234', name: 'Web应用SQL注入漏洞', severity: 'High', published: '2024-04-15', patched: false },
  { id: 'VULN-004', cveId: 'CVE-2024-67890', name: 'Linux内核权限提升漏洞', severity: 'Critical', published: '2024-05-10', patched: true },
  { id: 'VULN-005', cveId: 'CNVD-202405-6789', name: 'SSH服务弱口令漏洞', severity: 'Medium', published: '2024-05-20', patched: true },
];

export function VulnDbSync() {
  const [dbSources, setDbSources] = useState(mockDbSources);
  const [vulnItems, setVulnItems] = useState(mockVulnItems);
  const [activeTab, setActiveTab] = useState<'sources' | 'vulns'>('sources');

  const handleSync = (id: string) => {
    setDbSources(dbSources.map(src => 
      src.id === id ? { ...src, status: 'syncing' } : src
    ));
    setTimeout(() => {
      setDbSources(dbSources.map(src => 
        src.id === id ? { ...src, status: 'synced', lastSync: new Date().toLocaleString('zh-CN') } : src
      ));
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-500/20 text-green-400';
      case 'syncing': return 'bg-blue-500/20 text-blue-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全漏洞库管理同步</h2>
        <p className="text-sm text-gray-400 mt-1">与外部漏洞库（如CVE、CNNVD）的同步，漏洞信息的同步，漏洞与补丁/修复脚本关联</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'sources' 
              ? 'bg-blue-600 text-white' 
              : 'bg-[#2A354D] text-gray-400 hover:text-white'
          }`}
        >
          漏洞库源管理
        </button>
        <button
          onClick={() => setActiveTab('vulns')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'vulns' 
              ? 'bg-blue-600 text-white' 
              : 'bg-[#2A354D] text-gray-400 hover:text-white'
          }`}
        >
          漏洞信息管理
        </button>
      </div>

      {activeTab === 'sources' ? (
        <>
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">漏洞库源列表</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                新增漏洞库源
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {dbSources.map((source) => (
              <div key={source.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">{source.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(source.status)}`}>
                        {source.status === 'synced' ? '已同步' : source.status === 'syncing' ? '同步中' : '同步失败'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">漏洞数量</p>
                        <p className="text-gray-300">{source.vulnCount.toLocaleString()} 条</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">同步间隔</p>
                        <p className="text-gray-300">{source.syncInterval}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">最后同步</p>
                        <p className="text-gray-300">{source.lastSync}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">库类型</p>
                        <p className="text-gray-300">{source.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-[#2A354D] hover:bg-[#3D4A61] rounded-lg text-gray-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleSync(source.id)}
                      disabled={source.status === 'syncing'}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                      {source.status === 'syncing' ? '同步中' : '立即同步'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  placeholder="搜索漏洞编号或名称..." 
                  className="px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm"
                />
                <select className="px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm">
                  <option value="">全部严重程度</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                新增漏洞
              </button>
            </div>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A354D]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">漏洞编号</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">漏洞名称</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">严重程度</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">发布时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">补丁状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {vulnItems.map((vuln) => (
                  <tr key={vuln.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3 text-sm text-blue-400">
                      <a href="#" className="flex items-center gap-1 hover:underline">
                        {vuln.cveId}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{vuln.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{vuln.published}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs ${vuln.patched ? 'text-green-400' : 'text-yellow-400'}`}>
                        <CheckCircle className="w-4 h-4" />
                        {vuln.patched ? '已修复' : '待修复'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="关联补丁">
                          <Link className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="编辑">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}