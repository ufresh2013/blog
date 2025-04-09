---
title: Go 基本语法
date: 2025-03-21 10:08:48
---

### 配置
- 代码仓库
https://gitee.com/geektime-geekbang_admin/geektime-basic-go

- GoLand 配置
GOPROXY: "http://goproxy.cn.direct"
GOPATH 设置自己golang项目放置路径

- go.mod 文件
```
module geektime-go // 标记是什么模块
go 1.24 // go版本号
```




### 1. 基本语法
#### 1.1 main函数
`main` 函数是 Go 程序的启动入口。运行`go run main.go`，意味着运行这个 main.go
里面的 main 函数。main 函数无参数、无返回值。
```go
package main // 包名

func main() {
  println("Hello World") // 会自动换行
  print("Hello World") // 不会自动换行
}
```



#### 1.2 基本类型
- `int` 
int8、int16、int32、int64、int。在内存中分别用 1、2、4、8 个字节来表达，而 int
用几个字节则取决于CPU。目前大多数 int 都是 8 字节。
- `uint` 
正整数，uint8、uint16、uint32、uint64、uint
- `float` 
浮点数，float32、float64。优先使用 float64。
（Go 里面，只有同类型才可以执行加减乘除，Go 是没有自动类型转换的）
- `bool`
- `string`
string 的长度很特殊，*字节长度*和编码无关，用 len(str)获取。*字符数量*和编码有关，使用 utf8 库来计算。
`strings`操作: 查找/替换/大小写转换...
```go
println(len("你好"))                      // 6
println(utf8.RuneCountInString("你好"))   // 2
println(utf8.RuneCountInString("你好ab")) // 4
```

- `byte`
byte 就是字节，本质上就是 uint8，也会用它来表达 ASCII 字符。一般很少单独使用 byte，都是使用 []byte。[]byte 和 string 之间可以互相转换。
```go
var a byte = 'a'
println(a) // 97

var str string = "this is a string"
var bs []byte = []byte(str)
println(bs)
```





#### 1.2 变量、常量
- `var`变量：var name type = value
- `:=` 只能用于局部变量，即方法内部，go会推断类型
- `const`常量
- `iota`
```go
var a int = 13
a := 13
const b int = 13
```



#### 1.3 方法
Go 的方法可以有多个返回值，并且返回值可以有名字。
同一个作用域内，如果左边出现了新的变量，那么就需要使用 `:=` 来接收返回值。
```go
func Invoke(a int, b int) (plus int, mine int, err error) {
  return a + b, a - b, nil
}

plus, mine, _ := Invoke(1, 2)
println(plus, mine)
```

- 方法也可以作为返回值, 支持不定参数、匿名函数
- 闭包
一个对象被闭包引用的话，它是不会被垃圾回收的，会引起内存泄露。
```go
func Func6() func(name string, alias ...string) string {
	return func(name string) string {
		return "hello" + name
	}
}

// 匿名函数发起后立即调用
func Func6() {
	hello := func() string {
		return "hello"
	}()
	print(hello)
}
Func6()
```

- `defer` 
延迟调用, Go 里面有一个机制，允许你从方法返回的前一刻，执行一段逻辑。defer 类似于栈，也就是后进先出。也就是，先
定义的后执行；后定义的先执行。作为*参数传入*的值：定义 defer 的时候就确定了。作为*闭包引入*的：执行 defer 对应的方法的时候才确定。
```go
func Defer() {
  // 闭包引入
  j := 1
	defer func() {
		print("1")
	}()

  // 参数传入
	defer func() {
		print("2")
	}(i)
}

Defer() // 2, 1
```



#### 1.4 控制结构
- `if else`
Go 的 if else 支持一种新的写法，可以在 if-else 块里面定义一个新的局部变量。在右边 distance 的只作用于 if-else 块，离开了
这个范围就无法使用了。
```go
if distance := a - b; distance > 100 {
  print("too far")
} else {
  print("close")
}
```
- `for`
```go
for i := 0; i < 10; i++ {
}
for i := 0; i < 10; {
  i++
}
for {
  // 等同于 while true,如果你没办法退出的话，有可能引起 CPU 100%
}
```
- `switch`
- `select`