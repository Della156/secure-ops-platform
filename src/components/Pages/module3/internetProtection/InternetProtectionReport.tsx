'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Eye, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const mockReports = [
  { id: 'RPT-001', name: '互联网防护监测日报', period: '2024-01-15', generatedAt: '2024-01-15 08:00:00', status: 'generated', type: 'daily' },
  { id: 'RPT-002', name: '互联网防护监测周报', period: '2024-01-08至2024-01-14', generatedAt: '2024-01-14 18:00:00', status: 'generated', type: 'weekly' },
  { id: 'RPT-003', name: '互联网防护监测日报', period: '2024-01-14', generatedAt: '2024-01-14 08:00:00', status: 'generated', type: 'daily' },
  { id: 'RPT-004', name: '互联网防护监测月报', period: '2024-01', generatedAt: '2024-01-31 18:00:00', status: 'generating', type: 'monthly' },
  { id: 'RPT-005', name: '互联网防护监测日报', period: '2024-01-13', generatedAt: '2024-01-13 08:00:00', status: 'generated', type: 'daily' },
];

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = { daily: '日报', weekly: '周报', monthly: '月报' };
  return labels[type] || type;
};

const getTypeStyle = (type: string) => {
  const styles: Record<string, string> = {
    daily: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    weekly: 'bg-green-500/20 text-green-400 border-green-500/40',
    monthly: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  };
  return styles[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
};

const getStatusStyle = (status: string) => status === 'generated'
  ? 'bg-green-500/20 text-green-400 border-green-500/40'
  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';

const getStatusText = (status: string) => status === 'generated' ? '已生成' : '生成中';

const getRankStyle = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500/20 text-yellow-400';
  if (rank === 2) return 'bg-slate-500/20 text-slate-400';
  if (rank === 3) return 'bg-orange-500/20 text-orange-400';
  return 'bg-slate-700/50 text-slate-300';
};

const attackTypes = [
  { type: 'DDoS攻击', percentage: 45, count: 1250 },
  { type: '端口扫描', percentage: 20, count: 567 },
  { type: 'SQL注入', percentage: 16, count: 456 },
  { type: 'XSS攻击', percentage: 12, count: 342 },
  { type: '其他', percentage: 7, count: 195 },
];

const topAttackers = [
  { rank: 1, ip: '192.168.1.100', attacks: 156, country: '中国' },
  { rank: 2, ip: '10.0.0.50', attacks: 98, country: '美国' },
  { rank: 3, ip: '172.16.0.25', attacks: 76, country: '俄罗斯' },
  { rank: 4, ip: '192.168.2.150', attacks: 65, country: '中国' },
  { rank: 5, ip: '10.5.0.30', attacks: 45, country: '韩国' },
];

export function InternetProtectionReport() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">互联网防护监测任务报告</h1>
          <p className="text-slate-400 mt-1">查看和生成互联网防护监测相关报告</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm"><Calendar className="w-4 h-4 mr-2" />选择日期范围</Button>
          <Button variant="primary"><RefreshCw className="w-4 h-4 mr-2" />生成报告</Button>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">报告概览</h3>
              <div className="space-y-3">
                {mockReports.map((report) => (
                  <div
                    key={report.id}
                    className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer transition-colors ${selectedReport.id === report.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-800'}`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-slate-50 font-medium">{report.name}</p>
                        <p className="text-slate-500 text-sm">{report.period}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getTypeStyle(report.type)}`}>
                        {getTypeLabel(report.type)}
                      </span>
                      <span className="text-slate-500 text-xs">{report.generatedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">报告内容预览</h3>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                  <div>
                    <h4 className="text-xl font-bold text-slate-50">{selectedReport.name}</h4>
                    <p className="text-slate-400 mt-1">报告周期: {selectedReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm"><Eye className="w-4 h-4 mr-2" />在线查看</Button>
                    <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" />下载PDF</Button>
                    <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" />下载Excel</Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">一、攻击总览</h5>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-400">2,341</p>
                        <p className="text-slate-500 text-sm mt-1">攻击事件总数</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-400">156</p>
                        <p className="text-slate-500 text-sm mt-1">攻击源IP数</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-400">45</p>
                        <p className="text-slate-500 text-sm mt-1">高危事件数</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-400">98%</p>
                        <p className="text-slate-500 text-sm mt-1">防护成功率</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">二、攻击类型分布</h5>
                    <div className="space-y-2">
                      {attackTypes.map((item) => (
                        <div key={item.type} className="flex items-center">
                          <span className="w-32 text-slate-400 text-sm">{item.type}</span>
                          <div className="flex-1 mx-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${item.percentage}%` }} />
                          </div>
                          <span className="w-20 text-right text-slate-300 text-sm">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">三、高危攻击者TOP 5</h5>
                    <div className="space-y-2">
                      {topAttackers.map((item) => (
                        <div key={item.rank} className="flex items-center bg-slate-700/30 rounded-lg p-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankStyle(item.rank)}`}>
                            {item.rank}
                          </span>
                          <span className="ml-3 font-mono text-slate-50">{item.ip}</span>
                          <span className="ml-auto text-slate-400 text-sm">{item.country}</span>
                          <span className="ml-4 text-red-400 font-bold">{item.attacks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">四、分析结论</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      本次监测周期内，共检测到边界攻击事件2,341起，涉及攻击源IP 156个。
                      攻击类型以DDoS攻击为主，占比45%。高危事件45起，均已及时处置。
                      防护系统运行正常，防护成功率达98%。建议继续加强对TOP攻击者的监控和封堵。
                    </p>
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

export default InternetProtectionReport;
