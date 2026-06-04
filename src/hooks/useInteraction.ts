'use client';
import { useState, useCallback } from 'react';

interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
}

interface ModalInfo {
  title: string;
  content: React.ReactNode;
}

interface ConfirmInfo {
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface UseInteractionResult {
  showModal: (info: ModalInfo) => void;
  showConfirm: (info: ConfirmInfo) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  ConfirmDialog: React.ReactNode;
  DetailModal: React.ReactNode;
  Toast: React.ReactNode;
}

export function useInteraction(): UseInteractionResult {
  const [modal, setModal] = useState<ModalInfo | null>(null);
  const [confirm, setConfirm] = useState<ConfirmInfo | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showModal = useCallback((info: ModalInfo) => setModal(info), []);
  const closeModal = useCallback(() => setModal(null), []);

  const showConfirm = useCallback((info: ConfirmInfo) => setConfirm(info), []);
  const closeConfirm = useCallback(() => setConfirm(null), []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const Toast = toasts.length > 0 ? (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 min-w-[200px] ${
            t.type === 'success' ? 'bg-green-600/90 text-white' :
            t.type === 'error' ? 'bg-red-600/90 text-white' :
            'bg-blue-600/90 text-white'
          }`}
        >
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          {t.message}
        </div>
      ))}
    </div>
  ) : null;

  const ConfirmDialog = confirm ? (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50" onClick={closeConfirm}>
      <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            confirm.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
            confirm.type === 'danger' ? 'bg-red-500/20 text-red-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            {confirm.type === 'warning' ? '⚠' : confirm.type === 'danger' ? '✕' : 'ℹ'}
          </div>
          <h3 className="text-lg font-medium text-white">{confirm.title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">{confirm.message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => { closeConfirm(); confirm.onCancel?.(); }}
            className="px-4 py-2 bg-[#2A354D] text-gray-300 rounded-lg text-sm hover:bg-[#3A4565]">
            取消
          </button>
          <button onClick={() => { confirm.onConfirm(); closeConfirm(); }}
            className={`px-4 py-2 rounded-lg text-sm text-white ${
              confirm.type === 'danger' ? 'bg-red-600 hover:bg-red-700' :
              confirm.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
              'bg-blue-600 hover:bg-blue-700'
            }`}>
            确认
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const DetailModal = modal ? (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50" onClick={closeModal}>
      <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
          <h3 className="text-lg font-medium text-white">{modal.title}</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-300 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {modal.content}
        </div>
      </div>
    </div>
  ) : null;

  return { showModal, showConfirm, showToast, ConfirmDialog, DetailModal, Toast };
}
