'use client';

import { useState } from 'react';
import { FileText, Download, Eye, RefreshCw, Calendar, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

interface Report {
  id: string;
  name: string;
  period: string;
  generateTime: string;
  status: 'completed' | 'failed';
}

const mockData: Report[] = [
  { id: 'REP-ELK-001', name: 'ELINK协同联动日报', period: '2026-06-03', generateTime: '2026-06-03 09:00:00', status: 'completed' },
  { id: 'REP-ELK-002', name: 'ELINK协同联动周报', period: '2026-05-27至2026-06-02', generateTime: '2026-06-02 09:00:00', status: 'completed' },
  { id: 'REP-ELK-003', name: 'ELINK告警统计报告', period: '2026-06-02', generateTime: '2026-06-02 18:00:00', status: 'completed' },
];

const reportStats = {
  totalMessages: 156,
  successfulSends: 148,
  failedSends: 8,
  successRate: 95,
  targetPlatforms: 5,
  avgResponseTime: '2.5秒',
};

export function ElinkReport() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const columns = [
    { key: 'id', title: '报告ID', width: '140px' },
    { key: 'name', title: '报告名称' },
    { key: 'period', title: '统计周期', width: '160px' },
    { key: 'generateTime', title: '生成时间', width: '160px' },
    {
      key: 'actions', title: '操作', width: '140px',
      render: (item: Report) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedReport(item)}>
            <Eye className="w-3 h-3 mr-1" />预览
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-3 h-3 mr-1" />下载
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">ELINK协同联动任务报告</h2>
            <p className="text-xs text-slate-500 mt-1">查看和下载ELINK协同联动报告</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">消息总数</span>
          </div>
          <div className="text-xl font-semibold text-white">{reportStats.totalMessages}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">成功率</span>
          </div>
          <div className="text-xl font-semibold text-white">{reportStats.successRate}%</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">🎯</span>
            <span className="text-xs text-slate-400">目标平台数</span>
          </div>
          <div className="text-xl font-semibold text-white">{reportStats.targetPlatforms}</div>
        </div>
      </div>

      <Card padding="none">
        <Table columns={columns} data={mockData} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal open={!!selectedReport} onClose={() => setSelectedReport(null)} title={selectedReport?.name || '报告预览'} width="max-w-4xl">
        {selectedReport && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">报告ID</span>
                </div>
                <p className="text-lg font-semibold text-white">{selectedReport.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">统计周期</span>
                </div>
                <p className="text-lg font-semibold text-white">{selectedReport.period}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-400">生成时间</span>
                </div>
                <p className="text-lg font-semibold text-white">{selectedReport.generateTime}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">统计概览</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">消息总数</p>
                  <p className="text-xl font-semibold text-white">{reportStats.totalMessages}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">成功发送</p>
                  <p className="text-xl font-semibold text-green-400">{reportStats.successfulSends}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">失败次数</p>
                  <p className="text-xl font-semibold text-red-400">{reportStats.failedSends}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">报告内容摘要</h3>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-slate-300 text-sm">
                  本报告统计了{selectedReport.period}期间ELINK协同联动的运行情况。
                  期间共发送消息{reportStats.totalMessages}条，成功{reportStats.successfulSends}条，成功率{reportStats.successRate}%。
                  平均响应时间{reportStats.avgResponseTime}，覆盖{reportStats.targetPlatforms}个目标平台。
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedReport(null)}>关闭</Button>
              <Button variant="primary"><Download className="w-3.5 h-3.5 mr-1" />下载报告</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ElinkReport;