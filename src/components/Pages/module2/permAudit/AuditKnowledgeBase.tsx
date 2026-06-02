'use client';

import React, { useState } from 'react';
import { Search, BookOpen, AlertCircle, Lightbulb, FileText } from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
}

const mockCases: CaseItem[] = [
  { id: 'CASE-001', title: '僵尸账号清理案例', category: '账号审计', summary: '清理了50个90天未登录的僵尸账号', date: '2026-05-15' },
  { id: 'CASE-002', title: '权限滥用案例分析', category: '权限审计', summary: '发现3起权限滥用事件，已处理', date: '2026-05-10' },
];

interface ProblemItem {
  id: string;
  problem: string;
  solution: string;
}

const mockProblems: ProblemItem[] = [
  { id: 'PRB-001', problem: '账号权限过大', solution: '最小权限原则，按需分配权限' },
  { id: 'PRB-002', problem: '僵尸账号未及时清理', solution: '定期审计，自动清理机制' },
];

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
}

const mockSuggestions: SuggestionItem[] = [
  { id: 'SUG-001', title: '定期权限审计', description: '建议每周进行一次全面权限审计' },
  { id: 'SUG-002', title: '权限审批流程', description: '建立严格的权限申请审批流程' },
];

export function AuditKnowledgeBase() {
  const [activeTab, setActiveTab] = useState<'cases' | 'problems' | 'suggestions'>('cases');
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">审计知识库</h2>
        <p className="text-sm text-gray-400 mt-1">审计历史案例、常见问题、整改建议的存储与检索</p>
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
            onClick={() => setActiveTab('problems')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'problems' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            常见问题
          </button>
          <button 
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'suggestions' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            整改建议
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {activeTab === 'cases' && (
            <div className="space-y-3">
              {mockCases.map((item) => (
                <div key={item.id} className="bg-[#111827] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">{item.title}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.category}</span>
                  </div>
                  <p className="text-sm text-gray-400">{item.summary}</p>
                  <span className="text-xs text-gray-500 mt-2">{item.date}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="space-y-3">
              {mockProblems.map((item) => (
                <div key={item.id} className="bg-[#111827] rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">{item.problem}</p>
                      <p className="text-sm text-gray-400">解决方案: {item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              {mockSuggestions.map((item) => (
                <div key={item.id} className="bg-[#111827] rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
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