'use client';

import React, { useState } from 'react';
import { Search, History, Eye, GitCompare, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PolicyChange {
  id: string;
  policyName: string;
  deviceName: string;
  deviceIp: string;
  changeType: 'add' | 'modify' | 'delete';
  beforeContent: string;
  afterContent: string;
  changeReason: string;
  operator: string;
  changeTime: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'unchecked';
  validateResult?: string;
}

const mockData: PolicyChange[] = [
  { id: 'CHG-001', policyName: '新增HTTP访问控制规则', deviceName: '防火墙-FW-01', deviceIp: '192.168.1.254', changeType: 'add', beforeContent: '', afterContent: '允许192.168.10.0/24访问HTTP服务', changeReason: '新业务上线需求', operator: '张工', changeTime: '2026-06-01 09:30:00', complianceStatus: 'compliant', validateResult: '符合安全基线' },
  { id: 'CHG-002', policyName: '修改ACL规则优先级', deviceName: '路由器-RT-01', deviceIp: '192.168.0.1', changeType: 'modify', beforeContent: 'ACL 100: permit tcp any any eq 80', afterContent: 'ACL 100: permit tcp 192.168.0.0/16 any eq 80', changeReason: '收紧访问范围', operator: '李工', changeTime: '2026-06-01 10:15:00', complianceStatus: 'compliant', validateResult: '符合安全基线' },
  { id: 'CHG-003', policyName: '删除过期VPN策略', deviceName: 'VPN网关-VPN-01', deviceIp: '192.168.1.50', changeType: 'delete', beforeContent: '允许临时账号访问VPN', afterContent: '', changeReason: '清理过期账号', operator: '王工', changeTime: '2026-06-01 08:45:00', complianceStatus: 'unchecked' },
  { id: 'CHG-004', policyName: '调整端口映射规则', deviceName: '防火墙-FW-02', deviceIp: '192.168.1.253', changeType: 'modify', beforeContent: 'DNAT tcp 80->192.168.2.10:80', afterContent: 'DNAT tcp 8080->192.168.2.10:80', changeReason: '端口变更', operator: '赵工', changeTime: '2026-05-31 16:20:00', complianceStatus: 'non-compliant', validateResult: '新端口未在基线范围内' },
  { id: 'CHG-005', policyName: '新增WAF防护规则', deviceName: 'Web防火墙-WAF-01', deviceIp: '192.168.1.20', changeType: 'add', beforeContent: '', afterContent: '启用SQL注入防护规则', changeReason: '安全加固', operator: '刘工', changeTime: '2026-05-31 14:00:00', complianceStatus: 'compliant', validateResult: '符合安全基线' },
];

export function PolicyChangeTrack() {
  const [data] = useState<PolicyChange[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCompliance, setFilterCompliance] = useState('');
  const [selectedChange, setSelectedChange] = useState<PolicyChange | null>(null);

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.policyName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.deviceName.includes(searchKeyword);
    const matchType = !filterType || d.changeType === filterType;
    const matchCompliance = !filterCompliance || d.complianceStatus === filterCompliance;
    return matchKeyword && matchType && matchCompliance;
  });

  const stats = {
    total: data.length,
    add: data.filter(d => d.changeType === 'add').length,
    modify: data.filter(d => d.changeType === 'modify').length,
    delete: data.filter(d => d.changeType === 'delete').length,
    compliant: data.filter(d => d.complianceStatus === 'compliant').length,
  };

  const getChangeTypeBadge = (type: string) => {
    const config: Record<string, { bg: string; label: string }> = {
      add: { bg: 'bg-green-500/20 text-green-400', label: '新增' },
      modify: { bg: 'bg-blue-500/20 text-blue-400', label: '修改' },
      delete: { bg: 'bg-red-500/20 text-red-400', label: '删除' },
    };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${config[type]?.bg}`}>{config[type]?.label}</span>;
  };

  const getComplianceBadge = (status: string) => {
    const config: Record<string, { bg: string; label: string; icon: any }> = {
      compliant: { bg: 'bg-green-500/20 text-green-400', label: '合规', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      'non-compliant': { bg: 'bg-red-500/20 text-red-400', label: '不合规', icon: <XCircle className="w-3 h-3 mr-1" /> },
      unchecked: { bg: 'bg-gray-500/20 text-gray-400', label: '待校验', icon: <Clock className="w-3 h-3 mr-1" /> },
    };
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config[status]?.bg}`}>{config[status]?.icon}{config[status]?.label}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">策略变更跟踪</h2>
        <p className="text-sm text-gray-400 mt-1">查询策略变更历史记录，对比变更前后内容，校验合规性</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">变更记录总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">新增</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.add}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">修改</p>
          <p className="text-2xl font-semibold text-blue-400 mt-1">{stats.modify}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">删除</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">{stats.delete}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">合规</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.compliant}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="搜索策略名称..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部变更类型</option>
              <option value="add">新增</option>
              <option value="modify">修改</option>
              <option value="delete">删除</option>
            </select>
            <select value={filterCompliance} onChange={(e) => setFilterCompliance(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部合规状态</option>
              <option value="compliant">合规</option>
              <option value="non-compliant">不合规</option>
              <option value="unchecked">待校验</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <History className="w-4 h-4" />
            导出历史记录
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更策略</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备信息</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更原因</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((change) => (
                <tr key={change.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{change.policyName}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-300">{change.deviceName}</div>
                    <div className="text-xs text-gray-500">{change.deviceIp}</div>
                  </td>
                  <td className="px-4 py-3">{getChangeTypeBadge(change.changeType)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{change.changeReason}</td>
                  <td className="px-4 py-3 text-sm text-white">{change.operator}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{change.changeTime}</td>
                  <td className="px-4 py-3">{getComplianceBadge(change.complianceStatus)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedChange(change)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看详情"><Eye className="w-4 h-4" /></button>
                      {change.changeType === 'modify' && (
                        <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="变更前后对比"><GitCompare className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      {selectedChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-[700px] max-w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">策略变更详情</h3>
              <button onClick={() => setSelectedChange(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">策略名称</span>
                  <p className="text-white mt-1">{selectedChange.policyName}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">变更类型</span>
                  <p className="mt-1">{getChangeTypeBadge(selectedChange.changeType)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">设备名称</span>
                  <p className="text-white mt-1">{selectedChange.deviceName}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">设备IP</span>
                  <p className="text-white mt-1">{selectedChange.deviceIp}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">操作人</span>
                  <p className="text-white mt-1">{selectedChange.operator}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">变更时间</span>
                  <p className="text-white mt-1">{selectedChange.changeTime}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">变更原因</span>
                <p className="text-white mt-1">{selectedChange.changeReason}</p>
              </div>
              {selectedChange.changeType === 'modify' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111827] rounded-lg p-3">
                    <span className="text-red-400 text-sm">变更前</span>
                    <pre className="text-gray-300 text-sm mt-2 whitespace-pre-wrap">{selectedChange.beforeContent}</pre>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <span className="text-green-400 text-sm">变更后</span>
                    <pre className="text-gray-300 text-sm mt-2 whitespace-pre-wrap">{selectedChange.afterContent}</pre>
                  </div>
                </div>
              )}
              <div>
                <span className="text-gray-400 text-sm">合规状态</span>
                <p className="mt-1">{getComplianceBadge(selectedChange.complianceStatus)}</p>
                {selectedChange.validateResult && <p className="text-gray-400 text-sm mt-1">校验结果: {selectedChange.validateResult}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
