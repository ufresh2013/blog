---
title: B站跟尤雨溪一起解读Vue3源码
date: 2025-02-05 16:52:30
category: JS
---

### 1. mount 挂载函数
实现一个*`mount`*挂载函数, 用于把虚拟dom挂载到真实dom上
```js
function mount(vnode, container) {
  const el = document.createElement(vnode.tag)
  // props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key]
      el.setAttribute(key, value)
    }
  }
  // children
  if (vnode.children) {
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children
    } else {
      vnode.children.forEach(child => {
        mount(child, el)
      })
    }
  }
  container.appendChild(el)
}

function h(tag, props, children) {
  return {
    tag, 
    props,
    children
  }
}
const vdom = h('div', { class: 'red' }, [
  h('span', null, 'hello')
])
mount(vdom, document.getElementById('app'))
```



### 2. Reactive 响应式
响应式，是自动更新的意思，state数据变了，view会自动更新
```js
<span>{{ state.a * 10 }}</span>
onStateChanged(() => {
  view = render(state)
})
```
怎么实现这个效果呢？不同于`setState`，Vue一直用依赖收集的方法来实现响应式。



#### 2.1 依赖收集
假设每个响应式变量*`value`*，有一个专门处理依赖的class实例，暂定这个class是*`Dep`*。
如何把`Dep`和`value`链接在一起?
- 创建value的同时，new Dep `const value = new Dep(123)`
- 当访问`value`时，触发`dep.depend()`来收集依赖
- 当改变`value`时，触发`dep.notify()`来触发更新
```js
let activeEffect
class Dep {
  constructor(value) {
    this.subscribers = new Set()
    this._value = value
  }

  // 当访问值时，会隐式调用depend，作依赖搜集
  get value() {
    this.depend()
    return this._value
  }

  // 当值更新时，会自动调用notify，来作视图更新
  set value(newValue) {
    this._value = newValue
    this.notify()
  }
  
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }

  notify() {
    this.subscribers.forEach(effect => {
      effect()
    })
  }
}

function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}

const dep = new Dep('hello')

watchEffect(() => {
  console.log(dep.value)
})

// 改变值，然后通知更新
dep.value = 'changed'
```






#### 2.2 *`Object.defineProperty`*
Vue2基于*`Object.defineProperty`*来实现响应式。
但会引发一些问题。如给data添加属性时，不能直接`this.$data.new = value`。
因为响应式只在一开始设置上，后面直接加的不会有响应的效果。
所以可以看到Vue2单独提供了API，需要hack in数组的`property`重写一些数组的内置方法，如数组的`push`, `pop`，让其可以实现响应式
```js
let activeEffect
class Dep {
  subscribers = new Set()
  
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }

  notify() {
    this.subscribers.forEach(effect => {
      effect()
    })
  }
}

function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}

function reactive(raw) {
  Object.keys(raw).forEach(key => {
    const dep = new Dep()
    let value = raw[key]

    Object.defineProperty(raw, key, {
      get() {
        dep.depend()
        return value
      },
      set(newValue) {
        value = newValue
        dep.notify()
      }
    })
  })
  return raw
}

const state = reactive({
  count: 0
})
watchEffect(() => {
  console.log(state.count)
})

state.count = 1
```



#### 2.3 proxy
Vue3利用`Reflect`和`Proxy`来实现响应式，我们需要改造一下上面的`reactive`方法。
基于proxy的实现，我们能检测新属性的添加，并自动添加响应式。
在Vue3，如果reactive的变量是个数组，当你设置`arr[index] = 1`，会触发set，而访问会触发get，依赖会被自动添加。对于数组变化，就不用做额外的处理。
```js
const targetMap = new WeakMap() // WeakMap可以用object来作为key

function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}

const reactiveHandlers = {
  get (target, key, receiver) {
    const dep = getDep(target, key)
    dep.depend()
    return Reflect.get(target, key, receiver) // 反射，做该对象本该做的事
  },
  set (target, key, value, receiver) {
    const dep = getDep(target, key)
    dep.notify()
    return Reflect.set(target, key, receiver)
  }
}
function reactive(raw) {
  return new Proxy(raw, reactiveHandlers)
}
```




### 参考资料
- [跟尤雨溪一起解读Vue3源码](https://www.bilibili.com/video/BV1rC4y187Vw?spm_id_from=333.788.videopod.episodes&vd_source=2afb712305742eec14a61ccd3d5b51c9&p=5)