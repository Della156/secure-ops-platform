'use client';

import React, { useState } from 'react';
import { Search, Filter, Grid, List, ChevronRight, Star, Download, Bookmark } from 'lucide-react';

interface Ability {
  id: string;
  name: string;
  category: string;
  provider: string;
  rating: number;
  downloads: number;
  description: string;
  tags: string[];
}

const mockData: Ability[] = [
  { id: 'ABL-001', name: '防火墙规则同步', category: '网络安全', provider: 'Cisco', rating: 4.8, downloads: 2345, description: '自动化同步防火墙规则配置，支持多种厂商设备', tags: ['防火墙', '配置', '同步'] },
  { id: 'ABL-002', name: '威胁情报查询', category: '威胁情报', provider: 'IBM X-Force', rating: 4.6, downloads: 1876, description: '查询外部威胁情报源，获取IOC信息', tags: ['威胁情报', 'IOC', '查询'] },
  { id: 'ABL-003', name: '漏洞扫描', category: '漏洞检测', provider: 'Nessus', rating: 4.7, downloads: 3124, description: '自动化漏洞扫描，生成详细报告', tags: ['漏洞', '扫描', '安全'] },
  { id: 'ABL-004', name: '日志分析', category: '日志分析', provider: 'Splunk', rating: 4.9, downloads: 4567, description: '智能分析安全日志，识别异常行为', tags: ['日志', '分析', 'SIEM'] },
  { id: 'ABL-005', name: '资产发现', category: '资产管理', provider: 'Qualys', rating: 4.5, downloads: 1543, description: '自动发现网络中的资产设备', tags: ['资产', '发现', '扫描'] },
  { id: 'ABL-006', name: '安全策略评估', category: '合规审计', provider: 'Palo Alto', rating: 4.4, downloads: 987, description: '评估安全策略合规性', tags: ['策略', '合规', '评估'] },
];

export function AbilitySearchBrowse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const categories = ['全部', ...new Set(mockData.map(item => item.category))];

  const filteredData = mockData.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !filterCategory || filterCategory === '全部' || item.category === filterCategory;
    return matchQuery && matchCategory;
  });

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">能力搜索与浏览</h1>
        <p className="text-[#9CA3AF]">搜索和浏览可编排的安全能力</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索能力名称、描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6B7280]" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'bg-[#181F32] text-[#9CA3AF] hover:text-[#F3F4F6]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'bg-[#181F32] text-[#9CA3AF] hover:text-[#F3F4F6]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredData.map((item) => (
          <div key={item.id} className={`bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden hover:border-[#0066FF]/50 transition-colors ${viewMode === 'list' ? 'flex' : ''}`}>
            <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[#F3F4F6] font-medium mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <span className="px-2 py-0.5 bg-[#181F32] rounded text-xs">{item.category}</span>
                    <span className="text-[#2A354D]">|</span>
                    <span>{item.provider}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className={`p-2 rounded-lg transition-colors ${bookmarked.has(item.id) ? 'bg-[#FF9100]/20 text-[#FF9100]' : 'bg-[#181F32] text-[#6B7280] hover:text-[#FF9100]'}`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked.has(item.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{item.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#181F32] rounded text-xs text-[#D1D5DB]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#FF9100] fill-[#FF9100]" />
                    <span className="text-[#F3F4F6]">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#9CA3AF]">
                    <Download className="w-4 h-4" />
                    <span>{item.downloads}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-sm text-[#0066FF] hover:text-[#4D94FF]">
                  查看详情
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full bg-[#20293F] border border-[#2A354D] rounded-xl px-6 py-12 text-center">
            <Search className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
            <p className="text-[#6B7280]">未找到匹配的能力</p>
          </div>
        )}
      </div>
    </div>
  );
}