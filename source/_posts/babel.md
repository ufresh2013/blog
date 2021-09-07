---
title: Babel：用es5实现es6语法
date: 2020-04-23 14:16:27
category: JS
---
> 因为要兼容IE，跑了一下Babel文档，发现。。恩？兼容IE，不就是把ES6语法转换成ES5语法吗！果断解锁考点！

<br/>

### 1. 简介
Babel是一个Javascript编译器，用于将ES5+的代码转换为向后兼容的JS语法，以便能够运行在当前和旧版本的浏览器或其他环境中。[官方Demo](https://www.babeljs.cn/docs/usage)

Babel 的功能很纯粹，它只是一个编译器，大多数编译器的工作过程可以分为三部分：
- 解析（Parsing）：将代码字符串解析成抽象语法树。
- 转换（Transformation）：对抽象语法树进行转换操作。
- 生成（Code Generation）: 根据变换后的抽象语法树再生成代码字符串。


组成 | 作用
---|---:
@babel/core       | 实现语法解析，转换
@babel/preset-env | plugins是一些js程序，用来指导babel如何对代码执行转换。你可以写自己的插件。<br/>preset是多个plugins的组合。
@babel/cli        | 允许你在终端用命令行实现语法转换。把src目录下的所有js文件，编译输出到lib目录。<br/>`./node_modules/.bin/babel src --out-dir lib` 
@babel/polyfill   | Babel默认只转换新的JS语法，而不转换新的API，如Iterator, Generator, Set, Maps, Proxy, Reflect, Symbol, Promise等全局对象。当运行环境(*IE*)并没有实现一些全局对象时，babel-polyfill会给其做兼容。


<br/>

### 1.1 Babel职责范围
Babel 只是转译新标准引入的语法，比如：
- 箭头函数
- let / const
- 解构

哪些在 Babel 范围外？对于新标准引入的全局变量、部分原生对象新增的原型链上的方法：
- 全局变量
	- Promise
	- Symbol
	- WeakMap
	- Set
- includes
- generator 函数

对于上面的这些 API，Babel 是不会转译的，需要引入 polyfill 来解决。

<br/>
### 2. es5实现[es6语法糖](https://github.com/lukehoban/es6features#readme)
要想知道babel怎么实现ES6语法，直接到[Babel官网的REPL在线编辑器](https://babeljs.io/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAhjAvDATAbgFAOQRiA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.9.0&externalPlugins=)，配置好`preset`和`plugins`后，输入你想要转化的代码，babel自动会给你输出转化后的代码。


#### 2.1 let, const 
- cosnt 
```js
// es5
const a = 1;
a = 2;

// es6
function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var a = 1;
a = (_readOnlyError("a"), 2); 
```

- 块级作用域
```js
// es5
function f() {
  var x = 'foo';
  {
    var x = 'bar';
    console.log(x);
  }
  console.log(x);
}

// es6
function f() {
  var x = 'foo';
  {
    var _x = 'bar';
    console.log(_x);
  }
  console.log(x);
}
```

<br/>

#### 2.2 箭头函数
```js
// es5
const a = [1,2,3].map(v => v + 1);

// es6 
var a = [1, 2, 3].map(function (v) {
  return v + 1;
});
```


<br/>

#### 2.3 函数默认参数
```js
// es5
function f(x, y = 12) {
  return x + y
}

// es6
function f(x) {
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;
  return x + y;
}
```


<br/>

#### 2.4 解构
```js
// es5
const [a, ,b] = [1,2,3];
const { c, d, e: { f } } = { c: 1, d: 2, e: { f: 3 } }

// es6
var _ref = [1, 2, 3],
	a = _ref[0],
	b = _ref[2];

var _c$d$e = const { c, d, e: { f } } = { c: 1, d: 2, e: { f: 3 } },
	c = _c$d$e.c,
	d = _c$d$e.d,
	f = _c$d$e.e.f;
```


<br/>

#### 2.5 模板字符串
```js
// es5
const name = '小明'
const time = 'today'

const b = `hello ${name}`;
const c = `hello ${name},
	how are you ${today}`

// es6
var name = '小明';
var time = 'today';
var b = "hello ".concat(name);
var c = "hello ".concat(name, ",\n\thow are you ").concat(today);
```


<br/>

#### 2.6 Class
```js
class Arr {
	constructor() {
		this.arr = [1,2,3]
	}

	push(val) {
		this.arr.push(val)
	}

	getVal(index) {
		return this.arr[index]
	}
}

const arr = new Arr();
arr.push(1)
arr.getVal()


// es6
"use strict";

function _classCallCheck(instance, Constructor) {
	if (! (instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor);
	}
}

function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	return Constructor;
}

var Arr = function() {
	function Arr() {
		_classCallCheck(this, Arr); // 检查是不是class

		this.arr = [1, 2, 3];
	}

	_createClass(Arr, [{
		key: "push",
		value: function push(val) {
			this.arr.push(val);
		}
	},
	{
		key: "getVal",
		value: function getVal(index) {
			return this.arr[index];
		}
	}]);

	return Arr;
} ();

var arr = new Arr();
arr.push(1);
arr.getVal();
```


<br/>

### 3. polyfill
Babel默认只转换新的JS语法，而ES6新特性像Promise, async/await，则是通过[core-js](https://github.com/zloirock/core-js)实现。

Promise, aysnc/await, Generator, Set, Map, Proxy



<br/>
### 参考资料
- [ES6语法](https://github.com/lukehoban/es6features#readme)
- [Babel](https://www.babeljs.cn/docs/usage)
- [core-js](https://github.com/zloirock/core-js)
- [从源码看Babel是如何编译Async和Generator函数的](https://juejin.im/post/5e534b7d6fb9a07cb83e20f2)