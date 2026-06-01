'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Server, Activity, Bell, CheckCircle, XCircle, X } from 'lucide-react';

// 资源池节点类型
interface WorkerNode {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  currentTasks: number;
  maxConcurrency: number;
  loadPercentage: number;
  createdAt: string;
}

// 告警规则类型
interface AlertRule {
  id: string;
  name: string;
  threshold: number;
  level: 'critical' | 'warning' | 'info';
  enabled: boolean;
}

// 模拟数据
const mockNodes: WorkerNode[] = [
  { id: 'NODE-001', name: 'Worker-01', ip: '192.168.1.101', status: 'online', currentTasks: 3, maxConcurrency: 10, loadPercentage: 30, createdAt: '2026-05-20 10:00:00' },
  { id: 'NODE-002', name: 'Worker-02', ip: '192.168.1.102', status: 'online', currentTasks: 8, maxConcurrency: 10, loadPercentage: 80, createdAt: '2026-05-21 14:30:00' },
  { id: 'NODE-003', name: 'Worker-03', ip: '192.168.1.103', status: 'warning', currentTasks: 9, maxConcurrency: 10, loadPercentage: 90, createdAt: '2026-05-22 09:15:00' },
  { id: 'NODE-004', name: 'Worker-04', ip: '192.168.1.104', status: 'offline', currentTasks: 0, maxConcurrency: 10, loadPercentage: 0, createdAt: '2026-05-23 16:45:00' },
  { id: 'NODE-005', name: 'Worker-05', ip: '192.168.1.105', status: 'online', currentTasks: 5, maxConcurrency: 10, loadPercentage: 50, createdAt: '2026-05-24 11:00:00' },
];

const mockAlertRules: AlertRule[] = [
  { id: 'RULE-001', name: 'CPU使用率告警', threshold: 80, level: 'warning', enabled: true },
  { id: 'RULE-002', name: '内存使用率告警', threshold: 85, level: 'warning', enabled: true },
  { id: 'RULE-003', name: '任务队列满载告警', threshold: 95, level: 'critical', enabled: true },
  { id: 'RULE-004', name: '节点离线告警', threshold: 0, level: 'critical', enabled: true },
];

export function ResourcePoolConfig() {
  const [nodes, setNodes] = useState<WorkerNode[]>(mockNodes);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<WorkerNode | null>(null);
  const [formData, setFormData] = useState<Partial<WorkerNode>>({
    name: '',
    ip: '',
    maxConcurrency: 10,
  });

  // 过滤节点
  const filteredNodes = nodes.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase()) || item.ip.includes(searchName);
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchStatus;
  });

  // 打开新增/编辑模态框
  const handleOpenModal = (item?: WorkerNode) => {
    if (item) {
      setEditingNode(item);
      setFormData(item);
    } else {
      setEditingNode(null);
      setFormData({ name: '', ip: '', maxConcurrency: 10 });
    }
    setIsModalOpen(true);
  };

  // 保存节点
  const handleSave = () => {
    if (!formData.name || !formData.ip || !formData.maxConcurrency) return;

    if (editingNode) {
      setNodes(nodes.map(item => item.id === editingNode.id ? { ...item, ...formData } as WorkerNode : item));
    } else {
      const newNode: WorkerNode = {
        id: `NODE-${String(nodes.length + 1).padStart(3, '0')}`,
        name: formData.name,
        ip: formData.ip,
        maxConcurrency: formData.maxConcurrency,
        status: 'online',
        currentTasks: 0,
        loadPercentage: 0,
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setNodes([...nodes, newNode]);
    }
    setIsModalOpen(false);
  };

  // 删除节点
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个工作节点吗？')) {
      setNodes(nodes.filter(item => item.id !== id));
    }
  };

  // 切换告警规则状态
  const toggleAlertRule = (id: string) => {
    setAlertRules(alertRules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const labels = {
      online: '在线',
      warning: '告警',
      offline: '离线',
    };
    const icons = {
      online: CheckCircle,
      warning: Bell,
      offline: XCircle,
    };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // 获取告警级别标签
  const getAlertLevelBadge = (level: string) => {
    const styles = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    const labels = {
      critical: '严重',
      warning: '警告',
      info: '信息',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  // 获取负载条颜色
  const getLoadBarColor = (load: number) => {
    if (load >= 90) return 'bg-red-500';
    if (load >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // 统计信息
  const stats = {
    totalNodes: nodes.length,
    onlineNodes: nodes.filter(n => n.status === 'online').length,
    warningNodes: nodes.filter(n => n.status === 'warning').length,
    offlineNodes: nodes.filter(n => n.status === 'offline').length,
    totalCapacity: nodes.reduce((sum, n) => sum + n.maxConcurrency, 0),
    currentTasks: nodes.reduce((sum, n) => sum + n.currentTasks, 0),
  };

  return (
    <div className="p-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务调度资源池负载配置管理</h1>
        <p className="text-slate-400">管理工作节点和资源池配置</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '总节点数', value: stats.totalNodes, icon: Server, color: 'blue' },
          { label: '在线节点', value: stats.onlineNodes, icon: CheckCircle, color: 'green' },
          { label: '告警节点', value: stats.warningNodes, icon: Bell, color: 'yellow' },
          { label: '离线节点', value: stats.offlineNodes, icon: XCircle, color: 'red' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                }`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${
                stat.color === 'blue' ? 'text-blue-500' :
                stat.color === 'green' ? 'text-green-500' :
                stat.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {/* 资源池概览 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          资源池负载概览
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">总并发容量</p>
            <p className="text-2xl font-bold text-white">{stats.currentTasks} / {stats.totalCapacity}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-2">资源利用率</p>
            <div className="mt-2 bg-slate-800 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${getLoadBarColor((stats.currentTasks / stats.totalCapacity) * 100)}`}
                style={{ width: `${Math.min((stats.currentTasks / stats.totalCapacity) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{Math.round((stats.currentTasks / stats.totalCapacity) * 100)}%</p>
          </div>
        </div>
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
                placeholder="搜索节点名称或IP..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* 状态筛选 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="online">在线</option>
              <option value="warning">告警</option>
              <option value="offline">离线</option>
            </select>
          </div>

          {/* 新增按钮 */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增节点
          </button>
        </div>
      </div>

      {/* 工作节点列表 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                节点
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                IP地址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                当前任务
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                最大并发
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                负载率
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredNodes.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                      <Server className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-white font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{item.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.currentTasks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.maxConcurrency}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getLoadBarColor(item.loadPercentage)}`}
                        style={{ width: `${item.loadPercentage}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      item.loadPercentage >= 90 ? 'text-red-400' :
                      item.loadPercentage >= 70 ? 'text-yellow-400' : 'text-green-400'
                    }`}>{item.loadPercentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
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

        {filteredNodes.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">暂无数据</p>
          </div>
        )}
      </div>

      {/* 告警规则配置 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            告警规则配置
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                规则名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                阈值
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                级别
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {alertRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{rule.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {rule.threshold > 0 ? `${rule.threshold}%` : '立即告警'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getAlertLevelBadge(rule.level)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAlertRule(rule.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      rule.enabled
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {rule.enabled ? '已启用' : '已禁用'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors" title="编辑规则">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新增/编辑节点模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {editingNode ? '编辑工作节点' : '新增工作节点'}
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
                <label className="block text-sm font-medium text-slate-300 mb-1.5">节点名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: Worker-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">IP地址</label>
                <input
                  type="text"
                  value={formData.ip || ''}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="例如: 192.168.1.101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">最大并发任务数</label>
                <input
                  type="number"
                  value={formData.maxConcurrency || ''}
                  onChange={(e) => setFormData({ ...formData, maxConcurrency: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                  max={100}
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
