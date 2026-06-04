'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, Search, RefreshCw, Download,
  Plus, Edit3, MoreVertical, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, Server, Database,
  BarChart3, PieChart, Activity, Bell
} from 'lucide-react';

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  lastModified: string;
  widgets: number;
  shared: boolean;
}

const dashboardItems: DashboardItem[] = [
  { id: 'd1', title: '安全态势总览', description: '整体安全状态和趋势', lastModified: '2小时前', widgets: 6, shared: true },
  { id: 'd2', title: '漏洞管理', description: '漏洞统计和修复进度', lastModified: '1天前', widgets: 4, shared: false },
  { id: 'd3', title: '告警监控', description: '实时告警和处理状态', lastModified: '3小时前', widgets: 5, shared: true },
  { id: 'd4', title: '资产风险', description: '资产风险评估和分布', lastModified: '5小时前', widgets: 3, shared: false },
];

const recentActivities = [
  { time: '刚刚', action: '更新了安全态势总览仪表盘', type: 'update' },
  { time: '10分钟前', action: '创建了新的漏洞管理仪表盘', type: 'create' },
  { time: '1小时前', action: '分享了告警监控仪表盘', type: 'share' },
  { time: '3小时前', action: '删除了旧版资产风险仪表盘', type: 'delete' },
];

export function PersonalDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my');

  const tabs = [
    { id: 'my', label: '我的仪表盘' },
    { id: 'shared', label: '共享仪表盘' },
    { id: 'templates', label: '模板' },
  ];

  const filteredDashboards = dashboardItems.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            专属仪表盘
          </h2>
          <p className="text-sm text-gray-400 mt-1">管理和查看您的个人仪表盘</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            新建仪表盘
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '仪表盘总数', value: '4', icon: <LayoutDashboard className="w-4 h-4" />, color: 'blue' },
            { label: '共享仪表盘', value: '2', icon: <BarChart3 className="w-4 h-4" />, color: 'green' },
            { label: '今日访问', value: '12', icon: <Activity className="w-4 h-4" />, color: 'purple' },
            { label: '收藏数', value: '3', icon: <PieChart className="w-4 h-4" />, color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111625] rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                <span className={`text-${stat.color}-400`}>{stat.icon}</span>
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="flex border-b border-[#2A354D]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#111625] text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-[#111625]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索仪表盘..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{dashboard.title}</h3>
                      {dashboard.shared && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400">共享</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{dashboard.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#20293F] rounded">
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-[#20293F] rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dashboard.lastModified}
                  </span>
                  <span className="flex items-center gap-1">
                    <LayoutDashboard className="w-3 h-3" />
                    {dashboard.widgets} 个组件
                  </span>
                </div>
                <div className="mt-3 h-20 bg-[#20293F] rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <TrendingUp className="w-6 h-6 text-blue-400" />, label: '趋势' },
                      { icon: <AlertTriangle className="w-6 h-6 text-red-400" />, label: '告警' },
                      { icon: <CheckCircle2 className="w-6 h-6 text-green-400" />, label: '状态' },
                      { icon: <PieChart className="w-6 h-6 text-purple-400" />, label: '分布' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center">
                        {item.icon}
                        <span className="text-[10px] text-gray-500 mt-1">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">共 {filteredDashboards.length} 个仪表盘</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
              <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
              <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          最近活动
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activity.type === 'create' ? 'bg-green-500/20' :
                activity.type === 'update' ? 'bg-blue-500/20' :
                activity.type === 'share' ? 'bg-purple-500/20' : 'bg-red-500/20'
              }`}>
                {activity.type === 'create' && <Plus className="w-4 h-4 text-green-400" />}
                {activity.type === 'update' && <RefreshCw className="w-4 h-4 text-blue-400" />}
                {activity.type === 'share' && <Download className="w-4 h-4 text-purple-400" />}
                {activity.type === 'delete' && <Edit3 className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-300">{activity.action}</div>
                <div className="text-[10px] text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PersonalDashboard;