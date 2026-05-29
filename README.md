# 小红书AI文案生成器 (XHS AI Writer)

> 一键生成爆款小红书笔记文案，支持10大分类、5种风格、3种篇幅

## ✨ 功能特点

- 🎯 **10大内容分类**：美食、旅行、穿搭、美妆、数码、家居、健身、育儿、职场、日常
- 🎨 **5种文案风格**：活泼可爱、专业干货、温柔治愈、搞笑有趣、文艺清新
- 📏 **3种篇幅选择**：精简版(150字)、标准版(300-500字)、详细版(500-800字)
- 📋 **一键复制**：标题、正文、标签、全部文案一键复制
- 🖼️ **配图建议**：AI自动生成封面图拍摄建议
- 💰 **免费使用**：每日3次免费生成

## 🚀 快速部署

### 环境要求
- Node.js 18+
- DeepSeek API Key

### 一键部署到 Vercel

```bash
# 1. 克隆项目
git clone <repo-url>
cd xhs-ai-writer

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 DeepSeek API Key

# 4. 部署
npx vercel --prod
```

### 本地开发

```bash
npm run dev
# 访问 http://localhost:3000
```

## 💰 变现策略

1. **广告收入**：接入Google AdSense / 百度联盟
2. **会员订阅**：月费¥29/月，无限生成
3. **API接口**：提供给其他开发者按调用计费
4. **私域引流**：引导用户加微信群，后续转化

## 📈 推广渠道

- 小红书自身发帖（用工具生成的内容直接发布）
- 抖音/视频号短视频展示效果
- 微信公众号SEO
- 知乎回答相关问题
- B站教程视频

## 技术栈

- Next.js 16 (App Router)
- Tailwind CSS
- DeepSeek API
- Vercel部署

## License

MIT
