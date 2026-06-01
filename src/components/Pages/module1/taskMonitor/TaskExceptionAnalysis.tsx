'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, AlertTriangle, FileText, Eye, ChevronDown, ChevronUp, Clock, User } from 'lucide-react';

interface Exception {
  id: string;
  taskName: string;
  type: 'timeout' | 'connection' | 'authentication' | 'validation' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  occurredAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  assignee?: string;
  details: string;
}

const mockExceptions: Exception[] = [
  {
    id: 'EXC-001',
    taskName: '防火墙配置同步任务',
    type: 'connection',
    severity: 'high',
    reason: '无法连接到目标设备',
    occurredAt: '2024-06-01 10:25:30',
    status: 'open',
    assignee: '张三',
    details: '连接超时，目标设备 192.168.1.1 无响应。请检查网络连接和设备状态。',
  },
  {
    id: 'EXC-002',
    taskName: 'IDS 日志采集任务',
    type: 'authentication',
    severity: 'medium',
    reason: 'API 认证失败',
    occurredAt: '2024-06-01 09:15:20',
    status: 'investigating',
    assignee: '李四',
    details: 'API Key 验证失败，可能是 Key 已过期或权限不足。',
  },
  {
    id: 'EXC-003',
    taskName: '数据库备份任务',
    type: 'timeout',
    severity: 'critical',
    reason: '任务执行超时',
    occurredAt: '2024-06-01 08:00:00',
    status: 'resolved',
    assignee: '王五',
    details: '备份任务执行时间超过 30 分钟阈值，已自动终止。已优化备份策略，问题已解决。',
  },
  {
    id: 'EXC-004',
    taskName: 'Web 应用安全扫描',
    type: 'validation',
    severity: 'low',
    reason: '参数验证失败',
    occurredAt: '2024-05-31 16:30:45',
    status: 'ignored',
    assignee: undefined,
    details: '输入参数格式不符合要求，已跳过此扫描目标。',
  },
  {
    id: 'EXC-005',
    taskName: '网络设备监控',
    type: 'system',
    severity: 'high',
    reason: '系统资源不足',
    occurredAt: '2024-05-31 14:20:10',
    status: 'open',
    assignee: '赵六',
    details: '任务执行时内存使用率超过 95%，导致任务被系统终止。',
  },
];

const exceptionTypeData = [
  { name: '连接错误', value: 15, color: '#ef4444' },
  { name: '认证失败', value: 10, color: '#f97316' },
  { name: '超时', value: 20, color: '#eab308' },
  { name: '验证错误', value: 8, color: '#22c55e' },
  { name: '系统错误', value: 7, color: '#3b82f6' },
];

const exceptionTrendData = [
  { date: '05-27', count: 5 },
  { date: '05-28', count: 8 },
  { date: '05-29', count: 12 },
  { date: '05-30', count: 6 },
  { date: '05-31', count: 10 },
  { date: '06-01', count: 7 },
];

export function TaskExceptionAnalysis() {
  const [exceptions, setExceptions] = useState<Exception[]>(mockExceptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);

  const filteredExceptions = exceptions.filter(ex => {
    const matchesSearch = ex.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ex.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || ex.type === filterType;
    const matchesSeverity = !filterSeverity || ex.severity === filterSeverity;
    const matchesStatus = !filterStatus || ex.status === filterStatus;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity: string) => {
    const styles = {
      critical: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      high: 'bg-[#FF9100]/20 text-[#FF9100] border-orange-500/30',
      medium: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      low: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
    };
    const labels = {
      critical: '严重',
      high: '高',
      medium: '中',
      low: '低',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[severity as keyof typeof styles]}`}>
        {labels[severity as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      investigating: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      resolved: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      ignored: 'bg-[#4A5570]/20 text-[#9CA3AF] border-[#4A5570]/30',
    };
    const labels = {
      open: '待处理',
      investigating: '调查中',
      resolved: '已解决',
      ignored: '已忽略',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      timeout: '超时',
      connection: '连接错误',
      authentication: '认证失败',
      validation: '验证错误',
      system: '系统错误',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181F32] border border-[#2A354D] rounded-lg p-3 shadow-lg">
          <p className="text-[#D1D5DB] text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stats = {
    total: exceptions.length,
    open: exceptions.filter(e => e.status === 'open').length,
    resolved: exceptions.filter(e => e.status === 'resolved').length,
    critical: exceptions.filter(e => e.severity === 'critical').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务异常事件分析</h1>
        <p className="text-[#9CA3AF]">分析和处理任务执行过程中的异常事件</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9CA3AF] text-sm">总异常数</span>
            <AlertTriangle className="w-5 h-5 text-[#FF9100]" />
          </div>
          <div className="text-3xl font-bold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9CA3AF] text-sm">待处理</span>
            <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
          </div>
          <div className="text-3xl font-bold text-[#FF3B30]">{stats.open}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9CA3AF] text-sm">已解决</span>
            <FileText className="w-5 h-5 text-[#00C853]" />
          </div>
          <div className="text-3xl font-bold text-[#00C853]">{stats.resolved}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9CA3AF] text-sm">严重异常</span>
            <AlertTriangle className="w-5 h-5 text-[#FF9100]" />
          </div>
          <div className="text-3xl font-bold text-[#FF9100]">{stats.critical}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">异常类型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={exceptionTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {exceptionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">异常趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exceptionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="异常数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="搜索异常事件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          >
            <option value="">全部类型</option>
            <option value="timeout">超时</option>
            <option value="connection">连接错误</option>
            <option value="authentication">认证失败</option>
            <option value="validation">验证错误</option>
            <option value="system">系统错误</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          >
            <option value="">全部级别</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          >
            <option value="">全部状态</option>
            <option value="open">待处理</option>
            <option value="investigating">调查中</option>
            <option value="resolved">已解决</option>
            <option value="ignored">已忽略</option>
          </select>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A354D]">
          <h3 className="text-lg font-semibold text-[#F3F4F6]">异常事件列表</h3>
        </div>
        <div className="divide-y divide-[#2A354D]">
          {filteredExceptions.map((exception) => (
            <div key={exception.id} className="p-6 hover:bg-[#181F32]/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-[#9CA3AF]">{exception.id}</span>
                    {getSeverityBadge(exception.severity)}
                    {getStatusBadge(exception.status)}
                  </div>
                  <h4 className="text-[#F3F4F6] font-semibold mb-1">{exception.taskName}</h4>
                  <p className="text-[#D1D5DB] text-sm mb-2">{exception.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exception.occurredAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {getTypeLabel(exception.type)}
                    </div>
                    {exception.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {exception.assignee}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setSelectedException(exception)}
                    className="p-2 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded-lg transition-colors"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === exception.id ? null : exception.id)}
                    className="p-2 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#2A354D] rounded-lg transition-colors"
                  >
                    {expandedId === exception.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {expandedId === exception.id && (
                <div className="mt-4 pt-4 border-t border-[#2A354D]">
                  <div className="bg-[#181F32]/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-[#D1D5DB] mb-2">详细信息</h5>
                    <p className="text-[#9CA3AF] text-sm">{exception.details}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredExceptions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-[#6B7280]">暂无异常事件</p>
          </div>
        )}
      </div>

      {selectedException && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">{selectedException.id} - 异常详情</h3>
              <button
                onClick={() => setSelectedException(null)}
                className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">任务名称</label>
                  <p className="text-[#F3F4F6]">{selectedException.taskName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">异常类型</label>
                  <p className="text-[#F3F4F6]">{getTypeLabel(selectedException.type)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">严重级别</label>
                  <div>{getSeverityBadge(selectedException.severity)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">状态</label>
                  <div>{getStatusBadge(selectedException.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">发生时间</label>
                  <p className="text-[#F3F4F6]">{selectedException.occurredAt}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">负责人</label>
                  <p className="text-[#F3F4F6]">{selectedException.assignee || '-'}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">异常原因</label>
                <p className="text-[#F3F4F6]">{selectedException.reason}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">详细描述</label>
                <div className="bg-[#181F32] rounded-lg p-4">
                  <p className="text-[#D1D5DB]">{selectedException.details}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2A354D]">
              <button
                onClick={() => setSelectedException(null)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
