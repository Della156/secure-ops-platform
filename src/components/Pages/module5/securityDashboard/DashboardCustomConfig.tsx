'use client';

import React, { useState, useRef } from 'react';
import {
  Save, RotateCcw, Eye, Plus, Trash2, Settings, Grid3x3, Move,
  BarChart3, PieChart, Activity, AlertCircle, Server, Shield, Target,
  GripVertical, Maximize2, Download, Copy, ChevronRight, Layers,
  Sparkles, X, Check, Sliders
} from 'lucide-react';

/**
 * 5.3-5 大屏布局与关键指标自定义配置
 *
 * 可视化大屏编辑器：
 * - Widget 库（左侧）：可拖拽的 widget 列表
 * - 画布（中间）：大屏布局预览
 * - Widget 配置面板（右侧）：当前选中 widget 的设置
 * - 保存/重置/预览按钮
 */

interface Widget {
  id: string;
  type: string;
  title: string;
  category: 'metric' | 'chart' | 'table' | 'topology';
  w: number; // grid 宽度（1-12）
  h: number; // grid 高度
  config: {
    metric?: string;
    chartType?: 'line' | 'bar' | 'pie' | 'gauge';
    dataSource?: string;
    refreshInterval?: number;
    showLegend?: boolean;
    showTitle?: boolean;
    color?: string;
  };
}

interface WidgetTemplate {
  id: string;
  type: string;
  title: string;
  category: 'metric' | 'chart' | 'table' | 'topology';
  icon: React.ReactNode;
  description: string;
  defaultConfig: Widget['config'];
}

// ========== Widget 模板 ==========
const widgetTemplates: WidgetTemplate[] = [
  // 指标类
  { id: 'tpl-mttd', type: 'MTTD', title: '平均检测时间', category: 'metric', icon: <Activity className="w-4 h-4" />, description: '当前 MTTD 数值 + 趋势', defaultConfig: { metric: 'mttd', color: '#3B82F6', refreshInterval: 30 } },
  { id: 'tpl-mttr', type: 'MTTR', title: '平均响应时间', category: 'metric', icon: <Activity className="w-4 h-4" />, description: '当前 MTTR 数值 + 趋势', defaultConfig: { metric: 'mttr', color: '#10B981', refreshInterval: 30 } },
  { id: 'tpl-close-rate', type: 'CloseRate', title: '闭环率', category: 'metric', icon: <Target className="w-4 h-4" />, description: '当前闭环率 + 目标对比', defaultConfig: { metric: 'close_rate', color: '#F59E0B', refreshInterval: 60 } },
  { id: 'tpl-alerts', type: 'ActiveAlerts', title: '活跃告警数', category: 'metric', icon: <AlertCircle className="w-4 h-4" />, description: '活跃告警总数 + 严重程度分布', defaultConfig: { metric: 'active_alerts', color: '#EF4444', refreshInterval: 15 } },
  { id: 'tpl-vulns', type: 'OpenVulns', title: '未修复漏洞', category: 'metric', icon: <Shield className="w-4 h-4" />, description: '未修复漏洞数 + 高危占比', defaultConfig: { metric: 'open_vulns', color: '#8B5CF6', refreshInterval: 60 } },
  { id: 'tpl-assets', type: 'TotalAssets', title: '资产总数', category: 'metric', icon: <Server className="w-4 h-4" />, description: '总资产 + 在线率', defaultConfig: { metric: 'total_assets', color: '#06B6D4', refreshInterval: 300 } },

  // 图表类
  { id: 'tpl-trend-line', type: 'TrendLine', title: '趋势折线图', category: 'chart', icon: <Activity className="w-4 h-4" />, description: '时间序列趋势展示', defaultConfig: { chartType: 'line', dataSource: 'risk_score', refreshInterval: 60, showLegend: true } },
  { id: 'tpl-trend-bar', type: 'TrendBar', title: '柱状图', category: 'chart', icon: <BarChart3 className="w-4 h-4" />, description: '横向/纵向柱状对比', defaultConfig: { chartType: 'bar', dataSource: 'team_perf', refreshInterval: 120, showLegend: true } },
  { id: 'tpl-pie', type: 'PieChart', title: '饼图', category: 'chart', icon: <PieChart className="w-4 h-4" />, description: '占比分布展示', defaultConfig: { chartType: 'pie', dataSource: 'event_type', refreshInterval: 60, showLegend: true } },
  { id: 'tpl-gauge', type: 'Gauge', title: '仪表盘', category: 'chart', icon: <Target className="w-4 h-4" />, description: '环形仪表盘', defaultConfig: { chartType: 'gauge', dataSource: 'compliance_rate', refreshInterval: 120 } },

  // 表格类
  { id: 'tpl-top-assets', type: 'TopRiskAssets', title: '高风险资产', category: 'table', icon: <Server className="w-4 h-4" />, description: 'TOP N 高风险资产', defaultConfig: { dataSource: 'top_assets', refreshInterval: 60 } },
  { id: 'tpl-events', type: 'RecentEvents', title: '最近事件', category: 'table', icon: <AlertCircle className="w-4 h-4" />, description: '实时事件流', defaultConfig: { dataSource: 'recent_events', refreshInterval: 15 } },
  { id: 'tpl-slow', type: 'SlowIncidents', title: '慢响应工单', category: 'table', icon: <Activity className="w-4 h-4" />, description: 'TOP 慢响应工单', defaultConfig: { dataSource: 'slow_incidents', refreshInterval: 120 } },

  // 拓扑类
  { id: 'tpl-topology', type: 'NetworkTopology', title: '网络拓扑', category: 'topology', icon: <Layers className="w-4 h-4" />, description: '资产拓扑关系图', defaultConfig: { dataSource: 'topology', refreshInterval: 300 } },
  { id: 'tpl-attack', type: 'AttackPath', title: '攻击路径', category: 'topology', icon: <Shield className="w-4 h-4" />, description: '攻击路径可视化', defaultConfig: { dataSource: 'attack_path', refreshInterval: 300 } },
];

// ========== 初始布局 ==========
const initialLayout: Widget[] = [
  { id: 'w-1', type: 'MTTD', title: '平均检测时间', category: 'metric', w: 3, h: 2, config: { ...widgetTemplates[0].defaultConfig } },
  { id: 'w-2', type: 'MTTR', title: '平均响应时间', category: 'metric', w: 3, h: 2, config: { ...widgetTemplates[1].defaultConfig } },
  { id: 'w-3', type: 'CloseRate', title: '闭环率', category: 'metric', w: 3, h: 2, config: { ...widgetTemplates[2].defaultConfig } },
  { id: 'w-4', type: 'ActiveAlerts', title: '活跃告警数', category: 'metric', w: 3, h: 2, config: { ...widgetTemplates[3].defaultConfig } },
  { id: 'w-5', type: 'TrendLine', title: '风险评分趋势', category: 'chart', w: 8, h: 4, config: { ...widgetTemplates[6].defaultConfig } },
  { id: 'w-6', type: 'PieChart', title: '告警类型分布', category: 'chart', w: 4, h: 4, config: { ...widgetTemplates[8].defaultConfig } },
  { id: 'w-7', type: 'TopRiskAssets', title: 'TOP 高风险资产', category: 'table', w: 6, h: 4, config: { ...widgetTemplates[9].defaultConfig } },
  { id: 'w-8', type: 'RecentEvents', title: '最近事件', category: 'table', w: 6, h: 4, config: { ...widgetTemplates[10].defaultConfig } },
];

// ========== 组件 ==========
function WidgetPreview({ widget }: { widget: Widget }) {
  const cfg = widget.config;
  const color = cfg.color || '#3B82F6';

  if (widget.category === 'metric') {
    const values: Record<string, { v: string; trend: number }> = {
      MTTD: { v: '8', trend: -12 },
      MTTR: { v: '52', trend: -8 },
      CloseRate: { v: '95.5%', trend: 1.8 },
      ActiveAlerts: { v: '257', trend: -12 },
      OpenVulns: { v: '32', trend: 3 },
      TotalAssets: { v: '1,302', trend: 0 },
    };
    const data = values[widget.type] || { v: '0', trend: 0 };
    return (
      <div className="h-full flex flex-col">
        <div className="text-xs text-gray-500">{widget.title}</div>
        <div className="flex-1 flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold" style={{ color }}>{data.v}</div>
            <div className={`text-xs ${data.trend > 0 ? 'text-green-400' : data.trend < 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {data.trend > 0 ? '↑' : data.trend < 0 ? '↓' : '-'} {Math.abs(data.trend)}%
            </div>
          </div>
          <div className="w-16 h-12 opacity-30">
            <svg viewBox="0 0 60 40" className="w-full h-full">
              <polyline points="0,30 10,20 20,25 30,15 40,18 50,10 60,12" fill="none" stroke={color} strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (widget.category === 'chart') {
    if (cfg.chartType === 'pie') {
      // 简化饼图
      return (
        <div className="h-full flex flex-col">
          <div className="text-xs text-gray-500 mb-1">{widget.title}</div>
          <div className="flex-1 flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20" strokeDasharray="80 251" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" strokeDasharray="60 251" strokeDashoffset="-80" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="50 251" strokeDashoffset="-140" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="20" strokeDasharray="40 251" strokeDashoffset="-190" />
            </svg>
            <div className="text-[10px] space-y-0.5">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />Web 攻击 35%</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" />爆破 25%</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />SQL 注入 20%</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />DDoS 15%</div>
            </div>
          </div>
        </div>
      );
    }
    // 折线 / 柱状 / 仪表盘
    return (
      <div className="h-full flex flex-col">
        <div className="text-xs text-gray-500 mb-1">{widget.title}</div>
        <div className="flex-1 relative">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            {cfg.chartType === 'line' || !cfg.chartType ? (
              <polyline
                points="0,80 20,60 40,70 60,40 80,50 100,30 120,45 140,20 160,30 180,15 200,25"
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            ) : cfg.chartType === 'bar' ? (
              <>
                <rect x="10" y="60" width="15" height="40" fill={color} opacity="0.6" />
                <rect x="35" y="40" width="15" height="60" fill={color} opacity="0.6" />
                <rect x="60" y="50" width="15" height="50" fill={color} opacity="0.6" />
                <rect x="85" y="20" width="15" height="80" fill={color} opacity="0.6" />
                <rect x="110" y="35" width="15" height="65" fill={color} opacity="0.6" />
                <rect x="135" y="25" width="15" height="75" fill={color} opacity="0.6" />
                <rect x="160" y="45" width="15" height="55" fill={color} opacity="0.6" />
              </>
            ) : (
              // gauge
              <g transform="translate(100, 80)">
                <path d="M -70,0 A 70,70 0 0,1 70,0" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" />
                <path d="M -70,0 A 70,70 0 0,1 60,-50" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  if (widget.category === 'table') {
    return (
      <div className="h-full flex flex-col">
        <div className="text-xs text-gray-500 mb-1">{widget.title}</div>
        <div className="flex-1 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[#2A354D]/30 text-[10px]">
              <span className="text-gray-400 truncate">条目 {i} - AST-004{i}</span>
              <span className="text-orange-400">{90 - i * 5}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // topology
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-gray-500 mb-1">{widget.title}</div>
      <div className="flex-1 relative bg-[#0a1020] rounded">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* 节点 */}
          <circle cx="40" cy="50" r="8" fill="#3B82F6" />
          <circle cx="100" cy="30" r="6" fill="#10B981" />
          <circle cx="100" cy="70" r="6" fill="#10B981" />
          <circle cx="160" cy="50" r="8" fill="#EF4444" />
          {/* 连线 */}
          <line x1="48" y1="50" x2="94" y2="30" stroke="#475569" strokeWidth="1" />
          <line x1="48" y1="50" x2="94" y2="70" stroke="#475569" strokeWidth="1" />
          <line x1="106" y1="30" x2="152" y2="50" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="106" y1="70" x2="152" y2="50" stroke="#475569" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

function WidgetConfigPanel({ widget, onChange, onClose }: {
  widget: Widget;
  onChange: (w: Widget) => void;
  onClose: () => void;
}) {
  const updateConfig = (key: keyof Widget['config'], value: any) => {
    onChange({ ...widget, config: { ...widget.config, [key]: value } });
  };

  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          Widget 配置
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">标题</label>
        <input
          type="text"
          value={widget.title}
          onChange={(e) => onChange({ ...widget, title: e.target.value })}
          className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-400 block mb-1">宽度</label>
          <select
            value={widget.w}
            onChange={(e) => onChange({ ...widget, w: Number(e.target.value) })}
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5"
          >
            {[1, 2, 3, 4, 6, 8, 12].map(w => (
              <option key={w} value={w}>{w} 列</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">高度</label>
          <select
            value={widget.h}
            onChange={(e) => onChange({ ...widget, h: Number(e.target.value) })}
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5"
          >
            {[1, 2, 3, 4, 6, 8].map(h => (
              <option key={h} value={h}>{h} 行</option>
            ))}
          </select>
        </div>
      </div>

      {widget.category === 'metric' && (
        <>
          <div>
            <label className="text-xs text-gray-400 block mb-1">主色</label>
            <div className="flex gap-1.5">
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'].map(c => (
                <button
                  key={c}
                  onClick={() => updateConfig('color', c)}
                  className={`w-6 h-6 rounded border-2 ${widget.config.color === c ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {widget.category === 'chart' && (
        <>
          <div>
            <label className="text-xs text-gray-400 block mb-1">图表类型</label>
            <select
              value={widget.config.chartType || 'line'}
              onChange={(e) => updateConfig('chartType', e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5"
            >
              <option value="line">折线图</option>
              <option value="bar">柱状图</option>
              <option value="pie">饼图</option>
              <option value="gauge">仪表盘</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">主色</label>
            <div className="flex gap-1.5">
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map(c => (
                <button
                  key={c}
                  onClick={() => updateConfig('color', c)}
                  className={`w-6 h-6 rounded border-2 ${widget.config.color === c ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div>
        <label className="text-xs text-gray-400 block mb-1">刷新间隔 (秒)</label>
        <select
          value={widget.config.refreshInterval || 60}
          onChange={(e) => updateConfig('refreshInterval', Number(e.target.value))}
          className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-2 py-1.5"
        >
          <option value="15">15 秒</option>
          <option value="30">30 秒</option>
          <option value="60">1 分钟</option>
          <option value="120">2 分钟</option>
          <option value="300">5 分钟</option>
        </select>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#2A354D]">
        <span className="text-xs text-gray-400">显示标题</span>
        <button
          onClick={() => updateConfig('showTitle', !widget.config.showTitle)}
          className={`w-9 h-5 rounded-full transition-colors ${
            widget.config.showTitle !== false ? 'bg-blue-600' : 'bg-[#111625]'
          }`}
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
            widget.config.showTitle !== false ? 'translate-x-4' : 'translate-x-0.5'
          }`} />
        </button>
      </div>
    </div>
  );
}

// ========== 主组件 ==========
export function DashboardCustomConfig() {
  const [layout, setLayout] = useState<Widget[]>(initialLayout);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewMode, setPreviewMode] = useState(false);

  const selected = layout.find(w => w.id === selectedId);

  const filteredTemplates = widgetTemplates.filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (searchKeyword && !t.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  const addWidget = (tpl: WidgetTemplate) => {
    const id = `w-${Date.now()}`;
    setLayout([
      ...layout,
      {
        id,
        type: tpl.type,
        title: tpl.title,
        category: tpl.category,
        w: tpl.category === 'metric' ? 3 : 6,
        h: tpl.category === 'metric' ? 2 : 4,
        config: { ...tpl.defaultConfig },
      },
    ]);
  };

  const removeWidget = (id: string) => {
    setLayout(layout.filter(w => w.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateWidget = (w: Widget) => {
    setLayout(layout.map(x => x.id === w.id ? w : x));
  };

  const resetLayout = () => {
    if (confirm('确定要重置为默认布局吗？所有自定义修改将丢失。')) {
      setLayout(initialLayout);
      setSelectedId(null);
    }
  };

  const categories = [
    { v: 'all', l: '全部', count: widgetTemplates.length },
    { v: 'metric', l: '指标', count: widgetTemplates.filter(t => t.category === 'metric').length },
    { v: 'chart', l: '图表', count: widgetTemplates.filter(t => t.category === 'chart').length },
    { v: 'table', l: '表格', count: widgetTemplates.filter(t => t.category === 'table').length },
    { v: 'topology', l: '拓扑', count: widgetTemplates.filter(t => t.category === 'topology').length },
  ];

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            大屏布局与关键指标自定义配置
          </h2>
          <span className="text-xs text-gray-500">
            12 列网格 · 当前 {layout.length} 个 widget
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            {previewMode ? '编辑模式' : '预览模式'}
          </button>
          <button
            onClick={resetLayout}
            className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5" />
            另存为
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出配置
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            保存布局
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 左侧：Widget 库 */}
        <div className="col-span-3 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden flex flex-col" style={{ height: '700px' }}>
          <div className="p-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Grid3x3 className="w-4 h-4 text-blue-400" />
              Widget 库
            </h3>
            <input
              type="text"
              placeholder="搜索 widget..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full mt-2 bg-[#111625] border border-[#2A354D] text-white text-xs rounded px-2 py-1.5"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {categories.map(c => (
                <button
                  key={c.v}
                  onClick={() => setActiveCategory(c.v)}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    activeCategory === c.v
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#111625] text-gray-400 hover:bg-[#20293F]'
                  }`}
                >
                  {c.l} ({c.count})
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredTemplates.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => addWidget(tpl)}
                className="bg-[#111625] border border-[#2A354D] rounded p-2 hover:border-blue-500/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 flex-shrink-0">
                    {tpl.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">{tpl.title}</div>
                    <div className="text-[10px] text-gray-500 line-clamp-1">{tpl.description}</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 中间：画布 */}
        <div className="col-span-6 bg-[#111625] border border-[#2A354D] rounded-lg overflow-hidden flex flex-col" style={{ height: '700px' }}>
          <div className="p-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              大屏画布（{previewMode ? '预览' : '编辑'}模式）
            </h3>
            <span className="text-[10px] text-gray-500">
              提示: {previewMode ? '只读' : '点击 widget 进行编辑/删除'}
            </span>
          </div>
          <div className="flex-1 overflow-auto p-3 bg-[#0a1020]">
            <div className="grid grid-cols-12 gap-3 auto-rows-[60px]">
              {layout.map(w => (
                <div
                  key={w.id}
                  onClick={() => !previewMode && setSelectedId(w.id)}
                  className={`col-span-${w.w} row-span-${w.h} bg-[#20293F] border-2 rounded-lg p-3 transition-all relative group ${
                    selectedId === w.id
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'border-[#2A354D] hover:border-[#3d4a6a]'
                  } ${previewMode ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {!previewMode && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeWidget(w.id); }}
                        className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <WidgetPreview widget={w} />
                </div>
              ))}
              {layout.length === 0 && (
                <div className="col-span-12 row-span-4 flex flex-col items-center justify-center text-gray-500 text-sm">
                  <Grid3x3 className="w-12 h-12 mb-2 opacity-30" />
                  画布为空，点击左侧 Widget 添加
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：配置面板 */}
        <div className="col-span-3 space-y-3" style={{ height: '700px' }}>
          {selected ? (
            <WidgetConfigPanel
              widget={selected}
              onChange={updateWidget}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 text-center text-gray-500 text-sm">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <div>选择画布中的 widget 进行配置</div>
            </div>
          )}

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              布局概览
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Widget 总数</span>
                <span className="text-white">{layout.length}</span>
              </div>
              {categories.filter(c => c.v !== 'all').map(c => {
                const count = layout.filter(w => w.category === c.v).length;
                return (
                  <div key={c.v} className="flex justify-between">
                    <span className="text-gray-400">{c.l}类</span>
                    <span className="text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCustomConfig;
