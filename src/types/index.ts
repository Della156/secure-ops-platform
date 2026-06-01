export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  children?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: string;
  children?: ThirdMenuItem[];
}

export interface ThirdMenuItem {
  id: string;
  label: string;
}

export interface HighPriorityTodo {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  source: string;
  createdAt: string;
}

export interface AccountPermission {
  module: string;
  permissions: ('view' | 'edit' | 'delete' | 'admin')[];
}

export interface SystemState {
  riskScore: number;
  accountPermissions: AccountPermission[];
  highPriorityTodos: HighPriorityTodo[];
  activeMenu: string;
  sidebarCollapsed: boolean;
}

export interface SystemContextValue extends SystemState {
  setRiskScore: (score: number) => void;
  setActiveMenu: (menuId: string) => void;
  toggleSidebar: () => void;
  addHighPriorityTodo: (todo: HighPriorityTodo) => void;
  removeHighPriorityTodo: (id: string) => void;
}