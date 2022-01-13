---
title: Vue2.0, Vue3.0, React
date: 2021-08-25 14:07:49
category: Vue
---
### 1. Composition API 解决了什么问题？
#### 更好的逻辑复用与代码组织
我们在Vue2中常常用Option API经常需要在特定的区域（data，methods，watch，computed...）编写负责相同功能的代码。

随着业务复杂度越来越高，代码量会不断的加大；由于相关业务的代码需要遵循option的配置写到特定的区域，导致后续维护非常的复杂，代码可复用性也不高。
<img src="1.jpg" style="width:250px">

显然我们可以更加优雅的组织我们的代码，函数。让相关功能的代码更加有序的组织在一起。

<img src="2.jpg" style="width:400px">

#### 更好的类型推导
大部分使用 TypeScript 的 Vue 开发者都在通过 vue-class-component 这个库将组件撰写为 TypeScript class。Vue 现有的 API 在设计之初没有照顾到类型推导，这使适配 TypeScript 变得复杂。


<br/>

### 2. Composition API
- setup
- reactive
```js
// reactive 几乎等价 Vue.observable(), 返回的state是一个响应式对象
const state = reactive({
  count: 0
})
```


<br/>

### 2. Vue vs React
- 数据驱动实现方式不同
Vue是用proxy, Object.defineProperty实现依赖追踪
React显式调用`setState`通知变更

getter，setter 对用户不可见，必然会隐藏很多渲染细节
Vue不需要考虑重渲染的问题，shouldComponentUpdate / ImmutableJS都不需要

- JSX vs template
template 和 JSX 的都是 render 的一种表现形式。不同的是，JSX 相对于 template 而言，具有更高的灵活性，在复杂的组件中，更具有优势，而 template 虽然显得有些呆滞。但是 template 在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。

- 一口气渲染 vs Fiber

- Vue API
watch, computed, 指令，keep-alive


### 3. Vue 2.0 vu Vue 3.0
- composition API
- typescript
- proxy




### 参考资料
- [做了一夜动画，就为让大家更好的理解Vue3的Composition Api](https://juejin.cn/post/6890545920883032071)
- [Vue 组合式 API](https://vue3js.cn/vue-composition/)