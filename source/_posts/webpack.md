---
title: Webpack 用法
date: 2021-11-14 15:47:27
category: NodeJS
---
### 为什么需要 Webpack？
- 多终端应用场景，需要不同的打包配置。如：React native移动端、web端、服务端渲染打包
- npm 是 JS 的包管理系统，但 npm 包不能在 js 中直接引用
- React, Vue, less, CssModules 等语法在浏览器中无法直接解析

<br/>

### 1. 基本概念
webpack 是一个静态模块打包工具。当 webpack 处理程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们均为静态资源，用于展示你的网页。

#### 1.1 安装运行
```js
npm install webpack webpack-cli --save-dev
./node_modules/.bin/webpack -v
```

通过 npm script 运行 webpack

```js
scripts: { "build": "webpack --config prod.config.js" }
```

<br/>

#### 1.2 基本组成
- 配置文件
  默认配置是 webpack.config.js， 可以通过`webpack --config`指定配置文件

- entry
  通过入口文件寻找依赖，单入口 entry 是一个字符串，多入口 entry 是一个对象

- output
  指示webpack如何输出、以及在哪里输出你的bundle, asset和其他使用webpack载入的内容。
  ```js
  output: {
    filename: '[name].[hash].bundle.js'  // 决定每个输出bundle的名称
  }
  ```
  `[hash]`: 和整个项目的构建有关，只要项目文件有修改，整个项目构建的 hash 值就会更改
  `[chunkhash]`: 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值
  `[contenthash]`: 根据文件内容来定义 hash， 文件内容不变，则 contenthash 不变

  `[ext]` 资源后缀名
  `[name]` 文件名称
  `[path]` 文件的相对路径
  `[folder]` 文件所在的文件夹

- context
  基础目录，绝对路径，用于从配置中解析入口起点

- mode
  指定当前构造环境的值是production | development | none。 或者用`webpack --mode=production`传递。默认值为 production，指定后会设置`process.end.NODE_ENV`为该值，并默认开启一些插件。

- loader
  webpack 开箱即用只支持 js 和 json 两种文件类型，通过 loaders 去支持其他文件类型并且把它们转换成有效的模块，并且可以添加到依赖图中。loader 本身是一个函数，接受源文件作为参数，返回转换的结果。
  ```
  test 指定匹配规则
  use 指定loader名称
  options 可选项
  include, exclude, oneOf 指定文件范围
  ```

- plugin
  插件用于 bundle 文件的优化，资源管理和环境变量注入，作用于整个构建过程

- devtool
  选择一种source map源映射方式，方便调试。

- devServer
  配置代理

- server
  配置webserver

<br/>

#### 1.3 简写路径，新增模块目录
```js
resolve: {
  // 配置简写路径
  alias: {
    '@': path.join(__dirname, '..', 'src')
  }, 
  // 增加一个模块搜索目录，此目录优先于 node_modules/
  modules: [path.resolve(__dirname, 'src'), 'node_modules']
}
```



<br/>

#### 1.4 optimization
webpack4开始，不同的mode会执行不同的优化，production与development的区别如下：
```js
optimization: {
  minimize: true,       // 使用TerserPlugin压缩bundle
  nameModules: false,   // 使用可读取模块标识符，帮助更好滴调试
  nameChunks: false,    // 使用可读取chunk标识符
  nodeEnv: 'production',// 将process.env.NODE_ENV设置为一个给定字符串
  flagIncludedChunks: false,  // 已经加载过较大的chunk之后，就不再去加载这些chunk子集
  occurenceOrder: false,
}
```

常见的环境配置差异
- 生产环境可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
- 生产环境需要压缩 HTML/CSS/JS 代码
- 生产环境需要压缩图片
- 开发环境需要生成 sourcemap 文件
- 开发环境需要打印 debug 信息
- 开发环境需要 live reload 或者 hot reload 的功能

<br/>
### 2. loader + plugin
#### 2.1 解析ES6、JSX
`babel-loader`用于解析ES6, JSX语法, babel的配置文件是`.bablerc`
```js
// npm i @babel/core @babel/preset-env babel-loader -D
{ text: /\.js$/, use: 'bable-loader' }

// .babelrc 文件
{
"presets": [
"@babel/preset-env", // 解析 es6 语法
"@babel/preset-react" // 解析 React JSX
]
}

```
<br/>
#### 2.2 解析CSS
`css-loader`用于加载.css文件，并且转换成commonjs对象
`style-loader`将样式通过`<style>`标签插入到head中
`less-loader`将less转换成css
`postcss-loader` CSS前缀自动补全, 支持cssModules
`px2rem` px自动转换为rem

```js
// loader的执行是链式调用，执行顺序是从右到左。
{
  test: /.(css|less)$/,
  use: [
    {
      loader: 'style-loader',
      options: {
        insertAt: 'top', // 样式插入到<head>
        singleton: true, // 将所有的style标签合并成一个
      }
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => {
          require('autoprefixer')({
            browser: ['last 2 version', '>1%', 'ios 7']
          })
        }
      }
    },
    'less-loader',
  ]
}
```

`MiniCssExtractPlugin` 将样式提取到一个公共文件，注意它和 less-loader 的功能是互斥的，此时要去掉 less-loader。

```js
// 将样式提取到公用文件
{
  test: /.(css|less)$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader'
  ]
}
plugins: [
  // css文件压缩
  new OptimizeCSSAssetsPlugin({
    assetNameRegExp: /.css$/g,
    cssProcessor: require('cssnano')
  }),
  new MiniCssExtractPlugin({
    filename: '[name]_[contenthash:8].css'
  })
]
```

<br/>
#### 2.3 解析图片字体
`file-loader`用于处理文件。`url-loader`可以将较小资源转换为base64
```js
{
  test: /.(png|jpg|jpeg)$/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 10240
    }
  }]
},
{
  test: /.(woff|woff2|ttf|eot|otf)$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: 'assets/[name][hash:8].[ext]'
    }
  }]
}
```

<br/>
#### 2.4 热更新
文件监听是在发现源码变化时，自动重新构造出新的输出文件。webpack中开启监听模式，有两种方式
- `webpack --watch`
- webpack.config.js中设置`watch: true`

虽然 webpack 会自动构建，但是浏览器不会自动更新

- webpack-dev-server，localhost 可访问页面
- HotModuleReplacementPlugin 插件，不用手动刷新浏览器

```js
// npm install webpack-dev-server -D
// { scripts: { "dev": "webpack-dev-server --open" }}

const webpack = require('webpack');

plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  contentBase: './dist',
  hot: true
}
```

<br/>

<br/>
#### 2.6 文件压缩
`optimize-css-assets-webpack-plugin` CSS压缩
`uglifyjs-webpack-plugin` JS压缩
`html-webpack-plugin` HTML压缩

```js
plugins: [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src/search.html'), // 指定模板
    filename: 'search.html', // 打包出来的文件名
    chunks: ['search'], // 使用了哪些entry chunk
    inject: true, // js, css自动注入到html
    minify: {
      html5: true,
      collapseWhitespace: true,
      preserveLineBreads: false,
      minifyCSS: true,
      minifyJS: true,
      removeComments: false
    }
  })
];
```



<br/>
#### 2.7 资源内联
`raw-loader`内联HTML, JS。内联CSS，用style-loader / html-inline-css-webpack-plugin
```html
<script>${require('raw-loader!babel-loader!./meta.html')}</script>
<script>${require('raw-loader!../node-modules/lib-flexible.js')}</script>
```

<br/>


#### 2.8 暴露全局变量

<br/>
### 3. 优化生产配置
#### 3.1 Tree-Shaking
一个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到bundle里，tree-shaking只把用到的方法打入bundle，没用到的方法会在uglify阶段被擦除。要求必须是ES6的语法

Webpack默认支持开启tree-shaking，设置*`mode: 'production'`*即可。或在.babelrc里设置*`modules: false`*即可。


<br/>

#### 3.2 Scope Hoisting
构造后的代码存在大量函数闭包包裹代码，导致体积增大（模块越多越明显）。运行代码时创建的函数作用于变多，内存开销变大。*`Scope Hositing`*译为作用域提升。它将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突。从而减少函数声明代码和内存开销。

Webpack4设置*`mode: production`*，会默认开启scope hoisting。
Webpack3中需要增加*`new webpack.optimize.MouduleConcatenationPlugin()`*。

<br/>

#### 3.1 提取公用资源

提取公共资源
CommonSplitChunk

<br/>

#### 3.4 代码分离
把代码分离到不同的bundle中，可以按需加载或并行加载这些文件。常用的代码分离有三种：
- 入口起点： 使用`entry`配置手动地分离代码
- 防止重复： 使用`SplitChunksPlugin`分离chunk
- 动态导入： 通过模块中的内联函数调用来分离代码
```js
module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```
在React中根据路由做代码分割
src/index.js
```js
import asyncComponent from './async-component'

// 获取到异步组件
const AsyncDemo = asyncComponent(() => import('./demo'))

render() {
  return (
    <Route path="/demo" component={AsyncDemo}></Route>
  )
}
```

src/async-component.js
```js
import React, {Component} from 'react'

/**
 * @param {Function} loadComponent e.g: () => import('./component')
 * @param {ReactNode} placeholder  未加载前的占位
 */
export default (loadComponent, placeholder = null) => {
  class AsyncComponent extends Component {
    unmount = false

    constructor() {
      super()

      this.state = {
        component: null
      }
    }

    componentWillUnmount() {
      this.unmount = true
    }

    async componentDidMount() {
      const {default: component} = await loadComponent()

      if(this.unmount) return

      this.setState({
        component: component
      })
    }

    render() {
      const C = this.state.component

      return (
        C ? <C {...this.props}></C> : placeholder
      )
    }
  }

  return AsyncComponent
}

```


<br/>
### 4. 加快打包速度
#### 4.1 缓存加快二次构建

#### 4.2 缩小构建目标
缩小loader应用范围，限定只在 src 目录下的 js/jsx 文件需要经 babel-loader 处理

```js
rules: [ 
  {
    test: /\.jsx?/,
    include: [ 
        path.resolve(__dirname, 'src'), 
    ],
    use: 'babel-loader',
  },
  // ...
],
```

#### 4.3 分包：预编译资源

#### 4.4 多进程并行压缩

#### 4.5 优化显示日志

<br/>

### 5. 实现分包
默认的分包规则：
- 同一个 entry 下触达到的模块组织成一个 chunk
- 异步模块单独组织为一个 chunk
- entry.runtime 单独组织成一个 chunk

<br/>

### 6. 热更新原理
Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR 的核心就是客户端从服务端拉取更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)。

实际上 WDS 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容 (文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该 chunk 的增量更新。

后续的部分 (拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？) 由 HotModulePlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像 react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR。


### 参考资料
- [代码分离](https://webpack.docschina.org/guides/code-splitting/)
- [react-router4代码分割](https://www.jianshu.com/p/e3334a2c08e7)
- [极客时间-深入浅出Webpack]()