'use client';

import React, { useState } from 'react';
import { Search, Download, Eye, Play, RotateCcw, XCircle } from 'lucide-react';

interface TaskRunStatus {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  startTime: string;
  endTime: string | null;
  duration: string;
  progress: number;
}

const mockData: TaskRunStatus[] = [
  { id: 'RUN-001', name: '防火墙配置同步任务', status: 'running', startTime: '2026-06-01 10:30:00', endTime: null, duration: '00:15:32', progress: 65 },
  { id: 'RUN-002', name: 'IDS日志采集任务', status: 'success', startTime: '2026-06-01 09:00:00', endTime: '2026-06-01 09:45:23', duration: '00:45:23', progress: 100 },
  { id: 'RUN-003', name: '网络设备监控扫描', status: 'failed', startTime: '2026-06-01 08:00:00', endTime: '2026-06-01 08:12:45', duration: '00:12:45', progress: 45 },
  { id: 'RUN-004', name: '数据库备份任务', status: 'pending', startTime: '-', endTime: null, duration: '-', progress: 0 },
  { id: 'RUN-005', name: 'Web应用安全扫描', status: 'success', startTime: '2026-06-01 07:00:00', endTime: '2026-06-01 08:30:15', duration: '01:30:15', progress: 100 },
  { id: 'RUN-006', name: '漏洞评估任务', status: 'running', startTime: '2026-06-01 10:00:00', endTime: null, duration: '00:45:20', progress: 80 },
  { id: 'RUN-007', name: '系统安全基线检查', status: 'success', startTime: '2026-05-31 22:00:00', endTime: '2026-05-31 23:15:40', duration: '01:15:40', progress: 100 },
  { id: 'RUN-008', name: '终端安全检测', status: 'failed', startTime: '2026-05-31 20:00:00', endTime: '2026-05-31 20:25:10', duration: '00:25:10', progress: 60 },
];

export function TaskRunStatusList() {
  const [data, setData] = useState<TaskRunStatus[]>(mockData);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredData = data.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      running: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      success: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      failed: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      pending: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
    };
    const labels = {
      running: '运行中',
      success: '成功',
      failed: '失败',
      pending: '等待',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleExport = () => {
    alert('正在导出任务运行状态列表为 Excel 文件...');
  };

  const handleViewDetail = (item: TaskRunStatus) => {
    alert(`查看任务 "${item.name}" 的详细信息...`);
  };

  const handleRetry = (item: TaskRunStatus) => {
    alert(`正在重试任务 "${item.name}"...`);
  };

  const handleStop = (item: TaskRunStatus) => {
    if (confirm(`确定要停止任务 "${item.name}" 吗？`)) {
      alert('任务已停止');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务运行状态列表</h1>
        <p className="text-[#9CA3AF]">查看所有自动化任务的执行状态和进度</p>
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="running">运行中</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
              <option value="pending">等待</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出 Excel
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">开始时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">结束时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">耗时</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">进度</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.startTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.endTime || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{item.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#9CA3AF]">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-[#181F32] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.status === 'success' ? 'bg-[#00C853]' :
                          item.status === 'failed' ? 'bg-[#FF3B30]' :
                          item.status === 'running' ? 'bg-[#0066FF]' : 'bg-[#FF9100]'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="p-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {item.status === 'pending' && (
                      <button
                        className="p-1.5 text-[#00C853] hover:text-[#33D97A] hover:bg-[#00C853]/10 rounded transition-colors"
                        title="启动任务"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'failed' && (
                      <button
                        onClick={() => handleRetry(item)}
                        className="p-1.5 text-[#FF9100] hover:text-[#FF9100] hover:bg-[#FF9100]/10 rounded transition-colors"
                        title="重试"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'running' && (
                      <button
                        onClick={() => handleStop(item)}
                        className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                        title="停止"
                      >
                        <XCircle className="w-4 h-4" />
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

      <div className="mt-4 flex items-center justify-center gap-2">
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">上一页</button>
        <button className="px-3 py-1 bg-[#0066FF] text-[#F3F4F6] rounded text-sm">1</button>
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">2</button>
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">3</button>
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">下一页</button>
      </div>
    </div>
  );
}
