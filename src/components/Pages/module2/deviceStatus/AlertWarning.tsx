'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Bell, Eye, AlertTriangle, CheckCircle, XCircle, Settings } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: string;
  severity: 'high' | 'medium' | 'low';
  status: 'enabled' | 'disabled';
  targets: string[];
  notifyChannels: string[];
  createdBy: string;
  createTime: string;
}

const mockRules: AlertRule[] = [
  { id: 'RULE-001', name: 'CPU使用率过高告警', metric: 'CPU使用率', condition: '>', threshold: '90%', severity: 'high', status: 'enabled', targets: ['DEV-001', 'DEV-002', 'DEV-003'], notifyChannels: ['邮件', '短信', '企微'], createdBy: 'admin', createTime: '2026-05-15 10:00:00' },
  { id: 'RULE-002', name: '内存使用率警告', metric: '内存使用率', condition: '>', threshold: '85%', severity: 'medium', status: 'enabled', targets: ['DEV-001', 'DEV-006'], notifyChannels: ['邮件', '企微'], createdBy: 'admin', createTime: '2026-05-16 14:30:00' },
  { id: 'RULE-003', name: '设备离线告警', metric: '心跳检测', condition: '=', threshold: '0', severity: 'high', status: 'enabled', targets: ['ALL'], notifyChannels: ['短信', '电话'], createdBy: 'system', createTime: '2026-05-01 00:00:00' },
  { id: 'RULE-004', name: '磁盘空间不足', metric: '磁盘使用率', condition: '>', threshold: '95%', severity: 'high', status: 'enabled', targets: ['DEV-006', 'DEV-007'], notifyChannels: ['邮件', '企微'], createdBy: 'admin', createTime: '2026-05-20 09:15:00' },
  { id: 'RULE-005', name: '网络流量异常', metric: '网络带宽', condition: '>', threshold: '80%', severity: 'low', status: 'disabled', targets: ['DEV-001', 'DEV-002'], notifyChannels: ['邮件'], createdBy: 'admin', createTime: '2026-05-22 11:00:00' },
];

interface AlertEvent {
  id: string;
  ruleName: string;
  deviceName: string;
  metric: string;
  value: string;
  threshold: string;
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'processed' | 'ignored';
  triggerTime: string;
}

const mockEvents: AlertEvent[] = [
  { id: 'EVT-001', ruleName: 'CPU使用率过高告警', deviceName: 'IDS-01', metric: 'CPU使用率', value: '95%', threshold: '90%', severity: 'high', status: 'pending', triggerTime: '2026-06-01 10:35:00' },
  { id: 'EVT-002', ruleName: '内存使用率警告', deviceName: 'DB-01', metric: '内存使用率', value: '88%', threshold: '85%', severity: 'medium', status: 'pending', triggerTime: '2026-06-01 10:30:00' },
  { id: 'EVT-003', ruleName: '设备离线告警', deviceName: 'LB-01', metric: '心跳检测', value: '0', threshold: '0', severity: 'high', status: 'processed', triggerTime: '2026-06-01 09:00:00' },
  { id: 'EVT-004', ruleName: '磁盘空间不足', deviceName: 'APP-01', metric: '磁盘使用率', value: '96%', threshold: '95%', severity: 'high', status: 'pending', triggerTime: '2026-06-01 10:25:00' },
  { id: 'EVT-005', ruleName: 'CPU使用率过高告警', deviceName: 'APP-01', metric: 'CPU使用率', value: '92%', threshold: '90%', severity: 'high', status: 'ignored', triggerTime: '2026-06-01 09:45:00' },
];

export function AlertWarning() {
  const [activeTab, setActiveTab] = useState<'rules' | 'events'>('rules');
  const [rules, setRules] = useState<AlertRule[]>(mockRules);
  const [events] = useState<AlertEvent[]>(mockEvents);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  const filteredRules = rules.filter(r =>
    !searchKeyword || r.name.toLowerCase().includes(searchKeyword.toLowerCase()) || r.metric.includes(searchKeyword)
  );

  const pendingEvents = events.filter(e => e.status === 'pending');
  const stats = {
    totalRules: rules.length,
    enabledRules: rules.filter(r => r.status === 'enabled').length,
    pendingAlerts: pendingEvents.length,
    highSeverity: pendingEvents.filter(e => e.severity === 'high').length,
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    const config: Record<string, string> = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    const labels: Record<string, string> = { high: '高危', medium: '中危', low: '低危' };
    return <span className={`px-2 py-0.5 text-xs rounded-full border ${config[severity]}`}>{labels[severity]}</span>;
  };

  const getStatusBadge = (status: 'enabled' | 'disabled' | 'pending' | 'processed' | 'ignored') => {
    const config: Record<string, string> = {
      enabled: 'bg-green-500/20 text-green-400',
      disabled: 'bg-gray-500/20 text-gray-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      processed: 'bg-green-500/20 text-green-400',
      ignored: 'bg-gray-500/20 text-gray-400',
    };
    const labels: Record<string, string> = { enabled: '启用', disabled: '停用', pending: '待处理', processed: '已处理', ignored: '已忽略' };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${config[status]}`}>{labels[status]}</span>;
  };

  const handleToggleRule = (rule: AlertRule) => {
    setRules(prev => prev.map(r => r.id === rule.id ? { ...r, status: r.status === 'enabled' ? 'disabled' : 'enabled' } : r));
  };

  const handleDeleteRule = (rule: AlertRule) => {
    if (confirm(`确定要删除规则 "${rule.name}" 吗？`)) {
      setRules(prev => prev.filter(r => r.id !== rule.id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">检查异常预警</h2>
        <p className="text-sm text-gray-400 mt-1">配置告警规则，自动识别异常指标，支持多种通知方式</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">告警规则</p>
              <p className="text-xl font-semibold text-white">{stats.totalRules}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已启用</p>
              <p className="text-xl font-semibold text-green-400">{stats.enabledRules}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待处理告警</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.pendingAlerts}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">高危告警</p>
              <p className="text-xl font-semibold text-red-400">{stats.highSeverity}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg mb-6">
        <div className="flex border-b border-[#2A354D]">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'rules' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            告警规则配置
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'events' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            异常事件列表
          </button>
        </div>
      </div>

      {activeTab === 'rules' && (
        <>
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索规则名称/指标..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button
                onClick={() => { setEditingRule(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                新增规则
              </button>
            </div>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A354D]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">规则名称</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">监控指标</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">条件</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">严重程度</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">通知方式</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                      <td className="px-4 py-3 text-sm text-white">{rule.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{rule.metric}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{rule.condition} {rule.threshold}</td>
                      <td className="px-4 py-3">{getSeverityBadge(rule.severity)}</td>
                      <td className="px-4 py-3">{getStatusBadge(rule.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{rule.notifyChannels.join(', ')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleRule(rule)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title={rule.status === 'enabled' ? '禁用' : '启用'}>
                            {rule.status === 'enabled' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setEditingRule(rule); setShowModal(true); }} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="编辑">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteRule(rule)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="删除">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRules.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
          </div>
        </>
      )}

      {activeTab === 'events' && (
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A354D]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">告警规则</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">触发值</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">阈值</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">严重程度</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">触发时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                    <td className="px-4 py-3 text-sm text-white">{event.ruleName}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{event.deviceName}</td>
                    <td className="px-4 py-3 text-sm text-red-400">{event.value}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{event.threshold}</td>
                    <td className="px-4 py-3">{getSeverityBadge(event.severity)}</td>
                    <td className="px-4 py-3">{getStatusBadge(event.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{event.triggerTime}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="查看详情">
                          <Eye className="w-4 h-4" />
                        </button>
                        {event.status === 'pending' && (
                          <>
                            <button className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors" title="标记已处理">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="忽略">
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
          </div>
          {events.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-[480px] max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{editingRule ? '编辑告警规则' : '新增告警规则'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">规则名称</label>
                <input type="text" defaultValue={editingRule?.name || ''} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">监控指标</label>
                  <select defaultValue={editingRule?.metric || 'CPU使用率'} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>CPU使用率</option>
                    <option>内存使用率</option>
                    <option>磁盘使用率</option>
                    <option>网络带宽</option>
                    <option>心跳检测</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">严重程度</label>
                  <select defaultValue={editingRule?.severity || 'medium'} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="high">高危</option>
                    <option value="medium">中危</option>
                    <option value="low">低危</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">告警阈值</label>
                <input type="text" defaultValue={editingRule?.threshold || ''} placeholder="如: 90%" className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">取消</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
