'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Eye, CheckCircle2, XCircle, Loader2, Activity, Terminal, Copy, Wifi, Server, Clock, AlertTriangle } from 'lucide-react';

interface InterfaceTest {
  id: string;
  name: string;
  url: string;
  type: string;
  authType: string;
  status: 'idle' | 'testing' | 'success' | 'failed';
  lastTestTime: string;
  responseTime: number | null;
}

const mockInterfaces: InterfaceTest[] = [
  { id: 'IF-001', name: '威胁情报平台接口', url: 'https://ti.example.com/api/v1', type: 'REST', authType: 'Bearer', status: 'idle', lastTestTime: '2026-05-25 10:30:00', responseTime: 234 },
  { id: 'IF-002', name: '日志分析系统接口', url: 'https://siem.example.com/api/v2', type: 'REST', authType: 'API Key', status: 'success', lastTestTime: '2026-05-25 14:20:00', responseTime: 187 },
  { id: 'IF-003', name: '资产发现服务', url: 'https://asset.example.com/graphql', type: 'GraphQL', authType: 'None', status: 'failed', lastTestTime: '2026-05-25 09:15:00', responseTime: null },
  { id: 'IF-004', name: '漏洞扫描系统', url: 'https://scan.example.com/api', type: 'REST', authType: 'Basic', status: 'idle', lastTestTime: '2026-05-25 16:45:00', responseTime: 456 },
  { id: 'IF-005', name: '防火墙日志接口', url: 'https://fw.example.com/rest', type: 'REST', authType: 'API Key', status: 'success', lastTestTime: '2026-05-25 11:30:00', responseTime: 156 },
];

export function InterfaceConnectTest() {
  const [interfaces, setInterfaces] = useState<InterfaceTest[]>(mockInterfaces);
  const [selectedInterface, setSelectedInterface] = useState<InterfaceTest | null>(mockInterfaces[0]);
  const [testResult, setTestResult] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  const runTest = (iface: InterfaceTest) => {
    setIsRunningTest(true);
    setSelectedInterface(iface);
    setTestResult(null);
    setPreviewData(null);
    setDiagnosticLogs([]);

    setInterfaces(interfaces.map(i => 
      i.id === iface.id ? { ...i, status: 'testing' } : i
    ));

    const logs: string[] = [];
    const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      const prefix = type === 'success' ? '[SUCCESS]' : type === 'error' ? '[ERROR]' : '[INFO]';
      logs.push(`${prefix} ${message}`);
      setDiagnosticLogs([...logs]);
    };

    addLog('Starting connection test...');
    
    setTimeout(() => {
      addLog('Resolving DNS...');
    }, 200);

    setTimeout(() => {
      addLog('Establishing TCP connection...');
    }, 500);

    setTimeout(() => {
      addLog('Sending request...');
    }, 800);

    setTimeout(() => {
      addLog('Waiting for response...');
    }, 1200);

    setTimeout(() => {
      const success = Math.random() > 0.2;
      const responseTime = Math.floor(Math.random() * 500) + 100;

      const newStatus = success ? 'success' : 'failed';
      setInterfaces(interfaces.map(i => 
        i.id === iface.id 
          ? { ...i, status: newStatus, lastTestTime: new Date().toLocaleString('zh-CN'), responseTime: success ? responseTime : null }
          : i
      ));

      if (success) {
        addLog(`Request completed in ${responseTime}ms`, 'success');
      } else {
        addLog('Connection failed - Timeout', 'error');
      }

      setTestResult({
        success,
        responseTime,
        statusCode: success ? 200 : 503,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': 'req-' + Date.now(),
          'Server': 'nginx/1.24.0',
          'Date': new Date().toUTCString(),
        },
        error: success ? null : 'Connection timeout - Server did not respond within 5 seconds',
        latency: {
          dns: Math.floor(Math.random() * 50) + 10,
          tcp: Math.floor(Math.random() * 80) + 20,
          request: Math.floor(Math.random() * 100) + 50,
          response: responseTime,
        },
      });

      if (success) {
        setPreviewData(JSON.stringify({
          success: true,
          code: 200,
          message: 'Request successful',
          data: [
            { id: 'TID-001', type: 'malware', severity: 'high', indicator: '192.168.1.100', timestamp: '2026-05-25T10:30:00Z' },
            { id: 'TID-002', type: 'phishing', severity: 'medium', indicator: 'malicious.example.com', timestamp: '2026-05-25T10:28:00Z' },
            { id: 'TID-003', type: 'vulnerability', severity: 'critical', indicator: 'CVE-2024-12345', timestamp: '2026-05-25T10:25:00Z' },
          ],
          pagination: {
            total: 156,
            page: 1,
            perPage: 10,
          },
        }, null, 2));
      }

      setIsRunningTest(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      idle: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      testing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const labels = {
      idle: '待测试',
      testing: '测试中',
      success: '成功',
      failed: '失败',
    };
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {getStatusIcon(status)}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      high: 'text-red-400 bg-red-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      critical: 'text-orange-400 bg-orange-500/20',
      low: 'text-green-400 bg-green-500/20',
    };
    return colors[severity] || 'text-slate-400 bg-slate-500/20';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Wifi className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">数据接口连接测试验证</h1>
            <p className="text-slate-400 text-sm">测试数据接口连接并预览返回数据</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">接口列表</h3>
            </div>
            <div className="space-y-3">
              {interfaces.map((iface) => (
                <div
                  key={iface.id}
                  onClick={() => setSelectedInterface(iface)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedInterface?.id === iface.id
                      ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{iface.name}</span>
                    {getStatusBadge(iface.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="px-2 py-0.5 bg-slate-700 rounded">{iface.type}</span>
                    <span className="px-2 py-0.5 bg-slate-700 rounded">{iface.authType}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mb-2">{iface.url}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {iface.lastTestTime}
                    </span>
                    {iface.responseTime && (
                      <span className="text-slate-300 font-mono">{iface.responseTime}ms</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedInterface && (
            <>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{selectedInterface.name}</h3>
                      <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">{selectedInterface.type}</span>
                    </div>
                    <p className="text-sm text-slate-400">{selectedInterface.url}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => runTest(selectedInterface)}
                      disabled={isRunningTest}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      {isRunningTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      {isRunningTest ? '测试中...' : '开始测试'}
                    </button>
                    <button
                      onClick={() => {
                        setTestResult(null);
                        setPreviewData(null);
                        setDiagnosticLogs([]);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      重置
                    </button>
                  </div>
                </div>

                {testResult && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                        <p className="text-sm text-slate-400 mb-1">测试结果</p>
                        <div className="flex items-center gap-2">
                          {testResult.success ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <p className={`text-xl font-bold ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                            {testResult.success ? '成功' : '失败'}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">状态码</p>
                        <p className="text-xl font-bold text-white">{testResult.statusCode}</p>
                      </div>
                      <div className="p-4 bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">响应时间</p>
                        <p className="text-xl font-bold text-white">{testResult.responseTime}ms</p>
                      </div>
                      <div className="p-4 bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">测试时间</p>
                        <p className="text-xl font-bold text-white">{new Date().toLocaleTimeString('zh-CN')}</p>
                      </div>
                    </div>

                    {testResult.latency && (
                      <div className="p-4 bg-slate-800 rounded-lg">
                        <p className="text-sm font-medium text-slate-300 mb-3">延迟分析</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400 w-24">DNS解析</span>
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(testResult.latency.dns / 2, 100)}%` }} />
                            </div>
                            <span className="text-sm text-white font-mono w-16 text-right">{testResult.latency.dns}ms</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400 w-24">TCP连接</span>
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(testResult.latency.tcp / 2, 100)}%` }} />
                            </div>
                            <span className="text-sm text-white font-mono w-16 text-right">{testResult.latency.tcp}ms</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400 w-24">请求发送</span>
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(testResult.latency.request / 2, 100)}%` }} />
                            </div>
                            <span className="text-sm text-white font-mono w-16 text-right">{testResult.latency.request}ms</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400 w-24">响应接收</span>
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(testResult.latency.response / 5, 100)}%` }} />
                            </div>
                            <span className="text-sm text-white font-mono w-16 text-right">{testResult.latency.response}ms</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-300">响应头</p>
                        <button
                          onClick={() => handleCopy(JSON.stringify(testResult.headers, null, 2))}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          复制
                        </button>
                      </div>
                      <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded overflow-x-auto">
                        {JSON.stringify(testResult.headers, null, 2)}
                      </pre>
                    </div>

                    {testResult.error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <p className="text-sm font-medium text-red-400">错误信息</p>
                        </div>
                        <p className="text-sm text-slate-300">{testResult.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {previewData && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-white">数据预览</span>
                    </div>
                    <button
                      onClick={() => handleCopy(previewData)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      复制
                    </button>
                  </div>
                  <div className="p-4">
                    <pre className="text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded overflow-x-auto max-h-80 overflow-y-auto">
                      {previewData}
                    </pre>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <h3 className="text-lg font-semibold text-white">诊断信息</h3>
                </div>
                <div className="p-4">
                  <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs space-y-1 min-h-[120px]">
                    {diagnosticLogs.length > 0 ? (
                      diagnosticLogs.map((log, index) => (
                        <p key={index} className={`${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-slate-400'}`}>
                          {log}
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-600">点击"开始测试"按钮进行接口连接测试...</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}