'use client';

import React, { useState } from 'react';
import {
  RefreshCw, Activity, CheckCircle2, XCircle, Clock, AlertCircle
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  target: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
}

const tasks: Task[] = [
  { id: 'TSK-001', name: 'Kinsing 查杀', target: '终端-0128', status: 'completed', progress: 100, startTime: '07:30:15' },
  { id: 'TSK-002', name: 'Emotet 隔离', target: '终端-0256', status: 'completed', progress: 100, startTime: '09:15:30' },
  { id: 'TSK-003', name: 'CryptoLocker 查杀', target: '服务器-045', status: 'running', progress: 65, startTime: '09:30:00' },
  { id: 'TSK-004', name: 'Trojan.Agent 清理', target: '终端-0101', status: 'completed', progress: 100, startTime: '14:20:00' },
];

const alerts = [
  { id: 'ALT-001', message: '服务器-045 查杀失败', time: '09:35:00', level: 'error' },
  { id: 'ALT-002', message: '终端-0256 隔离成功', time: '09:15:45', level: 'success' },
];

export function VirusStatusMonitor() {
  const stats = { running: 1, completed: 3, failed: 1, pending: 0 };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="执行中" value={stats.running} color="#22C55E" icon={<Activity className="w-4 h-4" />} pulse />
        <StatBox label="已完成" value={stats.completed} color="#0066FF" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="待执行" value={stats.pending} color="#94A3B8" icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">任务状态监控</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
          </div>
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs text-blue-400 font-mono mr-2">{task.id}</span>
                    <span className="text-sm text-white">{task.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.status === 'running' ? 'bg-green-500/20 text-green-400' :
                    task.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {task.status === 'running' ? '执行中' : task.status === 'completed' ? '已完成' : '失败'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{task.target}</span>
                  <span className="text-xs text-slate-500">{task.startTime}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">查杀失败告警</h3>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.level === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  {alert.level === 'error' ? <XCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  <span className="text-xs text-white">{alert.message}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon, pulse }: { label: string; value: any; color: string; icon: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }} className={pulse ? 'animate-pulse' : ''}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default VirusStatusMonitor;
