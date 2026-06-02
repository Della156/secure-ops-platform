'use client';
import React from 'react';
import { Search as SearchIcon, Eye, RefreshCw, Download, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { StandardSubPage, SubPageColumn } from '@/components/Common/StandardSubPage';

const mockData = [
{ id:'TR-001', name:'基线报告', status:'completed', reportName:'基线报告 执行报告_v1', createTime:'2026-06-02 08:00', downloadCount:5 },
  { id:'TR-002', name:'基线报告', status:'completed', reportName:'基线报告 执行报告_v2', createTime:'2026-06-02 09:00', downloadCount:3 },
  { id:'TR-003', name:'基线报告', status:'running', reportName:'基线报告 执行报告_v3（生成中）', createTime:'2026-06-02 10:00', downloadCount:0 }
];

const extraColumns: SubPageColumn[] = [

    { key:'reportName', title:'报告名称', sortable:true },
    { key:'createTime', title:'生成时间' },
    { key:'downloadCount', title:'下载次数', render:(v:number) => <span className='text-blue-400'>{v}</span> },
    { key:'_actions', title:'操作', width:'100px', render:(_:any, row:any) => (
      <button className='text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1' onClick={e=>e.stopPropagation()}><svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' /></svg> 下载</button>
    ) },
];

const extraStats = (data: any[]) => [];

export function BaselineReportReport() {
  return (
    <StandardSubPage
      title="基线报告任务报告"
      description="查看任务的执行报告 - 基线报告任务报告"
      mockData={mockData}
      columns={extraColumns}
      extraStats={extraStats}
    />
  );
}
