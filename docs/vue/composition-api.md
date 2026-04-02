# Vue3 Composition API

## 概述

Composition API 是 Vue3 引入的一组 API，它提供了一种更灵活的方式来组织组件逻辑。

## 核心概念

### ref 和 reactive

```ts
import { ref, reactive } from 'vue'

const count = ref(0)
console.log(count.value) // 0

const state = reactive({
  name: 'yiyamimimi',
  age: 25
})
console.log(state.name) // 'yiyamimimi'
```

### computed

计算属性会基于响应式依赖自动缓存：

```ts
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

const fullName = computed(() => `${firstName.value}${lastName.value}`)
```

### watch 和 watchEffect

```ts
import { ref, watch, watchEffect } from 'vue'

const keyword = ref('')

watch(keyword, (newVal, oldVal) => {
  console.log(`搜索词从 "${oldVal}" 变为 "${newVal}"`)
})

watchEffect(() => {
  console.log(`当前搜索词: ${keyword.value}`)
})
```

## 生命周期钩子

Composition API 中的生命周期钩子以 `on` 前缀命名：

```ts
import { onMounted, onUnmounted, onUpdated } from 'vue'

onMounted(() => {
  console.log('组件已挂载')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
```

## 自定义 Composable

```ts
function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(true)

  fetch(url)
    .then(res => res.json())
    .then(json => {
      data.value = json
    })
    .catch(err => {
      error.value = err.message
    })
    .finally(() => {
      loading.value = false
    })

  return { data, error, loading }
}
```

## 与 Options API 对比

| 特性 | Options API | Composition API |
|------|-------------|-----------------|
| 逻辑组织 | 按选项类型分组 | 按逻辑功能分组 |
| 逻辑复用 | Mixins | Composables |
| TypeScript | 支持较弱 | 原生支持 |
| 学习曲线 | 较低 | 中等 |
