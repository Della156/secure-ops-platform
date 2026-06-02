'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Shield, AlertCircle } from 'lucide-react';

interface OverWideItem {
  id: string;
  policyName: string;
  source: string;
  destination: string;
  port: string;
  wideField: string;
  riskLevel: 'high' | 'medium';
}

const mockItems: OverWideItem[] = [
  { id: 'OW-001', policyName: '策略A', source: 'any', destination: '10.0.0.0/8', port: 'any', wideField: '源地址、端口', riskLevel: 'high' },
  { id: 'OW-002', policyName: '策略B', source: '192.168.1.0/24', destination: 'any', port: '443', wideField: '目的地址', riskLevel: 'medium' },
];

export function PolicyOverWideDetect() {
  const [items] = useState(mockItems);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略过宽检测</h2>
        <p className="text-sm text-gray-400 mt-1">自动检测策略源/目的/端口是否过宽（如any），过宽策略识别与展示，风险提示</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">过宽策略数</p>
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
                  item.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.riskLevel === 'high' ? '高风险' : '中风险'}
                </span>
              </div>
              <AlertCircle className={`w-5 h-5 ${item.riskLevel === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">源地址</p>
                <p className={`text-sm ${item.source === 'any' ? 'text-red-400 font-medium' : 'text-gray-300'}`}>{item.source}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">目的地址</p>
                <p className={`text-sm ${item.destination === 'any' ? 'text-red-400 font-medium' : 'text-gray-300'}`}>{item.destination}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">端口</p>
                <p className={`text-sm ${item.port === 'any' ? 'text-red-400 font-medium' : 'text-gray-300'}`}>{item.port}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">过宽字段</p>
                <p className="text-yellow-400">{item.wideField}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="text-sm text-red-400">
                ⚠️ 风险提示：该策略的 {item.wideField} 设置为 "any"，存在安全风险，建议缩小范围
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}