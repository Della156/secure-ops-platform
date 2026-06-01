'use client';

import React, { useState } from 'react';
import { Search, Plus, FileText, UserCheck, UserX, Clock, CheckCircle2, AlertCircle, XCircle, X, Eye } from 'lucide-react';

// 审批节点类型
interface ApprovalNode {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  time?: string;
  comment?: string;
}

// 任务注册数据类型
interface TaskRegistration {
  id: string;
  name: string;
  regNo: string;
  regStatus: 'registered' | 'cancelled';
  auditStatus: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  accessInfo: {
    protocol: string;
    params: string;
  };
  description: string;
  approvalNodes: ApprovalNode[];
}

// 模拟数据
const mockData: TaskRegistration[] = [
  {
    id: 'REG-001',
    name: '防火墙配置同步任务',
    regNo: 'REG-2026-0520-001',
    regStatus: 'registered',
    auditStatus: 'approved',
    appliedAt: '2026-05-20 10:30:00',
    accessInfo: {
      protocol: 'SSH',
      params: '{"host":"192.168.1.1","port":22}',
    },
    description: '每日同步防火墙配置到备份服务器',
    approvalNodes: [
      { id: 'node1', name: '张三', role: '安全管理员', status: 'approved', time: '2026-05-20 11:00:00', comment: '同意注册' },
      { id: 'node2', name: '李四', role: '系统管理员', status: 'approved', time: '2026-05-20 14:30:00', comment: '已审核' },
    ],
  },
  {
    id: 'REG-002',
    name: 'IDS日志采集任务',
    regNo: 'REG-2026-0521-001',
    regStatus: 'registered',
    auditStatus: 'pending',
    appliedAt: '2026-05-21 14:20:00',
    accessInfo: {
      protocol: 'REST',
      params: '{"url":"https://ids.local/api/v1/logs"}',
    },
    description: '实时采集IDS告警日志',
    approvalNodes: [
      { id: 'node1', name: '张三', role: '安全管理员', status: 'pending' },
      { id: 'node2', name: '李四', role: '系统管理员', status: 'pending' },
    ],
  },
  {
    id: 'REG-003',
    name: '网络设备监控',
    regNo: 'REG-2026-0522-001',
    regStatus: 'cancelled',
    auditStatus: 'rejected',
    appliedAt: '2026-05-22 09:15:00',
    accessInfo: {
      protocol: 'SNMP',
      params: '{"community":"public","version":"v2c"}',
    },
    description: '监控网络设备状态',
    approvalNodes: [
      { id: 'node1', name: '张三', role: '安全管理员', status: 'rejected', time: '2026-05-22 10:00:00', comment: '参数配置需要调整' },
    ],
  },
];

export function TaskOnlineRegistration() {
  const [data, setData] = useState<TaskRegistration[]>(mockData);
  const [searchName, setSearchName] = useState('');
  const [filterRegStatus, setFilterRegStatus] = useState('');
  const [filterAuditStatus, setFilterAuditStatus] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TaskRegistration | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    protocol: 'SSH' as const,
    params: '',
    description: '',
  });

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchRegStatus = !filterRegStatus || item.regStatus === filterRegStatus;
    const matchAuditStatus = !filterAuditStatus || item.auditStatus === filterAuditStatus;
    return matchName && matchRegStatus && matchAuditStatus;
  });

  // 提交注册申请
  const handleSubmitRegistration = () => {
    if (!formData.name) return;

    const newItem: TaskRegistration = {
      id: `REG-${String(data.length + 1).padStart(3, '0')}`,
      name: formData.name,
      regNo: `REG-2026-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}-${String(data.length + 1).padStart(3, '0')}`,
      regStatus: 'registered',
      auditStatus: 'pending',
      appliedAt: new Date().toLocaleString('zh-CN'),
      accessInfo: {
        protocol: formData.protocol,
        params: formData.params,
      },
      description: formData.description,
      approvalNodes: [
        { id: 'node1', name: '张三', role: '安全管理员', status: 'pending' },
        { id: 'node2', name: '李四', role: '系统管理员', status: 'pending' },
      ],
    };

    setData([...data, newItem]);
    setIsRegisterModalOpen(false);
    setFormData({ name: '', protocol: 'SSH', params: '', description: '' });
  };

  // 注销任务
  const handleCancel = (id: string) => {
    if (confirm('确定要注销这个任务吗？')) {
      setData(data.map(item => item.id === id ? { ...item, regStatus: 'cancelled' } : item));
    }
  };

  // 查看审批流程
  const handleViewApproval = (item: TaskRegistration) => {
    setSelectedItem(item);
    setIsApprovalModalOpen(true);
  };

  // 获取注册状态标签
  const getRegStatusBadge = (status: string) => {
    const styles = {
      registered: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      cancelled: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      registered: '已注册',
      cancelled: '已注销',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // 获取审核状态标签
  const getAuditStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      approved: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      rejected: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
    };
    const icons = {
      pending: <Clock className="w-3 h-3 inline mr-1" />,
      approved: <CheckCircle2 className="w-3 h-3 inline mr-1" />,
      rejected: <XCircle className="w-3 h-3 inline mr-1" />,
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // 获取审批节点状态图标
  const getApprovalNodeIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-[#00C853]" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-[#FF3B30]" />;
      default:
        return <Clock className="w-5 h-5 text-[#FF9100]" />;
    }
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务在线注册管理</h1>
        <p className="text-[#9CA3AF]">管理自动化任务的在线注册和审批流程</p>
      </div>

      {/* 操作栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索任务名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>

            {/* 注册状态筛选 */}
            <select
              value={filterRegStatus}
              onChange={(e) => setFilterRegStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部注册状态</option>
              <option value="registered">已注册</option>
              <option value="cancelled">已注销</option>
            </select>

            {/* 审核状态筛选 */}
            <select
              value={filterAuditStatus}
              onChange={(e) => setFilterAuditStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部审核状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>

          {/* 新增按钮 */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            注册申请
          </button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">注册编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">注册状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">审核状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">申请时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF] font-mono">{item.regNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getRegStatusBadge(item.regStatus)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getAuditStatusBadge(item.auditStatus)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.appliedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewApproval(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      审批流程
                    </button>
                    {item.regStatus === 'registered' && (
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                        注销
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">暂无数据</p>
          </div>
        )}
      </div>

      {/* 注册申请模态框 */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">注册申请</h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入任务名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">接入协议</label>
                <select
                  value={formData.protocol}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="SSH">SSH</option>
                  <option value="REST">REST</option>
                  <option value="SNMP">SNMP</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">接入参数 (JSON)</label>
                <textarea
                  value={formData.params}
                  onChange={(e) => setFormData({ ...formData, params: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono text-sm"
                  placeholder='{"key":"value"}'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">申请说明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请描述任务用途和必要性"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitRegistration}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 审批流程模态框 */}
      {isApprovalModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">审批流程 - {selectedItem.name}</h3>
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-[#181F32]/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#6B7280] text-sm">注册编号</span>
                    <p className="text-[#F3F4F6] font-mono">{selectedItem.regNo}</p>
                  </div>
                  <div>
                    <span className="text-[#6B7280] text-sm">申请时间</span>
                    <p className="text-[#F3F4F6]">{selectedItem.appliedAt}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[#6B7280] text-sm">任务描述</span>
                  <p className="text-[#D1D5DB] mt-1">{selectedItem.description}</p>
                </div>
              </div>

              <h4 className="text-sm font-medium text-[#D1D5DB] mb-4">审批节点</h4>
              <div className="space-y-4">
                {selectedItem.approvalNodes.map((node, index) => (
                  <div key={node.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#181F32] flex items-center justify-center">
                        {getApprovalNodeIcon(node.status)}
                      </div>
                      {index < selectedItem.approvalNodes.length - 1 && (
                        <div className="w-0.5 h-8 bg-[#2A354D] mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[#F3F4F6] font-medium">{node.name}</span>
                          <span className="text-[#6B7280] text-sm ml-2">({node.role})</span>
                        </div>
                        {getAuditStatusBadge(node.status)}
                      </div>
                      {node.time && (
                        <p className="text-[#6B7280] text-sm mt-1">{node.time}</p>
                      )}
                      {node.comment && (
                        <p className="text-[#9CA3AF] text-sm mt-2 p-3 bg-[#181F32]/50 rounded-lg">
                          {node.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsApprovalModalOpen(false)}
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
