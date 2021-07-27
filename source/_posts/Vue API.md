---
title: Vue API
date: 2019-10-11 10:27:39
category: Vue
---
### 1. *`Mixin`*:各种属性会如何混入当前组件？
`Mixin`本质是一个js对象，它可以包含我们组件中任意功能选项，如`data`, `components`, `methods`, `created`, `computed`等等。

我们只要将共用的功能以对象的方式写成`mixins`,当组件使用`mixins`时，这些选项都会被混入该组件本身的选项中。


*Mixin的合并策略*
(源码位置：/src/core/global-api/mixin.js)
- 替换型策略有props、methods、inject、computed，就是将新的同名参数替代旧的参数
- 合并型策略是data, 通过set方法进行合并和重新赋值
- 队列型策略有生命周期函数和watch，原理是将函数存入一个数组，然后正序遍历依次执行
- 叠加型有component、directives、filters，通过原型链进行层层的叠加

<br/>



### 2. *`NextTick`*: Vue的数据频繁修改后，只会更新渲染一次？
数据在发生变化的时候，`vue`不会立刻去更新`DOM`，而是将修改数据的操作放在一个操作队列中。如果我们一直修改一个数据，异步操作队列还会进行去重，等同一事件循环中的所有数据变化完成后，才会进行`DOM`的更新。
```js
// 如果没有nextTick机制，num每次更新值都会触发视图更新。有了nextTick，只需更新一次
{{ num }}
for (let i = 0; i < 10000; i++) {
	num = i
}
```

*NextTick实现原理*
(源码位置：/src/core/util/next-tick.js）
- 把回调函数放入callbacks等待执行
- 将待执行函数放到微任务或者宏任务中：Promise.then、MutationObserver、setImmediate、setTimeout降级操作
- 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调
```js
// 把回调函数放入callbacks等待执行
export function nextTick(cb) {
	callbacks.push(() => {
		if (cb) {
			cb.call(ctx)
		}
	})
	if (!pending) {
		pending = true
		timeFunc()
	}
}

// 将待执行函数放到微任务或者宏任务中：Promise.then、MutationObserver、setImmediate、setTimeout降级操作
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  //判断1：是否原生支持Promise
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  //判断2：是否原生支持MutationObserver
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  //判断3：是否原生支持setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  //判断4：上面都不行，直接用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}


// 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调
function flushCallbacks () {
	pending = false
	const copies = callbacks.slice(0)
	callbacks.length = 0
	for (let i = 0; i < copies.length; i++) {
		copies[i]()
	}
}
```

<br/>

### 3. 为什么*`Data`*是一个函数而不是一个对象？
- 根实例对象`data`可以是对象也可以是函数（根实例是单例），不会产生数据污染情况
- 组件实例对象`data`必须为函数，为了防止多个组件实例对象之间公用一个`data`,产生数据污染。采用函数的形式，`initData`时会将其作为工厂函数都会返回全新`data`对象


<br/>

### 4. *`Slot`*: 插槽
`Slot`插槽，又名“占坑”，可以理解为在组件中占好了位置，允许你自动往里面填坑（替换模板中`slot`位置）。通过`slot`插槽向组件内部指定位置传递内容，完成组件复用。
```html
<!-- Component.vue -->
<template>
	<slot>默认内容</slot>
	<slot name="content">content默认内容</slot>
</template>

<!-- Page.vue -->
<Component>
	<template v-slot:default>default</template>
	<template v-slot:content>content</template>
</Component>
```

<br/>

### 5. *`$mount`*:组件挂载时会发生什么？


<br/>

### 6. *`Virtual Dom`* vs 真实DOM操作
- *掩盖底层的DOM操作*
  让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快。
- *对渲染过程的抽象*
  使得框架可以渲染到web以外的平台，以及能够实现SSR。
- *数据频繁变更后的合并处理 + Diff：减少重排重绘*
  1. 虚拟 DOM 不会立马进行排版与重绘操作
  2. 虚拟 DOM 进行频繁修改，然后一次性比较并修改真实 DOM 中需要改的部分，最后在真实 DOM 中进行排版与重绘，减少过多DOM节点排版与重绘损耗
  3. 虚拟 DOM 有效降低大面积真实 DOM 的重绘与排版，因为最终与真实 DOM 比较差异，可以只渲染局部


<br/>


### 7. *`Keep-alive`*: 如何缓存当前组件？
`Keep-alive`是`vue`中的一个内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染。
```html
<keep-alive>
  <!-- 需要缓存的组件 -->
  <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<!-- 不需要缓存的组件-->
<router-view v-if="$route.meta.keepAlive"></router-view>
```

*源码位置*
src/core/components/keep-alive.js
缓存命中的组件实例，如果设置了max则采用LRU淘汰算法更新缓存
```js
export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render() {
    /* 获取默认插槽中的第一个组件节点 */
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    /* 获取该组件节点的componentOptions */
    const componentOptions = vnode && vnode.componentOptions

    if (componentOptions) {
      /* 获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag */
      const name = getComponentName(componentOptions)

      const { include, exclude } = this
      /* 如果name不在inlcude中或者存在于exlude中则表示不缓存，直接返回vnode */
      if (
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      /* 获取组件的key值 */
      const key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
     /*  拿到key值后去this.cache对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存 */
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      }
        /* 如果没有命中缓存，则将其设置进缓存 */
        else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

缓存后如何获取数据？
- beforeRouterEnter
- actived


<br/>

### 8.*`Directive`*：如何实现v-loading?
`v-`开头的行内属性，都是指令。默认内置的指令有`v-model`, `v-show`, `v-bind`
```js
// 实例化一个指令
v-xxx

// 将值传到指令中
v-model="visible"

// 传参数
v-bind:class="className"

// 自定义指令
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

[分享8个非常实用的Vue自定义指令](https://juejin.cn/post/6906028995133833230)
- v-copy: 一键复制文本内容，用于鼠标右键粘贴
- v-longpress: 长按触发相应事件
- v-debounce: 防抖，防止按钮在短时间内被多次点击
- v-emoji: 表单输入不能输入表情和特殊字符
- v-lazyLoad: 图片懒加载指令
- v-permission: 根据权限对DOM显示隐藏
- v-waterMarker: 添加水印
- v-draggable: 拖拽指令，可在页面可视区域任意拖拽


<br/>

### 9. *`Provide/Inject`*
`Provide`可以在祖先组件中指定我们想要提供给后代组件的数据和方法，在任何后代组件中，我们都可以用`Inject`来接收`Provide`提供的数据和方法。



### 10. 为什么我支持模板而不是JSX
- JSX提供更高的自由度，实际上应该避免使用这种自由度。jsx需要额外考虑jsx -> vdom的执行情况，而renderProps(vue slot)则是更好的设计。
- 模板驱使程序员写m v vm分离的代码，前端开发的不良设计经常是混淆v和vm导致的
- 模板和逻辑分离，有利于运营/设计的协作
- vue搭配runtime可以实现点对点粒度的更新触发机制，而jsx只能以组件为粒度触发vdom diff



<br/>

#### 参考资料
- [JS每日一题](https://github.com/febobo/web-interview)
- [分享8个非常实用的Vue自定义指令](https://juejin.cn/post/6906028995133833230)
- [notebook](https://github.com/theydy/notebook/issues)
- [require()源码解读](https://www.ruanyifeng.com/blog/2015/05/require.html)









### 2. 组件通信
- 获取组件实例
this.$parent拿到父组件实例
this.$children拿到子组件实例（数组）

- 父组件调用子组件方法
在子组件上加上ref，通过this.$refs.ref.method调用

- 子组件调用父组件方法
    1. this.$parent.event
    2. $emit向父组件触发一个事件，父组件监听这个事件
    3. 父组件把方法传入子组件，子组件直接调用这个方法

组件的data为什么是一个function
ref
emit
nativeClick
非父子组件间的传值: Bus/总线/发布订阅模式/观察者模式
```js
Vue.prototype.bus = new Vue();
Vue.component('child', {
    methods: {
        handleClick: function() {
            this.bus.$emit('change', 'content')
        }
    },
    mounted: function() {
        this.bus.$on('change', function(msg){
            console.log(msg); // 'content'
        })
    }
})

```


### 3. 生命周期
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



