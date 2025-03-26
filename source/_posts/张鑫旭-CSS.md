---
title: 翻完张鑫旭的博客，这是我的笔记（CSS篇）
date: 2025-03-19 15:17:14
category: CSS
---

### css
#### 1`::first-line`控制
控制第一行文本的样式。可以实现不影响div 的 color 值，单独控制div里文本的color，不影响其他元素。
```css
div::first-line { color: transparent }
div { -webkit-text-fill-color: transparent } // 也可以实现
```

<br/>

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
