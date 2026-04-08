export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  docPath: string
}

export const projects: Project[] = [
  {
    id: 'ai-streaming',
    title: 'AI 流式通信实战',
    description: '基于 SSE + fetch + ReadableStream 实现打字机效果，支持实时对话与时间戳跳转，深入讲解 OpenAI SDK 流式响应处理。',
    tags: ['React', 'TypeScript'],
    docPath: '/docs/ai/streaming-communication.md',
  },
  {
    id: 'file-upload',
    title: '大文件上传方案',
    description: '预签名 URL 直传 OSS + 分片上传，支持断点续传、进度追踪与取消控制，解决大文件上传的核心痛点。',
    tags: ['Vue', 'TypeScript'],
    docPath: '/docs/engineering/file-upload.md',
  },
  {
    id: 'map-trajectory',
    title: '地图轨迹可视化',
    description: '百度地图 + MapVGL 彩虹轨迹，实现实时追踪与多路视频并发管理，支持轨迹动态回放与视口裁剪优化。',
    tags: ['Vue', 'TypeScript'],
    docPath: '/docs/visualization/map-trajectory.md',
  },

]

export const techTags = ['Vue', 'React', 'TypeScript', 'UniApp', 'Vite', 'Git']
