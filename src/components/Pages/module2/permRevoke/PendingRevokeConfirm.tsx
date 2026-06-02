'use client';

import React, { useState } from 'react';
import { Eye, AlertTriangle, CheckCircle, Shield, User } from 'lucide-react';

interface PermissionItem {
  id: string;
  name: string;
  category: string;
  affectedSystems: string[];
}

const mockPermissions: PermissionItem[] = [
  { id: 'perm-001', name: 'admin', category: '管理员权限', affectedSystems: ['系统A', '系统B', '系统C'] },
  { id: 'perm-002', name: 'write', category: '写入权限', affectedSystems: ['系统A', '系统D'] },
  { id: 'perm-003', name: 'read', category: '读取权限', affectedSystems: ['系统B'] },
];

export function PendingRevokeConfirm() {
  const [permissions] = useState(mockPermissions);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(mockPermissions.map(p => p.id));
  const [confirmationType, setConfirmationType] = useState<'manual' | 'auto'>('manual');

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    alert('权限回收已确认执行');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">待回收权限预览与确认</h2>
        <p className="text-sm text-gray-400 mt-1">在执行回收前，展示待回收权限清单，支持人工确认或自动确认，回收影响分析</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">确认方式</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => setConfirmationType('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              confirmationType === 'manual' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#111827] text-gray-400 hover:bg-[#2A354D]/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            人工确认
          </button>
          <button 
            onClick={() => setConfirmationType('auto')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              confirmationType === 'auto' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#111827] text-gray-400 hover:bg-[#2A354D]/50'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            自动确认
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">待回收权限清单</h3>
          <div className="space-y-3">
            {permissions.map((perm) => (
              <div 
                key={perm.id}
                onClick={() => togglePermission(perm.id)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedPermissions.includes(perm.id) 
                    ? 'bg-[#111827] border border-blue-500/50' 
                    : 'bg-[#111827] border border-transparent opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">{perm.name}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{perm.category}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="w-4 h-4 rounded border-[#2A354D] bg-[#111827]"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  影响系统: {perm.affectedSystems.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">回收影响分析</h3>
          
          <div className="space-y-4">
            <div className="bg-[#111827] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium text-sm">影响评估</span>
              </div>
              <p className="text-xs text-gray-400">
                回收 {selectedPermissions.length} 项权限将影响 {permissions.reduce((sum, p) => sum + p.affectedSystems.length, 0)} 个系统服务。
              </p>
            </div>

            <div className="bg-[#111827] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium text-sm">受影响用户</span>
              </div>
              <p className="text-xs text-gray-400">1 个用户将失去相关权限</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-medium text-sm">风险提示</span>
              </div>
              <p className="text-xs text-red-300">
                回收管理员权限可能导致系统管理功能受限，请确保有其他管理员可用。
              </p>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              确认回收
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}