'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Copy, ChevronDown, ChevronUp, Code, GitBranch, Filter, Repeat } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface LoopConfig {
  type: 'for' | 'while';
  count?: number;
  condition?: string;
}

export function LogicControlNode() {
  const [activeTab, setActiveTab] = useState<'condition' | 'loop' | 'switch'>('condition');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', field: '配置状态', operator: '等于', value: '已变更' },
    { id: '2', field: '设备类型', operator: '包含', value: '防火墙' },
  ]);
  const [loopConfig, setLoopConfig] = useState<LoopConfig>({ type: 'for', count: 10 });
  const [switchCases, setSwitchCases] = useState<{ id: string; value: string; action: string }[]>([
    { id: '1', value: 'high', action: '发送紧急告警' },
    { id: '2', value: 'medium', action: '发送普通告警' },
    { id: '3', value: 'low', action: '记录日志' },
  ]);
  const [expandedCondition, setExpandedCondition] = useState<string | null>('1');

  const operators = ['等于', '不等于', '大于', '小于', '包含', '不包含', '为空', '不为空'];
  const fields = ['配置状态', '设备类型', '风险等级', '时间范围', 'IP地址', '端口号'];

  const addCondition = () => {
    const newId = String(conditions.length + 1);
    setConditions([...conditions, { id: newId, field: '', operator: '等于', value: '' }]);
    setExpandedCondition(newId);
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const addSwitchCase = () => {
    const newId = String(switchCases.length + 1);
    setSwitchCases([...switchCases, { id: newId, value: '', action: '' }]);
  };

  const updateSwitchCase = (id: string, field: 'value' | 'action', value: string) => {
    setSwitchCases(switchCases.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteSwitchCase = (id: string) => {
    setSwitchCases(switchCases.filter(c => c.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">逻辑控制节点配置</h1>
        <p className="text-[#9CA3AF]">配置流程中的逻辑控制节点</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('condition')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'condition' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'bg-[#20293F] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          <Filter className="w-4 h-4" />
          条件判断
        </button>
        <button
          onClick={() => setActiveTab('loop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'loop' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'bg-[#20293F] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          <Repeat className="w-4 h-4" />
          循环控制
        </button>
        <button
          onClick={() => setActiveTab('switch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'switch' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'bg-[#20293F] text-[#9CA3AF] hover:text-[#F3F4F6]'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          分支选择
        </button>
      </div>

      {activeTab === 'condition' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F3F4F6]">条件表达式</h3>
            <button onClick={addCondition} className="flex items-center gap-2 px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg text-sm transition-colors">
              <Plus className="w-4 h-4" />
              添加条件
            </button>
          </div>

          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="bg-[#181F32] rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#2A354D]/30 transition-colors"
                  onClick={() => setExpandedCondition(expandedCondition === condition.id ? null : condition.id)}
                >
                  <div className="flex items-center gap-4">
                    {index > 0 && (
                      <span className="text-[#FF9100] font-medium">AND</span>
                    )}
                    <span className="text-sm text-[#9CA3AF]">条件 {condition.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedCondition === condition.id ? (
                      <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                    )}
                  </div>
                </div>

                {expandedCondition === condition.id && (
                  <div className="px-4 py-4 border-t border-[#2A354D]">
                    <div className="flex flex-wrap gap-3 items-center">
                      <select
                        value={condition.field}
                        onChange={(e) => updateCondition(condition.id, 'field', e.target.value)}
                        className="px-3 py-2 bg-[#111625] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      >
                        <option value="">选择字段</option>
                        {fields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>

                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                        className="px-3 py-2 bg-[#111625] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                      >
                        {operators.map(operator => (
                          <option key={operator} value={operator}>{operator}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        className="px-3 py-2 bg-[#111625] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                        placeholder="输入值"
                      />

                      <button onClick={() => deleteCondition(condition.id)} className="p-2 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 p-3 bg-[#111625] rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                        <Code className="w-3 h-3" />
                        表达式预览
                      </div>
                      <code className="text-sm text-[#00C853] font-mono">
                        {condition.field} {condition.operator} "{condition.value}"
                      </code>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'loop' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">循环配置</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2">循环类型</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setLoopConfig({ ...loopConfig, type: 'for' })}
                  className={`flex-1 py-3 rounded-lg transition-colors ${
                    loopConfig.type === 'for' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'bg-[#181F32] text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  For 循环 - 执行固定次数
                </button>
                <button
                  onClick={() => setLoopConfig({ ...loopConfig, type: 'while' })}
                  className={`flex-1 py-3 rounded-lg transition-colors ${
                    loopConfig.type === 'while' ? 'bg-[#0066FF] text-[#F3F4F6]' : 'bg-[#181F32] text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  While 循环 - 条件满足时执行
                </button>
              </div>
            </div>

            {loopConfig.type === 'for' && (
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">循环次数</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={loopConfig.count}
                    onChange={(e) => setLoopConfig({ ...loopConfig, count: parseInt(e.target.value) || 0 })}
                    className="flex-1 px-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                  <span className="self-center text-[#9CA3AF]">次</span>
                </div>
              </div>
            )}

            {loopConfig.type === 'while' && (
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">循环条件</label>
                <input
                  type="text"
                  value={loopConfig.condition}
                  onChange={(e) => setLoopConfig({ ...loopConfig, condition: e.target.value })}
                  className="w-full px-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="例如: count < 10"
                />
              </div>
            )}

            <div className="p-4 bg-[#181F32] rounded-lg">
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                <Code className="w-3 h-3" />
                循环代码预览
              </div>
              <pre className="text-sm text-[#00C853] font-mono bg-[#111625] p-3 rounded">
                {loopConfig.type === 'for' ? (
                  `for (let i = 0; i < ${loopConfig.count}; i++) {
  // 循环体
}`
                ) : (
                  `while (${loopConfig.condition || 'condition'}) {
  // 循环体
}`
                )}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'switch' && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F3F4F6]">分支选择配置</h3>
            <button onClick={addSwitchCase} className="flex items-center gap-2 px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg text-sm transition-colors">
              <Plus className="w-4 h-4" />
              添加分支
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#D1D5DB] mb-2">判断字段</label>
            <select className="w-full px-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
              <option>风险等级</option>
              <option>设备类型</option>
              <option>状态码</option>
            </select>
          </div>

          <div className="space-y-3">
            {switchCases.map((caseItem) => (
              <div key={caseItem.id} className="flex gap-3 items-center">
                <span className="text-[#FF9100] font-medium text-sm w-8">case</span>
                <input
                  type="text"
                  value={caseItem.value}
                  onChange={(e) => updateSwitchCase(caseItem.id, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="值"
                />
                <span className="text-[#9CA3AF]">:</span>
                <input
                  type="text"
                  value={caseItem.action}
                  onChange={(e) => updateSwitchCase(caseItem.id, 'action', e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="执行动作"
                />
                <button onClick={() => deleteSwitchCase(caseItem.id)} className="p-2 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-3 items-center pt-2">
              <span className="text-[#6B7280] font-medium text-sm w-8">default</span>
              <span className="text-[#9CA3AF]">:</span>
              <input
                type="text"
                className="flex-1 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="默认动作"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}