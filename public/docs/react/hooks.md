# React Hooks 深度解析

## 什么是 Hooks

Hooks 是 React 16.8 引入的新特性，它允许你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 核心 Hooks

### useState

`useState` 是最基础的 Hook，用于在函数组件中添加状态。

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

### useEffect

`useEffect` 用于处理副作用，比如数据获取、订阅、手动修改 DOM 等。

```tsx
import { useState, useEffect } from 'react'

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
  }, [userId])

  return <div>{user?.name}</div>
}
```

### useContext

`useContext` 用于跨组件传递数据，避免 props 逐层传递。

```tsx
const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>按钮</button>
}
```

## 自定义 Hooks

自定义 Hooks 是复用状态逻辑的强大方式：

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}
```

## 最佳实践

1. **只在顶层使用 Hooks** — 不要在循环、条件或嵌套函数中调用 Hook
2. **只在 React 函数中调用 Hooks** — 函数组件或自定义 Hook 中使用
3. **使用 ESLint 插件** — `eslint-plugin-react-hooks` 可以帮助检查 Hook 规则
4. **依赖数组要完整** — useEffect 的依赖项不要遗漏

## 常见陷阱

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 闭包陷阱 | useEffect 依赖不完整 | 确保所有使用的外部变量都在依赖数组中 |
| 无限渲染 | useEffect 中 setState 触发循环 | 检查依赖数组和条件判断 |
| 状态不同步 | 异步操作中读取旧状态 | 使用函数式更新 `setState(prev => ...)` |

> **提示**：合理使用 `useCallback` 和 `useMemo` 可以避免不必要的子组件重渲染，但不要过度优化。
