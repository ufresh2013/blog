---
title: Promise使用场景与实现
date: 2019-06-06 20:38:50
category: JS
---



### 1. 地狱回调
在Promise出现之前，当我们需要根据第一个网络请求的结果，再去执行第二个网络请求....代码大概如下：
```js
let fs = require('fs')
fs.readFile('./a.txt','utf8',function(err,data){
  fs.readFile(data,'utf8',function(err,data){
    fs.readFile(data,'utf8',function(err,data){
      console.log(data)
    })
  })
})
```
回调地狱 出现了。这时，有人提议用一种更加友好的代码组织方式，解决异步嵌套的问题。于是Promise规范诞生了。
```js
let fs = require('fs');

funtion read(url) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, 'urf8', function(error, data){
      error && reject(error);
      resolve(data)
    })
  })
}

read('./a.txt').then(data => {
  return read(data)
}).then(data => {
  return read(data)
}).then(data => {
  console.log(data)
})
```




<br/>
### 2. 常见异步编程方案
#### 2.1 回调函数callback
```js
// ajax readystatechange == 4 执行回调函数
$.ajax('http://www.baidu.com', {
  success: function(res){
    // ... 
  }
})

// jquery加载完执行callback
$(function(){
  // ....
})
```



<br/>
#### 2.2 事件监听
start的执行不取决于代码的顺序，而取决于事件是否发生。
```js
function start(){
  // 响应事件
}

document.getElementById('start').addEventListerner('click', start, false);
```



<br/>
#### 2.3 发布/订阅
事件可以理解成“信号”， 如果存在一个“信号中心”，某个任务执行完成，就向信号中心“发布”一个信号。其他任务可以向信号中心“订阅”(subscribe)这个信号，从而知道什么时候自己可以开始执行。这叫做“发布/定于模式”，又称“观察者模式”。

f1执行完成后，向信号中心jQuery发布done信号，从而引发f2的执行。
```js
jQuery.subscribe('done', f2);

function f1() {
  setTimeout(function(){
    // ...
    jQuery.publish('done');
  })
}
```



<br/>
### 3. Promise
在浏览器里,回调主要出现在ajax, file API, 事件监听里，这个时候问题尚不严重。有了Node.js以后，无阻塞高并发的特点，产生了大量操作依赖回调函数。

*异步函数的问题*
- 异步函数在一个新的栈里面执行，外面的栈无法通过try()catch{}捕获这个栈的错误信息
- 无法判断多个异步函数的完成顺序，我们需要把返回结果存储在外层作用域。这时候外部变量容易出现错误

基于这些问题，Promise提出了一套将异步操作队列化，使异步计算按照期望的顺序执行的方法。

```js
new Promise(
  // 执行器
  function(resolve, reject) {
    // 一段耗时很长的异步操作
    resolve(); // 数据处理完成，调用resolve，改变promise实例的状态
    reject();  // 数据处理出错，调用reject，改变promise实例的状态
  }
)
.then(function A(){
  // 上面的resolve执行后，执行这里
}, function B(){
  // 上面的reject执行后，执行这里
})
```

- 一个Promise表示一个现在、将来或永不可能可用的值。
- Promise有3个状态：pending(初始状态), fulfilled(操作成功), rejected(操作失败)
- Promise状态发生改变，就会触发.then()里的响应函数处理后续步骤
- Promise状态已经修改，不会再变
- Promise实例一经创建，执行器立即执行
- .then()接受两个函数作为参数，分别代表fulfilled和rejected。当前面的Promise状态改变时，.then()根据其最终状态，选择特定的状态响应函数执行。
- .then()返回一个新的Promise实例，所以它可以链式调用
- 如果.then()返回其他任何值，则会立即执行下一级.then()
- 错误处理的两种做法： `reject('错误信息').then(null, message => {})`; `throw new Error('错误信息').catch(message => {})`。建议在队列的最后面加上`.catch()`，以避免漏掉错误处理。

```js
new Promise(resolve => {
  setTimeout(() => {
    resolve('hello')
  }, 2000);
})
.then(value => {
  console.log(value);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('world')
    }, 2000)
  })
})
.then(value => {
  console.log(value + 'world')
})

// 2s hello
// 再过2s hello world
```
另一个例子
```js
console.log('start');

let promise = new Promise(resolve => {
  setTimeout(() => {
    console.log('the promise fulfilled');
    resolve('hello world')
  }, 1000)
})

setTimeout(() => {
  promise.then(value => {
    console.log(value)
  })
}, 3000)

// start
// 1s后 the promise fulfilled
// 再过2s hello world
```



<br/>
### 2. Promise API
Promise对象用于表示一个异步操作的最终完成（或失败），及其结果值。executor是带有resolve和reject两个参数的函数，Promise执行时立即调用executor函数。
```js
function myAsyncFunc(url) {
  return new Promise((resolve, reject) => {
    /* executor */
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
  })
}
```

- Promise.prototype.then


- Promise.all(iterable)
iterable参数对象里所有的promise对象都成功的时候才会触发成功，返回一个新的promise对象，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致。如果触发了失败状态，会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。

- Promise.race(iterable)
当iterable参数里的任意一个子promise被成功或失败后，这个子promise的成功/失败返回值返回。

- Promise.reject(reason)
返回一个状态为失败的Promise对象

- Promise.resolve(value)
返回一个状态为成功的Promise对象

- Promise.prototype.then(onFulfilled, onRejected)


- Promise.prototype.catch(onRejected)
添加一个拒绝回调到当前promise

- Promise.prototype.finally(onFinally)
添加一个事件处理回调于当前promise对象，回调会在当前promise运行完毕后被调用，无论当前promise的状态是fulfilled还是rejected。


#### 2.2 Promise.resolve()
返回一个状态已变成resolved状态的Promise实例
```js
let promise = Promise.reslove($.ajax('/test/test.json'));
promise.then(function(valeu){
  console.log(value)
})
```

#### 2.3 Promise.reject()
返回一个状态已变成rejected的Promise实例

#### 2.4 Promise.race()
类似Promise.all(),区别在于它有任意一个完成就算完成。

#### 2.5 Promise.prototype.then
为Promise注册回调函数。then方法可以被同一个promise调用多次。当promise成功执行时，所有onFulfilled需按照其注册顺序依次回调。当promise被拒绝执行时，所有的onRejected需按照其注册顺序依次回调。


<br/>
### 3. 实现一个简单版Promise
使用宏观任务机制(setTimeout),确保onFulfilledCallbacks，onRejectedCallbacks在then方法被调用的那一轮事件循环之后的新执行栈中执行。


```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class AjPromise{
  constructor(fn) {
    // 当前状态
    this.state = PENDING;
    // 终值
    this.value = null;
    // 拒因
    this.reason = null;
    // 成功态回调队列
    this.onFulfilledCallbacks = [];
    // 拒绝态回调队列
    this.onRejectedCallbacks = [];

    // 成功态回调
    // 当前异步操作执行完毕，调用then方法里的第一个方法
    const resolve = value => {
      // 使用macro-task机制(setTimeout)， 确保onFulfilled在then方法被调用的那一轮事件循环之后的新执行栈中执行
      setTimeout(() => {
        if (this.state === PENDING) {
          // pending态迁移至fulfilled，保证调用次数不超过一次
          this.state = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.map(cb => {
            this.value = cb(this.value)
          })
        }
      })
    }

    // 拒绝态回调
    const reject = reason => {
      // 使用macro-task机制(setTimeout)，确保onRejected在then方法被调用的那一轮事件循环之后的新执行栈中执行
      setTimeout(() => {
        if (this.state === PENDING) {
          // pending态迁移至fulfilled态，保证调用次数不超过一次
          this.state = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.map((cb) => {
            this.reason = cb(this.reason);
          })
        }
      })
    }

    try {
      fn(resolve, reject)
    } catch(e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected){
    typeof onFulfilled === 'function' && this.onFulfilledCallbacks.push(onFulfilled);
    typeof onRejected === 'function' && this.onRejectedCallbacks.push(onRejected);
    return this;
  }
}


new AjPromise((resolve, reject) => {
  setTimeout(() => {
    // 2s后执行成功
    // 执行成功后，调用resolve()，通知promise当前异步操作执行完成
    resolve(2);
  }, 2000)
})
.then(res => {
  console.log(res);
  return res + 1;
})
.then(res => {
  console.log(res);
})

// 2s后出现
// 2
// 3
```

<br/>
### 4. Promise题目
- 实现一个sleep函数，sleep(1000)以为这等待1000毫秒
```js
const sleep = (t) => {
  return new Promise(resolve, reject) => {
    setTimeout(resolve, t)
  }
} 

sleep(1000).then(() => {})
```

<br/>

- promise构造函数是同步执行还是异步执行？then呢？
promise构造函数是同步执行的，then方法是异步执行的
```js
const promise = new Promise((resolve, rejcet) => {
  console.log(1)
  resolve()
  console.log(2)
})

promise.then(() => {
  console.log(3)
})

console.log(4)
// 执行结果是1243


const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(5);
  console.log(2);
}).then(val => {
  console.log(val);
});

promise.then(() => {
  console.log(3);
});

console.log(4);

setTimeout(function() {
  console.log(6);
});
// 执行结果是1243

```


- setTimeout, promise, async/await的区别


- Promise.all使用、原理实现及错误处理
Promise.all()接受一个由promise任务组成


<br/>
### 参考资料
- [你能手写一个Promise吗？Yes I promise。](https://juejin.im/post/5c41297cf265da613356d4ec)
- https://juejin.im/post/5b31a4b7f265da595725f322
- https://juejin.im/post/5b32f552f265da59991155f0
- https://juejin.im/post/5aa7868b6fb9a028dd4de672
- https://wangdoc.com/javascript/async/index.html
- https://www.jianshu.com/p/8d5c3a9e6181
- [前端基础进阶（十三）：透彻掌握Promise的使用，读这篇就够了](https://www.jianshu.com/p/fe5f173276bd)