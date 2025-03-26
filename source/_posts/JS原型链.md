---
title: JS 原型链（继承）, this，new
date: 2019-08-07 10:09:15
category: JS
---
### 1. 原型链（继承）
原型链，JavaScript 对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

```js
let f = function() {
  this.a = 1;
  this.b = 2;
};

// f.prototype用于指向对象f的原型
// 在f函数的原型上定义属性
f.prototype.b = 3;
f.prototype.c = 4;

let o = new f();
// o的整个原型链如下:
// {a:1, b:2} ---> {b:3, c:4} ---> Object.prototype---> null
```
每个函数都有一个 prototype 属性，这个属性是一个指针，指向一个对象。原型对象的好处是，可以让每个实例都有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。


<br/>

#### 1.1 `prototype` 与 `__proto`
`__proto` 是实例的原型对象。
`prototype`用于定义原型对象。
```js
Parent.prototype.getName = function() {
  console.log(this.name);
};
```
一个对象 A 的`__proto__`指向对象 B,那么 B 就是 A 的原型对象。
A 可以用 B 中的属性和方法，同时也可以用 B 的原型上的属性和方法。
```js
function Parent (name, age) {
  this.name = name
  this.age = age
}

Parent.prototype.sayName = function () {
  console.log(this.name)
}

let p = new Parent('xl',20)
console.log(Parent.prototype); // Parent { sayName: Function }
console.log(p.__proto__); // Parent { sayName: Function }
console.log(p.prototype); // undefined
console.log(Parent.__proto__); // [Function], Parent是Function的实例
p.sayName() // 'xl'
```

<br/>

#### 1.2 new Function 做了什么？
Function 可以是 Object 的构造函数，new 一个 Function 时，会返回一个对象。
- `const a = new Person('Tom')`
- 新建一个新的空对象`const a = {}`
- 设置`a.__proto__ = Person. prototype`
- 执行Person构造函数，如`a.name = 'Tom'`
- 构造函数Person没有return语句，则将该新创建的对象返回

<img src="1.jpg" style="width:500px">


<br/>

#### 1.3 实现一个 new 
```js
function myNew (func, ...args) {
  const obj = Object.create(func.prototype)
  let result = func.apply(obj, ...args)
  return result instanceof Object ? result : obj
}

let p = myNew(Person, "huihui", 123)
console.log(p) // Person {name: "huihui", age: 123}
p.sayName() // huihui
```


<br/>

### 2. 类继承 extends
子类可以重写父类的方法，只需在子类中定义一个与父类方法同名的方法即可。
```js
class Parent {
    sayHello() {
        console.log('Hello from parent class.');
    }
}

class Child extends Parent {
    sayHello() {
        console.log('Hello from child class.');
    }
}

const child = new Child();
child.sayHello(); // 输出: Hello from child class.

const arr = [1,2,3] // 继承内置类 Array String
const obj = {}
const str = '123'
```

<br/>


### 3. 类继承 vs 原型继承
原型继承的继承链是由实实在在的对象构成的。
而类继承系统是通过抽象的类定义（class）来进行继承。

在实际应用中，原型继承的一个最大特性就是灵活，因为继承链上的每一个对象、甚至继承链本身都是可以动态修改的。相比之下，类继承需要事先定义好所有的类和它们之间的继承关系，绝大部分类继承系统都不支持在运行时动态修改这些已经定义好的东西。有些事情在类继承系统里是做不到（或很难做到）的，比如修改原型等于同时修改了所有继承自该原型的对象，将一个原型的属性部分混入另一个原型，甚至是在现有的继承链中插入一个节点，等等。

<br/>


### 4. this
在全局执行上下文中，`this`的值指向全局对象。在函数执行上下文中，`this`的值取决于该函数是如何别调用的。如果它被一个引用对象调用，那么`this`会被设置成那个对象，否则`this`的值别设置为全局对象或`undefined`(严格模式下)

*`this`*本身是一个指针，指向调用函数的对象。如何准确判断this指向的是什么？*this永远指向最后调用它的那个对象*。


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

### 4. 箭头函数 和 普通函数的区别
优先级: new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

#### 3.2 绑定null,undefined
将null, undefined作为this的绑定对象传入call, apply, bind，这些值在调用时会被忽略，实际应用的是默认绑定规则

#### 3.3 箭头函数
箭头函数的 this 始终指向函数定义时的 this，而非执行时。
箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值。
箭头函数没有自己的this，因此不能用call, apply, bind这些方法去改变this的执行。它的this继承于外层代码库中的this。
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

### 参考资料
- [说说new操作符具体干了什么？](https://juejin.cn/post/6991483397495324703?share_token=22e1f417-433c-45b5-af4a-36379e2a189a)
- [基于类的继承和基于原型的继承相比较，各有什么优劣？为什么很少有语言是用基于原型的继承？](https://www.zhihu.com/question/21740084/answer/24886476)
- [嗨，你真的懂this吗？](https://github.com/YvetteLau/Blog/issues/6)
- [在组件中使用事件处理函数](https://react.docschina.org/docs/faq-functions.html)
- [Understanding JavaScript Function Invocation and "this"](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)
- [理解 JavaScript 中的执行上下文和执行栈](https://juejin.im/post/5ba32171f265da0ab719a6d7)
- [javascript 垃圾回收机制](https://juejin.im/post/5b684f30f265da0f9f4e87cf)
- [闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
- [Javascript严格模式详解](http://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html)
- [this、apply、call、bind](https://juejin.cn/post/6844903496253177863)