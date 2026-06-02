'use client';

import React, { useState } from 'react';
import { Search, Download, Eye, RefreshCw, Filter, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface DeviceStatusItem {
  id: string;
  name: string;
  type: string;
  ip: string;
  vendor: string;
  osVersion: string;
  status: 'normal' | 'abnormal' | 'offline';
  lastCheckTime: string;
  duration: string;
}

const mockData: DeviceStatusItem[] = [
  { id: 'DEV-001', name: '核心交换机-CORE-01', type: '交换机', ip: '192.168.1.1', vendor: '华为', osVersion: 'V5.20', status: 'normal', lastCheckTime: '2026-06-01 10:30:00', duration: '00:02:15' },
  { id: 'DEV-002', name: '边界防火墙-FW-01', type: '防火墙', ip: '192.168.1.254', vendor: '绿盟', osVersion: 'V8.0', status: 'normal', lastCheckTime: '2026-06-01 10:28:00', duration: '00:01:45' },
  { id: 'DEV-003', name: '入侵检测系统-IDS-01', type: 'IDS', ip: '192.168.1.10', vendor: '启明', osVersion: 'V6.5', status: 'abnormal', lastCheckTime: '2026-06-01 10:25:00', duration: '00:00:30' },
  { id: 'DEV-004', name: 'Web应用防火墙-WAF-01', type: 'WAF', ip: '192.168.1.20', vendor: '安恒', osVersion: 'V3.2', status: 'normal', lastCheckTime: '2026-06-01 10:26:00', duration: '00:01:20' },
  { id: 'DEV-005', name: '负载均衡器-LB-01', type: '负载均衡', ip: '192.168.1.30', vendor: 'F5', osVersion: 'V14.1', status: 'offline', lastCheckTime: '2026-06-01 09:00:00', duration: '-' },
  { id: 'DEV-006', name: '数据库服务器-DB-01', type: '服务器', ip: '192.168.2.10', vendor: 'Dell', osVersion: 'CentOS 7.9', status: 'normal', lastCheckTime: '2026-06-01 10:29:00', duration: '00:03:30' },
  { id: 'DEV-007', name: '应用服务器-APP-01', type: '服务器', ip: '192.168.2.20', vendor: 'HP', osVersion: 'Ubuntu 22.04', status: 'abnormal', lastCheckTime: '2026-06-01 10:20:00', duration: '00:00:45' },
  { id: 'DEV-008', name: '路由器-RT-01', type: '路由器', ip: '192.168.0.1', vendor: 'Cisco', osVersion: 'IOS 15.4', status: 'normal', lastCheckTime: '2026-06-01 10:27:00', duration: '00:01:10' },
];

export function DeviceStatusView() {
  const [data] = useState<DeviceStatusItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const toast = useToast();

  const filteredData = data.filter(item => {
    const matchKeyword = !searchKeyword || 
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.ip.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    const matchType = !filterType || item.type === filterType;
    const matchVendor = !filterVendor || item.vendor === filterVendor;
    return matchKeyword && matchStatus && matchType && matchVendor;
  });

  const stats = {
    total: data.length,
    normal: data.filter(d => d.status === 'normal').length,
    abnormal: data.filter(d => d.status === 'abnormal').length,
    offline: data.filter(d => d.status === 'offline').length,
  };

  const getStatusBadge = (status: 'normal' | 'abnormal' | 'offline') => {
    const styles: Record<string, string> = {
      normal: 'bg-green-500/20 text-green-400 border-green-500/30',
      abnormal: 'bg-red-500/20 text-red-400 border-red-500/30',
      offline: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    const labels: Record<string, string> = { normal: '正常', abnormal: '异常', offline: '离线' };
    const icons: Record<string, React.ReactNode> = {
      normal: <CheckCircle className="w-3 h-3 mr-1" />,
      abnormal: <XCircle className="w-3 h-3 mr-1" />,
      offline: <Clock className="w-3 h-3 mr-1" />,
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const handleExport = () => toast.info('正在导出设备运行状态列表...');
  const handleViewDetail = (item: DeviceStatusItem) => toast.info(`查看设备 "${item.name}" 详情`);
  const handleViewProcess = (item: DeviceStatusItem) => toast.info(`查看 "${item.name}" 检查过程`);
  const handleViewResult = (item: DeviceStatusItem) => toast.info(`查看 "${item.name}" 检查结果`);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">设备运行状态检查视图</h2>
        <p className="text-sm text-gray-400 mt-1">查看所有设备的运行状态，支持按设备类型、状态、厂商等条件筛选</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">设备总数</p>
              <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">正常运行</p>
              <p className="text-2xl font-semibold text-green-400 mt-1">{stats.normal}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">运行异常</p>
              <p className="text-2xl font-semibold text-red-400 mt-1">{stats.abnormal}</p>
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">离线设备</p>
              <p className="text-2xl font-semibold text-gray-400 mt-1">{stats.offline}</p>
            </div>
            <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索设备名称/IP..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="normal">正常</option>
              <option value="abnormal">异常</option>
              <option value="offline">离线</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部类型</option>
              <option value="交换机">交换机</option>
              <option value="防火墙">防火墙</option>
              <option value="路由器">路由器</option>
              <option value="服务器">服务器</option>
              <option value="IDS">IDS</option>
              <option value="WAF">WAF</option>
              <option value="负载均衡">负载均衡</option>
            </select>
            <select
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部厂商</option>
              <option value="华为">华为</option>
              <option value="绿盟">绿盟</option>
              <option value="启明">启明</option>
              <option value="安恒">安恒</option>
              <option value="Cisco">Cisco</option>
              <option value="F5">F5</option>
              <option value="Dell">Dell</option>
              <option value="HP">HP</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#2A354D] text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              导出 Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">厂商</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">系统版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">耗时</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-gray-400">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.ip}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.vendor}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.osVersion}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastCheckTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.duration}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewDetail(item)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleViewProcess(item)} className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="查看过程">
                        <Clock className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleViewResult(item)} className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="查看结果">
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <p className="text-gray-500 text-center py-8">暂无数据</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button className="px-3 py-1 bg-[#1E2736] hover:bg-[#2A354D] text-gray-400 rounded text-sm transition-colors">上一页</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
        <button className="px-3 py-1 bg-[#1E2736] hover:bg-[#2A354D] text-gray-400 rounded text-sm transition-colors">2</button>
        <button className="px-3 py-1 bg-[#1E2736] hover:bg-[#2A354D] text-gray-400 rounded text-sm transition-colors">3</button>
        <button className="px-3 py-1 bg-[#1E2736] hover:bg-[#2A354D] text-gray-400 rounded text-sm transition-colors">下一页</button>
      </div>
      {toast.ToastContainer()}
    </div>
  );
}
