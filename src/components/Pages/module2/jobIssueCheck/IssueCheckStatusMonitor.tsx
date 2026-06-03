'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Clock, Activity, Zap } from 'lucide-react';

interface MonitorTask {
  id: string;
  taskName: string;
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  lastUpdate: string;
  issuesFound: number;
  currentStage: string;
}

const mockMonitorData: MonitorTask[] = [
  { id: 'MON-IC-001', taskName: '网络设备配置检查', target: 'core-switch-01', status: 'running', progress: 65, startTime: '2026-06-02 10:00:00', lastUpdate: '10秒前', issuesFound: 0, currentStage: '正在执行差异比对...' },
  { id: 'MON-IC-002', taskName: '数据库安全基线检查', target: 'prod-db-01', status: 'completed', progress: 100, startTime: '2026-06-02 09:30:00', lastUpdate: '5分钟前', issuesFound: 2, currentStage: '检查完成' },
  { id: 'MON-IC-003', taskName: 'Web服务器性能检查', target: 'web-server-01', status: 'failed', progress: 45, startTime: '2026-06-02 09:00:00', lastUpdate: '20分钟前', issuesFound: 0, currentStage: '连接超时，无法访问目标' },
  { id: 'MON-IC-004', taskName: '防火墙规则检查', target: 'fw-01', status: 'completed', progress: 100, startTime: '2026-06-02 08:30:00', lastUpdate: '45分钟前', issuesFound: 5, currentStage: '检查完成' },
  { id: 'MON-IC-005', taskName: '应用部署一致性检查', target: 'app-cluster', status: 'pending', progress: 0, startTime: '-', lastUpdate: '-', issuesFound: 0, currentStage: '等待执行' },
  { id: 'MON-IC-006', taskName: '中间件配置检查', target: 'middleware-01', status: 'running', progress: 30, startTime: '2026-06-02 10:15:00', lastUpdate: '刚刚', issuesFound: 0, currentStage: '正在采集配置信息...' },
];

export function IssueCheckStatusMonitor() {
  const [data, setData] = useState<MonitorTask[]>(mockMonitorData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setData(prev => prev.map(item => {
        if (item.status === 'running' && item.progress < 100) {
          const newProgress = Math.min(100, item.progress + Math.random() * 8);
          const newStatus = newProgress >= 100 ? 'completed' : 'running';
          const newCurrentStage = newProgress >= 100 ? '检查完成' : item.currentStage;
          const newIssuesFound = newProgress >= 100 ? item.issuesFound + Math.floor(Math.random() * 3) : item.issuesFound;
          return { 
            ...item, 
            progress: newProgress, 
            status: newStatus, 
            currentStage: newCurrentStage,
            issuesFound: newIssuesFound,
            lastUpdate: '刚刚'
          };
        }
        return item;
      }));
    }, 2000);
    
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'running') return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'failed') return <XCircle className="w-5 h-5 text-red-400" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1"><Activity className="w-3 h-3" />运行中</span>;
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />已完成</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" />失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />等待中</span>;
  };

  const stats = {
    total: data.length,
    running: data.filter(d => d.status === 'running').length,
    completed: data.filter(d => d.status === 'completed').length,
    failed: data.filter(d => d.status === 'failed').length,
    pending: data.filter(d => d.status === 'pending').length,
    totalIssues: data.reduce((sum, d) => sum + d.issuesFound, 0),
  };

  const handleRefresh = () => {
    setData(prev => prev.map(item => ({
      ...item,
      lastUpdate: '刚刚'
    })));
  };

  const handleRetry = (taskId: string) => {
    setData(prev => prev.map(item => {
      if (item.id === taskId) {
        return {
          ...item,
          status: 'running',
          progress: 0,
          issuesFound: 0,
          startTime: new Date().toLocaleString(),
          lastUpdate: '刚刚',
          currentStage: '正在初始化...'
        };
      }
      return item;
    }));
  };

  const handleStop = (taskId: string) => {
    setData(prev => prev.map(item => {
      if (item.id === taskId && item.status === 'running') {
        return {
          ...item,
          status: 'failed',
          lastUpdate: '刚刚',
          currentStage: '已被用户终止'
        };
      }
      return item;
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">作业问题检查任务状态监控</h2>
            <p className="text-sm text-gray-400 mt-1">状态监控</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span className="text-sm">{autoRefresh ? '自动刷新中' : '刷新已暂停'}</span>
              <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="px-3 py-1.5 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042] transition-colors"
            >
              {autoRefresh ? '暂停' : '开启'}
            </button>
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              手动刷新
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">运行中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已完成</p>
              <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">等待中</p>
              <p className="text-xl font-semibold text-gray-400">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">发现问题</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.totalIssues}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(item.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{item.taskName}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.target}</span>
                    {getStatusBadge(item.status)}
                    {item.issuesFound > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {item.issuesFound} 个问题
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{item.currentStage}</p>
                  {item.status === 'running' && (
                    <div className="w-64 mb-2">
                      <div className="w-full bg-[#111827] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(item.status)}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{Math.round(item.progress)}% 完成</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {item.startTime !== '-' && (
                      <span>开始时间: {item.startTime}</span>
                    )}
                    <span>最后更新: {item.lastUpdate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'running' && (
                  <button
                    onClick={() => handleStop(item.id)}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors"
                  >
                    停止
                  </button>
                )}
                {(item.status === 'failed' || item.status === 'completed') && (
                  <button
                    onClick={() => handleRetry(item.id)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    重试
                  </button>
                )}
                {item.status === 'pending' && (
                  <button
                    className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    立即执行
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
