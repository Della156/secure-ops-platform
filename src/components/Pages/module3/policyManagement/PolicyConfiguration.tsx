'use client';

import { useState } from 'react';
import { Shield, Save, RotateCcw, Plus, Trash2 } from 'lucide-react';

const mockRules = [
  { id: 'rule-001', name: '允许内部访问', source: '192.168.1.0/24', destination: '192.168.2.0/24', action: 'allow', protocol: 'TCP' },
  { id: 'rule-002', name: '阻止外部访问', source: '0.0.0.0/0', destination: '192.168.1.0/24', action: 'deny', protocol: 'UDP' },
  { id: 'rule-003', name: '允许HTTP访问', source: '0.0.0.0/0', destination: '192.168.1.10', action: 'allow', protocol: 'TCP' },
];

export function PolicyConfiguration() {
  const [rules, setRules] = useState(mockRules);

  const addRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      name: '新规则',
      source: '',
      destination: '',
      action: 'allow',
      protocol: 'TCP',
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">策略配置管理</h1>
          <p className="text-slate-400 mt-1">配置和管理安全策略规则</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <RotateCcw className="w-3.5 h-3.5" />重置
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            <Save className="w-3.5 h-3.5" />保存配置
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">规则列表</h3>
          <button onClick={addRule} className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs rounded">
            <Plus className="w-3 h-3" />添加规则
          </button>
        </div>
        <div className="space-y-3">
          {rules.map(rule => (
            <div key={rule.id} className="p-3 bg-[#111625] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{rule.name}</span>
                <button 
                  onClick={() => removeRule(rule.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">源地址</p>
                  <p className="text-slate-300 font-mono">{rule.source}</p>
                </div>
                <div>
                  <p className="text-slate-500">目标地址</p>
                  <p className="text-slate-300 font-mono">{rule.destination}</p>
                </div>
                <div>
                  <p className="text-slate-500">协议</p>
                  <p className="text-slate-300">{rule.protocol}</p>
                </div>
                <div>
                  <p className="text-slate-500">动作</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    rule.action === 'allow' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {rule.action === 'allow' ? '允许' : '阻止'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">策略基本信息</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">策略名称</label>
              <input 
                type="text" 
                defaultValue="防火墙规则策略"
                className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">策略描述</label>
              <textarea 
                defaultValue="管理网络访问规则，控制进出网络的流量"
                rows={3}
                className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">优先级</label>
              <select className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                <option value="high">高优先级</option>
                <option value="medium">中优先级</option>
                <option value="low">低优先级</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">高级配置</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">启用日志记录</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">启用告警通知</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">启用自动更新</span>
              <input type="checkbox" className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">生效时间</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="time" 
                  defaultValue="00:00"
                  className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md"
                />
                <input 
                  type="time" 
                  defaultValue="23:59"
                  className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}