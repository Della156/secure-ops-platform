'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Shield,
  Activity,
  Layers,
  Users,
  Toolbox,
} from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types';
import { useSystem } from '@/contexts/SystemContext';

const iconMap: Record<string, React.ElementType> = {
  Settings,
  Shield,
  Activity,
  Layers,
  Users,
  Toolbox,
};

interface MenuItemProps {
  item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
  const { activeMenu, setActiveMenu } = useSystem();

  const hasChildren = item.children && item.children.length > 0;
  const Icon = iconMap[item.icon || 'Settings'];

  // 默认展开第一个模块（menu-1），方便演示直接看到子菜单
  const [expanded, setExpanded] = useState(item.id === 'menu-1');

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
    // 一级目录不设置 activeMenu，仅展开/收起子菜单
  };

  const isActive = activeMenu === item.id || activeMenu.startsWith(item.id + '-');

  return (
    <div>
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg
          transition-colors duration-150
          ${isActive
            ? 'bg-[#0066FF]/20 text-[#0066FF] border-l-2 border-blue-500'
            : 'text-[#D1D5DB] hover:bg-[#181F32]/50 hover:text-[#F3F4F6] border-l-2 border-transparent'
          }
        `}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        <span className="flex-1 text-left truncate">{item.label}</span>
        {hasChildren && (
          <span className="flex-shrink-0">
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </button>

      {hasChildren && expanded && (
        <div className="ml-6 mt-1 space-y-0.5 border-l border-[#2A354D] pl-4">
          {item.children?.map((child) => {
            const hasThirdLevel = child.children && child.children.length > 0;
            const isChildActive = activeMenu === child.id || (hasThirdLevel && activeMenu.startsWith(child.id + '-'));

            return (
              <div key={child.id}>
                <button
                  onClick={() => {
                    if (hasThirdLevel) {
                      // Toggle third level submenu - don't navigate
                      const btn = document.getElementById(`third-toggle-${child.id}`);
                      if (btn) {
                        const isOpen = btn.getAttribute('data-open') === 'true';
                        btn.setAttribute('data-open', String(!isOpen));
                        const submenu = document.getElementById(`third-submenu-${child.id}`);
                        if (submenu) {
                          submenu.style.display = isOpen ? 'none' : 'block';
                        }
                      }
                    } else {
                      setActiveMenu(child.id);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-1 text-left px-4 py-2 text-sm rounded-md
                    transition-colors duration-150
                    ${isChildActive
                      ? 'bg-[#0066FF]/10 text-[#0066FF] font-medium'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32]/30'
                    }
                  `}
                >
                  <span className="flex-1 truncate">{child.label}</span>
                  {hasThirdLevel && (
                    <span
                      id={`third-toggle-${child.id}`}
                      data-open="false"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        const btn = e.currentTarget;
                        const isOpen = btn.getAttribute('data-open') === 'true';
                        btn.setAttribute('data-open', String(!isOpen));
                        const submenu = document.getElementById(`third-submenu-${child.id}`);
                        if (submenu) {
                          submenu.style.display = isOpen ? 'none' : 'block';
                        }
                      }}
                    >
                      <ChevronRight className="w-3 h-3 text-[#6B7280]" />
                    </span>
                  )}
                </button>
                {hasThirdLevel && (
                  <div
                    id={`third-submenu-${child.id}`}
                    className="ml-4 border-l border-[#2A354D]/50 pl-3"
                    style={{ display: 'none' }}
                  >
                    {child.children?.map((third) => (
                      <button
                        key={third.id}
                        onClick={() => setActiveMenu(third.id)}
                        className={`
                          w-full text-left px-4 py-1.5 text-xs rounded-md
                          transition-colors duration-150
                          ${activeMenu === third.id
                            ? 'bg-[#0066FF]/10 text-[#0066FF] font-medium'
                            : 'text-[#6B7280] hover:text-[#D1D5DB] hover:bg-[#181F32]/30'
                          }
                        `}
                      >
                        {third.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}