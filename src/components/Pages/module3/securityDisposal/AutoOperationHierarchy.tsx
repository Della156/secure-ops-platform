'use client';

import React, { useState } from 'react';
import {
  Plus, Edit, Trash2, Save, X, Shield, Lock, CheckCircle2, AlertCircle,
  Activity, Settings, ChevronRight, ChevronDown, Eye, Search, Filter,
  Download, RefreshCw, Zap, Clock, User, Key, Server, Database, Network,
  ArrowRight, Info, Power, FileText, Cpu
} from 'lucide-react';

interface OpLevel {
  level: 'L1' | 'L2' | 'L3' | 'L4';
  name: string;
  description: string;
  color: string;
  bg: string;
  approval: '无需' | '可选' | '必需' | '双重';
  operations: OpRule[];
}

interface OpRule {
  id: string;
  name: string;
  category: '隔离/阻断' | '取证' | '修复' | '通知' | '配置变更' | '数据操作' | '账号';
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedScope: '单资产' | '子网' | '全网' | '数据库' | '账号';
  rollback: '自动' | '人工' | '不可回滚';
  duration: string; // 最大执行时长
  requiredLevel: 'L1' | 'L2' | 'L3' | 'L4';
  enabled: boolean;
  callCount: number; // 今日调用
  successRate: number;
  approverRole?: string;
}

const levels: OpLevel[] = [
  {
    level: 'L1', name: 'L1 - 自动执行', description: '低风险操作，系统自动执行无需审批', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/40',
    approval: '无需',
    operations: [
      { id: 'OP-001', name: '隔离主机（自动解隔离）', category: '隔离/阻断', description: 'EDR 隔离受影响主机，24 小时后自动恢复', riskLevel: 'medium', affectedScope: '单资产', rollback: '自动', duration: '5 分钟', requiredLevel: 'L1', enabled: true, callCount: 32, successRate: 100 },
      { id: 'OP-002', name: '阻断 IP（自动）', category: '隔离/阻断', description: '在边界防火墙添加黑名单 IP', riskLevel: 'low', affectedScope: '全网', rollback: '自动', duration: '1 分钟', requiredLevel: 'L1', enabled: true, callCount: 18, successRate: 100 },
      { id: 'OP-003', name: '收集证据', category: '取证', description: '自动收集进程、网络、文件证据', riskLevel: 'low', affectedScope: '单资产', rollback: '不可回滚', duration: '10 分钟', requiredLevel: 'L1', enabled: true, callCount: 56, successRate: 98 },
      { id: 'OP-004', name: '杀进程（已知恶意）', category: '修复', description: '终止 EDR 已识别的恶意进程', riskLevel: 'low', affectedScope: '单资产', rollback: '不可回滚', duration: '30 秒', requiredLevel: 'L1', enabled: true, callCount: 78, successRate: 99 },
      { id: 'OP-005', name: '邮件删除（已识钓鱼）', category: '通知', description: '从所有邮箱删除已识别钓鱼邮件', riskLevel: 'low', affectedScope: '全网', rollback: '不可回滚', duration: '5 分钟', requiredLevel: 'L1', enabled: true, callCount: 142, successRate: 100 },
    ],
  },
  {
    level: 'L2', name: 'L2 - 半自动', description: '中风险操作，AI 推荐方案，安全工程师一键执行', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/40',
    approval: '可选',
    operations: [
      { id: 'OP-006', name: '杀挖矿文件', category: '修复', description: '删除挖矿木马文件 + 持久化', riskLevel: 'medium', affectedScope: '单资产', rollback: '人工', duration: '5 分钟', requiredLevel: 'L2', enabled: true, callCount: 8, successRate: 95 },
      { id: 'OP-007', name: '隔离子网（VLAN）', category: '隔离/阻断', description: '将整个 VLAN 网络隔离', riskLevel: 'medium', affectedScope: '子网', rollback: '人工', duration: '10 分钟', requiredLevel: 'L2', enabled: true, callCount: 2, successRate: 100 },
      { id: 'OP-008', name: '修改 ACL', category: '配置变更', description: '修改边界防火墙 ACL', riskLevel: 'medium', affectedScope: '全网', rollback: '自动', duration: '5 分钟', requiredLevel: 'L2', enabled: true, callCount: 12, successRate: 100, approverRole: '网络工程师' },
      { id: 'OP-009', name: '强制注销可疑会话', category: '修复', description: '对可疑账号的所有会话注销', riskLevel: 'medium', affectedScope: '全网', rollback: '不可回滚', duration: '2 分钟', requiredLevel: 'L2', enabled: true, callCount: 15, successRate: 98 },
    ],
  },
  {
    level: 'L3', name: 'L3 - 审批后执行', description: '高风险操作，必须经过部门经理审批', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/40',
    approval: '必需',
    operations: [
      { id: 'OP-010', name: '冻结账号（域账号）', category: '账号', description: '禁用 AD 域账号，禁止登录', riskLevel: 'high', affectedScope: '全网', rollback: '人工', duration: '1 分钟', requiredLevel: 'L3', enabled: true, callCount: 6, successRate: 100, approverRole: '部门经理' },
      { id: 'OP-011', name: '重置账号密码（强制）', category: '账号', description: '强制重置账号密码', riskLevel: 'high', affectedScope: '全网', rollback: '人工', duration: '2 分钟', requiredLevel: 'L3', enabled: true, callCount: 14, successRate: 100, approverRole: '部门经理' },
      { id: 'OP-012', name: '数据库回滚', category: '数据操作', description: '数据库事务回滚到指定时间点', riskLevel: 'high', affectedScope: '数据库', rollback: '不可回滚', duration: '30 分钟', requiredLevel: 'L3', enabled: true, callCount: 1, successRate: 100, approverRole: 'DBA + 业务负责人' },
      { id: 'OP-013', name: '重启关键服务', category: '修复', description: '重启核心业务服务（数据库、域控等）', riskLevel: 'high', affectedScope: '全网', rollback: '不可回滚', duration: '15 分钟', requiredLevel: 'L3', enabled: true, callCount: 3, successRate: 100, approverRole: '系统负责人' },
    ],
  },
  {
    level: 'L4', name: 'L4 - 人工处置', description: '极高风险或复杂场景，必须由安全专家人工处置', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/40',
    approval: '双重',
    operations: [
      { id: 'OP-014', name: '格式化磁盘（取证前）', category: '数据操作', description: '取证前镜像磁盘', riskLevel: 'critical', affectedScope: '单资产', rollback: '不可回滚', duration: '数小时', requiredLevel: 'L4', enabled: true, callCount: 0, successRate: 100, approverRole: '安全总监 + 法务' },
      { id: 'OP-015', name: '法律取证导出', category: '取证', description: '导出完整取证数据用于司法鉴定', riskLevel: 'critical', affectedScope: '全网', rollback: '不可回滚', duration: '数小时', requiredLevel: 'L4', enabled: true, callCount: 0, successRate: 100, approverRole: '安全总监 + 法务' },
      { id: 'OP-016', name: '全网断网（紧急）', category: '隔离/阻断', description: '全网断网，应对大规模攻击', riskLevel: 'critical', affectedScope: '全网', rollback: '人工', duration: '数小时', requiredLevel: 'L4', enabled: true, callCount: 0, successRate: 100, approverRole: '安全总监 + CIO' },
    ],
  },
];

const categoryColor: Record<OpRule['category'], string> = {
  '隔离/阻断': '#0066FF',
  '取证': '#9333EA',
  '修复': '#22C55E',
  '通知': '#FF6D00',
  '配置变更': '#EAB308',
  '数据操作': '#EF4444',
  '账号': '#06B6D4',
};

const riskColor: Record<OpRule['riskLevel'], string> = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

export function AutoOperationHierarchy() {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['L1', 'L2', 'L3', 'L4']));
  const [search, setSearch] = useState('');

  const toggle = (level: string) => {
    setExpandedLevels(prev => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-4">
      {/* 头部 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">自动化操作分级管理</h2>
            <p className="text-xs text-slate-500 mt-1">L1 自动 / L2 半自动 / L3 审批 / L4 人工 — 4 级操作风险分级</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新增操作
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索操作名称/类别"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 4 级展开 */}
      <div className="space-y-3">
        {levels.map(lv => {
          const isExpanded = expandedLevels.has(lv.level);
          return (
            <div key={lv.level} className={`border rounded-lg overflow-hidden ${lv.bg}`}>
              {/* 等级头部 */}
              <button
                onClick={() => toggle(lv.level)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#20293F]/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold ${lv.color} bg-[#20293F] border border-[#2A354D]`}>
                    {lv.level}
                  </div>
                  <div className="text-left">
                    <div className={`text-base font-semibold ${lv.color}`}>{lv.name}</div>
                    <div className="text-xs text-slate-400">{lv.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">操作数</div>
                    <div className="text-sm text-white font-mono">{lv.operations.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">审批</div>
                    <div className={`text-sm font-medium ${lv.color}`}>{lv.approval}</div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* 操作列表 */}
              {isExpanded && (
                <div className="bg-[#111625] border-t border-[#2A354D] p-3 space-y-2">
                  {lv.operations.filter(op => !search || op.name.includes(search) || op.category.includes(search)).map(op => {
                    const cc = categoryColor[op.category];
                    return (
                      <div
                        key={op.id}
                        className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 hover:border-blue-500/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-slate-500 font-mono">{op.id}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${cc}20`, color: cc }}>
                                {op.category}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${riskColor[op.riskLevel]}`}>
                                {op.riskLevel === 'low' ? '低风险' : op.riskLevel === 'medium' ? '中风险' : op.riskLevel === 'high' ? '高风险' : '极高'}
                              </span>
                              {!op.enabled && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400">已禁用</span>}
                            </div>
                            <div className="text-sm text-white font-medium">{op.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{op.description}</div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button className="p-1.5 hover:bg-[#2A354D] rounded" title="查看历史"><Eye className="w-3.5 h-3.5 text-slate-400" /></button>
                            <button className="p-1.5 hover:bg-[#2A354D] rounded" title="编辑"><Edit className="w-3.5 h-3.5 text-slate-400" /></button>
                            <button className="p-1.5 hover:bg-[#2A354D] rounded" title="删除"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2 text-xs">
                          <div className="bg-[#111625] rounded p-1.5">
                            <div className="text-[10px] text-slate-500">影响范围</div>
                            <div className="text-slate-200">{op.affectedScope}</div>
                          </div>
                          <div className="bg-[#111625] rounded p-1.5">
                            <div className="text-[10px] text-slate-500">回滚方式</div>
                            <div className="text-slate-200">{op.rollback}</div>
                          </div>
                          <div className="bg-[#111625] rounded p-1.5">
                            <div className="text-[10px] text-slate-500">最大时长</div>
                            <div className="text-slate-200">{op.duration}</div>
                          </div>
                          <div className="bg-[#111625] rounded p-1.5">
                            <div className="text-[10px] text-slate-500">今日调用</div>
                            <div className="text-blue-300 font-mono">{op.callCount} 次</div>
                          </div>
                          <div className="bg-[#111625] rounded p-1.5">
                            <div className="text-[10px] text-slate-500">成功率</div>
                            <div className="text-green-400 font-mono">{op.successRate}%</div>
                          </div>
                        </div>

                        {op.approverRole && (
                          <div className="mt-2 pt-2 border-t border-[#2A354D] text-[10px] text-slate-500 flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            审批人：<span className="text-yellow-400">{op.approverRole}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AutoOperationHierarchy;
