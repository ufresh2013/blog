---
title: other
date: 2021-08-07 22:56:11
tags:
---

### 1. Web App
随着业务场景的逐渐丰富，纯Native开发已经不足以满足产品经理们日益增长的需求List，。如果这些业务逻辑都由Native进行开发迭代，那么客户端的业务代码势必变得越来越重，并且每一个活动的更新迭代都依赖各端（桌面端、iOS、安卓）发版。因此一套可以跨平台运行、独立更新发版的模式成为大势所趋，在这样的背景下，Web App成为了不二的选择。

- Native层： Electron, IOS-Native, Android-Native
- 容器层：WebView, WkWebView
  - 文件资源加载和解压的能力
  - 管理各种Web App生命周期的能力
  - 通信能力：Native层和容器内部Web App之间相互通信。例如
    - Native和Web之间的数据共享
    - 超越Web App自身生命周期的数据存储
    - 超越客户端的长连接以及调用原生能力
- 应用层：Web App
  
Web App的优点：
- 一套代码可以多端运行
- Web App的页面资源可以即时获取，独立于App发布和更新，无需依赖客户端发版和审核。
