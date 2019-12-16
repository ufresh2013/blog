---
title: JS数据类型
date: 2019-07-29 09:29:44
category: JS
---


### 1. typeof
*`typeof`*判断变量属于哪个基本类型。我们可以用typeof来判断undefined, boolean, number, string, object, symbol, function这7种类型。

*`typeof`* 实现原理 : js在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息: 000-对象， 010-浮点数， 100-字符串，110-布尔，1-整数，所有机器码均为0-null，-2^30整数来表示-undefined。

当`typeof null`时， 由于`null`的所有机器码均为0，因此被当做了对象来判断。因此，typeof用于判断基本数据类型，避免对null的判断。

```js
// 七种基本类型
typeof undefined      // 'undefined'
typeof true           // 'boolean'
typeof 42             // 'number'
typeof '42'           // 'string'
typeof {life: 42}     // 'object'
typeof function a(){} // 'function'
typeof Symbol()       // 'symbol'

// other
typeof void 0         // 'undefined'
typeof [1,2,3]        // 'object' 数组，其实也是对象
typeof new Date()     // 'object'
typeof null           // 'object' js的bug导致返回object
```




<br/>
### 2. Object.prototype.toString.call
Object.prototype.toString.call() 判断对象属于哪个内置类型。

ES5中每种内置对象都定义了*`[[Class]]`*内部属性的值。宿主对象的[[Class]]内部属性的值可以是除了Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String的任何字符串。

ES6中，之前的*`[[Class]]`*不再使用，取而代之的是`internal slot`。Internal slots对应于与对象相关联并由各种es规范算法使用的内部状态，它们没有对象属性，也不能被继承。

```js
Object.prototype.toString.call(null)            // "[Object Null]"  
Object.prototype.toString.call(undefined)       // "[Object Undefined]"
Object.prototype.toString.call(123)             // "[Object Number]"
Object.prototype.toString.call(true)            // "[Object Boolean]"
Object.prototype.toString.call('123')           // "[Object String]"
Object.prototype.toString.call({a: 123})        // "[Object Object]"
Object.prototype.toString.call(Symbol())        // "[Object Symbol]"
Object.prototype.toString.call([1,2,3])         // "[Object Array]"
Object.prototype.toString.call(function a(){})  // "[Object Function]"
Object.prototype.toString.call(new Date)        // "[Object Date]"
Object.prototype.toString.call(Math)            // "[Object Math]"
```



<br/>
### 3. constructor
constructor用于判断对象的构造函数是谁
```js
null.constructor        // Uncaught TypeError: Cannot read property 'constructor' of null
undefined.constructor   // Uncaught TypeError: Cannot read property 'constructor' of null
[1,2,3].constructor === Array     // true
(123).constructor === Number      // true
'123'.constructor === String      // true
({a:1}).constructor === Object    // true
Symbol().constructor === Symbol   // true

var func = function a() {}
func.constructor === Function     // true

var date = new Date()
date.constructor === Date         // true

var reg = new RegExp()
reg.constructor === RegExp        // true

var m = Math
m.constructor === Math            // false,事实上没有Math这个构造函数，Math的构造函数在Object上


```


<br/>
### 4. instanceof
检测构造函数的`prototype`属性是否出现在对象原型链中的任何位置。使用对象必须是一个object，判断对象继承于哪个对象。
```js
let person = function() {}
let programmer = function() {}

programmer.prototype = new person()
let mike = new programmer()

mike instanceof programmer   // true
mide instanceof person       // true
```

*`instanceof`*的实现原理：只要右边变量的`prototype`在左边变量的原型链上即可。因此，`instanceof`在查找的过程中会遍历左边变量的原型链，直到找到右边变量的`prototype`，如果查找失败，返回`false`。

```js
function new_instance_of(leftValue, rightValue) {
  left rightProto = rightValue.prototype;
  leftValue = leftValue.__proto__;

  whild(true) {
    if (leftValue === null) {
      return false;
    }

    if (leftValue === rightProto) {
      return true;
    }

    leftValue = leftValue.__proto__;
  }
}
```



<br/>
### 5. 常用判断
```js
// null
function isNull(obj) {
  return obj === null
}

// undefined
function isUndefined(obj) {
  return obj === void 0;
}

// 数组
Object.prototype.toString.call([1,2]) === '[object Array]'
```


<br/>
### 参考文章
- [JS灵巧判断7种类型的方式](https://juejin.im/post/5aba32d9f265da239e4e1b6c)
- [谈谈 Object.prototype.toString](https://juejin.im/post/591647550ce4630069df1c4a)
- [浅谈 instanceof 和 typeof 的实现原理](https://juejin.im/post/5b0b9b9051882515773ae714)

