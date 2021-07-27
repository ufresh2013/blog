---
title: Typescript语法
date: 2020-05-18 15:39:26
categories: JS
---
> 为什么要使用TypeScript?
- 提供接口

#### 1. 基本类型
定义变量类型: 
- 布尔值，数字，字符串，
- 数组
有两种方式可以定义数组，第一种，在元素类型后面接上`[]`；第二种，使用数组范类`Array<元素类型>`
- 元组
允许表示一个已知元素数量和类型的数组，各元素的类型不必相同
- 枚举
使用枚举类型可以为一组数值赋予友好的名字，默认从0开始编号，可以手动改成从1开始编号。枚举同时提供一个便利，你可以由枚举的val得到它的key
- Any
可以使用`any`类型来标记在编程阶段还不清楚类型的变量。
- void
表示没有任何类型
- Null 和 Undefined
undefined和null两者各自有自己的类型，和void相似，这两个类型用处不大
- Never
表示永不存在的值的类型
- Object
表示非原始类型，除`number`, `string`, `boolean`, `symbol`, `null`, `undefined`之外的类型

```js
let isDone: boolean = false
let decLiteral: number = 6
let username: string = 'bob'

// 数组
let list: number[] = [1,2,3]
let list: Array<number> = [1,2,3]

// 元组 Tuple
let x: [string, number]
x = ['hello', 10] // OK
x = [10, 'hello'] // Error
x[1].substr(1) // Error, 'number' does not have 'substr'
x[1] = 'world' // Error, Type '"world"' is not assignable to type 'number'.
x[2] = '12'    // Error, Tuple type '[string, number]' of length '2' has no element at index '2'.

// 枚举 enum
enum Color {Red = 1, Green, Blue}
const colorIndex: Color = Color.Green
const colorName: string = Color[2]
console.log(colorIndex) // 2
console.log(colorName) // Green

// any
let notSure: any = 4
console.log(notSure.toFixed()) // okay, toFixed exists (but the compiler doesn't check)
let list: any[] = [1, true, 'free']

// Void
let test: void = undefined
function warnUser():void {
  console.log('message')
}

// Null和Undefined
```

- 类型断言
```typescript
let someValue: any = 'this is a string'
let strLength: number = (<string>someValue).length

// 另一种写法
let strLength: number = (someValue as string).length
```

<br/>
#### 2. 接口
对值具有的结构进行类型检查