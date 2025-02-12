---
title: Typescript语法
date: 2020-05-18 15:39:26
categories: JS
---

### 1. 为什么要用TypeScript
在使用 JavaScript 进行开发时，由于*没有类型限制、自动补全和智能提示*，就需要 **开发人员之间的频繁沟通 或者 频繁阅读文档** 来保证代码可以正确执行。即便如此，开发人员也不能保证 每个变量/函数名都一次写对，每个参数都一次传对。这里所花费的时间都在默默降低项目的整体开发效率。

而使用 TypeScript 进行开发时，得益于 类型系统，*在读取变量或调用函数时，均有 自动补全*，基本杜绝写错变量/函数名的情况。类型限制 与 智能提示 让开发人员调用 API 时可以 快速得知参数要求，不需要再频繁阅读代码、文档或询问模块开发者。


<br/>

### 2. 语法
#### 2.1 静态类型检查
```js
let name: string = '陈皮皮';
name = 9527; // 报错

// 联合类型
let bye: string | number;
```


#### 2.2 枚举和元祖
```js
// 枚举
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
let direction: Direction = Direction.Up;

// 元组
let x: [string, number];
x = ['hello', 10]; // 不报错
x = [10, 'hello']; // 报错
```


#### 2.3 访问修饰符
`public`、`private` 和 `protected` 用来限定类成员的可访问范围
`static` 用来定义全局唯一的静态变量和静态函数
`abstract` 用来定义 抽象类或抽象函数
`readonly` 用来定义只读的字段，使得字段 只能在创建的时候赋值一次。
```js
class Me {
  public static name = '陈皮皮';
  private secret = '*******';
  protected password = '********';
}
```

#### 2.4 接口 Interface
接口用于一系列成员的声明，但不包含实现，接口支持合并（重复声明），也可以继承于另一接口。
```js
// 1. 扩展原始类型
interface String { // 扩展 String 类型
  translate(): string;
}

String.prototype.translate = function () {
  return this;
};

let nickname = '陈皮皮'.translate();


// 2. 定义类型
interface Human {
  name: string; // 普通属性，必须有但是可以改
  readonly id: number; // 只读属性，一旦确定就不能更改
  hair?: number; // 可选属性，挺秃然的
}

let ChenPiPi: Human = {
  name: '陈皮皮',
  id: 123456789,
  hair: 9999999999999
}

// 3. 定义类
interface Vehicle {
  wheel: number;
  engine?: string;
  run(): void;
}

class Car implements Vehicle {
  wheel: 4;
  engine: '帝皇引擎';
  run() {
    console.log('小汽车跑得快！')
  }
}
```

#### 2.5 别名 Type
`Type` 用来 给类型起一个新的名字

#### 2.6 泛型 Generics
使用 泛型 可以让一个 类/函数支持多种类型的数据，使用时可以传入需要的类型。
```js
// 泛型函数
function wash<T>(item: T): T {
  return item;
}
```

#### 2.6 装饰器 Decorator

#### 2.7 命名空间 namespace

### 3. 声明文件
声明文件，即以 d.ts 作为后缀的代码文件，用来声明当前环境中可用的类型。

<br/>

### 参考资料
- [TypeScript 源码详细解读](https://hxy1997.xyz/2021/06/28/TypeScript%20%E6%BA%90%E7%A0%81%E8%AF%A6%E7%BB%86%E8%A7%A3%E8%AF%BB/)
- [教程 | 为什么选择使用 TypeScript ？](https://forum.cocos.org/t/typescript/93014)