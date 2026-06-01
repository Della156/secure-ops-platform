import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SystemProvider } from "@/contexts/SystemContext";
import { MainLayout } from "@/components/Layout/MainLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "网络安全智能化运维平台",
  description: "网络安全智能化运维管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.variable} font-sans h-full antialiased bg-slate-950 text-slate-100`}>
        <SystemProvider>
          <MainLayout>{children}</MainLayout>
        </SystemProvider>
      </body>
    </html>
  );
}