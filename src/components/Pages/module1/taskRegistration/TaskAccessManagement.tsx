'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Link2, CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';

// 任务接入数据类型
interface TaskAccess {
  id: string;
  name: string;
  protocol: 'SSH' | 'REST' | 'SNMP' | 'SQL';
  params: string;
  status: 'normal' | 'abnormal' | 'offline';
  createdAt: string;
}

// 模拟数据
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

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchProtocol = !filterProtocol || item.protocol === filterProtocol;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchProtocol && matchStatus;
  });

  // 打开新增/编辑模态框
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

  // 保存数据
  const handleSave = () => {
    if (!formData.name || !formData.protocol) return;

    if (editingItem) {
      // 编辑
      setData(data.map(item => item.id === editingItem.id ? { ...item, ...formData } as TaskAccess : item));
    } else {
      // 新增
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

  // 删除数据
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个任务吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  // 连接测试
  const handleTestConnection = (item: TaskAccess) => {
    alert(`正在测试任务 "${item.name}" 的连接...\n\n模拟连接成功！`);
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-500/20 text-green-400 border-green-500/30',
      abnormal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
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
    <div className="p-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务接入管理</h1>
        <p className="text-slate-400">管理和配置自动化任务的接入参数</p>
      </div>

      {/* 操作栏 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索任务名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* 协议筛选 */}
            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部协议</option>
              <option value="SSH">SSH</option>
              <option value="REST">REST</option>
              <option value="SNMP">SNMP</option>
              <option value="SQL">SQL</option>
            </select>

            {/* 状态筛选 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="normal">正常</option>
              <option value="abnormal">异常</option>
              <option value="offline">离线</option>
            </select>
          </div>

          {/* 新增按钮 */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增任务
          </button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">接入协议</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">接入参数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {item.protocol}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate" title={item.params}>
                  {item.params}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnection(item)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                      title="连接测试"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">暂无数据</p>
          </div>
        )}
      </div>

      {/* 新增/编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {editingItem ? '编辑任务' : '新增任务'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">任务名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入任务名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">接入协议</label>
                <select
                  value={formData.protocol || 'SSH'}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SSH">SSH</option>
                  <option value="REST">REST</option>
                  <option value="SNMP">SNMP</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">接入参数 (JSON)</label>
                <textarea
                  value={formData.params || ''}
                  onChange={(e) => setFormData({ ...formData, params: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='{"key":"value"}'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">描述</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入任务描述"
                />
              </div>
            </div>
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
          </div>
        </div>
      )}
    </div>
  );
}
