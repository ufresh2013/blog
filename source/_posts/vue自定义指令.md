---
title: 一些好用的vue自定义指令
date: 2024-11-14 15:47:27
category:
- Vue
---

### 1. v-title
文本有省略号...显示title，没有则不显示
```js
app.directive('title', {
  mounted(el, binding) {
    el.addEventListener('mouseover', showOverflowTitle.bind(this, el, binding))
  },
  unmounted(el) {
    el.removeEventListener('mouseover', showOverflowTitle)
  }
})

<span v-title="item.name">{{ item.name }}</span>
```

### 2. v-hideIfOverflow
如果div有滚动条就隐藏
```js
function hideOverflowElement(el: HTMLElement) {
  el.style.opacity = el.scrollWidth > el.offsetWidth ? '0' : '1'
}
app.directive('hideIfOverflow', {
  mounted(el) {
    el.style.opacity = el.scrollWidth > el.offsetWidth ? 0 : 1
    window.addEventListener('resize', hideOverflowElement.bind(this, el))
  },
  unmounted() {
    window.removeEventListener('resize', hideOverflowElement)
  }
})
```