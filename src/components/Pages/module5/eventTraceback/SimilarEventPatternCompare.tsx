'use client';

import React, { useState } from 'react';
import {
  GitCompare, Search, Filter, Download, RefreshCw,
  AlertTriangle, CheckCircle2, XCircle, ArrowRight,
  TrendingUp, TrendingDown, Minus, Clock, User,
  MapPin, Target
} from 'lucide-react';

interface EventPattern {
  id: string;
  name: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  similarity: number;
  source: string;
  type: string;
  status: 'active' | 'resolved';
}

const similarEvents: EventPattern[] = [
  { id: 'e1', name: '暴力破解攻击-A', time: '2026-06-02 14:32', severity: 'high', similarity: 95, source: '外部网络', type: '攻击事件', status: 'resolved' },
  { id: 'e2', name: '暴力破解攻击-B', time: '2026-06-01 09:15', severity: 'high', similarity: 88, source: '外部网络', type: '攻击事件', status: 'resolved' },
  { id: 'e3', name: '异常登录检测', time: '2026-05-31 16:45', severity: 'medium', similarity: 72, source: '内部网络', type: '异常行为', status: 'resolved' },
  { id: 'e4', name: '暴力破解攻击-C', time: '2026-05-30 11:20', severity: 'high', similarity: 85, source: 'VPN接入', type: '攻击事件', status: 'active' },
  { id: 'e5', name: '弱密码检测', time: '2026-05-29 14:00', severity: 'medium', similarity: 65, source: '内部网络', type: '漏洞告警', status: 'resolved' },
];

function SeverityBadge({ severity }: { severity: EventPattern['severity'] }) {
  const config = {
    high: { bg: 'bg-red-500/10', text: 'text-red-400', label: '高危' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中危' },
    low: { bg: 'bg-green-500/10', text: 'text-green-400', label: '低危' },
  };
  const { bg, text, label } = config[severity];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

function SimilarityBar({ value }: { value: number }) {
  const getColor = () => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#111625] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor()} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${value >= 90 ? 'text-green-400' : value >= 70 ? 'text-yellow-400' : 'text-blue-400'}`}>
        {value}%
      </span>
    </div>
  );
}

export function SimilarEventPatternCompare() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['e1', 'e2']);

  const filteredEvents = similarEvents.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEvent = (id: string) => {
    setSelectedEvents(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const comparisonData = {
    same: {
      items: ['攻击类型相同', '来源IP相似', '攻击时间规律', '目标系统一致'],
      count: 4,
    },
    different: {
      items: ['攻击强度不同', '持续时间差异', '响应方式不同'],
      count: 3,
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-purple-400" />
            相似事件模式对比
          </h2>
          <p className="text-sm text-gray-400 mt-1">对比历史相似事件，发现模式规律</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出对比
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '相似事件', value: similarEvents.length, icon: <GitCompare className="w-4 h-4" />, color: 'purple' },
          { label: '高相似度', value: similarEvents.filter(e => e.similarity >= 80).length, icon: <TrendingUp className="w-4 h-4" />, color: 'green' },
          { label: '中等相似度', value: similarEvents.filter(e => e.similarity >= 60 && e.similarity < 80).length, icon: <Minus className="w-4 h-4" />, color: 'yellow' },
          { label: '已选择', value: selectedEvents.length, icon: <Target className="w-4 h-4" />, color: 'blue' },
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

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索事件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2">
              <option value="all">全部类型</option>
              <option value="high">高危</option>
              <option value="medium">中危</option>
              <option value="low">低危</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => toggleEvent(event.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedEvents.includes(event.id)
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : 'bg-[#111625] border border-[#2A354D] hover:border-[#3A455D]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedEvents.includes(event.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-transparent border-[#2A354D]'
                    }`}>
                      {selectedEvents.includes(event.id) && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-white">{event.name}</h3>
                    <SeverityBadge severity={event.severity} />
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {event.type}
                    </span>
                  </div>
                </div>
                <div className="min-w-[120px]">
                  <div className="text-xs text-gray-400 mb-1">相似度</div>
                  <SimilarityBar value={event.similarity} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEvents.length >= 2 && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-purple-400" />
            事件对比分析
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                相同特征 ({comparisonData.same.count})
              </h4>
              <div className="space-y-2">
                {comparisonData.same.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-400 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                差异特征 ({comparisonData.different.count})
              </h4>
              <div className="space-y-2">
                {comparisonData.different.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-[#111625] rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">对比结论</h4>
            <p className="text-xs text-gray-400">
              所选事件具有高度相似性(平均相似度87%)，均涉及暴力破解攻击模式。
              建议关注外部网络入口的安全防护，加强登录认证机制，考虑实施多因素认证。
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">相似度趋势</h3>
          <div className="h-32 flex items-end gap-2">
            {[95, 88, 72, 85, 65].map((value, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg"
                style={{
                  height: `${value}%`,
                  backgroundColor: value >= 90 ? '#22C55E' : value >= 70 ? '#EAB308' : '#3B82F6',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {['事件1', '事件2', '事件3', '事件4', '事件5'].map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">模式识别</h3>
          <div className="space-y-2">
            {[
              { pattern: '攻击时间集中在工作日', count: '85%', trend: 'up' },
              { pattern: '来源IP分布在特定地区', count: '72%', trend: 'up' },
              { pattern: '攻击目标相似', count: '90%', trend: 'up' },
              { pattern: '攻击手法一致', count: '95%', trend: 'stable' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{item.pattern}</span>
                <div className="flex items-center gap-1">
                  <span className="text-white">{item.count}</span>
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : item.trend === 'down' ? (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  ) : (
                    <Minus className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimilarEventPatternCompare;