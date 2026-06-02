'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, FileText, CheckCircle, XCircle, Shield, Filter, ChevronDown, ChevronUp, Clock, AlertTriangle } from 'lucide-react';

interface AuditDetail {
  srcIp: string;
  dstIp: string;
  srcPort: string;
  dstPort: string;
  protocol: string;
  action: string;
  ruleId: string;
  oldRule: string;
  newRule: string;
  duration: string;
  affectedDevices: string[];
}

interface AuditItem {
  id: string;
  operator: string;
  operation: string;
  changeType: string;
  taskId: string;
  taskTitle: string;
  firewall: string;
  time: string;
  result: 'success' | 'failed';
  status: 'completed' | 'in-progress' | 'pending';
  detail: AuditDetail;
}

const mockAudit: AuditItem[] = [
  { 
    id: 'AUD-FW-001', 
    operator: '张三', 
    operation: '策略新增', 
    changeType: '访问控制策略',
    taskId: 'FW-2026-001', 
    taskTitle: '新增DMZ服务器访问策略', 
    firewall: 'FW-BJ-01',
    time: '2026-06-02 09:30:00', 
    result: 'success',
    status: 'completed',
    detail: {
      srcIp: '192.168.1.0/24',
      dstIp: '172.16.0.100',
      srcPort: 'Any',
      dstPort: '80,443',
      protocol: 'TCP',
      action: 'Allow',
      ruleId: 'RULE-DMZ-001',
      oldRule: '-',
      newRule: '允许内网访问DMZ服务器HTTP/HTTPS',
      duration: '永久',
      affectedDevices: ['FW-BJ-01', 'FW-BJ-02']
    }
  },
  { 
    id: 'AUD-FW-002', 
    operator: '李四', 
    operation: '策略修改', 
    changeType: 'NAT策略',
    taskId: 'FW-2026-002', 
    taskTitle: '更新对外服务NAT映射', 
    firewall: 'FW-GZ-01',
    time: '2026-06-02 10:15:00', 
    result: 'success',
    status: 'completed',
    detail: {
      srcIp: '202.103.0.50',
      dstIp: '192.168.2.10',
      srcPort: '8080',
      dstPort: '80',
      protocol: 'TCP',
      action: 'NAT',
      ruleId: 'RULE-NAT-005',
      oldRule: '外部端口80映射至内部80',
      newRule: '外部端口8080映射至内部80',
      duration: '永久',
      affectedDevices: ['FW-GZ-01']
    }
  },
  { 
    id: 'AUD-FW-003', 
    operator: '王五', 
    operation: '策略删除', 
    changeType: '访问控制策略',
    taskId: 'FW-2026-003', 
    taskTitle: '删除过期临时策略', 
    firewall: 'FW-SH-01',
    time: '2026-06-01 14:00:00', 
    result: 'success',
    status: 'completed',
    detail: {
      srcIp: '10.0.0.0/8',
      dstIp: '172.16.1.50',
      srcPort: 'Any',
      dstPort: '3389',
      protocol: 'TCP',
      action: 'Allow',
      ruleId: 'RULE-TEMP-003',
      oldRule: '临时允许运维访问',
      newRule: '-',
      duration: '已过期',
      affectedDevices: ['FW-SH-01']
    }
  },
];

export function FwAudit() {
  const [audit] = useState(mockAudit);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterChangeType, setFilterChangeType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const changeTypes = ['all', '访问控制策略', 'NAT策略', '路由策略', '安全策略'];
  const statusOptions = ['all', 'completed', 'in-progress', 'pending'];

  const filteredAudit = audit.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.operator.includes(searchKeyword) || 
      item.taskTitle.includes(searchKeyword) ||
      item.taskId.includes(searchKeyword) ||
      item.firewall.includes(searchKeyword);
    const matchesChangeType = filterChangeType === 'all' || item.changeType === filterChangeType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesChangeType && matchesStatus;
  });

  const stats = {
    total: audit.length,
    success: audit.filter(a => a.result === 'success').length,
    failed: audit.filter(a => a.result === 'failed').length,
    today: audit.filter(a => a.time.includes('2026-06-02')).length
  };

  const handleExport = () => {
    const data = audit.map(a => ({
      '审计ID': a.id,
      '操作人': a.operator,
      '操作类型': a.operation,
      '变更类型': a.changeType,
      '工单ID': a.taskId,
      '工单标题': a.taskTitle,
      '防火墙设备': a.firewall,
      '时间': a.time,
      '结果': a.result === 'success' ? '成功' : '失败'
    }));
    const csv = [Object.keys(data[0]).join(','), ...data.map(d => Object.values(d).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firewall-audit-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略工单任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">工单处理操作及策略变更的审计日志记录，日志查询与导出</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">审计记录总数</p>
              <p className="text-xl font-semibold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功操作</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败操作</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">今日审计</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.today}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索操作人、工单标题或设备..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterChangeType}
                onChange={(e) => setFilterChangeType(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {changeTypes.map(type => (
                  <option key={type} value={type}>{type === 'all' ? '全部类型' : type}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status === 'all' ? '全部状态' : status === 'completed' ? '已完成' : status === 'in-progress' ? '进行中' : '待处理'}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出审计日志
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAudit.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">{item.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{item.operator}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.operation === '策略新增' ? 'bg-green-500/20 text-green-400' :
                    item.operation === '策略修改' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {item.operation}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.changeType}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm text-gray-400">{item.firewall}</span>
                  <span className="text-sm text-gray-400">{item.time}</span>
                  {item.result === 'success' ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />成功
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />失败
                    </span>
                  )}
                  {expandedId === item.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-300">
                <span className="text-gray-500">工单：</span>
                <span className="text-blue-400">{item.taskId}</span>
                <span className="mx-2">-</span>
                {item.taskTitle}
              </div>
            </div>
            
            {expandedId === item.id && (
              <div className="px-4 pb-4 border-t border-[#2A354D]">
                <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">源IP地址</p>
                    <p className="text-sm text-white font-mono">{item.detail.srcIp}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">目标IP地址</p>
                    <p className="text-sm text-white font-mono">{item.detail.dstIp}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">源端口</p>
                    <p className="text-sm text-white font-mono">{item.detail.srcPort}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">目标端口</p>
                    <p className="text-sm text-white font-mono">{item.detail.dstPort}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">协议</p>
                    <p className="text-sm text-white font-mono">{item.detail.protocol}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">动作</p>
                    <p className="text-sm text-white font-mono">{item.detail.action}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">规则ID</p>
                    <p className="text-sm text-white font-mono">{item.detail.ruleId}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">生效时长</p>
                    <p className="text-sm text-white font-mono">{item.detail.duration}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">变更前规则</p>
                    <p className="text-sm text-gray-300">{item.detail.oldRule}</p>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">变更后规则</p>
                    <p className="text-sm text-gray-300">{item.detail.newRule}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">受影响设备</p>
                  <div className="flex flex-wrap gap-2">
                    {item.detail.affectedDevices.map((device, idx) => (
                      <span key={idx} className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{device}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}