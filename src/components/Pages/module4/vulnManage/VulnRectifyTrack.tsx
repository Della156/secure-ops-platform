'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Eye, UserPlus, UserMinus, AlertTriangle,
  Clock, CheckCircle2, XCircle, RotateCcw, MessageSquare,
  ChevronRight, X, Send, FileText, ShieldAlert, TrendingUp,
  Calendar, Filter, RefreshCw, Bell, GitBranch
} from 'lucide-react';

// ============= 类型定义 =============
type VulnLevel = 'critical' | 'high' | 'medium' | 'low';
type RectifyStatus =
  | 'pending_assign'   // 待指派
  | 'pending_accept'   // 待确认
  | 'in_progress'      // 整改中
  | 'pending_retest'   // 待复测
  | 'rejected'         // 已驳回
  | 'closed';          // 已闭环

interface RectifyTask {
  id: string;
  vulnName: string;
  cveId: string;
  vulnLevel: VulnLevel;
  cvssScore: number;
  affectedAsset: string;
  assetIp: string;
  assetDept: string;
  ownerDept: string;
  owner: string;
  ownerPhone: string;
  status: RectifyStatus;
  createdAt: string;
  deadline: string;
  acceptedAt: string | null;
  retestAt: string | null;
  closedAt: string | null;
  progress: number;
  solution: string;
  remark: string;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  time: string;
  type: 'created' | 'assigned' | 'accepted' | 'updated' | 'retest_pass' | 'retest_fail' | 'rejected' | 'closed' | 'urge';
  actor: string;
  content: string;
}

// ============= Mock 数据 =============
const mockTasks: RectifyTask[] = [
  {
    id: 'VR-2026-0001',
    vulnName: 'Apache Log4j2 远程代码执行漏洞',
    cveId: 'CVE-2021-44228',
    vulnLevel: 'critical',
    cvssScore: 10.0,
    affectedAsset: '电商业务前置网关',
    assetIp: '10.20.30.45',
    assetDept: '电商业务部',
    ownerDept: '电商业务部 / 应用运维组',
    owner: '张明',
    ownerPhone: '138****5621',
    status: 'in_progress',
    createdAt: '2026-05-28 10:30:00',
    deadline: '2026-06-05 23:59:59',
    acceptedAt: '2026-05-28 14:20:00',
    retestAt: null,
    closedAt: null,
    progress: 65,
    solution: '升级 Log4j2 至 2.17.0 或以上版本，禁用 JNDI 查找功能',
    remark: '业务高峰前必须完成',
    timeline: [
      { time: '2026-05-28 10:30:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-28 11:00:00', type: 'assigned', actor: '李华(安全运营)', content: '指派给张明(电商业务部 / 应用运维组)' },
      { time: '2026-05-28 14:20:00', type: 'accepted', actor: '张明', content: '已接受整改任务' },
      { time: '2026-05-30 09:15:00', type: 'updated', actor: '张明', content: '更新整改进度至 65%，Log4j2 已升级至 2.17.1' },
    ],
  },
  {
    id: 'VR-2026-0002',
    vulnName: 'Windows Print Spooler 远程代码执行',
    cveId: 'CVE-2021-34527',
    vulnLevel: 'critical',
    cvssScore: 8.8,
    affectedAsset: '财务部-财务服务器-01',
    assetIp: '10.50.10.12',
    assetDept: '财务部',
    ownerDept: '财务部 / 桌面运维',
    owner: '王丽',
    ownerPhone: '139****8832',
    status: 'pending_retest',
    createdAt: '2026-05-25 09:00:00',
    deadline: '2026-06-01 23:59:59',
    acceptedAt: '2026-05-25 11:30:00',
    retestAt: null,
    closedAt: null,
    progress: 100,
    solution: '安装 KB5004945 安全更新，禁用 Print Spooler 服务',
    remark: '',
    timeline: [
      { time: '2026-05-25 09:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-25 11:30:00', type: 'accepted', actor: '王丽', content: '已接受整改任务' },
      { time: '2026-05-29 16:00:00', type: 'updated', actor: '王丽', content: '已安装 KB5004945，禁用 Print Spooler，请复测' },
      { time: '2026-05-29 17:00:00', type: 'urge', actor: '李华(安全运营)', content: '提醒：请及时申请复测' },
    ],
  },
  {
    id: 'VR-2026-0003',
    vulnName: 'OpenSSL 缓冲区溢出漏洞',
    cveId: 'CVE-2022-3602',
    vulnLevel: 'high',
    cvssScore: 7.5,
    affectedAsset: 'API 网关集群',
    assetIp: '10.30.10.10-15',
    assetDept: '基础架构部',
    ownerDept: '基础架构部 / 中间件组',
    owner: '陈强',
    ownerPhone: '136****4421',
    status: 'closed',
    createdAt: '2026-05-20 14:00:00',
    deadline: '2026-05-28 23:59:59',
    acceptedAt: '2026-05-20 16:30:00',
    retestAt: '2026-05-27 10:00:00',
    closedAt: '2026-05-27 10:15:00',
    progress: 100,
    solution: '升级 OpenSSL 至 3.0.7 或以上版本',
    remark: '',
    timeline: [
      { time: '2026-05-20 14:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-20 16:30:00', type: 'accepted', actor: '陈强', content: '已接受整改任务' },
      { time: '2026-05-26 23:00:00', type: 'updated', actor: '陈强', content: '已升级 OpenSSL 至 3.0.7' },
      { time: '2026-05-27 10:00:00', type: 'retest_pass', actor: '系统', content: '复测通过，漏洞已修复' },
      { time: '2026-05-27 10:15:00', type: 'closed', actor: '系统', content: '整改任务已闭环' },
    ],
  },
  {
    id: 'VR-2026-0004',
    vulnName: 'Linux 内核权限提升漏洞',
    cveId: 'CVE-2023-0386',
    vulnLevel: 'high',
    cvssScore: 7.8,
    affectedAsset: '核心数据库服务器',
    assetIp: '10.40.20.88',
    assetDept: '数据部',
    ownerDept: '数据部 / 数据库组',
    owner: '刘伟',
    ownerPhone: '137****1199',
    status: 'pending_assign',
    createdAt: '2026-06-01 08:00:00',
    deadline: '2026-06-10 23:59:59',
    acceptedAt: null,
    retestAt: null,
    closedAt: null,
    progress: 0,
    solution: '升级 Linux 内核至 6.2 或以上版本',
    remark: '需业务停机窗口',
    timeline: [
      { time: '2026-06-01 08:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
    ],
  },
  {
    id: 'VR-2026-0005',
    vulnName: 'Spring Framework 远程代码执行',
    cveId: 'CVE-2022-22965',
    vulnLevel: 'critical',
    cvssScore: 9.8,
    affectedAsset: '客户管理系统',
    assetIp: '10.60.30.21',
    assetDept: '客户运营部',
    ownerDept: '客户运营部 / 应用开发',
    owner: '赵敏',
    ownerPhone: '135****7720',
    status: 'rejected',
    createdAt: '2026-05-30 11:00:00',
    deadline: '2026-06-08 23:59:59',
    acceptedAt: '2026-05-30 14:00:00',
    retestAt: null,
    closedAt: null,
    progress: 30,
    solution: '升级 Spring Framework 至 5.3.18 或以上版本',
    remark: '需要重新评估业务影响',
    timeline: [
      { time: '2026-05-30 11:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-30 14:00:00', type: 'accepted', actor: '赵敏', content: '已接受整改任务' },
      { time: '2026-06-01 09:30:00', type: 'rejected', actor: '赵敏', content: '驳回：当前升级会与现有组件冲突，建议采用 WAF 临时防护方案' },
    ],
  },
  {
    id: 'VR-2026-0006',
    vulnName: 'Nginx HTTP/2 拒绝服务漏洞',
    cveId: 'CVE-2023-44487',
    vulnLevel: 'medium',
    cvssScore: 7.5,
    affectedAsset: 'CDN 边缘节点',
    assetIp: '10.70.10.5',
    assetDept: '基础架构部',
    ownerDept: '基础架构部 / 网络组',
    owner: '孙建国',
    ownerPhone: '138****6633',
    status: 'in_progress',
    createdAt: '2026-05-29 09:00:00',
    deadline: '2026-06-12 23:59:59',
    acceptedAt: '2026-05-29 13:00:00',
    retestAt: null,
    closedAt: null,
    progress: 40,
    solution: '升级 Nginx 至 1.25.3 或以上版本',
    remark: '',
    timeline: [
      { time: '2026-05-29 09:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-29 13:00:00', type: 'accepted', actor: '孙建国', content: '已接受整改任务' },
      { time: '2026-05-31 10:00:00', type: 'updated', actor: '孙建国', content: '开始升级，已完成测试环境验证' },
    ],
  },
  {
    id: 'VR-2026-0007',
    vulnName: 'MySQL 身份认证绕过漏洞',
    cveId: 'CVE-2022-21417',
    vulnLevel: 'high',
    cvssScore: 6.5,
    affectedAsset: '订单数据库',
    assetIp: '10.80.20.45',
    assetDept: '电商业务部',
    ownerDept: '电商业务部 / 数据组',
    owner: '周静',
    ownerPhone: '139****2200',
    status: 'pending_accept',
    createdAt: '2026-05-31 16:00:00',
    deadline: '2026-06-15 23:59:59',
    acceptedAt: null,
    retestAt: null,
    closedAt: null,
    progress: 0,
    solution: '升级 MySQL 至 8.0.29 或以上版本',
    remark: '',
    timeline: [
      { time: '2026-05-31 16:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-31 16:30:00', type: 'assigned', actor: '李华(安全运营)', content: '指派给周静' },
    ],
  },
  {
    id: 'VR-2026-0008',
    vulnName: 'Redis 未授权访问漏洞',
    cveId: 'CVE-2022-24834',
    vulnLevel: 'medium',
    cvssScore: 6.5,
    affectedAsset: '缓存服务器集群',
    assetIp: '10.90.10.1-3',
    assetDept: '基础架构部',
    ownerDept: '基础架构部 / 中间件组',
    owner: '陈强',
    ownerPhone: '136****4421',
    status: 'closed',
    createdAt: '2026-05-15 10:00:00',
    deadline: '2026-05-22 23:59:59',
    acceptedAt: '2026-05-15 12:00:00',
    retestAt: '2026-05-21 14:00:00',
    closedAt: '2026-05-21 14:20:00',
    progress: 100,
    solution: '启用认证、修改默认端口、限制监听 IP',
    remark: '',
    timeline: [
      { time: '2026-05-15 10:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-21 14:00:00', type: 'retest_pass', actor: '系统', content: '复测通过' },
      { time: '2026-05-21 14:20:00', type: 'closed', actor: '系统', content: '已闭环' },
    ],
  },
  {
    id: 'VR-2026-0009',
    vulnName: 'PostgreSQL 缓冲区溢出',
    cveId: 'CVE-2023-24539',
    vulnLevel: 'high',
    cvssScore: 7.2,
    affectedAsset: '用户行为分析库',
    assetIp: '10.100.20.10',
    assetDept: '数据部',
    ownerDept: '数据部 / 数据库组',
    owner: '刘伟',
    ownerPhone: '137****1199',
    status: 'in_progress',
    createdAt: '2026-05-27 14:00:00',
    deadline: '2026-06-07 23:59:59',
    acceptedAt: '2026-05-27 16:00:00',
    retestAt: null,
    closedAt: null,
    progress: 80,
    solution: '升级 PostgreSQL 至 15.2 或以上版本',
    remark: '',
    timeline: [
      { time: '2026-05-27 14:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-30 11:00:00', type: 'updated', actor: '刘伟', content: '升级已完成，等待业务验证' },
    ],
  },
  {
    id: 'VR-2026-0010',
    vulnName: 'Docker 容器逃逸漏洞',
    cveId: 'CVE-2022-0492',
    vulnLevel: 'medium',
    cvssScore: 6.0,
    affectedAsset: '容器云平台',
    assetIp: '10.110.10.0/24',
    assetDept: '基础架构部',
    ownerDept: '基础架构部 / 容器云组',
    owner: '吴磊',
    ownerPhone: '135****3388',
    status: 'pending_retest',
    createdAt: '2026-05-26 10:00:00',
    deadline: '2026-06-05 23:59:59',
    acceptedAt: '2026-05-26 13:00:00',
    retestAt: null,
    closedAt: null,
    progress: 100,
    solution: '升级 containerd 至 1.6.4 或以上版本',
    remark: '',
    timeline: [
      { time: '2026-05-26 10:00:00', type: 'created', actor: '系统', content: '漏洞扫描自动生成整改任务' },
      { time: '2026-05-31 17:00:00', type: 'updated', actor: '吴磊', content: '已升级所有节点，请复测' },
    ],
  },
];

// ============= 辅助函数 =============
const levelConfig = {
  critical: { label: '严重', color: '#FF3B30', bg: 'bg-[#FF3B30]/10', border: 'border-[#FF3B30]/30' },
  high: { label: '高危', color: '#FF9100', bg: 'bg-[#FF9100]/10', border: 'border-[#FF9100]/30' },
  medium: { label: '中危', color: '#FFD600', bg: 'bg-[#FFD600]/10', border: 'border-[#FFD600]/30' },
  low: { label: '低危', color: '#00C853', bg: 'bg-[#00C853]/10', border: 'border-[#00C853]/30' },
};

const statusConfig = {
  pending_assign: { label: '待指派', color: '#9CA3AF', icon: UserPlus },
  pending_accept: { label: '待确认', color: '#FF9100', icon: Clock },
  in_progress: { label: '整改中', color: '#0066FF', icon: RefreshCw },
  pending_retest: { label: '待复测', color: '#A855F7', icon: ShieldAlert },
  rejected: { label: '已驳回', color: '#FF3B30', icon: XCircle },
  closed: { label: '已闭环', color: '#00C853', icon: CheckCircle2 },
};

const timelineTypeConfig: Record<TimelineEvent['type'], { label: string; color: string; icon: React.ElementType }> = {
  created: { label: '任务创建', color: '#0066FF', icon: FileText },
  assigned: { label: '指派', color: '#FF9100', icon: UserPlus },
  accepted: { label: '确认接收', color: '#00C853', icon: CheckCircle2 },
  updated: { label: '进度更新', color: '#0066FF', icon: RefreshCw },
  retest_pass: { label: '复测通过', color: '#00C853', icon: CheckCircle2 },
  retest_fail: { label: '复测失败', color: '#FF3B30', icon: XCircle },
  rejected: { label: '驳回', color: '#FF3B30', icon: XCircle },
  closed: { label: '已闭环', color: '#00C853', icon: CheckCircle2 },
  urge: { label: '催办', color: '#FF9100', icon: Bell },
};

// ============= 主组件 =============
export function VulnRectifyTrack() {
  const [tasks, setTasks] = useState<RectifyTask[]>(mockTasks);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<RectifyStatus | ''>('');
  const [filterLevel, setFilterLevel] = useState<VulnLevel | ''>('');
  const [filterDept, setFilterDept] = useState('');
  const [selectedTask, setSelectedTask] = useState<RectifyTask | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [targetTask, setTargetTask] = useState<RectifyTask | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ============= 统计数据 =============
  const stats = useMemo(() => {
    const pendingAssign = tasks.filter(t => t.status === 'pending_assign').length;
    const pendingAccept = tasks.filter(t => t.status === 'pending_accept').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pendingRetest = tasks.filter(t => t.status === 'pending_retest').length;
    const closed = tasks.filter(t => t.status === 'closed').length;
    const total = tasks.length;
    const closeRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    const overdueTasks = tasks.filter(t => {
      if (t.status === 'closed' || t.status === 'rejected') return false;
      return new Date(t.deadline).getTime() < Date.now();
    }).length;
    return { pendingAssign, pendingAccept, inProgress, pendingRetest, closed, total, closeRate, overdueTasks };
  }, [tasks]);

  // ============= 筛选数据 =============
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchText = !searchText ||
        t.vulnName.toLowerCase().includes(searchText.toLowerCase()) ||
        t.cveId.toLowerCase().includes(searchText.toLowerCase()) ||
        t.affectedAsset.toLowerCase().includes(searchText.toLowerCase()) ||
        t.id.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = !filterStatus || t.status === filterStatus;
      const matchLevel = !filterLevel || t.vulnLevel === filterLevel;
      const matchDept = !filterDept || t.ownerDept.includes(filterDept);
      return matchText && matchStatus && matchLevel && matchDept;
    });
  }, [tasks, searchText, filterStatus, filterLevel, filterDept]);

  // ============= 操作函数 =============
  const handleExport = () => alert('正在导出漏洞整改跟踪列表为 Excel 文件...');
  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    alert('已刷新数据');
  };
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewDetail = (task: RectifyTask) => {
    setSelectedTask(task);
  };

  const handleAssign = (task: RectifyTask) => {
    setTargetTask(task);
    setShowAssignModal(true);
  };

  const handleReject = (task: RectifyTask) => {
    setTargetTask(task);
    setShowRejectModal(true);
  };

  const handleUrge = (task: RectifyTask) => {
    setTargetTask(task);
    setShowUrgeModal(true);
  };

  const handleApplyRetest = (task: RectifyTask) => {
    if (!confirm(`确定要申请复测「${task.vulnName}」吗？`)) return;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'pending_retest' as RectifyStatus } : t));
    alert('已提交复测申请，复测任务已加入队列');
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(t => t.id));
    }
  };

  // ============= 渲染 =============
  return (
    <div key={refreshKey}>
      {/* ========== 页面标题 ========== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
          <span>网络安全标准场景自动化</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>漏洞管理任务</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#F3F4F6]">漏洞整改跟踪</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#F3F4F6]">漏洞整改跟踪</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          跟踪从漏洞发现、整改指派、过程执行到复测闭环的全流程，支持整改任务的责任人匹配、状态流转、催办与超期告警
        </p>
      </div>

      {/* ========== 统计卡片 ========== */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard
          label="待指派"
          value={stats.pendingAssign}
          icon={UserPlus}
          color="#9CA3AF"
          hint="需立即指派责任人"
        />
        <StatCard
          label="待确认"
          value={stats.pendingAccept}
          icon={Clock}
          color="#FF9100"
          hint="责任人尚未接收"
        />
        <StatCard
          label="整改中"
          value={stats.inProgress}
          icon={RefreshCw}
          color="#0066FF"
          hint="正在执行整改"
        />
        <StatCard
          label="待复测"
          value={stats.pendingRetest}
          icon={ShieldAlert}
          color="#A855F7"
          hint="整改完成待复测"
        />
        <StatCard
          label="本月闭环率"
          value={`${stats.closeRate}%`}
          icon={TrendingUp}
          color="#00C853"
          hint={`已闭环 ${stats.closed} / ${stats.total}`}
        />
      </div>

      {/* ========== 超期告警条 ========== */}
      {stats.overdueTasks > 0 && (
        <div className="mb-4 px-4 py-3 bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
          <span className="text-sm text-[#FF3B30]">
            当前有 <strong>{stats.overdueTasks}</strong> 个整改任务已超期未处理，请及时跟进
          </span>
        </div>
      )}

      {/* ========== 操作栏 ========== */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="搜索整改单号 / 漏洞名 / CVE / 资产名..."
            className="w-full pl-10 pr-4 py-2 bg-[#0f1729] border border-[#1f2937] rounded-lg text-sm text-[#F3F4F6] placeholder-[#4B5563] focus:outline-none focus:border-[#0066FF]/50"
          />
        </div>
        <button
          onClick={handleRefresh}
          className="px-3 py-2 bg-[#0f1729] border border-[#1f2937] rounded-lg text-sm text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#0066FF]/30 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          刷新
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          导出
        </button>
        {selectedIds.length > 0 && (
          <button className="px-4 py-2 bg-[#FF9100] hover:bg-[#E68200] text-white rounded-lg text-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            批量指派 ({selectedIds.length})
          </button>
        )}
      </div>

      {/* ========== 筛选区 ========== */}
      <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-[#0f1729] border border-[#1f2937] rounded-lg">
        <Filter className="w-4 h-4 text-[#6B7280]" />
        <span className="text-sm text-[#9CA3AF]">筛选：</span>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as RectifyStatus | '')}
          className="px-3 py-1.5 bg-[#181F32] border border-[#1f2937] rounded-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#0066FF]/50"
        >
          <option value="">全部状态</option>
          {Object.entries(statusConfig).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value as VulnLevel | '')}
          className="px-3 py-1.5 bg-[#181F32] border border-[#1f2937] rounded-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#0066FF]/50"
        >
          <option value="">全部风险</option>
          {Object.entries(levelConfig).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="px-3 py-1.5 bg-[#181F32] border border-[#1f2937] rounded-md text-sm text-[#F3F4F6] focus:outline-none focus:border-[#0066FF]/50"
        >
          <option value="">全部部门</option>
          <option value="基础架构部">基础架构部</option>
          <option value="电商业务部">电商业务部</option>
          <option value="财务部">财务部</option>
          <option value="数据部">数据部</option>
          <option value="客户运营部">客户运营部</option>
        </select>

        <div className="flex-1" />

        <span className="text-sm text-[#6B7280]">
          共 <span className="text-[#0066FF] font-semibold">{filteredTasks.length}</span> 条
        </span>
      </div>

      {/* ========== 数据表格 ========== */}
      <div className="bg-[#0f1729] border border-[#1f2937] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#181F32] border-b border-[#1f2937]">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={filteredTasks.length > 0 && selectedIds.length === filteredTasks.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#1f2937] bg-[#0f1729] accent-[#0066FF]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">整改单号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">漏洞 / 风险</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">影响资产</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">责任人</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">整改进度</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">截止时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => {
              const isOverdue = task.status !== 'closed' && task.status !== 'rejected'
                && new Date(task.deadline).getTime() < Date.now();
              return (
                <tr
                  key={task.id}
                  className="border-b border-[#1f2937] hover:bg-[#181F32]/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(task.id)}
                      onChange={() => handleToggleSelect(task.id)}
                      className="w-4 h-4 rounded border-[#1f2937] bg-[#0f1729] accent-[#0066FF]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-[#F3F4F6]">{task.id}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{task.createdAt.split(' ')[0]}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#F3F4F6] max-w-xs truncate" title={task.vulnName}>
                      {task.vulnName}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${levelConfig[task.vulnLevel].bg} ${levelConfig[task.vulnLevel].border}`}
                        style={{ color: levelConfig[task.vulnLevel].color }}>
                        {levelConfig[task.vulnLevel].label}
                      </span>
                      <span className="text-[10px] text-[#6B7280] font-mono">{task.cveId}</span>
                      <span className="text-[10px] text-[#9CA3AF]">CVSS {task.cvssScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#F3F4F6] max-w-[180px] truncate" title={task.affectedAsset}>
                      {task.affectedAsset}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5 font-mono">{task.assetIp}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#F3F4F6]">{task.owner}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{task.ownerDept}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${task.progress}%`,
                            backgroundColor: task.status === 'closed' ? '#00C853' :
                              task.status === 'rejected' ? '#FF3B30' : '#0066FF'
                          }}
                        />
                      </div>
                      <span className="text-xs text-[#9CA3AF] font-mono w-8">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-xs font-mono ${isOverdue ? 'text-[#FF3B30] font-semibold' : 'text-[#9CA3AF]'}`}>
                      {task.deadline.split(' ')[0]}
                    </div>
                    {isOverdue && (
                      <div className="text-[10px] text-[#FF3B30] mt-0.5">已超期</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(task)}
                        className="p-1.5 hover:bg-[#0066FF]/20 rounded text-[#9CA3AF] hover:text-[#0066FF]"
                        title="查看详情"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {task.status === 'pending_assign' && (
                        <button
                          onClick={() => handleAssign(task)}
                          className="p-1.5 hover:bg-[#FF9100]/20 rounded text-[#9CA3AF] hover:text-[#FF9100]"
                          title="指派责任人"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(task.status === 'in_progress' || task.status === 'pending_accept') && (
                        <button
                          onClick={() => handleUrge(task)}
                          className="p-1.5 hover:bg-[#FFD600]/20 rounded text-[#9CA3AF] hover:text-[#FFD600]"
                          title="催办"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => handleApplyRetest(task)}
                          className="p-1.5 hover:bg-[#A855F7]/20 rounded text-[#9CA3AF] hover:text-[#A855F7]"
                          title="申请复测"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(task.status === 'pending_assign' || task.status === 'pending_accept') && (
                        <button
                          onClick={() => handleReject(task)}
                          className="p-1.5 hover:bg-[#FF3B30]/20 rounded text-[#9CA3AF] hover:text-[#FF3B30]"
                          title="驳回"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-[#6B7280]">
                  没有符合条件的整改任务
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========== 分页 ========== */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-[#6B7280]">
          共 {filteredTasks.length} 条记录
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#0f1729] border border-[#1f2937] rounded text-[#9CA3AF] hover:text-[#F3F4F6] disabled:opacity-50">
            上一页
          </button>
          <button className="px-3 py-1.5 bg-[#0066FF] text-white rounded">1</button>
          <button className="px-3 py-1.5 bg-[#0f1729] border border-[#1f2937] rounded text-[#9CA3AF] hover:text-[#F3F4F6]">2</button>
          <button className="px-3 py-1.5 bg-[#0f1729] border border-[#1f2937] rounded text-[#9CA3AF] hover:text-[#F3F4F6]">3</button>
          <button className="px-3 py-1.5 bg-[#0f1729] border border-[#1f2937] rounded text-[#9CA3AF] hover:text-[#F3F4F6]">
            下一页
          </button>
        </div>
      </div>

      {/* ========== 详情侧边栏 ========== */}
      {selectedTask && (
        <DetailDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUrge={() => handleUrge(selectedTask)}
          onAssign={() => handleAssign(selectedTask)}
          onRetest={() => handleApplyRetest(selectedTask)}
        />
      )}

      {/* ========== 指派弹窗 ========== */}
      {showAssignModal && targetTask && (
        <AssignModal
          task={targetTask}
          onClose={() => { setShowAssignModal(false); setTargetTask(null); }}
          onConfirm={(owner, dept, remark) => {
            setTasks(prev => prev.map(t => t.id === targetTask.id ? {
              ...t,
              owner,
              ownerDept: dept,
              status: 'pending_accept' as RectifyStatus,
              remark,
              timeline: [...t.timeline, {
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                type: 'assigned',
                actor: '当前用户',
                content: `指派给 ${owner}(${dept})`,
              }],
            } : t));
            alert(`已成功指派给 ${owner}`);
            setShowAssignModal(false);
            setTargetTask(null);
          }}
        />
      )}

      {/* ========== 驳回弹窗 ========== */}
      {showRejectModal && targetTask && (
        <RejectModal
          task={targetTask}
          onClose={() => { setShowRejectModal(false); setTargetTask(null); }}
          onConfirm={(reason) => {
            setTasks(prev => prev.map(t => t.id === targetTask.id ? {
              ...t,
              status: 'rejected' as RectifyStatus,
              timeline: [...t.timeline, {
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                type: 'rejected',
                actor: '当前用户',
                content: `驳回：${reason}`,
              }],
            } : t));
            alert('已驳回该任务');
            setShowRejectModal(false);
            setTargetTask(null);
          }}
        />
      )}

      {/* ========== 催办弹窗 ========== */}
      {showUrgeModal && targetTask && (
        <UrgeModal
          task={targetTask}
          onClose={() => { setShowUrgeModal(false); setTargetTask(null); }}
          onConfirm={(message) => {
            setTasks(prev => prev.map(t => t.id === targetTask.id ? {
              ...t,
              timeline: [...t.timeline, {
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                type: 'urge',
                actor: '当前用户',
                content: `催办：${message}`,
              }],
            } : t));
            alert(`已通过短信/ELINK 通知 ${targetTask.owner}`);
            setShowUrgeModal(false);
            setTargetTask(null);
          }}
        />
      )}
    </div>
  );
}

// ============= 状态徽章 =============
function StatusBadge({ status }: { status: RectifyStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        borderColor: `${config.color}40`,
      }}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// ============= 统计卡片 =============
function StatCard({ label, value, icon: Icon, color, hint }: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  hint: string;
}) {
  return (
    <div className="bg-[#0f1729] border border-[#1f2937] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#9CA3AF]">{label}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-[#6B7280]">{hint}</div>
    </div>
  );
}

// ============= 详情抽屉 =============
function DetailDrawer({ task, onClose, onUrge, onAssign, onRetest }: {
  task: RectifyTask;
  onClose: () => void;
  onUrge: () => void;
  onAssign: () => void;
  onRetest: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-[640px] h-full bg-[#0a1224] border-l border-[#1f2937] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 z-10 bg-[#0a1224] border-b border-[#1f2937] px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#6B7280] font-mono mb-1">{task.id}</div>
            <h2 className="text-lg font-semibold text-[#F3F4F6]">整改任务详情</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f2937] rounded text-[#9CA3AF] hover:text-[#F3F4F6]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 漏洞信息 */}
          <Section title="漏洞信息" icon={ShieldAlert}>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${levelConfig[task.vulnLevel].bg} ${levelConfig[task.vulnLevel].border}`}
                  style={{ color: levelConfig[task.vulnLevel].color }}>
                  {levelConfig[task.vulnLevel].label}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-[#F3F4F6] font-medium">{task.vulnName}</div>
                  <div className="text-xs text-[#6B7280] mt-1 font-mono">
                    {task.cveId} · CVSS {task.cvssScore}
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-[#0f1729] border border-[#1f2937] rounded-lg">
                <div className="text-xs text-[#9CA3AF] mb-1">推荐修复方案</div>
                <div className="text-sm text-[#F3F4F6]">{task.solution}</div>
              </div>
              {task.remark && (
                <div className="mt-2 p-3 bg-[#FF9100]/10 border border-[#FF9100]/30 rounded-lg">
                  <div className="text-xs text-[#FF9100] mb-1">备注</div>
                  <div className="text-sm text-[#F3F4F6]">{task.remark}</div>
                </div>
              )}
            </div>
          </Section>

          {/* 影响资产 */}
          <Section title="影响资产" icon={GitBranch}>
            <div className="grid grid-cols-2 gap-3">
              <InfoRow label="资产名称" value={task.affectedAsset} />
              <InfoRow label="IP 地址" value={task.assetIp} mono />
              <InfoRow label="所属部门" value={task.assetDept} />
              <InfoRow label="责任部门" value={task.ownerDept} />
            </div>
          </Section>

          {/* 责任人 */}
          <Section title="责任人" icon={UserPlus}>
            <div className="flex items-center gap-3 p-3 bg-[#0f1729] border border-[#1f2937] rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#A855F7] flex items-center justify-center text-white font-semibold">
                {task.owner.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#F3F4F6] font-medium">{task.owner}</div>
                <div className="text-xs text-[#6B7280] mt-0.5">{task.ownerPhone}</div>
              </div>
              <StatusBadge status={task.status} />
            </div>
          </Section>

          {/* 关键时间 */}
          <Section title="关键时间" icon={Calendar}>
            <div className="grid grid-cols-2 gap-3">
              <InfoRow label="创建时间" value={task.createdAt} mono />
              <InfoRow label="接收时间" value={task.acceptedAt || '未接收'} mono />
              <InfoRow label="截止时间" value={task.deadline} mono highlight={new Date(task.deadline).getTime() < Date.now() && task.status !== 'closed'} />
              <InfoRow label="闭环时间" value={task.closedAt || '未闭环'} mono />
            </div>
          </Section>

          {/* 整改进度 */}
          <Section title="整改进度" icon={TrendingUp}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">整体进度</span>
                <span className="text-sm font-mono text-[#F3F4F6]">{task.progress}%</span>
              </div>
              <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: task.status === 'closed' ? '#00C853' :
                      task.status === 'rejected' ? '#FF3B30' : '#0066FF'
                  }}
                />
              </div>
            </div>
          </Section>

          {/* 整改时间线 */}
          <Section title="整改时间线" icon={Clock}>
            <div className="space-y-3">
              {task.timeline.map((event, idx) => {
                const config = timelineTypeConfig[event.type];
                const Icon = config.icon;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}40` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                      </div>
                      {idx < task.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-[#1f2937] mt-1" style={{ minHeight: '24px' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: config.color }}>
                          {config.label}
                        </span>
                        <span className="text-xs text-[#6B7280]">· {event.actor}</span>
                      </div>
                      <div className="text-sm text-[#F3F4F6] mt-1">{event.content}</div>
                      <div className="text-xs text-[#6B7280] mt-1 font-mono">{event.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* 底部操作 */}
        <div className="sticky bottom-0 bg-[#0a1224] border-t border-[#1f2937] px-6 py-3 flex items-center justify-end gap-2">
          <button className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-[#F3F4F6] rounded-lg text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            沟通记录
          </button>
          {task.status === 'pending_assign' && (
            <button onClick={onAssign} className="px-4 py-2 bg-[#FF9100] hover:bg-[#E68200] text-white rounded-lg text-sm flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              指派
            </button>
          )}
          {(task.status === 'in_progress' || task.status === 'pending_accept') && (
            <button onClick={onUrge} className="px-4 py-2 bg-[#FFD600] hover:bg-[#E5C200] text-[#0a1224] rounded-lg text-sm flex items-center gap-2 font-semibold">
              <Bell className="w-4 h-4" />
              催办
            </button>
          )}
          {task.status === 'in_progress' && (
            <button onClick={onRetest} className="px-4 py-2 bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-lg text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              申请复测
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============= 通用 Section =============
function Section({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#0066FF]" />
        <h3 className="text-sm font-semibold text-[#F3F4F6]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono, highlight }: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-[#6B7280] mb-1">{label}</div>
      <div className={`text-sm ${mono ? 'font-mono' : ''} ${highlight ? 'text-[#FF3B30] font-semibold' : 'text-[#F3F4F6]'}`}>
        {value}
      </div>
    </div>
  );
}

// ============= 指派弹窗 =============
function AssignModal({ task, onClose, onConfirm }: {
  task: RectifyTask;
  onClose: () => void;
  onConfirm: (owner: string, dept: string, remark: string) => void;
}) {
  const [owner, setOwner] = useState(task.owner === '未指派' ? '' : task.owner);
  const [dept, setDept] = useState(task.ownerDept);
  const [remark, setRemark] = useState(task.remark);
  const [notifyWay, setNotifyWay] = useState<string[]>(['elink', 'sms']);

  const toggleNotify = (way: string) => {
    setNotifyWay(prev => prev.includes(way) ? prev.filter(x => x !== way) : [...prev, way]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-[520px] bg-[#0a1224] border border-[#1f2937] rounded-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#1f2937] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#F3F4F6]">指派责任人</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">{task.id} · {task.vulnName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f2937] rounded text-[#9CA3AF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">责任人 <span className="text-[#FF3B30]">*</span></label>
            <input
              type="text"
              value={owner}
              onChange={e => setOwner(e.target.value)}
              placeholder="请输入责任人姓名"
              className="w-full px-3 py-2 bg-[#0f1729] border border-[#1f2937] rounded-lg text-sm text-[#F3F4F6] focus:outline-none focus:border-[#0066FF]/50"
            />
          </div>

          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">责任部门 <span className="text-[#FF3B30]">*</span></label>
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f1729] border border-[#1f2937] rounded-lg text-sm text-[#F3F4F6] focus:outline-none focus:border-[#0066FF]/50"
            >
              <option value="">请选择部门</option>
              <option value="基础架构部 / 中间件组">基础架构部 / 中间件组</option>
              <option value="基础架构部 / 网络组">基础架构部 / 网络组</option>
              <option value="基础架构部 / 容器云组">基础架构部 / 容器云组</option>
              <option value="电商业务部 / 应用运维组">电商业务部 / 应用运维组</option>
              <option value="电商业务部 / 数据组">电商业务部 / 数据组</option>
              <option value="财务部 / 桌面运维">财务部 / 桌面运维</option>
              <option value="数据部 / 数据库组">数据部 / 数据库组</option>
              <option value="客户运营部 / 应用开发">客户运营部 / 应用开发</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">通知方式</label>
            <div className="flex items-center gap-2">
              {[
                { value: 'elink', label: 'ELINK 消息' },
                { value: 'sms', label: '短信' },
                { value: 'email', label: '邮件' },
                { value: 'phone', label: '电话' },
              ].map(way => (
                <button
                  key={way.value}
                  onClick={() => toggleNotify(way.value)}
                  className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
                    notifyWay.includes(way.value)
                      ? 'bg-[#0066FF]/20 border-[#0066FF]/50 text-[#0066FF]'
                      : 'bg-[#0f1729] border-[#1f2937] text-[#9CA3AF]'
                  }`}
                >
                  {way.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">指派说明</label>
            <textarea
              value={remark}
              onChange={e => setRemark(e.target.value)}
              rows={3}
              placeholder="请输入指派说明、整改要求等..."
              className="w-full px-3 py-2 bg-[#0f1729] border border-[#1f2937] rounded-lg text-sm text-[#F3F4F6] focus:outline-none focus:border-[#0066FF]/50 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#1f2937] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-[#F3F4F6] rounded-lg text-sm">
            取消
          </button>
          <button
            onClick={() => owner && dept && onConfirm(owner, dept, remark)}
            disabled={!owner || !dept}
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            确认指派
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= 驳回弹窗 =============
function RejectModal({ task, onClose, onConfirm }: {
  task: RectifyTask;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const [reasonType, setReasonType] = useState('');

  const presetReasons = [
    '漏洞风险评估有误，无需整改',
    '当前升级会与现有组件冲突',
    '建议采用 WAF 临时防护方案',
    '需要重新评估业务影响',
    '非本部门职责，转派其他部门',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-[520px] bg-[#0a1224] border border-[#1f2937] rounded-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#1f2937] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#F3F4F6]">驳回整改任务</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">{task.id} · {task.vulnName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f2937] rounded text-[#9CA3AF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">驳回原因（快速选择）</label>
            <div className="space-y-2">
              {presetReasons.map((r, i) => (
                <button
                  key={i}
                  onClick={() => { setReasonType(r); setReason(r); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                    reasonType === r
                      ? 'bg-[#FF3B30]/10 border-[#FF3B30]/50 text-[#FF3B30]'
                      : 'bg-[#0f1729] border-[#1f2937] text-[#9CA3AF] hover:border-[#FF3B30]/30'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">
              详细说明 <span className="text-[#FF3B30]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
              placeholder="请详细说明驳回原因..."
              className="w-full px-3 py-2 bg-[#0f1729] border border-[#1f2937] rounded-lg text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF3B30]/50 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#1f2937] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-[#F3F4F6] rounded-lg text-sm">
            取消
          </button>
          <button
            onClick={() => reason && onConfirm(reason)}
            disabled={!reason}
            className="px-4 py-2 bg-[#FF3B30] hover:bg-[#E62E22] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            确认驳回
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= 催办弹窗 =============
function UrgeModal({ task, onClose, onConfirm }: {
  task: RectifyTask;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const defaultMsg = `【漏洞整改催办】您负责的「${task.vulnName}」(单号: ${task.id}) 整改进度滞后，请尽快处理。`;
  const [message, setMessage] = useState(defaultMsg);
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'critical'>('urgent');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-[520px] bg-[#0a1224] border border-[#1f2937] rounded-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#1f2937] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#F3F4F6]">催办</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">发送给 {task.owner} ({task.ownerPhone})</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1f2937] rounded text-[#9CA3AF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">紧急程度</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'normal', label: '普通', color: '#0066FF' },
                { value: 'urgent', label: '紧急', color: '#FF9100' },
                { value: 'critical', label: '特急', color: '#FF3B30' },
              ].map(u => (
                <button
                  key={u.value}
                  onClick={() => setUrgency(u.value as 'normal' | 'urgent' | 'critical')}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    urgency === u.value
                      ? 'border-opacity-100 text-white'
                      : 'bg-[#0f1729] border-[#1f2937] text-[#9CA3AF]'
                  }`}
                  style={urgency === u.value ? {
                    backgroundColor: `${u.color}20`,
                    borderColor: u.color,
                    color: u.color,
                  } : {}}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">催办消息</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 bg-[#0f1729] border border-[#1f2937] rounded-lg text-sm text-[#F3F4F6] focus:outline-none focus:border-[#0066FF]/50 resize-none"
            />
          </div>

          <div className="p-3 bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-lg">
            <div className="text-xs text-[#0066FF] mb-1">通知渠道</div>
            <div className="text-xs text-[#9CA3AF]">
              将通过 ELINK 消息 + 短信 发送至 {task.owner}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#1f2937] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-[#F3F4F6] rounded-lg text-sm">
            取消
          </button>
          <button
            onClick={() => onConfirm(message)}
            className="px-4 py-2 bg-[#FFD600] hover:bg-[#E5C200] text-[#0a1224] rounded-lg text-sm flex items-center gap-2 font-semibold"
          >
            <Bell className="w-4 h-4" />
            发送催办
          </button>
        </div>
      </div>
    </div>
  );
}

export default VulnRectifyTrack;
