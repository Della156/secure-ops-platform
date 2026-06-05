'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Save, Eye, Key, Database, Globe } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface GlobalParam {
  id: string;
  name: string;
  key: string;
  value: string;
  category: 'api' | 'database' | 'system' | 'security';
  encrypted: boolean;
  description: string;
}

export function GlobalParamConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const params: GlobalParam[] = [
    { id: 'GP-001', name: '短信接口地址', key: 'sms.api.url', value: 'https://api.example.com/sms', category: 'api', encrypted: false, description: '短信发送服务接口地址' },
    { id: 'GP-002', name: '邮件服务器地址', key: 'email.smtp.host', value: 'smtp.example.com', category: 'api', encrypted: false, description: 'SMTP邮件服务器地址' },
    { id: 'GP-003', name: '数据库连接地址', key: 'database.host', value: 'db.example.com', category: 'database', encrypted: false, description: '主数据库连接地址' },
    { id: 'GP-004', name: '数据库用户名', key: 'database.username', value: 'admin', category: 'database', encrypted: false, description: '数据库登录用户名' },
    { id: 'GP-005', name: '数据库密码', key: 'database.password', value: '******', category: 'database', encrypted: true, description: '数据库登录密码（加密存储）' },
    { id: 'GP-006', name: 'API密钥', key: 'api.secret.key', value: '******', category: 'security', encrypted: true, description: '外部API调用密钥' },
    { id: 'GP-007', name: 'JWT密钥', key: 'jwt.secret', value: '******', category: 'security', encrypted: true, description: 'JWT令牌签名密钥' },
    { id: 'GP-008', name: '系统日志路径', key: 'system.log.path', value: '/var/log/security/', category: 'system', encrypted: false, description: '系统日志存储路径' },
    { id: 'GP-009', name: '临时文件目录', key: 'system.temp.dir', value: '/tmp/security/', category: 'system', encrypted: false, description: '临时文件存储目录' },
    { id: 'GP-010', name: 'Elasticsearch地址', key: 'es.host', value: 'es.example.com:9200', category: 'api', encrypted: false, description: 'Elasticsearch服务地址' },
  ];

  const getCategoryConfig = (category: GlobalParam['category']) => {
    switch (category) {
      case 'api': return { icon: <Globe className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'API配置' };
      case 'database': return { icon: <Database className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-500/20', label: '数据库' };
      case 'system': return { icon: <Save className="w-4 h-4" />, color: 'text-gray-400', bg: 'bg-gray-500/20', label: '系统' };
      case 'security': return { icon: <Key className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-500/20', label: '安全' };
    }
  };

  const filteredParams = params.filter(param => {
    const matchesSearch = param.name.toLowerCase().includes(searchTerm.toLowerCase()) || param.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">全局参数配置</h2>
          <p className="text-sm text-gray-400 mt-1">实现短信接口、ELINK接口地址等全局参数配置</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          新增参数
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索参数名称或键..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">全部分类</option>
            <option value="api">API配置</option>
            <option value="database">数据库</option>
            <option value="system">系统</option>
            <option value="security">安全</option>
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">参数名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">参数键</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">分类</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">值</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">描述</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredParams.map((param) => {
              const categoryConfig = getCategoryConfig(param.category);
              return (
                <tr key={param.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{param.name}</div>
                    <div className="text-xs text-gray-500">{param.id}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{param.key}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${categoryConfig.bg} ${categoryConfig.color} flex items-center gap-1`}>
                      {categoryConfig.icon}
                      {categoryConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300 font-mono">{param.value}</span>
                      {param.encrypted && (
                        <Eye className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 max-w-[200px] truncate">{param.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-yellow-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredParams.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增全局参数">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">参数名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入参数名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">参数键</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm font-mono" placeholder="如：api.url" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">参数值</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入参数值" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">分类</label>
            <select className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option value="api">API配置</option>
              <option value="database">数据库</option>
              <option value="system">系统</option>
              <option value="security">安全</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">加密存储</div>
              <div className="text-xs text-gray-500 mt-0.5">对敏感参数进行加密存储</div>
            </div>
            <button className="w-12 h-6 rounded-full bg-blue-600">
              <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
            </button>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" rows={3} placeholder="请输入参数描述" />
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

export default GlobalParamConfig;