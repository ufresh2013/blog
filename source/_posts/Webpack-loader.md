---
title: Webpack Loader的输入输出是什么？
date: 2021-08-05 11:33:59
category: NodeJS
---
在Webpack中，可以把loader看作一个数据管道，输入一个字符串或者 `Buffer`，然后经过加工，输出另一个字符串。多个loader可以像水管一样串联起来。

Loader 用于处理任意类型的文件，并且将它们转换成一个让 Webpack 可以处理的有效模块，在 Webpack 打包之前执行。


Loader的一些特点：
- `Loader` 是一个 `node` 模块；
- `Loader` 可以处理任意类型的文件，转换成 `webpack` 可以处理的模块；
- `Loader` 可以在 `webpack.config.js` 里配置，也可以在 `require` 语句里内联；
- `Loader` 根据配置从右向左链式执行；
- `Loader` 接受源文件内容字符串或者 `Buffer`；
- `Loader` 分为多种类型：同步、异步和 `pitching`，他们的执行流程不一样；
- `webpack` 为 `Loader` 提供了一个上下文，有一些 `api` 可以使用；

<br/>

### 1. 最简单的loader
最简单的loader是一个什么都不做，原样返回JS代码的 loader
```js
module.exports = function (source) {
  return source
}
```

<br/>

### 2. babel-loader
接收`source`源码，用`babel`编译一下，返回编译后的代码。presets 代表转码规则
```js
const babel = require('babel-core')

module.exports = function (source) {
  const babelOptions = {
    presets: ['env'], 
    plugins: ["transform-react-jsx"] // 编译jsx
  }
  const result = babel.transform(source, babelOptions)
  return result.code
}
```
JSX会被编译为一个名为`h`的函数调用，也就是`React.createElement`
```js
// 编译前
<p>KaSong</p>
// 编译后
h('p', null, 'KaSong')
```


<br/>

### 3. css-loader
一般css的loader都是这样配置
```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
}
```
- `less-loader`, `scss-loader`将less、scss编译成css代码
- `css-loader`处理css中的`@import`和`url`这样的外部资源
- `style-loader`把样式插入到DOM中，在head中插入一个style标签，并把样式写入到这个标签的innerHTML里。

css-loader 的主要代码包含这两部分：
- processCss.js 中会调用 postcss 对 css 源码进行解析，然后遍历其中的 declaration 并抽离出 url 和 import 这两种依赖
- loader.js 会调用 processCss，根据它已经分析出的 url 和 import 依赖关系，在对应的代码中替换成 require，并拼接成段最终的JS返回

<br/>

#### 3.1 css modules: 局部样式
CSS的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。产生局部作用域的唯一方法，就是使用一个独一无二的class的名字，不会与其他选择器重名。这就是 CSS Modules 的做法。

```js
// App.js
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>
  );
};

// App.css
.title {
  color: red;
}
```
Webpack将*`style.title`*编译成一个哈希字符串，App.css也会同时被编译。要开启Css Module编译，需要在webpack配置上加上`css-loader?modules`。CSS Modules 允许使用`:global(.className)`的语法，声明一个全局规则。凡是这样声明的`class`，都不会被编译成哈希字符串。

```html
<h1 class="_3zyde4l1yATCOkgn-DBWEL">
  Hello World
</h1>

._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}
```

*Q: 使用css-module后，antd的样式就失效了，该怎么解决？*
**A: 针对 antd 或其他依赖包的 css 单独写一条 loader 的规则，不开启 css modules 即可**
```js
// 针对antd不开启CSS Modules处理
{
  test: /\.css$/,
  include: [/[\\/]node_modules[\\/].*antd/],
  use: [
    {loader: 'style-loader'},
    {loader: 'css-loader'}
  ]
}
```

<br/>

#### 3.2 sass-resources-loader: 全局样式变量
```js
{
  // 引入全局样式
  loader: 'sass-resources-loader',
  options: {
    resources: [
      resolve('src/styles/_variables.scss'),
      resolve('src/styles/_mixins.scss'),
      resolve('src/styles/_functions.scss')
    ]
  }
}
```

<br/>

### 4. style-loader
把样式插入到DOM中，在head中插入一个style标签，并把样式写入到这个标签的innerHTML
```js
module.exports.pitch = function (request) {
  var result = [
    'var content=require(' + loaderUtils.stringifyRequest(this, '!!' + request) + ')’, // 得到 css 内容
    'require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, "add-style.js")) + ')(content)’, // 调用  addStyle 把CSS内容插入到DOM中
    'if(content.locals) module.exports = content.locals’ // 如果发现启用了 css modules，则默认导出它
  ]
  return result.join(';')
}

module.exports = function (content) {
  var style = document.createElement('style')
  style.innerHTML = content
  document.head.appendChild(style)
}
```



<br/>

### 5. file-loader
`file-loader`根据配置和文件内容生成一个唯一的文件名，复制文件内容到dist指定目录。
```js
var loaderUtils = require('loader-utils')

module.exports = function (content) {
  // 获取webpack对file-loader的配置，{ name: "[name]_[hash].[ext]" }
  const options = loaderUtils.getOptions(this) || {}

  // loaderUtils的一个方法，可以根据name配置和content内容生成一个文件名
  // 为什么需要文件内容？为了保证文件内容没有发生变化时，名字中的[hash]字段也不会变
  let url = loaderUtils.interpolateName(this, options.name, { content })

  // 告诉webpack，我要创建一个文件，webpack会帮你在dist目录下创建对应的文件
  this.emitFile(url, content)

  // __webpack_public_path__是public的跟路径
  // css这样写: background-image: url('a.png')
  // 编译后变成: background-image: require('xx/xxxxx.png')
  // 下面返回的结果，就是图片的路径
  return 'module.exports= __webpack_public_path__ + ' + JSON.stringify(url)
}

// 默认情况下，webpack会把文件内容当做UTF-8字符串处理
// 我们需要指定webpack用raw-loader来加载文件
module.exports.raw = true
```

<br/>

### 6. url-loader
`url-loader`把文件(Buffer)转成base64编码，直接嵌入到CSS/JS/HTML中。

```js
module.exports = function (content) {
  var options = loaderUtils.getOptions(this) || {}
  var limit = options.limit || (this.options && this.options.url && this.options.url.dataUrlLimit)

  if (limit) {
    limit = parseInt(limit, 10)
  }

  var mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath)

  // No limits or limit more that content length
  if (!limit || content.length < limit) {
    if (typeof content === 'string') {
      content = new Buffer(content)
    }
    return 'module.exports = ' + JSON.stringify('data' + (mimetype ? mimetype + ';' : '') + 'base64,' + content.toString('base64'))
  }

  // 如果超过了文件大小限制，调用file-loader来加载
  var fallback = options.fallback || 'file-loader'
  var fallbackLoader = require(fallback)
  return fallbackLoader.call(this, content)
}

module.exports.raw = true
```

<br/>

### 7. raw-loader


<br/>

### 8. vue-loader
编译以单文件组件的格式撰写 Vue 组件。解析 .vue 中的 `template`、`script`、`style` 后，分别构造一个 import 字符串，然后拼接。

```jsx
templateImport = "import { render, staticRenderFns } from './App.vue?vue&type=template&id=7ba5bd90&'";

scriptImport = "import script from './App.vue?vue&type=script&lang=js&'
                export * from './App.vue?vue&type=script&lang=js&'";

stylesCode = "import style from './App.vue?vue&type=style&index=0&lang=scss&'";

let code = `
${templateImport}
${scriptImport}
${stylesCode}`.trim() + `\n`
code += `\nexport default component.exports`
return code
```
生成的 code：
```jsx
code = "
import { render, staticRenderFns } from './App.vue?vue&type=template&id=7ba5bd90&'
import script from './App.vue?vue&type=script&lang=js&'
export * from './App.vue?vue&type=script&lang=js&'
import style0 from './App.vue?vue&type=style&index=0&lang=scss&'

// 省略 ...
export default component.exports"
```

#### 8.1 CSS Scoped实现原理





### 参考资料
- [Webpack 源码解析](https://github.com/lihongxun945/diving-into-webpack)
- [My-webpack-loader: Show how to write your own loader](https://github.com/lihongxun945/my-webpack-loader)
- [Vue-loader](https://vue-loader.vuejs.org/zh/#vue-loader-%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F)
- [从vue-loader源码分析CSS Scoped的实现](https://juejin.cn/post/6844903949900742670)
- [CSS Modules 用法教程](https://www.ruanyifeng.com/blog/2016/06/css_modules.html)