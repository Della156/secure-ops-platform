# 静态部署指南

## 概述

本项目使用 Next.js 静态导出（Static Export）模式，构建产物为纯静态的 `out/` 目录，可直接部署到任何静态文件服务器（Nginx、Apache、CDN 等），**无需 Node.js 运行环境**。

## 一、本地构建

```bash
# 方式 1：使用脚本（推荐）
./scripts/build-static.sh

# 方式 2：直接命令
npm run build
```

构建完成后，产物在 `out/` 目录：

```
out/
├── index.html
├── _next/
│   ├── static/      # CSS、JS、图片等静态资源
│   └── ...
├── module-1/        # 各业务模块页面
├── module-2/
└── ...
```

## 二、本地预览

```bash
# 方式 1：使用 serve
npx serve out -l 3000

# 方式 2：使用 Python
cd out && python3 -m http.server 3000

# 访问：http://localhost:3000
```

## 三、部署到服务器

### Step 1: 构建静态文件

```bash
# 在本地项目根目录
./scripts/build-static.sh
```

### Step 2: 上传到服务器

```bash
# 确保服务器上 /opt/frontend 目录已存在
ssh user@server "sudo mkdir -p /opt/frontend && sudo chown -R \$USER:\$USER /opt/frontend"

# 上传产物
scp -r out/* user@server:/opt/frontend/
```

### Step 3: 配置 Nginx

```nginx
# /etc/nginx/conf.d/secure-ops-platform.conf
# 或 /etc/nginx/sites-available/secure-ops-platform

server {
    listen       9528;
    server_name  localhost;

    # 前端静态文件
    location / {
        root   /opt/frontend;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root   /opt/frontend;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 后端 API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:8088;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        client_max_body_size 1024m;
        proxy_connect_timeout 600;
        proxy_send_timeout 3600;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 错误页面
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /opt/frontend;
    }
}
```

### Step 4: 重载 Nginx

```bash
# 测试配置
sudo nginx -t

# 重载
sudo nginx -s reload
```

## 四、访问应用

浏览器访问：`http://server-ip:9528`

## 五、完整部署脚本

如果想要一键完成"构建 + 上传 + 重载"，可以创建：

```bash
#!/bin/bash
# scripts/deploy-static.sh
set -e

SERVER="user@server-ip"
REMOTE_DIR="/opt/frontend"

echo "🏗️  构建静态文件..."
rm -rf out
npm run build

echo "☁️  上传到服务器..."
ssh $SERVER "mkdir -p $REMOTE_DIR && rm -rf $REMOTE_DIR/*"
scp -r out/* $SERVER:$REMOTE_DIR/

echo "♻️  重载 Nginx..."
ssh $SERVER "sudo nginx -s reload"

echo "✅ 部署完成！访问 http://server-ip:9528"
```

## 六、与 Vue 项目的对比

| 步骤 | Vue 项目 | Next.js 本项目 |
|------|---------|----------------|
| 构建命令 | `npm run build` | `npm run build` |
| 产物目录 | `dist/` | `out/` |
| 部署方式 | 复制到 nginx 静态目录 | 复制到 nginx 静态目录 |
| 需要 Node.js | ❌ | ❌ |
| 配置文件 | `vue.config.js` | `next.config.ts` |

**完全一致！** 🎉

## 七、常见问题

### Q1: 刷新页面 404？

A: 确保 nginx 配置中有 `try_files $uri $uri/ /index.html;`

### Q2: 路由跳转后刷新 404？

A: Next.js 静态导出的路由会生成对应的 HTML 文件（如 `out/module-1/index.html`），浏览器刷新时访问 `/module-1/`，nginx 会自动找到该文件。

### Q3: 静态导出后还有 API 调用怎么办？

A: 通过 nginx 的 `/api/` 路径反向代理到后端服务（本项目风险评分、数据等都需要后端 API）。

### Q4: 是否支持 HTTPS？

A: 支持。nginx 端配置 SSL 证书即可，静态文件本身无影响。

### Q5: 部署后如何更新？

A: 重新运行 `./scripts/build-static.sh`，然后再次 `scp -r out/*` 即可，无需重启服务。
