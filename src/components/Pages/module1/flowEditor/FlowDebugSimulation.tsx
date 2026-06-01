'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Terminal,
  Activity,
  Settings,
  Download,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Eye,
  Zap,
  Save,
  X
} from 'lucide-react';

// 流程数据类型
interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft';
  lastRun?: string;
}

// 模拟数据
const mockWorkflows: Workflow[] = [
  {
    id: 'flow-001',
    name: '安全事件响应流程',
    description: '自动处理安全告警事件',
    status: 'active',
    lastRun: '2026-06-01 10:30:00'
  },
  {
    id: 'flow-002',
    name: '漏洞扫描与修复',
    description: '定期扫描和修复系统漏洞',
    status: 'active',
    lastRun: '2026-05-31 14:20:00'
  },
  {
    id: 'flow-003',
    name: '设备配置备份',
    description: '备份网络设备配置',
    status: 'draft',
    lastRun: undefined
  }
];

// 执行日志类型
interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  nodeId?: string;
}

// 变量监控类型
interface VariableWatch {
  id: string;
  name: string;
  value: any;
  type: string;
  updatedAt: string;
}

// 节点执行状态
interface NodeExecution {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startTime?: string;
  endTime?: string;
  duration?: number;
  input?: any;
  output?: any;
}

export function FlowDebugSimulation() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [debugMode, setDebugMode] = useState<'auto' | 'step'>('auto');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [variables, setVariables] = useState<VariableWatch[]>([
    { id: 'var-1', name: 'eventId', value: 'EVT-20260601-0001', type: 'string', updatedAt: new Date().toLocaleString() },
    { id: 'var-2', name: 'severity', value: 'high', type: 'string', updatedAt: new Date().toLocaleString() },
    { id: 'var-3', name: 'targetDevices', value: ['fw-001', 'ids-001'], type: 'array', updatedAt: new Date().toLocaleString() }
  ]);
  const [nodeExecutions, setNodeExecutions] = useState<NodeExecution[]>([
    { id: 'node-1', name: '开始节点', status: 'success', startTime: '10:30:00', endTime: '10:30:01', duration: 1 },
    { id: 'node-2', name: '接收告警', status: 'success', startTime: '10:30:01', endTime: '10:30:03', duration: 2 },
    { id: 'node-3', name: '判断级别', status: 'running', startTime: '10:30:03' },
    { id: 'node-4', name: '高风险处置', status: 'pending' },
    { id: 'node-5', name: '低风险记录', status: 'pending' },
    { id: 'node-6', name: '结束节点', status: 'pending' }
  ]);
  const [inputParams, setInputParams] = useState('{\n  "eventType": "security",\n  "severity": "high",\n  "autoResolve": false\n}');
  const [showVariableDetail, setShowVariableDetail] = useState<string | null>(null);

  // 计时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      timer = setInterval(() => {
        setExecutionTime(prev => prev + 1);
        setExecutionProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 5;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  // 模拟日志生成
  const addLog = (level: ExecutionLog['level'], message: string, nodeId?: string) => {
    const newLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      nodeId
    };
    setLogs(prev => [...prev, newLog]);
  };

  // 开始执行
  const handleStart = () => {
    if (!selectedWorkflow) {
      alert('请先选择要调试的流程');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    setExecutionProgress(0);
    setExecutionTime(0);
    setLogs([]);
    addLog('info', `开始调试流程: ${mockWorkflows.find(w => w.id === selectedWorkflow)?.name}`);
    addLog('info', '输入参数验证通过');
    addLog('info', '初始化执行环境');
  };

  // 暂停执行
  const handlePause = () => {
    setIsPaused(!isPaused);
    addLog(isPaused ? 'info' : 'warn', isPaused ? '恢复执行' : '执行暂停');
  };

  // 停止执行
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    addLog('error', '用户中断执行');
  };

  // 单步执行
  const handleStep = () => {
    if (!isRunning) {
      handleStart();
    }
    addLog('info', '执行下一步');
    setExecutionProgress(prev => Math.min(prev + 10, 100));
  };

  // 重置
  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setExecutionProgress(0);
    setExecutionTime(0);
    setLogs([]);
    addLog('info', '调试环境已重置');
  };

  // 获取日志样式
  const getLogStyle = (level: ExecutionLog['level']) => {
    const styles = {
      info: 'text-[#0066FF]',
      warn: 'text-[#FF9100]',
      error: 'text-[#FF3B30]',
      success: 'text-[#00C853]'
    };
    return styles[level];
  };

  const getLogIcon = (level: ExecutionLog['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'warn':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getNodeStatusStyle = (status: NodeExecution['status']) => {
    const styles = {
      pending: 'bg-[#181F32] text-[#9CA3AF] border-[#2A354D]',
      running: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      success: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      failed: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      skipped: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30'
    };
    return styles[status];
  };

  const getNodeStatusLabel = (status: NodeExecution['status']) => {
    const labels = {
      pending: '等待中',
      running: '执行中',
      success: '成功',
      failed: '失败',
      skipped: '跳过'
    };
    return labels[status];
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">流程调试与模拟运行</h1>
        <p className="text-[#9CA3AF]">调试和测试自动化流程的运行过程</p>
      </div>

      {/* 主控制面板 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-[#9CA3AF] text-sm">选择流程:</label>
              <select
                value={selectedWorkflow}
                onChange={(e) => setSelectedWorkflow(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                disabled={isRunning}
              >
                <option value="">请选择流程</option>
                {mockWorkflows.map(workflow => (
                  <option key={workflow.id} value={workflow.id}>
                    {workflow.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[#9CA3AF] text-sm">调试模式:</label>
              <div className="flex bg-[#181F32] rounded-lg p-0.5">
                <button
                  onClick={() => setDebugMode('auto')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    debugMode === 'auto'
                      ? 'bg-[#0066FF] text-[#F3F4F6]'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  自动执行
                </button>
                <button
                  onClick={() => setDebugMode('step')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    debugMode === 'step'
                      ? 'bg-[#0066FF] text-[#F3F4F6]'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  单步执行
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <>
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00C853] hover:bg-[#00A843] text-[#F3F4F6] rounded-lg transition-colors"
                  disabled={!selectedWorkflow}
                >
                  <Play className="w-4 h-4" />
                  开始调试
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF9100] hover:bg-[#FF9100] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  {isPaused ? '继续' : '暂停'}
                </button>
                {debugMode === 'step' && (
                  <button
                    onClick={handleStep}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
                  >
                    <StepForward className="w-4 h-4" />
                    下一步
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF3B30] hover:bg-[#CC2F26] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  停止
                </button>
              </>
            )}
          </div>
        </div>

        {/* 执行进度 */}
        {isRunning && (
          <div className="mt-4 pt-4 border-t border-[#2A354D]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-[#9CA3AF] text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00C853] animate-pulse" />
                  执行进度: {Math.round(executionProgress)}%
                </span>
                <span className="text-[#9CA3AF] text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  运行时间: {executionTime}s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                  isPaused 
                    ? 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30'
                    : 'bg-[#00C853]/20 text-[#00C853] border-green-500/30'
                }`}>
                  {isPaused ? '已暂停' : '运行中'}
                </span>
              </div>
            </div>
            <div className="w-full bg-[#181F32] rounded-full h-2">
              <div
                className="bg-[#0066FF] h-2 rounded-full transition-all duration-500"
                style={{ width: `${executionProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：输入参数和节点执行 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 输入参数 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-[#F3F4F6] font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4" />
                输入参数
              </h3>
              <button
                className="text-[#0066FF] hover:text-[#4D94FF] text-sm flex items-center gap-1"
                disabled={isRunning}
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={inputParams}
                onChange={(e) => setInputParams(e.target.value)}
                disabled={isRunning}
                rows={10}
                className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          {/* 节点执行状态 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2A354D]">
              <h3 className="text-[#F3F4F6] font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                节点执行状态
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {nodeExecutions.map((node, index) => (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg border transition-all ${
                    getNodeStatusStyle(node.status)
                  } ${node.status === 'running' ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280]">#{index + 1}</span>
                      <span className="font-medium">{node.name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#181F32]/50">
                      {getNodeStatusLabel(node.status)}
                    </span>
                  </div>
                  {node.startTime && (
                    <div className="mt-2 text-xs text-[#9CA3AF]">
                      开始: {node.startTime}
                      {node.endTime && (
                        <>
                          <span className="mx-2">|</span>
                          结束: {node.endTime}
                          {node.duration && (
                            <>
                              <span className="mx-2">|</span>
                              耗时: {node.duration}s
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 中间：执行日志 */}
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden h-full">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-[#F3F4F6] font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                执行日志
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLogs([])}
                  className="text-[#9CA3AF] hover:text-[#D1D5DB] text-sm"
                >
                  清空
                </button>
                <button
                  className="text-[#0066FF] hover:text-[#4D94FF] text-sm flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  导出
                </button>
              </div>
            </div>
            <div className="p-4 bg-[#111625] h-[500px] overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-[#4B5563] text-center py-12">
                  等待执行开始...
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <span className="text-[#6B7280] shrink-0">[{log.timestamp}]</span>
                      <span className={`shrink-0 ${getLogStyle(log.level)}`}>
                        {getLogIcon(log.level)}
                      </span>
                      <span className={getLogStyle(log.level)}>{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：变量监控 */}
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden h-full">
            <div className="p-4 border-b border-[#2A354D]">
              <h3 className="text-[#F3F4F6] font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4" />
                变量监控
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {variables.map((variable) => (
                <div
                  key={variable.id}
                  className="bg-[#181F32] rounded-lg p-3 border border-[#2A354D] hover:border-[#3A4560] transition-colors cursor-pointer"
                  onClick={() => setShowVariableDetail(
                    showVariableDetail === variable.id ? null : variable.id
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#F3F4F6] font-medium">{variable.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-[#2A354D] rounded-full text-[#D1D5DB]">
                      {variable.type}
                    </span>
                  </div>
                  <div className="text-[#9CA3AF] text-sm font-mono truncate">
                    {typeof variable.value === 'object'
                      ? JSON.stringify(variable.value)
                      : String(variable.value)}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    更新于: {variable.updatedAt}
                  </div>

                  {showVariableDetail === variable.id && (
                    <div className="mt-3 pt-3 border-t border-[#2A354D]">
                      <pre className="text-xs text-[#D1D5DB] bg-[#20293F] p-2 rounded overflow-x-auto">
                        {JSON.stringify(variable.value, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}

              <button className="w-full py-2 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#181F32] rounded-lg border border-dashed border-[#2A354D] text-sm transition-colors">
                + 添加监控变量
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 执行历史 */}
      <div className="mt-6 bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <h3 className="text-[#F3F4F6] font-semibold">调试历史</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#181F32]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  开始时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  流程名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  耗时
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              <tr className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                  2026-06-01 10:25:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6]">
                  安全事件响应流程
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#00C853]/20 text-[#00C853] border border-green-500/30">
                    成功
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                  15s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-[#0066FF] hover:text-[#4D94FF] mr-3">查看日志</button>
                  <button className="text-[#9CA3AF] hover:text-[#D1D5DB]">重新运行</button>
                </td>
              </tr>
              <tr className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                  2026-05-31 14:18:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6]">
                  漏洞扫描与修复
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF3B30]/20 text-[#FF3B30] border border-red-500/30">
                    失败
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                  8s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-[#0066FF] hover:text-[#4D94FF] mr-3">查看日志</button>
                  <button className="text-[#9CA3AF] hover:text-[#D1D5DB]">重新运行</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
