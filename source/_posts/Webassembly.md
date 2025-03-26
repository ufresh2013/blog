---
title: WebAssembly 加速执行
date: 2025-03-16 17:57:46
category: 动画/媒体
---


### 1. 简介
Webassembly 最早的目标是让代码在浏览器端更快地执行。WASM 将非 JavaScript 的语言（例如：C/C++，Rust，Golang等）的代码编译为低级字节码 Webassembly 模块（`.wasm`文件），放入浏览器环境中，让浏览器直接执行这些模块。
WebAssembly 本质上是一种语言格式，它也是可人工编程的。它也有变量、函数、指令等基础概念。
```c
(module
  (type (;0;) (func (param i32)))
  (type (;1;) (func))
  (import "imports" "imported_func" (func (;0;) (type 0)))
)
```

<br/>



### 2. 实际应用
- *Qt应用*
Qt for WebAssembly 让 Qt 应用也能放到 Web 浏览器里使用。
<img src="2.webp" style="width: 45%" />

- *视频解码*
当 FLV 格式的直播流到达前端时，需要对视频解码成 MP4 格式，再使用原生播放器播放。使用 JavaScript 转码效率较低，引入 Webassembly 替换 JavaScript 来进行转码后，播放视频的性能提高了将近 20%。

- *图形渲染 Figma*
使用 Webassembly 后，Figma 提高了Web端的响应和载入速度。
依托 Web 的快捷访问，Figma 打败了只有 mac 客户端的 Sketch。

<br/>
<br/>



### 3. Hello World
使用在线的编译器，将 `add.c` 文件转化为 `add.wasm`
```c++
#include <stdio.h>
float add(float a, float b) {
  return a + b;
}
```
转换后的`add.wasm`文件
```wasm
(module
  (type (;0;) (func (param f32 f32) (result f32)))
  (func (;0;) (type 0) (param f32 f32) (result f32)
    local.get 0
    local.get 1
    f32.add)
  (export "add" (func 0)))
```
用 vscode 启动服务, `.wasm`必须启动服务才能`fetch`
```html
<!DOCTYPE html>
   <head>
      <meta charset="utf-8">
      <title>WebAssembly Add example</title>
      <style>
         div {
            font-size : 30px; text-align : center; color:blue;
         }
      </style>
   </head>
   <body>
      <div id="textcontent"></div>
      <script>
         let sum;
         fetch("add.wasm")
            .then((response) => response.arrayBuffer())
            .then((bytes) => WebAssembly.instantiate(bytes))
            .then((results) => {
                sum = results.instance.exports._Z3addff(13, 12);
                console.log("The result of 13 + 12 = " +sum);
                document.getElementById("textcontent").innerHTML = "The result of 13 + 12 = " +sum;
         });
      </script>
   </body>
</html>
```

<br/>
<br/>

### 4. 应用
#### 2.1 直播烟花特效
我们看直播时，经常可以看见由用户送礼触发的炫酷礼物特效，如嘉年华、烟花。实现方案一般有：
- *MP4*
在早期直播的礼物特效多以播放 MP4 为主。该方案的瓶颈很明显：难以支持交互类特效、受资源包体积约束无法做到大量排列组合的随机性特效。
- *webgl渲染*
相比于C++渲染，JavaScript 的低运行效率会严重影响渲染效果。将特效中重复且重 CPU 计算的逻辑转换为 WebAssembly 来调用是其中的重要优化之一。
<img src="1.webp">

```shell
git clone https://github.com/AssemblyScript/assemblyscript.git
cd assemblyscript
npm install
npm link
npm run dev
npm run asbuild # 编译出 .wasm 产物

# 编写AssemblyScript的位置，我们在此export的接口，在编译后都会在 .wasm 产物中提供接口
./assembly/index.ts
# 用于编写测试 .wasm 代码的地方，我们可以在此处引入 .wasm 产物，然后使用 JavaScript 代码调用进行测试
./tests/index.js
```


<br/>

#### 2.2 图像处理

#### 2.3 音视频编码

#### 2.4 Web视频剪辑 


#### 2.6 解决React性能问题


<br/>

### 参考资料
- [掘金·字节跳动前端·WebAssembly](https://juejin.cn/post/7212446354920079416)