#!/bin/bash
# ============================================================
# 一键部署静态文件到服务器
# 用法：./scripts/deploy-static.sh
# ============================================================

set -e

# 配置 - 请修改为实际值
SERVER="user@server-ip"
REMOTE_DIR="/opt/frontend"

echo "========================================="
echo "🚀 部署静态文件"
echo "========================================="

# 1. 清理
echo "🧹 清理旧产物..."
rm -rf out

# 2. 构建
echo "🏗️  构建静态文件..."
npm run build

if [ ! -d "out" ]; then
  echo "❌ 构建失败：未找到 out/ 目录"
  exit 1
fi

# 3. 上传
echo "☁️  上传到服务器 $SERVER:$REMOTE_DIR ..."
ssh $SERVER "mkdir -p $REMOTE_DIR && rm -rf $REMOTE_DIR/*"
scp -r out/* $SERVER:$REMOTE_DIR/

# 4. 重载 Nginx（可选）
echo "♻️  重载 Nginx..."
ssh $SERVER "sudo nginx -t && sudo nginx -s reload" || echo "⚠️ Nginx 重载失败，请手动检查"

echo "========================================="
echo "✅ 部署完成！"
echo "========================================="
echo "🌐 访问：http://$SERVER:9528"
echo "📂 产物目录：$REMOTE_DIR"
