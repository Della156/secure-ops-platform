'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Calendar, Info, AlertCircle, CheckCircle2, X, Clock, Zap, Server, ChevronDown } from 'lucide-react';

interface ApiCallLog {
  id: string;
  apiName: string;
  apiId: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  status: 'success' | 'error' | 'warning';
  responseTime: number;
  requestSize: string;
  responseSize: string;
  timestamp: string;
  application: string;
  ipAddress: string;
  requestId: string;
  userAgent: string;
  requestBody: any;
  responseBody: any;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
}

const mockLogs: ApiCallLog[] = [
  { 
    id: '1', 
    apiName: '获取威胁情报', 
    apiId: 'API-001', 
    path: '/api/v1/threat-intel', 
    method: 'GET', 
    statusCode: 200, 
    status: 'success', 
    responseTime: 234, 
    requestSize: '0.2KB', 
    responseSize: '12.5KB', 
    timestamp: '2026-05-25 10:30:00', 
    application: 'Web应用', 
    ipAddress: '192.168.1.100',
    requestId: 'req-abc123',
    userAgent: 'SecureOps-Platform/1.0',
    requestBody: null,
    responseBody: { data: [...Array(5).fill({ id: 't1', type: 'malware', severity: 'high' })], total: 156, page: 1 },
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer [REDACTED]', 'User-Agent': 'SecureOps-Platform/1.0' },
    responseHeaders: { 'Content-Type': 'application/json', 'X-Request-ID': 'req-abc123', 'X-RateLimit-Limit': '100', 'X-RateLimit-Remaining': '95' },
  },
  { 
    id: '2', 
    apiName: '执行安全扫描', 
    apiId: 'API-002', 
    path: '/api/v1/scan', 
    method: 'POST', 
    statusCode: 201, 
    status: 'success', 
    responseTime: 187, 
    requestSize: '2.3KB', 
    responseSize: '0.1KB', 
    timestamp: '2026-05-25 10:29:45', 
    application: '内部系统', 
    ipAddress: '10.0.0.50',
    requestId: 'req-def456',
    userAgent: 'Internal-Service/2.0',
    requestBody: { target: '192.168.1.0/24', scanType: 'full', depth: 3 },
    responseBody: { taskId: 'task-789', status: 'running' },
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer [REDACTED]' },
    responseHeaders: { 'Content-Type': 'application/json', 'X-Request-ID': 'req-def456' },
  },
  { 
    id: '3', 
    apiName: '获取扫描结果', 
    apiId: 'API-003', 
    path: '/api/v1/scan/123', 
    method: 'GET', 
    statusCode: 500, 
    status: 'error', 
    responseTime: 5000, 
    requestSize: '0.5KB', 
    responseSize: '0.0KB', 
    timestamp: '2026-05-25 10:29:30', 
    application: 'Web应用', 
    ipAddress: '192.168.1.100',
    requestId: 'req-ghi789',
    userAgent: 'SecureOps-Platform/1.0',
    requestBody: null,
    responseBody: { error: 'Internal Server Error', stack: 'Error: Timeout at scan.js:123' },
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer [REDACTED]' },
    responseHeaders: { 'Content-Type': 'application/json', 'X-Request-ID': 'req-ghi789' },
  },
  { 
    id: '4', 
    apiName: '同步资产数据', 
    apiId: 'API-004', 
    path: '/api/v1/assets/sync', 
    method: 'POST', 
    statusCode: 200, 
    status: 'success', 
    responseTime: 456, 
    requestSize: '1.8KB', 
    responseSize: '8.3KB', 
    timestamp: '2026-05-25 10:29:15', 
    application: '内部系统', 
    ipAddress: '10.0.0.51',
    requestId: 'req-jkl012',
    userAgent: 'Asset-Sync/1.5',
    requestBody: { force: true, source: 'network' },
    responseBody: { synced: 150, updated: 45, errors: 2 },
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer [REDACTED]' },
    responseHeaders: { 'Content-Type': 'application/json', 'X-Request-ID': 'req-jkl012' },
  },
  { 
    id: '5', 
    apiName: '获取威胁情报', 
    apiId: 'API-001', 
    path: '/api/v1/threat-intel', 
    method: 'GET', 
    statusCode: 429, 
    status: 'warning', 
    responseTime: 89, 
    requestSize: '0.1KB', 
    responseSize: '0.1KB', 
    timestamp: '2026-05-25 10:29:00', 
    application: '测试环境', 
    ipAddress: '172.16.0.50',
    requestId: 'req-mno345',
    userAgent: 'Test-Client/1.0',
    requestBody: null,
    responseBody: { error: 'Rate limit exceeded', retryAfter: 60 },
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer [REDACTED]' },
    responseHeaders: { 'Content-Type': 'application/json', 'X-Request-ID': 'req-mno345', 'Retry-After': '60' },
  },
  { 
    id: '6', 
    apiName: '执行安全扫描', 
    apiId: 'API-002', 
    path: '/api/v1/scan', 
    method: 'POST', 
    statusCode: 401, 
    status: 'error', 
    responseTime: 45, 
    requestSize: '0.3KB', 
    responseSize: '0.2KB', 
    timestamp: '2026-05-25 10:28:45', 
    application: '未知', 
    ipAddress: '203.0.113.50',
    requestId: 'req-pqr678',
    userAgent: 'Unknown/1.0',
    requestBody: { target: '10.0.0.1' },
    responseBody: { error: 'Unauthorized', message: 'Invalid API key' },
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer invalid-token' },
    responseHeaders: { 'Content-Type': 'application/json', 'X-Request-ID': 'req-pqr678' },
  },
  { 
    id: '7', 
    apiName: '同步资产数据', 
    apiId: 'API-004', 
    path: '/api/v1/assets/sync', 
    method: 'POST', 
    statusCode: 200, 
    status: 'success', 
    responseTime: 289, 
    requestSize: '0.1KB', 
    responseSize: '25.6KB', 
    timestamp: '2026-05-25 10:28:30', 
    application: '内部系统', 
    ipAddress: '10.0.0.52',
    requestId: 'req-stu901',
    userAgent: 'Asset-Sync/1.5',
    requestBody: { source: 'database' },
    responseBody: { synced: 200, updated: 15, errors: 0 },
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer [REDACTED]' },
    responseHeaders: { 'Content-Type': 'application/json', 'X-Request-ID': 'req-stu901' },
  },
];

export function ApiCallLog() {
  const [logs, setLogs] = useState<ApiCallLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApi, setSelectedApi] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedLog, setSelectedLog] = useState<ApiCallLog | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'request' | 'response'>('overview');

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.apiName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      log.application.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      log.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchApi = !selectedApi || log.apiId === selectedApi;
    const matchStatus = !selectedStatus || log.status === selectedStatus;
    const matchMethod = !selectedMethod || log.method === selectedMethod;
    return matchSearch && matchApi && matchStatus && matchMethod;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const icons = {
      success: <CheckCircle2 className="w-3 h-3" />,
      warning: <AlertCircle className="w-3 h-3" />,
      error: <AlertCircle className="w-3 h-3" />,
    };
    const labels = {
      success: '成功',
      warning: '警告',
      error: '错误',
    };
    return (
      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      POST: 'bg-green-500/20 text-green-400 border-green-500/30',
      PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[method as keyof typeof colors]}`}>
        {method}
      </span>
    );
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-400';
    if (time < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleViewDetail = (log: ApiCallLog) => {
    setSelectedLog(log);
    setShowDetail(true);
    setActiveDetailTab('overview');
  };

  const handleExport = () => {
    const csvContent = [
      ['时间', 'API', '方法', '状态', '状态码', '响应时间(ms)', '应用', 'IP地址'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.apiName,
        log.method,
        log.status,
        log.statusCode,
        log.responseTime,
        log.application,
        log.ipAddress,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `api-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务API调用日志查询</h1>
        <p className="text-slate-400">查看和查询任务API调用历史记录</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索API、路径、应用或请求ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <select
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部API</option>
              <option value="API-001">获取威胁情报</option>
              <option value="API-002">执行安全扫描</option>
              <option value="API-003">获取扫描结果</option>
              <option value="API-004">同步资产数据</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="success">成功</option>
              <option value="warning">警告</option>
              <option value="error">错误</option>
            </select>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部方法</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">API</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">方法</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">响应时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">应用</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">请求ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{log.timestamp}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white font-medium">{log.apiName}</div>
                  <div className="text-xs text-slate-500 truncate max-w-xs">{log.path}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getMethodBadge(log.method)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(log.status)}
                    <span className="text-sm text-slate-400">{log.statusCode}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getResponseTimeColor(log.responseTime)}`}>
                    {log.responseTime}ms
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{log.application}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-xs text-slate-400 font-mono">{log.requestId}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleViewDetail(log)}
                    className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">暂无匹配的日志记录</p>
          </div>
        )}
      </div>

      {showDetail && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-white">日志详情</h3>
                <code className="text-xs text-slate-500">{selectedLog.requestId}</code>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-800">
              {[
                { key: 'overview', label: '概览', icon: Info },
                { key: 'request', label: '请求', icon: Clock },
                { key: 'response', label: '响应', icon: Zap },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveDetailTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                    activeDetailTab === tab.key 
                      ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {activeDetailTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">API名称</p>
                      <p className="text-white font-medium">{selectedLog.apiName}</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">请求方法</p>
                      <p>{getMethodBadge(selectedLog.method)}</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">状态</p>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedLog.status)}
                        <span className="text-white font-medium">HTTP {selectedLog.statusCode}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">响应时间</p>
                      <p className={`text-lg font-bold ${getResponseTimeColor(selectedLog.responseTime)}`}>
                        {selectedLog.responseTime}ms
                      </p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">请求大小</p>
                      <p className="text-white font-medium">{selectedLog.requestSize}</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">响应大小</p>
                      <p className="text-white font-medium">{selectedLog.responseSize}</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">应用</p>
                      <p className="text-white font-medium">{selectedLog.application}</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">IP地址</p>
                      <p className="text-white font-medium font-mono">{selectedLog.ipAddress}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400 mb-2">请求路径</p>
                    <p className="text-slate-300 break-all font-mono text-sm">{selectedLog.path}</p>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400 mb-2">User Agent</p>
                    <p className="text-slate-300 text-sm">{selectedLog.userAgent}</p>
                  </div>
                </div>
              )}

              {activeDetailTab === 'request' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-400">请求头</p>
                      <span className="text-xs text-slate-500">{Object.keys(selectedLog.requestHeaders).length} 个字段</span>
                    </div>
                    <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.requestHeaders, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-400">请求体</p>
                    </div>
                    {selectedLog.requestBody ? (
                      <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(selectedLog.requestBody, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-slate-500 text-sm">无请求体</p>
                    )}
                  </div>
                </div>
              )}

              {activeDetailTab === 'response' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-400">响应头</p>
                      <span className="text-xs text-slate-500">{Object.keys(selectedLog.responseHeaders).length} 个字段</span>
                    </div>
                    <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.responseHeaders, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-400">响应体</p>
                    </div>
                    {selectedLog.responseBody ? (
                      <pre className={`text-xs font-mono bg-slate-900 p-3 rounded overflow-x-auto max-h-64 overflow-y-auto ${
                        selectedLog.status === 'error' ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {JSON.stringify(selectedLog.responseBody, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-slate-500 text-sm">无响应体</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}