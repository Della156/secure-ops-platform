'use client';

import React, { useState } from 'react';
import { AlertTriangle, User, Activity, FileWarning, Eye, TrendingUp } from 'lucide-react';

interface AnalysisResult {
  id: string;
  hostName: string;
  suspiciousCount: number;
  abnormalLoginCount: number;
  maliciousProcessCount: number;
  riskScore: number;
}

const results: AnalysisResult[] = [
  { id: 'ANL-H-001', hostName: 'HOST-001', suspiciousCount: 5, abnormalLoginCount: 2, maliciousProcessCount: 1, riskScore: 75 },
  { id: 'ANL-H-002', hostName: 'HOST-005', suspiciousCount: 12, abnormalLoginCount: 5, maliciousProcessCount: 3, riskScore: 88 },
  { id: 'ANL-H-003', hostName: 'HOST-008', suspiciousCount: 3, abnormalLoginCount: 1, maliciousProcessCount: 0, riskScore: 45 },
];

const suspiciousBehaviors = [
  { type: '异常网络连接', count: 15, severity: 'high' },
  { type: '未授权访问尝试', count: 8, severity: 'high' },
  { type: '可疑文件修改', count: 5, severity: 'medium' },
  { type: '进程异常行为', count: 3, severity: 'medium' },
];

const abnormalLogins = [
  { time: '2026-06-03 02:15:00', user: 'admin', ip: '192.168.1.100', status: 'success' },
  { time: '2026-06-03 02:16:00', user: 'admin', ip: '10.0.0.50', status: 'failed' },
  { time: '2026-06-03 02:17:00', user: 'admin', ip: '10.0.0.50', status: 'success' },
];

const maliciousProcesses = [
  { name: 'suspicious.exe', pid: '1234', path: '/tmp/suspicious.exe', startTime: '2026-06-03 02:00:00' },
  { name: 'malware.dll', pid: '5678', path: '/usr/local/lib/malware.dll', startTime: '2026-06-03 01:30:00' },
];

export function HostForensicsAutoAnalysis() {
  const [selectedResult, setSelectedResult] = useState(results[0]);

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white">主机取证结果自动分析</h3>
        <p className="text-xs text-slate-500 mt-1">自动分析取证数据，识别可疑行为和风险</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h4 className="text-sm font-semibold text-white">分析结果列表</h4>
          </div>
          <div className="space-y-2">
            {results.map(result => (
              <div
                key={result.id}
                onClick={() => setSelectedResult(result)}
                className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedResult?.id === result.id ? 'bg-[#111625]' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-400 font-mono">{result.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${result.riskScore >= 80 ? 'bg-red-500/20 text-red-400' : result.riskScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {result.riskScore}分
                  </span>
                </div>
                <div className="text-sm text-white">{result.hostName}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">分析详情 - {selectedResult.hostName}</h4>
              <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Eye className="w-3 h-3" />查看完整报告
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-[#111625] rounded p-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />可疑行为</div>
                <div className="text-xl font-semibold text-red-400">{selectedResult.suspiciousCount}</div>
              </div>
              <div className="bg-[#111625] rounded p-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><User className="w-3 h-3" />异常登录</div>
                <div className="text-xl font-semibold text-orange-400">{selectedResult.abnormalLoginCount}</div>
              </div>
              <div className="bg-[#111625] rounded p-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Activity className="w-3 h-3" />恶意进程</div>
                <div className="text-xl font-semibold text-purple-400">{selectedResult.maliciousProcessCount}</div>
              </div>
              <div className="bg-[#111625] rounded p-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />风险评分</div>
                <div className={`text-xl font-semibold ${selectedResult.riskScore >= 80 ? 'text-red-400' : selectedResult.riskScore >= 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {selectedResult.riskScore}
                </div>
              </div>
            </div>

            <div className="bg-[#111625] rounded p-3 mb-4">
              <div className="text-xs text-slate-400 mb-2">可疑行为描述</div>
              <div className="space-y-2">
                {suspiciousBehaviors.map((behavior, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs text-white">{behavior.type}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${behavior.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {behavior.severity === 'high' ? '高危' : '中危'}
                      </span>
                      <span className="text-xs text-slate-400">{behavior.count}次</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111625] rounded p-3">
                <div className="text-xs text-slate-400 mb-2 flex items-center gap-1"><User className="w-3 h-3" />异常登录列表</div>
                <div className="space-y-2">
                  {abnormalLogins.map((login, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-white">{login.user}</span>
                        <span className={`${login.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{login.status}</span>
                      </div>
                      <div className="text-slate-400">{login.ip} · {login.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#111625] rounded p-3">
                <div className="text-xs text-slate-400 mb-2 flex items-center gap-1"><FileWarning className="w-3 h-3" />恶意进程列表</div>
                <div className="space-y-2">
                  {maliciousProcesses.map((process, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="text-white">{process.name}</div>
                      <div className="text-slate-400">PID: {process.pid} · {process.startTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
              <div className="text-xs text-blue-400">分析结论</div>
              <p className="text-xs text-white mt-1">
                经分析，该主机存在 {selectedResult.suspiciousCount} 个可疑行为、{selectedResult.abnormalLoginCount} 次异常登录和 {selectedResult.maliciousProcessCount} 个恶意进程，风险评分 {selectedResult.riskScore} 分，建议立即进行深度排查和处置。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostForensicsAutoAnalysis;
