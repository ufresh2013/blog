---
title: Vue2 组件通信的多种方式
date: 2019-08-21 13:23:26
category: Vue
---
> 组件通信方式都有哪些？哪种比较好？

### 1. 各种通信方式的优劣势
- *`props`*
父组件向子组件传值，不适合多层级关系，多层级传值写法冗余

- *`$on, $emit`*
子组件向父组件通信

- *`v-model: props + $emit`*
props 和 $emit结合，就是v-model双向绑定

- *`prarent/children/ref`*
父组件调用子组件方法，兄弟组件通信

- *`provide/inject`*
适用于一个数据有多个子组件在同时使用，如提交一个复杂表单
（ 要注意，`provide`和`inject`绑定并不是可响应的，你必须`watch`来实现响应 ）

- *`eventBus/$on/$emit`*
用得少，层级深入复杂，且组件之间没有啥关系。要让他们通信，如果是是在小项目中，EventBus就是个不错的选择。

- *`$attrs/$listeners`*
对层级不深的组件关系，怎么传值？attrs跟listeners是一个不错的选择。他的中间组件，可以不受影响，去传递给子孙组件。

- *`vuex`*
关于全局缓存变量的储存，在传统时代，根据cookies,localstorage,session等，基本可以完成变量的存储。但是在数据驱动的时代，所有的数据需要双向绑定才能完成数据驱动，但是明显cookies，localstorage，session等，无法完成双向绑定。这时就要用到 vuex，redux等，提供*全局状态管理*，*持久化处理*。

<br/>



### 1. props
父组件向子组件传送数据
```js
<child :value="value" />
```
<br/>

### 2. $on, $emit
子组件向父组件通信。子组件通过派发事件，给父组件发消息
```js
<child @sendMsg="getChildMsg" />

this.$emit("sendMsg",this.msg)
```

### 3. v-model, .sync
双向绑定`v-model`是props + $emit的结合。
子组件不能直接修改`props`，子组件需要通过`$emit`发送事件的方式让父组件修改`props`。
v-model`会解析成名为`value`的`prop`和名为`@input`的事件。其根本，还是通过事件的方式让父组件修改数据。
```js
// v-model
<child v-model="value"></child>

// v-model等同于
<input :value="value" @input="handlerChange">

// v-model多个值，可以自定义值（值不只是value）
<child :page.sync="page" />

// 等同于
<input :page="page" @update:page="v => page = v" />
this.$emit("update:page", newVal)
```

<br/>

### 4. $attrs/$listeners
多层嵌套组件传递数据时，如果只是传递数据，而不做中间处理的话就可以用这个，比如父组件向孙子组件传递数据时
`$attrs`：包含父作用域里除 class 和 style 除外的非 props 属性集合
`$listeners`：包含父作用域里 .native 除外的监听事件集合
```js
// Parent.vue
<template>
    <child :name="name" title="1111" ></child>
</template>
export default{
    data(){
        return {
            name:"沐华"
        }
    }
}

// Child.vue
<template>
    // 继续传给孙子组件
    <sun-child v-bind="$attrs"></sun-child>
</template>
export default{
    props:["name"], // 这里可以接收，也可以不接收
    mounted(){
        // 如果props接收了name 就是 { title:1111 }，否则就是{ name:"沐华", title:1111 }
        console.log(this.$attrs)
    }
}
```



<br/>

### 5. $parent, $chilren, $refs
在`this.$parent.children`中通过组件`name`查询到需要的组件实例，通过 ref 主动获取子组件的属性或者调用子组件的方法
```js
<child ref="child"></child>

const child = this.$refs.child
console.log(child.name) // name是child的data
child.someMethod("调用了子组件的方法") // someMethod是child的methods
```

<br/>

### 6. provide/inject
Provide 可以在祖先组件中指定我们想要提供给后代组件的数据和方法，在任何后代组件中，我们都可以用 Inject 来接收 Provide 提供的数据和方法。
```js
// 父组件
export default{
    // 方法一 不能获取 this.xxx，只能传写死的
    provide:{
        name:"沐华",
    },
    // 方法二 可以获取 this.xxx
    provide(){
        return {
            name:"沐华",
            msg: this.msg // data 中的属性
            someMethod:this.someMethod // methods 中的方法
        }
    },
    methods:{
        someMethod(){
            console.log("这是注入的方法")
        }
    }
}

// 后代组件
export default{
    inject:["name","msg","someMethod"],
    mounted(){
        console.log(this.msg) // 这里拿到的属性不是响应式的，如果需要拿到最新的，可以在下面的方法中返回
        this.someMethod()
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
- [Vue3的8种和Vue2的12种组件通信，值得收藏](https://juejin.cn/post/6999687348120190983?searchId=2025030615330979E6E38D7849AE670496#heading-16)