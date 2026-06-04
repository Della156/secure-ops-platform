'use client';

import { useState } from 'react';
import { Settings, Save, RotateCcw, Bell, Shield, Database, Server } from 'lucide-react';

export function SystemSettingsView() {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', name: '基本设置', icon: Settings },
    { id: 'notification', name: '通知设置', icon: Bell },
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'database', name: '数据库设置', icon: Database },
    { id: 'server', name: '服务器设置', icon: Server },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">系统设置</h1>
          <p className="text-slate-400 mt-1">配置系统各项参数</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <RotateCcw className="w-3.5 h-3.5" />重置
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            <Save className="w-3.5 h-3.5" />保存设置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500' 
                      : 'text-slate-400 hover:bg-[#111625]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">基本设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">系统名称</label>
                    <input 
                      type="text" 
                      defaultValue="网络安全智能化运维系统"
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">系统版本</label>
                    <input 
                      type="text" 
                      defaultValue="v1.0.0"
                      disabled
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-slate-500 text-sm rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">系统描述</label>
                    <textarea 
                      defaultValue="网络安全智能化运维新系统，提供全面的安全监控和运维管理能力"
                      rows={3}
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">时区</label>
                    <select className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                      <option>Asia/Shanghai (UTC+8)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notification' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">通知设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                    <span className="text-slate-400 text-sm">邮件通知</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                    <span className="text-slate-400 text-sm">短信通知</span>
                    <input type="checkbox" className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                    <span className="text-slate-400 text-sm">钉钉通知</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                    <span className="text-slate-400 text-sm">企业微信通知</span>
                    <input type="checkbox" className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">安全设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">密码有效期（天）</label>
                    <input 
                      type="number" 
                      defaultValue="90"
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">登录失败锁定次数</label>
                    <input 
                      type="number" 
                      defaultValue="5"
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 block mb-1">允许登录的IP范围</label>
                    <input 
                      type="text" 
                      defaultValue="0.0.0.0/0"
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">数据库设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">数据库类型</label>
                    <select className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
                      <option>MySQL</option>
                      <option>PostgreSQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">数据库端口</label>
                    <input 
                      type="number" 
                      defaultValue="3306"
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                    <span className="text-slate-400 text-sm">启用自动备份</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'server' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">服务器设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">服务端口</label>
                    <input 
                      type="number" 
                      defaultValue="8080"
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">最大连接数</label>
                    <input 
                      type="number" 
                      defaultValue="1000"
                      className="w-full px-3 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                    <span className="text-slate-400 text-sm">启用HTTPS</span>
                    <input type="checkbox" className="w-4 h-4 rounded bg-[#111625] border-[#2A354D]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}