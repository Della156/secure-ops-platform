/**
 * FlowOrchestrator 共享组件统一导出
 *
 * 用于系统中所有"流程编排/场景编排/规则编排"页面：
 * - module1/flowEditor/FlowOrchestration        流程编排（list↔canvas 双模式）
 * - module1/flowEditor/LogicControlNode         逻辑控制节点配置
 * - module2/scheduledTask/DrillScenarioEdit     演练场景编排
 * - module3/securityOrchestration/OrchestrationRuleBuilder  编排规则构建器（升级版）
 *
 * 设计原则：
 * - 节点库 + 画布 + 配置面板三栏布局
 * - SVG 连线 + 条件分支（success/failure/always）
 * - 节点状态徽章（pending/running/success/failed）
 * - 业务配置通过 renderNodeConfig prop 注入
 */

export { FlowOrchestrator } from './FlowOrchestrator';
export type { FlowOrchestratorProps } from './FlowOrchestrator';

export { FlowCanvas } from './FlowCanvas';
export type { FlowCanvasProps } from './FlowCanvas';

export { NodeLibrary } from './NodeLibrary';
export type { NodeLibraryProps } from './NodeLibrary';

export { NodeConfigPanel } from './NodeConfigPanel';
export type { NodeConfigPanelProps } from './NodeConfigPanel';

export type {
  FlowNode,
  FlowEdge,
  NodeTypeConfig,
  FlowScenario,
  NodeStatus,
  EdgeCondition,
} from './types';

export {
  statusToStyle,
  conditionToColor,
  conditionToLabel,
} from './types';
