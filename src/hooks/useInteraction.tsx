'use client';

import React, { useState } from 'react';
import { X, Check, AlertTriangle, Info } from 'lucide-react';

interface ConfirmOptions {
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
}

interface ModalOptions {
  title: string;
  content: React.ReactNode;
  width?: string;
}

export function useInteraction() {
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showConfirm = (opts: ConfirmOptions) => setConfirm(opts);
  const showModal = (opts: ModalOptions) => setModal(opts);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () => { setConfirm(null); setConfirmLoading(false); };
  const closeModal = () => setModal(null);

  const handleConfirm = async () => {
    if (!confirm) return;
    setConfirmLoading(true);
    try {
      await Promise.resolve(confirm.onConfirm());
      showToast('操作成功', 'success');
    } catch {
      showToast('操作失败', 'error');
    }
    setConfirmLoading(false);
    setConfirm(null);
  };

  // 确认对话框
  const ConfirmDialog = confirm ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          {confirm.type === 'danger' ? (
            <AlertTriangle className="w-6 h-6 text-red-400" />
          ) : confirm.type === 'warning' ? (
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
          ) : (
            <Info className="w-6 h-6 text-blue-400" />
          )}
          <h3 className="text-lg font-semibold text-white">{confirm.title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">{confirm.message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={closeConfirm}
            disabled={confirmLoading}
            className="px-4 py-2 bg-[#2A354D] text-gray-300 rounded-lg text-sm hover:bg-[#35415A] disabled:opacity-50"
          >
            {confirm.cancelText || '取消'}
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmLoading}
            className={`px-4 py-2 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 ${
              confirm.type === 'danger' ? 'bg-red-500 hover:bg-red-600' :
              confirm.type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
              'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {confirmLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {confirm.confirmText || '确认'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // 详情弹窗
  const DetailModal = modal ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeModal}>
      <div
        className="bg-[#1E2736] border border-[#2A354D] rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto"
        style={{ width: modal.width || '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#2A354D]">
          <h3 className="text-lg font-semibold text-white">{modal.title}</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{modal.content}</div>
      </div>
    </div>
  ) : null;

  // Toast
  const Toast = toast ? (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${
        toast.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-200' :
        toast.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-200' :
        'bg-blue-900/90 border-blue-700 text-blue-200'
      }`}>
        {toast.type === 'success' ? <Check className="w-4 h-4" /> :
         toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> :
         <Info className="w-4 h-4" />}
        <span className="text-sm">{toast.message}</span>
      </div>
    </div>
  ) : null;

  return {
    showConfirm,
    showModal,
    showToast,
    closeModal,
    ConfirmDialog,
    DetailModal,
    Toast,
  };
}
