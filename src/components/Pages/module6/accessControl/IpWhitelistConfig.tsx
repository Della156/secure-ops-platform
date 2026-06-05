'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Upload, Download, Filter, Globe } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface IpRule {
  id: string;
  name: string;
  type: 'whitelist' | 'blacklist';
  ipAddress: string;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export function IpWhitelistConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const mockData: IpRule[] = [
    { id: 'IP-001', name: '公司内网IP段', type: 'whitelist', ipAddress: '192.168.1.0/24', description: '允许公司内网访问', status: 'active', createTime: '2026-01-10 09:00:00' },
    { id: 'IP-002', name: '总部办公网', type: 'whitelist', ipAddress: '10.0.0.0/8', description: '总部办公网络', status: 'active', createTime: '2026-01-15 14:30:00' },
    { id: 'IP-003', name: '恶意IP-1', type: 'blacklist', ipAddress: '203.0.113.45', description: '多次攻击尝试', status: 'active', createTime: '2026-02-20 10:00:00' },
    { id: 'IP-004', name: 'VPN接入IP', type: 'whitelist', ipAddress: '172.16.0.0/16', description: 'VPN接入网段', status: 'active', createTime: '2026-03-01 16:00:00' },
    { id: 'IP-005', name: '境外恶意IP段', type: 'blacklist', ipAddress: '45.33.32.0/24', description: '境外攻击源', status: 'active', createTime: '2026-04-15 11:00:00' },
    { id: 'IP-006', name: '测试环境IP', type: 'whitelist', ipAddress: '192.168.100.0/24', description: '测试环境网段', status: 'inactive', createTime: '2026-05-01 09:00:00' },
  ];

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || item.type === filterType)
  );

  const stats = {
    whitelist: mockData.filter(r => r.type === 'whitelist').length,
    blacklist: mockData.filter(r => r.type === 'blacklist').length,
    active: mockData.filter(r => r.status === 'active').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">IP白名单/黑名单规则配置</h2>
          <p className="text-sm text-gray-400 mt-1">管理IP访问控制规则，配置允许或拒绝的IP地址</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#20293F] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            批量导入
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            新增规则
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">白名单规则</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.whitelist}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">黑名单规则</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.blacklist}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">已启用规则</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.active}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索规则名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部类型</option>
              <option value="whitelist">白名单</option>
              <option value="blacklist">黑名单</option>
            </select>
          </div>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-2 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">规则名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">IP地址</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">描述</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
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
                  <span className={`px-2 py-1 rounded text-xs ${item.type === 'whitelist' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {item.type === 'whitelist' ? '白名单' : '黑名单'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.ipAddress}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {item.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title="新增IP规则">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">规则名称</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="请输入规则名称" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">规则类型</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ruleType" defaultChecked className="text-blue-600" />
                <span className="text-sm text-gray-300">白名单</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ruleType" className="text-blue-600" />
                <span className="text-sm text-gray-300">黑名单</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">IP地址</label>
            <input type="text" className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" placeholder="支持IP地址或CIDR格式，如：192.168.1.0/24" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea className="w-full bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm h-20" placeholder="规则描述" />
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

export default IpWhitelistConfig;