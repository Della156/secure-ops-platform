'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Pause, StopCircle, Terminal, Activity, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

const initialLogs: LogEntry[] = [
  { id: '1', timestamp: '10:30:15', level: 'info', message: '任务 "防火墙配置同步" 开始执行' },
  { id: '2', timestamp: '10:30:16', level: 'info', message: '连接到防火墙设备 192.168.1.1' },
  { id: '3', timestamp: '10:30:18', level: 'success', message: '认证成功' },
  { id: '4', timestamp: '10:30:20', level: 'info', message: '正在获取当前配置...' },
  { id: '5', timestamp: '10:30:25', level: 'success', message: '配置获取完成' },
  { id: '6', timestamp: '10:30:26', level: 'info', message: '正在应用新配置...' },
  { id: '7', timestamp: '10:30:30', level: 'warn', message: '配置验证警告：端口 8080 已被占用' },
  { id: '8', timestamp: '10:30:32', level: 'info', message: '继续执行...' },
];

const ganttData = [
  { name: '初始化', start: 0, end: 15, color: '#3b82f6' },
  { name: '连接设备', start: 15, end: 25, color: '#06b6d4' },
  { name: '获取配置', start: 25, end: 45, color: '#22c55e' },
  { name: '应用配置', start: 45, end: 70, color: '#eab308' },
  { name: '验证配置', start: 70, end: 85, color: '#8b5cf6' },
  { name: '完成', start: 85, end: 100, color: '#22c55e' },
];

export function TaskRunMonitor() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [progress, setProgress] = useState(65);
  const [isRunning, setIsRunning] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!isRunning || !autoRefresh) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 3, 100);
        if (newProgress >= 100) {
          setIsRunning(false);
        }
        return newProgress;
      });

      const newLogEntries: LogEntry[] = [];
      const random = Math.random();
      if (random < 0.3) {
        newLogEntries.push({
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('zh-CN'),
          level: 'info',
          message: `处理步骤 ${Math.floor(progress / 20) + 1}...`
        });
      } else if (random < 0.5) {
        newLogEntries.push({
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('zh-CN'),
          level: 'success',
          message: `子任务 ${Math.floor(progress / 10) + 1} 完成`
        });
      }

      if (newLogEntries.length > 0) {
        setLogs(prev => [...prev, ...newLogEntries]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, autoRefresh, progress]);

  const getLevelColor = (level: string) => {
    const colors = {
      info: 'text-blue-400',
      warn: 'text-yellow-400',
      error: 'text-red-400',
      success: 'text-green-400',
    };
    return colors[level as keyof typeof colors] || 'text-slate-400';
  };

  const getLevelBg = (level: string) => {
    const bgs = {
      info: 'bg-blue-500/10',
      warn: 'bg-yellow-500/10',
      error: 'bg-red-500/10',
      success: 'bg-green-500/10',
    };
    return bgs[level as keyof typeof bgs] || 'bg-slate-800';
  };

  const handleRefresh = () => {
    setProgress(prev => Math.min(prev + 5, 100));
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务运行监控</h1>
        <p className="text-slate-400">实时监控任务执行进度和日志</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">防火墙配置同步任务</h3>
            <p className="text-slate-400 text-sm">RUN-20240601-0001</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? '自动刷新中' : '开启自动刷新'}
            </button>
            {!isRunning && progress < 100 && (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                继续
              </button>
            )}
            {isRunning && (
              <>
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  暂停
                </button>
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                  停止
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300">执行进度</span>
            </div>
            <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Clock className="w-4 h-4" />
              已运行时间
            </div>
            <div className="text-xl font-semibold text-white">15分 32秒</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">当前状态</div>
            <div className={`text-xl font-semibold ${isRunning ? 'text-green-400' : 'text-yellow-400'}`}>
              {isRunning ? '运行中' : progress >= 100 ? '已完成' : '已暂停'}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">预计剩余时间</div>
            <div className="text-xl font-semibold text-white">{isRunning ? '8分 15秒' : '-'}</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">执行甘特图</h4>
          <div className="space-y-2">
            {ganttData.map((item, index) => {
              const itemProgress = Math.max(0, Math.min(100, (progress - item.start) / (item.end - item.start) * 100));
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-slate-300 flex-shrink-0">{item.name}</div>
                  <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, itemProgress > 0 ? 100 : 0)}%`,
                        backgroundColor: item.color,
                        opacity: itemProgress > 0 ? 1 : 0.3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">执行日志</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 h-96 overflow-y-auto bg-slate-950 font-mono text-sm">
          <div className="space-y-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-3 px-3 py-2 rounded ${getLevelBg(log.level)}`}
              >
                <span className="text-slate-500 flex-shrink-0">[{log.timestamp}]</span>
                <span className={`flex-shrink-0 font-medium ${getLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
