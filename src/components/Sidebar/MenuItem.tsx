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
  const [expanded, setExpanded] = useState(item.id === 'auto-task-config');
  const { activeMenu, setActiveMenu } = useSystem();

  const hasChildren = item.children && item.children.length > 0;
  const Icon = iconMap[item.icon || 'Settings'];

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
    setActiveMenu(item.id);
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
            ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500'
            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent'
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
        <div className="ml-6 mt-1 space-y-0.5 border-l border-slate-700 pl-4">
          {item.children?.map((child) => {
            const hasThirdLevel = child.children && child.children.length > 0;
            const isChildActive = activeMenu === child.id || (hasThirdLevel && activeMenu.startsWith(child.id + '-'));

            return (
              <div key={child.id}>
                <button
                  onClick={() => {
                    if (hasThirdLevel) {
                      // Toggle third level locally via data attribute on DOM
                      const btn = document.getElementById(`third-toggle-${child.id}`);
                      if (btn) {
                        const isOpen = btn.getAttribute('data-open') === 'true';
                        btn.setAttribute('data-open', String(!isOpen));
                        const submenu = document.getElementById(`third-submenu-${child.id}`);
                        if (submenu) {
                          submenu.style.display = isOpen ? 'none' : 'block';
                        }
                      }
                    }
                    setActiveMenu(child.id);
                  }}
                  className={`
                    w-full flex items-center gap-1 text-left px-4 py-2 text-sm rounded-md
                    transition-colors duration-150
                    ${isChildActive
                      ? 'bg-blue-500/10 text-blue-400 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
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
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </span>
                  )}
                </button>
                {hasThirdLevel && (
                  <div
                    id={`third-submenu-${child.id}`}
                    className="ml-4 border-l border-slate-700/50 pl-3"
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
                            ? 'bg-blue-500/10 text-blue-400 font-medium'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
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