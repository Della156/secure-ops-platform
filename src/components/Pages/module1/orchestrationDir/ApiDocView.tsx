'use client';

import React, { useState } from 'react';
import { Search, Download, Copy, Check, Eye, X, ChevronDown, ChevronRight, FileCode, GitCompare, Clock, Code } from 'lucide-react';

interface ApiDoc {
  id: string;
  name: string;
  version: string;
  abilityId: string;
  abilityName: string;
  description: string;
  updatedAt: string;
  status: 'active' | 'deprecated' | 'draft';
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestParams: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    in: 'path' | 'query' | 'body';
  }>;
  responseParams: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  exampleRequest: string;
  exampleResponse: string;
}

const mockApiDocs: ApiDoc[] = [
  {
    id: 'DOC-001',
    name: '防火墙规则扫描',
    version: 'v1.0.3',
    abilityId: 'ABL-001',
    abilityName: '防火墙规则扫描',
    description: '扫描防火墙配置，检测异常规则和潜在安全问题',
    updatedAt: '2026-05-28 10:30:00',
    status: 'active',
    path: '/api/v1/ability/firewall-scan',
    method: 'POST',
    requestParams: [
      { name: 'deviceId', type: 'string', required: true, description: '防火墙设备ID', in: 'body' },
      { name: 'scanDepth', type: 'number', required: false, description: '扫描深度，默认1', in: 'body' }
    ],
    responseParams: [
      { name: 'scanReport', type: 'object', description: '扫描报告对象' },
      { name: 'riskCount', type: 'number', description: '风险数量' }
    ],
    exampleRequest: `{\n  "deviceId": "FW-001",\n  "scanDepth": 2\n}`,
    exampleResponse: `{\n  "success": true,\n  "data": {\n    "scanReport": {\n      "deviceId": "FW-001",\n      "scanTime": "2026-05-28T10:30:00Z"\n    },\n    "riskCount": 5\n  }\n}`
  },
  {
    id: 'DOC-002',
    name: '端口安全检查',
    version: 'v2.1.0',
    abilityId: 'ABL-002',
    abilityName: '端口安全检查',
    description: '检查目标主机开放端口，识别潜在安全风险',
    updatedAt: '2026-05-25 14:20:00',
    status: 'active',
    path: '/api/v1/ability/port-scan',
    method: 'POST',
    requestParams: [
      { name: 'targetIp', type: 'string', required: true, description: '目标IP地址', in: 'body' },
      { name: 'portRange', type: 'string', required: false, description: '端口范围，默认1-65535', in: 'body' }
    ],
    responseParams: [
      { name: 'openPorts', type: 'array', description: '开放端口列表' },
      { name: 'vulnerabilities', type: 'array', description: '漏洞列表' }
    ],
    exampleRequest: `{\n  "targetIp": "192.168.1.100",\n  "portRange": "1-1000"\n}`,
    exampleResponse: `{\n  "success": true,\n  "data": {\n    "openPorts": [22, 80, 443],\n    "vulnerabilities": []\n  }\n}`
  },
  {
    id: 'DOC-003',
    name: '日志分析',
    version: 'v1.2.0',
    abilityId: 'ABL-003',
    abilityName: '日志分析',
    description: '从ELK中提取安全日志进行分析和统计',
    updatedAt: '2026-05-20 09:15:00',
    status: 'active',
    path: '/api/v1/ability/log-analysis',
    method: 'GET',
    requestParams: [
      { name: 'timeRange', type: 'string', required: true, description: '时间范围', in: 'query' },
      { name: 'query', type: 'string', required: false, description: '查询条件', in: 'query' }
    ],
    responseParams: [
      { name: 'logs', type: 'array', description: '日志列表' },
      { name: 'statistics', type: 'object', description: '统计数据' }
    ],
    exampleRequest: `GET /api/v1/ability/log-analysis?timeRange=24h&query=level:error`,
    exampleResponse: `{\n  "success": true,\n  "data": {\n    "logs": [],\n    "statistics": {\n      "total": 150,\n      "errorCount": 10\n    }\n  }\n}`
  },
  {
    id: 'DOC-004',
    name: '漏洞扫描',
    version: 'v0.9.0',
    abilityId: 'ABL-004',
    abilityName: '漏洞扫描',
    description: '基于CVE数据库扫描系统漏洞',
    updatedAt: '2026-05-22 16:45:00',
    status: 'draft',
    path: '/api/v1/ability/vulnerability-scan',
    method: 'POST',
    requestParams: [
      { name: 'targets', type: 'array', required: true, description: '目标列表', in: 'body' },
      { name: 'severity', type: 'string', required: false, description: '严重程度筛选', in: 'body' }
    ],
    responseParams: [
      { name: 'vulnerabilities', type: 'array', description: '漏洞详情' },
      { name: 'summary', type: 'object', description: '扫描摘要' }
    ],
    exampleRequest: `{\n  "targets": ["192.168.1.0/24"],\n  "severity": "high"\n}`,
    exampleResponse: `{\n  "success": true,\n  "data": {\n    "vulnerabilities": [],\n    "summary": {\n      "total": 0\n    }\n  }\n}`
  }
];

const versions = [
  { version: 'v1.0.3', date: '2026-05-28', changes: '修复SSH连接超时问题' },
  { version: 'v1.0.2', date: '2026-05-25', changes: '添加错误日志记录' },
  { version: 'v1.0.1', date: '2026-05-20', changes: '初始版本' }
];

export function ApiDocView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<ApiDoc | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  const filteredDocs = mockApiDocs.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.abilityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      deprecated: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      draft: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30'
    };
    const labels = {
      active: '活跃',
      deprecated: '已弃用',
      draft: '草稿'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const styles = {
      GET: 'bg-[#0066FF]/20 text-[#0066FF]',
      POST: 'bg-[#00C853]/20 text-[#00C853]',
      PUT: 'bg-[#FF9100]/20 text-[#FF9100]',
      DELETE: 'bg-[#FF3B30]/20 text-[#FF3B30]'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[method as keyof typeof styles]}`}>
        {method}
      </span>
    );
  };

  const handleViewDetail = (doc: ApiDoc) => {
    setSelectedDoc(doc);
    setIsDetailModalOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'json' | 'yaml') => {
    alert(`下载${format.toUpperCase()} 文档成功！`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务接口描述与文档查看</h1>
        <p className="text-[#9CA3AF]">查看和管理自动化能力的API接口文档</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索接口名称或能力..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="active">活跃</option>
              <option value="deprecated">已弃用</option>
              <option value="draft">草稿</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">文档ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">接口名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">能力</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">方法</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">版本</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">更新时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredDocs.map(doc => (
            <tr key={doc.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{doc.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{doc.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{doc.abilityName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getMethodBadge(doc.method)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0066FF] font-mono">{doc.version}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{doc.updatedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(doc.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(doc)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg text-xs transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      查看
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDocs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">暂无数据</p>
          </div>
        )}
      </div>

      {isDetailModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#0066FF]" />
                  <h3 className="text-lg font-semibold text-[#F3F4F6]">{selectedDoc.name}</h3>
                </div>
                <span className="px-2 py-1 bg-[#181F32] text-[#9CA3AF] rounded text-xs">{selectedDoc.version}</span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {getMethodBadge(selectedDoc.method)}
                  <span className="font-mono text-[#D1D5DB] text-sm">{selectedDoc.path}</span>
                </div>
                {getStatusBadge(selectedDoc.status)}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#E5E7EB] mb-2">描述</h4>
                <p className="text-[#D1D5DB]">{selectedDoc.description}</p>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setShowVersions(!showVersions)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm transition-colors"
                >
                  <GitCompare className="w-4 h-4" />
                  版本历史
                  {showVersions ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDownload('json')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载 JSON
                </button>
                <button
                  onClick={() => handleDownload('yaml')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载 YAML
                </button>
              </div>

              {showVersions && (
                <div className="bg-[#181F32] rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                    版本历史
                  </h4>
                  <div className="space-y-3">
                    {versions.map(v => (
                      <div key={v.version} className="flex items-start gap-3 pb-3 border-b border-[#2A354D] last:border-0">
                        <div className="flex-shrink-0 w-24 text-sm text-[#0066FF] font-mono">{v.version}</div>
                        <div className="flex-shrink-0 w-32 text-sm text-[#9CA3AF]">{v.date}</div>
                        <div className="text-sm text-[#D1D5DB]">{v.changes}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00C853] rounded-full" />
                  请求参数
                </h4>
                <div className="bg-[#181F32] rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#2A354D]/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">参数名</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">类型</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">位置</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">必填</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A354D]">
                      {selectedDoc.requestParams.map((param, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-[#F3F4F6] font-mono">{param.name}</td>
                          <td className="px-4 py-2 text-sm text-[#0066FF] font-mono">{param.type}</td>
                          <td className="px-4 py-2 text-sm text-[#D1D5DB]">{param.in}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs ${param.required ? 'bg-[#FF3B30]/20 text-[#FF3B30]' : 'bg-[#3A4560] text-[#D1D5DB]'}`}>
                              {param.required ? '是' : '否'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-[#9CA3AF]">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0066FF] rounded-full" />
                  响应参数
                </h4>
                <div className="bg-[#181F32] rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#2A354D]/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">参数名</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">类型</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A354D]">
                      {selectedDoc.responseParams.map((param, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-[#F3F4F6] font-mono">{param.name}</td>
                          <td className="px-4 py-2 text-sm text-[#0066FF] font-mono">{param.type}</td>
                          <td className="px-4 py-2 text-sm text-[#9CA3AF]">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[#E5E7EB] flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    请求示例
                  </h4>
                  <button
                    onClick={() => handleCopy(selectedDoc.exampleRequest)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#3A4560] text-[#D1D5DB] rounded-lg text-sm transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#00C853]" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <pre className="bg-[#181F32] p-4 rounded-lg text-sm text-[#D1D5DB] overflow-x-auto">
                  <code>{selectedDoc.exampleRequest}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[#E5E7EB] flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    响应示例
                  </h4>
                  <button
                    onClick={() => handleCopy(selectedDoc.exampleResponse)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#3A4560] text-[#D1D5DB] rounded-lg text-sm transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#00C853]" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <pre className="bg-[#181F32] p-4 rounded-lg text-sm text-[#D1D5DB] overflow-x-auto">
                  <code>{selectedDoc.exampleResponse}</code>
                </pre>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
