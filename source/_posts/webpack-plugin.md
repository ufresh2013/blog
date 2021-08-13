---
title: Webpack Plugin，加快打包速度
date: 2021-08-07 14:13:01
category: NodeJS
---
### 常见plugin
Plugin 作为插件丰富了 Webpack 的功能，针对是 Loader 结束后，Webpack 打包的整个过程，它并不直接操作文件，而是基于**事件机制**工作，会监听 webpack 打包过程中的事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

- define-plugin: 定义环境变量 (Webpack4 之后指定 mode 会自动配置)
- ignore-plugin: 忽略部分文件
- html-webpack-plugin: 简化 HTML 文件创建 (依赖于 html-loader)
- web-webpack-plugin: 可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
- uglifyjs-webpack-plugin: 不支持 ES6 压缩 (Webpack4 以前)
- terser-webpack-plugin: 支持压缩 ES6 (Webpack4)
- webpack-parallel-uglify-plugin: 多进程执行代码压缩，提升构建速度
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)
- serviceworker-webpack-plugin: 为网页应用增加离线缓存功能
- clean-webpack-plugin: 目录清理
- ModuleConcatenationPlugin: 开启 Scope Hoisting
- speed-measure-webpack-plugin: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)
- webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)
- babel-import-plugin




5. create-react-app中引入iconfont svg
https://fog3211.com/blog/react-symbol-iconfont.html    eslint报错
https://github.com/PanJiaChen/vue-element-admin/issues/225  #shadow-root(closed)图标无法显示