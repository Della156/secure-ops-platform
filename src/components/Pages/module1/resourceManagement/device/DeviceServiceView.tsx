'use client';

import React, { useState } from 'react';
import { Search, Code, BookOpen, Copy, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  type: string;
  description: string;
  params: { name: string; type: string; required: boolean; description: string }[];
  example: string;
  category: string;
}

const mockServices: Service[] = [
  {
    id: 'svc-1',
    name: '防火墙规则添加',
    type: 'API',
    description: '向防火墙添加新的访问控制规则',
    category: '防火墙',
    params: [
      { name: 'source_ip', type: 'string', required: true, description: '源IP地址' },
      { name: 'destination_ip', type: 'string', required: true, description: '目的IP地址' },
      { name: 'port', type: 'number', required: true, description: '端口号' },
      { name: 'action', type: 'string', required: true, description: '动作: allow/deny' },
    ],
    example: `curl -X POST https://fw-api.local/v1/rules \\
  -H "Authorization: Bearer token" \\
  -d '{
    "source_ip": "192.168.1.100",
    "destination_ip": "10.0.0.1",
    "port": 80,
    "action": "allow"
  }'`
  },
  {
    id: 'svc-2',
    name: '获取系统状态',
    type: 'API',
    description: '获取设备的当前运行状态信息',
    category: '监控',
    params: [
      { name: 'detail', type: 'boolean', required: false, description: '是否返回详细信息' },
    ],
    example: `curl https://fw-api.local/v1/status?detail=true \\
  -H "Authorization: Bearer token"`
  },
  {
    id: 'svc-3',
    name: '配置备份',
    type: 'Command',
    description: '执行设备配置备份操作',
    category: '维护',
    params: [
      { name: 'backup_name', type: 'string', required: true, description: '备份文件名称' },
    ],
    example: `backup --name "daily_backup_20260601" --encrypt`
  },
];

export function DeviceServiceView() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredServices = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchText.toLowerCase()) || 
                       s.description.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = !selectedCategory || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const categories = [...new Set(services.map(s => s.category))];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">设备可用服务/指令视图</h1>
        <p className="text-[#9CA3AF]">浏览和查看设备提供的API接口和可用指令</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="搜索服务或指令..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          >
            <option value="">全部分类</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div
              className="p-4 cursor-pointer flex items-center justify-between hover:bg-[#181F32]/50 transition-colors"
              onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${service.type === 'API' ? 'bg-[#0066FF]/20' : 'bg-[#6366F1]/20'}`}>
                  {service.type === 'API' ? <Code className="w-5 h-5 text-[#0066FF]" /> : <Code className="w-5 h-5 text-[#6366F1]" />}
                </div>
                <div>
                  <h3 className="text-[#F3F4F6] font-medium">{service.name}</h3>
                  <p className="text-[#9CA3AF] text-sm">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  service.type === 'API' ? 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30' : 'bg-[#6366F1]/20 text-[#6366F1] border-purple-500/30'
                }`}>
                  {service.type}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#2A354D] text-[#D1D5DB]">
                  {service.category}
                </span>
                {expandedService === service.id ? <ChevronDown className="w-5 h-5 text-[#9CA3AF]" /> : <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />}
              </div>
            </div>

            {expandedService === service.id && (
              <div className="border-t border-[#2A354D] p-6 space-y-6">
                <div>
                  <h4 className="text-[#F3F4F6] font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    参数说明
                  </h4>
                  <div className="bg-[#181F32] rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#2A354D]/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">参数名</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">类型</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">必填</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[#9CA3AF]">描述</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2A354D]">
                        {service.params.map((param, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm text-[#F3F4F6] font-mono">{param.name}</td>
                            <td className="px-4 py-2 text-sm text-[#D1D5DB]">{param.type}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs ${param.required ? 'bg-[#FF3B30]/20 text-[#FF3B30]' : 'bg-[#00C853]/20 text-[#00C853]'}`}>
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

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[#F3F4F6] font-medium flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      调用示例
                    </h4>
                    <button
                      onClick={() => handleCopy(service.example)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg text-sm transition-colors"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-[#00C853]" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制代码'}
                    </button>
                  </div>
                  <pre className="bg-[#111625] border border-[#2A354D] rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-[#00C853] font-mono">{service.example}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
