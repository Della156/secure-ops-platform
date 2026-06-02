'use client';

import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Clock, Send, CheckCircle } from 'lucide-react';

interface AlertItem {
  id: string;
  vulnId: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  targets: string[];
  detectedAt: string;
  status: 'pending' | 'notified' | 'resolved';
}

interface ReminderItem {
  id: string;
  vulnId: string;
  target: string;
  daysPending: number;
  severity: 'high' | 'medium' | 'low';
}

const mockAlerts: AlertItem[] = [
  { id: 'ALERT-001', vulnId: 'CVE-2024-9999', severity: 'high', title: '高危漏洞预警', description: '发现高危漏洞，建议立即修复', targets: ['prod-server-01'], detectedAt: '2026-06-02 11:30:00', status: 'pending' },
  { id: 'ALERT-002', vulnId: 'CVE-2024-8888', severity: 'medium', title: '中危漏洞预警', description: '发现中危漏洞，建议尽快修复', targets: ['app-01'], detectedAt: '2026-06-02 10:15:00', status: 'notified' },
];

const mockReminders: ReminderItem[] = [
  { id: 'REM-001', vulnId: 'CVE-2024-7777', target: 'prod-db', daysPending: 7, severity: 'high' },
  { id: 'REM-002', vulnId: 'CVE-2024-6666', target: 'prod-server-02', daysPending: 3, severity: 'medium' },
];

export function VulnAlertNotify() {
  const [alerts] = useState(mockAlerts);
  const [reminders] = useState(mockReminders);

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (severity === 'medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const getSeverityText = (severity: string) => {
    if (severity === 'high') return '高危';
    if (severity === 'medium') return '中危';
    return '低危';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">漏洞预警与通知</h2>
        <p className="text-sm text-gray-400 mt-1">高危漏洞预警信息推送，未修复漏洞定期提醒</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              漏洞预警
            </h3>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors">
              <Send className="w-3 h-3" />
              发送预警
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-white text-sm font-medium">{alert.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    alert.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    alert.status === 'notified' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {alert.status === 'pending' ? '待处理' : alert.status === 'notified' ? '已通知' : '已解决'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  <span className="text-red-400">{alert.vulnId}</span> - {alert.description}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {alert.detectedAt}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-400" />
              未修复漏洞提醒
            </h3>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors">
              <Send className="w-3 h-3" />
              发送提醒
            </button>
          </div>
          
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className={`p-3 rounded-lg border ${getSeverityColor(reminder.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-red-400 text-sm">{reminder.vulnId}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    reminder.daysPending > 5 ? 'bg-red-500/20 text-red-400' :
                    reminder.daysPending > 2 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    待修复{reminder.daysPending}天
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">目标: {reminder.target}</span>
                  <span className={`px-1.5 py-0.5 rounded ${getSeverityColor(reminder.severity)}`}>
                    {getSeverityText(reminder.severity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}