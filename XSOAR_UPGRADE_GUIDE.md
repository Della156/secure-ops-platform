# XSOAR 化改造指南（Trae 页面全部生成后执行）

## 目标
在不重新生成每个页面的前提下，通过 CSS 变量 + 批量替换，将全部 57 个页面的配色体系切换为 XSOAR 风格。

## 改造步骤

### 步骤1：替换 globals.css 中的 color definitions (Tailwind v4 `@theme inline`)

```css
@import "tailwindcss";

@theme inline {
  --color-background: #111625;     /* 原 #0f172a → XSOAR 冷调深夜蓝 */
  --color-foreground: #F3F4F6;     /* 原 #f8fafc → 冰川白 */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
}
```

### 步骤2：注册 Design Tokens 到 globals.css

```css
/* ===== XSOAR 设计系统变量 ===== */
:root {
  /* 基础背景层 */
  --bg-main: #111625;          /* 画布背景 */
  --bg-surface: #181F32;       /* 面板/工作区 */
  --bg-card: #20293F;          /* 卡片/菜单底色 */

  /* 边框与连线 */
  --border-light: #2A354D;     /* 默认边框 */
  --border-focus: #0066FF;     /* 激活态边框 */

  /* 文本层级 */
  --text-primary: #F3F4F6;     /* 主标题/代码 */
  --text-secondary: #9CA3AF;   /* 描述/时间戳 */
  --text-muted: #6B7280;       /* 禁用状态 */

  /* 语义资产色 — XSOAR 经典 */
  --color-primary: #0066FF;    /* 核心行动点 */
  --color-ai: #6366F1;         /* AI 智能体专用 */
  --color-success: #00C853;    /* 正常/通过 */
  --color-warning: #FF9100;    /* 审批/异常 */
  --color-danger: #FF3B30;     /* 失败/高危 */
}

/* 极细滚动条 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #2A354D;
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3A4560;
}

/* 点阵网格背景（用于编排画布） */
.bg-dot-grid {
  background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0);
  background-size: 20px 20px;
}
```

### 步骤3：批量替换色值（使用 search_replace 工具）

Trae 生成的页面中，颜色是以 Tailwind 类名硬编码的。全部替换为 XSOAR 色值：

```bash
# 不需要逐个改，以下 6 条 search_replace 覆盖 95% 的页面
```

| 替换前（Tailwind） | 替换后（XSOAR） | 对应 Token |
|------------------|----------------|-----------|
| `bg-slate-950` | `bg-[#111625]` | `--bg-main` |
| `bg-slate-900` | `bg-[#20293F]` | `--bg-card` |
| `bg-slate-800` | `bg-[#181F32]` | `--bg-surface` |
| `bg-slate-700` 或 `border-slate-700` | `border-[#2A354D]` | `--border-light` |
| `text-slate-100` 或 `text-white` | `text-[#F3F4F6]` | `--text-primary` |
| `text-slate-400` | `text-[#9CA3AF]` | `--text-secondary` |
| `text-slate-500` | `text-[#6B7280]` | `--text-muted` |
| `bg-blue-600` 或 `bg-blue-500` | `bg-[#0066FF]` | `--color-primary` |
| `text-blue-400` | `text-[#0066FF]` | `--color-primary` |
| `bg-green-500` 效果 | `bg-[#00C853]` | `--color-success` |
| `text-red-400` | `text-[#FF3B30]` | `--color-danger` |
| `border-slate-800` | `border-[#2A354D]` | `--border-light` |

**注意**：Tailwind v4 使用 `@theme inline` 时，`bg-slate-900` 等不能直接改 CSS 变量覆盖——因为这些色值不是通过变量引用的，而是 Tailwind 内置色板。最稳妥的方案是**直接写十六进制类名** `bg-[#20293F]`。

### 步骤4：新增 XSOAR 专属组件类

在 `globals.css` 中添加：

```css
/* 智能体节点卡片左侧标识条 */
.agent-bar-blue { border-left: 4px solid #0066FF; }
.agent-bar-purple { border-left: 4px solid #6366F1; }
.agent-bar-red { border-left: 4px solid #FF3B30; }

/* 状态胶囊标签（低透明度背景） */
.badge-success {
  background: rgba(0, 200, 83, 0.1);
  color: #00C853;
  border: 1px solid rgba(0, 200, 83, 0.2);
}
.badge-danger {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
  border: 1px solid rgba(255, 59, 48, 0.2);
}

/* Modal/浮层光晕边框（无纯黑阴影） */
.glow-focus {
  box-shadow: 0 0 12px 0 rgba(0, 102, 255, 0.12);
}
```

### 步骤5：组件层面的增强

如需进一步「XSOAR 化」，在核心编排画布类组件中追加：

```tsx
// 画布背景：点阵网格
<div className="bg-[#111625] bg-dot-grid">
  {/* 画布内容 */}
</div>

// 智能体卡片：左侧彩色条
<div className="bg-[#20293F] border border-[#2A354D] rounded-[4px] agent-bar-blue">
  ...
</div>
```
