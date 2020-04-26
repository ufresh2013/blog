---
title: 连夜学的Vue
date: 2019-10-11 10:27:39
---
### 1. 组件
- slot
```js

```

- mixin
当组件使用混入对象时，所有混入对象的选项将被“混合”进该组件本身的选项。
    - 数据对象在发生冲突时，以组件数据优先
    - 同名狗钩子函数将合并为一个数组，都被调用
    - methods, components, directives被合并成一个对象，冲突时，以组件对象优先
mix的使用场景：多个实例引用了相同或相似的方法或属性等，可将这些重复的内容抽取出来作为mixins的js，export出去，在需要引用的vue文件通过mixins属性注入，与当前实例的其他内容进行merge。

- 自定义指令
https://cn.vuejs.org/v2/guide/custom-directive.html


- 强制刷新组件
给组件绑定一个key`<someComponent :key="id">`

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

### 3. 指令
- v-model的实现原理
v-model只不过是一个语法糖而已,真正的实现靠的还是1. v-bind:绑定响应式数据； 2. 绑定input事件，修改数据
```js
<input
    type="text"
    v-bind:value="msg" v-on:input="msg=$event.target.value"
/>
{{msg}}
```

- 自定义指令

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


### 4. filter, computed, methods, watch
computed: 计算属性，值有缓存，只有它依赖的属性值发生改变时，才会重新计算computed的值。可以设置get, set函数

watch: 监听某个数据变化，可以做修改


### 5. Vue模板
- v-if和v-show的区别

- style加scoped的用途和原理
在标签上绑定了自定义属性，防止css全局污染

- `<template>`有什么用
包裹元素，自己本身不产生元素

- key的作用
性能优化，在更新数据时diff更快更准确地找到变化的位置


### 6. data
- 给data添加一个新的属性
这个新属性的变更，不会触发视图更新。可以使用`Vue.set(object, key, value)`将新属性添加到已有对象上。

- 更新数组，对象
    1. 更新引用
    2. 使用数组的方法push, shift, unshift, splice等
    3. Vue.set(vm.userInfo, key ,value)

- 公用组件的data为什么要返回一个Function
各个实例可以维护一份被返回对象的独立的拷贝



### 3. 路由配置

- 嵌套的路由

- 路由参数、查询、通配符

- 视图过渡效果


CLI 生成的 router.js 文件

- 页面组件可以用`import`实现代码分块

```

```

### 3. vuex 配置

### 4. 生命周期

### 5. 组件: prop, event, slot


### 6. Vue和React的区别
- 其他问题
【Q】在使用计算属性的时，函数名和data数据源中的数据可以同名吗？
【A】不可以，因为不管是计算属性还是data还是props 都会被挂载在vm实例上，因此 这三个都不能同名


【Q】怎么定义全局方法？
【A】
- https://juejin.im/post/5d41eec26fb9a06ae439d29f
- https://juejin.im/post/5d4d4eaf51882505176a79eb