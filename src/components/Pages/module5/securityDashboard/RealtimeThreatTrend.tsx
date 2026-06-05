'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, Radio, AlertTriangle, Globe, MapPin, Clock, Zap,
  Shield, Wifi, Server, TrendingUp, RefreshCw, Download, Maximize2,
  Eye, ChevronRight, Bell, Filter, Pause, Play, Crosshair
} from 'lucide-react';

/**
 * 5.3-2 实时威胁事件趋势
 *
 * 实时监控大屏：
 * - 24 小时时间序列（5 分钟粒度，可滚动）
 * - 事件类型分布
 * - TOP 攻击源 IP
 * - 实时事件流（自动滚动）
 * - 地理分布（中国地图简化）
 */

interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: 'web_attack' | 'malware' | 'brute_force' | 'sql_injection' | 'xss' | 'ddos' | 'data_leak' | 'privilege_escalation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  sourceIp: string;
  sourceLocation: string;
  targetAsset: string;
  description: string;
  status: 'new' | 'investigating' | 'mitigated' | 'closed';
}

interface AttackSource {
  ip: string;
  location: string;
  country: string;
  count: number;
  threatType: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  lastSeen: string;
}

// ========== Mock Data ==========
const generateTimeSeries = (points: number = 288): { time: string; value: number; type: 'attack' | 'alert' | 'block' }[] => {
  // 288 = 24h × 12 (5min 粒度)
  const data: { time: string; value: number; type: 'attack' | 'alert' | 'block' }[] = [];
  const now = new Date('2026-06-02T17:00:00');
  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5 * 60 * 1000);
    const hour = t.getHours();
    // 业务高峰期 (9-12, 14-17, 19-22) 攻击更多
    const isPeak = (hour >= 9 && hour <= 12) || (hour >= 14 && hour <= 17) || (hour >= 19 && hour <= 22);
    const baseValue = isPeak ? 60 : 20;
    const noise = Math.sin(i * 0.3) * 15 + Math.random() * 20;
    const value = Math.max(0, Math.round(baseValue + noise));
    data.push({
      time: `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`,
      value,
      type: Math.random() > 0.6 ? 'block' : Math.random() > 0.3 ? 'alert' : 'attack',
    });
  }
  return data;
};

const mockEvents: ThreatEvent[] = [
  { id: 'EVT-7842', timestamp: new Date('2026-06-02T17:00:23'), type: 'sql_injection', severity: 'critical', sourceIp: '203.156.89.42', sourceLocation: '俄罗斯·莫斯科', targetAsset: 'WEB-APP-12', description: '检测到针对 /api/users 的 SQL 注入攻击', status: 'investigating' },
  { id: 'EVT-7841', timestamp: new Date('2026-06-02T17:00:15'), type: 'brute_force', severity: 'high', sourceIp: '45.79.123.18', sourceLocation: '美国·亚特兰大', targetAsset: 'SSH-Bastion-01', description: 'SSH 暴力破解尝试 1567 次', status: 'mitigated' },
  { id: 'EVT-7840', timestamp: new Date('2026-06-02T16:59:58'), type: 'malware', severity: 'critical', sourceIp: '内网-192.168.10.156', sourceLocation: '内网·研发部', targetAsset: 'DEV-LAPTOP-3421', description: '检测到 Emotet 木马变种', status: 'investigating' },
  { id: 'EVT-7839', timestamp: new Date('2026-06-02T16:59:42'), type: 'web_attack', severity: 'high', sourceIp: '185.220.101.45', sourceLocation: '德国·柏林', targetAsset: 'WEB-APP-08', description: 'CC 攻击触发，峰值 8500 QPS', status: 'mitigated' },
  { id: 'EVT-7838', timestamp: new Date('2026-06-02T16:59:30'), type: 'xss', severity: 'medium', sourceIp: '139.155.45.78', sourceLocation: '中国·广州', targetAsset: 'WEB-APP-12', description: '存储型 XSS 攻击尝试', status: 'closed' },
  { id: 'EVT-7837', timestamp: new Date('2026-06-02T16:59:18'), type: 'data_leak', severity: 'critical', sourceIp: '内网-10.20.5.88', sourceLocation: '内网·财务部', targetAsset: 'DB-FINANCE-01', description: '检测到 2.3GB 异常外发流量', status: 'investigating' },
  { id: 'EVT-7836', timestamp: new Date('2026-06-02T16:59:05'), type: 'privilege_escalation', severity: 'high', sourceIp: '内网-10.10.8.34', sourceLocation: '内网·运维区', targetAsset: 'HOST-OP-09', description: '检测到 sudo 权限提升尝试', status: 'new' },
  { id: 'EVT-7835', timestamp: new Date('2026-06-02T16:58:50'), type: 'ddos', severity: 'high', sourceIp: '103.224.182.15', sourceLocation: '中国·香港', targetAsset: 'EDGE-FW-01', description: 'SYN Flood 攻击，已自动清洗', status: 'mitigated' },
  { id: 'EVT-7834', timestamp: new Date('2026-06-02T16:58:32'), type: 'sql_injection', severity: 'high', sourceIp: '198.51.100.78', sourceLocation: '巴西·圣保罗', targetAsset: 'WEB-APP-05', description: '基于时间的盲注攻击', status: 'mitigated' },
  { id: 'EVT-7833', timestamp: new Date('2026-06-02T16:58:18'), type: 'web_attack', severity: 'medium', sourceIp: '121.36.45.92', sourceLocation: '中国·深圳', targetAsset: 'API-GW-01', description: 'API 异常调用模式', status: 'closed' },
];

const mockAttackSources: AttackSource[] = [
  { ip: '203.156.89.42', location: '莫斯科', country: '俄罗斯', count: 4823, threatType: 'SQL 注入', riskLevel: 'critical', lastSeen: '12 秒前' },
  { ip: '185.220.101.45', location: '柏林', country: '德国', count: 3502, threatType: 'CC 攻击', riskLevel: 'high', lastSeen: '1 分钟前' },
  { ip: '45.79.123.18', location: '亚特兰大', country: '美国', count: 2891, threatType: 'SSH 爆破', riskLevel: 'high', lastSeen: '2 分钟前' },
  { ip: '103.224.182.15', location: '香港', country: '中国', count: 2156, threatType: 'DDoS', riskLevel: 'high', lastSeen: '5 分钟前' },
  { ip: '198.51.100.78', location: '圣保罗', country: '巴西', count: 1823, threatType: '盲注', riskLevel: 'medium', lastSeen: '8 分钟前' },
  { ip: '139.155.45.78', location: '广州', country: '中国', count: 1234, threatType: 'XSS', riskLevel: 'medium', lastSeen: '12 分钟前' },
  { ip: '194.5.249.180', location: '巴黎', country: '法国', count: 945, threatType: '扫描探测', riskLevel: 'low', lastSeen: '15 分钟前' },
];

const eventTypeLabels: Record<ThreatEvent['type'], string> = {
  web_attack: 'Web 攻击',
  malware: '恶意软件',
  brute_force: '暴力破解',
  sql_injection: 'SQL 注入',
  xss: 'XSS',
  ddos: 'DDoS',
  data_leak: '数据外泄',
  privilege_escalation: '权限提升',
};

const severityColors: Record<ThreatEvent['severity'], { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-500' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-500' },
};

// ========== 组件 ==========
function RealtimeLineChart({ data }: { data: { time: string; value: number; type: 'attack' | 'alert' | 'block' }[] }) {
  const w = 800;
  const h = 200;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const maxV = Math.max(...data.map(d => d.value), 100);
  const xStep = (w - padL - padR) / (data.length - 1);
  const yScale = (v: number) => padT + (h - padT - padB) * (1 - v / maxV);

  const attackPath = data.map((d, i) => {
    const x = padL + i * xStep;
    const y = yScale(d.value);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  const areaPath = attackPath + ` L ${padL + (data.length - 1) * xStep},${h - padB} L ${padL},${h - padB} Z`;

  // X 轴时间标签（每 2 小时一个）
  const xLabels: { x: number; label: string }[] = [];
  for (let i = 0; i < data.length; i += 24) {
    if (data[i]) {
      xLabels.push({
        x: padL + i * xStep,
        label: data[i].time,
      });
    }
  }

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="realtimeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 网格 */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={padL} y1={padT + (h - padT - padB) * p} x2={w - padR} y2={padT + (h - padT - padB) * p} stroke="rgba(255,255,255,0.05)" />
      ))}
      {/* Y 轴标签 */}
      {[0, 0.5, 1].map((p, i) => (
        <text key={i} x={padL - 8} y={padT + (h - padT - padB) * (1 - p) + 4} fill="#64748B" fontSize="10" textAnchor="end">
          {Math.round(maxV * p)}
        </text>
      ))}
      {/* 区域 + 折线 */}
      <path d={areaPath} fill="url(#realtimeGrad)" />
      <path d={attackPath} fill="none" stroke="#EF4444" strokeWidth="1.5" />
      {/* X 轴 */}
      {xLabels.map((l, i) => (
        <text key={i} x={l.x} y={h - padB + 18} fill="#64748B" fontSize="10" textAnchor="middle">{l.label}</text>
      ))}
    </svg>
  );
}

function EventTypeDistribution() {
  const dist = [
    { type: 'web_attack', label: 'Web 攻击', count: 412, color: '#EF4444' },
    { type: 'brute_force', label: '暴力破解', count: 286, color: '#F59E0B' },
    { type: 'sql_injection', label: 'SQL 注入', count: 198, color: '#8B5CF6' },
    { type: 'ddos', label: 'DDoS', count: 156, color: '#3B82F6' },
    { type: 'malware', label: '恶意软件', count: 89, color: '#10B981' },
    { type: 'xss', label: 'XSS', count: 64, color: '#F97316' },
    { type: 'data_leak', label: '数据外泄', count: 23, color: '#EC4899' },
  ];
  const total = dist.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="space-y-2">
      {dist.map(d => {
        const pct = (d.count / total * 100).toFixed(1);
        return (
          <div key={d.type}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">{d.label}</span>
              <span className="text-gray-500">{d.count} <span className="text-gray-600">({pct}%)</span></span>
            </div>
            <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EventStream({ events }: { events: ThreatEvent[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [localEvents, setLocalEvents] = useState(events);

  // 模拟实时滚动
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      // 随机插入新事件
      const newEvent: ThreatEvent = {
        id: `EVT-${Math.floor(Math.random() * 9999)}`,
        timestamp: new Date(),
        type: ['web_attack', 'malware', 'brute_force', 'sql_injection', 'xss'][Math.floor(Math.random() * 5)] as ThreatEvent['type'],
        severity: (['critical', 'high', 'medium'] as ThreatEvent['severity'][])[Math.floor(Math.random() * 3)],
        sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        sourceLocation: '内网',
        targetAsset: ['WEB-APP-01', 'DB-01', 'HOST-09', 'API-GW'][Math.floor(Math.random() * 4)],
        description: '自动检测到新的威胁事件',
        status: 'new',
      };
      setLocalEvents(prev => [newEvent, ...prev].slice(0, 30));
    }, 3000);
    return () => clearInterval(t);
  }, [paused]);

  // 自动滚动
  useEffect(() => {
    if (scrollRef.current && !paused) {
      scrollRef.current.scrollTop = 0;
    }
  }, [localEvents, paused]);

  return (
    <div className="space-y-1 max-h-[420px] overflow-hidden" ref={scrollRef}>
      {localEvents.map((e) => {
        const sc = severityColors[e.severity as keyof typeof severityColors];
        return (
          <div key={e.id} className={`${sc.bg} rounded p-2 text-xs border-l-2 ${sc.dot.replace('bg-', 'border-')}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`font-mono text-[10px] ${sc.text}`}>{e.id}</span>
                  <span className={`px-1.5 py-0 rounded text-[10px] ${sc.bg} ${sc.text}`}>
                    {e.severity.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-[10px]">{eventTypeLabels[e.type]}</span>
                </div>
                <div className="text-gray-300 truncate">{e.description}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <Crosshair className="w-2.5 h-2.5" />
                    {e.sourceIp}
                  </span>
                  <span>→</span>
                  <span>{e.targetAsset}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500">
                  {e.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <button className="text-[10px] text-blue-400 hover:text-blue-300 mt-0.5">查看</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GeoDistribution() {
  // 简化的中国地图（用文字模拟）
  const cities = [
    { name: '北京', count: 245, top: '20%', left: '60%' },
    { name: '上海', count: 198, top: '55%', left: '78%' },
    { name: '广州', count: 167, top: '75%', left: '65%' },
    { name: '深圳', count: 142, top: '80%', left: '68%' },
    { name: '成都', count: 89, top: '55%', left: '38%' },
    { name: '武汉', count: 76, top: '50%', left: '55%' },
    { name: '西安', count: 54, top: '38%', left: '45%' },
    { name: '杭州', count: 112, top: '55%', left: '72%' },
  ];

  return (
    <div className="relative h-[200px] bg-[#111625] rounded-lg overflow-hidden">
      {/* 地图占位 */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
        <Globe className="w-8 h-8 opacity-20" />
        <span className="ml-2 opacity-50">中国地图 · 攻击源分布</span>
      </div>
      {/* 城市点位 */}
      {cities.map(c => {
        const size = Math.max(4, Math.min(20, c.count / 15));
        return (
          <div
            key={c.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: c.top, left: c.left }}
          >
            <div
              className="rounded-full bg-red-500/60 border border-red-400 animate-pulse"
              style={{ width: size, height: size }}
            />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-gray-300 whitespace-nowrap">
              {c.name} {c.count}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ========== 主组件 ==========
export function RealtimeThreatTrend() {
  const [timeSeries] = useState(() => generateTimeSeries(288));
  const [playing, setPlaying] = useState(true);
  const [timeWindow, setTimeWindow] = useState<'1h' | '6h' | '24h'>('24h');

  // 当前时间显示
  const [now, setNow] = useState(new Date('2026-06-02T17:00:30'));
  useEffect(() => {
    const t = setInterval(() => {
      setNow(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // 实时统计
  const totalEvents = timeSeries.reduce((acc, d) => acc + d.value, 0);
  const blockRate = ((timeSeries.filter(d => d.type === 'block').length / timeSeries.length) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            实时威胁事件趋势
          </h2>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {now.toLocaleString('zh-CN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-[#2A354D] rounded overflow-hidden">
            {(['1h', '6h', '24h'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeWindow(t)}
                className={`px-3 py-1.5 text-xs ${
                  timeWindow === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#111625] text-gray-400 hover:bg-[#20293F]'
                }`}
              >
                {t === '1h' ? '1 小时' : t === '6h' ? '6 小时' : '24 小时'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPlaying(!playing)}
            className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {playing ? '暂停' : '继续'}
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            筛选
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            全屏
          </button>
        </div>
      </div>

      {/* 实时统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '24h 事件总数', value: totalEvents.toLocaleString(), icon: <Activity className="w-4 h-4" />, color: 'red' },
          { label: '高危事件', value: '127', icon: <AlertTriangle className="w-4 h-4" />, color: 'orange' },
          { label: '自动拦截', value: '982', icon: <Shield className="w-4 h-4" />, color: 'green' },
          { label: '拦截率', value: `${blockRate}%`, icon: <Zap className="w-4 h-4" />, color: 'blue' },
        ].map((s, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className={`text-${s.color}-400`}>{s.icon}</div>
            </div>
            <div className="text-2xl font-bold text-white mt-2">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 时间序列 + 事件流 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 时间序列图 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              威胁事件时间序列（5 分钟粒度）
            </h3>
          </div>
          <RealtimeLineChart data={timeSeries} />
        </div>

        {/* 实时事件流 */}
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-400" />
              实时事件流
            </h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              实时
            </span>
          </div>
          <EventStream events={mockEvents} />
        </div>
      </div>

      {/* 类型分布 + 攻击源 + 地理分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 类型分布 */}
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            事件类型分布
          </h3>
          <EventTypeDistribution />
        </div>

        {/* TOP 攻击源 */}
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-red-400" />
            TOP 攻击源 IP
          </h3>
          <div className="space-y-2 max-h-[260px] overflow-y-auto">
            {mockAttackSources.map((s, i) => {
              const sc = severityColors[s.riskLevel as keyof typeof severityColors];
              return (
                <div key={s.ip} className="bg-[#111625] rounded p-2 hover:bg-[#20293F]/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-4">#{i + 1}</span>
                      <div>
                        <div className="text-xs font-mono text-white">{s.ip}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {s.location} · {s.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${sc.text}`}>{s.count.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500">{s.lastSeen}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                    <span>{s.threatType}</span>
                    <span className={`px-1.5 rounded ${sc.bg} ${sc.text}`}>
                      {s.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 地理分布 */}
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            攻击源地理分布
          </h3>
          <GeoDistribution />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#111625] rounded p-2">
              <div className="text-lg font-bold text-red-400">23</div>
              <div className="text-[10px] text-gray-500">国家</div>
            </div>
            <div className="bg-[#111625] rounded p-2">
              <div className="text-lg font-bold text-orange-400">67</div>
              <div className="text-[10px] text-gray-500">城市</div>
            </div>
            <div className="bg-[#111625] rounded p-2">
              <div className="text-lg font-bold text-blue-400">1.2K</div>
              <div className="text-[10px] text-gray-500">IP 数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealtimeThreatTrend;
