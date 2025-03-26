---
title: 翻完张鑫旭的博客，这是我的笔记（html篇）
date: 2025-03-19 15:17:14
category: CSS
---
> 本文只做简介和记录，具体怎么用得问AI

### 1. `<permission>`权限申请
摄像头、访问相册、地理位置信息等权限申请
```js
<permission type="camera" />

// permission api
navigator.permissions.query({ name: "geolocation" }).then((result) => {
  if (result.state === "granted") {}
});
```
<br/>

### 2. `<picture>, <source>`
- 不同尺寸显示不同图片
```html
<picture>
  <source srcset="rect.png" media="(min-width: 640px)">
  <img src="square.png">
</picture>
```

- 不同浏览器显示不同后缀的图片
如果浏览器支持avif格式，那边就加载体积最小的AVIF格式（47K），如果支持WEBP格式，则加载zxx.webp（56K），如果都不支持，则会加载`<img>`元素兜底的zxx.jpg（74K）。
```html
<picture>
  <source srcset="zxx.avif" type="image/avif">
  <source srcset="zxx.webp" type="image/webp">
  <img src="zxx.jpg">
</picture>
```

<br/>

### 3. `<hr>`分割线
可以实现两头虚的分割线，带文字内容的分割线（可以是虚线）
仓库: https://gitee.com/zhangxinxu/css-hr/blob/master/hr.css

<br/>

### 4. HTML全局属性
HTML全局属性，指的是在所有html元素上都能使用的属性，如id, class
- `accesskey`
指定访问当前元素的快捷键。例如`<a href="" accesskey="1">`，当按下`alt + 1`时，IE会让a元素获得焦点，其他浏览器则是直接触发click行为。`<input type="search" accesskey="/">`按下 `/`触发click事件，input被focus到。
- `autocapitalize`
用来控制文本在用户输入/编辑时的大小写，这个属性适合英文场景。(实际测试没有效果)
- `class`
- `conteneditable`
让元素处于可编辑状态
- `data-*`
指开发人员自己设置的各种自定义属性，可以用`HTMLElement.getAttribute()`和`HTMLElement.dataset` 访问自定义属性。
- `dir`
改变文档流的水平流动方向，设计的初衷是用在多语言处理中。但是实际开发，我们可以利用其改变文档流的特性，实现类似微信对话这样的对称布局。
```html
<div class="chat-container">
  <div class="chat-message" dir="ltr">这是对方发送的消息。</div>
  <div class="chat-message" dir="rtl">这是我发送的消息。</div>
  <div class="chat-message" dir="ltr">对方又发了一条消息。</div>
  <div class="chat-message" dir="rtl">我再次回复消息。</div>
</div>
```
- `draggable`
true/false 元素是否能被拖拽，`<img>`元素天然可以被拖拽
- `part属性和::part伪元素`
```html
<p part="textspan active">文字颜色是深天空蓝！</p>
<style>
p::part(active) { color: deepskyblue; }
</style>
```
- `exportparts`
- `hidden`
hidden属性可以让元素隐藏，表现为display:none
- `inputmode`
- `is`
用在自定义的内置元素上的，可以让内置元素有其他自定义的交互行为。如阻止`<form>`元素原生的submit行为。
```html
<form is="form-prevent">
    <input type="search" placeholder="请输入">
    <button type="submit">搜索</button>
</form>
<script>
class FormPrevent extends HTMLFormElement {
  constructor() {
    // 总是在constructor中先调用super
    const self = super();
    self.addEventListener('submit', function (event) {
        event.preventDefault();
    });    
  }
}
// 定义新的元素
customElements.define('form-prevent', FormPrevent, { 
  extends: 'form' 
});
</script>
```
- `item-*`
用于SEO相关，丰富网页摘要，方便机器识别
```html
<div itemscope itemtype="http://data-vocabulary.org/Person">
  我的名字是<span itemprop="name">王富强</span>，
  但大家叫我<span itemprop="nickname">小强</span>。
  我的个人首页是：<a href="http://www.example.com" itemprop="url">www.example.com</a>
</div>
```
- `lang`
定于元素的语言
- `slot`
可以理解为类似vue里的slot元素，但是这个是浏览器原生的。
```html
<template id="zxx-paragraph">
  <style>
    p {
      color: white;
      background-color: deepskyblue;
      padding: 5px;
    }
  </style>
  <p><slot name="zxx-text">我是默认文字</slot></p>
</template>
<zxx-paragraph>
  <span slot="zxx-text">我会替换掉默认文字，啦啦啦啦啦~</span>
</zxx-paragraph>
```
- `spellcheck`
是否开启拼写检查
- `style`
- `tabindex`
依次Tab，就可以focus所有focusable的元素了
- `title`
hover会显示相关的提示


### 5. dataset全局属性
dataset并不是典型意义上的JavaScript对象，而是个DOMStringMap对象。
- 可以用`HTMLElement.getAttribute()`和`HTMLElement.dataset` 访问自定义属性。
- 可以基于data属性值设置CSS样式
```css
<div class="mm" data-name="无版权"></div>
.mm[data-name='无版权']{
  background:url(mm1.jpg) no-repeat
}
```


### 6. tabIndex全局属性
给 div 元素设置 tabindex 属性能让它变为focusable。tabindex 属性能够控制元素被 tab 到的顺序。



### 7. drag/drop拖拽
- `draggable`
```html
<div title="拖拽我" draggable="true">列表1</div>
```
- `ondragstart`
- `ondragenter`
- `ondragover`
- `ondrop`
- `ondragend`
- `Event.effectAllowed`
- `Event.DataTransfer`


### 8. favicon
favicon.ico图标，必须是正方形的。favicon除了使用线上地址，还支持base64格式内联。

### 9. import HTML
HTML Imports，Web Components开发重要组成部分之一
```html
<link rel="import" href="module.html">
```

### 10. fieldset禁用所有表单元素
`pointer-events:none`可以让点击无效，但是并没有阻止键盘访问，也就是Tab键索引，或者回车都能触发表单行为，使用new FormData(form)也能获取表单控件值，并不是真正意义上禁用，问题很大。使用`<fieldset disabled>`嵌套就可以禁用所有表单元素。
```html
<form>
  <fieldset disabled>
    <input />
    <textarea></textarea>
  </fieldset>
</form>
```
