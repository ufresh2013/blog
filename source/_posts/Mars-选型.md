---
title: Mars 选型和语法定义
date: 2025-04-03 17:57:46
category: Work
---

### 1. 选型

#### 1.1 Markdown 编辑器

期望：只考虑专门的 markdown 编辑器，API 简洁好用

- 🔴 [CodeMirror](https://codemirror.net/)
  排除通用的富文本编辑器
- 🔴 [milkdown](https://milkdown.dev/)
  官网 playground 很好看，实际试了一下包不好用，最新 v7 文档不齐全
- ✅ [byteMd](https://bytemd.js.org/)
  字节开源，VitePress，掘金同款 markdown 编辑器。基于 CodeMirror 实现。流畅好用，样式好看，区分 Editor 和 Viewer，API 简洁好理解（还是国产的好，不知道为啥外国的包，各种 option, API 总是很复杂）。

#### 1.2 Flow 流程图

期望：传入流程图的`nodes, edges`数据自动布局、自动渲染，文档流程图的节点较少(<300 个)。希望节点是 html 渲染，依赖 css 实现自适应。连线基于 svg 实现。支持自定义节点、连线样式。支持节点拖拽，节点移动，边同步移动

- 🔴 [Antv X6 Flow](https://x6.antv.antgroup.com/)
  蚂蚁 Antv 系列，demo 看着很给力。本地跑了一下，基于 svg 实现。不支持传入`nodes`,`edges`就自动渲染，每个节点都传入 x, y, width, height。由于节点不是 html 实现，宽高不支持自适应，框架也没支持。每次 render 的时候都会闪一下，实在是太闪了。
- 🔴 [LogicFlow](https://site.logic-flow.cn/)
  滴滴开源，没有看到可以自动布局的。但是它 demo 里的流程编排交互做得很好。
- ✅ [React Flow](https://reactflow.nodejs.cn/learn)
  支持传入`nodes, edges`，每次重新render的时候不会闪，很好。结合第三方库，可实现自动布局
  - Darge
  - D3-Hierarchy
  - D3-Force
  - ELK

#### 1.3 PPT 幻灯片

- 🔴 [Vue-mark-display](https://github.com/Jinjiang/vue-mark-display)
仅支持 Vue，但我用的是 React
- 🔴 [slidev](https://cn.sli.dev/)
一个类似hexo的， markdown 转 ppt 的博客工具，没有单独的 npm 包。
- 🔴 [Reveal.js](https://revealjs.com/react/)
直接把ppt挂载body下，只能全屏展示，把其他html都吃掉了。
- ✅ [React Remark](https://reactflow.nodejs.cn/learn/tutorials/slide-shows-with-react-flow)
reactFlow 同款 markdown 转 ppt，目测合适。但是文档只有一篇，没有提供模板自定义的方法。


#### 1.4 数据报告

- ✅ [Antv G2 Plot]()
  之前用 Antv G2 Plot 实现过一套图表 + 自己写的 grid 布局自动排版，直接用

### 2. 模板样式

- [Rough](https://github.com/rough-stuff/rough)：手绘画风

### 3. 语法定义

要实现 markdown 转各种，首先要扩展 Markdown 语法。

Markdown 语法在 2004 诞生。当时网络的文本排版主要依赖 HTML。为了能快速写作，希望有一种新的标记语言，用简单的文本格式书写，又能轻松转换为 HTML 格式，以满足网络发布的需求。Markdown 一经推出，就受到了技术社区和写作者的欢迎，许多博客平台、写作工具都开始支持 Markdown 。

20 年过去了，Markdown 成为了 AI 大模型最主流的返回格式。解析、编辑 markdown 成为 AI 工具链中重要的一环。Markdown 语法需要扩展吗？不管怎样，做这个应用就得扩展。

借鉴 mermaid, 我们可以代码块 3 个`，带上标识表示渲染为什么组件。

[]: # ... existing code ...
```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```

#### 3.1 flow

流程图包含两大块内容：

- 节点（Nodes）：代表流程图中的一个单元，例如一个步骤、任务或事件
- 连线（Edges）：连接两个节点的线条，标识流程中的依赖或顺序

[]: # ... existing code ...
```flow
  1. 开始
  2. 输入数据
  3. 数据处理
  处理步骤1
  处理步骤2
  4. 数据展示
  5. 结束

  1->2->3
  2->|连线上的句子|4
```

#### 3.2 ppt

用`----`进行分页，每一页里面是 markdown

[]: # ... existing code ...
```ppt
# 这里是第一页
以及一些基本的自我介绍

----

### 这里是第二页
- 这里有内容
- 这里有内容
- 这里有内容

----

没了，__谢谢__
```

### 参考资料

- [LogicFlow - 如何实现一个最简易的流程图库 - 最简模型](https://juejin.cn/post/7451223580595421234)
- [vue-mark-display：用 markdown 语法轻松撰写幻灯片](https://jiongks.name/blog/introducing-vue-mark-display)
