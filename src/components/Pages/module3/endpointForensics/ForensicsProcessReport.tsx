'use client';

import React, { useState } from 'react';
import { PlayCircle, FileText, Download, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Operation {
  time: string;
  type: string;
  content: string;
  status: 'success' | 'warning' | 'info';
}

const operations: Operation[] = [
  { time: '09:30:00', type: '开始取证', content: '启动终端取证流程，目标终端: PC-WIN-001', status: 'info' },
  { time: '09:30:15', type: '连接终端', content: '成功建立与目标终端的安全连接', status: 'success' },
  { time: '09:30:30', type: '获取样本', content: '开始扫描异常文件，发现 5 个可疑文件', status: 'info' },
  { time: '09:31:00', type: '获取样本', content: '成功获取 suspicious.exe (156 KB)', status: 'success' },
  { time: '09:31:30', type: '获取样本', content: '成功获取 malware.dll (78 KB)', status: 'success' },
  { time: '09:32:00', type: '调取日志', content: '开始调取系统日志', status: 'info' },
  { time: '09:32:30', type: '调取日志', content: '成功获取系统日志 (256 KB)', status: 'success' },
  { time: '09:33:00', type: '调取日志', content: '成功获取应用日志 (512 KB)', status: 'success' },
  { time: '09:33:30', type: '完整性校验', content: '对获取的文件进行 MD5 校验', status: 'info' },
  { time: '09:34:00', type: '生成报告', content: '开始生成取证报告', status: 'info' },
  { time: '09:34:30', type: '完成取证', content: '取证流程完成，共获取 5 个样本，2 份日志', status: 'success' },
];

const statusConfig = {
  success: { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-green-400' },
  warning: { icon: <AlertCircle className="w-3 h-3" />, color: 'text-yellow-400' },
  info: { icon: <Clock className="w-3 h-3" />, color: 'text-blue-400' },
};

export function ForensicsProcessReport() {
  const [selectedTask, setSelectedTask] = useState('FOR-001');

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">取证过程记录与报告生成</h3>
            <p className="text-xs text-slate-500 mt-1">记录取证操作时间线，自动生成标准化取证报告</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedTask} onChange={e => setSelectedTask(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-3 py-1.5"
            >
              <option value="FOR-001">FOR-001 - 终端异常取证</option>
              <option value="FOR-002">FOR-002 - 恶意软件取证</option>
              <option value="FOR-003">FOR-003 - 数据泄露调查</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <FileText className="w-3.5 h-3.5" />生成报告
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />下载报告
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-semibold text-white">取证操作时间线</h4>
        </div>
        <div className="space-y-3">
          {operations.map((op, idx) => {
            const sc = statusConfig[op.status];
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${op.status === 'success' ? 'bg-green-500/20' : op.status === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                    {sc.icon}
                  </div>
                  {idx < operations.length - 1 && (
                    <div className="w-0.5 h-full bg-[#2A354D] mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">{op.time}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${op.status === 'success' ? 'bg-green-500/20 text-green-400' : op.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {op.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{op.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-semibold text-white">取证报告预览</h4>
        </div>
        <div className="bg-[#111625] rounded-lg p-4 space-y-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">取证目标</div>
            <p className="text-sm text-white">PC-WIN-001</p>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">取证时间</div>
            <p className="text-sm text-white">2026-06-03 09:30:00 - 09:34:30</p>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">取证内容清单</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#20293F] rounded p-2">
                <div className="text-xs text-slate-400">样本文件</div>
                <div className="text-xs text-white">5 个</div>
              </div>
              <div className="bg-[#20293F] rounded p-2">
                <div className="text-xs text-slate-400">日志文件</div>
                <div className="text-xs text-white">2 份</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">文件完整性校验</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400">所有文件校验通过</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForensicsProcessReport;
