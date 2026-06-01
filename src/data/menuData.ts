import { MenuItem } from '@/types';

export const menuData: MenuItem[] = [
  {
    id: 'auto-task-config',
    label: '网络安全自动任务配置',
    icon: 'Settings',
    children: [
      { id: 'task-registration', label: '自动化任务注册与接入' },
      { id: 'task-repository', label: '自动化任务仓库与管理' },
      { id: 'task-monitoring', label: '自动化任务运行状态监控' },
      { id: 'task-directory', label: '可编排任务目录' },
      { id: 'task-orchestration', label: '自动化流程编排器' },
      { id: 'task-template', label: '任务模板管理' },
      { id: 'task-scheduler', label: '任务调度引擎' },
      { id: 'task-execution', label: '任务执行与监控' },
      { id: 'security-device', label: '安全设备资源管理' },
      { id: 'security-system', label: '安全系统资源管理' },
      { id: 'host-resource', label: '主机资源管理' },
      { id: 'terminal-resource', label: '终端资源管理' },
      { id: 'data-interface', label: '数据接口对接管理' },
      { id: 'service-api', label: '自动化服务接口配置管理' },
    ],
  },
  {
    id: 'auto-operation',
    label: '网络安全自动运维',
    icon: 'Shield',
  },
  {
    id: 'auto-operation-2',
    label: '网络安全自动运营',
    icon: 'Activity',
  },
  {
    id: 'auto-scenario',
    label: '网络安全标准场景自动化',
    icon: 'Layers',
  },
  {
    id: 'collaboration',
    label: '网络安全人机协同工作台',
    icon: 'Users',
  },
  {
    id: 'operation-config',
    label: '运维配置中心',
    icon: 'Toolbox',
  },
];

export const defaultHighPriorityTodos = [
  {
    id: 'todo-1',
    title: '防火墙策略异常检测',
    severity: 'critical' as const,
    source: '威胁监测',
    createdAt: '2026-05-29 10:30',
  },
  {
    id: 'todo-2',
    title: 'Web应用防火墙被绕过',
    severity: 'high' as const,
    source: '渗透测试',
    createdAt: '2026-05-29 09:15',
  },
  {
    id: 'todo-3',
    title: '弱口令扫描任务待处理',
    severity: 'medium' as const,
    source: '自动化巡检',
    createdAt: '2026-05-28 16:45',
  },
];