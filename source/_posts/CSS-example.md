---
title: CSS常用实例
date: 2018-11-06 17:57:46
category: CSS
---

#### 1. 全屏背景
```
body{
  background-image: url(1.png);         // 背景图路径
  background-position: center center;   // 背景图垂直水平居中
  background-repeat: no-repeat;         // 不平铺
  background-attachment: fixed;         // 当内容高度大于图片高度时，背景图像的位置相对于viewport固定
  background-size: cover;               // 背景图基于容器大小伸缩
  background-color: #fff;               // 背景图加载过程中显示的背景色
}
```
<br/>

#### 2. 单行溢出
```
a{
  max-width: 100px;        // 固定宽度
  white-space: nowrap;     // 禁止换行
  overflow: hidden;        // 隐藏溢出文本
  text-overflow: ellipsis; // 超出部分显示...
}
```
<br/>

#### 3. 多行溢出
{% raw %}
<style>
.content {
  width: 80%;
  max-height: 40px;
  position: relative;
  line-height: 1.4em;
  overflow: hidden;
  color: #4788C7;
}

.content::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 40px;
  background: -webkit-linear-gradient(left, transparent, #fff 55%);
  background: -o-linear-gradient(right, transparent, #fff 55%);
  background: -moz-linear-gradient(right, transparent, #fff 55%);
  background: linear-gradient(to right, transparent, #fff 55%);
}

</style>
<div class="content">多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出多行溢出</div>
{% endraw %}

```
.content {
  width: 80%;
  max-height: 40px;
  position: relative;
  line-height: 1.4em;
  overflow: hidden;
}

.content::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 40px;
  background: -webkit-linear-gradient(left, transparent, #fff 55%);
  background: -o-linear-gradient(right, transparent, #fff 55%);
  background: -moz-linear-gradient(right, transparent, #fff 55%);
  background: linear-gradient(to right, transparent, #fff 55%);
}
```

<br/>
#### 4. 自动换行
`word-wrap`可以控制换行，当取值`break-word`时将强制换行，中英文文本都无任何问题，但是对长串的英文不起作用。也就是说`break-word`是用来断词而不是断字符。而`word-break`取值为`break-all`时，可允许非亚洲语言文本的任意字符断开。

一般来说，使用`word-wrap:break-word`声明可以确保所有文本正常显示。但在Firefox浏览器上，长串英文会出现问题(不换行)。为了解决长串英文问题，一般将`word-wrap: break-word; word-break: break-all`一起使用。但是这样又造成了一个新的问题，会导致普通英文语句中的单词断行影响阅读。

综上所述，主要问题是长串英文不换行和英文单词会被断开。两者选一，应该使用`word-wrap: break-word; overflow:hidden`结合，而不是`word-wrap: break-word; word-break:break-all`结合。
```
element{
  overflow: hidden;
  word-wrap: break-word;
}
```

<br/>
#### 5. flex:上中下布局
Chrome, Firefox, Safari, IE11, IE10有效
```
<html>
  <style>
    .app{ 
      display: flex
    }
    .wrapper{ 
      display: flex; 
      flex-direction: column; 
      min-height: 100vh;
      width: 100%;
    }
    section{ 
      flex: 1 0 auto;
    }
    header, footer{ 
      height: 60px;
      background: blue;
    }
  </style>
  <div class="app">
    <div class="wrapper">
      <header></header>
      <section></section>
      <footer></footer>
    </div>
  </div>
</html>
```
<br/>

#### 6. 设置Select下拉箭头
```
select {
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
  background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
}

// IE
select::-ms-expand { display: none; }
```
<br/>

#### 7. `<input> checkbox radio`样式自定义
- 方法1 图片替换
```

```
- 方法2 


#### 8. 弹窗，遮罩后内容不滚动
Bootstrap, Ant design方法, 弹窗出现时给body添加行内样式`{overflow: hidden}`， 弹窗消失时`{overflow: auto}`


#### 9. 阻止因出现滚动条导致页面抖动
信息流页面，如新浪微博，开始只有头部一些信息加载，此时页面高度有限，没有滚动条；然后，更多内容显示，滚动条出现。 `margin: 0 auto`主体元素自然会做偏移——跳动产生。
```
html {
  overflow-x: hidden;
  overflow-y: auto;
}
body {
  width: 100vw;
  overflow-x: hidden;
  padding-left: calc(100vw - 100%);
}
```

#### 10. flex保持内容不超出容器
在一个设置了`flex: 1`或`flex: 0 0 25%`的容器中，如果文字很长，这时候文字就会超出容器，而不是呆在设置好的动态剩余空间中。可以给`.content`添加`width:0`, .content就不会被自己的元素无限撑开。
```html
<div class="main">
  <div class="aside"></div>
  <div class="content"></div> 
</div>
```
```css
.main{
  display: flex;
}
.aside{
  flex: 0 0 200px;
}
.content{
  flex: 1;
  width: 0;
  overflow: hidden; /* 兼容firefox */
}
```

#### 10. 纹理背景
[更多详情查看](https://leaverou.github.io/css3patterns/)
{% raw %}
<style>
.veins div{
  width: 250px;
  height: 250px;
  display: inline-block;
}
.veins1{
  background:
  radial-gradient(black 15%, transparent 16%) 0 0,
  radial-gradient(black 15%, transparent 16%) 8px 8px,
  radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
  radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px;
  background-color:#282828;
  background-size:16px 16px;
}
.veins2{
  background-color: #6d695c;
  background-image:
  repeating-linear-gradient(120deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
  repeating-linear-gradient(60deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
  linear-gradient(60deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1)),
  linear-gradient(120deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1));
  background-size: 70px 120px;
}
.veins3{
  background-color:silver;
  background-image:
  radial-gradient(circle at 100% 150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent),
  radial-gradient(circle at 0    150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent),
  radial-gradient(circle at 50%  100%, white 10%, silver 11%, silver 23%, white 24%, white 30%, silver 31%, silver 43%, white 44%, white 50%, silver 51%, silver 63%, white 64%, white 71%, transparent 71%, transparent),
  radial-gradient(circle at 100% 50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent),
  radial-gradient(circle at 0    50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent);
  background-size: 100px 50px;
}
.veins4{
  background-color:#556;
  background-image: linear-gradient(30deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(150deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(30deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(150deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(60deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a),
  linear-gradient(60deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a);
  background-size:80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
}
.veins5{
  background-color:#269;
  background-image: linear-gradient(white 2px, transparent 2px),
  linear-gradient(90deg, white 2px, transparent 2px),
  linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position:-2px -2px, -2px -2px, -1px -1px, -1px -1px;
}
.veins6{
  background-color:#001;
  background-image: radial-gradient(white 15%, transparent 16%),
  radial-gradient(white 15%, transparent 16%);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}
.veins7{
  background-color: #fff;
  background-image:
  linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
  linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em;
}
.veins8{
  background-color:white;
  background-image: linear-gradient(90deg, rgba(200,0,0,.5) 50%, transparent 50%),
  linear-gradient(rgba(200,0,0,.5) 50%, transparent 50%);
  background-size:50px 50px;
}
.veins9{
  background-color: gray;
  background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,255,.5) 50%);
  background-size: 50px 50px;
}
</style>
<div class="veins">
  <div class="veins1"></div>
  <div class="veins2"></div>
  <div class="veins3"></div>
  <div class="veins4"></div>
  <div class="veins5"></div>
  <div class="veins6"></div>
  <div class="veins7"></div>
  <div class="veins8"></div>
  <div class="veins9"></div>
</div>
{% endraw %}

<br/>
#### 11. 不定宽高元素水平垂直居中
*不适合的方案*
- text-align和line-height
- position:absolute, 50%, margin: -px

*正确的方法*
- display:table和display:table-cell
```css
.container {
  display: table;
}
.inner {
  display: table-cell;
  vertical-align:middle;
  text-align:center;
}
```

- flex
```css
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- position:absolute, 50%, translate
```css
.container {
  position: relative;
}
.inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

- vw, vh和translate
```css
.inner {
  position:fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%); 
}
```

- :before和display:inline-block
```css
.container{
  text-align: center;
}
.container:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.inner {
  display: inline-block;
}
```

#### 12. 移动端1px问题
由于不同的手机有不同的像素密度导致的。如果移动显示屏的分辨率始终是普通屏幕的2倍，1px的边框在devicePixelRatio=2的移动显示屏下会显示成2px，所以在高清瓶下看着1px总是感觉变胖了。

- 在ios8+中当devicePixelRatio=2的时候使用0.5px
```js
.border { border: 1px solid #999 }
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border { border: 0.5px solid #999 }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .border { border: 0.333333px solid #999 }
}
```

- transform: scale(0.5)

<br/>

#### 参考资料
- [CSS3 Patterns Gallery 纹路背景](https://leaverou.github.io/css3patterns/)
- [Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
- [多行溢出](https://www.jianshu.com/p/d2be62a507b8)
- 《图解CSS3·核心技术与案例实践》 大漠[著]
- [阻止因出现滚动条导致页面抖动](https://blog.csdn.net/zh_rey/article/details/77531224)
- [能够让不定宽高元素水平和垂直居中的方法](https://www.jianshu.com/p/69c570f4c1cb)