'use client';

import React, { useState } from 'react';
import { Search, Plus, CheckCircle2, AlertCircle, Clock, X, Copy, Check } from 'lucide-react';

interface RegistrationRequest {
  id: string;
  taskName: string;
  requester: string;
  requestTime: string;
  status: 'pending' | 'approved' | 'rejected';
  sourceIP: string;
  protocol: string;
}

const mockData: RegistrationRequest[] = [
  { id: 'REG-001', taskName: '安全日志采集任务', requester: 'admin@company.com', requestTime: '2026-05-24 15:30:00', status: 'pending', sourceIP: '192.168.1.100', protocol: 'REST' },
  { id: 'REG-002', taskName: '漏洞扫描任务', requester: 'secops@company.com', requestTime: '2026-05-24 14:20:00', status: 'approved', sourceIP: '192.168.1.101', protocol: 'SSH' },
  { id: 'REG-003', taskName: '资产发现任务', requester: 'dev@company.com', requestTime: '2026-05-24 11:15:00', status: 'rejected', sourceIP: '192.168.1.102', protocol: 'SNMP' },
  { id: 'REG-004', taskName: '威胁情报同步', requester: 'admin@company.com', requestTime: '2026-05-23 16:45:00', status: 'approved', sourceIP: '192.168.1.103', protocol: 'REST' },
  { id: 'REG-005', taskName: '流量分析任务', requester: 'analyst@company.com', requestTime: '2026-05-23 09:00:00', status: 'pending', sourceIP: '192.168.1.104', protocol: 'SQL' },
];

export function TaskOnlineRegistration() {
  const [data, setData] = useState<RegistrationRequest[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RegistrationRequest | null>(null);

  const filteredData = data.filter(item => {
    const matchQuery = item.taskName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.requester.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchQuery && matchStatus;
  });

  const handleApprove = (id: string) => {
    setData(data.map(item => item.id === id ? { ...item, status: 'approved' } : item));
  };

  const handleReject = (id: string) => {
    setData(data.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]/30',
      approved: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30',
      rejected: 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30',
    };
    const labels = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
    };
    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      approved: <CheckCircle2 className="w-3 h-3 mr-1" />,
      rejected: <AlertCircle className="w-3 h-3 mr-1" />,
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleViewDetails = (item: RegistrationRequest) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务在线注册管理</h1>
        <p className="text-[#9CA3AF]">审核和管理自动化任务的在线注册请求</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索任务名称或请求者..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            手动注册
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">请求者</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">来源IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">协议类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">请求时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.taskName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.requester}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.sourceIP}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30">
                    {item.protocol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.requestTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="px-3 py-1.5 text-sm text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                    >
                      查看详情
                    </button>
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1.5 text-sm text-[#00C853] hover:text-[#36D399] hover:bg-[#00C853]/10 rounded transition-colors"
                        >
                          通过
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1.5 text-sm text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        >
                          拒绝
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">暂无注册请求</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">注册请求详情</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">请求ID</label>
                  <p className="text-[#F3F4F6]">{selectedItem.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">状态</label>
                  {getStatusBadge(selectedItem.status)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">任务名称</label>
                <p className="text-[#F3F4F6]">{selectedItem.taskName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">请求者</label>
                  <p className="text-[#F3F4F6]">{selectedItem.requester}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">来源IP</label>
                  <p className="text-[#F3F4F6]">{selectedItem.sourceIP}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">协议类型</label>
                  <p className="text-[#F3F4F6]">{selectedItem.protocol}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">请求时间</label>
                  <p className="text-[#F3F4F6]">{selectedItem.requestTime}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">注册凭证</label>
                <div className="flex items-center gap-2 bg-[#181F32] rounded-lg p-3">
                  <code className="flex-1 text-sm text-[#9CA3AF] font-mono truncate">
                    token_abc123xyz789
                  </code>
                  <button className="p-1.5 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#2A354D] rounded transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
                关闭
              </button>
              {selectedItem.status === 'pending' && (
                <>
                  <button onClick={() => { handleReject(selectedItem.id); setIsModalOpen(false); }} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#FF3B30] rounded-lg transition-colors">
                    拒绝
                  </button>
                  <button onClick={() => { handleApprove(selectedItem.id); setIsModalOpen(false); }} className="px-4 py-2 bg-[#00C853] hover:bg-[#00A843] text-[#F3F4F6] rounded-lg transition-colors">
                    通过
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}