'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Filter, RefreshCw, X, CheckCircle2, XCircle,
  AlertCircle, Clock, Calendar, Target, FileText, Eye, Shield,
  Bug, Activity, BarChart3, TrendingUp, ArrowRight, ChevronRight
} from 'lucide-react';

/**
 * 4.6-6 漏洞复测与闭环
 *
 * 复测任务管理 + 闭环率统计：
 * - 待复测任务列表
 * - 复测结果记录
 * - 闭环率 / 复测失败率 / 复测趋势
 * - 自动复测 vs 人工复测
 */

type RetestResult = 'pending' | 'pass' | 'fail' | 'partial' | 'risk_accept';

interface RetestTask {
  id: string;
  vulnName: string;
  cve: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  asset: string;
  ip: string;
  fixMethod: string;
  fixedBy: string;
  fixTime: string;
  retestTime: string;
  retestMethod: 'auto' | 'manual';
  result: RetestResult;
  retester?: string;
  evidence?: string;
  remark?: string;
  closeTime?: string;
  cycle: number; // 复测轮次
}

const retestTasks: RetestTask[] = [
  { id: 'RT-001', vulnName: 'XZ Utils 后门', cve: 'CVE-2024-3094', level: 'critical', asset: 'APP-SERVER-01', ip: '10.1.10.21', fixMethod: '升级到 5.6.2', fixedBy: '张伟', fixTime: '2026-06-01 14:00', retestTime: '2026-06-02 10:00', retestMethod: 'auto', result: 'pass', retester: '自动扫描器', evidence: 'X 版本检测: 5.6.2 ✓', cycle: 1, closeTime: '2026-06-02 10:15' },
  { id: 'RT-002', vulnName: 'WebLogic 反序列化', cve: 'CVE-2023-21839', level: 'critical', asset: 'APP-MIDDLEWARE-03', ip: '10.1.30.45', fixMethod: '应用补丁 + 端口关闭', fixedBy: '王强', fixTime: '2026-05-30 16:00', retestTime: '2026-05-31 09:00', retestMethod: 'manual', result: 'fail', retester: '李娜', evidence: '端口仍开放 T3 协议', remark: '补丁未生效，需要重新部署', cycle: 2 },
  { id: 'RT-003', vulnName: 'Linux 内核提权', cve: 'CVE-2024-1086', level: 'high', asset: 'DB-SLAVE-02', ip: '10.1.20.12', fixMethod: '内核升级', fixedBy: '赵敏', fixTime: '2026-06-01 22:00', retestTime: '2026-06-02 14:00', retestMethod: 'auto', result: 'pending', cycle: 1 },
  { id: 'RT-004', vulnName: 'OpenSSL 信息泄露', cve: 'CVE-2023-0464', level: 'high', asset: 'WEB-PROXY-01', ip: '10.1.30.5', fixMethod: 'OpenSSL 升级', fixedBy: '孙八', fixTime: '2026-05-29 10:00', retestTime: '2026-05-30 11:00', retestMethod: 'auto', result: 'pass', retester: '自动扫描器', evidence: 'OpenSSL 版本 3.0.13', cycle: 1, closeTime: '2026-05-30 11:30' },
  { id: 'RT-005', vulnName: 'WordPress 插件 RCE', cve: 'CVE-2024-31210', level: 'high', asset: 'WEB-CMS-01', ip: '10.1.40.10', fixMethod: '插件升级', fixedBy: '李娜', fixTime: '2026-05-28 18:00', retestTime: '2026-05-29 14:00', retestMethod: 'manual', result: 'partial', retester: '钱七', evidence: '部分路径已修复，附件上传功能仍存在漏洞', remark: '业务依赖部分功能，建议加入白名单', cycle: 3 },
  { id: 'RT-006', vulnName: '弱口令 admin/123456', cve: 'CUSTOM-001', level: 'medium', asset: 'OLD-DEMO-01', ip: '10.1.99.10', fixMethod: '密码修改', fixedBy: '周九', fixTime: '2026-05-25 09:00', retestTime: '2026-05-26 10:00', retestMethod: 'auto', result: 'risk_accept', retester: '系统', evidence: '业务系统即将下线', remark: '已审批风险接受：2026-08-01 前下线', cycle: 1, closeTime: '2026-05-26 10:00' },
  { id: 'RT-007', vulnName: 'Redis 未授权访问', cve: 'CUSTOM-002', level: 'critical', asset: 'CACHE-01', ip: '10.1.50.5', fixMethod: '启用认证 + 绑定本地', fixedBy: '王强', fixTime: '2026-06-02 11:00', retestTime: '2026-06-02 16:00', retestMethod: 'auto', result: 'pending', cycle: 1 },
];

const resultConfig: Record<RetestResult, { l: string; c: string; icon: React.ReactNode }> = {
  pending: { l: '待复测', c: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: <Clock className="w-3 h-3" /> },
  pass: { l: '复测通过', c: 'bg-green-500/10 text-green-400 border-green-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  fail: { l: '复测失败', c: 'bg-red-500/10 text-red-400 border-red-500/30', icon: <XCircle className="w-3 h-3" /> },
  partial: { l: '部分修复', c: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: <AlertCircle className="w-3 h-3" /> },
  risk_accept: { l: '风险接受', c: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: <Shield className="w-3 h-3" /> },
};

const severityColors = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-blue-400',
};

// 7 天闭环率趋势
const closeRateTrend = [
  { date: '5/27', rate: 78, failed: 8 },
  { date: '5/28', rate: 82, failed: 6 },
  { date: '5/29', rate: 85, failed: 5 },
  { date: '5/30', rate: 88, failed: 4 },
  { date: '5/31', rate: 89, failed: 3 },
  { date: '6/01', rate: 92, failed: 2 },
  { date: '6/02', rate: 94.5, failed: 2 },
];

export function VulnRetestClose() {
  const [filter, setFilter] = useState<'all' | RetestResult>('all');
  const [searchKw, setSearchKw] = useState('');

  const filtered = useMemo(() => {
    return retestTasks.filter(t => {
      if (filter !== 'all' && t.result !== filter) return false;
      if (searchKw && !t.vulnName.includes(searchKw) && !t.cve.includes(searchKw) && !t.asset.includes(searchKw)) return false;
      return true;
    });
  }, [filter, searchKw]);

  // 统计
  const totalTasks = retestTasks.length;
  const passed = retestTasks.filter(t => t.result === 'pass').length;
  const failed = retestTasks.filter(t => t.result === 'fail').length;
  const pending = retestTasks.filter(t => t.result === 'pending').length;
  const partial = retestTasks.filter(t => t.result === 'partial').length;
  const riskAccepted = retestTasks.filter(t => t.result === 'risk_accept').length;
  const closeRate = ((passed + riskAccepted) / totalTasks * 100).toFixed(1);
  const failRate = (failed / totalTasks * 100).toFixed(1);

  // 复测轮次分布
  const cycleDistribution = useMemo(() => {
    const m: Record<number, number> = {};
    retestTasks.forEach(t => { m[t.cycle] = (m[t.cycle] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ cycle: Number(k), count: v })).sort((a, b) => a.cycle - b.cycle);
  }, []);

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            漏洞复测与闭环
          </h2>
          <span className="text-xs text-gray-500">7 天闭环率 94.5% · 较上周 +6.5%</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            触发自动复测
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: '总任务数', value: totalTasks, color: 'blue', icon: <Activity className="w-4 h-4" /> },
          { label: '待复测', value: pending, color: 'gray', icon: <Clock className="w-4 h-4" /> },
          { label: '复测通过', value: passed, color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: '复测失败', value: failed, color: 'red', icon: <XCircle className="w-4 h-4" /> },
          { label: '部分修复', value: partial, color: 'yellow', icon: <AlertCircle className="w-4 h-4" /> },
          { label: '风险接受', value: riskAccepted, color: 'purple', icon: <Shield className="w-4 h-4" /> },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* 闭环率 / 失败率 + 趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">闭环率</h3>
          <div className="text-4xl font-bold text-green-400">{closeRate}%</div>
          <div className="text-xs text-gray-500 mt-1">目标 95% · 差距 0.5%</div>
          <div className="mt-3 h-2 bg-[#111625] rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${closeRate}%` }} />
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">复测失败率</h3>
          <div className="text-4xl font-bold text-red-400">{failRate}%</div>
          <div className="text-xs text-gray-500 mt-1">较上周 -3.2%</div>
          <div className="mt-3 h-2 bg-[#111625] rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: `${failRate}%` }} />
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">7 天闭环率趋势</h3>
          <svg viewBox="0 0 200 100" className="w-full h-24">
            <polyline
              points={closeRateTrend.map((d, i) => `${(i / (closeRateTrend.length - 1)) * 200},${100 - (d.rate - 70) * 4}`).join(' ')}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
            />
            {closeRateTrend.map((d, i) => (
              <g key={i}>
                <circle cx={(i / (closeRateTrend.length - 1)) * 200} cy={100 - (d.rate - 70) * 4} r="3" fill="#10B981" />
                <text x={(i / (closeRateTrend.length - 1)) * 200} y="98" textAnchor="middle" fill="#64748B" fontSize="8">{d.date}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 复测轮次分布 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">复测轮次分布</h3>
        <div className="flex items-end gap-2 h-24">
          {cycleDistribution.map(c => {
            const max = Math.max(...cycleDistribution.map(x => x.count));
            return (
              <div key={c.cycle} className="flex-1 flex flex-col items-center">
                <div className="text-[10px] text-gray-400 mb-1">{c.count}</div>
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(c.count / max) * 80}px` }} />
                <div className="text-[10px] text-gray-500 mt-1">第 {c.cycle} 轮</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 筛选 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchKw}
            onChange={e => setSearchKw(e.target.value)}
            placeholder="搜索漏洞 / 资产..."
            className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
          />
        </div>
        <div className="flex border border-[#2A354D] rounded overflow-hidden">
          {[
            { v: 'all' as const, l: `全部 (${totalTasks})` },
            { v: 'pending' as RetestResult, l: `待复测 (${pending})` },
            { v: 'pass' as RetestResult, l: `通过 (${passed})` },
            { v: 'fail' as RetestResult, l: `失败 (${failed})` },
            { v: 'partial' as RetestResult, l: `部分 (${partial})` },
            { v: 'risk_accept' as RetestResult, l: `接受 (${riskAccepted})` },
          ].map(f => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`px-2.5 py-1 text-xs ${filter === f.v ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* 复测任务列表 */}
      <div className="space-y-2">
        {filtered.map(t => {
          const r = resultConfig[t.result as keyof typeof resultConfig];
          return (
            <div key={t.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-gray-500 font-mono">{t.id}</span>
                    <span className={`text-sm font-medium ${severityColors[t.level as keyof typeof severityColors]}`}>{t.vulnName}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{t.cve}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    资产: <span className="text-white">{t.asset}</span> (<span className="font-mono">{t.ip}</span>) ·
                    修复人: <span className="text-white">{t.fixedBy}</span> ·
                    修复时间: <span className="text-white">{t.fixTime}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${r.c}`}>
                    {r.icon} {r.l}
                  </span>
                  <span className="text-[10px] text-gray-500">第 {t.cycle} 轮 · {t.retestMethod === 'auto' ? '自动' : '人工'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mt-3">
                <div>
                  <div className="text-gray-500 text-[10px]">修复方式</div>
                  <div className="text-white">{t.fixMethod}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">复测计划</div>
                  <div className="text-white">{t.retestTime} ({t.retestMethod === 'auto' ? '自动' : '人工'})</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">复测人/结果</div>
                  <div className="text-white">{t.retester || '待执行'}</div>
                </div>
              </div>

              {t.evidence && (
                <div className="bg-[#111625] rounded p-2 mt-2 text-xs">
                  <div className="text-gray-500 text-[10px] mb-0.5">复测证据</div>
                  <div className="text-gray-300">{t.evidence}</div>
                </div>
              )}

              {t.remark && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-2 mt-2 text-xs">
                  <div className="text-yellow-400 text-[10px] mb-0.5">备注</div>
                  <div className="text-gray-300">{t.remark}</div>
                </div>
              )}

              {t.closeTime && (
                <div className="text-[10px] text-green-400 mt-2">✓ 已闭环：{t.closeTime}</div>
              )}

              <div className="flex items-center gap-1 pt-2 mt-2 border-t border-[#2A354D]">
                <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">查看详情</button>
                {t.result === 'pending' && <button className="text-xs text-green-400 hover:text-green-300 mr-2">立即复测</button>}
                {t.result === 'fail' && <button className="text-xs text-orange-400 hover:text-orange-300 mr-2">重新整改</button>}
                <button className="text-xs text-purple-400 hover:text-purple-300">风险接受</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VulnRetestClose;
