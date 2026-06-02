'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, User, MessageSquare, FileText, Send, ArrowRight } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  time?: string;
}

const mockSteps: Step[] = [
  { id: 'step-1', title: '故障发现', description: '系统检测到异常', status: 'completed', time: '10:30:00' },
  { id: 'step-2', title: '工单创建', description: '自动创建故障工单', status: 'completed', time: '10:30:15' },
  { id: 'step-3', title: '人员分派', description: '分配给运维人员', status: 'completed', time: '10:35:00' },
  { id: 'step-4', title: '故障排查', description: '定位问题原因', status: 'current', time: '10:40:00' },
  { id: 'step-5', title: '问题修复', description: '实施解决方案', status: 'pending' },
  { id: 'step-6', title: '验证恢复', description: '确认故障已解决', status: 'pending' },
];

export function FaultProcessing() {
  const [comment, setComment] = useState('');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">故障处理流程</h2>
        <p className="text-sm text-gray-400 mt-1">当前处理进度、处理操作、备注记录</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">数据库连接超时</h3>
              <p className="text-sm text-gray-400">工单编号: FLT-001</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2A354D]" />
            
            <div className="space-y-6">
              {mockSteps.map((step, index) => (
                <div key={step.id} className="relative flex gap-4">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500/20' : 
                    step.status === 'current' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                  }`}>
                    {step.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-400" />}
                    {step.status === 'current' && <Clock className="w-6 h-6 text-blue-400" />}
                    {step.status === 'pending' && <span className="text-gray-400 font-medium">{index + 1}</span>}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${step.status === 'pending' ? 'text-gray-500' : 'text-white'}`}>
                        {step.title}
                      </h4>
                      {step.time && (
                        <span className="text-xs text-gray-500">{step.time}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                    {step.status === 'current' && (
                      <div className="mt-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-400">admin 正在处理</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">处理操作</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4" />
                确认收到
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                <Clock className="w-4 h-4" />
                延长处理时间
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                <AlertTriangle className="w-4 h-4" />
                升级故障级别
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4" />
                完成处理
              </button>
            </div>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">添加备注</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="输入处理备注..."
              className="w-full px-4 py-3 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
            />
            <button className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Send className="w-4 h-4" />
              提交备注
            </button>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">相关文档</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">故障处理手册.pdf</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">数据库恢复指南.pdf</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}