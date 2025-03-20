---
title: 🤔 从 Immer.js 再看浅拷贝，深拷贝
date: 2025-03-17 16:17:45
category: JS
---
先回顾一下什么是浅拷贝和深拷贝。


### 1. 浅拷贝
浅拷贝，仅复制对象的最外层，子对象仍为引用。实现浅拷贝的方式有：
- *`...`* 拓展运算符
- *`Object.assign`*
- *`Array.prototype.slice()`*, *`Array.prototype.concat()`*
- 遍历实现
```js
function shallowClone(obj) {
  const newObj = {};
  for(let prop in obj) {
    if(obj.hasOwnProperty(prop)){
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}
```

<br/>

### 2. 深拷贝
深拷贝不是那么好实现的。(完全独立于副本)

首先需要精确的定义，哪些可以clone？哪些不可以clone？任意对象的深度克隆，edge case 非常多，比如原生 DOM/BOM 对象怎么处理，RegExp 怎么处理，函数怎么处理，原型链怎么处理... 并不是一个简单的问题。复杂对象本身可能有很多约束，这不是一个通用的clone可以搞定的。比如dom元素的复制必须使用cloneNode方法，且它也只处理dom自己的东西。

所以我们讨论的深拷贝，是对于普通对象，或者划定好范围的深拷贝，方式有：
- `lodash.cloneDeep()`
- `jQuery.extend()`
- `structuredClone(obj, options)`Web浏览器提供了原生的Object对象深度克隆方法
- `JSON.parse(JSON.stringify(obj))`这种方式要求必须是JSON对象，会忽略不是JSON的一些值`undefined`, `symbol`、函数
- 深度递归实现
```js
function deepClone (obj, hash = new WeakMap()) {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  // 基本类型：直接返回值
  if (typeof obj !== 'object') return obj
  // 引用类型：进行深拷贝
  if (has.get(obj)) return hash.get(obj)
  let cloneObj = new obj.constructor()
  hash.set(obj, cloneObj)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj
}
```

<br/>


### 3. Immer.js
深拷贝、浅拷贝，绝不仅仅只是一个面试题。我们要知道，为什么要clone？
大多数情况下，clone是为了传递数据对象。我们希望得到一个数据副本，且在修改副本对象时，不会影响到原有对象。



<br/>

#### 3.1 不可变数据
例如，我们直接复制对象`const obj2 = obj1`, 当我们修改obj2时，却不小心把obj1也一起修改了。
```js
const obj1 = {
  name: '金毛1',
  city: '上海'
}
const obj2 = obj1;
obj2.name = '金毛2';
console.log(obj1) // {name:'金毛2', city:'上海'} obj1被修改了
```
如果不想在修改obj2时，对obj1也产生影响。我们会想到深拷贝一个obj1出来, 然后随便玩耍。

实际的项目中要操作的例子远比这个复杂。如果是一个庞大的对象, 用`JSON.parse(JSON.stringify(obj1))`实现深拷贝会浪费大量性能在拷贝属性上, 但我们可能只是想要一个name值不同的对象而已。

这个时候，我们会想到拓展运算法`...`的写法。只修改修改的值，其他值保持原来的引用。
```js
const obj2 = { ...obj1, name: '金毛2' }
```
而当obj1是一个多层嵌套的对象，我们需要一个包来帮忙处理层层嵌套的逻辑。这时就需要用到Immer.js。

<br/>
<br/>

#### 3.2 基本用法
Immer.js的核心目标, 通过直观的操作修改数据，得到一个拷贝对象（这个副本只新建被改变的变量, 其余变量都复用）

```js
/*
 * produce方法的第一个参数传入要拷贝的对象
 * produce方法的第二个参数为函数, 里面是draft，对传入对象的修改操作
 * 最后返回一个复制完毕的对象
*/
const obj2 = immer.produce(obj1, (draft) => {
  draft.name.basename['2022'] = '修改name'
})
```



<br/>
<br/>

#### 3.3 实现一个简易的Immer.js
Immer.js 通过递归式的 proxy 代理和浅拷贝，充分复用数据结构中不变的节点，同时满足性能要求 和 不可变数据的要求。

##### 3.3.1 基本的工具方法
```js
const isObject = (val) => Object.prototype.toString.call(val) === '[object Object]';
const isArray = (val) => Object.prototype.toString.call(val) === '[object Array]';
const isFunction = (val) => typeof val === 'function';

// 浅拷贝
function createDraftstate(target) {
  if (isObject) {
    return Object.assign({}, target)
  } else if (isArray(target)) {
    return [...target]
  } else {
    return target
  }
}
```

<br/>

##### 3.3.2 入口方法
传入`target`需要被拷贝的对象， `producer`修改操作，最后返回拷贝 + 修改后的对象（还不会出现多层proxy）
```js
function produce(target, producer) {
  const proxyState = createProxy(target) // 创建proxy
  producer(proxyState) // 修改数据
  return proxyState
}
```

<br/>

##### 3.3.3 核心代理方法
不管处于对象的哪一层，Immer.js 给访问到的key都转化为一个proxy对象。该代理对象能够跟踪对象属性的读取和修改操作。当对象的属性被读取时，会将该属性值也转换为代理对象；当属性被修改时，会标记对象已被修改，并更新内部的草稿状态。

每个访问到的key都维护着一个internal对象。比如obj2.name会生成一个自己的internal, obj2.name.nickname也会生成一个自己的internal。internal对象详细的记录着它的原始值、浅拷贝版本、所有修改都会在浅拷贝版本上操作。

大致流程：
1. 先给最外层对象转换为一个proxy对象
2. 对象中某个的key被读取，会触发 get 方法，immerjs会把读取到的key转化为一个proxy对象。
3. 每个proxy会维护当前这个key的值的浅拷贝版本`draftState`
4. 当set的时候，会返回`draftState[key] = value`
5. 最终逐层返回 `changed ? draftState[key] : targetState[key]`
```js
function toProxy(targetState) {
  let internal = {
    targetState, // 原始对象
    keyToProxy: {}, // 记录了哪些key被读取了(注意不是修改了)，以及key对应的proxy
    changed: false, // 标记是否被修改
    draftstate: createDraftstate(targetState), // 当前这一环的key的浅拷贝版本
  }
  return new Proxy(targetState, {
    get(_, key) {
      if (key === INTERNAL) return internal
      const val = targetState[key];
      // 只要key被读取了，就把它替换为一个proxy对象
      if (!(key in internal.keyToProxy)) {
        internal.keyToProxy[key] = toProxy(val)
      }
      return internal.keyToProxy[key]
  },
  set(_, key, value) {
    internal.changed = true;
    // 最终的拷贝对象其实是由所有draftstate组成
    internal.draftstate[key] = value
    return true
  }
})}
```

<br/>

##### 3.3.4 修改链回溯
上面的代码只完成了前4步，我们还没让修改后的值`draftState`返回出来。

当我们修改了一个值如`obj1.name.basename[2022]`, 连带这个值的父级也要被修改, 父级被修改则父级的父级也要被修改, 形成了一个修改链, 我们要加入回溯算法进行逐级的修改。并确保修改过的整个路径都是`draftState[key]`，而不是以一个Proxy套娃。

<img src="1.jpeg" style="display: inline-block; width: 33%"/><img src="2.jpeg" style="display: inline-block; width: 33%"/><img src="3.png" style="display: inline-block; width: 33%"/>

```js
// 更新 toProxy 方法
function toProxy(targetState, backTracking = () => { }) {
  let internal = {
    targetState, // 原始对象
    keyToProxy: {}, // 记录了哪些key被读取了(注意不是修改了)，以及key对应的proxy
    changed: false, // 标记是否被修改
    draftstate: createDraftstate(targetState), // 当前这一环的key的浅拷贝版本
  }
  return new Proxy(targetState, {
    get(_, key) {
      if (key === INTERNAL) return internal
      const val = targetState[key];
      // 只要key被读取了，就把它替换为一个proxy对象
      if (!(key in internal.keyToProxy)) {
        internal.keyToProxy[key] = toProxy(val, () => {
          internal.changed = true;
          const proxyObj = internal.keyToProxy[key];
          // 将修改后的值赋给自己
          internal.draftstate[key] = proxyObj[INTERNAL].draftstate;
          backTracking()
        })
      }
      return internal.keyToProxy[key]
    },
    set(_, key, value) {
      internal.changed = true;
      // 最终的拷贝对象其实是由所有draftstate组成
      internal.draftstate[key] = value
      backTracking()
      return true
    }
  })
}
```

如何理解`backTracking`？假设我们只做这个操作
```js
const a = {
  b: {
    c: {
      d: 1
    }
  }
}
const newState = produce(a, function (draft) {
  draft.b.c.d = 2;
});
```
会经过这么几个步骤
- 将 a 转换为 proxy
- 触发了 a.b 的 get，将 a.b 转换为 proxy
- 触发了 a.b.c 的 get, 将 a.b.c 转换为 proxy
- 触发了 a.b.c.d 的 set
- 这个 set 同时执行了 backTracking, 令 b.draftState.c = { d: 2 }
- 这个 backTraking 又执行了再上一层的 backTraking, 令 a.draftState.b = { c: { d: 2 }}
- 最后返回了 a.draftState，完成了修改链的逐级修改



<br/>

##### 3.3.5 完整代码
可以直接放入浏览器试试效果
```js
const isObject = (val) => Object.prototype.toString.call(val) === '[object Object]';
const isArray = (val) => Object.prototype.toString.call(val) === '[object Array]';
const isFunction = (val) => typeof val === 'function';

// 浅拷贝
function createDraftstate(target) {
  if (isObject) {
    return Object.assign({}, target)
  } else if (isArray(target)) {
    return [...target]
  } else {
    return target
  }
}

const INTERNAL = Symbol('internal')

function produce(targetState, producer) {
  let proxyState = toProxy(targetState)
  producer(proxyState);
  const internal = proxyState[INTERNAL];
  return internal.changed ? internal.draftstate : internal.targetState
}

function toProxy(targetState, backTracking = () => { }) {
  let internal = {
    targetState, // 原始对象
    keyToProxy: {}, // 记录了哪些key被读取了(注意不是修改了)，以及key对应的proxy
    changed: false, // 标记是否被修改
    draftstate: createDraftstate(targetState), // 当前这一环的key的浅拷贝版本
  }
  return new Proxy(targetState, {
    get(_, key) {
      if (key === INTERNAL) return internal
      const val = targetState[key];
      // 只要key被读取了，就把它替换为一个proxy对象
      if (!(key in internal.keyToProxy)) {
        internal.keyToProxy[key] = toProxy(val, () => {
          internal.changed = true;
          const proxyObj = internal.keyToProxy[key];
          // 将修改后的值赋给自己
          internal.draftstate[key] = proxyObj[INTERNAL].draftstate;
          backTracking()
        })
      }
      return internal.keyToProxy[key]
    },
    set(_, key, value) {
      internal.changed = true;
      // 最终的拷贝对象其实是由所有draftstate组成
      internal.draftstate[key] = value
      backTracking()
      return true
    }
  })
}


const originalState = {
  name: 'John',
  age: 30,
  locate: {
    address: 1,
    arr: [0, 1]
  }
};

const newState = produce(originalState, function (draft) {
  draft.age = 31; // 注意set不会触发get
  draft.locate.address = 2;
  draft.locate.arr[0] = 1;
  // delete draft.name; 这个还没实现
});


console.log('Original State:', originalState);
console.log('New State:', newState);
```

<br/>



<br/>


### 参考资料
- [深拷贝浅拷贝的区别？如何实现一个深拷贝？](https://github.com/febobo/web-interview/issues/56)
- [每天都在用，也没整明白的 React Hook](https://juejin.cn/post/7200669128289501239)
- [JavaScript 如何完整实现深度Clone对象？](https://www.zhihu.com/question/47746441/answer/107513878)
- [详聊immer.js高效复制与冻结"对象"的原理于局限性](https://segmentfault.com/a/1190000042282263)