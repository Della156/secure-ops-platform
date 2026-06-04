'use client';

import { Shield, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';
import { menuData } from '@/data/menuData';
import { MenuItem } from './MenuItem';
import { RiskBadge } from './RiskBadge';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, setActiveMenu } = useSystem();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-[#20293F] border-r border-[#2A354D]
        transition-all duration-300 z-50 flex flex-col
        ${sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'}
      `}
    >
      {/* Logo Header - 可点击返回首页 */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2A354D]">
        <button onClick={() => setActiveMenu('dashboard')} className="flex items-center gap-3 overflow-hidden flex-1 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#F3F4F6]" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-[#F3F4F6] font-semibold whitespace-nowrap">
              网络安全态势感知
            </span>
          )}
        </button>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] transition-colors flex-shrink-0"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Risk Score Badge */}
      {!sidebarCollapsed && <RiskBadge />}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {menuData.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2A354D]">
        {!sidebarCollapsed && (
          <p className="text-xs text-[#6B7280] text-center">
            v1.0.0 · 2026
          </p>
        )}
      </div>
    </aside>
  );
}