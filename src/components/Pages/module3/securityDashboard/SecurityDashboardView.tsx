'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle2, Activity, TrendingUp, Clock } from 'lucide-react';

const mockThreats = [
  { id: 1, type: '入侵检测', source: '192.168.1.100', time: '刚刚', severity: 'high' },
  { id: 2, type: '恶意软件', source: '终端PC-001', time: '1分钟前', severity: 'high' },
  { id: 3, type: 'SQL注入', source: 'Web服务器', time: '3分钟前', severity: 'medium' },
  { id: 4, type: '异常流量', source: '防火墙', time: '5分钟前', severity: 'medium' },
  { id: 5, type: '弱口令攻击', source: 'VPN网关', time: '8分钟前', severity: 'low' },
];

const mockAssets = [
  { name: 'Web服务器', status: 'normal', count: 12 },
  { name: '数据库', status: 'warning', count: 8 },
  { name: '终端设备', status: 'normal', count: 156 },
  { name: '网络设备', status: 'normal', count: 34 },
];

export function SecurityDashboardView() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    totalAlerts: 1247,
    resolvedAlerts: 1189,
    activeThreats: 58,
    attackRate: 23,
    complianceRate: 94,
    riskIndex: 32,
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">安全运营中心</h1>
          <p className="text-slate-400 mt-1">Security Operations Center Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#20293F] rounded-lg">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-white font-mono text-lg">{time.toLocaleTimeString('zh-CN')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-sm">系统运行正常</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">今日告警</span>
            <AlertTriangle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.totalAlerts}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400">+12%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">已处置</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.resolvedAlerts}</div>
          <div className="text-xs text-green-400 mt-1">处置率 95.4%</div>
        </div>
        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">活跃威胁</span>
            <Activity className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.activeThreats}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">-8%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">攻击趋势</span>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.attackRate}%</div>
          <div className="text-xs text-orange-400 mt-1">较昨日下降</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">合规率</span>
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.complianceRate}%</div>
          <div className="text-xs text-purple-400 mt-1">符合安全标准</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">风险指数</span>
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.riskIndex}</div>
          <div className="text-xs text-yellow-400 mt-1">低风险状态</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111625] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">实时威胁监控</h3>
          <div className="space-y-3">
            {mockThreats.map((threat, index) => (
              <div 
                key={threat.id}
                className={`flex items-center gap-4 p-3 rounded-lg bg-[#20293F] border-l-4 transition-all ${
                  threat.severity === 'high' ? 'border-red-500' : 
                  threat.severity === 'medium' ? 'border-yellow-500' : 'border-green-500'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 rounded-lg ${
                  threat.severity === 'high' ? 'bg-red-500/20' : 
                  threat.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                } flex items-center justify-center`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    threat.severity === 'high' ? 'text-red-400' : 
                    threat.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{threat.type}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      threat.severity === 'high' ? 'bg-red-500/20 text-red-400' : 
                      threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {threat.severity === 'high' ? '高危' : threat.severity === 'medium' ? '中危' : '低危'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">来源: {threat.source}</p>
                </div>
                <span className="text-slate-500 text-xs">{threat.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111625] border border-[#2A354D] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">资产健康状态</h3>
            <div className="space-y-4">
              {mockAssets.map(asset => (
                <div key={asset.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{asset.name}</span>
                    <span className="text-white">{asset.count} 台</span>
                  </div>
                  <div className="h-2 bg-[#20293F] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${asset.status === 'normal' ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: asset.status === 'normal' ? '95%' : '75%' }}
                    />
                  </div>
                  <span className={`text-xs mt-1 block ${asset.status === 'normal' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {asset.status === 'normal' ? '运行正常' : '存在告警'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111625] border border-[#2A354D] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">攻击类型分布</h3>
            <div className="space-y-3">
              {[
                { type: 'DDoS攻击', percent: 35, color: 'bg-red-500' },
                { type: '恶意软件', percent: 28, color: 'bg-orange-500' },
                { type: 'SQL注入', percent: 20, color: 'bg-yellow-500' },
                { type: '钓鱼攻击', percent: 12, color: 'bg-blue-500' },
                { type: '其他', percent: 5, color: 'bg-gray-500' },
              ].map(item => (
                <div key={item.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{item.type}</span>
                    <span className="text-white">{item.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-[#20293F] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
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