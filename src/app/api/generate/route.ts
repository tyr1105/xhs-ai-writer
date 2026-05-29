import { NextRequest, NextResponse } from "next/server";

// 小红书文案生成 API
export async function POST(req: NextRequest) {
  try {
    const { topic, category, style, keywords, length } = await req.json();

    if (!topic || !category) {
      return NextResponse.json(
        { error: "请提供主题和分类" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_REASONER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API配置错误，请联系管理员" },
        { status: 500 }
      );
    }

    // 根据分类构建专业提示词
    const categoryPrompts: Record<string, string> = {
      美食: "写一篇让人看了就想收藏的美食分享笔记，要描述食物的口感、色泽、味道，推荐吃法和搭配",
      旅行: "写一篇令人向往的旅行攻略笔记，要包含行程建议、拍照打卡点、实用tips、花费参考",
      穿搭: "写一篇时尚穿搭分享笔记，要描述单品搭配、适合场景、穿搭技巧、购买建议",
      美妆: "写一篇美妆护肤分享笔记，要包含使用感受、效果对比、适用肤质、上脸步骤",
      数码: "写一篇数码产品测评笔记，要包含使用体验、优缺点、对比推荐、购买建议",
      家居: "写一篇家居好物分享笔记，要描述使用场景、搭配效果、性价比、购买渠道",
      健身: "写一篇健身运动分享笔记，要包含训练计划、饮食建议、注意事项、效果展示",
      育儿: "写一篇育儿经验分享笔记，要实用、有温度、有共鸣",
      职场: "写一篇职场干货分享笔记，要专业、有见解、实用性强",
      日常: "写一篇日常生活分享笔记，要温馨、有趣、接地气",
    };

    const styleMap: Record<string, string> = {
      活泼可爱: "语气活泼可爱，多用emoji，像在跟闺蜜聊天一样自然",
      专业干货: "语气专业有条理，内容干货满满，逻辑清晰",
      温柔治愈: "语气温柔治愈，像好朋友在分享，有情感共鸣",
      搞笑有趣: "语气幽默搞笑，适当用一些网络热梗，让人忍不住点赞",
      文艺清新: "语气文艺清新，文字优美有画面感，适合拍出氛围感的场景",
    };

    const lengthMap: Record<string, string> = {
      短: "150字以内的精简版",
      中: "300-500字的标准版",
      长: "500-800字的详细版",
    };

    const systemPrompt = `你是一个专业的小红书文案写手，深谙小红书爆款笔记的写作技巧。
你需要根据用户提供的主题和分类，生成一篇高质量的小红书笔记文案。

文案要求：
1. 标题要吸引眼球，使用数字、感叹号、emoji等元素
2. 正文分段清晰，每段2-3句话
3. 适当使用emoji增加趣味性（但不要过多）
4. 结尾要有互动引导（如"评论区告诉我你的想法"）
5. 添加5-8个相关话题标签
6. 语言风格要自然，像真实用户分享，不像AI写的`;

    const userPrompt = `请根据以下信息生成一篇小红书笔记文案：

【分类】${category}
【主题】${topic}
【风格】${styleMap[style || "活泼可爱"]}
【长度】${lengthMap[length || "中"]}
${keywords ? `【关键词】${keywords}` : ""}

${categoryPrompts[category] || categoryPrompts["日常"]}

请严格按以下JSON格式返回（不要有任何其他文字）：
{
  "title": "笔记标题",
  "content": "笔记正文内容（包含适当的emoji）",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "coverTips": "配图建议（描述适合的封面图风格和内容）"
}`;

    // 调用 DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI生成失败，请稍后重试" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // 尝试解析JSON返回
    let parsed;
    try {
      // 提取JSON部分（可能被markdown代码块包裹）
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // JSON解析失败，构建默认结构
      parsed = null;
    }

    // 如果解析失败，手动构建结果
    if (!parsed || !parsed.title) {
      const lines = content.split("\n").filter((l: string) => l.trim());
      parsed = {
        title: lines[0]?.replace(/^#+\s*/, "") || `${topic}分享`,
        content: lines.slice(1).join("\n") || content,
        tags: [category, topic, "小红书", "分享", "推荐"],
        coverTips: "建议使用清晰的实物图或场景图作为封面",
      };
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}
