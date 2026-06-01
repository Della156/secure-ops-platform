'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Calendar, Clock, CheckCircle2, AlertCircle, X, FileText, User, Link2, Activity } from 'lucide-react';

interface CallLog {
  id: string;
  interfaceName: string;
  interfaceId: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  status: 'success' | 'error' | 'warning';
  responseTime: number;
  requestSize: string;
  responseSize: string;
  timestamp: string;
  user: string;
  ip: string;
}

const mockLogs: CallLog[] = [
  { id: '1', interfaceName: '威胁情报平台接口', interfaceId: 'IF-001', url: 'https://ti.example.com/api/v1/threats', method: 'GET', statusCode: 200, status: 'success', responseTime: 234, requestSize: '0.2KB', responseSize: '12.5KB', timestamp: '2026-05-25 10:30:00', user: 'admin', ip: '192.168.1.10' },
  { id: '2', interfaceName: '日志分析系统接口', interfaceId: 'IF-002', url: 'https://siem.example.com/api/v2/logs', method: 'POST', statusCode: 201, status: 'success', responseTime: 187, requestSize: '2.3KB', responseSize: '0.1KB', timestamp: '2026-05-25 10:29:45', user: 'system', ip: '192.168.1.11' },
  { id: '3', interfaceName: '资产发现服务', interfaceId: 'IF-003', url: 'https://asset.example.com/graphql', method: 'POST', statusCode: 503, status: 'error', responseTime: 5000, requestSize: '0.5KB', responseSize: '0.0KB', timestamp: '2026-05-25 10:29:30', user: 'admin', ip: '192.168.1.10' },
  { id: '4', interfaceName: '漏洞扫描系统', interfaceId: 'IF-004', url: 'https://scan.example.com/api/scan', method: 'POST', statusCode: 200, status: 'success', responseTime: 456, requestSize: '1.8KB', responseSize: '8.3KB', timestamp: '2026-05-25 10:29:15', user: 'scanner', ip: '192.168.1.12' },
  { id: '5', interfaceName: '威胁情报平台接口', interfaceId: 'IF-001', url: 'https://ti.example.com/api/v1/ioc', method: 'GET', statusCode: 200, status: 'success', responseTime: 156, requestSize: '0.1KB', responseSize: '5.2KB', timestamp: '2026-05-25 10:29:00', user: 'admin', ip: '192.168.1.10' },
  { id: '6', interfaceName: '日志分析系统接口', interfaceId: 'IF-002', url: 'https://siem.example.com/api/v2/search', method: 'GET', statusCode: 400, status: 'warning', responseTime: 89, requestSize: '0.3KB', responseSize: '0.2KB', timestamp: '2026-05-25 10:28:45', user: 'operator', ip: '192.168.1.13' },
  { id: '7', interfaceName: '威胁情报平台接口', interfaceId: 'IF-001', url: 'https://ti.example.com/api/v1/feeds', method: 'GET', statusCode: 200, status: 'success', responseTime: 289, requestSize: '0.1KB', responseSize: '25.6KB', timestamp: '2026-05-25 10:28:30', user: 'system', ip: '192.168.1.11' },
  { id: '8', interfaceName: '防火墙日志接口', interfaceId: 'IF-005', url: 'https://fw.example.com/rest/logs', method: 'POST', statusCode: 200, status: 'success', responseTime: 145, requestSize: '5.6KB', responseSize: '18.9KB', timestamp: '2026-05-25 10:28:15', user: 'system', ip: '192.168.1.11' },
];

export function InterfaceCallLog() {
  const [logs, setLogs] = useState<CallLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterface, setSelectedInterface] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.interfaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.ip.toLowerCase().includes(searchTerm.toLowerCase());
    const matchInterface = !selectedInterface || log.interfaceId === selectedInterface;
    const matchStatus = !selectedStatus || log.status === selectedStatus;
    const matchMethod = !selectedMethod || log.method === selectedMethod;
    return matchSearch && matchInterface && matchStatus && matchMethod;
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
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      POST: 'bg-green-500/20 text-green-400 border-green-500/30',
      PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border font-semibold ${colors[method]}`}>
        {method}
      </span>
    );
  };

  const handleViewDetail = (log: CallLog) => {
    setSelectedLog(log);
    setShowDetail(true);
  };

  const handleExport = () => {
    alert('正在导出日志...');
  };

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    error: logs.filter(l => l.status === 'error').length,
    warning: logs.filter(l => l.status === 'warning').length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">数据接口调用日志查询</h1>
            <p className="text-slate-400 text-sm">查看和查询数据接口调用历史记录</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">总调用次数</p>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">成功</p>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.success}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">警告</p>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.warning}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">错误</p>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.error}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索接口、URL、用户或IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <select
              value={selectedInterface}
              onChange={(e) => setSelectedInterface(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部接口</option>
              <option value="IF-001">威胁情报平台接口</option>
              <option value="IF-002">日志分析系统接口</option>
              <option value="IF-003">资产发现服务</option>
              <option value="IF-004">漏洞扫描系统</option>
              <option value="IF-005">防火墙日志接口</option>
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

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              时间筛选
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">接口</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">方法</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">响应时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-400">{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-medium">{log.interfaceName}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Link2 className="w-3 h-3" />
                      <span className="truncate max-w-xs">{log.url}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getMethodBadge(log.method)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(log.status)}
                      <span className="text-sm text-slate-400 font-mono">{log.statusCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-mono ${log.responseTime > 1000 ? 'text-red-400' : 'text-slate-300'}`}>
                        {log.responseTime}ms
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-300">{log.user}</span>
                      <span className="text-xs text-slate-500 ml-2">{log.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewDetail(log)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">暂无匹配的日志记录</p>
          </div>
        )}
      </div>

      {showDetail && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">日志详情</h3>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">接口名称</p>
                  <p className="text-white font-medium">{selectedLog.interfaceName}</p>
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
                  <p className="text-white font-medium">{selectedLog.responseTime}ms</p>
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
                  <p className="text-sm text-slate-400 mb-1">操作用户</p>
                  <p className="text-white font-medium">{selectedLog.user}</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">来源IP</p>
                  <p className="text-white font-medium font-mono">{selectedLog.ip}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">请求URL</p>
                <p className="text-slate-300 break-all font-mono text-sm">{selectedLog.url}</p>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">请求头</p>
                <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded overflow-x-auto">
                  {JSON.stringify({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer [REDACTED]',
                    'User-Agent': 'SecureOps-Platform/1.0',
                    'X-Forwarded-For': selectedLog.ip,
                  }, null, 2)}
                </pre>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">响应头</p>
                <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded overflow-x-auto">
                  {JSON.stringify({
                    'Content-Type': 'application/json',
                    'X-Request-ID': 'req-' + selectedLog.id,
                    'X-RateLimit-Remaining': '999',
                    'Date': new Date().toUTCString(),
                  }, null, 2)}
                </pre>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">响应内容</p>
                <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify({
                    success: selectedLog.status === 'success',
                    code: selectedLog.statusCode,
                    data: selectedLog.status === 'success' ? [{ id: '1', name: 'Sample' }] : null,
                    error: selectedLog.status === 'error' ? 'Service unavailable' : selectedLog.status === 'warning' ? 'Invalid parameter' : null,
                  }, null, 2)}
                </pre>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800">
              <button
                onClick={() => setShowDetail(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
              >
                关闭
              </button>
              <button
                onClick={handleExport}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                导出详情
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}