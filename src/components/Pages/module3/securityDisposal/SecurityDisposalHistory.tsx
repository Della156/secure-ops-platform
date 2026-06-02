'use client';
import React from 'react';
import { Search as SearchIcon, Eye, RefreshCw, Download, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { StandardSubPage, SubPageColumn } from '@/components/Common/StandardSubPage';
import { StatusBadge } from '@/components/Common/StatusBadge';

const mockData = [
{ id:'TH-001', name:'安全处置', status:'completed', executeTime:'2026-06-02 08:00', result:'成功' },
  { id:'TH-002', name:'安全处置', status:'completed', executeTime:'2026-06-02 07:00', result:'成功' },
  { id:'TH-003', name:'安全处置', status:'failed', executeTime:'2026-06-02 06:00', result:'失败' },
  { id:'TH-004', name:'安全处置', status:'completed', executeTime:'2026-06-02 05:00', result:'部分成功' },
  { id:'TH-005', name:'安全处置', status:'completed', executeTime:'2026-06-02 04:00', result:'成功' }
];

const extraColumns: SubPageColumn[] = [

    { key:'executeTime', title:'执行时间' },
    { key:'result', title:'执行结果', render:(v:string) => <StatusBadge status={v==='成功'?'completed':v==='部分成功'?'warning':'failed'} /> }, 
];

const extraStats = (data: any[]) => [];

export function SecurityDisposalHistory() {
  return (
    <StandardSubPage
      title="安全处置历史记录"
      description="查看任务的历史执行记录 - 安全处置历史记录"
      mockData={mockData}
      columns={extraColumns}
      extraStats={extraStats}
    />
  );
}
