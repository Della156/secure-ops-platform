'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle, Database, Cloud, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface DataSource {
  id: string;
  name: string;
  type: 'mysql' | 'postgres' | 'mongodb' | 'api' | 'file';
  host: string;
  port: string;
  database: string;
  status: 'connected' | 'disconnected' | 'error';
  createTime: string;
  updateTime: string;
}

export function DataSource() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const mockData: DataSource[] = [
    { id: 'DS-001', name: 'MySQL主库', type: 'mysql', host: '192.168.1.10', port: '3306', database: 'security_db', status: 'connected', createTime: '2026-01-10 09:00:00', updateTime: '2026-06-04 10:30:00' },
    { id: 'DS-002', name: 'CMDB系统API', type: 'api', host: 'cmdb.internal.com', port: '443', database: '-', status: 'connected', createTime: '2026-02-15 14:30:00', updateTime: '2026-06-04 09:15:00' },
    { id: 'DS-003', name: 'Elasticsearch集群', type: 'mongodb', host: 'es-cluster.internal', port: '9200', database: 'logs', status: 'connected', createTime: '2026-03-01 10:00:00', updateTime: '2026-06-04 08:00:00' },
    { id: 'DS-004', name: 'ClickHouse报表库', type: 'postgres', host: '192.168.1.15', port: '8123', database: 'reporting', status: 'disconnected', createTime: '2026-04-20 16:00:00', updateTime: '2026-06-03 17:45:00' },
    { id: 'DS-005', name: '威胁情报文件源', type: 'file', host: '/data/feed', port: '-', database: 'threat_intel', status: 'connected', createTime: '2026-05-05 11:00:00', updateTime: '2026-06-04 10:00:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mysql':
      case 'postgres':
        return <Database className="w-4 h-4" />;
      case 'mongodb':
        return <Cloud className="w-4 h-4" />;
      case 'api':
        return <FileText className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mysql': return 'MySQL';
      case 'postgres': return 'PostgreSQL';
      case 'mongodb': return 'MongoDB';
      case 'api': return 'REST API';
      case 'file': return '文件源';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400';
      case 'disconnected': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return '已连接';
      case 'disconnected': return '未连接';
      case 'error': return '连接错误';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">数据源管理</h2>
          <p className="text-sm text-gray-400 mt-1">管理同步任务的数据源配置，支持多种类型数据源</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增数据源
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索数据源名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">数据源名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">连接信息</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">更新时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-[#2A354D] text-gray-300">
                    {getTypeIcon(item.type)}
                    {getTypeLabel(item.type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  <div>{item.host}:{item.port}</div>
                  {item.database !== '-' && <div className="text-xs text-gray-500">{item.database}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.updateTime}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-green-400" title="测试连接">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredData.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增数据源">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">数据源名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入数据源名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">数据源类型</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="mysql">MySQL</option>
              <option value="postgres">PostgreSQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="api">REST API</option>
              <option value="file">文件源</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">主机地址</label>
              <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="主机IP或域名" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">端口</label>
              <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="端口号" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">数据库名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="数据库名称（文件源可留空）" />
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

export default DataSource;