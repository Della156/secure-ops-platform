'use client';

import React, { useState } from 'react';
import { Copy, Check, Code, Eye, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  response: { status: number; description: string; body: string };
}

const mockData: ApiEndpoint[] = [
  {
    id: 'API-001',
    method: 'GET',
    path: '/api/v1/tasks',
    summary: '获取任务列表',
    description: '获取所有自动化任务的列表，支持分页和筛选',
    parameters: [
      { name: 'page', type: 'number', required: false, description: '页码，默认1' },
      { name: 'limit', type: 'number', required: false, description: '每页数量，默认20' },
      { name: 'status', type: 'string', required: false, description: '任务状态筛选' },
    ],
    response: { status: 200, description: '成功获取任务列表', body: `{\n  "data": [...],\n  "total": 100,\n  "page": 1\n}` },
  },
  {
    id: 'API-002',
    method: 'POST',
    path: '/api/v1/tasks',
    summary: '创建新任务',
    description: '创建一个新的自动化任务',
    parameters: [
      { name: 'name', type: 'string', required: true, description: '任务名称' },
      { name: 'protocol', type: 'string', required: true, description: '接入协议' },
      { name: 'params', type: 'object', required: false, description: '接入参数' },
    ],
    response: { status: 201, description: '任务创建成功', body: `{\n  "id": "TASK-001",\n  "name": "新任务",\n  "status": "pending"\n}` },
  },
  {
    id: 'API-003',
    method: 'GET',
    path: '/api/v1/tasks/{id}',
    summary: '获取任务详情',
    description: '获取指定任务的详细信息',
    parameters: [
      { name: 'id', type: 'string', required: true, description: '任务ID' },
    ],
    response: { status: 200, description: '成功获取任务详情', body: `{\n  "id": "TASK-001",\n  "name": "任务名称",\n  "protocol": "SSH",\n  "status": "normal"\n}` },
  },
  {
    id: 'API-004',
    method: 'PUT',
    path: '/api/v1/tasks/{id}',
    summary: '更新任务',
    description: '更新指定任务的配置信息',
    parameters: [
      { name: 'id', type: 'string', required: true, description: '任务ID' },
      { name: 'name', type: 'string', required: false, description: '任务名称' },
      { name: 'params', type: 'object', required: false, description: '接入参数' },
    ],
    response: { status: 200, description: '任务更新成功', body: `{\n  "id": "TASK-001",\n  "name": "更新后的名称"\n}` },
  },
  {
    id: 'API-005',
    method: 'DELETE',
    path: '/api/v1/tasks/{id}',
    summary: '删除任务',
    description: '删除指定的任务',
    parameters: [
      { name: 'id', type: 'string', required: true, description: '任务ID' },
    ],
    response: { status: 204, description: '任务删除成功', body: '' },
  },
];

export function ApiDocView() {
  const [expandedId, setExpandedId] = useState<string | null>(mockData[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-[#00C853] text-white',
      POST: 'bg-[#0066FF] text-white',
      PUT: 'bg-[#FF9100] text-white',
      DELETE: 'bg-[#FF3B30] text-white',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">API 文档查看</h1>
        <p className="text-[#9CA3AF]">查看自动化任务平台的 API 接口文档</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] rounded-lg">
            <Terminal className="w-4 h-4 text-[#00C853]" />
            <span className="text-sm text-[#F3F4F6] font-mono">BASE_URL: https://api.secure-ops.local</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockData.map((endpoint) => (
          <div key={endpoint.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between hover:bg-[#181F32]/30 transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === endpoint.id ? null : endpoint.id)}
            >
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                  {endpoint.method}
                </span>
                <code className="text-[#0066FF] font-mono">{endpoint.path}</code>
                <span className="text-[#F3F4F6] font-medium">{endpoint.summary}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(`${endpoint.method} ${endpoint.path}`, endpoint.id); }}
                  className="p-2 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#0066FF]/10 rounded-lg transition-colors"
                  title="复制路径"
                >
                  {copiedId === endpoint.id ? <Check className="w-4 h-4 text-[#00C853]" /> : <Copy className="w-4 h-4" />}
                </button>
                {expandedId === endpoint.id ? (
                  <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
                )}
              </div>
            </div>

            {expandedId === endpoint.id && (
              <div className="px-6 py-4 bg-[#181F32]/30 border-t border-[#2A354D]">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[#D1D5DB] mb-2">描述</h4>
                  <p className="text-sm text-[#9CA3AF]">{endpoint.description}</p>
                </div>

                {endpoint.parameters.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#D1D5DB] mb-2">参数</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#2A354D]">
                            <th className="px-4 py-2 text-left text-[#9CA3AF]">参数名</th>
                            <th className="px-4 py-2 text-left text-[#9CA3AF]">类型</th>
                            <th className="px-4 py-2 text-left text-[#9CA3AF]">必填</th>
                            <th className="px-4 py-2 text-left text-[#9CA3AF]">描述</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, index) => (
                            <tr key={index} className="border-b border-[#2A354D]/50">
                              <td className="px-4 py-2 text-[#F3F4F6] font-mono">{param.name}</td>
                              <td className="px-4 py-2 text-[#0066FF]">{param.type}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-0.5 rounded text-xs ${param.required ? 'bg-[#FF3B30]/20 text-[#FF3B30]' : 'bg-[#00C853]/20 text-[#00C853]'}`}>
                                  {param.required ? '是' : '否'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-[#9CA3AF]">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-[#D1D5DB]">响应示例</h4>
                    <span className="px-2 py-0.5 bg-[#00C853]/20 text-[#00C853] rounded text-xs">
                      {endpoint.response.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-[#9CA3AF]">{endpoint.response.description}</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(endpoint.response.body, `resp-${endpoint.id}`); }}
                      className="absolute top-2 right-2 p-1.5 bg-[#181F32] text-[#6B7280] hover:text-[#F3F4F6] rounded transition-colors"
                    >
                      {copiedId === `resp-${endpoint.id}` ? <Check className="w-3 h-3 text-[#00C853]" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre className="bg-[#111625] rounded-lg p-4 text-sm font-mono text-[#D1D5DB] overflow-x-auto">
                      <code>{endpoint.response.body}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}