'use client';

import React, { useState } from 'react';
import { Save, Clock, AlertCircle, Shield, Check } from 'lucide-react';

export function SessionTimeoutConfig() {
  const [config, setConfig] = useState({
    webTimeout: 30,
    mobileTimeout: 15,
    apiTimeout: 60,
    warningBefore: 5,
    autoLogout: true,
    rememberMe: true,
    rememberMeDays: 7,
    concurrentLogin: true,
    maxConcurrent: 5,
  });

  const handleChange = (key: string, value: number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">会话超时设置</h2>
          <p className="text-sm text-gray-400 mt-1">实现Web会话超时时间配置，保障系统安全</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            会话超时时间
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Web端会话超时</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={config.webTimeout}
                  onChange={(e) => handleChange('webTimeout', parseInt(e.target.value) || 0)}
                  className="flex-1 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm"
                />
                <span className="text-sm text-gray-400">分钟</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">移动端会话超时</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={config.mobileTimeout}
                  onChange={(e) => handleChange('mobileTimeout', parseInt(e.target.value) || 0)}
                  className="flex-1 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm"
                />
                <span className="text-sm text-gray-400">分钟</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">API会话超时</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={config.apiTimeout}
                  onChange={(e) => handleChange('apiTimeout', parseInt(e.target.value) || 0)}
                  className="flex-1 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm"
                />
                <span className="text-sm text-gray-400">分钟</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            超时提醒设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">超时前提醒时间</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={config.warningBefore}
                  onChange={(e) => handleChange('warningBefore', parseInt(e.target.value) || 0)}
                  className="flex-1 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm"
                />
                <span className="text-sm text-gray-400">分钟</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">超时自动退出</div>
                <div className="text-xs text-gray-500 mt-0.5">超时后自动登出用户</div>
              </div>
              <button
                onClick={() => handleChange('autoLogout', !config.autoLogout)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.autoLogout ? 'bg-blue-600' : 'bg-[#2A354D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  config.autoLogout ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">记住我功能</div>
                <div className="text-xs text-gray-500 mt-0.5">允许用户保持登录状态</div>
              </div>
              <button
                onClick={() => handleChange('rememberMe', !config.rememberMe)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.rememberMe ? 'bg-blue-600' : 'bg-[#2A354D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  config.rememberMe ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {config.rememberMe && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">记住我有效期</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={config.rememberMeDays}
                    onChange={(e) => handleChange('rememberMeDays', parseInt(e.target.value) || 0)}
                    className="flex-1 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <span className="text-sm text-gray-400">天</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            并发登录控制
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">启用并发控制</div>
                <div className="text-xs text-gray-500 mt-0.5">限制同一账户多端登录</div>
              </div>
              <button
                onClick={() => handleChange('concurrentLogin', !config.concurrentLogin)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.concurrentLogin ? 'bg-blue-600' : 'bg-[#2A354D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  config.concurrentLogin ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {config.concurrentLogin && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">最大并发登录数</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={config.maxConcurrent}
                    onChange={(e) => handleChange('maxConcurrent', parseInt(e.target.value) || 0)}
                    className="flex-1 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <span className="text-sm text-gray-400">个</span>
                </div>
              </div>
            )}
            <div className="bg-[#111625] rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">并发策略</div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="strategy" defaultChecked className="text-blue-600" />
                  <span className="text-sm text-gray-300">拒绝新登录</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="strategy" className="text-blue-600" />
                  <span className="text-sm text-gray-300">踢掉最早登录</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="strategy" className="text-blue-600" />
                  <span className="text-sm text-gray-300">踢掉所有其他</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">配置摘要</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">Web超时</div>
            <div className="text-lg font-medium text-white mt-1">{config.webTimeout} 分钟</div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">移动端超时</div>
            <div className="text-lg font-medium text-white mt-1">{config.mobileTimeout} 分钟</div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">API超时</div>
            <div className="text-lg font-medium text-white mt-1">{config.apiTimeout} 分钟</div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">超时提醒</div>
            <div className="text-lg font-medium text-white mt-1">{config.warningBefore} 分钟前</div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">记住我</div>
            <div className="text-lg font-medium mt-1">
              {config.rememberMe ? <Check className="w-5 h-5 text-green-400" /> : <span className="text-gray-500">-</span>}
            </div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">并发控制</div>
            <div className="text-lg font-medium mt-1">
              {config.concurrentLogin ? <Check className="w-5 h-5 text-green-400" /> : <span className="text-gray-500">-</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeoutConfig;