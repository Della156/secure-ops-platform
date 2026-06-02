'use client';

import React, { useState } from 'react';
import { User, Trash2, Ban, Clock, CheckCircle } from 'lucide-react';

interface ClearTask {
  id: string;
  userName: string;
  reason: string;
  action: 'disable' | 'delete';
  status: 'pending' | 'completed';
  clearTime: string;
}

const mockTasks: ClearTask[] = [
  { id: 'CLEAR-001', userName: '王五', reason: '员工离职', action: 'delete', status: 'completed', clearTime: '2026-06-01 10:00:00' },
  { id: 'CLEAR-002', userName: '赵六', reason: '岗位调整', action: 'disable', status: 'pending', clearTime: '' },
];

export function PkiAccountClear() {
  const [tasks] = useState(mockTasks);

  const handleExecute = (id: string) => {
    console.log('Executing clear:', id);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">PKI账号清除</h2>
        <p className="text-sm text-gray-400 mt-1">按工单要求（如员工离职）自动禁用/删除PKI账号，清除操作记录</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{task.userName}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    task.action === 'delete' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {task.action === 'delete' ? '删除' : '禁用'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">清除原因</p>
                    <p className="text-gray-300">{task.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">状态</p>
                    {task.status === 'completed' ? (
                      <p className="text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        已完成
                      </p>
                    ) : (
                      <p className="text-yellow-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        待处理
                      </p>
                    )}
                  </div>
                  {task.status === 'completed' && (
                    <div>
                      <p className="text-gray-500 text-xs">清除时间</p>
                      <p className="text-gray-300">{task.clearTime}</p>
                    </div>
                  )}
                </div>
              </div>
              {task.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleExecute(task.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      task.action === 'delete' 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    {task.action === 'delete' ? <Trash2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    {task.action === 'delete' ? '删除账号' : '禁用账号'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}