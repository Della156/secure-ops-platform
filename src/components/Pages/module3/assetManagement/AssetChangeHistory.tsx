'use client';

import { useState } from 'react';
import { Clock, User, Edit3, Trash2, Plus, Search, Filter } from 'lucide-react';

const mockHistory = [
  { id: 'chg-001', assetName: 'Web服务器-01', changeType: 'update', operator: '管理员', time: '2024-01-15 10:30:22', description: '更新系统配置' },
  { id: 'chg-002', assetName: '数据库-01', changeType: 'create', operator: '运维人员', time: '2024-01-15 09:15:45', description: '新增数据库实例' },
  { id: 'chg-003', assetName: '终端PC-001', changeType: 'update', operator: '管理员', time: '2024-01-14 16:22:18', description: '更新安全补丁' },
  { id: 'chg-004', assetName: '防火墙-01', changeType: 'update', operator: '安全管理员', time: '2024-01-14 14:08:33', description: '更新访问规则' },
  { id: 'chg-005', assetName: 'Web服务器-02', changeType: 'delete', operator: '管理员', time: '2024-01-13 11:45:00', description: '删除过期服务器' },
];

const getChangeTypeInfo = (type: string) => {
  switch (type) {
    case 'create': return { icon: Plus, color: 'text-green-400', bg: 'bg-green-500/20', text: '新增' };
    case 'update': return { icon: Edit3, color: 'text-blue-400', bg: 'bg-blue-500/20', text: '修改' };
    case 'delete': return { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/20', text: '删除' };
    default: return { icon: Edit3, color: 'text-gray-400', bg: 'bg-gray-500/20', text: '未知' };
  }
};

export function AssetChangeHistory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = mockHistory.filter(item => 
    item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">资产变更记录</h1>
          <p className="text-slate-400 mt-1">追踪资产变更历史</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索资产名称或操作人..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Filter className="w-3.5 h-3.5" />筛选
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">变更类型</th>
              <th className="text-left px-4 py-2.5">资产名称</th>
              <th className="text-left px-4 py-2.5">操作人</th>
              <th className="text-left px-4 py-2.5">变更时间</th>
              <th className="text-left px-4 py-2.5">变更描述</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map(item => {
              const changeInfo = getChangeTypeInfo(item.changeType);
              const Icon = changeInfo.icon;
              return (
                <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded ${changeInfo.bg} ${changeInfo.color}`}>
                      <Icon className="w-3 h-3" />
                      {changeInfo.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{item.assetName}</td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3" />{item.operator}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />{item.time}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{item.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {filteredHistory.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300" disabled>‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}