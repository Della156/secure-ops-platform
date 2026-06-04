'use client';

import { useState } from 'react';
import { Network, Database, Shield, AlertCircle, Link2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const mockAlerts = [
  { id: 'ALT-001', name: '异常登录告警', severity: 'high', context: { alerts: 5, assets: 3, vulnerabilities: 2, intel: 1 } },
  { id: 'ALT-002', name: '恶意软件告警', severity: 'critical', context: { alerts: 8, assets: 5, vulnerabilities: 4, intel: 3 } },
  { id: 'ALT-003', name: '端口扫描告警', severity: 'medium', context: { alerts: 3, assets: 2, vulnerabilities: 1, intel: 0 } },
  { id: 'ALT-004', name: '数据泄露告警', severity: 'high', context: { alerts: 6, assets: 4, vulnerabilities: 3, intel: 2 } },
  { id: 'ALT-005', name: 'DDoS攻击告警', severity: 'critical', context: { alerts: 12, assets: 8, vulnerabilities: 5, intel: 4 } },
];

const getSeverityStyle = (severity: string) => {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/40',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    low: 'bg-green-500/20 text-green-400 border-green-500/40',
  };
  return styles[severity] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
};

const getSeverityText = (severity: string) => {
  const texts: Record<string, string> = { critical: '严重', high: '高危', medium: '中危', low: '低危' };
  return texts[severity] || severity;
};

const getImportanceStyle = (importance: string) =>
  importance === '核心'
    ? 'bg-red-500/20 text-red-400 border-red-500/40'
    : 'bg-blue-500/20 text-blue-400 border-blue-500/40';

const assetsData = [
  { name: 'Web服务器-01', type: '服务器', importance: '核心' },
  { name: '数据库服务器-01', type: '服务器', importance: '核心' },
  { name: '应用服务器-02', type: '服务器', importance: '重要' },
];

export function MultiSourceAutoIntegration() {
  const [selectedAlert, setSelectedAlert] = useState(mockAlerts[0]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">多源信息自动整合</h1>
        <p className="text-slate-400 mt-1">展示整合的告警上下文信息，包括关联的告警、资产、漏洞和威胁情报</p>
      </div>

      <Card padding="none">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">告警列表</h3>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer transition-colors ${selectedAlert.id === alert.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-800'}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-50 font-medium">{alert.name}</p>
                        <p className="text-slate-500 text-sm">{alert.id}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getSeverityStyle(alert.severity)}`}>
                        {getSeverityText(alert.severity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">告警上下文聚合</h3>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-50">{selectedAlert.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getSeverityStyle(selectedAlert.severity)}`}>
                          {getSeverityText(selectedAlert.severity)}
                        </span>
                        <span className="text-slate-500 text-sm">{selectedAlert.id}</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Link2 className="w-4 h-4 mr-2" />查看完整关联
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <p className="text-2xl font-bold text-red-400">{selectedAlert.context.alerts}</p>
                      <p className="text-slate-500 text-sm mt-1">关联告警</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                        <Database className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-blue-400">{selectedAlert.context.assets}</p>
                      <p className="text-slate-500 text-sm mt-1">关联资产</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-5 h-5 text-yellow-400" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-400">{selectedAlert.context.vulnerabilities}</p>
                      <p className="text-slate-500 text-sm mt-1">关联漏洞</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                        <Network className="w-5 h-5 text-purple-400" />
                      </div>
                      <p className="text-2xl font-bold text-purple-400">{selectedAlert.context.intel}</p>
                      <p className="text-slate-500 text-sm mt-1">威胁情报</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h4 className="text-slate-400 font-medium mb-3">关联资产详情</h4>
                  <div className="space-y-2">
                    {assetsData.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-2">
                        <div>
                          <p className="text-slate-50">{asset.name}</p>
                          <p className="text-slate-500 text-sm">{asset.type}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getImportanceStyle(asset.importance)}`}>
                          {asset.importance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MultiSourceAutoIntegration;
