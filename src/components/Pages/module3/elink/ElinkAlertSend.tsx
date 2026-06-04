'use client';

import { useState } from 'react';
import { Send, Bell, CheckCircle2, AlertCircle, User, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const platforms = [
  { value: 'provincial', label: '省级平台' },
  { value: 'city-a', label: '市级平台A' },
  { value: 'city-b', label: '市级平台B' },
  { value: 'city-c', label: '市级平台C' },
];

const alertTypes = [
  { value: 'high', label: '高危告警' },
  { value: 'medium', label: '中危告警' },
  { value: 'low', label: '低危告警' },
];

const recentAlerts = [
  { id: 'ALT-001', type: 'high', title: 'APT攻击检测', target: '省级平台', time: '10:30', status: 'sent' },
  { id: 'ALT-002', type: 'medium', title: '可疑流量检测', target: '市级平台A', time: '10:25', status: 'sent' },
  { id: 'ALT-003', type: 'high', title: '数据泄露预警', target: '省级平台', time: '10:20', status: 'pending' },
];

export function ElinkAlertSend() {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertContent, setAlertContent] = useState('');

  const handleSend = () => {
    alert('告警信息已发送');
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const typeText = (type: string) => {
    switch (type) {
      case 'high': return '高危';
      case 'medium': return '中危';
      case 'low': return '低危';
      default: return '未知';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">告警信息发送</h2>
            <p className="text-xs text-slate-500 mt-1">通过ELINK向其他平台发送安全告警信息</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="p-4">
          <h3 className="text-sm font-semibold text-white mb-4">发送告警信息</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">目标平台</label>
              <Select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                options={platforms}
                placeholder="请选择目标平台"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">告警级别</label>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={alertTypes}
                placeholder="请选择告警级别"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">告警标题</label>
              <Input placeholder="输入告警标题..." value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">告警内容</label>
              <textarea
                value={alertContent}
                onChange={(e) => setAlertContent(e.target.value)}
                placeholder="输入告警详细内容..."
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <Button className="w-full" onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" />发送告警
            </Button>
          </div>
        </Card>

        <Card padding="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">最近发送记录</h3>
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${typeColor(alert.type)}`}>
                      {typeText(alert.type)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      alert.status === 'sent' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {alert.status === 'sent' ? '已发送' : '待发送'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
                <p className="text-sm text-white">{alert.title}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {alert.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ElinkAlertSend;