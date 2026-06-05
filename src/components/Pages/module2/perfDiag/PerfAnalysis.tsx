'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Cpu, Activity, Database, FileText, Lightbulb, ChevronDown, ChevronUp, Zap, Search } from 'lucide-react';

interface LogEntry {
  time: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
}

interface ProcessInfo {
  name: string;
  pid: string;
  status: 'running' | 'stopped' | 'zombie';
  cpu: number;
  memory: number;
}

interface Bottleneck {
  issue: string;
  severity: 'high' | 'medium' | 'low';
  impact: string;
  suggestion: string;
}

const mockLogs: LogEntry[] = [
  { time: '10:30:01', level: 'error', message: '数据库查询超时，平均响应时间超过10秒', source: 'db.service' },
  { time: '10:30:02', level: 'warn', message: 'CPU使用率持续超过80%，存在性能瓶颈', source: 'system.monitor' },
  { time: '10:30:03', level: 'info', message: '发现异常进程，正在分析中', source: 'security.scan' },
  { time: '10:30:05', level: 'error', message: '内存泄漏检测到，进程内存持续增长', source: 'app.service' },
];

const mockProcesses: ProcessInfo[] = [
  { name: 'web-server', pid: '1234', status: 'running', cpu: 45, memory: 32 },
  { name: 'mysql', pid: '1235', status: 'running', cpu: 35, memory: 45 },
  { name: 'redis', pid: '1236', status: 'running', cpu: 8, memory: 12 },
  { name: 'unknown-process', pid: '9999', status: 'running', cpu: 22, memory: 8 },
];

const bottlenecks: Bottleneck[] = [
  { 
    issue: '数据库慢查询', 
    severity: 'high', 
    impact: '导致应用响应时间过长，用户体验下降', 
    suggestion: '优化SQL查询语句，添加必要的索引，考虑分库分表' 
  },
  { 
    issue: 'CPU资源争用', 
    severity: 'medium', 
    impact: '系统吞吐量降低，多任务并发处理能力下降', 
    suggestion: '优化代码逻辑，减少不必要的计算，考虑负载均衡' 
  },
  { 
    issue: '内存泄漏风险', 
    severity: 'medium', 
    impact: '长时间运行可能导致系统崩溃', 
    suggestion: '检查代码内存管理，修复泄漏点，增加监控' 
  },
  { 
    issue: '磁盘IO瓶颈', 
    severity: 'low', 
    impact: '数据读写速度受限', 
    suggestion: '考虑使用SSD，优化文件存储策略' 
  },
];

export function PerfAnalysis() {
  const [logs] = useState(mockLogs);
  const [processes] = useState(mockProcesses);
  const [expandedSection, setExpandedSection] = useState<string | null>('bottlenecks');

  const levelColors: Record<string, string> = {
    info: 'text-blue-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
  };

  const severityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const severityLabels: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">性能诊断</h2>
        <p className="text-sm text-gray-400 mt-1">性能瓶颈分析、问题定位、优化建议</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">发现瓶颈</p>
              <p className="text-xl font-semibold text-red-400">{bottlenecks.filter(b => b.severity === 'high').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告信息</p>
              <p className="text-xl font-semibold text-yellow-400">{logs.filter(l => l.level === 'warn').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">正常进程</p>
              <p className="text-xl font-semibold text-green-400">{processes.filter(p => p.status === 'running').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'bottlenecks' ? null : 'bottlenecks')}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">性能瓶颈分析</span>
            </div>
            {expandedSection === 'bottlenecks' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {expandedSection === 'bottlenecks' && (
            <div className="px-4 pb-4">
              <div className="space-y-3">
                {bottlenecks.map((item, idx) => (
                  <div key={idx} className={`border rounded-lg p-3 ${severityColors[item.severity as keyof typeof severityColors]}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.issue}</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded bg-black/20">
                        {severityLabels[item.severity]}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs text-gray-400">影响: </span>
                      <span className="text-xs opacity-80">{item.impact}</span>
                    </div>
                    <div>
                      <span className="text-xs text-green-400">建议: </span>
                      <span className="text-xs opacity-80">{item.suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'logs' ? null : 'logs')}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">性能日志分析</span>
            </div>
            {expandedSection === 'logs' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {expandedSection === 'logs' && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {logs.map((log, idx) => (
                  <div key={idx} className="bg-[#111827] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">{log.time}</span>
                      <span className={`text-xs font-medium ${levelColors[log.level as keyof typeof levelColors]}`}>[{log.level.toUpperCase()}]</span>
                      <span className="text-xs text-gray-500">{log.source}</span>
                    </div>
                    <p className="text-sm text-gray-300">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'processes' ? null : 'processes')}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">进程资源分析</span>
            </div>
            {expandedSection === 'processes' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {expandedSection === 'processes' && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#111827]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">进程名</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">PID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">状态</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">CPU%</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">内存%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A354D]">
                    {processes.map((proc) => (
                      <tr key={proc.pid} className="hover:bg-[#2A354D]/30">
                        <td className="px-4 py-3 text-sm text-gray-300">{proc.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-400">{proc.pid}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            proc.status === 'running' ? 'bg-green-500/20 text-green-400' :
                            proc.status === 'stopped' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {proc.status === 'running' ? '运行中' : proc.status === 'stopped' ? '已停止' : '僵尸进程'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#111827] rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${proc.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                style={{ width: `${proc.cpu}%` }} 
                              />
                            </div>
                            <span className="text-sm text-gray-300">{proc.cpu}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#111827] rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${proc.memory > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                style={{ width: `${proc.memory}%` }} 
                              />
                            </div>
                            <span className="text-sm text-gray-300">{proc.memory}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">优化建议概览</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111827] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">立即优化</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>优化数据库索引，减少慢查询</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>检查内存泄漏问题</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#111827] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">长期规划</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>引入缓存机制，减轻数据库压力</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>实施负载均衡，提升系统扩展性</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
