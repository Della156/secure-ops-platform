'use client';

import Link from 'next/link';
import { FileX, ArrowLeft, Search } from 'lucide-react';

/**
 * 404 页面
 * - 静态导出友好（可独立构建）
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111625] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          404
        </div>
        <div className="w-14 h-14 mx-auto mb-4 bg-[#20293F] border border-[#2A354D] rounded-2xl flex items-center justify-center">
          <FileX className="w-7 h-7 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold mb-2">页面未找到</h1>
        <p className="text-slate-400 text-sm mb-6">您访问的页面不存在或已被移除。</p>
        <div className="flex gap-2 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 h-9 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <button
            onClick={() => {
              // 触发 Cmd+K 唤起全局搜索
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 px-4 h-9 bg-[#20293F] border border-[#2A354D] hover:bg-[#181F32] text-slate-200 text-sm rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            搜索菜单
          </button>
        </div>
      </div>
    </div>
  );
}
