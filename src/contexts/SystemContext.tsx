'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  SystemContextValue,
  HighPriorityTodo,
  AccountPermission,
} from '@/types';
import {
  RiskScoreSnapshot,
  RiskScoreHistory,
} from '@/types/risk';
import { defaultHighPriorityTodos } from '@/data/menuData';
import {
  calculateRiskScore,
  RiskTrigger,
} from '@/services/riskEngine';
import { eventBus, dispatchEvent } from '@/lib/eventBus';
import type { BusinessEvent, EventType, EventHandler } from '@/types/eventBus';

const defaultPermissions: AccountPermission[] = [
  { module: '网络安全自动任务配置', permissions: ['view', 'edit', 'admin'] },
  { module: '网络安全自动运维', permissions: ['view', 'edit'] },
  { module: '网络安全自动运营', permissions: ['view'] },
  { module: '网络安全标准场景自动化', permissions: ['view', 'edit'] },
  { module: '网络安全人机协同工作台', permissions: ['view', 'edit'] },
  { module: '运维配置中心', permissions: ['admin'] },
];

const SystemContext = createContext<SystemContextValue | undefined>(undefined);

interface SystemProviderProps {
  children: React.ReactNode;
  /** 自动重算间隔（毫秒），0 = 不自动重算 */
  autoRecalcInterval?: number;
}

export function SystemProvider({
  children,
  autoRecalcInterval = 30000, // 默认 30 秒
}: SystemProviderProps) {
  const [riskSnapshot, setRiskSnapshot] = useState<RiskScoreSnapshot | null>(null);
  const [riskHistory, setRiskHistory] = useState<RiskScoreHistory>({ snapshots: [] });
  const [isCalculating, setIsCalculating] = useState(false);

  const [accountPermissions] = useState<AccountPermission[]>(defaultPermissions);
  const [highPriorityTodos, setHighPriorityTodos] = useState<HighPriorityTodo[]>(defaultHighPriorityTodos);
  const [activeMenu, setActiveMenuRaw] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsedRaw] = useState<boolean>(false);
  const [persistedHydrated, setPersistedHydrated] = useState(false);
  const [theme, setThemeRaw] = useState<'dark' | 'light' | 'system'>('dark');

  // 客户端挂载后从 localStorage 读取持久化值
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedMenu = window.localStorage.getItem('sys:activeMenu');
      if (savedMenu) setActiveMenuRaw(savedMenu);
      const savedCollapsed = window.localStorage.getItem('sys:sidebarCollapsed');
      if (savedCollapsed !== null) setSidebarCollapsedRaw(savedCollapsed === '1');
      const savedTheme = window.localStorage.getItem('sys:theme');
      if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') setThemeRaw(savedTheme);
    } catch (e) {
      // ignore
    }
    setPersistedHydrated(true);
  }, []);

  // 主题应用：写 data-theme 到 <html>
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const html = document.documentElement;
    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    html.setAttribute('data-theme', resolved);
  }, [theme]);

  // 事件总线状态同步（订阅者 onChange 触发 React 刷新）
  const [eventVersion, setEventVersion] = useState(0);
  useEffect(() => {
    const off = eventBus.onChange(() => setEventVersion((v) => v + 1));
    return off;
  }, []);

  const dispatchBusEvent = useCallback(<T extends BusinessEvent>(event: Omit<T, 'id' | 'timestamp'>) => {
    return dispatchEvent<T>(event);
  }, []);

  const subscribeBusEvent = useCallback(<T extends BusinessEvent>(type: T['type'], handler: EventHandler<T>) => {
    return eventBus.subscribe<T>(type, handler);
  }, []);

  const getEventHistory = useCallback((filter?: { type?: EventType; bizId?: string; limit?: number }) => {
    // 依赖 eventVersion 让 history 变化时重算
    void eventVersion;
    return eventBus.getHistory(filter);
  }, [eventVersion]);

  // 持久化 setter
  const setActiveMenu = useCallback((id: string) => {
    setActiveMenuRaw(id);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('sys:activeMenu', id);
    } catch (e) {}
  }, []);

  const setSidebarCollapsed = useCallback((v: boolean) => {
    setSidebarCollapsedRaw(v);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('sys:sidebarCollapsed', v ? '1' : '0');
    } catch (e) {}
  }, []);

  const previousScoreRef = useRef<number | undefined>(undefined);

  /**
   * 动态计算风险评分
   */
  const recalculateRiskScore = useCallback(
    (trigger: RiskTrigger = 'manual') => {
      setIsCalculating(true);

      // 模拟计算耗时（实际可能是异步的）
      // 在生产环境，这里会调用真实 API
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const previousScore = previousScoreRef.current;
          const newSnapshot = calculateRiskScore(trigger, previousScore);

          setRiskSnapshot(newSnapshot);
          previousScoreRef.current = newSnapshot.totalScore;

          // 添加到历史记录（保留最近 50 条）
          setRiskHistory((prev) => ({
            snapshots: [
              {
                score: newSnapshot.totalScore,
                timestamp: newSnapshot.calculatedAt,
                trigger: newSnapshot.trigger,
                level: newSnapshot.level,
              },
              ...prev.snapshots,
            ].slice(0, 50),
          }));

          setIsCalculating(false);
          resolve();
        }, 300); // 模拟 300ms 计算耗时
      });
    },
    []
  );

  /**
   * 初始计算 + 自动定时重算
   */
  useEffect(() => {
    // 初始计算
    recalculateRiskScore('initial');

    // 定时重算
    if (autoRecalcInterval > 0) {
      const interval = setInterval(() => {
        recalculateRiskScore('scheduled');
      }, autoRecalcInterval);
      return () => clearInterval(interval);
    }
  }, [recalculateRiskScore, autoRecalcInterval]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedRaw((prev) => {
      const next = !prev;
      try {
        if (typeof window !== 'undefined') window.localStorage.setItem('sys:sidebarCollapsed', next ? '1' : '0');
      } catch (e) {}
      return next;
    });
  }, []);

  const setTheme = useCallback((t: 'dark' | 'light' | 'system') => {
    setThemeRaw(t);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('sys:theme', t);
    } catch (e) {}
  }, []);

  const addHighPriorityTodo = useCallback((todo: HighPriorityTodo) => {
    setHighPriorityTodos((prev) => [todo, ...prev]);
  }, []);

  const removeHighPriorityTodo = useCallback((id: string) => {
    setHighPriorityTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const value: SystemContextValue = {
    // 风险评分（动态）
    riskScore: riskSnapshot?.totalScore ?? 0,
    riskSnapshot,
    riskHistory,
    isCalculatingRisk: isCalculating,
    recalculateRiskScore,

    // 原有状态
    accountPermissions,
    highPriorityTodos,
    activeMenu,
    sidebarCollapsed,
    setActiveMenu,
    setSidebarCollapsed,
    toggleSidebar,
    theme,
    setTheme,
    dispatchBusEvent,
    subscribeBusEvent,
    getEventHistory,
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