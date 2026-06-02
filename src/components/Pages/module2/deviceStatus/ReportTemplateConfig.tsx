'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Copy, Eye, Settings, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  indicators: string[];
  chartTypes: string[];
  layoutStyle: string;
  status: 'enabled' | 'disabled';
  usageCount: number;
  createdBy: string;
  createTime: string;
  updateTime: string;
}

const mockData: ReportTemplate[] = [
  { id: 'TPL-001', name: '设备运行状态周报模板', type: '运行状态', description: '每周设备运行状态汇总报告模板，包含健康度评分、异常统计等', indicators: ['设备总数', '正常运行率', 'CPU平均使用率', '内存平均使用率', '异常告警数'], chartTypes: ['折线图', '柱状图', '饼图'], layoutStyle: '标准布局', status: 'enabled', usageCount: 52, createdBy: 'admin', createTime: '2026-01-15 10:00:00', updateTime: '2026-05-20 14:30:00' },
  { id: 'TPL-002', name: '安全检查日报模板', type: '安全检查', description: '每日安全检查结果汇总模板', indicators: ['检查项数', '合规率', '高危问题数', '中危问题数', '低危问题数'], chartTypes: ['柱状图', '饼图'], layoutStyle: '紧凑布局', status: 'enabled', usageCount: 180, createdBy: 'admin', createTime: '2026-02-01 09:00:00', updateTime: '2026-04-15 11:20:00' },
  { id: 'TPL-003', name: '基线合规月度报告', type: '基线检查', description: '月度基线合规性检查报告模板', indicators: ['基线项总数', '合规率', '不合规项数', '已整改数', '整改率'], chartTypes: ['折线图', '饼图', '雷达图'], layoutStyle: '详细布局', status: 'enabled', usageCount: 12, createdBy: 'system', createTime: '2026-03-01 00:00:00', updateTime: '2026-05-01 08:00:00' },
  { id: 'TPL-004', name: '性能监控报告模板', type: '性能监控', description: '系统性能监控报告模板', indicators: ['CPU峰值', '内存峰值', '磁盘IO', '网络吞吐', '响应时间'], chartTypes: ['折线图', '面积图'], layoutStyle: '图表为主', status: 'disabled', usageCount: 0, createdBy: 'admin', createTime: '2026-04-10 15:00:00', updateTime: '2026-04-10 15:00:00' },
  { id: 'TPL-005', name: '综合运维报告模板', type: '综合报告', description: '综合性运维报告模板，涵盖各项指标', indicators: ['运行状态', '安全检查', '性能指标', '告警统计', '变更记录'], chartTypes: ['仪表盘', '折线图', '柱状图', '饼图'], layoutStyle: '综合仪表盘', status: 'enabled', usageCount: 8, createdBy: 'admin', createTime: '2026-05-05 10:00:00', updateTime: '2026-05-25 16:45:00' },
];

export function ReportTemplateConfig() {
  const [data, setData] = useState<ReportTemplate[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const toast = useToast();
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('运行状态');
  const [formLayout, setFormLayout] = useState('标准布局');
  const [formDesc, setFormDesc] = useState('');
  const [formIndicators, setFormIndicators] = useState('');
  const [formCharts, setFormCharts] = useState<string[]>([]);

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.description.includes(searchKeyword);
    const matchType = !filterType || d.type === filterType;
    return matchKeyword && matchType;
  });

  const stats = {
    total: data.length,
    enabled: data.filter(d => d.status === 'enabled').length,
    totalUsage: data.reduce((sum, d) => sum + d.usageCount, 0),
  };

  const handleToggle = (template: ReportTemplate) => {
    setData(prev => prev.map(t => t.id === template.id ? { ...t, status: t.status === 'enabled' ? 'disabled' : 'enabled' } : t));
  };

  const handleDelete = (template: ReportTemplate) => {
    setData(prev => prev.filter(t => t.id !== template.id));
    toast.success(`已删除模板 "${template.name}"`);
  };

  const handleEdit = (template: ReportTemplate) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormType(template.type);
    setFormLayout(template.layoutStyle);
    setFormDesc(template.description);
    setFormIndicators(template.indicators.join(', '));
    setFormCharts(template.chartTypes);
    setShowModal(true);
  };

  const handleCopy = (template: ReportTemplate) => {
    const newTemplate = { ...template, id: `TPL-${Date.now()}`, name: `${template.name} (副本)`, usageCount: 0, createTime: new Date().toLocaleString(), updateTime: new Date().toLocaleString() };
    setData(prev => [...prev, newTemplate]);
    toast.success(`已复制模板 "${template.name}"`);
  };

  const handleSaveModal = () => {
    if (!formName.trim()) {
      toast.warning('请输入模板名称');
      return;
    }
    const chartTypes = formCharts.length > 0 ? formCharts : ['折线图'];
    const indicators = formIndicators.split(',').map(s => s.trim()).filter(Boolean);
    if (indicators.length === 0) {
      toast.warning('请至少输入一个展示指标');
      return;
    }
    if (editingTemplate) {
      setData(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, name: formName, type: formType, layoutStyle: formLayout, description: formDesc, indicators, chartTypes, updateTime: new Date().toLocaleString() }
          : t
      ));
      toast.success('模板已更新');
    } else {
      const newTemplate: ReportTemplate = {
        id: `TPL-${Date.now()}`,
        name: formName,
        type: formType,
        description: formDesc,
        indicators,
        chartTypes,
        layoutStyle: formLayout,
        status: 'enabled',
        usageCount: 0,
        createdBy: 'admin',
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
      };
      setData(prev => [...prev, newTemplate]);
      toast.success('模板已创建');
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">报告模板自定义配置</h2>
        <p className="text-sm text-gray-400 mt-1">配置报告模板，可自定义展示指标、图表类型和排版样式</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">模板总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">已启用模板</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.enabled}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">累计使用次数</p>
          <p className="text-2xl font-semibold text-blue-400 mt-1">{stats.totalUsage}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索模板名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部类型</option>
              <option value="运行状态">运行状态</option>
              <option value="安全检查">安全检查</option>
              <option value="基线检查">基线检查</option>
              <option value="性能监控">性能监控</option>
              <option value="综合报告">综合报告</option>
            </select>
          </div>
          <button
            onClick={() => { 
              setEditingTemplate(null); 
              setFormName('');
              setFormType('运行状态');
              setFormLayout('标准布局');
              setFormDesc('');
              setFormIndicators('');
              setFormCharts([]);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增模板
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">模板名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">展示指标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">图表类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">布局样式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">使用次数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">更新时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((template) => (
                <tr key={template.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{template.description.substring(0, 30)}...</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-400">{template.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {template.indicators.slice(0, 3).map((ind, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-[#111827] text-gray-300 rounded">{ind}</span>
                      ))}
                      {template.indicators.length > 3 && <span className="px-2 py-0.5 text-xs text-gray-500">+{template.indicators.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {template.chartTypes.map((chart, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">{chart}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{template.layoutStyle}</td>
                  <td className="px-4 py-3 text-sm text-white">{template.usageCount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${template.status === 'enabled' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {template.status === 'enabled' ? '启用' : '停用'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{template.updateTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(template)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="编辑">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleCopy(template)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="复制">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggle(template)} className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors" title={template.status === 'enabled' ? '禁用' : '启用'}>
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(template)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-[600px] max-w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{editingTemplate ? '编辑报告模板' : '新增报告模板'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">模板名称</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">模板类型</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>运行状态</option>
                    <option>安全检查</option>
                    <option>基线检查</option>
                    <option>性能监控</option>
                    <option>综合报告</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">布局样式</label>
                  <select value={formLayout} onChange={(e) => setFormLayout(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>标准布局</option>
                    <option>紧凑布局</option>
                    <option>详细布局</option>
                    <option>图表为主</option>
                    <option>综合仪表盘</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">模板描述</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">展示指标（逗号分隔）</label>
                <input type="text" value={formIndicators} onChange={(e) => setFormIndicators(e.target.value)} placeholder="如: 设备总数, CPU使用率, 内存使用率" className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">图表类型</label>
                <div className="flex flex-wrap gap-2">
                  {['折线图', '柱状图', '饼图', '面积图', '雷达图', '仪表盘'].map(chart => (
                    <label key={chart} className="flex items-center gap-2 px-3 py-2 bg-[#111827] rounded-lg cursor-pointer hover:bg-[#2A354D]">
                      <input type="checkbox" checked={formCharts.includes(chart)} onChange={(e) => { setFormCharts(prev => e.target.checked ? [...prev, chart] : prev.filter(c => c !== chart)); }} className="w-4 h-4 rounded border-gray-500 bg-[#111827] text-blue-500" />
                      <span className="text-white text-sm">{chart}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">取消</button>
              <button onClick={handleSaveModal} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
      {toast.ToastContainer()}
    </div>
  );
}
