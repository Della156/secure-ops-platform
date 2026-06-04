'use client';

import { useState, useMemo } from 'react';
import { FileText, Download, Eye, RefreshCw, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Report {
  id: string;
  name: string;
  period: string;
  generateTime: string;
  status: 'completed' | 'failed';
}

const mockData: Report[] = [
  { id: 'RPT-001', name: 'APT攻击溯源分析报告', period: '2026-06-02', generateTime: '2026-06-02 09:30:00', status: 'completed' },
  { id: 'RPT-002', name: '数据泄露事件溯源报告', period: '2026-06-01', generateTime: '2026-06-01 15:10:00', status: 'completed' },
  { id: 'RPT-003', name: '内部威胁溯源报告', period: '2026-05-31', generateTime: '2026-05-31 16:40:00', status: 'completed' },
  { id: 'RPT-004', name: '勒索软件传播溯源报告', period: '2026-05-29', generateTime: '2026-05-29 11:00:00', status: 'completed' },
];

const attackTimeline = [
  { time: '09:00', event: '初始入侵', type: 'entry' },
  { time: '09:15', event: '横向移动', type: 'lateral' },
  { time: '09:30', event: '数据收集', type: 'data' },
  { time: '10:00', event: '数据外发', type: 'exfiltration' },
  { time: '10:30', event: '清理痕迹', type: 'cleanup' },
];

const iocData = [
  { type: 'IP地址', value: 8 },
  { type: '域名', value: 5 },
  { type: 'Hash值', value: 3 },
  { type: 'URL', value: 4 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

export function TraceAnalysisReport() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const columns = [
    { key: 'id', title: '报告ID', width: '120px' },
    { key: 'name', title: '报告名称' },
    { key: 'period', title: '分析周期', width: '120px' },
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
            <h2 className="text-lg font-semibold text-white">溯源分析任务报告</h2>
            <p className="text-xs text-slate-500 mt-1">查看和下载溯源分析报告</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
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
                  <span className="text-sm text-slate-400">分析周期</span>
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
              <h3 className="text-sm font-semibold text-white mb-3">事件概述</h3>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  本报告对APT攻击事件进行了全面的溯源分析。通过对网络流量、系统日志和安全事件的综合分析，
                  成功追踪到攻击者的入侵路径和攻击手法。分析结果显示，攻击者通过钓鱼邮件成功入侵内部网络，
                  随后进行横向移动并最终实施数据窃取行为。
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">攻击时间线</h3>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="relative">
                  <div className="absolute left-[14px] top-0 bottom-0 w-0.5 bg-slate-600"></div>
                  {attackTimeline.map((item, index) => (
                    <div key={index} className="relative flex items-start gap-4 mb-4 last:mb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.type === 'entry' ? 'bg-red-500/20 text-red-400' :
                        item.type === 'lateral' ? 'bg-orange-500/20 text-orange-400' :
                        item.type === 'data' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.type === 'exfiltration' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-50 font-medium">{item.event}</span>
                          <span className="text-xs text-slate-500">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">攻击路径</h3>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-4 py-8">
                  <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-2">
                    <span className="text-red-400 text-sm">入口点</span>
                  </div>
                  <div className="w-12 h-0.5 bg-red-500/50"></div>
                  <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg px-4 py-2">
                    <span className="text-orange-400 text-sm">跳板机</span>
                  </div>
                  <div className="w-12 h-0.5 bg-orange-500/50"></div>
                  <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg px-4 py-2">
                    <span className="text-yellow-400 text-sm">内部服务器</span>
                  </div>
                  <div className="w-12 h-0.5 bg-yellow-500/50"></div>
                  <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg px-4 py-2">
                    <span className="text-purple-400 text-sm">数据外泄</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">攻击者画像</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-2">攻击来源IP</p>
                  <p className="text-slate-50 font-mono">45.33.32.156</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-2">地理位置</p>
                  <p className="text-slate-50">美国 加利福尼亚州</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-2">攻击手法</p>
                  <p className="text-slate-50">钓鱼邮件 + 漏洞利用</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-2">威胁等级</p>
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-red-500/20 text-red-400">高危</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">IOC清单分布</h3>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-8">
                  <div className="w-48 h-48">
                    <PieChart width={192} height={192}>
                      <Pie
                        data={iocData}
                        cx="96"
                        cy="96"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {iocData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
                    </PieChart>
                  </div>
                  <div className="flex-1">
                    {iocData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                          <span className="text-slate-400 text-sm">{item.type}</span>
                        </div>
                        <span className="text-slate-50 font-medium">{item.value} 个</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">处置建议</h3>
              <div className="bg-amber-900/30 border border-amber-800/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-200 text-sm font-medium mb-2">安全建议</p>
                    <ul className="text-amber-300/80 text-xs space-y-1">
                      <li>• 立即封禁攻击者IP地址 45.33.32.156</li>
                      <li>• 检查并修补相关漏洞</li>
                      <li>• 加强邮件安全网关规则</li>
                      <li>• 对受影响系统进行全面安全检查</li>
                      <li>• 通知相关业务部门进行数据安全评估</li>
                    </ul>
                  </div>
                </div>
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

export default TraceAnalysisReport;