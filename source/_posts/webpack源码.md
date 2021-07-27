---
title: Webpack loaders,plugins,HRM原理
date: 2021-07-22 10:21:58
category: NodeJS
---

#### webpack编译的起点
webpack函数源码(./lib/webpack.js)
```js
const webpack = (options, callback) => {
  let compiler = createCompiler(options)
  // 如果传入callback函数，则自启动
  if(callback){
    compiler.run((err, states) => {
      compiler.close((err2)=>{
        callback(err || err2, states)
      })
    })
  }
  return compiler
}
```

在webpack中存在两个非常重要的核心对象，分别为`Compiler`和`Compilation`。

- `Compiler`（./lib/Compiler.js）
  代表的是不变的webpack环境。在里面你可以读取`webpack config`信息
- `Compilation`（./lib/Compilation.js）
  代表的是一次编译作业，每一次的编译都可能不同。

compiler就像一条手机生产流水线，通上电后它就可以开始工作，等待生产手机的指令； compliation就像是生产一部手机，生产的过程基本一致，但生产的手机可能是小米手机也可能是魅族手机。物料不同，产出也不同。


### Compiler
```js
const createCompiler = options => {
  // 初始化compiler的属性和方法，其中最重要的是compiler.run()方法
  const compiler = new Compiler(options.context)
  // 注册所有的自定义插件
  // plugins必须是数组，元素必须是函数
  if(Array.isArray(options.plugins)){
    for(const plugin of options.plugins){
      if(typeof plugin === 'function'){
        plugin.call(compiler, compiler)
      }else{
        plugin.apply(compiler)
      }
    }
  }
  compiler.hooks.environment.call()
  compiler.hooks.afterEnvironment.call()
  // 对webpack options进行初始化
  // process, 会new很多webpack内置的plugin，并且apply它们
  compiler.options = new WebpackOptionsApply().process(options, compiler)  
  return compiler
}
```

### compiler.run()


### doBuild
`doBuild`就是选用合适的`loader`去加载`resource`,目的是为了将这份`source`转换为JS模块，最后返回加载后的`source`。

webpack对处理标准的JS模块很在行，但处理其他类型文件(css, scss, json, jpg)等就无能为力了，此时它就需要loader的帮助。loader的作用就是转换源代码为JS模块，这样webpack就可以正确识别了。 
loader的基本范式
```js
(code, sourceMap, meta) => string
```






### 2. Loader
一个Loader其实是一个Node.js模块，这个模块需要导出一个函数，获取处理前的内容，处理内容并返回。
```js
const sass = require('node-sass')
module.exports = function (source) {
  return sass(source)
}
```
缓存加速：有些转换操作非常耗时，webpack会默认缓存所有loader的处理结果。当文件没有发生变化时，不会重新调用对应的loader去执行转换操作。


### 3. Plugin
一个最基础的Plugin代码是这样的
```js
class BasicPlugin {
  constructor (options) {}

  // webpack会调用BasicPlugin实例的apply方法给插件实例传入compiler对象
  apply (compiler) {
    compiler.plugin('compilation', function (compilation) {

    })
  }
}

module.exports = BasicPlugin
```

在使用plugin时，配置代码如下：
```js
const BasicPlugin = require('./BasicPlugin.js')
module.export = {
  plugins: [
    new BasicPlugin(options)
  ]
}
```

#### 4. Compiler 和 Compilation
在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。

- `Compiler`
  包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
- `Compilation`
  包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。


#### HRM热更新工作原理
在古老的开发流程中，我们需要手动对代码打包，然后刷新浏览器，而这一系列的工作可以通过HRM工作流来自动完成。


### webpack-dev-serve



### 参考资料
- https://juejin.cn/post/6844903987129352206