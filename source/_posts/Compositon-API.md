---
title: Vue2, Vue3, React Class, React Hooks的区别
date: 2021-08-25 14:07:49
category: Vue
---

> 都是MVC（Model-View-Controller）数据驱动类型的前端框架，Vue和React代码组织方式分别好在哪里？
React为什么都要升级为Hooks的写法？

<br/>

### 1. MVC
先回顾一下，啥是MVC?
MVC（Model-View-Controller） 是一种经典的软件架构模式，用于分离应用的数据、界面、逻辑
- Model：管理数据。
- View：界面展示，从 Model 获取数据并呈现出来。
- Controller：接收用户输入，调用 Model 修改数据，更新 View 展示结果。




<br/>

### 2. Vue2
使用*`Options API`*配置化的方式组织代码，加上Vue2提供的各种API、指令，很容易就满足了各种前端页面需求，上手容易，好用，简单！
```js
// 每个`.vue`文件就是一个组件
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
```

<br/>

### 3. React(Class Component)
和Vue2同期的是React的Class Component。第一次看到这种代码组织方式就觉得妙极了！

每个组件既是`<ReactComponent />`HTML的写法，同时它又是一个类的实例。类(class)让组件的数据和操作逻辑封装在一起，最后返回了HTML，又表达了这是一个HTML组件。
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

<br/>


### 3. React16 (Function Component + Hooks)
#### 3.1 函数组件
React 团队希望，组件不要变成复杂的容器。
React 的函数组件只应该做一件事情：返回组件的 HTML 代码，而没有其他的功能。

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
但是，这种写法有很大的限制，纯函数无法包含状态，也不支持生命周期方法。
为了解决这个问题，React引入Hooks，希望不使用"类"，也能写出一个全功能的组件。

<br/>

#### 3.2 Hooks
*`Hooks`* 是钩子的意思，组件还是要写成纯函数，如果要其他功能，就要用钩子把它们"钩"进来。
常见的钩子有：
- `useState()`：为函数组件引入状态state
- `useEffect()`：引入具有副作用的操作，如获取数据、时间监听、改变DOM
- `useRef()`：保存引用
- `useContext()`：引入Context对象
- `useReducer()`：引入redux `const [state, dispatch] = useReduer(reducer, initialState)` 
```js
import { useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return <button onClick={increment}>{count}</button>;
}
```

你还可以创建自己的Hooks
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
有了钩子，React16就有了。


<br/>


### 4. Vue3 Compsition API
受到React hooks的启发，Vue3也提供了类似的composition api。通过 ref 和 reactive 管理数据。
集合Vue本身的特性，Composition API 是第一个将显式依赖追踪和hooks结合的设计
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

### 5. Vue 和 React 的区别
- 数据驱动实现方式不同
Vue是用proxy(vue3), Object.defineProperty(vue2)实现依赖收集、依赖追踪（getter，setter 对用户不可见）
React显式调用`setState`来通知变更

- 渲染方式不同：JSX vs template
template 和 JSX 的都是 render 的一种表现形式。
  - JSX 具有更高的灵活性，在复杂的组件中，更具有优势，
  - template 在JSX上封装了一层，相同的逻辑代码量更少，在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。template可以提供更好的性能优化
  ```js
  // v-for
  render() {
    return this.list.map(item => {
      return h('div', { key: item.id}, item.text)
    })
  }

  ```

- Vue 一口气渲染 vs React Fiber
由于是浏览器是单线程，在计算量大的情况下，React Fiber给了交互响应的间隙

- 代码组织方式不同
  Vue 提供了大量友好的 API：watch, computed, 指令，keep-alive
  React的 JSX，函数组件，Hooks，理念先进，提供更强的编程灵活性。


<br/>


### 参考资料
- [做了一夜动画，就为让大家更好的理解Vue3的Composition Api](https://juejin.cn/post/6890545920883032071)
- [Vue 组合式 API](https://vue3js.cn/vue-composition/)
- [轻松学会 React 钩子：以 useEffect() 为例](https://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)