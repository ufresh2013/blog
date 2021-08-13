---
title: CSS文档
date: 2018-10-06 11:12:55
tags:
- CSS
category:
- CSS
---
### 1. 基础
<img src="1.svg" style="padding-top:20px; max-width:500px">
#### 1.1 浏览器样式前缀
浏览器分类|浏览器|私有属性的前缀
---|:--:|---:
Gecko引擎内核的浏览器 | Mozilla(Firefox) | -moz-
Presto引擎内核的浏览器| Opera            | -o-
KHTML引擎内核的浏览器 | Konqueror        | -khtml-
Trident引擎内核的浏览器 | Internet Explorer | -ms- 
Webkit             | Chrome, Safari   | -webkit-

<br/>

#### 1.2 选择器
样式系统从关键选择器开始匹配，然后左移查找规则选择器的祖先元素。只要选择器的子树一直在工作，样式系统就会持续左移，直到和规则匹配，或者是因为不匹配而放弃该规则。

试想一下，如果采用从左至右的方式读取CSS规则，那么大多数规则读到最后（最右）才会发现是不匹配的，这样做会费时耗能，最后有很多都是无用的；

而如果采取*从右向左的方式，那么只要发现最右边选择器不匹配，就可以直接舍弃了，避免了许多无效匹配。*

- 属性选择器
```
<div data-quantity="1kg" data-vegetable="not spicy like chili"></div>

[attr]       具有attr属性的元素
[attr=val]   attr属性值为val的元素
[attr~=]     attr属性值包含val的元素

[attr|=val]  attr属性值是 val 或值以 val- 开头的元素
[attr^=val]  attr属性值以 val 开头的元素
[attr$=val]  attr属性值以 val 结尾的元素
[attr*=val]  attr属性值包含 val 的元素
```

- 伪类选择器
一个CSS伪类 是一个以冒号(:)作为前缀，被添加到一个选择器末尾的关键字。当你希望样式在特定状态下才呈现特定样式，你可以在该元素选择器后加上对应的伪类。

伪类选择器||
---|:--:
:active         | 被激活的元素，通常匹配tab交互。这个样式可能会被其它伪类覆盖。<br/>链接伪类css顺序`:link - :visited - :hover - :active`
:visited        | 被访问过的链接
:hover          | 光标悬停
:focus          | 获得焦点的元素。用户点击、触摸元素，或通过键盘tab键选择它时会触发。
:link           | `a:link`选中元素当中的链接
:checked        | 处于选中状态的radio, checkbox, 或select中的option元素
:disabled       | 任何被禁用的元素
:enabled        | 任何启用的元素
:invalid        | `<input>`或其它`<form>元素`内容未通过验证 `<input type="email" />`
:valid          | `<input>`或其它`<form>元素`内容通过验证 
:in-range       | `<input>`当前值处于min和max范围内
:out-of-range   | `<input>`当前值处于min和max范围外
:read-only      | 元素不可被用户编辑的状态
:read-wirte     | 可被用户编辑
:required       | 拥有required属性的`<input><select><textarea>`元素
:optional       | 没有required属性的`<input><select><textarea>`元素
:empty          | 没有子元素的元素(子元素可以是元素节点、文本、空格)
:first-child    | 一组兄弟元素中的第一个元素 (:first-of-type)
:last-child     | 一组兄弟元素中的最后一个元素
:not(selector)  | `p :not(div) :not(.fancy)` 非`<div>`或类名不是`.fancy`的`<p>`
:nth-child(an+b)| 选择结果为第(an+b)个元素的集合(n=0,1,2...)<br/> `tr:nth-child(2n+1/2n) 奇数/偶数行；span:nth-child(-n+3) 前三个元素`
:root           | 匹配文档树的根元素，表示`<html>`元素
:target         | ID与当前URL片段匹配，如 `http://www.example.com#section2`; <br/>`<section id="section2"></section>; :target{color:red}`
:lang()         | 基于元素语言来匹配页面元素
@page:first     | 打印文档时，第一页的样式 `@page:first{ margin-left: 50% }`

** :first-child不生效：使用:first-child伪类时一定要保证前面没有兄弟节点。**

- 伪元素 

伪元素||
---|:--:
::after         | 创建一个伪元素，其将成为元素的最后一个子元素，通常会配合content属性来为该元素添加装饰内容。
::before        | 创建一个伪元素，其将成为元素的第一个子元素，通常会配合content属性来为该元素添加装饰内容。
::first-letter  | 选中该块级元素第一行的第一个字母，并且文字所处的行之前没有其他内容(如图片或表格)
::first-line    | 选中该块级元素的第一行应用样式
::selection     | 应用于文档中被用户高亮的部分（使用鼠标或其他设备选中的部分）

- 组合器

组合器||
---|:--:
A,B        | 匹配满足A或B的任意元素
A B        | 匹配B元素，B是A的后代节点
A > B      | 匹配B元素，B是A的直接子节点
A + B      | 匹配B元素，AB有相同的父节点，并且B紧跟在A的后面
A ~ B      | 匹配B元素，AB有相同的父节点，B在A之后，但不一定紧挨着A

<br/>
#### 1.3 值和单位
单位||
---|:--:
px      | 绝对单位
em      | 1em与当前元素的字体大小相同。em单位会继承父元素的字体大小**(最常用的相对单位)**
rem     | 与em相似，但它总是等于默认基础字体大小的尺寸，继承将不起作用
vw,vh   | 视口宽度的1/100和视口高度的1/100(不被广泛支持)
ex,ch   | 小写x的高度和数字0的宽度(不被广泛支持)

*无单位的值*: 0, line-height: 1.8, 动画的数值, 百分比, 颜色

<br/>
#### 1.4 层叠和继承
- !important > 行内样式-1000 > id选择器-100 > 类选择器/属性选择器/伪类-10 > 元素选择器/伪元素-1
- 后面的规则 > 前面的规则
- 继承: inherit - 与父元素一样; initial - 与浏览器默认样式一样; unset - 重置为自然值; 

<br/>

#### 1.5 盒模型
每个元素被表示为一个矩形的方框，框的内容、内边距、边界、外边距一层层构建起来。浏览器渲染网页布局时，会算出每个框每一层要用什么样式，以及框放在哪里。
盒子属性: width, height, padding, margin, border, min-width, max-width, min-height, max-height

*`box-sizing`*
- content-box
W3C标准盒模型: element width = border + padding + content width
<img src="1.png">

- border-box
IE盒模型: element width = content width(内容宽度包含了content width，border, padding, 建议使用)
<img src="2.png">


*`overflow`*
当你设置了一个框的大小，允许的大小可能不适合放置内容，这种情况下内容会从盒子溢流。使用overflow，或overflow-x,overflow-y来控制这种情况。
auto: &nbsp;&nbsp;&nbsp; 溢流的内容被隐藏，出现滚动条来查看
hidden: 溢流的内容被隐藏
visible: 溢流的内容被显示在盒子的外边（这是默认行为）
scroll: 不管内容有没有溢出容器，都会显示滚动条
no-display: 内容溢出容器时，不显示元素，相当于添加了display:none
no-content: 内容溢出容器时，不显示内容，相当于添加了visibility:hidden

*`display`*
block:  内容独占一行，可以设置宽高
inline: 与周围的行内元素出现在同一行，设置宽高无效，设置padding,margin,border会更新周围文字的位置
inline-block: 不会独占一行，能设置宽高

<br/>

### 2. 文字
*`文字`*
color, font-family, font-size, line-height, letter-spacing(字母间距), word-spacing(单词间距)
font-style  : normal, italic斜体, oblique
font-weight : normal, bold, lighter, bolder
text-transform : none, uppercase, lowercase, capitalize, full-width 
text-decoration: none, underline, overline, line-through
text-shadow: 4px 4px 5px red (水平偏移, 垂直偏移, 模糊半径, 颜色，逗号分隔多个阴影值可用于同一文本)
text-align: left, right, center, justify(使文本展开)
@font-face: 使用字体文件
```
@font-face {
  font-family: 'ciclefina';
  src: url('fonts/cicle_fina-webfont.eot');
  src: url('fonts/cicle_fina-webfont.eot?#iefix') format('embedded-opentype'),
         url('fonts/cicle_fina-webfont.woff2') format('woff2'),
         url('fonts/cicle_fina-webfont.woff') format('woff'),
         url('fonts/cicle_fina-webfont.ttf') format('truetype'),
         url('fonts/cicle_fina-webfont.svg#ciclefina') format('svg');
  font-weight: normal;
  font-style: normal;
}
```

*`文本布局`*
text-indent
**text-overflow**: 溢出内容显示符号。clip 被剪切 / ellipsis 省略号
**white-space**: 处理元素中的空白。 normal 连续的空白符会被合并,必要时会换行 / pre / nowrap / pre-wrap 连续的空白符会被保留，必要时会换行 / pre-line
**word-break**: 指定单词内断行。normal 默认的断行规则，中文到边界上的汉字换行， / break-all 可在任意字符间断行 / keep-all
**word-wrap**: 当一个不能被分开的字符串太长而不能填充其包裹盒时，为防止溢出，是否这样的单词中断换行。 normal 单词结束处换行 / break-word 强制切割换行
**text-align-last**: 最后一行文本的对齐规则。 auto / start / end / left / right / center / justify


*`列表 - ul`*
**list-style-type** : 列表符号的类型。disc 实心原点 / circle 空心原点 / square 实心方块 / decimal 数字1,2 / decimal-leading-zero 数字01,02 / lower-roman  i, ii / upper-roman I, II / lower-greek α, β, γ / lower-alpha a,b,c / upper-alpha A,B,C
**list-stype-position** : 列表符号在盒内还是盒外。inside / outside
**list-style-image**: url('1.png')


<br/>
### 3. 区块
*`背景`*
默认情况下，背景会延伸到边框所在的区域下层。
background-color
**background-image**: url('1.png') / 渐变 linear-gradient(渐变的方向, 开始的颜色, 结尾的颜色) to bottom, to right, to bottom right
**background-repeat**: 指定背景图像如何重复。 no-repeat / repeat-x / repeat-y / repeat 
**background-position**: 指定图像(x,y)坐标. 200px 25px / 10% 20% / 使用关键字 [left,center,right], [top,center,bottom]
**background-attachment**: 设置元素背景图片是否固定或者随着页面的其余部分滚动，一般运用在html或body上 scroll / fixed
**background-size**: 调整背景图像大小。auto 图片原始宽高 / `<length><percentage>` 具体宽高 / cover 完全覆盖背景区，图像比例不变，图片部分看不见 / contain 单边覆盖背景区，图像比例不变，背景区部分空白

*`边框`*
border, border-width, border-color, border-radius, border-image
border-style: none/ hidden / solid / dashed / dotted / double / groove / ridge / inset / outset / inherit

*`表格`*
table-layout: fixed, 创建可预测的表布局，在标题设置width设置列的宽度
border-collapse: collapse, 使表元素边框合并

*`高级区块效果`*
box-shadow: 5px 5px 5px rgba(0,0,0,.7) 水平偏移量,垂直偏移量,模糊半径,颜色
box-shadow: inset 5px 5px 5px rgba(0,0,0,.7) **inset** 定义内部阴影
background-blend-mode: 将单个元素的多重背景图片和背景颜色设置混合在一起
mix-blend-mode: 将一个元素与它覆盖的那些元素各自设置的背景和内容混合在一起。normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity


<br/>
### 4. 排版
正常布局流: position:static，是指在不对页面进行任何布局控制时，浏览器默认的HTML布局方式。
<br/>

#### 4.1 浮动
float:left/right/none/inherit。浮动元素会脱离正常的文档布局流，并吸附到其父容器的左边(float:left)。在正常布局中位于该浮动元素之下的内容，此时会围绕着浮动元素，填满其右侧的空间。
```
// 首字母下沉
p::first-letter{
  font-size: 3rem;
  float: left;
}
```

*清除浮动*: 所有在浮动下面的自身不浮动的内容都将围绕浮动元素进行包装。如果没有处理这些元素，就会变得很糟糕。`{ clear: both }`当把这个应用到一个元素时，意味着“此处停止浮动”。
<br/>
#### 4.2 定位
绝对定位(Static positioning)：元素在文档布局流的默认位置
相对定位(Relative positioning): 在正常文档流中的位置进行相对移动
绝对定位(Absolute positioning): 将元素完全从页面的正常布局流中移出。元素相对最近被定位的祖先元素固定。
固定定位(Fixed positioning): 将元素完全从页面的正常布局流中移出。将一个元素相对浏览器视口固定。
<br/>

#### 4.3 flex布局
支持浏览器 Chrome 21+, Opera 12.1+, Firefox 22+, Safari 6.1+, IE 10+。

采用flex布局的元素，称为flex容器。它的所有子元素自动成为容器成员，子元素的float, clear和vertical-align属性将失效。
```
.box{
  display: flex;
  display: inline-flex;   // 行内元素也可以使用flex
  display: -webkit-flex;  // 兼容Safari
}
```
容器存在两根轴：水平的主轴(main axis)和垂直的交叉轴(cross axis)。主轴的开始位置叫`main start`， 结束位置叫`main end`， 交叉轴开始位置叫`cross start`， 结束位置叫`cross end`。
<img src="4.png" style="max-width:500px">


<br/>
##### 4.3.1 容器的属性
- flex-direction: 决定主轴的方向
```
.box{
  flex-direction: row | row-reverse | column | column-reverse 
}
// row(默认值)     主轴为水平方向，起点在左端
// row-reverse    主轴为水平方向，起点在右端
// column         主轴为垂直方向，起点在上方
// column-reverse 主轴为垂直防线，起点在下方
```
<img src="5.png" style="max-width:500px">

<br/>
- flex-wrap: 如果一条轴线排不下，如何换行
```
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
// nowrap       不换行
// wrap         换行，第一行在上方
// wrap-reverse 换行，第一行在下方
```
<img src="6.png" style="max-width:500px">
<img src="7.png" style="max-width:500px">
<img src="8.jpg" style="max-width:500px">
<br/>

- flex-flow: 是flex-direction属性和flex-wrap属性的简写模式，默认值为row nowrap。

- justify-content: 项目在主轴上的对齐方式
```
.box{
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
// flex-start(默认值)  左对齐
// flex-end           右对齐
// center             居中
// space-between      两端对齐，项目之间的间隔都相等
// space-around       每个项目两侧都相等
```
<img src="9.png" style="max-width:500px">

<br/>
- align-items: 项目在交叉轴上如何对齐
```
.box{
  align-items: flex-start | flex-end | center | baseline | stretch;
}
// flex-start     交叉轴的起点对齐
// flex-end       交叉轴的终点对齐
// center         交叉轴的中点对齐
// baseline       项目第一行文字的基线对齐
// stretch(默认值) 如果项目未设置高度或为auto，将占满整个容器的高度
```
<img src="10.png" style="max-width:500px">

- align-content: 定义了多根轴线的对齐方式。

<br/>
##### 4.3.2 项目的属性
- order: 定义项目的排列顺序。数值越小，排列越靠前，默认为0.
```
.item{
  order: <integer>
}
```
<img src="11.png" style="max-width:500px">
<br/>

- flex-grow: 定义项目的放大比例，默认为0。如果项目的`flex-grow`属性都为1，则它们将等分剩余空间。如果一个项目的`flex-grow`属性为2，其余为1，则前者占据的剩余空间将比其他项多一倍。
```
.item{
  flex-grow: <number>;
}
```
<img src="12.png" style="max-width:500px">

- flex-shrink: 定义了项目的缩小比例，默认为1。如果空间不足，项目将缩小。如果项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为0，其他项目为都为1，空间不足时，前者不缩小。
<img src="13.jpg" style="padding-top:20px;max-width:500px">
<br>
- flex-basis: 定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

- flex: 是`flex-grow, flex-shrink 和 flex-basis`的简写，默认值为`0 1 auto`。 

- align-self: 允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。
```
.item{
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

#### 4.4 flex布局实例
- 网格布局，平均分布
{% raw %}
<style>
.box{
  width:100%;
  height:50px;
  display:flex;
  margin-top:10px;
  background:#f6f6f6;
}
.item{
  background:#fff;
  margin:10px;
  flex:1;
}
</style>
<div class="box">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
{% endraw %}
```
.box{
  display: flex;
}
.item{
  flex: 1;
}
<div class="box">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
```
<br/>

- 百分比布局
{% raw %}
<style>
.box{
  width:100%;
  height:50px;
  display:flex;
  margin-top:10px;
  background:#f6f6f6;
  text-align:center;
}
.item1{
  background:#fff;
  margin:10px;
  flex:0 0 25%;
}
.item2{
  background:#fff;
  margin:10px;
  flex:1;
}
</style>
<div class="box">
  <div class="item1">1/4</div>
  <div class="item2">auto</div>
</div>
{% endraw %}
```
.box{
  display:flex;
}
.item1{
  flex:0 0 25%;
}
.item2{
  flex:1;
}
```
<br/>

- 圣杯布局： 页面从上到下，分成header, body, footer。其body从左到右又分为导航，主栏，副栏。
固定的底栏：页面内容太少，无法占满一屏的高度，底栏就会抬高到页面的中间，这时可以采用该布局。
{% raw %}
<style>
.box1{
  display: flex;
  display: -ms-flexbox;
  min-height: 200px;
  flex-direction: column;
  -ms-flex-direction: column;
  margin-top: 10px;
  background:#f6f6f6;
  text-align: center;
  padding:10px;
}
.box1 div{
  background: #fff;
}
.box1 .box1-container{
  background: #f6f6f6;
}
.box1 .box1-header{
  flex:0 0 20px;
  -ms-flex: 0 0 20px;
}
.box1 .box1-footer{
  flex:0 0 20px;
  -ms-flex: 0 0 20px;
}
.box1-container{
  flex: 1;
  display:flex;
  margin: 10px 0;
}
.box1-aside{
  order: -1;
  flex: 0 0 50px;
  margin-right: 10px;
}
.box1-right-aside{
  order: 1;
  flex: 0 0 100px;
  margin-left: 10px;
}
.box1-content{
  flex: 1;
  -ms-flex: 1;
}

</style>
<div class="box1">
  <div class="box1-header">header</div>
  <div class="box1-container">
    <div class="box1-aside">aside</div>
    <div class="box1-content">content</div>
    <div class="box1-right-aside">right-aside</div>
  </div>
  </section>
  <div class="box1-footer">footer</div>
</div>
{% endraw %}
```
.app{
  display: flex;
}
.box{
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  width: 100%;
}
.header, .footer{
  flex: 1;
}
.container{
  flex: 1;
  display: flex;
}
.aside, .right-aside{
  flex: 0 0 100px;
}
.content{
  flex: 1;
}
<div class="app">
  <div class="box">
    <div class="header">header</div>
    <div class="container">
      <div class="aside">aside</div>
      <div class="content">content</div>
      <div class="right-aside">right-aside</div>
    </div>
    <div class="footer">footer</div>
  </div>
</div>
```

<br/>
- 流式布局: 每行的项目数固定，会自动分行
{% raw %}
<style>
.parent {
  width: 100%;
  height: 150px;
  background-color: #f6f6f6;
  display: flex;
  flex-flow: row wrap;
  padding: 10px;
}

.child {
  box-sizing: border-box;
  background-color: #fff;
  flex: 0 0 30%;
  height: 50px;
  margin: 10px 1.5% 0;
}
</style>
<div class="parent">
  <div class="child"></div>
  <div class="child"></div>
  <div class="child"></div>
  <div class="child"></div>
  <div class="child"></div>
</div>
{% endraw %}

  ```
  .parent {
    width: 100%;
    height: 150px;
    display: flex;
    flex-flow: row wrap;
  }

  .child {
    box-sizing: border-box;
    flex: 0 0 30%;
    height: 50px;
    margin: 10px 1.5% 0;
  }
  ```

<br/>

### 5. 渐变
- 线性渐变
{% raw %}
<style>
.line1, .line2{
  width: 100%;
  height: 8px;
  margin-top: 20px;
}
.line1{
  background-image:linear-gradient(to right, yellow, green);
}
.line2{
  background-image: linear-gradient(to left, #fff 0%, #000 50%, #fff 100%);
}
</style>
<div class="line1"></div>
<div class="line2"></div>
{% endraw %}

  ```
  // 关键字可使用to top, to top left等
  background-image: linear-gradient(to left / 90deg, orange, green);

  // 自定义渐变
  background-image: linear-gradient(to left, #fff 0%, #000 50%, #fff 100%);

  ```

- 径向渐变
{% raw %}
<style>
.gradient-block div{
  display: inline-block;
  width: 100px;
  height: 50px;
}
.block1 {
  background-image: radial-gradient(circle, yellow, green)
}
.block2{
  background-image: radial-gradient(circle at top, yellow, green)
}
.block3{
  background-image: radial-gradient(ellipse, yellow, green)
}
.block4{
  background-image: radial-gradient(100px 100px at 30px 30px, yellow, green)
}
.block5{
  background-image: radial-gradient(circle, yellow 10%, green 20%, orange 80%)
}
.block6{
  background-image: repeating-radial-gradient(yellow, green 10px, orange 20px)
}
</style>
<div class="gradient-block">
  <div class="block1"></div>
  <div class="block2"></div>
  <div class="block3"></div>
  <div class="block4"></div>
  <div class="block5"></div>
  <div class="block6"></div>
</div>

{% endraw %}
```
// 原形渐变
background-image: radial-gradient(circle, yellow, green)
background-image: radial-gradient(circle at top, yellow, green)

// 椭圆渐变
background-image: radial-gradient(ellipse, yellow, green)

// 自定义圆心和半径([minor radius] [major radius] at x y) 可以用百分比
background-image: radial-gradient(100px 100px at 30px 30px, yellow, green)

// 多色渐变
background-image: radial-gradient(circle, yellow 10%, green 50%, orange 80%)

// 重复镜像渐变
background-image: repeating-radial-gradient(yellow, green 10px, orange 20px)
```
<br/>
### 6. 变形 transform
CSS变形允许动态的控制元素，可以在屏幕周围移动它们，缩小或扩大，旋转，或结合产生复杂的动画效果。一系列的`<transform-function>`，表示一个或多个变形函数，以空格分开，代表同时对一个元素进行变形的多种属性操作。
{% raw %}
<style>
  .transform div{
    width: 100px;
    height: 50px;
    background-color: green;
    color: #fff;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 50px;
  }
  .transform1:hover{
    transform: scale(1.5) rotate(30deg)
  }
  .transform2{
    transform: rotate(30deg);
    transform-origin: 100% 100%;
  }
</style>
<div class="transform">
  <div class="transform1">hover me</div>
  <div class="transform2"></div>
</div>
{% endraw %}

```
transform: none | <transform-function> <transform-function> ..

// 基本变形
transform: translate(40px, 40px) scale(1.5) rotate(30deg)

// 指定中心点
transform-origin: 100% 100%

```

<br/>

2D transform函数 | 功能描述 |
---|:--:
translate(10px, 10px)  | 移动元素。扩展函数translateX(), translateY()
scale(1.5)             | 缩小或放大元素。扩展函数scaleX(), scaleY()
rotate(10deg)          | 旋转元素
skew(10deg)            | 让元素倾斜。扩展函数skewX(), skewY()
matrix()               | 定义矩阵变形，重新定位元素位置
**3D transform函数**    | translate3d(), translate(), scale3d(), scaleZ(), rotate3d(), <br/>rotateX(), rotateY(), rotateZ(), perspective(), matrix3d()
**其他属性**            |
transform-origin       | 指定元素的中心点的位置
transform-style        | `flat`2D平面呈现， `preserve-3d`3D空间中呈现


<br/>
### 7. 过渡 transition
CSS的transition允许CSS的属性值在一定的时间区间内平滑地过渡。
{% raw %}
<style>
.transition div{
  width: 100px;
  height: 100px;
  background-color: green;
  text-align: center;
  color: #fff;
  line-height: 100px;
  display: inline-block;
  vertical-align: middle;
}
.transition1:hover{
  background-color: orange;
  border-radius: 50%;
  transition: background 0.5s linear 0s, border-radius 0.2s ease-in 0s;
}
</style>
<div class="transition">
  <div class="transition1">hover me</div>
</div>
{% endraw %}

  ```
  transition: <transition-property> <transition-duration> 
              <transition-timing-function> <transition-delay> , ...

  // 速记: transition: property, duration, animation type, delay 
  ```


*`transition-property`*
指定过渡或动态模拟的CSS属性。
支持transition过渡功能的CSS属性: background-color, background-position, opacity, border, outline, margin, padding, width, height, min/max-width/height, top/bottom/left/right, color, font-size, font-weight, letter-spacing, line-height, text-indent, text-shadow, vertical-align, word-spacing, z-index, visibility


*`transition-duration`*
指定完成过渡所需的时间，单位为s或ms(毫秒)。

*`transition-timing-function`*
指定过渡函数。
ease: 默认值，过渡速度由快到慢，逐渐变慢
linear: 恒速
ease-in: 加速
ease-out: 减速
ease-in-out: 先加速后减速

*`transition-delay`*
指定过渡开始出现的延迟时间，单位为s或ms(毫秒)。

<br/>
### 8. 动画 @keyframes
{% raw %}
<style>
@keyframes wobble{
  0%{ margin-left: 100px; background: green; }
  40%{ margin-left: 150px; background: orange; }
  60%{ margin-left: 75px; background: blue; }
  100%{ margin-left: 100px; background: red; }
}
.animation{
  width: 100px;
  height: 100px;
  animation: wobble 2s ease-in 0s infinite;
}
</style>
<div class="animation"></div>
{% endraw %}
```
@keyframes wobble{
  0%{ margin-left: 100px; background: green; }
  40%{ margin-left: 150px; background: orange; }
  60%{ margin-left: 75px; background: blue; }
  100%{ margin-left: 100px; background: red; }
}
.animation{
  width: 100px;
  height: 100px;
  animation: wobble 2s ease-in 0s infinite;
}
```

简写规则
```
animation: <animation-name> <animation-duration>
           <animation-timing-function> <animation-delay>
           <animation-iteration-count> <animation-direction>
           <animation-play-state> <animation-fill-mode>, ...
```

*`@keyframes`*
关键帧， 由@keyframes开头，后面紧跟动画的名称，加上一对花括号，里面的样式规则由多个百分比构成，每个百分比中是不同的CSS样式。

*`animation-name`*
指定一个关键帧动画的名字，这个动画名必须对应一个@keyframes规则

*`animation-duration`*
设置动画播放所需时间，也就是完成从0%~100%一次动画所需时间。单位为s

*`animation-timing-function`*
设置动画的播放方式，变换方式ease, ease-in, ease-in-out, ease-out, linear, cubic-bezier。

*`animation-delay`*
指定动画开始时间，单位为s

*`animation-iteration-count`*
指定动画播放的循环次数。 `infinite | <integer>`

*`animation-direction`*
指定动画的播放方向, normal为向前播放，alternate为反方向播放

*`animation-play-state`*
控制动画的播放状态, paused将正在播放的动画停下来， runing将暂停的动画重新播放

*`animation-fill-mode`*
定义动画开始前和结束后发生的操作。none按预期进行和结束，动画完成其最后一帧时，动画会翻转到初始帧处。 forwards 动画结束后继续应用最后帧的位置。 backwards 在向元素应用动画样式时迅速应用动画的初始帧。 both元素动画同时具有forwards和backwards的效果。

<br/>

### 9. 媒体查询
```
@media screen and (max-width:600px){}
@media screen and (min-width:600px) and (max-width:900px){}
```

<br/>
### 10. meta标签
当responsive页面在手机测试的时候，会发现媒体查询都不会生效——页面仍展示位普通样式，只是全局缩小了。 这时需要添加`meta`标签
```
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

<br/>
### 参考资料

- [MDN - CSS层叠样式表](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- 《图解CSS3·核心技术与案例实践》 大漠[著]