'use client';

import React, { useState } from 'react';
import { Search, Eye, Download, FileText, AlertTriangle, Shield, Database } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const summaries = [
  {
    id: 'SUM-001',
    sampleName: 'ransomware_sample.exe',
    maliciousType: '勒索软件',
    threatLevel: '高危',
    iocCount: 15,
    suggestion: '建议立即隔离受影响主机，阻止该样本的传播，并通知相关业务部门进行应急响应。',
  },
  {
    id: 'SUM-002',
    sampleName: 'trojan_agent.dll',
    maliciousType: '木马程序',
    threatLevel: '中危',
    iocCount: 8,
    suggestion: '建议删除恶意文件，检查系统是否存在其他感染迹象，并加强终端防护策略。',
  },
  {
    id: 'SUM-003',
    sampleName: 'spyware_installer.exe',
    maliciousType: '间谍软件',
    threatLevel: '中危',
    iocCount: 12,
    suggestion: '建议清除恶意软件，修改相关账号密码，并监控网络流量异常。',
  },
];

const threatColors = {
  '高危': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  '中危': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  '低危': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

const iocs = [
  { type: 'IP地址', value: '192.168.1.100', description: 'C2服务器' },
  { type: '域名', value: 'malicious.example.com', description: '恶意域名' },
  { type: '文件哈希', value: 'a1b2c3d4e5f6...', description: 'MD5' },
  { type: '注册表键', value: 'HKCU\\Software\\Malware', description: '持久化项' },
];

export function AnalysisResultSummary() {
  const [search, setSearch] = useState('');
  const [selectedSummary, setSelectedSummary] = useState(summaries[0]);
  const [showDetail, setShowDetail] = useState(false);

  const filtered = summaries.filter(s => s.sampleName.includes(search) || s.id.includes(search));

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="分析结果智能总结" description="查看样本分析的智能总结和IOC信息" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索样本名称..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-6 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map(summary => {
              const colors = threatColors[summary.threatLevel as keyof typeof threatColors];
              return (
                <div
                  key={summary.id} onClick={() => { setSelectedSummary(summary); setShowDetail(true); }}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer transition hover:bg-[#111625]/50 ${
                    selectedSummary?.id === summary.id ? 'bg-[#111625]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-blue-400">{summary.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                      {summary.threatLevel}
                    </span>
                  </div>
                  <div className="text-sm text-white">{summary.sampleName}</div>
                  <div className="text-xs text-slate-500 mt-1">类型: {summary.maliciousType} | IOC: {summary.iocCount} 条</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">总结结果</h4>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
                  <Download className="w-3 h-3" />导出IOC
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md">
                  <FileText className="w-3 h-3" />导出报告
                </button>
              </div>
            </div>

            <div className="bg-[#111625] rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg ${threatColors[selectedSummary.threatLevel as keyof typeof threatColors].bg} flex items-center justify-center`}>
                  <AlertTriangle className={`w-6 h-6 ${threatColors[selectedSummary.threatLevel as keyof typeof threatColors].text}`} />
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{selectedSummary.sampleName}</div>
                  <div className="text-xs text-slate-400">{selectedSummary.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#20293F] rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">恶意类型</div>
                  <div className="text-sm text-white">{selectedSummary.maliciousType}</div>
                </div>
                <div className="bg-[#20293F] rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">威胁等级</div>
                  <span className={`text-sm px-2 py-0.5 rounded ${threatColors[selectedSummary.threatLevel as keyof typeof threatColors].bg} ${threatColors[selectedSummary.threatLevel as keyof typeof threatColors].text}`}>
                    {selectedSummary.threatLevel}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />IOC清单 ({selectedSummary.iocCount} 条)
                </div>
                <div className="space-y-2">
                  {iocs.map((ioc, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#20293F] rounded-lg px-3 py-2">
                      <div>
                        <div className="text-xs text-slate-400">{ioc.type}</div>
                        <div className="text-sm text-white font-mono">{ioc.value}</div>
                      </div>
                      <span className="text-xs text-slate-500">{ioc.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />防范建议
                </div>
                <div className="bg-[#20293F] rounded-lg p-3">
                  <p className="text-xs text-slate-300">{selectedSummary.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResultSummary;
