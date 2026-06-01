'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package, Upload, Download, Eye, X, Tag, Folder } from 'lucide-react';

interface TaskItem {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'online' | 'offline' | 'draft';
  downloads: number;
  rating: number;
  description: string;
  tags: string[];
}

const mockData: TaskItem[] = [
  { id: 'ITEM-001', name: '防火墙配置同步', category: '网络安全', version: 'v2.3.1', status: 'online', downloads: 1256, rating: 4.8, description: '自动化同步防火墙配置，支持多种厂商设备', tags: ['防火墙', '配置', 'SSH'] },
  { id: 'ITEM-002', name: 'IDS日志采集', category: '日志分析', version: 'v1.5.2', status: 'online', downloads: 892, rating: 4.5, description: '实时采集IDS系统日志，支持多种格式', tags: ['日志', 'IDS', 'SIEM'] },
  { id: 'ITEM-003', name: '网络设备监控', category: '监控告警', version: 'v3.0.0', status: 'offline', downloads: 423, rating: 4.6, description: '监控网络设备状态，自动发现新设备', tags: ['监控', 'SNMP', '设备'] },
  { id: 'ITEM-004', name: '数据库备份', category: '数据保护', version: 'v2.1.0', status: 'online', downloads: 1567, rating: 4.9, description: '自动化数据库备份，支持增量和全量备份', tags: ['数据库', '备份', 'MySQL'] },
  { id: 'ITEM-005', name: 'Web应用安全扫描', category: '漏洞检测', version: 'v1.2.0', status: 'draft', downloads: 0, rating: 0, description: '扫描Web应用安全漏洞', tags: ['Web', '安全', '扫描'] },
  { id: 'ITEM-006', name: '威胁情报同步', category: '威胁情报', version: 'v2.0.0', status: 'online', downloads: 678, rating: 4.7, description: '同步外部威胁情报源', tags: ['威胁情报', 'IOC', '同步'] },
];

export function TaskShelfManagement() {
  const [data, setData] = useState<TaskItem[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [...new Set(data.map(item => item.category))];

  const filteredData = data.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !filterCategory || item.category === filterCategory;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchQuery && matchCategory && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30',
      offline: 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30',
      draft: 'bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]/30',
    };
    const labels = {
      online: '已上架',
      offline: '已下架',
      draft: '草稿',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleToggleStatus = (id: string) => {
    setData(data.map(item => ({
      ...item,
      status: item.status === 'online' ? 'offline' : 'online'
    })));
  };

  const handlePreview = (item: TaskItem) => {
    alert(`预览任务: ${item.name}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务上下架管理</h1>
        <p className="text-[#9CA3AF]">管理任务仓库中任务的上架状态</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索任务名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="online">已上架</option>
              <option value="offline">已下架</option>
              <option value="draft">草稿</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            上传任务
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden hover:border-[#0066FF]/50 transition-colors">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#F3F4F6] font-medium mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <Folder className="w-4 h-4" />
                    <span>{item.category}</span>
                    <span className="text-[#2A354D]">|</span>
                    <span className="font-mono text-[#0066FF]">{item.version}</span>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{item.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#181F32] rounded text-xs text-[#D1D5DB]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2A354D]">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-[#9CA3AF]">
                    <Download className="w-4 h-4" />
                    <span>{item.downloads}</span>
                  </div>
                  {item.status !== 'draft' && (
                    <div className="flex items-center gap-1 text-[#FF9100]">
                      <span className="font-medium">{item.rating}</span>
                      <span>★</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePreview(item)} className="p-2 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#0066FF]/10 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggleStatus(item.id)} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    item.status === 'online' 
                      ? 'bg-[#FF3B30]/20 text-[#FF3B30] hover:bg-[#FF3B30]/30' 
                      : 'bg-[#00C853]/20 text-[#00C853] hover:bg-[#00C853]/30'
                  }`}>
                    {item.status === 'online' ? '下架' : '上架'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full bg-[#20293F] border border-[#2A354D] rounded-xl px-6 py-12 text-center">
            <Package className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
            <p className="text-[#6B7280]">暂无任务</p>
          </div>
        )}
      </div>
    </div>
  );
}