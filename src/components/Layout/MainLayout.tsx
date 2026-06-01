'use client';

import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useSystem } from '@/contexts/SystemContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useSystem();

  return (
    <div className="min-h-screen bg-[#111625]">
      <Sidebar />
      <main
        className={`
          transition-all duration-300 min-h-screen
          ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'}
        `}
      >
        {children}
      </main>
    </div>
  );
}