---
title: Vue2, Vue3, React(Class Component), React(Hooks)
date: 2021-08-25 14:07:49
category: Vue
---
> 都是MVC（Model-View-Controller）数据驱动类型的前端框架，Vue和React代码组织方式分别好在哪里？
他们为什么都要升级为Hooks的写法？

### 1. MVC
MVC（Model-View-Controller） 是一种经典的软件架构模式，用于分离应用的核心逻辑、用户界面和数据
- Model
管理数据和业务逻辑，不涉及任何界面或用户交互。
- View
负责界面展示（如 HTML、UI 组件），从 Model 获取数据并呈现给用户。
- Controller
接收用户输入（如点击、表单提交），调用 Model 修改数据，更新 View 展示结果。


<br/>

### 2. Vue2
使用`Options API`有点配置化的方式组织代码，加上Vue2提供的各种API、指令，很容易就满足了各种前端页面需求，上手容易，好用，简单！
每个`.vue`文件就是一个组件
```js
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
```

<br/>

### 3. React(Class Component)
和Vue2同期的是React的Class Component。第一次看到这种代码组织方式就觉得妙极了！每个组件既是`<ReactComponent />`HTML的写法，同时它又是一个`Class`实例，这也太贴合JS写法了。



### 3. Vue3 Compsition API
更好的逻辑复用与代码组织，通过 ref 和 reactive 管理数据。
```js
import { ref } from 'vue';
export default {
  setup() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
  }
}
```
<img src="2.jpg" style="width:400px">

<br/>




### 4. React(Hooks)
函数组件 + Hooks（如 useState, useEffect），强调函数式编程和不可变性。

```js
import { useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return <button onClick={increment}>{count}</button>;
}
```





<br/>

### 5. Vue vs React 的区别
- 数据驱动实现方式不同
Vue是用proxy(vue3), Object.defineProperty(vue2)实现依赖追踪（getter，setter 对用户不可见）
React显式调用`setState`来通知变更

- JSX vs 模板
template 和 JSX 的都是 render 的一种表现形式。不同的是，JSX 相对于 template 而言，具有更高的灵活性，在复杂的组件中，更具有优势，而 template 虽然显得有些呆滞。但是 template 在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。

- Vue 一口气渲染 vs React Fiber
由于是浏览器是单线程，在计算量大的情况下，React Fiber给了交互响应的间隙

- Vue 提供了大量友好的 API：watch, computed, 指令，keep-alive
  React的 JSX 将 HTML 嵌入 JavaScript，提供更强的编程灵活性。




### 参考资料
- [做了一夜动画，就为让大家更好的理解Vue3的Composition Api](https://juejin.cn/post/6890545920883032071)
- [Vue 组合式 API](https://vue3js.cn/vue-composition/)