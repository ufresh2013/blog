---
title: Vue组件通信
date: 2021-08-21 13:23:26
category: Vue
---
### 1 props
#### 1.1 props怎样传值给子组件？
先看一段代码,我给 test 绑定了一个对象作用域，加上 with 绑定 this，然后读取 parentName 就会从 传入的对象上获取
```js
const username = 'window'
function test(){    
  with(this){ console.log(username) } // parent
}
test.call({ username: 'parent' })
```
`<Child username="username">`这个组件会被解析成一个模板渲染函数。子组件被执行时，会绑定父组件作为作用域，渲染函数内部所有的变量，都会从父组件对象上去获取。就这样，父组件就把自己的`data`值传给了子组件`props`。
```js
(function () {
  with (this) {
    // _c = createElement 
    return _c('Child', { attrs: { 'username': username } })
  }
})
```

<br/>

#### 1.2 子组件如何保存props?
子组件拿到父组件的`props`后，会把数据逐一放入子组件的`_props`上，并且每一个属性会被设置为响应式的。
<img src="1.jpg">
当我们访问`vm[key]`，实际上在访问`vm._props[key]`。
当我们修改`vm[key]`，实际上在修改`vm._props[key]`，如果值是基本类型，直接给`props`赋值，不会影响到父组件的`data`

```js
// src/core/instance/state.js
for (const key in propsOptions) {
  defineReactive(props, key, value)
  Object.defineProperty(vm, key, {    
    get() {        
      return this._props[key]
    },    
    set(val) {        
      this._props[key] = val
    }
  });
}
```

<br/>

#### 1.3 props如何触发子组件更新？
父级组件`data`发生变更时，会触发对应子组件`updateChildCompoennt`函数执行，子组件中所有的 `props` 会被刷新为最新的值，因为一开始为`props`设置了响应式，所以会自动触发子组件更新。


<br/>

### 2. $emit
子组件不能直接修改`props`，必须通过发送事件的方式让父组件修改`props`。子组件初始化的时候，会将`v-on`的事件保存在`vm.$event`上方便`$emit`调用
```js
// src/core/instance/events.js
Vue.prototype.$emit = function (event: string): Component {
  const vm: Component = this
  let cbs = vm._events[event]
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs
    const args = toArray(arguments, 1)
    for (let i = 0, l = cbs.length; i < l; i++) {
      res = args ? handler.apply(vm, args) : handler.call(vm)
    }
  }
  return vm
}
```

<br/>

### 3. v-model
`v-model`会解析成名为`value`的`prop`和名为`@input`的事件。其根本，还是通过事件的方式让父组件修改数据。

<br/>

### 4. $listeners, .sync
有时我们需要对一个 `prop` 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件两侧都没有明显的变更来源。Vue推荐使用`update:myPropName`的方式触发事件取而代之。
```html
<!-- 父组件中 -->
<input :value.sync="value" />

<!-- 以上写法等同于 -->
<!-- 父组件中 -->
<input :value="value" @update:value="v => value = v" />
<!-- 子组件中 -->
<script>
  this.$emit('update:value', 1)
</script>
```


### 5. $parent, $chilren, $refs
在`this.$parent.children`中通过组件`name`查询到需要的组件实例，进行通信

<br/>

### 6. provide/inject
Provide 可以在祖先组件中指定我们想要提供给后代组件的数据和方法，在任何后代组件中，我们都可以用 Inject 来接收 Provide 提供的数据和方法。
- 将`vm.$options.provide`存在`vm._provided`中
- 子组件一直往上一层父组件的找是否有`vm._provided`，直到找到为止，有就绑定响应式
(`defineReactive`直接绑定父组件的provide变量上)

```js
// src/core/instance/inject.js
export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

export function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key])
    })
  }
}

export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) {
    const result = Object.create(null)
    const keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // #6574 in case the inject object is observed...
      if (key === '__ob__') continue
      const provideKey = inject[key].from
      let source = vm
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
    }
    return result
  }
}
```

<br/>

### 7. Event Bus
new一个Vue实例，作为事件总线，像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件， 所以组件都可以通知其他组件。

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

<br/>

### 7. Vuex
初始化vuex的时候，新建了一个vue 实例
```js
new Vue({ data: { $store: store } })
```
这里会给store设置get/set，然后把 store 挂到 Vue.prototype上，只要访问 this.$store.xxx就会收集依赖。
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



### 参考资料
- [【Vue原理】Props - 白话版](https://zhuanlan.zhihu.com/p/53218851)
- [Prop](https://cn.vuejs.org/v2/guide/components-props.html)
- [.sync 修饰符](https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6)
- [vue中8种组件通信方式](https://juejin.cn/post/6844903887162310669#heading-11)
- [vuex工作原理详解](https://www.jianshu.com/p/d95a7b8afa06)
- [Vuex框架原理与源码分析](https://tech.meituan.com/2017/04/27/vuex-code-analysis.html)