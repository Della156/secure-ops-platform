'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface TaskItem {
  id: string;
  vulnId: string;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  target: string;
  createdAt: string;
  progress: number;
}

const mockTasks: TaskItem[] = [
  { id: 'TASK-001', vulnId: 'CVE-2024-21762', name: 'Apache HTTP Server RCE', severity: 'Critical', status: 'processing', target: 'prod-server-01', createdAt: '2026-05-29 09:00:00', progress: 65 },
  { id: 'TASK-002', vulnId: 'CVE-2024-12345', name: 'OpenSSL DoS', severity: 'High', status: 'completed', target: 'prod-db', createdAt: '2026-05-29 08:30:00', progress: 100 },
  { id: 'TASK-003', vulnId: 'CNNVD-202404-1234', name: 'Web应用SQL注入', severity: 'High', status: 'pending', target: 'app-01', createdAt: '2026-05-29 10:00:00', progress: 0 },
  { id: 'TASK-004', vulnId: 'CVE-2024-67890', name: 'Linux内核提权', severity: 'Critical', status: 'processing', target: 'prod-server-02', createdAt: '2026-05-29 09:30:00', progress: 40 },
  { id: 'TASK-005', vulnId: 'CNVD-202405-6789', name: 'SSH弱口令', severity: 'Medium', status: 'completed', target: 'jump-server', createdAt: '2026-05-29 07:00:00', progress: 100 },
];

const severityData = [
  { name: 'Critical', value: 15 },
  { name: 'High', value: 28 },
  { name: 'Medium', value: 42 },
  { name: 'Low', value: 15 },
];

const statusData = [
  { name: '待处理', value: 25 },
  { name: '处理中', value: 35 },
  { name: '已完成', value: 30 },
  { name: '失败', value: 10 },
];

const COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E'];

export function VulnHardeningView() {
  const [tasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.vulnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'processing': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'processing': return '处理中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return status;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全漏洞加固视图</h2>
        <p className="text-sm text-gray-400 mt-1">漏洞加固任务列表展示、加固过程展示、加固结果展示、条件查询、数据导出、数据统计</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索漏洞编号或名称..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">漏洞总数</p>
          <p className="text-2xl font-semibold text-white">100</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">待处理</p>
          <p className="text-2xl font-semibold text-yellow-400">25</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">处理中</p>
          <p className="text-2xl font-semibold text-blue-400">35</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">已完成</p>
          <p className="text-2xl font-semibold text-green-400">30</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">漏洞严重程度分布</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">处理状态分布</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <h3 className="text-sm font-medium text-gray-300">漏洞加固任务列表</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">漏洞编号</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">漏洞名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">严重程度</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标设备</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">进度</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                <td className="px-4 py-3 text-sm text-white">{task.id}</td>
                <td className="px-4 py-3 text-sm text-blue-400">{task.vulnId}</td>
                <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded ${getSeverityColor(task.severity)}`}>
                    {task.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.target}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className="text-sm text-gray-300">{getStatusText(task.status)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-24 bg-[#2A354D] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'processing' ? 'bg-blue-500' : 'bg-gray-500'}`} 
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{task.progress}%</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}