---
title: 盒模型、正常流、flex，移动端适配
date: 2021-08-13 00:16:04
category: CSS
--- 

### 1. 盒模型
HTML标签中可以书写开始标签、结束标签和自封闭标签。一对起止标签，表示一个元素。DOM树中存储的是元素和其他类型的节点。CSS选择器选中的是*元素*。

元素在排版时可能产生多个*盒*。排版和渲染的基本单位是*盒*。一个元素可能会产生多个盒。如*inline*元素因为分行而产生多个盒。*被伪元素选中的元素*也会产生多个盒。

每个元素被表示为一个矩形的方框，框的内容、内边距、边界、外边距一层层构建起来。浏览器渲染网页布局时，会算出每个框每一层要用什么样式，以及框放在哪里。
*`box-sizing`*
- content-box：`element width = border + padding + content width`
- border-box：`element width = content width`(内容宽度包含了content width，border, padding, 建议使用)



### 2. 正常流，BFC，IFC
HTML最早的排版设计，从文字出版行业的专家来做。思考一下，我们如何写字？1.从左到右书写； 2. 同一行写的文字都是对齐的；3. 一行写满了，就换到下一行。**这也对应了正常流排版过程:**
1. 收集盒
2. 计算盒在行中的排布
  - 行内盒遵循*IFC*(inline formatting contexts) 内联格式上下文
    从左到右排列，排不下，放下一行。Baseline基线来决定行内元素如何对齐。
  - 块状盒遵循*BFC*(Block formatting contexts) 块级格式上下文
    从上到下依次排布。BFC合并会发生什么？
    - *clear float*
    其实不是清楚浮动的意思，而是找一个干净的空间来执行浮动。避免多个相邻的浮动元素堆叠在一行
    - *margun折叠*
    只是要求周围有这么多的空白，就是一个合理的排版。而不会说跟别的边距也有这么多空白。只有正常流的BFC会发生margin折叠的现象，其他flex等布局不会发生。
3. 计算行的排布



### 3. flex
flex 容器中默认存在两条轴：
- 水平主轴 main axis
- 垂直交叉轴 cross axis

<img src="1.jpg">
在容器中的每个单元块被称之为 flex item，每个项目占据的主轴空间为 (main size), 占据的交叉轴的空间为 (cross size)。不能先入为主认为宽度就是 main size，高度就是 cross size，取决于`flex-direction`的取值）




#### 3.1 flex 容器
```css
.container {
  display: flex | inline-flex;
}
```

设置 flex 布局后，子元素的 float、clear、vertical-align 的属性将会失效。

有下面六种属性可以设置在容器上，它们分别是：
1. flex-direction：决定主轴的方向 row | row-reverse | column | column-reverse
2. flex-wrap：决定容器内item是否可换行 nowrap(不换行) | wrap | wrap-reverse(换行，第一行在下方)
3. flex-flow：flex-direction 和 flex-wrap 的简写形式，默认值为: row nowrap
4. justify-content：item在主轴的对齐方式 flex-start | flex-end | center | space-between | space-around
5. align-items：item在交叉轴上的对齐方式，默认值为 stretch，即如果项目未设置高度或者设为 auto，将占满整个容器的高度。flex-start | flex-end | center | baseline(项目的第一行文字的基线对齐) | stretch
6. align-content：确定容器中存在多行情况下，在交叉轴上，行间对齐方式。默认值为 stretch，如果项目只有一根轴线，那么该属性将不起作用 flex-start | flex-end | center | space-between | space-around | stretch
  - 当 flex-wrap 设置为 nowrap 的时候，容器仅存在一根轴线，因为项目不会换行，就不会产生多条轴线。
  - 当 flex-wrap 设置为 wrap 的时候，容器可能会出现多条轴线，这时候你就需要去设置多条轴线之间的对齐方式了。




#### 3.2 flex item属性
有六种属性可运用在 item 项目上：
1. order：项目在容器中的排列顺序，数值越小，排列越靠前，默认值为 0，可为负数
2. flex-basis：在分配多余空间之前，项目占据的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间，默认为 auto，即项目本来的大小, 这时候 item 的宽高取决于 width 或 height 的值。
  - 当主轴为水平方向的时候，当设置了 flex-basis，项目的宽度设置值会失效，flex-basis 需要跟 flex-grow 和 flex-shrink 配合使用才能发挥效果。
3. flex-grow：项目的放大比例，默认值为 0，即如果存在剩余空间，也不放大。
当所有的项目都以 flex-basis 的值进行排列后，仍有剩余空间，那么这时候 flex-grow 就会发挥作用了。
4. flex-shrink：项目的缩小比例，默认值为 1，即如果空间不足，该项目将缩小，负值对该属性无效。
5. flex：flex-grow, flex-shrink 和 flex-basis 的简写，默认值是 0 1 auto。
有关快捷值：auto (1 1 auto) 和 none (0 0 auto)
6. align-self：允许单个项目有与其他项目不一样的对齐方式，默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。auto | flex-start | flex-end | center | baseline | stretch




#### 3.3 flex 简写
*公式：*
- x 非负时，flex: x → flex: x 1 0%
- x 为长度(px)或百分比时，flex: x → flex: 1 1 x
- x 和 y 都非负时，flex: x y → flex: x y 0%
- x 非负数字、y 是一个长度或百分比时，flex: x y → flex: x 1 y

*举例：*
当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0%，如下是等同的：

```css
.item {flex: 1;}
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

当 flex 取值为 0 时，对应的三个值分别为 0 1 0%：

```css
.item {flex: 0;}
.item {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

当 flex 取值为一个长度或百分比，则视为 flex-basis 值，flex-grow 取 1，flex-shrink 取 1，有如下等同情况（注意 0% 是一个百分比而不是一个非负数字）：

```css
.item-1 {flex: 0%;}
.item-1 {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}

.item-2 {flex: 24px;}
.item-2 {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 24px;
}
```

当 flex 取值为两个非负数字，则分别视为 flex-grow 和 flex-shrink 的值，flex-basis 取 0%，如下是等同的：

```css
.item {flex: 2 3;}
.item {
  flex-grow: 2;
  flex-shrink: 3;
  flex-basis: 0%;
}
```

当 flex 取值为一个非负数字和一个长度或百分比，则分别视为 flex-grow 和 flex-basis 的值，flex-shrink 取 1，如下是等同的：

```css
.item {flex: 11 32px;}
.item {
  flex-grow: 11;
  flex-shrink: 1;
  flex-basis: 32px;
}
```

grow 和 shrink 是一对双胞胎，grow 表示伸张因子，shrink 表示是收缩因子。shrink 在 flex 容器下的子元素的宽度总和比容器小的时候起作用。 grow 定义了子元素的尺寸增长因子，容器中除去子元素之和剩下的尺寸会按照各个子元素的 grow 值进行平分加大各个子元素上。



#### 3.4 flex-wrap、flex-shrink、flex-grow的关系
容器的 flex-wrap 与子项的 flex-shrink、flex-grow 之间的关系
1. 当 flex-wrap 为 wrap | wrap-reverse，且子项宽度和不及父容器宽度时，flex-grow 会起作用，子项会根据 flex-grow 设定的值放大（为0的项不放大）
2. 当 flex-wrap 为 wrap | wrap-reverse，且子项宽度和超过父容器宽度时，首先一定会换行，换行后，每一行的右端都可能会有剩余空间（最后一行包含的子项可能比前几行少，所以剩余空间可能会更大），这时 flex-grow 会起作用，若当前行所有子项的 flex-grow 都为0，则剩余空间保留，若当前行存在一个子项的 flex-grow 不为0，则剩余空间会被 flex-grow 不为0的子项占据
3. 当 flex-wrap 为 nowrap，且子项宽度和不及父容器宽度时，flex-grow 会起作用，子项会根据 flex-grow 设定的值放大（为0的项不放大）
4. 当 flex-wrap 为 nowrap，且子项宽度和超过父容器宽度时，flex-shrink 会起作用，子项会根据 flex-shrink 设定的值进行缩小（为0的项不缩小）。但这里有一个较为特殊情况，就是当这一行所有子项 flex-shrink 都为0时，也就是说所有的子项都不能缩小，就会出现讨厌的横向滚动条
5. 总结上面四点，可以看出不管在什么情况下，在同一时间，flex-shrink 和 flex-grow 只有一个能起作用，这其中的道理细想起来也很浅显：空间足够时，flex-grow 就有发挥的余地，而空间不足时，flex-shrink 就能起作用。当然，flex-wrap 的值为 wrap | wrap-reverse 时，表明可以换行，既然可以换行，一般情况下空间就总是足够的，flex-shrink 当然就不会起作用



#### 3.5 flex宽度计算
```html
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
</div>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  .container {
    width: 600px;
    height: 300px;
    display: flex;
  }
  .left {
    flex: 1 2 500px;
    background: red;
  }
  .right {
    flex: 2 1 400px;
    background: blue;
  }
</style>
```

```
子元素的 flex-shrink 的值分别为 2，1
溢出：500+400 - 600 = 300。
总权重为 2 * 500+ 1 * 400 = 1400
两个元素分别收缩：
300 * 2(flex-shrink) * 500(width) / 1400= 214.28
300 * 1(flex-shrink) * 400(width) / 1400= 85.72
三个元素的最终宽度分别为：
500 - 214.28 = 285.72
400 - 85.72 = 314.28
```

收缩：子项宽度 - 移除宽度 * 子项收缩**权重比例**（自身宽度 * shrink / 总权重）
拉伸与收缩算法不一样：子项宽度 + 剩余宽度 * 子项拉伸比例






### 5. 移动端适配
#### 5.1 meta-viewport适配
```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, minimun-scale=1.0, maximum-scale=1.0, user-scalable=no"
>
```
其中 device-width 意思是设备宽度
- width：属性控制视口的宽度，可以设置具体的宽度如：`width=700`，但是一般这么使用，都是使用 `width=device-width`
- inital-scale：页面初始缩放值，默认为 1；
- maximum-scale：允许用户缩放到的最大比例。
- minimum-scale：允许用户缩放到的最小比例。
- user-scalable：用户是否可以手动缩放。

为了能在移动设备上正常显示那些传统的为桌面浏览器设计的网站，移动设备上的浏览器都会把自己默认的viewport设为980px或1024px（也可能是其它值，这个是由设备自己决定的），这样做是因为许多页面没有做移动端优化，在小窗口渲染时会乱掉（或看起来乱）。所以，这种虚拟视口是一种让未做移动端优化的网站在窄屏设备上看起来更好的办法。




#### 5.2 媒体查询
*`@media`*查询针对不同的屏幕尺寸设置不同的样式，当要设置响应式页面时，还是很有用的。当你重置浏览器大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。




#### 5.3 em, rem, vw, vh
em和rem都是相对单位长度
- em是相对父级font-size变化的，如果嵌套过深，计算会比较繁琐，因此一般大范围不适用，小范围可结合px单位使用。
- rem是相对html根元素font-size变化的，没有em的繁琐计算，配合动态计算rem的js代码，rem在移动端布局中很受欢迎
```js
(function(win) {
	var doc = win.document;
	var docEl = doc.documentElement;
	var tid;
	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;        
		if (width >=750) width = 750;
		if(width<=320) width=320;
		var rem = width / 7.5;
		docEl.style.fontSize = rem + 'px';		
	}
	win.addEventListener('resize', function() {
		clearTimeout(tid);
		tid = setTimeout(refreshRem, 300);
	}, false);
	refreshRem();
})(window);
```




### 参考资料
- [Flex 排版源码分析](https://juejin.cn/post/6844903591149305864)
- [移动端三种适配方案](https://juejin.cn/post/6844903817503326216)

