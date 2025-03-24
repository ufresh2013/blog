---
title: Chrome断点调试
date: 2019-05-24 14:13:51
category: Browser
---
> 断点调试是指自己在程序的某一行设置一个断点，调试时，程序运行到这一行就会停住，然后你可以一步一步往下调试，调试过程中可以看到各个变量当前的值。

<br/>
### 1. Sources面板
Sources是Chrome developer tool中的断点调试面板。
<br/>
<img src="1.png" style="max-width:500px">
【图1】网站文件目录树
【图2】左侧所选文件的具体内容
【图3】scope显示当前断点的作用域，watch点击 + 号可添加你需要监控的变量或表达式
【图4】核心功能区
Call Stack: 显示当前断点的环境调用栈
Breakpoints: 当前js断点列表
DOM Breakpoints: 当前DOM断点列表
XHR Breakpoints: 当前xhr断点列表，点击 + 添加断点
Event Listener Breakpoints: 当前事件监听断点列表

<br/>
### 2. 设置断点
#### 2.1 JS断点
##### 2.1.1 手动加断点
打开开发者工具 —— 点击Source菜单 —— 左侧树中找到相应文件 —— 点击行列号，即完成当前行添加/删除断点操作。断点添加完毕后，刷新页面js执行到断点位置停住。在Sources界面，会看到当前作用域中所有变量和值，只需对每个值进行验证即可。
你还可以设置条件断点，右击断点位置，选择Edit Breakpoint，设置触发断点的表达式，表达式为true时才触发断点。

<br/>
##### 2.1.2 debugger
还可以在代码中添加`debugger;`，代码执行到该语句时就会自动断点。

<br/>
##### 2.1.3 功能键
断点调试主要用到以下功能键，从左到右依次为

<img src="3.png" style="max-width:500px">

- Pause/Resume script execution: 暂停/恢复脚本执行（程序执行到下一个断点停止）
- Step over next function call: 执行到下一步的函数调用(跳到下一行)
- Step into next function call: 进入当前函数
- Step out of current function: 跳出当前执行函数
- Deactive/Active all breakpoints: 关闭/开启所有断点（不会取消）
- Pause on exceptions: 异常情况自动断点设置


<br/>
##### 2.1.4 解压js
如果碰到压缩后的js代码，可以点击下面的按钮解压

<img src="6.png" style="max-width:500px">

<br/>
#### 2.2 DOM断点
打开Elements面板 —— 定位到相关DOM节点 —— 右击DOM，选择Break on，选择相应选项
*subtree modifications*
子节点变化断点。针对子节点增加、删除以及交换顺序等操作，但子节点进行属性修改和内容修改并不会触发断点
*attributes modifications*:节点属性断点
*node removal*: 节点移除断点
<br/>
<img src="2.png" style="max-width:500px">

<br>
#### 3. XHR断点
通过XHR Breakpoints 的 + 号，当异步请求URL满足条件时，会自动产生断点。
<br/>
<img src="4.gif" style="max-width:500px">

<br/>
#### 4. 事件监听断点
当事件被触发时，断点到事件绑定的位置。包括鼠标、键盘、动画、定时器、xhr等。
<br/>
<img src="5.gif" style="max-width:500px">






<br/>
### 参考资料
- [chrome developer tool—— 断点调试篇](https://www.cnblogs.com/yzg1/p/5578363.html)
- [chrome开发者工具各种骚技巧](https://juejin.im/post/5af53823f265da0b75282b0f)