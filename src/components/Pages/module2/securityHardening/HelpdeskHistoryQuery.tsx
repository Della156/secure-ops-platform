'use client';

import React, { useState } from 'react';
import { Search, Calendar, Phone, Star, MessageSquare } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  customer: string;
  status: 'resolved' | 'closed';
  satisfaction: number;
  date: string;
  messages: { role: 'user' | 'agent'; content: string }[];
}

const mockHistory: HistoryItem[] = [
  { 
    id: 'HD-HIST-001', 
    title: '系统登录异常', 
    customer: '用户A', 
    status: 'resolved',
    satisfaction: 5,
    date: '2026-06-02 10:30:00',
    messages: [
      { role: 'user', content: '我无法登录系统，一直提示密码错误' },
      { role: 'agent', content: '请尝试使用找回密码功能重置密码' },
      { role: 'user', content: '已经找回密码，现在可以登录了，谢谢！' },
    ]
  },
  { 
    id: 'HD-HIST-002', 
    title: '权限申请审批', 
    customer: '用户B', 
    status: 'closed',
    satisfaction: 4,
    date: '2026-06-01 15:20:00',
    messages: [
      { role: 'user', content: '申请访问服务器日志权限' },
      { role: 'agent', content: '已收到您的申请，将在1个工作日内处理' },
    ]
  },
];

export function HelpdeskHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter(item => 
    !searchKeyword || item.title.includes(searchKeyword) || item.customer.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全客服历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史客服任务记录查询，对话详情查看，满意度评价查询</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索标题或客户..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">历史记录列表</h3>
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedItem?.id === item.id 
                    ? 'bg-blue-600/20 border border-blue-500/50' 
                    : 'bg-[#111827] hover:bg-[#2A354D]/50'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium text-sm">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < item.satisfaction ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{item.customer}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">对话详情</h3>
          
          {selectedItem ? (
            <div className="space-y-4">
              <div className="bg-[#111827] rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{selectedItem.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    selectedItem.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {selectedItem.status === 'resolved' ? '已解决' : '已关闭'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {selectedItem.messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <MessageSquare className={`w-4 h-4 ${msg.role === 'user' ? 'text-blue-400' : 'text-green-400'}`} />
                      <div className={`px-3 py-2 rounded-lg ${
                        msg.role === 'user' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                      }`}>
                        <p className="text-xs text-gray-400 mb-1">{msg.role === 'user' ? '用户' : '客服'}</p>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Phone className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">选择记录查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}