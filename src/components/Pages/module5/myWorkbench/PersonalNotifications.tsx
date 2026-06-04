'use client';

import React, { useState } from 'react';
import {
  Bell, Search, Filter, X, ChevronRight,
  AlertCircle, Info, CheckCircle2, MessageSquare,
  Clock, User, Settings, Download
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  source: string;
}

const notifications: Notification[] = [
  { id: 'n1', type: 'alert', title: '高危漏洞告警', message: '发现高危漏洞 CVE-2021-44228，请尽快处理', time: '5分钟前', read: false, source: '漏洞扫描系统' },
  { id: 'n2', type: 'warning', title: '任务执行失败', message: '定时任务「安全策略巡检」执行失败，请检查日志', time: '30分钟前', read: false, source: '任务调度系统' },
  { id: 'n3', type: 'info', title: '工单审批提醒', message: '您有一个防火墙规则变更工单待审批', time: '1小时前', read: true, source: '工单系统' },
  { id: 'n4', type: 'success', title: '威胁情报更新', message: '威胁情报库已成功更新，新增 15 条情报', time: '2小时前', read: true, source: '威胁情报系统' },
  { id: 'n5', type: 'alert', title: '异常流量检测', message: '检测到来自异常IP的大量访问请求', time: '3小时前', read: true, source: '安全监控系统' },
];

function TypeIcon({ type }: { type: Notification['type'] }) {
  const icons = {
    alert: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    warning: <MessageSquare className="w-5 h-5 text-yellow-400" />,
  };
  return icons[type];
}

function TypeBadge({ type }: { type: Notification['type'] }) {
  const config = {
    alert: { bg: 'bg-red-500/10', text: 'text-red-400', label: '告警' },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '通知' },
    success: { bg: 'bg-green-500/10', text: 'text-green-400', label: '成功' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '警告' },
  };
  const { bg, text, label } = config[type];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function PersonalNotifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [notificationsList, setNotificationsList] = useState(notifications);

  const markAsRead = (id: string) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notificationsList.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || n.type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: notificationsList.length,
    unread: notificationsList.filter(n => !n.read).length,
    alerts: notificationsList.filter(n => n.type === 'alert').length,
    info: notificationsList.filter(n => n.type === 'info').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            个人消息通知
          </h2>
          <p className="text-sm text-gray-400 mt-1">查看和管理您的消息通知</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllAsRead} className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            全部已读
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            通知设置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '通知总数', value: stats.total, icon: <Bell className="w-4 h-4" />, color: 'blue' },
          { label: '未读', value: stats.unread, icon: <AlertCircle className="w-4 h-4" />, color: 'red' },
          { label: '告警', value: stats.alerts, icon: <AlertCircle className="w-4 h-4" />, color: 'orange' },
          { label: '通知', value: stats.info, icon: <Info className="w-4 h-4" />, color: 'purple' },
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
                placeholder="搜索通知内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="all">全部类型</option>
                <option value="alert">告警</option>
                <option value="warning">警告</option>
                <option value="info">通知</option>
                <option value="success">成功</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 cursor-pointer transition-all ${
                notification.read ? 'hover:bg-[#111625]' : 'bg-blue-500/5'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  notification.type === 'alert' ? 'bg-red-500/20' :
                  notification.type === 'warning' ? 'bg-yellow-500/20' :
                  notification.type === 'success' ? 'bg-green-500/20' : 'bg-blue-500/20'
                }`}>
                  <TypeIcon type={notification.type} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                    </div>
                    <button className="p-1 hover:bg-[#20293F] rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <TypeBadge type={notification.type} />
                    <span className="text-xs text-gray-500">{notification.source}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
              {!notification.read && (
                <div className="mt-3 pt-3 border-t border-[#2A354D]">
                  <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    查看详情 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredNotifications.length} 条通知</span>
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

export default PersonalNotifications;