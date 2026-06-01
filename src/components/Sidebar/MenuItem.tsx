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
          {item.children?.map((child) => (
            <button
              key={child.id}
              onClick={() => setActiveMenu(child.id)}
              className={`
                w-full text-left px-4 py-2 text-sm rounded-md
                transition-colors duration-150
                ${activeMenu === child.id
                  ? 'bg-blue-500/10 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                }
              `}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}