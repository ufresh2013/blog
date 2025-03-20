---
title: JS继承：原型链, Class，new
date: 2019-08-07 10:09:15
category: JS
---
### 1. 原型继承
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
```

<br/>

### 3. 继承内置类
JavaScript 中的 class 也可以继承内置类，如 Array、Date 等。
```js
const arr = [1,2,3]
const obj = {}
const str = '123'

class MyArray extends Array {
    first() {
        return this[0];
    }
    last() {
        return this[this.length - 1];
    }
}

const arr = new MyArray(1, 2, 3);
console.log(arr.first()); // 输出: 1
console.log(arr.last());  // 输出: 3
```


<br/>

### 3. 类继承 vs 原型继承
原型继承的继承链是由实实在在的对象构成的。
而类继承系统是通过抽象的类定义（class）来进行继承。

在实际应用中，原型继承的一个最大特性就是灵活，因为继承链上的每一个对象、甚至继承链本身都是可以动态修改的。相比之下，类继承需要事先定义好所有的类和它们之间的继承关系，绝大部分类继承系统都不支持在运行时动态修改这些已经定义好的东西。有些事情在类继承系统里是做不到（或很难做到）的，比如修改原型等于同时修改了所有继承自该原型的对象，将一个原型的属性部分混入另一个原型，甚至是在现有的继承链中插入一个节点，等等。

<br/>


### 参考资料
- [说说new操作符具体干了什么？](https://juejin.cn/post/6991483397495324703?share_token=22e1f417-433c-45b5-af4a-36379e2a189a)
- [基于类的继承和基于原型的继承相比较，各有什么优劣？为什么很少有语言是用基于原型的继承？](https://www.zhihu.com/question/21740084/answer/24886476)