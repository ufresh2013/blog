---
title: 《Javascript高级程序设计》
date: 2019-02-26 14:19:53
tags:
category: JS
---
### 1. script
*`<script>`*的6个属性：async, charset, defer, language, src, type
与解析嵌入式Javascript代码一样，在解析外部Javascript文件时(包括下载文件)，页面的处理会暂时停止。无论如何包含代码，只要不存在defer和async属性，浏览器都会按照`<script>`元素在页面中出现的先后顺序对它依次进行解析。第一个script元素包含的代码解析完后，第二个才会被解析。

*延迟脚本*
脚本会被延迟到整个页面都解析完毕后再运行。defer属性只适用于外部文件。
```html
  <script type=”text/javascript”defer=”defer”src=”example.js”></script>
```

*异步脚本*
async只适用于外部文件。指定async的目的是不让页面等待两个脚本下载和执行，从而异步加载页面其他内容。
```html
  <script type=”text/javascript” async src=”example.js”></script>
```


<br/>
### 2.基本概念
JS的变量是松散类型的，所谓松散类型就是可以用来保存任何类型的数据。换句话说，每个变量仅仅是一个用于保存值得占位符。`var message`未经初始化的变量，会保存一个特殊的值——undefined。用var操作符定义的变量会成为定义改变量的作用域中的局部变量。如果在函数中使用var定义一个变量，那么这个变量在函数退出后会被销毁。
```js
function test(){
  var message = "Hi";
}
test();
alert(message);  // 错误
```

*typeof*
检查变量的数据类型，返回Undefined, boolean, string, number, object, function



*instanceof*
如果变量是给定引用类型的实例（根据原型链识别），那么instanceof会返回true
```
alert(person instanceof Object)  // 变量person是Object吗？ 
alert(colors instanceof Array)   // 变量colors是Array吗？
```


*boolean*
对任何数据类型值调用Boolean()函数，总是会返回一个boolean值。

数据类型|转换为true的值|转换为false的值
---|:--:|---:
Boolean|true|false
String|任何非空字符串|""(空字符串)
Number|任何非零数字值(包括无穷大)|0和NaN
Object|任何对象|null
Undefined|n/a|undefined


*NaN*
确定这个参数是否“不是数值”
```
isNaN(NaN)     // true
isNaN(10)      // false
isNaN("10")    // false
isNaN("blue")  // true
isNaN(true)    // false(可以转换为数值1)
```


*数值转换*
parseInt: 如果第一个字符是数字字符，直到遇到一个非数字字符。无法解析返回NaN
parseFloat: 从第一个字符开始解析，直到遇见一个无效的浮点数字字符为止。


*退出循环*
`break`会立即退出循环，强制继续执行循环后面的语句。
`continue`会立即退出循环，但退出循环后会从循环的顶部继续执行。
```js
var num = 0;
for (var i = 1; i < 10; i++){
  if (i % 5 == 0){
    break; 
    // continue;
  }
  num++;
}
alert(num); // break: 4
alert(num); // continue: 8
```

break和continue都可以与label语句联合使用，从而返回代码中特定的位置。
```js
var num = 0;
outermost;
for (var i = 0; i < 10; i++){
  for (var j = 0; j < 10; j++){
    if (i == 5 && j == 5){
      break outermost;
      // continue outermost;
    }
    num++;
  }
}
alert(num); // break: 55，break不仅会退出j循环，还会退出i循环
alert(num); // continue: 95, continue退出内部循环，执行外部循环，i=5,j=6~10不会被执行
```


<br/>


<br/>
### 3.变量、作用域和内存问题
Undefined, Null, Boolean, Number, String这5种基本数据类型是按值访问，可以操作在变量中实际的值。引用类型的值是按引用访问的。
 

<br/>
#### 3.1 复制变量值
- 复制一个基本类型的值，会在变量对象上创建一个新值，然后把该值复制到位新变量分配的位置上。
```
var num1 = 5;
var num2 = num1;
// num1中的5和num2中的5是完全独立的。两个变量不会相互影响。
```
<img src="1.png" style="max-width:250px">
<br/>
- 复制一个引用类型的值，同样会将存储在变量对象中的值复制一份放到新变量分配的空间中。不同的是，这个值的副本实际上是一个指针，这个指针指向存储在堆中的一个对象。
```
var obj1 = new Object();
var obj2 = obj1;
obj1.name = ‘mike’;
alert(obj2.name)  // ‘mike’
// 复制后，两个变量实际上将引用同一个对象。因此，改变其中一个变量，就会影响另一个变量。
```
<img src="2.png" style="max-width:400px">


<br/>



#### 4.2 执行环境与作用域
执行环境定义了变量或函数有权访问的数据。每个执行环境都有一个与之关联的*变量对象*，环境中定义的所有变量和函数都保存在这个对象中。虽然我们编写的代码无法访问这个对象，但解析器在处理数据时会在后台使用它。

- 全局执行环境
在Web浏览器中，全局执行环境被认为是`window`对象。

- 函数的执行环境
每个函数都有自己的*执行环境*。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

当代码在一个环境中执行时，会创建变量对象的一个*作用域链*。作用域链的用途，是保证对执行环境有权访问的所有变量和函数的有序访问。内部环境可以通过作用域链访问所有的外部环境，但外部环境不能访问内部环境中的变量和函数。
```
var color = "blue";
function changeColor(){
    var anotherColor = "red";
    function swapColors(){
        var tempColor = anotherColor;
        anotherColor = color;
        color = tempColor;
        // 这里可以访问color、anotherColor和tempColor 
    }
    // 这里可以访问color和anotherColor，但不能访问tempColor
    swapColors();
}
// 这里只能访问color changeColor();
```

<br/>
*没有块级作用域*
在其他类C的语言中，由`{}`封闭的代码块都有自己的作用域。但在JS中，`if`语句中的变量生命会将变量添加到当前的执行环境中。
```
if (true){
  var color = "blue";
}
alert(color);  // "blue"
```
由for语句创建的变量i即使在for循环执行结束后，也依旧会存在于循环外部的执行环境汇总。
```
for(var i = 0; i < 10; i++){
  doSomething(i);
}
alert(i);  // 10
```



<br/>
### 6. 创建对象
```js
var book = {
  year: 2004,
  edition: 1,
};
Object.defineProperty(book, 'year', {
  configurable: false,  // 不能从对象中删除属性
  enumerable: true,     // 可以通过for-in循环返回属性
  writable: false,      // 只读不可修改
  value: 'Nicholas',
  get: function(){
    return this.year;   // 当js中读取到year这一属性，就会触发getter函数
  },
  set: functtion(newValue){
    // 当js执行year = newValue; 就会触发setter函数。除了修改值，还可以做一些其他操作
    if (newValue > 2004) {
      this.year = newValue;   
      this.edition += newValue - 2004;
    }
  }
})

// 读取属性的值
var descriptor = Object.getOwnPropertyDescriptor(book, 'year');
console.log(year.value);        // 2004
console.log(year.configurable); // false
```


<br/>
#### 6.1 构造函数
`new`一个新实例会经历以下4个步骤: 创建一个新对象；将构造函数的作用域赋给新对象(this指向这个新对象); 执行构造函数中的代码(为这个新对象添加属性); 返回新对象。
```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function(){
    alert(this.name);
  }
}
var person1 = new Person('Greg', 27, 'Doctor');
var person2 = new Person('Nicholas', 29, 'Software Enginner');
```
person1和person2分别保存着Person的不同实例。这两个对象都有一个constructor构造函数属性，该属性指向Person。

使用`call()`或`apply()`在某个特殊对象的作用域中调用`Person()`函数。这里是在对象o的作用域中调用，因此调用后o就拥有了所有属性和sayName()方法。
```js
var o = new Object();
Person.call(o, 'Kristen', 25, 'Nurse');
o.sayName();   // "Kristen"
```



<br/>
#### 6.2 原型模式
每个函数都有一个prototype属性，这个属性是一个指针，指向一个对象。原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。换句话说，不必在构造函数中定义对象实例的信息，而是可以将这些信息直接添加到原型对象中。
```js
function Person(){}

Person.prototype.name = 'Nicholas';
Person.prototype.sayName = function(){
  alert(this.name);
}

var person = new Person();
person.sayName(); // "Nicholas"
```

<img src="3.png" style="max-width:500px">

<br/>
- hasOwnProperty()
检测一个属性是存在于实例中，还是存在于原型中。

- in操作符
```js
console.log(person1.hasOwnProperty("name"));   // false
console.log("name" in person1);                // true
```

- 更简洁的写法
```js
function Person(){}
Person.prototype = {
  constructor : Person,
  name: 'Nicholas',
  sayName: function(){
    alert(this.name);
  }
};
```

- 原型对象的问题
由于name存在于Person.prototype而非person1中，当person1.name被修改时，这个修改也会通过person2.name反映出来。因此我们很少单独使用原型模式。


<br/>
#### 6.3 组合使用构造函数模式和原型模式
构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。
```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ['Amy', 'Mike'];
}
Person.prototype = {
  constructor: Person,
  sayName: function(){
    alert(this.name);
  }
}
```

<br/>
#### 6.4 寄生模式
当我们想创建一个具有额外方法的特殊数组，由于不能直接修改Array构造函数，因此可以用这个模式。
```js
function SpecialArray(){
  var values = new Array();
  // 添加值
  values.push.apply(values, arguments);

  // 添加方法
  values.toPiedString = function(){
    return this.join("|");
  }

  return values;
}
var colors = new SpecialArray("red", "blue", "green");
console.log(colors.toPipedString());  // "red|blue|green"
```


<br/>
### 7. 继承
#### 7.1 原型链
让原型对象等于另一个类的实例。创建SuperType的实例，并将实例赋值给SubType.prototype。本质是重写原型对象。
```js
// SuperType实例中的所有属性和方法，现在存在于SubType.prototype中。
function SuperType(){
  this.value = true;
}

SuperType.prototype.getSuperValue = function(){
  return this.value;
}

function SubType(){
  this.subValue = false;
}
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function(){
  return this.subValue;
}

var instance = new SubType();
console.log(instance.getSuperValue); // true
```
略

<br/>
### 8. 函数表达式
定义函数的方式有两种
```js
// 函数声明
function functionName(args){} 

// 函数表达式
var functionName = function(args){}
```


<br/>
#### 8.1 闭包
*闭包*是指有权访问另一个函数作用域中的变量的函数。

创建闭包的常见方式，就是在一个函数内部创建另一个函数。

`var value1=`这两行代码是内部函数（一个匿名函数）的代码，这两行代码访问了外部函数中的变量propertyName。即使这个内部函数被返回了，它仍然可以访问变量propertyName，之所以还能访问这个变量，是因为内部函数的作用域链中包含`createComparisonFunction()`的作用域。
```js
function createComparisonFunction(propertyName){
  return function(object1, object2){
    var value1 = object1(propertyName);
    var value2 = object2(propertyName);

    if (value < value2){
      return -1;
    } else {
      return 1;
    }
  }
}
```