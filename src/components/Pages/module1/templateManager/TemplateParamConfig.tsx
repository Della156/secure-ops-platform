'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Eye, Settings, Variable } from 'lucide-react';

// 模板变量类型
interface TemplateVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'ip' | 'port' | 'password';
  defaultValue: string;
  required: boolean;
  description: string;
}

// 模拟数据 - 按模板分组的变量
const mockVariables: Record<string, TemplateVariable[]> = {
  'TPL-001': [
    { id: 'VAR-001', name: 'TARGET_URL', type: 'string', defaultValue: 'https://example.com', required: true, description: '目标扫描URL' },
    { id: 'VAR-002', name: 'SCAN_DEPTH', type: 'number', defaultValue: '3', required: true, description: '扫描深度' },
    { id: 'VAR-003', name: 'ENABLE_CRAWLER', type: 'boolean', defaultValue: 'true', required: false, description: '是否启用爬虫' },
  ],
  'TPL-002': [
    { id: 'VAR-004', name: 'DB_HOST', type: 'ip', defaultValue: '192.168.1.100', required: true, description: '数据库主机地址' },
    { id: 'VAR-005', name: 'DB_PORT', type: 'port', defaultValue: '3306', required: true, description: '数据库端口' },
    { id: 'VAR-006', name: 'DB_PASSWORD', type: 'password', defaultValue: '', required: true, description: '数据库密码' },
  ],
  'TPL-003': [
    { id: 'VAR-007', name: 'DEVICE_IPS', type: 'string', defaultValue: '192.168.1.1,192.168.1.2', required: true, description: '设备IP列表，逗号分隔' },
  ],
};

// 模板列表
const mockTemplates = [
  { id: 'TPL-001', name: 'Web应用安全扫描模板' },
  { id: 'TPL-002', name: '数据库备份模板' },
  { id: 'TPL-003', name: '网络设备巡检模板' },
  { id: 'TPL-004', name: '服务器性能监控模板' },
];

export function TemplateParamConfig() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('TPL-001');
  const [variables, setVariables] = useState<Record<string, TemplateVariable[]>>(mockVariables);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<TemplateVariable | null>(null);
  const [formData, setFormData] = useState<Partial<TemplateVariable>>({
    name: '',
    type: 'string',
    defaultValue: '',
    required: false,
    description: '',
  });
  const [previewVisible, setPreviewVisible] = useState(false);

  // 当前选中模板的变量
  const currentVariables = variables[selectedTemplate] || [];

  // 打开新增/编辑模态框
  const handleOpenModal = (variable?: TemplateVariable) => {
    if (variable) {
      setEditingVariable(variable);
      setFormData(variable);
    } else {
      setEditingVariable(null);
      setFormData({ name: '', type: 'string', defaultValue: '', required: false, description: '' });
    }
    setIsModalOpen(true);
  };

  // 保存变量
  const handleSave = () => {
    if (!formData.name) return;

    const templateVars = variables[selectedTemplate] || [];
    
    if (editingVariable) {
      // 编辑
      const updatedVars = templateVars.map(v => v.id === editingVariable.id ? { ...v, ...formData } as TemplateVariable : v);
      setVariables({ ...variables, [selectedTemplate]: updatedVars });
    } else {
      // 新增
      const newVariable: TemplateVariable = {
        id: `VAR-${String(Date.now()).slice(-6)}`,
        name: formData.name!,
        type: formData.type || 'string',
        defaultValue: formData.defaultValue || '',
        required: formData.required || false,
        description: formData.description || '',
      };
      setVariables({ ...variables, [selectedTemplate]: [...templateVars, newVariable] });
    }
    setIsModalOpen(false);
  };

  // 删除变量
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个变量吗？')) {
      const templateVars = variables[selectedTemplate] || [];
      setVariables({ ...variables, [selectedTemplate]: templateVars.filter(v => v.id !== id) });
    }
  };

  // 获取类型标签
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      string: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      number: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      boolean: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      ip: 'bg-[#6366F1]/20 text-[#6366F1] border-purple-500/30',
      port: 'bg-[#00BCD4]/20 text-[#00BCD4] border-cyan-500/30',
      password: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[type] || colors.string}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">模板参数化变量配置</h1>
        <p className="text-[#9CA3AF]">为模板配置可参数化的变量，支持多种数据类型</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：模板选择 */}
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              选择模板
            </h3>
            <div className="space-y-2">
              {mockTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedTemplate === template.id
                      ? 'bg-[#0066FF]/20 text-[#0066FF] border border-blue-500/30'
                      : 'bg-[#181F32]/50 text-[#D1D5DB] hover:bg-[#181F32]'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    {variables[template.id]?.length || 0} 个变量
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：变量管理 */}
        <div className="lg:col-span-2">
          {/* 操作栏 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
                <Variable className="w-5 h-5" />
                变量列表
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewVisible(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A4560] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  预览
                </button>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  新增变量
                </button>
              </div>
            </div>
          </div>

          {/* 变量表格 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#181F32]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">变量名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">默认值</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">必填</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">描述</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {currentVariables.map((variable) => (
                  <tr key={variable.id} className="hover:bg-[#181F32]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#F3F4F6]">{variable.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(variable.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                      {variable.type === 'password' ? '******' : variable.defaultValue || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${variable.required ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-[#4A5570]/20 text-[#9CA3AF]'}`}>
                        {variable.required ? '是' : '否'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9CA3AF] max-w-xs truncate" title={variable.description}>
                      {variable.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(variable)}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(variable.id)}
                          className="p-1.5 text-[#FF3B30] hover:text-[#FF6B5A] hover:bg-[#FF3B30]/10 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {currentVariables.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[#6B7280]">暂无变量，请点击新增变量添加</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 新增/编辑变量模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingVariable ? '编辑变量' : '新增变量'}
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
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">变量名</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] font-mono focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="例如：TARGET_URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">变量类型</label>
                <select
                  value={formData.type || 'string'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="string">字符串</option>
                  <option value="number">数字</option>
                  <option value="boolean">布尔值</option>
                  <option value="ip">IP地址</option>
                  <option value="port">端口号</option>
                  <option value="password">密码</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">默认值</label>
                {formData.type === 'boolean' ? (
                  <select
                    value={formData.defaultValue || 'true'}
                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (
                  <input
                    type={formData.type === 'password' ? 'password' : 'text'}
                    value={formData.defaultValue || ''}
                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    placeholder="请输入默认值"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required || false}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="w-4 h-4 rounded border-[#3A4560] bg-[#181F32] text-[#4D94FF] focus:ring-[#0066FF]"
                />
                <label htmlFor="required" className="text-sm text-[#D1D5DB]">必填项</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">变量描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入变量描述"
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

      {/* 预览模态框 */}
      {previewVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">变量预览</h3>
              <button
                onClick={() => setPreviewVisible(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#181F32]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F3F4F6] mb-3">
                  {mockTemplates.find(t => t.id === selectedTemplate)?.name}
                </h4>
                {currentVariables.map(variable => (
                  <div key={variable.id} className="mb-4 last:mb-0">
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">
                      {variable.name}
                      {variable.required && <span className="text-[#FF3B30] ml-1">*</span>}
                    </label>
                    {variable.type === 'boolean' ? (
                      <select
                        disabled
                        className="w-full px-3 py-2 bg-[#2A354D] border border-[#3A4560] rounded-lg text-[#9CA3AF]"
                      >
                        <option value={variable.defaultValue}>{variable.defaultValue}</option>
                      </select>
                    ) : (
                      <input
                        type={variable.type === 'password' ? 'password' : 'text'}
                        defaultValue={variable.defaultValue}
                        disabled
                        className="w-full px-3 py-2 bg-[#2A354D] border border-[#3A4560] rounded-lg text-[#9CA3AF]"
                      />
                    )}
                    <p className="text-xs text-[#6B7280] mt-1">{variable.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t border-[#2A354D]">
              <button
                onClick={() => setPreviewVisible(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
