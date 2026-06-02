'use client';

import React, { useState } from 'react';
import { Download, Calendar, FileText, CheckCircle, TrendingUp, Shield, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const roleData = [
  { role: '管理员', count: 5, compliant: 5 },
  { role: '运维人员', count: 20, compliant: 18 },
  { role: '开发人员', count: 35, compliant: 30 },
  { role: '普通用户', count: 100, compliant: 85 },
];

interface PermissionItem {
  account: string;
  role: string;
  permissions: string[];
  lastChange: string;
  status: 'compliant' | 'non-compliant';
}

const mockData: PermissionItem[] = [
  { account: 'admin', role: '管理员', permissions: ['系统管理', '用户管理', '权限管理'], lastChange: '2026-05-01', status: 'compliant' },
  { account: 'ops001', role: '运维人员', permissions: ['设备管理', '日志查看', '备份管理'], lastChange: '2026-05-15', status: 'compliant' },
  { account: 'dev001', role: '开发人员', permissions: ['代码管理', '测试环境', '数据库访问'], lastChange: '2026-05-20', status: 'non-compliant' },
  { account: 'user001', role: '普通用户', permissions: ['查询', '报表查看'], lastChange: '2026-06-01', status: 'compliant' },
];

export function AccountReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalAccounts: roleData.reduce((sum, d) => sum + d.count, 0),
    totalCompliant: roleData.reduce((sum, d) => sum + d.compliant, 0),
    complianceRate: Math.round(roleData.reduce((sum, d) => sum + (d.compliant / d.count * 100), 0) / roleData.length),
    totalRoles: roleData.length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">账号权限报告</h2>
        <p className="text-sm text-gray-400 mt-1">账号权限清单导出、权限变更报告导出、权限合规性报告导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              权限清单导出
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <TrendingUp className="w-4 h-4" />
              变更报告导出
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Shield className="w-4 h-4" />
              合规性报告导出
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">账号总数</p>
              <p className="text-xl font-semibold text-white">{stats.totalAccounts}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">合规账号</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalCompliant}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">合规率</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.complianceRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">角色类型</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalRoles}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">角色分布统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="role" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="count" name="总数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="compliant" name="合规" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-gray-300">权限清单</h3>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {mockData.map((item, index) => (
              <div key={index} className="p-4 hover:bg-[#2A354D]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{item.account}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.role}</span>
                      {item.status === 'compliant' ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">合规</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">不合规</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.permissions.map((perm, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-[#2A354D] text-gray-300">{perm}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{item.lastChange}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}