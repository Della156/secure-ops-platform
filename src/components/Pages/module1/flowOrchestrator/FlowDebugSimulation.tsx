'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, StepForward, Eye, Terminal, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  node: string;
  status: 'success' | 'error' | 'running' | 'pending';
  message: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: '10:30:00', node: '开始', status: 'success', message: '流程开始执行' },
  { id: '2', timestamp: '10:30:01', node: '获取防火墙配置', status: 'running', message: '正在连接设备 192.168.1.1' },
];

export function FlowDebugSimulation() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [breakpoints, setBreakpoints] = useState<Set<string>>(new Set(['action1']));

  const flowNodes = [
    { id: 'start', label: '开始', status: 'success' as const },
    { id: 'action1', label: '获取防火墙配置', status: 'running' as const },
    { id: 'condition1', label: '配置变更检测', status: 'pending' as const },
    { id: 'action2', label: '同步配置', status: 'pending' as const },
    { id: 'action3', label: '发送告警通知', status: 'pending' as const },
    { id: 'end', label: '结束', status: 'pending' as const },
  ];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const newLogs: LogEntry[] = [
        { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString('zh-CN'), node: '获取防火墙配置', status: 'success', message: '配置获取成功' },
        { id: (Date.now() + 1).toString(), timestamp: new Date().toLocaleTimeString('zh-CN'), node: '配置变更检测', status: 'running', message: '正在检测配置差异' },
        { id: (Date.now() + 2).toString(), timestamp: new Date().toLocaleTimeString('zh-CN'), node: '配置变更检测', status: 'success', message: '检测到配置变更' },
        { id: (Date.now() + 3).toString(), timestamp: new Date().toLocaleTimeString('zh-CN'), node: '同步配置', status: 'running', message: '正在同步配置...' },
      ];

      setLogs(prev => [...prev, ...newLogs]);
      setCurrentStep(prev => Math.min(prev + 1, flowNodes.length - 1));

      if (currentStep >= flowNodes.length - 1) {
        setIsRunning(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, currentStep]);

  const toggleBreakpoint = (nodeId: string) => {
    setBreakpoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleStep = () => {
    if (currentStep < flowNodes.length - 1) {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('zh-CN'),
        node: flowNodes[currentStep + 1].label,
        status: 'running',
        message: `执行 ${flowNodes[currentStep + 1].label}...`,
      };
      setLogs(prev => [...prev, newLog]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setLogs(mockLogs);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const getNodeStatusColor = (index: number) => {
    if (index < currentStep) return 'bg-[#00C853]';
    if (index === currentStep) return 'bg-[#0066FF]';
    return 'bg-[#4A5570]';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">流程调试模拟</h1>
          <p className="text-[#9CA3AF]">调试和模拟流程执行</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button onClick={handleStep} className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
            <StepForward className="w-4 h-4" />
            单步执行
          </button>
          {isRunning ? (
            <button onClick={() => setIsRunning(false)} className="flex items-center gap-2 px-4 py-2 bg-[#FF9100] hover:bg-[#FF9100] text-[#F3F4F6] rounded-lg transition-colors">
              <Pause className="w-4 h-4" />
              暂停
            </button>
          ) : (
            <button onClick={() => setIsRunning(true)} className="flex items-center gap-2 px-4 py-2 bg-[#00C853] hover:bg-[#00A843] text-[#F3F4F6] rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              开始调试
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-[#9CA3AF]" />
            <h3 className="text-lg font-semibold text-[#F3F4F6]">流程执行视图</h3>
          </div>

          <div className="flex items-center justify-center gap-2 py-8">
            {flowNodes.map((node, index) => (
              <div key={node.id} className="flex items-center">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full ${getNodeStatusColor(index)} flex items-center justify-center transition-colors`}>
                    <span className="text-white text-xs font-medium text-center leading-tight">
                      {node.label}
                    </span>
                  </div>
                  {breakpoints.has(node.id) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-[#20293F]" />
                  )}
                  <button
                    onClick={() => toggleBreakpoint(node.id)}
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs rounded transition-colors ${
                      breakpoints.has(node.id) ? 'bg-[#FF3B30]/20 text-[#FF3B30]' : 'bg-[#181F32] text-[#6B7280] hover:text-[#F3F4F6]'
                    }`}
                  >
                    断点
                  </button>
                </div>
                {index < flowNodes.length - 1 && (
                  <div className="w-8 h-0.5 bg-[#2A354D] mx-2" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-[#181F32]/50 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00C853]" />
                <span className="text-[#9CA3AF]">已完成</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0066FF]" />
                <span className="text-[#9CA3AF]">当前执行</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4A5570]" />
                <span className="text-[#9CA3AF]">待执行</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#9CA3AF]" />
              <h3 className="text-lg font-semibold text-[#F3F4F6]">执行日志</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
              <Clock className="w-4 h-4" />
              <span>实时更新</span>
            </div>
          </div>
          <div className="p-4 h-80 overflow-y-auto bg-[#111625] font-mono text-sm">
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className={`flex items-start gap-3 px-3 py-2 rounded ${
                  log.status === 'success' ? 'bg-[#00C853]/10' :
                  log.status === 'error' ? 'bg-[#FF3B30]/10' :
                  log.status === 'running' ? 'bg-[#0066FF]/10' : 'bg-[#181F32]'
                }`}>
                  <span className="text-[#6B7280] flex-shrink-0">[{log.timestamp}]</span>
                  <span className={`flex-shrink-0 font-medium ${
                    log.status === 'success' ? 'text-[#00C853]' :
                    log.status === 'error' ? 'text-[#FF3B30]' :
                    log.status === 'running' ? 'text-[#0066FF]' : 'text-[#9CA3AF]'
                  }`}>
                    [{log.node}]
                  </span>
                  <span className="text-[#D1D5DB]">{log.message}</span>
                  {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00C853] flex-shrink-0" />}
                  {log.status === 'error' && <AlertCircle className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}