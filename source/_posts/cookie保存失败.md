---
title: Safari 里的 iframe，Set-Cookie会失败
date: 2021-08-16 22:44:14
category: Bug
---

Safari 的安全策略太严格了，iframe 嵌套的网站的 cookie 被认为是不安全的，因此不允许保存，这就导致了用户即使在 iframe 中登录了网站，也无法保持登录状态，每次跳转页面之后就需要重新登录。

解决方法：
强行把 iframe 的父级页面跳转到子页面所在的网站，跳转时携带登录信息，后端设置好 cookie 后，再重定向到父级页面，这时候设置的 cookie 就被认为是安全的了。

