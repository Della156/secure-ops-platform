'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Filter, Eye, GitBranch, Shield, AlertTriangle,
  X, ChevronRight, Server, Globe, Database, Network, Tag,
  TrendingUp, Target, Zap, FileText, Clock, User, Activity,
  CheckCircle2, AlertCircle, XCircle, ArrowRight, Layers, Bug
} from 'lucide-react';

/**
 * 4.6-4 漏洞分析
 *
 * 单个漏洞深度分析 + 关联分析：
 * - 漏洞详情：描述、CVSS、影响、修复方案
 * - 关联资产：受影响的所有资产
 * - 关联事件：触发的告警/事件
 * - 攻击链：利用路径
 */

type VulnLevel = 'critical' | 'high' | 'medium' | 'low';

interface VulnDetail {
  id: string;
  cve: string;
  cnvd?: string;
  name: string;
  level: VulnLevel;
  cvss: { base: number; impact: number; exploit: number };
  vendor: string;
  product: string;
  version: string;
  cwe: string;
  publishedDate: string;
  updatedDate: string;
  description: string;
  impact: string;
  exploit: { available: boolean; inWild: boolean; poc: boolean; exploitMaturity: 'POC' | 'Functional' | 'High' };
  patch: { available: boolean; vendorPatch: boolean; workarounds: string[] };
  affectedAssets: number;
  description_cn: string;
  solution_cn: string;
  references: { title: string; url: string }[];
  tags: string[];
}

const currentVuln: VulnDetail = {
  id: 'VULN-2024-0042',
  cve: 'CVE-2024-3094',
  cnvd: 'CNVD-2024-12345',
  name: 'XZ Utils 后门漏洞',
  level: 'critical',
  cvss: { base: 10.0, impact: 6.0, exploit: 4.0 },
  vendor: 'XZ Utils Project',
  product: 'liblzma',
  version: '5.6.0 - 5.6.1',
  cwe: 'CWE-506 嵌入式恶意代码',
  publishedDate: '2024-03-29',
  updatedDate: '2024-04-02',
  description: 'In XZ Utils 5.6.0 and 5.6.1, the liblzma library allows attackers to execute arbitrary code via a backdoor in the command-line tool, which is triggered when specific conditions are met (e.g., when sshd is linked against the affected library).',
  description_cn: 'XZ Utils 5.6.0 和 5.6.1 版本中的 liblzma 库存在后门，允许攻击者在特定条件下（当 sshd 链接到受影响的库时）通过命令行工具执行任意代码。',
  impact: '攻击者可以通过 SSH 远程执行任意代码，完全控制受影响系统。该漏洞被植入在 liblzma 中，影响大量 Linux 发行版。',
  exploit: { available: true, inWild: true, poc: true, exploitMaturity: 'Functional' },
  patch: {
    available: true,
    vendorPatch: true,
    workarounds: [
      '升级到 XZ Utils 5.6.2 或更高版本',
      '使用 iptables/nftables 阻断可疑 SSH 流量',
      '回退到 XZ Utils 5.4.6',
      '禁用 sshd 中的特定密钥交换算法',
    ],
  },
  affectedAssets: 23,
  solution_cn: '1. 立即升级 XZ Utils 到 5.6.2+；2. 重新编译所有依赖 liblzma 的组件；3. 重启 SSH 服务；4. 审查系统日志，排查异常登录；5. 部署 HIDS 进行持续监控。',
  references: [
    { title: 'NVD - CVE-2024-3094', url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-3094' },
    { title: 'xz-utils GitHub Advisory', url: 'https://github.com/advisories/GHSA-7c5p-848j-c5jm' },
    { title: 'CISA Known Exploited Vulnerabilities', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
  ],
  tags: ['供应链', '后门', 'SSH', 'Linux', '高危', '在野利用'],
};

// 受影响资产
const affectedAssets = [
  { id: 'AST-001', name: 'APP-SERVER-01', ip: '10.1.10.21', type: '服务器', os: 'Ubuntu 22.04', xzVersion: '5.6.0', status: 'unfixed' },
  { id: 'AST-002', name: 'APP-SERVER-02', ip: '10.1.10.22', type: '服务器', os: 'Ubuntu 22.04', xzVersion: '5.6.0', status: 'unfixed' },
  { id: 'AST-003', name: 'DB-MASTER', ip: '10.1.20.10', type: '数据库', os: 'CentOS 7', xzVersion: '5.6.1', status: 'fixing' },
  { id: 'AST-004', name: 'WEB-PROXY-01', ip: '10.1.30.5', type: '代理', os: 'Debian 12', xzVersion: '5.6.0', status: 'fixed' },
];

// 关联事件
const relatedEvents = [
  { id: 'EV-001', time: '2026-06-02 14:23:12', type: 'ssh_login', source: '203.0.113.45', target: '10.1.10.21', level: 'critical', desc: '可疑 SSH 登录尝试' },
  { id: 'EV-002', time: '2026-06-02 11:45:30', type: 'liblzma_load', source: '10.1.10.21', target: '本地', level: 'high', desc: '可疑 liblzma 加载行为' },
  { id: 'EV-003', time: '2026-06-01 22:10:05', type: 'ssh_login', source: '198.51.100.23', target: '10.1.10.22', level: 'critical', desc: '异常登录成功' },
];

// 攻击链
const attackChain = [
  { step: 1, action: '初始访问', desc: '攻击者扫描暴露 SSH 服务的资产', tactic: 'TA0043' },
  { step: 2, action: '漏洞利用', desc: '利用 CVE-2024-3094 在 sshd 进程上下文中执行代码', tactic: 'TA0002' },
  { step: 3, action: '权限提升', desc: '通过受感染的 sshd 获取 root 权限', tactic: 'TA0004' },
  { step: 4, action: '持久化', desc: '植入 cron / systemd 后门', tactic: 'TA0003' },
  { step: 5, action: '横向移动', desc: '利用受信任关系访问其他资产', tactic: 'TA0008' },
  { step: 6, action: '数据窃取', desc: '导出敏感数据到 C2 服务器', tactic: 'TA0010' },
];

const severityColors = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export function VulnAnalysis() {
  const [tab, setTab] = useState<'overview' | 'assets' | 'events' | 'chain' | 'solution'>('overview');

  return (
    <div className="space-y-4">
      {/* 顶部漏洞摘要 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${severityColors[currentVuln.level]}`}>
                {currentVuln.level.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">CVSS: <span className="text-red-400 font-bold text-base">{currentVuln.cvss.base.toFixed(1)}</span></span>
              <span className="text-xs text-gray-500">{currentVuln.cwe}</span>
            </div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-400" />
              {currentVuln.name}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="font-mono">{currentVuln.cve}</span>
              <span>·</span>
              <span className="font-mono">{currentVuln.cnvd}</span>
              <span>·</span>
              <span>{currentVuln.vendor} {currentVuln.product} {currentVuln.version}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              立即创建整改
            </button>
            <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              导出报告
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {currentVuln.tags.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '受影响资产', value: currentVuln.affectedAssets, color: 'red', icon: <Server className="w-4 h-4" /> },
          { label: '在野利用', value: '是', color: 'red', icon: <AlertTriangle className="w-4 h-4" />, sub: '已知攻击' },
          { label: 'POC 可用', value: '是', color: 'orange', icon: <FileText className="w-4 h-4" /> },
          { label: '补丁可用', value: '有', color: 'green', icon: <CheckCircle2 className="w-4 h-4" />, sub: '官方补丁' },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-[#2A354D]">
        {[
          { v: 'overview' as const, l: '漏洞详情' },
          { v: 'assets' as const, l: `受影响资产 (${affectedAssets.length})` },
          { v: 'events' as const, l: `关联事件 (${relatedEvents.length})` },
          { v: 'chain' as const, l: '攻击链分析' },
          { v: 'solution' as const, l: '修复方案' },
        ].map(t => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              tab === t.v ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* 漏洞详情 */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">漏洞描述</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{currentVuln.description}</p>
            </div>
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">中文描述</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{currentVuln.description_cn}</p>
            </div>
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">影响与危害</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{currentVuln.impact}</p>
            </div>
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">利用信息</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-gray-500 text-[10px]">EXP 可用</div>
                  <div className={currentVuln.exploit.available ? 'text-red-400' : 'text-green-400'}>
                    {currentVuln.exploit.available ? '是 - 多个公开' : '否'}
                  </div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-gray-500 text-[10px]">在野利用</div>
                  <div className={currentVuln.exploit.inWild ? 'text-red-400' : 'text-green-400'}>
                    {currentVuln.exploit.inWild ? '是' : '否'}
                  </div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-gray-500 text-[10px]">POC 状态</div>
                  <div className="text-orange-400">{currentVuln.exploit.poc ? '公开' : '无'}</div>
                </div>
                <div className="bg-[#111625] rounded p-2">
                  <div className="text-gray-500 text-[10px]">利用成熟度</div>
                  <div className="text-red-400">{currentVuln.exploit.exploitMaturity}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">CVSS 评分</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">基础评分</span>
                    <span className="text-red-400 font-bold">{currentVuln.cvss.base.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${currentVuln.cvss.base * 10}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">影响评分</span>
                    <span className="text-orange-400">{currentVuln.cvss.impact.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${currentVuln.cvss.impact * 10}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">可利用性</span>
                    <span className="text-yellow-400">{currentVuln.cvss.exploit.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${currentVuln.cvss.exploit * 10}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">元数据</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">披露日期</span><span className="text-white">{currentVuln.publishedDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">更新日期</span><span className="text-white">{currentVuln.updatedDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">CWE 分类</span><span className="text-white text-[10px]">{currentVuln.cwe}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">影响版本</span><span className="text-orange-400 text-[10px]">{currentVuln.version}</span></div>
              </div>
            </div>

            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">参考资料</h3>
              <div className="space-y-1.5">
                {currentVuln.references.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener" className="block text-xs text-blue-400 hover:text-blue-300 truncate">
                    🔗 {r.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 受影响资产 */}
      {tab === 'assets' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-[#2A354D] bg-[#111625]/30">
                <th className="text-left py-2 px-3 font-medium">资产 ID</th>
                <th className="text-left py-2 px-3 font-medium">资产名称</th>
                <th className="text-left py-2 px-3 font-medium">IP</th>
                <th className="text-left py-2 px-3 font-medium">类型</th>
                <th className="text-left py-2 px-3 font-medium">操作系统</th>
                <th className="text-center py-2 px-3 font-medium">受影响版本</th>
                <th className="text-center py-2 px-3 font-medium">整改状态</th>
                <th className="text-center py-2 px-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {affectedAssets.map(a => {
                const statusMap: Record<string, { l: string; c: string }> = {
                  unfixed: { l: '未修复', c: 'text-red-400 bg-red-500/10' },
                  fixing: { l: '修复中', c: 'text-yellow-400 bg-yellow-500/10' },
                  fixed: { l: '已修复', c: 'text-green-400 bg-green-500/10' },
                };
                return (
                  <tr key={a.id} className="border-b border-[#2A354D]/50 hover:bg-[#111625]/30">
                    <td className="py-2 px-3 font-mono text-xs text-blue-400">{a.id}</td>
                    <td className="py-2 px-3 text-white">{a.name}</td>
                    <td className="py-2 px-3 text-gray-300 font-mono text-xs">{a.ip}</td>
                    <td className="py-2 px-3 text-gray-300 text-xs">{a.type}</td>
                    <td className="py-2 px-3 text-gray-400 text-xs">{a.os}</td>
                    <td className="py-2 px-3 text-center text-orange-400 font-mono text-xs">{a.xzVersion}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusMap[a.status].c}`}>{statusMap[a.status].l}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button className="text-xs text-blue-400 hover:text-blue-300 mr-2">详情</button>
                      <button className="text-xs text-green-400 hover:text-green-300">整改</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 关联事件 */}
      {tab === 'events' && (
        <div className="space-y-2">
          {relatedEvents.map(e => (
            <div key={e.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex items-center gap-3">
              <div className={`px-2 py-1 rounded text-[10px] ${
                e.level === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
              }`}>
                {e.level.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm text-white">{e.desc}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 font-mono">
                  {e.time} · {e.source} → {e.target} · {e.type}
                </div>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300">查看 →</button>
            </div>
          ))}
        </div>
      )}

      {/* 攻击链 */}
      {tab === 'chain' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-400" />
            MITRE ATT&CK 攻击链
          </h3>
          <div className="space-y-2">
            {attackChain.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <div className="flex-1 bg-[#111625] border border-[#2A354D] rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-white font-medium">{step.action}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{step.tactic}</span>
                  </div>
                  <div className="text-xs text-gray-400">{step.desc}</div>
                </div>
                {i < attackChain.length - 1 && <ArrowRight className="w-4 h-4 text-gray-600 mt-2" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 修复方案 */}
      {tab === 'solution' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            推荐修复方案
          </h3>
          <div className="bg-[#111625] border border-[#2A354D] rounded p-3">
            <h4 className="text-sm text-white font-medium mb-2">官方修复</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{currentVuln.solution_cn}</p>
          </div>
          <div>
            <h4 className="text-sm text-white font-medium mb-2">临时缓解措施</h4>
            <ul className="space-y-1.5">
              {currentVuln.patch.workarounds.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default VulnAnalysis;
