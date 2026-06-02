'use client';
import React from 'react';
import { Search as SearchIcon, Eye, RefreshCw, Download, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { StandardSubPage, SubPageColumn } from '@/components/Common/StandardSubPage';

const mockData = [
{ id:'TS-001', name:'异常行为-核心网络', status:'running', progress:75, duration:'00:45:30' },
  { id:'TS-002', name:'异常行为-办公网络', status:'completed', progress:100, duration:'02:15:00' },
  { id:'TS-003', name:'异常行为-数据中心', status:'failed', progress:30, duration:'00:12:00' },
  { id:'TS-004', name:'异常行为-分支机构', status:'pending', progress:0, duration:'-' },
  { id:'TS-005', name:'异常行为-云平台', status:'running', progress:60, duration:'01:30:00' }
];

const extraColumns: SubPageColumn[] = [

    { key:'progress', title:'进度', render:(v:number) => (
      <div className='flex items-center gap-2 w-32'>
        <div className='flex-1 bg-[#0F1729] rounded-full h-2'>
          <div className={'h-2 rounded-full transition-all '+(v>=90?'bg-green-500':v>=50?'bg-blue-500':v>0?'bg-yellow-500':'bg-gray-500')} style={{width:v+'%'}} />
        </div>
        <span className='text-gray-400 text-xs w-8'>{v}%</span>
      </div>
    ) },
    { key:'duration', title:'运行时长' },
];

const extraStats = (data: any[]) => [];

export function AnomalyBehaviorStatus() {
  return (
    <StandardSubPage
      title="异常行为任务状态监控"
      description="实时监控任务的运行状态 - 异常行为任务状态监控"
      mockData={mockData}
      columns={extraColumns}
      extraStats={extraStats}
    />
  );
}
