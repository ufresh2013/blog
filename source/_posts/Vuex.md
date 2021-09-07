---
title: Vuex 如何触发视图渲染？
date: 2019-10-25 11:48:17
category: Vue
---

### 1. 什么时候用Vuex？
当多个视图依赖同一状态，来自不同视图的行为需要变更同一状态。我们可以把组件的共享状态抽取出来，以一个全局单例模式管理，任何组件都能获取状态或者触发行为。如用户信息，菜单权限


<br/>

### 2. 核心流程
Vue组件接收交互行为，调用dispatch方法触发action相关处理，若页面状态需要改变，则调用commit方法提交mutation修改state，通过getters获取到state新值，重新渲染Vue Components，界面随之更新。

<img src="1.jpg" style="width: 600px">


### 3. 实现原理
初始化Vuex的时候，新建了一个vue实例，这里会给store设置get/set
```js
// src/store.js 
function resetStoreVM (store) {
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
}
```
然后`Vue.mixin`混入`beforeCreate`把 store 挂到组件实例上，只要访问 this.$store.xxx就会收集依赖。
```

```

<br/>

### 4. 组成模块
- Vue Components
Vue组件,负责接收用户操作等交互行为，执行dispatch方法触发对应action进行回应。

- dispatch
操作行为触发方法，是唯一能执行action的方法。

- actions
操作行为处理模块。负责处理Vue Components接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以支持action的链式触发。

- commit
状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。

- mutations
状态改变操作方法。是Vuex修改state的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些hook暴露出来，以进行state的监控等。

- state
页面状态管理容器对象。集中存储Vue components中data对象的零散数据，全局唯一，以进行统一的状态管理。
```js
// 获取state状态
// 批量获取state状态
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState(['price', 'number']),
		total () {
			return this.$store.state.total
		}
	}
}

// getters: 从state中派生一些状态
```
- getters
从state中派生一些状态：`getters`和`mapGetters`
```js
const store = new Vuex.store({
	state: {
		price: 10,
		number: 10
	},
	getters: {
		total: state => {
			return state.price * state.number
		}
	}
}) 
```

<br/>



### 参考资料
- [Vuex框架原理与源码分析](https://tech.meituan.com/2017/04/27/vuex-code-analysis.html)
