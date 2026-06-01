import { RiskScoreSnapshot, RiskScoreHistory } from './risk';

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
  // 基础风险分（向后兼容）
  riskScore: number;
  // 完整的风险评分快照（动态）
  riskSnapshot: RiskScoreSnapshot | null;
  // 风险评分历史
  riskHistory: RiskScoreHistory;
  // 是否正在计算
  isCalculatingRisk: boolean;

  accountPermissions: AccountPermission[];
  highPriorityTodos: HighPriorityTodo[];
  activeMenu: string;
  sidebarCollapsed: boolean;
}

export interface SystemContextValue extends SystemState {
  // 触发风险评分重算
  recalculateRiskScore: (trigger?: 'manual' | 'scheduled' | 'event' | 'initial') => Promise<void>;
  setActiveMenu: (menuId: string) => void;
  toggleSidebar: () => void;
  addHighPriorityTodo: (todo: HighPriorityTodo) => void;
  removeHighPriorityTodo: (id: string) => void;
}

// 重新导出风险类型
export type { RiskScoreSnapshot, RiskScoreHistory, RiskDimension, RiskMetric, AgentContribution } from './risk';