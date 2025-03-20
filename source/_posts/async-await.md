---
title: 异步方法：callback、Promise、async/await
date: 2019-11-16 12:12:52
category: JS
---
### 1. Promise
#### 1.1 Promise 解决了什么问题
为什么说Promise解决了地狱回调的问题？我们把地狱回调的代码改写成这样，这样的代码组织形式没有了层层嵌套的问题，咋一看，甚至还比Promise的要简洁。但它的每一处依然容易受到“回调地狱”的影响。为什么呢？
```js
// 回调
function main () {
  then(1)
}
function then1 (res) {
  then2(2)
}
function then2 () {}4

// Promise
new Promise((resolve, reject) => {
  resolve(1)
})
.then(res => {
  return new Promise((resolve, reject) => {
    resolve(2)
  })
})
.then(res => { })
```
为了将第2，3，4步链接在一起使他们相继发生，回调需要我们将第2 步硬编码在第1 步中，将第3 步硬编码在第2 步中，将第4 步硬编码在第3 步中，如此继续。


*Promise解决了什么问题：*
- 提供一个标准化的异步管理流程
需要进行 io、等待或者其它异步操作的函数，不返回真实结果，而返回一个“承诺”。你只需要设置回调，等待承诺兑现，解决回调函数相互调用之间的标准（信任）问题。

- 链式调用取代回调嵌套，处理流程更线性
过多的回调会导致代码的逻辑不连贯、不线性，不符合直觉。Promise封装异步代码，可以让处理流程变得线性，只需要关注输入和输出。

- 指定回调函数更加灵活
promise之前：必须在启动异步任务前指定
promise：启动异步任务=> 返回promise对象=> 给promise 对象绑定回调函数（可以绑定多个，延时绑定）




<br/>

#### 1.1 Promise 实现原理
Promise实际还是使用回调函数。它为每一个异步任务创建一个Promise实例，维护一个观察者模式。**通过`.then`收集回调 -> 异步触发resolve -> resolve触发回调执行。**

- 基本功能

 - Promise接收一个*`executor`*，在*`new Promsie`*的时候立刻执行
 - 异步任务被放入宏任务队列，等待执行
 - *`then()`*被执行，收集回调放入成功/失败回调队列
 - 异步任务执行成功调用*`resolve`*，执行失败调用*`reject`*，成功/失败回调队列执行
 ```js
// 一个极简的Promise
class MyPromise {
  constructor(executor) {
    this._resolveQueue = []    // then收集的执行成功的回调队列

    // resolve等待被异步任务执行，resolve执行时，取出回调一次执行
    let _resolve = (val) => {
      while(this._resolveQueue.length) {
        const callback = this._resolveQueue.shift()
        callback(val)
      }
    }
    // new Promise()时立即执行executor
    executor(_resolve, _reject)
  }

  // then方法,接收一个成功的回调和一个失败的回调，并push进队列
  then(resolveFn, rejectFn) {
    this._resolveQueue.push(resolveFn)
  }
}
```
- 链式调用
  - `then`负责收集成功回调 和 失败回调
  - `then`返回的一定是一个新的Promise，保证每个promise都是独立的
  - `then`的回调需要拿到上一个`then`的返回值
  - 当`then`里是一个promise的时候，如何将这个promise的值传递给下一个then

- 延迟机制
  无论`resolve`是被同步执行，还是异步执行，都放在`setTimeout`中保证异步执行。保证回调函数可以延迟绑定

- 状态机
  Promise状态只能有`Pending`, `Fulfilled`,`Rejected`，状态的变更是单向的，只能从Pending -> Fulfilled, Pending -> Rejected，状态变更不可逆


<br/>

#### 1.2 实现一个Promise
```js
//Promise/A+规定的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 构造方法接收一个回调
  constructor(executor) {
    this._status = PENDING     // Promise状态
    this._value = undefined    // 储存then回调return的值
    this._resolveQueue = []    // 成功队列, resolve时触发
    this._rejectQueue = []     // 失败队列, reject时触发

    let _resolve = (val) => {
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED              // 变更状态
        this._value = val                     // 储存当前value

        // then可以被同一个 promise 调用多次，因此使用一个队列来储存回调
        while(this._resolveQueue.length) {    
          const callback = this._resolveQueue.shift()
          callback(val)
        }
      }
      // 无论resolve是被同步代码，还是异步代码，都放在setTimeout中保证延迟调用
      setTimeout(run)
    }

    let _reject = (val) => {
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = REJECTED               // 变更状态
        this._value = val                     // 储存当前value
        while(this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // new Promise()时立即执行executor
    executor(_resolve, _reject)
  }

  // then收集成功回调 和 失败回调
  then(resolveFn, rejectFn) {
    // 根据规范，如果then的参数不是function，则忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = reason => {
      throw new Error(reason instanceof Error? reason.message:reason);
    } : null
  
    // then总是返回一个新的promise
    return new MyPromise((resolve, reject) => {
      const fulfilledFn = value => {
        try {
          let x = resolveFn(value)
          /*
          之前一直不了解 为什么如果x是promise，就需要执行x.then()，苦想一段时间后有点体会：
  在这里只讨论 p1.then(() => { return new Promise() }).then() 的情况
  首先 第一个 .then() 内部默认会返回一个promise，叫做promiseA，开发者如果有需求则会手动return一个 新的 promise，叫做 promiseB，也就是上文的 x 。
  第二个.then()的回调函数参数实际上应该获取到的是开发者写的 promiseB(也就是x) 的执行结果，但是由于默认返回一个promiseA，则第二个.then()的回调函数参数是 promiseA 的执行结果.。 
  因此想要第二个.then()获取到的结果是正确的结果，就需要先执行 promiseB，再把 promiseB 的结果丢到promiseA。
  因此在得到 x 为 promise 的时候，先执行 x.then(resolve) ，这个形参 resolve 是 promiseA 的 resolve函数 ， 等到 x （promiseB） 的状态发生变化的时候，会执行then收集到的回调，即会执行 A 的 resolve 函数，而 x.then 的回调函数的参数就是 promiseA 的 resolve函数的参数。这样就把 x （promiseB）的执行结果通过.then回调传递到了 promiseA，然后通过 promiseA 的 resolve 函数传递到了第二个.then()。
  个人认为这个方法的巧妙之处在于 将 promiseA 的的 resolve 作为 x （promiseB）的then回调，而then回调的参数正是 x（promiseB）的执行结果，这样就把数据传递了起来。
          */
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      const rejectedFn  = error => {
        try {
          let x = rejectFn(error)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      switch (this._status) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case PENDING:
          this._resolveQueue.push(fulfilledFn)
          this._rejectQueue.push(rejectedFn)
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fulfilledFn(this._value)    // this._value是上一个then回调return的值
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }
}
```

<br/>

#### 1.3 Promise API
- Promise.prototype.catch()
设置Promise的失败回调
```js
catch (rejectFn) {
  return this.then(undefined, rejectFn)
}
```

- Promise.prototype.finally()
在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。
```js
finally (callback) {
  return this.then(
    value => callback().then(())
  )
}
```

- Promise.resolve()
返回一个给定值resolve后的promise对象
```js
static resolve (value) {
  if (value instanceof MyPromise) return value
  return new MyPromise(resolve => resolve(value))
}
```

- Promise.reject()
返回一个带有拒绝原因的Promise对象
```js
static reject (reason) {
  return new MyPromise((resolve, reject) => reject(reason))
}

```

- Promise.all()
所有promise都完成(resolved)时
```js
static all (promiseArr) {
  let index = 0
  let result = []
  return new MyPromise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      // Promise.resolve(p)用于处理传入只不为promise的情况
      MyPromise.resolve(p).then(
        val => {
          index++
          result[i] = val
          if (index === promiseArr.length) {
            resolve(result)
          }
        },
        err => {
          reject(err)
        }
      )
    })
  })
}
```

- Promise.race()
一旦某个promise resolve或reject，返回的promise就会resolve或reject
```js
static race () {
  return MyPromise((resolve, reject) => {
    MyPromise.resolve(p).then(
      value => { resolve(value )},
      err => { reject(err) }
    )
  })
}
```

<br/>

### 2. async/await
提供了在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力，并且使得代码逻辑更加清晰，而且还支持 try-catch 来捕获异常，非常符合人的线性思维。

#### 2.1  async/await解决了什么问题
- 过多的链式调用可读性依然不佳
- 流程控制不方便
异步任务a->b->c之间存在依赖关系，如果我们通过then链式调用来处理这些关系，可读性并不是很好，如果我们想控制某些条件下，b不往下执行到c，那也不是很方便控制。但是如果用async/await来实现这个场景，可读性和流程控制都会方便不少。
```js
Promise.resolve(a)
  .then(b => {
    // do something
  })
  .then(c => {
    // do something
  })

async () => {
  const a = await Promise.resolve(a);
  const b = await Promise.resolve(b);
  const c = await Promise.resolve(c);
}。
```

<br/>

#### 2.1  Generator暂停恢复执行原理
async/await实际上是对Generator（生成器）的封装，是一个语法糖，并对Generator进行了改进。

Generator 函数是一个状态机，封装了多个内部状态。执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态，但是只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
hw.next()// { value: 'hello', done: false }
hw.next()// { value: 'world', done: false }
hw.next()// { value: 'ending', done: true }
hw.next()// { value: undefined, done: true }
```

#### 2.2 async/await实现原理
async函数对 Generator 函数的改进，体现在以下四点：

- 内置执行器。Generator 函数的执行必须依靠执行器，而 async 函数自带执行器，无需手动执行 next() 方法。
- 更好的语义。async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
- 更广的适用性。co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
- 返回值是 Promise。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用。

```js
// 定义了一个promise，用来模拟异步请求，作用是传入参数++
function getNum(num){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num+1)
        }, 1000)
    })
}

//自动执行器，如果一个Generator函数没有执行完，则递归调用
function asyncFun(func){
  var gen = func();

  function next(data){
    var result = gen.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

// 所需要执行的Generator函数，内部的数据在执行完成一步的promise之后，再调用下一步
var func = function* (){
  var f1 = yield getNum(1);
  var f2 = yield getNum(f1);
  console.log(f2) ;
};
asyncFun(func);
```

<br/>

#### 2.3 async/await优点
- 做到了真正的串行同步写法
- 对条件语句和其他流程语句比较友好，可以直接写到判断条件里
```js
async function f () {
  if (await a() === 2) {}
}
```

#### 2.4 async/await缺点
- async await是有传染性的 —— 当一个函数变为async后，这意味着调用他的函数也需要是async。
- 无法处理promise返回的reject对象，`await g()`会直接报错，必须用try...catch捕获
```js
function g () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('no')
    }, 2000)
  })
}
async function f () {
  const y = await g()
  console.log(y)
}

f()
```
- await只能串行，做不到并行。await一定是阻塞的，甚至可以阻塞for循环。await做不到并行，不代表async不能并行。只要await不在同一个async函数里就可以并行
```js
Promise.all(ajax1(), ajax2())


function g () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('no')
    }, 2000)
  })
}

// 耗时20s才打印完
async function f () {
  for (let var i = 0; i < 10; i++) {
    const y = await g()
    console.log(y)
  }
}

// async实现并行
function f () {
  [1,1,1].forEach(async () => {
    const y = await g()
    console.log(y)
  })
}
```
- 全局捕获错误必须用window.onerror，不像Promise可以专用window.addEventListener('unhandledrejection', function)，而window.onerror会捕获各种稀奇古怪的错误，造成系统浪费
- try..catch内部的变量无法传递个下一个try..catch
- 无法简单实现Promise的各种原生方法，如race()

<br/>

### 参考资料
- [Promise/async/Generator实现原理解析](https://juejin.cn/post/6844904096525189128)
- [图解 Promise 实现原理（二）—— Promise 链式调用](https://zhuanlan.zhihu.com/p/102017798)
- [Promise到底解决了哪些问题？](https://zhuanlan.zhihu.com/p/100416432)
- [async/await 原理及执行顺序分析](https://juejin.cn/post/6844903988584775693)
- [async/await 原理及简单实现](https://www.jianshu.com/p/0f1b6ae1888c)