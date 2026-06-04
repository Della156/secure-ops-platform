'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search, Filter, Download, RefreshCw, Eye, Bell, BellOff,
  RotateCcw, Send, Clock, AlertTriangle, Shield,
  Activity, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Server, MapPin, MoreHorizontal, X
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/* ===== 类型定义 ===== */

interface AlertRecord {
  id: string;
  alertName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  srcIp: string;
  dstIp: string;
  behaviorType: string;
  alertTime: string;
  pushStatus: 'pushed' | 'pending' | 'failed';
  pushMethod: string;
  pushTarget: string;
  pushTime: string;
  description: string;
  technique: string;
  mitreId: string;
  relatedEvents: number;
}

/* ===== Mock 数据 ===== */

const mockData: AlertRecord[] = [
  { id: 'ALT-2406-001', alertName: '横向渗透-SMB爆破', severity: 'critical', srcIp: '10.10.7.31', dstIp: '10.10.5.20', behaviorType: '横向移动', alertTime: '2026-06-03 08:12:34', pushStatus: 'pushed', pushMethod: '企微', pushTarget: '安全运维组', pushTime: '2026-06-03 08:12:36', description: '检测到来自 10.10.7.31 对文件服务器 10.10.5.20 的 SMB 暴力破解行为，连续 15 次登录失败后成功建立连接。', technique: 'SMB 暴力破解', mitreId: 'T1110.001', relatedEvents: 23 },
  { id: 'ALT-2406-002', alertName: 'C2 通信外传检测', severity: 'critical', srcIp: '10.10.7.31', dstIp: '203.0.113.45', behaviorType: '命令控制', alertTime: '2026-06-03 08:24:18', pushStatus: 'pushed', pushMethod: '短信', pushTarget: '值班管理员', pushTime: '2026-06-03 08:24:20', description: '内网主机 10.10.7.31 与外部 IP 203.0.113.45 建立 HTTPS 连接，流量特征匹配已知 C2 协议。', technique: 'C2 通信', mitreId: 'T1071.001', relatedEvents: 47 },
  { id: 'ALT-2406-003', alertName: 'PowerShell 恶意执行', severity: 'high', srcIp: '10.10.7.31', dstIp: '10.10.7.31', behaviorType: '执行', alertTime: '2026-06-03 08:02:48', pushStatus: 'pending', pushMethod: '企微', pushTarget: '安全运维组', pushTime: '-', description: '终端 10.10.7.31 执行可疑 PowerShell 命令，尝试调用 System.Reflection.Assembly 加载混淆载荷。', technique: 'PowerShell 远程加载', mitreId: 'T1059.001', relatedEvents: 12 },
  { id: 'ALT-2406-004', alertName: 'SQL 注入攻击', severity: 'high', srcIp: '103.45.67.89', dstIp: '10.10.3.5', behaviorType: 'Web 攻击', alertTime: '2026-06-03 07:58:22', pushStatus: 'failed', pushMethod: '邮件', pushTarget: '数据库管理员', pushTime: '2026-06-03 07:58:25', description: '外部 IP 103.45.67.89 对核心数据库 Web 接口发起 SQL 注入尝试，payload 包含 UNION SELECT 语句。', technique: 'SQL 注入', mitreId: 'T1190', relatedEvents: 8 },
  { id: 'ALT-2406-005', alertName: '异常 DNS 隧道', severity: 'high', srcIp: '10.10.7.31', dstIp: '8.8.8.8', behaviorType: '数据外传', alertTime: '2026-06-03 08:30:05', pushStatus: 'pushed', pushMethod: '飞书', pushTarget: '安全运维组', pushTime: '2026-06-03 08:30:08', description: '检测到异常 DNS 查询，域名编码包含 base64 特征，疑似通过 DNS 隧道外传数据。', technique: 'DNS 隧道', mitreId: 'T1572', relatedEvents: 31 },
  { id: 'ALT-2406-006', alertName: '特权账号异常登录', severity: 'medium', srcIp: '192.168.1.50', dstIp: '10.10.4.10', behaviorType: '凭据访问', alertTime: '2026-06-03 07:45:12', pushStatus: 'pushed', pushMethod: '钉钉', pushTarget: '系统管理员', pushTime: '2026-06-03 07:45:15', description: '域管理员账号 admin_w 在非工作时间从非信任终端 192.168.1.50 登录 AD 域控 10.10.4.10。', technique: '凭据滥用', mitreId: 'T1078.002', relatedEvents: 5 },
  { id: 'ALT-2406-007', alertName: 'WMI 远程执行', severity: 'medium', srcIp: '10.10.7.31', dstIp: '10.10.2.18', behaviorType: '横向移动', alertTime: '2026-06-03 08:14:32', pushStatus: 'pending', pushMethod: '企微', pushTarget: '安全运维组', pushTime: '-', description: '主机 10.10.7.31 通过 WMI 远程调用应用服务器 10.10.2.18 的计划任务创建。', technique: 'WMI 远程执行', mitreId: 'T1047', relatedEvents: 9 },
  { id: 'ALT-2406-008', alertName: '敏感端口扫描', severity: 'low', srcIp: '10.10.7.31', dstIp: '10.10.5.0/24', behaviorType: '侦察', alertTime: '2026-06-03 08:10:00', pushStatus: 'failed', pushMethod: '邮件', pushTarget: '安全运维组', pushTime: '2026-06-03 08:10:05', description: '检测到从 10.10.7.31 发起的针对 10.10.5.0/24 网段的端口扫描，涉及 445/3389/22 等敏感端口。', technique: '端口扫描', mitreId: 'T1046', relatedEvents: 156 },
  { id: 'ALT-2406-009', alertName: 'Webshell 上传检测', severity: 'critical', srcIp: '203.0.113.100', dstIp: '10.10.2.18', behaviorType: 'Web 攻击', alertTime: '2026-06-03 08:35:40', pushStatus: 'pending', pushMethod: '企微', pushTarget: '安全运维组', pushTime: '-', description: '外部 IP 向应用服务器上传可疑 ASPX 文件，内容包含 eval 执行函数，匹配 Webshell 特征库。', technique: 'Webshell 上传', mitreId: 'T1505.003', relatedEvents: 16 },
  { id: 'ALT-2406-010', alertName: 'LSASS 凭据转储', severity: 'critical', srcIp: '10.10.7.31', dstIp: '10.10.7.31', behaviorType: '凭据访问', alertTime: '2026-06-03 08:08:42', pushStatus: 'pushed', pushMethod: '短信', pushTarget: '值班管理员', pushTime: '2026-06-03 08:08:45', description: '主机 10.10.7.31 调用 MiniDump 导出 LSASS 进程内存，疑似使用 Mimikatz 进行凭据窃取。', technique: 'LSASS 凭据转储', mitreId: 'T1003.001', relatedEvents: 28 },
];

/* ===== 趋势数据 ===== */

const trendData = [
  { time: '00:00', count: 3, pushed: 2, failed: 1 },
  { time: '04:00', count: 5, pushed: 4, failed: 1 },
  { time: '08:00', count: 12, pushed: 9, failed: 3 },
  { time: '12:00', count: 8, pushed: 7, failed: 1 },
  { time: '16:00', count: 6, pushed: 5, failed: 1 },
  { time: '20:00', count: 4, pushed: 3, failed: 1 },
];

const severityDist = [
  { name: '严重', value: 4, color: '#EF4444' },
  { name: '高危', value: 3, color: '#FF6D00' },
  { name: '中危', value: 2, color: '#EAB308' },
  { name: '低危', value: 1, color: '#22C55E' },
];

/* ===== 工具函数 ===== */

const severityLabel: Record<string, string> = {
  critical: '严重', high: '高危', medium: '中危', low: '低危',
};

const pushStatusLabel: Record<string, string> = {
  pushed: '已推送', pending: '待推送', failed: '推送失败',
};

/* ===== 主组件 ===== */

export function RealtimeAlertPush() {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterPushStatus, setFilterPushStatus] = useState('all');
  const [selected, setSelected] = useState<AlertRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 8;

  // 模拟刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  // 统计数据
  const stats = useMemo(() => ({
    total: mockData.length,
    pushed: mockData.filter(d => d.pushStatus === 'pushed').length,
    pending: mockData.filter(d => d.pushStatus === 'pending').length,
    failed: mockData.filter(d => d.pushStatus === 'failed').length,
    critical: mockData.filter(d => d.severity === 'critical').length,
  }), []);

  // 过滤
  const filtered = useMemo(() => mockData.filter(d => {
    if (search && !d.alertName.includes(search) && !d.srcIp.includes(search) && !d.dstIp.includes(search)) return false;
    if (filterSeverity !== 'all' && d.severity !== filterSeverity) return false;
    if (filterPushStatus !== 'all' && d.pushStatus !== filterPushStatus) return false;
    return true;
  }), [search, filterSeverity, filterPushStatus]);

  // 分页
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  // 翻页时重置到第一页
  useEffect(() => { setCurrentPage(1); }, [search, filterSeverity, filterPushStatus]);

  // 推送状态标签渲染
  const renderPushStatus = (status: string) => {
    const cfg: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
      pushed:   { icon: <CheckCircle className="w-3 h-3" />, label: '已推送', cls: 'bg-green-500/20 text-green-400 border-green-500/40' },
      pending:  { icon: <Clock className="w-3 h-3" />,       label: '待推送', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
      failed:   { icon: <XCircle className="w-3 h-3" />,     label: '推送失败', cls: 'bg-red-500/20 text-red-400 border-red-500/40' },
    };
    const c = cfg[status] || cfg.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded border ${c.cls}`}>
        {c.icon}{c.label}
      </span>
    );
  };

  // 严重程度标签
  const renderSeverity = (sev: string) => {
    const colorMap: Record<string, string> = {
      critical: 'text-red-400 bg-red-500/20 border-red-500/40',
      high:     'text-orange-400 bg-orange-500/20 border-orange-500/40',
      medium:   'text-yellow-400 bg-yellow-500/20 border-yellow-500/40',
      low:      'text-green-400 bg-green-500/20 border-green-500/40',
    };
    const dotMap: Record<string, string> = {
      critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded border ${colorMap[sev] || ''}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotMap[sev] || 'bg-slate-500'}`} />
        {severityLabel[sev] || sev}
      </span>
    );
  };

  // 表格列
  const columns = [
    { key: 'id', title: '告警ID', width: '130px' },
    {
      key: 'severity', title: '级别', width: '70px',
      render: (item: AlertRecord) => renderSeverity(item.severity),
    },
    { key: 'alertName', title: '告警名称' },
    {
      key: 'srcIp', title: '源IP→目的IP', width: '200px',
      render: (item: AlertRecord) => (
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-red-400">{item.srcIp}</span>
          <ChevronLeft className="w-3 h-3 text-slate-600 rotate-180" />
          <span className="text-cyan-300">{item.dstIp}</span>
        </div>
      ),
    },
    { key: 'behaviorType', title: '行为类型', width: '90px' },
    {
      key: 'alertTime', title: '告警时间', width: '155px',
      render: (item: AlertRecord) => (
        <span className="text-slate-400 text-xs font-mono">{item.alertTime}</span>
      ),
    },
    {
      key: 'pushStatus', title: '推送状态', width: '100px',
      render: (item: AlertRecord) => renderPushStatus(item.pushStatus),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* ===== 页面头部 ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">实时告警推送</h1>
          <p className="text-slate-400 mt-1">实时监控安全告警，自动推送告警信息至指定目标</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary" size="sm"
            loading={refreshing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
          >
            刷新
          </Button>
          <Button size="sm" icon={<Download className="w-3.5 h-3.5" />}>导出</Button>
        </div>
      </div>

      {/* ===== KPI 统计 ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="告警总数" value={stats.total} color="#0066FF" icon={<AlertTriangle className="w-4 h-4" />} />
        <StatBox label="严重告警" value={stats.critical} color="#EF4444" icon={<Shield className="w-4 h-4" />} pulse />
        <StatBox label="已推送" value={stats.pushed} color="#22C55E" icon={<CheckCircle className="w-4 h-4" />} />
        <StatBox label="待推送" value={stats.pending} color="#EAB308" icon={<Clock className="w-4 h-4" />} pulse />
        <StatBox label="推送失败" value={stats.failed} color="#FF6D00" icon={<XCircle className="w-4 h-4" />} />
      </div>

      {/* ===== 趋势图 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-3">告警推送趋势（24h）</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="pushed" name="已推送" stackId="a" fill="#22C55E" radius={[2, 2, 0, 0]} />
              <Bar dataKey="failed" name="推送失败" stackId="a" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">严重程度分布</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={severityDist}
                  cx="50%" cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {severityDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {severityDist.map(s => (
              <div key={s.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-slate-400">{s.name}</span>
                <span className="text-slate-200 ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== 过滤工具栏 ===== */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="搜索告警名称 / 源IP / 目的IP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-32">
            <Select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
              options={[
                { value: 'all', label: '全部级别' },
                { value: 'critical', label: '严重' },
                { value: 'high', label: '高危' },
                { value: 'medium', label: '中危' },
                { value: 'low', label: '低危' },
              ]}
            />
          </div>
          <div className="w-32">
            <Select
              value={filterPushStatus}
              onChange={e => setFilterPushStatus(e.target.value)}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'pushed', label: '已推送' },
                { value: 'pending', label: '待推送' },
                { value: 'failed', label: '推送失败' },
              ]}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterSeverity('all'); setFilterPushStatus('all'); }}>
            <Filter className="w-3.5 h-3.5" />清除筛选
          </Button>
          <span className="text-xs text-slate-500 ml-auto">共 {filtered.length} 条</span>
        </div>
      </div>

      {/* ===== 告警推送列表 ===== */}
      <Card padding="none">
        <Table
          columns={columns}
          data={paged}
          rowKey="id"
          onRowClick={setSelected}
          actions={(item: AlertRecord) => (
            <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
              <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>
                <Eye className="w-3.5 h-3.5" />
              </Button>
              {item.pushStatus !== 'pushed' && (
                <Button variant="primary" size="sm">
                  <Bell className="w-3.5 h-3.5" />
                </Button>
              )}
              {item.pushStatus === 'failed' && (
                <Button variant="secondary" size="sm">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        />
      </Card>

      {/* ===== 分页 ===== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary" size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-3.5 h-3.5" />上一页
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Button
              key={p}
              variant={p === currentPage ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="secondary" size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            下一页<ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* ===== 告警详情弹窗 ===== */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `告警详情 - ${selected.id}` : ''}
        width="max-w-3xl"
        footer={
          <div className="flex items-center gap-2">
            {selected && selected.pushStatus !== 'pushed' && (
              <Button
                size="sm"
                icon={<Bell className="w-3.5 h-3.5" />}
                onClick={() => {
                  alert(`已手动推送告警 ${selected?.id} 至 ${selected?.pushTarget}`);
                  setSelected(null);
                }}
              >
                手动推送
              </Button>
            )}
            {selected && selected.pushStatus === 'failed' && (
              <Button
                variant="secondary" size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => {
                  alert(`已重新推送告警 ${selected?.id}`);
                  setSelected(null);
                }}
              >
                重新推送
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>关闭</Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-5">
            {/* 告警概要 */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                selected.severity === 'critical' ? 'bg-red-500/20' :
                selected.severity === 'high' ? 'bg-orange-500/20' :
                selected.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  selected.severity === 'critical' ? 'text-red-400' :
                  selected.severity === 'high' ? 'text-orange-400' :
                  selected.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-white">{selected.alertName}</h3>
                  {renderSeverity(selected.severity)}
                </div>
                <p className="text-sm text-slate-400 mt-1">{selected.description}</p>
              </div>
            </div>

            {/* 基础信息两列 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">告警ID</p>
                <p className="text-sm text-slate-200 font-mono">{selected.id}</p>
              </div>
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">告警时间</p>
                <p className="text-sm text-slate-200 font-mono">{selected.alertTime}</p>
              </div>
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">源地址</p>
                <p className="text-sm text-red-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{selected.srcIp}
                </p>
              </div>
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">目的地址</p>
                <p className="text-sm text-cyan-300 font-mono flex items-center gap-1">
                  <Server className="w-3 h-3" />{selected.dstIp}
                </p>
              </div>
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">行为类型</p>
                <p className="text-sm text-slate-200">{selected.behaviorType}</p>
              </div>
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">关联事件数</p>
                <p className="text-sm text-slate-200">{selected.relatedEvents} 条</p>
              </div>
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">MITRE ATT&CK</p>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  {selected.mitreId} · {selected.technique}
                </span>
              </div>
              <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">攻击阶段</p>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  {selected.severity === 'critical' ? '目标行动' : selected.severity === 'high' ? '横向移动' : '初始访问'}
                </span>
              </div>
            </div>

            {/* 推送信息 */}
            <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-400" />推送信息
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">推送方式</p>
                  <p className="text-sm text-slate-200">{selected.pushMethod}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">推送目标</p>
                  <p className="text-sm text-slate-200">{selected.pushTarget}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">推送状态</p>
                  <div className="mt-0.5">{renderPushStatus(selected.pushStatus)}</div>
                </div>
                {selected.pushStatus !== 'pending' && (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">推送时间</p>
                    <p className="text-sm text-slate-200 font-mono">{selected.pushTime}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 处置建议 */}
            <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-orange-400" />处置建议
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span className="text-slate-300">立即隔离源IP <span className="text-red-400 font-mono">{selected.srcIp}</span> 的网络访问权限</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span className="text-slate-300">对目的资产 <span className="text-cyan-300 font-mono">{selected.dstIp}</span> 进行安全扫描和日志审计</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span className="text-slate-300">更新检测规则，关联 <span className="text-purple-400">{selected.mitreId}</span> 技术进行深度分析</span>
                </li>
              </ul>
            </div>

            {/* 时间线 */}
            <div className="bg-[#111625] border border-[#2A354D] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />事件时间线（最近 3 条）
              </h4>
              <div className="space-y-2">
                {[
                  { time: selected.alertTime, event: `告警触发 — ${selected.alertName}`, type: 'alert' },
                  { time: selected.pushTime !== '-' ? selected.pushTime : '-', event: selected.pushStatus === 'pushed' ? `自动推送至 ${selected.pushTarget}（${selected.pushMethod}）` : selected.pushStatus === 'failed' ? '推送失败，等待重试' : '等待推送中', type: selected.pushStatus },
                  { time: selected.alertTime, event: `关联 ${selected.relatedEvents} 条相关事件`, type: 'info' },
                ].filter(t => t.time !== '-').map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                      t.type === 'alert' ? 'bg-red-500' :
                      t.type === 'pushed' ? 'bg-green-500' :
                      t.type === 'failed' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200">{t.event}</p>
                      <p className="text-slate-500 font-mono text-[10px]">{t.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ===== StatBox 子组件 ===== */

function StatBox({ label, value, color, icon, pulse }: { label: string; value: number; color: string; icon: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{pulse ? <span className="relative"><span className="absolute inset-0 animate-ping rounded-full opacity-75" style={{ backgroundColor: color }} /><span className="relative">{icon}</span></span> : icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default RealtimeAlertPush;
