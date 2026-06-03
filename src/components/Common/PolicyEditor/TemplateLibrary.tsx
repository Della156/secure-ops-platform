'use client';

import React, { useState } from 'react';
import { BookOpen, Download, Eye, Sparkles, FileText, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/Common/StatusBadge';
import type { PolicyTemplate } from './types';

interface TemplateLibraryProps {
  sources: string[];
  templates: PolicyTemplate[];
}

/**
 * 策略模板库：预置策略模板（一键套用）
 */
export function TemplateLibrary({ sources, templates }: TemplateLibraryProps) {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const filtered = templates.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchSource = !sourceFilter || t.source === sourceFilter;
    const matchCategory = !categoryFilter || t.category === categoryFilter;
    return matchSearch && matchSource && matchCategory;
  });

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Input
              placeholder="搜索模板名称..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-40">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
            >
              <option value="">全部来源</option>
              {sources.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
            >
              <option value="">全部分类</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1" />新建模板
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} hover>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">{t.name}</h3>
                  <p className="text-xs text-slate-500">{t.source}</p>
                </div>
              </div>
              {t.isCustom && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                  自定义
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-3 line-clamp-2">{t.description}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {t.itemCount} 项检查
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#111625] text-slate-400">{t.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" className="flex-1">
                <Sparkles className="w-3.5 h-3.5 mr-1" />一键套用
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
