'use client';

import React, { useState } from 'react';
import { Search, Eye, FileText, Database, Network, Cpu, Folder } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const samples = [
  {
    id: 'SM-001',
    name: 'ransomware_sample.exe',
    staticFeatures: { fileHeader: 'PE32 executable', strings: 156, imports: 45 },
    dynamicBehavior: { registry: 23, fileOps: 15, network: 8 },
    threatLevel: '高危',
  },
  {
    id: 'SM-002',
    name: 'suspicious_doc.docx',
    staticFeatures: { fileHeader: 'OLE Compound', strings: 89, imports: 12 },
    dynamicBehavior: { registry: 5, fileOps: 3, network: 2 },
    threatLevel: '中危',
  },
  {
    id: 'SM-003',
    name: 'malware_dll.dll',
    staticFeatures: { fileHeader: 'PE32 DLL', strings: 234, imports: 67 },
    dynamicBehavior: { registry: 45, fileOps: 32, network: 15 },
    threatLevel: '高危',
  },
];

const threatColors = {
  '高危': 'bg-red-500/20 text-red-400',
  '中危': 'bg-yellow-500/20 text-yellow-400',
  '低危': 'bg-green-500/20 text-green-400',
};

export function SampleDeepAnalysis() {
  const [search, setSearch] = useState('');
  const [selectedSample, setSelectedSample] = useState(samples[0]);

  const filtered = samples.filter(s => s.name.includes(search) || s.id.includes(search));

  const behaviorGraphData = [
    { source: '入口点', target: '加载DLL', type: '正常' },
    { source: '加载DLL', target: '创建进程', type: '可疑' },
    { source: '创建进程', target: '网络连接', type: '恶意' },
    { source: '网络连接', target: '数据传输', type: '恶意' },
    { source: '创建进程', target: '文件操作', type: '可疑' },
    { source: '文件操作', target: '加密文件', type: '恶意' },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="样本深度分析" description="查看样本的静态特征和动态行为分析结果" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D]">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text" placeholder="搜索样本..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-6 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filtered.map(sample => (
                <div
                  key={sample.id} onClick={() => setSelectedSample(sample)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer transition ${
                    selectedSample?.id === sample.id ? 'bg-[#111625]' : 'hover:bg-[#111625]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-blue-400">{sample.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${threatColors[sample.threatLevel]}`}>
                      {sample.threatLevel}
                    </span>
                  </div>
                  <div className="text-sm text-white truncate">{sample.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-semibold text-white">静态特征分析</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">文件头</span>
                </div>
                <div className="text-sm text-white font-mono">{selectedSample?.staticFeatures?.fileHeader}</div>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-400">字符串数量</span>
                </div>
                <div className="text-sm text-white font-mono">{selectedSample?.staticFeatures?.strings}</div>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-slate-400">导入表数量</span>
                </div>
                <div className="text-sm text-white font-mono">{selectedSample?.staticFeatures?.imports}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Network className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-semibold text-white">动态行为分析</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-slate-400">注册表操作</span>
                </div>
                <div className="text-sm text-white font-mono">{selectedSample?.dynamicBehavior?.registry} 次</div>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="w-4 h-4 text-pink-400" />
                  <span className="text-xs text-slate-400">文件操作</span>
                </div>
                <div className="text-sm text-white font-mono">{selectedSample?.dynamicBehavior?.fileOps} 次</div>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-400">网络连接</span>
                </div>
                <div className="text-sm text-white font-mono">{selectedSample?.dynamicBehavior?.network} 次</div>
              </div>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Network className="w-5 h-5 text-green-400" />
              <h4 className="text-sm font-semibold text-white">行为图谱</h4>
            </div>
            <div className="bg-[#111625] rounded-lg p-4 min-h-[200px]">
              <div className="flex flex-wrap gap-4">
                {behaviorGraphData.map((edge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {edge.source}
                    </div>
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className={`px-3 py-1.5 text-xs rounded ${
                      edge.type === '恶意' ? 'bg-red-500/20 text-red-400' :
                      edge.type === '可疑' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {edge.target}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      edge.type === '恶意' ? 'bg-red-500/30 text-red-400' :
                      edge.type === '可疑' ? 'bg-yellow-500/30 text-yellow-400' :
                      'bg-green-500/30 text-green-400'
                    }`}>
                      {edge.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Eye className="w-4 h-4" />查看完整分析报告
          </button>
        </div>
      </div>
    </div>
  );
}

export default SampleDeepAnalysis;
