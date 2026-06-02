'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const bgColors: Record<ToastType, string> = {
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  warning: 'border-yellow-500/30 bg-yellow-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

/**
 * 轻量级 Toast 通知组件
 * 用法: const toast = useToast(); → toast.success('操作成功') / toast.error('失败') / toast.warning('警告') / toast.info('提示')
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((msg: string) => addToast('success', msg), [addToast]);
  const error = useCallback((msg: string) => addToast('error', msg), [addToast]);
  const warning = useCallback((msg: string) => addToast('warning', msg), [addToast]);
  const info = useCallback((msg: string) => addToast('info', msg), [addToast]);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // 创建一个确认 Toast（带操作按钮）
      const id = ++toastId;
      const confirmToast: ToastMessage & { onResolve: (v: boolean) => void } = {
        id,
        type: 'warning',
        message,
        onResolve: resolve,
      };
      setToasts(prev => [...prev, confirmToast as unknown as ToastMessage]);
      // 超时自动拒绝
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
        resolve(false);
      }, 10000);
    });
  }, [addToast, setToasts]);

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map(t => {
        const toastData = t as ToastMessage & { onResolve?: (v: boolean) => void };
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg animate-slide-in ${bgColors[t.type]}`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
            <p className="flex-1 text-sm text-gray-200">{t.message}</p>
            {toastData.onResolve ? (
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => { toastData.onResolve!(true); removeToast(t.id); }}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  确认
                </button>
                <button
                  onClick={() => { toastData.onResolve!(false); removeToast(t.id); }}
                  className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded"
                >
                  取消
                </button>
              </div>
            ) : (
              <button onClick={() => removeToast(t.id)} className="flex-shrink-0 text-gray-500 hover:text-gray-300">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  return { success, error, warning, info, confirm, ToastContainer };
}
