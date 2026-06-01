'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, Clock, Zap, Bell, Play, X } from 'lucide-react';

// 触发配置数据类型
interface TriggerConfig {
  id: string;
  taskName: string;
  triggerMode: 'manual' | 'automatic' | 'event';
  triggerConfig: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
}

// 模拟数据
const mockData: TriggerConfig[] = [
  { id: 'TRIG-001', taskName: '每日安全扫描', triggerMode: 'automatic', triggerConfig: 'Cron: 0 2 * * *', status: 'enabled', createdAt: '2026-05-20 10:00:00' },
  { id: 'TRIG-002', taskName: '漏洞补丁检查', triggerMode: 'event', triggerConfig: '事件: 新漏洞告警', status: 'enabled', createdAt: '2026-05-21 14:30:00' },
  { id: 'TRIG-003', taskName: '系统备份', triggerMode: 'manual', triggerConfig: '手动触发', status: 'enabled', createdAt: '2026-05-22 09:15:00' },
  { id: 'TRIG-004', taskName: '日志分析', triggerMode: 'automatic', triggerConfig: 'Cron: 0 */4 * * *', status: 'disabled', createdAt: '2026-05-23 16:45:00' },
  { id: 'TRIG-005', taskName: '性能监控', triggerMode: 'event', triggerConfig: '事件: CPU超过80%', status: 'enabled', createdAt: '2026-05-24 11:00:00' },
];

export function TriggerModeConfig() {
  const [data, setData] = useState<TriggerConfig[]>(mockData);
  const [searchName, setSearchName] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TriggerConfig | null>(null);
  const [formData, setFormData] = useState<Partial<TriggerConfig>>({
    taskName: '',
    triggerMode: 'manual',
    triggerConfig: '',
    status: 'enabled',
  });

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchName = item.taskName.toLowerCase().includes(searchName.toLowerCase());
    const matchMode = !filterMode || item.triggerMode === filterMode;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchMode && matchStatus;
  });

  // 打开新增/编辑模态框
  const handleOpenModal = (item?: TriggerConfig) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ taskName: '', triggerMode: 'manual', triggerConfig: '', status: 'enabled' });
    }
    setIsModalOpen(true);
  };

  // 保存数据
  const handleSave = () => {
    if (!formData.taskName || !formData.triggerMode) return;

    if (editingItem) {
      // 编辑
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...formData } as TriggerConfig : item));
    } else {
      // 新增
      const newItem: TriggerConfig = {
        id: `TRIG-${String(data.length + 1).padStart(3, '0')}`,
        taskName: formData.taskName,
        triggerMode: formData.triggerMode as any,
        triggerConfig: formData.triggerConfig || '',
        status: 'enabled',
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
  };

  // 删除数据
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个触发配置吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  // 立即执行
  const handleRunNow = (item: TriggerConfig) => {
    alert(`正在立即执行任务: ${item.taskName}`);
  };

  // 获取触发模式图标
  const getTriggerModeIcon = (mode: string) => {
    const icons = {
      manual: Play,
      automatic: Clock,
      event: Zap,
    };
    const Icon = icons[mode as keyof typeof icons] || Play;
    return <Icon className="w-4 h-4" />;
  };

  // 获取触发模式标签
  const getTriggerModeBadge = (mode: string) => {
    const styles = {
      manual: 'bg-[#6366F1]/20 text-[#6366F1] border-purple-500/30',
      automatic: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      event: 'bg-[#FF9100]/20 text-[#FF9100] border-orange-500/30',
    };
    const labels = {
      manual: '手动触发',
      automatic: '自动触发',
      event: '事件触发',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[mode as keyof typeof styles]}`}>
        {getTriggerModeIcon(mode)}
        {labels[mode as keyof typeof labels]}
      </span>
    );
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const styles = {
      enabled: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      disabled: 'bg-[#4A5570]/20 text-[#9CA3AF] border-[#4A5570]/30',
    };
    const labels = {
      enabled: '已启用',
      disabled: '已禁用',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务自动/手动/事件多模式触发</h1>
        <p className="text-[#9CA3AF]">配置任务的多种触发方式</p>
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

            {/* 触发模式筛选 */}
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部模式</option>
              <option value="manual">手动触发</option>
              <option value="automatic">自动触发</option>
              <option value="event">事件触发</option>
            </select>

            {/* 状态筛选 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="enabled">已启用</option>
              <option value="disabled">已禁用</option>
            </select>
          </div>

          {/* 新增按钮 */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增配置
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
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">触发模式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">触发配置</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.taskName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getTriggerModeBadge(item.triggerMode)}</td>
                <td className="px-6 py-4 text-sm text-[#9CA3AF]">{item.triggerConfig}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunNow(item)}
                      className="p-1.5 text-[#00C853] hover:text-[#33D97A] hover:bg-[#00C853]/10 rounded transition-colors"
                      title="立即执行"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
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

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">暂无数据</p>
          </div>
        )}
      </div>

      {/* 新增/编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingItem ? '编辑触发配置' : '新增触发配置'}
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
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务名称</label>
                <input
                  type="text"
                  value={formData.taskName || ''}
                  onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请选择或输入任务名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">触发模式</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'manual', label: '手动触发', icon: Play, desc: '手动点击执行' },
                    { value: 'automatic', label: '自动触发', icon: Clock, desc: '按Cron定时执行' },
                    { value: 'event', label: '事件触发', icon: Zap, desc: '事件触发执行' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, triggerMode: option.value as any })}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        formData.triggerMode === option.value
                          ? 'border-blue-500 bg-[#0066FF]/10'
                          : 'border-[#2A354D] bg-[#181F32] hover:border-[#3A4560]'
                      }`}
                    >
                      <option.icon className={`w-5 h-5 mb-2 ${
                        formData.triggerMode === option.value ? 'text-[#0066FF]' : 'text-[#9CA3AF]'
                      }`} />
                      <div className={`font-medium ${
                        formData.triggerMode === option.value ? 'text-[#0066FF]' : 'text-[#F3F4F6]'
                      }`}>{option.label}</div>
                      <div className="text-xs text-[#6B7280] mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 手动触发配置 */}
              {formData.triggerMode === 'manual' && (
                <div className="bg-[#181F32]/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <Play className="w-4 h-4" />
                    <span>手动触发无需额外配置，在任务列表中点击"立即执行"即可</span>
                  </div>
                </div>
              )}

              {/* 自动触发配置 */}
              {formData.triggerMode === 'automatic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">Cron表达式</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={formData.triggerConfig || ''}
                        onChange={(e) => setFormData({ ...formData, triggerConfig: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono"
                        placeholder="0 2 * * *"
                      />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1.5">格式: 分 时 日 月 周</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: '每天凌晨2点', value: '0 2 * * *' },
                      { label: '每4小时执行', value: '0 */4 * * *' },
                      { label: '每周一上午9点', value: '0 9 * * 1' },
                      { label: '每小时执行', value: '0 * * * *' },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, triggerConfig: preset.value })}
                        className="px-3 py-2 text-sm bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-left transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 事件触发配置 */}
              {formData.triggerMode === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">事件类型</label>
                  <select
                    value={formData.triggerConfig || ''}
                    onChange={(e) => setFormData({ ...formData, triggerConfig: `事件: ${e.target.value}` })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="">请选择事件类型</option>
                    <option value="新漏洞告警">新漏洞告警</option>
                    <option value="CPU超过80%">CPU超过80%</option>
                    <option value="内存使用率过高">内存使用率过高</option>
                    <option value="磁盘空间不足">磁盘空间不足</option>
                    <option value="API调用">API调用</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">状态</label>
                <select
                  value={formData.status || 'enabled'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="enabled">已启用</option>
                  <option value="disabled">已禁用</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
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
      )}
    </div>
  );
}
