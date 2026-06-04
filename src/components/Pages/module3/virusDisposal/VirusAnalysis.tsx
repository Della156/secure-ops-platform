'use client';

import React, { useState } from 'react';
import {
  Search, Eye, Download, RefreshCw, AlertCircle,
  FileText, Clock, Network, Server, Shield
} from 'lucide-react';

interface AnalysisRecord {
  id: string;
  virusName: string;
  behavior: string;
  propagation: string;
  impact: string;
  suggestion: string;
  status: 'completed' | 'analyzing' | 'pending';
  createdAt: string;
}

const records: AnalysisRecord[] = [
  {
    id: 'VA-20260603001',
    virusName: 'Kinsing',
    behavior: '挖矿行为，占用系统资源，连接矿池进行加密货币挖矿',
    propagation: '通过 Docker 镜像漏洞入侵，利用弱密码 SSH 登录',
    impact: '服务器-0128，CPU 使用率 95%，网络流量异常',
    suggestion: '1. 升级 Docker 版本至最新\n2. 加强 SSH 密钥认证\n3. 监控矿池连接 IP',
    status: 'completed',
    createdAt: '2026-06-03 07:35:00',
  },
  {
    id: 'VA-20260603002',
    virusName: 'Emotet',
    behavior: '邮件钓鱼投递，下载恶意载荷，建立 C2 连接',
    propagation: '钓鱼邮件附件，宏启用执行，横向移动至域控制器',
    impact: '终端-0256，可能影响整个域环境',
    suggestion: '1. 隔离受感染终端\n2. 重置域管理员密码\n3. 监控 C2 通信',
    status: 'completed',
    createdAt: '2026-06-03 09:20:00',
  },
  {
    id: 'VA-20260603003',
    virusName: 'CryptoLocker',
    behavior: '文件加密勒索，加密用户文档并索要赎金',
    propagation: '利用 EternalBlue 漏洞传播',
    impact: '文件服务器，约 500GB 数据面临加密风险',
    suggestion: '1. 立即隔离服务器\n2. 备份未加密数据\n3. 修补 MS17-010 漏洞',
    status: 'analyzing',
    createdAt: '2026-06-03 09:35:00',
  },
  {
    id: 'VA-20260602001',
    virusName: 'Trojan.Agent',
    behavior: '窃取敏感信息，记录键盘输入，建立反向 Shell',
    propagation: '恶意软件捆绑安装',
    impact: '终端-0101，用户凭据可能泄露',
    suggestion: '1. 清除恶意软件\n2. 重置受影响账户密码\n3. 启用 MFA',
    status: 'completed',
    createdAt: '2026-06-02 14:30:00',
  },
];

export function VirusAnalysis() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>('VA-20260603001');

  const filtered = records.filter(r => {
    if (search && !r.virusName.includes(search)) return false;
    return true;
  });

  const selected = selectedId ? records.find(r => r.id === selectedId) : null;

  const getStatusConfig = (status: AnalysisRecord['status']) => {
    const config = {
      completed: { label: '已完成', color: 'text-green-500', bg: 'bg-green-500/20' },
      analyzing: { label: '分析中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
      pending: { label: '待分析', color: 'text-slate-400', bg: 'bg-slate-500/20' },
    };
    return config[status];
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">病毒处置分析</h2>
            <p className="text-xs text-slate-500 mt-1">分析病毒行为、传播方式和影响范围，提供处置建议</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出报告
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="搜索病毒名称..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">分析记录 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(record => {
              const sc = getStatusConfig(record.status);
              return (
                <div
                  key={record.id}
                  onClick={() => setSelectedId(record.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === record.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{record.id}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{record.virusName}</div>
                  <div className="text-xs text-slate-400 line-clamp-2">{record.behavior}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{record.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3 max-h-[600px] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${getStatusConfig(selected.status).bg} ${getStatusConfig(selected.status).color}`}>
                  {getStatusConfig(selected.status).label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.virusName}</h3>
            </div>

            <div className="bg-[#111625] rounded p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />行为描述
              </div>
              <p className="text-xs text-slate-300">{selected.behavior}</p>
            </div>

            <div className="bg-[#111625] rounded p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Network className="w-3.5 h-3.5" />传播方式
              </div>
              <p className="text-xs text-slate-300">{selected.propagation}</p>
            </div>

            <div className="bg-[#111625] rounded p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Server className="w-3.5 h-3.5" />影响范围
              </div>
              <p className="text-xs text-red-300">{selected.impact}</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
              <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                <Shield className="w-3.5 h-3.5" />处置建议
              </div>
              <div className="space-y-1 text-xs text-green-200">
                {selected.suggestion.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1">
              <Eye className="w-3 h-3" />查看完整分析报告
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirusAnalysis;
