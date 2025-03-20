---
title: Typescript语法
date: 2020-11-18 15:39:26
categories: JS
---

### 1. 为什么要用TypeScript
- *验证约束、用法提示*
类型是人为添加的一种编程约束和用法提示。目的是在开发过程中，提供自动补全、验证提示

- *减少代码重构带来的未知影响*
Typescript有助于代码重构，因为不确定修改后是否会影响到其他部分的代码。类型信息检查大大减轻了重构的成本。一般来说，只要函数或对象的参数和返回值保持类型不变，就能基本确定，重构后的代码也能正常运行。


<br/>

### 2. 类型声明
#### 2.1 基本类型
为 JavaScript 变量加上了类型声明。类型声明并不是必需的，如果没有，TypeScript 会自己推断类型。
```js
let name: string = '陈皮皮';
name = 9527; // 报错
```
- any类型
  - *`any`*: 没有任何限制
  - *`unknown`*: 表明类型不确定，可以是任意类型
  - *`never`*: 表示不能赋给它任何值，否则都会报错
  ```js
  function fail(msg:string):never {
    throw new Error(msg);
  }
  ```
- 基本类型
  - *`boolean`*
  - *`string`*
  - *`number`*: 所有整数和浮点数
  - *`bigint`*: 所有大整数
  - *`symbol`*
  - *`object`*: 包含了所有对象、数组和函数
  - *`undefined`* 未定义
  - *`null`* 空值
  - *`void`* 表示函数没有返回值

- 联合类型
符合 A 或 B 都行
```js
let bye: string | number;
```

- 交叉类型
必须同时属于 A 和 B 
```js
let x: number & string;
```

<br/>

#### 2.2 数组
如果变量的初始值是空数组，那么 TypeScript 会推断数组类型是`any[]`
```js
let arr:number[] = [1, 2, 3];
let arr:(number|string)[];
let arr:Array<number|string>;

// 多维数组
const multi:number[][] = [[1,2,3], [23,24,25]];
```


<br/>

#### 2.3 元祖
元组必须明确声明每个成员的类型
```js
let t:[number] = [1];
const s:[string, string, boolean] = ['a', 'b', true];
type t1 = [string, number, ...boolean[]]; // 表示数组第三个元素开始到后面都是boolean
```

<br/>

#### 2.4 函数
```js
function hello(txt:string):void {}

// 可选参数
function f(x?:number) {}

// 参数默认值
function createPoint(x:number = 0, y:number = 0):[number, number] {
  return [x, y];
}
```

<br/>

#### 2.5 对象
```js
const obj:{ x:number; y:number; } = { x: 1, y: 1 };
```

#### 2.6 类 
##### 2.6.1 Implements关键字
类使用 implements 关键字，表示当前类满足这些外部类型条件的限制。
```js
type Country = {
  name:string;
  capital:string;
}

class MyCountry implements Country {
  name = '';
  capital 
```

##### 2.6.2 可访问属性修饰符
`public` 修饰符表示这是公开成员，外部可以自由访问
`private` 私有成员，只能用在当前类的内部，类的实例和子类都不能使用该成员。
`protected` 保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用。
`static` 静态成员是只能通过类本身使用的成员，不能通过实例对象使用。
`abstract` 该类不能被实例化，只能当作其他类的模板
`readonly` 用来定义只读的字段，使得字段 只能在创建的时候赋值一次。
```js
class Me {
  public static name = '陈皮皮';
  private secret = '*******';
  protected password = '********';
}
```

<br/>
<br/>

### 3. 基本语法
#### 3.1 别名 Type
用来定义一个类型的别名。
```js
type MyObj = { // 为对象类型声明一个别买那个
  x:number;
  y?:number; // 可选属性
  // 无法得知事前会有多少属性，允许这种属性名的索引类型
  [property: string]: string;
  [property: number]: number;
};
const obj:MyObj = { x: 1, y: 1 };
```

<br/>

#### 3.2 接口 Interface, extends
interface 是对象的模板，可以看作是一种类型约定，中文译为“接口”。使用了某个模板的对象，就拥有了指定的类型结构。
interface 可以表示对象的各种语法，它的成员有5种形式。
- 对象属性
- 对象的属性索引
- 对象方法
- 函数
- 构造函数

```js
interface Human {
  name: string;
  [prop: string]: number; // 属性索引
  readonly id: number; // 只读属性
  hair?: number; // 可选属性
  run(): void;
}
```
- interface可以继承，相当于多个接口合并
```js
interface Shape {
  name: string;
}

interface Circle extends Style, Shape {
  radius: number;
}
```
- *Type 和 Interface 的区别？ *
  很多对象类型既可以用 interface 表示，也可以用 type 表示。
  interface 与 type 的区别有下面几点。
  - type能够表示非对象类型，而interface只能表示对象类型（包括数组、函数等）。
  - interface可以继承其他类型，type不支持继承。

<br/>

#### 3.3 泛型 Generics
有些时候，函数返回值的类型与参数类型是相关的。
`<T>`可以理解为类型声明需要的变量。
```js
function getFirst<T>(arr:T[]):T {
  return arr[0];
}

type Nullable<T> = T | undefined | null;
type Container<T> = { value: T };
const a: Container<number> = { value: 0 };
```

<br/>


#### 3.4 枚举 enum
需要定义一组相关的常量。Enum 结构里面包含4个成员，他们的默认值分别为0,1,2,3。你可以给它们设置具体值
```js
enum Direction {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4
}
let direction: Direction = Direction.Up; // 1
```

<br/>


#### 3.5 断言 as 
TypeScript 一旦发现存在类型断言，就不再对该值进行类型推断，而是直接采用断言给出的类型。
```js
type T = 'a'|'b'|'c';
let foo = 'a';

let bar:T = foo; // 报错，原因是typescirpt推断foo的类型是string，给bar复制string就报错
let bar:T = foo as T; // 正确
```
类型断言并不意味着，可以把某个值断言为任意类型。`T`最起码是`foo(string)`的子类型


<br/>

#### 3.6 import/export
TypeScript 允许输出和输入类型
```js
type Bool = true | false;
export { Bool };

import { Bool } from './a';
let foo:Bool = true;
```

<br/>

#### 3.7 命名空间 namespace
自从能 `import/export`后，官方已经不推荐使用 `namespace` 了。
namespace 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用。
```js
// shapes.ts
export namespace Shapes {
  export class Triangle {
    // ...
  }
}

import { Shapes } from './shapes';
let t = new Shapes.Triangle();
```

<br/>


### 4. d.ts 声明文件
`d.ts`文件，会自动将类型声明文件加入编译，不用手动import
```js
// types.d.ts
export interface Character {
  catchphrase?: string;
  name: string;
}
```

<br/>

### 5. 注释指令
```js
// @ts-nocheck
// 不对当前脚本进行类型检查

// @ts-check
// 对该脚本进行类型检查，不论是否启用了checkJs编译选项

// @ts-ignore
// 不对下一行代码进行类型检查
```

<br/>


### 6. tsconfig.json
tsconfig.json是 TypeScript 项目的配置文件，放在项目的根目录。
- include：指定哪些文件需要编译
- exclude: 从编译列表中去除指定的文件
```js
{
  "include": ["./src/**/*"],
  "exclude": ["**/*.spec.ts"]
}
```

<br/>

### 7. tsc 命令行编译器
tsc 是 TypeScript 官方的命令行编译器，用来检查代码，并将其编译成 JavaScript 代码。

tsc 默认使用当前目录下的配置文件tsconfig.json，但也可以接受独立的命令行参数。

### 参考资料
- [阮一峰 - typescript教程](https://wangdoc.com/typescript/declare)