---
title: 实现一个前端路由
date: 2019-10-25 16:52:30
tags:
---
https://juejin.im/post/584040e1ac502e006cbedb23

### 1. 基本用法

### 2. 访问路由器
注入路由器后，我们可以在任何组件内通过`this.$router`

/src
- components
    - link.js
    - view.js
- history
    - abstract.js
    - base.js
    - hash.js
    - html5.js
- util
    - async.js
    - dom.js
    - location.js
    - path.js
    - query.js
    - route.js
    - scroll-position.js
    - warn.js
- create-matcher.js
- create-route-map.js
- index.js
- install.js

###
- src/install.js
注册Vue插件，如果浏览器环境存在`window.vue`则自动使用插件。
export一个Vue引用：插件在打包的时候不希望把Vue的一个依赖包打进去，但是又希望使用Vue对象本身的一些方法，在install的时候把这个变量赋值给Vue，这样就可以在其他地方使用Vue的一些方法而不必引入vue依赖包（前提是保证install后才会使用）
通过给`Vue.prototype`定义`$router`, `$route`属性，将他们注入到所有组件中。（在vue.js中所有的组件都是被扩展的Vue实例，以为着所有的组件都可以访问到这个实例原型上定义的属性）

- src/index.js
定义一个`VueRouter`类

- src/create-matcher.js
根据传入的routes配置生成对应的路由map，返回match函数

- src/history
所有的history类都是在src/history目录下，他们都继承自src/history/base.js中的History类。