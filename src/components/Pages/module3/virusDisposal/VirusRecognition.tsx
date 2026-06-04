'use client';

import React, { useState } from 'react';
import {
  Search, Eye, Download, RefreshCw, AlertCircle,
  Server, FileText, Clock, MapPin, CheckCircle2
} from 'lucide-react';

interface RecognitionResult {
  id: string;
  virusName: string;
  type: string;
  target: string;
  filePath: string;
  foundTime: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'quarantined' | 'cleaned' | 'pending';
}

const results: RecognitionResult[] = [
  {
    id: 'VR-20260603001',
    virusName: 'Kinsing',
    type: '挖矿木马',
    target: '终端-0128',
    filePath: '/tmp/miner/bitcoin-miner',
    foundTime: '2026-06-03 07:30:12',
    riskLevel: 'high',
    status: 'cleaned',
  },
  {
    id: 'VR-20260603002',
    virusName: 'Emotet',
    type: '勒索软件',
    target: '终端-0256',
    filePath: 'C:\\Users\\user\\Downloads\\invoice.exe',
    foundTime: '2026-06-03 09:15:00',
    riskLevel: 'critical',
    status: 'quarantined',
  },
  {
    id: 'VR-20260603003',
    virusName: 'CryptoLocker',
    type: '勒索软件',
    target: '服务器-045',
    filePath: '/var/tmp/encryptor.sh',
    foundTime: '2026-06-03 09:30:00',
    riskLevel: 'critical',
    status: 'detected',
  },
  {
    id: 'VR-20260602001',
    virusName: 'Trojan.Agent',
    type: '木马',
    target: '终端-0101',
    filePath: 'C:\\Windows\\System32\\svchost.exe',
    foundTime: '2026-06-02 14:20:00',
    riskLevel: 'medium',
    status: 'cleaned',
  },
  {
    id: 'VR-20260601001',
    virusName: 'WannaCry',
    type: '勒索软件',
    target: '文件服务器',
    filePath: '/share/public/ransomware.exe',
    foundTime: '2026-06-01 16:00:00',
    riskLevel: 'critical',
    status: 'quarantined',
  },
];

export function VirusRecognition() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>('VR-20260603001');

  const filtered = results.filter(r => {
    if (search && !r.virusName.includes(search) && !r.target.includes(search) && !r.filePath.includes(search)) return false;
    return true;
  });

  const selected = selectedId ? results.find(r => r.id === selectedId) : null;

  const getRiskColor = (risk: RecognitionResult['riskLevel']) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      critical: 'bg-red-500/20 text-red-400',
    };
    return colors[risk];
  };

  const getStatusConfig = (status: RecognitionResult['status']) => {
    const config = {
      detected: { label: '已检测', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
      quarantined: { label: '已隔离', color: 'text-blue-400', bg: 'bg-blue-500/20' },
      cleaned: { label: '已清除', color: 'text-green-500', bg: 'bg-green-500/20' },
      pending: { label: '待处理', color: 'text-slate-400', bg: 'bg-slate-500/20' },
    };
    return config[status];
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">病毒自动识别与定位</h2>
            <p className="text-xs text-slate-500 mt-1">实时检测和定位病毒威胁，展示识别结果</p>
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
            type="text" placeholder="搜索病毒名称/目标终端/文件路径..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">病毒识别结果 ({filtered.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111625]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">事件ID</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">病毒名称</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">类型</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">感染终端</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">文件路径</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">发现时间</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">风险等级</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">状态</th>
                  <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(result => {
                  const rc = getStatusConfig(result.status);
                  return (
                    <tr key={result.id} onClick={() => setSelectedId(result.id)} className={`border-b border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer ${selectedId === result.id ? 'bg-[#111625]' : ''}`}>
                      <td className="px-4 py-3 text-xs text-blue-400 font-mono">{result.id}</td>
                      <td className="px-4 py-3 text-xs text-white font-medium">{result.virusName}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{result.type}</td>
                      <td className="px-4 py-3 text-xs text-slate-300">{result.target}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">{result.filePath}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{result.foundTime}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRiskColor(result.riskLevel)}`}>
                          {result.riskLevel === 'critical' ? '紧急' : result.riskLevel === 'high' ? '高' : result.riskLevel === 'medium' ? '中' : '低'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${rc.bg} ${rc.color}`}>
                          {rc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <Eye className="w-3 h-3" />详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRiskColor(selected.riskLevel)}`}>
                  {selected.riskLevel === 'critical' ? '紧急' : selected.riskLevel === 'high' ? '高' : selected.riskLevel === 'medium' ? '中' : '低'}风险
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.virusName}</h3>
              <p className="text-xs text-slate-400">类型: {selected.type}</p>
            </div>

            <div className="bg-[#111625] rounded p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5" />感染详情
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">感染终端:</span>
                  <span className="text-slate-200">{selected.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">文件路径:</span>
                  <span className="text-slate-200 font-mono">{selected.filePath}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">发现时间:</span>
                  <span className="text-slate-200 font-mono">{selected.foundTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111625] rounded p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />传播路径分析
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <p>1. 通过钓鱼邮件附件传播</p>
                <p>2. 利用漏洞 CVE-2024-XXXX 入侵</p>
                <p>3. 横向移动至内网其他主机</p>
              </div>
            </div>

            <div className="bg-[#111625] rounded p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <FileText className="w-3.5 h-3.5" />病毒信息
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">威胁等级:</span>
                  <span className="text-red-400">高危</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">首次发现:</span>
                  <span className="text-slate-200">2024-03-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">变种数:</span>
                  <span className="text-slate-200">12</span>
                </div>
              </div>
            </div>

            {selected.status === 'detected' && (
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md">
                  隔离文件
                </button>
                <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md">
                  清除病毒
                </button>
              </div>
            )}
            {selected.status === 'quarantined' && (
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md">
                  清除病毒
                </button>
                <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
                  恢复文件
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VirusRecognition;
