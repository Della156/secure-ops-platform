'use client';

import React, { useState } from 'react';
import {
  LayoutTemplate, Plus, Edit3, Trash2, Copy,
  Download, Upload, ChevronRight, Search, Filter,
  CheckCircle2, Clock, User, FileText
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  author: string;
  date: string;
  usage: number;
  status: 'active' | 'inactive';
}

const templates: Template[] = [
  { id: 't1', name: '安全态势分析报告模板', description: '用于月度/季度安全态势分析报告', author: '系统', date: '2026-01-01', usage: 156, status: 'active' },
  { id: 't2', name: '安全审计报告模板', description: '用于内部安全审计报告', author: '张工', date: '2026-02-15', usage: 89, status: 'active' },
  { id: 't3', name: '漏洞扫描报告模板', description: '用于漏洞扫描结果报告', author: '李工', date: '2026-03-01', usage: 124, status: 'active' },
  { id: 't4', name: '事件调查报告模板', description: '用于安全事件调查报告', author: '系统', date: '2026-01-01', usage: 45, status: 'inactive' },
  { id: 't5', name: '合规检查报告模板', description: '用于合规检查报告', author: '王工', date: '2026-04-01', usage: 67, status: 'active' },
];

function StatusBadge({ status }: { status: Template['status'] }) {
  const config = {
    active: { bg: 'bg-green-500/10', text: 'text-green-400', label: '启用' },
    inactive: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: '禁用' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function ReportTemplateManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templatesList, setTemplatesList] = useState(templates);

  const filteredTemplates = templatesList.filter(template => {
    const matchSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const copyTemplate = (id: string) => {
    const template = templatesList.find(t => t.id === id);
    if (template) {
      const newTemplate: Template = {
        ...template,
        id: `t${Date.now()}`,
        name: `${template.name} (副本)`,
        author: '当前用户',
        date: new Date().toLocaleDateString(),
        usage: 0,
      };
      setTemplatesList([newTemplate, ...templatesList]);
    }
  };

  const deleteTemplate = (id: string) => {
    setTemplatesList(prev => prev.filter(t => t.id !== id));
  };

  const stats = {
    total: templatesList.length,
    active: templatesList.filter(t => t.status === 'active').length,
    usage: templatesList.reduce((acc, t) => acc + t.usage, 0),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-purple-400" />
            报告模板管理
          </h2>
          <p className="text-sm text-gray-400 mt-1">管理和维护报告模板，支持自定义和共享</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            导入模板
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            新建模板
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '模板总数', value: stats.total, icon: <LayoutTemplate className="w-4 h-4" />, color: 'purple' },
          { label: '启用模板', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
          { label: '总使用次数', value: stats.usage, icon: <Download className="w-4 h-4" />, color: 'blue' },
          { label: '平均使用', value: Math.round(stats.usage / stats.total), icon: <Clock className="w-4 h-4" />, color: 'orange' },
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

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">全部状态</option>
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/30 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-medium text-white">{template.name}</h3>
                    <StatusBadge status={template.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {template.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.date}
                    </span>
                    <span>使用 {template.usage} 次</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-[#20293F] rounded" title="复制模板">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-[#20293F] rounded" title="编辑模板">
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteTemplate(template.id)} className="p-2 hover:bg-red-500/20 rounded" title="删除模板">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">模板分类</h3>
          <div className="space-y-2">
            {[
              { name: '安全态势', count: 3 },
              { name: '审计报告', count: 2 },
              { name: '漏洞报告', count: 2 },
              { name: '事件报告', count: 1 },
              { name: '合规报告', count: 2 },
            ].map((cat, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {cat.name}
                <div className="flex items-center gap-2">
                  <span>{cat.count} 个</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">快速操作</h3>
          <div className="space-y-2">
            {[
              { label: '创建空白模板', icon: <Plus className="w-4 h-4" /> },
              { label: '从现有报告创建模板', icon: <Copy className="w-4 h-4" /> },
              { label: '导入外部模板', icon: <Upload className="w-4 h-4" /> },
              { label: '导出所有模板', icon: <Download className="w-4 h-4" /> },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center gap-3 py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                <span className="text-blue-400">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportTemplateManagement;