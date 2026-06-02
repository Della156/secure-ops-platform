'use client';

import React, { useState } from 'react';
import { Search, BookOpen, Tag, FileText, ChevronRight } from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  date: string;
}

const mockCases: CaseItem[] = [
  { id: 'CASE-001', title: '2026年Q1安全策略演练', category: '策略验证', tags: ['安全策略', '演练'], summary: '验证了新安全策略的有效性，发现2个配置问题', date: '2026-03-15' },
  { id: 'CASE-002', title: '备份恢复演练总结', category: '灾难恢复', tags: ['备份', '恢复', '演练'], summary: '成功验证了备份恢复流程，恢复时间符合预期', date: '2026-02-20' },
  { id: 'CASE-003', title: '应急响应演练复盘', category: '应急响应', tags: ['应急', '响应'], summary: '发现响应时间过长问题，已优化流程', date: '2026-01-10' },
];

interface ProblemItem {
  id: string;
  problem: string;
  solution: string;
  status: 'resolved' | 'pending';
}

const mockProblems: ProblemItem[] = [
  { id: 'PRB-001', problem: '演练过程中网络延迟过高', solution: '优化网络配置，增加带宽', status: 'resolved' },
  { id: 'PRB-002', problem: '部分设备响应超时', solution: '检查设备健康状态', status: 'pending' },
];

export function DrillKnowledgeBase() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'cases' | 'experience' | 'problems'>('cases');

  const filteredCases = mockCases.filter(c => 
    !searchKeyword || c.title.includes(searchKeyword) || c.summary.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">演练知识库</h2>
        <p className="text-sm text-gray-400 mt-1">演练历史案例的存储、分类、检索，演练经验总结，演练问题库</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索案例..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="flex border-b border-[#2A354D]">
          <button 
            onClick={() => setActiveTab('cases')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'cases' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            历史案例
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'experience' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            经验总结
          </button>
          <button 
            onClick={() => setActiveTab('problems')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'problems' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Tag className="w-4 h-4 inline mr-2" />
            问题库
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'cases' && (
            <div className="space-y-4">
              {filteredCases.map((item) => (
                <div key={item.id} className="bg-[#111827] rounded-lg p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-medium">{item.title}</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.category}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{item.summary}</p>
                      <div className="flex items-center gap-2">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs rounded bg-[#2A354D] text-gray-400">{tag}</span>
                        ))}
                        <span className="text-xs text-gray-500 ml-auto">{item.date}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              ))}
              {filteredCases.length === 0 && <p className="text-gray-500 text-center py-8">暂无案例</p>}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="bg-[#111827] rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">演练经验总结</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    定期演练有助于发现系统潜在问题，建议每月至少进行一次全面演练
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    演练前应制定详细计划，明确演练目标和步骤
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    演练后及时复盘，总结经验教训，优化流程
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    关注演练耗时，持续优化执行效率
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="space-y-4">
              {mockProblems.map((item) => (
                <div key={item.id} className="bg-[#111827] rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{item.problem}</p>
                      <p className="text-sm text-gray-400">解决方案: {item.solution}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${item.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {item.status === 'resolved' ? '已解决' : '待处理'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}