---
title: Webpack碰到的问题
date: 2019-07-08 14:28:25
category: NodeJS
---

1. 定义全局less变量
2. 使用antd和css-modules冲突 https://www.zhihu.com/question/51513707
cssModules和className冲突
3. 配置简写路径 @
```
      alias: {
       '@': path.join(__dirname, '..', 'src')
      }
      ```
4. 使用babel-import-plugin实现antd按需加载  
5. create-react-app中引入iconfont svg
https://fog3211.com/blog/react-symbol-iconfont.html    eslint报错
https://github.com/PanJiaChen/vue-element-admin/issues/225  #shadow-root(closed)图标无法显示


<br/>
