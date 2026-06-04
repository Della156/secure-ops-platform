'use client';

import { useEffect, useState } from 'react';

/**
 * useMounted — 客户端挂载状态
 * 用于避免 SSR/CSR 水合不一致
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export default useMounted;
