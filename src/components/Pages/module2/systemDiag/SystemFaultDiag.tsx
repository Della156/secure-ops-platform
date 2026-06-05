'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Server, Activity, Database, FileText, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

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

interface ServiceInfo {
  name: string;
  status: 'running' | 'stopped' | 'failed';
  port: string;
  lastStart: string;
}

const mockLogs: LogEntry[] = [
  { time: '10:30:01', level: 'error', message: '连接数据库失败，尝试重新连接...', source: 'app.service' },
  { time: '10:30:02', level: 'warn', message: '内存使用率超过80%，建议优化', source: 'system.monitor' },
  { time: '10:30:03', level: 'info', message: '检测到异常进程，正在分析...', source: 'security.scan' },
  { time: '10:30:05', level: 'error', message: '服务连接超时', source: 'network.service' },
];

const mockProcesses: ProcessInfo[] = [
  { name: 'nginx', pid: '1234', status: 'running', cpu: 15, memory: 8 },
  { name: 'mysql', pid: '1235', status: 'running', cpu: 25, memory: 45 },
  { name: 'redis', pid: '1236', status: 'running', cpu: 5, memory: 12 },
  { name: 'unknown', pid: '9999', status: 'zombie', cpu: 0, memory: 0 },
];

const mockServices: ServiceInfo[] = [
  { name: 'nginx', status: 'running', port: '80,443', lastStart: '2026-06-01 08:00:00' },
  { name: 'mysql', status: 'running', port: '3306', lastStart: '2026-06-01 08:00:01' },
  { name: 'redis', status: 'running', port: '6379', lastStart: '2026-06-01 08:00:02' },
  { name: 'api-gateway', status: 'failed', port: '8080', lastStart: '2026-06-02 10:25:00' },
];

const faultSuggestions = [
  { issue: '数据库连接失败', suggestion: '检查数据库服务状态，确认网络连接正常，验证数据库账号密码', severity: 'high' },
  { issue: '内存使用率过高', suggestion: '清理缓存，优化应用内存使用，考虑增加服务器内存', severity: 'medium' },
  { issue: '僵尸进程存在', suggestion: '手动终止僵尸进程，检查进程管理脚本', severity: 'low' },
  { issue: 'API网关服务失败', suggestion: '查看服务日志，检查配置文件，重启服务', severity: 'high' },
];

export function SystemFaultDiag() {
  const [logs] = useState(mockLogs);
  const [processes] = useState(mockProcesses);
  const [services] = useState(mockServices);
  const [expandedSection, setExpandedSection] = useState<string | null>('logs');

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统故障诊断</h2>
        <p className="text-sm text-gray-400 mt-1">自动分析系统日志、进程状态、服务状态，识别系统故障，故障定位建议</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">检测到错误</p>
              <p className="text-xl font-semibold text-red-400">{logs.filter(l => l.level === 'error').length}</p>
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
              <p className="text-gray-400 text-xs">运行中服务</p>
              <p className="text-xl font-semibold text-green-400">{services.filter(s => s.status === 'running').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'logs' ? null : 'logs')}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">系统日志分析</span>
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
              <span className="text-white font-medium">进程状态分析</span>
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
                        <td className="px-4 py-3 text-sm text-gray-300">{proc.cpu}%</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{proc.memory}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
            onClick={() => setExpandedSection(expandedSection === 'services' ? null : 'services')}
          >
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">服务状态分析</span>
            </div>
            {expandedSection === 'services' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {expandedSection === 'services' && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#111827]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">服务名</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">状态</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">端口</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">启动时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A354D]">
                    {services.map((service) => (
                      <tr key={service.name} className="hover:bg-[#2A354D]/30">
                        <td className="px-4 py-3 text-sm text-gray-300">{service.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            service.status === 'running' ? 'bg-green-500/20 text-green-400' :
                            service.status === 'stopped' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {service.status === 'running' ? '运行中' : service.status === 'stopped' ? '已停止' : '失败'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{service.port}</td>
                        <td className="px-4 py-3 text-sm text-gray-400">{service.lastStart}</td>
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
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">故障定位建议</span>
          </div>
          <div className="space-y-3">
            {faultSuggestions.map((item, idx) => (
              <div key={idx} className={`border rounded-lg p-3 ${severityColors[item.severity as keyof typeof severityColors]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.issue}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded bg-black/20">
                    {item.severity === 'high' ? '高' : item.severity === 'medium' ? '中' : '低'}风险
                  </span>
                </div>
                <p className="text-xs opacity-80">{item.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}