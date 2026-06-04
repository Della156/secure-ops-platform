'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Settings, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PredictTask {
  id: string;
  name: string;
  predictCycle: string;
  predictAlertCount: number;
  accuracy: number;
  status: 'running' | 'completed';
}

const mockTasks: PredictTask[] = [
  { id: 'PRED-001', name: '24小时告警预测', predictCycle: '每日', predictAlertCount: 450, accuracy: 87, status: 'running' },
  { id: 'PRED-002', name: '周告警趋势预测', predictCycle: '每周', predictAlertCount: 2800, accuracy: 82, status: 'completed' },
];

const trendData = [
  { day: '00:00', history: 25, predict: 35 },
  { day: '04:00', history: 18, predict: 22 },
  { day: '08:00', history: 45, predict: 55 },
  { day: '12:00', history: 38, predict: 48 },
  { day: '16:00', history: 52, predict: 65 },
  { day: '20:00', history: 48, predict: 85 },
  { day: '24:00', history: 35, predict: 42 },
];

const peakHours = ['16:00', '20:00'];

export function AlertTrendPredict() {
  const [tasks] = useState(mockTasks);
  const [timeDimension, setTimeDimension] = useState<'day' | 'week' | 'month'>('day');

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">告警趋势预测</h2>
            <p className="text-sm text-gray-400 mt-1">历史趋势分析、未来预测、高峰时段预警</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setTimeDimension('day')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeDimension === 'day' ? 'bg-blue-600 text-white' : 'bg-[#2A354D] text-gray-400 hover:text-white'}`}
            >
              按天
            </button>
            <button 
              onClick={() => setTimeDimension('week')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeDimension === 'week' ? 'bg-blue-600 text-white' : 'bg-[#2A354D] text-gray-400 hover:text-white'}`}
            >
              按周
            </button>
            <button 
              onClick={() => setTimeDimension('month')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeDimension === 'month' ? 'bg-blue-600 text-white' : 'bg-[#2A354D] text-gray-400 hover:text-white'}`}
            >
              按月
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">预测告警数</span>
          </div>
          <p className="text-2xl font-semibold text-white">450</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">预测准确率</span>
          </div>
          <p className="text-2xl font-semibold text-green-400">87%</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">预测周期</span>
          </div>
          <p className="text-2xl font-semibold text-white">24小时</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">高峰时段</span>
          </div>
          <p className="text-2xl font-semibold text-purple-400">2个</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">告警趋势预测</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="history" stroke="#3B82F6" name="历史告警" strokeWidth={2} />
              <Line type="monotone" dataKey="predict" stroke="#F59E0B" name="预测告警" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">预测高峰时段：</span>
          {peakHours.map((hour, index) => (
            <span key={index} className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm">
              ⚠ {hour}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-sm font-medium text-gray-300">预测任务列表</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            配置参数
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">预测周期</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">预测告警数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">准确率</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.predictCycle}</td>
                <td className="px-4 py-3 text-sm text-white">{task.predictAlertCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-[#2A354D] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${task.accuracy}%` }} />
                    </div>
                    <span className="text-sm text-green-400">{task.accuracy}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${task.status === 'running' ? 'text-green-400 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'}`}>
                    {task.status === 'running' ? '运行中' : '已完成'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}