'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Users, User, Shield, CheckCircle2, XCircle, Clock, X, Eye, Calendar } from 'lucide-react';

interface AuthPolicy {
  id: string;
  name: string;
  abilityId: string;
  abilityName: string;
  authType: 'role' | 'user';
  authTargets: string[];
  status: 'active' | 'inactive' | 'pending';
  validFrom: string;
  validUntil: string;
  createdAt: string;
  createdBy: string;
  description: string;
}

interface AuthRequest {
  id: string;
  policyName: string;
  abilityName: string;
  requester: string;
  requestReason: string;
  requestTime: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  approvalTime?: string;
  approvalComment?: string;
}

const mockPolicies: AuthPolicy[] = [
  {
    id: 'POL-001',
    name: '安全团队防火墙扫描权限',
    abilityId: 'ABL-001',
    abilityName: '防火墙规则扫描',
    authType: 'role',
    authTargets: ['安全管理员', '安全分析师'],
    status: 'active',
    validFrom: '2026-05-01',
    validUntil: '2026-12-31',
    createdAt: '2026-05-01 10:00:00',
    createdBy: '系统管理员',
    description: '授予安全团队对防火墙扫描能力的访问权限'
  },
  {
    id: 'POL-002',
    name: '运维团队端口检查权限',
    abilityId: 'ABL-002',
    abilityName: '端口安全检查',
    authType: 'role',
    authTargets: ['运维工程师'],
    status: 'active',
    validFrom: '2026-05-10',
    validUntil: '2026-11-10',
    createdAt: '2026-05-10 14:30:00',
    createdBy: '系统管理员',
    description: '授予运维团队端口安全检查能力'
  },
  {
    id: 'POL-003',
    name: '张三日志分析权限',
    abilityId: 'ABL-003',
    abilityName: '日志分析',
    authType: 'user',
    authTargets: ['张三'],
    status: 'active',
    validFrom: '2026-05-15',
    validUntil: '2026-06-15',
    createdAt: '2026-05-15 09:15:00',
    createdBy: '李四',
    description: '临时授予张三日志分析能力'
  },
  {
    id: 'POL-004',
    name: '测试团队漏洞扫描权限',
    abilityId: 'ABL-004',
    abilityName: '漏洞扫描',
    authType: 'role',
    authTargets: ['测试工程师'],
    status: 'inactive',
    validFrom: '2026-04-01',
    validUntil: '2026-05-01',
    createdAt: '2026-04-01 16:00:00',
    createdBy: '系统管理员',
    description: '已过期的测试团队权限'
  },
  {
    id: 'POL-005',
    name: '王五配置备份权限',
    abilityId: 'ABL-005',
    abilityName: '配置备份',
    authType: 'user',
    authTargets: ['王五'],
    status: 'pending',
    validFrom: '2026-06-01',
    validUntil: '2026-07-01',
    createdAt: '2026-05-28 11:20:00',
    createdBy: '王五',
    description: '等待审批的配置备份权限申请'
  }
];

const mockRequests: AuthRequest[] = [
  {
    id: 'REQ-001',
    policyName: '赵六性能监控权限申请',
    abilityName: '性能监控',
    requester: '赵六',
    requestReason: '需要监控核心设备性能指标',
    requestTime: '2026-05-28 14:00:00',
    status: 'pending'
  },
  {
    id: 'REQ-002',
    policyName: '开发团队临时访问权限',
    abilityName: '日志分析',
    requester: '开发团队',
    requestReason: '排查生产环境问题需要临时访问日志',
    requestTime: '2026-05-27 09:30:00',
    status: 'approved',
    approver: '系统管理员',
    approvalTime: '2026-05-27 10:00:00',
    approvalComment: '已批准，有效期一周'
  },
  {
    id: 'REQ-003',
    policyName: '外部审计访问权限',
    abilityName: '漏洞扫描',
    requester: '外部审计',
    requestReason: '年度安全审计需要',
    requestTime: '2026-05-25 16:45:00',
    status: 'rejected',
    approver: '系统管理员',
    approvalTime: '2026-05-26 09:00:00',
    approvalComment: '审计范围不包含漏洞扫描能力，请重新申请'
  }
];

const roles = ['安全管理员', '安全分析师', '运维工程师', '测试工程师', '开发工程师'];
const users = ['张三', '李四', '王五', '赵六', '孙八', '周九'];
const abilities = [
  { id: 'ABL-001', name: '防火墙规则扫描' },
  { id: 'ABL-002', name: '端口安全检查' },
  { id: 'ABL-003', name: '日志分析' },
  { id: 'ABL-004', name: '漏洞扫描' },
  { id: 'ABL-005', name: '配置备份' },
  { id: 'ABL-006', name: '性能监控' }
];

export function ServiceAuthConfig() {
  const [activeTab, setActiveTab] = useState<'policies' | 'requests'>('policies');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'approve'>('create');
  const [selectedItem, setSelectedItem] = useState<AuthPolicy | AuthRequest | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    abilityId: string;
    authType: 'role' | 'user';
    authTargets: string[];
    validFrom: string;
    validUntil: string;
    description: string;
  }>({
    name: '',
    abilityId: '',
    authType: 'role',
    authTargets: [],
    validFrom: '',
    validUntil: '',
    description: ''
  });

  const filteredPolicies = mockPolicies.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.abilityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredRequests = mockRequests.filter(item => {
    const matchSearch = item.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.requester.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    const labels = {
      active: '已启用',
      inactive: '已停用',
      pending: '待审批',
      approved: '已批准',
      rejected: '已拒绝'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleOpenModal = (type: typeof modalType, item?: AuthPolicy | AuthRequest) => {
    setModalType(type);
    setSelectedItem(item || null);
    if (type === 'create') {
      setFormData({
        name: '',
        abilityId: '',
        authType: 'role',
        authTargets: [],
        validFrom: '',
        validUntil: '',
        description: ''
      });
    } else if (type === 'edit' && item && 'abilityId' in item) {
      setFormData({
        name: item.name,
        abilityId: item.abilityId,
        authType: item.authType,
        authTargets: [...item.authTargets],
        validFrom: item.validFrom,
        validUntil: item.validUntil,
        description: item.description
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleTarget = (target: string) => {
    setFormData(prev => ({
      ...prev,
      authTargets: prev.authTargets.includes(target)
        ? prev.authTargets.filter(t => t !== target)
        : [...prev.authTargets, target]
    }));
  };

  const handleSave = () => {
    alert('保存成功！');
    setIsModalOpen(false);
  };

  const handleApprove = () => {
    alert('已批准申请！');
    setIsModalOpen(false);
  };

  const handleReject = () => {
    alert('已拒绝申请！');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务服务接口授权配置</h1>
        <p className="text-slate-400">管理自动化能力的访问授权策略和申请审批</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'policies'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          授权策略
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          申请审批
          {mockRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
              {mockRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder={`搜索${activeTab === 'policies' ? '策略名称或能力' : '申请名称或申请人'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              {activeTab === 'policies' ? (
                <>
                  <option value="active">已启用</option>
                  <option value="inactive">已停用</option>
                  <option value="pending">待审批</option>
                </>
              ) : (
                <>
                  <option value="pending">待审批</option>
                  <option value="approved">已批准</option>
                  <option value="rejected">已拒绝</option>
                </>
              )}
            </select>
          </div>
          {activeTab === 'policies' && (
            <button
              onClick={() => handleOpenModal('create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建策略
            </button>
          )}
        </div>
      </div>

      {activeTab === 'policies' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">策略ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">策略名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">能力</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">授权对象</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">有效期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPolicies.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.abilityName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {item.authType === 'role' ? <Users className="w-3 h-3 text-slate-400" /> : <User className="w-3 h-3 text-slate-400" />}
                      <span className="text-sm text-slate-300">
                        {item.authTargets.slice(0, 2).join(', ')}
                        {item.authTargets.length > 2 && ` +${item.authTargets.length - 2}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {item.validFrom} ~ {item.validUntil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal('view', item)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title="查看"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal('edit', item)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
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
          {filteredPolicies.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">暂无数据</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">申请ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">申请名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">能力</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">申请人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">申请时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRequests.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.policyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.abilityName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.requester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.requestTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal('view', item)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title="查看"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleOpenModal('approve', item)}
                            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors"
                            title="批准"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                            title="拒绝"
                            onClick={handleReject}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">暂无数据</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {modalType === 'create' && '新建授权策略'}
                {modalType === 'edit' && '编辑授权策略'}
                {modalType === 'view' && selectedItem && 'policyName' in selectedItem ? '查看申请详情' : '查看策略详情'}
                {modalType === 'approve' && '审批申请'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {(modalType === 'create' || modalType === 'edit') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">策略名称</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入策略名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">选择能力</label>
                    <select
                      value={formData.abilityId}
                      onChange={(e) => setFormData({ ...formData, abilityId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择能力</option>
                      {abilities.map(ab => (
                        <option key={ab.id} value={ab.id}>{ab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">授权类型</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="authType"
                          value="role"
                          checked={formData.authType === 'role'}
                          onChange={(e) => setFormData({ ...formData, authType: e.target.value as 'role' | 'user', authTargets: [] })}
                          className="text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-300">按角色授权</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="authType"
                          value="user"
                          checked={formData.authType === 'user'}
                          onChange={(e) => setFormData({ ...formData, authType: e.target.value as 'role' | 'user', authTargets: [] })}
                          className="text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-300">按用户授权</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      选择{formData.authType === 'role' ? '角色' : '用户'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(formData.authType === 'role' ? roles : users).map(target => (
                        <button
                          key={target}
                          onClick={() => handleToggleTarget(target)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            formData.authTargets.includes(target)
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {target}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        有效期开始
                      </label>
                      <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        有效期结束
                      </label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">描述</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入策略描述"
                    />
                  </div>
                </div>
              )}

              {modalType === 'view' && selectedItem && !('policyName' in selectedItem) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">策略ID</p>
                      <p className="text-white font-medium">{selectedItem.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">状态</p>
                      {getStatusBadge(selectedItem.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">策略名称</p>
                    <p className="text-white">{selectedItem.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">能力</p>
                    <p className="text-white">{selectedItem.abilityName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">授权对象</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedItem.authTargets.map(target => (
                        <span key={target} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-sm">{target}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">有效期</p>
                    <p className="text-white">{selectedItem.validFrom} ~ {selectedItem.validUntil}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">描述</p>
                    <p className="text-white">{selectedItem.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">创建信息</p>
                    <p className="text-slate-300 text-sm">创建人：{selectedItem.createdBy}</p>
                    <p className="text-slate-300 text-sm">创建时间：{selectedItem.createdAt}</p>
                  </div>
                </div>
              )}

              {(modalType === 'view' || modalType === 'approve') && selectedItem && 'policyName' in selectedItem && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">申请ID</p>
                      <p className="text-white font-medium">{selectedItem.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">状态</p>
                      {getStatusBadge(selectedItem.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">申请名称</p>
                    <p className="text-white">{selectedItem.policyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">申请能力</p>
                    <p className="text-white">{selectedItem.abilityName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">申请人</p>
                    <p className="text-white">{selectedItem.requester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">申请时间</p>
                    <p className="text-white">{selectedItem.requestTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">申请原因</p>
                    <div className="bg-slate-800 rounded-lg p-3 mt-1">
                      <p className="text-white">{selectedItem.requestReason}</p>
                    </div>
                  </div>
                  {selectedItem.approver && (
                    <div className="pt-4 border-t border-slate-800">
                      <p className="text-sm text-slate-400 mb-1">审批信息</p>
                      <p className="text-slate-300 text-sm">审批人：{selectedItem.approver}</p>
                      <p className="text-slate-300 text-sm">审批时间：{selectedItem.approvalTime}</p>
                      {selectedItem.approvalComment && (
                        <div className="bg-slate-800 rounded-lg p-3 mt-2">
                          <p className="text-white text-sm">{selectedItem.approvalComment}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {modalType === 'approve' && (
                    <div className="pt-4 border-t border-slate-800">
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">审批意见</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="请输入审批意见"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            {(modalType === 'create' || modalType === 'edit') && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  保存
                </button>
              </div>
            )}
            {modalType === 'approve' && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  拒绝
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  批准
                </button>
              </div>
            )}
            {modalType === 'view' && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  关闭
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
