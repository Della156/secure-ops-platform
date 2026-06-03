'use client';

import React, { useState, useMemo } from 'react';
import {
  Network, Server, Shield, Lock, Globe, Database, Wifi, Activity,
  Search, Filter, Download, RefreshCw, Play, AlertTriangle, CheckCircle2,
  XCircle, Eye, ChevronRight, Cpu, HardDrive, Hash, Layers
} from 'lucide-react';

interface ServiceCheck {
  id: string;
  serviceName: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'BOTH';
  category: 'remote' | 'web' | 'database' | 'file' | 'system' | 'unnecessary';
  required: boolean;
  status: 'enabled' | 'disabled' | 'misconfigured' | 'not-needed';
  affectedHosts: number;
  totalHosts: number;
  securityRisk: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  cveRefs?: string[];
}

const serviceChecks: ServiceCheck[] = [
  { id: 'S-001', serviceName: 'SSH', port: 22, protocol: 'TCP', category: 'remote', required: true, status: 'misconfigured', affectedHosts: 8, totalHosts: 12, securityRisk: 'high', description: 'SSH 服务开启但配置存在安全风险（root 登录、密码认证等）', recommendation: '禁用 root 登录、禁用密码认证、修改默认端口、配置 fail2ban', cveRefs: ['CVE-2024-6387'] },
  { id: 'S-002', serviceName: 'Telnet', port: 23, protocol: 'TCP', category: 'unnecessary', required: false, status: 'enabled', affectedHosts: 2, totalHosts: 12, securityRisk: 'critical', description: 'Telnet 协议明文传输，应禁用', recommendation: 'systemctl disable telnet.socket，立即停用' },
  { id: 'S-003', serviceName: 'HTTP', port: 80, protocol: 'TCP', category: 'web', required: false, status: 'enabled', affectedHosts: 5, totalHosts: 12, securityRisk: 'medium', description: 'HTTP 明文访问，应重定向到 HTTPS', recommendation: '配置 301 重定向到 HTTPS' },
  { id: 'S-004', serviceName: 'HTTPS', port: 443, protocol: 'TCP', category: 'web', required: true, status: 'enabled', affectedHosts: 8, totalHosts: 12, securityRisk: 'low', description: 'HTTPS 服务正常启用', recommendation: '保持配置，定期更新 TLS 证书', cveRefs: ['CVE-2024-3094'] },
  { id: 'S-005', serviceName: 'RDP', port: 3389, protocol: 'TCP', category: 'remote', required: true, status: 'misconfigured', affectedHosts: 3, totalHosts: 12, securityRisk: 'high', description: 'RDP 暴露在公网或弱密码策略', recommendation: '修改默认端口、启用 NLA、限制 IP 白名单', cveRefs: ['CVE-2019-0708'] },
  { id: 'S-006', serviceName: 'MySQL', port: 3306, protocol: 'TCP', category: 'database', required: true, status: 'misconfigured', affectedHosts: 4, totalHosts: 12, securityRisk: 'critical', description: 'MySQL 监听 0.0.0.0 或弱密码', recommendation: 'bind-address=127.0.0.1、移除匿名账户、强化密码' },
  { id: 'S-007', serviceName: 'Redis', port: 6379, protocol: 'TCP', category: 'database', required: true, status: 'misconfigured', affectedHosts: 3, totalHosts: 12, securityRisk: 'critical', description: 'Redis 无密码监听 0.0.0.0', recommendation: '设置 requirepass、bind 127.0.0.1、禁用危险命令' },
  { id: 'S-008', serviceName: 'PostgreSQL', port: 5432, protocol: 'TCP', category: 'database', required: true, status: 'misconfigured', affectedHosts: 2, totalHosts: 12, securityRisk: 'high', description: 'PostgreSQL 监听地址配置不当', recommendation: '修改 listen_addresses、配置 pg_hba.conf' },
  { id: 'S-009', serviceName: 'MongoDB', port: 27017, protocol: 'TCP', category: 'database', required: false, status: 'enabled', affectedHosts: 1, totalHosts: 12, securityRisk: 'critical', description: 'MongoDB 暴露公网、无认证', recommendation: 'bind 127.0.0.1、启用 auth、配置 --auth' },
  { id: 'S-010', serviceName: 'SMB', port: 445, protocol: 'TCP', category: 'file', required: false, status: 'enabled', affectedHosts: 4, totalHosts: 12, securityRisk: 'high', description: 'SMBv1 启用，存在勒索软件风险', recommendation: '禁用 SMBv1、仅 SMBv3', cveRefs: ['CVE-2017-0144'] },
  { id: 'S-011', serviceName: 'FTP', port: 21, protocol: 'TCP', category: 'unnecessary', required: false, status: 'enabled', affectedHosts: 3, totalHosts: 12, securityRisk: 'high', description: 'FTP 明文传输，应替换为 SFTP/FTPS', recommendation: '停用 FTP，使用 SFTP 替代' },
  { id: 'S-012', serviceName: 'SNMP', port: 161, protocol: 'UDP', category: 'system', required: true, status: 'misconfigured', affectedHosts: 6, totalHosts: 12, securityRisk: 'high', description: 'SNMP 使用默认 community string (public/private)', recommendation: '修改为复杂 community 或 SNMPv3' },
  { id: 'S-013', serviceName: 'DNS', port: 53, protocol: 'BOTH', category: 'system', required: true, status: 'misconfigured', affectedHosts: 5, totalHosts: 12, securityRisk: 'medium', description: 'DNS 递归查询、版本信息泄露', recommendation: '禁用递归、隐藏版本、配置 allow-query' },
  { id: 'S-014', serviceName: 'NTP', port: 123, protocol: 'UDP', category: 'system', required: true, status: 'enabled', affectedHosts: 7, totalHosts: 12, securityRisk: 'low', description: 'NTP 时间同步正常', recommendation: '配置 NTP 认证、限制访问' },
  { id: 'S-015', serviceName: 'LDAP', port: 389, protocol: 'TCP', category: 'system', required: true, status: 'misconfigured', affectedHosts: 2, totalHosts: 12, securityRisk: 'medium', description: 'LDAP 未启用 TLS', recommendation: '配置 LDAPS (636 端口)' },
  { id: 'S-016', serviceName: 'Docker API', port: 2375, protocol: 'TCP', category: 'unnecessary', required: false, status: 'enabled', affectedHosts: 4, totalHosts: 12, securityRisk: 'critical', description: 'Docker API 2375 端口无认证暴露', recommendation: '立即关闭 2375，使用 2376 TLS 认证', cveRefs: ['CVE-2024-21626'] },
  { id: 'S-017', serviceName: 'Kubernetes API', port: 6443, protocol: 'TCP', category: 'system', required: true, status: 'misconfigured', affectedHosts: 3, totalHosts: 12, securityRisk: 'high', description: 'K8s API Server 权限配置不当', recommendation: '启用 RBAC、配置 NetworkPolicy' },
  { id: 'S-018', serviceName: 'rsync', port: 873, protocol: 'TCP', category: 'unnecessary', required: false, status: 'enabled', affectedHosts: 2, totalHosts: 12, securityRisk: 'medium', description: 'rsync 守护进程未授权', recommendation: '配置 auth users、chroot' },
  { id: 'S-019', serviceName: 'VNC', port: 5900, protocol: 'TCP', category: 'remote', required: false, status: 'enabled', affectedHosts: 1, totalHosts: 12, securityRisk: 'high', description: 'VNC 弱认证暴露', recommendation: '改用 SSH 隧道 + VNC，启用强认证' },
  { id: 'S-020', serviceName: 'Memcached', port: 11211, protocol: 'TCP', category: 'database', required: false, status: 'enabled', affectedHosts: 1, totalHosts: 12, securityRisk: 'critical', description: 'Memcached UDP 反射攻击风险', recommendation: '禁用 UDP、bind 127.0.0.1、启用 SASL' },
];

const riskColor: Record<ServiceCheck['securityRisk'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const categoryColor: Record<ServiceCheck['category'], string> = {
  remote: 'text-blue-400',
  web: 'text-purple-400',
  database: 'text-red-400',
  file: 'text-yellow-400',
  system: 'text-cyan-400',
  unnecessary: 'text-orange-400',
};

const categoryLabel: Record<ServiceCheck['category'], string> = {
  remote: '远程管理', web: 'Web 服务', database: '数据库', file: '文件服务', system: '系统服务', unnecessary: '非必要',
};

const statusIcon = (s: string) => {
  if (s === 'enabled') return <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />;
  if (s === 'disabled') return <XCircle className="w-3.5 h-3.5 text-slate-500" />;
  if (s === 'misconfigured') return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
  return <Hash className="w-3.5 h-3.5 text-slate-500" />;
};

export function ServicePortCheck() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('S-001');

  const filtered = useMemo(() => {
    return serviceChecks.filter(s => {
      if (search && !s.serviceName.toLowerCase().includes(search.toLowerCase()) && !String(s.port).includes(search)) return false;
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (riskFilter !== 'all' && s.securityRisk !== riskFilter) return false;
      return true;
    });
  }, [search, categoryFilter, riskFilter]);

  const stats = useMemo(() => ({
    total: serviceChecks.length,
    open: serviceChecks.filter(s => s.status === 'enabled' || s.status === 'misconfigured').length,
    risk: serviceChecks.filter(s => s.securityRisk === 'critical' || s.securityRisk === 'high').length,
    unneeded: serviceChecks.filter(s => s.category === 'unnecessary' && (s.status === 'enabled' || s.status === 'misconfigured')).length,
    hosts: 12,
  }), []);

  const selected = selectedId ? serviceChecks.find(s => s.id === selectedId) : null;

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="服务总数" value={stats.total} color="#0066FF" icon={<Layers className="w-4 h-4" />} />
        <StatBox label="开放服务" value={stats.open} color="#22C55E" icon={<Network className="w-4 h-4" />} />
        <StatBox label="高危服务" value={stats.risk} color="#EF4444" icon={<AlertTriangle className="w-4 h-4" />} />
        <StatBox label="非必要服务" value={stats.unneeded} color="#FF6D00" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="目标主机" value={stats.hosts} color="#9333EA" icon={<Server className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">服务与端口策略检查</h2>
            <p className="text-xs text-slate-500 mt-1">检查全网主机开放的服务端口、配置风险、不必要服务</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Play className="w-3.5 h-3.5" />立即扫描
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出报告
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索服务名/端口"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部分类</option>
            <option value="remote">远程管理</option>
            <option value="web">Web 服务</option>
            <option value="database">数据库</option>
            <option value="file">文件服务</option>
            <option value="system">系统服务</option>
            <option value="unnecessary">非必要</option>
          </select>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部风险等级</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">服务检查项 ({filtered.length})</h3>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[#111625] text-slate-400">
              <tr>
                <th className="text-left px-3 py-2">服务</th>
                <th className="text-left px-3 py-2">端口</th>
                <th className="text-left px-3 py-2">分类</th>
                <th className="text-left px-3 py-2">状态</th>
                <th className="text-left px-3 py-2">风险</th>
                <th className="text-left px-3 py-2">影响</th>
                <th className="text-right px-3 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer ${selectedId === s.id ? 'bg-[#111625]' : ''}`}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {statusIcon(s.status)}
                      <span className="text-white font-medium">{s.serviceName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 font-mono">{s.port}/{s.protocol === 'BOTH' ? 'TCP+UDP' : s.protocol}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs ${categoryColor[s.category]}`}>{categoryLabel[s.category]}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    {s.status === 'enabled' && <span className="text-blue-400 text-xs">已启用</span>}
                    {s.status === 'disabled' && <span className="text-slate-500 text-xs">已禁用</span>}
                    {s.status === 'misconfigured' && <span className="text-orange-400 text-xs">配置不当</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] ${riskColor[s.securityRisk]}`}>
                      {s.securityRisk === 'critical' ? '严重' : s.securityRisk === 'high' ? '高' : s.securityRisk === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 font-mono">{s.affectedHosts}/{s.totalHosts}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button className="text-blue-400 hover:text-blue-300 text-xs">详情</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-500 font-mono text-xs">{selected.id}</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] ${riskColor[selected.securityRisk]}`}>
                  {selected.securityRisk === 'critical' ? '严重' : selected.securityRisk === 'high' ? '高' : selected.securityRisk === 'medium' ? '中' : '低'}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                {selected.serviceName} <span className="text-blue-400 font-mono text-sm">:{selected.port}/{selected.protocol === 'BOTH' ? 'TCP+UDP' : selected.protocol}</span>
              </h3>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-xs text-slate-500">分类</div>
                <div className={`text-sm font-medium ${categoryColor[selected.category]}`}>{categoryLabel[selected.category]}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-xs text-slate-500">必要性</div>
                <div className={`text-sm font-medium ${selected.required ? 'text-blue-400' : 'text-orange-400'}`}>
                  {selected.required ? '必要服务' : '非必要'}
                </div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-xs text-slate-500">启用主机</div>
                <div className="text-sm font-medium text-slate-200">{selected.affectedHosts}/{selected.totalHosts}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-xs text-slate-500">暴露面</div>
                <div className="text-sm font-medium text-red-400">
                  {Math.round((selected.affectedHosts / selected.totalHosts) * 100)}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">加固建议</div>
              <div className="text-xs text-slate-200 bg-[#111625] border border-[#2A354D] rounded px-2 py-2 leading-relaxed">
                {selected.recommendation}
              </div>
            </div>

            {selected.cveRefs && selected.cveRefs.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-1.5">关联 CVE 漏洞</div>
                <div className="flex flex-wrap gap-1">
                  {selected.cveRefs.map(cve => (
                    <span key={cve} className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded font-mono">
                      {cve}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-slate-500 mb-1.5">修复命令示例</div>
              <div className="bg-[#111625] border border-[#2A354D] rounded p-2 font-mono text-[10px] text-green-400 leading-relaxed">
                # Linux:<br/>
                systemctl stop {selected.serviceName.toLowerCase()}<br/>
                systemctl disable {selected.serviceName.toLowerCase()}<br/>
                <br/>
                # 防火墙规则：<br/>
                iptables -A INPUT -p {selected.protocol === 'UDP' ? 'udp' : 'tcp'} --dport {selected.port} -j DROP
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />一键加固所有主机
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default ServicePortCheck;
