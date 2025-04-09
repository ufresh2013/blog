---
title: 🤔 Vue响应式问题集
date: 2025-02-17 23:51:19
category: JS
---
> 一个Vue的复杂响应式对象都劫持了哪些key？哪些属性是响应式的？如果把这个key抽离出来，还有响应式吗？什么情况下会出现响应式丢失？为什么 Vue2 里会有`$set` 方法？为什么 Vue3 里会有 `toRef`, `.value`？`Ref`, `Reactive`, `shallowRef`的区别是什么？
（刚被面试官问得我一愣一愣的，Vue的响应式怎么这么多问题 -_-||）




### 1. Object.defineProperty
#### 1.1 实现响应式
Vue2使用`Object.defineProperty(obj, key, handlers)`实现响应式。这个方法必须指定`key`键，在组件初始化时，vue2 会深度遍历data的每个key进行劫持。
```js
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
```



#### 1.2 Vue2都劫持了哪些key?
data的第一层key都被劫持到，如果某一个key的value是对象和数组。我们操作`this.$data.a.b = 1`会有响应式效果吗？

*对象*
对对象的子属性进行深度遍历监听

*数组*
Vue 没有对每个数组项设置监听，但是如果数组项是对象，Vue还是给这个对象所有key监听了。

*总结*
所以你可以理解，面对复杂对象、数组，Vue没有对数组索引下标（这个key）添加监听，其他都监听了。
```js
{
  data () {
    return {
      list: [
        1,
        { name: 1 },
        [
          { name: 1 }
        ]
      ]
    }
  },
  methods: {
    changeList () {
      this.list[0] = 2          // 不会触发渲染
      this.list[1] = 1          // 不会触发渲染
      this.list[1].name = 2     // 会触发渲染
      this.list[2][0] = 3       // 不会触发渲染
      this.list[2][0].name = 3  // 会触发渲染
    }
  }
}
```



#### 1.3 源码解析
除了实现上面的效果。如果newVal是一个全新的值，索引地址变了，会重新触发Object.defineProperty
```js
// 源码地址：src/core/observer/index.js
export function observe (value) {
  return new Observer(value)
}

export class Observer {
  constructor (value) {    
    if (Array.isArray(value)) {
      // 变量是数组，遍历数组，如果数组里的元素是对象，就为对象里的key调用Object.defineProperty
      this.observeArray(value)
    } else {
      // 变量是对象，遍历所有key值，为每个key调用Object.defineProperty
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}


/**
 * Define a reactive property on an Object.
 */
export function defineReactive (obj, key, val) {
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    get: function reactiveGetter () {},
    set: function reactiveSetter (newVal) {
      // 如果newVal是一个全新的值，索引地址变了，会重新触发ObjectProperty
      childOb = !shallow && observe(newVal)
    }
  })
}
```



#### 1.4 哪些变动不会有响应式？($set, Array.property)
从上面得知，`Object.defineProperty`的性质使得，Vue不能监听这些变动：
- 添加根级别对象`key`
- 对已有对象添加删除`key`

为每个数组项进行监听开销太大，使得Vue不能监听这些变动：
- 利用索引设置一个数组项`vm.items[index] = newValue`
- 修改数组长度`vm.items.length = newLength`




但我们可以通过这些手段，处理这个问题
1. 修改内存地址，赋一个全新的值，触发一次新的监听绑定
```js
// 新增修改对象property
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })

// 总是返回一个新数组
filter(), concat(), slice() 
```

2. 调用`vm.$set`方法
vm.$set做了什么？
`target`是数组时，执行`target.splice(key, 1, val)`
`target`是对象时，如果`key`已经存在，直接赋值；如果`key`不存在，`defineReactive(ob.value, key, val)`
```js
this.$set(this.someObject,'b',2)
this.$set(vm.items, indexOfItem, newValue)
```

3. 调用数组方法
Vue hack了 push, pop 等数组的原型方法`Array.prototype`，使得调用这些方法也会产生响应式效果
```js
this.items.splice(newLength)
push(), pop(), shift(), unshift(), splice(), sort(), reverse()
```




#### 1.5 watch deep
深度遍历所有子属性，触发所有子属性的getter函数执行，收集依赖-watch后需要执行的事件









### 2. Proxy
#### 2.1 实现响应式
通过 Proxy 劫持整个对象，包括所有数组和动态添加的属性，支持深度响应式。
在Vue3，如果reactive的变量是个数组，当你设置`arr[index] = 1`，会触发set，而访问会触发get，依赖会被自动添加。对于数组变化，就不用做额外的处理。
```js
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

Proxy的响应式是绑定在哪一级？如果我们把object中的某个key抽离出来，还有响应式吗？




#### 2.2 Ref, Reactive, shallowRef的区别
- `Ref`
Ref用来包装基本类型或对象，通过.value访问，响应式的是整个值的变化。
  - 数字、字符串等基本类型必须用 ref。
  - 需要明确替换整个对象时也可用 ref。


- `Reactive`
Reactive使用Proxy代理对象，深度响应式。
  - 处理对象/数组时优先使用，语法更简洁。
  - 避免解构响应式对象（用 toRefs 解决解构问题）。
  ```js
  const state = reactive({ a: 1, b: 2 });
  const { a, b } = toRefs(state); // 保持响应式
  a.value++; // 触发更新
  ```

- `shallowRef`
shallowRef则是只对.value的变化触发响应，内部值不会被深度响应式处理，适用于大型对象或不需要深度监听的情况。
  - 需要监听引用替换但不需要深度响应时（如大型数据、第三方类实例）。
  - 需要手动控制更新粒度时。






#### 2.3 为什么需要`.value`




#### 2.4 为什么需要`toRef`



#### 2.5 响应式丢失


#### 2.6 为什么要用`ref()`
Vue 3 的响应式系统本身最大的特点是不仅不依赖编译，而且跟组件上下文无关，甚至跟 Vue 框架其它部分也是解耦的。同一套系统你可以用在 Vue 组件里，组件外，其他框架里，甚至用在后端。




### 3. Object.defineProperty 和 Proxy的区别


*Proxy*
- 劫持方式：代理整个对象，只需做一层代理就可以监听对象下的所有属性变化，包括新增属性和删除属性、数组变更
- 依赖收集时机：
- 本质：Proxy 本质上属于元编程非破坏性数据劫持，在原对象的基础上进行了功能的衍生而又不影响原对象
- Proxy 拦截方式更多, Object.defineProperty 只有 get 和 set
- Proxy 兼容性差

*Object.defineProperty*
- 劫持方式：只能深度遍历劫持对象的key，无法劫持数组索引下标(0, 1, 2...)
- 流程：get中进行依赖收集，set数据时通知订阅者更新
- 存在的问题：虽然 Object.defineProperty 通过为属性设置 getter/setter 能够完成数据的响应式，但是它并不算是实现数据的响应式的完美方案，某些情况下需要对其进行修补或者hack，这也是它的缺陷，主要表现在两个方面：
  - 无法监听新增加的属性
  - 无法一次性监听对象所有属性，如对象属性的子属性
  - 无法响应数组的操作


### 参考资料
- [为什么 vue3 删不掉 ref() 这样冗余的函数，但 svelte 可以？](https://www.zhihu.com/question/492260571/answer/2169614031)