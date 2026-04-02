export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  docPath: string
}

export const projects: Project[] = [
  {
    id: 'react-hooks',
    title: 'React Hooks 深度解析',
    description: '深入理解 React Hooks 的工作原理、最佳实践和常见陷阱，掌握 useState、useEffect、useContext 等核心 Hook。',
    tags: ['React', 'TypeScript'],
    docPath: '/docs/react/hooks.md',
  },
  {
    id: 'vue3-composition',
    title: 'Vue3 Composition API',
    description: '全面学习 Vue3 Composition API，包括 ref、reactive、computed、watch 等核心概念与实战应用。',
    tags: ['Vue', 'TypeScript'],
    docPath: '/docs/vue/composition-api.md',
  },
  {
    id: 'typescript-advanced',
    title: 'TypeScript 高级类型',
    description: '探索 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型、模板字面量类型等进阶用法。',
    tags: ['TypeScript'],
    docPath: '/docs/typescript/advanced-types.md',
  },
  {
    id: 'performance-optimization',
    title: '前端性能优化实战',
    description: '从网络请求、资源加载、渲染性能等多个维度，系统讲解前端性能优化的策略与实践方法。',
    tags: ['React', 'Vue', '性能优化'],
    docPath: '/docs/react/performance.md',
  },
]

export const techTags = ['React', 'Vue', 'TypeScript', '性能优化', '用户体验', '算法思维']
