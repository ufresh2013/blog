---
title: 我决定做一个独立应用，就叫 Marx
date: 2025-04-01 17:57:46
category: Work
---

事情的起源是最近在找工作嘛。有一家公司发了一个面试题，要实现一个文字转流程图的 demo。
反正也找不到工作，看了几篇文章，准备动手了。大概是这样的一个 markdown

```markdown
- 模块 1
  模块 1 的描述
- 模块 2

模块 1->模块 2
```

转成 data

```js
const data = {
  nodes: [
    { title: "模块1", desc: "模块1的描述" },
    { title: "模块2", desc: "" },
  ],
  edges: [{ startNode: "模块1", endNode: "模块2" }],
};
```

data 再转成流程图
<img src="1.jpg" />

说到 markdown，我可太喜欢 markdown 了，然后也很喜欢[hexo](https://hexo.io/zh-cn/)。待业这段时间天天写 markdown，利用 hexo 刷一下变成博客文章，舒服。🤔 都要做 markdown 转流程图了，那何不整大点，做一个 markdown 转万物的应用。

- ✍️ markdown 转文档（网页、word）
- 👀 markdown 转 ppt(在线播放的幻灯片)
- ➡️ markdown 转流程图
- 🤔 markdown 转思维导图
- 💯 markdown 转数据统计报告
- 🖼️ markdown 转海报
- 📃 markdown 转表单、问卷

<p></p>

于是，我萌生了做一个独立应用的想法。名字也想好了，就叫 Marx。

代码一行没写，🤔 此时我已经在搜索“独立应用如何盈利”。先把 demo 做出来，掘金一宣传，不小心被张一鸣看中，字节提出要收购了我的 Marx，顺便还给我发了 offer。线上应用还不够，我又开始想着做大做强。

最后做成一个面向非程序员的[hexo](https://hexo.io/zh-cn/)。让产品、运营、设计、各行各业的人拥有自己的本地文档库(markdown 文档)。利用[VSCode](https://code.visualstudio.com/), [Trae](trae.com.cn)这样的编辑器，提供本地预览（预览为文章、ppt、流程图）和一键部署为网站的服务。让大家都能拥有记录自己工作和学习上各种想法的博客~

🤔 我暗戳戳的百度和 github 了一下，发现还没有这样的产品。不过其实还是有的，像[语雀](https://www.yuque.com/dashboard)、[excalidraw](https://excalidraw.com/)。我常常觉得一个个方块、一个个按钮，去又拖又拉的，会有点笨重。那些你表面上想编辑的“样式”其实是信息的“类型”+“配套的样式”罢了。为什么不直接 markdown 转呢？

我希望是这样的：

- 没有思维导图、wps、figma 等编辑器上各种新建、加粗操作按钮
  😭 其实我每次看到一堆按钮我都不想点 ，只想找一个模板，然后改改文字，整理一下咔完事。
- 只有一个 markdown 输入框，提供一个 markdown 示例，根据这个格式写，就能产出 ppt, 思维导图
  👀 感谢 Vue 和 React，MVC 的操作方式，已经深入我心，那就让万物皆可[MVC](https://baike.baidu.com/item/MVC%E6%A1%86%E6%9E%B6/9241230)
- 提供模板改变样式，模板也是一点就生效
  🤔 好看是一个很重要的事，但是不能搞得太麻烦
- 除了支持线上写，还要支持本地写
  😔 这个是因为我总觉得写在线文档，包括用本地的 wps，有一种不知道什么时候没网、什么时候没保存的压迫感。本地 txt 写就很安心~
- 关于 markdown 转表单
  我在想之前做的低代码平台从交互上就是错误的。之前做的是字段、选项一个个新建、配置。更简洁的方法应该是输入 markdown 如`field1 checkbox true`，自动识别，自动布局，类似的场景就是设置淘宝的收货地址。

<p></p>

相比于 ProcessOn、wps、figma 这样操作比较复杂的编辑器，Mars 没有了各种操作，完全遵循 MVC 架构，只留一个 markdown 输入框。模板优质一点，直接转出来一个 90 分的东西，这不正迎合大厂们去 ppt 的需求吗？

相比于现在主流的 AI Chat（豆包、kimi），一句话直接输出总像在搜罗资料，少了仔细调整的空间。而 markdown 的输入，能让内容会更清晰具体可控，离最终产出物更近。

💪🏻 动手吧阿祖！

🐶 后面查了一下，还是有很类似的，这里罗列一下竞品和一些很有意思的可视化产品

开源产品：

- [mermaid](https://github.com/mermaid-js/mermaid): 定义新的 markdown 语法，转流程图，已经成为共识
- [excalidraw](https://excalidraw.com/)：拖拽交互，可以复制 mermaid 文本直接转为流程图再编辑
- [Tremor](https://tremor.so/)：提供仪表盘组件库，构建 React 仪表盘 Dashboard
- [Cascii](https://github.com/casparwylie/cascii-core)：通过拖拽，绘制 ASCII 图案（纯文字图案）
- [Presenterm](https://gitee.com/mirrors/presenterm)：通过 markdown 创建 ppt，并且让他们在终端运行
- [tldraw](https://www.tldraw.com/): AI 神笔马良，通过手绘的草稿，自动生成页面和代码。[介绍视频](https://www.bilibili.com/video/BV1de411r7uU/?spm_id_from=333.1387.homepage.video_card.click&vd_source=2afb712305742eec14a61ccd3d5b51c9)
- [mdq](https://github.com/yshavit/mdq)：通过命令行轻松提取 markdown 中特定部分,如标题、列表、链接。
- [mark2slides](https://www.npmjs.com/package/mark2slides): markdown 导出为在线幻灯片

国内成熟的产品：

- [博思 boardmix](https://pptgo.cn/app)：很成熟的 AI 生成白板和 PPT + 再编辑。
- [Dooring 低代码](https://dooring.vip/#/)：拖拽组合生成 H5 页面，一条龙服务

<p></p>

### 1. 实现功能

先实现这 4 个

- markdown 转文档（博客、word）
- markdown 转 ppt (在线播放的幻灯片)
- markdown 转流程图
- markdown 转数据统计报告

MVC 模式，去掉每个节点的编辑操作，让 Markdown 统一管理数据
有机会还能实现

- markdown 转思维导图
- markdown 转设计稿
- markdown 转海报
- markdown 转简历

其他

- 域名、资源部署
- 模板选择、模板收费（模板提供样式模板，不提供内容模板）
- 登录账号管理，用于管理付费模板

### 2. 设计稿

先大概出个设计稿，比较有奔头
在线链接： https://pixso.cn/app/editor/mzpUPSjCx1INXXY7VrtUPA?icon_type=1&page-id=0%3A1
左边是 markdown，右边根据 markdown 自动生成的成品。
做设计稿的时候发现了很多已经做得很优秀的同类型 AI 产品，热情瞬间被浇了一大半
😔 那我就做好看的精品工具产品。😮 不依赖 AI，后端，零成本，连静态资源都托管在 github
<img src="2.png" />

### 3. 框架选择

1. 项目框架: React + Vite，最近用 Trae 敲 React 很舒服，函数式组件果然更易于 AI 理解
2. markdown 编辑器、渲染器: bytemd
3. 渲染组件

- 流程图: React Flow
- ppt 在线播放: Vue-mark-display
- 数据报告中的图表: Antv G2 Plot(svg)

### 3. github 仓库

### 4. 线上 demo
