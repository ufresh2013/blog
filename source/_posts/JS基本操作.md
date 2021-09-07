---
title: JS基本操作
date: 2019-06-25 10:19:58
---
### 1. 数组
数组的标准定义是：一个存储元素的线性集合，元素可以通过索引来任意存取，索引通常是数字，用来计算元素之间存储位置的偏移量。

Javascript中的数组是一个特殊的对象，用来表示偏移量的索引是该对象的属性，索引可能是整数。然而，这些数字索引在内部被转换为字符串类型，这是因为Javascript对象中的属性名必须是字符串。数组是Javascript中只是一种特殊的对象，所以效率上不如其他语言中的数组高。

- 创建数组
```js
var arr = [];
var arr = [1,2,3,4];
var arr = new Array(1,2,3,4);
var arr = new Array(10);  // arr.length === 10
var arr = [1, 'Joe', null];

Array.isArray(arr);  // true

// 字符串生成数组
var sentence = "the quick brown fox jumped over";
var arr = sentence.split(" "); // ["the", "qucik"...]

// 数组的字符串表示
arr.join();     // 1,2,3
arr.toString(); // 1,2,3

// 由已有的数组创建新数组
var arr1 = [1,2,3];
var arr2 = [4,5,6];
var arr3 = arr1.concat(arr2);
// arr1保持不变 [1,2,3]  arr2 [4,5,6]  arr3 [1,2,3,4,5,6]

var arr4 = arr1.splice(1,3)
// arr1 保持不变, arr4 [2,3]
```


- 复制数组
当一个数组赋给另外一个数组时，只是为被赋值的数组增加了一个新的引用。
```js
// 浅复制: 
var arr2 = arr1;

// 深复制
function deepCopy(arr1, arr2){
  for(var i = 0; i < arr1.length; ++i){
    arr2[i] = arr1[i];
  }
}
```

- 查找元素
```js
// 查找数组
var arr = [1,2,3,1];
arr.indexOf(1);     // 0 
arr.lastIndexOf(1)  // 3
arr.indexOf(5);     // -1
```

- 改变数组内容
```
var arr = [1,2,3]
```


https://juejin.im/post/5c9c3989e51d454e3a3902b6
https://juejin.im/post/5a2a7a5051882535cd4abfce