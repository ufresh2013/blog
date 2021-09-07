---
title: JS实现面向对象，原型链, Class，new
date: 2019-08-07 10:09:15
category: JS
---
### 1. 原型链
JavaScript 对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

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

每个函数都有一个 prototype 属性，这个属性是一个指针，指向一个对象。原型对象的好处是，可以让每
个实例都有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。


<br/>

#### 1.1 `prototype` vs `__proto`

一个对象 A 的`__proto__`属性指向对象 B,那么 B 就是 A 的原型对象（或者叫父对象）。对象 A 可以对象 B 中的属性和方法，同时也可以使用对象 B 的原型对象 C 上的属性和方法。

```js
function Parent(name) {
  this.name = name;
}
var p = new Parent('张三');

console.log(Parent.prototype); // Parent {}
console.log(p.prototype); // undefined
console.log(Parent.__proto__); // [Function], Parent是Function的实例
console.log(p.__proto__); // Parent {} 执行Parent的原型
```

`__proto`指向对象的原型对象（父对象）。
`prototype`用于创建经典的构造函数。prototyep 是在 new 创建对象时用来构建**proto**。

```js
Parent.prototype.getName = function() {
  console.log(this.name);
};
```

<br/>

### 2. 实现面向对象
#### 1. Function，object， class

Function 可以当做 Object 的构造函数，new 一个 Function 时，会返回一个对象。

```js
function Parent(name) {
  this.name = name;
}
var p = new Parent('张三');
console.log(Parent.prototype); // Parent {}
console.log(p.prototype); // undefined
```

构造函数本身是一个 Function， 而构造函数返回的实例是一个 Object。构造函数 Function 有 prototype 属性，而实例 Object 没有 prototype 属性。


<br/>

### 3. new
#### 3.1 new是什么？
`new`运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。
- new通过Person创建出来的实例可以访问到构造函数中的属性
- new通过Person创建出来的实例可以访问到构造函数原型链上的方法和属性
- 在构造函数内加上返回值：

  - 返回基本数据类型时，会被忽略
  - 返回引用数据类型时，会返回返回值
  - 没有返回值，返回this

```js
function Person (name, age) {
  this.name = name
  this.age = age
}

Person.prototype.sayName = function () {
  console.log(this.name)
}

let man = new Person('xl',20)
console.log(man) // Person { name: 'xl', age: 20 }
man.sayName() // 'xl'
```

<br/>



#### 3.2 new Function 做了什么？
- 新建一个新的空对象`{}`
- 把新对象`[[prototype]]`指向`Person.prototype`
- 将Person构造函数的this设置为新建的对象，执行
- 构造函数Person没有return语句，则将该新创建的对象返回

<img src="1.jpg" style="width:500px">

<br/>

#### 3.3 new Class 做了什么？


#### 3.4 实现一个new
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

### 4. 实现继承
ES5,ES6 实现继承
继承的类型
Class 用法，用 ES5 实现一个 Class



### 参考资料
- [说说new操作符具体干了什么？](https://juejin.cn/post/6991483397495324703?share_token=22e1f417-433c-45b5-af4a-36379e2a189a)