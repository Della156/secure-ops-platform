'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Shield, Key, Calendar, Clock, User, RefreshCw } from 'lucide-react';
import type { ResourceType, AuthPermission } from '@/data/module1/resourceMock';
import { getResourceMock, resourceConfig } from '@/data/module1/resourceMock';

interface ResourceAuthManagerProps {
  resourceType: ResourceType;
}

export function ResourceAuthManager({ resourceType }: ResourceAuthManagerProps) {
  const config = resourceConfig[resourceType];
  const mock = getResourceMock(resourceType);
  
  const [authList, setAuthList] = useState<AuthPermission[]>(mock.authList);
  const [searchResource, setSearchResource] = useState('');
  const [filterAuthType, setFilterAuthType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AuthPermission | null>(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    resourceName: '',
    authType: 'SSH密钥',
    permissions: [] as string[],
    expiresAt: '',
    grantedBy: '',
  });
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [detailItem, setDetailItem] = useState<AuthPermission | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const authTypes = ['SSH密钥', 'API令牌', '证书认证', 'LDAP', '数据库用户', '用户名密码', '域账号', 'MDM'];
  const allPermissions = ['read', 'write', 'execute', 'sudo', 'config', 'alert', 'publish', 'consume', 'login', 'file_access', 'enroll', 'remote_wipe', 'manage'];

  const filteredAuthList = authList.filter(item => {
    const matchResource = !searchResource || 
      item.resourceName.toLowerCase().includes(searchResource.toLowerCase()) ||
      item.resourceId.toLowerCase().includes(searchResource.toLowerCase());
    const matchType = !filterAuthType || item.authType === filterAuthType;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchResource && matchType && matchStatus;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredAuthList.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAuthList.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkRevoke = () => {
    if (confirm(`确定要撤销选中的 ${selectedItems.length} 个授权吗？`)) {
      setAuthList(authList.map(item => 
        selectedItems.includes(item.id) 
          ? { ...item, status: 'revoked' as const } 
          : item
      ));
      setSelectedItems([]);
    }
  };

  const handleOpenModal = (item?: AuthPermission) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        resourceId: item.resourceId,
        resourceName: item.resourceName,
        authType: item.authType,
        permissions: item.permissions,
        expiresAt: item.expiresAt,
        grantedBy: item.grantedBy,
      });
    } else {
      setEditingItem(null);
      setFormData({
        resourceId: '',
        resourceName: '',
        authType: 'SSH密钥',
        permissions: [],
        expiresAt: '',
        grantedBy: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenDetail = (item: AuthPermission) => {
    setDetailItem(item);
    setShowDetailDrawer(true);
  };

  const handleSave = () => {
    if (!formData.resourceId || !formData.authType) return;
    
    if (editingItem) {
      setAuthList(authList.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              authType: formData.authType,
              permissions: formData.permissions,
              expiresAt: formData.expiresAt,
              grantedBy: formData.grantedBy,
            } 
          : item
      ));
    } else {
      const newItem: AuthPermission = {
        id: `auth-${Date.now()}`,
        resourceId: formData.resourceId,
        resourceName: formData.resourceName || mock.list.find(r => r.id === formData.resourceId)?.name || '',
        authType: formData.authType,
        permissions: formData.permissions,
        expiresAt: formData.expiresAt,
        status: 'active',
        grantedBy: formData.grantedBy || 'admin',
        grantedAt: new Date().toLocaleString('zh-CN'),
      };
      setAuthList([newItem, ...authList]);
    }
    setIsModalOpen(false);
  };

  const handleRevoke = (id: string) => {
    if (confirm('确定要撤销这个授权吗？')) {
      setAuthList(authList.map(item => 
        item.id === id ? { ...item, status: 'revoked' as const } : item
      ));
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      expired: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      revoked: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      active: '有效',
      expired: '已过期',
      revoked: '已撤销',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const statusCounts = {
    total: authList.length,
    active: authList.filter(a => a.status === 'active' && !isExpired(a.expiresAt)).length,
    expired: authList.filter(a => a.status === 'expired' || isExpired(a.expiresAt)).length,
    revoked: authList.filter(a => a.status === 'revoked').length,
  };

  return (
    <div className="h-full flex">
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">{config.title}授权管理</h1>
          <p className="text-[#9CA3AF]">管理{config.label}的访问授权和权限</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0066FF]/20 rounded-lg">
                <Shield className="w-5 h-5 text-[#0066FF]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">总授权数</p>
                <p className="text-2xl font-bold text-[#F3F4F6]">{statusCounts.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00C853]/20 rounded-lg">
                <Key className="w-5 h-5 text-[#00C853]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">有效授权</p>
                <p className="text-2xl font-bold text-[#00C853]">{statusCounts.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF9100]/20 rounded-lg">
                <Clock className="w-5 h-5 text-[#FF9100]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">已过期</p>
                <p className="text-2xl font-bold text-[#FF9100]">{statusCounts.expired}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF3B30]/20 rounded-lg">
                <RefreshCw className="w-5 h-5 text-[#FF3B30]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">已撤销</p>
                <p className="text-2xl font-bold text-[#FF3B30]">{statusCounts.revoked}</p>
              </div>
            </div>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[#D1D5DB]">已选择 {selectedItems.length} 个授权</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
                >
                  取消选择
                </button>
                <button
                  onClick={handleBulkRevoke}
                  className="px-4 py-2 bg-[#FF3B30] hover:bg-[#FF6B5A] text-white rounded-lg transition-colors"
                >
                  批量撤销
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="搜索资源名称..."
                  value={searchResource}
                  onChange={(e) => setSearchResource(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
                />
              </div>

              <select
                value={filterAuthType}
                onChange={(e) => setFilterAuthType(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部类型</option>
                {[...new Set(authList.map(a => a.authType))].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部状态</option>
                <option value="active">有效</option>
                <option value="expired">已过期</option>
                <option value="revoked">已撤销</option>
              </select>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增授权
            </button>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#181F32]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredAuthList.length && filteredAuthList.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{config.label}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">授权类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">权限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">有效期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">授权人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredAuthList.map((item) => (
                <tr key={item.id} className="hover:bg-[#181F32]/30 transition-colors cursor-pointer" onClick={() => handleOpenDetail(item)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => { e.stopPropagation(); toggleSelectItem(item.id); }}
                      className="rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{item.resourceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF]">
                      {item.authType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.permissions.map((perm, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs bg-[#4A5570]/20 text-[#D1D5DB]">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                      <span className={`text-sm ${isExpired(item.expiresAt) ? 'text-[#FF9100]' : 'text-[#D1D5DB]'}`}>
                        {item.expiresAt}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#9CA3AF]" />
                      <span className="text-sm text-[#D1D5DB]">{item.grantedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {item.status !== 'revoked' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRevoke(item.id); }}
                          className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                          title="撤销"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAuthList.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[#6B7280]">暂无授权记录</p>
            </div>
          )}
        </div>
      </div>

      {showDetailDrawer && detailItem && (
        <div className="w-96 bg-[#20293F] border-l border-[#2A354D] p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#F3F4F6]">授权详情</h3>
            <button
              onClick={() => setShowDetailDrawer(false)}
              className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">授权ID</label>
              <p className="text-[#F3F4F6]">{detailItem.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">{config.label}</label>
              <p className="text-[#F3F4F6]">{detailItem.resourceName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">授权类型</label>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF]">
                {detailItem.authType}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">权限列表</label>
              <div className="flex flex-wrap gap-1">
                {detailItem.permissions.map((perm, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-xs bg-[#4A5570]/20 text-[#D1D5DB]">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">有效期至</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                <span className={`${isExpired(detailItem.expiresAt) ? 'text-[#FF9100]' : 'text-[#F3F4F6]'}`}>
                  {detailItem.expiresAt}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">状态</label>
              {getStatusBadge(detailItem.status)}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">授权人</label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-[#F3F4F6]">{detailItem.grantedBy}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">授权时间</label>
              <p className="text-[#F3F4F6]">{detailItem.grantedAt}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => { handleOpenModal(detailItem); setShowDetailDrawer(false); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg"
            >
              <Edit className="w-4 h-4" />
              编辑
            </button>
            {detailItem.status !== 'revoked' && (
              <button
                onClick={() => { handleRevoke(detailItem.id); setShowDetailDrawer(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FF3B30] hover:bg-[#FF6B5A] text-white rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                撤销
              </button>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingItem ? '编辑授权' : '新增授权'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">{config.label}</label>
                <select
                  value={formData.resourceId}
                  onChange={(e) => {
                    setFormData({ ...formData, resourceId: e.target.value });
                    const resource = mock.list.find(r => r.id === e.target.value);
                    if (resource) {
                      setFormData(prev => ({ ...prev, resourceName: resource.name }));
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="">请选择{config.label}</option>
                  {mock.list.map(resource => (
                    <option key={resource.id} value={resource.id}>{resource.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">授权类型</label>
                <select
                  value={formData.authType}
                  onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  {authTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">权限</label>
                <div className="flex flex-wrap gap-2">
                  {allPermissions.map(perm => (
                    <label key={perm} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm)}
                        onChange={(e) => {
                          const currentPerms = formData.permissions;
                          const newPerms = e.target.checked
                            ? [...currentPerms, perm]
                            : currentPerms.filter(p => p !== perm);
                          setFormData({ ...formData, permissions: newPerms });
                        }}
                        className="rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                      />
                      <span className="px-2 py-0.5 rounded text-xs bg-[#4A5570]/20 text-[#D1D5DB]">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">有效期至</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">授权人</label>
                <input
                  type="text"
                  value={formData.grantedBy}
                  onChange={(e) => setFormData({ ...formData, grantedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="admin"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}