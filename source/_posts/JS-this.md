---
title: JS this，执行上下文，作用域
date: 2019-07-29 12:06:20
category: JS
---

### 1. 执行上下文
每当Javascript代码在运行的时候，它都是在执行上下文中运行。js中有三种执行上下文

- 全局执行上下文
任何不在函数内部的代码都在全局上下文中。它会执行两件事：创建一个全局的window对象，并且设置`this`的值等于这个全局对象。一个程序中只会有一个全局执行上下文。

- 函数执行上下文
每当一个函数被调用时，都会为该函数创建一个新的上下文。

- eval函数执行上下文
执行在eval函数内部的代码会有它属于自己的执行上下文。

<br/>

#### 1.1 创建执行上下文
创建执行上下文时，会
- 初始化作用域链
- 创建变量对象 —— 创建arguments， 扫描函数声明，扫描变量声明
  词法环境是一种持有标识符 —— 变量映射的结构。它内部有两个组件：
  - 环境记录器，函数内部定义的变量将被存储在环境记录器中。
  - 外部环境的引用，它可以访问的父词法环境（作用域）。会是全局环境，以及任何包含此内部函数的外部函数。

- 决定this的值。
在全局执行上下文中，`this`的值指向全局对象。在函数执行上下文中，`this`的值取决于该函数是如何别调用的。如果它被一个引用对象调用，那么`this`会被设置成那个对象，否则`this`的值别设置为全局对象或`undefined`(严格模式下)



<br/>

#### 1.2 压入执行栈
创建后的执行上下文，会被压入执行栈。*执行栈* 是一种用于LIFO（后进先出）数据结构的栈，被用来存储代码运行时创建的所有执行上下文。
```js
function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');
```
当JS引擎第一次遇到脚本时，它会创建一个全局的执行上下文并且压入当前执行栈。当遇到`first()`函数调用时，JS引擎为该函数创建一个新的执行上下文并把它压入当前执行栈的顶部。

当从`first()`函数内部调用`second()`，JS引擎为`second()`函数创建了一个新的执行上下文并把它压入当前执行栈的顶部。当`second()`执行完毕，它的执行上下文会从当前栈弹出，并且控制流程到达下一个执行上下文。

<img src="1.png">


<br/>
<br/>

<br/>

#### 1.3 内存泄露
这些不再被需要的内存，由于某种原因，无法被释放，就是内存泄露。常见的内存泄露案例
- 意外的全局变量
- 被遗忘的计时器或回调函数
- DOM引用
- 闭包


##### 1.3.1 意外创建全局变量
this被指向了全局变量window，意外地创建了全局变量。还有一些明确定义的全局变量，用来暂存大量数据，记得在使用后，对其重新赋值为null。或在javascript文件头部加上*`use strict`*。
```js
function fn() {
  this.name = '123'
  // name = '123'
}
fn()
console.log(name);  // "123"
```


<br/>

##### 1.3.2 未销毁的定时器
没有回收定时器，整个定时器依然有效，不但定时器无法被内存回收，定时器函数的依赖也无法回收。


<br/>

##### 1.3.3 DOM引用
当删除button的DOM节点时，变量button仍保存在内存中。
```js
var btn = document.getElementById('myBtn');
btn.onclick = function() {
  btn.innerHTML = 'hello'
}
document.body.removeChild(btn);
btn = null;
```

<br/>

##### 1.3.4 闭包
**闭包**是指读取了其他函数内部变量的函数。创建闭包的常见方式，就是在一个函数内部创建另一个函数。
```js
function createComparisonFunction(propertyName) {
  return function(object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];

    return value1 - value2;
  }
}
```


*模拟私有方法*
```js
var makeCounter = (function() {
  var privateCounter = 0;
  function change(val) {
    privateCounte += val;
  }

  return {
    increment: function() {
      change(1)
    },
    decrement: function() {
      change(-1)
    },
    value: function() {
      return privateCounter;
    }
  }
})()
var counter1 = makeCounter();
counter1.increment();
console.log(counter1.value())
```

<br/>

*使用匿名闭包*
使用匿名闭包，使得循环中被创建的方法，不会共享同一个词法作用域。或者，使用let而不是var，就不需要增加额外的闭包。
```js
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    // (function() {
    //   var item = helpText[i];
    //   document.getElementById(item.id).onfocus = function() {
    //     showHelp(item.help);
    //   }
    // })()
    let item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    }
  }
}

setupHelp();
```


<br/>

#### 1.4s use strict
使用严格模式，可以减少意外创建全局变量，导致内存泄露的情况。一些在正常模式下可以运行的语句，在严格模式下将不能运行。

正常模式 | 严格模式
---|---: |
如果一个变量没有声明就赋值，默认是全局变量  | 严格模式禁止这种用法，全局变量必须显式声明
允许动态绑定，即某些属性和方法属于哪一个对象，不是在编译时确定的，而是在运行时确定的 | 严格模式在某些情况下，只允许静态绑定，属性和方法归属哪个对象，在编译阶段就确定。<br/>1. 禁止使用with语句<br/>2. 增加eval作用域 
| 禁止this关键字指向全局对象 <br/> `function f(){ "use strict"; this.a = 1; } f(); // 报错，this未定义`
| 禁止删除变量，只有configurable为true的对象属性才能被删除 
| 显示报错 
| 重名错误：对象、函数参数不能有重名的属性 
| 禁止八进制表示法 `var n = 0100 // error`
| 不允许对arguments赋值，arguments不再追踪参数的变化, 禁止使用arguments.callee
| 新版JS会引入块级作用域。为了与新版本接轨，严格模式只允许在全局作用域，或函数作用域的顶层声明函数。不允许在非函数的代码块内声明函数。
| 保留字，implements, interface, let, package, private, protected, public, static, yield, class, enum, export, extends, import, super, const 使用这些词作为变量名将报错




<br/>

### 2. this
上面讲到在创建执行山下文时，会确定this的值。*`this`*本身是一个指针，指向调用函数的对象。如何准确判断this指向的是什么？*this永远指向最后调用它的那个对象*。


<br/>

#### 2.1 默认绑定
默认绑定，在不能应用其他绑定规则时使用的默认规则，通常是独立函数调用。

在调用`a()`时，相当于执行了`window.a()`，这个时候`this`指向`window对象`。
严格模式下，`this`指向undefined, undefined上没有this对象，会抛出错误`Uncaught TypeError: Cannot read property 'name' of undefined`。

```js
function a() {
  console.log('hello,', this.name)
}

var name = 'Amy'
a();  // 浏览器下 hello,Amy
// node环境下 hello,undefined。因为node中name并不是挂在全局对象上的
```

看下面这个例子，`fn`仍然是被`window`调用的，所有`this`仍然指向`window`
```js
var name = "windowsName";

function fn() {
  var name = 'Cherry';
  innerFunction();
  function innerFunction() {
    console.log(this.name);      // windowsName
  }
}

fn()
```




<br/>

#### 2.2 隐式绑定
函数的调用是在某个对象上触发的，典型形式为*`XXX.fun()`*， 调用位置上存在上下文对象。

sayHi函数声明在外部，严格来说不属于person， 但在调用sayHi时，调用位置会使用person的上下文来引用函数，隐式绑定会把函数调用中的this绑定到这个上下文对象。（注意，不管有多少层调用，只有最后一层会确定this指向的是什么）
```js
function sayHi() {
  console.log('hello,', this.name)
}

var person2 = {
  name: 'Amy',
  sayHi: sayHi,
}

var person1 = {
  name: 'Sarah',
  friend: person2,
}

var name = 'Mike'
person1.friend.sayHi()  // Hi,Amy
```


<br/>

*隐式绑定丢失*
Hi直接指向了sayHi的引用，在调用的时候，跟person没有关系。*`XXX.fn()`*如果`fn()`前什么都没有，那肯定不是隐式绑定，但也不一定就是默认绑定。
```js
function sayHi() {
  console.log('hello,', this.name)
}

var person = {
  name: 'Amy',
  sayHi: sayHi
}

var name = 'Mike';
var Hi = person.sayHi;
Hi();   // Hello,Mike
```


在**回调函数**中，也会存在隐式绑定丢失。
- 第一条输出中，`setTimeout`的回调函数中，this使用的是默认绑定，非严格模式下，this指向全局对象
- 第二条输出中，`setTimeout(fn, delay){ fn() }`，相当于将`person2.sayHi`赋值给了一个变量，最后执行了这个变量，因此sayHi中的this和person2就没有关系了。
- 第三条输出中，执行的是`person2.sayHi()`，所以this指向person2。
```js
function sayHi() {
  console.log('hello', this.name)
}

var person1 = {
  name: 'Amy',
  sayHi: function() {
    setTimeout(function() {
      console.log('hello,', this.name)
    })
  }
}

var person2 = {
  name: 'Sarah',
  sayHi: sayHi
}

var name = 'Mike';
person1.sayHi();                // hello,Mike
setTimeout(person2,sayHi, 100); // hello,Mike
setTimeout(function(){
  person2.sayHi()
}, 200)                         // hello,Sarah

```


<br/>

#### 2.3 显式绑定
通过`call`, `apply`, `bind`的方式，显示的指定this的值。call,apply,bind的第一个参数，就是指定this所指向的对象。call和apply的作用一样，只是传参方式不同。call和apply都会执行对应的函数，而bind方法不会。
```js
function sayHi() {
  console.log('hello', this.name)
}

var person = {
  name: 'Amy',
  sayHi: sayHi,
}

var name = 'Mike';
var Hi = person.sayHi;
Hi.call(person);     // hello,Amy

```

<br/>

*显式绑定丢失*
`Hi.call(person, person.sayHi)`的确将this绑定到Hi中的this。但在执行fn的时候，相当于直接调用了sayHi方法（没有显式板顶， person.sayHi已经赋值给fn, 隐式绑定也丢失了）。因此对应的是默认绑定。
```js
function sayHi() {
  console.log('hello,', this.name)
}

var person = {
  name: 'Amy',
  sayHi: sayHi
}

var name = 'Mike';
var Hi = fucntion(fn) {
  fn();           // wrong: hello,Mike
  fn.call(this);  // true:  hello,Amy
}
Hi.call(person, person.sayHi);

```


<br/>

#### 2.4 new绑定
在javascript中，构造函数只是使用new操作符时被调用的函数，这些函数和普通的函数并没有什么不同，它不属于某个类，也不可能实例实例出一个类。任何一个函数都可以使用new来调用，因此其实并不存在构造函数，而只有对于函数的“构造调用”。

使用new来调用函数，会自动执行下面的操作：
- 创建一个新对象
- 将构造函数的作用域复制给新对象，即this指向这个新对象
- 执行构造函数中的代码
- 返回新对象

因此，我们使用new来调用函数的时候，新对象会绑定到这个函数的this上。
```js
function sayHi(name) {
  this.name = name;
}

var Hi = new sayHi('Amy');
console.log(Hi.name);   // Amy
```

<br/>

### 3. 其他
#### 3.1 绑定优先级
优先级: new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

#### 3.2 绑定null,undefined
将null, undefined作为this的绑定对象传入call, apply, bind，这些值在调用时会被忽略，实际应用的是默认绑定规则

#### 3.3 箭头函数
箭头函数的 this 始终指向函数定义时的 this，而非执行时。
箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值。
箭头函数没有自己的this，因此不能用call, apply, bind这些方法去改变this的执行。它的this继承于外层代码库中的this。


#### 3.4 面试题
```js
var number = 5;
var obj = {
  number: 3,
  fn: (function(){
    var number;
    this.number *= 2;
    number = number * 2;
    number = 3;
    return function() {
      var num = this.number;
      this.number *= 2;
      console.log(num);
      number *= 3;
      console.log(number)
    }
  })
}

var myFun = obj.fn;    
myFun.call(null);   // 10, 9
obj.fn();           // 3, 27
console.log(window.number)  // 20

// 10, 9, 3, 27, 20
```

<br/>

#### 3.5 React绑定事件
在Javascript中，class的方法默认不会绑定`this`。如果`this.handleClick`没有bind.this，这时这个函数的this的值是undefined。

 在render方法中使用Function.prototype.bind, 或者使用箭头函数，都会在每次组件渲染时创建一个新的函数，可能会影响性能。应在构造函数中绑定。
```js
// wrong
<button onClick={this.handleClick.bind(this)}></button>
<button onClick={this.deleteRow.bind(this, id)}></button>

// wrong
<button onClick={() => this.handleClick()}></button>

// true
constructor(props){
  super(props);
  this.handleClick = this.handleClick.bind(this);
}
<button onClick={this.handleClick}></button>
```

<br/>

- 传递参数给事件处理器
```js
<button onClick={() => this.handleClick(id)}></button>
<button onClick={(e) => this.handleClick(e)}></button>
<button onClick={(e) => this.deleteRow(id, e)}></button>
<button onClick={this.handleClick.bind(this, id)}></button>  // 跟上面等价
```

<br/>

- 通过data-attributes传递参数
```js
<li data-letter={letter} onClick={this.handleClick}>

handleClick(e) => {
  this.setState({
    letter: e.target.dataset.letter
  })
}
```


<br/>

### 参考资料
- [嗨，你真的懂this吗？](https://github.com/YvetteLau/Blog/issues/6)
- [在组件中使用事件处理函数](https://react.docschina.org/docs/faq-functions.html)
- [Understanding JavaScript Function Invocation and "this"](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)
- [理解 JavaScript 中的执行上下文和执行栈](https://juejin.im/post/5ba32171f265da0ab719a6d7)
- [javascript 垃圾回收机制](https://juejin.im/post/5b684f30f265da0f9f4e87cf)
- [闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
- [Javascript严格模式详解](http://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html)
- [this、apply、call、bind](https://juejin.cn/post/6844903496253177863)