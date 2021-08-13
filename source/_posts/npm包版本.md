---
title: npm模块安装机制
date: 2021-07-29 13:37:58
category: Bug
---
### 1. 输入*`npm install`*会发生什么？

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

<br/>

### 2. A模块依赖于lodash1.0.0，B模块也依赖于lodash2.0.0，最后安装的lodash会是哪个版本？
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





<br/>

### 参考资料
- [介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22)
- [浅谈npm 的依赖与版本](https://github.com/SamHwang1990/blog/issues/7#issue-207283826)