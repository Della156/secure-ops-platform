'use client';

import React, { useState } from 'react';
import { Save, Palette, Eye, Check, X } from 'lucide-react';

export function ThemeStyleConfig() {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [previewColor, setPreviewColor] = useState('#3b82f6');

  const themes = [
    { id: 'dark', name: '深色主题', preview: '#0f172a' },
    { id: 'light', name: '浅色主题', preview: '#f8fafc' },
    { id: 'blue', name: '蓝色主题', preview: '#1e3a5f' },
    { id: 'green', name: '绿色主题', preview: '#1e3a3a' },
  ];

  const primaryColors = [
    { name: '蓝色', value: '#3b82f6' },
    { name: '绿色', value: '#22c55e' },
    { name: '紫色', value: '#8b5cf6' },
    { name: '橙色', value: '#f97316' },
    { name: '红色', value: '#ef4444' },
    { name: '青色', value: '#06b6d4' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">全局样式与主题配置</h2>
          <p className="text-sm text-gray-400 mt-1">实现系统主题颜色、登录页背景等样式配置</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-400" />
            主题选择
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map(theme => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative p-4 rounded-lg cursor-pointer transition-all ${
                  selectedTheme === theme.id ? 'border-2 border-blue-500' : 'border border-transparent hover:border-[#2A354D]'
                }`}
                style={{ backgroundColor: theme.preview }}
              >
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedTheme === theme.id ? 'bg-blue-500' : 'bg-[#2A354D]'
                }`}>
                  {selectedTheme === theme.id && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className={`text-sm font-medium ${theme.id === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  {theme.name}
                </div>
                <div className={`text-xs mt-1 ${theme.id === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {theme.id === 'dark' ? '默认主题' : theme.id === 'light' ? '清爽明亮' : theme.id === 'blue' ? '专业商务' : '自然清新'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-green-400" />
            主色调选择
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {primaryColors.map(color => (
              <button
                key={color.value}
                onClick={() => setPreviewColor(color.value)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  previewColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#20293F]' : 'hover:scale-105'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-full shadow-lg"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-gray-300">{color.name}</span>
                {previewColor === color.value && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <Check className="w-3 h-3 text-gray-800" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">登录页配置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">登录页背景</label>
              <div className="flex gap-3">
                <button className="flex-1 h-20 bg-gradient-to-br from-blue-900 to-blue-600 rounded-lg border-2 border-blue-500">
                  <span className="text-white text-xs">渐变蓝</span>
                </button>
                <button className="flex-1 h-20 bg-gradient-to-br from-purple-900 to-purple-600 rounded-lg border border-transparent hover:border-purple-500">
                  <span className="text-white text-xs">渐变紫</span>
                </button>
                <button className="flex-1 h-20 bg-gradient-to-br from-green-900 to-green-600 rounded-lg border border-transparent hover:border-green-500">
                  <span className="text-white text-xs">渐变绿</span>
                </button>
                <button className="flex-1 h-20 bg-[#1e293b] rounded-lg border border-transparent hover:border-gray-500">
                  <span className="text-white text-xs">纯色</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">显示登录背景图</div>
                <div className="text-xs text-gray-500 mt-0.5">在登录页显示装饰性背景图片</div>
              </div>
              <button className="w-12 h-6 rounded-full bg-blue-600">
                <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">显示系统Logo</div>
                <div className="text-xs text-gray-500 mt-0.5">在登录页顶部显示系统Logo</div>
              </div>
              <button className="w-12 h-6 rounded-full bg-blue-600">
                <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">样式预览</h3>
          <div className="bg-[#0f172a] rounded-lg p-4 border border-[#2A354D]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full" style={{ backgroundColor: previewColor }} />
              <div>
                <div className="text-white text-sm font-medium">系统名称</div>
                <div className="text-gray-400 text-xs">Network Security Platform</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 h-8 rounded-lg" style={{ backgroundColor: previewColor }} />
                <button className="px-4 h-8 rounded-lg bg-[#1e293b] border border-[#334155] text-gray-300 text-sm">
                  按钮
                </button>
              </div>
              <div className="h-2 rounded-full bg-[#1e293b] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: previewColor }} />
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeStyleConfig;