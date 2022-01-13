---
title: Mojs
date: 2021-10-11 14:30:54
categories: 其他
---
### 1. 埋点
调用客户端Api`sendCollect`发送。

### 2. 调用客户端API
实际调用`window._cefQuery`或`window._jsAsyncCall`方法。
`MoJsAsyncCall`
`MoJsAsyncCallWith`

### 3. 跨浏览器通信
相同域名、相同路径的页面之间的跨浏览器通信。`useCrossWindowCommunicate(string, cb)`