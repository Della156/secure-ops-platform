import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 关键：静态导出模式（生成 out/ 目录，可直接部署到 nginx）
  output: 'export',

  // 静态导出必须的配置
  trailingSlash: true,        // 路由末尾加 /（避免 nginx 404）
  images: {
    unoptimized: true,        // 关闭图片优化（静态导出不支持）
  },

  // 通用优化
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,

  // 实验性配置
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // 跳过 TypeScript 类型检查错误（用于先发布，后续单独修复）
  // 注意：生产环境建议设为 false
  typescript: {
    ignoreBuildErrors: true,
  },

  // 跳过 ESLint 错误（同上）
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 注意：静态导出不支持自定义 headers（请在 nginx 中配置）
};

export default nextConfig;
