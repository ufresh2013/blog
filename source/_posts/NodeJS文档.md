---
title: NodeJS常用模块
date: 2019-09-26 10:08:48
category: NodeJS
---
Node.js 不是一门语言也不是框架，它只是基于 Google V8 引擎的 JavaScript 运行时环境，同时结合 Libuv 扩展了 JavaScript 功能，使之支持 io、fs 等只有语言才有的特性，使得 JavaScript 能够同时具有 DOM 操作(浏览器)和 I/O、文件读写、操作数据库(服务器端)等能力，是目前最简单的全栈式语言。

### 1. 全局对象
*真正的全局对象*
- Buffer
- process
- console
- clearInterval、setInterval
- clearTimeout、setTimeout
- global

*模块级别的全局对象*
- __dirname： 获取当前文件所在的路径，不包括后面的文件名
- __filename：获取当前文件所在的路径和文件名称，包括后面的文件名称
- exports
- module
- require



### 2. process
当前 Node.js 进程的信息
- process.env：环境变量，例如通过 `process.env.NODE_ENV 获取不同环境项目配置信息
- process.argv：传入的命令行参数
- process.nextTick：这个在谈及 EventLoop 时经常为会提到
- process.pid：获取当前进程id
- process.ppid：当前进程对应的父进程
- process.cwd()：获取当前进程工作目录，
- process.platform：获取当前进程运行的操作系统平台
- process.uptime()：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
- 进程事件： process.on(‘uncaughtException’,cb) 捕获异常信息、 process.on(‘exit’,cb）进程推出监听
- 三个标准流： process.stdout 标准输出、 process.stdin 标准输入、 process.stderr 标准错误输出
- process.title 指定进程名称，有的时候需要给进程指定一个名称




### 3. fs
读取本地文件的能力
- 文件读取: readFileSync, fs.readFile
- 文件写入：writeFileSync, writeFile
- 文件追加写入：appendFileSync，appendFile
- 文件拷贝：copyFileSync，copyFile
- 创建目录：mkdirSync，mkdir
```js
const fs = require("fs");
let buf = fs.readFileSync("1.txt");
let data = fs.readFileSync("1.txt", "utf8");
console.log(buf); // <Buffer 48 65 6c 6c 6f>
console.log(data); // Hello
```



### 4. buffer(缓冲区)
Buffer就是在内存中开辟一片区域（初次初始化为8KB），用来存放二进制数据。如果数据到达的速度比进程消耗的速度快，那么少数早到达的数据会处于等待区等候被处理。反之，如果数据到达的速度比进程消耗的数据慢，那么早先到达的数据需要等待一定量的数据到达之后才能被处理。
```js
const fs = require('fs');
const inputStream = fs.createReadStream('input.txt'); // 创建可读流
const outputStream = fs.createWriteStream('output.txt'); // 创建可写流
inputStream.pipe(outputStream); // 管道读写
```



### 5. Stream
流（Stream），是一个数据传输手段，是端到端信息交换的一种方式，而且是有顺序的,是逐块读取数据、处理内容，用于顺序读取输入或写入输出。
- createReadStream
- createWriteStream
- get请求返回给客户端
```js
const server = http.createServer(function (req, res) {
  const method = req.method; // 获取请求方法
  if (method === 'GET') { // get 请求
    const fileName = path.resolve(__dirname, 'data.txt');
    let stream = fs.createReadStream(fileName);
    stream.pipe(res); // 将 res 作为 stream 的 dest
  }
});
```



### 6. EventEmit
观察者模式，被观察者(主体)维护着一组其他对象派来(注册)的观察者，有新的对象对主体感兴趣就注册观察者，不感兴趣就取消订阅，主体有更新的话就依次通知观察者们
```js
// 实现代码
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, handler) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(handler);
  }

  addListener(type,handler){
    this.on(type,handler)
  }

  prependListener(type, handler) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].unshift(handler);
  }

  removeListener(type, handler) {
    if (!this.events[type]) {
      return;
    }
    this.events[type] = this.events[type].filter(item => item !== handler);
  }

  off(type,handler){
    this.removeListener(type,handler)
  }

  emit(type, ...args) {
    this.events[type].forEach((item) => {
      Reflect.apply(item, this, args);
    });
  }

  once(type, handler) {
    this.on(type, this._onceWrap(type, handler, this));
  }

  _onceWrap(type, handler, target) {
    const state = { fired: false, handler, type , target};
    const wrapFn = this._onceWrapper.bind(state);
    state.wrapFn = wrapFn;
    return wrapFn;
  }

  _onceWrapper(...args) {
    if (!this.fired) {
      this.fired = true;
      Reflect.apply(this.handler, this.target, args);
      this.target.off(this.type, this.wrapFn);
    }
  }
}

```




### 7. path




### 8. 中间件
在NodeJS中，中间件指封装`http`请求细节处理的方法，如express, koa里，通过将公共逻辑的处理编写在中间件中，可以不用在每一个接口回调中做相同的代码编写。

- token校验
```js
module.exports = (options) => async (ctx, next) {
  try {
    const token = ctx.header.authorization
    if (token) {
      try {
        await verify(token) // 验证 token，并获取用户相关信息
      } catch (err) {
        console.log(err)
      }
    }
    await next() // 进入下一个中间件
  } catch (err) {
    console.log(err)
  }
}
```

- 日志模块
```js
const fs = require('fs')
module.exports = (options) => async (ctx, next) => {
  const startTime = Date.now()
  const requestTime = new Date()
  await next()
  const ms = Date.now() - startTime;
  let logout = `${ctx.request.ip} -- ${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
  // 输出日志文件
  fs.appendFileSync('./log.txt', logout + '\n')
}
```

- koa-bodyParser
将我们的 post 请求和表单提交的查询字符串转换成对象，并挂在 ctx.request.body 上，方便我们在其他中间件或接口处取值
```js
// 文件：my-koa-bodyparser.js
const querystring = require("querystring");

module.exports = function bodyParser() {
  return async (ctx, next) => {
    await new Promise((resolve, reject) => {
      // 存储数据的数组
      let dataArr = [];

      // 接收数据
      ctx.req.on("data", data => dataArr.push(data));

      // 整合数据并使用 Promise 成功
      ctx.req.on("end", () => {
        // 获取请求数据的类型 json 或表单
        let contentType = ctx.get("Content-Type");

        // 获取数据 Buffer 格式
        let data = Buffer.concat(dataArr).toString();

        if (contentType === "application/x-www-form-urlencoded") {
          // 如果是表单提交，则将查询字符串转换成对象赋值给 ctx.request.body
          ctx.request.body = querystring.parse(data);
        } else if (contentType === "applaction/json") {
          // 如果是 json，则将字符串格式的对象转换成对象赋值给 ctx.request.body
          ctx.request.body = JSON.parse(data);
        }

        // 执行成功的回调
        resolve();
      });
    });

    // 继续向下执行
    await next();
  };
};
```

- koa-static
是在服务器接到请求时，帮我们处理静态文件
```js
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const { promisify } = require("util");

// 将 stat 和 access 转换成 Promise
const stat = promisify(fs.stat);
const access = promisify(fs.access)

module.exports = function (dir) {
    return async (ctx, next) => {
      // 将访问的路由处理成绝对路径，这里要使用 join 因为有可能是 /
      let realPath = path.join(dir, ctx.path);

      try {
        // 获取 stat 对象
        let statObj = await stat(realPath);

        // 如果是文件，则设置文件类型并直接响应内容，否则当作文件夹寻找 index.html
        if (statObj.isFile()) {
          ctx.set("Content-Type", `${mime.getType()};charset=utf8`);
          ctx.body = fs.createReadStream(realPath);
        } else {
          let filename = path.join(realPath, "index.html");

          // 如果不存在该文件则执行 catch 中的 next 交给其他中间件处理
          await access(filename);

          // 存在设置文件类型并响应内容
          ctx.set("Content-Type", "text/html;charset=utf8");
          ctx.body = fs.createReadStream(filename);
        }
      } catch (e) {
        await next();
      }
    }
}
```




### 参考资料
- [一篇文章构建你的 NodeJS 知识体系](https://www.zhihu.com/search?type=content&q=nodejs%E6%96%87%E6%A1%A3)
- [狼叔：如何正确的学习Node.js](https://i5ting.github.io/How-to-learn-node-correctly/)