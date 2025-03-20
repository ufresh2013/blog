---
title: Vite
date: 2025-02-05 16:52:30
category: NodeJS
---
### 1. 打包工具
- webpack / rollup / browserify
初阶段的打包工具，专注于打包，抽象层次低。需要依靠很多第三方插件来配置运行

- vue-cli / create react app / parcel / CRA
脚手架，更高抽象层次的工具，专注于提供一个完整应用解决方案
缺点：像一个庞大的黑盒，当你需要自定义的定制时，会比较痛苦

- vite
cli: 专注于应用，抽象层次高
api: 专注与支持上层框架，抽象层次中

<br/>

### 2. 什么是Vite
Vite是新一代的前端构建工具，利用浏览器ESM特性导入组织代码，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。

<br/>


#### 2.1 vite 原理
利用浏览器现在已经支持ES6的import,碰见import就会发送一个HTTP请求去加载文件。Vite启动一个 koa 服务器拦截这些请求，并在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再以ESM格式返回返回给浏览器。Vite整个过程中没有对文件进行打包编译，做到了真正的按需加载，所以其运行速度比原始的webpack开发编译速度快出许多！

*流程大致如下：*
1. 当声明一个 script标签类型为 module 时,如
```js
<script type="module" src="/src/main.js"></script>
```

2. 当浏览器解析资源时，会往当前域名发起一个GET请求main.js文件
```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

3. 请求到了main.js文件，会检测到内部含有import引入的包，又会import 引用发起HTTP请求获取模块的内容文件，如App.vue、vue文件





<br/>



#### 2.2 webpack 原理
传统的打包工具如Webpack是先解析依赖、打包构建再启动开发服务器，Dev Server 必须等待所有模块构建完成，当我们修改了 bundle模块中的一个子模块， 整个 bundle 文件都会重新打包然后输出。项目应用越大，启动时间越长。


<br/>

#### 2.3 热更新
通过WebSocket创建浏览器和服务器的通信监听文件的改变，当文件被修改时，服务端发送消息通知客户端修改相应的代码，客户端对应不同的文件进行不同的操作的更新。

<br/>

### 参考资料
- [深入理解Vite核心原理](https://juejin.cn/post/7064853960636989454)