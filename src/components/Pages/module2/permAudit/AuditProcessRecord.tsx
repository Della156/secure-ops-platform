'use client';

import React, { useState } from 'react';
import { ListPage, DetailDrawer } from '@/components/Common/ListPage';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Shield, AlertCircle, Activity } from 'lucide-react';

interface AuditRecord {
  id: string;
  time: string;
  operator: string;
  operatorIp: string;
  action: string;
  target: string;
  result: 'success' | 'failed' | 'denied';
  riskLevel: 'high' | 'medium' | 'low';
  evidenceChain: string[];
  approver?: string;
  ruleId: string;
}

const MOCK_RECORDS: AuditRecord[] = [
  { id: 'AR-001', time: '2026-06-03 14:32:15', operator: '张三', operatorIp: '10.20.30.45',
    action: '删除防火墙策略', target: 'FW-POL-2024-001', result: 'success', riskLevel: 'high',
    ruleId: 'RULE-002', approver: '李四',
    evidenceChain: ['操作人: 张三', '审批人: 李四', '操作时间: 14:32:15', '目标策略: FW-POL-2024-001', '结果: 成功'] },
  { id: 'AR-002', time: '2026-06-03 14:28:42', operator: '王五', operatorIp: '192.168.1.102',
    action: '修改账号权限', target: '账号 admin@db-prod', result: 'success', riskLevel: 'medium',
    ruleId: 'RULE-002', approver: '赵六',
    evidenceChain: ['操作人: 王五', '审批人: 赵六', '操作时间: 14:28:42', '目标: 账号 admin@db-prod', '原权限: 只读', '新权限: 读写'] },
  { id: 'AR-003', time: '2026-06-03 14:15:08', operator: '钱七', operatorIp: '10.10.10.55',
    action: '登录失败', target: '系统 SSH-10.0.1.1', result: 'failed', riskLevel: 'medium',
    ruleId: 'RULE-007',
    evidenceChain: ['操作人: 钱七', 'IP: 10.10.10.55', '失败原因: 密码错误', '失败次数: 3/5', '下一步: 锁定账号'] },
  { id: 'AR-004', time: '2026-06-03 14:10:33', operator: '孙八', operatorIp: '10.20.30.78',
    action: '导出客户数据', target: 'CRM 系统 (5000 条记录)', result: 'denied', riskLevel: 'high',
    ruleId: 'RULE-008',
    evidenceChain: ['操作人: 孙八', 'IP: 10.20.30.78', '拒绝原因: 超出单次导出限制（>1000 条）', '建议: 分批导出'] },
  { id: 'AR-005', time: '2026-06-03 14:05:21', operator: '周九', operatorIp: '10.20.30.91',
    action: '创建账号', target: 'newuser@company.com', result: 'success', riskLevel: 'low',
    ruleId: 'RULE-003', approver: '吴十',
    evidenceChain: ['操作人: 周九', '审批人: 吴十', '新账号: newuser@company.com', '默认部门: 研发部'] },
  { id: 'AR-006', time: '2026-06-03 13:58:09', operator: 'admin', operatorIp: '10.0.0.100',
    action: '修改系统配置', target: 'Nginx 配置 /etc/nginx/nginx.conf', result: 'success', riskLevel: 'high',
    ruleId: 'RULE-005', approver: '安全总监',
    evidenceChain: ['操作人: admin', '审批人: 安全总监', '变更前: worker_processes 4', '变更后: worker_processes 8', '备份: /backup/nginx.conf.20260603'] },
  { id: 'AR-007', time: '2026-06-03 13:45:11', operator: '张三', operatorIp: '10.20.30.45',
    action: '查看敏感数据', target: '客户隐私表 (10 条)', result: 'success', riskLevel: 'medium',
    ruleId: 'RULE-004',
    evidenceChain: ['操作人: 张三', '查看表: customer_privacy', '查看条数: 10', '用途: 客服查询'] },
  { id: 'AR-008', time: '2026-06-03 13:30:00', operator: '李四', operatorIp: '10.20.30.50',
    action: '登录成功', target: '堡垒机 BH-01', result: 'success', riskLevel: 'low',
    ruleId: 'RULE-001',
    evidenceChain: ['操作人: 李四', '登录方式: SSO', '登录设备: BH-01'] },
];

const resultBadgeMap: Record<string, any> = { success: 'success', failed: 'failed', denied: 'warning' };
const riskBadgeMap: Record<string, any> = { high: 'failed', medium: 'warning', low: 'info' };

export function AuditProcessRecord() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  // KPI
  const totalToday = MOCK_RECORDS.length;
  const abnormal = MOCK_RECORDS.filter((r) => r.result !== 'success' || r.riskLevel === 'high').length;
  const sensitive = MOCK_RECORDS.filter((r) => r.riskLevel === 'high').length;
  const violation = MOCK_RECORDS.filter((r) => r.result === 'denied').length;

  const filtered = MOCK_RECORDS.filter((r) => {
    const matchSearch = !search ||
      r.operator.includes(search) || r.action.includes(search) || r.target.includes(search);
    const matchAction = !actionFilter || r.action === actionFilter;
    const matchResult = !resultFilter || r.result === resultFilter;
    const matchRisk = !riskFilter || r.riskLevel === riskFilter;
    return matchSearch && matchAction && matchResult && matchRisk;
  });

  const columns = [
    { key: 'time', title: '时间', width: '150px' },
    { key: 'operator', title: '操作人', width: '100px' },
    { key: 'action', title: '操作类型' },
    { key: 'target', title: '对象' },
    {
      key: 'result', title: '结果', width: '90px',
      render: (r: AuditRecord) => (
        <StatusBadge status={resultBadgeMap[r.result]} />
      ),
    },
    {
      key: 'riskLevel', title: '风险', width: '90px',
      render: (r: AuditRecord) => (
        <StatusBadge status={riskBadgeMap[r.riskLevel]} />
      ),
    },
    {
      key: 'actions', title: '操作', width: '120px',
      render: (r: AuditRecord) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(r)}>
          <FileText className="w-3.5 h-3.5 mr-1" />详情
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">审计过程记录</h1>
        <p className="text-slate-400 mt-1 text-sm">审计操作全链路追溯与证据链管理</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="今日操作" value={totalToday} icon={Activity} color="text-blue-400" />
        <KPI label="异常操作" value={abnormal} icon={AlertCircle} color="text-yellow-400" />
        <KPI label="敏感操作" value={sensitive} icon={Shield} color="text-red-400" />
        <KPI label="合规违规" value={violation} icon={AlertCircle} color="text-red-400" />
      </div>

      <ListPage<AuditRecord>
        searchPlaceholder="搜索操作人/操作/对象..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'action', label: '类型',
            options: [
              { value: '登录成功', label: '登录成功' },
              { value: '登录失败', label: '登录失败' },
              { value: '创建账号', label: '创建账号' },
              { value: '修改账号权限', label: '修改权限' },
              { value: '导出客户数据', label: '导出数据' },
              { value: '查看敏感数据', label: '查看敏感数据' },
              { value: '修改系统配置', label: '修改配置' },
              { value: '删除防火墙策略', label: '删除策略' },
            ],
          },
          {
            key: 'result', label: '结果',
            options: [
              { value: 'success', label: '成功' },
              { value: 'failed', label: '失败' },
              { value: 'denied', label: '拒绝' },
            ],
          },
          {
            key: 'risk', label: '风险',
            options: [
              { value: 'high', label: '高' },
              { value: 'medium', label: '中' },
              { value: 'low', label: '低' },
            ],
          },
        ]}
        filterValues={{ action: actionFilter, result: resultFilter, risk: riskFilter }}
        onFilterChange={(k, v) => {
          if (k === 'action') setActionFilter(v);
          if (k === 'result') setResultFilter(v);
          if (k === 'risk') setRiskFilter(v);
        }}
        data={filtered}
        columns={columns}
        rowKey="id"
        toolbar={
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-1" />导出取证报告
          </Button>
        }
      />

      <DetailDrawer
        open={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title="审计记录详情"
        width="max-w-2xl"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-100">{selectedRecord.action}</h3>
                <p className="text-xs text-slate-500 mt-0.5">记录ID: {selectedRecord.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={resultBadgeMap[selectedRecord.result]} />
                <StatusBadge status={riskBadgeMap[selectedRecord.riskLevel]} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="操作时间" value={selectedRecord.time} />
              <Field label="操作人" value={selectedRecord.operator} />
              <Field label="操作IP" value={selectedRecord.operatorIp} />
              <Field label="关联规则" value={selectedRecord.ruleId} />
              <Field label="审批人" value={selectedRecord.approver || '—'} />
              <Field label="目标对象" value={selectedRecord.target} />
            </div>

            <Card>
              <h4 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                证据链
              </h4>
              <div className="space-y-2">
                {selectedRecord.evidenceChain.map((e, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#0066FF]/20 text-blue-400 text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300">{e}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#2A354D]">
              <Button variant="secondary" onClick={() => setSelectedRecord(null)}>关闭</Button>
              <Button variant="primary">
                <Download className="w-4 h-4 mr-1" />导出取证
              </Button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

function KPI({ label, value, icon: Icon, color }: any) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
        </div>
      </div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 bg-[#111625] rounded-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5 break-all">{value}</p>
    </div>
  );
}

export default AuditProcessRecord;
