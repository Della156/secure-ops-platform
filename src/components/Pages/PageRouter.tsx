'use client';

import { useSystem } from '@/contexts/SystemContext';

// 第1组：自动化任务注册与接入
import { TaskAccessManagement } from '@/components/Pages/module1/taskRegistration/TaskAccessManagement';
import { TaskOnlineRegistration } from '@/components/Pages/module1/taskRegistration/TaskOnlineRegistration';
import { TaskAccessStatus } from '@/components/Pages/module1/taskRegistration/TaskAccessStatus';

// 第2组：自动化任务仓库与管理
import { TaskVersionManagement } from '@/components/Pages/module1/taskRepository/TaskVersionManagement';
import { TaskShelfManagement } from '@/components/Pages/module1/taskRepository/TaskShelfManagement';

// 第3组：自动化任务运行状态监控
import { TaskRunStatusList } from '@/components/Pages/module1/taskMonitor/TaskRunStatusList';
import { TaskRunStatistics } from '@/components/Pages/module1/taskMonitor/TaskRunStatistics';
import { TaskRunMonitor } from '@/components/Pages/module1/taskMonitor/TaskRunMonitor';
import { TaskResourceMonitor } from '@/components/Pages/module1/taskMonitor/TaskResourceMonitor';
import { TaskExceptionAnalysis } from '@/components/Pages/module1/taskMonitor/TaskExceptionAnalysis';
import { TaskAlertManagement } from '@/components/Pages/module1/taskMonitor/TaskAlertManagement';

// 第4组：可编排任务目录
import { AbilitySearchBrowse } from '@/components/Pages/module1/orchestrationDir/AbilitySearchBrowse';
import { ServiceAuthConfig } from '@/components/Pages/module1/orchestrationDir/ServiceAuthConfig';
import { ApiDocView } from '@/components/Pages/module1/orchestrationDir/ApiDocView';

// 第5组：自动化流程编排器
import { FlowOrchestration } from '@/components/Pages/module1/flowEditor/FlowOrchestration';
import { NodeLibrary } from '@/components/Pages/module1/flowEditor/NodeLibrary';
import { LogicControlNode } from '@/components/Pages/module1/flowEditor/LogicControlNode';
import { FlowDebugSimulation } from '@/components/Pages/module1/flowEditor/FlowDebugSimulation';

// 第6组：任务模板管理
import { TemplateCreateSave } from '@/components/Pages/module1/templateManager/TemplateCreateSave';
import { TemplateParamConfig } from '@/components/Pages/module1/templateManager/TemplateParamConfig';
import { TemplateCategoryTag } from '@/components/Pages/module1/templateManager/TemplateCategoryTag';
import { TemplateImportInstance } from '@/components/Pages/module1/templateManager/TemplateImportInstance';

// 第7组：任务调度引擎
import { TriggerModeConfig } from '@/components/Pages/module1/scheduler/TriggerModeConfig';
import { PriorityManagement } from '@/components/Pages/module1/scheduler/PriorityManagement';
import { ResourcePoolConfig } from '@/components/Pages/module1/scheduler/ResourcePoolConfig';

// 第8组：任务执行与监控
import { GlobalProgressView } from '@/components/Pages/module1/executionMonitor/GlobalProgressView';
import { NodeExecutionLog } from '@/components/Pages/module1/executionMonitor/NodeExecutionLog';
import { RunControl } from '@/components/Pages/module1/executionMonitor/RunControl';
import { ExecutionAudit } from '@/components/Pages/module1/executionMonitor/ExecutionAudit';

// 第9组：安全设备资源管理
import { DeviceList } from '@/components/Pages/module1/resourceManagement/device/DeviceList';
import { DeviceConnectTest } from '@/components/Pages/module1/resourceManagement/device/DeviceConnectTest';
import { DeviceAuthManagement } from '@/components/Pages/module1/resourceManagement/device/DeviceAuthManagement';
import { DeviceServiceView } from '@/components/Pages/module1/resourceManagement/device/DeviceServiceView';
import { DeviceAccessLog } from '@/components/Pages/module1/resourceManagement/device/DeviceAccessLog';

// 第10组：安全系统资源管理
import { SystemList } from '@/components/Pages/module1/resourceManagement/system/SystemList';
import { SystemConnectTest } from '@/components/Pages/module1/resourceManagement/system/SystemConnectTest';
import { SystemAuthManagement } from '@/components/Pages/module1/resourceManagement/system/SystemAuthManagement';
import { SystemApiView } from '@/components/Pages/module1/resourceManagement/system/SystemApiView';
import { SystemAccessLog } from '@/components/Pages/module1/resourceManagement/system/SystemAccessLog';

// 第11组：主机资源管理
import { HostList } from '@/components/Pages/module1/resourceManagement/host/HostList';
import { HostConnectTest } from '@/components/Pages/module1/resourceManagement/host/HostConnectTest';
import { HostAuthManagement } from '@/components/Pages/module1/resourceManagement/host/HostAuthManagement';
import { HostCommandView } from '@/components/Pages/module1/resourceManagement/host/HostCommandView';
import { HostAccessLog } from '@/components/Pages/module1/resourceManagement/host/HostAccessLog';

// 第12组：终端资源管理
import { EndpointList } from '@/components/Pages/module1/resourceManagement/endpoint/EndpointList';
import { EndpointConnectTest } from '@/components/Pages/module1/resourceManagement/endpoint/EndpointConnectTest';
import { EndpointAuthManagement } from '@/components/Pages/module1/resourceManagement/endpoint/EndpointAuthManagement';
import { EndpointCommandView } from '@/components/Pages/module1/resourceManagement/endpoint/EndpointCommandView';
import { EndpointAccessLog } from '@/components/Pages/module1/resourceManagement/endpoint/EndpointAccessLog';

// 第13组：数据接口对接管理
import { InterfaceConfig } from '@/components/Pages/module1/dataIntegration/InterfaceConfig';
import { InterfaceConnectTest } from '@/components/Pages/module1/dataIntegration/InterfaceConnectTest';
import { InterfaceCallLog } from '@/components/Pages/module1/dataIntegration/InterfaceCallLog';
import { InterfacePerformance } from '@/components/Pages/module1/dataIntegration/InterfacePerformance';

// 第14组：自动化服务接口配置管理
import { ApiInterfaceConfig } from '@/components/Pages/module1/apiService/ApiInterfaceConfig';
import { ApiAccessAuth } from '@/components/Pages/module1/apiService/ApiAccessAuth';
import { ApiCallLog } from '@/components/Pages/module1/apiService/ApiCallLog';
import { ApiCallAnalysis } from '@/components/Pages/module1/apiService/ApiCallAnalysis';

// 页面映射表
const pageMap: Record<string, React.ComponentType> = {
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
};

// 默认占位页面
function DefaultPage() {
  return (
    <div className="p-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <p className="text-slate-400 text-lg mb-4">页面开发中...</p>
        <p className="text-slate-600 text-sm">该页面功能正在开发中，敬请期待</p>
      </div>
    </div>
  );
}

export function PageRouter() {
  const { activeMenu } = useSystem();
  
  const PageComponent = pageMap[activeMenu] || DefaultPage;
  
  return <PageComponent />;
}