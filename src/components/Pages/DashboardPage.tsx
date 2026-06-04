'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield, Activity, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Server, Database, Network, Cloud, Terminal, Settings,
  ArrowUpRight, ChevronRight, RefreshCw, Zap, Users, FileText,
  Bug, Lock, Globe, Wifi, Layers, BarChart3, Target,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSystem } from '@/contexts/SystemContext';

// 4 个大屏 widget 动态加载（首页首屏更轻）
const WidgetSkeleton = () => (
  <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 h-[260px] flex items-center justify-center">
    <div className="animate-pulse text-[10px] text-slate-500">加载大屏组件...</div>
  </div>
);
const RealtimeThreatWidget = dynamic(() => import('@/components/Dashboard/RealtimeThreatWidget').then(m => m.RealtimeThreatWidget), { ssr: false, loading: WidgetSkeleton });
const RiskScoreWidget = dynamic(() => import('@/components/Dashboard/RiskScoreWidget').then(m => m.RiskScoreWidget), { ssr: false, loading: WidgetSkeleton });
const IncidentKPIWidget = dynamic(() => import('@/components/Dashboard/IncidentKPIWidget').then(m => m.IncidentKPIWidget), { ssr: false, loading: WidgetSkeleton });
const AssetComplianceWidget = dynamic(() => import('@/components/Dashboard/AssetComplianceWidget').then(m => m.AssetComplianceWidget), { ssr: false, loading: WidgetSkeleton });

// ─── Mock Data ────────────────────────────────────────────────

const alerts = [
  { id: 'ALT-001', level: 'critical', title: '防火墙策略异常检测', source: '威胁监测', time: '2分钟前', detail: '检测到非授权访问尝试，源IP 203.0.113.42' },
  { id: 'ALT-002', level: 'high', title: 'Web应用防火墙告警', source: 'WAF', time: '15分钟前', detail: 'SQL注入攻击尝试已拦截，累计 127 次' },
  { id: 'ALT-003', level: 'warning', title: '异常登录行为', source: '审计系统', time: '28分钟前', detail: '管理员账号 admin 从异常地理位置登录' },
  { id: 'ALT-004', level: 'warning', title: '证书即将过期', source: 'PKI', time: '1小时前', detail: 'API网关SSL证书将在 7 天后过期' },
  { id: 'ALT-005', level: 'info', title: '漏洞扫描完成', source: '漏洞管理', time: '2小时前', detail: '全量扫描完成，发现高危漏洞 23 个' },
];

const taskTrend = [
  { label: '周一', success: 142, failed: 3 },
  { label: '周二', success: 168, failed: 5 },
  { label: '周三', success: 189, failed: 2 },
  { label: '周四', success: 156, failed: 7 },
  { label: '周五', success: 203, failed: 1 },
  { label: '周六', success: 98, failed: 4 },
  { label: '周日', success: 87, failed: 2 },
];

const modules = [
  { id: 'menu-1', label: '自动任务配置', icon: Terminal, color: '#0066FF', desc: '53个任务类型', count: '1,284次' },
  { id: 'menu-2', label: '自动运维', icon: Activity, color: '#00C853', desc: '238个运维场景', count: '96.8%' },
  { id: 'menu-3', label: '自动运营', icon: Shield, color: '#FF9100', desc: '130个运营策略', count: '87.3%' },
  { id: 'menu-4', label: '标准场景自动化', icon: Layers, color: '#A855F7', desc: '94个标准场景', count: '92.1%' },
  { id: 'menu-5', label: '人机协同工作台', icon: Users, color: '#06B6D4', desc: '40个工作台', count: '45次' },
  { id: 'menu-6', label: '运维配置中心', icon: Settings, color: '#F472B6', desc: '57个配置项', count: '100%' },
];

const todos = [
  { id: 'TD-001', title: '防火墙策略异常检测 - 需人工确认', priority: 'critical', module: '威胁监测', time: '2026-06-03 10:30' },
  { id: 'TD-002', title: 'WAF规则更新建议 - 23条新规则待审', priority: 'high', module: '安全运营', time: '2026-06-03 09:15' },
  { id: 'TD-003', title: '主机基线合规检查 - 8台服务器不合规', priority: 'high', module: '基线管理', time: '2026-06-03 08:45' },
  { id: 'TD-004', title: '漏洞修复跟踪 - 5个高危漏洞超期', priority: 'critical', module: '漏洞管理', time: '2026-06-03 08:00' },
  { id: 'TD-005', title: '日志存储空间预警 - 使用率87%', priority: 'medium', module: '系统监控', time: '2026-06-02 16:30' },
];

const systemStatus = [
  { name: '核心服务', status: 'healthy', uptime: '99.99%' },
  { name: '数据库集群', status: 'healthy', uptime: '99.97%' },
  { name: '消息队列', status: 'degraded', uptime: '98.5%' },
  { name: '缓存服务', status: 'healthy', uptime: '99.99%' },
  { name: '日志采集', status: 'healthy', uptime: '99.95%' },
  { name: '告警引擎', status: 'healthy', uptime: '99.98%' },
];

const LEVEL_CONFIG = {
  critical: { label: '严重', bg: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-500' },
  high: { label: '高危', bg: 'bg-orange-500/15 text-orange-400 border-orange-500/20', dot: 'bg-orange-500' },
  warning: { label: '警告', bg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-500' },
  info: { label: '信息', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dot: 'bg-blue-500' },
};

const PRIORITY_CONFIG = {
  critical: { label: '紧急', bg: 'bg-red-500/10 text-red-400' },
  high: { label: '高', bg: 'bg-orange-500/10 text-orange-400' },
  medium: { label: '中', bg: 'bg-yellow-500/10 text-yellow-400' },
};

// ─── Sub-components ──────────────────────────────────────────

function MetricCard({ title, value, subtitle, icon: Icon, color, trend }: {
  title: string; value: string | number; subtitle?: string; icon: React.ComponentType<any>; color: string; trend?: { value: string; up: boolean };
}) {
  return (
    <div className="bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl p-5 hover:border-[#3A4560] transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#6B7280] tracking-wider uppercase">{title}</p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && <p className="text-[10px] text-[#6B7280]">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color}/10 group-hover:${color}/20 transition-colors`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-[11px]">
          <span className={trend.up ? 'text-emerald-400' : 'text-red-400'}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-[#6B7280]">较昨日</span>
        </div>
      )}
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const degree = (score / 100) * 180;
  const color = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#00C853';
  const label = score >= 70 ? '高风险' : score >= 40 ? '中风险' : '低风险';

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative w-32 h-16 overflow-hidden">
        <svg className="w-32 h-16" viewBox="0 0 120 60">
          <path d="M10 50 A50 50 0 0 1 110 50" fill="none" stroke="#2A354D" strokeWidth="8" strokeLinecap="round" />
          <path d="M10 50 A50 50 0 0 1 110 50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 157} 157`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <span className="text-3xl font-bold tracking-tight" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${score >= 70 ? 'bg-red-500/15 text-red-400' : score >= 40 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
        {label}
      </span>
    </div>
  );
}

function AlertItem({ alert }: { alert: typeof alerts[0] }) {
  const cfg = LEVEL_CONFIG[alert.level];
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-[#1A2332]/50 rounded-lg transition-colors group cursor-pointer border-b border-[#2A354D]/30 last:border-0">
      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cfg.bg}`}>{cfg.label}</span>
          <span className="text-xs text-[#6B7280]">{alert.time}</span>
        </div>
        <p className="text-sm text-[#E5E7EB] mt-1 truncate">{alert.title}</p>
        <p className="text-[11px] text-[#6B7280] mt-0.5 truncate">{alert.detail}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}

function BarChart() {
  const maxVal = Math.max(...taskTrend.flatMap(d => [d.success, d.failed]));
  return (
    <div className="flex items-end justify-between gap-3 h-36 pt-4">
      {taskTrend.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center justify-end h-28 gap-0.5">
            <div
              className="w-full bg-red-500/60 rounded-t-sm transition-all hover:bg-red-500/80"
              style={{ height: `${(d.failed / maxVal) * 100}%`, minHeight: d.failed > 0 ? '3px' : '0' }}
            />
            <div
              className="w-full bg-blue-500/70 rounded-t-sm transition-all hover:bg-blue-500/90"
              style={{ height: `${(d.success / maxVal) * 100}%`, minHeight: '4px' }}
            />
          </div>
          <span className="text-[10px] text-[#6B7280]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const { setActiveMenu } = useSystem();

  useEffect(() => {
    const now = new Date();
    setCurrentTime(`${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  }, []);

  const filteredAlerts = alertFilter === 'all' ? alerts : alerts.filter(a => a.level === alertFilter);

  return (
    <div className="min-h-screen bg-[#111625]">
      {/* ── Top Header Bar ── */}
      <div className="sticky top-0 z-40 bg-[#111625]/80 backdrop-blur-xl border-b border-[#2A354D]/40 px-6 py-3">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#F3F4F6] font-semibold text-sm">网络安全态势感知平台</span>
            </div>
            <span className="text-[10px] text-[#6B7280] px-3 py-1 bg-[#1E2736] rounded-full border border-[#2A354D]/50">
              {currentTime || '加载中...'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              系统运行正常
            </span>
            <button className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#F3F4F6] hover:bg-[#1E2736] transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 max-w-[1600px] mx-auto space-y-5">
        {/* ── Metrics Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl p-4 lg:col-span-1">
            <p className="text-[10px] font-medium text-[#6B7280] tracking-wider uppercase mb-1">系统风险评分</p>
            <RiskGauge score={37} />
          </div>
          <MetricCard title="活跃告警" value="23" subtitle="未处理" icon={AlertTriangle} color="text-red-400" trend={{ value: '12%', up: false }} />
          <MetricCard title="今日任务" value="1,043" subtitle="已完成 987" icon={Activity} color="text-blue-400" trend={{ value: '8.3%', up: true }} />
          <MetricCard title="自动化率" value="94.7%" subtitle="较昨日 +2.1%" icon={Zap} color="text-emerald-400" trend={{ value: '2.1%', up: true }} />
          <MetricCard title="在线资产" value="2,847" subtitle="覆盖率 96.3%" icon={Server} color="text-purple-400" />
        </div>

        {/* ── 4 大屏 Widget（2x2 网格，动态加载） ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RealtimeThreatWidget />
          <RiskScoreWidget />
          <IncidentKPIWidget />
          <AssetComplianceWidget />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Left Column: Alerts Feed */}
          <div className="xl:col-span-1 bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-[#E5E7EB]">实时告警</span>
                <span className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full">{alerts.length}</span>
              </div>
              <div className="flex gap-1">
                {['all', 'critical', 'high', 'warning'].map(key => (
                  <button key={key} onClick={() => setAlertFilter(key)}
                    className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                      alertFilter === key ? 'bg-[#2A354D] text-white' : 'text-[#6B7280] hover:text-[#E5E7EB]'
                    }`}
                  >
                    {key === 'all' ? '全部' : LEVEL_CONFIG[key as keyof typeof LEVEL_CONFIG]?.label || key}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-[#2A354D]/30 max-h-[420px] overflow-y-auto">
              {filteredAlerts.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-[#2A354D]/40">
              <button className="text-[11px] text-[#0066FF] hover:text-[#0080FF] flex items-center gap-1">
                查看全部告警 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right 2 Columns */}
          <div className="xl:col-span-2 space-y-5">

            {/* Task Trend + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-[#E5E7EB]">自动化任务执行趋势</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500/70" /> 成功</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500/60" /> 失败</span>
                  </div>
                </div>
                <BarChart />
              </div>

              <div className="bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-[#E5E7EB]">快捷操作</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: '新建自动化任务', icon: Terminal, color: 'text-blue-400' },
                    { label: '查看告警详情', icon: AlertTriangle, color: 'text-red-400' },
                    { label: '漏洞扫描报告', icon: Bug, color: 'text-orange-400' },
                    { label: '系统健康检查', icon: Activity, color: 'text-emerald-400' },
                  ].map((item, i) => (
                    <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#1A2332] transition-colors text-left">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs text-[#D1D5DB]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Module Grid */}
            <div className="bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-sm font-medium text-[#E5E7EB]">功能模块概览</span>
                </div>
                <span className="text-[10px] text-[#6B7280]">6大模块 · 699个自动化场景</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {modules.map(mod => (
                  <button key={mod.id}
                    onClick={() => setActiveMenu(mod.id)}
                    className="group relative bg-[#1A2332]/50 border border-[#2A354D]/40 rounded-xl p-4 hover:border-[#3A4560] transition-all duration-300 text-left overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(600px circle at 50% 0%, ${mod.color}08, transparent)` }} />
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3`}
                        style={{ backgroundColor: `${mod.color}15` }}>
                        <mod.icon className="w-4 h-4" style={{ color: mod.color }} />
                      </div>
                      <p className="text-xs font-medium text-[#E5E7EB] group-hover:text-white transition-colors">{mod.label}</p>
                      <p className="text-[10px] text-[#6B7280] mt-1">{mod.desc}</p>
                      <p className="text-[11px] font-semibold mt-2" style={{ color: mod.color }}>{mod.count}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Todos + System Status ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* High Priority Todos */}
          <div className="bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-[#E5E7EB]">高危待办</span>
                <span className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full">{todos.length}</span>
              </div>
              <button className="text-[11px] text-[#0066FF] hover:text-[#0080FF]">查看全部</button>
            </div>
            <div className="divide-y divide-[#2A354D]/30">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#1A2332]/50 transition-colors cursor-pointer">
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    todo.priority === 'critical' ? 'bg-red-500' : todo.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E5E7EB] truncate">{todo.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        PRIORITY_CONFIG[todo.priority as keyof typeof PRIORITY_CONFIG]?.bg || ''
                      } ${PRIORITY_CONFIG[todo.priority as keyof typeof PRIORITY_CONFIG]?.label ? 'text-' + (todo.priority === 'critical' ? 'red' : todo.priority === 'high' ? 'orange' : 'yellow') + '-400' : ''}`}>
                        {PRIORITY_CONFIG[todo.priority as keyof typeof PRIORITY_CONFIG]?.label || todo.priority}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">{todo.module}</span>
                      <span className="text-[10px] text-[#6B7280]">{todo.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#4B5563] mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#1E2736]/80 backdrop-blur-sm border border-[#2A354D]/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-[#E5E7EB]">系统运行状态</span>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                全部正常
              </span>
            </div>
            <div className="space-y-2">
              {systemStatus.map(s => (
                <div key={s.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1A2332]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${s.status === 'healthy' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-[#D1D5DB]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] ${s.status === 'healthy' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {s.status === 'healthy' ? '正常' : '降级'}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">{s.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center text-[10px] text-[#4B5563] pt-4 pb-2 border-t border-[#2A354D]/30">
          网络安全智能化运维平台 v1.0.0 · 6大模块 699个自动化场景 · 数据模拟仅供参考
        </div>
      </div>
    </div>
  );
}
