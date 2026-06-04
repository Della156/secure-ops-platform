'use client';

import React, { useState } from 'react';
import { Search, Download, Eye, CloudDownload, Plus, X, Save } from 'lucide-react';

interface Sample {
  id: string;
  source: string;
  fileName: string;
  filePath: string;
  size: string;
  md5: string;
  status: 'acquired' | 'pending' | 'failed';
  acquireTime: string;
}

const samples: Sample[] = [
  { id: 'SMP-001', source: 'PC-WIN-001', fileName: 'suspicious.exe', filePath: 'C:\\Temp\\suspicious.exe', size: '156 KB', md5: 'a1b2c3d4e5f6', status: 'acquired', acquireTime: '2026-06-03 09:35:00' },
  { id: 'SMP-002', source: 'PC-WIN-001', fileName: 'malware.dll', filePath: 'C:\\System32\\malware.dll', size: '78 KB', md5: 'b2c3d4e5f6a1', status: 'acquired', acquireTime: '2026-06-03 09:36:00' },
  { id: 'SMP-003', source: 'PC-WIN-005', fileName: 'payload.bin', filePath: 'D:\\Downloads\\payload.bin', size: '256 KB', md5: 'c3d4e5f6a1b2', status: 'acquired', acquireTime: '2026-06-03 10:20:00' },
  { id: 'SMP-004', source: 'PC-LINUX-003', fileName: 'backdoor.sh', filePath: '/tmp/backdoor.sh', size: '4 KB', md5: 'd4e5f6a1b2c3', status: 'acquired', acquireTime: '2026-06-03 08:15:00' },
  { id: 'SMP-005', source: 'PC-MAC-002', fileName: 'evil.app', filePath: '/Applications/evil.app', size: '1.2 MB', md5: 'e5f6a1b2c3d4', status: 'acquired', acquireTime: '2026-06-03 07:45:00' },
];

const getStatusConfig = (status: Sample['status']) => {
  const config = {
    acquired: { label: '已获取', color: 'text-green-400', bg: 'bg-green-500/20' },
    pending: { label: '待获取', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    failed: { label: '获取失败', color: 'text-red-400', bg: 'bg-red-500/20' },
  };
  return config[status];
};

export function AbnormalSampleAcquisition() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredSamples = samples.filter(sample => {
    if (search && !sample.fileName.includes(search) && !sample.source.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">异常文件样本自动获取</h3>
            <p className="text-xs text-slate-500 mt-1">自动获取终端上的异常文件样本</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            <Plus className="w-3.5 h-3.5" />获取样本
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text" placeholder="搜索文件名或来源终端..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111625]">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">样本ID</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">来源终端</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">文件名</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">文件路径</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">大小</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">MD5</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">状态</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">获取时间</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.map(sample => {
                const sc = getStatusConfig(sample.status);
                return (
                  <tr key={sample.id} className="border-b border-[#2A354D] hover:bg-[#111625]/50">
                    <td className="px-4 py-3 text-xs text-blue-400 font-mono">{sample.id}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{sample.source}</td>
                    <td className="px-4 py-3 text-xs text-white">{sample.fileName}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{sample.filePath}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{sample.size}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{sample.md5}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{sample.acquireTime}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mr-2">
                        <Eye className="w-3 h-3" />查看
                      </button>
                      <button className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
                        <CloudDownload className="w-3 h-3" />下载
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 w-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">获取异常样本</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">目标终端</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5">
                  <option value="">请选择终端</option>
                  <option value="PC-WIN-001">PC-WIN-001</option>
                  <option value="PC-WIN-005">PC-WIN-005</option>
                  <option value="PC-LINUX-003">PC-LINUX-003</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">文件路径</label>
                <input
                  type="text" placeholder="输入文件路径或留空自动扫描"
                  className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">扫描类型</label>
                <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5">
                  <option value="auto">自动检测异常文件</option>
                  <option value="suspicious">仅可疑文件</option>
                  <option value="all">全部文件</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">取消</button>
              <button onClick={() => setShowModal(false)} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1">
                <CloudDownload className="w-3 h-3" />开始获取
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AbnormalSampleAcquisition;
