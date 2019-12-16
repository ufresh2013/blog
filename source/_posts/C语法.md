---
title: C语法
date: 2019-12-11 09:24:56
tags:
---
### 1. i++, ++i, i+=
i++: 先用a的原汁，然后i加1
++i: 先用a加1， 然后用i的新值
```js
var i = 10
console.log(i++) // 10
console.log(i)   // 11

var j = 10
console.log(++j) // 11
console.log(j)   // 11

var i = 8
console.log(4 + i++) // 12
console.log(i)       // 9
console.log(++i % 5) // 0
console.log(i)       // 10

var a = 1
var b = a++    // b = 1
a+= ++b        // a = a + ++b, b = 2, a = 4
console.log(a) // 4
console.log(b) // 2

var a = 3
console.log(a++ + a++) // 7
console.log(a)         // 5

var a = 3
console.log(a++ + ++a) // 8
console.log(a)         // 5
```