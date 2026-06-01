'use client';

import React, { useState } from 'react';
import { Search, Plus, RotateCcw, Eye, ArrowUp, ArrowDown, GitCompare, FileText, CheckCircle2, Clock, XCircle, X, ArrowLeftRight } from 'lucide-react';

interface TaskVersion {
  id: string;
  taskName: string;
  version: string;
  description: string;
  status: 'draft' | 'reviewing' | 'published' | 'offline';
  createdAt: string;
  content: string;
}

const mockData: TaskVersion[] = [
  { id: 'VER-001', taskName: '防火墙配置同步任务', version: 'v1.0.3', description: '修复了SSH连接超时问题', status: 'published', createdAt: '2026-05-28 10:30:00', content: 'import subprocess\n\ndef sync_firewall_config():\n    # 执行配置同步\n    subprocess.run(["/usr/bin/sync_config"])' },
  { id: 'VER-002', taskName: '防火墙配置同步任务', version: 'v1.0.2', description: '添加了错误日志记录', status: 'offline', createdAt: '2026-05-25 14:20:00', content: 'import subprocess\nimport logging\n\ndef sync_firewall_config():\n    logging.info("开始同步")\n    subprocess.run(["/usr/bin/sync_config"])' },
  { id: 'VER-003', taskName: 'IDS日志采集任务', version: 'v2.1.0', description: '新增REST API采集模式', status: 'reviewing', createdAt: '2026-05-27 09:15:00', content: 'import requests\n\ndef collect_ids_logs():\n    response = requests.get("https://ids.local/api/v1/logs")\n    return response.json()' },
  { id: 'VER-004', taskName: 'IDS日志采集任务', version: 'v2.0.1', description: '初始版本', status: 'published', createdAt: '2026-05-20 16:45:00', content: 'import requests\n\ndef collect_ids_logs():\n    response = requests.get("https://ids.local/api/v1/logs")\n    return response.json()' },
  { id: 'VER-005', taskName: '网络设备监控', version: 'v3.2.1', description: '性能优化版本', status: 'draft', createdAt: '2026-05-29 11:00:00', content: 'from pysnmp.hlapi import *\n\ndef monitor_device():\n    # SNMP监控逻辑\n    pass' },
];

const approvalSteps = [
  { step: 1, name: '提交申请', status: 'completed', operator: '张三', time: '2026-05-27 09:15:00' },
  { step: 2, name: '技术审核', status: 'in_progress', operator: '李四', time: '-' },
  { step: 3, name: '安全审核', status: 'pending', operator: '-', time: '-' },
  { step: 4, name: '最终审批', status: 'pending', operator: '-', time: '-' },
];

export function TaskVersionManagement() {
  const [data, setData] = useState<TaskVersion[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'new' | 'rollback' | 'publish' | 'offline' | 'diff' | 'approval'>('new');
  const [selectedVersion, setSelectedVersion] = useState<TaskVersion | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<TaskVersion[]>([]);
  const [formData, setFormData] = useState({ taskName: '', description: '', content: '' });

  const filteredData = data.filter(item => {
    const matchSearch = item.taskName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.version.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-[#4A5570]/20 text-[#9CA3AF] border-[#4A5570]/30',
      reviewing: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      published: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      offline: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      draft: '草稿',
      reviewing: '审核中',
      published: '已发布',
      offline: '已下线',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleOpenModal = (type: typeof modalType, version?: TaskVersion) => {
    setModalType(type);
    setSelectedVersion(version || null);
    if (type === 'new') {
      setFormData({ taskName: version?.taskName || '', description: '', content: version?.content || '' });
    }
    setIsModalOpen(true);
  };

  const handleToggleVersionSelect = (version: TaskVersion) => {
    setSelectedVersions(prev => {
      const isSelected = prev.some(v => v.id === version.id);
      if (isSelected) {
        return prev.filter(v => v.id !== version.id);
      }
      if (prev.length >= 2) {
        return [prev[1], version];
      }
      return [...prev, version];
    });
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      handleOpenModal('diff', selectedVersions[0]);
    }
  };

  const handleRollback = () => {
    alert(`版本回滚成功！已回滚到 ${selectedVersion?.version}`);
    setIsModalOpen(false);
  };

  const handlePublish = () => {
    alert(`版本 ${selectedVersion?.version} 发布流程已启动！`);
    setIsModalOpen(false);
  };

  const handleOffline = () => {
    alert(`版本 ${selectedVersion?.version} 下线流程已启动！`);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!formData.taskName || !formData.description) return;
    const newVersion: TaskVersion = {
      id: `VER-${String(data.length + 1).padStart(3, '0')}`,
      taskName: formData.taskName,
      version: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      description: formData.description,
      status: 'draft',
      createdAt: new Date().toLocaleString('zh-CN'),
      content: formData.content,
    };
    setData([newVersion, ...data]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务版本管理</h1>
        <p className="text-[#9CA3AF]">管理任务版本、对比差异、发布和回滚</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索任务名称或版本..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="reviewing">审核中</option>
              <option value="published">已发布</option>
              <option value="offline">已下线</option>
            </select>
            {selectedVersions.length > 0 && (
              <span className="text-sm text-[#9CA3AF]">
                已选择 {selectedVersions.length}/2 个版本
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {selectedVersions.length === 2 && (
              <button
                onClick={handleCompare}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-[#6366F1] text-[#F3F4F6] rounded-lg transition-colors"
              >
                <GitCompare className="w-4 h-4" />
                对比差异
              </button>
            )}
            <button
              onClick={() => handleOpenModal('new')}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增版本
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                <input type="checkbox" className="rounded border-[#3A4560] bg-[#181F32]" disabled />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">版本号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">版本描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedVersions.some(v => v.id === item.id)}
                    onChange={() => handleToggleVersionSelect(item)}
                    className="rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.taskName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF] border border-blue-500/30">
                    {item.version}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#9CA3AF] max-w-xs truncate" title={item.description}>
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal('approval', item)}
                      className="p-1.5 text-[#FF9100] hover:text-[#FF9100] hover:bg-[#FF9100]/10 rounded transition-colors"
                      title="审核流程"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    {item.status === 'published' && (
                      <button
                        onClick={() => handleOpenModal('rollback', item)}
                        className="p-1.5 text-[#00BCD4] hover:text-[#00BCD4] hover:bg-[#00BCD4]/10 rounded transition-colors"
                        title="回滚"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'draft' && (
                      <button
                        onClick={() => handleOpenModal('publish', item)}
                        className="p-1.5 text-[#00C853] hover:text-[#33D97A] hover:bg-[#00C853]/10 rounded transition-colors"
                        title="发布"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'published' && (
                      <button
                        onClick={() => handleOpenModal('offline', item)}
                        className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="下线"
                      >
                        <ArrowDown className="w-4 h-4" />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`bg-[#20293F] border border-[#2A354D] rounded-xl w-full ${modalType === 'diff' ? 'max-w-6xl' : 'max-w-2xl'} mx-4 max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {modalType === 'new' && '新增版本'}
                {modalType === 'rollback' && `回滚到 ${selectedVersion?.version}`}
                {modalType === 'publish' && `发布 ${selectedVersion?.version}`}
                {modalType === 'offline' && `下线 ${selectedVersion?.version}`}
                {modalType === 'diff' && '版本差异对比'}
                {modalType === 'approval' && '审核流程'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {modalType === 'new' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务名称</label>
                    <input
                      type="text"
                      value={formData.taskName}
                      onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="请输入任务名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">版本描述</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="请输入版本描述"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务代码</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono text-sm"
                      placeholder="请输入任务代码"
                    />
                  </div>
                </div>
              )}

              {modalType === 'rollback' && (
                <div className="space-y-4">
                  <div className="bg-[#FF9100]/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-[#FF9100] text-sm">
                      警告：此操作将把当前运行的版本回滚到 {selectedVersion?.version}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">回滚原因</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="请输入回滚原因"
                    />
                  </div>
                </div>
              )}

              {modalType === 'publish' && (
                <div className="space-y-4">
                  <div className="bg-[#0066FF]/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-[#0066FF] text-sm">
                      即将发布版本 {selectedVersion?.version}，此操作将触发审核流程
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">发布说明</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="请输入发布说明"
                    />
                  </div>
                </div>
              )}

              {modalType === 'offline' && (
                <div className="space-y-4">
                  <div className="bg-[#FF3B30]/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-[#FF3B30] text-sm">
                      警告：此操作将下线版本 {selectedVersion?.version}，相关任务将无法使用此版本
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">下线原因</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      placeholder="请输入下线原因"
                    />
                  </div>
                </div>
              )}

              {modalType === 'diff' && selectedVersions.length === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#0066FF]/20 text-[#0066FF] rounded text-xs font-medium">
                        {selectedVersions[0].version}
                      </span>
                      <span className="text-[#9CA3AF] text-sm">{selectedVersions[0].taskName}</span>
                    </div>
                    <pre className="bg-[#181F32] p-4 rounded-lg text-sm text-[#D1D5DB] overflow-x-auto max-h-96 overflow-y-auto">
                      <code>{selectedVersions[0].content}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#00C853]/20 text-[#00C853] rounded text-xs font-medium">
                        {selectedVersions[1].version}
                      </span>
                      <span className="text-[#9CA3AF] text-sm">{selectedVersions[1].taskName}</span>
                    </div>
                    <pre className="bg-[#181F32] p-4 rounded-lg text-sm text-[#D1D5DB] overflow-x-auto max-h-96 overflow-y-auto">
                      <code>{selectedVersions[1].content}</code>
                    </pre>
                  </div>
                </div>
              )}

              {modalType === 'approval' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-medium text-[#F3F4F6]">{selectedVersion?.taskName}</span>
                    <span className="px-2 py-1 bg-[#0066FF]/20 text-[#0066FF] rounded text-xs">{selectedVersion?.version}</span>
                  </div>
                  <div className="relative pl-8 space-y-6">
                    {approvalSteps.map((step, index) => (
                      <div key={step.step} className="relative">
                        {index < approvalSteps.length - 1 && (
                          <div className={`absolute left-[-20px] top-6 w-0.5 h-8 ${step.status === 'completed' ? 'bg-[#00C853]' : 'bg-[#2A354D]'}`} />
                        )}
                        <div className={`absolute left-[-24px] top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-[#00C853] text-[#F3F4F6]' :
                          step.status === 'in_progress' ? 'bg-[#FF9100] text-[#F3F4F6] animate-pulse' :
                          'bg-[#2A354D] text-[#9CA3AF]'
                        }`}>
                          {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                           step.status === 'in_progress' ? <Clock className="w-4 h-4" /> :
                           step.step}
                        </div>
                        <div className="bg-[#181F32] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-[#F3F4F6]">{step.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              step.status === 'completed' ? 'bg-[#00C853]/20 text-[#00C853]' :
                              step.status === 'in_progress' ? 'bg-[#FF9100]/20 text-[#FF9100]' :
                              'bg-[#2A354D] text-[#9CA3AF]'
                            }`}>
                              {step.status === 'completed' ? '已完成' :
                               step.status === 'in_progress' ? '进行中' : '待处理'}
                            </span>
                          </div>
                          <div className="text-sm text-[#9CA3AF]">
                            <p>处理人：{step.operator}</p>
                            <p>时间：{step.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {modalType !== 'diff' && modalType !== 'approval' && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={modalType === 'new' ? handleSave :
                           modalType === 'rollback' ? handleRollback :
                           modalType === 'publish' ? handlePublish :
                           handleOffline}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    modalType === 'offline' ? 'bg-[#FF3B30] hover:bg-[#CC2F26] text-[#F3F4F6]' :
                    'bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6]'
                  }`}
                >
                  {modalType === 'new' ? '保存' :
                   modalType === 'rollback' ? '确认回滚' :
                   modalType === 'publish' ? '提交发布' :
                   '确认下线'}
                </button>
              </div>
            )}
            {(modalType === 'diff' || modalType === 'approval') && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
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
