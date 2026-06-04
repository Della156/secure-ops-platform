'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Edit, Trash2,
  BookOpen, Star, Tag, Calendar, User, ChevronRight, ChevronDown,
  Shield, Server, Database, Network, Zap, AlertCircle, FileText,
  Award, Bookmark, ThumbsUp, MessageSquare, BarChart3, Lightbulb,
  TrendingUp, ListTree, CheckCircle2, XCircle, Clock
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  category: '场景模板' | '失败案例' | '最佳实践' | '复盘文档' | 'SOP' | '常见问题';
  tags: string[];
  author: string;
  authorRole: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  bookmarks: number;
  comments: number;
  rating: number; // 0-5
  difficulty: '入门' | '中级' | '高级' | '专家';
  estimatedTime: string;
  relatedScenarios: number;
  appliedCount: number; // 被引用次数
  excerpt: string;
}

const knowledge: KnowledgeItem[] = [
  {
    id: 'KB-001',
    title: '金融核心系统全链路灾备切换 SOP',
    category: 'SOP',
    tags: ['金融', '核心系统', '灾备', '全链路', 'RPO/RTO'],
    author: '张伟',
    authorRole: '灾备主管',
    createdAt: '2025-12-15',
    updatedAt: '2026-05-20',
    views: 1248,
    likes: 89,
    bookmarks: 156,
    comments: 23,
    rating: 4.8,
    difficulty: '高级',
    estimatedTime: '阅读 25 分钟',
    relatedScenarios: 8,
    appliedCount: 142,
    excerpt: '完整的金融核心系统灾备切换 SOP，包含预检清单（38 项）、切换步骤（18 步）、回切步骤（7 步）、异常处理（12 个场景）。实测 RPO=0s, RTO=8min。',
  },
  {
    id: 'KB-002',
    title: 'Oracle RMAN 恢复失败案例：归档日志缺失',
    category: '失败案例',
    tags: ['Oracle', 'RMAN', '归档日志', '失败案例', 'ROOT CAUSE'],
    author: '王芳',
    authorRole: 'DBA 专家',
    createdAt: '2026-06-02',
    updatedAt: '2026-06-02',
    views: 326,
    likes: 45,
    bookmarks: 78,
    comments: 12,
    rating: 4.5,
    difficulty: '高级',
    estimatedTime: '阅读 12 分钟',
    relatedScenarios: 5,
    appliedCount: 18,
    excerpt: '2026-06-02 Oracle RPO/RTO 演练失败案例。根因：14:35-14:42 归档日志未上传至备份服务器。改进：归档日志上传增加实时校验告警；灾备中心预装 RMAN catalog。',
  },
  {
    id: 'KB-003',
    title: '最佳实践：演练预检查清单 12 大类',
    category: '最佳实践',
    tags: ['预检清单', '最佳实践', '演练准备', '模板'],
    author: '陈磊',
    authorRole: '运维专家',
    createdAt: '2025-11-20',
    updatedAt: '2026-04-10',
    views: 2148,
    likes: 168,
    bookmarks: 245,
    comments: 56,
    rating: 4.9,
    difficulty: '入门',
    estimatedTime: '阅读 18 分钟',
    relatedScenarios: 24,
    appliedCount: 386,
    excerpt: '12 大类 156 项预检查清单：环境健康 / 网络 / 存储 / 数据库 / 应用 / 安全 / 备份 / 监控 / 文档 / 人员 / 通讯 / 应急。模板可直接复用。',
  },
  {
    id: 'KB-004',
    title: 'AD 域控制器容灾切换完整方案',
    category: '场景模板',
    tags: ['AD', '域控', '容灾', '场景模板'],
    author: '刘洋',
    authorRole: '系统工程师',
    createdAt: '2025-10-08',
    updatedAt: '2026-03-15',
    views: 845,
    likes: 67,
    bookmarks: 98,
    comments: 18,
    rating: 4.6,
    difficulty: '中级',
    estimatedTime: '阅读 20 分钟',
    relatedScenarios: 6,
    appliedCount: 52,
    excerpt: 'AD 域控制器容灾切换完整方案：主备切换 / 强制切换 / DNS 同步 / FSMO 角色转移 / 时间同步 / 客户端重连。',
  },
  {
    id: 'KB-005',
    title: 'Web 集群自动伸缩演练常见 5 大问题',
    category: '常见问题',
    tags: ['Web', '自动伸缩', 'K8s', 'FAQ'],
    author: '李娜',
    authorRole: '应用专家',
    createdAt: '2026-01-12',
    updatedAt: '2026-05-30',
    views: 562,
    likes: 89,
    bookmarks: 67,
    comments: 24,
    rating: 4.4,
    difficulty: '中级',
    estimatedTime: '阅读 10 分钟',
    relatedScenarios: 4,
    appliedCount: 28,
    excerpt: 'Q1: 节点启动超时？A: 增加 readinessProbe 等待时间。Q2: 负载均衡未切换？A: 检查健康检查间隔...',
  },
  {
    id: 'KB-006',
    title: '防火墙 HA 切换演练复盘',
    category: '复盘文档',
    tags: ['防火墙', 'HA', '复盘', '网络'],
    author: '李娜',
    authorRole: '网络专家',
    createdAt: '2026-05-31',
    updatedAt: '2026-05-31',
    views: 142,
    likes: 18,
    bookmarks: 32,
    comments: 6,
    rating: 4.2,
    difficulty: '入门',
    estimatedTime: '阅读 8 分钟',
    relatedScenarios: 2,
    appliedCount: 8,
    excerpt: '2026-05-31 防火墙 HA 切换演练复盘：主备切换时间 18s，验证通过。改进：增加 BGP 路由切换的预演练。',
  },
  {
    id: 'KB-007',
    title: 'DDoS 攻击下的应急切换方案',
    category: '场景模板',
    tags: ['DDoS', '应急', '场景', '网络'],
    author: '王芳',
    authorRole: '安全专家',
    createdAt: '2025-09-15',
    updatedAt: '2026-02-20',
    views: 678,
    likes: 56,
    bookmarks: 89,
    comments: 15,
    rating: 4.7,
    difficulty: '专家',
    estimatedTime: '阅读 30 分钟',
    relatedScenarios: 3,
    appliedCount: 12,
    excerpt: 'DDoS 攻击下的 4 阶段应急切换：流量牵引 → 清洗 → 业务回切 → 监控强化。',
  },
  {
    id: 'KB-008',
    title: 'MySQL 主从切换 8 大陷阱',
    category: '失败案例',
    tags: ['MySQL', '主从', '切换', '陷阱'],
    author: '王芳',
    authorRole: 'DBA 专家',
    createdAt: '2025-08-10',
    updatedAt: '2026-04-05',
    views: 945,
    likes: 78,
    bookmarks: 112,
    comments: 32,
    rating: 4.8,
    difficulty: '高级',
    estimatedTime: '阅读 22 分钟',
    relatedScenarios: 6,
    appliedCount: 45,
    excerpt: '8 大陷阱：半同步延迟、relay log 损坏、GTID 跳号、双写、脑裂、时钟漂移、连接泄漏、版本不一致。',
  },
];

const categoryColor: Record<KnowledgeItem['category'], string> = {
  '场景模板': '#0066FF',
  '失败案例': '#EF4444',
  '最佳实践': '#22C55E',
  '复盘文档': '#FF6D00',
  'SOP': '#9333EA',
  '常见问题': '#EAB308',
};

const difficultyColor: Record<KnowledgeItem['difficulty'], string> = {
  '入门': 'bg-green-500/20 text-green-400',
  '中级': 'bg-blue-500/20 text-blue-400',
  '高级': 'bg-orange-500/20 text-orange-400',
  '专家': 'bg-red-500/20 text-red-400',
};

// 分类统计
const categoryStats = [
  { name: 'SOP', count: 12, color: '#9333EA' },
  { name: '失败案例', count: 24, color: '#EF4444' },
  { name: '场景模板', count: 18, color: '#0066FF' },
  { name: '最佳实践', count: 15, color: '#22C55E' },
  { name: '复盘文档', count: 32, color: '#FF6D00' },
  { name: '常见问题', count: 8, color: '#EAB308' },
];

export function DrillKnowledgeBase() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('KB-001');

  const filtered = knowledge.filter(k => {
    if (search && !k.title.includes(search) && !k.tags.some(t => t.includes(search))) return false;
    if (categoryFilter !== 'all' && k.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && k.difficulty !== difficultyFilter) return false;
    return true;
  });

  const selected = selectedId ? knowledge.find(k => k.id === selectedId) : null;
  const totalKnowledge = 109; // 累计
  const totalApplied = knowledge.reduce((s, k) => s + k.appliedCount, 0);

  return (
    <div className="p-6 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="知识条目" value={totalKnowledge} color="#0066FF" icon={<BookOpen className="w-4 h-4" />} />
        <StatBox label="本月新增" value={8} color="#22C55E" icon={<Plus className="w-4 h-4" />} />
        <StatBox label="本月引用" value={42} color="#FF6D00" icon={<TrendingUp className="w-4 h-4" />} />
        <StatBox label="精选贡献者" value={12} color="#9333EA" icon={<Award className="w-4 h-4" />} />
        <StatBox label="累计应用" value={totalApplied} color="#06B6D4" icon={<Lightbulb className="w-4 h-4" />} />
      </div>

      {/* 分类分布 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400" />知识分类分布</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {categoryStats.map(c => (
            <button
              key={c.name}
              onClick={() => setCategoryFilter(c.name)}
              className={`bg-[#111625] rounded p-2.5 text-center border ${
                categoryFilter === c.name ? 'border-blue-500' : 'border-[#2A354D] hover:border-blue-500/50'
              }`}
            >
              <div className="text-2xl font-bold" style={{ color: c.color }}>{c.count}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 搜索过滤 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">演练知识库</h2>
            <p className="text-xs text-slate-500 mt-1">SOP / 失败案例 / 最佳实践 / 场景模板 / 复盘文档 — 6 大类结构化知识</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />贡献知识
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索标题/标签"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类别</option>
            <option value="SOP">SOP</option>
            <option value="失败案例">失败案例</option>
            <option value="最佳实践">最佳实践</option>
            <option value="场景模板">场景模板</option>
            <option value="复盘文档">复盘文档</option>
            <option value="常见问题">常见问题</option>
          </select>
          <select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部难度</option>
            <option value="入门">入门</option>
            <option value="中级">中级</option>
            <option value="高级">高级</option>
            <option value="专家">专家</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 知识列表 */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map(k => (
            <div
              key={k.id}
              onClick={() => setSelectedId(k.id)}
              className={`bg-[#20293F] border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedId === k.id ? 'border-blue-500' : 'border-[#2A354D] hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{k.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0" style={{ background: `${categoryColor[k.category]}20`, color: categoryColor[k.category] }}>
                  {k.category}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${difficultyColor[k.difficulty]}`}>
                  {k.difficulty}
                </span>
                <div className="flex-1" />
                <div className="flex items-center gap-0.5 text-yellow-400 text-xs">
                  {'★'.repeat(Math.floor(k.rating))}<span className="text-slate-500 ml-0.5">{k.rating}</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{k.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{k.excerpt}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {k.tags.slice(0, 5).map(t => (
                  <span key={t} className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-[#111625] text-slate-400 rounded">
                    <Tag className="w-2 h-2" />{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span><User className="w-2.5 h-2.5 inline mr-0.5" />{k.author} · {k.authorRole}</span>
                  <span>·</span>
                  <span>{k.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span title="浏览"><Eye className="w-2.5 h-2.5 inline mr-0.5" />{k.views}</span>
                  <span title="点赞"><ThumbsUp className="w-2.5 h-2.5 inline mr-0.5" />{k.likes}</span>
                  <span title="收藏"><Bookmark className="w-2.5 h-2.5 inline mr-0.5" />{k.bookmarks}</span>
                  <span title="应用" className="text-green-400"><Lightbulb className="w-2.5 h-2.5 inline mr-0.5" />{k.appliedCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 详情 */}
        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3 sticky top-4 self-start">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${categoryColor[selected.category]}20`, color: categoryColor[selected.category] }}>
                  {selected.category}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${difficultyColor[selected.difficulty]}`}>
                  {selected.difficulty}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{selected.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{selected.excerpt}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {selected.tags.map(t => (
                <span key={t} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-[#111625] text-slate-300 rounded">
                  <Tag className="w-2.5 h-2.5" />{t}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">作者</div>
                <div className="text-yellow-300">{selected.author}</div>
                <div className="text-[10px] text-slate-500">{selected.authorRole}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">创建/更新</div>
                <div className="text-slate-200 text-[10px] font-mono">{selected.createdAt}</div>
                <div className="text-slate-500 text-[10px] font-mono">→ {selected.updatedAt}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
              <div className="bg-[#111625] rounded p-1.5">
                <Eye className="w-3 h-3 text-blue-400 mx-auto mb-0.5" />
                <div className="text-sm font-semibold text-white">{selected.views}</div>
                <div className="text-[9px] text-slate-500">浏览</div>
              </div>
              <div className="bg-[#111625] rounded p-1.5">
                <ThumbsUp className="w-3 h-3 text-green-400 mx-auto mb-0.5" />
                <div className="text-sm font-semibold text-white">{selected.likes}</div>
                <div className="text-[9px] text-slate-500">点赞</div>
              </div>
              <div className="bg-[#111625] rounded p-1.5">
                <Bookmark className="w-3 h-3 text-yellow-400 mx-auto mb-0.5" />
                <div className="text-sm font-semibold text-white">{selected.bookmarks}</div>
                <div className="text-[9px] text-slate-500">收藏</div>
              </div>
              <div className="bg-[#111625] rounded p-1.5">
                <MessageSquare className="w-3 h-3 text-purple-400 mx-auto mb-0.5" />
                <div className="text-sm font-semibold text-white">{selected.comments}</div>
                <div className="text-[9px] text-slate-500">评论</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">相关场景</div>
                <div className="text-blue-300 font-mono">{selected.relatedScenarios}</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                <div className="text-slate-500 mb-0.5">应用次数</div>
                <div className="text-green-400 font-mono">{selected.appliedCount}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                <BookOpen className="w-3 h-3" />查看详情
              </button>
              <button className="px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md" title="收藏">
                <Bookmark className="w-3 h-3" />
              </button>
              <button className="px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md" title="点赞">
                <ThumbsUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default DrillKnowledgeBase;
