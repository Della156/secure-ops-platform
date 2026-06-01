'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Shield, Users, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface AuthPolicy {
  id: string;
  name: string;
  target: string;
  type: 'role' | 'user';
  status: 'active' | 'inactive';
  validFrom: string;
  validUntil: string;
}

interface AuthRequest {
  id: string;
  applicant: string;
  target: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestTime: string;
}

const mockPolicies: AuthPolicy[] = [
  { id: 'policy-1', name: '办公终端管理员访问', target: '办公区终端', type: 'role', status: 'active', validFrom: '2026-01-01', validUntil: '2026-12-31' },
  { id: 'policy-2', name: '研发终端访问', target: '研发区终端', type: 'user', status: 'active', validFrom: '2026-03-15', validUntil: '2026-09-15' },
  { id: 'policy-3', name: '访客终端临时访问', target: '访客区终端', type: 'role', status: 'inactive', validFrom: '2026-02-01', validUntil: '2026-06-01' },
];

const mockRequests: AuthRequest[] = [
  { id: 'req-1', applicant: '张三', target: '办公区终端', reason: '需要进行系统维护', status: 'pending', requestTime: '2026-06-01 09:30:00' },
  { id: 'req-2', applicant: '李四', target: '研发区终端', reason: '开发测试环境访问', status: 'approved', requestTime: '2026-05-31 14:20:00' },
  { id: 'req-3', applicant: '王五', target: '访客区终端', reason: '临时访客访问', status: 'rejected', requestTime: '2026-05-30 11:15:00' },
];

export function EndpointAuthManagement() {
  const [policies, setPolicies] = useState<AuthPolicy[]>(mockPolicies);
  const [requests, setRequests] = useState<AuthRequest[]>(mockRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<AuthPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<AuthPolicy>>({
    name: '',
    target: '',
    type: 'role',
    status: 'active',
    validFrom: '',
    validUntil: '',
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      inactive: 'bg-[#4A5570]/20 text-[#9CA3AF] border-[#4A5570]/30',
      pending: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      approved: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      rejected: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      active: '生效中',
      inactive: '已失效',
      pending: '待审批',
      approved: '已通过',
      rejected: '已拒绝',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      role: 'bg-[#6366F1]/20 text-[#6366F1] border-purple-500/30',
      user: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
    };
    const labels = {
      role: '角色',
      user: '用户',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const handleOpenModal = (policy?: AuthPolicy) => {
    if (policy) {
      setEditingPolicy(policy);
      setFormData(policy);
    } else {
      setEditingPolicy(null);
      setFormData({ name: '', target: '', type: 'role', status: 'active', validFrom: '', validUntil: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? { ...p, ...formData } as AuthPolicy : p));
    } else {
      const newPolicy: AuthPolicy = {
        id: `policy-${policies.length + 1}`,
        name: formData.name || '',
        target: formData.target || '',
        type: formData.type || 'role',
        status: formData.status || 'active',
        validFrom: formData.validFrom || '',
        validUntil: formData.validUntil || '',
      };
      setPolicies([...policies, newPolicy]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个授权策略吗？')) {
      setPolicies(policies.filter(p => p.id !== id));
    }
  };

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">终端访问授权管理</h1>
        <p className="text-[#9CA3AF]">管理终端访问授权策略，处理授权申请</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h3 className="text-[#F3F4F6] font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            授权策略列表
          </h3>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增策略
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#181F32]/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase">策略名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase">目标终端</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase">有效期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {policies.map(policy => (
                <tr key={policy.id} className="hover:bg-[#181F32]/30 transition-colors">
                  <td className="px-4 py-3 text-[#F3F4F6] font-medium">{policy.name}</td>
                  <td className="px-4 py-3 text-[#D1D5DB]">{policy.target}</td>
                  <td className="px-4 py-3">{getTypeBadge(policy.type)}</td>
                  <td className="px-4 py-3">{getStatusBadge(policy.status)}</td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-sm">
                    {policy.validFrom} ~ {policy.validUntil}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(policy)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(policy.id)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
        <h3 className="text-[#F3F4F6] font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          授权申请审批
        </h3>
        <div className="space-y-3">
          {requests.map(request => (
            <div key={request.id} className="bg-[#181F32]/50 border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#F3F4F6] font-medium">{request.applicant}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-[#9CA3AF] text-sm">申请访问: {request.target}</div>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{request.requestTime}</span>
                </div>
              </div>
              <div className="bg-[#20293F] rounded-lg p-3 mb-3">
                <div className="text-[#9CA3AF] text-xs mb-1">申请理由</div>
                <div className="text-[#D1D5DB]">{request.reason}</div>
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00C853] hover:bg-[#00A843] text-[#F3F4F6] rounded-lg transition-colors text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    通过
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF3B30] hover:bg-[#CC2F26] text-[#F3F4F6] rounded-lg transition-colors text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    拒绝
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingPolicy ? '编辑授权策略' : '新增授权策略'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">策略名称</label>
                <input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="例如：办公终端管理员访问"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">目标终端</label>
                <input
                  value={formData.target || ''}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="选择或输入终端名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">授权类型</label>
                  <select
                    value={formData.type || 'role'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="role">角色</option>
                    <option value="user">用户</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">状态</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="active">生效中</option>
                    <option value="inactive">已失效</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">生效日期</label>
                  <input
                    type="date"
                    value={formData.validFrom || ''}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">失效日期</label>
                  <input
                    type="date"
                    value={formData.validUntil || ''}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}