'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, HardDrive, Activity, Plus, Edit, Trash2, Bell, AlertTriangle } from 'lucide-react';

interface ResourceData {
  time: string;
  cpu: number;
  memory: number;
  network: number;
}

interface AlertRule {
  id: string;
  name: string;
  metric: 'cpu' | 'memory' | 'network';
  threshold: number;
  operator: '>' | '<' | '>=' | '<=';
  enabled: boolean;
}

const initialData: ResourceData[] = [];
for (let i = 59; i >= 0; i--) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - i);
  initialData.push({
    time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    cpu: 30 + Math.random() * 40,
    memory: 45 + Math.random() * 30,
    network: 20 + Math.random() * 50,
  });
}

const initialAlertRules: AlertRule[] = [
  { id: '1', name: 'CPU 使用率过高', metric: 'cpu', threshold: 80, operator: '>', enabled: true },
  { id: '2', name: '内存使用率告警', metric: 'memory', threshold: 85, operator: '>', enabled: true },
  { id: '3', name: '网络带宽异常', metric: 'network', threshold: 90, operator: '>', enabled: false },
];

export function TaskResourceMonitor() {
  const [data, setData] = useState<ResourceData[]>(initialData);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(initialAlertRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [formData, setFormData] = useState<Partial<AlertRule>>({
    name: '',
    metric: 'cpu',
    threshold: 80,
    operator: '>',
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: Math.max(0, Math.min(100, newData[newData.length - 1].cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, newData[newData.length - 1].memory + (Math.random() - 0.5) * 5)),
          network: Math.max(0, Math.min(100, newData[newData.length - 1].network + (Math.random() - 0.5) * 15)),
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentMetrics = data[data.length - 1] || { cpu: 0, memory: 0, network: 0 };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181F32] border border-[#2A354D] rounded-lg p-3 shadow-lg">
          <p className="text-[#D1D5DB] text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getGaugeColor = (value: number) => {
    if (value < 50) return '#22c55e';
    if (value < 80) return '#eab308';
    return '#ef4444';
  };

  const Gauge = ({ value, label, icon: Icon }: { value: number; label: string; icon: any }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-6 h-6 text-[#9CA3AF]" />
          <h4 className="text-lg font-semibold text-[#F3F4F6]">{label}</h4>
        </div>
        <div className="flex justify-center">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="45"
                fill="none"
                stroke="#334155"
                strokeWidth="12"
              />
              <circle
                cx="72"
                cy="72"
                r="45"
                fill="none"
                stroke={getGaugeColor(value)}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-[#F3F4F6]">{Math.round(value)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenModal = (rule?: AlertRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData(rule);
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        metric: 'cpu',
        threshold: 80,
        operator: '>',
        enabled: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveRule = () => {
    if (!formData.name) return;

    if (editingRule) {
      setAlertRules(alertRules.map(rule =>
        rule.id === editingRule.id ? { ...rule, ...formData } as AlertRule : rule
      ));
    } else {
      setAlertRules([...alertRules, { ...formData, id: Date.now().toString() } as AlertRule]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRule = (id: string) => {
    setAlertRules(alertRules.filter(rule => rule.id !== id));
  };

  const toggleRule = (id: string) => {
    setAlertRules(alertRules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getMetricLabel = (metric: string) => {
    const labels = { cpu: 'CPU', memory: '内存', network: '网络' };
    return labels[metric as keyof typeof labels] || metric;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务资源使用率监控</h1>
        <p className="text-[#9CA3AF]">监控任务运行时的 CPU、内存和网络资源使用情况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Gauge value={currentMetrics.cpu} label="CPU 使用率" icon={Cpu} />
        <Gauge value={currentMetrics.memory} label="内存使用率" icon={HardDrive} />
        <Gauge value={currentMetrics.network} label="网络带宽使用率" icon={Activity} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">资源使用趋势</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Area type="monotone" dataKey="cpu" name="CPU" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
            <Area type="monotone" dataKey="memory" name="内存" stroke="#22c55e" fillOpacity={1} fill="url(#colorMemory)" />
            <Area type="monotone" dataKey="network" name="网络" stroke="#06b6d4" fillOpacity={1} fill="url(#colorNetwork)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#9CA3AF]" />
            <h3 className="text-lg font-semibold text-[#F3F4F6]">告警规则配置</h3>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增规则
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A354D]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">规则名称</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">监控指标</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">条件</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">阈值</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {alertRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#181F32]/30">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {rule.enabled && <AlertTriangle className="w-4 h-4 text-[#FF9100]" />}
                        <span className="text-sm text-[#F3F4F6]">{rule.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{getMetricLabel(rule.metric)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{rule.operator}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{rule.threshold}%</td>
                    <td className="px-4 py-4 whitespace-nowrap">
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(rule)}
                          className="p-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">{editingRule ? '编辑告警规则' : '新增告警规则'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#F3F4F6]">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">规则名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入规则名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">监控指标</label>
                <select
                  value={formData.metric}
                  onChange={(e) => setFormData({ ...formData, metric: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="cpu">CPU</option>
                  <option value="memory">内存</option>
                  <option value="network">网络</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-2">运算符</label>
                  <select
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value=">">大于</option>
                    <option value="<">小于</option>
                    <option value=">=">大于等于</option>
                    <option value="<=">小于等于</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-2">阈值 (%)</label>
                  <input
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 text-[#4D94FF] bg-[#181F32] border-[#2A354D] rounded focus:ring-[#0066FF]"
                />
                <label htmlFor="enabled" className="text-sm text-[#D1D5DB]">启用此规则</label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveRule}
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
