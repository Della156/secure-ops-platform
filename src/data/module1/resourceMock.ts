'use client';

export type ResourceType = 'device' | 'host' | 'system' | 'endpoint';

export interface ResourceItem {
  id: string;
  name: string;
  ip: string;
  group: string;
  tags: string[];
  status: 'online' | 'offline' | 'warning';
  createdAt: string;
  description: string;
}

export interface ResourceGroup {
  id: string;
  name: string;
  count: number;
}

export interface ResourceTag {
  id: string;
  name: string;
  color: string;
}

export interface ConnectTestRecord {
  id: string;
  resourceId: string;
  resourceName: string;
  protocol: string;
  address: string;
  status: 'success' | 'failed' | 'timeout' | 'warning';
  responseTime: number;
  timestamp: string;
  message: string;
}

export interface AuthPermission {
  id: string;
  resourceId: string;
  resourceName: string;
  authType: string;
  permissions: string[];
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  grantedBy: string;
  grantedAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  method?: string;
  path?: string;
  command?: string;
  params: { name: string; type: string; required: boolean; description: string }[];
  status: 'enabled' | 'disabled';
}

export interface AccessLogItem {
  id: string;
  resourceId: string;
  resourceName: string;
  operator: string;
  operation: string;
  result: 'success' | 'failed';
  timestamp: string;
  ip: string;
  details: string;
}

const now = new Date();

const generateTimeAgo = (minutes: number) => {
  const time = new Date(now.getTime() - minutes * 60 * 1000);
  return time.toLocaleString('zh-CN');
};

export const resourceConfig = {
  device: {
    title: '安全设备',
    label: '设备',
    icon: 'Server',
  },
  host: {
    title: '主机资源',
    label: '主机',
    icon: 'Monitor',
  },
  system: {
    title: '系统服务',
    label: '系统',
    icon: 'Database',
  },
  endpoint: {
    title: '终端节点',
    label: '终端',
    icon: 'HardDrive',
  },
};

export const deviceMock = {
  list: [
    { id: 'DEV-001', name: '主防火墙-FW-01', ip: '192.168.1.1', group: '网络安全', tags: ['防火墙', '核心设备'], status: 'online' as const, createdAt: '2026-05-15 10:30:00', description: '总部网络入口防火墙，负责外网流量过滤和NAT转换' },
    { id: 'DEV-002', name: '入侵检测系统-IDS-01', ip: '192.168.1.2', group: '网络安全', tags: ['IDS', '监控'], status: 'online' as const, createdAt: '2026-05-16 14:20:00', description: '核心区入侵检测设备，实时监控网络异常流量' },
    { id: 'DEV-003', name: 'Web应用防火墙-WAF-01', ip: '192.168.1.3', group: '应用安全', tags: ['WAF', 'Web防护'], status: 'warning' as const, createdAt: '2026-05-17 09:15:00', description: 'Web应用防护设备，防护SQL注入和XSS攻击' },
    { id: 'DEV-004', name: '终端安全管理-EDR-01', ip: '192.168.1.4', group: '终端安全', tags: ['EDR', '终端'], status: 'offline' as const, createdAt: '2026-05-18 16:45:00', description: '终端安全管理平台，监控终端行为异常' },
    { id: 'DEV-005', name: 'VPN网关-VPN-01', ip: '192.168.1.5', group: '网络安全', tags: ['VPN', '远程接入'], status: 'online' as const, createdAt: '2026-05-19 11:00:00', description: '远程办公VPN接入网关' },
    { id: 'DEV-006', name: '日志审计系统-SIEM-01', ip: '192.168.1.6', group: '安全审计', tags: ['SIEM', '日志'], status: 'online' as const, createdAt: '2026-05-20 08:30:00', description: '安全信息与事件管理系统' },
    { id: 'DEV-007', name: '漏洞扫描器-VulnScan-01', ip: '192.168.1.7', group: '应用安全', tags: ['漏洞扫描', '安全检测'], status: 'online' as const, createdAt: '2026-05-21 13:45:00', description: '定期扫描资产漏洞' },
    { id: 'DEV-008', name: '数据防泄漏-DLP-01', ip: '192.168.1.8', group: '数据安全', tags: ['DLP', '数据保护'], status: 'warning' as const, createdAt: '2026-05-22 10:20:00', description: '数据防泄漏检测系统' },
    { id: 'DEV-009', name: '网络流量分析-NTA-01', ip: '192.168.1.9', group: '网络安全', tags: ['流量分析', '监控'], status: 'online' as const, createdAt: '2026-05-23 15:00:00', description: '网络流量深度分析设备' },
    { id: 'DEV-010', name: '邮件安全网关-EMG-01', ip: '192.168.1.10', group: '应用安全', tags: ['邮件安全', '网关'], status: 'online' as const, createdAt: '2026-05-24 09:30:00', description: '邮件安全过滤网关' },
  ],
  groups: [
    { id: 'group-1', name: '网络安全', count: 4 },
    { id: 'group-2', name: '应用安全', count: 3 },
    { id: 'group-3', name: '终端安全', count: 1 },
    { id: 'group-4', name: '安全审计', count: 1 },
    { id: 'group-5', name: '数据安全', count: 1 },
  ],
  tags: [
    { id: 'tag-1', name: '防火墙', color: 'blue' },
    { id: 'tag-2', name: 'IDS', color: 'green' },
    { id: 'tag-3', name: 'WAF', color: 'purple' },
    { id: 'tag-4', name: '核心设备', color: 'yellow' },
    { id: 'tag-5', name: '监控', color: 'cyan' },
    { id: 'tag-6', name: 'EDR', color: 'orange' },
    { id: 'tag-7', name: '终端', color: 'pink' },
    { id: 'tag-8', name: 'VPN', color: 'indigo' },
  ],
  connectHistory: [
    { id: 'conn-001', resourceId: 'DEV-001', resourceName: '主防火墙-FW-01', protocol: 'SSH', address: '192.168.1.1:22', status: 'success' as const, responseTime: 12, timestamp: generateTimeAgo(5), message: '连接成功' },
    { id: 'conn-002', resourceId: 'DEV-002', resourceName: '入侵检测系统-IDS-01', protocol: 'HTTPS', address: '192.168.1.2:443', status: 'success' as const, responseTime: 25, timestamp: generateTimeAgo(10), message: '连接成功' },
    { id: 'conn-003', resourceId: 'DEV-003', resourceName: 'Web应用防火墙-WAF-01', protocol: 'HTTPS', address: '192.168.1.3:443', status: 'timeout' as const, responseTime: 3000, timestamp: generateTimeAgo(3), message: '连接超时' },
    { id: 'conn-004', resourceId: 'DEV-004', resourceName: '终端安全管理-EDR-01', protocol: 'SSH', address: '192.168.1.4:22', status: 'failed' as const, responseTime: 5000, timestamp: generateTimeAgo(1), message: '连接失败：目标主机不可达' },
    { id: 'conn-005', resourceId: 'DEV-005', resourceName: 'VPN网关-VPN-01', protocol: 'IPsec', address: '192.168.1.5', status: 'success' as const, responseTime: 15, timestamp: generateTimeAgo(8), message: '连接成功' },
  ],
  authList: [
    { id: 'auth-001', resourceId: 'DEV-001', resourceName: '主防火墙-FW-01', authType: 'SSH密钥', permissions: ['read', 'write', 'execute'], expiresAt: '2026-12-31', status: 'active' as const, grantedBy: 'admin', grantedAt: '2026-01-01' },
    { id: 'auth-002', resourceId: 'DEV-002', resourceName: '入侵检测系统-IDS-01', authType: 'API令牌', permissions: ['read', 'alert'], expiresAt: '2026-06-30', status: 'active' as const, grantedBy: 'security', grantedAt: '2026-03-15' },
    { id: 'auth-003', resourceId: 'DEV-003', resourceName: 'Web应用防火墙-WAF-01', authType: '证书认证', permissions: ['read', 'config'], expiresAt: '2025-12-31', status: 'expired' as const, grantedBy: 'admin', grantedAt: '2025-06-01' },
    { id: 'auth-004', resourceId: 'DEV-004', resourceName: '终端安全管理-EDR-01', authType: 'LDAP', permissions: ['read'], expiresAt: '2026-09-30', status: 'active' as const, grantedBy: 'it-support', grantedAt: '2026-04-01' },
  ],
  services: [
    {
      id: 'svc-001', name: '防火墙规则查询', category: '配置管理', description: '查询防火墙当前规则列表',
      method: 'GET', path: '/api/firewall/rules',
      params: [
        { name: 'ruleId', type: 'string', required: false, description: '规则ID' },
        { name: 'status', type: 'string', required: false, description: '规则状态' },
      ],
      status: 'enabled' as const,
    },
    {
      id: 'svc-002', name: '规则更新', category: '配置管理', description: '更新防火墙规则',
      method: 'PUT', path: '/api/firewall/rules/{id}',
      params: [
        { name: 'id', type: 'string', required: true, description: '规则ID' },
        { name: 'action', type: 'string', required: true, description: '动作(allow/deny)' },
        { name: 'source', type: 'string', required: true, description: '源地址' },
        { name: 'destination', type: 'string', required: true, description: '目的地址' },
      ],
      status: 'enabled' as const,
    },
    {
      id: 'svc-003', name: '流量统计', category: '监控', description: '获取流量统计信息',
      method: 'GET', path: '/api/monitor/traffic',
      params: [
        { name: 'startTime', type: 'string', required: true, description: '开始时间' },
        { name: 'endTime', type: 'string', required: true, description: '结束时间' },
      ],
      status: 'enabled' as const,
    },
    {
      id: 'svc-004', name: '日志导出', category: '日志', description: '导出设备日志',
      method: 'POST', path: '/api/logs/export',
      params: [
        { name: 'type', type: 'string', required: true, description: '日志类型' },
        { name: 'format', type: 'string', required: false, description: '导出格式' },
      ],
      status: 'disabled' as const,
    },
  ],
  accessLogs: [
    { id: 'log-001', resourceId: 'DEV-001', resourceName: '主防火墙-FW-01', operator: 'admin', operation: '登录', result: 'success' as const, timestamp: generateTimeAgo(1), ip: '10.0.0.1', details: '通过SSH登录' },
    { id: 'log-002', resourceId: 'DEV-001', resourceName: '主防火墙-FW-01', operator: 'admin', operation: '规则更新', result: 'success' as const, timestamp: generateTimeAgo(2), ip: '10.0.0.1', details: '添加规则: 允许10.0.0.0/24访问DMZ' },
    { id: 'log-003', resourceId: 'DEV-002', resourceName: '入侵检测系统-IDS-01', operator: 'security', operation: '告警查询', result: 'success' as const, timestamp: generateTimeAgo(5), ip: '10.0.0.2', details: '查询最近24小时告警' },
    { id: 'log-004', resourceId: 'DEV-003', resourceName: 'Web应用防火墙-WAF-01', operator: 'user1', operation: '登录', result: 'failed' as const, timestamp: generateTimeAgo(8), ip: '192.168.0.100', details: '密码错误3次，账户锁定' },
    { id: 'log-005', resourceId: 'DEV-004', resourceName: '终端安全管理-EDR-01', operator: 'admin', operation: '策略更新', result: 'success' as const, timestamp: generateTimeAgo(10), ip: '10.0.0.1', details: '更新终端检测策略' },
    { id: 'log-006', resourceId: 'DEV-005', resourceName: 'VPN网关-VPN-01', operator: 'remote-user', operation: 'VPN接入', result: 'success' as const, timestamp: generateTimeAgo(15), ip: '203.0.113.50', details: '通过双重认证接入' },
  ],
};

export const hostMock = {
  list: [
    { id: 'HOST-001', name: '生产服务器-PROD-01', ip: '172.16.0.1', group: '生产环境', tags: ['Linux', '核心'], status: 'online' as const, createdAt: '2026-04-01 09:00:00', description: '核心业务生产服务器' },
    { id: 'HOST-002', name: '生产服务器-PROD-02', ip: '172.16.0.2', group: '生产环境', tags: ['Linux', '核心'], status: 'online' as const, createdAt: '2026-04-02 10:30:00', description: '核心业务生产服务器' },
    { id: 'HOST-003', name: '测试服务器-TEST-01', ip: '172.16.1.1', group: '测试环境', tags: ['Linux', '测试'], status: 'online' as const, createdAt: '2026-04-10 14:00:00', description: '测试环境服务器' },
    { id: 'HOST-004', name: '开发服务器-DEV-01', ip: '172.16.2.1', group: '开发环境', tags: ['Linux', '开发'], status: 'warning' as const, createdAt: '2026-04-15 11:20:00', description: '开发环境服务器' },
    { id: 'HOST-005', name: '数据库服务器-DB-01', ip: '172.16.3.1', group: '数据库', tags: ['Linux', 'PostgreSQL'], status: 'online' as const, createdAt: '2026-03-20 08:00:00', description: '主数据库服务器' },
    { id: 'HOST-006', name: '缓存服务器-REDIS-01', ip: '172.16.3.2', group: '数据库', tags: ['Linux', 'Redis'], status: 'online' as const, createdAt: '2026-03-25 09:30:00', description: 'Redis缓存集群主节点' },
    { id: 'HOST-007', name: '日志服务器-LOG-01', ip: '172.16.4.1', group: '监控', tags: ['Linux', 'ELK'], status: 'online' as const, createdAt: '2026-04-05 16:00:00', description: '日志收集服务器' },
    { id: 'HOST-008', name: '备份服务器-BACKUP-01', ip: '172.16.5.1', group: '存储', tags: ['Linux', '备份'], status: 'online' as const, createdAt: '2026-04-08 13:45:00', description: '数据备份服务器' },
  ],
  groups: [
    { id: 'group-1', name: '生产环境', count: 2 },
    { id: 'group-2', name: '测试环境', count: 1 },
    { id: 'group-3', name: '开发环境', count: 1 },
    { id: 'group-4', name: '数据库', count: 2 },
    { id: 'group-5', name: '监控', count: 1 },
    { id: 'group-6', name: '存储', count: 1 },
  ],
  tags: [
    { id: 'tag-1', name: 'Linux', color: 'blue' },
    { id: 'tag-2', name: '核心', color: 'yellow' },
    { id: 'tag-3', name: '测试', color: 'green' },
    { id: 'tag-4', name: '开发', color: 'purple' },
    { id: 'tag-5', name: 'PostgreSQL', color: 'cyan' },
    { id: 'tag-6', name: 'Redis', color: 'orange' },
    { id: 'tag-7', name: 'ELK', color: 'pink' },
    { id: 'tag-8', name: '备份', color: 'indigo' },
  ],
  connectHistory: [
    { id: 'conn-001', resourceId: 'HOST-001', resourceName: '生产服务器-PROD-01', protocol: 'SSH', address: '172.16.0.1:22', status: 'success' as const, responseTime: 8, timestamp: generateTimeAgo(2), message: '连接成功' },
    { id: 'conn-002', resourceId: 'HOST-005', resourceName: '数据库服务器-DB-01', protocol: 'PostgreSQL', address: '172.16.3.1:5432', status: 'success' as const, responseTime: 15, timestamp: generateTimeAgo(5), message: '连接成功' },
    { id: 'conn-003', resourceId: 'HOST-004', resourceName: '开发服务器-DEV-01', protocol: 'SSH', address: '172.16.2.1:22', status: 'timeout' as const, responseTime: 3000, timestamp: generateTimeAgo(1), message: '连接超时' },
  ],
  authList: [
    { id: 'auth-001', resourceId: 'HOST-001', resourceName: '生产服务器-PROD-01', authType: 'SSH密钥', permissions: ['read', 'write', 'sudo'], expiresAt: '2026-12-31', status: 'active' as const, grantedBy: 'admin', grantedAt: '2026-01-15' },
    { id: 'auth-002', resourceId: 'HOST-005', resourceName: '数据库服务器-DB-01', authType: '数据库用户', permissions: ['read', 'write'], expiresAt: '2026-08-31', status: 'active' as const, grantedBy: 'dba', grantedAt: '2026-02-01' },
  ],
  services: [
    {
      id: 'svc-001', name: '系统信息', category: '系统', description: '获取主机系统信息',
      command: 'uname -a',
      params: [],
      status: 'enabled' as const,
    },
    {
      id: 'svc-002', name: 'CPU使用率', category: '监控', description: '获取CPU使用情况',
      command: 'top -bn1 | head -5',
      params: [],
      status: 'enabled' as const,
    },
    {
      id: 'svc-003', name: '磁盘空间', category: '存储', description: '检查磁盘使用情况',
      command: 'df -h',
      params: [],
      status: 'enabled' as const,
    },
    {
      id: 'svc-004', name: '进程列表', category: '进程', description: '获取运行进程列表',
      command: 'ps aux',
      params: [],
      status: 'enabled' as const,
    },
    {
      id: 'svc-005', name: '网络连接', category: '网络', description: '查看网络连接状态',
      command: 'netstat -tuln',
      params: [],
      status: 'enabled' as const,
    },
  ],
  accessLogs: [
    { id: 'log-001', resourceId: 'HOST-001', resourceName: '生产服务器-PROD-01', operator: 'admin', operation: 'SSH登录', result: 'success' as const, timestamp: generateTimeAgo(5), ip: '10.0.0.1', details: '通过密钥认证登录' },
    { id: 'log-002', resourceId: 'HOST-005', resourceName: '数据库服务器-DB-01', operator: 'app-user', operation: '数据库连接', result: 'success' as const, timestamp: generateTimeAgo(3), ip: '172.16.0.1', details: '应用连接数据库' },
    { id: 'log-003', resourceId: 'HOST-004', resourceName: '开发服务器-DEV-01', operator: 'dev-user', operation: 'SSH登录', result: 'failed' as const, timestamp: generateTimeAgo(10), ip: '192.168.1.50', details: '公钥认证失败' },
  ],
};

export const systemMock = {
  list: [
    { id: 'SYS-001', name: '认证服务-OAuth2', ip: '10.0.0.10', group: '身份认证', tags: ['OAuth2', 'SSO'], status: 'online' as const, createdAt: '2026-02-01 08:00:00', description: '统一身份认证服务' },
    { id: 'SYS-002', name: '配置中心-Config', ip: '10.0.0.11', group: '配置管理', tags: ['配置', 'Consul'], status: 'online' as const, createdAt: '2026-02-10 09:30:00', description: '分布式配置中心' },
    { id: 'SYS-003', name: '消息队列-RabbitMQ', ip: '10.0.0.12', group: '消息服务', tags: ['MQ', 'RabbitMQ'], status: 'online' as const, createdAt: '2026-02-15 14:00:00', description: '消息队列服务' },
    { id: 'SYS-004', name: 'API网关-APIGW', ip: '10.0.0.13', group: '网关', tags: ['API', 'Gateway'], status: 'warning' as const, createdAt: '2026-02-20 11:00:00', description: 'API网关服务' },
    { id: 'SYS-005', name: '服务注册-Eureka', ip: '10.0.0.14', group: '服务发现', tags: ['Eureka', 'Discovery'], status: 'online' as const, createdAt: '2026-02-25 10:00:00', description: '服务注册中心' },
    { id: 'SYS-006', name: '分布式追踪-Jaeger', ip: '10.0.0.15', group: '监控', tags: ['Tracing', 'Jaeger'], status: 'online' as const, createdAt: '2026-03-01 15:30:00', description: '分布式链路追踪' },
  ],
  groups: [
    { id: 'group-1', name: '身份认证', count: 1 },
    { id: 'group-2', name: '配置管理', count: 1 },
    { id: 'group-3', name: '消息服务', count: 1 },
    { id: 'group-4', name: '网关', count: 1 },
    { id: 'group-5', name: '服务发现', count: 1 },
    { id: 'group-6', name: '监控', count: 1 },
  ],
  tags: [
    { id: 'tag-1', name: 'OAuth2', color: 'blue' },
    { id: 'tag-2', name: 'SSO', color: 'green' },
    { id: 'tag-3', name: '配置', color: 'purple' },
    { id: 'tag-4', name: 'Consul', color: 'yellow' },
    { id: 'tag-5', name: 'MQ', color: 'cyan' },
    { id: 'tag-6', name: 'RabbitMQ', color: 'orange' },
    { id: 'tag-7', name: 'API', color: 'pink' },
    { id: 'tag-8', name: 'Gateway', color: 'indigo' },
  ],
  connectHistory: [
    { id: 'conn-001', resourceId: 'SYS-001', resourceName: '认证服务-OAuth2', protocol: 'HTTPS', address: '10.0.0.10:443', status: 'success' as const, responseTime: 12, timestamp: generateTimeAgo(3), message: '连接成功' },
    { id: 'conn-002', resourceId: 'SYS-003', resourceName: '消息队列-RabbitMQ', protocol: 'AMQP', address: '10.0.0.12:5672', status: 'success' as const, responseTime: 8, timestamp: generateTimeAgo(5), message: '连接成功' },
    { id: 'conn-003', resourceId: 'SYS-004', resourceName: 'API网关-APIGW', protocol: 'HTTPS', address: '10.0.0.13:443', status: 'warning' as const, responseTime: 200, timestamp: generateTimeAgo(1), message: '连接延迟较高' },
  ],
  authList: [
    { id: 'auth-001', resourceId: 'SYS-001', resourceName: '认证服务-OAuth2', authType: 'API密钥', permissions: ['read', 'write', 'manage'], expiresAt: '2026-12-31', status: 'active' as const, grantedBy: 'admin', grantedAt: '2026-01-01' },
    { id: 'auth-002', resourceId: 'SYS-003', resourceName: '消息队列-RabbitMQ', authType: '用户名密码', permissions: ['publish', 'consume'], expiresAt: '2026-09-30', status: 'active' as const, grantedBy: 'admin', grantedAt: '2026-03-15' },
  ],
  services: [
    {
      id: 'svc-001', name: '获取令牌', category: '认证', description: '获取OAuth2访问令牌',
      method: 'POST', path: '/oauth/token',
      params: [
        { name: 'grant_type', type: 'string', required: true, description: '授权类型' },
        { name: 'client_id', type: 'string', required: true, description: '客户端ID' },
        { name: 'client_secret', type: 'string', required: true, description: '客户端密钥' },
      ],
      status: 'enabled' as const,
    },
    {
      id: 'svc-002', name: '验证令牌', category: '认证', description: '验证访问令牌有效性',
      method: 'GET', path: '/oauth/introspect',
      params: [
        { name: 'token', type: 'string', required: true, description: '访问令牌' },
      ],
      status: 'enabled' as const,
    },
    {
      id: 'svc-003', name: '获取配置', category: '配置', description: '获取应用配置',
      method: 'GET', path: '/config/{app}/{env}',
      params: [
        { name: 'app', type: 'string', required: true, description: '应用名称' },
        { name: 'env', type: 'string', required: true, description: '环境' },
      ],
      status: 'enabled' as const,
    },
    {
      id: 'svc-004', name: '服务列表', category: '服务发现', description: '获取注册服务列表',
      method: 'GET', path: '/eureka/apps',
      params: [],
      status: 'enabled' as const,
    },
  ],
  accessLogs: [
    { id: 'log-001', resourceId: 'SYS-001', resourceName: '认证服务-OAuth2', operator: 'app-service', operation: '令牌获取', result: 'success' as const, timestamp: generateTimeAgo(1), ip: '172.16.0.1', details: 'client_id: myapp' },
    { id: 'log-002', resourceId: 'SYS-002', resourceName: '配置中心-Config', operator: 'app-service', operation: '配置读取', result: 'success' as const, timestamp: generateTimeAgo(2), ip: '172.16.0.1', details: 'app: auth-service, env: prod' },
    { id: 'log-003', resourceId: 'SYS-004', resourceName: 'API网关-APIGW', operator: 'external', operation: 'API调用', result: 'failed' as const, timestamp: generateTimeAgo(5), ip: '203.0.113.100', details: '限流拦截' },
  ],
};

export const endpointMock = {
  list: [
    { id: 'EP-001', name: '办公终端-WIN-001', ip: '192.168.100.1', group: '办公区', tags: ['Windows', '办公'], status: 'online' as const, createdAt: '2026-03-01 08:00:00', description: '行政办公终端' },
    { id: 'EP-002', name: '办公终端-WIN-002', ip: '192.168.100.2', group: '办公区', tags: ['Windows', '办公'], status: 'online' as const, createdAt: '2026-03-02 09:30:00', description: '财务办公终端' },
    { id: 'EP-003', name: '开发终端-MAC-001', ip: '192.168.100.3', group: '研发区', tags: ['macOS', '开发'], status: 'online' as const, createdAt: '2026-03-05 14:00:00', description: '开发人员终端' },
    { id: 'EP-004', name: '开发终端-MAC-002', ip: '192.168.100.4', group: '研发区', tags: ['macOS', '开发'], status: 'offline' as const, createdAt: '2026-03-08 11:20:00', description: '开发人员终端' },
    { id: 'EP-005', name: '运维终端-LINUX-001', ip: '192.168.100.5', group: '运维区', tags: ['Linux', '运维'], status: 'online' as const, createdAt: '2026-03-10 16:00:00', description: '运维管理终端' },
    { id: 'EP-006', name: '安全终端-SEC-001', ip: '192.168.100.6', group: '安全区', tags: ['Linux', '安全'], status: 'online' as const, createdAt: '2026-03-12 10:30:00', description: '安全分析终端' },
    { id: 'EP-007', name: '移动终端-IOS-001', ip: '10.0.0.200', group: '移动', tags: ['iOS', 'BYOD'], status: 'online' as const, createdAt: '2026-04-01 08:00:00', description: '员工移动设备' },
    { id: 'EP-008', name: '移动终端-ANDROID-001', ip: '10.0.0.201', group: '移动', tags: ['Android', 'BYOD'], status: 'warning' as const, createdAt: '2026-04-05 12:00:00', description: '员工移动设备' },
  ],
  groups: [
    { id: 'group-1', name: '办公区', count: 2 },
    { id: 'group-2', name: '研发区', count: 2 },
    { id: 'group-3', name: '运维区', count: 1 },
    { id: 'group-4', name: '安全区', count: 1 },
    { id: 'group-5', name: '移动', count: 2 },
  ],
  tags: [
    { id: 'tag-1', name: 'Windows', color: 'blue' },
    { id: 'tag-2', name: '办公', color: 'green' },
    { id: 'tag-3', name: 'macOS', color: 'purple' },
    { id: 'tag-4', name: '开发', color: 'yellow' },
    { id: 'tag-5', name: 'Linux', color: 'cyan' },
    { id: 'tag-6', name: '运维', color: 'orange' },
    { id: 'tag-7', name: '安全', color: 'red' },
    { id: 'tag-8', name: 'iOS', color: 'pink' },
    { id: 'tag-9', name: 'Android', color: 'indigo' },
    { id: 'tag-10', name: 'BYOD', color: 'gray' },
  ],
  connectHistory: [
    { id: 'conn-001', resourceId: 'EP-001', resourceName: '办公终端-WIN-001', protocol: 'RDP', address: '192.168.100.1:3389', status: 'success' as const, responseTime: 50, timestamp: generateTimeAgo(2), message: '连接成功' },
    { id: 'conn-002', resourceId: 'EP-003', resourceName: '开发终端-MAC-001', protocol: 'SSH', address: '192.168.100.3:22', status: 'success' as const, responseTime: 15, timestamp: generateTimeAgo(5), message: '连接成功' },
    { id: 'conn-003', resourceId: 'EP-004', resourceName: '开发终端-MAC-002', protocol: 'SSH', address: '192.168.100.4:22', status: 'failed' as const, responseTime: 5000, timestamp: generateTimeAgo(1), message: '目标离线' },
    { id: 'conn-004', resourceId: 'EP-008', resourceName: '移动终端-ANDROID-001', protocol: 'HTTPS', address: '10.0.0.201:443', status: 'warning' as const, responseTime: 150, timestamp: generateTimeAgo(3), message: '网络延迟较高' },
  ],
  authList: [
    { id: 'auth-001', resourceId: 'EP-001', resourceName: '办公终端-WIN-001', authType: '域账号', permissions: ['login', 'file_access'], expiresAt: '2026-12-31', status: 'active' as const, grantedBy: 'AD', grantedAt: '2026-03-01' },
    { id: 'auth-002', resourceId: 'EP-003', resourceName: '开发终端-MAC-001', authType: '本地账号', permissions: ['login', 'sudo'], expiresAt: '2026-09-30', status: 'active' as const, grantedBy: 'admin', grantedAt: '2026-03-05' },
    { id: 'auth-003', resourceId: 'EP-007', resourceName: '移动终端-IOS-001', authType: 'MDM', permissions: ['enroll', 'remote_wipe'], expiresAt: '2026-06-30', status: 'active' as const, grantedBy: 'it-support', grantedAt: '2026-04-01' },
  ],
  services: [
    {
      id: 'svc-001', name: '终端信息', category: '系统', description: '获取终端系统信息',
      command: 'systeminfo',
      params: [],
      status: 'enabled' as const,
    },
    {
      id: 'svc-002', name: '进程列表', category: '进程', description: '获取运行进程',
      command: 'tasklist',
      params: [],
      status: 'enabled' as const,
    },
    {
      id: 'svc-003', name: '服务状态', category: '服务', description: '查看系统服务状态',
      command: 'sc query',
      params: [],
      status: 'enabled' as const,
    },
    {
      id: 'svc-004', name: '磁盘使用', category: '存储', description: '检查磁盘空间',
      command: 'wmic logicaldisk get size,freespace,caption',
      params: [],
      status: 'enabled' as const,
    },
  ],
  accessLogs: [
    { id: 'log-001', resourceId: 'EP-001', resourceName: '办公终端-WIN-001', operator: 'user1', operation: '登录', result: 'success' as const, timestamp: generateTimeAgo(10), ip: '192.168.100.1', details: '域账号登录' },
    { id: 'log-002', resourceId: 'EP-003', resourceName: '开发终端-MAC-001', operator: 'dev1', operation: '登录', result: 'success' as const, timestamp: generateTimeAgo(5), ip: '192.168.100.3', details: '本地账号登录' },
    { id: 'log-003', resourceId: 'EP-004', resourceName: '开发终端-MAC-002', operator: 'dev2', operation: '登录', result: 'failed' as const, timestamp: generateTimeAgo(8), ip: '192.168.100.4', details: '密码错误' },
    { id: 'log-004', resourceId: 'EP-007', resourceName: '移动终端-IOS-001', operator: 'mobile-user', operation: '设备注册', result: 'success' as const, timestamp: generateTimeAgo(30), ip: '10.0.0.200', details: 'MDM注册成功' },
  ],
};

export const getResourceMock = (type: ResourceType) => {
  switch (type) {
    case 'device': return deviceMock;
    case 'host': return hostMock;
    case 'system': return systemMock;
    case 'endpoint': return endpointMock;
  }
};