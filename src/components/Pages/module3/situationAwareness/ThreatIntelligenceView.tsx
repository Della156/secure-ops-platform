'use client';

import { useState } from 'react';
import { Search, Filter, AlertTriangle, Clock, ExternalLink, Shield } from 'lucide-react';

const mockThreats = [
  { id: 'TI-001', name: 'APT攻击活动', source: '威胁情报平台', severity: 'high', time: '10分钟前', description: '检测到针对金融行业的APT攻击活动' },
  { id: 'TI-002', name: 'CVE-2024-3094', source: 'NVD', severity: 'high', time: '30分钟前', description: 'OpenSSL高危漏洞，建议紧急修复' },
  { id: 'TI-003', name: '新恶意软件变种', source: '病毒库', severity: 'medium', time: '1小时前', description: '发现新型勒索软件变种' },
  { id: 'TI-004', name: 'DDoS攻击预警', source: '流量分析', severity: 'medium', time: '2小时前', description: '检测到潜在DDoS攻击准备活动' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'low': return 'bg-green-500/20 text-green-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export function ThreatIntelligenceView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredThreats = mockThreats.filter(threat => {
    const matchesSearch = threat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || threat.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">威胁情报视图</h1>
          <p className="text-slate-400 mt-1">实时获取威胁情报，提前预警安全风险</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索威胁情报..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部等级</option>
            <option value="high">高危</option>
            <option value="medium">中危</option>
            <option value="low">低危</option>
          </select>
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Filter className="w-3.5 h-3.5" />筛选
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">威胁名称</th>
              <th className="text-left px-4 py-2.5">来源</th>
              <th className="text-left px-4 py-2.5">严重程度</th>
              <th className="text-left px-4 py-2.5">更新时间</th>
              <th className="text-left px-4 py-2.5">描述</th>
              <th className="text-right px-4 py-2.5">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredThreats.map(threat => (
              <tr key={threat.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                <td className="px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    {threat.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{threat.source}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(threat.severity)}`}>
                    {threat.severity === 'high' ? '高危' : threat.severity === 'medium' ? '中危' : '低危'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />{threat.time}
                </td>
                <td className="px-4 py-3 text-slate-300 text-xs max-w-xs truncate">{threat.description}</td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 px-2 py-1 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded">
                    <ExternalLink className="w-3 h-3" />详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {filteredThreats.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300" disabled>‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}