'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, Copy, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const mockRules = [
  { id: 'R-001', name: '高优先级告警自动阻断', priority: 'high', enabled: true, actions: ['阻断IP', '发送通知'] },
  { id: 'R-002', name: '中等告警隔离主机', priority: 'medium', enabled: true, actions: ['隔离主机', '记录日志'] },
  { id: 'R-003', name: '低优先级告警记录', priority: 'low', enabled: false, actions: ['记录日志'] },
];

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return '高优先级';
    case 'medium': return '中优先级';
    case 'low': return '低优先级';
    default: return priority;
  }
};

export function OrchestrationRuleBuilder() {
  const [rules, setRules] = useState(mockRules);
  const [newRule, setNewRule] = useState({ name: '', priority: 'medium', enabled: true });

  const handleAddRule = () => {
    if (!newRule.name.trim()) return;
    const rule = {
      id: `R-${String(rules.length + 1).padStart(3, '0')}`,
      ...newRule,
      actions: ['记录日志'],
    };
    setRules([rule, ...rules]);
    setNewRule({ name: '', priority: 'medium', enabled: true });
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">编排规则构建器</h1>
          <p className="text-slate-400 mt-1">可视化构建安全编排规则，定义触发条件和处置动作</p>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">新建编排规则</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="规则名称"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            />
            <Select
              value={newRule.priority}
              onChange={(e) => setNewRule({ ...newRule, priority: e.target.value })}
              options={[
                { value: 'high', label: '高优先级' },
                { value: 'medium', label: '中优先级' },
                { value: 'low', label: '低优先级' },
              ]}
            />
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-2" />添加条件
            </Button>
            <Button variant="primary" disabled={!newRule.name.trim()} onClick={handleAddRule}>
              <Save className="w-4 h-4 mr-2" />保存规则
            </Button>
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">规则列表</h3>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-slate-500 mr-3 cursor-move" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-50 font-medium">{rule.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getPriorityStyle(rule.priority)}`}>
                          {getPriorityText(rule.priority)}
                        </span>
                        {rule.enabled ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border bg-green-500/20 text-green-400 border-green-500/40">已启用</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border bg-gray-500/20 text-gray-400 border-gray-500/40">已禁用</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {rule.actions.map((action) => (
                          <span key={action} className="text-slate-400 text-sm bg-slate-700/50 px-2 py-0.5 rounded">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default OrchestrationRuleBuilder;
