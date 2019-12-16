---
title: JS设计模式，观察者模式(Event Bus)
date: 2019-09-14 13:46:38
category: JS
---
### 1. 基本概念



### 2. 设计模式
#### 2.1 工厂模式
jQuery是一个类，`$('div')`是一个实例。 工厂模式需要定义一个creator `$`, 来创建实例。这样可以直接调用`$('div')`， 而不用`new jQuery('div')`。
```js
class jQuery {
    constructor(selector) {
        let slice = Array.prototype.slice
        let dom = slice.call(document.querySelectorAll(selector))
        let len = dom ? dom.length : 0
        for (let i = 0; i < len; i++) {
            this[i] = dom[i]
        }
        this.length = len
        this.selector = selector || ''
    }
    append(node) {}
    addClass(name) {}
    html(data) {}
}

// creator
window.$ = function (selector) {
    return new jQuery(selector)
}
```
React.creteElement创建虚拟DOM。工厂模式使得构造函数和创建者分离。
```js
class Vnode(tag, attrs, children){
    // ...
}

React.createElement = function(tag, attrs, children) {
    return new Vnode(tag, attrs, children)
}
```

<br/>
#### 2.2 单例模式
确保一个类只有一个实例。
```js
// 多次引入jquery，但其实只会有一个jQuery被初始化
if (window.jQuery !== null) {
    return window.jQuery
} else {
    // 初始化...
}
```
单例模式需要在定义一个获取唯一实例的方法，确保多次调用的是同一个实例。如：React中的store也是只允许有一个实例。
```js
class SingleObject {
    login() {
        console.log('login')
    }
}

SingleObject.getInstance = (function() {
    let instance;
    return function() {
        if (!instacne) {
            instance = new SingleObject;
        } else {
            return instance;
        }
    }
})()

let obj1 = SingleObject.getInstance();
let obj2 = SingleObject.getInstance();
console.log(obj1 === obj2);     // true
```


<br/>

#### 2.3 适配器模式
Vue中的computed属性，获取当前信息，处理后来适配页面需要。
```html
<p>{{ msg }}</p>
<p>{{ reversedMsg }}<p>
<script>
    var vm = new Vue({
        el: '#app',
        data: {
            msg: 'hello'
        },
        computed: {
            reversedMsg: function() {
                return this.msg.split('').reverse().join('');
            }
        }
    })
</script>
```

<br/>
#### 2.4 装饰器模式
为对象添加新功能，不改变其原有的结构和功能。第三方库[core-decorators](https://github.com/jayphelps/core-decorators)
```js
function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor
}

class Person {
    constructor() {
        this.name = 'A'
    }

    @readonly
    name() {
        return `${this.name}`
    }
}

let p = new Person();
p.name = function() { alert(100) }   // 报错，p.name是只读
```

<br/>
#### 2.5 代理模式
使用者无权访问目标对象，中间加代理，通过代理做授权和控制。
```js
// 明星
let star = { name: '张XX', phone: '13910733521',}

// 经纪人
let agent = new Proxy(star, {
    get: function (target, key) {
        // 允许取值前操作
        return target[key]
    },
    set: function (target, key, val) {
        // 允许赋值前操作
        target[key] = val;
    }
})
```

<br/>
#### 2.6 观察者模式
Event Bus
常见场景：网页事件绑定， promise， jquery callbacks, nodejs自定义事件
```js
// 发布者
class Subject {
  constructor() {
    this.state = 0;
    this.observers = [];
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  attach(observer) {
    this.observers.push(observer);
  }

  notifyAllObservers() {
    this.observers.forEach(observer => {
      observer.update();
    });
  }
}

// 订阅者
class Observer {
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attach(this);
  }

  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`);
  }
}

let s = new Subject();
let o1 = new Observer("o1", s);
let o2 = new Observer("o2", s);

s.setState(1);
```

nodejs自定义事件
```js
const EventEmitter = require('events').EventEmitter;

class Dog extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }
}

let simon = new Dog('simon');
simon.on('bark', () => { console.log(`${this.name} bark`)})
simon.on('bark', () => { console.log(`${this.name} another bark`)})
simon.emit('bark');
```

<br/>
#### 2.7 迭代器模式
顺序访问一个集合。ES6中有序集合的数据类型有很多: Array, Map, Set, String, TypedArray, arguments, NodeList，需要一个统一的遍历接口来遍历这些数据类型。
```js
let arr = [1, 2, 3, 4]
let nodeList = document.getElementsByTagName('p')
let m = new Map()
m.set('a', 100)
m.set('b', 200)

function each(data) {
    let iterator = data[Symbol.iterator](); // es6中上面这些数据类型都有这个属性
    
    let item = { done: false };
    while(!item.done) {
        item = iterator.next();
        if (!item.done){
            console.log(item.value)
        }
    }

    // es6中直接使用 for..of..不用自己定义迭代器
    // for ( let item of data ) {
    //     console.log(item)
    // }
}

each(arr)
each(nodeList)
each(m)
```

<br/>
#### 2.8 其他模式
- 状态机模式：一个对象有状态变化，每次状态变化都会触发一个逻辑，如Promise


### 参考资料
- [Vue 组件通信之 Bus](https://juejin.im/post/5a4353766fb9a044fb080927)