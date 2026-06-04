'use client';

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Play, Download, X, Wifi, WifiOff, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { ResourceType, ConnectTestRecord, ResourceItem } from '@/data/module1/resourceMock';
import { getResourceMock, resourceConfig } from '@/data/module1/resourceMock';

interface ResourceConnectTestProps {
  resourceType: ResourceType;
}

export function ResourceConnectTest({ resourceType }: ResourceConnectTestProps) {
  const config = resourceConfig[resourceType];
  const mock = getResourceMock(resourceType);
  
  const [connectHistory, setConnectHistory] = useState<ConnectTestRecord[]>(mock.connectHistory);
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selectedProtocol, setSelectedProtocol] = useState('SSH');
  const [address, setAddress] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | 'timeout' | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [responseTime, setResponseTime] = useState(0);
  const [searchOperator, setSearchOperator] = useState('');
  const [filterProtocol, setFilterProtocol] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showLogDetail, setShowLogDetail] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ConnectTestRecord | null>(null);
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const protocols = ['SSH', 'HTTPS', 'HTTP', 'Telnet', 'FTP', 'PostgreSQL', 'MySQL', 'Redis', 'RDP', 'IPsec', 'AMQP'];

  const filteredHistory = connectHistory.filter(record => {
    const matchResource = !selectedResource || record.resourceId === selectedResource;
    const matchProtocol = !filterProtocol || record.protocol === filterProtocol;
    const matchStatus = !filterStatus || record.status === filterStatus;
    return matchResource && matchProtocol && matchStatus;
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isStreaming) {
      interval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString('zh-CN');
        const messages = [
          `[${timestamp}] 正在建立连接...`,
          `[${timestamp}] 发送连接请求`,
          `[${timestamp}] 等待响应...`,
          `[${timestamp}] 连接已建立`,
          `[${timestamp}] 开始数据传输`,
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setLiveLog(prev => [...prev.slice(-20), randomMsg]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleTest = () => {
    if (!selectedResource || !address) {
      alert('请选择资源并输入地址');
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    setTestMessage('');
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      const timeout = Math.random() > 0.8;
      const response = Math.floor(Math.random() * 200) + 5;
      
      if (timeout) {
        setTestResult('timeout');
        setTestMessage('连接超时');
        setResponseTime(3000);
      } else if (success) {
        setTestResult('success');
        setTestMessage('连接成功');
        setResponseTime(response);
      } else {
        setTestResult('failed');
        setTestMessage('连接失败：目标主机不可达');
        setResponseTime(5000);
      }
      
      setIsTesting(false);
      
      const resource = mock.list.find(r => r.id === selectedResource);
      if (resource) {
        const newRecord: ConnectTestRecord = {
          id: `conn-${Date.now()}`,
          resourceId: selectedResource,
          resourceName: resource.name,
          protocol: selectedProtocol,
          address,
          status: testResult!,
          responseTime: responseTime || (timeout ? 3000 : 5000),
          timestamp: new Date().toLocaleString('zh-CN'),
          message: testMessage,
        };
        setConnectHistory([newRecord, ...connectHistory]);
      }
    }, 2000);
  };

  const handleExport = () => {
    const data = connectHistory.map(r => ({
      'ID': r.id,
      '资源名称': r.resourceName,
      '协议': r.protocol,
      '地址': r.address,
      '状态': r.status === 'success' ? '成功' : r.status === 'timeout' ? '超时' : '失败',
      '响应时间': r.responseTime + 'ms',
      '时间': r.timestamp,
      '消息': r.message,
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.label}连接测试记录.csv`;
    link.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#00C853]" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-[#FF3B30]" />;
      case 'timeout':
        return <Clock className="w-5 h-5 text-[#FF9100]" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return '成功';
      case 'failed': return '失败';
      case 'timeout': return '超时';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-[#00C853]';
      case 'failed': return 'text-[#FF3B30]';
      case 'timeout': return 'text-[#FF9100]';
      default: return 'text-[#9CA3AF]';
    }
  };

  const getResponseTimeColor = (ms: number) => {
    if (ms < 100) return 'text-[#00C853]';
    if (ms < 500) return 'text-[#FF9100]';
    return 'text-[#FF3B30]';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">{config.title}连接测试</h1>
        <p className="text-[#9CA3AF]">测试{config.label}的网络连接状态</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00C853]/20 rounded-lg">
              <Wifi className="w-5 h-5 text-[#00C853]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">成功连接</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">
                {connectHistory.filter(h => h.status === 'success').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF9100]/20 rounded-lg">
              <Clock className="w-5 h-5 text-[#FF9100]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">超时连接</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">
                {connectHistory.filter(h => h.status === 'timeout').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF3B30]/20 rounded-lg">
              <WifiOff className="w-5 h-5 text-[#FF3B30]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">失败连接</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">
                {connectHistory.filter(h => h.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6 mb-6">
        <h3 className="text-sm font-medium text-[#D1D5DB] mb-4">连接测试</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">选择{config.label}</label>
            <select
              value={selectedResource}
              onChange={(e) => {
                setSelectedResource(e.target.value);
                const resource = mock.list.find(r => r.id === e.target.value);
                if (resource) {
                  setAddress(resource.ip + ':22');
                }
              }}
              className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">请选择{config.label}</option>
              {mock.list.map(resource => (
                <option key={resource.id} value={resource.id}>{resource.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">协议</label>
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              {protocols.map(protocol => (
                <option key={protocol} value={protocol}>{protocol}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">地址</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              placeholder="192.168.1.1:22"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-[#4A5570] text-white rounded-lg transition-colors"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  开始测试
                </>
              )}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            testResult === 'success' ? 'bg-[#00C853]/10 border border-[#00C853]/30' :
            testResult === 'timeout' ? 'bg-[#FF9100]/10 border border-[#FF9100]/30' :
            'bg-[#FF3B30]/10 border border-[#FF3B30]/30'
          }`}>
            <div className="flex items-center gap-4">
              {getStatusIcon(testResult)}
              <div>
                <p className={`font-medium ${getStatusColor(testResult)}`}>
                  {testMessage}
                </p>
                <p className="text-sm text-[#9CA3AF]">
                  响应时间: <span className={getResponseTimeColor(responseTime)}>{responseTime}ms</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#2A354D]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#9CA3AF]">实时日志流</span>
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                isStreaming ? 'bg-[#0066FF]/20 text-[#0066FF]' : 'bg-[#181F32] text-[#D1D5DB]'
              }`}
            >
              {isStreaming ? '停止' : '开始'}
            </button>
          </div>
          <div className="mt-2 h-32 bg-[#111625] rounded-lg p-3 overflow-y-auto font-mono text-sm">
            {liveLog.map((log, idx) => (
              <div key={idx} className="text-[#D1D5DB]">{log}</div>
            ))}
            {!isStreaming && liveLog.length === 0 && (
              <div className="text-[#6B7280]">点击"开始"按钮启动实时日志流</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A354D] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索资源名称..."
                value={searchOperator}
                onChange={(e) => setSearchOperator(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-48"
              />
            </div>
            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部协议</option>
              {[...new Set(connectHistory.map(h => h.protocol))].map(protocol => (
                <option key={protocol} value={protocol}>{protocol}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
              <option value="timeout">超时</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出记录
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#181F32]/50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{config.label}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">协议</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">地址</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">响应时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredHistory.map((record) => (
                <tr key={record.id} className="hover:bg-[#181F32]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{record.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{record.resourceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF]">
                      {record.protocol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB] font-mono">{record.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`text-sm ${getStatusColor(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${getResponseTimeColor(record.responseTime)}`}>
                    {record.responseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => { setSelectedLog(record); setShowLogDetail(true); }}
                      className="text-[#0066FF] hover:text-[#4D94FF] text-sm"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[#6B7280]">暂无测试记录</p>
            </div>
          )}
        </div>
      </div>

      {showLogDetail && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">测试详情</h3>
              <button
                onClick={() => setShowLogDetail(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">测试ID</label>
                <p className="text-[#F3F4F6]">{selectedLog.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">{config.label}</label>
                <p className="text-[#F3F4F6]">{selectedLog.resourceName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">协议</label>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF]">
                  {selectedLog.protocol}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">地址</label>
                <p className="text-[#F3F4F6] font-mono">{selectedLog.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">状态</label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedLog.status)}
                  <span className={`${getStatusColor(selectedLog.status)}`}>
                    {getStatusLabel(selectedLog.status)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">响应时间</label>
                <p className={`text-[#F3F4F6] font-mono ${getResponseTimeColor(selectedLog.responseTime)}`}>
                  {selectedLog.responseTime}ms
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">测试时间</label>
                <p className="text-[#F3F4F6]">{selectedLog.timestamp}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">消息</label>
                <p className="text-[#F3F4F6]">{selectedLog.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}