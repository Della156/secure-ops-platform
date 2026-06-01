'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { SystemContextValue, HighPriorityTodo, AccountPermission } from '@/types';
import { defaultHighPriorityTodos } from '@/data/menuData';

const defaultPermissions: AccountPermission[] = [
  { module: '网络安全自动任务配置', permissions: ['view', 'edit', 'admin'] },
  { module: '网络安全自动运维', permissions: ['view', 'edit'] },
  { module: '网络安全自动运营', permissions: ['view'] },
  { module: '网络安全标准场景自动化', permissions: ['view', 'edit'] },
  { module: '网络安全人机协同工作台', permissions: ['view', 'edit'] },
  { module: '运维配置中心', permissions: ['admin'] },
];

const SystemContext = createContext<SystemContextValue | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [riskScore, setRiskScore] = useState<number>(87);
  const [accountPermissions] = useState<AccountPermission[]>(defaultPermissions);
  const [highPriorityTodos, setHighPriorityTodos] = useState<HighPriorityTodo[]>(defaultHighPriorityTodos);
  const [activeMenu, setActiveMenu] = useState<string>('auto-task-config');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const addHighPriorityTodo = useCallback((todo: HighPriorityTodo) => {
    setHighPriorityTodos((prev) => [todo, ...prev]);
  }, []);

  const removeHighPriorityTodo = useCallback((id: string) => {
    setHighPriorityTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const value: SystemContextValue = {
    riskScore,
    accountPermissions,
    highPriorityTodos,
    activeMenu,
    sidebarCollapsed,
    setRiskScore,
    setActiveMenu,
    toggleSidebar,
    addHighPriorityTodo,
    removeHighPriorityTodo,
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem(): SystemContextValue {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}