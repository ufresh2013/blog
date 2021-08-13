---
title: Typescript语法
date: 2020-05-18 15:39:26
categories: JS
---
> 为什么要使用TypeScript?
- 提供接口

#### 1. 基本类型
```js
boolean, number, string, any, Null, Undefined, void

// 数组
boolean[], number[], string[], any[], Array<number>, 

// 元组 Tuple
let x: [string, number]

// 枚举: 为一组数值赋予友好的名字
enum DEGREE_ACTIVITY_TYPE {
  promote = "1", // 职级晋升
  review = "2" // 职级复核
}

// 总是会抛出异常，或者根本不会有返回值的函数表达式
function error (message:string): never {
  throw new Error(message)
}

function infiniteLoop (message:string): never {
  while (true) {}
}

// 非原始类型 
Object
```


<br/>
#### 2. 接口
对值具有的结构进行类型检查