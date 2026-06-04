'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Shield, CheckCircle2, Clock } from 'lucide-react';

const mockMetrics = [
  { id: 'm1', name: '威胁检测数', value: 156, trend: 12, unit: '次', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' },
  { id: 'm2', name: '告警处置率', value: 94, trend: 5, unit: '%', icon: Shield, color: 'text-green-400', bg: 'bg-green-500/20' },
  { id: 'm3', name: '风险资产数', value: 23, trend: -8, unit: '台', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'm4', name: '合规率', value: 88, trend: 3, unit: '%', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/20' },
];

export function SecurityMetricsDashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">安全指标仪表板</h1>
          <p className="text-slate-400 mt-1">实时监控安全指标数据</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#20293F] rounded-lg">
          <Clock className="w-4 h-4 text-green-400" />
          <span className="text-white font-mono">{time.toLocaleTimeString('zh-CN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{metric.name}</span>
                <div className={`w-8 h-8 rounded-lg ${metric.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </div>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-bold text-white">{metric.value}</span>
                <span className="text-sm text-slate-500 pb-1">{metric.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {metric.trend >= 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">+{metric.trend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400">{metric.trend}%</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">威胁趋势</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {[28, 45, 32, 56, 48, 62, 38, 52, 44, 58, 65, 72].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <span className="text-xs text-slate-500 mb-2">{value}</span>
                <div 
                  className="w-full bg-gradient-to-t from-red-600 to-orange-400 rounded-t-sm"
                  style={{ height: `${(value / 80) * 100}%`, minHeight: '10px' }}
                />
                <span className="text-xs text-slate-500 mt-2">{['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">最近告警</h3>
            <div className="space-y-2">
              {[
                { time: '10:35', type: '入侵检测', severity: 'high' },
                { time: '10:32', type: '恶意软件', severity: 'high' },
                { time: '10:28', type: 'SQL注入', severity: 'medium' },
                { time: '10:25', type: '异常流量', severity: 'medium' },
              ].map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-[#111625] rounded-lg">
                  <div>
                    <p className="text-sm text-white">{alert.type}</p>
                    <span className={`text-xs ${alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {alert.severity === 'high' ? '高危' : '中危'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">资产状态分布</h3>
            <div className="space-y-3">
              {[
                { label: '正常运行', value: 85, color: 'bg-green-500' },
                { label: '存在告警', value: 12, color: 'bg-yellow-500' },
                { label: '严重异常', value: 3, color: 'bg-red-500' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}