---
title: 仿照 Vue Router 实现一个路由
date: 2019-10-25 16:52:30
category: Vue
---
### 1. API
hash 和 history都是实现前端路由的浏览器历史记录API。相对而言 history 比 hash 更为强大。

#### 1.1 Hash
属性 & 方法| 作用
---|:--:|
`window.location.hash = ''` | 向历史记录中压入一个新记录，`window.location.hash`值发生变化后，会在浏览器添加一条新记录
`window.location.replace()` | 用给定的URL替换调当前的资源，被替换的页面不会被保存在会话的历史中。
`window.hashchange事件` | 在浏览器URL中hash发生变化后触发。URL中*`#`*后的内容就是hash，hash变化不会向服务器发起请求。


<br/>
#### 2.2 History
History API允许操作曾经在浏览器标签页访问的会话历史记录。

属性 & 方法| 作用
---|:--:|
`history.length` | 当前历史记录栈的个数
`history.back()` | 前往上一页，点击浏览器返回按钮可模拟此方法，等价于`history.go(-1)`
`history.forward()` | 前往下一页，点击浏览器前进按钮可模拟此方法，等价于`history.go(1)`
`history.go()` | 通过当前页面的相对位置，跳转到某个历史记录页面
`history.pushState()` | 向浏览器的历史堆栈压入一个新记录，并改变历史堆栈的当前指针至栈顶。
`history.replaceState()` | 这个接口和`pushState`参数相同，区别在于`replaceState`是替换浏览器历史堆栈的当前历史记录。需要注意的是，`replaceState`不会改动浏览器历史堆栈的当前指针。
`window.onpopstate事件` | 历史堆栈的当前指针改变，则会触发onpopstate事件


```js
window.history.pushState(stateObject, title, url)
// stateObject: 用于存储该url对应的状态对象，该对象可在`onpopstate`事件中获取，也可在history对象中获取
// title: 标题，目前浏览器未实现
// url: 一般设置为相对路径，如果设置为绝对路径时需要保证同源。
```

点击浏览器的前进、后退按钮，执行*`history.forward`*, *`history.back`*和*`history.go`*都会修改历史堆栈的当前指针。在不改变document的前提下，一旦当前指针改变则会触发*`onpopstate`*事件。

浏览器没有提供访问页面的历史记录栈的接口，但是它提供了`history.length`属性，它表明了当前历史记录栈的个数。它可以帮我们分析history API对历史记录栈的影响。

下图说明了：
  - 执行*`window.history.go`*, *`history.back`*, *`history.forward`*时，history栈大小不会改变，仅仅移动当前指针的位置
  - 执行*`pushState`*时，会在当前指针上压入一个url入栈顶，同时修改当前指针

<img src="1.png" />



<br/>
### 2. 实现功能
有了上面的基本了解，终于可以开始实现一个Vue Router了。Vue Router包含了很多功能，而我们只实现最基本的功能
- Router构建选项`mode`: 支持HTML5 History, hash, abstract模式
- Router构建选项`routes`: 支持传入`{ path: string, component: Component }`
- 使用`<router-link>`来定义导航链接
- 使用`<router-view>`渲染路径匹配到的视图组件
- 使用`this.$router.push()`, `this.$router.replace`, `this.$router.go`实现路由跳转
- 使用`this.$route.params`, `this.$route.query`获取路径参数



<br/>
### 3. 开始实现
我们先用vue-cli新建一个项目，文件目录
```shell
- components
  - link.js             # <router-link>组件
  - view.js             # <router-view>组件
- history
  - abstract.js         # 非浏览器环境实现路由
  - hash.js             # hash API 实现路由
  - html5.js            # history API 实现路由
- src
  - create-matcher.js   # 
  - create-route-map.js #
  - index.js            #
  - install.js          #
- util
  - location.js         #
  - path.js             #
  - query.js            #
  - route.js            #
- views                 # 业务代码
  - Bar.vue             # 页面1
  - Foo.vue             # 页面2
  - Home.vue            # 页面3
  - routes.js           # 定义路由 routes
- App.vue
- main.js
```

#### 3.1 目标
我们的目标是在App.vue中使用`<router-link>`, `<router-view>`实现组件切换
```js
// App.vue
<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/foo">Foo</router-link>
    <router-link to="/bar">Bar</router-link>
    <router-view></router-view>
  </div>
</template>
```

在main.js传入路由配置routes, 页面组件，初始化路由
```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import install from './src/install'
import routes from './views/routes'
import VueRouter from './src'

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes
})

install(Vue)

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
```


<br/>
#### 3.2 



<br/>
### 参考资料
- [vue-router 源码：实现一个简单的 vue-router](https://juejin.im/post/5b35dcb5f265da59a117344d)
- [「前端」History API与浏览器历史堆栈管理](https://juejin.im/post/58b6bb8044d904006ac40c78)
- [VueRouter 源码深度解析](https://juejin.im/post/5b5697675188251b11097464)