'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Edit2, Trash2, Play, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisTask {
  id: string;
  name: string;
  ruleCount: number;
  alertCount: number;
  deduplicateCount: number;
  attackTypes: { type: string; count: number; confidence: number }[];
  status: 'running' | 'completed' | 'idle';
}

interface AlertItem {
  id: string;
  type: string;
  confidence: number;
  source: string;
  time: string;
}

const mockTasks: AnalysisTask[] = [
  { id: 'ANA-001', name: '攻击告警分析', ruleCount: 15, alertCount: 314, deduplicateCount: 127, attackTypes: [{ type: 'DDoS', count: 89, confidence: 95 }, { type: 'SQL注入', count: 45, confidence: 88 }, { type: 'XSS', count: 32, confidence: 76 }], status: 'running' },
  { id: 'ANA-002', name: '异常行为分析', ruleCount: 8, alertCount: 156, deduplicateCount: 45, attackTypes: [{ type: '异常登录', count: 67, confidence: 92 }, { type: '数据泄露', count: 23, confidence: 85 }], status: 'running' },
];

const mockAlerts: AlertItem[] = [
  { id: 'ALT-001', type: 'DDoS攻击', confidence: 95, source: '192.168.1.100', time: '2026-06-03 14:30:00' },
  { id: 'ALT-002', type: 'SQL注入', confidence: 88, source: '10.0.0.50', time: '2026-06-03 14:28:00' },
  { id: 'ALT-003', type: '异常登录', confidence: 92, source: '172.16.0.200', time: '2026-06-03 14:25:00' },
];

const attackTypeData = [
  { name: 'DDoS', value: 89 },
  { name: 'SQL注入', value: 45 },
  { name: 'XSS', value: 32 },
  { name: '异常登录', value: 67 },
  { name: '数据泄露', value: 23 },
];

export function AlertAutoAnalysis() {
  const [tasks] = useState(mockTasks);
  const [alerts] = useState(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">告警自动分析</h2>
        <p className="text-sm text-gray-400 mt-1">告警分析规则配置、去重降噪、攻击类型研判</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">分析规则统计</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">规则总数</span>
              <span className="text-white font-medium">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">启用规则</span>
              <span className="text-green-400 font-medium">19</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">禁用规则</span>
              <span className="text-gray-400 font-medium">4</span>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">分析效果统计</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">原始告警数</span>
              <span className="text-white font-medium">470</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">去重降噪数</span>
              <span className="text-blue-400 font-medium">172</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">精简率</span>
              <span className="text-green-400 font-medium">36.6%</span>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">攻击类型分布</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
                <YAxis type="category" dataKey="name" width={50} tick={{ fill: '#9CA3AF' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索分析任务..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              手动分析
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              添加规则
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">规则数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">分析告警数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">去重降噪数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">攻击类型分布</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{task.ruleCount}</td>
                <td className="px-4 py-3 text-sm text-white">{task.alertCount}</td>
                <td className="px-4 py-3 text-sm text-blue-400">{task.deduplicateCount}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {task.attackTypes.map((type, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded">
                        {type.type}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${task.status === 'running' ? 'text-green-400 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'}`}>
                    {task.status === 'running' ? '分析中' : '空闲'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="查看结果">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="编辑规则">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">分析后告警列表</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-[#111827] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <span className="text-white text-sm">{alert.type}</span>
                  <div className="text-xs text-gray-500">来源: {alert.source}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`text-sm font-medium ${getConfidenceColor(alert.confidence)}`}>置信度: {alert.confidence}%</span>
                  <div className="text-xs text-gray-500">{alert.time}</div>
                </div>
                <button className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded text-blue-400 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}