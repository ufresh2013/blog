---
title: create-react-app
date: 2021-08-08 16:34:42
tags:
---

用到的工具库
- commander 
Node.js命令行解决方案



### Create-react-app源码
代码的入口在 packages/create-react-app/index.js，核心代码在createReactApp.js，核心代码在600多行左右

关于 commander 的使用，这里就不介绍了，对于 create-react-app 的流程我们需要知道的是，它，初始化了一些 create-react-app 的命令行环境，这一波操作后，我们可以看到 program 张这个样纸