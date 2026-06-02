#!/bin/bash
# ============================================================
# 构建静态文件脚本
# 用法：./scripts/build-static.sh
# ============================================================

set -e

echo "========================================="
echo "🏗️  构建静态文件"
echo "========================================="

# 1. 清理
echo "🧹 清理旧产物..."
rm -rf .next out

# 2. 类型检查
echo "🔍 类型检查..."
npx tsc --noEmit

# 3. 构建
echo "📦 构建静态文件..."
npm run build

# 4. 检查产物
if [ ! -d "out" ]; then
  echo "❌ 构建失败：未找到 out/ 目录"
  exit 1
fi

# 5. 显示产物信息
echo ""
echo "========================================="
echo "✅ 构建完成！"
echo "========================================="
echo ""
echo "📂 产物目录：./out"
echo "📦 产物大小：$(du -sh out | cut -f1)"
echo "📄 文件数量：$(find out -type f | wc -l)"
echo ""
echo "🚀 部署到服务器："
echo "   scp -r out/* user@server:/opt/frontend/"
echo ""
echo "🧪 本地预览："
echo "   npx serve out -l 3000"
echo ""
echo "📋 out/ 目录内容："
ls -la out/ | head -20
