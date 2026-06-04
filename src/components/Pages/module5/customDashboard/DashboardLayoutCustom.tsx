'use client';

import React, { useState } from 'react';
import {
  LayoutGrid, Plus, X, Settings, Save, Download,
  RefreshCw, Maximize2, Minimize2, Move,
  BarChart3, PieChart, Gauge, Table,
  TrendingUp, Activity, Grid3X3
} from 'lucide-react';

interface Widget {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const availableWidgets = [
  { id: 'bar', name: '柱状图', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'pie', name: '饼图', icon: <PieChart className="w-5 h-5" /> },
  { id: 'gauge', name: '仪表盘', icon: <Gauge className="w-5 h-5" /> },
  { id: 'table', name: '表格', icon: <Table className="w-5 h-5" /> },
  { id: 'trend', name: '趋势图', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'activity', name: '活动流', icon: <Activity className="w-5 h-5" /> },
];

const initialWidgets: Widget[] = [
  { id: 'w1', type: 'gauge', title: '安全风险评分', x: 0, y: 0, w: 1, h: 1 },
  { id: 'w2', type: 'bar', title: '事件趋势', x: 1, y: 0, w: 2, h: 1 },
  { id: 'w3', type: 'pie', title: '风险分布', x: 0, y: 1, w: 1, h: 1 },
  { id: 'w4', type: 'table', title: '告警列表', x: 1, y: 1, w: 2, h: 2 },
  { id: 'w5', type: 'trend', title: '处置效率', x: 0, y: 2, w: 1, h: 1 },
];

export function DashboardLayoutCustom() {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const addWidget = (type: string) => {
    const newWidget: Widget = {
      id: `w${Date.now()}`,
      type,
      title: availableWidgets.find(w => w.id === type)?.name || '新组件',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetPanel(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    setSelectedWidget(null);
  };

  const getWidgetIcon = (type: string) => {
    return availableWidgets.find(w => w.id === type)?.icon || <Grid3X3 className="w-5 h-5" />;
  };

  const getWidgetColor = (type: string) => {
    const colors: Record<string, string> = {
      bar: 'bg-blue-500/20 text-blue-400',
      pie: 'bg-purple-500/20 text-purple-400',
      gauge: 'bg-green-500/20 text-green-400',
      table: 'bg-orange-500/20 text-orange-400',
      trend: 'bg-cyan-500/20 text-cyan-400',
      activity: 'bg-pink-500/20 text-pink-400',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-purple-400" />
            自定义仪表盘布局
          </h2>
          <p className="text-sm text-gray-400 mt-1">拖拽组件调整布局，自定义专属仪表盘</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 transition-all ${
              editMode
                ? 'bg-green-600 text-white'
                : 'bg-[#111625] border border-[#2A354D] text-gray-300 hover:bg-[#20293F]'
            }`}
          >
            {editMode ? <Save className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
            {editMode ? '保存布局' : '编辑模式'}
          </button>
          <button
            onClick={() => setShowWidgetPanel(!showWidgetPanel)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            添加组件
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出布局
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4 min-h-[500px] relative ${
          editMode ? 'border-dashed border-blue-500/50' : ''
        }`}>
          <div className="grid grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                onClick={() => editMode && setSelectedWidget(widget.id)}
                className={`bg-[#111625] rounded-lg p-4 cursor-pointer transition-all ${
                  selectedWidget === widget.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-500/50'
                } ${editMode ? 'border-2 border-dashed border-[#2A354D]' : ''}`}
                style={{
                  gridColumn: `span ${widget.w}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getWidgetColor(widget.type)}`}>
                      {getWidgetIcon(widget.type)}
                    </div>
                    <span className="text-sm font-medium text-white">{widget.title}</span>
                  </div>
                  {editMode && (
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-[#20293F] rounded">
                        <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
                        className="p-1 hover:bg-red-500/20 rounded"
                      >
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="h-32 flex items-center justify-center text-gray-500">
                  {widget.type === 'gauge' && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">85</div>
                      <div className="text-xs text-gray-400">风险评分</div>
                    </div>
                  )}
                  {widget.type === 'bar' && (
                    <div className="w-full h-full flex items-end justify-around gap-2 px-2">
                      {[60, 80, 45, 70, 90, 55, 75].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-blue-500/50 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  )}
                  {widget.type === 'pie' && (
                    <svg width="80" height="80" className="transform -rotate-90">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#111625" strokeWidth="8" />
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#EF4444" strokeWidth="8" strokeDasharray="94 198" />
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#F59E0B" strokeWidth="8" strokeDasharray="63 198" strokeDashoffset="-94" />
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#22C55E" strokeWidth="8" strokeDasharray="41 198" strokeDashoffset="-157" />
                      <circle cx="40" cy="40" r="15" fill="#0F172A" />
                    </svg>
                  )}
                  {widget.type === 'table' && (
                    <div className="w-full text-xs">
                      <table className="w-full">
                        <thead>
                          <tr className="text-gray-400">
                            <th className="text-left py-1">告警</th>
                            <th className="text-right py-1">级别</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['SQL注入攻击', '暴力破解', 'DDoS攻击', 'XSS'].map((item, i) => (
                            <tr key={i} className="text-gray-300">
                              <td className="py-1">{item}</td>
                              <td className="text-right">
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">高</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {widget.type === 'trend' && (
                    <div className="w-full h-full">
                      <svg width="100%" height="100" viewBox="0 0 200 80">
                        <path
                          d="M 10 60 L 40 40 L 70 50 L 100 30 L 130 45 L 160 25 L 190 35"
                          fill="none"
                          stroke="#22D3EE"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                  {widget.type === 'activity' && (
                    <div className="w-full space-y-2">
                      {[
                        { time: '刚刚', event: '检测到异常流量' },
                        { time: '2分钟前', event: '漏洞扫描完成' },
                        { time: '5分钟前', event: '告警已处理' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-gray-400">{item.time}</span>
                          <span className="text-xs text-gray-300">{item.event}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {editMode && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-gray-400">
              <Move className="w-4 h-4" />
              <span>拖拽调整布局</span>
            </div>
          )}
        </div>

        {showWidgetPanel && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="p-3 border-b border-[#2A354D] flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">可用组件</h3>
              <button onClick={() => setShowWidgetPanel(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {availableWidgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => addWidget(widget.id)}
                  className="w-full p-3 bg-[#111625] hover:bg-[#20293F] rounded-lg flex items-center gap-3 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    {widget.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-white">{widget.name}</div>
                    <div className="text-xs text-gray-500">点击添加</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            布局设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">网格列数</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2">
                <option>2 列</option>
                <option selected>3 列</option>
                <option>4 列</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">组件间距</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2">
                <option>紧凑 (8px)</option>
                <option selected>适中 (16px)</option>
                <option>宽松 (24px)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">主题</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2">
                <option selected>深色主题</option>
                <option>浅色主题</option>
              </select>
            </div>
            <div className="pt-2">
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                应用设置
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#2A354D]">
            <h3 className="text-sm font-medium text-white mb-3">布局预设</h3>
            <div className="grid grid-cols-2 gap-2">
              {['紧凑布局', '均衡布局', '大图布局', '列表布局'].map((layout, i) => (
                <button
                  key={i}
                  className="p-2 bg-[#111625] hover:bg-[#20293F] rounded-lg text-xs text-gray-300 transition-all"
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayoutCustom;