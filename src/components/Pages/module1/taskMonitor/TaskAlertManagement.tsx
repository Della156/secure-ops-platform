'use client';

import React, { useState } from 'react';
import { Bell, Plus, Edit, Trash2, Search, Users, Mail, MessageSquare, Settings, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: 'critical' | 'warning' | 'info';
  channels: string[];
  recipients: string[];
  enabled: boolean;
  createdAt: string;
}

interface AlertLevel {
  id: string;
  name: string;
  color: string;
  priority: number;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
}

const mockAlertRules: AlertRule[] = [
  {
    id: 'RULE-001',
    name: '任务失败告警',
    condition: '任务执行失败时触发',
    severity: 'critical',
    channels: ['email', 'elink'],
    recipients: ['张三', '李四'],
    enabled: true,
    createdAt: '2024-05-20 10:00:00',
  },
  {
    id: 'RULE-002',
    name: '任务超时告警',
    condition: '任务执行超过30分钟',
    severity: 'warning',
    channels: ['email'],
    recipients: ['王五'],
    enabled: true,
    createdAt: '2024-05-22 14:30:00',
  },
  {
    id: 'RULE-003',
    name: 'CPU使用率告警',
    condition: 'CPU使用率超过85%',
    severity: 'warning',
    channels: ['email', 'sms'],
    recipients: ['赵六', '钱七'],
    enabled: false,
    createdAt: '2024-05-25 09:15:00',
  },
  {
    id: 'RULE-004',
    name: '任务完成通知',
    condition: '重要任务执行完成',
    severity: 'info',
    channels: ['elink'],
    recipients: ['全体成员'],
    enabled: true,
    createdAt: '2024-05-28 16:45:00',
  },
];

const mockAlertLevels: AlertLevel[] = [
  { id: 'critical', name: '严重', color: '#ef4444', priority: 1 },
  { id: 'warning', name: '警告', color: '#eab308', priority: 2 },
  { id: 'info', name: '信息', color: '#3b82f6', priority: 3 },
];

const mockRecipients: Recipient[] = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', phone: '13800138001', roles: ['管理员', '运维'] },
  { id: '2', name: '李四', email: 'lisi@example.com', phone: '13800138002', roles: ['运维'] },
  { id: '3', name: '王五', email: 'wangwu@example.com', phone: '13800138003', roles: ['开发'] },
  { id: '4', name: '赵六', email: 'zhaoliu@example.com', phone: '13800138004', roles: ['安全'] },
  { id: '5', name: '钱七', email: 'qianqi@example.com', phone: '13800138005', roles: ['安全', '运维'] },
];

const alertHistory = [
  { id: 'ALERT-001', rule: '任务失败告警', severity: 'critical', triggeredAt: '2024-06-01 10:25:00', status: 'sent', recipient: '张三' },
  { id: 'ALERT-002', rule: '任务超时告警', severity: 'warning', triggeredAt: '2024-06-01 09:15:00', status: 'sent', recipient: '王五' },
  { id: 'ALERT-003', rule: '任务完成通知', severity: 'info', triggeredAt: '2024-06-01 08:30:00', status: 'sent', recipient: '全体成员' },
  { id: 'ALERT-004', rule: '任务失败告警', severity: 'critical', triggeredAt: '2024-05-31 16:45:00', status: 'failed', recipient: '李四' },
  { id: 'ALERT-005', rule: 'CPU使用率告警', severity: 'warning', triggeredAt: '2024-05-31 14:20:00', status: 'sent', recipient: '赵六' },
];

export function TaskAlertManagement() {
  const [activeTab, setActiveTab] = useState<'rules' | 'levels' | 'recipients' | 'history'>('rules');
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);
  const [alertLevels, setAlertLevels] = useState<AlertLevel[]>(mockAlertLevels);
  const [recipients, setRecipients] = useState<Recipient[]>(mockRecipients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'rule' | 'level' | 'recipient'>('rule');

  const getSeverityBadge = (severity: string) => {
    const styles = {
      critical: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      warning: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      info: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
    };
    const labels = {
      critical: '严重',
      warning: '警告',
      info: '信息',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[severity as keyof typeof styles]}`}>
        {labels[severity as keyof typeof labels]}
      </span>
    );
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      elink: <Bell className="w-4 h-4" />,
    };
    return icons[channel as keyof typeof icons] || <Bell className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: 'bg-[#00C853]/20 text-[#00C853]',
      failed: 'bg-[#FF3B30]/20 text-[#FF3B30]',
    };
    const icons = {
      sent: <CheckCircle2 className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
    };
    const labels = {
      sent: '已发送',
      failed: '发送失败',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleOpenModal = (type: 'rule' | 'level' | 'recipient', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除吗？')) {
      if (activeTab === 'rules') {
        setAlertRules(alertRules.filter(r => r.id !== id));
      } else if (activeTab === 'recipients') {
        setRecipients(recipients.filter(r => r.id !== id));
      }
    }
  };

  const toggleRule = (id: string) => {
    setAlertRules(alertRules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const renderRulesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="搜索告警规则..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          />
        </div>
        <button
          onClick={() => handleOpenModal('rule')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增规则
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">规则名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">触发条件</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">级别</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">通知渠道</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {alertRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-[#181F32]/30">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-[#F3F4F6]">{rule.name}</div>
                  <div className="text-xs text-[#6B7280]">{rule.createdAt}</div>
                </td>
                <td className="px-6 py-4 text-sm text-[#D1D5DB]">{rule.condition}</td>
                <td className="px-6 py-4">{getSeverityBadge(rule.severity)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {rule.channels.map((channel, idx) => (
                      <span key={idx} className="p-1.5 bg-[#181F32] rounded-lg text-[#9CA3AF]">
                        {getChannelIcon(channel)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      rule.enabled
                        ? 'bg-[#00C853]/20 text-[#00C853]'
                        : 'bg-[#2A354D] text-[#9CA3AF]'
                    }`}
                  >
                    {rule.enabled ? '已启用' : '已禁用'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal('rule', rule)}
                      className="p-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
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
  );

  const renderLevelsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#F3F4F6]">告警级别配置</h3>
        <button
          onClick={() => handleOpenModal('level')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增级别
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alertLevels.map((level) => (
          <div key={level.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: level.color }}
                />
                <span className="text-[#F3F4F6] font-semibold">{level.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#0066FF]/10 rounded transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-[#9CA3AF]">
              优先级: {level.priority}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecipientsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="搜索接收人..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          />
        </div>
        <button
          onClick={() => handleOpenModal('recipient')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增接收人
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">姓名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">邮箱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">电话</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">角色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {recipients.map((recipient) => (
              <tr key={recipient.id} className="hover:bg-[#181F32]/30">
                <td className="px-6 py-4 text-sm font-medium text-[#F3F4F6]">{recipient.name}</td>
                <td className="px-6 py-4 text-sm text-[#D1D5DB]">{recipient.email}</td>
                <td className="px-6 py-4 text-sm text-[#D1D5DB]">{recipient.phone || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {recipient.roles.map((role, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#181F32] text-[#D1D5DB] rounded text-xs">
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal('recipient', recipient)}
                      className="p-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(recipient.id)}
                      className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
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
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="搜索告警历史..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">告警ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">触发规则</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">级别</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">接收人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">触发时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {alertHistory.map((alert) => (
              <tr key={alert.id} className="hover:bg-[#181F32]/30">
                <td className="px-6 py-4 text-sm font-mono text-[#9CA3AF]">{alert.id}</td>
                <td className="px-6 py-4 text-sm text-[#F3F4F6]">{alert.rule}</td>
                <td className="px-6 py-4">{getSeverityBadge(alert.severity)}</td>
                <td className="px-6 py-4 text-sm text-[#D1D5DB]">{alert.recipient}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-[#9CA3AF]">
                    <Clock className="w-3 h-3" />
                    {alert.triggeredAt}
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(alert.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务告警管理与推送</h1>
        <p className="text-[#9CA3AF]">配置告警规则、级别、接收人，查看推送历史</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-1 mb-6 inline-flex">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'rules'
              ? 'bg-[#0066FF] text-[#F3F4F6]'
              : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          <Bell className="w-4 h-4" />
          告警规则
        </button>
        <button
          onClick={() => setActiveTab('levels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'levels'
              ? 'bg-[#0066FF] text-[#F3F4F6]'
              : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          <Settings className="w-4 h-4" />
          级别配置
        </button>
        <button
          onClick={() => setActiveTab('recipients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'recipients'
              ? 'bg-[#0066FF] text-[#F3F4F6]'
              : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          <Users className="w-4 h-4" />
          接收人管理
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-[#0066FF] text-[#F3F4F6]'
              : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          <Clock className="w-4 h-4" />
          推送历史
        </button>
      </div>

      {activeTab === 'rules' && renderRulesTab()}
      {activeTab === 'levels' && renderLevelsTab()}
      {activeTab === 'recipients' && renderRecipientsTab()}
      {activeTab === 'history' && renderHistoryTab()}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingItem ? '编辑' : '新增'}
                {modalType === 'rule' ? '告警规则' : modalType === 'level' ? '告警级别' : '接收人'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-[#9CA3AF] text-center">表单内容开发中...</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2A354D]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
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
      )}
    </div>
  );
}
