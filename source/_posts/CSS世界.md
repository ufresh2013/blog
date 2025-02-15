---
title: 《CSS世界》笔记
date: 2022-02-12 16:35:16
---
# 第三章 流、元素与基本内尺寸
## 块级元素
块级元素和display:block 的元素”不是一个概念。
`<li>`的 display值是list-item
`<table>`默认的 display 值是 table
但是它们都是块级元素，都符合块级元素的特征，也就是一个水平流上只能单独显示一个元素，多个块级元素则换行显示。


## inline-block
每个元素有两个盒子，外在盒子和内在盒子。
**外在盒子**负责元素是可以一行显示，还是只能换行显示；
**内在盒子**负责宽高、内容呈现什么的，也叫容器盒子。

block: block-block
table: block-table
inline-block: inline-block，既能和图文一行显示，又能直接设置width/height。


## 外部尺寸width:auto
盒子分内在盒子和外在盒子，同样地，尺寸也分**内在尺寸**和**外在尺寸**。内在尺寸由内部元素决定，外部尺寸由元素width属性决定。

width的默认值是auto，指的是外在尺寸。
width: auto会有怎样的表现？
- 充分利用可用空间，`<div>``<p>`这些元素的宽度都会默认100%于父级容器。

### 因此很多时候其实不用设置width: 100%
块级元素一旦设置了宽度，margin/border/padding/content自动分配水平空间的流动性就丢失了。
```css
/* good */
.nav a {
  display: block;
  margin: 0 10px; 
  padding: 9px 10px; 
}

/* bad*/
.nav { 
 width: 240px; 
} 
.nav a { 
 display: block; 
 width: 200px; 
 margin: 0 10px; 
 padding: 10px 10px; 
 ... 
}
```

- 除非有明确的设置，元素都不会主动超过父级容器宽度的。如：width设置，内部连续很长的英文数字，内联元素被设置为`white-space:nowrap`




## 内部尺寸的3种表现形式
### 1. 包裹性
按钮文字越多，`.content元素`宽度越宽（内部尺寸特性）。但如果文字足够多，则会在容器最大宽度处自动换行。
http://demo.cssworld.cn/3/2-5.php
```html
<style>
.box {
  text-align: center;
  width: 240px;
}
.content {
  display: inline-block;
  text-align: left;
}
</style>

<div class="box">
  <p class="content">内容</p>
<div>
```


### 2. 首选最小宽度
Q：假设.box的width: 0， .content的宽度会是0吗？可以看到字体吗？
A：宽度不会为0，可以看到字体，此时.content的宽度为“首选最小宽度”。汉字最小宽度 or 连续的英文字符单元。
```html
<style>
.box {
  width: 0
}
</style>
<div class="box">
  <p class="content">文字内容</p>
</div>
```


## box-sizing
content box, padding box(仅fireFox曾经支持), border box, margin box(不支持)
width和height作用于哪个盒子上。

### 如何评价* { box-sizing: border-box }?
- 通配符*产生了没必要的消耗。
- border-box不能解决所有问题，推荐宽度分离，外面嵌套<div>，模拟border和padding
- 上面宽度分离的方法有局限性，如无法focus input, textarea的边框，这个时候只能使用border-box，下面的css重置更加合理。
```css
input, textarea, img, video, object { 
 box-sizing: border-box; 
}
```

## height: auto
某小白想要在页面插入一个div，然后满屏显示背景图，写下了如下CSS，但他会发现这个div的高度永远是0。
```css
div {
  width: 100%; /* 这是多余的 */
  height: 100%; /* 这是无效的 */
  background: url('bg.jpg');
}
```
父级没有具体高度值的时候，`height: auto`会无效。如何让元素显示`height: 100%`的效果——使用显示的高度值，或可生效的百分比高度，或者使用绝对定位
```css
html, body {
  height: 100%;
}

div {
  height: 100vh;
}

div {
  height: 100%;
  position: absolute;
}
```
`height: auto`使用`transition: height 1s`不会起作用，但是可以用`max-height`来模拟


## overflow
按照从上而下、自外而内的顺序渲染 DOM 内容。套用本例就是，
先渲染父元素，后渲染子元素，是有先后顺序的。因此，当渲染到父元素的时候，子元素的
width:100%并没有渲染，宽度就是图片加文字内容的宽度；等渲染到文字这个子元素的时候，
父元素宽度已经固定，此时的 width:100%就是已经固定好的父元素的宽度。宽度不够怎么
办？溢出就好了，overflow 属性就是为此而生的。



## 任意高度元素的展开收起动画
height的默认值是auto，从0到auto是无法计算的，因此无法形成过渡的动画效果。但是很多时候，展开的元素内容是动态的，高度是不固定的，不能定死`height`。这个时候可以用`max-height`，只要保证`max-height`要比实际内容的高度达即可。
（但是要注意，max-height值太大，收起的时候会有延迟的效果）
```css
.element {
  max-height: 0;
  overflow: hidden;
  transition: max-height .25s;
}
.element.active {
  max-height: 666px; /* 一个足够大的max-height */
}
```


## 内联元素
内联元素的内联，特指“外在盒子”，`inline`, `inline-block`, `inline-table`都是内联元素。内联元素的典型特征就是可以和文字在一行显示。

## 幽灵空白节点


# 4. 盒尺寸四大家族
## 4.1 content 替换元素
通过修改某个html属性值就可以修改元素呈现内容的元素，被称为**替换元素**，如`<img>`, `<object>`, `<video>`, `<iframe>`, `<input>`, `<textarea>`。

替换元素的尺寸计算规则：CSS尺寸 > HTML尺寸 > 固有尺寸。如果固有尺寸含有固定的宽高比例，同时我们仅设置了宽度或高度，那么元素会等比显示。
- 固有尺寸：内容原本的尺寸
- HTML尺寸：HTML原生属性，如下
- CSS尺寸: width, height, max-width/min-width设置的尺寸
```html
<img width="300" height="100"> 
<input type="file" size="30"> 
<textarea cols="20" rows="5></textarea>
```

## 4.2 如何理解替换元素 content属性
在chrome浏览器中，所有的元素都支持content属性。没有src属性的<img>是非替换元素，而加上了content属性，则变成了替换元素。
```css
/* 没有设置src的img元素都显示 1.jpg */
img:not([src]) {
  content: url('1.jpg')
}
```
通过修改content，可以不用js就实现img内容的替换。但是要注意，content属性只改变视觉呈现，当我们保存这张图片时，保存的还是原本src对应的图片。
```css
img:hover {
  content: url('2.jpg')
}
```
替换元素和非替换元素的距离有多远？
就是src或content的这一点距离。但是`content属性`生成的文本是无法选中、无法复制的，这对可访问性和SEO都很不友好，`content属性`只能用来生成一些无关紧要的内容，如装饰性图形或序号。

<br/>

### 4.3 content内容生成技术
`content`属性几乎都用在`:before/:after`这里两个微元素中，利用它们来生成辅助元素，实现图形效果。

### 4.3.1 清除浮动
```css
.element:before {
  content: '';
  display: block;
  clear: both;
}
```

### 4.3.2 字体图标
```css
@font-face { 
 font-family: "myico"; 
 src: url("/fonts/4/myico.eot"); 
 src: url("/fonts/4/myico.eot#iefix") format("embedded-opentype"), 
 url("/fonts/4/myico.ttf") format("truetype"), 
 url("/fonts/4/myico.woff") format("woff"); 
}
.icon-home:before {
  font-size: 16px;
  font-family: 'myico';
  content: '家'
}
```

### 4.3.3 根据img标签上 alt属性生成图片描述信息
```css
img::after { 
  content: attr(alt);
  /* 
  自定义的HTML属性 也可以
  content: attr(data-title);
  */
  position: absolute;
  bottom: 0; 
  width: 100%; 
  background-color: rgba(0,0,0,.5); 
  transform: translateY(100%); 
  transition: transform .2s; 
} 
img:hover::after { 
  /* hover时 alt信息显示 */ 
  transform: translateY(0); 
}
```

### 4.3.4 css实现动态的加载中..
```css
正在加载中<dot>...</dot> 
dot { 
 display: inline-block; 
 height: 1em; 
 line-height: 1; 
 text-align: left; 
 vertical-align: -.25em; 
 overflow: hidden; 
} 
dot::before { 
 display: block; 
 content: '...\A..\A.'; 
 white-space: pre-wrap; 
 animation: dot 3s infinite step-start both; 
} 

@keyframes dot { 
 33% { transform: translateY(-2em); } 
 66% { transform: translateY(-1em); } 
} 
```


## 4.2 padding
### 4.2.1 内联元素padding层叠效果
内联元素的padding在垂直方向，不影响其他元素布局，而出现层叠效果。

- 高度不那么高的垂直分隔符
```css
a + a:before { 
 content: ""; 
 font-size: 0; 
 padding: 10px 3px 1px; 
 margin-left: 6px; 
 border-left: 1px solid gray; 
} 
<a href="">登录</a><a href="">注册</a>
```

- 通过地址栏的hash值和页面HTML中值一样的元素发生锚点定位。我们希望定位的元素，离顶部有一段距离。可以这样，既不影响原来的布局，又下移了50个像素。
```css
<h3><span id="hash">标题</span></h3> 
h3 { 
 line-height: 30px; 
 font-size: 14px; 
} 
h3 > span { 
 padding-top: 58px; 
}
```


### 4.2.2 padding的百分比值
padding 和 margin 百分比值无论是水平方向还是垂直方向均是相对于宽度计算的！
- 实现一个正方形
```css
div {
  padding: 50%;
}
div {
  padding: 25% 50%; /* 宽高2:1的矩形 */
}
```

- 实现一个宽高比固定为5:1的头图效果
```css
.box { 
 padding: 10% 50%; 
 position: relative; 
} 
.box > img { 
 position: absolute; 
 width: 100%;
 height: 100%; 
 left: 0;
 top: 0; 
}
```

- 实现“三道杠”小图标
```css
.icon-menu { 
  display: inline-block; 
  width: 140px; height: 10px; 
  padding: 35px 0; 
  border-top: 10px solid; 
  border-bottom: 10px solid; 
  background-color: currentColor; 
  background-clip: content-box; 
}
```

- 实现radio双层原点图形效果
```css
.icon-dot { 
  display: inline-block; 
  width: 100px; height: 100px; 
  padding: 10px; 
  border: 10px solid; 
  border-radius: 50%; 
  background-color: currentColor; 
  background-clip: content-box; 
}
```



## 4.3 margin
### 4.3.1 margin负值
- 实现一行有3个元素，元素中间有20px的间隙，左右两端没有间隙
通过给父容器添加`margin: -20px`，增加容器的可用宽度
```css
ul {
  margin-right: -20px;
}

li {
  float: left;
  width: 100px;
  margin-right: 20px;
}
```

- 实现左右等高布局，有可能左侧内容多，有可能右侧内容多
table-cell实现等高布局

### 4.3.2 margin合并
块级元素的上外边距（margin-top）与下外边距（margin-bottom）有时会合并为单个外边距，这样的现象称为“margin 合并”。**注意，这只发生在块级元素的垂直方向**，不包括浮动和绝对定位。

margin合并的3种场景
- 相邻兄弟元素
- 父级和第一个/最后一个子元素
- 空块级元素的margin合并
```css
/* <div>元素高度只有10px, .son的margin-top和margin-bottom合并在一起了 */
.father { overflow: hidden; } 
.son { margin: 10px 0; } 
<div class="father"> 
 <div class="son"></div> 
</div>
```

如果不希望margin合并，可以进行如下操作
- 设置垂直方向的 border
- 设置垂直方向的 padding
- 里面添加内联元素（直接 Space 键空格是没用的）
- 设置 height 或者 min-height。

margin合并的计算规则
- 正正取大值，正负值相加，负负最负值


### 4.3.3 margin: auto
- 如果一侧定值，一侧 auto，则 auto 为剩余空间大小。
- 如果两侧均是 auto，则平分剩余空间。
```css
/* 实现块级元素的右对齐 */
.son {
  width: 200px;
  margin-left: auto;
}
```

但为什么`margin: auto`无法垂直居中？
触发 margin:auto 计算有一个前提条件，元素在对应方向可以自动填充宽高。把.son 元素的 height:100px 去掉，.son 的高度会自动和父元素等高变成 200px 吗？显然不会！因此无法垂直居中。

但是我们把son设置为绝对定位元素，son的尺寸会自动填充父级元素的可用尺寸。

```css
/* 绝对定位元素margin: auto实现垂直居中 */
.father {
  width: 300px; height:150px; 
  position: relative;
}
.son { 
 position: absolute; 
 top: 0; right: 0; bottom: 0; left: 0; 
 width: 200px; height: 100px; 
 margin: auto; 
}
```

### 4.4 border
- border-width不支持百分比
- border-color默认颜色是color的色值
```css
/*上传图片的带+虚线框按钮，hover直接改变color色值*/
.add { 
 color: #ccc; 
 border: 2px dashed; 
} 
.add:before { 
 border-top: 10px solid; 
} 
.add:after { 
 border-left: 10px solid; 
} 
/* hover 变色 */ 
.add:hover { 
 color: blue;
}
```
- border-color: transparent 增加点击区域大小
- 图形绘制
```css
/* 绘制三角形 */
div { 
  width: 0; 
  border: 10px solid; 
  border-color: #f30 transparent transparent; 
}
/* 狭长的三角形*/
div { 
  width: 0; 
  border-width: 10px 20px; 
  border-style: solid; 
  border-color: #f30 transparent transparent; 
}
/* 梯形 */
div { 
  width: 10px; height: 10px; 
  border: 10px solid; 
  border-color: #f30 transparent transparent; 
}
```


## 5. 内联元素与流
内联元素在垂直方向的排版和对齐，都基本离不开基线 baseline

### 5.1  line-height
两条基线之间的间距
对于纯文本元素，line-height直接决定了最终高度。而替换内联元素的高度不受line-height影像。

- x-height
字母x的高度

- 实现单行文本元素“近似”垂直居中
```css
p {
  line-height: 100px;
}
```

- 实现多行文本元素“近似”垂直居中


### 5.2 vertical-align
- vertical-align: baseline
默认是基线，基线就是字母x的下边缘线

- vertical-align: middle
`vertical-align: middle`指的是基线往上1/2 x-height的高度
<img src="1.png" />

- 行距
行距 = 行高 - em-box = line-height - font-size



### css重置推荐
```css
/* 不建议全局 * { box-sizing: border-box; } */
input, textarea, img, video, object { 
  box-sizing: border-box; 
}
img {
  display: inline-block;
}
```