'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Tag, FolderOpen, Code, BookOpen, Copy, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

interface CommandService {
  id: string;
  name: string;
  type: string;
  description: string;
  params: { name: string; type: string; required: boolean; description: string }[];
  example: string;
  category: string;
}

const mockServices: CommandService[] = [
  {
    id: 'cmd-1',
    name: '系统信息检查',
    type: 'Command',
    description: '获取Linux系统的基本信息',
    category: '系统管理',
    params: [
      { name: 'detail', type: 'boolean', required: false, description: '是否显示详细信息' },
    ],
    example: '# 基本信息检查\nuname -a\n\n# 详细系统信息\ncat /etc/os-release\nlscpu'
  },
  {
    id: 'cmd-2',
    name: '进程管理',
    type: 'Command',
    description: '查看和管理系统进程',
    category: '进程管理',
    params: [
      { name: 'filter', type: 'string', required: false, description: '进程名称过滤' },
    ],
    example: '# 查看所有进程\nps aux\n\n# 查看特定进程\nps aux | grep nginx\n\n# 实时进程监控\ntop'
  },
  {
    id: 'cmd-3',
    name: '磁盘空间检查',
    type: 'Command',
    description: '检查磁盘使用情况',
    category: '存储管理',
    params: [
      { name: 'path', type: 'string', required: false, description: '指定路径，默认为根目录' },
    ],
    example: '# 查看磁盘使用情况\ndf -h\n\n# 查看目录大小\ndu -sh /var/log\n\n# 找出大文件\nfind / -type f -size +100M'
  },
];

export function HostCommandView() {
  const [services, setServices] = useState<CommandService[]>(mockServices);
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
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">主机可用命令视图</h1>
        <p className="text-slate-400">浏览和查看主机管理常用命令</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索命令..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div
              className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${service.type === 'Command' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                  <Code className={`w-5 h-5 ${service.type === 'Command' ? 'text-purple-400' : 'text-blue-400'}`} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{service.name}</h3>
                  <p className="text-slate-400 text-sm">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${service.type === 'Command' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                  {service.type}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                  {service.category}
                </span>
                {expandedService === service.id ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
              </div>
            </div>

            {expandedService === service.id && (
              <div className="border-t border-slate-800 p-6 space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    参数说明
                  </h4>
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">参数名</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">类型</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">必填</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">描述</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {service.params.map((param, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm text-white font-mono">{param.name}</td>
                            <td className="px-4 py-2 text-sm text-slate-300">{param.type}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs ${param.required ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {param.required ? '是' : '否'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-slate-400">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      使用示例
                    </h4>
                    <button
                      onClick={() => handleCopy(service.example)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制代码'}
                    </button>
                  </div>
                  <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-green-400 font-mono">{service.example}</code>
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
