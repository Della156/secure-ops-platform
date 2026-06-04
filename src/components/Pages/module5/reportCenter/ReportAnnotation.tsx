'use client';

import React, { useState } from 'react';
import {
  StickyNote, Plus, Edit3, Trash2, Save,
  User, Calendar, MessageSquare, Tag,
  ChevronRight, AlertTriangle
} from 'lucide-react';

interface Annotation {
  id: string;
  page: number;
  content: string;
  author: string;
  date: string;
  type: 'comment' | 'highlight' | 'note';
}

const annotations: Annotation[] = [
  { id: 'a1', page: 5, content: '此处数据需要核实，与上月报告数据不一致', author: '李工', date: '2026-06-02 10:30', type: 'comment' },
  { id: 'a2', page: 12, content: '建议增加威胁情报关联分析章节', author: '张工', date: '2026-06-02 09:15', type: 'note' },
  { id: 'a3', page: 20, content: '漏洞修复时间线需要补充', author: '王工', date: '2026-06-01 16:45', type: 'comment' },
];

function TypeBadge({ type }: { type: Annotation['type'] }) {
  const config = {
    comment: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '评论' },
    highlight: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '高亮' },
    note: { bg: 'bg-green-500/10', text: 'text-green-400', label: '笔记' },
  };
  const { bg, text, label } = config[type];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function ReportAnnotation() {
  const [newAnnotation, setNewAnnotation] = useState('');
  const [selectedType, setSelectedType] = useState<Annotation['type']>('comment');
  const [annotationsList, setAnnotationsList] = useState(annotations);

  const addAnnotation = () => {
    if (!newAnnotation.trim()) return;
    const newItem: Annotation = {
      id: `a${Date.now()}`,
      page: 1,
      content: newAnnotation,
      author: '当前用户',
      date: new Date().toLocaleString(),
      type: selectedType,
    };
    setAnnotationsList([newItem, ...annotationsList]);
    setNewAnnotation('');
  };

  const deleteAnnotation = (id: string) => {
    setAnnotationsList(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-yellow-400" />
            报告批注管理
          </h2>
          <p className="text-sm text-gray-400 mt-1">管理报告批注和评论，支持多人协作</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            保存批注
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-green-400" />
          添加新批注
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            {[
              { id: 'comment', label: '评论', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'highlight', label: '高亮', icon: <Tag className="w-4 h-4" /> },
              { id: 'note', label: '笔记', icon: <StickyNote className="w-4 h-4" /> },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as Annotation['type'])}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                  selectedType === type.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-[#111625] text-gray-400 hover:bg-[#20293F]'
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>
          <textarea
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="输入批注内容..."
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg p-3 resize-none focus:outline-none focus:border-blue-500"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">当前页: 第 1 页</span>
            </div>
            <button
              onClick={addAnnotation}
              disabled={!newAnnotation.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              添加批注
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">批注列表 ({annotationsList.length})</h3>
          <div className="space-y-3">
            {annotationsList.map((annotation) => (
              <div key={annotation.id} className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/30 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <TypeBadge type={annotation.type} />
                      <span className="text-xs text-gray-500">第 {annotation.page} 页</span>
                    </div>
                    <p className="text-sm text-white mt-2">{annotation.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {annotation.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {annotation.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-[#20293F] rounded" title="编辑">
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => deleteAnnotation(annotation.id)} className="p-2 hover:bg-red-500/20 rounded" title="删除">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">批注统计</h3>
            <div className="space-y-2">
              {[
                { label: '总批注', value: annotationsList.length },
                { label: '评论', value: annotationsList.filter(a => a.type === 'comment').length },
                { label: '笔记', value: annotationsList.filter(a => a.type === 'note').length },
                { label: '高亮', value: annotationsList.filter(a => a.type === 'highlight').length },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-400">{stat.label}</span>
                  <span className="text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">批注作者</h3>
            <div className="space-y-2">
              {[
                { name: '张工', count: 12, avatar: 'Z' },
                { name: '李工', count: 8, avatar: 'L' },
                { name: '王工', count: 5, avatar: 'W' },
              ].map((author, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                    {author.avatar}
                  </div>
                  <span className="text-xs text-gray-400 flex-1">{author.name}</span>
                  <span className="text-xs text-white">{author.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">批注趋势</h3>
            <div className="h-24 flex items-end gap-1">
              {[5, 8, 3, 12, 6, 9, 4].map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500/50 rounded-t"
                  style={{ height: `${(value / 12) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportAnnotation;