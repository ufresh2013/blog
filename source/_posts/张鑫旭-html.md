---
title: 🤔 翻完张鑫旭的博客，这是我的笔记 - HTML篇
date: 2025-03-19 15:17:14
category: HTML
---
> 简单的互动效果，通常都是通过javascript实现的，但实际上CSS和HTML也能实现，并且在很多场景下，单纯使用html才是最优解。本文对[张鑫旭博客中HTML相关文章](https://www.zhangxinxu.com/wordpress/category/html/)和《HTML并不简单》做简单的记录和归纳，不涉及具体用法。

### 1. HTML元素
#### 1.1 `<permission>`
调起摄像头、访问相册、地理位置信息等权限申请
```js
// 用户点击元素，自动呼起权限选择的弹框
<permission type="camera" />

// js调起
navigator.permissions.query({ name: "geolocation" }).then((result) => {});
```


#### 1.2 `<picture>, <source>`
- 不同屏幕尺寸显示不同图片
```html
<picture>
  <source srcset="rect.png" media="(min-width: 640px)">
  <img src="square.png">
</picture>
```

- 不同浏览器显示不同后缀的图片
如果浏览器支持avif格式，那就加载体积最小的.avif（47K），如果支持WEBP格式，则加载.webp（56K），如果都不支持，则加载兜底的.jpg（74K）。
```html
<picture>
  <source srcset="zxx.avif" type="image/avif">
  <source srcset="zxx.webp" type="image/webp">
  <img src="zxx.jpg">
</picture>
```



#### 1.3 `<hr>`分割线
实现各种类型的分割线。`<select>`下拉框也支持添加`<hr>`元素。
<img src="2.png"><img src="3.png">

#### 1.4 `<wbr>`换行
让连续英文字符能精准换行，如技术文档中的一些长词
```html
<!-- CanvasRenderingContext2D.globalCompositeOperation -->
<div>Canvas<wbr>Rendering<wbr>Context2D<wbr>.global<wbr>Composite<wbr>Operation</div>
```



#### 1.5 `<area><map>`
`<area>`是给`<img>`图像标记热点区域用的。如此时图片上就有3个热区，我们使用Tab键索引高亮就可以窥见其轮廓范围。
```html
<img src="1.png" alt="美女" usemap="#MM">
<map id="MM" name="MM">
  <area shape="rect" coords="20,20,80,80" href="#rect" alt="矩形">
  <area shape="circle" coords="200,50,50" href="#circle" alt="圆形">
  <area shape="poly" coords="150,100,200,120,180,130,190,180,150,150,100,160,140,120,100,110" href="#poly" alt="多边形">
</map>
```

#### 1.6 MathML 数学公式
MathML指“数学标记语言”，是XML语言的一个子集，用来显示数学公式。
```html
<math><mi>x</mi></math>

<!-- 根号 a²+b²-->
<math> 
  <menclose notation="radical">
     <msup><mi>a</mi><mn>2</mn></msup>
     <mo>+</mo>
     <msup><mi>b</mi><mn>2</mn></msup>
  </menclose>
</math>
```

#### 1.7 `<progress>`
进度条效果
```html
<progress value="50" max="100"></progress>
```
<img src="8.jpg" style="max-width: 250px; margin-top: 20px">


#### 1.8 `<meter>`
密码强度
<img src="7.jpg" style="max-width: 250px; margin-top: 20px">







### 2. 自带交互的元素
#### 2.1 `<details><summary>`
纯HTML实现展开收起的效果，通过`::-webkit-details-marker`, `::-moz-list-bullet`对小三角做样式调整。
```html
<details open>
  <summary>这是摘要1</summary>
  <p>这里具体描述，标签相对随意，例如这里使用的&lt;p&gt;标签。</p>
</details>
```
通过`[open]`选择器属性，实现“更多”展开收起。还能实现悬浮菜单、多项折叠、树形菜单效果。
```css
[open] summary a::before {
  content: '收起';
}
```
<img src="1.png" style="display: inline-block; width: 50%; vertical-align: top"><img src="4.gif" style="display: inline-block; width: 50%"/>

#### 2.1 `<fieldset><legend>`
fieldset表示组的意思。使用`<fieldset disabled>`，可以批量禁用表单元素。`pointer-events:none`可以让点击无效，但是并没有阻止键盘访问，Tab键索引，回车触发表单行为，并不是真正意义上禁用。
```html
<form>
  <fieldset disabled>
    <legend>标题</legend>
    <input />
    <textarea></textarea>
  </fieldset>
</form>
```

#### 2.3 `<dialog>`
对话框弹框效果
```html
<button onClick="dialog.show()">点击显示弹框</button>
<dialog open>
  <img src="1.png">
  <!-- 不使用js代码，就能触发弹框的关闭 -->
  <form method="dialog">
    <button>我知道了</button>
  </form>
</dialog>
```

#### 2.4 `<label>`
扩大了输入框的响应区域，当 label 元素和表单控件产生关联时，点击 label 元素，表单会自动处于激活状态。label 元素使用 for 属性，让其值等于表单元素的 id 值。
```html
<form>
  <div>
    <label for="email">邮箱</label>
    <input type="email" id="email">
  </div>
</form>
```


### 3. HTML全局属性
HTML全局属性，指的是在所有html元素上都能使用的属性，常用属性如`id, class, style, title`

#### 3.1 accesskey
指定访问当前元素的快捷键
- `<a href="" accesskey="1">`，按下`alt + 1`时，触发click行为。
- `<input type="search" accesskey="/">`按下 `/`触发click事件，input被focus到。

#### 3.2 tabindex
给 div 元素设置 tabindex 属性能让它变为focusable。按 tab 键，设置了 tabindex 属性的元素被陆续被 focus 到。有利于键盘无障碍访问。

#### 3.3 data-*
允许开发人员自己设置的自定义属性
- dataset并不是典型意义上的JavaScript对象，而是个DOMStringMap对象。
- 可以用`HTMLElement.getAttribute()`和`HTMLElement.dataset` 访问自定义属性。
- 可以基于data属性值设置CSS样式
```css
<div class="mm" data-name="无版权"></div>
.mm[data-name='无版权']{
  background:url(mm1.jpg) no-repeat
}
```


#### 3.4 draggable
表示元素是否能被拖拽，`<img>`元素天然可以被拖拽
```html
<div title="拖拽我" draggable="true">列表1</div>
<!-- 方法: ondragstart, ondragenter, ondragover, ondrop, ondragend, e.DataTransfer -->
```

#### 3.5 contenteditable
让元素处于可编辑状态

#### 3.6 其他全局属性
- `autocapitalize`: 用来控制文本在用户输入/编辑时的大小写，适合英文场景。
- `part`: 对应可以设置`::part`伪类选择器
```html
<p part="textspan active">文字颜色是深天空蓝！</p>
p::part(active) { color: deepskyblue; }
```
- `spellcheck`: 是否开启拼写检查
- `exportparts`
- `hidden`: hidden属性可以让元素隐藏，表现为display:none
- `inputmode`
- `is`: 让 html 元素有其他自定义的交互行为。如阻止`<form>`元素原生的submit行为。
- `item-*`: 用于SEO相关，丰富网页摘要，方便机器识别
```html
<div itemscope itemtype="http://data-vocabulary.org/Person">
  我的名字是<span itemprop="name">王富强</span>，
  但大家叫我<span itemprop="nickname">小强</span>。
</div>
```
- `lang`: 定于元素的语言
- `slot`: 浏览器原生的，类似vue里的slot元素。
- `dir`: 改变文档流的水平流动方向，设计的初衷是用在多语言处理中。但是实际开发，我们可以利用其改变文档流的特性，实现类似微信对话（一左一右）的对称布局。
<img src="6.png" style="margin-top: 16px" />



### 3. Web Components
#### 3.1 `<template><slot>`
`<template>`用于定义自定义元素 HTMLUnknownElement，除此之外，还可以用来存储模板信息，Vue就是使用`<template>`元素来存储渲染数据的。
`<slot>`插槽元素，可以实现从外面传入html内容。
```html
<template id="my-element-template">
  <style>
    :host {
      display: block;
      border: 1px solid black;
      padding: 10px;
    }
  </style>
  <h2>统一标题</h2>
  <slot></slot>
</template>

<script>
  class MyElement extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('my-element-template');
      const templateContent = template.content;
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  }
  customElements.define('my-element', MyElement);
</script>

<!-- my-element是一个 HTMLUnknownElement -->
<my-element>
  <p>自定义内容</p>
</my-element>
```

#### 3.2 is 自定义元素
让 html 元素有其他自定义的交互行为。如阻止`<form>`元素原生的submit行为。
```html
<form is="form-prevent">
    <input type="search" placeholder="请输入">
    <button type="submit">搜索</button>
</form>
<script>
class FormPrevent extends HTMLFormElement {
  constructor() {
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

#### 3.3 import HTML
导入 html 片段，Web Components开发重要组成部分之一。
```html
<link rel="import" href="include.html" is="ui-import">

<!-- include.html -->
<div>include</div>
```
定义`ui-import`
```js
class HtmlImport extends HTMLLinkElement {
  constructor () {
    super();
  }
  static get observedAttributes () {
    return ['href'];
  }
  load () {
    fetch(this.href).then(res => res.text()).then(html => {
      this.style.display = 'block';
      this.innerHTML = html;    
    });
  }
  attributeChangedCallback () {
    this.load();
  }
}
if (!customElements.get('ui-import')) {
  customElements.define('ui-import', HtmlImport, {
    extends: 'link'
  });
}
```



### 4. `<a>`元素
- `download`
我们希望点击“下载”链接下载图片而不是浏览，直接增加一个download属性就可以了。
```html
<a href="index_logo.gif" download="文件名.gif">下载</a>
```
- `noopener,opener`
主页面有一个登录按钮，点击后会开启一个新窗口进行登录，现在希望用户登录成功后，主页面自动刷新。用`ref="opener"`可以实现。
其实这个属性非常危险，login.html 可以用`window.opener.document.cookie`获取用户信息，或修改主页面内容。
当通过a链接跳转外站一定要设置ref为noopener，`<a target="_blank" ref="noopener" />`
```html
<!-- 主页面 -->
<a href="/login.html" target="_blank" ref="opener">登录</a>

<!-- login.html 在登录成功后，执行这个js代码即可 -->
window.opener.location.reload()
```
- `noreferrer`
`document.referrer`可以获取当前页面的来源地址，所有知名的网站分析工具，都是通过`document.referrer`来判断多少流量来自搜索引擎、多少流量来自社交媒体，以及多少是直接访问的。对于所有外站链接，建议都设置`ref="noreferrer"`避免信息泄露（除非是社交媒体属性）。
- `nofollow`: 告诉搜索引擎不要追踪这个链接`<a ref="nofollow" />`，减少SEO被分流
- `target`: 设置target为固定值，每次点击a标签的时候，只会在唯一的窗口中刷新，不会打开多个窗口。
- `ping`: 自带上报能力，设置了 ping 属性，用户点击 a 标签时，会自动发送一个post请求给所在地址。
- `referrerpolicy`
- `href`: 锚点定位，页面自动定位到id值的元素。如果`<a href="#top">`, href属性是top，会滚动到顶部



### 5. `<meta>`
- SEO：标题，描述，关键字，是否允许搜索引擎抓取
```html
<title>标题<title>
<meta name="description" content="描述" />
<meta name="keywords" content="keyword1, keyword2" />
<meta name="robots" content="follow" />
<!-- 百度搜索引擎私有规则：允许平移桌面端SEO权重到移动端页面 -->
<meta http-equiv="mobile-agent" content="format=html5;url=https://mobile.htmlapi.cn" />

<!-- 谷歌浏览器打开的网页，在被分享出去时，会提取有效信息并呈现出来 -->
<meta property="og:title" content="文章标题" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://www.xxx.com/1" />
<meta property="og:image" content="https://www.xxx.com/1.png" />
```

- 网页尺寸
viewport支持的值
  - width: 具体宽度值或device-width
  - height: 具体高度值或device-height
  - initial-scale: 0-10，网页初始缩放比例
  - maximun-scale: 0-10，网页能够放大的最大比例
  - minimun-scale: 0-10，网页能够缩小的最小比例
  - user-scale: yes 或 no，no表示无法用双指缩放网页。（app内嵌页往往不允许双指缩放，和原生app体验一致）
  - viewport-fit: auto, contain, cover（推荐设置为cover）
```html
<!-- 如果这里不设置width=device-width， 移动端会按照980px的宽度渲染，页面默认缩放以便在屏幕内完整显示 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
```

- 移动端上禁止高亮显示手机号、邮箱、日期
```html
<meta name="format-detection" content="telephone=no" />
<meta name="format-detection" content="date=no" />
<meta name="format-detection" content="address=no" />
<meta name="format-detection" content="email=no" />
```

- referrer 防盗链
避免自家的站点变成图床，会开启防盗链。当请求的资源是图片时，检查 Referer 头信息。只有来自 yourdomain.com 及其子域名的请求才被允许，否则返回 403 错误。
```html
<meta name="referrer" content="no-referrer" />
```

- 网站风格和主题色
```html
<meta name="theme-color" content="#0c58c0" />
<meta name="color-scheme" content="dark light">
```

### 6. 语义化及使用场景
语义化，指的是使用符合当前场景的HTML元素来构建Web应用，可以在看不见的地方提升用户体验。如：
- `<img>`自带右键复制图片、保存图片的功能。如果用 css background 来模拟，就没有这个效果
- `<a>`链接跳转，可以右键复制、键盘访问，按回车触发访问行为
- 为了文档信息展示而设计：`<header>, <footer>, <aside>, <main>, <nav>, <article>, <section>, <h1> - <h6>`
- 表意元素：`<blockquote>`长篇引用； `<q>`短篇引用；`<cite>`特殊名词引用
- 表象元素：`<i>`倾斜,, `<b>`加粗, `<em>`重点强调，`<strong>`强调重要性、紧迫性，`<small>`：旁注、版权说明等
- `<time>`：时间相关的描述
- `<mark>`：文本高亮
- `<data>`：来自数据库的数据字段，可以用 data 呈现。大部分`<span>`都应该替换为`<data>`
```html
<!-- 直接用data.value取值 -->
<span>姓名</span><data value="001">张三</data>
```
- `<sup><sub>`： 上标和下标
- `<dfn>`：表示定义的术语
- `<code>`：代码
- `<br>, <wbr>`：换行，字符换行
- `<ins>, <del>`：通常结伴出现，表示增加，删除。前者默认样式是删除线，后者是下画线
  <img src="5.png" style="max-width: 200px; margin-top: 16px" />



### 参考资料
- [张鑫旭博客中HTML相关文章](https://www.zhangxinxu.com/wordpress/category/html/)
- 《HTML并不简单 - 张鑫旭》