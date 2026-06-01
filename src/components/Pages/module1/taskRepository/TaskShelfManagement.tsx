'use client';

import React, { useState } from 'react';
import { Search, Plus, ArrowUp, ArrowDown, FileText, History, CheckCircle2, Clock, XCircle, X, User, Calendar } from 'lucide-react';

interface TaskShelf {
  id: string;
  taskName: string;
  status: 'published' | 'offline' | 'pending';
  publishTime: string;
  offlineTime: string;
  operator: string;
  version: string;
  description: string;
}

interface AuditLog {
  id: string;
  taskId: string;
  action: 'publish' | 'offline';
  operator: string;
  time: string;
  reason: string;
}

const mockData: TaskShelf[] = [
  { 
    id: 'TASK-001', 
    taskName: '防火墙配置同步任务', 
    status: 'published', 
    publishTime: '2026-05-28 10:30:00', 
    offlineTime: '-', 
    operator: '张三',
    version: 'v1.0.3',
    description: '自动同步防火墙配置，确保网络安全策略一致'
  },
  { 
    id: 'TASK-002', 
    taskName: 'IDS日志采集任务', 
    status: 'published', 
    publishTime: '2026-05-25 14:20:00', 
    offlineTime: '-', 
    operator: '李四',
    version: 'v2.0.1',
    description: '实时采集IDS入侵检测系统日志数据'
  },
  { 
    id: 'TASK-003', 
    taskName: '网络设备监控', 
    status: 'offline', 
    publishTime: '2026-05-20 09:15:00', 
    offlineTime: '2026-05-27 16:45:00', 
    operator: '王五',
    version: 'v3.2.0',
    description: '监控网络设备运行状态和性能指标'
  },
  { 
    id: 'TASK-004', 
    taskName: '数据库备份任务', 
    status: 'published', 
    publishTime: '2026-05-22 11:00:00', 
    offlineTime: '-', 
    operator: '赵六',
    version: 'v1.1.0',
    description: '定期备份数据库，保障数据安全'
  },
  { 
    id: 'TASK-005', 
    taskName: 'Web应用安全扫描', 
    status: 'pending', 
    publishTime: '-', 
    offlineTime: '-', 
    operator: '-',
    version: 'v2.0.0',
    description: '自动扫描Web应用安全漏洞'
  },
];

const mockAuditLogs: AuditLog[] = [
  { id: 'LOG-001', taskId: 'TASK-003', action: 'offline', operator: '王五', time: '2026-05-27 16:45:00', reason: '发现性能问题，需要优化后重新发布' },
  { id: 'LOG-002', taskId: 'TASK-001', action: 'publish', operator: '张三', time: '2026-05-28 10:30:00', reason: '修复SSH连接超时问题，版本升级' },
  { id: 'LOG-003', taskId: 'TASK-002', action: 'publish', operator: '李四', time: '2026-05-25 14:20:00', reason: '新增REST API采集模式' },
];

const approvalStepsPublish = [
  { step: 1, name: '提交上架申请', status: 'completed', operator: '张三', time: '2026-05-28 09:00:00' },
  { step: 2, name: '技术审核', status: 'completed', operator: '技术主管', time: '2026-05-28 09:30:00' },
  { step: 3, name: '安全审核', status: 'completed', operator: '安全工程师', time: '2026-05-28 10:00:00' },
  { step: 4, name: '最终审批', status: 'completed', operator: '运维经理', time: '2026-05-28 10:20:00' },
];

const approvalStepsOffline = [
  { step: 1, name: '提交下架申请', status: 'completed', operator: '王五', time: '2026-05-27 15:00:00' },
  { step: 2, name: '技术审核', status: 'completed', operator: '技术主管', time: '2026-05-27 15:30:00' },
  { step: 3, name: '安全审核', status: 'completed', operator: '安全工程师', time: '2026-05-27 16:00:00' },
  { step: 4, name: '最终审批', status: 'completed', operator: '运维经理', time: '2026-05-27 16:30:00' },
];

export function TaskShelfManagement() {
  const [data, setData] = useState<TaskShelf[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'publish' | 'offline' | 'history' | 'approval'>('publish');
  const [selectedTask, setSelectedTask] = useState<TaskShelf | null>(null);
  const [formData, setFormData] = useState({ reason: '' });

  const filteredData = data.filter(item => {
    const matchSearch = item.taskName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-500/20 text-green-400 border-green-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    const labels = {
      published: '已上架',
      offline: '已下架',
      pending: '待审核',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleOpenModal = (type: typeof modalType, task?: TaskShelf) => {
    setModalType(type);
    setSelectedTask(task || null);
    setFormData({ reason: '' });
    setIsModalOpen(true);
  };

  const handlePublish = () => {
    if (!formData.reason) return;
    alert(`上架申请已提交！任务：${selectedTask?.taskName}`);
    setIsModalOpen(false);
  };

  const handleOffline = () => {
    if (!formData.reason) return;
    alert(`下架申请已提交！任务：${selectedTask?.taskName}`);
    setIsModalOpen(false);
  };

  const getTaskAuditLogs = (taskId: string) => {
    return mockAuditLogs.filter(log => log.taskId === taskId);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务上下架管理</h1>
        <p className="text-slate-400">管理任务的上架、下架和审批流程</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索任务名称..."
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
              <option value="published">已上架</option>
              <option value="offline">已下架</option>
              <option value="pending">待审核</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">版本</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">上架时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">下架时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.taskName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {item.version}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.publishTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.offlineTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.operator}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal('history', item)}
                      className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                      title="操作日志"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    {(item.status === 'offline' || item.status === 'pending') && (
                      <button
                        onClick={() => handleOpenModal('publish', item)}
                        className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors"
                        title="申请上架"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'published' && (
                      <button
                        onClick={() => handleOpenModal('offline', item)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                        title="申请下架"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleOpenModal('approval', item)}
                        className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded transition-colors"
                        title="查看审批流程"
                      >
                        <FileText className="w-4 h-4" />
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
            <p className="text-slate-500">暂无数据</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {modalType === 'publish' && '申请上架'}
                {modalType === 'offline' && '申请下架'}
                {modalType === 'history' && '操作日志'}
                {modalType === 'approval' && '审批流程'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {modalType === 'publish' && selectedTask && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-400 text-sm">
                      即将上架任务：{selectedTask.taskName} ({selectedTask.version})
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">任务描述</label>
                    <p className="text-slate-400 text-sm bg-slate-800 p-3 rounded-lg">{selectedTask.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">上架原因</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入上架原因"
                    />
                  </div>
                  <div className="text-sm text-slate-500">
                    <p>注意：上架申请将触发审批流程，审批通过后任务将自动上线。</p>
                  </div>
                </div>
              )}

              {modalType === 'offline' && selectedTask && (
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      警告：即将下架任务：{selectedTask.taskName} ({selectedTask.version})
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">任务描述</label>
                    <p className="text-slate-400 text-sm bg-slate-800 p-3 rounded-lg">{selectedTask.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">下架原因</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入下架原因"
                    />
                  </div>
                  <div className="text-sm text-slate-500">
                    <p>注意：下架申请将触发审批流程，审批通过后任务将自动下线。</p>
                  </div>
                </div>
              )}

              {modalType === 'history' && selectedTask && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-medium text-white">{selectedTask.taskName}</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{selectedTask.version}</span>
                  </div>
                  <div className="space-y-3">
                    {getTaskAuditLogs(selectedTask.id).map((log) => (
                      <div key={log.id} className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {log.action === 'publish' ? (
                              <ArrowUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-400" />
                            )}
                            <span className="font-medium text-white">
                              {log.action === 'publish' ? '上架' : '下架'}
                            </span>
                          </div>
                          <span className="text-sm text-slate-400">{log.time}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>操作人：{log.operator}</span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 bg-slate-700/50 p-2 rounded">
                          {log.reason}
                        </div>
                      </div>
                    ))}
                    {getTaskAuditLogs(selectedTask.id).length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        暂无操作日志
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modalType === 'approval' && selectedTask && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-medium text-white">{selectedTask.taskName}</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{selectedTask.version}</span>
                  </div>
                  <div className="relative pl-8 space-y-6">
                    {(selectedTask.status === 'pending' ? approvalStepsPublish : approvalStepsOffline).map((step, index) => (
                      <div key={step.step} className="relative">
                        {index < approvalStepsPublish.length - 1 && (
                          <div className={`absolute left-[-20px] top-6 w-0.5 h-8 ${step.status === 'completed' ? 'bg-green-500' : 'bg-slate-700'}`} />
                        )}
                        <div className={`absolute left-[-24px] top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-500 text-white' :
                          step.status === 'in_progress' ? 'bg-yellow-500 text-white animate-pulse' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                           step.status === 'in_progress' ? <Clock className="w-4 h-4" /> :
                           step.step}
                        </div>
                        <div className="bg-slate-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{step.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              step.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              step.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {step.status === 'completed' ? '已完成' :
                               step.status === 'in_progress' ? '进行中' : '待处理'}
                            </span>
                          </div>
                          <div className="text-sm text-slate-400 space-y-1">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>处理人：{step.operator}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>时间：{step.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {(modalType === 'publish' || modalType === 'offline') && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={modalType === 'publish' ? handlePublish : handleOffline}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    modalType === 'offline' ? 'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {modalType === 'publish' ? '提交上架申请' : '提交下架申请'}
                </button>
              </div>
            )}
            {(modalType === 'history' || modalType === 'approval') && (
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
