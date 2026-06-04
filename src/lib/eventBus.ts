import type { BusinessEvent, EventType, EventHandler } from '@/types/eventBus';

/** 简单的 UUID v4 生成（用于事件 ID） */
export function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 事件总线（单例） */
class EventBusImpl {
  private history: BusinessEvent[] = [];
  private listeners = new Map<EventType, Set<EventHandler>>();
  private maxHistory = 100;
  // 订阅者回调用于通知 React（轻量）
  private onChangeCallbacks = new Set<() => void>();

  /** 派发事件 */
  dispatch<T extends BusinessEvent>(event: Omit<T, 'id' | 'timestamp'> & Partial<Pick<T, 'id' | 'timestamp'>>): T {
    const fullEvent = {
      ...event,
      id: event.id || genId(),
      timestamp: event.timestamp || new Date().toISOString(),
    } as T;
    // 写入历史（最新在前）
    this.history = [fullEvent, ...this.history].slice(0, this.maxHistory);
    // 通知订阅者
    const set = this.listeners.get(fullEvent.type);
    if (set) {
      set.forEach((handler) => {
        try {
          handler(fullEvent);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[EventBus] handler error:', e);
        }
      });
    }
    // 通知 UI 更新
    this.onChangeCallbacks.forEach((cb) => cb());
    return fullEvent;
  }

  /** 订阅事件 */
  subscribe<T extends BusinessEvent>(type: T['type'], handler: EventHandler<T>): () => void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(handler as EventHandler);
    return () => this.listeners.get(type)?.delete(handler as EventHandler);
  }

  /** 获取历史 */
  getHistory(filter?: { type?: EventType; bizId?: string; limit?: number }): BusinessEvent[] {
    let h = this.history;
    if (filter?.type) h = h.filter((e) => e.type === filter.type);
    if (filter?.bizId) h = h.filter((e) => e.bizId === filter.bizId);
    if (filter?.limit) h = h.slice(0, filter.limit);
    return h;
  }

  /** 订阅事件总线变化（用于 React 同步） */
  onChange(cb: () => void): () => void {
    this.onChangeCallbacks.add(cb);
    return () => this.onChangeCallbacks.delete(cb);
  }

  /** 清空历史（测试用） */
  clear(): void {
    this.history = [];
    this.onChangeCallbacks.forEach((cb) => cb());
  }
}

/** 全局事件总线实例 */
export const eventBus = new EventBusImpl();

/** 便捷 dispatch 工厂 */
export const dispatchEvent = <T extends BusinessEvent>(event: Omit<T, 'id' | 'timestamp'>): T => {
  return eventBus.dispatch<T>(event);
};
