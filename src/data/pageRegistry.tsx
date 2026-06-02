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

// 第3组：特征库版本检查
const SignatureLibraryView = dynamic(() => import(
  '@/components/Pages/module2/signatureLibrary/SignatureLibraryView'
).then(m => ({ default: m.SignatureLibraryView })));

const BaseVersionManage = dynamic(() => import(
  '@/components/Pages/module2/signatureLibrary/BaseVersionManage'
).then(m => ({ default: m.BaseVersionManage })));

const SignatureVersionCollection = dynamic(() => import(
  '@/components/Pages/module2/signatureLibrary/SignatureVersionCollection'
).then(m => ({ default: m.SignatureVersionCollection })));

const ComplianceAnalysis = dynamic(() => import(
  '@/components/Pages/module2/signatureLibrary/ComplianceAnalysis'
).then(m => ({ default: m.ComplianceAnalysis })));

const VersionReport = dynamic(() => import(
  '@/components/Pages/module2/signatureLibrary/VersionReport'
).then(m => ({ default: m.VersionReport })));

const VersionChangeTrack = dynamic(() => import(
  '@/components/Pages/module2/signatureLibrary/VersionChangeTrack'
).then(m => ({ default: m.VersionChangeTrack })));

// 第4组：业务功能检查
const BusinessCheckView = dynamic(() => import(
  '@/components/Pages/module2/businessCheck/BusinessCheckView'
).then(m => ({ default: m.BusinessCheckView })));

const MultiModeCheck = dynamic(() => import(
  '@/components/Pages/module2/businessCheck/MultiModeCheck'
).then(m => ({ default: m.MultiModeCheck })));

const AutomatedDetection = dynamic(() => import(
  '@/components/Pages/module2/businessCheck/AutomatedDetection'
).then(m => ({ default: m.AutomatedDetection })));

const HealthScore = dynamic(() => import(
  '@/components/Pages/module2/businessCheck/HealthScore'
).then(m => ({ default: m.HealthScore })));

const BusinessCheckReport = dynamic(() => import(
  '@/components/Pages/module2/businessCheck/BusinessCheckReport'
).then(m => ({ default: m.BusinessCheckReport })));

// 第5组：操作系统基线检查
const OsBaselineView = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/OsBaselineView'
).then(m => ({ default: m.OsBaselineView })));

const AccountPolicyCheck = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/AccountPolicyCheck'
).then(m => ({ default: m.AccountPolicyCheck })));

const PermissionCheck = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/PermissionCheck'
).then(m => ({ default: m.PermissionCheck })));

const ServicePortCheck = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/ServicePortCheck'
).then(m => ({ default: m.ServicePortCheck })));

const OsKernelCheck = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/OsKernelCheck'
).then(m => ({ default: m.OsKernelCheck })));

const PatchVulnerabilityCheck = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/PatchVulnerabilityCheck'
).then(m => ({ default: m.PatchVulnerabilityCheck })));

const LogAuditCheck = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/LogAuditCheck'
).then(m => ({ default: m.LogAuditCheck })));

const OsBaselineReport = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/OsBaselineReport'
).then(m => ({ default: m.OsBaselineReport })));

const HardeningSuggestion = dynamic(() => import(
  '@/components/Pages/module2/osBaseline/HardeningSuggestion'
).then(m => ({ default: m.HardeningSuggestion })));

// 第6组：中间件基线检查
const MiddlewareBaselineView = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/MiddlewareBaselineView'
).then(m => ({ default: m.MiddlewareBaselineView })));

const MiddlewareConfigCheck = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/MiddlewareConfigCheck'
).then(m => ({ default: m.MiddlewareConfigCheck })));

const AccessControlCheck = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/AccessControlCheck'
).then(m => ({ default: m.AccessControlCheck })));

const ConnectionPerformanceCheck = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/ConnectionPerformanceCheck'
).then(m => ({ default: m.ConnectionPerformanceCheck })));

const LogMonitorCheck = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/LogMonitorCheck'
).then(m => ({ default: m.LogMonitorCheck })));

const ComponentVulnerabilityCheck = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/ComponentVulnerabilityCheck'
).then(m => ({ default: m.ComponentVulnerabilityCheck })));

const MiddlewareBaselineReport = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/MiddlewareBaselineReport'
).then(m => ({ default: m.MiddlewareBaselineReport })));

const MiddlewareSecuritySuggestion = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/MiddlewareSecuritySuggestion'
).then(m => ({ default: m.MiddlewareSecuritySuggestion })));

const MwHardeningSuggestion = dynamic(() => import(
  '@/components/Pages/module2/middlewareBaseline/MwHardeningSuggestion'
).then(m => ({ default: m.MwHardeningSuggestion })));

// 第7组：数据库基线检查
const DatabaseBaselineView = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/DatabaseBaselineView'
).then(m => ({ default: m.DatabaseBaselineView })));

const AccountPermissionCheck = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/AccountPermissionCheck'
).then(m => ({ default: m.AccountPermissionCheck })));

const DataEncryptionCheck = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/DataEncryptionCheck'
).then(m => ({ default: m.DataEncryptionCheck })));

const AuditLogCheck = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/AuditLogCheck'
).then(m => ({ default: m.AuditLogCheck })));

const ParameterSecurityCheck = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/ParameterSecurityCheck'
).then(m => ({ default: m.ParameterSecurityCheck })));

const BackupRecoveryCheck = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/BackupRecoveryCheck'
).then(m => ({ default: m.BackupRecoveryCheck })));

const DatabaseBaselineReport = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/DatabaseBaselineReport'
).then(m => ({ default: m.DatabaseBaselineReport })));

const DatabaseSecuritySuggestion = dynamic(() => import(
  '@/components/Pages/module2/databaseBaseline/DatabaseSecuritySuggestion'
).then(m => ({ default: m.DatabaseSecuritySuggestion })));

// 第8组：安全设备基线检查
const SecurityDeviceBaselineView = dynamic(() => import(
  '@/components/Pages/module2/securityDeviceBaseline/SecurityDeviceBaselineView'
).then(m => ({ default: m.SecurityDeviceBaselineView })));

const SecurityDeviceAccountPolicyCheck = dynamic(() => import(
  '@/components/Pages/module2/securityDeviceBaseline/AccountPolicyCheck'
).then(m => ({ default: m.AccountPolicyCheck })));

const SecurityDeviceAccessControlCheck = dynamic(() => import(
  '@/components/Pages/module2/securityDeviceBaseline/AccessControlCheck'
).then(m => ({ default: m.AccessControlCheck })));

const SecurityDeviceServicePortCheck = dynamic(() => import(
  '@/components/Pages/module2/securityDeviceBaseline/ServicePortCheck'
).then(m => ({ default: m.ServicePortCheck })));

const SecurityDeviceLogAuditCheck = dynamic(() => import(
  '@/components/Pages/module2/securityDeviceBaseline/LogAuditCheck'
).then(m => ({ default: m.LogAuditCheck })));

const SecurityDeviceBaselineReport = dynamic(() => import(
  '@/components/Pages/module2/securityDeviceBaseline/SecurityDeviceBaselineReport'
).then(m => ({ default: m.SecurityDeviceBaselineReport })));

// 第9组：日志处理视图
const LogProcessingView = dynamic(() => import(
  '@/components/Pages/module2/logProcessing/LogProcessingView'
).then(m => ({ default: m.LogProcessingView })));

const LogClassification = dynamic(() => import(
  '@/components/Pages/module2/logProcessing/LogClassification'
).then(m => ({ default: m.LogClassification })));

const LogMonitoring = dynamic(() => import(
  '@/components/Pages/module2/logProcessing/LogMonitoring'
).then(m => ({ default: m.LogMonitoring })));

const LogBackup = dynamic(() => import(
  '@/components/Pages/module2/logProcessing/LogBackup'
).then(m => ({ default: m.LogBackup })));

const LogCleanup = dynamic(() => import(
  '@/components/Pages/module2/logProcessing/LogCleanup'
).then(m => ({ default: m.LogCleanup })));

const LogRetrieval = dynamic(() => import(
  '@/components/Pages/module2/logProcessing/LogRetrieval'
).then(m => ({ default: m.LogRetrieval })));

const LogProcessingReport = dynamic(() => import(
  '@/components/Pages/module2/logProcessing/LogProcessingReport'
).then(m => ({ default: m.LogProcessingReport })));

// 第10组：系统数据处理
const DataProcessingView = dynamic(() => import(
  '@/components/Pages/module2/dataProcessing/DataProcessingView'
).then(m => ({ default: m.DataProcessingView })));

const DataChangeExec = dynamic(() => import(
  '@/components/Pages/module2/dataProcessing/DataChangeExec'
).then(m => ({ default: m.DataChangeExec })));

const DataChangeRecord = dynamic(() => import(
  '@/components/Pages/module2/dataProcessing/DataChangeRecord'
).then(m => ({ default: m.DataChangeRecord })));

const DataProcessingReport = dynamic(() => import(
  '@/components/Pages/module2/dataProcessing/DataProcessingReport'
).then(m => ({ default: m.DataProcessingReport })));

// 第11组：账号处理
const AccountProcessingView = dynamic(() => import(
  '@/components/Pages/module2/accountProcessing/AccountProcessingView'
).then(m => ({ default: m.AccountProcessingView })));

const PwdComplianceCheck = dynamic(() => import(
  '@/components/Pages/module2/accountProcessing/PwdComplianceCheck'
).then(m => ({ default: m.PwdComplianceCheck })));

const AutoPwdReset = dynamic(() => import(
  '@/components/Pages/module2/accountProcessing/AutoPwdReset'
).then(m => ({ default: m.AutoPwdReset })));

const AccountOpRecord = dynamic(() => import(
  '@/components/Pages/module2/accountProcessing/AccountOpRecord'
).then(m => ({ default: m.AccountOpRecord })));

const AccountReport = dynamic(() => import(
  '@/components/Pages/module2/accountProcessing/AccountReport'
).then(m => ({ default: m.AccountReport })));

// 第12组：备份任务
const BackupTaskView = dynamic(() => import(
  '@/components/Pages/module2/backupTask/BackupTaskView'
).then(m => ({ default: m.BackupTaskView })));

const BackupStrategyConfig = dynamic(() => import(
  '@/components/Pages/module2/backupTask/BackupStrategyConfig'
).then(m => ({ default: m.BackupStrategyConfig })));

const BackupStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/backupTask/BackupStatusMonitor'
).then(m => ({ default: m.BackupStatusMonitor })));

const BackupIntegrityCheck = dynamic(() => import(
  '@/components/Pages/module2/backupTask/BackupIntegrityCheck'
).then(m => ({ default: m.BackupIntegrityCheck })));

const AutoRetry = dynamic(() => import(
  '@/components/Pages/module2/backupTask/AutoRetry'
).then(m => ({ default: m.AutoRetry })));

const BackupTaskReport = dynamic(() => import(
  '@/components/Pages/module2/backupTask/BackupTaskReport'
).then(m => ({ default: m.BackupTaskReport })));

// 第13组：恢复任务
const RestoreTaskView = dynamic(() => import(
  '@/components/Pages/module2/restoreTask/RestoreTaskView'
).then(m => ({ default: m.RestoreTaskView })));

const RestoreTaskSchedule = dynamic(() => import(
  '@/components/Pages/module2/restoreTask/RestoreTaskSchedule'
).then(m => ({ default: m.RestoreTaskSchedule })));

const RestorePreview = dynamic(() => import(
  '@/components/Pages/module2/restoreTask/RestorePreview'
).then(m => ({ default: m.RestorePreview })));

const RestoreStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/restoreTask/RestoreStatusMonitor'
).then(m => ({ default: m.RestoreStatusMonitor })));

const RestoreExceptionHandle = dynamic(() => import(
  '@/components/Pages/module2/restoreTask/RestoreExceptionHandle'
).then(m => ({ default: m.RestoreExceptionHandle })));

const RestoreLogRecord = dynamic(() => import(
  '@/components/Pages/module2/restoreTask/RestoreLogRecord'
).then(m => ({ default: m.RestoreLogRecord })));

const RestoreTaskReport = dynamic(() => import(
  '@/components/Pages/module2/restoreTask/RestoreTaskReport'
).then(m => ({ default: m.RestoreTaskReport })));

// 第14组：定时任务
const ScheduledTaskView = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/ScheduledTaskView'
).then(m => ({ default: m.ScheduledTaskView })));

const ScheduledTaskConfig = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/ScheduledTaskConfig'
).then(m => ({ default: m.ScheduledTaskConfig })));

const ScheduledTaskReport = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/ScheduledTaskReport'
).then(m => ({ default: m.ScheduledTaskReport })));

const DrillProcessRecord = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/DrillProcessRecord'
).then(m => ({ default: m.DrillProcessRecord })));

const DrillTaskExec = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/DrillTaskExec'
).then(m => ({ default: m.DrillTaskExec })));

const DrillReportGen = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/DrillReportGen'
).then(m => ({ default: m.DrillReportGen })));

const DrillKnowledgeBase = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/DrillKnowledgeBase'
).then(m => ({ default: m.DrillKnowledgeBase })));

const DrillTaskReport = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/DrillTaskReport'
).then(m => ({ default: m.DrillTaskReport })));

// 第15组：运维操作视图
const OperationView = dynamic(() => import(
  '@/components/Pages/module2/operation/OperationView'
).then(m => ({ default: m.OperationView })));

const TaskScheduling = dynamic(() => import(
  '@/components/Pages/module2/operation/TaskScheduling'
).then(m => ({ default: m.TaskScheduling })));

const JobQueue = dynamic(() => import(
  '@/components/Pages/module2/operation/JobQueue'
).then(m => ({ default: m.JobQueue })));

const OperationReport = dynamic(() => import(
  '@/components/Pages/module2/operation/OperationReport'
).then(m => ({ default: m.OperationReport })));

const StartStopAudit = dynamic(() => import(
  '@/components/Pages/module2/operation/StartStopAudit'
).then(m => ({ default: m.StartStopAudit })));

const StartStopTaskReport = dynamic(() => import(
  '@/components/Pages/module2/operation/StartStopTaskReport'
).then(m => ({ default: m.StartStopTaskReport })));

// 第16组：故障处理
const FaultHandleView = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/FaultHandleView'
).then(m => ({ default: m.FaultHandleView })));

const FaultLocation = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/FaultLocation'
).then(m => ({ default: m.FaultLocation })));

const FaultProcessing = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/FaultProcessing'
).then(m => ({ default: m.FaultProcessing })));

const TuningStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/TuningStatusMonitor'
).then(m => ({ default: m.TuningStatusMonitor })));

const TuningAudit = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/TuningAudit'
).then(m => ({ default: m.TuningAudit })));

const TuningTaskReport = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/TuningTaskReport'
).then(m => ({ default: m.TuningTaskReport })));

// 第17组：安全扫描任务
const SecurityScanView = dynamic(() => import(
  '@/components/Pages/module2/securityScan/SecurityScanView'
).then(m => ({ default: m.SecurityScanView })));

const ScanConfig = dynamic(() => import(
  '@/components/Pages/module2/securityScan/ScanConfig'
).then(m => ({ default: m.ScanConfig })));

const ScanResult = dynamic(() => import(
  '@/components/Pages/module2/securityScan/ScanResult'
).then(m => ({ default: m.ScanResult })));

const AutoRetryAlert = dynamic(() => import(
  '@/components/Pages/module2/securityScan/AutoRetryAlert'
).then(m => ({ default: m.AutoRetryAlert })));

const PermAssignReport = dynamic(() => import(
  '@/components/Pages/module2/securityScan/PermAssignReport'
).then(m => ({ default: m.PermAssignReport })));

// 第18组：权限回收任务
const PermRevokeView = dynamic(() => import(
  '@/components/Pages/module2/permRevoke/PermRevokeView'
).then(m => ({ default: m.PermRevokeView })));

const PendingRevokeConfirm = dynamic(() => import(
  '@/components/Pages/module2/permRevoke/PendingRevokeConfirm'
).then(m => ({ default: m.PendingRevokeConfirm })));

const RevokeStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/permRevoke/RevokeStatusMonitor'
).then(m => ({ default: m.RevokeStatusMonitor })));

const RevokeExceptionHandle = dynamic(() => import(
  '@/components/Pages/module2/permRevoke/RevokeExceptionHandle'
).then(m => ({ default: m.RevokeExceptionHandle })));

const RevokeLogRecord = dynamic(() => import(
  '@/components/Pages/module2/permRevoke/RevokeLogRecord'
).then(m => ({ default: m.RevokeLogRecord })));

const PermRevokeReport = dynamic(() => import(
  '@/components/Pages/module2/permRevoke/PermRevokeReport'
).then(m => ({ default: m.PermRevokeReport })));

// 第19组：权限审计
const PermAuditView = dynamic(() => import(
  '@/components/Pages/module2/permAudit/PermAuditView'
).then(m => ({ default: m.PermAuditView })));

const AuditRuleConfig = dynamic(() => import(
  '@/components/Pages/module2/permAudit/AuditRuleConfig'
).then(m => ({ default: m.AuditRuleConfig })));

const AutoAuditScan = dynamic(() => import(
  '@/components/Pages/module2/permAudit/AutoAuditScan'
).then(m => ({ default: m.AutoAuditScan })));

const AuditProcessRecord = dynamic(() => import(
  '@/components/Pages/module2/permAudit/AuditProcessRecord'
).then(m => ({ default: m.AuditProcessRecord })));

const AuditTaskStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/permAudit/AuditTaskStatusMonitor'
).then(m => ({ default: m.AuditTaskStatusMonitor })));

const AuditReportGen = dynamic(() => import(
  '@/components/Pages/module2/permAudit/AuditReportGen'
).then(m => ({ default: m.AuditReportGen })));

const AuditKnowledgeBase = dynamic(() => import(
  '@/components/Pages/module2/permAudit/AuditKnowledgeBase'
).then(m => ({ default: m.AuditKnowledgeBase })));

const AuditTaskReport = dynamic(() => import(
  '@/components/Pages/module2/permAudit/AuditTaskReport'
).then(m => ({ default: m.AuditTaskReport })));

// 第20组：安全基线加固
const BaselineHardeningView = dynamic(() => import(
  '@/components/Pages/module2/baselineHardening/BaselineHardeningView'
).then(m => ({ default: m.BaselineHardeningView })));

const HardeningStrategyConfig = dynamic(() => import(
  '@/components/Pages/module2/baselineHardening/HardeningStrategyConfig'
).then(m => ({ default: m.HardeningStrategyConfig })));

const HardeningExec = dynamic(() => import(
  '@/components/Pages/module2/baselineHardening/HardeningExec'
).then(m => ({ default: m.HardeningExec })));

const HardeningStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/baselineHardening/HardeningStatusMonitor'
).then(m => ({ default: m.HardeningStatusMonitor })));

const HardeningHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/baselineHardening/HardeningHistoryQuery'
).then(m => ({ default: m.HardeningHistoryQuery })));

const HardeningAudit = dynamic(() => import(
  '@/components/Pages/module2/baselineHardening/HardeningAudit'
).then(m => ({ default: m.HardeningAudit })));

const HardeningTaskReport = dynamic(() => import(
  '@/components/Pages/module2/baselineHardening/HardeningTaskReport'
).then(m => ({ default: m.HardeningTaskReport })));

// 第21组：设备巡检任务
const DeviceInspectionView = dynamic(() => import(
  '@/components/Pages/module2/deviceInspection/DeviceInspectionView'
).then(m => ({ default: m.DeviceInspectionView })));

const InspectionConfig = dynamic(() => import(
  '@/components/Pages/module2/deviceInspection/InspectionConfig'
).then(m => ({ default: m.InspectionConfig })));

// 第21组：安全漏洞加固
const VulnStrategyConfig = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnStrategyConfig'
).then(m => ({ default: m.VulnStrategyConfig })));

const VulnRepairExec = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnRepairExec'
).then(m => ({ default: m.VulnRepairExec })));

const VulnStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnStatusMonitor'
).then(m => ({ default: m.VulnStatusMonitor })));

const VulnHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnHistoryQuery'
).then(m => ({ default: m.VulnHistoryQuery })));

const VulnAudit = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnAudit'
).then(m => ({ default: m.VulnAudit })));

const VulnTaskReport = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnTaskReport'
).then(m => ({ default: m.VulnTaskReport })));

const VulnAlertNotify = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnAlertNotify'
).then(m => ({ default: m.VulnAlertNotify })));

// 第22组：安全加固视图
const SecurityHardeningView = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/SecurityHardeningView'
).then(m => ({ default: m.SecurityHardeningView })));

const AccountHardening = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/AccountHardening'
).then(m => ({ default: m.AccountHardening })));

const AccessControlHardening = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/AccessControlHardening'
).then(m => ({ default: m.AccessControlHardening })));

const SecurityHardeningReport = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/SecurityHardeningReport'
).then(m => ({ default: m.SecurityHardeningReport })));

// 第22组：安全客服
const HelpdeskStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/HelpdeskStatusMonitor'
).then(m => ({ default: m.HelpdeskStatusMonitor })));

const HelpdeskHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/HelpdeskHistoryQuery'
).then(m => ({ default: m.HelpdeskHistoryQuery })));

const HelpdeskAudit = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/HelpdeskAudit'
).then(m => ({ default: m.HelpdeskAudit })));

const HelpdeskTaskReport = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/HelpdeskTaskReport'
).then(m => ({ default: m.HelpdeskTaskReport })));

// 第23组：漏洞管理视图
const VulnerabilityView = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/VulnerabilityView'
).then(m => ({ default: m.VulnerabilityView })));

const VulnerabilityScan = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/VulnerabilityScan'
).then(m => ({ default: m.VulnerabilityScan })));

const VulnerabilityReport = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/VulnerabilityReport'
).then(m => ({ default: m.VulnerabilityReport })));

// 第23组：准入工单任务
const AccessExtendTask = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/AccessExtendTask'
).then(m => ({ default: m.AccessExtendTask })));

const AccessStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/AccessStatusMonitor'
).then(m => ({ default: m.AccessStatusMonitor })));

const AccessHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/AccessHistoryQuery'
).then(m => ({ default: m.AccessHistoryQuery })));

const AccessAudit = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/AccessAudit'
).then(m => ({ default: m.AccessAudit })));

const AccessTaskReport = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/AccessTaskReport'
).then(m => ({ default: m.AccessTaskReport })));

// 第24组：防火墙策略工单
const FirewallWorkOrderView = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/FirewallWorkOrderView'
).then(m => ({ default: m.FirewallWorkOrderView })));

const NetSegDataSync = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/NetSegDataSync'
).then(m => ({ default: m.NetSegDataSync })));

const PolicyManageSync = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/PolicyManageSync'
).then(m => ({ default: m.PolicyManageSync })));

const PolicyRedundancyDetect = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/PolicyRedundancyDetect'
).then(m => ({ default: m.PolicyRedundancyDetect })));

const PolicyOverWideDetect = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/PolicyOverWideDetect'
).then(m => ({ default: m.PolicyOverWideDetect })));

const PolicyComplianceDetect = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/PolicyComplianceDetect'
).then(m => ({ default: m.PolicyComplianceDetect })));

const PolicyAdjustExec = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/PolicyAdjustExec'
).then(m => ({ default: m.PolicyAdjustExec })));

const FwStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/FwStatusMonitor'
).then(m => ({ default: m.FwStatusMonitor })));

const FwHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/FwHistoryQuery'
).then(m => ({ default: m.FwHistoryQuery })));

const FwAudit = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/FwAudit'
).then(m => ({ default: m.FwAudit })));

const FwTaskReport = dynamic(() => import(
  '@/components/Pages/module2/firewallWorkOrder/FwTaskReport'
).then(m => ({ default: m.FwTaskReport })));

// 第25组：PKI工单
const PkiWorkOrderView = dynamic(() => import(
  '@/components/Pages/module2/pkiWorkOrder/PkiWorkOrderView'
).then(m => ({ default: m.PkiWorkOrderView })));

const PkiAuthConfig = dynamic(() => import(
  '@/components/Pages/module2/pkiWorkOrder/PkiAuthConfig'
).then(m => ({ default: m.PkiAuthConfig })));

const PkiAccountClear = dynamic(() => import(
  '@/components/Pages/module2/pkiWorkOrder/PkiAccountClear'
).then(m => ({ default: m.PkiAccountClear })));

const PkiStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/pkiWorkOrder/PkiStatusMonitor'
).then(m => ({ default: m.PkiStatusMonitor })));

const PkiHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/pkiWorkOrder/PkiHistoryQuery'
).then(m => ({ default: m.PkiHistoryQuery })));

const PkiAudit = dynamic(() => import(
  '@/components/Pages/module2/pkiWorkOrder/PkiAudit'
).then(m => ({ default: m.PkiAudit })));

const PkiTaskReport = dynamic(() => import(
  '@/components/Pages/module2/pkiWorkOrder/PkiTaskReport'
).then(m => ({ default: m.PkiTaskReport })));

// 第26组：诊断视图
const DiagnosticView = dynamic(() => import(
  '@/components/Pages/module2/diagnostic/DiagnosticView'
).then(m => ({ default: m.DiagnosticView })));

const NetworkDiagnostic = dynamic(() => import(
  '@/components/Pages/module2/diagnostic/NetworkDiagnostic'
).then(m => ({ default: m.NetworkDiagnostic })));

const DiagnosticReport = dynamic(() => import(
  '@/components/Pages/module2/diagnostic/DiagnosticReport'
).then(m => ({ default: m.DiagnosticReport })));

// 第31组：作业视图
const JobView = dynamic(() => import(
  '@/components/Pages/module2/job/JobView'
).then(m => ({ default: m.JobView })));

const JobHistory = dynamic(() => import(
  '@/components/Pages/module2/job/JobHistory'
).then(m => ({ default: m.JobHistory })));

const JobReport = dynamic(() => import(
  '@/components/Pages/module2/job/JobReport'
).then(m => ({ default: m.JobReport })));

// ──────────────────────────────────────────────
// 模块 3：网络安全自动运营
// ──────────────────────────────────────────────

// 第1组：告警辅助监测视图
const AlertMonitorView = dynamic(() => import('@/components/Pages/module3/alertMonitor/AlertMonitorView').then(m => ({ default: m.AlertMonitorView })));
const RawAlertCollection = dynamic(() => import('@/components/Pages/module3/alertMonitor/RawAlertCollection').then(m => ({ default: m.RawAlertCollection })));
const AlertAutoAnalysis = dynamic(() => import('@/components/Pages/module3/alertMonitor/AlertAutoAnalysis').then(m => ({ default: m.AlertAutoAnalysis })));
const ImpactAssessment = dynamic(() => import('@/components/Pages/module3/alertMonitor/ImpactAssessment').then(m => ({ default: m.ImpactAssessment })));
const AlertTrendPrediction = dynamic(() => import('@/components/Pages/module3/alertMonitor/AlertTrendPrediction').then(m => ({ default: m.AlertTrendPrediction })));
const AlertMonitorStatus = dynamic(() => import('@/components/Pages/module3/alertMonitor/AlertMonitorStatus').then(m => ({ default: m.AlertMonitorStatus })));
const AlertMonitorHistory = dynamic(() => import('@/components/Pages/module3/alertMonitor/AlertMonitorHistory').then(m => ({ default: m.AlertMonitorHistory })));
const AlertMonitorAudit = dynamic(() => import('@/components/Pages/module3/alertMonitor/AlertMonitorAudit').then(m => ({ default: m.AlertMonitorAudit })));
const AlertMonitorReport = dynamic(() => import('@/components/Pages/module3/alertMonitor/AlertMonitorReport').then(m => ({ default: m.AlertMonitorReport })));

// 第2组：横向渗透监测视图
const LateralMovementView = dynamic(() => import('@/components/Pages/module3/lateralMovement/LateralMovementView').then(m => ({ default: m.LateralMovementView })));
const MultiSourceIntegration = dynamic(() => import('@/components/Pages/module3/lateralMovement/MultiSourceIntegration').then(m => ({ default: m.MultiSourceIntegration })));
const BehaviorIdentification = dynamic(() => import('@/components/Pages/module3/lateralMovement/BehaviorIdentification').then(m => ({ default: m.BehaviorIdentification })));
const RealtimeAlertPush = dynamic(() => import('@/components/Pages/module3/lateralMovement/RealtimeAlertPush').then(m => ({ default: m.RealtimeAlertPush })));
const AttackPathVisualization = dynamic(() => import('@/components/Pages/module3/lateralMovement/AttackPathVisualization').then(m => ({ default: m.AttackPathVisualization })));
const LateralMovementStatus = dynamic(() => import('@/components/Pages/module3/lateralMovement/LateralMovementStatus').then(m => ({ default: m.LateralMovementStatus })));
const LateralMovementHistory = dynamic(() => import('@/components/Pages/module3/lateralMovement/LateralMovementHistory').then(m => ({ default: m.LateralMovementHistory })));
const LateralMovementAudit = dynamic(() => import('@/components/Pages/module3/lateralMovement/LateralMovementAudit').then(m => ({ default: m.LateralMovementAudit })));
const LateralMovementReport = dynamic(() => import('@/components/Pages/module3/lateralMovement/LateralMovementReport').then(m => ({ default: m.LateralMovementReport })));

// 第3组：异常行为监测视图
const AnomalyBehaviorView = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/AnomalyBehaviorView').then(m => ({ default: m.AnomalyBehaviorView })));
const UserProfileBuilder = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/UserProfileBuilder').then(m => ({ default: m.UserProfileBuilder })));
const MultiDimensionIntegration = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/MultiDimensionIntegration').then(m => ({ default: m.MultiDimensionIntegration })));
const AutoAnomalyDetection = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/AutoAnomalyDetection').then(m => ({ default: m.AutoAnomalyDetection })));
const AnomalyBehaviorStatus = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/AnomalyBehaviorStatus').then(m => ({ default: m.AnomalyBehaviorStatus })));
const AnomalyBehaviorHistory = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/AnomalyBehaviorHistory').then(m => ({ default: m.AnomalyBehaviorHistory })));
const AnomalyBehaviorAudit = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/AnomalyBehaviorAudit').then(m => ({ default: m.AnomalyBehaviorAudit })));
const AnomalyBehaviorReport = dynamic(() => import('@/components/Pages/module3/anomalyBehavior/AnomalyBehaviorReport').then(m => ({ default: m.AnomalyBehaviorReport })));

// 第4组：互联网防护监测视图
const InternetProtectionView = dynamic(() => import('@/components/Pages/module3/internetProtection/InternetProtectionView').then(m => ({ default: m.InternetProtectionView })));
const BoundaryInfoIntegration = dynamic(() => import('@/components/Pages/module3/internetProtection/BoundaryInfoIntegration').then(m => ({ default: m.BoundaryInfoIntegration })));
const AttackIntentPrediction = dynamic(() => import('@/components/Pages/module3/internetProtection/AttackIntentPrediction').then(m => ({ default: m.AttackIntentPrediction })));
const InternetProtectionStatus = dynamic(() => import('@/components/Pages/module3/internetProtection/InternetProtectionStatus').then(m => ({ default: m.InternetProtectionStatus })));
const InternetProtectionHistory = dynamic(() => import('@/components/Pages/module3/internetProtection/InternetProtectionHistory').then(m => ({ default: m.InternetProtectionHistory })));
const InternetProtectionAudit = dynamic(() => import('@/components/Pages/module3/internetProtection/InternetProtectionAudit').then(m => ({ default: m.InternetProtectionAudit })));
const InternetProtectionReport = dynamic(() => import('@/components/Pages/module3/internetProtection/InternetProtectionReport').then(m => ({ default: m.InternetProtectionReport })));

// 第5组：告警分析决策视图
const AlertDecisionView = dynamic(() => import('@/components/Pages/module3/alertDecision/AlertDecisionView').then(m => ({ default: m.AlertDecisionView })));
const MultiSourceAutoIntegration = dynamic(() => import('@/components/Pages/module3/alertDecision/MultiSourceAutoIntegration').then(m => ({ default: m.MultiSourceAutoIntegration })));
const AlertFastScreening = dynamic(() => import('@/components/Pages/module3/alertDecision/AlertFastScreening').then(m => ({ default: m.AlertFastScreening })));
const AutoDecisionAnalysis = dynamic(() => import('@/components/Pages/module3/alertDecision/AutoDecisionAnalysis').then(m => ({ default: m.AutoDecisionAnalysis })));
const AlertDecisionStatus = dynamic(() => import('@/components/Pages/module3/alertDecision/AlertDecisionStatus').then(m => ({ default: m.AlertDecisionStatus })));
const AlertDecisionHistory = dynamic(() => import('@/components/Pages/module3/alertDecision/AlertDecisionHistory').then(m => ({ default: m.AlertDecisionHistory })));
const AlertDecisionAudit = dynamic(() => import('@/components/Pages/module3/alertDecision/AlertDecisionAudit').then(m => ({ default: m.AlertDecisionAudit })));
const AlertDecisionReport = dynamic(() => import('@/components/Pages/module3/alertDecision/AlertDecisionReport').then(m => ({ default: m.AlertDecisionReport })));

// 第6组：深度样本研判视图
const SampleJudgmentView = dynamic(() => import('@/components/Pages/module3/sampleJudgment/SampleJudgmentView').then(m => ({ default: m.SampleJudgmentView })));
const MultiChannelSampleAcquisition = dynamic(() => import('@/components/Pages/module3/sampleJudgment/MultiChannelSampleAcquisition').then(m => ({ default: m.MultiChannelSampleAcquisition })));
const AnalysisToolAutoInvocation = dynamic(() => import('@/components/Pages/module3/sampleJudgment/AnalysisToolAutoInvocation').then(m => ({ default: m.AnalysisToolAutoInvocation })));
const DeepJudgmentConclusion = dynamic(() => import('@/components/Pages/module3/sampleJudgment/DeepJudgmentConclusion').then(m => ({ default: m.DeepJudgmentConclusion })));
const SampleJudgmentStatus = dynamic(() => import('@/components/Pages/module3/sampleJudgment/SampleJudgmentStatus').then(m => ({ default: m.SampleJudgmentStatus })));
const SampleJudgmentHistory = dynamic(() => import('@/components/Pages/module3/sampleJudgment/SampleJudgmentHistory').then(m => ({ default: m.SampleJudgmentHistory })));
const SampleJudgmentAudit = dynamic(() => import('@/components/Pages/module3/sampleJudgment/SampleJudgmentAudit').then(m => ({ default: m.SampleJudgmentAudit })));
const SampleJudgmentReport = dynamic(() => import('@/components/Pages/module3/sampleJudgment/SampleJudgmentReport').then(m => ({ default: m.SampleJudgmentReport })));

// 第7组：溯源分析视图
const TraceAnalysisView = dynamic(() => import('@/components/Pages/module3/traceAnalysis/TraceAnalysisView').then(m => ({ default: m.TraceAnalysisView })));
const AttackBehaviorAnalysis = dynamic(() => import('@/components/Pages/module3/traceAnalysis/AttackBehaviorAnalysis').then(m => ({ default: m.AttackBehaviorAnalysis })));
const TraceToolAutoInvocation = dynamic(() => import('@/components/Pages/module3/traceAnalysis/TraceToolAutoInvocation').then(m => ({ default: m.TraceToolAutoInvocation })));
const TraceResultVisualization = dynamic(() => import('@/components/Pages/module3/traceAnalysis/TraceResultVisualization').then(m => ({ default: m.TraceResultVisualization })));
const TraceAnalysisStatus = dynamic(() => import('@/components/Pages/module3/traceAnalysis/TraceAnalysisStatus').then(m => ({ default: m.TraceAnalysisStatus })));
const TraceAnalysisHistory = dynamic(() => import('@/components/Pages/module3/traceAnalysis/TraceAnalysisHistory').then(m => ({ default: m.TraceAnalysisHistory })));
const TraceAnalysisAudit = dynamic(() => import('@/components/Pages/module3/traceAnalysis/TraceAnalysisAudit').then(m => ({ default: m.TraceAnalysisAudit })));
const TraceAnalysisReport = dynamic(() => import('@/components/Pages/module3/traceAnalysis/TraceAnalysisReport').then(m => ({ default: m.TraceAnalysisReport })));

// 第8组：ELINK协同联动视图
const ElinkCoordinationView = dynamic(() => import('@/components/Pages/module3/elinkCoordination/ElinkCoordinationView').then(m => ({ default: m.ElinkCoordinationView })));
const ElinkCoordinationConfig = dynamic(() => import('@/components/Pages/module3/elinkCoordination/ElinkCoordinationConfig').then(m => ({ default: m.ElinkCoordinationConfig })));
const ElinkInfoCoordination = dynamic(() => import('@/components/Pages/module3/elinkCoordination/ElinkInfoCoordination').then(m => ({ default: m.ElinkInfoCoordination })));
const AlertInfoSend = dynamic(() => import('@/components/Pages/module3/elinkCoordination/AlertInfoSend').then(m => ({ default: m.AlertInfoSend })));
const ElinkCoordinationStatus = dynamic(() => import('@/components/Pages/module3/elinkCoordination/ElinkCoordinationStatus').then(m => ({ default: m.ElinkCoordinationStatus })));
const ElinkCoordinationHistory = dynamic(() => import('@/components/Pages/module3/elinkCoordination/ElinkCoordinationHistory').then(m => ({ default: m.ElinkCoordinationHistory })));
const ElinkCoordinationAudit = dynamic(() => import('@/components/Pages/module3/elinkCoordination/ElinkCoordinationAudit').then(m => ({ default: m.ElinkCoordinationAudit })));
const ElinkCoordinationReport = dynamic(() => import('@/components/Pages/module3/elinkCoordination/ElinkCoordinationReport').then(m => ({ default: m.ElinkCoordinationReport })));

// 第9组：安全综合处置视图
const SecurityDisposalView = dynamic(() => import('@/components/Pages/module3/securityDisposal/SecurityDisposalView').then(m => ({ default: m.SecurityDisposalView })));
const AutoOperationHierarchy = dynamic(() => import('@/components/Pages/module3/securityDisposal/AutoOperationHierarchy').then(m => ({ default: m.AutoOperationHierarchy })));
const PreAuthorizedEmergencyExec = dynamic(() => import('@/components/Pages/module3/securityDisposal/PreAuthorizedEmergencyExec').then(m => ({ default: m.PreAuthorizedEmergencyExec })));
const SensitiveOperationApproval = dynamic(() => import('@/components/Pages/module3/securityDisposal/SensitiveOperationApproval').then(m => ({ default: m.SensitiveOperationApproval })));
const DisposalProcessRecord = dynamic(() => import('@/components/Pages/module3/securityDisposal/DisposalProcessRecord').then(m => ({ default: m.DisposalProcessRecord })));
const SecurityDisposalStatus = dynamic(() => import('@/components/Pages/module3/securityDisposal/SecurityDisposalStatus').then(m => ({ default: m.SecurityDisposalStatus })));
const SecurityDisposalHistory = dynamic(() => import('@/components/Pages/module3/securityDisposal/SecurityDisposalHistory').then(m => ({ default: m.SecurityDisposalHistory })));
const SecurityDisposalAudit = dynamic(() => import('@/components/Pages/module3/securityDisposal/SecurityDisposalAudit').then(m => ({ default: m.SecurityDisposalAudit })));
const SecurityDisposalReport = dynamic(() => import('@/components/Pages/module3/securityDisposal/SecurityDisposalReport').then(m => ({ default: m.SecurityDisposalReport })));

// 第10组：病毒处置视图
const VirusDisposalView = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusDisposalView').then(m => ({ default: m.VirusDisposalView })));
const VirusAutoIdentification = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusAutoIdentification').then(m => ({ default: m.VirusAutoIdentification })));
const VirusDisposalAnalysis = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusDisposalAnalysis').then(m => ({ default: m.VirusDisposalAnalysis })));
const VirusDisposal = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusDisposal').then(m => ({ default: m.VirusDisposal })));
const VirusDisposalStatus = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusDisposalStatus').then(m => ({ default: m.VirusDisposalStatus })));
const VirusDisposalHistory = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusDisposalHistory').then(m => ({ default: m.VirusDisposalHistory })));
const VirusDisposalAudit = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusDisposalAudit').then(m => ({ default: m.VirusDisposalAudit })));
const VirusDisposalReport = dynamic(() => import('@/components/Pages/module3/virusDisposal/VirusDisposalReport').then(m => ({ default: m.VirusDisposalReport })));

// 第11组：终端取证视图
const EndpointForensicsView = dynamic(() => import('@/components/Pages/module3/endpointForensics/EndpointForensicsView').then(m => ({ default: m.EndpointForensicsView })));
const AbnormalSampleAcquisition = dynamic(() => import('@/components/Pages/module3/endpointForensics/AbnormalSampleAcquisition').then(m => ({ default: m.AbnormalSampleAcquisition })));
const EndpointLogRetrieval = dynamic(() => import('@/components/Pages/module3/endpointForensics/EndpointLogRetrieval').then(m => ({ default: m.EndpointLogRetrieval })));
const ForensicsProcessRecord = dynamic(() => import('@/components/Pages/module3/endpointForensics/ForensicsProcessRecord').then(m => ({ default: m.ForensicsProcessRecord })));
const EndpointForensicsStatus = dynamic(() => import('@/components/Pages/module3/endpointForensics/EndpointForensicsStatus').then(m => ({ default: m.EndpointForensicsStatus })));
const EndpointForensicsHistory = dynamic(() => import('@/components/Pages/module3/endpointForensics/EndpointForensicsHistory').then(m => ({ default: m.EndpointForensicsHistory })));
const EndpointForensicsAudit = dynamic(() => import('@/components/Pages/module3/endpointForensics/EndpointForensicsAudit').then(m => ({ default: m.EndpointForensicsAudit })));
const EndpointForensicsReport = dynamic(() => import('@/components/Pages/module3/endpointForensics/EndpointForensicsReport').then(m => ({ default: m.EndpointForensicsReport })));
// 第12组：主机取证视图
const HostForensicsView = dynamic(() => import('@/components/Pages/module3/hostForensics/HostForensicsView').then(m => ({ default: m.HostForensicsView })));
const HostDataSync = dynamic(() => import('@/components/Pages/module3/hostForensics/HostDataSync').then(m => ({ default: m.HostDataSync })));
const HostLogRetrieval = dynamic(() => import('@/components/Pages/module3/hostForensics/HostLogRetrieval').then(m => ({ default: m.HostLogRetrieval })));
const HostAnalysisResult = dynamic(() => import('@/components/Pages/module3/hostForensics/HostAnalysisResult').then(m => ({ default: m.HostAnalysisResult })));
const HostForensicsStatus = dynamic(() => import('@/components/Pages/module3/hostForensics/HostForensicsStatus').then(m => ({ default: m.HostForensicsStatus })));
const HostForensicsHistory = dynamic(() => import('@/components/Pages/module3/hostForensics/HostForensicsHistory').then(m => ({ default: m.HostForensicsHistory })));
const HostForensicsAudit = dynamic(() => import('@/components/Pages/module3/hostForensics/HostForensicsAudit').then(m => ({ default: m.HostForensicsAudit })));
const HostForensicsReport = dynamic(() => import('@/components/Pages/module3/hostForensics/HostForensicsReport').then(m => ({ default: m.HostForensicsReport })));
// 第13组：样本分析视图
const SampleAnalysisView = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/SampleAnalysisView').then(m => ({ default: m.SampleAnalysisView })));
const MultiToolInvocation = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/MultiToolInvocation').then(m => ({ default: m.MultiToolInvocation })));
const SampleDeepAnalysis = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/SampleDeepAnalysis').then(m => ({ default: m.SampleDeepAnalysis })));
const AnalysisResultSummary = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/AnalysisResultSummary').then(m => ({ default: m.AnalysisResultSummary })));
const SampleAnalysisStatus = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/SampleAnalysisStatus').then(m => ({ default: m.SampleAnalysisStatus })));
const SampleAnalysisHistory = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/SampleAnalysisHistory').then(m => ({ default: m.SampleAnalysisHistory })));
const SampleAnalysisAudit = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/SampleAnalysisAudit').then(m => ({ default: m.SampleAnalysisAudit })));
const SampleAnalysisReport = dynamic(() => import('@/components/Pages/module3/sampleDeepAnalysis/SampleAnalysisReport').then(m => ({ default: m.SampleAnalysisReport })));
// 第14组：告警日报视图
const AlertDailyReportView = dynamic(() => import('@/components/Pages/module3/alertDailyReport/AlertDailyReportView').then(m => ({ default: m.AlertDailyReportView })));
const DailyReportAnalysis = dynamic(() => import('@/components/Pages/module3/alertDailyReport/DailyReportAnalysis').then(m => ({ default: m.DailyReportAnalysis })));
const DailyReportSummary = dynamic(() => import('@/components/Pages/module3/alertDailyReport/DailyReportSummary').then(m => ({ default: m.DailyReportSummary })));
const DailyReportPush = dynamic(() => import('@/components/Pages/module3/alertDailyReport/DailyReportPush').then(m => ({ default: m.DailyReportPush })));
const DailyReportStatus = dynamic(() => import('@/components/Pages/module3/alertDailyReport/DailyReportStatus').then(m => ({ default: m.DailyReportStatus })));
const DailyReportHistory = dynamic(() => import('@/components/Pages/module3/alertDailyReport/DailyReportHistory').then(m => ({ default: m.DailyReportHistory })));
const DailyReportAudit = dynamic(() => import('@/components/Pages/module3/alertDailyReport/DailyReportAudit').then(m => ({ default: m.DailyReportAudit })));
const DailyReportReport = dynamic(() => import('@/components/Pages/module3/alertDailyReport/DailyReportReport').then(m => ({ default: m.DailyReportReport })));
// 第15组：基线防护报告视图
const BaselineReportView = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineReportView').then(m => ({ default: m.BaselineReportView })));
const BaselineToolManagement = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineToolManagement').then(m => ({ default: m.BaselineToolManagement })));
const BaselineCheckResult = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineCheckResult').then(m => ({ default: m.BaselineCheckResult })));
const BaselineReportPush = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineReportPush').then(m => ({ default: m.BaselineReportPush })));
const BaselineReportStatus = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineReportStatus').then(m => ({ default: m.BaselineReportStatus })));
const BaselineReportHistory = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineReportHistory').then(m => ({ default: m.BaselineReportHistory })));
const BaselineReportAudit = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineReportAudit').then(m => ({ default: m.BaselineReportAudit })));
const BaselineReportReport = dynamic(() => import('@/components/Pages/module3/baselineReport/BaselineReportReport').then(m => ({ default: m.BaselineReportReport })));
// 第16组：溯源报告视图
const TraceReportView = dynamic(() => import('@/components/Pages/module3/traceReport/TraceReportView').then(m => ({ default: m.TraceReportView })));
const TraceResultIntegration = dynamic(() => import('@/components/Pages/module3/traceReport/TraceResultIntegration').then(m => ({ default: m.TraceResultIntegration })));
const TraceReportAutoGenerate = dynamic(() => import('@/components/Pages/module3/traceReport/TraceReportAutoGenerate').then(m => ({ default: m.TraceReportAutoGenerate })));
const TraceReportPush = dynamic(() => import('@/components/Pages/module3/traceReport/TraceReportPush').then(m => ({ default: m.TraceReportPush })));
const TraceReportStatus = dynamic(() => import('@/components/Pages/module3/traceReport/TraceReportStatus').then(m => ({ default: m.TraceReportStatus })));
const TraceReportHistory = dynamic(() => import('@/components/Pages/module3/traceReport/TraceReportHistory').then(m => ({ default: m.TraceReportHistory })));
const TraceReportAudit = dynamic(() => import('@/components/Pages/module3/traceReport/TraceReportAudit').then(m => ({ default: m.TraceReportAudit })));
const TraceReportReport = dynamic(() => import('@/components/Pages/module3/traceReport/TraceReportReport').then(m => ({ default: m.TraceReportReport })));

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
  // 第3组：特征库版本检查
  'menu-2-3-1': SignatureLibraryView,
  'menu-2-3-2': BaseVersionManage,
  'menu-2-3-3': SignatureVersionCollection,
  'menu-2-3-4': ComplianceAnalysis,
  'menu-2-3-5': VersionReport,
  'menu-2-3-6': VersionChangeTrack,
  // 第4组：业务功能检查
  'menu-2-4-1': BusinessCheckView,
  'menu-2-4-2': MultiModeCheck,
  'menu-2-4-3': AutomatedDetection,
  'menu-2-4-4': HealthScore,
  'menu-2-4-5': BusinessCheckReport,
  // 第5组：操作系统基线检查
  'menu-2-5-1': OsBaselineView,
  'menu-2-5-2': AccountPolicyCheck,
  'menu-2-5-3': PermissionCheck,
  'menu-2-5-4': ServicePortCheck,
  'menu-2-5-5': OsKernelCheck,
  'menu-2-5-6': PatchVulnerabilityCheck,
  'menu-2-5-7': LogAuditCheck,
  'menu-2-5-8': OsBaselineReport,
  'menu-2-5-9': HardeningSuggestion,
  // 第6组：中间件基线检查
  'menu-2-6-1': MiddlewareBaselineView,
  'menu-2-6-2': MiddlewareConfigCheck,
  'menu-2-6-3': AccessControlCheck,
  'menu-2-6-4': ConnectionPerformanceCheck,
  'menu-2-6-5': LogMonitorCheck,
  'menu-2-6-6': ComponentVulnerabilityCheck,
  'menu-2-6-7': MiddlewareBaselineReport,
  'menu-2-6-8': MiddlewareSecuritySuggestion,
  'menu-2-6-9': MwHardeningSuggestion,
  // 第7组：数据库基线检查
  'menu-2-7-1': DatabaseBaselineView,
  'menu-2-7-2': AccountPermissionCheck,
  'menu-2-7-3': DataEncryptionCheck,
  'menu-2-7-4': AuditLogCheck,
  'menu-2-7-5': ParameterSecurityCheck,
  'menu-2-7-6': BackupRecoveryCheck,
  'menu-2-7-7': DatabaseBaselineReport,
  'menu-2-7-8': DatabaseSecuritySuggestion,
  // 第8组：安全设备基线检查
  'menu-2-8-1': SecurityDeviceBaselineView,
  'menu-2-8-2': SecurityDeviceAccountPolicyCheck,
  'menu-2-8-3': SecurityDeviceAccessControlCheck,
  'menu-2-8-4': SecurityDeviceServicePortCheck,
  'menu-2-8-5': SecurityDeviceLogAuditCheck,
  'menu-2-8-6': SecurityDeviceBaselineReport,
  // 第9组：日志处理视图
  'menu-2-9-1': LogProcessingView,
  'menu-2-9-2': LogClassification,
  'menu-2-9-3': LogMonitoring,
  'menu-2-9-4': LogBackup,
  'menu-2-9-5': LogCleanup,
  'menu-2-9-6': LogRetrieval,
  'menu-2-9-7': LogProcessingReport,
  // 第10组：系统数据处理视图
  'menu-2-10-1': DataProcessingView,
  'menu-2-10-2': DataChangeExec,
  'menu-2-10-3': DataChangeRecord,
  'menu-2-10-4': DataProcessingReport,
  // 第11组：账号处理
  'menu-2-11-1': AccountProcessingView,
  'menu-2-11-2': PwdComplianceCheck,
  'menu-2-11-3': AutoPwdReset,
  'menu-2-11-4': AccountOpRecord,
  'menu-2-11-5': AccountReport,
  // 第12组：备份任务
  'menu-2-12-1': BackupTaskView,
  'menu-2-12-2': BackupStrategyConfig,
  'menu-2-12-3': BackupStatusMonitor,
  'menu-2-12-4': BackupIntegrityCheck,
  'menu-2-12-5': AutoRetry,
  'menu-2-12-6': BackupTaskReport,
  // 第13组：恢复任务
  'menu-2-13-1': RestoreTaskView,
  'menu-2-13-2': RestoreTaskSchedule,
  'menu-2-13-3': RestorePreview,
  'menu-2-13-4': RestoreStatusMonitor,
  'menu-2-13-5': RestoreExceptionHandle,
  'menu-2-13-6': RestoreLogRecord,
  'menu-2-13-7': RestoreTaskReport,
  // 第14组：定时任务
  'menu-2-14-1': ScheduledTaskView,
  'menu-2-14-2': ScheduledTaskConfig,
  'menu-2-14-3': DrillTaskExec,
  'menu-2-14-4': DrillProcessRecord,
  'menu-2-14-5': ScheduledTaskReport,
  'menu-2-14-6': DrillReportGen,
  'menu-2-14-7': DrillKnowledgeBase,
  'menu-2-14-8': DrillTaskReport,
  // 第15组：运维操作视图
  'menu-2-15-1': OperationView,
  'menu-2-15-2': TaskScheduling,
  'menu-2-15-3': JobQueue,
  'menu-2-15-4': OperationReport,
  'menu-2-15-5': StartStopAudit,
  'menu-2-15-6': StartStopTaskReport,
  // 第16组：故障处理
  'menu-2-16-1': FaultHandleView,
  'menu-2-16-2': FaultLocation,
  'menu-2-16-3': FaultProcessing,
  'menu-2-16-4': TuningStatusMonitor,
  'menu-2-16-5': TuningAudit,
  'menu-2-16-6': TuningTaskReport,
  // 第17组：安全扫描任务
  'menu-2-17-1': SecurityScanView,
  'menu-2-17-2': ScanConfig,
  'menu-2-17-3': ScanResult,
  'menu-2-17-4': AutoRetryAlert,
  'menu-2-17-5': PermAssignReport,
  // 第18组：权限回收任务
  'menu-2-18-1': PermRevokeView,
  'menu-2-18-2': PendingRevokeConfirm,
  'menu-2-18-3': RevokeStatusMonitor,
  'menu-2-18-4': RevokeExceptionHandle,
  'menu-2-18-5': RevokeLogRecord,
  'menu-2-18-6': PermRevokeReport,
  // 第19组：权限审计
  'menu-2-19-1': PermAuditView,
  'menu-2-19-2': AuditRuleConfig,
  'menu-2-19-3': AutoAuditScan,
  'menu-2-19-4': AuditProcessRecord,
  'menu-2-19-5': AuditTaskStatusMonitor,
  'menu-2-19-6': AuditReportGen,
  'menu-2-19-7': AuditKnowledgeBase,
  'menu-2-19-8': AuditTaskReport,
  // 第20组：安全基线加固
  'menu-2-20-1': BaselineHardeningView,
  'menu-2-20-2': HardeningStrategyConfig,
  'menu-2-20-3': HardeningExec,
  'menu-2-20-4': HardeningStatusMonitor,
  'menu-2-20-5': HardeningHistoryQuery,
  'menu-2-20-6': HardeningAudit,
  'menu-2-20-7': HardeningTaskReport,
  // 第21组：设备巡检任务
  'menu-2-21-1': DeviceInspectionView,
  'menu-2-21-2': InspectionConfig,
  // 第21组：安全漏洞加固
  'menu-2-21-3': VulnStrategyConfig,
  'menu-2-21-4': VulnRepairExec,
  'menu-2-21-5': VulnStatusMonitor,
  'menu-2-21-6': VulnHistoryQuery,
  'menu-2-21-7': VulnAudit,
  'menu-2-21-8': VulnTaskReport,
  'menu-2-21-9': VulnAlertNotify,
  // 第22组：安全加固视图
  'menu-2-22-1': SecurityHardeningView,
  'menu-2-22-2': AccountHardening,
  'menu-2-22-3': AccessControlHardening,
  'menu-2-22-4': SecurityHardeningReport,
  // 第22组：安全客服
  'menu-2-22-5': HelpdeskStatusMonitor,
  'menu-2-22-6': HelpdeskHistoryQuery,
  'menu-2-22-7': HelpdeskAudit,
  'menu-2-22-8': HelpdeskTaskReport,
  // 第23组：漏洞管理视图
  'menu-2-23-1': VulnerabilityView,
  'menu-2-23-2': VulnerabilityScan,
  'menu-2-23-3': VulnerabilityReport,
  // 第23组：准入工单任务
  'menu-2-23-4': AccessExtendTask,
  'menu-2-23-5': AccessStatusMonitor,
  'menu-2-23-6': AccessHistoryQuery,
  'menu-2-23-7': AccessAudit,
  'menu-2-23-8': AccessTaskReport,
  // 第24组：防火墙策略工单
  'menu-2-24-1': FirewallWorkOrderView,
  'menu-2-24-2': NetSegDataSync,
  'menu-2-24-3': PolicyManageSync,
  'menu-2-24-4': PolicyRedundancyDetect,
  'menu-2-24-5': PolicyOverWideDetect,
  'menu-2-24-6': PolicyComplianceDetect,
  'menu-2-24-7': PolicyAdjustExec,
  'menu-2-24-8': FwStatusMonitor,
  'menu-2-24-9': FwHistoryQuery,
  'menu-2-24-10': FwAudit,
  'menu-2-24-11': FwTaskReport,
  // 第25组：PKI工单
  'menu-2-25-1': PkiWorkOrderView,
  'menu-2-25-2': PkiAuthConfig,
  'menu-2-25-3': PkiAccountClear,
  'menu-2-25-4': PkiStatusMonitor,
  'menu-2-25-5': PkiHistoryQuery,
  'menu-2-25-6': PkiAudit,
  'menu-2-25-7': PkiTaskReport,
  // 第26组：诊断视图
  'menu-2-26-1': DiagnosticView,
  'menu-2-26-2': NetworkDiagnostic,
  'menu-2-26-3': DiagnosticReport,
  // 第31组：作业视图
  'menu-2-31-1': JobView,
  'menu-2-31-2': JobHistory,
  'menu-2-31-3': JobReport,

  // 模块3：网络安全自动运营
  // ──────────────────────────────────
  // 第1组：告警辅助监测视图
  'menu-3-1-1': AlertMonitorView,
  'menu-3-1-2': RawAlertCollection,
  'menu-3-1-3': AlertAutoAnalysis,
  'menu-3-1-4': ImpactAssessment,
  'menu-3-1-5': AlertTrendPrediction,
  'menu-3-1-6': AlertMonitorStatus,
  'menu-3-1-7': AlertMonitorHistory,
  'menu-3-1-8': AlertMonitorAudit,
  'menu-3-1-9': AlertMonitorReport,
  // 第2组：横向渗透监测视图
  'menu-3-2-1': LateralMovementView,
  'menu-3-2-2': MultiSourceIntegration,
  'menu-3-2-3': BehaviorIdentification,
  'menu-3-2-4': RealtimeAlertPush,
  'menu-3-2-5': AttackPathVisualization,
  'menu-3-2-6': LateralMovementStatus,
  'menu-3-2-7': LateralMovementHistory,
  'menu-3-2-8': LateralMovementAudit,
  'menu-3-2-9': LateralMovementReport,
  // 第3组：异常行为监测视图
  'menu-3-3-1': AnomalyBehaviorView,
  'menu-3-3-2': UserProfileBuilder,
  'menu-3-3-3': MultiDimensionIntegration,
  'menu-3-3-4': AutoAnomalyDetection,
  'menu-3-3-5': AnomalyBehaviorStatus,
  'menu-3-3-6': AnomalyBehaviorHistory,
  'menu-3-3-7': AnomalyBehaviorAudit,
  'menu-3-3-8': AnomalyBehaviorReport,
  // 第4组：互联网防护监测视图
  'menu-3-4-1': InternetProtectionView,
  'menu-3-4-2': BoundaryInfoIntegration,
  'menu-3-4-3': AttackIntentPrediction,
  'menu-3-4-4': InternetProtectionStatus,
  'menu-3-4-5': InternetProtectionHistory,
  'menu-3-4-6': InternetProtectionAudit,
  'menu-3-4-7': InternetProtectionReport,
  // 第5组：告警分析决策视图
  'menu-3-5-1': AlertDecisionView,
  'menu-3-5-2': MultiSourceAutoIntegration,
  'menu-3-5-3': AlertFastScreening,
  'menu-3-5-4': AutoDecisionAnalysis,
  'menu-3-5-5': AlertDecisionStatus,
  'menu-3-5-6': AlertDecisionHistory,
  'menu-3-5-7': AlertDecisionAudit,
  'menu-3-5-8': AlertDecisionReport,
  // 第6组：深度样本研判视图
  'menu-3-6-1': SampleJudgmentView,
  'menu-3-6-2': MultiChannelSampleAcquisition,
  'menu-3-6-3': AnalysisToolAutoInvocation,
  'menu-3-6-4': DeepJudgmentConclusion,
  'menu-3-6-5': SampleJudgmentStatus,
  'menu-3-6-6': SampleJudgmentHistory,
  'menu-3-6-7': SampleJudgmentAudit,
  'menu-3-6-8': SampleJudgmentReport,
  // 第7组：溯源分析视图
  'menu-3-7-1': TraceAnalysisView,
  'menu-3-7-2': AttackBehaviorAnalysis,
  'menu-3-7-3': TraceToolAutoInvocation,
  'menu-3-7-4': TraceResultVisualization,
  'menu-3-7-5': TraceAnalysisStatus,
  'menu-3-7-6': TraceAnalysisHistory,
  'menu-3-7-7': TraceAnalysisAudit,
  'menu-3-7-8': TraceAnalysisReport,
  // 第8组：ELINK协同联动视图
  'menu-3-8-1': ElinkCoordinationView,
  'menu-3-8-2': ElinkCoordinationConfig,
  'menu-3-8-3': ElinkInfoCoordination,
  'menu-3-8-4': AlertInfoSend,
  'menu-3-8-5': ElinkCoordinationStatus,
  'menu-3-8-6': ElinkCoordinationHistory,
  'menu-3-8-7': ElinkCoordinationAudit,
  'menu-3-8-8': ElinkCoordinationReport,
  // 第9组：安全综合处置视图
  'menu-3-9-1': SecurityDisposalView,
  'menu-3-9-2': AutoOperationHierarchy,
  'menu-3-9-3': PreAuthorizedEmergencyExec,
  'menu-3-9-4': SensitiveOperationApproval,
  'menu-3-9-5': DisposalProcessRecord,
  'menu-3-9-6': SecurityDisposalStatus,
  'menu-3-9-7': SecurityDisposalHistory,
  'menu-3-9-8': SecurityDisposalAudit,
  'menu-3-9-9': SecurityDisposalReport,
  // 第10组：病毒处置视图
  'menu-3-10-1': VirusDisposalView,
  'menu-3-10-2': VirusAutoIdentification,
  'menu-3-10-3': VirusDisposalAnalysis,
  'menu-3-10-4': VirusDisposal,
  'menu-3-10-5': VirusDisposalStatus,
  'menu-3-10-6': VirusDisposalHistory,
  'menu-3-10-7': VirusDisposalAudit,
  'menu-3-10-8': VirusDisposalReport,
  // 第11组：终端取证视图
  'menu-3-11-1': EndpointForensicsView,
  'menu-3-11-2': AbnormalSampleAcquisition,
  'menu-3-11-3': EndpointLogRetrieval,
  'menu-3-11-4': ForensicsProcessRecord,
  'menu-3-11-5': EndpointForensicsStatus,
  'menu-3-11-6': EndpointForensicsHistory,
  'menu-3-11-7': EndpointForensicsAudit,
  'menu-3-11-8': EndpointForensicsReport,
  // 第12组：主机取证视图
  'menu-3-12-1': HostForensicsView,
  'menu-3-12-2': HostDataSync,
  'menu-3-12-3': HostLogRetrieval,
  'menu-3-12-4': HostAnalysisResult,
  'menu-3-12-5': HostForensicsStatus,
  'menu-3-12-6': HostForensicsHistory,
  'menu-3-12-7': HostForensicsAudit,
  'menu-3-12-8': HostForensicsReport,
  // 第13组：样本分析视图
  'menu-3-13-1': SampleAnalysisView,
  'menu-3-13-2': MultiToolInvocation,
  'menu-3-13-3': SampleDeepAnalysis,
  'menu-3-13-4': AnalysisResultSummary,
  'menu-3-13-5': SampleAnalysisStatus,
  'menu-3-13-6': SampleAnalysisHistory,
  'menu-3-13-7': SampleAnalysisAudit,
  'menu-3-13-8': SampleAnalysisReport,
  // 第14组：告警日报视图
  'menu-3-14-1': AlertDailyReportView,
  'menu-3-14-2': DailyReportAnalysis,
  'menu-3-14-3': DailyReportSummary,
  'menu-3-14-4': DailyReportPush,
  'menu-3-14-5': DailyReportStatus,
  'menu-3-14-6': DailyReportHistory,
  'menu-3-14-7': DailyReportAudit,
  'menu-3-14-8': DailyReportReport,
  // 第15组：基线防护报告视图
  'menu-3-15-1': BaselineReportView,
  'menu-3-15-2': BaselineToolManagement,
  'menu-3-15-3': BaselineCheckResult,
  'menu-3-15-4': BaselineReportPush,
  'menu-3-15-5': BaselineReportStatus,
  'menu-3-15-6': BaselineReportHistory,
  'menu-3-15-7': BaselineReportAudit,
  'menu-3-15-8': BaselineReportReport,
  // 第16组：溯源报告视图
  'menu-3-16-1': TraceReportView,
  'menu-3-16-2': TraceResultIntegration,
  'menu-3-16-3': TraceReportAutoGenerate,
  'menu-3-16-4': TraceReportPush,
  'menu-3-16-5': TraceReportStatus,
  'menu-3-16-6': TraceReportHistory,
  'menu-3-16-7': TraceReportAudit,
  'menu-3-16-8': TraceReportReport,
  // ─────────────────────────────────
  // 模块 4：网络安全标准场景自动化
  // ─────────────────────────────────
  // 第6组：漏洞管理任务
  'menu-4-6-5': DefaultPage,
};

/**
 * 通过菜单ID获取页面组件
 * 如果未注册，返回 DefaultPage
 */
export function getPageComponent(menuId: string): ComponentType<any> {
  return pageRegistry[menuId] || DefaultPage;
}
