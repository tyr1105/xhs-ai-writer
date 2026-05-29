"use client";

import { useState, useCallback } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Hash,
  Image,
  ChevronDown,
  Zap,
  Star,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

// 分类配置
const categories = [
  { id: "美食", emoji: "🍜", label: "美食" },
  { id: "旅行", emoji: "✈️", label: "旅行" },
  { id: "穿搭", emoji: "👗", label: "穿搭" },
  { id: "美妆", emoji: "💄", label: "美妆" },
  { id: "数码", emoji: "📱", label: "数码" },
  { id: "家居", emoji: "🏠", label: "家居" },
  { id: "健身", emoji: "💪", label: "健身" },
  { id: "育儿", emoji: "👶", label: "育儿" },
  { id: "职场", emoji: "💼", label: "职场" },
  { id: "日常", emoji: "✨", label: "日常" },
];

const styles = ["活泼可爱", "专业干货", "温柔治愈", "搞笑有趣", "文艺清新"];
const lengths = [
  { id: "短", label: "精简版", desc: "150字以内" },
  { id: "中", label: "标准版", desc: "300-500字" },
  { id: "长", label: "详细版", desc: "500-800字" },
];

// 生成结果类型
interface GenerateResult {
  title: string;
  content: string;
  tags: string[];
  coverTips: string;
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("美食");
  const [style, setStyle] = useState("活泼可爱");
  const [length, setLength] = useState("中");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 免费使用次数
  const [freeCount, setFreeCount] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("xhs_free_count");
      const savedDate = localStorage.getItem("xhs_free_date");
      const today = new Date().toDateString();
      if (savedDate !== today) return 3;
      return saved ? parseInt(saved) : 3;
    }
    return 3;
  });

  const updateFreeCount = useCallback((count: number) => {
    setFreeCount(count);
    if (typeof window !== "undefined") {
      localStorage.setItem("xhs_free_count", count.toString());
      localStorage.setItem("xhs_free_date", new Date().toDateString());
    }
  }, []);

  // 生成文案
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("请输入笔记主题");
      return;
    }

    if (freeCount <= 0) {
      setError("今日免费次数已用完，明天再来吧！");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category, style, keywords, length }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "生成失败，请重试");
        return;
      }

      setResult(data.data);
      updateFreeCount(freeCount - 1);
    } catch {
      setError("网络错误，请检查网络连接后重试");
    } finally {
      setLoading(false);
    }
  };

  // 复制功能
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // 复制全部文案
  const copyAll = () => {
    if (!result) return;
    const fullText = `${result.title}\n\n${result.content}\n\n${result.tags.map((t) => `#${t}`).join(" ")}`;
    copyToClipboard(fullText, "all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">小红书AI文案</h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>
              今日剩余{" "}
              <span className={`font-bold ${freeCount > 1 ? "text-red-500" : "text-amber-500"}`}>
                {freeCount}
              </span>{" "}
              次
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Hero 区域 */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            ✨ AI一键生成爆款笔记
          </h2>
          <p className="text-gray-500 text-sm">
            输入主题，AI帮你写出吸引人的小红书文案
          </p>
        </div>

        {/* 输入区域 */}
        <div className="xhs-card p-5 space-y-5">
          {/* 主题输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 笔记主题
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：探店网红咖啡厅 / 三亚5天4晚攻略 / MAC口红试色"
              className="xhs-input"
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {topic.length}/100
            </div>
          </div>

          {/* 分类选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏷️ 笔记分类
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`category-tag ${category === cat.id ? "active" : ""}`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 风格选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎨 文案风格
            </label>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`category-tag ${style === s ? "active" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 高级选项 */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              />
              高级选项
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4">
                {/* 篇幅选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📏 篇幅
                  </label>
                  <div className="flex gap-2">
                    {lengths.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLength(l.id)}
                        className={`category-tag flex-1 text-center ${length === l.id ? "active" : ""}`}
                      >
                        <div className="font-medium">{l.label}</div>
                        <div className="text-xs opacity-70">{l.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 关键词 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔑 关键词（可选）
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="用逗号分隔，如：高颜值,拍照出片,人均50"
                    className="xhs-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim() || freeCount <= 0}
            className="btn-xhs w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                AI正在创作中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                生成文案
              </>
            )}
          </button>

          {/* 错误提示 */}
          {error && (
            <div className="text-center text-red-500 text-sm bg-red-50 rounded-lg py-2 px-4">
              {error}
            </div>
          )}
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-8 space-y-3">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-gray-500 text-sm">
              AI正在为你创作{category}文案，请稍候...
            </p>
          </div>
        )}

        {/* 生成结果 */}
        {result && !loading && (
          <div className="space-y-4">
            {/* 成功提示 */}
            <div className="text-center text-sm text-green-600 bg-green-50 rounded-lg py-2 px-4 flex items-center justify-center gap-1">
              <Check className="w-4 h-4" />
              文案生成成功！点击各部分可一键复制
            </div>

            {/* 标题 */}
            <div className="result-section group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  笔记标题
                </div>
                <button
                  onClick={() => copyToClipboard(result.title, "title")}
                  className={`copy-btn flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${
                    copiedField === "title"
                      ? "copied text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {copiedField === "title" ? (
                    <>
                      <Check className="w-3 h-3" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> 复制
                    </>
                  )}
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-800 leading-relaxed">
                {result.title}
              </h3>
            </div>

            {/* 正文 */}
            <div className="result-section">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  笔记正文
                </div>
                <button
                  onClick={() => copyToClipboard(result.content, "content")}
                  className={`copy-btn flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${
                    copiedField === "content"
                      ? "copied text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {copiedField === "content" ? (
                    <>
                      <Check className="w-3 h-3" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> 复制
                    </>
                  )}
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result.content}
              </div>
            </div>

            {/* 话题标签 */}
            <div className="result-section">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Hash className="w-4 h-4" />
                  话题标签
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      result.tags.map((t) => `#${t}`).join(" "),
                      "tags"
                    )
                  }
                  className={`copy-btn flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${
                    copiedField === "tags"
                      ? "copied text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {copiedField === "tags" ? (
                    <>
                      <Check className="w-3 h-3" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> 复制
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap">
                {result.tags.map((tag, i) => (
                  <span key={i} className="hashtag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 配图建议 */}
            <div className="result-section">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                <Image className="w-4 h-4" />
                配图建议
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {result.coverTips}
              </p>
            </div>

            {/* 操作栏 */}
            <div className="flex gap-3">
              <button
                onClick={copyAll}
                className={`copy-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium ${
                  copiedField === "all"
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-red-500 to-orange-400 text-white"
                }`}
              >
                {copiedField === "all" ? (
                  <>
                    <Check className="w-5 h-5" /> 全部已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" /> 复制全部文案
                  </>
                )}
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || freeCount <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-white border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5" /> 换一篇
              </button>
            </div>

            {/* 互动提示 */}
            <div className="flex items-center justify-center gap-6 py-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> 有用
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" /> 收藏
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> 建议
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" /> 分享
              </div>
            </div>
          </div>
        )}

        {/* 底部功能介绍 */}
        {!result && !loading && (
          <div className="grid grid-cols-3 gap-3 pb-8">
            <div className="text-center p-4 rounded-xl bg-white/60">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium text-gray-700">精准定位</div>
              <div className="text-xs text-gray-500 mt-1">
                10大分类覆盖主流赛道
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/60">
              <div className="text-2xl mb-2">✍️</div>
              <div className="text-sm font-medium text-gray-700">5种风格</div>
              <div className="text-xs text-gray-500 mt-1">
                活泼/专业/温柔/搞笑/文艺
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/60">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-medium text-gray-700">一键复制</div>
              <div className="text-xs text-gray-500 mt-1">
                生成即用，省时省力
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="text-center py-4 text-xs text-gray-400 border-t border-pink-50">
        小红书AI文案生成器 · 每日免费3次 · Made with ❤️
      </footer>
    </div>
  );
}
