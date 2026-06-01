'use client';

import React, { useState } from 'react';
import { Plus, X, Download, Upload, Play, History, FileText, Clock, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

// 模板类型
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
}

// 变量类型
interface TemplateVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'ip' | 'port' | 'password';
  defaultValue: string;
  required: boolean;
  description: string;
}

// 实例记录类型
interface InstanceRecord {
  id: string;
  templateId: string;
  templateName: string;
  instanceName: string;
  createdBy: string;
  createdAt: string;
  status: 'success' | 'running' | 'failed';
}

// 模拟模板数据
const mockTemplates: Template[] = [
  { id: 'TPL-001', name: 'Web应用安全扫描模板', description: '用于自动扫描Web应用的安全漏洞', category: '安全扫描', tags: ['Web', '安全'] },
  { id: 'TPL-002', name: '数据库备份模板', description: '自动备份MySQL数据库', category: '数据备份', tags: ['数据库', '自动化'] },
  { id: 'TPL-003', name: '网络设备巡检模板', description: '定期巡检网络设备状态', category: '设备巡检', tags: ['网络'] },
  { id: 'TPL-004', name: '服务器性能监控模板', description: '监控服务器CPU、内存、磁盘使用情况', category: '性能监控', tags: ['自动化'] },
];

// 模拟变量数据
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
};

// 模拟实例记录
const mockInstanceRecords: InstanceRecord[] = [
  { id: 'INST-001', templateId: 'TPL-001', templateName: 'Web应用安全扫描模板', instanceName: '生产环境Web扫描', createdBy: '张三', createdAt: '2026-05-20 10:30:00', status: 'success' },
  { id: 'INST-002', templateId: 'TPL-002', templateName: '数据库备份模板', instanceName: '每日数据库备份', createdBy: '李四', createdAt: '2026-05-21 09:00:00', status: 'running' },
  { id: 'INST-003', templateId: 'TPL-001', templateName: 'Web应用安全扫描模板', instanceName: '测试环境扫描', createdBy: '王五', createdAt: '2026-05-22 14:20:00', status: 'failed' },
];

export function TemplateImportInstance() {
  const [activeTab, setActiveTab] = useState<'import' | 'history'>('import');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false);
  const [instanceForm, setInstanceForm] = useState<{ name: string; variables: Record<string, string> }>({ name: '', variables: {} });
  const [instanceRecords, setInstanceRecords] = useState<InstanceRecord[]>(mockInstanceRecords);
  const [searchText, setSearchText] = useState('');

  // 打开实例化模态框
  const handleOpenInstanceModal = (template: Template) => {
    setSelectedTemplate(template);
    const variables = mockVariables[template.id] || [];
    const initialVariables: Record<string, string> = {};
    variables.forEach(v => {
      initialVariables[v.name] = v.defaultValue;
    });
    setInstanceForm({ name: `${template.name} - 实例`, variables: initialVariables });
    setIsInstanceModalOpen(true);
  };

  // 创建实例
  const handleCreateInstance = () => {
    if (!instanceForm.name || !selectedTemplate) return;

    const newRecord: InstanceRecord = {
      id: `INST-${String(Date.now()).slice(-6)}`,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      instanceName: instanceForm.name,
      createdBy: '当前用户',
      createdAt: new Date().toLocaleString('zh-CN'),
      status: 'running',
    };

    setInstanceRecords([newRecord, ...instanceRecords]);
    setIsInstanceModalOpen(false);
    alert('任务实例创建成功！');
  };

  // 过滤实例记录
  const filteredRecords = instanceRecords.filter(record => 
    !searchText || 
    record.instanceName.toLowerCase().includes(searchText.toLowerCase()) ||
    record.templateName.toLowerCase().includes(searchText.toLowerCase())
  );

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const styles = {
      success: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      running: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      failed: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const icons = {
      success: CheckCircle2,
      running: Clock,
      failed: AlertCircle,
    };
    const labels = {
      success: '成功',
      running: '运行中',
      failed: '失败',
    };
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">模板一键导入与任务实例化</h1>
        <p className="text-[#9CA3AF]">从模板库导入模板，快速实例化为可执行任务</p>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-1 mb-6 bg-[#20293F] border border-[#2A354D] rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'import'
              ? 'bg-[#0066FF] text-[#F3F4F6]'
              : 'text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#181F32]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            模板导入
          </div>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-[#0066FF] text-[#F3F4F6]'
              : 'text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#181F32]'
          }`}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            实例化记录
          </div>
        </button>
      </div>

      {/* 模板导入页面 */}
      {activeTab === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 可用模板列表 */}
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl">
            <div className="p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                可用模板
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {mockTemplates.map(template => (
                <div key={template.id} className="bg-[#181F32]/50 rounded-xl p-4 hover:bg-[#181F32] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-[#F3F4F6]">{template.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#2A354D] text-[#9CA3AF]">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-[#9CA3AF] mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[#0066FF]/20 text-[#0066FF]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleOpenInstanceModal(template)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    实例化此模板
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 导入/导出操作 */}
          <div className="space-y-6">
            <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">模板导入/导出</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#2A354D] rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#9CA3AF] mb-4">拖放模板文件到此处，或点击选择文件</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#F3F4F6] rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    选择文件
                    <input type="file" className="hidden" accept=".json" />
                  </label>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#181F32] hover:bg-[#2A354D] text-[#F3F4F6] rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  导出所有模板
                </button>
              </div>
            </div>

            <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">快速开始</h3>
              <div className="space-y-2 text-sm text-[#9CA3AF]">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0066FF] text-[#F3F4F6] flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  <span>从左侧选择一个模板，点击"实例化此模板"</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0066FF] text-[#F3F4F6] flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  <span>填写任务实例名称和所需参数</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0066FF] text-[#F3F4F6] flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  <span>确认后创建可执行任务</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 实例化记录页面 */}
      {activeTab === 'history' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl">
          <div className="p-4 border-b border-[#2A354D] flex flex-wrap gap-4 items-center justify-between">
            <h3 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
              <History className="w-5 h-5" />
              实例化记录
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="搜索实例或模板..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#181F32]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">实例名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">模板来源</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建人</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">创建时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-[#181F32]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F3F4F6]">{record.instanceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.templateName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.createdBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(record.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[#6B7280]">没有找到匹配的实例记录</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 实例化模态框 */}
      {isInstanceModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D] sticky top-0 bg-[#20293F] z-10">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">实例化模板 - {selectedTemplate.name}</h3>
              <button
                onClick={() => setIsInstanceModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* 任务实例名称 */}
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">任务实例名称 <span className="text-[#FF3B30]">*</span></label>
                <input
                  type="text"
                  value={instanceForm.name}
                  onChange={(e) => setInstanceForm({ ...instanceForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入任务实例名称"
                />
              </div>

              {/* 模板参数 */}
              <div>
                <h4 className="text-sm font-medium text-[#D1D5DB] mb-4">模板参数配置</h4>
                <div className="space-y-4">
                  {(mockVariables[selectedTemplate.id] || []).map(variable => (
                    <div key={variable.id}>
                      <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">
                        {variable.name}
                        {variable.required && <span className="text-[#FF3B30] ml-1">*</span>}
                      </label>
                      {variable.type === 'boolean' ? (
                        <select
                          value={instanceForm.variables[variable.name] || variable.defaultValue}
                          onChange={(e) => setInstanceForm({
                            ...instanceForm,
                            variables: { ...instanceForm.variables, [variable.name]: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : (
                        <input
                          type={variable.type === 'password' ? 'password' : 'text'}
                          value={instanceForm.variables[variable.name] || variable.defaultValue}
                          onChange={(e) => setInstanceForm({
                            ...instanceForm,
                            variables: { ...instanceForm.variables, [variable.name]: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono"
                          placeholder={`请输入 ${variable.name}`}
                        />
                      )}
                      <p className="text-xs text-[#6B7280] mt-1">{variable.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 模板描述 */}
              <div className="bg-[#181F32]/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#D1D5DB] mb-2">模板说明</h4>
                <p className="text-sm text-[#9CA3AF]">{selectedTemplate.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A354D] sticky bottom-0 bg-[#20293F]">
              <button
                onClick={() => setIsInstanceModalOpen(false)}
                className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateInstance}
                className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                创建实例
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
