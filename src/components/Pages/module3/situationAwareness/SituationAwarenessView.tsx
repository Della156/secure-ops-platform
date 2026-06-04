'use client';

import { useState } from 'react';
import { Shield, Activity, AlertTriangle, TrendingUp, Clock, Users, Server, Network } from 'lucide-react';

const mockStats = [
  { label: '威胁等级', value: '中', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <AlertTriangle className="w-5 h-5" /> },
  { label: '活跃威胁', value: '12', color: 'text-red-400', bg: 'bg-red-500/20', icon: <Activity className="w-5 h-5" /> },
  { label: '受影响资产', value: '28', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: <Server className="w-5 h-5" /> },
  { label: '在线用户', value: '156', color: 'text-green-400', bg: 'bg-green-500/20', icon: <Users className="w-5 h-5" /> },
];

const mockThreats = [
  { id: 'T-001', type: 'DDoS攻击', severity: 'high', source: '192.168.1.100', target: 'Web服务器', time: '2分钟前', status: 'active' },
  { id: 'T-002', type: 'SQL注入', severity: 'high', source: '10.0.0.5', target: '数据库', time: '5分钟前', status: 'active' },
  { id: 'T-003', type: '端口扫描', severity: 'medium', source: '172.16.0.3', target: '内网主机', time: '8分钟前', status: 'active' },
  { id: 'T-004', type: '恶意软件', severity: 'high', source: '外部', target: '终端主机', time: '15分钟前', status: 'blocked' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'low': return 'bg-green-500/20 text-green-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const getStatusColor = (status: string) => {
  return status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400';
};

export function SituationAwarenessView() {
  const [selectedThreat, setSelectedThreat] = useState(mockThreats[0]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">安全态势感知视图</h1>
          <p className="text-slate-400 mt-1">实时监控安全态势，全面感知网络安全状况</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">最后更新:</span>
          <span className="text-xs text-green-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" />实时
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mockStats.map(stat => (
          <div key={stat.label} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">{stat.label}</span>
              <span className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">实时威胁监控</h3>
              <button className="flex items-center gap-1 px-2 py-1 text-xs bg-[#2A354D] hover:bg-[#364360] text-slate-300 rounded">
                <Network className="w-3 h-3" />刷新
              </button>
            </div>
            <div className="space-y-3">
              {mockThreats.map(threat => (
                <div 
                  key={threat.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedThreat.id === threat.id 
                      ? 'bg-blue-500/20 ring-1 ring-blue-500/40' 
                      : 'bg-[#111625] hover:bg-[#181F32]'
                  }`}
                  onClick={() => setSelectedThreat(threat)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${threat.status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{threat.type}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${getSeverityColor(threat.severity)}`}>
                            {threat.severity === 'high' ? '高' : threat.severity === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span>来源: {threat.source}</span>
                          <span>目标: {threat.target}</span>
                          <span>{threat.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(threat.status)}`}>
                      {threat.status === 'active' ? '进行中' : '已阻断'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">威胁详情</h3>
            {selectedThreat && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                  <Shield className="w-10 h-10 text-red-400" />
                  <div>
                    <p className="text-white font-medium">{selectedThreat.type}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getSeverityColor(selectedThreat.severity)}`}>
                      {selectedThreat.severity === 'high' ? '高风险' : selectedThreat.severity === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">威胁ID</span>
                    <span className="text-slate-300 font-mono">{selectedThreat.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">攻击来源</span>
                    <span className="text-red-400">{selectedThreat.source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">目标资产</span>
                    <span className="text-slate-300">{selectedThreat.target}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">发现时间</span>
                    <span className="text-slate-300">{selectedThreat.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">当前状态</span>
                    <span className={`${getStatusColor(selectedThreat.status)}`}>
                      {selectedThreat.status === 'active' ? '进行中' : '已阻断'}
                    </span>
                  </div>
                </div>
                <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md">
                  立即处置
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">态势趋势</h3>
            <div className="space-y-3">
              {['近1小时', '近6小时', '近24小时'].map((period, i) => (
                <div key={period}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{period}</span>
                    <span className="text-slate-300">{[45, 120, 380][i]} 次威胁</span>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${[30, 60, 85][i]}%` }} />
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