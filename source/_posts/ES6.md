---
title: ES6语法
date: 2020-10-15 17:49:23
category: JS
---

### 1. let, const，块级作用域
- _块级作用域_
  声明在指定块的作用域之外无法访问的变量。存在于函数内部和块`{}`中。一旦执行到块外会立即销毁。
  （为什么需要块级作用域？1. 避免内层变量覆盖外层变量；2.避免用于计数的循环变量泄露为全局变量）

* var
  其作用域为该语句所在的函数内，且存在变量提升现象

* let
  其作用域为该语句所在的代码块内，不存在变量提升；
  暂时性死区：只要块级作用于内存在`let`，就不再受外部环境影响

* const
  在后面出现的代码中不能再修改该常量的值。
  需要注意的是，const 里面只存了一个值，可以是一个地址(object)，也可以是一个值(string/number/..)。当 const 定义的是地址的时候，我们可以修改实际指向的 object 的内容，但是不可以修改这个指向地址。
```js
const obj = { a: 1 };
obj.a = 2;
console.log(obj); // { a: 2 }
obj = { a: 2 }; // TypeError: Assignment to constant variable.
```

<br>

### 2. 模板字面量(\`\`)

实现了多行字符串，将变量的值嵌入字符串，HTML 转义(向 HTML 插入经过安全转换后的字符串)的能力

- 在反撇号中所有空白符都属于字符串的一部分.你可以显示地使用`\n`来指明换行。

```js
var a = `hello
  world`;
console.log(a.length); // 16
```

- 占位符`${}` 中可以包含 Javascript 表达式

```js
var count = 2;
var b = `hello, ${count}`;
var c = `hello, ${(count * 2).toFixed(2)}`;
```

<br>

### 3. 函数
#### 3.1 默认参数
设置参数默认值
```js
function a(num = getValue(), callback = function() {}) {}
```

#### 3.2 不定参数(...)
使用限制：每个函数只能声明一个不定数量的参数，且一定要放在所有参数的末尾
```js
function checkArgs(...args) {
  console.log(args.length); // 2
}
checkArgs('a', 'b');
```

#### 3.3 展开运算符(...)
使用...的条件是可枚举
展开运算符可以让你指定一个数组，将它们打散后作为独立的参数传入函数。
```js
let value = [1, 2, 3, 4];
console.log(Math.max(...values)); // 等价于console.log(Math.max(1,2,3,4))
```

#### 3.4 箭头函数(=>)
箭头函数是一种使用箭头(=>)定义函数的新语法
- 箭头函数中的`this, super, arguments, new.target`的值由外围最近一层非箭头函数决定
- 箭头函数不能被用作构造函数，不能通过`new`调用
- 没有原型，不存在`prototype`这个属性
- 函数内部的`this`值不可被改变
- 不支持`arguments`对象

```js
let a = () => 'Nicholas';
let b = value => value;
lect c = (num1, num2) => {
  return num1 + num2;
}
let d = id => ({ id: id, name: 'Temp'}) // 让箭头向外返回一个对象，应包裹在小括号里
```

<br>

### 4. 对象
#### 4.1 简写、可计算的属性名
```js
var name = 'Mike';
var suffix = 'name';
var person = {
  name,
  ['first' + suffix]: 'Zakas',
  sayName() {
    console.log(this.name);
  }
};
```

#### 4.2 Object.assign
实现一个浅拷贝，接受源对象，并按指定的顺序将属性复制到接收对象中。
```js
Object.assign({}, { type: 'js', name: 'file.js' }, { type: 'css' });
console.log(receiver.type); // 'css'
```

<br>

### 5. 解构赋值
“模式匹配”的写法，只要等号两边的模式相同，左边的变量就会被赋予对应的值。
- 对象解构
```js
let node = { type: 'Identifier', name: 'foo' };
let { type, name } = node;

// 重命名解构出来的变量名
let { type: localType, name: localName } = node;
console.log(localType); // 'Identifier'
```

- 数组解构
```js
let colors = ['red', 'green'];
let [firstColor, secondColor] = colors;
console.log(firstColor); // "red"
```

- 字符串解构
事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
```js
const [a, b, c, d, e] = 'hello';
```

<br>

### 6. Class
ES6 使用`class`，取代需要`prototype`的操作。用`constructor`方法名来定义构造函数。
```js
class Rectangle {
  constructor(length, width) {
    super(length, length);
    this.length = length;
    this.width = width;
  }
  getArea() {
    return this.length * this.width;
  }
}
```

<br>

### 7. 模块
模块是一种打包和封装功能的方式，模块的行为与脚本不同，模块不会将它的顶级变量、函数和类修改为全局作用域，而且`this`的值为`undefined`。


#### 7.1 import、export
- import: 从模块中export的方法、变量可以通过`import`在另一个模块中访问
- export: 将代码暴露给其他模块
```js
// 
import { identifier1, identifier2 } from './example.js';
import * as example from './example.js';

export var color = 'red';

// 导出默认值
export default function sum(num1, num2) {
  return num1 + num2;
}
export class Rectangle {
  constructor(height, width) {
    this.length = length;
    this.width = width;
  }
}
```


#### 7.2 `<script type="module">`
通过`<script type="module">`加载的模块文件默认具有 defer 属性，在文档完全被解析后，模块按照它们在文档中出现的顺序依次执行。
```html
<script type="module" src="module.js"></script>
<script type="module">
  import { sum } from './example.js';
  let result = sum(1, 2);
</script>
```

<br>

### 8. Set, WeakSet, Map, WeakMap，{}
#### 8.1 Set 过滤重复值
对一个数组，进行复制并创建一个无重复元素的新数组。

```js
let set = new Set([1, 2, 3, 3, 4, 5]);
array = [...set];
console.log(array); // [1,2,3,4,5]
```

#### 8.2 Map 和 {} 的区别
`{}`的key只能是基本类型，Map的key可以是


- {} 的key是如何排序的？
数字属性被最先打印出来，且是按照数字大小的顺序打印；字符串属性是按照设置顺序打印的。
```js
function Foo() {
  this[100] = 'test-100'
  this[1] = 'test-1'
  this["B"] = 'bar-B'
  this[50] = 'test-50'
  this[9] =  'test-9'
  this[8] = 'test-8'
  this[3] = 'test-3'
  this[5] = 'test-5'
  this["A"] = 'bar-A'
  this["C"] = 'bar-C'
}
var bar = new Foo()

for(key in bar){
  console.log(`index:${key}  value:${bar[key]}`)
}

/* 
index:1  value:test-1
index:3  value:test-3
index:5  value:test-5
index:8  value:test-8
index:9  value:test-9
index:50  value:test-50
index:100  value:test-100
index:B  value:bar-B
index:A  value:bar-A
index:C  value:bar-C
*/
```
之所以出现这样的结果，是因为在 ECMAScript 规范中定义了**数字属性**应该按照索引值大小升序排列，**字符串属性**根据创建时的顺序升序排列。

在 V8 内部，为了有效地提升存储和访问这两种属性的性能，分别使用了两个线性数据结构来分别保存**数字属性 element**和**字符串属性 properties**。


<br/>

### 9. Promise

<br/>

### 10. Symbol
ES5 的对象属性名都是字符串，这容易造成属性名的冲突。ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。
```js
let s1 = Symbol('foo');
```

### 11. Proxy 代理
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
```js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
```

### 12. Reflect
每一个Proxy对象的拦截操作（get、delete、has），内部都调用对应的Reflect方法，保证原生行为能够正常执行。

<br/>

### 10. ES8
#### 10.1 async/await
#### 10.2 Object.values() / Object.entries()


<br/>

### 11. ES2020
#### 11.1  *`?.`* 可选链操作符
当访问对象属性时，如果中间有null或undefined，会短路返回undefined，不会继续往下走，也不会抛出错误。
例如，`user?.profile?.name`，如果user为null或undefined，整个表达式返回undefined，不会继续访问`profile`。

#### 11.2 *`??`* 空值合并操作符
左侧是null或undefined时才返回右侧的值
`const name = user.name ?? 'Guest';`，如果user.name不存在或为null/undefined


<br>

### 参考资料
- 《深入理解ES6》NICHOLAS C.ZAKAS
- [《ECMAScript6入门》 阮一峰](http://es6.ruanyifeng.com/)
- [ES6手册](https://juejin.im/entry/579f5d1b1532bc00608caa9c)
- [ES6语法](https://www.jianshu.com/p/a680cc4e246d)
