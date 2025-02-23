---
title: 逻辑复用范式 - 从 mixin、高阶组件到 Hooks
date: 2025-02-05 16:52:30
category: React
---

假设我们有这么一个组件，x, y两个变量会根据鼠标移动，不断变化，这两个变量还是响应式的。
我们想把这段逻辑抽取出来，让它可以复用，有什么方法？
```js
const App = {
  template: `{{ x }} {{ y }}`,
  data() {
    return { x: 0, y: 0 }
  },
  methods: {
    update(e) {
      this.x = e.pageX
      this.y = e.pageY
    }
  },
  mouted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  }
}
```

<br/>

### 1. mixin
第一种方法，使用*`mixin`*。提取mixin很容易，但是如果你有很多个mixin，会出现以下问题：
- 注入源不明：不知道属性、方法来自哪个mixin
- 命名冲突

```js
const MouseMixin = {
  data() {
    return { x: 0, y: 0 }
  },
  methods: {
    update(e) {
      this.x = e.pageX
      this.y = e.pageY
    }
  },
  mouted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  }
}

const App = {
  mixins: [MouseMixin, mixinA, mixinB, mixnC], // 存在多个mixin时，会很混乱
  template: `{{ x }} {{ y }}`,
}
```

<br/>


### 2. 高阶组件
因为mixin的缺点很明显，React在很早的时候就移除了Mixin。
但是面对逻辑复用，又没有很好的解决方法，于是提出来了高阶组件。
高阶组件的用法：高阶组件包含了需用逻辑复用的变量和方法，并包裹住 Inner 组件，同时还要把x,y传递给 Inner 组件。
```js
function withMouse(Inner) {
  data() {
    return { x: 0, y: 0 }
  },
  methods: {
    update(e) {
      this.x = e.pageX
      this.y = e.pageY
    }
  },
  mouted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  },
  render() {
    return h(Inner, {
      x: this.x, 
      y: this.y
    })
  }
}

const App = withMouse({
  props: ['x', 'y'],
  template: `{{ x }} {{ y }}`,
})
```
相比于mixin，高阶组件有了自己的命名空间，不用担心命名冲突的问题。x, y的来源也指向了`withMouse`
但依然不能改变所有问题，假如有多个高阶组件包裹。我们依然会得到很多props，同样也无法知道哪个props来自哪个高阶组件

```js
const App = withFoo(withAnother(withMouse({
  props: ["x", "y", "foo", "bar"]
})))
```


<br/>

### 3. slot
在vue中，跟高阶组件相似的是slot
```js
function withMouse(Inner) {
  data() {
    return { x: 0, y: 0 }
  },
  methods: {
    update(e) {
      this.x = e.pageX
      this.y = e.pageY
    }
  },
  mouted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  },
  // template: `<slot :x="x" :y="y" />`,
  render() {
    return this.$slots.default && this.$slots.default({
      x: this.x,
      y: this.y
    })
  }
}

const App = {
  template: `<Mouse v-slot="{x, y}">{{ x }} {{ y }}</Mouse>`
}
```
存在多个slot时会是，比高阶函数要好的是，我们知道x,y的来源是Mouse。但slot额外产生了组件，增加了性能开销
```js
const App = {
  component: { Mouse, Foo },
  template: `
    <Mouse v-slot="{ x, y }">
      <Foo v-slot="{ foo }">
        {{ x }} {{ y }} {{ foo }}
      </Foo>
    </Mouse>
  `
}
```

<br/>

### 4. Hooks
`React Class Component` 和`vue2 option`，把data, method都绑定在一起，把它们挪到组件外是一个代价很大的行为。
意识到高阶组件也不是什么灵丹妙药后，React 提出用 Hooks 彻底取代 Class Component，开启了组件逻辑表达和逻辑复用的新范式，完美解决了上面的问题
```js
function useFeatureA() {
  const foo = ref(0)
  const plusone = computed(() => foo.value + 1)
  return { foo, plusone }
}

function useFeatureB() {
  const bar = ref(1)
  return { bar }
}

export default {
  template: `{{ event.count }}`,
  props: ["id"],
  setup(props) {
    const { foo, plusone } = useFeatureA()
    const { bar } = useFeatureB()
  }
}
```

<br/>


### 参考资料
- [尤雨溪前端趋势2022的主题演讲](https://www.bilibili.com/video/BV1Rr4y1L7r3/?spm_id_from=333.337.search-card.all.click&vd_source=2afb712305742eec14a61ccd3d5b51c9)
- [跟尤雨溪一起解读Vue3源码](https://www.bilibili.com/video/BV1rC4y187Vw/?spm_id_from=333.337.search-card.all.click&vd_source=2afb712305742eec14a61ccd3d5b51c9)