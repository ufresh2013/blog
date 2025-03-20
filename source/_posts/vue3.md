---
title: Vue3 基本用法
date: 2025-1-25 16:52:30
---
- 

### 1. setup
- 渐进式框架
选项式 API (Options API) + 组合式 API (Composition API)

`setup()`内的代码会在在Options API所有东西之前执行
`<script setup></script>`


<br/>

### 2. Composition API
#### 2.1 ref
声明响应式状态
为什么ref会带有`.value`
```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      count.value++
    }
    return {
      count,
      increment
    }
  }
}
```

#### 2.2 reactive
为什么要用`reactive`

#### 2.3 computed
```js
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
```

#### 2.4 watch
```js
const x = ref(0)

watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

```

#### 2.5 ref
引用子组件
```js
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value 将持有 <Child /> 的实例
})

<template>
  <Child ref="child" />
</template>
```

### 3. 生命周期
- onMounted
- onUpdated
- onUnmounted