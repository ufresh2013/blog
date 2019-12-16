---
title: NodeJS 搭建项目
date: 2019-09-22 15:26:28
tags:
---
NodeJS，一个javascript的运行环境。主要有两个用途：1. 运行在服务器，作为web server; 2. 运行在本地，作为打包、构建工具
```shell
# ECMAScripst是语法规范
nodejs = ECMAScript + nodejs API
浏览器端 = ECMAScript + web API
```

启动一个最简单的服务器
```js
// node index.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('<h1>hello world</h1>')
});

server.listen(3000, () => {
    console.log('listening on 3000 port')
})
```


使用nodemon监听app.js变更自动重启服务器
---


1. 数据库设计
- 博客
id title content createtime author

- 用户
id username password realname

2. 接口设计
获取博客列表 /api/blog/list 
获取博客内容 /api/blog/detail
新增博客 /api/blog/new
修改博客 /api/blog/update
删除博客 /api/blog/del
登录    /api/user/login