---
title: Service Worker 实现离线页面访问
date: 2021-08-20 16:12:27
category: Browser
---
最近看Vue的官方文档的时候，发现没有网的时候，页面还是可以被刷出来，一看...恩，serviceWorker
我的博客也要来一套，走起~

<img src="1.jpg" style="width: 500px">

先看看Vue是怎么实现的
https://cn.vuejs.org/service-worker.js

要实现的效果
- 请求资源成功，缓存进serviceWorker
- 没网的时候，浏览器从serviceWorker取出资源
- 资源更新时，会拉去新的资源
- 有一天不想用serviceWorker了，可以卸载


<br/>

### 1. Service Worker
Service Worker采用JavaScript控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。你可以完全控制应用在特定情形（最常见的情形是网络不可用）下的表现。

- Service worker运行在worker上下文，因此它不能访问DOM。
- 相对于驱动应用的主JavaScript线程，它运行在其他线程中，所以不会造成阻塞。
- 出于安全考量，Service workers只能由HTTPS承载，毕竟修改网络请求的能力暴露给中间人攻击会非常危险。
- 被install后就永远存在，除非被手动卸载


<br/>

### 2. 实现资源拦截
请求成功时，正常返回请求内容，将资源缓存起来。没网的时候返回缓存资源。
```js
// 注册Sevice worker
window.addEventListener("load", event => {
  // 判断浏览器是否支持
  if ("serviceWorker" in navigator) {
    window.navigator.serviceWorker
      .register("/sw.js", {
        scope: "/"
      })
  }
});

// 资源拦截
const VERSION = '1.0.0'
this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      let request = event.request.clone();
      return fetch(request).then(httpRes => {
        // http请求的返回已被抓到，可以处置了。
        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        let responseClone = httpRes.clone();
        caches.open(VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });

        return httpRes;
      }, err => {
        // 如果 Service Workder 之前存储了该资源，返回该资源
        if (response) {
          return response;
        }
      });
    })
  );
});
```


断网了再刷新这个页面试试，可以了~


<br/>

### 参考资料
- [Service Worker离线缓存实践](https://juejin.cn/post/6844903906670018568)
- [service worker 是什么？看这篇就够了](https://zhuanlan.zhihu.com/p/115243059)
- [Service Worker离线缓存实战](https://cloud.tencent.com/developer/article/1617365)
