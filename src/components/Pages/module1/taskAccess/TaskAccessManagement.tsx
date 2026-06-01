'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Link2, X } from 'lucide-react';

interface TaskAccess {
  id: string;
  name: string;
  protocol: 'SSH' | 'REST' | 'SNMP' | 'SQL';
  params: string;
  status: 'normal' | 'abnormal' | 'offline';
  createdAt: string;
}

const mockData: TaskAccess[] = [
  { id: 'TASK-001', name: '防火墙配置同步任务', protocol: 'SSH', params: '{"host":"192.168.1.1","port":22}', status: 'normal', createdAt: '2026-05-20 10:30:00' },
  { id: 'TASK-002', name: 'IDS日志采集任务', protocol: 'REST', params: '{"url":"https://ids.local/api/v1/logs"}', status: 'normal', createdAt: '2026-05-21 14:20:00' },
  { id: 'TASK-003', name: '网络设备监控', protocol: 'SNMP', params: '{"community":"public","version":"v2c"}', status: 'abnormal', createdAt: '2026-05-22 09:15:00' },
  { id: 'TASK-004', name: '数据库备份任务', protocol: 'SQL', params: '{"db":"mysql","host":"db.local"}', status: 'offline', createdAt: '2026-05-23 16:45:00' },
  { id: 'TASK-005', name: 'Web应用安全扫描', protocol: 'REST', params: '{"target":"https://app.local"}', status: 'normal', createdAt: '2026-05-24 11:00:00' },
];

export function TaskAccessManagement() {
  const [data, setData] = useState<TaskAccess[]>(mockData);
  const [searchName, setSearchName] = useState('');
  const [filterProtocol, setFilterProtocol] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TaskAccess | null>(null);
  const [formData, setFormData] = useState<Partial<TaskAccess>>({
    name: '',
    protocol: 'SSH',
    params: '',
  });

  const filteredData = data.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchProtocol = !filterProtocol || item.protocol === filterProtocol;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchProtocol && matchStatus;
  });

  const handleOpenModal = (item?: TaskAccess) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', protocol: 'SSH', params: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.protocol) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...formData } as TaskAccess : item));
    } else {
      const newItem: TaskAccess = {
        id: `TASK-${String(data.length + 1).padStart(3, '0')}`,
        name: formData.name,
        protocol: formData.protocol as any,
        params: formData.params || '',
        status: 'normal',
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个任务吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30',
      abnormal: 'bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]/30',
      offline: 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30',
    };
    const labels = {
      normal: '正常',
      abnormal: '异常',
      offline: '离线',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务接入管理</h1>
        <p className="text-[#9CA3AF]">管理和配置自动化任务的接入参数</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
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

            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部协议</option>
              <option value="SSH">SSH</option>
              <option value="REST">REST</option>
              <option value="SNMP">SNMP</option>
              <option value="SQL">SQL</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="normal">正常</option>
              <option value="abnormal">异常</option>
              <option value="offline">离线</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增任务
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">接入协议</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">接入参数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30">
                    {item.protocol}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#9CA3AF] max-w-xs truncate" title={item.params}>
                  {item.params}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`测试连接: ${item.name}`)}
                      className="p-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingItem ? '编辑任务' : '新增任务'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入任务名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">接入协议</label>
                <select
                  value={formData.protocol || 'SSH'}
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
                  value={formData.params || ''}
                  onChange={(e) => setFormData({ ...formData, params: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono text-sm"
                  placeholder='{"key":"value"}'
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
                取消
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}