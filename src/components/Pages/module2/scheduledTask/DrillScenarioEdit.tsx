'use client';

import { useState } from 'react';
import {
  Activity, Database, Network, FileText, Settings, RotateCcw, Target,
  CheckCircle2,
} from 'lucide-react';
import { FlowOrchestrator } from '@/components/FlowOrchestrator';
import { Select } from '@/components/ui/Select';
import type { FlowNode, FlowEdge, NodeTypeConfig, FlowScenario } from '@/components/FlowOrchestrator/types';

/**
 * 演练场景编排（menu-2-14-2）
 *
 * 业务：通过构建演练场景编排功能，实现演练场景（数据库恢复演练、文件恢复演练等）
 * 的配置与管理。场景中包含演练步骤、预期结果、验证方法。
 *
 * 功能：场景配置（新增、删除、修改、查询）/ 场景管理 / 步骤·预期结果·验证方法配置
 *
 * 设计：使用共享 FlowOrchestrator 组件，与模块 1 流程编排器统一风格。
 */

// ===== 节点类型定义 =====
const nodeTypes: NodeTypeConfig[] = [
  { type: 'start', label: '演练开始', color: '#22C55E', icon: <Activity className="w-4 h-4" />, description: '演练流程入口' },
  { type: 'stop_db', label: '停止数据库', color: '#FF6D00', icon: <Database className="w-4 h-4" />, description: '停止主库写入' },
  { type: 'restore_db', label: '恢复数据库', color: '#0066FF', icon: <Database className="w-4 h-4" />, description: '从备份恢复数据' },
  { type: 'switch_app', label: '应用切换', color: '#9333EA', icon: <Network className="w-4 h-4" />, description: '应用切到备库' },
  { type: 'verify', label: '业务验证', color: '#06B6D4', icon: <CheckCircle2 className="w-4 h-4" />, description: '业务功能验证' },
  { type: 'notify', label: '通知', color: '#EAB308', icon: <Settings className="w-4 h-4" />, description: '通知业务方' },
  { type: 'rollback', label: '回滚', color: '#EF4444', icon: <RotateCcw className="w-4 h-4" />, description: '失败时回滚' },
  { type: 'end', label: '演练结束', color: '#94A3B8', icon: <Target className="w-4 h-4" />, description: '生成报告' },
];

// ===== 业务字段默认值 =====
const defaultNodes: Record<string, Partial<FlowNode>> = {
  start: { trigger: '定时 02:00', expectResult: '演练开始', verifyMethod: '时间触发' },
  stop_db: { trigger: 'mysql-01: SET GLOBAL read_only=ON', expectResult: '主库停止写入', verifyMethod: 'SHOW STATUS' },
  restore_db: { trigger: 'innobackupex --apply-log ...', expectResult: '数据恢复到指定时间点', verifyMethod: 'pt-table-checksum' },
  switch_app: { trigger: 'app-01~app-04 重连', expectResult: '应用切到备库', verifyMethod: '应用日志无报错' },
  verify: { trigger: '运行 200 笔交易', expectResult: '业务正常', verifyMethod: '业务监控' },
  notify: { trigger: '短信+邮件+IM', expectResult: '通知到达', verifyMethod: '通知记录' },
  rollback: { trigger: '恢复主库', expectResult: '恢复原状', verifyMethod: '数据一致性' },
  end: { trigger: '生成报告', expectResult: '演练结束', verifyMethod: '报告生成' },
};

// ===== 场景数据 =====
const initialScenarios: FlowScenario[] = [
  {
    id: 'SC-001',
    name: '核心数据库恢复演练',
    description: '主库故障后，从备份恢复并切换到备库',
    status: '已审核',
    updatedAt: '2026-05-28',
    nodes: [
      { id: '1', type: 'start', label: '演练开始', description: '触发：定时 02:00', x: 60, y: 200, status: 'success', ...defaultNodes.start },
      { id: '2', type: 'stop_db', label: '停止主库', description: 'mysql-01 read_only=ON', x: 240, y: 200, status: 'success', duration: '12s', ...defaultNodes.stop_db },
      { id: '3', type: 'restore_db', label: '恢复数据', description: 'innobackupex --apply-log', x: 420, y: 200, status: 'running', duration: '5m 24s', ...defaultNodes.restore_db },
      { id: '4', type: 'switch_app', label: '应用切换', description: 'app-01~04 重连', x: 600, y: 200, ...defaultNodes.switch_app },
      { id: '5', type: 'verify', label: '业务验证', description: '200 笔交易', x: 600, y: 80, ...defaultNodes.verify },
      { id: '6', type: 'verify', label: '数据一致性', description: 'pt-table-checksum', x: 600, y: 320, ...defaultNodes.verify },
      { id: '7', type: 'notify', label: '通知业务方', description: '短信+邮件+IM', x: 780, y: 80, ...defaultNodes.notify },
      { id: '8', type: 'rollback', label: '回滚 (失败时)', description: '恢复主库', x: 780, y: 320, ...defaultNodes.rollback },
      { id: '9', type: 'end', label: '演练结束', description: '生成报告', x: 920, y: 200, ...defaultNodes.end },
    ],
    edges: [
      { from: '1', to: '2', condition: 'always' },
      { from: '2', to: '3', condition: 'success' },
      { from: '3', to: '4', condition: 'success' },
      { from: '4', to: '5', condition: 'success' },
      { from: '4', to: '6', condition: 'success' },
      { from: '5', to: '7', condition: 'success' },
      { from: '6', to: '8', condition: 'failure' },
      { from: '5', to: '9', condition: 'success' },
      { from: '6', to: '9', condition: 'success' },
      { from: '7', to: '9', condition: 'always' },
      { from: '8', to: '9', condition: 'always' },
    ],
  },
  {
    id: 'SC-002',
    name: '全机房断电应急',
    description: 'UPS 故障导致机房断电，启用灾备中心',
    status: '已审核',
    updatedAt: '2026-05-20',
    nodes: [
      { id: '1', type: 'start', label: '演练开始', x: 60, y: 200, ...defaultNodes.start },
      { id: '2', type: 'stop_db', label: '关闭主库', x: 240, y: 200, ...defaultNodes.stop_db },
      { id: '3', type: 'switch_app', label: '切换到灾备', x: 420, y: 200, ...defaultNodes.switch_app },
      { id: '4', type: 'verify', label: '灾备中心验证', x: 600, y: 200, ...defaultNodes.verify },
      { id: '5', type: 'notify', label: '通知业务方', x: 780, y: 200, ...defaultNodes.notify },
      { id: '6', type: 'end', label: '演练结束', x: 920, y: 200, ...defaultNodes.end },
    ],
    edges: [
      { from: '1', to: '2', condition: 'always' },
      { from: '2', to: '3', condition: 'success' },
      { from: '3', to: '4', condition: 'success' },
      { from: '4', to: '5', condition: 'success' },
      { from: '5', to: '6', condition: 'always' },
    ],
  },
  {
    id: 'SC-003',
    name: '应用双活切换',
    description: '主中心应用故障，切换到同城双活中心',
    status: '草稿',
    updatedAt: '2026-06-02',
    nodes: [
      { id: '1', type: 'start', label: '演练开始', x: 60, y: 200, ...defaultNodes.start },
      { id: '2', type: 'switch_app', label: '切换到双活', x: 240, y: 200, ...defaultNodes.switch_app },
      { id: '3', type: 'verify', label: '业务验证', x: 420, y: 200, ...defaultNodes.verify },
      { id: '4', type: 'end', label: '演练结束', x: 600, y: 200, ...defaultNodes.end },
    ],
    edges: [
      { from: '1', to: '2', condition: 'always' },
      { from: '2', to: '3', condition: 'success' },
      { from: '3', to: '4', condition: 'always' },
    ],
  },
];

export function DrillScenarioEdit() {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [currentScenarioId, setCurrentScenarioId] = useState('SC-001');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('3');

  const currentScenario = scenarios.find((s) => s.id === currentScenarioId) || scenarios[0];

  // 更新当前场景的节点
  const handleNodesChange = (nodes: FlowNode[]) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === currentScenarioId ? { ...s, nodes } : s))
    );
  };

  // 新建场景
  const handleAddScenario = () => {
    const newId = `SC-${String(scenarios.length + 1).padStart(3, '0')}`;
    const newScenario: FlowScenario = {
      id: newId,
      name: `新演练场景 ${newId}`,
      status: '草稿',
      updatedAt: new Date().toISOString().slice(0, 10),
      nodes: [
        { id: '1', type: 'start', label: '演练开始', x: 60, y: 200, ...defaultNodes.start },
        { id: '2', type: 'end', label: '演练结束', x: 300, y: 200, ...defaultNodes.end },
      ],
      edges: [{ from: '1', to: '2', condition: 'always' }],
    };
    setScenarios([...scenarios, newScenario]);
    setCurrentScenarioId(newId);
  };

  return (
    <div className="p-6 space-y-4">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-50">演练场景编排</h1>
        <p className="text-slate-400 mt-1 text-sm">
          配置演练场景（数据库恢复演练、文件恢复演练等），定义演练步骤、预期结果、验证方法
        </p>
      </div>

      {/* 共享 FlowOrchestrator */}
      <FlowOrchestrator
        nodeTypes={nodeTypes}
        nodes={currentScenario.nodes}
        edges={currentScenario.edges}
        onNodesChange={handleNodesChange}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        scenarios={scenarios}
        currentScenarioId={currentScenarioId}
        onScenarioChange={setCurrentScenarioId}
        onScenarioAdd={handleAddScenario}
        onCopyNode={() => {}}
        onDeleteNode={() => {}}
        libraryColSpan={2}
        configColSpan={3}
        canvasHeight={620}
        renderNodeConfig={({ node, onChange }) => {
          const type = node.type;
          if (type === 'start') {
            return (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">触发条件</label>
                  <input
                    type="text"
                    value={node.trigger || ''}
                    onChange={(e) => onChange({ trigger: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            );
          }
          if (type === 'restore_db' || type === 'stop_db' || type === 'switch_app') {
            return (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">操作命令/脚本</label>
                  <textarea
                    value={node.trigger || ''}
                    onChange={(e) => onChange({ trigger: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none resize-none font-mono"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">预期结果</label>
                  <input
                    type="text"
                    value={node.expectResult || ''}
                    onChange={(e) => onChange({ expectResult: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            );
          }
          if (type === 'verify') {
            return (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">验证方法</label>
                  <Select
                    value={node.verifyMethod || '业务监控'}
                    onChange={(e) => onChange({ verifyMethod: e.target.value })}
                    options={[
                      { value: '业务监控', label: '业务监控' },
                      { value: 'pt-table-checksum', label: '数据一致性比对' },
                      { value: '应用日志', label: '应用日志无报错' },
                      { value: '200 笔交易', label: '200 笔业务交易' },
                      { value: '接口探活', label: '接口探活' },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">预期结果</label>
                  <input
                    type="text"
                    value={node.expectResult || ''}
                    onChange={(e) => onChange({ expectResult: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            );
          }
          if (type === 'notify') {
            return (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">通知方式</label>
                  <Select
                    value={node.notifyType || '短信+邮件+IM'}
                    onChange={(e) => onChange({ notifyType: e.target.value })}
                    options={[
                      { value: '短信+邮件+IM', label: '短信+邮件+IM' },
                      { value: '仅短信', label: '仅短信' },
                      { value: '仅邮件', label: '仅邮件' },
                      { value: '仅 IM 推送', label: '仅 IM 推送' },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">通知对象</label>
                  <input
                    type="text"
                    value={node.notifyTarget || '业务方 + 运维'}
                    onChange={(e) => onChange({ notifyTarget: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            );
          }
          if (type === 'rollback') {
            return (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">回滚脚本</label>
                  <textarea
                    value={node.trigger || ''}
                    onChange={(e) => onChange({ trigger: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none resize-none font-mono"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">预期结果</label>
                  <input
                    type="text"
                    value={node.expectResult || ''}
                    onChange={(e) => onChange({ expectResult: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  );
}

export default DrillScenarioEdit;
