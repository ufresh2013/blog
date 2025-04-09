---
title: 翻完张鑫旭的博客，这是我的笔记（CSS篇）
date: 2025-03-19 15:17:14
---




### 5. 一些巧妙的实现
1. 希望文字少的时候居中显示，文字超过一行的时候居左显示。
<img src="3.jpg" style="max-width: 300px; margin-top: 20px">
```css
.box {
  text-align: center;
}
.content {
  display: inline-block;
  text-align: left;
}
```

<br/>


2. 任意高度元素的展开收起动画
很多时候，我们展开的元素内容是动态的，换句话说高度是不固定的，因此，height使用的值是默认的auto，应该都知道的auto是个关键字值，并非数值，正如height:100%的100%无法和auto相计算一样，从0px到auto也是无法计算的，因此无法形成过渡或动画效果。但是我们可以利用`max-height`,max-height使用足够安全的最小值，这样，收起时即使有延迟，也会因为时间很短，很难被用户察觉，并不会影响体验。
```css
.element {
  max-height: 0;
  overflow: hidden;
  transition: max-height .25s;
}
.element.active {
  max-height: 666px;    /＊一个足够大的最大高度值＊/
}
```

<br/>

3. 登录 | 注册，希望中间的 | 高度不那么高
<img src="5.jpg" style="max-width: 400px">

```css
<a href="">登录</a><a href="">注册</a>
a + a:before {
  content: "";
  font-size: 0;
  padding: 10px 3px 1px;
  margin-left: 6px;
  border-left: 1px solid gray;     
}
```

<br/>

4. 图标绘制
移动端三道杠，双层圆点效果
<img src="6.jpg" style="max-width: 100px">

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

5. 列表块两端对齐，一行显示3个，块与块之间有20像素的间隙
<img src="7.jpg" style="max-width: 100px">

```css
ul {
  margin-right: -20px;
}
ul > li {
  float: left;
  width: 100px;
  margin-right: 20px;
}
```


### css
#### 1`::first-line`控制
控制第一行文本的样式。可以实现不影响div 的 color 值，单独控制div里文本的color，不影响其他元素。
```css
div::first-line { color: transparent }
div { -webkit-text-fill-color: transparent } // 也可以实现
```



#### 2.`offset-path`
让元素沿着不规则路径运动，如实现一个蚂蚁绕圈的动画
```css
.ant {
  offset-path: circle(75px);
  offset-path: path("M 0,200 Q 200,200 260,80 Q 290,20 400,0 Q 300,100 400,200");
}
```

#### 3. emoji字体
把emoji字体放在常规字体后面，增强emoji效果
```css
article {
  font-family: Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
}
```

### 4. hr 分割线
### 3. `<hr>`
仓库: https://gitee.com/zhangxinxu/css-hr/blob/master/hr.css
- 两头虚的分割线
```css
<hr class="hr-edge-weak">
.hr-edge-weak {
  border: 0;
  padding-top: 1px;
  background: linear-gradient(to right, transparent, #d0d0d5, transparent);
}
```

- 带文字内容的分割线（可以是虚线）
```css
<hr class="hr-solid-content" data-content="分隔线">
<hr class="hr-solid-content" data-content="文字自适应，背景透明">

.hr-solid-content {
  color: #a2a9b6;
  border: 0;
  font-size: 12px;
  padding: 1em 0;
  position: relative;
}
.hr-solid-content::before {
  content: attr(data-content);
  position: absolute;
  padding: 0 1ch;
  line-height: 1px;
  border: solid #d0d0d5;
  border-width: 0 99vw;
  width: fit-content;
  /* for 不支持fit-content浏览器 */
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
}
```
