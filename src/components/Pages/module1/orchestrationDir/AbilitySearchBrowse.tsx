'use client';

import React, { useState } from 'react';
import { Search, Grid, List, Eye, Code, Copy, Check, Tag, Filter, X } from 'lucide-react';

interface AbilityItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  inputParams: Array<{ name: string; type: string; required: boolean; description: string }>;
  outputParams: Array<{ name: string; type: string; description: string }>;
  exampleCode: string;
  usageCount: number;
  rating: number;
}

const mockData: AbilityItem[] = [
  {
    id: 'ABL-001',
    name: '防火墙规则扫描',
    category: '安全审计',
    tags: ['防火墙', '规则', '扫描'],
    description: '扫描防火墙配置，检测异常规则和潜在安全问题',
    author: '张三',
    createdAt: '2026-05-15',
    updatedAt: '2026-05-28',
    inputParams: [
      { name: 'deviceId', type: 'string', required: true, description: '防火墙设备ID' },
      { name: 'scanDepth', type: 'number', required: false, description: '扫描深度，默认1' }
    ],
    outputParams: [
      { name: 'scanReport', type: 'object', description: '扫描报告对象' },
      { name: 'riskCount', type: 'number', description: '风险数量' }
    ],
    exampleCode: `// 调用示例
const result = await executeAbility('ABL-001', {
  deviceId: 'FW-001',
  scanDepth: 2
});
console.log('风险数量:', result.riskCount);`,
    usageCount: 128,
    rating: 4.8
  },
  {
    id: 'ABL-002',
    name: '端口安全检查',
    category: '安全扫描',
    tags: ['端口', '扫描', '安全'],
    description: '检查目标主机开放端口，识别潜在安全风险',
    author: '李四',
    createdAt: '2026-05-10',
    updatedAt: '2026-05-25',
    inputParams: [
      { name: 'targetIp', type: 'string', required: true, description: '目标IP地址' },
      { name: 'portRange', type: 'string', required: false, description: '端口范围，默认1-65535' }
    ],
    outputParams: [
      { name: 'openPorts', type: 'array', description: '开放端口列表' },
      { name: 'vulnerabilities', type: 'array', description: '漏洞列表' }
    ],
    exampleCode: `// 调用示例
const result = await executeAbility('ABL-002', {
  targetIp: '192.168.1.100',
  portRange: '1-1000'
});`,
    usageCount: 256,
    rating: 4.9
  },
  {
    id: 'ABL-003',
    name: '日志分析',
    category: '数据分析',
    tags: ['日志', '分析', 'ELK'],
    description: '从ELK中提取安全日志进行分析和统计',
    author: '王五',
    createdAt: '2026-05-08',
    updatedAt: '2026-05-20',
    inputParams: [
      { name: 'timeRange', type: 'string', required: true, description: '时间范围' },
      { name: 'query', type: 'string', required: false, description: '查询条件' }
    ],
    outputParams: [
      { name: 'logs', type: 'array', description: '日志列表' },
      { name: 'statistics', type: 'object', description: '统计数据' }
    ],
    exampleCode: `// 调用示例
const result = await executeAbility('ABL-003', {
  timeRange: '24h',
  query: 'level:error'
});`,
    usageCount: 89,
    rating: 4.6
  },
  {
    id: 'ABL-004',
    name: '漏洞扫描',
    category: '漏洞管理',
    tags: ['漏洞', '扫描', 'CVE'],
    description: '基于CVE数据库扫描系统漏洞',
    author: '赵六',
    createdAt: '2026-05-05',
    updatedAt: '2026-05-22',
    inputParams: [
      { name: 'targets', type: 'array', required: true, description: '目标列表' },
      { name: 'severity', type: 'string', required: false, description: '严重程度筛选' }
    ],
    outputParams: [
      { name: 'vulnerabilities', type: 'array', description: '漏洞详情' },
      { name: 'summary', type: 'object', description: '扫描摘要' }
    ],
    exampleCode: `// 调用示例
const result = await executeAbility('ABL-004', {
  targets: ['192.168.1.0/24'],
  severity: 'high'
});`,
    usageCount: 312,
    rating: 4.95
  },
  {
    id: 'ABL-005',
    name: '配置备份',
    category: '设备管理',
    tags: ['备份', '配置', '设备'],
    description: '自动备份网络设备配置',
    author: '钱七',
    createdAt: '2026-05-01',
    updatedAt: '2026-05-18',
    inputParams: [
      { name: 'deviceIds', type: 'array', required: true, description: '设备ID列表' }
    ],
    outputParams: [
      { name: 'backupFiles', type: 'array', description: '备份文件列表' },
      { name: 'successCount', type: 'number', description: '成功数量' }
    ],
    exampleCode: `// 调用示例
const result = await executeAbility('ABL-005', {
  deviceIds: ['FW-001', 'SW-001', 'RT-001']
});`,
    usageCount: 167,
    rating: 4.7
  },
  {
    id: 'ABL-006',
    name: '性能监控',
    category: '监控',
    tags: ['性能', '监控', '指标'],
    description: '采集设备性能指标并生成监控报告',
    author: '孙八',
    createdAt: '2026-04-28',
    updatedAt: '2026-05-26',
    inputParams: [
      { name: 'deviceId', type: 'string', required: true, description: '设备ID' },
      { name: 'duration', type: 'number', required: false, description: '监控时长(分钟)' }
    ],
    outputParams: [
      { name: 'metrics', type: 'object', description: '性能指标' },
      { name: 'report', type: 'string', description: '监控报告' }
    ],
    exampleCode: `// 调用示例
const result = await executeAbility('ABL-006', {
  deviceId: 'FW-001',
  duration: 60
});`,
    usageCount: 98,
    rating: 4.5
  }
];

const categories = ['全部', '安全审计', '安全扫描', '数据分析', '漏洞管理', '设备管理', '监控'];
const allTags = ['防火墙', '规则', '扫描', '端口', '安全', '日志', '分析', 'ELK', '漏洞', 'CVE', '备份', '配置', '设备', '性能', '监控', '指标'];

export function AbilitySearchBrowse() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState<AbilityItem | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredData = mockData.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
    return matchSearch && matchCategory && matchTags;
  });

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleViewDetail = (item: AbilityItem) => {
    setSelectedAbility(item);
    setIsDetailModalOpen(true);
  };

  const handleCopyCode = () => {
    if (selectedAbility) {
      navigator.clipboard.writeText(selectedAbility.exampleCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">自动化能力可视化检索与浏览</h1>
        <p className="text-slate-400">浏览、搜索和使用可用的自动化能力</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索能力名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">分类</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">标签筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleViewDetail(item)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                  <span className="text-xs text-slate-400">{item.category}</span>
                </div>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                  {item.id}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{item.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span>使用 {item.usageCount} 次</span>
                  <span>⭐ {item.rating}</span>
                </div>
                <span>{item.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">标签</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">使用次数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">评分</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">更新时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 text-slate-500 text-xs">+{item.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.usageCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">⭐ {item.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.updatedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewDetail(item); }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-500 text-lg">未找到匹配的能力</p>
          <p className="text-slate-600 text-sm mt-2">请尝试调整搜索条件或筛选标签</p>
        </div>
      )}

      {isDetailModalOpen && selectedAbility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{selectedAbility.name}</h3>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                  {selectedAbility.id}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm">
                  {selectedAbility.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAbility.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-slate-300 mb-6">{selectedAbility.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{selectedAbility.usageCount}</div>
                  <div className="text-sm text-slate-400">使用次数</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">⭐ {selectedAbility.rating}</div>
                  <div className="text-sm text-slate-400">评分</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{selectedAbility.author}</div>
                  <div className="text-sm text-slate-400">作者</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  输入参数
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
                      {selectedAbility.inputParams.map((param, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-white font-mono">{param.name}</td>
                          <td className="px-4 py-2 text-sm text-blue-400 font-mono">{param.type}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs ${param.required ? 'bg-red-500/20 text-red-400' : 'bg-slate-600 text-slate-300'}`}>
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

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  输出参数
                </h4>
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">参数名</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">类型</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {selectedAbility.outputParams.map((param, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-white font-mono">{param.name}</td>
                          <td className="px-4 py-2 text-sm text-blue-400 font-mono">{param.type}</td>
                          <td className="px-4 py-2 text-sm text-slate-400">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    调用示例
                  </h4>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制代码'}
                  </button>
                </div>
                <pre className="bg-slate-800 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto">
                  <code>{selectedAbility.exampleCode}</code>
                </pre>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
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
