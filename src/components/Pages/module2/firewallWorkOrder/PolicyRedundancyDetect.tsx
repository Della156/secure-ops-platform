'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Shield, Lightbulb } from 'lucide-react';

interface RedundancyItem {
  id: string;
  policyName: string;
  source: string;
  destination: string;
  port: string;
  redundantWith: string;
  severity: 'high' | 'medium';
}

const mockItems: RedundancyItem[] = [
  { id: 'RED-001', policyName: '策略A', source: '192.168.1.0/24', destination: '10.0.0.0/8', port: '80', redundantWith: '策略B', severity: 'high' },
  { id: 'RED-002', policyName: '策略C', source: '192.168.2.0/24', destination: '10.0.0.0/8', port: '443', redundantWith: '策略D', severity: 'medium' },
];

export function PolicyRedundancyDetect() {
  const [items] = useState(mockItems);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略冗余检测</h2>
        <p className="text-sm text-gray-400 mt-1">自动检测策略是否存在冗余，冗余策略识别与展示，冗余策略清理建议</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">冗余策略数</p>
              <p className="text-xl font-semibold text-red-400">{items.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">检测完成</p>
              <p className="text-xl font-semibold text-green-400">是</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="text-white font-medium">{item.policyName}</span>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  item.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.severity === 'high' ? '高风险' : '中风险'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-500 text-xs">源地址</p>
                <p className="text-gray-300">{item.source}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">目的地址</p>
                <p className="text-gray-300">{item.destination}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">端口</p>
                <p className="text-gray-300">{item.port}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">与策略冗余</p>
                <p className="text-red-400">{item.redundantWith}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-yellow-400">清理建议</p>
                <p className="text-sm text-gray-300">该策略与 {item.redundantWith} 存在冗余，建议删除 {item.policyName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}