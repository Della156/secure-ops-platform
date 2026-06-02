'use client';
import React from 'react';
import { Search as SearchIcon, Eye, RefreshCw, Download, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { StandardSubPage, SubPageColumn } from '@/components/Common/StandardSubPage';

const mockData = [
  { id:'ElinkInfoCoordination-001', name:'信息协同-核心网络', status:'running', dataCount:128, updateTime:'2026-06-02 08:00' },
  { id:'ElinkInfoCoordination-002', name:'信息协同-办公网络', status:'completed', dataCount:256, updateTime:'2026-06-01 08:00' },
  { id:'ElinkInfoCoordination-003', name:'信息协同-数据中心', status:'running', dataCount:89, updateTime:'2026-06-02 10:00' },
  { id:'ElinkInfoCoordination-004', name:'信息协同-分支机构', status:'failed', dataCount:45, updateTime:'2026-06-02 06:00' },
  { id:'ElinkInfoCoordination-005', name:'信息协同-云平台', status:'pending', dataCount:0, updateTime:'2026-06-03 00:00' },
];

const extraColumns: SubPageColumn[] = [
  { key:'dataCount', title:'数据量', sortable:true },
  { key:'updateTime', title:'更新时间' },
];

const extraStats = (data: any[]) => [];

export function ElinkInfoCoordination() {
  return (
    <StandardSubPage
      title="信息协同"
      description="管理和查看信息协同数据"
      mockData={mockData}
      columns={extraColumns}
      extraStats={extraStats}
    />
  );
}
