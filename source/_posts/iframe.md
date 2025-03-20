---
title: iframe的各种问题
date: 2019-04-30 10:20:51
category: Bug
---
### 1. 视频无法全屏
使用video.js时，iframe内嵌视频无法全屏。 为iframe添加`allowfullscreen`属性即可
```html
<iframe src="video.html" 
	frameborder="0" 
	width="100%" 
	height="100%" 
	scrolling="no" 
	allowfullscreen="true" 
	webkitallowfullscreen="true"
	mozallowfullscreen="true"></iframe>
```

<br/>
### 2. safari浏览器中iframe嵌套的页面无法保存cookie
Safari 的安全策略太严格了，iframe 嵌套的网站的 cookie 被认为是不安全的，因此不允许保存，这就导致了用户即使在 iframe 中登录了网站，也无法保持登录状态，每次跳转页面之后就需要重新登录。 

解决方法：
强行把 iframe 的父级页面跳转到子页面所在的网站，然后设置好 session ，再重定向到父级页面，这时候设置的 cookie 就被认为是安全的了。 


<br/>
### 3. iframe在IOS手机上无法滚动
解决方法：
```html
<style>
  .iframe-outer{
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    top: 0;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
  }
</style>
<div class="iframe-outer">
  <iframe
    style="width: 100%; height: 100%; border: none; "
    allowfullscreen="true"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    src=""
  ></iframe>
</div>
```
