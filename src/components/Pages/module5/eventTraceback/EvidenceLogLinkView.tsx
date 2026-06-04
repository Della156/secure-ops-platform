'use client';

import React, { useState } from 'react';
import {
  FileText, Search, Filter, Download, RefreshCw,
  Link2, Database, Eye, ChevronRight, Copy, Check,
  Clock, User, MapPin, AlertTriangle
} from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  source: string;
  type: string;
  content: string;
  level: 'info' | 'warn' | 'error';
}

const logEntries: LogEntry[] = [
  { id: 'l1', time: '14:32:15.234', source: '防火墙', type: '流量日志', content: '检测到异常流量: 203.156.89.42 -> 192.168.1.100:80', level: 'warn' },
  { id: 'l2', time: '14:32:15.456', source: 'SIEM', type: '告警日志', content: '触发规则: 暴力破解检测 - 连续10次登录失败', level: 'error' },
  { id: 'l3', time: '14:32:16.123', source: 'WAF', type: '防护日志', content: '拦截SQL注入尝试: /api/user/login', level: 'warn' },
  { id: 'l4', time: '14:32:30.789', source: '认证系统', type: '认证日志', content: '用户admin登录失败，来源IP: 203.156.89.42', level: 'warn' },
  { id: 'l5', time: '14:33:00.123', source: '防火墙', type: '策略日志', content: '自动策略生效: 阻断IP 203.156.89.42', level: 'info' },
  { id: 'l6', time: '14:33:15.456', source: '通知系统', type: '通知日志', content: '发送告警至安全团队: 张工', level: 'info' },
  { id: 'l7', time: '14:35:00.789', source: '工单系统', type: '工单日志', content: '工单创建: EVT-2026-0602-001，状态: 处理中', level: 'info' },
];

function LogLevelBadge({ level }: { level: LogEntry['level'] }) {
  const config = {
    info: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'INFO' },
    warn: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'WARN' },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'ERROR' },
  };
  const { bg, text, label } = config[level];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function EvidenceLogLinkView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logEntries.filter(log =>
    log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: logEntries.length,
    error: logEntries.filter(l => l.level === 'error').length,
    warn: logEntries.filter(l => l.level === 'warn').length,
    info: logEntries.filter(l => l.level === 'info').length,
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            证据日志链路视图
          </h2>
          <p className="text-sm text-gray-400 mt-1">查看事件相关的完整日志链路，追踪证据来源</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出日志
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '日志总数', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: '错误日志', value: stats.error, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: '警告日志', value: stats.warn, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: '信息日志', value: stats.info, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索日志内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2">
                <option value="all">全部级别</option>
                <option value="error">错误</option>
                <option value="warn">警告</option>
                <option value="info">信息</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredLogs.map((log, i) => (
            <div key={log.id} className="p-4 hover:bg-[#111625] transition-colors">
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-400">{log.time}</span>
                    <LogLevelBadge level={log.level} />
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {log.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {log.type}
                    </span>
                  </div>
                  <p className="text-sm text-white mt-2 bg-[#111625] rounded p-3 font-mono break-all">
                    {log.content}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-[#20293F] rounded" title="查看详情">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(log.id)}
                    className="p-2 hover:bg-[#20293F] rounded"
                    title="复制ID"
                  >
                    {copiedId === log.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            日志链路摘要
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">开始时间</span>
              <span className="text-white">14:32:15.234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">结束时间</span>
              <span className="text-white">14:35:00.789</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">涉及系统</span>
              <span className="text-white">5个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">日志数量</span>
              <span className="text-white">7条</span>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            关键证据
          </h3>
          <div className="space-y-2">
            {[
              { name: '攻击源IP', value: '203.156.89.42', type: '高危' },
              { name: '目标端口', value: '80/tcp', type: '信息' },
              { name: '攻击类型', value: '暴力破解', type: '高危' },
              { name: '触发规则', value: '连续10次登录失败', type: '信息' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white">{item.value}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${item.type === '高危' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvidenceLogLinkView;