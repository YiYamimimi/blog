# 前端性能优化实战

## 性能指标

### 核心 Web Vitals

| 指标 | 含义 | 目标值 |
|------|------|--------|
| LCP | 最大内容绘制 | < 2.5s |
| FID | 首次输入延迟 | < 100ms |
| CLS | 累积布局偏移 | < 0.1 |
| INP | 交互到下一次绘制 | < 200ms |

## 资源加载优化

### 代码分割

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 图片优化

- 使用现代图片格式（WebP、AVIF）
- 实现懒加载
- 使用合适的图片尺寸
- 使用 CDN 加速

```html
<img
  src="image.webp"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
  alt="描述"
/>
```

## 渲染性能优化

### React 优化

```tsx
import { memo, useMemo, useCallback } from 'react'

const ExpensiveList = memo(({ items }: { items: string[] }) => {
  return items.map(item => <div key={item}>{item}</div>)
})

function Parent() {
  const [count, setCount] = useState(0)
  const items = useMemo(() => generateItems(), [])
  const handleClick = useCallback(() => setCount(c => c + 1), [])

  return (
    <div>
      <ExpensiveList items={items} />
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  )
}
```

### 虚拟列表

对于长列表渲染，使用虚拟滚动只渲染可视区域内的元素：

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div key={virtualRow.key} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}>
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 网络优化

- **HTTP/2 多路复用** — 减少连接开销
- **资源预加载** — `<link rel="preload">`
- **DNS 预解析** — `<link rel="dns-prefetch">`
- **Service Worker 缓存** — 离线访问能力

> **提示**：性能优化应该基于实际测量数据，而不是凭感觉优化。使用 Lighthouse、Chrome DevTools Performance 面板等工具进行性能分析。
