---
title: Vue2 的 API 是真的好用！
date: 2019-10-11 10:27:39
category: JS
---


### 1. Data
*Data 为什么是一个函数，而不是对象？*
为了方便初始化data，直接*`this.data = vm.$options.data()`*就可以拿到一份新的data，不用深拷贝一个 data，方便安全。避免多个组件实例对象之间公用一个`data`,产生数据污染。




### 2. NextTick
数据在发生变化的时候，`vue`不会立刻去更新`DOM`，而是将修改数据的操作放在一个操作队列中。如果我们一直修改一个数据，异步操作队列还会进行去重，等同一事件循环中的所有数据变化完成后，才会进行`DOM`的更新。

*NextTick原理*
- 把回调函数放入callbacks等待执行
- 将待执行函数放到`Promise.then`微任务操作
- 事件循环到了微任务，执行函数依次执行callbacks中的回调
```js
// 如果没有nextTick机制，num每次更新值都会触发视图更新。有了nextTick，只需更新一次
{{ num }}
for (let i = 0; i < 10000; i++) {
	num = i
}
```



### 3. Slot
`Slot`插槽，又名“占坑”，可以理解为在组件中占好了位置，允许你自动往里面填坑。
通过`slot`插槽向组件传递props，`slot`是Vue2 实现逻辑复用的重要方式。
```js
<Mouse v-slot="{x, y}">{{ x }} {{ y }}</Mouse>
```



### 4. Virtual Dom
- 掩盖底层的DOM操作
  让你用更声明式的方式来描述你的目的，让你的代码更容易维护。当然，没有任何框架可以比纯手动的优化 DOM 操作更快。
- 对渲染过程的抽象
  使得框架可以渲染到web以外的平台，如移动端React Native、WebGL、SSR。
- 数据频繁变更后的合并处理 + Diff：减少重排重绘
  1. 虚拟 DOM 不会立马进行排版与重绘操作
  2. 虚拟 DOM 进行频繁修改，然后一次性比较并修改真实 DOM 中需要改的部分，最后在真实 DOM 中进行排版与重绘，减少过多DOM节点排版与重绘损耗
  3. 虚拟 DOM 有效降低大面积真实 DOM 的重绘与排版，因为最终与真实 DOM 比较差异，可以只渲染局部




### 5. Mixin
`Mixin`是一个js对象，它可以包含组件中任意功能选项，如`data`, `components`, `methods`, `created`, `computed`等。
当组件使用`mixins`时，这些选项都会被混入该组件本身的选项中。

*Mixin怎么混入当前组件？Mixin的合并策略*
- 替换型策略有props、methods、inject、computed，就是将新的同名参数替代旧的参数
- 合并型策略是data, 通过set方法进行合并和重新赋值
- 队列型策略有生命周期函数和watch，原理是将函数存入一个数组，然后正序遍历依次执行
- 叠加型有component、directives、filters，层层的叠加
(源码位置：/src/core/global-api/mixin.js)




### 6. Keep-alive
`Keep-alive`是`vue`中的一个内置组件，用于缓存组件，能在组件切换过程中将组件保留在内存中。
缓存`vnode.componentInstance`组件实例
```js
<keep-alive>
  <router-view></router-view>
</keep-alive>
```




### 7. Directive
内置指令：
- v-html: 插入html
- v-bind: 绑定一个属性 `v-bind:id="app"` 等同于 `:id="app"`
- v-on: 绑定事件, `v-on:click=""` 等同于 `@click=""`
- v-model: 双向绑定，`this.$data.foo = a` 和 `this.$emit`可以触发更新
```js
Vue.directive('focus', {
  bind: () => {}, // 指令第一次绑定到元素时
  unbind: () => {}, // 指令与元素解绑时
  inserted: (el) => { // 元素插入父节点时（不一定已被插入文档中）
    el.focus()
  },
  update: () => {}, // 所在组件的VNode更新时
  componentUpdated: () => {} // 所在组件的 VNode 及其子 VNode 全部更新后调用
})
```

自定义指令：
- v-title
文本有省略号...显示title，没有则不显示
```js
function showOverflowTitle(el: HTMLElement, binding: { value: string }) {
  if (el.title) return
  el.title =
    el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight
      ? binding.value
      : ''
}

app.directive('title', {
  mounted(el, binding) {
    el.addEventListener('mouseover', showOverflowTitle.bind(this, el, binding))
  },
  unmounted(el) {
    el.removeEventListener('mouseover', showOverflowTitle)
  }
})

<span v-title="item.name">{{ item.name }}</span>
```

-  v-hideIfOverflow
如果div有滚动条就隐藏
```js
function hideOverflowElement(el: HTMLElement) {
  el.style.opacity = el.scrollWidth > el.offsetWidth ? '0' : '1'
}
app.directive('hideIfOverflow', {
  mounted(el) {
    el.style.opacity = el.scrollWidth > el.offsetWidth ? 0 : 1
    window.addEventListener('resize', hideOverflowElement.bind(this, el))
  },
  unmounted() {
    window.removeEventListener('resize', hideOverflowElement)
  }
})

```


### 8. Template
为什么我支持模板而不是JSX
- JSX提供更高的自由度，实际应该避免使用这种自由度。
- 模板驱使程序员写m v vm分离的代码，前端开发的不良设计经常是混淆v和vm导致的
- template更有利于点对点粒度的更新触发，而jsx只能以组件为粒度触发vdom diff




### 9. Computed
`Computed`在注册阶段，触发响应式数据的getter从而完成依赖收集

*computed为什么会被缓存*
某个计算属性C，它依赖data中的A，如果没有缓存的话，每次读取C时，C都回去读取A，从而触发A的get。多次触发A的get有时候是一个非常消耗性能的操作。所以Computed必须要有缓存。







### 10. Watch
`watch`在注册阶段，触发响应式数据的getter从而完成依赖收集



### 11. 生命周期
Vue实例从创建到销毁的过程，就是生命周期，从开始创建、初始化数据、编译模板、挂载DOM -> 更新渲染 -> 卸载等一系列的过程。
- 组件挂载: beforeCreate, created, beforeMount, mounted(完成DOM渲染， 官方实例的异步请求在mounted中调用，实际上created也可以)
- 组件更新: beforeUpdate, updated
- 组件卸载: beforeDestroy, destroyed

beforeCreate
组件实例被创建之初，组件的属性生效之前

created
组件实例已经完全创建，属性也绑定，但真实dom还没有生成，$el还不可用

beforeMount
在挂载开始之前被调用：相关的 render 函数首次被调用

mounted
el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子


### 12. 生命周期执行顺序
想象有一段JSX，组件`<ComponentA>`会被`babel-loader`转换成`createElement`，执行`render()`的时候，会深度优先遍历（DFS）依次从父组件往里面执行，然后再依次往回`return`。

加载渲染过程
1. 父beforeCreate
2. 父created
3. 父beforeMount
4. 子beforeCreate
5. 子created
6. 子beforeMount
7. 子mounted
8. 父mounted

子组件更新过程：
1. 父beforeUpdate
2. 子beforeUpdate
3. 子updated
4. 父updated

销毁过程：
1. 父beforeDestroy
2. 子beforeDestroy
3. 子destroyed
4. 父destroyed










#### 参考资料
- [JS每日一题](https://github.com/febobo/web-interview)
- [分享8个非常实用的Vue自定义指令](https://juejin.cn/post/6906028995133833230)
- [notebook](https://github.com/theydy/notebook/issues)
- [require()源码解读](https://www.ruanyifeng.com/blog/2015/05/require.html)
- [Vue中computed原理分析](https://blog.csdn.net/lznism666/article/details/108513723)





