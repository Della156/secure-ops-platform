'use client';

import { useState, useCallback, type ReactNode } from 'react';

interface ModalConfig {
  title: string;
  content: ReactNode;
  onClose?: () => void;
}

interface ConfirmConfig {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error';
  onConfirm?: () => void;
}

interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface InteractionResult {
  showModal: (config: ModalConfig) => void;
  showConfirm: (config: ConfirmConfig) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  ConfirmDialog: ReactNode;
  DetailModal: ReactNode;
  Toast: ReactNode;
}

function ConfirmDialogComponent({ confirm, onCancel, onConfirm }: { confirm: ConfirmConfig; onCancel: () => void; onConfirm: () => void }) {
  const iconClass = confirm.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
    confirm.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400';
  
  const buttonClass = confirm.type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
    confirm.type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconClass}`}>
            {confirm.type === 'warning' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            {confirm.type === 'error' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            {confirm.type === 'info' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          </div>
          <h3 className="text-lg font-semibold text-white">{confirm.title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">{confirm.message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-[#2A354D] hover:bg-[#364360] text-gray-300 text-sm rounded-md">
            取消
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm rounded-md ${buttonClass} text-white`}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModalComponent({ modal, onClose }: { modal: ModalConfig; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A354D]">
          <h3 className="text-lg font-semibold text-white">{modal.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {modal.content}
        </div>
      </div>
    </div>
  );
}

function ToastComponent({ toast }: { toast: ToastConfig }) {
  const bgClass = toast.type === 'success' ? 'bg-green-500/90' :
    toast.type === 'error' ? 'bg-red-500/90' : 'bg-blue-500/90';

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${bgClass} text-white`}>
      {toast.type === 'success' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
      {toast.type === 'error' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
      {toast.type === 'info' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      {toast.message}
    </div>
  );
}

export function useInteraction(): InteractionResult {
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null);
  const [toast, setToast] = useState<ToastConfig | null>(null);

  const showModal = useCallback((config: ModalConfig) => {
    setModal(config);
  }, []);

  const showConfirm = useCallback((config: ConfirmConfig) => {
    setConfirm({ type: 'info', ...config });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleCloseModal = useCallback(() => {
    const onClose = modal?.onClose;
    setModal(null);
    onClose?.();
  }, [modal]);

  const handleCancelConfirm = useCallback(() => {
    setConfirm(null);
  }, []);

  const handleConfirm = useCallback(() => {
    const onConfirm = confirm?.onConfirm;
    setConfirm(null);
    onConfirm?.();
  }, [confirm]);

  const ConfirmDialog = confirm ? (
    <ConfirmDialogComponent confirm={confirm} onCancel={handleCancelConfirm} onConfirm={handleConfirm} />
  ) : null;

  const DetailModal = modal ? (
    <DetailModalComponent modal={modal} onClose={handleCloseModal} />
  ) : null;

  const Toast = toast ? (
    <ToastComponent toast={toast} />
  ) : null;

  return {
    showModal,
    showConfirm,
    showToast,
    ConfirmDialog,
    DetailModal,
    Toast,
  };
}
