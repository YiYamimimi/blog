# TypeScript 高级类型

## 泛型基础

泛型允许我们在定义函数、接口或类时不预先确定具体类型：

```ts
function identity<T>(arg: T): T {
  return arg
}

const output = identity<string>('hello')
const output2 = identity(42) // 类型推断
```

## 条件类型

条件类型根据条件选择不同的类型：

```ts
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'> // true
type B = IsString<42>      // false
```

### infer 关键字

`infer` 用于在条件类型中推断类型变量：

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = (x: number) => string
type Result = ReturnType<Fn> // string

type ArrayElement<T> = T extends (infer E)[] ? E : never
type Item = ArrayElement<string[]> // string
```

## 映射类型

映射类型可以基于已有类型创建新类型：

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Record<K extends string | number | symbol, T> = {
  [P in K]: T
}
```

## 模板字面量类型

```ts
type EventName = 'click' | 'focus' | 'blur'
type HandlerName = `on${Capitalize<EventName>}`
// "onClick" | "onFocus" | "onBlur"

type CSSProperty = 'margin' | 'padding'
type CSSDirection = 'top' | 'right' | 'bottom' | 'left'
type CSSKey = `${CSSProperty}-${CSSDirection}`
// "margin-top" | "margin-right" | ... | "padding-left"
```

## 实用工具类型

TypeScript 内置了许多实用工具类型：

- `Partial<T>` — 所有属性变为可选
- `Required<T>` — 所有属性变为必选
- `Readonly<T>` — 所有属性变为只读
- `Pick<T, K>` — 选取部分属性
- `Omit<T, K>` — 排除部分属性
- `Record<K, T>` — 构造键值对类型
- `Exclude<T, U>` — 从 T 中排除 U
- `Extract<T, U>` — 从 T 中提取 U

> **提示**：掌握这些高级类型可以显著提升代码的类型安全性和开发体验。
