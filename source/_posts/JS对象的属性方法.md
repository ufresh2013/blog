---
title: JS标准内置对象的属性和方法
date: 2019-09-15 12:12:32
category:
- JS
---
### 1. 初级
#### 1.1 语法和数据类型
- 声明变量
`var/let/const`， 如果没有赋初始值，则其值为`undefined`，试图访问一个未声明的变量会导致一个`ReferenceError`异常抛出。你可以使用`undefined`来判断变量是否已赋值。`undefined`值在布尔类型环境中会被当做`false`,在数值类型环境中，会被转换为`NaN`。

- 变量的作用域
全局变量-在所有函数之外生命的变量；局部变量-在函数内部生命的变量。ES6之前的js没有语句块作用域。
```
  if(true){
    var x = 5;
    let y = 5;
  }
  console.log(x);   // 5
  console.log(y);   // ReferenceError: y is not defined
```

- 变量声明提升
变量会被提升或移到了函数或语句的顶部。然后提升后的变量将返回`undefined`值。在使用或引用某个变量之后进行声明和初始化操作。`let`将不会提升变量到代码块的顶部。
```
  console.log(x === undefined)  // true
  var x = 'global value';

  (function(){
    console.log(x); // undefined
    var x = 'local value'
  })();
```

- 函数提升
只有函数声明会被提升到顶部，而不包含函数的表达式
```
  // 函数声明
  foo();   // 'bar'
  function foo() {
    console.log('bar');
  }

  // 函数表达式
  baz();  // TypeError: baz is not a function
  var baz = function() {
    console.log('baz');
  }
```

- *数据类型*: Boolean, null, undefined, Number, String, Symbol, Object

- *false等效值*: false, undefined, null, 0, NaN, ''(空字符串)


#### 1.2 循环和迭代
- break
使用`break`来终止循环，它会立即终止当前所在的while, do-while, for, 或者switch并把控制权交回这些结构后面的语句

- continue
`continue`语句可以用来继续执行（跳过代码块的剩余部分并进入下一个循环）一个while, do-while, for语句


#### 1.3 函数
在函数内定义的变量不能在函数之外的任何地方访问，相应的，一个函数可以访问定义在其范围内的任何变量和函数。
- 箭头函数
```
  var a2 = a.map(function(s){ return s.length });
  var a3 = a.map(s => s.length)
```

- 预定义函数

函数| |
---|:--:|---:
eval()	      | 对一串字符串形式的js代码字符求值
uneval()      | 表示给定对象的源代码的字符串
isFinite()    | 判断是否是有限的数值
isNaN()       | 判断一个值是否是NaN
parseFloat()  | 返回一个浮点数
parseInt()    | 返回一个整数
encodeURI()、encodeURIComponent()  | 把字符串作为URI进行编码
decodeURI()、decoreURIComponent()  | 对encodeURI()编码过的URI进行解码


#### 1.4 表达式和运算符
| 一元操作符/关系操作符 |
---|:--:|---:
delete	    | `delete objectName` / `delete objectName.property` / `delete arrayName[index]`，delete操作成功，元素会变成`undefined`。Delete成功返回`true`,不成功返回`false`
typeof      | 返回一个变量的类型的字符串值 `return "function/string/number/object/undefined/boolean"`
in          | `index in Array`, `propertName in object`，如果所指定的属性存在于对象中，则返回`true`
instanceof  | 判断对象是不是所指定的类型`objectName instanceof objectType`


#### 1.5 Number对象
- *Number的方法*
  parseFloat(), parseInt(), isFinite(), isInteger(), isNaN(), isSafeInteger();
- *Number原型上的一些方法*
  **toExponential()**: 返回一个数字的指数形式的字符串，形如: 1.23e+2; 
  **toFixed()**: 返回指定小数位数的表示形式，`var a = 123; a.toFixed(2) // 123.00`
  **toPrecision()**: 返回一个指定精度的数字， `var a = 123; a.toPrecision(2) // 1.2e+2`


#### 1.6 Math对象
- *Math常用方法*
  **floor()**     :向下取整
  **ceil()**      :向上取整 
  **min() max()** :返回一个以逗号间隔的数字参数列表中的最大/最小值
  **random()**    :返回0和1之间的随机数
  **round(3.1415926,2)=3.14**
- *Math计算方法*
  PI, abs(), sin(),sqrt(), log10()等


#### 1.7 Date对象
Date是以1970年1月1日00:00:00以来的毫秒数来存储。
```js
  var today = new Date();  // Thu Oct 17 2019 09:07:25 GMT+0800 (中国标准时间)
  var a = new Date('December 25, 1995 13:00:00');
  today.getDate()       // 一个月中的某一天(1-31)
  today.getDay()        // 一周中的某一天(0-6)
  today.getMonth()      // 月(0-11)
  today.getFullYear()   // 年(四位数字)
  today.getHours()      // 小时(0-23)
  today.getMinutes()    // 分钟(0-59)
  today.getSeconds()    // 秒数(0-59)
  today.getMilliseconds() // 毫秒(0-999)
  today.getTime()       // 返回1970年1月1日至今的毫秒数  

```


#### 1.8 String
String用于表示文本型的数据，它是由无符号整数值(16bit)作为元素而组成的集合。Unicode转义序列在\u之后需要至少4个字符。

| String对象方法 |
---|:--:|---:
charAt, charCodeAt, codePointAt	 | 返回字符串指定位置的字符或者字符编码 `'hello'.charAt(0) // 'h'`
indexOf, lastIndexOf             | 返回字符串中指定子串的位置或最后位置
startsWith, endsWith, includes   | 返回字符串是否以指定字符串开始、结束、或包含指定字符串
concat                           | 连接两个字符串并返回新的字符串
fromCharCode, fromCodePoint      | 从指定的Unicode值序列构造一个字符串。
split                            | 将字符串分离成一个个子串，并放入数组中
slice                            | 从一个字符串中提取片段并作为新字符串返回
substring,substr                 | 分别通过指定起始和结束位置，起始位置和长度来返回字符串的指定子集
match, replace, search           | 通过正则表达式来工作
toLowerCase, toUpperCase         | 返回字符串的小写、大写表示
normalize                        | 按照指定的Unicode形式将字符串正规化
repeat                           | 将字符串内容重复指定次数后返回
trim                             | 去掉字符串开头和结尾的空白字符

- 模板字符串
使用反勾号(\`\`)包裹内容，它可以实现多行字符串或字符串内插等特性。
```
  // 多行
  "line 1 \n\
   line 2"
  `line 1
   line 2`

   // 嵌入表达式
   "fifteen is" + (a + b) + "years old"
   `fifteen ${ a + b } years old`
```


#### 1.9 正则表达式
` let regex = new RegExp(/^[a-zA-Z]+[0-9]*W?_$/, "gi")`

| 正则表达式方法 |
---|:--:|---:
exec    | 在字符串中查看匹配的RegExp方法，返回一个数组或null
test    | 在字符串中测试是否匹配的RegExp方法，返回true或fasle
match   | 在字符串中查找匹配的string方法，返回一个数组或null
search  | 在字符串中测试匹配的string方法，返回匹配到的位置索引，或-1
replace | 在字符串中查找匹配的string方法，并且替换字符串
split   | 使用正则分隔一个字符串，存储到数组中


#### 1.10 Array对象
数组是一个有序的数据集合，我们可以通过数组名称和索引进行访问。
```js
  [ele1, elem2, ..., elemN]
  new Array(elem1, elem2, ..., elemN)
  new Array(arrayLength)
```

方法 | 描述 | 返回值 | 原数组变成了
---|:--:|---:
concat      | 连接两个数组并返回一个新的数组




| 数组的方法 |
---|:--:|---:
concat      | 连接两个数组并返回一个新的数组 `[1,2,3]concat('a','b'); // [1,2,3,'a','b']`
join        | 将数组的所有元素连接成一个字符串 `[1,2,3].join('-') // 1-2-3`
push        | 在数组末尾添加一个或多个元素，并返回数组操作后的长度 `[1,2,3].push(1) // [1,2,3,1]`
pop         | 从数组移出最后一个元素，并返回该元素。
shift       | 从数组移除第一个元素
unshift     | 从数组开头添加元素 `[1,2,3].unshift(4,5) // [4,5,1,2,3]`
slice       | 从数组提取一个片段，并作为一个新数组 `[1,2,3,4].slice(0,2) // [1,2]`
splice      | 从数组移出一些元素，并替换它们 `slice(index, count_to_move, addElement1, addElement2);[1,2,3,4,5].splice(1,3,'a','b') // [1,'a','b',5]`
reverse     | 颠倒数组元素的顺序 `[1,2,3].reverse() // [3,2,1]`
sort        | 给数组元素排序 `[1,2,3].sort() // [3,2,1]`
indexOf     | 在数组中搜索searchElement 并返回第一个匹配的索引 `[1,1,1,2].indexOf(2,1) // 3 indexOf(searchElement, fromIndex)`
lastIndexOf | 和indexOf差不多，从结尾开始，反向搜索 
forEach     | 在数组每个元素上执行callback `[1,2,3].forEach(fucntion(item){ callback(item); })`
map         | 在数组每个元素上执行callback，将所有操作结果放入数组中，返回该新数组 `[1,2,3].map(function(item){ return callback(item) })`
filter      | 返回一个在回调函数上返回true的元素的新数组 `[1,'a'].filter(function(item){ return typeof item === 'number'}) // [1]`
every       | 当数组中每一个元素在callback上被返回true时，就返回true `[1, 2].every(function(item){ return typeof item === 'number'}) // true`
some        | 只要数组中有一项在callback上被返回true，就返回true `[1,'a'].some(function(item){ return typeof item === 'number'}) // true`
reduce      | 使用callback(firstValue, secondValue)把数组列表计算成一个单一值。 `[1,2].reduce(function(first,second){ return first + second}, 0) // 3`
reduceRight | 和reduce相似，从最后一个元素开始
toString    | 返回一个包含数组中所有元素的字符串，每个元素通过逗号分隔

`Array.slice`
slice 不会修改原数组，只会返回一个浅复制了原数组中的元素的一个新数组。原数组的元素会按照下述规则拷贝：

如果该元素是个对象引用 （不是实际的对象），slice 会拷贝这个对象引用到新的数组里。两个对象引用都引用了同一个对象。如果被引用的对象发生改变，则新的和原来的数组中的这个元素也会发生改变。
对于字符串、数字及布尔值来说（不是 String、Number 或者 Boolean 对象），slice 会拷贝这些值到新的数组里。在别的数组里修改这些字符串或数字或是布尔值，将不会影响另一个数组



#### 1.11 Map对象
一个Map对象是一个简单的键值对映射集合，可以按照数据插入时的顺序遍历所有的元素。
```
  var a = new Map();
  a.set('dog', 123);
  a.size // 1
  a.get('fox') // undefined
  a.has('dog') // true
  a.delete('dog')
  for (var [key, value] of a){
    console.log(key + value)
  }
  a.clear()
```
*Object和Map的对比*
Object被用于将字符串类型映射到数值。object允许设置键值对、根据键获取值，删除键，检查某个键是否存在。而Map具有更多优势。
- Object的键均为strings类型，在Map里键可以是任意类型
- Object的尺寸必须手动计算，Map的尺寸则很容易获得
- Map的遍历遵循元素的插入顺序
- Object有原型，所有映射中有一些缺省的值


#### 1.12 Set对象
Set对象是一组值得集合，这些值都是不重复的， 可以按照添加顺序来遍历。
```
  var a = new Set();
  a.add(1);
  a.add('foo');
  a.has(1);
  a.delete(1);
  a.size
  for(let item of a){ console.log(item) }

  // Array和Set的转换
  Array.from(mySet);
  mySet = new Set([1,2,3])
```
*Array和Set的对比*
- 数组中判断元素是否存在的`indexOf`函数效率低下
- Set允许根据值删除元素，而数组中必须用splice方法
- Array的indexOf无法找到NaN值
- Set对象存储不重复的值


#### 1.13 Object
- 枚举一个对象的所有属性
  for...in, Object.keys(obj), Object.getOwnPropertyNames(obj)

- 创建新对象
```
  // 1. 使用对象初始化器
  var obj = { property_1: value_1 }

  // 2. 使用构造函数，通过new创建对象实例
  function Car(make){
    this.make = make;
  }
  var myCar = new Car('Eagle')

  // 你可以通过prototype属性为之前定义的对象类型增加属性。该类型的所有对象，而不仅仅是一个。
  Car.propotype.color = null;

  // 3. 使用Object.create方法, 它允许你为创建的对象选择其原型对象，而不用定义一个构造函数。
  var Animal = {
    type: 'Invertebrrates',
    displayType: function(){
      console.log(this.type)
    }
  }
  var animal1 = Object.create(Animal)
```

- *this*
`this`在方法中使用以指代当前对象。
```
  function validate(obj, lowval){
    if (obj.value < lowval) {
      alert('Invalid Value')
    }
  }

  // 在每个元素的oncahnge事件处理器中调用validate，并通过this传入相应元素
  <input onChange="validate(this, 18)">
```

- getter与setter
```
  var o = { a: 0 };
  Object.defineProperties(o, {
    "b": { get: function() { return this.a + 1 }},
    "c": { set: function(x) { this.a = x / 2 }}
  })
```

- 删除属性: `delete myobj.a`
- 比较对象: 两个独立声明的对象永远不会相等，即使他们有相同的属性，只有在比较一个对象和这个对象的引用时，才会返回true.


#### 1.14 Promise
一个Promise就是一个代表了异步操作最终完成或者失败的对象。
```
  doSomething().then(doSomethingElse, failureCallback)
  doSomething()
  .then(result => doSomethingElse(result))
  .catch(failureCallback)
```


#### 1.15 迭代器和生成器
- *迭代器*
一个迭代器对象，知道如何每次访问集合中的一项，并跟踪该序列中的当前位置。迭代器是一个对象，它提供了`next()`方法，用来返回序列中的下一项。这个方法包含`value`和`done`两个属性。
```
  function makeIterator(array){
    var nextIndex = 0;
    return {
      next: function() {
        return nextIndex < array.length ? { value: array[nextIndex++], done: false } : { done: true }
      }
    }
  }
  var it = makeIterator([1,2]);
  console.log(it.next().value) // 1
  console.log(it.next().value) // 2
  console.log(it.next().done)  // true
```


- *生成器*
使用`function*`语法，函数将变成GeneratorFunction。它允许你定义一个包含自有迭代算法的函数，同时它可以自动维护自己的状态
```
  function* idMaker(){
    var index = 0;
    while(true)
      yield index++;
  }
  var gen = idMaker();
  console.log(gen.next().value) // 0
  console.log(gen.next().value) // 1
```



### 2. 中级
#### 2.1 原型链
JS常被描述为一种**基于原型的语言**——每个对象拥有一个原型对象，对象以其原型为模板、从原型继承方法和属性。原型对象也可能拥有原型，并从中继承方法和属性，一层一层，这种关系常被称为**原型链**。准确地说，这些属性和方法定义在Object构造器(constructor functions)之上的`prototype`属性上，而非对象实例本身。
```
  function a(){};
  a.prototype.foo = 'bar';
  console.log(a.prototype)
    {
      foo: 'bar',
      constructor: ƒ a(),
      __proto__: {
          constructor: ƒ Object(),
          hasOwnProperty: ƒ hasOwnProperty(),
          isPrototypeOf: ƒ isPrototypeOf(),
          propertyIsEnumerable: ƒ propertyIsEnumerable(),
          toLocaleString: ƒ toLocaleString(),
          toString: ƒ toString(),
          valueOf: ƒ valueOf()
      }
    }
  
  // new一个实例
  var b = new a();
  b.prop = "some value";
  console.log(b)
```

- *prototype属性*: 继承成员被定义的地方
`Object.prototype.watch()`等成员，适用于任何继承自`Object()`的对象类型，包括使用构造器创建的新的对象实例。
`Object.watch()`以及其他不在`prototype`对象内的成员，不会被对象实例，或继承自Object()的对象类型所继承。

- *constructor属性*
每个实例对象都从原型中继承了一个constructor属性，该属性指向了用于构造此实例对象的构造函数。
```
  person1.constructor 都将返回Person()构造器
```


#### 2.2 重新介绍JS
- 与大多数编程语言不通，JS没有输入或输出的概念。它是一个在主机环境下运行的脚本语言，任何与外界沟通的机制都是由主机环境提供的。浏览器是最常见的主机环境，但很多程序中也包含JS解释器，如Adobe Acrobat、Photoshop、SVG图像、Nodejs服务器。
- JS不区分整数值和浮点数值，所有数字在JS中均用浮点数值表示。
` 0.1 + 0.2 = 0.30000000000000004`
- `null`表示一个空值，`undefined`表示一个未初始化的值，也就是还没被分配的值。
- `&&`和`||`运算符使用短路逻辑，是否会执行第二个语句取决于第一个操作数的结果。
- 函数如果没有使用`return`语句，JS会返回`undefined`
- JS允许你创建匿名函数
`(function(){ var a = 1 })();`
- 如果在一个对象上使用点或方括号来访问属性/方法，这个对象就成了`this`。如果没有使用，那么`this`将指向全局对象。
- 你可以在程序中的任何时候修改原型(prototype)中的一些东西，你可以在运行时给已存在的对象添加额外的方法。
- 你可以在一个函数内部定义函数。这是一个减少使用全局变量的好方法。
- *闭包*
JS执行一个函数时，都会创建一个作用域对象(scope object)，用来保存这个函数中创建的局部变量。它和被传入函数的变量一起被初始化。与全局对象不同，你不能直接访问作用域对象，也没有可以遍历当前作用域对象里属性的方法。
```
  function makeAdder(a) {
    return function(b) {
      return a + b
    }
  }
  var x = makeAdder(5);
  var y = makeAdder(20);
  x(6); // 11
  y(7); // 27
```
JS具有一种垃圾回收机制——对象在被创建的时候分配内存，然后当指向这个对象的引用计数为零时，浏览器会回收内存。闭包很容易发生无意识的内存泄漏。
```
  function addHandler() {
    var el = document.getElementById('el');
    el.onclick = function() {
      el.style.backgroundColor = 'red';
    }
  }
```
这段代码创建了一个元素，当它被点击的时候变红，但同时它会发生内存泄漏。因为对`el`的引用不小心被放在一个匿名内部函数中。在JS对象，这个内部函数和本地对象之间`el`创建了一个循环引用。解决方法:不要使用`el`变量。
```
  function addHandler() {
    document.getElementById('el').onclick = function() {
      this.style.backgroundColor = 'red';
    }
  }

```
- 在JS里，对象可以被看作是一组属性的集合。用对象字面量语法来定义一个对象时，会自动初始化一组属性。例如，你定义了一个 var a = "hello"， 那么a本身就会有a.substring这个方法，以及a.length这个属性。


#### 2.3 闭包
在这个例子中，`myFunc`是执行`makeFunc`时创建的`displayName`函数实例的引用，而`displayName`实例仍可访问其词法作用域中的变量，即可访问到`name`。由此，当`myFunc`被调用时，`name`仍可被访问，其值`Mozilla`被传递到`alert`中。
```
  function makeFunc() {
    var name = 'Mozilla';
    function displayName() {
      alert(name)
    }
    return displayName;
  }
  var myFunc = makeFunc();
  myFunc();
```
由于循坏在事件触发之前早已执行完毕，变量对象`item`（被三个闭包所共享）已经指向了`helpText`的最后一项。此时，可使用匿名闭包。也可以使用`let item = helpText[i]`
```
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
    (function() {
       var item = helpText[i];
       document.getElementById(item.id).onfocus = function() {
         showHelp(item.help);
       }
    })(); // 马上把当前循环项的item与事件回调相关联起来
  }
}

setupHelp();
```


### 3. 高级
#### 3.1 继承与原型链
jS对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。*几乎所有JS中的对象都是位于原型链顶端的Object的实例。*

遍历对象的属性时，原型链上的每个可枚举属性都会被枚举出来。要检查对象是否具有自己定义的属性，而不是其原型链上的某个属性，则必须使用所有对象从`Object.prototype`继承的`hasOwnProperty`。`g.hasOwnProperty('vertices')`
```
var o = new Foo(); 

// 相当于
var o = new Object();
o.__proto__ = Foo.prototype;
Foo.call(o);
```


#### 3.2 严格模式
开启严格模式  `"use strict";`

| 严格模式下抛出异常 |
---|:--:|---:
1. 无法意外创建全局变量               | `mistypedVariable = 17;`
2. 给引起静默失败的赋值操作抛出异常     | `var obj1 = {}; Object.defineProperty(obj1, "x", { value: 42, writable: false }); obj1.x = 9`
3. 试图删除不可删除的属性会抛出异常     | `delete Object.prototype`
4. 属性名在同一对象内必须唯一          | `var o = { p: 1, p: 2}`
5. 函数的参数名唯一                  | `function sum(a, a, c){}`
6. 禁止八进制数学语法                 | `var a = 0o10;`
7. 禁止设置primitive值得属性         | `false.true = "" `
8. 禁用with                        | `with(obj){}`
9. eval不再为上层范围引入新变量       | 
10. 禁止删除声明变量                 | `var x; delete x;`
11. eval和arguments不能通过程序语法被绑定或赋值
12. 参数的值不会随arguments对象的值得改变而改变   | `var a = 17; function f(a){ a = 42 ; console.log(arguments[0] // 17)}`
13. 不再支持arguments.callee        | 正常模式下,arguments.callee指向当前正在执行的函数


#### 3.3 内存管理
内存生命周期： 分配你所需要的内存、使用分配到的内存、不需要时将其释放