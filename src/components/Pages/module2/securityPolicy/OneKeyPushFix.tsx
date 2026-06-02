'use client';

import React, { useState } from 'react';
import { Search, Send, Eye, AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface AbnormalPolicy {
  id: string;
  policyName: string;
  deviceName: string;
  deviceIp: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskReason: string;
  fixSuggestion: string;
  responsible: string;
  contact: string;
  status: 'pending' | 'pushed' | 'fixed' | 'ignored';
  pushTime?: string;
  fixTime?: string;
}

const mockData: AbnormalPolicy[] = [
  { id: 'AP-001', policyName: '高危端口开放策略', deviceName: '边界防火墙-FW-01', deviceIp: '192.168.1.254', riskLevel: 'high', riskReason: '22端口对公网开放，存在被扫描风险', fixSuggestion: '关闭22端口或限制访问IP段', responsible: '张工', contact: '138****1234', status: 'pending' },
  { id: 'AP-002', policyName: 'ACL规则过宽', deviceName: '核心交换机-CORE-01', deviceIp: '192.168.1.1', riskLevel: 'high', riskReason: '存在允许any作为源的规则', fixSuggestion: '收紧ACL规则，限制源IP范围', responsible: '李工', contact: '139****5678', status: 'pushed', pushTime: '2026-06-01 10:00:00' },
  { id: 'AP-003', policyName: '弱密码策略', deviceName: 'VPN网关-VPN-01', deviceIp: '192.168.1.50', riskLevel: 'high', riskReason: '未启用双因素认证', fixSuggestion: '启用双因素认证，增强密码策略', responsible: '王工', contact: '137****9012', status: 'fixed', pushTime: '2026-05-30 09:00:00', fixTime: '2026-05-31 14:30:00' },
  { id: 'AP-004', policyName: '证书即将过期', deviceName: 'Web防火墙-WAF-01', deviceIp: '192.168.1.20', riskLevel: 'medium', riskReason: 'SSL证书15天后到期', fixSuggestion: '续期或更换SSL证书', responsible: '赵工', contact: '136****3456', status: 'pending' },
  { id: 'AP-005', policyName: '日志未配置', deviceName: '路由器-RT-01', deviceIp: '192.168.0.1', riskLevel: 'low', riskReason: '未开启审计日志', fixSuggestion: '开启审计日志并配置日志服务器', responsible: '刘工', contact: '135****7890', status: 'ignored' },
];

export function OneKeyPushFix() {
  const [data, setData] = useState<AbnormalPolicy[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.policyName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.deviceName.includes(searchKeyword);
    const matchRisk = !filterRisk || d.riskLevel === filterRisk;
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchKeyword && matchRisk && matchStatus;
  });

  const stats = {
    total: data.length,
    pending: data.filter(d => d.status === 'pending').length,
    pushed: data.filter(d => d.status === 'pushed').length,
    fixed: data.filter(d => d.status === 'fixed').length,
    ignored: data.filter(d => d.status === 'ignored').length,
  };

  const getRiskBadge = (level: string) => {
    const config: Record<string, { bg: string; label: string }> = {
      high: { bg: 'bg-red-500/20 text-red-400', label: '高危' },
      medium: { bg: 'bg-yellow-500/20 text-yellow-400', label: '中危' },
      low: { bg: 'bg-blue-500/20 text-blue-400', label: '低危' },
    };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${config[level]?.bg}`}>{config[level]?.label}</span>;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; label: string; icon: any }> = {
      pending: { bg: 'bg-yellow-500/20 text-yellow-400', label: '待推送', icon: <Clock className="w-3 h-3 mr-1" /> },
      pushed: { bg: 'bg-blue-500/20 text-blue-400', label: '已推送', icon: <Send className="w-3 h-3 mr-1" /> },
      fixed: { bg: 'bg-green-500/20 text-green-400', label: '已整改', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      ignored: { bg: 'bg-gray-500/20 text-gray-400', label: '已忽略', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
    };
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config[status]?.bg}`}>{config[status]?.icon}{config[status]?.label}</span>;
  };

  const handleOneKeyPush = (item: AbnormalPolicy) => {
    if (confirm(`确定要一键推送整改通知给 "${item.responsible}" 吗？\n联系方式: ${item.contact}`)) {
      setData(prev => prev.map(d => d.id === item.id ? { ...d, status: 'pushed', pushTime: new Date().toLocaleString() } : d));
      alert(`已发送整改通知给 ${item.responsible}`);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">异常策略一键推送整改</h2>
        <p className="text-sm text-gray-400 mt-1">查看异常策略详情，一键推送至责任人，跟踪整改进度</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">异常策略总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">待推送</p>
          <p className="text-2xl font-semibold text-yellow-400 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">已推送</p>
          <p className="text-2xl font-semibold text-blue-400 mt-1">{stats.pushed}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">已整改</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.fixed}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">已忽略</p>
          <p className="text-2xl font-semibold text-gray-400 mt-1">{stats.ignored}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="搜索策略/设备..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部风险等级</option>
              <option value="high">高危</option>
              <option value="medium">中危</option>
              <option value="low">低危</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部状态</option>
              <option value="pending">待推送</option>
              <option value="pushed">已推送</option>
              <option value="fixed">已整改</option>
              <option value="ignored">已忽略</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Send className="w-4 h-4" />
            一键推送所有待处理
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备信息</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">风险等级</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">风险原因</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">整改建议</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">责任人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.policyName}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-300">{item.deviceName}</div>
                    <div className="text-xs text-gray-500">{item.deviceIp}</div>
                  </td>
                  <td className="px-4 py-3">{getRiskBadge(item.riskLevel)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{item.riskReason}</td>
                  <td className="px-4 py-3 text-sm text-blue-400 max-w-xs truncate">{item.fixSuggestion}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{item.responsible}</div>
                    <div className="text-xs text-gray-500">{item.contact}</div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看详情"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="发送消息"><MessageSquare className="w-4 h-4" /></button>
                      {item.status === 'pending' && (
                        <button onClick={() => handleOneKeyPush(item)} className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors" title="一键推送"><Send className="w-4 h-4" /></button>
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
    </div>
  );
}
