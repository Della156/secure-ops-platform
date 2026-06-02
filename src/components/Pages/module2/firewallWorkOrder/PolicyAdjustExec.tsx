'use client';

import React, { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, Code, Shield } from 'lucide-react';

interface ExecTask {
  id: string;
  name: string;
  type: 'add' | 'modify' | 'delete';
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number;
  script: string;
}

const mockTasks: ExecTask[] = [
  { id: 'EXEC-001', name: '新增DMZ访问策略', type: 'add', status: 'executing', progress: 75, script: 'add rule DMZ_IN allow tcp 192.168.1.0/24 -> 10.0.0.0/8 port 80' },
  { id: 'EXEC-002', name: '删除过期策略', type: 'delete', status: 'completed', progress: 100, script: 'delete rule OLD_RULE_001' },
  { id: 'EXEC-003', name: '修改端口范围', type: 'modify', status: 'pending', progress: 0, script: 'modify rule WEB_RULE port 80-8080' },
];

export function PolicyAdjustExec() {
  const [tasks] = useState(mockTasks);

  const handleExecute = (id: string) => {
    console.log('Executing:', id);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略调整执行</h2>
        <p className="text-sm text-gray-400 mt-1">按工单要求自动生成策略变更脚本，执行策略新增/修改/删除，执行结果校验</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium text-sm">{task.name}</span>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded ${
                task.type === 'add' ? 'bg-green-500/20 text-green-400' :
                task.type === 'modify' ? 'bg-blue-500/20 text-blue-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {task.type === 'add' ? '新增' : task.type === 'modify' ? '修改' : '删除'}
              </span>
            </div>
            
            <div className="bg-[#111827] rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500">变更脚本</span>
              </div>
              <p className="text-xs text-gray-400 font-mono">{task.script}</p>
            </div>

            {task.status !== 'pending' && (
              <div className="mb-3">
                <div className="w-full bg-[#111827] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{Math.round(task.progress)}%</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded ${
                task.status === 'executing' ? 'bg-blue-500/20 text-blue-400' :
                task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {task.status === 'executing' ? '执行中' : task.status === 'completed' ? '已完成' : task.status === 'failed' ? '失败' : '待执行'}
              </span>
              
              {task.status === 'pending' && (
                <button 
                  onClick={() => handleExecute(task.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3" />
                  执行
                </button>
              )}
              
              {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {task.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-400" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}