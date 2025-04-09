---
title: mac不区分大小写，linux服务器区分
date: 2021-08-20 12:49:15
category: Bug
---
macOS 默认是不区分文件路径中的大小写的，而 Linux 系统一般是区分大小写的。
很多同学的开发环境都是 macOS ，而发布、部署环境都是 Linux 。

当你`import`一个文件`list.js`，但是写成了`List.js`，mac上是没有问题的。
```js
import List from 'List'
```
但代码push到linux编译机上就会报找不到`List.js`的错误。

