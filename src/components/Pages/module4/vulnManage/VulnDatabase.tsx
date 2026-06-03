'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Plus, RefreshCw, Database, Tag, Globe,
  Shield, AlertTriangle, Calendar, Filter, FileText, Check,
  X, ChevronRight, ExternalLink, Bug, Layers, Zap, TrendingUp
} from 'lucide-react';

/**
 * 4.6-7 漏洞库维护
 *
 * CVE 库 + 插件 + 规则管理：
 * - CVE/NVD 数据同步
 * - 自定义漏洞规则
 * - 漏洞影响范围定义
 * - 标签分类管理
 */

type SyncStatus = 'synced' | 'syncing' | 'pending' | 'failed';

interface VulnEntry {
  id: string;
  cve?: string;
  cnvd?: string;
  cnnvd?: string;
  name: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  vendor: string;
  product: string;
  category: string;
  tags: string[];
  source: 'NVD' | 'CNVD' | 'CNNVD' | 'Custom';
  publishDate: string;
  updateDate: string;
  references: number;
  exploitAvailable: boolean;
  patchAvailable: boolean;
}

const vulnEntries: VulnEntry[] = [
  { id: 'VE-001', cve: 'CVE-2024-3094', cnvd: 'CNVD-2024-12345', name: 'XZ Utils 后门漏洞', level: 'critical', cvss: 10.0, vendor: 'XZ Utils Project', product: 'liblzma', category: '供应链', tags: ['供应链', '后门', 'SSH', 'Linux'], source: 'NVD', publishDate: '2024-03-29', updateDate: '2024-04-02', references: 23, exploitAvailable: true, patchAvailable: true },
  { id: 'VE-002', cve: 'CVE-2024-21412', name: 'Microsoft Outlook RCE', level: 'critical', cvss: 9.8, vendor: 'Microsoft', product: 'Outlook', category: '应用漏洞', tags: ['RCE', '邮件', 'Windows'], source: 'NVD', publishDate: '2024-02-13', updateDate: '2024-03-01', references: 18, exploitAvailable: true, patchAvailable: true },
  { id: 'VE-003', cve: 'CVE-2024-23897', name: 'Jenkins 任意文件读取', level: 'critical', cvss: 9.8, vendor: 'Jenkins', product: 'Jenkins CI', category: '中间件', tags: ['文件读取', 'CI/CD'], source: 'NVD', publishDate: '2024-01-24', updateDate: '2024-02-15', references: 12, exploitAvailable: false, patchAvailable: true },
  { id: 'VE-004', cve: 'CVE-2024-21626', name: 'runc 容器逃逸', level: 'high', cvss: 8.6, vendor: 'Open Container Initiative', product: 'runc', category: '容器安全', tags: ['容器逃逸', 'Docker'], source: 'NVD', publishDate: '2024-01-31', updateDate: '2024-02-28', references: 9, exploitAvailable: true, patchAvailable: true },
  { id: 'VE-005', cnvd: 'CNVD-2024-09876', name: '某 OA 系统 SQL 注入', level: 'high', cvss: 8.1, vendor: '国内厂商', product: 'OA System', category: 'Web 应用', tags: ['SQL注入', 'OA', '国产化'], source: 'CNVD', publishDate: '2024-04-12', updateDate: '2024-04-20', references: 5, exploitAvailable: false, patchAvailable: true },
  { id: 'VE-006', cnnvd: 'CNNVD-202403-1234', name: 'Apache Struts 文件上传', level: 'critical', cvss: 9.8, vendor: 'Apache', product: 'Struts 2', category: '中间件', tags: ['文件上传', 'RCE'], source: 'CNNVD', publishDate: '2023-12-07', updateDate: '2024-01-10', references: 14, exploitAvailable: false, patchAvailable: true },
  { id: 'VE-007', cve: 'CVE-2023-44487', name: 'HTTP/2 Rapid Reset DoS', level: 'high', cvss: 7.5, vendor: 'HTTP/2 Protocol', product: 'HTTP/2', category: '协议漏洞', tags: ['DoS', 'HTTP2', '协议'], source: 'NVD', publishDate: '2023-10-10', updateDate: '2023-11-15', references: 28, exploitAvailable: true, patchAvailable: true },
  { id: 'VE-008', name: '弱口令检测规则集', level: 'medium', cvss: 0, vendor: '自定义', product: '-', category: '配置缺陷', tags: ['弱口令', '配置', '基线'], source: 'Custom', publishDate: '2023-01-01', updateDate: '2026-05-01', references: 0, exploitAvailable: false, patchAvailable: false },
  { id: 'VE-009', cve: 'CVE-2024-1086', name: 'Linux 内核提权漏洞', level: 'high', cvss: 7.8, vendor: 'Linux', product: 'Kernel', category: '操作系统', tags: ['内核', '提权', 'Linux'], source: 'NVD', publishDate: '2024-01-31', updateDate: '2024-02-10', references: 16, exploitAvailable: true, patchAvailable: true },
  { id: 'VE-010', name: '未授权访问检测规则', level: 'high', cvss: 0, vendor: '自定义', product: '-', category: '配置缺陷', tags: ['未授权', 'Redis', 'MongoDB'], source: 'Custom', publishDate: '2023-06-01', updateDate: '2026-05-15', references: 0, exploitAvailable: false, patchAvailable: false },
];

// 同步任务
interface SyncTask {
  id: string;
  source: 'NVD' | 'CNVD' | 'CNNVD' | 'Custom';
  status: SyncStatus;
  lastSync: string;
  nextSync: string;
  newCount: number;
  totalCount: number;
  duration: string;
}

const syncTasks: SyncTask[] = [
  { id: 'SY-001', source: 'NVD', status: 'synced', lastSync: '2026-06-02 04:00:00', nextSync: '2026-06-03 04:00:00', newCount: 87, totalCount: 234567, duration: '8m 32s' },
  { id: 'SY-002', source: 'CNVD', status: 'synced', lastSync: '2026-06-02 02:00:00', nextSync: '2026-06-03 02:00:00', newCount: 23, totalCount: 87654, duration: '5m 12s' },
  { id: 'SY-003', source: 'CNNVD', status: 'syncing', lastSync: '2026-06-01 22:00:00', nextSync: '2026-06-02 22:00:00', newCount: 12, totalCount: 65432, duration: '运行中...' },
  { id: 'SY-004', source: 'Custom', status: 'pending', lastSync: '2026-05-15 10:00:00', nextSync: '手动触发', newCount: 0, totalCount: 234, duration: '-' },
];

// 标签
const tagCategories = [
  { tag: '供应链', count: 156, color: 'red' },
  { tag: 'Web 应用', count: 1234, color: 'orange' },
  { tag: '操作系统', count: 567, color: 'yellow' },
  { tag: '中间件', count: 423, color: 'blue' },
  { tag: '数据库', count: 234, color: 'cyan' },
  { tag: '容器安全', count: 89, color: 'purple' },
  { tag: '协议漏洞', count: 67, color: 'pink' },
  { tag: '配置缺陷', count: 345, color: 'gray' },
  { tag: 'IoT/工控', count: 45, color: 'green' },
  { tag: '移动端', count: 78, color: 'indigo' },
];

const severityColors = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const sourceColors = {
  NVD: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CNVD: 'bg-red-500/10 text-red-400 border-red-500/20',
  CNNVD: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Custom: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const syncStatusConfig: Record<SyncStatus, { l: string; c: string }> = {
  synced: { l: '已同步', c: 'text-green-400' },
  syncing: { l: '同步中', c: 'text-blue-400 animate-pulse' },
  pending: { l: '待同步', c: 'text-gray-400' },
  failed: { l: '同步失败', c: 'text-red-400' },
};

export function VulnDatabase() {
  const [tab, setTab] = useState<'library' | 'sync' | 'tags'>('library');
  const [searchKw, setSearchKw] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return vulnEntries.filter(v => {
      if (sourceFilter !== 'all' && v.source !== sourceFilter) return false;
      if (searchKw) {
        const kw = searchKw.toLowerCase();
        if (!v.cve?.toLowerCase().includes(kw) && !v.cnvd?.toLowerCase().includes(kw) && !v.name.toLowerCase().includes(kw) && !v.vendor.toLowerCase().includes(kw) && !v.product.toLowerCase().includes(kw)) {
          return false;
        }
      }
      return true;
    });
  }, [searchKw, sourceFilter]);

  const totalEntries = vulnEntries.length;
  const criticalCount = vulnEntries.filter(v => v.level === 'critical').length;
  const exploitAvail = vulnEntries.filter(v => v.exploitAvailable).length;
  const customRules = vulnEntries.filter(v => v.source === 'Custom').length;

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            漏洞库维护
          </h2>
          <span className="text-xs text-gray-500">共 387,887 条 · 今日新增 122</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('sync')}
            className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            立即同步
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            新增规则
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '漏洞库总数', value: '387,887', color: 'blue', icon: <Database className="w-4 h-4" /> },
          { label: '严重漏洞', value: criticalCount, color: 'red', icon: <AlertTriangle className="w-4 h-4" />, sub: '占总数 0.6%' },
          { label: 'EXP 可用', value: exploitAvail, color: 'orange', icon: <Zap className="w-4 h-4" />, sub: '需优先关注' },
          { label: '自定义规则', value: customRules, color: 'purple', icon: <FileText className="w-4 h-4" />, sub: '企业专属' },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-[#2A354D]">
        {[
          { v: 'library' as const, l: '漏洞库' },
          { v: 'sync' as const, l: '同步任务' },
          { v: 'tags' as const, l: '标签分类' },
        ].map(t => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={`px-4 py-2 text-sm border-b-2 ${tab === t.v ? 'border-blue-500 text-white' : 'border-transparent text-gray-500'}`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* 漏洞库 */}
      {tab === 'library' && (
        <>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchKw}
                onChange={e => setSearchKw(e.target.value)}
                placeholder="搜索 CVE / 名称 / 厂商..."
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
              />
            </div>
            <div className="flex border border-[#2A354D] rounded overflow-hidden">
              {['all', 'NVD', 'CNVD', 'CNNVD', 'Custom'].map(s => (
                <button
                  key={s}
                  onClick={() => setSourceFilter(s)}
                  className={`px-2.5 py-1 text-xs ${sourceFilter === s ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
                >
                  {s === 'all' ? '全部' : s}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-[#2A354D] bg-[#111625]/30">
                  <th className="text-left py-2 px-3 font-medium">ID 编号</th>
                  <th className="text-left py-2 px-3 font-medium">名称</th>
                  <th className="text-center py-2 px-3 font-medium">CVSS</th>
                  <th className="text-center py-2 px-3 font-medium">等级</th>
                  <th className="text-left py-2 px-3 font-medium">影响产品</th>
                  <th className="text-left py-2 px-3 font-medium">来源</th>
                  <th className="text-center py-2 px-3 font-medium">EXP</th>
                  <th className="text-center py-2 px-3 font-medium">补丁</th>
                  <th className="text-center py-2 px-3 font-medium">披露日期</th>
                  <th className="text-center py-2 px-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                    <td className="py-2 px-3 font-mono text-xs">
                      <div className="text-blue-400">{v.cve || '-'}</div>
                      {(v.cnvd || v.cnnvd) && <div className="text-gray-500 text-[10px]">{v.cnvd || v.cnnvd}</div>}
                    </td>
                    <td className="py-2 px-3 text-white max-w-xs">
                      <div className="truncate" title={v.name}>{v.name}</div>
                      <div className="flex gap-0.5 mt-0.5">
                        {v.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] px-1 rounded bg-blue-500/10 text-blue-400">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`font-bold ${v.cvss >= 9.0 ? 'text-red-400' : v.cvss >= 7.0 ? 'text-orange-400' : v.cvss >= 4.0 ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {v.cvss > 0 ? v.cvss.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${severityColors[v.level]}`}>{v.level.toUpperCase()}</span>
                    </td>
                    <td className="py-2 px-3 text-xs">
                      <div className="text-white">{v.vendor}</div>
                      <div className="text-gray-500">{v.product}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${sourceColors[v.source]}`}>{v.source}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {v.exploitAvailable ? <span className="text-red-400 text-xs">有</span> : <span className="text-gray-500 text-xs">无</span>}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {v.patchAvailable ? <Check className="w-3.5 h-3.5 text-green-400 inline" /> : <X className="w-3.5 h-3.5 text-gray-500 inline" />}
                    </td>
                    <td className="py-2 px-3 text-center text-gray-500 text-xs">{v.publishDate}</td>
                    <td className="py-2 px-3 text-center">
                      <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">详情</button>
                      <button className="text-xs text-green-400 hover:text-green-300">应用</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 同步任务 */}
      {tab === 'sync' && (
        <div className="space-y-3">
          {syncTasks.map(t => {
            const status = syncStatusConfig[t.status];
            return (
              <div key={t.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                      {t.source}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{t.source} 数据同步</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">任务 ID: {t.id}</div>
                    </div>
                  </div>
                  <span className={`text-xs ${status.c} flex items-center gap-1`}>
                    {t.status === 'syncing' && <RefreshCw className="w-3 h-3 animate-spin" />}
                    ● {status.l}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500 text-[10px]">上次同步</div>
                    <div className="text-white">{t.lastSync}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">下次同步</div>
                    <div className="text-white">{t.nextSync}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">新增 / 总数</div>
                    <div className="text-white">+{t.newCount} / {t.totalCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">耗时</div>
                    <div className="text-white">{t.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-3 mt-3 border-t border-[#2A354D]">
                  <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">立即同步</button>
                  <button className="text-xs text-green-400 hover:text-green-300 mr-2">配置</button>
                  <button className="text-xs text-gray-400 hover:text-gray-300">查看日志</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 标签分类 */}
      {tab === 'tags' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {tagCategories.map(t => (
            <div key={t.tag} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 hover:border-blue-500/30 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Tag className={`w-4 h-4 text-${t.color}-400`} />
                <span className="text-[10px] text-gray-500">{t.count} 条</span>
              </div>
              <div className="text-base font-medium text-white">#{t.tag}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VulnDatabase;
