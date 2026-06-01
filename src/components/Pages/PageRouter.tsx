'use client';

import { getPageComponent } from '@/data/pageRegistry';
import { useSystem } from '@/contexts/SystemContext';

/**
 * PageRouter 组件
 * 
 * 根据 activeMenu 从 pageRegistry 中查找对应的页面组件并渲染。
 * 如果未注册，显示默认的"页面开发中"占位。
 */
export function PageRouter() {
  const { activeMenu } = useSystem();
  const PageComponent = getPageComponent(activeMenu);
  return <PageComponent />;
}
