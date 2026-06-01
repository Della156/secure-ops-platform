'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Clock, CheckCircle2, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Version {
  id: string;
  taskName: string;
  version: string;
  status: 'active' | 'deprecated' | 'testing';
  releaseDate: string;
  changes: string[];
  author: string;
}

const mockData: Version[] = [
  { id: 'VER-001', taskName: '防火墙配置同步', version: 'v2.3.1', status: 'active', releaseDate: '2026-05-20', changes: ['修复SSH连接超时问题', '优化配置对比算法', '新增日志记录'], author: 'admin' },
  { id: 'VER-002', taskName: '防火墙配置同步', version: 'v2.3.0', status: 'deprecated', releaseDate: '2026-04-15', changes: ['新增批量配置同步功能', '优化性能'], author: 'admin' },
  { id: 'VER-003', taskName: 'IDS日志采集', version: 'v1.5.2', status: 'active', releaseDate: '2026-05-18', changes: ['修复日志解析错误', '支持自定义字段'], author: 'secops' },
  { id: 'VER-004', taskName: '网络设备监控', version: 'v3.0.0', status: 'testing', releaseDate: '2026-05-24', changes: ['重构SNMP协议处理', '新增设备发现功能', '优化告警机制'], author: 'dev' },
  { id: 'VER-005', taskName: '数据库备份', version: 'v2.1.0', status: 'active', releaseDate: '2026-05-10', changes: ['支持增量备份', '新增备份加密'], author: 'dba' },
];

export function TaskVersionManagement() {
  const [data, setData] = useState<Version[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = data.filter(item => 
    item.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30',
      deprecated: 'bg-[#6B7280]/20 text-[#6B7280] border-[#6B7280]/30',
      testing: 'bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]/30',
    };
    const labels = {
      active: '活跃',
      deprecated: '已弃用',
      testing: '测试中',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleRollback = (item: Version) => {
    alert(`回滚任务 "${item.taskName}" 到版本 ${item.version}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务版本管理</h1>
        <p className="text-[#9CA3AF]">管理自动化任务的版本发布和回滚</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="搜索任务名称或版本号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            发布新版本
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between hover:bg-[#181F32]/30 transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {expandedId === item.id ? <ChevronUp className="w-5 h-5 text-[#9CA3AF]" /> : <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />}
                </div>
                <div>
                  <p className="text-[#F3F4F6] font-medium">{item.taskName}</p>
                  <p className="text-sm text-[#9CA3AF]">作者: {item.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-[#0066FF] font-mono font-medium">{item.version}</span>
                </div>
                {getStatusBadge(item.status)}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <Clock className="w-4 h-4" />
                  <span>{item.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.status !== 'testing' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRollback(item); }}
                      className="px-3 py-1.5 text-sm text-[#0066FF] hover:text-[#4D94FF] hover:bg-[#0066FF]/10 rounded transition-colors"
                    >
                      回滚到此版本
                    </button>
                  )}
                  <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {expandedId === item.id && (
              <div className="px-6 py-4 bg-[#181F32]/30 border-t border-[#2A354D]">
                <h4 className="text-sm font-medium text-[#D1D5DB] mb-3">更新内容</h4>
                <ul className="space-y-2">
                  {item.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[#9CA3AF]">
                      <CheckCircle2 className="w-4 h-4 text-[#00C853] flex-shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl px-6 py-12 text-center">
            <p className="text-[#6B7280]">暂无版本记录</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">发布新版本</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务名称</label>
                <select className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
                  <option>防火墙配置同步</option>
                  <option>IDS日志采集</option>
                  <option>网络设备监控</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">版本号</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="v1.0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">更新内容</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="描述本次更新的内容..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors">
                取消
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
                发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}