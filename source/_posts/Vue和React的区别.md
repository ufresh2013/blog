---
title: 🤔 Vue和React的区别
date: 2024-08-25 14:07:49
category: JS
---

> 都是MVC数据驱动的框架，Vue和React的区别是什么？
本文一箩筐总结Vue2, Vue3, React, React Hooks的特点和区别~



### 1. Vue 和 React 的区别
可以总结为这几点：

**1. 代码组织方式不同**
  - React 全JS写法，自成一体。React 注重简单Simple，机制的简单。React的函数式组件（FC）就很 Simple，FC 本质上就是每次重新渲染的时候把整个函数重新跑一遍，这提供了很多可能性。
  - Vue分离了`<template>`和`<script>`，逻辑和模板分离，加上大量封装程度更高的API。虽然Vue3加入了更灵活的Composition API，但是它本质还是opiton配置式的写法。

<br/>

**2. 响应式的写法不同**
- Vue 用 `state = newState` 来通知变更，更符合直觉。
更符合大家心目中响应式的写法。但是无论是Vue2中 `this.foo = a`，还是 Vue3 中 `foo.value = a` 的写法，都不能完全达到 `state = newState` 的效果。都有要额外处理的地方，Vue2中给 `data` 新增属性，数组操作需要额外的API。Vue3中的 `.value` 写法不够直观，拆分了 `ref` 和 `reactive` 两种类型，响应式丢失`toRef`等问题也很让人很困惑。

- React显式调用 `setState(newState)` 来通知变更。
当 `state` 是复杂对象时，复制一个全新的副本，修改它，是一件麻烦的事。不过 React 也不想管这个问题，它推荐你用 ImmerJS 来处理。



<br/>

**3. 重绘性能消耗不同（实现响应式方式不同）**
*InnerHTML vs Virtual Dom*
- innerHTML:  render html string + 重新创建所有 DOM 元素
- Virtual DOM: render Virtual DOM + diff + 点对点的 DOM 更新 
Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。


**从实现响应式方式来看：**
- 依赖收集是Vue的特点，Vue用 `proxy` , `Object.defineProperty` 实现依赖收集，依赖追踪。
依赖收集提供了点对点粒度的更新触发，而react只能以组件为粒度触发diff
- React没有依赖收集，而是在 `setState` 后通过UI Tree一层一层往下更新渲染。
当层级较高的 `state` 变化时，会引起大量组件的更新。为了解决这个问题，React 提出了 Fiber 来处理计算量大的情况下，没有交互响应间隙的问题。同时提供了 `useMemo`, `useCallback` 允许你缓存组件，减少不必要的渲染。

<br/>

**4. render 渲染写法不同**
template 和 JSX 都是 render 的一种表现形式。
- React 的 JSX 能完全融合到JS中，具有更高的灵活性，在复杂的组件中，更具有优势。
- template 其实是往上封装了一层，相同的逻辑代码量更少，更简单直观、更好维护。template可以提供更好的性能优化，用起来也很贴合需求，不会觉得不够用。


<br/>

**5. API 提供的功能不同**
- React Hooks 寥寥几个API，Hooks + Effect 就能满足所有需求，灵活巧妙，需要你一点点去组装。
- Vue 则是提供了大量的 API。Options API 有不少可取之处，data, lifecycle, computed, methods, watch 必须分门别类的放好。避免了新手将功能和逻辑摆的乱七八糟。Vue2以其极低的入门门槛和极其直观的语法，帮助你完成页面开发。除了这些，还有provide/inject, keep-alive, v-model, 这些API是友好的，面对更复杂的场景，它们像一个个最佳实践，需要你一个个去熟悉。




回忆一下它们都是怎么用的？


### 2. Vue2
2016年Vue2发布。
Vue2使用 `Options API` 配置化的方式组织代码，搭配各种API、指令，很容易满足了各种页面需求，上手容易，简单好用。
```js
// 每个`.vue`文件就是一个组件
export default {
  data() { 
    return { 
      count: 0
    }
  },
  methods: { 
    increment() { 
      this.count++ 
    }
  }
}
```



### 3. React(Class Component)
和 Vue2 同期的是 React 的 Class Component。
每个 UI 组件既是 `<Component />` 这样很HTML的写法，又是一个类的实例。
类(class)让组件的数据和操作逻辑封装在一起，最后返回了JSX，又表达了这是一个UI组件。
```js
class Welcome extends React.Component {
  state = { name : '' }
  
  componentDidUpdate() {
    this.setState({ name: 'hh'})
  }
  render() {
    return <h1>Hello, {this.name}</h1>;
  }
}
```




### 3. React16 (Function Component + Hooks)
2019年 React 推出 Hooks 写法。



#### 3.1 函数组件
React 希望，组件不要变成复杂的容器。
React 的函数组件只应该做一件事情：返回组件的 HTML 代码，而没有其他的功能。
```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
但是，这种写法有很大的限制，纯函数无法包含状态，也不支持生命周期方法。
为了解决这个问题，React引入Hooks，希望不使用"类"，也能写出一个全功能的组件。



#### 3.2 Hooks
*`Hooks`* 是钩子的意思，组件还是要写成纯函数，如果要其他功能，就要用钩子把它们"钩"进来。

常见的钩子有：
- `useState`：为函数组件引入状态state
- `useEffect`：引入具有副作用的操作，如获取数据、事件监听、改变DOM
```js
import { useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return <button onClick={increment}>{count}</button>;
}
```
你还可以创建自己的Hooks。
Hooks的写法将数据、逻辑从class中分离出来，开启了组件逻辑表达和逻辑复用的新范式。
```js
const usePerson = (personId) => {
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState({});
  useEffect(() => {
    setLoading(true);
    fetch(`https://swapi.co/api/people/${personId}/`)
      .then(response => response.json())
      .then(data => {
        setPerson(data);
        setLoading(false);
      });
  }, [personId]);  
  return [loading, person];
};
```





### 4. Vue3 Compsition API
受到 React hooks 的启发，Vue3 提供了类似的 Composition API。

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






End.

### 参考资料
- [Vue 组合式 API](https://vue3js.cn/vue-composition/)
- [阮一峰：轻松学会 React 钩子：以 useEffect() 为例](https://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)
- [谁能大致说下vue和react的最大区别之处？](https://www.zhihu.com/question/309891718/answer/3073163101)