---
title: 🤔 Eventloop 事件循环 与 页面渲染
date: 2019-07-14 15:47:26
category:
- Browser
---

每一轮 Event Loop 都会伴随着渲染吗？
requestAnimationFrame 在哪个阶段执行，在渲染前还是后？在 microTask 的前还是后？
requestIdleCallback 在哪个阶段执行？如何去执行？在渲染前还是后？在 microTask 的前还是后？
resize、scroll 这些事件是何时去派发的。

这些都要从事件循环说起。它是浏览器调度任务的基础。



### 1. EventLoop
浏览器管理和执行任务的一套机制，为了协调用户交互，事件触发，脚本，渲染，网络任务等任务。


### 2. JS单线程
作为浏览器脚本语言，javascript的主要用途是与用户交互，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？为了避免复杂性，*Javascript就是单线程，也就是同一个时刻只能做一件事情*。所有任务都需要排队，前一个任务结束，才会执行后一个任务。




### 3. 异步任务
*那为什么浏览器可以同时执行异步任务呢？*

因为浏览器是多线程的，当 JS 需要执行异步任务时，浏览器会另外启动一个线程去执行该任务。也就是说，“JS 是单线程的”指的是执行 JS 代码的线程只有一个，是浏览器提供的 JS 引擎线程（主线程）。浏览器中还有定时器线程和 HTTP 请求线程等，这些线程主要不是来跑 JS 代码的。

比如主线程中需要发一个 AJAX 请求，就把这个任务交给另一个浏览器线程（HTTP 请求线程）去真正发送请求，待请求回来了，再将 callback 里需要执行的 JS 回调交给 JS 引擎线程去执行。

作为前端开发者，主要重点关注其渲染进程，渲染进程下包含了 JS 引擎线程、HTTP 请求线程和定时器线程等，这些线程为 JS 在浏览器中完成异步任务提供了基础。
<img src="1.png" style="max-width: 600px; margin-top: 10px">


### 4. 事件循环
事件循环是浏览器管理和执行上面所有同步、异步事件的一套机制。

JS 在解析一段代码时，会将同步代码按顺序排在某个地方，即执行栈，然后依次执行里面的函数。当遇到异步任务时就交给其他线程处理，待当前执行栈所有同步代码执行完成后，会从一个队列中去取出已完成的异步任务的回调加入执行栈继续执行，遇到异步任务时又交给其他线程，.....，如此循环往复。



Event Loop的运行机制:
- 所有同步任务都在主线程上执行，形成一个执行栈
- 主线程之外，还存在一个任务队列。只要异步任务有了运行结果，就在任务队列中放置一个事件。
- 一旦“执行栈”中的所有同步任务执行完毕，系统就会读取“任务队列”，看看里面有哪些事件。这些事件，可以结束等待状态，进入执行栈，开始执行。
- 主线程不断重复上面步骤

只要主线程空了，就会去读取“任务队列”，这个运行机制被称为*Event Loop*

<img src="2.png">



### 5.任务
我们把宿主发起的任务成为*宏观任务*，把js引擎发起的任务成为*微观任务*。
微任务是在当前事件循环的尾部去执行；宏任务是在下一次事件循环的开始去执行。我们来看看微任务和宏任务的本质区别是什么。


#### 5.1 宏观任务
宏观任务的队列相当于事件循环。在宏观任务中，javascript的Promise还会产生异步代码，js会保证这些异步代码在一个宏观任务中完成，因此宏观任务中又包含了一个微观任务队列，机制如下：
- 执行一个宏任务（栈中没有就从事件队列中获取）
- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
- 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
- 渲染完毕后，js线程继续接管，开始下一个宏任务

<img src="3.png" style="max-width:300px">

宏观任务有：
- 页面加载，解析HTML, UI渲染
- 执行js代码
- UI交互，触发事件
- 修改url
- setTimeout,setInterval,setImmediate
- requestAnimationFrame





#### 5.2 微观任务
Promise是js语言提供的一种标准化的异步管理方式。Promise永远在队列尾部添加微观任务，setTimeout等宿主API,则会添加宏观任务。

微观任务有: 
- MutationObserver 监听DOM数变化
- Promise 被resolve或reject后，通过then,catch,finally注册的回调函数会被放入微观任务队列中
- process.nextTick
- Object.observer


Promise的resolve始终是异步操作，所以c无法出现在b之前
```js
var r = new Promise(function(resolve, reject){
  console.log('a');
  resolve()
})
r.then(() => console.log('c'));
console.log('b');

// a b c
```

Promise产生的是Javascript引擎内部的微任务，而setTimeout是浏览器API，它产生宏任务。微任务始终先于宏任务。
```js
var r = new Promise(function(resolve, reject){
  console.log('a');
  resolve()
});
setTimeout(() => console.log('d'), 0);
r.then(() => console.log('c'));
console.log('b');

// a b c d
```

执行一个耗时1s的Promise，确保了任务b是在d之后被添加到任务队列。即使耗时一秒的c执行完毕，才执行b，它们仍然先于d执行。
```js
setTimeout(() => console.log('d'), 0);
var r = new Promise(function(resolve, reject){
  resolve();
})
r.then(() => {
  var begin = Date.now();
  while(Date.now() - begin < 1000){
    console.log('c');
    new Promise(function(resolve, reject){
      resolve()
    }).then(() => console.log('b'))
  }
})

// c b d
```

第一个宏观任务中，执行了a,b。setTimeout后，第二个宏观任务执行resolve，then中的异步代码得到执行，输出了c
```js
function sleep(duration){
  return new Promise(function(resolve, reject){
    console.log('b');
    setTimeout(resolve, duration)
  })
}
console.log('a');
sleep(500).then(() => console.log('c'))

// a b c
```

### 7. 常见问题
#### 7.1 SetTimeout误差
当执行 setTimeout 时，浏览器启动新的线程去计时，计时结束后触发定时器事件将回调存入宏任务队列，等待 JS 主线程来取出执行。如果这时主线程还在执行同步任务的过程中，那么此时的宏任务就只有先挂起，这就造成了计时器不准确的问题。



#### 7.2 页面渲染时机
1. 从任务队列中取出一个宏任务并执行。
2. 检查微任务队列，执行并清空微任务队列，如果在微任务的执行中又加入了新的微任务，也会在这一步一起执行。
3. 进入更新渲染阶段，判断是否需要渲染，这里有一个 rendering opportunity 的概念，也就是说不一定每一轮 event loop 都会对应一次浏览 器渲染，要根据屏幕刷新率、页面性能、页面是否在后台运行来共同决定，通常来说这个渲染间隔是固定的。（所以多个 task 很可能在一次渲染之间执行）

*此时，如果要判断要更新渲染：*
4. 如果窗口的大小发生了变化，执行监听的 resize 方法。
5. 如果页面发生了滚动，执行 scroll 方法。
6. 执行帧动画回调，也就是 requestAnimationFrame 的回调。
7. 执行 IntersectionObserver 的回调。
8. 对于需要渲染的文档，重新渲染绘制用户界面。
9. 判断 task队列和microTask队列是否都为空，如果是的话，则进行 Idle 空闲周期的算法，判断是否要执行 requestIdleCallback 的回调函数。
(*问题： 怎样确定一个函数在dom更新后执行？*)



#### 7.3 Vue NextTick原理
Vue 会依据当前环境依次尝试使用 Promise.then、MutationObserver 和 setImmediate 来实现异步执行，如果这些都不支持则使用 setTimeout。



#### 7.4 React Fiber的原理
React Fiber 的协调过程分为两个阶段：
- *渲染（render）阶段*：也称为协调（reconciliation）阶段，这个阶段会将更新任务拆分成多个小任务，每个小任务对应一个 Fiber 节点。React 会遍历 Fiber 树，为每个 Fiber 节点执行工作，这个过程是可以中断和恢复的。
- *提交（commit）阶段*：当渲染阶段完成后，React 会将所有的变更一次性应用到 DOM 上，这个阶段是不可中断的。

React Fiber 能实现中断主要是基于其将渲染任务拆分成众多小任务，并且借助调度器来管控这些小任务的执行。在浏览器的每一帧里，调度器会检查是否有空闲时间，若有就执行...

React 使用了 `MessageChannel` 可以更可靠地实现异步调度，避免了 `setTimeout` 可能存在的延迟不准确和 `requestIdleCallback` 受帧率限制的问题。



### 8. 相关API
#### 8.1 requestIdleCallback

#### 8.2 requestAnimationFrame
以往的JS动画通常是用setTimeout或setInterval定时器来实现，这种实现方法存在的问题，一是上面提到的“掉帧”，二是无法掌握回调函数的执行时机，三是系统性能的浪费，当页面转为后台运行时并不会自动停止。
requestAnimationFrame则解决了定时器的这些问题。当然，requestAnimationFrame并非完美，因为是在主线程上执行的，当主线程非常繁忙时，requestAnimationFrame的效果就大打折扣。


#### 8.3 messageChannel
MessageChannel 是一个 Web API，用于创建两个可以相互通信的端口（port1 和 port2）。当在一个端口调用 postMessage 方法发送消息时，消息不会立即被处理，而是会被放入任务队列，等主线程空闲时才会执行对应的 onmessage 事件处理函数。
```js
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// 监听 port1 的消息
port1.onmessage = function (event) {
    console.log('Received message:', event.data);
};

// 发送消息到 port2
port2.postMessage('Hello, MessageChannel!');
```




### 参考资料
- [深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://zhuanlan.zhihu.com/p/142742003)
- [面试必问之 JS 事件循环(Event Loop)，看这一篇足够](https://juejin.cn/post/7164224261752619016)