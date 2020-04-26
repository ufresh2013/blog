---
title: Vue文档
date: 2019-12-12 10:00:46
---
1. Vue.component
缺点：强制要求每个component中的命名不得重复；字符串模板；不支持CSS；限制只能使用html和es5，不能使用预处理器
参数: props, template, inheritAttrs


Vue组件的核心概念: 属性，事件，插槽
2. 属性
自定义属性 props
原生属性   attrs： 没有声明的属性，默认自动挂载到组件根元素上，设置inheritAttrs为false可以关闭自动挂载
特殊属性   class, style: 挂载到组件根属性上，支持字符串、对象、数组等多种语法

子组件method中修改props的值，会报错。Vue是如何监控到属性的修改并给出警告的？

3. 事件
普通事件: @click, @input, @change, @xxx等事件，通过`this.$emit('xxx', ...)`触发
修饰符事件： @input.trim, @click.stop, @submit.prevent等，一般用于原生HTML元素， 自定义组件需要自行开发支持


`<my-component :my-event="doSomething"></my-component>`
不同于组件和prop，事件名不会被用作一个javascript变量名或属性名，v-on事件在DOM模板中会被自动转换为全小写。`v-on:myEvent`会变成`v-on:myevent`——导致myEvent不可能被监听到。

this.$emit的返回值是什么？
this。

$listeners，里面包含了作用在这个组件上的所有监听器。将原生事件绑定到组件

4. 插槽
布局layout的组件方式
利用插槽slot实现ant design table组件里的render方法
jsx中调用函数，返回jsx方法

普通插槽
```js
<template slot="xxx">...</template>
<template v-slot="xxx">...</template>
```
作用域插槽
```js
<template slot="xxx" slot-scope="props">...</template>
<template v-slot:xxx="props">...</template>
```

5. v-model
一个组件上的`v-model`默认会利用名为`value`的prop和名为`input`的事件。

6. DOM diff
v-for为什么要绑定key？   —— 更新DOM性能问题
为什么不能用index作为key值 
vm.$set原理,怎么触发DOM更新？ 
怎么令arr.push触发DOM更新成功？

===

支持: push(), pop(), shift(), unshift(),splice(),sort(), reverse()
不支持: filter(), concat(), slice()
原理同样是使用Object.defineProperty对数组方法进行改写

7. computed
减少模板中计算逻辑，数据缓存，依赖固定的数据类型

9. watch
```js
new Vue({
    watch: {
        "b.d": function(val, oldVal) {
            this.e.f.g = 1
        },
        // 如果不添加deep: true。this.e.f.g变化不会触发e的watch
        e: {
            handler: function(val, oldVal) {
                console.log(val)
            }
        },
        deep: true
    }
})
```
对watch进行节流改造，直到用户停止输入超过500毫秒后，才更新fullName

10. 生命周期
创建阶段: beforeCreate -> created -> beforeMount -> render -> mounted
更新阶段: beforeUpdate -> render -> updated
销毁阶段: beforeDestory -> destoryed

11. 函数式组件： 临时变量
```js
export default {
  functional: true,
  render: (h, ctx) => {
    return ctx.scopedSlots.default && ctx.scopedSlots.default(ctx.props || {});
  }
};
```

```html
<TempVar
    :var1="`hello ${name}`"
    :var2="destroyClock ? 'hello vue' : 'hello world'"
>
    <template v-slot="{ var1, var2 }">
    {{ var1 }}
    {{ var2 }}
    </template>
</TempVar>
```

12. 指令
v-text, v-html, v-show, v-if, v-else, v-else-if, v-for, v-on, v-bind, v-model, v-slot, v-pre, v-cloak, v-once
组件生命周期和指令周期钩子的运行顺序？

13. provideinject
使用2.6最新 API Vue.observable 优化响应式 provide, 减少不需要的provide被传递出 来。

context inject  

14. ref 优雅地获取跨层级组件实例

15. template vs JSX
使用template实现jsx

```js
<VNodes :vnodes="getAnchoredHeading(4)" />

components: {
    VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
    }
},
methods: {
    getAnchoredHeading(level) {
        const Tag = `h${level}`
        return <Tag>hello world</Tag>
    }
}
```