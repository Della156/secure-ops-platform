'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Eye, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface CompliancePolicy {
  id: string;
  name: string;
  deviceType: string;
  policyType: string;
  version: string;
  checkItems: number;
  status: 'enabled' | 'disabled';
  updateTime: string;
}

const mockData: CompliancePolicy[] = [
  { id: 'CP-001', name: '防火墙合规基线v1.0', deviceType: '防火墙', policyType: '访问控制,NAT,IPS', version: 'v1.0', checkItems: 45, status: 'enabled', updateTime: '2026-05-15 10:00:00' },
  { id: 'CP-002', name: '路由器合规基线v2.1', deviceType: '路由器', policyType: 'ACL,路由安全', version: 'v2.1', checkItems: 32, status: 'enabled', updateTime: '2026-05-20 14:30:00' },
  { id: 'CP-003', name: '交换机合规基线v1.5', deviceType: '交换机', policyType: 'VLAN,STP,端口安全', version: 'v1.5', checkItems: 38, status: 'enabled', updateTime: '2026-05-18 09:15:00' },
  { id: 'CP-004', name: 'WAF合规基线v1.2', deviceType: 'WAF', policyType: '防护规则,XSS,SQL注入', version: 'v1.2', checkItems: 28, status: 'disabled', updateTime: '2026-04-10 11:00:00' },
  { id: 'CP-005', name: 'IDS/IPS合规基线v1.0', deviceType: 'IDS/IPS', policyType: '签名规则,检测模式', version: 'v1.0', checkItems: 35, status: 'enabled', updateTime: '2026-05-25 16:45:00' },
];

export function ComplianceManage() {
  const [data, setData] = useState<CompliancePolicy[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterDeviceType, setFilterDeviceType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<CompliancePolicy | null>(null);
  const toast = useToast();
  const [formName, setFormName] = useState('');
  const [formDeviceType, setFormDeviceType] = useState('防火墙');
  const [formVersion, setFormVersion] = useState('v1.0');
  const [formPolicyType, setFormPolicyType] = useState('');

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchType = !filterDeviceType || d.deviceType === filterDeviceType;
    return matchKeyword && matchType;
  });

  const handleToggle = (policy: CompliancePolicy) => {
    setData(prev => prev.map(p => p.id === policy.id ? { ...p, status: p.status === 'enabled' ? 'disabled' : 'enabled' } : p));
  };

  const handleDelete = (policy: CompliancePolicy) => {
    setData(prev => prev.filter(p => p.id !== policy.id));
    toast.success(`已删除基线策略 "${policy.name}"`);
  };

  const handleSaveModal = () => {
    if (!formName.trim()) {
      toast.warning('请输入基线名称');
      return;
    }
    if (editingPolicy) {
      setData(prev => prev.map(p =>
        p.id === editingPolicy.id
          ? { ...p, name: formName, deviceType: formDeviceType, version: formVersion, policyType: formPolicyType, updateTime: new Date().toLocaleString() }
          : p
      ));
      toast.success('基线策略已更新');
    } else {
      const newPolicy: CompliancePolicy = {
        id: `CP-${Date.now()}`,
        name: formName,
        deviceType: formDeviceType,
        policyType: formPolicyType,
        version: formVersion,
        checkItems: 0,
        status: 'enabled',
        updateTime: new Date().toLocaleString(),
      };
      setData(prev => [...prev, newPolicy]);
      toast.success('基线策略已创建');
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全策略合规管理</h2>
        <p className="text-sm text-gray-400 mt-1">配置合规基线策略库，管理检查项和版本</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">基线策略总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{data.length}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">已启用策略</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{data.filter(d => d.status === 'enabled').length}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">检查项总数</p>
          <p className="text-2xl font-semibold text-blue-400 mt-1">{data.reduce((sum, d) => sum + d.checkItems, 0)}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="搜索策略名称..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <select value={filterDeviceType} onChange={(e) => setFilterDeviceType(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部设备类型</option>
              <option value="防火墙">防火墙</option>
              <option value="路由器">路由器</option>
              <option value="交换机">交换机</option>
              <option value="WAF">WAF</option>
              <option value="IDS/IPS">IDS/IPS</option>
            </select>
          </div>
          <button onClick={() => { 
            setEditingPolicy(null); 
            setFormName('');
            setFormDeviceType('防火墙');
            setFormVersion('v1.0');
            setFormPolicyType('');
            setShowModal(true); 
          }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增基线策略
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">基线ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">基线名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查项数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">更新时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((policy) => (
                <tr key={policy.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-gray-400">{policy.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{policy.name}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{policy.deviceType}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{policy.policyType}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{policy.version}</td>
                  <td className="px-4 py-3 text-sm text-white">{policy.checkItems}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${policy.status === 'enabled' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {policy.status === 'enabled' ? '启用' : '停用'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{policy.updateTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { 
                        setEditingPolicy(policy); 
                        setFormName(policy.name);
                        setFormDeviceType(policy.deviceType);
                        setFormVersion(policy.version);
                        setFormPolicyType(policy.policyType);
                        setShowModal(true); 
                      }} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleToggle(policy)} className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors" title={policy.status === 'enabled' ? '禁用' : '启用'}>{policy.status === 'enabled' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="检查项配置"><Settings className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(policy)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="删除"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-[500px] max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{editingPolicy ? '编辑基线策略' : '新增基线策略'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">基线名称</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">设备类型</label>
                  <select value={formDeviceType} onChange={(e) => setFormDeviceType(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>防火墙</option>
                    <option>路由器</option>
                    <option>交换机</option>
                    <option>WAF</option>
                    <option>IDS/IPS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">版本号</label>
                  <input type="text" value={formVersion} onChange={(e) => setFormVersion(e.target.value)} className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">策略类型（逗号分隔）</label>
                <input type="text" value={formPolicyType} onChange={(e) => setFormPolicyType(e.target.value)} placeholder="如: 访问控制,NAT" className="w-full px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">取消</button>
              <button onClick={handleSaveModal} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
