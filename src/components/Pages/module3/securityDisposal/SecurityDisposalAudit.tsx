'use client';
import React from 'react';
import { Search as SearchIcon, Eye, RefreshCw, Download, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { StandardSubPage, SubPageColumn } from '@/components/Common/StandardSubPage';

const mockData = [
{ id:'TA-001', name:'安全处置', status:'completed', operator:'admin', action:'创建任务', operateTime:'2026-06-02 08:00' },
  { id:'TA-002', name:'安全处置', status:'completed', operator:'admin', action:'修改配置', operateTime:'2026-06-02 07:30' },
  { id:'TA-003', name:'安全处置', status:'running', operator:'zhangsan', action:'启动执行', operateTime:'2026-06-02 07:00' },
  { id:'TA-004', name:'安全处置', status:'failed', operator:'system', action:'自动重试', operateTime:'2026-06-02 06:30' },
  { id:'TA-005', name:'安全处置', status:'completed', operator:'lisi', action:'查看报告', operateTime:'2026-06-02 06:00' }
];

const extraColumns: SubPageColumn[] = [

    { key:'operator', title:'操作人' },
    { key:'action', title:'操作类型' },
    { key:'operateTime', title:'操作时间' },
];

const extraStats = (data: any[]) => [];

export function SecurityDisposalAudit() {
  return (
    <StandardSubPage
      title="安全处置审计日志"
      description="查看任务的审计操作记录 - 安全处置审计日志"
      mockData={mockData}
      columns={extraColumns}
      extraStats={extraStats}
    />
  );
}
