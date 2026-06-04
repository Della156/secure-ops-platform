'use client';

import React, { useState } from 'react';
import {
  CheckSquare, Square, Search, Filter, Plus,
  Calendar, Clock, AlertCircle, Tag,
  ChevronDown, ChevronRight, MoreVertical,
  ArrowRight, Trash2, Edit3
} from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
  completed: boolean;
  assignee: string;
}

const todoItems: TodoItem[] = [
  { id: 't1', title: '处理高危漏洞告警', description: '修复WEB-APP-01上的Log4j漏洞', priority: 'high', dueDate: '今天', category: '安全', completed: false, assignee: '张工' },
  { id: 't2', title: '完成周安全报告', description: '整理本周安全事件和处置情况', priority: 'medium', dueDate: '明天', category: '报告', completed: false, assignee: '李工' },
  { id: 't3', title: '审核防火墙规则变更', description: '审批新增的防火墙规则申请', priority: 'high', dueDate: '本周', category: '审核', completed: false, assignee: '王工' },
  { id: 't4', title: '更新威胁情报库', description: '同步最新的威胁情报数据', priority: 'medium', dueDate: '本周', category: '情报', completed: true, assignee: '赵工' },
  { id: 't5', title: '配置SIEM告警规则', description: '优化告警规则减少误报', priority: 'low', dueDate: '下周', category: '配置', completed: false, assignee: '张工' },
];

function PriorityBadge({ priority }: { priority: TodoItem['priority'] }) {
  const config = {
    high: { bg: 'bg-red-500/10', text: 'text-red-400', label: '高优先级' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中优先级' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '低优先级' },
  };
  const { bg, text, label } = config[priority];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    '安全': 'bg-red-500/10 text-red-400',
    '报告': 'bg-blue-500/10 text-blue-400',
    '审核': 'bg-yellow-500/10 text-yellow-400',
    '情报': 'bg-purple-500/10 text-purple-400',
    '配置': 'bg-green-500/10 text-green-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${colors[category] || 'bg-gray-500/10 text-gray-400'}`}>
      {category}
    </span>
  );
}

export function MyTodos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [todos, setTodos] = useState(todoItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    const matchSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            我的待办
          </h2>
          <p className="text-sm text-gray-400 mt-1">管理和追踪您的待办任务</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            新建待办
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '总待办', value: stats.total, icon: <CheckSquare className="w-4 h-4" />, color: 'blue' },
          { label: '已完成', value: stats.completed, icon: <Square className="w-4 h-4" />, color: 'green' },
          { label: '待处理', value: stats.pending, icon: <Clock className="w-4 h-4" />, color: 'orange' },
          { label: '高优先级', value: stats.highPriority, icon: <AlertCircle className="w-4 h-4" />, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索待办任务..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="all">全部优先级</option>
                <option value="high">高优先级</option>
                <option value="medium">中优先级</option>
                <option value="low">低优先级</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredTodos.map((todo) => (
            <div key={todo.id} className="p-4 hover:bg-[#111625]">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    todo.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-500 hover:border-blue-500'
                  }`}
                >
                  {todo.completed && <CheckSquare className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {todo.title}
                      </h3>
                      <p className={`text-xs mt-1 ${todo.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {todo.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-[#20293F] rounded">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === todo.id ? null : todo.id)}
                        className="p-1 hover:bg-[#20293F] rounded"
                      >
                        {expandedId === todo.id ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <PriorityBadge priority={todo.priority} />
                    <CategoryBadge category={todo.category} />
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {todo.dueDate}
                    </span>
                    <span className="text-xs text-gray-500">{todo.assignee}</span>
                  </div>
                </div>
              </div>

              {expandedId === todo.id && (
                <div className="ml-9 mt-4 pt-4 border-t border-[#2A354D]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">截止日期</span>
                      <div className="text-white mt-1">2026-06-05</div>
                    </div>
                    <div>
                      <span className="text-gray-500">创建时间</span>
                      <div className="text-white mt-1">2026-06-01 10:30</div>
                    </div>
                    <div>
                      <span className="text-gray-500">关联任务</span>
                      <div className="text-white mt-1">漏洞修复工单 #1234</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1">
                      标记完成 <ArrowRight className="w-3 h-3" />
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-[#20293F] hover:bg-[#2A354D] text-gray-300 rounded">
                      编辑任务
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredTodos.length} 条待办</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTodos;