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

// --- menu-4-6 漏洞管理任务（除 5 之外）---
const Stub_4_6_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-1" {...props} /> })));
const Stub_4_6_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-2" {...props} /> })));
const Stub_4_6_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-3" {...props} /> })));
const Stub_4_6_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-4" {...props} /> })));
const Stub_4_6_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-6" {...props} /> })));
const Stub_4_6_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-7" {...props} /> })));
const Stub_4_6_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-8" {...props} /> })));
const Stub_4_6_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-9" {...props} /> })));
const Stub_4_6_10 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-10" {...props} /> })));
const Stub_4_6_11 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-11" {...props} /> })));
const Stub_4_6_12 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-6-12" {...props} /> })));

// ==========================================================
// 模块 3/4/5/6 占位注册（补全 296 个三级菜单）
// 业务深度实现后续按 menuId 单独替换
// ==========================================================
// --- 模块 3: menu-3-1 ---
const Stub_3_1_1 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/AlertMonitorView'
).then(m => ({ default: m.AlertMonitorView })));
const Stub_3_1_2 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/RawAlertCollection'
).then(m => ({ default: m.RawAlertCollection })));
const Stub_3_1_3 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/AlertAutoAnalysis'
).then(m => ({ default: m.AlertAutoAnalysis })));
const Stub_3_1_4 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/ImpactRangeEval'
).then(m => ({ default: m.ImpactRangeEval })));
const Stub_3_1_5 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/AlertTrendPredict'
).then(m => ({ default: m.AlertTrendPredict })));
const Stub_3_1_6 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/MonitorStatus'
).then(m => ({ default: m.MonitorStatus })));
const Stub_3_1_7 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/MonitorHistory'
).then(m => ({ default: m.MonitorHistory })));
const Stub_3_1_8 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/MonitorAudit'
).then(m => ({ default: m.MonitorAudit })));
const Stub_3_1_9 = dynamic(() => import(
  '@/components/Pages/module3/alertMonitor/MonitorReport'
).then(m => ({ default: m.MonitorReport })));
// --- 模块 3: menu-3-2 ---
const Stub_3_2_1 = dynamic(() => import(
  '@/components/Pages/module3/lateralMovement/LateralMovementView'
).then(m => ({ default: m.LateralMovementView })));
const Stub_3_2_2 = dynamic(() => import(
  '@/components/Pages/module3/lateralMovement/MultiSourceIntegration'
).then(m => ({ default: m.MultiSourceIntegration })));
const Stub_3_2_3 = dynamic(() => import(
  '@/components/Pages/module3/lateralMovement/BehaviorIdentification'
).then(m => ({ default: m.BehaviorIdentification })));
const Stub_3_2_4 = dynamic(() => import(
  '@/components/Pages/module3/lateralMovement/RealtimeAlertPush'
).then(m => ({ default: m.RealtimeAlertPush })));
const Stub_3_2_5 = dynamic(() => import(
  '@/components/Pages/module3/lateralMovement/AttackPathVisualization'
).then(m => ({ default: m.AttackPathVisualization })));
const Stub_3_2_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-2-6" {...props} /> })));
const Stub_3_2_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-2-7" {...props} /> })));
const Stub_3_2_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-2-8" {...props} /> })));
const Stub_3_2_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-2-9" {...props} /> })));
// --- 模块 3: menu-3-3 ---
const Stub_3_3_1 = dynamic(() => import(
  '@/components/Pages/module3/anomalyBehavior/AnomalyBehaviorView'
).then(m => ({ default: m.AnomalyBehaviorView })));
const Stub_3_3_2 = dynamic(() => import(
  '@/components/Pages/module3/anomalyBehavior/UserProfileBuilder'
).then(m => ({ default: m.UserProfileBuilder })));
const Stub_3_3_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-3-3" {...props} /> })));
const Stub_3_3_4 = dynamic(() => import(
  '@/components/Pages/module3/anomalyBehavior/AutoAnomalyDetection'
).then(m => ({ default: m.AutoAnomalyDetection })));
const Stub_3_3_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-3-5" {...props} /> })));
const Stub_3_3_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-3-6" {...props} /> })));
const Stub_3_3_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-3-7" {...props} /> })));
const Stub_3_3_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-3-8" {...props} /> })));
// --- 模块 3: menu-3-4 ---
const Stub_3_4_1 = dynamic(() => import(
  '@/components/Pages/module3/internetProtection/InternetProtectionView'
).then(m => ({ default: m.InternetProtectionView })));
const Stub_3_4_2 = dynamic(() => import(
  '@/components/Pages/module3/internetProtection/BoundaryInfoIntegration'
).then(m => ({ default: m.BoundaryInfoIntegration })));
const Stub_3_4_3 = dynamic(() => import(
  '@/components/Pages/module3/internetProtection/AttackIntentPrediction'
).then(m => ({ default: m.AttackIntentPrediction })));
const Stub_3_4_4 = dynamic(() => import(
  '@/components/Pages/module3/internetProtection/InternetProtectionStatus'
).then(m => ({ default: m.InternetProtectionStatus })));
const Stub_3_4_5 = dynamic(() => import(
  '@/components/Pages/module3/internetProtection/InternetProtectionHistory'
).then(m => ({ default: m.InternetProtectionHistory })));
const Stub_3_4_6 = dynamic(() => import(
  '@/components/Pages/module3/internetProtection/InternetProtectionAudit'
).then(m => ({ default: m.InternetProtectionAudit })));
const Stub_3_4_7 = dynamic(() => import(
  '@/components/Pages/module3/internetProtection/InternetProtectionReport'
).then(m => ({ default: m.InternetProtectionReport })));
// --- 模块 3: menu-3-5 ---
const Stub_3_5_1 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/AlertDecisionView'
).then(m => ({ default: m.AlertDecisionView })));
const Stub_3_5_2 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/MultiSourceAutoIntegration'
).then(m => ({ default: m.MultiSourceAutoIntegration })));
const Stub_3_5_3 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/AlertFastScreening'
).then(m => ({ default: m.AlertFastScreening })));
const Stub_3_5_4 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/AutoDecisionAnalysis'
).then(m => ({ default: m.AutoDecisionAnalysis })));
const Stub_3_5_5 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/AlertDecisionStatus'
).then(m => ({ default: m.AlertDecisionStatus })));
const Stub_3_5_6 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/AlertDecisionHistory'
).then(m => ({ default: m.AlertDecisionHistory })));
const Stub_3_5_7 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/AlertDecisionAudit'
).then(m => ({ default: m.AlertDecisionAudit })));
const Stub_3_5_8 = dynamic(() => import(
  '@/components/Pages/module3/alertDecision/AlertDecisionReport'
).then(m => ({ default: m.AlertDecisionReport })));
// --- 模块 3: menu-3-6 ---
const Stub_3_6_1 = dynamic(() => import(
  '@/components/Pages/module3/sampleAnalysis/SampleJudgmentView'
).then(m => ({ default: m.SampleJudgmentView })));
const Stub_3_6_2 = dynamic(() => import(
  '@/components/Pages/module3/sampleAnalysis/SampleJudgmentOrchestration'
).then(m => ({ default: m.SampleJudgmentOrchestration })));
const Stub_3_6_3 = dynamic(() => import(
  '@/components/Pages/module3/sampleAnalysis/SampleJudgmentResult'
).then(m => ({ default: m.SampleJudgmentResult })));
const Stub_3_6_4 = dynamic(() => import(
  '@/components/Pages/module3/sampleAnalysis/SampleJudgmentStatus'
).then(m => ({ default: m.SampleJudgmentStatus })));
const Stub_3_6_5 = dynamic(() => import(
  '@/components/Pages/module3/sampleAnalysis/SampleJudgmentHistory'
).then(m => ({ default: m.SampleJudgmentHistory })));
const Stub_3_6_6 = dynamic(() => import(
  '@/components/Pages/module3/sampleAnalysis/SampleJudgmentAudit'
).then(m => ({ default: m.SampleJudgmentAudit })));
const Stub_3_6_7 = dynamic(() => import(
  '@/components/Pages/module3/sampleAnalysis/SampleJudgmentReport'
).then(m => ({ default: m.SampleJudgmentReport })));
const Stub_3_6_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-6-8" {...props} /> })));
// --- 模块 3: menu-3-7 ---
const Stub_3_7_1 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/TraceAnalysisView'
).then(m => ({ default: m.TraceAnalysisView })));
const Stub_3_7_2 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/AttackBehaviorAnalysis'
).then(m => ({ default: m.AttackBehaviorAnalysis })));
const Stub_3_7_3 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/TraceToolAutoInvocation'
).then(m => ({ default: m.TraceToolAutoInvocation })));
const Stub_3_7_4 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/TraceResultVisualization'
).then(m => ({ default: m.TraceResultVisualization })));
const Stub_3_7_5 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/TraceAnalysisStatus'
).then(m => ({ default: m.TraceAnalysisStatus })));
const Stub_3_7_6 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/TraceAnalysisHistory'
).then(m => ({ default: m.TraceAnalysisHistory })));
const Stub_3_7_7 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/TraceAnalysisAudit'
).then(m => ({ default: m.TraceAnalysisAudit })));
const Stub_3_7_8 = dynamic(() => import(
  '@/components/Pages/module3/traceAnalysis/TraceAnalysisReport'
).then(m => ({ default: m.TraceAnalysisReport })));
// --- 模块 3: menu-3-8 ---
const Stub_3_8_1 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkView'
).then(m => ({ default: m.ElinkView })));
const Stub_3_8_2 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkConfig'
).then(m => ({ default: m.ElinkConfig })));
const Stub_3_8_3 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkInfoCollaboration'
).then(m => ({ default: m.ElinkInfoCollaboration })));
const Stub_3_8_4 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkAlertSend'
).then(m => ({ default: m.ElinkAlertSend })));
const Stub_3_8_5 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkStatus'
).then(m => ({ default: m.ElinkStatus })));
const Stub_3_8_6 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkHistory'
).then(m => ({ default: m.ElinkHistory })));
const Stub_3_8_7 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkAudit'
).then(m => ({ default: m.ElinkAudit })));
const Stub_3_8_8 = dynamic(() => import(
  '@/components/Pages/module3/elink/ElinkReport'
).then(m => ({ default: m.ElinkReport })));
// --- 模块 3: menu-3-9 ---
const Stub_3_9_1 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/SecurityDisposalView'
).then(m => ({ default: m.SecurityDisposalView })));
const Stub_3_9_2 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/AutoOperationHierarchy'
).then(m => ({ default: m.AutoOperationHierarchy })));
const Stub_3_9_3 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/PreAuthorizedEmergencyExec'
).then(m => ({ default: m.PreAuthorizedEmergencyExec })));
const Stub_3_9_4 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/SensitiveOperationApproval'
).then(m => ({ default: m.SensitiveOperationApproval })));
const Stub_3_9_5 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/DisposalProcessAudit'
).then(m => ({ default: m.DisposalProcessAudit })));
const Stub_3_9_6 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/DisposalStatusMonitor'
).then(m => ({ default: m.DisposalStatusMonitor })));
const Stub_3_9_7 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/DisposalHistory'
).then(m => ({ default: m.DisposalHistory })));
const Stub_3_9_8 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/DisposalAudit'
).then(m => ({ default: m.DisposalAudit })));
const Stub_3_9_9 = dynamic(() => import(
  '@/components/Pages/module3/securityDisposal/DisposalReport'
).then(m => ({ default: m.DisposalReport })));
// --- 模块 3: menu-3-10 ---
const Stub_3_10_1 = dynamic(() => import(
  '@/components/Pages/module3/securityDashboard/SecurityDashboardView'
).then(m => ({ default: m.SecurityDashboardView })));
const Stub_3_10_2 = dynamic(() => import(
  '@/components/Pages/module3/securityDashboard/RealTimeAlertMonitor'
).then(m => ({ default: m.RealTimeAlertMonitor })));
const Stub_3_10_3 = dynamic(() => import(
  '@/components/Pages/module3/securityDashboard/ThreatSituationDashboard'
).then(m => ({ default: m.ThreatSituationDashboard })));
const Stub_3_10_4 = dynamic(() => import(
  '@/components/Pages/module3/securityDashboard/AssetStatusDashboard'
).then(m => ({ default: m.AssetStatusDashboard })));
const Stub_3_10_5 = dynamic(() => import(
  '@/components/Pages/module3/securityDashboard/SecurityEventOverview'
).then(m => ({ default: m.SecurityEventOverview })));
const Stub_3_10_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-10-6" {...props} /> })));
const Stub_3_10_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-10-7" {...props} /> })));
const Stub_3_10_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-10-8" {...props} /> })));
// --- 模块 3: menu-3-11 ---
const Stub_3_11_1 = dynamic(() => import(
  '@/components/Pages/module3/assetManagement/AssetManagementView'
).then(m => ({ default: m.AssetManagementView })));
const Stub_3_11_2 = dynamic(() => import(
  '@/components/Pages/module3/assetManagement/AssetClassification'
).then(m => ({ default: m.AssetClassification })));
const Stub_3_11_3 = dynamic(() => import(
  '@/components/Pages/module3/assetManagement/AssetRiskAssessment'
).then(m => ({ default: m.AssetRiskAssessment })));
const Stub_3_11_4 = dynamic(() => import(
  '@/components/Pages/module3/assetManagement/AssetChangeHistory'
).then(m => ({ default: m.AssetChangeHistory })));
const Stub_3_11_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-11-5" {...props} /> })));
const Stub_3_11_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-11-6" {...props} /> })));
const Stub_3_11_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-11-7" {...props} /> })));
const Stub_3_11_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-11-8" {...props} /> })));
// --- 模块 3: menu-3-12 ---
const Stub_3_12_1 = dynamic(() => import(
  '@/components/Pages/module3/policyManagement/SecurityPolicyView'
).then(m => ({ default: m.SecurityPolicyView })));
const Stub_3_12_2 = dynamic(() => import(
  '@/components/Pages/module3/policyManagement/PolicyConfiguration'
).then(m => ({ default: m.PolicyConfiguration })));
const Stub_3_12_3 = dynamic(() => import(
  '@/components/Pages/module3/policyManagement/PolicyAuditLog'
).then(m => ({ default: m.PolicyAuditLog })));
const Stub_3_12_4 = dynamic(() => import(
  '@/components/Pages/module3/policyManagement/PolicyCompliance'
).then(m => ({ default: m.PolicyCompliance })));
const Stub_3_12_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-12-5" {...props} /> })));
const Stub_3_12_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-12-6" {...props} /> })));
const Stub_3_12_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-12-7" {...props} /> })));
const Stub_3_12_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-12-8" {...props} /> })));
// --- 模块 3: menu-3-13 ---
const Stub_3_13_1 = dynamic(() => import(
  '@/components/Pages/module3/systemSettings/SystemSettingsView'
).then(m => ({ default: m.SystemSettingsView })));
const Stub_3_13_2 = dynamic(() => import(
  '@/components/Pages/module3/systemSettings/UserManagement'
).then(m => ({ default: m.UserManagement })));
const Stub_3_13_3 = dynamic(() => import(
  '@/components/Pages/module3/systemSettings/RoleManagement'
).then(m => ({ default: m.RoleManagement })));
const Stub_3_13_4 = dynamic(() => import(
  '@/components/Pages/module3/systemSettings/SystemLog'
).then(m => ({ default: m.SystemLog })));
const Stub_3_13_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-13-5" {...props} /> })));
const Stub_3_13_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-13-6" {...props} /> })));
const Stub_3_13_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-13-7" {...props} /> })));
const Stub_3_13_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-13-8" {...props} /> })));
// --- 模块 3: menu-3-14 ---
const Stub_3_14_1 = dynamic(() => import(
  '@/components/Pages/module3/dataAsset/DataAssetManagementView'
).then(m => ({ default: m.DataAssetManagementView })));
const Stub_3_14_2 = dynamic(() => import(
  '@/components/Pages/module3/dataAsset/DataClassification'
).then(m => ({ default: m.DataClassification })));
const Stub_3_14_3 = dynamic(() => import(
  '@/components/Pages/module3/dataAsset/DataAccessControl'
).then(m => ({ default: m.DataAccessControl })));
const Stub_3_14_4 = dynamic(() => import(
  '@/components/Pages/module3/dataAsset/DataBackupManagement'
).then(m => ({ default: m.DataBackupManagement })));
const Stub_3_14_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-14-5" {...props} /> })));
const Stub_3_14_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-14-6" {...props} /> })));
const Stub_3_14_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-14-7" {...props} /> })));
const Stub_3_14_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-14-8" {...props} /> })));
// --- 模块 3: menu-3-15 ---
const Stub_3_15_1 = dynamic(() => import(
  '@/components/Pages/module3/securityMetrics/SecurityMetricsDashboard'
).then(m => ({ default: m.SecurityMetricsDashboard })));
const Stub_3_15_2 = dynamic(() => import(
  '@/components/Pages/module3/securityMetrics/MetricsReport'
).then(m => ({ default: m.MetricsReport })));
const Stub_3_15_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-15-3" {...props} /> })));
const Stub_3_15_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-15-4" {...props} /> })));
const Stub_3_15_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-15-5" {...props} /> })));
const Stub_3_15_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-15-6" {...props} /> })));
const Stub_3_15_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-15-7" {...props} /> })));
const Stub_3_15_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-15-8" {...props} /> })));
// --- 模块 3: menu-3-16 ---
const Stub_3_16_1 = dynamic(() => import(
  '@/components/Pages/module3/systemMonitor/SystemMonitorView'
).then(m => ({ default: m.SystemMonitorView })));
const Stub_3_16_2 = dynamic(() => import(
  '@/components/Pages/module3/systemMonitor/ResourceMonitor'
).then(m => ({ default: m.ResourceMonitor })));
const Stub_3_16_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-16-3" {...props} /> })));
const Stub_3_16_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-16-4" {...props} /> })));
const Stub_3_16_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-16-5" {...props} /> })));
const Stub_3_16_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-16-6" {...props} /> })));
const Stub_3_16_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-16-7" {...props} /> })));
const Stub_3_16_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-3-16-8" {...props} /> })));
// --- 模块 5: menu-5-1 ---
const Stub_5_1_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-1-1" {...props} /> })));
const Stub_5_1_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-1-2" {...props} /> })));
const Stub_5_1_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-1-3" {...props} /> })));
// --- 模块 5: menu-5-2 ---
const Stub_5_2_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-2-1" {...props} /> })));
const Stub_5_2_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-2-2" {...props} /> })));
// --- 模块 5: menu-5-3 ---
const Stub_5_3_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-3-1" {...props} /> })));
const Stub_5_3_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-3-2" {...props} /> })));
const Stub_5_3_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-3-3" {...props} /> })));
const Stub_5_3_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-3-4" {...props} /> })));
const Stub_5_3_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-3-5" {...props} /> })));
// --- 模块 5: menu-5-4 ---
const Stub_5_4_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-4-1" {...props} /> })));
const Stub_5_4_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-4-2" {...props} /> })));
const Stub_5_4_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-4-3" {...props} /> })));
const Stub_5_4_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-4-4" {...props} /> })));
const Stub_5_4_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-4-5" {...props} /> })));
// --- 模块 5: menu-5-5 ---
const Stub_5_5_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-5-1" {...props} /> })));
const Stub_5_5_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-5-2" {...props} /> })));
const Stub_5_5_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-5-3" {...props} /> })));
const Stub_5_5_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-5-4" {...props} /> })));
// --- 模块 5: menu-5-6 ---
const Stub_5_6_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-6-1" {...props} /> })));
const Stub_5_6_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-6-2" {...props} /> })));
const Stub_5_6_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-6-3" {...props} /> })));
const Stub_5_6_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-6-4" {...props} /> })));
const Stub_5_6_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-6-5" {...props} /> })));
// --- 模块 5: menu-5-7 ---
const Stub_5_7_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-7-1" {...props} /> })));
const Stub_5_7_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-7-2" {...props} /> })));
const Stub_5_7_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-7-3" {...props} /> })));
const Stub_5_7_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-7-4" {...props} /> })));
const Stub_5_7_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-7-5" {...props} /> })));
const Stub_5_7_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-7-6" {...props} /> })));
// --- 模块 5: menu-5-8 ---
const Stub_5_8_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-8-1" {...props} /> })));
const Stub_5_8_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-8-2" {...props} /> })));
const Stub_5_8_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-8-3" {...props} /> })));
const Stub_5_8_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-8-4" {...props} /> })));
const Stub_5_8_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-8-5" {...props} /> })));
const Stub_5_8_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-8-6" {...props} /> })));
// --- 模块 5: menu-5-9 ---
const Stub_5_9_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-9-1" {...props} /> })));
const Stub_5_9_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-9-2" {...props} /> })));
const Stub_5_9_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-9-3" {...props} /> })));
const Stub_5_9_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-5-9-4" {...props} /> })));
// --- 模块 6: menu-6-1 ---
const Stub_6_1_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-1-1" {...props} /> })));
const Stub_6_1_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-1-2" {...props} /> })));
const Stub_6_1_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-1-3" {...props} /> })));
const Stub_6_1_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-1-4" {...props} /> })));
const Stub_6_1_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-1-5" {...props} /> })));
// --- 模块 6: menu-6-2 ---
const Stub_6_2_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-2-1" {...props} /> })));
const Stub_6_2_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-2-2" {...props} /> })));
const Stub_6_2_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-2-3" {...props} /> })));
const Stub_6_2_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-2-4" {...props} /> })));
const Stub_6_2_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-2-5" {...props} /> })));
// --- 模块 6: menu-6-3 ---
const Stub_6_3_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-3-1" {...props} /> })));
const Stub_6_3_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-3-2" {...props} /> })));
const Stub_6_3_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-3-3" {...props} /> })));
const Stub_6_3_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-3-4" {...props} /> })));
// --- 模块 6: menu-6-4 ---
const Stub_6_4_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-4-1" {...props} /> })));
const Stub_6_4_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-4-2" {...props} /> })));
const Stub_6_4_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-4-3" {...props} /> })));
const Stub_6_4_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-4-4" {...props} /> })));
// --- 模块 6: menu-6-5 ---
const Stub_6_5_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-5-1" {...props} /> })));
const Stub_6_5_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-5-2" {...props} /> })));
// --- 模块 6: menu-6-6 ---
const Stub_6_6_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-6-1" {...props} /> })));
const Stub_6_6_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-6-2" {...props} /> })));
const Stub_6_6_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-6-3" {...props} /> })));
// --- 模块 6: menu-6-7 ---
const Stub_6_7_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-7-1" {...props} /> })));
const Stub_6_7_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-7-2" {...props} /> })));
const Stub_6_7_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-7-3" {...props} /> })));
// --- 模块 6: menu-6-8 ---
const Stub_6_8_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-8-1" {...props} /> })));
// --- 模块 6: menu-6-9 ---
const Stub_6_9_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-9-1" {...props} /> })));
const Stub_6_9_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-9-2" {...props} /> })));
const Stub_6_9_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-9-3" {...props} /> })));
const Stub_6_9_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-9-4" {...props} /> })));
const Stub_6_9_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-9-5" {...props} /> })));
// --- 模块 6: menu-6-10 ---
const Stub_6_10_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-10-1" {...props} /> })));
const Stub_6_10_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-10-2" {...props} /> })));
const Stub_6_10_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-10-3" {...props} /> })));
const Stub_6_10_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-10-4" {...props} /> })));
const Stub_6_10_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-10-5" {...props} /> })));
// --- 模块 6: menu-6-11 ---
const Stub_6_11_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-11-1" {...props} /> })));
const Stub_6_11_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-11-2" {...props} /> })));
// --- 模块 6: menu-6-12 ---
const Stub_6_12_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-12-1" {...props} /> })));
const Stub_6_12_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-12-2" {...props} /> })));
const Stub_6_12_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-12-3" {...props} /> })));
// --- 模块 6: menu-6-13 ---
const Stub_6_13_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-13-1" {...props} /> })));
const Stub_6_13_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-6-13-2" {...props} /> })));
// --- 模块 4: menu-4-1 ---
const Stub_4_1_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-1" {...props} /> })));
const Stub_4_1_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-2" {...props} /> })));
const Stub_4_1_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-3" {...props} /> })));
const Stub_4_1_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-4" {...props} /> })));
const Stub_4_1_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-5" {...props} /> })));
const Stub_4_1_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-6" {...props} /> })));
const Stub_4_1_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-7" {...props} /> })));
const Stub_4_1_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-8" {...props} /> })));
const Stub_4_1_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-1-9" {...props} /> })));
// --- 模块 4: menu-4-2 ---
const Stub_4_2_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-1" {...props} /> })));
const Stub_4_2_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-2" {...props} /> })));
const Stub_4_2_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-3" {...props} /> })));
const Stub_4_2_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-4" {...props} /> })));
const Stub_4_2_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-5" {...props} /> })));
const Stub_4_2_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-6" {...props} /> })));
const Stub_4_2_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-7" {...props} /> })));
const Stub_4_2_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-2-8" {...props} /> })));
// --- 模块 4: menu-4-3 ---
const Stub_4_3_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-3-1" {...props} /> })));
const Stub_4_3_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-3-2" {...props} /> })));
const Stub_4_3_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-3-3" {...props} /> })));
const Stub_4_3_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-3-4" {...props} /> })));
const Stub_4_3_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-3-5" {...props} /> })));
const Stub_4_3_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-3-6" {...props} /> })));
const Stub_4_3_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-3-7" {...props} /> })));
// --- 模块 4: menu-4-4 ---
const Stub_4_4_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-1" {...props} /> })));
const Stub_4_4_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-2" {...props} /> })));
const Stub_4_4_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-3" {...props} /> })));
const Stub_4_4_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-4" {...props} /> })));
const Stub_4_4_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-5" {...props} /> })));
const Stub_4_4_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-6" {...props} /> })));
const Stub_4_4_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-7" {...props} /> })));
const Stub_4_4_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-8" {...props} /> })));
const Stub_4_4_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-4-9" {...props} /> })));
// --- 模块 4: menu-4-5 ---
const Stub_4_5_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-1" {...props} /> })));
const Stub_4_5_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-2" {...props} /> })));
const Stub_4_5_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-3" {...props} /> })));
const Stub_4_5_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-4" {...props} /> })));
const Stub_4_5_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-5" {...props} /> })));
const Stub_4_5_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-6" {...props} /> })));
const Stub_4_5_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-7" {...props} /> })));
const Stub_4_5_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-8" {...props} /> })));
const Stub_4_5_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-9" {...props} /> })));
const Stub_4_5_10 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-10" {...props} /> })));
const Stub_4_5_11 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-5-11" {...props} /> })));
// --- 模块 4: menu-4-7 ---
const Stub_4_7_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-1" {...props} /> })));
const Stub_4_7_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-2" {...props} /> })));
const Stub_4_7_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-3" {...props} /> })));
const Stub_4_7_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-4" {...props} /> })));
const Stub_4_7_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-5" {...props} /> })));
const Stub_4_7_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-6" {...props} /> })));
const Stub_4_7_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-7" {...props} /> })));
const Stub_4_7_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-8" {...props} /> })));
const Stub_4_7_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-9" {...props} /> })));
const Stub_4_7_10 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-7-10" {...props} /> })));
// --- 模块 4: menu-4-8 ---
const Stub_4_8_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-1" {...props} /> })));
const Stub_4_8_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-2" {...props} /> })));
const Stub_4_8_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-3" {...props} /> })));
const Stub_4_8_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-4" {...props} /> })));
const Stub_4_8_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-5" {...props} /> })));
const Stub_4_8_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-6" {...props} /> })));
const Stub_4_8_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-7" {...props} /> })));
const Stub_4_8_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-8" {...props} /> })));
const Stub_4_8_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-8-9" {...props} /> })));
// --- 模块 4: menu-4-9 ---
const Stub_4_9_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-1" {...props} /> })));
const Stub_4_9_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-2" {...props} /> })));
const Stub_4_9_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-3" {...props} /> })));
const Stub_4_9_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-4" {...props} /> })));
const Stub_4_9_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-5" {...props} /> })));
const Stub_4_9_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-6" {...props} /> })));
const Stub_4_9_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-7" {...props} /> })));
const Stub_4_9_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-8" {...props} /> })));
const Stub_4_9_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-9-9" {...props} /> })));
// --- 模块 4: menu-4-10 ---
const Stub_4_10_1 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-1" {...props} /> })));
const Stub_4_10_2 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-2" {...props} /> })));
const Stub_4_10_3 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-3" {...props} /> })));
const Stub_4_10_4 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-4" {...props} /> })));
const Stub_4_10_5 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-5" {...props} /> })));
const Stub_4_10_6 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-6" {...props} /> })));
const Stub_4_10_7 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-7" {...props} /> })));
const Stub_4_10_8 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-8" {...props} /> })));
const Stub_4_10_9 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-9" {...props} /> })));
const Stub_4_10_10 = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => <m.GenericStub menuId="menu-4-10-10" {...props} /> })));

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

// 第14组：备份恢复演练
const BackupDrillView = dynamic(() => import(
  '@/components/Pages/module2/backupDrill/BackupDrillView'
).then(m => ({ default: m.BackupDrillView })));

const DrillScenarioEdit = dynamic(() => import(
  '@/components/Pages/module2/scheduledTask/DrillScenarioEdit'
).then(m => ({ default: m.DrillScenarioEdit })));

const DrillStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/backupDrill/DrillStatusMonitor'
).then(m => ({ default: m.DrillStatusMonitor })));

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

// 第15组：系统启停
const SystemStartStopView = dynamic(() => import(
  '@/components/Pages/module2/systemStartStop/SystemStartStopView'
).then(m => ({ default: m.SystemStartStopView })));

const StartStopStrategyConfig = dynamic(() => import(
  '@/components/Pages/module2/systemStartStop/StartStopStrategyConfig'
).then(m => ({ default: m.StartStopStrategyConfig })));

const StartStopExec = dynamic(() => import(
  '@/components/Pages/module2/systemStartStop/StartStopExec'
).then(m => ({ default: m.StartStopExec })));

const StartStopStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/operation/OperationReport'
).then(m => ({ default: m.OperationReport })));

const StartStopAudit = dynamic(() => import(
  '@/components/Pages/module2/operation/StartStopAudit'
).then(m => ({ default: m.StartStopAudit })));

const StartStopTaskReport = dynamic(() => import(
  '@/components/Pages/module2/operation/StartStopTaskReport'
).then(m => ({ default: m.StartStopTaskReport })));

// 第16组：系统配置调优
const SystemTuningView = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/FaultHandleView'
).then(m => ({ default: m.FaultHandleView })));

const TuningStrategyConfig = dynamic(() => import(
  '@/components/Pages/module2/faultHandle/FaultLocation'
).then(m => ({ default: m.FaultLocation })));

const TuningExec = dynamic(() => import(
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

// 第17组：权限分配任务
const PermAssignView = dynamic(() => import(
  '@/components/Pages/module2/securityScan/SecurityScanView'
).then(m => ({ default: m.SecurityScanView })));

const PermAssignStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/securityScan/ScanConfig'
).then(m => ({ default: m.ScanConfig })));

const PermAssignValidate = dynamic(() => import(
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
const VulnHardeningView = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnHardeningView'
).then(m => ({ default: m.VulnHardeningView })));

const VulnDbSync = dynamic(() => import(
  '@/components/Pages/module2/vulnHardening/VulnDbSync'
).then(m => ({ default: m.VulnDbSync })));

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

// 第22组：安全客服
const HelpdeskView = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/SecurityHardeningView'
).then(m => ({ default: m.SecurityHardeningView })));

const QaAnalysis = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/AccountHardening'
).then(m => ({ default: m.AccountHardening })));

const QaAnswer = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/AccessControlHardening'
).then(m => ({ default: m.AccessControlHardening })));

const ProcessGuide = dynamic(() => import(
  '@/components/Pages/module2/securityHardening/SecurityHardeningReport'
).then(m => ({ default: m.SecurityHardeningReport })));

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

// 第23组：准入工单
const AccessWorkOrderView = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/VulnerabilityView'
).then(m => ({ default: m.VulnerabilityView })));

const AccessAuthConfig = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/VulnerabilityScan'
).then(m => ({ default: m.VulnerabilityScan })));

const AccessDisableTask = dynamic(() => import(
  '@/components/Pages/module2/vulnerability/VulnerabilityReport'
).then(m => ({ default: m.VulnerabilityReport })));

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

// 第26组：网络故障诊断
const NetworkDiagView = dynamic(() => import(
  '@/components/Pages/module2/networkDiag/NetworkDiagView'
).then(m => ({ default: m.NetworkDiagView })));

const LinkAnomalyDetect = dynamic(() => import(
  '@/components/Pages/module2/networkDiag/LinkAnomalyDetect'
).then(m => ({ default: m.LinkAnomalyDetect })));

const DeviceFaultAnalysis = dynamic(() => import(
  '@/components/Pages/module2/networkDiag/DeviceFaultAnalysis'
).then(m => ({ default: m.DeviceFaultAnalysis })));

const NetDiagStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/networkDiag/NetDiagStatusMonitor'
).then(m => ({ default: m.NetDiagStatusMonitor })));

const NetDiagHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/networkDiag/NetDiagHistoryQuery'
).then(m => ({ default: m.NetDiagHistoryQuery })));

const NetDiagAudit = dynamic(() => import(
  '@/components/Pages/module2/networkDiag/NetDiagAudit'
).then(m => ({ default: m.NetDiagAudit })));

const NetDiagTaskReport = dynamic(() => import(
  '@/components/Pages/module2/networkDiag/NetDiagTaskReport'
).then(m => ({ default: m.NetDiagTaskReport })));

// 第26组：诊断视图
const DiagnosticView = dynamic(() => import(
  '@/components/Pages/module2/diagnostic/DiagnosticView'
).then(m => ({ default: m.DiagnosticView })));

// 第27组：系统故障诊断
const SystemDiagView = dynamic(() => import(
  '@/components/Pages/module2/systemDiag/SystemDiagView'
).then(m => ({ default: m.SystemDiagView })));

const SystemFaultDiag = dynamic(() => import(
  '@/components/Pages/module2/systemDiag/SystemFaultDiag'
).then(m => ({ default: m.SystemFaultDiag })));

const SysDiagStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/systemDiag/SysDiagStatusMonitor'
).then(m => ({ default: m.SysDiagStatusMonitor })));

const SysDiagHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/systemDiag/SysDiagHistoryQuery'
).then(m => ({ default: m.SysDiagHistoryQuery })));

const SysDiagAudit = dynamic(() => import(
  '@/components/Pages/module2/systemDiag/SysDiagAudit'
).then(m => ({ default: m.SysDiagAudit })));

const SysDiagTaskReport = dynamic(() => import(
  '@/components/Pages/module2/systemDiag/SysDiagTaskReport'
).then(m => ({ default: m.SysDiagTaskReport })));

// 第28组：性能诊断
const PerfDiagView = dynamic(() => import(
  '@/components/Pages/module2/perfDiag/PerfDiagView'
).then(m => ({ default: m.PerfDiagView })));

const PerfMonitor = dynamic(() => import(
  '@/components/Pages/module2/perfDiag/PerfMonitor'
).then(m => ({ default: m.PerfMonitor })));

const PerfAnalysis = dynamic(() => import(
  '@/components/Pages/module2/perfDiag/PerfAnalysis'
).then(m => ({ default: m.PerfAnalysis })));

const PerfDiagStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/perfDiag/PerfDiagStatusMonitor'
).then(m => ({ default: m.PerfDiagStatusMonitor })));

const PerfDiagHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/perfDiag/PerfDiagHistoryQuery'
).then(m => ({ default: m.PerfDiagHistoryQuery })));

const PerfDiagAudit = dynamic(() => import(
  '@/components/Pages/module2/perfDiag/PerfDiagAudit'
).then(m => ({ default: m.PerfDiagAudit })));

const PerfDiagTaskReport = dynamic(() => import(
  '@/components/Pages/module2/perfDiag/PerfDiagTaskReport'
).then(m => ({ default: m.PerfDiagTaskReport })));

// 第29组：安全阻断诊断
const BlockDiagView = dynamic(() => import(
  '@/components/Pages/module2/blockDiag/BlockDiagView'
).then(m => ({ default: m.BlockDiagView })));

const BlockDiagAnalysis = dynamic(() => import(
  '@/components/Pages/module2/blockDiag/BlockDiagAnalysis'
).then(m => ({ default: m.BlockDiagAnalysis })));

const BlockDiagStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/blockDiag/BlockDiagStatusMonitor'
).then(m => ({ default: m.BlockDiagStatusMonitor })));

const BlockDiagHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/blockDiag/BlockDiagHistoryQuery'
).then(m => ({ default: m.BlockDiagHistoryQuery })));

const BlockDiagAudit = dynamic(() => import(
  '@/components/Pages/module2/blockDiag/BlockDiagAudit'
).then(m => ({ default: m.BlockDiagAudit })));

const BlockDiagTaskReport = dynamic(() => import(
  '@/components/Pages/module2/blockDiag/BlockDiagTaskReport'
).then(m => ({ default: m.BlockDiagTaskReport })));

// 第30组：综合故障诊断
const CompDiagView = dynamic(() => import(
  '@/components/Pages/module2/comprehensiveDiag/CompDiagView'
).then(m => ({ default: m.CompDiagView })));

const CompFaultDiag = dynamic(() => import(
  '@/components/Pages/module2/comprehensiveDiag/CompFaultDiag'
).then(m => ({ default: m.CompFaultDiag })));

const CompDiagStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/comprehensiveDiag/CompDiagStatusMonitor'
).then(m => ({ default: m.CompDiagStatusMonitor })));

const CompDiagHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/comprehensiveDiag/CompDiagHistoryQuery'
).then(m => ({ default: m.CompDiagHistoryQuery })));

const CompDiagAudit = dynamic(() => import(
  '@/components/Pages/module2/comprehensiveDiag/CompDiagAudit'
).then(m => ({ default: m.CompDiagAudit })));

const CompDiagTaskReport = dynamic(() => import(
  '@/components/Pages/module2/comprehensiveDiag/CompDiagTaskReport'
).then(m => ({ default: m.CompDiagTaskReport })));

// 第31组：作业审核
const JobAuditView = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/JobAuditView'
).then(m => ({ default: m.JobAuditView })));

const AutoJobAudit = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/AutoJobAudit'
).then(m => ({ default: m.AutoJobAudit })));

const QualComplianceCheck = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/QualComplianceCheck'
).then(m => ({ default: m.QualComplianceCheck })));

const JobRiskLevelAssess = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/JobRiskLevelAssess'
).then(m => ({ default: m.JobRiskLevelAssess })));

const JobAuditStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/JobAuditStatusMonitor'
).then(m => ({ default: m.JobAuditStatusMonitor })));

const JobAuditHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/JobAuditHistoryQuery'
).then(m => ({ default: m.JobAuditHistoryQuery })));

const JobAuditAudit = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/JobAuditAudit'
).then(m => ({ default: m.JobAuditAudit })));

const JobAuditTaskReport = dynamic(() => import(
  '@/components/Pages/module2/jobAudit/JobAuditTaskReport'
).then(m => ({ default: m.JobAuditTaskReport })));

// 第32组：作业方案审核
const JobPlanAuditView = dynamic(() => import(
  '@/components/Pages/module2/jobPlanAudit/JobPlanAuditView'
).then(m => ({ default: m.JobPlanAuditView })));

const PlanComplianceCheck = dynamic(() => import(
  '@/components/Pages/module2/jobPlanAudit/PlanComplianceCheck'
).then(m => ({ default: m.PlanComplianceCheck })));

const PlanIntegrityCheck = dynamic(() => import(
  '@/components/Pages/module2/jobPlanAudit/PlanIntegrityCheck'
).then(m => ({ default: m.PlanIntegrityCheck })));

const PlanAuditStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/jobPlanAudit/PlanAuditStatusMonitor'
).then(m => ({ default: m.PlanAuditStatusMonitor })));

const PlanAuditHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/jobPlanAudit/PlanAuditHistoryQuery'
).then(m => ({ default: m.PlanAuditHistoryQuery })));

const PlanAuditAudit = dynamic(() => import(
  '@/components/Pages/module2/jobPlanAudit/PlanAuditAudit'
).then(m => ({ default: m.PlanAuditAudit })));

const PlanAuditTaskReport = dynamic(() => import(
  '@/components/Pages/module2/jobPlanAudit/PlanAuditTaskReport'
).then(m => ({ default: m.PlanAuditTaskReport })));

// 第33组：作业问题检查
const JobIssueCheckView = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/JobIssueCheckView'
).then(m => ({ default: m.JobIssueCheckView })));

const ConfigDiffCompare = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/ConfigDiffCompare'
).then(m => ({ default: m.ConfigDiffCompare })));

const IssueAutoLocation = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/IssueAutoLocation'
).then(m => ({ default: m.IssueAutoLocation })));

const IssueSeverityGrade = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/IssueSeverityGrade'
).then(m => ({ default: m.IssueSeverityGrade })));

const IssueCheckStatusMonitor = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/IssueCheckStatusMonitor'
).then(m => ({ default: m.IssueCheckStatusMonitor })));

const IssueCheckHistoryQuery = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/IssueCheckHistoryQuery'
).then(m => ({ default: m.IssueCheckHistoryQuery })));

const IssueCheckAudit = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/IssueCheckAudit'
).then(m => ({ default: m.IssueCheckAudit })));

const IssueCheckTaskReport = dynamic(() => import(
  '@/components/Pages/module2/jobIssueCheck/IssueCheckTaskReport'
).then(m => ({ default: m.IssueCheckTaskReport })));

// 第34组：作业综合辅助
const JobAssistantView = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => (<m.GenericStub menuId="menu-2-34-1" {...props} />) })));

const JobQualityEval = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => (<m.GenericStub menuId="menu-2-34-2" {...props} />) })));

const StandardReportGen = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => (<m.GenericStub menuId="menu-2-34-3" {...props} />) })));

const JobAssistStatusMonitor = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => (<m.GenericStub menuId="menu-2-34-4" {...props} />) })));

const JobAssistHistoryQuery = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => (<m.GenericStub menuId="menu-2-34-5" {...props} />) })));

const JobAssistAudit = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => (<m.GenericStub menuId="menu-2-34-6" {...props} />) })));

const JobAssistTaskReport = dynamic(() => import(
  '@/components/Pages/_shared/GenericStub'
).then(m => ({ default: (props) => (<m.GenericStub menuId="menu-2-34-7" {...props} />) })));

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
// 模块 3：网络安全自动运营
// ──────────────────────────────────────────────（已移除）
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

// 模块 4：网络安全标准场景自动化
// ──────────────────────────────────

// 第6组：漏洞管理任务
const VulnRectifyTrack = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnRectifyTrack'
).then(m => ({ default: m.VulnRectifyTrack })));
// === 模块 5 安全大屏 5 个深度页面 ===
const RiskScoreDashboard = dynamic(() => import(
  '@/components/Pages/module5/securityDashboard/RiskScoreDashboard'
).then(m => ({ default: m.RiskScoreDashboard })));
const RealtimeThreatTrend = dynamic(() => import(
  '@/components/Pages/module5/securityDashboard/RealtimeThreatTrend'
).then(m => ({ default: m.RealtimeThreatTrend })));
const IncidentResolutionKPI = dynamic(() => import(
  '@/components/Pages/module5/securityDashboard/IncidentResolutionKPI'
).then(m => ({ default: m.IncidentResolutionKPI })));
const AssetComplianceStatus = dynamic(() => import(
  '@/components/Pages/module5/securityDashboard/AssetComplianceStatus'
).then(m => ({ default: m.AssetComplianceStatus })));
const DashboardCustomConfig = dynamic(() => import(
  '@/components/Pages/module5/securityDashboard/DashboardCustomConfig'
).then(m => ({ default: m.DashboardCustomConfig })));

// === 模块 4.6 漏洞管理全套 11 个深度页面（除 4-6-5 已实现）===
const VulnManageOverview = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnManageOverview'
).then(m => ({ default: m.VulnManageOverview })));
const VulnScannerManager = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnScannerManager'
).then(m => ({ default: m.VulnScannerManager })));
const VulnScanExecute = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnScanExecute'
).then(m => ({ default: m.VulnScanExecute })));
const VulnAnalysis = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnAnalysis'
).then(m => ({ default: m.VulnAnalysis })));
const VulnRetestClose = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnRetestClose'
).then(m => ({ default: m.VulnRetestClose })));
const VulnDatabase = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnDatabase'
).then(m => ({ default: m.VulnDatabase })));
const VulnUnfixableList = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnUnfixableList'
).then(m => ({ default: m.VulnUnfixableList })));
const VulnTaskMonitor = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnTaskMonitor'
).then(m => ({ default: m.VulnTaskMonitor })));
const V4_VulnHistoryQuery = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnHistoryQuery'
).then(m => ({ default: m.VulnHistoryQuery })));
const V4_VulnTaskAudit = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnTaskAudit'
).then(m => ({ default: m.VulnTaskAudit })));
const V4_VulnTaskReport = dynamic(() => import(
  '@/components/Pages/module4/vulnManage/VulnTaskReport'
).then(m => ({ default: m.VulnTaskReport })));

// 日报报告（补上缺失的定义）
// 基线防护报告视图（补上缺失的定义）
// 批量补上其他缺失的组件定义（占位，已移除）

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
  // 第14组：备份恢复演练
  'menu-2-14-1': BackupDrillView,
  'menu-2-14-2': DrillScenarioEdit,
  'menu-2-14-3': DrillTaskExec,
  'menu-2-14-4': DrillProcessRecord,
  'menu-2-14-5': DrillStatusMonitor,
  'menu-2-14-6': DrillReportGen,
  'menu-2-14-7': DrillKnowledgeBase,
  'menu-2-14-8': DrillTaskReport,
  // 第15组：系统启停
  'menu-2-15-1': SystemStartStopView,
  'menu-2-15-2': StartStopStrategyConfig,
  'menu-2-15-3': StartStopExec,
  'menu-2-15-4': StartStopStatusMonitor,
  'menu-2-15-5': StartStopAudit,
  'menu-2-15-6': StartStopTaskReport,
  // 第16组：系统配置调优
  'menu-2-16-1': SystemTuningView,
  'menu-2-16-2': TuningStrategyConfig,
  'menu-2-16-3': TuningExec,
  'menu-2-16-4': TuningStatusMonitor,
  'menu-2-16-5': TuningAudit,
  'menu-2-16-6': TuningTaskReport,
  // 第17组：权限分配任务
  'menu-2-17-1': PermAssignView,
  'menu-2-17-2': PermAssignStatusMonitor,
  'menu-2-17-3': PermAssignValidate,
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
  // 第21组：安全漏洞加固
  'menu-2-21-1': VulnHardeningView,
  'menu-2-21-2': VulnDbSync,
  'menu-2-21-3': VulnStrategyConfig,
  'menu-2-21-4': VulnRepairExec,
  'menu-2-21-5': VulnStatusMonitor,
  'menu-2-21-6': VulnHistoryQuery,
  'menu-2-21-7': VulnAudit,
  'menu-2-21-8': VulnTaskReport,
  'menu-2-21-9': VulnAlertNotify,
  // 第22组：安全客服
  'menu-2-22-1': HelpdeskView,
  'menu-2-22-2': QaAnalysis,
  'menu-2-22-3': QaAnswer,
  'menu-2-22-4': ProcessGuide,
  'menu-2-22-5': HelpdeskStatusMonitor,
  'menu-2-22-6': HelpdeskHistoryQuery,
  'menu-2-22-7': HelpdeskAudit,
  'menu-2-22-8': HelpdeskTaskReport,
  // 第23组：准入工单
  'menu-2-23-1': AccessWorkOrderView,
  'menu-2-23-2': AccessAuthConfig,
  'menu-2-23-3': AccessDisableTask,
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

  // ===========================================================
  // 模块 3/4/5/6 补全 296 个占位注册
  // ===========================================================
  // menu-3-1 (9 个)
  'menu-3-1-1': Stub_3_1_1,
  'menu-3-1-2': Stub_3_1_2,
  'menu-3-1-3': Stub_3_1_3,
  'menu-3-1-4': Stub_3_1_4,
  'menu-3-1-5': Stub_3_1_5,
  'menu-3-1-6': Stub_3_1_6,
  'menu-3-1-7': Stub_3_1_7,
  'menu-3-1-8': Stub_3_1_8,
  'menu-3-1-9': Stub_3_1_9,

  // menu-3-10 (8 个)
  'menu-3-10-1': Stub_3_10_1,
  'menu-3-10-2': Stub_3_10_2,
  'menu-3-10-3': Stub_3_10_3,
  'menu-3-10-4': Stub_3_10_4,
  'menu-3-10-5': Stub_3_10_5,
  'menu-3-10-6': Stub_3_10_6,
  'menu-3-10-7': Stub_3_10_7,
  'menu-3-10-8': Stub_3_10_8,

  // menu-3-11 (8 个)
  'menu-3-11-1': Stub_3_11_1,
  'menu-3-11-2': Stub_3_11_2,
  'menu-3-11-3': Stub_3_11_3,
  'menu-3-11-4': Stub_3_11_4,
  'menu-3-11-5': Stub_3_11_5,
  'menu-3-11-6': Stub_3_11_6,
  'menu-3-11-7': Stub_3_11_7,
  'menu-3-11-8': Stub_3_11_8,

  // menu-3-12 (8 个)
  'menu-3-12-1': Stub_3_12_1,
  'menu-3-12-2': Stub_3_12_2,
  'menu-3-12-3': Stub_3_12_3,
  'menu-3-12-4': Stub_3_12_4,
  'menu-3-12-5': Stub_3_12_5,
  'menu-3-12-6': Stub_3_12_6,
  'menu-3-12-7': Stub_3_12_7,
  'menu-3-12-8': Stub_3_12_8,

  // menu-3-13 (8 个)
  'menu-3-13-1': Stub_3_13_1,
  'menu-3-13-2': Stub_3_13_2,
  'menu-3-13-3': Stub_3_13_3,
  'menu-3-13-4': Stub_3_13_4,
  'menu-3-13-5': Stub_3_13_5,
  'menu-3-13-6': Stub_3_13_6,
  'menu-3-13-7': Stub_3_13_7,
  'menu-3-13-8': Stub_3_13_8,

  // menu-3-14 (8 个)
  'menu-3-14-1': Stub_3_14_1,
  'menu-3-14-2': Stub_3_14_2,
  'menu-3-14-3': Stub_3_14_3,
  'menu-3-14-4': Stub_3_14_4,
  'menu-3-14-5': Stub_3_14_5,
  'menu-3-14-6': Stub_3_14_6,
  'menu-3-14-7': Stub_3_14_7,
  'menu-3-14-8': Stub_3_14_8,

  // menu-3-15 (8 个)
  'menu-3-15-1': Stub_3_15_1,
  'menu-3-15-2': Stub_3_15_2,
  'menu-3-15-3': Stub_3_15_3,
  'menu-3-15-4': Stub_3_15_4,
  'menu-3-15-5': Stub_3_15_5,
  'menu-3-15-6': Stub_3_15_6,
  'menu-3-15-7': Stub_3_15_7,
  'menu-3-15-8': Stub_3_15_8,

  // menu-3-16 (8 个)
  'menu-3-16-1': Stub_3_16_1,
  'menu-3-16-2': Stub_3_16_2,
  'menu-3-16-3': Stub_3_16_3,
  'menu-3-16-4': Stub_3_16_4,
  'menu-3-16-5': Stub_3_16_5,
  'menu-3-16-6': Stub_3_16_6,
  'menu-3-16-7': Stub_3_16_7,
  'menu-3-16-8': Stub_3_16_8,

  // menu-3-2 (9 个)
  'menu-3-2-1': Stub_3_2_1,
  'menu-3-2-2': Stub_3_2_2,
  'menu-3-2-3': Stub_3_2_3,
  'menu-3-2-4': Stub_3_2_4,
  'menu-3-2-5': Stub_3_2_5,
  'menu-3-2-6': Stub_3_2_6,
  'menu-3-2-7': Stub_3_2_7,
  'menu-3-2-8': Stub_3_2_8,
  'menu-3-2-9': Stub_3_2_9,

  // menu-3-3 (8 个)
  'menu-3-3-1': Stub_3_3_1,
  'menu-3-3-2': Stub_3_3_2,
  'menu-3-3-3': Stub_3_3_3,
  'menu-3-3-4': Stub_3_3_4,
  'menu-3-3-5': Stub_3_3_5,
  'menu-3-3-6': Stub_3_3_6,
  'menu-3-3-7': Stub_3_3_7,
  'menu-3-3-8': Stub_3_3_8,

  // menu-3-4 (7 个)
  'menu-3-4-1': Stub_3_4_1,
  'menu-3-4-2': Stub_3_4_2,
  'menu-3-4-3': Stub_3_4_3,
  'menu-3-4-4': Stub_3_4_4,
  'menu-3-4-5': Stub_3_4_5,
  'menu-3-4-6': Stub_3_4_6,
  'menu-3-4-7': Stub_3_4_7,

  // menu-3-5 (8 个)
  'menu-3-5-1': Stub_3_5_1,
  'menu-3-5-2': Stub_3_5_2,
  'menu-3-5-3': Stub_3_5_3,
  'menu-3-5-4': Stub_3_5_4,
  'menu-3-5-5': Stub_3_5_5,
  'menu-3-5-6': Stub_3_5_6,
  'menu-3-5-7': Stub_3_5_7,
  'menu-3-5-8': Stub_3_5_8,

  // menu-3-6 (8 个)
  'menu-3-6-1': Stub_3_6_1,
  'menu-3-6-2': Stub_3_6_2,
  'menu-3-6-3': Stub_3_6_3,
  'menu-3-6-4': Stub_3_6_4,
  'menu-3-6-5': Stub_3_6_5,
  'menu-3-6-6': Stub_3_6_6,
  'menu-3-6-7': Stub_3_6_7,
  'menu-3-6-8': Stub_3_6_8,

  // menu-3-7 (8 个)
  'menu-3-7-1': Stub_3_7_1,
  'menu-3-7-2': Stub_3_7_2,
  'menu-3-7-3': Stub_3_7_3,
  'menu-3-7-4': Stub_3_7_4,
  'menu-3-7-5': Stub_3_7_5,
  'menu-3-7-6': Stub_3_7_6,
  'menu-3-7-7': Stub_3_7_7,
  'menu-3-7-8': Stub_3_7_8,

  // menu-3-8 (8 个)
  'menu-3-8-1': Stub_3_8_1,
  'menu-3-8-2': Stub_3_8_2,
  'menu-3-8-3': Stub_3_8_3,
  'menu-3-8-4': Stub_3_8_4,
  'menu-3-8-5': Stub_3_8_5,
  'menu-3-8-6': Stub_3_8_6,
  'menu-3-8-7': Stub_3_8_7,
  'menu-3-8-8': Stub_3_8_8,

  // menu-3-9 (9 个)
  'menu-3-9-1': Stub_3_9_1,
  'menu-3-9-2': Stub_3_9_2,
  'menu-3-9-3': Stub_3_9_3,
  'menu-3-9-4': Stub_3_9_4,
  'menu-3-9-5': Stub_3_9_5,
  'menu-3-9-6': Stub_3_9_6,
  'menu-3-9-7': Stub_3_9_7,
  'menu-3-9-8': Stub_3_9_8,
  'menu-3-9-9': Stub_3_9_9,

  // menu-4-6 (11 个)
  // menu-4-6 漏洞管理全套 12 个（5 已实现）
  'menu-4-6-1': VulnManageOverview,
  'menu-4-6-2': VulnScannerManager,
  'menu-4-6-3': VulnScanExecute,
  'menu-4-6-4': VulnAnalysis,
  'menu-4-6-6': VulnRetestClose,
  'menu-4-6-7': VulnDatabase,
  'menu-4-6-8': VulnUnfixableList,
  'menu-4-6-9': VulnTaskMonitor,
  'menu-4-6-10': V4_VulnHistoryQuery,
  'menu-4-6-11': V4_VulnTaskAudit,
  'menu-4-6-12': V4_VulnTaskReport,

  // menu-4-1 (9 个)
  'menu-4-1-1': Stub_4_1_1,
  'menu-4-1-2': Stub_4_1_2,
  'menu-4-1-3': Stub_4_1_3,
  'menu-4-1-4': Stub_4_1_4,
  'menu-4-1-5': Stub_4_1_5,
  'menu-4-1-6': Stub_4_1_6,
  'menu-4-1-7': Stub_4_1_7,
  'menu-4-1-8': Stub_4_1_8,
  'menu-4-1-9': Stub_4_1_9,

  // menu-4-10 (10 个)
  'menu-4-10-1': Stub_4_10_1,
  'menu-4-10-2': Stub_4_10_2,
  'menu-4-10-3': Stub_4_10_3,
  'menu-4-10-4': Stub_4_10_4,
  'menu-4-10-5': Stub_4_10_5,
  'menu-4-10-6': Stub_4_10_6,
  'menu-4-10-7': Stub_4_10_7,
  'menu-4-10-8': Stub_4_10_8,
  'menu-4-10-9': Stub_4_10_9,
  'menu-4-10-10': Stub_4_10_10,

  // menu-4-2 (8 个)
  'menu-4-2-1': Stub_4_2_1,
  'menu-4-2-2': Stub_4_2_2,
  'menu-4-2-3': Stub_4_2_3,
  'menu-4-2-4': Stub_4_2_4,
  'menu-4-2-5': Stub_4_2_5,
  'menu-4-2-6': Stub_4_2_6,
  'menu-4-2-7': Stub_4_2_7,
  'menu-4-2-8': Stub_4_2_8,

  // menu-4-3 (7 个)
  'menu-4-3-1': Stub_4_3_1,
  'menu-4-3-2': Stub_4_3_2,
  'menu-4-3-3': Stub_4_3_3,
  'menu-4-3-4': Stub_4_3_4,
  'menu-4-3-5': Stub_4_3_5,
  'menu-4-3-6': Stub_4_3_6,
  'menu-4-3-7': Stub_4_3_7,

  // menu-4-4 (9 个)
  'menu-4-4-1': Stub_4_4_1,
  'menu-4-4-2': Stub_4_4_2,
  'menu-4-4-3': Stub_4_4_3,
  'menu-4-4-4': Stub_4_4_4,
  'menu-4-4-5': Stub_4_4_5,
  'menu-4-4-6': Stub_4_4_6,
  'menu-4-4-7': Stub_4_4_7,
  'menu-4-4-8': Stub_4_4_8,
  'menu-4-4-9': Stub_4_4_9,

  // menu-4-5 (11 个)
  'menu-4-5-1': Stub_4_5_1,
  'menu-4-5-2': Stub_4_5_2,
  'menu-4-5-3': Stub_4_5_3,
  'menu-4-5-4': Stub_4_5_4,
  'menu-4-5-5': Stub_4_5_5,
  'menu-4-5-6': Stub_4_5_6,
  'menu-4-5-7': Stub_4_5_7,
  'menu-4-5-8': Stub_4_5_8,
  'menu-4-5-9': Stub_4_5_9,
  'menu-4-5-10': Stub_4_5_10,
  'menu-4-5-11': Stub_4_5_11,

  // menu-4-7 (10 个)
  'menu-4-7-1': Stub_4_7_1,
  'menu-4-7-2': Stub_4_7_2,
  'menu-4-7-3': Stub_4_7_3,
  'menu-4-7-4': Stub_4_7_4,
  'menu-4-7-5': Stub_4_7_5,
  'menu-4-7-6': Stub_4_7_6,
  'menu-4-7-7': Stub_4_7_7,
  'menu-4-7-8': Stub_4_7_8,
  'menu-4-7-9': Stub_4_7_9,
  'menu-4-7-10': Stub_4_7_10,

  // menu-4-8 (9 个)
  'menu-4-8-1': Stub_4_8_1,
  'menu-4-8-2': Stub_4_8_2,
  'menu-4-8-3': Stub_4_8_3,
  'menu-4-8-4': Stub_4_8_4,
  'menu-4-8-5': Stub_4_8_5,
  'menu-4-8-6': Stub_4_8_6,
  'menu-4-8-7': Stub_4_8_7,
  'menu-4-8-8': Stub_4_8_8,
  'menu-4-8-9': Stub_4_8_9,

  // menu-4-9 (9 个)
  'menu-4-9-1': Stub_4_9_1,
  'menu-4-9-2': Stub_4_9_2,
  'menu-4-9-3': Stub_4_9_3,
  'menu-4-9-4': Stub_4_9_4,
  'menu-4-9-5': Stub_4_9_5,
  'menu-4-9-6': Stub_4_9_6,
  'menu-4-9-7': Stub_4_9_7,
  'menu-4-9-8': Stub_4_9_8,
  'menu-4-9-9': Stub_4_9_9,

  // menu-5-1 (3 个)
  'menu-5-1-1': Stub_5_1_1,
  'menu-5-1-2': Stub_5_1_2,
  'menu-5-1-3': Stub_5_1_3,

  // menu-5-2 (2 个)
  'menu-5-2-1': Stub_5_2_1,
  'menu-5-2-2': Stub_5_2_2,

  // menu-5-3 (5 个) - 安全大屏深度实现
  'menu-5-3-1': RiskScoreDashboard,
  'menu-5-3-2': RealtimeThreatTrend,
  'menu-5-3-3': IncidentResolutionKPI,
  'menu-5-3-4': AssetComplianceStatus,
  'menu-5-3-5': DashboardCustomConfig,

  // menu-5-4 (5 个)
  'menu-5-4-1': Stub_5_4_1,
  'menu-5-4-2': Stub_5_4_2,
  'menu-5-4-3': Stub_5_4_3,
  'menu-5-4-4': Stub_5_4_4,
  'menu-5-4-5': Stub_5_4_5,

  // menu-5-5 (4 个)
  'menu-5-5-1': Stub_5_5_1,
  'menu-5-5-2': Stub_5_5_2,
  'menu-5-5-3': Stub_5_5_3,
  'menu-5-5-4': Stub_5_5_4,

  // menu-5-6 (5 个)
  'menu-5-6-1': Stub_5_6_1,
  'menu-5-6-2': Stub_5_6_2,
  'menu-5-6-3': Stub_5_6_3,
  'menu-5-6-4': Stub_5_6_4,
  'menu-5-6-5': Stub_5_6_5,

  // menu-5-7 (6 个)
  'menu-5-7-1': Stub_5_7_1,
  'menu-5-7-2': Stub_5_7_2,
  'menu-5-7-3': Stub_5_7_3,
  'menu-5-7-4': Stub_5_7_4,
  'menu-5-7-5': Stub_5_7_5,
  'menu-5-7-6': Stub_5_7_6,

  // menu-5-8 (6 个)
  'menu-5-8-1': Stub_5_8_1,
  'menu-5-8-2': Stub_5_8_2,
  'menu-5-8-3': Stub_5_8_3,
  'menu-5-8-4': Stub_5_8_4,
  'menu-5-8-5': Stub_5_8_5,
  'menu-5-8-6': Stub_5_8_6,

  // menu-5-9 (4 个)
  'menu-5-9-1': Stub_5_9_1,
  'menu-5-9-2': Stub_5_9_2,
  'menu-5-9-3': Stub_5_9_3,
  'menu-5-9-4': Stub_5_9_4,

  // menu-6-1 (5 个)
  'menu-6-1-1': Stub_6_1_1,
  'menu-6-1-2': Stub_6_1_2,
  'menu-6-1-3': Stub_6_1_3,
  'menu-6-1-4': Stub_6_1_4,
  'menu-6-1-5': Stub_6_1_5,

  // menu-6-10 (5 个)
  'menu-6-10-1': Stub_6_10_1,
  'menu-6-10-2': Stub_6_10_2,
  'menu-6-10-3': Stub_6_10_3,
  'menu-6-10-4': Stub_6_10_4,
  'menu-6-10-5': Stub_6_10_5,

  // menu-6-11 (2 个)
  'menu-6-11-1': Stub_6_11_1,
  'menu-6-11-2': Stub_6_11_2,

  // menu-6-12 (3 个)
  'menu-6-12-1': Stub_6_12_1,
  'menu-6-12-2': Stub_6_12_2,
  'menu-6-12-3': Stub_6_12_3,

  // menu-6-13 (2 个)
  'menu-6-13-1': Stub_6_13_1,
  'menu-6-13-2': Stub_6_13_2,

  // menu-6-2 (5 个)
  'menu-6-2-1': Stub_6_2_1,
  'menu-6-2-2': Stub_6_2_2,
  'menu-6-2-3': Stub_6_2_3,
  'menu-6-2-4': Stub_6_2_4,
  'menu-6-2-5': Stub_6_2_5,

  // menu-6-3 (4 个)
  'menu-6-3-1': Stub_6_3_1,
  'menu-6-3-2': Stub_6_3_2,
  'menu-6-3-3': Stub_6_3_3,
  'menu-6-3-4': Stub_6_3_4,

  // menu-6-4 (4 个)
  'menu-6-4-1': Stub_6_4_1,
  'menu-6-4-2': Stub_6_4_2,
  'menu-6-4-3': Stub_6_4_3,
  'menu-6-4-4': Stub_6_4_4,

  // menu-6-5 (2 个)
  'menu-6-5-1': Stub_6_5_1,
  'menu-6-5-2': Stub_6_5_2,

  // menu-6-6 (3 个)
  'menu-6-6-1': Stub_6_6_1,
  'menu-6-6-2': Stub_6_6_2,
  'menu-6-6-3': Stub_6_6_3,

  // menu-6-7 (3 个)
  'menu-6-7-1': Stub_6_7_1,
  'menu-6-7-2': Stub_6_7_2,
  'menu-6-7-3': Stub_6_7_3,

  // menu-6-8 (1 个)
  'menu-6-8-1': Stub_6_8_1,

  // menu-6-9 (5 个)
  'menu-6-9-1': Stub_6_9_1,
  'menu-6-9-2': Stub_6_9_2,
  'menu-6-9-3': Stub_6_9_3,
  'menu-6-9-4': Stub_6_9_4,
  'menu-6-9-5': Stub_6_9_5,

  // menu-2-25 (7 个)
  // 第25组：PKI工单
  'menu-2-25-1': PkiWorkOrderView,
  'menu-2-25-2': PkiAuthConfig,
  'menu-2-25-3': PkiAccountClear,
  'menu-2-25-4': PkiStatusMonitor,
  'menu-2-25-5': PkiHistoryQuery,
  'menu-2-25-6': PkiAudit,
  'menu-2-25-7': PkiTaskReport,

  // 第26组：网络故障诊断
  'menu-2-26-1': NetworkDiagView,
  'menu-2-26-2': LinkAnomalyDetect,
  'menu-2-26-3': DeviceFaultAnalysis,
  'menu-2-26-4': NetDiagStatusMonitor,
  'menu-2-26-5': NetDiagHistoryQuery,
  'menu-2-26-6': NetDiagAudit,
  'menu-2-26-7': NetDiagTaskReport,

  // 第27组：系统故障诊断
  'menu-2-27-1': SystemDiagView,
  'menu-2-27-2': SystemFaultDiag,
  'menu-2-27-3': SysDiagStatusMonitor,
  'menu-2-27-4': SysDiagHistoryQuery,
  'menu-2-27-5': SysDiagAudit,
  'menu-2-27-6': SysDiagTaskReport,

  // 第28组：性能诊断
  'menu-2-28-1': PerfDiagView,
  'menu-2-28-2': PerfMonitor,
  'menu-2-28-3': PerfAnalysis,
  'menu-2-28-4': PerfDiagStatusMonitor,
  'menu-2-28-5': PerfDiagHistoryQuery,
  'menu-2-28-6': PerfDiagAudit,
  'menu-2-28-7': PerfDiagTaskReport,

  // 第29组：安全阻断诊断
  'menu-2-29-1': BlockDiagView,
  'menu-2-29-2': BlockDiagAnalysis,
  'menu-2-29-3': BlockDiagStatusMonitor,
  'menu-2-29-4': BlockDiagHistoryQuery,
  'menu-2-29-5': BlockDiagAudit,
  'menu-2-29-6': BlockDiagTaskReport,

  // 第30组：综合故障诊断
  'menu-2-30-1': CompDiagView,
  'menu-2-30-2': CompFaultDiag,
  'menu-2-30-3': CompDiagStatusMonitor,
  'menu-2-30-4': CompDiagHistoryQuery,
  'menu-2-30-5': CompDiagAudit,
  'menu-2-30-6': CompDiagTaskReport,

  // 第31组：作业审核
  'menu-2-31-1': JobAuditView,
  'menu-2-31-2': AutoJobAudit,
  'menu-2-31-3': QualComplianceCheck,
  'menu-2-31-4': JobRiskLevelAssess,
  'menu-2-31-5': JobAuditStatusMonitor,
  'menu-2-31-6': JobAuditHistoryQuery,
  'menu-2-31-7': JobAuditAudit,
  'menu-2-31-8': JobAuditTaskReport,

  // 第32组：作业方案审核
  'menu-2-32-1': JobPlanAuditView,
  'menu-2-32-2': PlanComplianceCheck,
  'menu-2-32-3': PlanIntegrityCheck,
  'menu-2-32-4': PlanAuditStatusMonitor,
  'menu-2-32-5': PlanAuditHistoryQuery,
  'menu-2-32-6': PlanAuditAudit,
  'menu-2-32-7': PlanAuditTaskReport,

  // 第33组：作业问题检查
  'menu-2-33-1': JobIssueCheckView,
  'menu-2-33-2': ConfigDiffCompare,
  'menu-2-33-3': IssueAutoLocation,
  'menu-2-33-4': IssueSeverityGrade,
  'menu-2-33-5': IssueCheckStatusMonitor,
  'menu-2-33-6': IssueCheckHistoryQuery,
  'menu-2-33-7': IssueCheckAudit,
  'menu-2-33-8': IssueCheckTaskReport,

  // 第34组：作业综合辅助
  'menu-2-34-1': JobAssistantView,
  'menu-2-34-2': JobQualityEval,
  'menu-2-34-3': StandardReportGen,
  'menu-2-34-4': JobAssistStatusMonitor,
  'menu-2-34-5': JobAssistHistoryQuery,
  'menu-2-34-6': JobAssistAudit,
  'menu-2-34-7': JobAssistTaskReport,

  // 模块3：网络安全自动运营（已移除）
  // 模块 4：网络安全标准场景自动化
  // ─────────────────────────────────
  // 第6组：漏洞管理任务
  'menu-4-6-5': VulnRectifyTrack,
};

/**
 * 通过菜单ID获取页面组件
 * 如果未注册，返回 DefaultPage
 */
export function getPageComponent(menuId: string): ComponentType<any> {
  return pageRegistry[menuId] || DefaultPage;
}
