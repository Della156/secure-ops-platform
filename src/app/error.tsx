'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Next.js 全局错误边界
 * - 任何客户端渲染错误都会落到这里
 * - 提供"重试 / 返回首页"操作
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 上报埋点（生产环境可对接 Sentry 等）
    // eslint-disable-next-line no-console
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="bg-app-bg-deep text-app-text-primary">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">页面出错了</h1>
            <p className="text-app-text-secondary text-sm mb-6">
              {error.message || '发生未知错误，请重试或返回首页。'}
            </p>
            {error.digest && <p className="text-[10px] text-app-text-muted font-mono mb-4">digest: {error.digest}</p>}
            <div className="flex gap-2 justify-center">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 h-9 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 h-9 bg-app-bg-card border border-app-border-base hover:bg-app-bg-surface text-app-text-on-card text-sm rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
