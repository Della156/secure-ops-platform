'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Folder, Tag, Filter, Palette } from 'lucide-react';

// 分类类型
interface Category {
  id: string;
  name: string;
  description: string;
  templateCount: number;
  color: string;
}

// 标签类型
interface TemplateTag {
  id: string;
  name: string;
  color: string;
  templateCount: number;
}

// 模板类型
interface Template {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  tags: string[];
}

// 模拟分类数据
const mockCategories: Category[] = [
  { id: 'CAT-001', name: '安全扫描', description: '各类安全扫描任务模板', templateCount: 5, color: '#ef4444' },
  { id: 'CAT-002', name: '数据备份', description: '数据库、文件备份任务', templateCount: 3, color: '#22c55e' },
  { id: 'CAT-003', name: '设备巡检', description: '网络设备、服务器巡检', templateCount: 4, color: '#3b82f6' },
  { id: 'CAT-004', name: '性能监控', description: '系统性能监控任务', templateCount: 2, color: '#f59e0b' },
];

// 模拟标签数据
const mockTags: TemplateTag[] = [
  { id: 'TAG-001', name: 'Web', color: '#3b82f6', templateCount: 3 },
  { id: 'TAG-002', name: '数据库', color: '#22c55e', templateCount: 4 },
  { id: 'TAG-003', name: '网络', color: '#8b5cf6', templateCount: 2 },
  { id: 'TAG-004', name: '自动化', color: '#f59e0b', templateCount: 5 },
  { id: 'TAG-005', name: '安全', color: '#ef4444', templateCount: 4 },
];

// 模拟模板数据
const mockTemplates: Template[] = [
  { id: 'TPL-001', name: 'Web应用安全扫描模板', description: '用于自动扫描Web应用的安全漏洞', categoryId: 'CAT-001', tags: ['TAG-001', 'TAG-005'] },
  { id: 'TPL-002', name: '数据库备份模板', description: '自动备份MySQL数据库', categoryId: 'CAT-002', tags: ['TAG-002', 'TAG-004'] },
  { id: 'TPL-003', name: '网络设备巡检模板', description: '定期巡检网络设备状态', categoryId: 'CAT-003', tags: ['TAG-003'] },
  { id: 'TPL-004', name: '服务器性能监控模板', description: '监控服务器CPU、内存、磁盘使用情况', categoryId: 'CAT-004', tags: ['TAG-004'] },
];

// 预设颜色
const presetColors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];

export function TemplateCategoryTag() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [tags, setTags] = useState<TemplateTag[]>(mockTags);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<TemplateTag | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({ name: '', description: '', color: '#3b82f6' });
  const [tagForm, setTagForm] = useState<Partial<TemplateTag>>({ name: '', color: '#3b82f6' });

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchSearch = !searchText || 
      template.name.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = !selectedCategory || template.categoryId === selectedCategory;
    const matchTags = selectedTags.length === 0 || selectedTags.some(tag => template.tags.includes(tag));
    return matchSearch && matchCategory && matchTags;
  });

  // 切换标签选择
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  // 保存分类
  const handleSaveCategory = () => {
    if (!categoryForm.name) return;

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryForm } as Category : c));
    } else {
      const newCategory: Category = {
        id: `CAT-${String(Date.now()).slice(-6)}`,
        name: categoryForm.name!,
        description: categoryForm.description || '',
        color: categoryForm.color || '#3b82f6',
        templateCount: 0,
      };
      setCategories([...categories, newCategory]);
    }
    setIsCategoryModalOpen(false);
  };

  // 删除分类
  const handleDeleteCategory = (id: string) => {
    if (confirm('确定要删除这个分类吗？')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // 保存标签
  const handleSaveTag = () => {
    if (!tagForm.name) return;

    if (editingTag) {
      setTags(tags.map(t => t.id === editingTag.id ? { ...t, ...tagForm } as TemplateTag : t));
    } else {
      const newTag: TemplateTag = {
        id: `TAG-${String(Date.now()).slice(-6)}`,
        name: tagForm.name!,
        color: tagForm.color || '#3b82f6',
        templateCount: 0,
      };
      setTags([...tags, newTag]);
    }
    setIsTagModalOpen(false);
  };

  // 删除标签
  const handleDeleteTag = (id: string) => {
    if (confirm('确定要删除这个标签吗？')) {
      setTags(tags.filter(t => t.id !== id));
    }
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">模板分类打标与检索</h1>
        <p className="text-[#9CA3AF]">管理模板分类、标签，以及组合筛选检索</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：分类和标签管理 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 分类管理 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
                <Folder className="w-5 h-5" />
                分类管理
              </h3>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: '', description: '', color: '#3b82f6' });
                  setIsCategoryModalOpen(true);
                }}
                className="p-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  !selectedCategory
                    ? 'bg-[#0066FF]/20 text-[#0066FF]'
                    : 'text-[#D1D5DB] hover:bg-[#181F32]'
                }`}
              >
                全部分类
              </button>
              {categories.map(category => (
                <div key={category.id} className="group">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-[#0066FF]/20 text-[#0066FF]'
                          : 'text-[#D1D5DB] hover:bg-[#181F32]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                        <span className="text-xs text-[#6B7280]">({category.templateCount})</span>
                      </div>
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setCategoryForm(category);
                          setIsCategoryModalOpen(true);
                        }}
                        className="p-1 text-[#6B7280] hover:text-[#D1D5DB]"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-[#6B7280] hover:text-[#FF3B30]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 标签管理 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
                <Tag className="w-5 h-5" />
                标签管理
              </h3>
              <button
                onClick={() => {
                  setEditingTag(null);
                  setTagForm({ name: '', color: '#3b82f6' });
                  setIsTagModalOpen(true);
                }}
                className="p-1.5 text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="group">
                  <button
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'ring-2 ring-offset-2 ring-offset-slate-900'
                        : ''
                    }`}
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color, borderColor: `${tag.color}30`, borderWidth: 1 }}
                  >
                    {tag.name}
                    <span className="text-xs opacity-70 ml-1">({tag.templateCount})</span>
                  </button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-1 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTag(tag);
                        setTagForm(tag);
                        setIsTagModalOpen(true);
                      }}
                      className="p-1 text-[#6B7280] hover:text-[#D1D5DB]"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTag(tag.id);
                      }}
                      className="p-1 text-[#6B7280] hover:text-[#FF3B30]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：模板检索 */}
        <div className="lg:col-span-3">
          {/* 搜索栏 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="搜索模板名称或描述..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#9CA3AF] text-sm">
                  筛选结果：{filteredTemplates.length} 个
                </span>
              </div>
            </div>
          </div>

          {/* 模板列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => {
              const category = categories.find(c => c.id === template.categoryId);
              const templateTags = tags.filter(t => template.tags.includes(t.id));
              
              return (
                <div key={template.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5 hover:border-[#2A354D] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#F3F4F6]">{template.name}</h3>
                    {category && (
                      <span className="px-2 py-1 rounded-full text-xs flex items-center gap-1" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                        {category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {templateTags.map(tag => (
                      <span key={tag.id} className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-12 text-center">
              <p className="text-[#6B7280]">没有找到匹配的模板</p>
            </div>
          )}
        </div>
      </div>

      {/* 分类模态框 */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingCategory ? '编辑分类' : '新增分类'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">分类名称</label>
                <input
                  type="text"
                  value={categoryForm.name || ''}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入分类名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">分类描述</label>
                <textarea
                  value={categoryForm.description || ''}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入分类描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  分类颜色
                </label>
                <div className="flex gap-2 flex-wrap">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setCategoryForm({ ...categoryForm, color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        categoryForm.color === color ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 标签模态框 */}
      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingTag ? '编辑标签' : '新增标签'}
              </h3>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">标签名称</label>
                <input
                  type="text"
                  value={tagForm.name || ''}
                  onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入标签名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  标签颜色
                </label>
                <div className="flex gap-2 flex-wrap">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setTagForm({ ...tagForm, color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        tagForm.color === color ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveTag}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
