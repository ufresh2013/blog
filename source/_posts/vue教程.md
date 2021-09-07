---
title: vue教程
date: 2021-08-27 09:55:47
tags:
---

### 响应式 Reactivity
实现一个程序，使变量b总是变量a的10倍。
```js
const a = 1
const b = a * 10
```
转换成web视图渲染问题，修改变量a，页面上使用到a变量的地方都会自动更新
```js
<span>{{ state.a * 10 }}</span>

onStateChange(() => {
  view = render(state)
})

state.a = 5
```
Object.defineProperty实现
```js
function convert (obj) {
  Object.keys(obj).forEach(key => {
    let internalVal = obj[key]
    Object.defineProperty(obj, key, {
      get () {
        return internalVal
      },
      set (newVal) {
        internalVal = newVal
      }
    })
  })
}

```

### 依赖追踪



### Plugin
```js
function (Vue, options) {
  // plugin code...
}
```

7：40分