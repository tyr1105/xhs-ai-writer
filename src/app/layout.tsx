import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "小红书AI文案生成器 - 一键生成爆款笔记",
  description:
    "免费AI小红书文案生成工具，支持美食、旅行、穿搭、美妆、数码等多个分类，一键生成吸引人的小红书笔记标题、正文和话题标签。",
  keywords: [
    "小红书文案",
    "AI文案生成",
    "小红书爆款",
    "笔记文案",
    "AI写作",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        {children}
      </body>
    </html>
  );
}
