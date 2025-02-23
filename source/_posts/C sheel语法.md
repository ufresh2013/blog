---
title: C#语法
date: 2025-01-03 09:24:56
category: 草稿
---

### 1. 命名空间
命名空间的设计目的是提供一种让一组名称与其他名称分隔开的方式
`using System;` using 关键字用于在程序中包含 System 命名空间
```c#
using System;
namespace first_space
{
   class namespace_cl
   {
      public void func()
      {
         Console.WriteLine("Inside first_space");
      }
   }
}
```

<br/>

### 2. class
程序的执行从 Main 方法开始。

- 访问修饰符：定义类成员的范围和可见性
  public：所有对象都可以访问；
  internal：同一个程序集的对象可以访问；
  protected：只有该类对象及其子类对象可以访问
  private：对象本身在对象内部可以访问；

```js
class BaseClass
{
  public void SomeMethod() {}
}

// 继承，多重继承
class DerivedClass : BaseClass, OtherClass
{
  public void AnotherMethod()
  {
    base.SomeMethod();
  }
}
```

<br/>

### 3. 数据类型
类型 | 举例
---|:--:|---:
整数类型 | sbyte、byte、short、ushort、int、uint、long、ulong 和 char
浮点型 | float, double
十进制类型 | decimal
布尔类型 | true 或 false 值，指定的值
空字符串 | string
空类型 | null
动态类型 | dynamic(允许在运行时推断变量的类型)
类 | class
数组 | *`datatype[] arrayName`*, 如`double[] arr = new double[10]`
- 类型转换方法
```c#
int i = 75;
Console.WriteLine(i.ToString());
i.ToBoolean();
i.ToByte();
i.toDouble();
Convert.ToBoolean(i); // 转换为Boolean
Boolean.Parse(string); // 将字符串解析为Boolean
```

### 4. 常见方法
- 运算符
+, -, *, /, %, ++, --, ==, !=, >, <, >=, <=, &&, ||, !, =, +=, -=, *=, /=, %=

- 判断
```c#
if () {};
if () {} esle {};
if () {} else if () {};
Exp1 ? Exp2 : Exp3;
switch(expression){
  case constant-expression  :
    statement(s);
    break; 
  default :
    statement(s);
    break; 
}
```

- 循环
```c#
while(condition) {};
do {} while ();

for (int a = 10; a < 20; a = a + 1) {};

int[] fibarray = new int[] { 0, 1, 1, 2, 3, 5, 8, 13 };
foreach (int element in fibarray) {};

```

- 字符串
```c#
string[] strs = { "Hello", "From", "Tutorials", "Point" };
string str = strs[0];
```
方法 | 举例
---|:--:|---:
`String.Compare(str1, str2)` | 比较两个指定的 string 对象，并返回一个表示它们在排列顺序中相对位置的整数
`String.Concat(str1, str2, str3)` | 连接字符串
`bool str.Contains("t")` | 判断字符串中是否包含字符
`bool str.StartsWith("tt")` | 判断字符串是否以指定字符开头
`bool str.EndsWith("tt")` | 判断字符串是否以指定字符结尾
`bool str.Equals("t")` | 判断字符串是否和指定字符串相同
`int str.IndexOf("t")` | 返回第一次出现的索引
`int str.LastIndexOf("t")` | 返回最后一次出现的索引
`string str.Insert(int startIndex, string value)` | 指定的字符串被插入在当前 string 对象的指定索引位置
`string String.Join(string separator, string[] value)` | 连接一个字符串数组中的所有元素，使用指定的分隔符分隔每个元素。
`string str.Replace(string oldValue, string newValue)` | 替换
`string[] str.Split(char[] separator)` | 分割为数组
`string str.ToLower()` | 转换为小写
`string str.ToUpper()` | 转换为大写
`string str.Trim()` | 去掉前后空白符

### 5. 自定义数据类型
- enum
枚举列表中的每个符号代表一个整数值，一个比它前面的符号大的整数值。第一个枚举符号的值是 0
```c#
enum Day { Sun, Mon, Tue, Wed, Thu, Fri, Sat };

int x = (int)Day.Sun // 0
```

- struct
struct 语句为程序定义了一个带有多个成员的新的数据类型。
```c#
struct Books
{
  public string title;
  public string author;
  public string subject;
  public int book_id;
}; 
Books Book1;        /* 声明 Book1，类型为 Books */
```

- interface
接口定义了属性、方法和事件
```c#
using System;

interface IMyInterface
{
        // 接口成员
    void MethodToImplement();
}

class InterfaceImplementer : IMyInterface
{
    static void Main()
    {
        InterfaceImplementer iImp = new InterfaceImplementer();
        iImp.MethodToImplement();
    }

    public void MethodToImplement()
    {
        Console.WriteLine("MethodToImplement() called.");
    }
}
```