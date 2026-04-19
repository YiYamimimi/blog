# AI 流式通信实战： OpenAI SDK 流式响应 和 Markdown 增量渲染优化

> **核心价值**：在信息爆炸的时代，我们或多或少会面对海量的长视频内容——数小时的行业会谈、冗长的学术讲座、或是精彩的课程录像。这时直接将视频丢给AI做总结，可能会失去视频本身的视觉信息。为了解决这个痛点，我用AI 开发了一个AI视频助手！

## 📋 目录

- [📋 目录](#目录)
- [🎯 技术亮点](#技术亮点)
- [✍️ 写好 Prompt 让 AI 听懂人话](#写好-prompt-让-ai-听懂人话)
- [🔧 流式通信](#流式通信)
- [🖥️ 打字机效果](#打字机效果markdown-增量渲染优化)
- [📝 相关资源](#相关资源)


---

## 🎯 技术亮点

| 技术模块 | 实现方案 | 核心价值 |
|---------|---------|----------|
| **优化 Prompt** | XML 格式替换 Markdown | 增强提示词结构性，提升模型输出准确性 |
| **AI 流式通信** | OpenAI SDK + SSE | 后端构造 SSE 响应逐 token 推送 |
| **前端流式处理** | `fetch + ReadableStream` | 替代 `EventSource` 实现 POST 场景下流式通信 |
| **打字机效果** | React 状态管理 |  Markdown 增量渲染优化 |
| **动态渲染** | ReactMarkdown + 正则 | 生成时间戳按钮，触发视频进度控制 |

## 写好 Prompt 让 AI 听懂人话
> - **纯文本prompt**：可读性强，适用于简单任务、日常聊天；但在应用开发中，输出会不稳定，难以复用
> - **markdown格式prompt**：结构清晰，适用的模型比较广，也比较通用；但以缩进体现层级，不适合多级嵌套的数据结构
> - **xml格式prompt**：对于复杂的逻辑可以选择xml格式，对多级嵌套的数据结构相对友好，AI输出的结果也相对稳定

**提示词一般可以拆分为角色定义、上下文描述、任务说明、约束条件、输出格式、用户问题和示例等结构**

```xml
<task>
  <!--角色  -->
  <role> 你是一个专业的视频转录分析 AI 助手。核心职责：1. ……    2.……</role>

  <!-- 上下文内容 -->
  <context>
    <!--历史对话  -->
    <conversationHistory></conversationHistory>
  </context>

  <!--约束  -->
  <constraints></constraints>

  <!--分析步骤  -->
  <instructions>
    <step name="1. ……"></step>
  </step>
  </instructions>

  <!--输出格式  -->
  <outputFormat> </outputFormat>

<!--例子  -->
  <examples></examples>

  <!--用户问题  -->
  <userQuestion></userQuestion>
</task>
```

## 🔧 流式通信

### 核心架构

```
graph LR
    A[客户端请求] --> B[OpenAI API]
    B --> C[流式响应]
    C --> D[SSE 编码]
    D --> E[客户端接收]
```

### 通过 OpenAI SDK 调用大模型的流式接口

```ts
const client=new OpenAI({ apiKey, baseURL });//填入调用模型的key和调用接口
const completion = await client.chat.completions.create({
  model: 'glm-5',//调用模型
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: currentQuestion || '' },
  ],
  stream: true,//开启流式
});
```
### OpenAI SDK 内部实现（简化版），返回异步迭代器

```ts

class Stream<T> implements AsyncIterable<T> {
  constructor(private response: Response) {}//fetch请求模型接口，获取 response 对象

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    const reader = this.response.body!.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();//读取流数据（二进制）
        if (done) break;

        const chunk = decoder.decode(value);//解析为字符串
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            const parsed = JSON.parse(data);
            yield parsed;  // yield 生成下一个值（异步迭代器的返回值）
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
```
### 封装为SSE流传给前端
```ts
 const encoder = new TextEncoder();//TextEncoder 将字符串转换为 Uint8Array
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 👉 使用 for await 遍历 AsyncIterable
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const data = JSON.stringify({ content });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream);//封装为SSE流传给前端
```

## 🎨 前端实现：流式消费

### 流式读取
>前端请求接口获取响应（大模型的key要写在后端，减少在前端暴露敏感信息）

```typescript title="lib/streamChat.ts"
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
});

const reader = response.body!.getReader();  // 👈 读取后端的响应
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();  // 👈 从网络读取
  if (done) break;

  const chunk = decoder.decode(value);
  console.log(chunk);  // 👈 处理数据
}
```

## 打字机效果——Markdown 增量渲染优化
>Markdown 标题需要在 行尾有换行符 才能识别.
每次获取流数据的时候都以 \n分割数据，然后再进行拼接；减少不完整的情况，不完整时当作普通文本，完整后自动转换为正确的 HTML 元素

```tsx title="hooks/useStreamingChat.ts"
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let fullContent = '';

if (reader) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          break;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.content) {
            fullContent += parsed.content;
            setIsLoading(false);
            setMessages((prev) => {
              const newMessages = [...prev];
              if (newMessages.length > 0) {
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: fullContent,
                };
              }
              return newMessages;
            });
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
  }
}
```

> 📝 **相关资源**：
> - [OpenAI API 文档](https://platform.openai.com/docs/api-reference/streaming)
> - [MDN: ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
> - [Chrome Extension 开发指南](https://developer.chrome.com/docs/extensions/)
