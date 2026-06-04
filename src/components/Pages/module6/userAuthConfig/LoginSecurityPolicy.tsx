'use client';

import React, { useState } from 'react';
import { Save, Shield, Lock, Key, AlertTriangle, Check } from 'lucide-react';

export function LoginSecurityPolicy() {
  const [formData, setFormData] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    expirationDays: 90,
    historyCount: 5,
    maxAttempts: 5,
    lockoutMinutes: 15,
    sessionTimeout: 30,
    idleTimeout: 15,
  });

  const handleChange = (key: string, value: number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">登录安全策略</h2>
          <p className="text-sm text-gray-400 mt-1">实现用户密码安全策略管理</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          保存策略
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-400" />
            密码复杂度策略
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">最小长度</div>
                <div className="text-xs text-gray-500 mt-0.5">密码最小字符数</div>
              </div>
              <input
                type="number"
                value={formData.minLength}
                onChange={(e) => handleChange('minLength', parseInt(e.target.value) || 0)}
                className="w-20 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm text-center"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">需要大写字母</div>
                <div className="text-xs text-gray-500 mt-0.5">密码必须包含大写字母</div>
              </div>
              <button
                onClick={() => handleChange('requireUppercase', !formData.requireUppercase)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.requireUppercase ? 'bg-blue-600' : 'bg-[#2A354D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.requireUppercase ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">需要小写字母</div>
                <div className="text-xs text-gray-500 mt-0.5">密码必须包含小写字母</div>
              </div>
              <button
                onClick={() => handleChange('requireLowercase', !formData.requireLowercase)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.requireLowercase ? 'bg-blue-600' : 'bg-[#2A354D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.requireLowercase ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">需要数字</div>
                <div className="text-xs text-gray-500 mt-0.5">密码必须包含数字</div>
              </div>
              <button
                onClick={() => handleChange('requireNumber', !formData.requireNumber)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.requireNumber ? 'bg-blue-600' : 'bg-[#2A354D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.requireNumber ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">需要特殊字符</div>
                <div className="text-xs text-gray-500 mt-0.5">密码必须包含特殊字符</div>
              </div>
              <button
                onClick={() => handleChange('requireSpecial', !formData.requireSpecial)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.requireSpecial ? 'bg-blue-600' : 'bg-[#2A354D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.requireSpecial ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            密码有效期策略
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">密码有效期</div>
                <div className="text-xs text-gray-500 mt-0.5">密码过期前需修改</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.expirationDays}
                  onChange={(e) => handleChange('expirationDays', parseInt(e.target.value) || 0)}
                  className="w-20 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm text-center"
                />
                <span className="text-sm text-gray-400">天</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">历史密码保留数</div>
                <div className="text-xs text-gray-500 mt-0.5">禁止使用最近N次密码</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.historyCount}
                  onChange={(e) => handleChange('historyCount', parseInt(e.target.value) || 0)}
                  className="w-20 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm text-center"
                />
                <span className="text-sm text-gray-400">次</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            登录失败处理策略
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">最大失败次数</div>
                <div className="text-xs text-gray-500 mt-0.5">连续失败后锁定账户</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.maxAttempts}
                  onChange={(e) => handleChange('maxAttempts', parseInt(e.target.value) || 0)}
                  className="w-20 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm text-center"
                />
                <span className="text-sm text-gray-400">次</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">锁定时长</div>
                <div className="text-xs text-gray-500 mt-0.5">账户锁定后自动解锁时间</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.lockoutMinutes}
                  onChange={(e) => handleChange('lockoutMinutes', parseInt(e.target.value) || 0)}
                  className="w-20 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm text-center"
                />
                <span className="text-sm text-gray-400">分钟</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            会话超时设置
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">会话超时时间</div>
                <div className="text-xs text-gray-500 mt-0.5">用户登录后的最大在线时间</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value) || 0)}
                  className="w-20 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm text-center"
                />
                <span className="text-sm text-gray-400">分钟</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">空闲超时时间</div>
                <div className="text-xs text-gray-500 mt-0.5">无操作后自动退出时间</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.idleTimeout}
                  onChange={(e) => handleChange('idleTimeout', parseInt(e.target.value) || 0)}
                  className="w-20 bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm text-center"
                />
                <span className="text-sm text-gray-400">分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">策略摘要</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">最小长度</div>
            <div className="text-lg font-medium text-white mt-1">{formData.minLength} 位</div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">大写字母</div>
            <div className="text-lg font-medium mt-1 flex items-center gap-1">
              {formData.requireUppercase ? <Check className="w-4 h-4 text-green-400" /> : <span className="text-gray-500">-</span>}
            </div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">小写字母</div>
            <div className="text-lg font-medium mt-1 flex items-center gap-1">
              {formData.requireLowercase ? <Check className="w-4 h-4 text-green-400" /> : <span className="text-gray-500">-</span>}
            </div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">数字</div>
            <div className="text-lg font-medium mt-1 flex items-center gap-1">
              {formData.requireNumber ? <Check className="w-4 h-4 text-green-400" /> : <span className="text-gray-500">-</span>}
            </div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">特殊字符</div>
            <div className="text-lg font-medium mt-1 flex items-center gap-1">
              {formData.requireSpecial ? <Check className="w-4 h-4 text-green-400" /> : <span className="text-gray-500">-</span>}
            </div>
          </div>
          <div className="bg-[#111625] rounded p-3">
            <div className="text-xs text-gray-500">有效期</div>
            <div className="text-lg font-medium text-white mt-1">{formData.expirationDays} 天</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSecurityPolicy;