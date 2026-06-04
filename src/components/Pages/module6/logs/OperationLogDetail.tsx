'use client';

import React, { useState } from 'react';
import { ArrowLeft, User, Clock, Monitor, Shield, FileText, Copy, CheckCircle } from 'lucide-react';

interface OperationDetail {
  id: string;
  username: string;
  ip: string;
  device: string;
  location: string;
  operation: string;
  module: string;
  target: string;
  time: string;
  result: 'success' | 'failed';
  details: string;
  beforeData: string;
  afterData: string;
}

export function OperationLogDetail() {
  const [copied, setCopied] = useState(false);

  const mockDetail: OperationDetail = {
    id: 'OP-001',
    username: 'admin',
    ip: '192.168.1.100',
    device: 'Windows PC',
    location: '总部办公室',
    operation: '新增',
    module: '同步任务配置',
    target: '用户数据同步',
    time: '2026-06-04 10:35:23',
    result: 'success',
    details: '创建了新的同步任务，配置为每天凌晨3点执行全量同步',
    beforeData: '{}',
    afterData: JSON.stringify({
      id: 'task-001',
      name: '用户数据同步',
      type: 'full',
      schedule: '0 3 * * *',
      source: 'MySQL',
      destination: 'Elasticsearch',
      enabled: true,
    }, null, 2),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockDetail.afterData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-[#2A354D] rounded text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-white">操作日志详情</h2>
          <p className="text-sm text-gray-400 mt-1">查看操作记录的详细信息</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-white">基本信息</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">操作ID</span>
              <span className="text-sm text-white font-mono">{mockDetail.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">操作用户</span>
              <span className="text-sm text-white">{mockDetail.username}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">IP地址</span>
              <span className="text-sm text-gray-300">{mockDetail.ip}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">设备</span>
              <span className="text-sm text-gray-300">{mockDetail.device}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">位置</span>
              <span className="text-sm text-gray-300">{mockDetail.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-white">操作信息</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">操作类型</span>
              <span className={`px-2 py-1 rounded text-xs bg-green-500/20 text-green-400`}>
                {mockDetail.operation}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">所属模块</span>
              <span className="text-sm text-white">{mockDetail.module}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">操作目标</span>
              <span className="text-sm text-white">{mockDetail.target}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">操作时间</span>
              <div className="flex items-center gap-1 text-sm text-gray-300">
                <Clock className="w-4 h-4" />
                {mockDetail.time}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">操作结果</span>
              <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${mockDetail.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <CheckCircle className="w-3 h-3" />
                {mockDetail.result === 'success' ? '成功' : '失败'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">操作详情</span>
        </div>
        <p className="text-sm text-gray-300 bg-[#111625] rounded-lg p-3">
          {mockDetail.details}
        </p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">数据变更</span>
          </div>
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs ${copied ? 'bg-green-600/20 text-green-400' : 'bg-[#2A354D] text-gray-400 hover:bg-[#354158]'}`}
          >
            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-2">变更前</div>
            <pre className="bg-[#111625] rounded-lg p-3 text-xs text-gray-500 overflow-x-auto">
              {mockDetail.beforeData}
            </pre>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">变更后</div>
            <pre className="bg-[#111625] rounded-lg p-3 text-xs text-green-400 overflow-x-auto">
              {mockDetail.afterData}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationLogDetail;