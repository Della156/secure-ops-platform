'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, Settings, Globe, Server } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const platforms = [
  { id: 'platform-1', name: '省级安全平台', status: 'connected', ip: '10.0.0.1', port: 8080 },
  { id: 'platform-2', name: '市级平台A', status: 'connected', ip: '10.0.1.1', port: 8080 },
  { id: 'platform-3', name: '市级平台B', status: 'disconnected', ip: '10.0.2.1', port: 8080 },
];

const notificationTypes = [
  { id: 'alert', name: '安全告警', enabled: true },
  { id: 'threat', name: '威胁情报', enabled: true },
  { id: 'incident', name: '事件协查', enabled: true },
  { id: 'emergency', name: '应急响应', enabled: false },
];

export function ElinkConfig() {
  const [platformList, setPlatformList] = useState(platforms);
  const [notifications, setNotifications] = useState(notificationTypes);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">ELINK协同联动配置</h2>
            <p className="text-xs text-slate-500 mt-1">配置ELINK协同联动的连接参数和通知规则</p>
          </div>
          <Button variant="secondary" size="sm"><Plus className="w-3.5 h-3.5 mr-1" />新增平台</Button>
        </div>
      </div>

      <Card padding="sm">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">连接平台配置</h3>
        </div>
        <div className="space-y-3">
          {platformList.map(platform => (
            <div key={platform.id} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">{platform.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    platform.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {platform.status === 'connected' ? '已连接' : '未连接'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-red-400">
                  <Trash2 className="w-3 h-3 mr-1" />删除
                </Button>
              </div>
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <span>IP: <span className="text-slate-300 font-mono">{platform.ip}</span></span>
                <span>端口: <span className="text-slate-300">{platform.port}</span></span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">通知类型配置</h3>
        </div>
        <div className="space-y-2">
          {notifications.map(notif => (
            <div key={notif.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">{notif.name}</span>
              <button
                onClick={() => toggleNotification(notif.id)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  notif.enabled ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    notif.enabled ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary"><Save className="w-3.5 h-3.5 mr-1" />保存配置</Button>
        <Button variant="primary">测试连接</Button>
      </div>
    </div>
  );
}

export default ElinkConfig;