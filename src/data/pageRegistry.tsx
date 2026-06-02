'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * 页面组件注册表
 * 
 * 将菜单ID (menu-1-1-1 等) 映射到对应的页面组件。
 * 使用动态导入 (dynamic import) 实现按需加载，减小首屏包体积。
 * 
 * 使用方式：
 * 1. 在 module-X/pages/ 目录下创建页面组件
 * 2. 在此注册表中添加映射
 * 3. 页面渲染时自动根据 activeMenu 加载对应组件
 * 
 * 对于标准 CRUD 页面，后续可直接复用 SchemaListPage 模板：
 *   'menu-x-x-x': dynamic(() => import('@/components/templates/SchemaListPage'), {
 *     loading: () => <Loading />
 *   })
 */

// 模块 1：网络安全自动任务配置
// ──────────────────────────────────

// 第1组：自动化任务注册与接入
const TaskAccessManagement = dynamic(() => import(
  '@/components/Pages/module1/taskRegistration/TaskAccessManagement'
).then(m => ({ default: m.TaskAccessManagement })));

const TaskOnlineRegistration = dynamic(() => import(
  '@/components/Pages/module1/taskRegistration/TaskOnlineRegistration'
).then(m => ({ default: m.TaskOnlineRegistration })));

const TaskAccessStatus = dynamic(() => import(
  '@/components/Pages/module1/taskRegistration/TaskAccessStatus'
).then(m => ({ default: m.TaskAccessStatus })));

// 第2组：自动化任务仓库与管理
const TaskVersionManagement = dynamic(() => import(
  '@/components/Pages/module1/taskRepository/TaskVersionManagement'
).then(m => ({ default: m.TaskVersionManagement })));

const TaskShelfManagement = dynamic(() => import(
  '@/components/Pages/module1/taskRepository/TaskShelfManagement'
).then(m => ({ default: m.TaskShelfManagement })));

// 第3组：自动化任务运行状态监控
const TaskRunStatusList = dynamic(() => import(
  '@/components/Pages/module1/taskMonitor/TaskRunStatusList'
).then(m => ({ default: m.TaskRunStatusList })));

const TaskRunStatistics = dynamic(() => import(
  '@/components/Pages/module1/taskMonitor/TaskRunStatistics'
).then(m => ({ default: m.TaskRunStatistics })));

const TaskRunMonitor = dynamic(() => import(
  '@/components/Pages/module1/taskMonitor/TaskRunMonitor'
).then(m => ({ default: m.TaskRunMonitor })));

const TaskResourceMonitor = dynamic(() => import(
  '@/components/Pages/module1/taskMonitor/TaskResourceMonitor'
).then(m => ({ default: m.TaskResourceMonitor })));

const TaskExceptionAnalysis = dynamic(() => import(
  '@/components/Pages/module1/taskMonitor/TaskExceptionAnalysis'
).then(m => ({ default: m.TaskExceptionAnalysis })));

const TaskAlertManagement = dynamic(() => import(
  '@/components/Pages/module1/taskMonitor/TaskAlertManagement'
).then(m => ({ default: m.TaskAlertManagement })));

// 第4组：可编排任务目录
const AbilitySearchBrowse = dynamic(() => import(
  '@/components/Pages/module1/orchestrationDir/AbilitySearchBrowse'
).then(m => ({ default: m.AbilitySearchBrowse })));

const ServiceAuthConfig = dynamic(() => import(
  '@/components/Pages/module1/orchestrationDir/ServiceAuthConfig'
).then(m => ({ default: m.ServiceAuthConfig })));

const ApiDocView = dynamic(() => import(
  '@/components/Pages/module1/orchestrationDir/ApiDocView'
).then(m => ({ default: m.ApiDocView })));

// 第5组：自动化流程编排器
const FlowOrchestration = dynamic(() => import(
  '@/components/Pages/module1/flowEditor/FlowOrchestration'
).then(m => ({ default: m.FlowOrchestration })));

const NodeLibrary = dynamic(() => import(
  '@/components/Pages/module1/flowEditor/NodeLibrary'
).then(m => ({ default: m.NodeLibrary })));

const LogicControlNode = dynamic(() => import(
  '@/components/Pages/module1/flowEditor/LogicControlNode'
).then(m => ({ default: m.LogicControlNode })));

const FlowDebugSimulation = dynamic(() => import(
  '@/components/Pages/module1/flowEditor/FlowDebugSimulation'
).then(m => ({ default: m.FlowDebugSimulation })));

// 第6组：任务模板管理
const TemplateCreateSave = dynamic(() => import(
  '@/components/Pages/module1/templateManager/TemplateCreateSave'
).then(m => ({ default: m.TemplateCreateSave })));

const TemplateParamConfig = dynamic(() => import(
  '@/components/Pages/module1/templateManager/TemplateParamConfig'
).then(m => ({ default: m.TemplateParamConfig })));

const TemplateCategoryTag = dynamic(() => import(
  '@/components/Pages/module1/templateManager/TemplateCategoryTag'
).then(m => ({ default: m.TemplateCategoryTag })));

const TemplateImportInstance = dynamic(() => import(
  '@/components/Pages/module1/templateManager/TemplateImportInstance'
).then(m => ({ default: m.TemplateImportInstance })));

// 第7组：任务调度引擎
const TriggerModeConfig = dynamic(() => import(
  '@/components/Pages/module1/scheduler/TriggerModeConfig'
).then(m => ({ default: m.TriggerModeConfig })));

const PriorityManagement = dynamic(() => import(
  '@/components/Pages/module1/scheduler/PriorityManagement'
).then(m => ({ default: m.PriorityManagement })));

const ResourcePoolConfig = dynamic(() => import(
  '@/components/Pages/module1/scheduler/ResourcePoolConfig'
).then(m => ({ default: m.ResourcePoolConfig })));

// 第8组：任务执行与监控
const GlobalProgressView = dynamic(() => import(
  '@/components/Pages/module1/executionMonitor/GlobalProgressView'
).then(m => ({ default: m.GlobalProgressView })));

const NodeExecutionLog = dynamic(() => import(
  '@/components/Pages/module1/executionMonitor/NodeExecutionLog'
).then(m => ({ default: m.NodeExecutionLog })));

const RunControl = dynamic(() => import(
  '@/components/Pages/module1/executionMonitor/RunControl'
).then(m => ({ default: m.RunControl })));

const ExecutionAudit = dynamic(() => import(
  '@/components/Pages/module1/executionMonitor/ExecutionAudit'
).then(m => ({ default: m.ExecutionAudit })));

// 第9组：安全设备资源管理
const DeviceList = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/device/DeviceList'
).then(m => ({ default: m.DeviceList })));

const DeviceConnectTest = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/device/DeviceConnectTest'
).then(m => ({ default: m.DeviceConnectTest })));

const DeviceAuthManagement = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/device/DeviceAuthManagement'
).then(m => ({ default: m.DeviceAuthManagement })));

const DeviceServiceView = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/device/DeviceServiceView'
).then(m => ({ default: m.DeviceServiceView })));

const DeviceAccessLog = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/device/DeviceAccessLog'
).then(m => ({ default: m.DeviceAccessLog })));

// 第10组：安全系统资源管理
const SystemList = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/system/SystemList'
).then(m => ({ default: m.SystemList })));

const SystemConnectTest = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/system/SystemConnectTest'
).then(m => ({ default: m.SystemConnectTest })));

const SystemAuthManagement = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/system/SystemAuthManagement'
).then(m => ({ default: m.SystemAuthManagement })));

const SystemApiView = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/system/SystemApiView'
).then(m => ({ default: m.SystemApiView })));

const SystemAccessLog = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/system/SystemAccessLog'
).then(m => ({ default: m.SystemAccessLog })));

// 第11组：主机资源管理
const HostList = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/host/HostList'
).then(m => ({ default: m.HostList })));

const HostConnectTest = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/host/HostConnectTest'
).then(m => ({ default: m.HostConnectTest })));

const HostAuthManagement = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/host/HostAuthManagement'
).then(m => ({ default: m.HostAuthManagement })));

const HostCommandView = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/host/HostCommandView'
).then(m => ({ default: m.HostCommandView })));

const HostAccessLog = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/host/HostAccessLog'
).then(m => ({ default: m.HostAccessLog })));

// 第12组：终端资源管理
const EndpointList = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/endpoint/EndpointList'
).then(m => ({ default: m.EndpointList })));

const EndpointConnectTest = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/endpoint/EndpointConnectTest'
).then(m => ({ default: m.EndpointConnectTest })));

const EndpointAuthManagement = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/endpoint/EndpointAuthManagement'
).then(m => ({ default: m.EndpointAuthManagement })));

const EndpointCommandView = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/endpoint/EndpointCommandView'
).then(m => ({ default: m.EndpointCommandView })));

const EndpointAccessLog = dynamic(() => import(
  '@/components/Pages/module1/resourceManagement/endpoint/EndpointAccessLog'
).then(m => ({ default: m.EndpointAccessLog })));

// 第13组：数据接口对接管理
const InterfaceConfig = dynamic(() => import(
  '@/components/Pages/module1/dataIntegration/InterfaceConfig'
).then(m => ({ default: m.InterfaceConfig })));

const InterfaceConnectTest = dynamic(() => import(
  '@/components/Pages/module1/dataIntegration/InterfaceConnectTest'
).then(m => ({ default: m.InterfaceConnectTest })));

const InterfaceCallLog = dynamic(() => import(
  '@/components/Pages/module1/dataIntegration/InterfaceCallLog'
).then(m => ({ default: m.InterfaceCallLog })));

const InterfacePerformance = dynamic(() => import(
  '@/components/Pages/module1/dataIntegration/InterfacePerformance'
).then(m => ({ default: m.InterfacePerformance })));

// 第14组：自动化服务接口配置管理
const ApiInterfaceConfig = dynamic(() => import(
  '@/components/Pages/module1/apiService/ApiInterfaceConfig'
).then(m => ({ default: m.ApiInterfaceConfig })));

const ApiAccessAuth = dynamic(() => import(
  '@/components/Pages/module1/apiService/ApiAccessAuth'
).then(m => ({ default: m.ApiAccessAuth })));

const ApiCallLog = dynamic(() => import(
  '@/components/Pages/module1/apiService/ApiCallLog'
).then(m => ({ default: m.ApiCallLog })));

const ApiCallAnalysis = dynamic(() => import(
  '@/components/Pages/module1/apiService/ApiCallAnalysis'
).then(m => ({ default: m.ApiCallAnalysis })));

// 模块 2：网络安全自动运维
// ──────────────────────────────────

// 第1组：设备运行状态检查
const DeviceStatusView = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/DeviceStatusView'
).then(m => ({ default: m.DeviceStatusView })));

const RealtimeMonitor = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/RealtimeMonitor'
).then(m => ({ default: m.RealtimeMonitor })));

const AlertWarning = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/AlertWarning'
).then(m => ({ default: m.AlertWarning })));

const HealthAnalysis = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/HealthAnalysis'
).then(m => ({ default: m.HealthAnalysis })));

const StatusReport = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/StatusReport'
).then(m => ({ default: m.StatusReport })));

const ReportTemplateConfig = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/ReportTemplateConfig'
).then(m => ({ default: m.ReportTemplateConfig })));

const HistoryArchive = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/HistoryArchive'
).then(m => ({ default: m.HistoryArchive })));

const HistoryCompare = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/HistoryCompare'
).then(m => ({ default: m.HistoryCompare })));

// 第2组：安全策略检查
const SecurityPolicyView = dynamic(() => import(
  '@/components/Pages/module2/securityPolicy/SecurityPolicyView'
).then(m => ({ default: m.SecurityPolicyView })));

const ComplianceManage = dynamic(() => import(
  '@/components/Pages/module2/securityPolicy/ComplianceManage'
).then(m => ({ default: m.ComplianceManage })));

const AutoPolicyCheck = dynamic(() => import(
  '@/components/Pages/module2/securityPolicy/AutoPolicyCheck'
).then(m => ({ default: m.AutoPolicyCheck })));

const RiskLevelAssess = dynamic(() => import(
  '@/components/Pages/module2/securityPolicy/RiskLevelAssess'
).then(m => ({ default: m.RiskLevelAssess })));

const RiskPolicyReport = dynamic(() => import(
  '@/components/Pages/module2/securityPolicy/RiskPolicyReport'
).then(m => ({ default: m.RiskPolicyReport })));

const OneKeyPushFix = dynamic(() => import(
  '@/components/Pages/module2/securityPolicy/OneKeyPushFix'
).then(m => ({ default: m.OneKeyPushFix })));

const PolicyChangeTrack = dynamic(() => import(
  '@/components/Pages/module2/securityPolicy/PolicyChangeTrack'
).then(m => ({ default: m.PolicyChangeTrack })));

/**
 * 默认占位页面（开发中）
 */
function DefaultPage() {
  return (
    <div className="p-8">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-12 text-center">
        <p className="text-[#9CA3AF] text-lg mb-4">页面开发中...</p>
        <p className="text-[#6B7280] text-sm">该页面功能正在开发中，敬请期待</p>
      </div>
    </div>
  );
}

/**
 * 页面注册映射表
 * key: 菜单ID (对应 menuData 中的 id)
 * value: 页面组件
 */
export const pageRegistry: Record<string, ComponentType<any>> = {
  // 第1组
  'menu-1-1-1': TaskAccessManagement,
  'menu-1-1-2': TaskOnlineRegistration,
  'menu-1-1-3': TaskAccessStatus,
  // 第2组
  'menu-1-2-1': TaskVersionManagement,
  'menu-1-2-2': TaskShelfManagement,
  // 第3组
  'menu-1-3-1': TaskRunStatusList,
  'menu-1-3-2': TaskRunStatistics,
  'menu-1-3-3': TaskRunMonitor,
  'menu-1-3-4': TaskResourceMonitor,
  'menu-1-3-5': TaskExceptionAnalysis,
  'menu-1-3-6': TaskAlertManagement,
  // 第4组
  'menu-1-4-1': AbilitySearchBrowse,
  'menu-1-4-2': ServiceAuthConfig,
  'menu-1-4-3': ApiDocView,
  // 第5组
  'menu-1-5-1': FlowOrchestration,
  'menu-1-5-2': NodeLibrary,
  'menu-1-5-3': LogicControlNode,
  'menu-1-5-4': FlowDebugSimulation,
  // 第6组
  'menu-1-6-1': TemplateCreateSave,
  'menu-1-6-2': TemplateParamConfig,
  'menu-1-6-3': TemplateCategoryTag,
  'menu-1-6-4': TemplateImportInstance,
  // 第7组
  'menu-1-7-1': TriggerModeConfig,
  'menu-1-7-2': PriorityManagement,
  'menu-1-7-3': ResourcePoolConfig,
  // 第8组
  'menu-1-8-1': GlobalProgressView,
  'menu-1-8-2': NodeExecutionLog,
  'menu-1-8-3': RunControl,
  'menu-1-8-4': ExecutionAudit,
  // 第9组
  'menu-1-9-1': DeviceList,
  'menu-1-9-2': DeviceConnectTest,
  'menu-1-9-3': DeviceAuthManagement,
  'menu-1-9-4': DeviceServiceView,
  'menu-1-9-5': DeviceAccessLog,
  // 第10组
  'menu-1-10-1': SystemList,
  'menu-1-10-2': SystemConnectTest,
  'menu-1-10-3': SystemAuthManagement,
  'menu-1-10-4': SystemApiView,
  'menu-1-10-5': SystemAccessLog,
  // 第11组
  'menu-1-11-1': HostList,
  'menu-1-11-2': HostConnectTest,
  'menu-1-11-3': HostAuthManagement,
  'menu-1-11-4': HostCommandView,
  'menu-1-11-5': HostAccessLog,
  // 第12组
  'menu-1-12-1': EndpointList,
  'menu-1-12-2': EndpointConnectTest,
  'menu-1-12-3': EndpointAuthManagement,
  'menu-1-12-4': EndpointCommandView,
  'menu-1-12-5': EndpointAccessLog,
  // 第13组
  'menu-1-13-1': InterfaceConfig,
  'menu-1-13-2': InterfaceConnectTest,
  'menu-1-13-3': InterfaceCallLog,
  'menu-1-13-4': InterfacePerformance,
  // 第14组
  'menu-1-14-1': ApiInterfaceConfig,
  'menu-1-14-2': ApiAccessAuth,
  'menu-1-14-3': ApiCallLog,
  'menu-1-14-4': ApiCallAnalysis,

  // 模块2：网络安全自动运维
  // ──────────────────────────────────
  // 第1组：设备运行状态检查
  'menu-2-1-1': DeviceStatusView,
  'menu-2-1-2': RealtimeMonitor,
  'menu-2-1-3': AlertWarning,
  'menu-2-1-4': HealthAnalysis,
  'menu-2-1-5': StatusReport,
  'menu-2-1-6': ReportTemplateConfig,
  'menu-2-1-7': HistoryArchive,
  'menu-2-1-8': HistoryCompare,
  // 第2组：安全策略检查
  'menu-2-2-1': SecurityPolicyView,
  'menu-2-2-2': ComplianceManage,
  'menu-2-2-3': AutoPolicyCheck,
  'menu-2-2-4': RiskLevelAssess,
  'menu-2-2-5': RiskPolicyReport,
  'menu-2-2-6': OneKeyPushFix,
  'menu-2-2-7': PolicyChangeTrack,
};

/**
 * 通过菜单ID获取页面组件
 * 如果未注册，返回 DefaultPage
 */
export function getPageComponent(menuId: string): ComponentType<any> {
  return pageRegistry[menuId] || DefaultPage;
}
