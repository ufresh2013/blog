---
title: Charles抓包
date: 2019-05-27 10:38:11
category: Browser
---

> Charles将自己设置为系统的网络访问代理服务器，这样所有的网络请求都会通过它，从而实现了网络请求的截获和分析。

<br/>
### 1. 过滤网络请求
选择菜单中的Proxy -> Mac OS X Proxy，之后你的电脑上的任何网络请求都可以在请求面板中看到。
- Structure: 将所有网络请求按照域名划分
- Sequence: 将所有网络请求按照时间排序
- filter: 过滤网络请求。想看所有来自`www.baidu.com`的所有网络请求，在下面你输入baidu即可。
<br/>
<img src="1.png" style="max-width:500px">



<br/>
<br/>
### 2. 截取https数据
捕获https协议的网络请求，需要安装Charles的CA证书。

点击顶部菜单栏Help -> SSL Proxying -> Install Charles Root Certificate -> 在keychain处将新安装的证书设置为永久信任。即使安装了CA证书，charles默认是不捕获https协议的网络请求。我们需要选中网络请求右击选中 *SSL Proxying Enabled*，这样才能看到。
<br/>
<img src="5.png" style="max-width:500px">

<br/>
<br/>
### 3. 截获iPhone的网络请求
要截获iphone的网络请求需要为Charles开启代理功能。在菜单栏选择Proxy -> Proxy Settings，填写HTTP Proxy, Port:8888。并将Enable transparent HTTP proxying勾选上。

*iphone上的设置*
打开手机“设置 - 无线局域网”，点击“配置代理”，设置HTTP代理选中“手动”。服务器处填写电脑ip地址，端口写8888。
<br/>
<img src="2.png" style="max-width:200px">


<br/>
### 4. 修改网络请求
Charles提供了对网络请求的编辑和重发功能。只要选中需要修改编辑的网络请求，点击 *钢笔* 按钮，点击后就可以对网络请求进行编辑，编辑后点击 *Execute* 按钮，该请求就能被执行。
<br/>
<img src="3.png" style="max-width: 500px">
<br/>


### 5. 修改服务器返回内容
为了调试代码，很多时候我们需要修改接口返回的数据。制造数据为空、数据异常、请求失败、多页数据的情况。下面的功能，都可以实现修改服务端返回数据的功能。

- Map 功能适合长期地将某一请求重定向到另一个指定的网络地址或本地json文件
- Rewrite 功能适合对网络请求进行一些正则替换
- Breakpoints 功能适合对网络请求进行一些临时性的修改（类似断点作用）

<br/>
#### 5.1 Map
点击菜单栏Tools -> Map Remote，适合切换线上到本地，测试服到正式服的场景
点击菜单栏Tools -> Map Local，映射到本地的json文件


<br/>
### 6. 压力测试
使用Charles的Repeat功能可以对服务器发起并发访问进行压力测试。选中某个网络请求 -> 右击 -> Repeat Advanced -> 设置迭代次数(iterations)和并发数(Concurrency) -> 点击ok。


<br/>
### 7. 反向代理
反向代理允许我们将本地指定端口的请求映射到远程的另一个端口上。点击顶部菜单栏Proxy -> 点击 Reverse Proxies。将本地的8080端口映射到远程的80端口上，当我访问本地的80端口，实际返回的就是远程80端口的提供的内容。


<br/>
### 8. charles抓不到localhost
将`localhost:4000`修改为`localhost.charlesproxy.com`

<br/>
### 参考资料
- [Charles 抓包二三谈](https://juejin.im/post/5b4f005ae51d45191c7e534a)