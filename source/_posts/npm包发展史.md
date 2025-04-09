---
title: npm包发展史
date: 2021-07-15 14:35:59
category: NodeJS
---

> JS原来只运行在浏览器中。Node.js和npm的诞生，让js可以操作文件，网络传输，使得前端拥有了工程化的可能，大大减少了重复性工作（包资源管理、热更新机制、webpack打包）。



### 1. 在没有包管理器前
正确来说 Node.js 是不存在没有包管理器的时期的。2009 年 Node.js 问世的时候 NPM 的雏形也发布了。
而在2009年之前，那时候做得最多的事情是：在网上找包，如 jQuery。找到下载地址，下载 放到项目中一个叫 libs 的目录，或者直接将 CDN 链接粘贴到 HTML 中。



### 2. npm v1-v2
2009 年，Node.js 诞生，npm（Node.js Package Manager）的雏形也正在酝酿。
​2011 年，npm 发布了 1.0 版本。
这一版npm带来的node_modules文件结构，是嵌套结构。
此时，node_modules的嵌套深度十分可怕，堪比黑洞。只有当所有子叶都不再依赖第三方包时，这棵树才能走到尽头。
一个库，被不同的包依赖了，那么它就会被安装两次，这种嵌套结构很快就能把磁盘占满。相信早期npm的windows用户都见过这个弹窗：

（node_modules文件夹无法删除，因为超过了windows能处理的最大路径）



### 3. yarn & npm v3
2016年，yarn诞生了。yarn解决了npm几个最为迫在眉睫的问题：
- 安装太慢 -> 加缓存，多线程
- 嵌套结构 -> 扁平化
- 无依赖锁 -> yarn.lock

yarn最大的贡献是发明了*yarn.lock依赖锁*。这一扁平化结构，使得实际需要安装的包数量大大减少，再加上首发的缓存机制，使得依赖安装的速度大幅提升。而npm在一年后的v5才跟上了步伐，发布了package-lock.json。在没有依赖锁的年代，即使没有改变一行代码，一次`npm install`带来的实际代码量变更很可能是巨大的。




### 4. 输入*`npm install`*会发生什么？
1. 执行工程自身*`preinstall`*钩子
2. 确定首层依赖
找到*`dependencies`* 和 *`devDependencies`* 属性中直接指定的模块。开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。
3. 获取模块
  - 【确定包版本】 如果*`npm-shrinkwrap.json`*或*`package-lock.json`*中有该模块信息直接拿，如果没有则从*`package.json`*中获取。**某个包的版本是 ^1.1.0，npm 就会去仓库中获取符合 1.x.x 形式的最新版本。**
  - 【获取包】查询*`node_modules`*目录中是否已经存在指定模块
    - 若存在，不再重新安装
    - 若不存在
      - npm向registry查询模块压缩包的网址
      - 下载压缩包，存放在根目录下的*`.npm`*目录里
      - 解压压缩包到当前项目的*`node_modules`*目录
  - 【查找该模块依赖】如果有依赖则回到第1步，如果没有则停止。

4. 模块扁平化
一个项目里面可能会包含大量重复模块。A模块依赖于lodash，B模块也依赖于lodash。从 npm3 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有重复模块时，则将其丢弃。





### 5. 版本号约定
因为npm采用了语义化版本约定，简单来说，a.b.c代表着
- a 主版本号：当你做了不兼容的 API 修改
- b 次版本号：当你做了向下兼容的功能性新增
- c 修订号：当你做了向下兼容的问题修正

*Q：A模块依赖于lodash1.0.0，B模块也依赖于lodash2.0.0，最后安装的lodash会是哪个版本？*
```js
// 假设我们的依赖树如下
node_modules
- foo
-- lodash@version1
- bar
-- lodash@version2
```
foo 模块依赖 lodash@^1.0.0
bar 模块依赖 lodash@^1.1.0
则 ^1.1.0 为兼容版本。
```js
// 存在兼容版本
- foo
- bar
- lodash // 保留版本为兼容版本
```

foo 依赖 lodash@^2.0.0
bar 依赖 lodash@^1.1.0
二者不存在兼容版本。会将一个版本放在 node_modules 中，另一个仍保留在依赖树里。
```js
// 不存在兼容版本
node_modules
- foo
- lodash@version1
- bar
-- lodash@version2
```




### 参考资料
- [介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22)
- [浅谈npm 的依赖与版本](https://github.com/SamHwang1990/blog/issues/7#issue-207283826)