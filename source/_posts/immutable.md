---
title: 浅拷贝，深拷贝，immutable
date: 2020-04-24 16:17:45
category: JS
---

### 1. 浅拷贝
指的是创建新的数据，这个数据有着原始数据属性值的一份精确拷贝
如果属性是基本类型，拷贝的就是基本类型的值。如果属性是引用类型，拷贝的就是内存地址
```js
function shallowClone(obj) {
  const newObj = {};
  for(let prop in obj) {
    if(obj.hasOwnProperty(prop)){
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}
```
在JavaScript中，存在浅拷贝的现象有：
- *`Object.assign`*
- *`Array.prototype.slice()`*, *`Array.prototype.concat()`*
- 使用拓展运算符实现的复制

<br/>

### 2. 深拷贝
深拷贝开辟一个新的栈，两个对象属完成相同，但是对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性
常见的深拷贝方式有：
- *`_.cloneDeep()`*
- *`jQuery.extend()`*
- *`JSON.stringify()`* **这种方式会存在弊端，会忽略`undefined`, `symbol`和函数**
```js
const obj = {
  name: 'A',
  name1: undefined,
  name3: function() {},
  name4:  Symbol('A')
}
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj2); // {name: "A"}

```
- 手写循环递归
```js
function deepClone (obj, hash = new WeakMap()) {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  // 基本类型：直接返回值
  if (typeof obj !== 'object') return obj
  // 引用类型：进行深拷贝
  if (has.get(obj)) return hash.get(obj)
  let cloneObj = new obj.constructor()
  hash.set(obj, cloneObj)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj
}
```

<br/>

### 3.小结
- 浅拷贝是拷贝一层，属性为对象时，浅拷贝是复制，两个对象指向同一个地址
- 深拷贝是递归拷贝深层次，属性为对象时，深拷贝是新开栈，两个对象指向不同的地址
<br/>

### 4.Immutable

### 参考资料
- [深拷贝浅拷贝的区别？如何实现一个深拷贝？](https://github.com/febobo/web-interview/issues/56)