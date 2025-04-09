---
title: Object.defineProperty和proxy实现响应式
date: 2018-11-14 15:47:27
category: JS
---

### 1. MVVM
MVVM拆开来即为Model-View-ViewModel，由View，ViewModel，Model三部分组成。它目的在于更清楚地将用户界面（UI)的开发与应用程序中业务逻辑和行为的开发区分开来。

<img src="1.png" style="max-width: 400px">
**Model**
数据层
是对现实世界中事物的抽象结果，就是建模。

**View**
用户操作界面
负责将数据模型转化为UI展现出来。

**ViewModal**
业务逻辑层
View需要什么数据，ViewModel要提供这个数据；View有哪些些操作，ViewModel就要响应这些操作




### 2. 数据驱动
对于 View 来说，如果封装得好，一个UI组件能很方便地给大家复用。对于 Model 来说，它其实是用来存储业务的数据的，如果做得好，它也可以方便地复用。那么，ViewModel有多少可以复用？结论是：*非常难复用*。

ViewModel做的什么？就是写那些不能复用的业务代码。当交互复杂，一个数据的改变引起多处DOM的修改。ViewModel将变得*十分臃肿*。
```js
  message = 1;
  document.getElementById('message').innerHTML = message;
  document.getElementById('aboumessage').innerHTML = message;
  // ... 更多复杂的交互
```

怎么简化ViewModel？*数据驱动: 数据的变更触发DOM的变化*。
我们希望，只执行`this.$data.message = 1`就可以触发与`message`相关的UI更新。
```js
  this.$data.message = 1
```

> 所谓数据驱动，是指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据。它相比我们传统的前端开发，如使用 jQuery 等前端库直接修改 DOM，大大简化了代码量。特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清晰，因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用碰触 DOM，这样的代码非常利于维护。




### 3. Object.defineProperty
Vue实现数据驱动的核心是利用了ES5的Object.defineProperty。

[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/definePropert)方法会直接在一个对象上定义一个新属性，或修改一个对象的现有属性，并返回这个对象。利用 Object.defineProperty 给数据添加了 getter 和 setter，可以使我们在访问数据以及写数据的时候能自动执行一些逻辑。

```js
Object.defineProperty(obj, 'text', {
  set: function(newVal) {
    updateUI();
  }
})
obj.text = 1; // 会触发updateUI()
```
Vue采用这种数据劫持的方式，通过Object.defineProperty()方法来劫持 data 所有对象的 setter，使得data发生变动时能自动执行 重新编译模板。



#### 3.1 实现Demo
{% raw %}
<input id="input">
<span id="span"></span>

<script>
  const obj = {};
  Object.defineProperty(obj, 'text', {
    get: function() {
    },
    set: function(newVal) {
      console.log('set val:' + newVal);
      document.getElementById('input').value = newVal;
      document.getElementById('span').innerHTML = newVal;
    }
  });

  const input = document.getElementById('input');
  input.addEventListener('keyup', function(e){
    obj.text = e.target.value;
  })
</script>
{% endraw %}

```html
<input id="input">
<span id="span"></span>

<script>
  const obj = {};
  Object.defineProperty(obj, 'text', {
    get: function() {
    },
    set: function(newVal) {
      console.log('set val:' + newVal);
      document.getElementById('input').value = newVal;
      document.getElementById('span').innerHTML = newVal;
    }
  });

  const input = document.getElementById('input');
  input.addEventListener('keyup', function(e){
    obj.text = e.target.value;
  })
</script>
```
<img src="3.png">



#### 3.2 检查变化的缺陷
受现代JS的限制
- Vue不允许动态添加根级别的响应式属性
- Vue无法检测到对象属性的添加或删除
你可能需要为已有对象赋值多个新属性，如`Object.assign()`或`_.extend()`，但这样添加到对象上的新属性不会触发更新。这时，可以使用这个实例方法
```js
// this.$set实例方法
this.$set(this.someObject, 'b', 2)

// 创建一个新对象
this.someObject = Object.assign({}, this.someObject, {a: 1, b: 2})
```

- Vue不能检测以下数组的变动：
利用索引直接设置一个数组项时`vm.items[index] = newVal`
修改数组的长度时 `vm.items.length = newLen`
Vue将被监听的数组的变异方法进行了包裹，它们也将会触发试图更新。这些方法包括push, pop, shift, unshift, splice, sort, reverse。相比之下，也有非变异方法，它们不会改变原始数组，而总是返回一个新的数组。这时，可以用新数组替换旧数组。
```js
this.arr = thia.arr.filter((item) => item.key)
```





### 4. proxy
在Vue2.0中，数据双向绑定就是通过`Object.defineProperty`去监听对象的每一个属性，然后在get,set方法中通过发布订阅者模式来实现的数据响应，但是存在一定的缺陷，比如只能监听已存在的属性，对于新增删除属性就无能为力了，同时无法监听数组的变化，所以在Vue3.0中将其换成了功能更强大的`Proxy`。
- Object.defineProperty监听的是对象的每一个属性，而Proxy监听的是对象自身
- 使用Object.defineProperty需要遍历对象的每一个属性，对于性能会有一定的影响
- Proxy对新增的属性也能监听到，但Object.defineProperty无法监听到。

```js
const handler = {
    get: (target, propkey) => {
        console.log(`监听到${propkey}被取啦,值为:${target[propkey]}`);
        return target[propkey];
    },
    set: (target, propkey, value) => {
        if(target[propkey] !== value){
            console.log(`监听到${propkey}变化啦,值变为:${value}`);
        }
        return true;
    }
};
this.data = new Proxy(this.data, handler);
```



### 5. 依赖收集
这看上去很简单，但是它背后又潜藏着几个要处理的问题：

- 怎样只更新和`message`有关的DOM
- 不想在每个 setter 方法里一个个写 DOM操作
- data对象 中key: [virtualDom1, virtualDom2, ...]一一对应？
- 怎样统一收集这个对应关系？


- 我们的数据、方法和DOM都是耦合在一起
- 我们只监听了一个属性,一个对象不可能只有一个属性,我们需要对对象每个属性进行监听

```html
<div>{{ message }}</div>
<input value="{{ message }}" />
```

模板渲染时，渲染到{{ message }}需要读取this.$data.message的值，触发了getter函数。此时，我们可以把message这个变量和{{ message }}所在的元素绑定起来。一个变量就可以对应多个元素，我们
```js
var data = {
  key1: val1,
  key2: val2,
}

var Dep = {
  key1: [virtualDom1, virtualDom2, virtualDom3, ...],
  key1: [virtualDom1, virtualDom4, ...],
}
```

当key1被修改时，setting 根据 Dep 找到跟key1相对应的元素，只更新这一部分的UI。


<img src="2.png">




### 6. 实现MVVM Demo
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Two-way data-binding</title>
</head>
<body>
    <div id="app">
        <input type="text" v-model="text">
        {{ text }}
    </div>
    <script>
        function observe (obj, vm) {
            Object.keys(obj).forEach(function (key) {
                defineReactive(vm, key, obj[key]);
            });
        }
        function defineReactive (obj, key, val) {
            var dep = new Dep();
            Object.defineProperty(obj, key, {
                get: function () {
                    if (Dep.target) dep.addSub(Dep.target);
                    return val
                },
                set: function (newVal) {
                    if (newVal === val) return
                    val = newVal;
                    dep.notify();
                }
            });
        }
        function nodeToFragment (node, vm) {
            var flag = document.createDocumentFragment();
            var child;
            while (child = node.firstChild) {
                compile(child, vm);
                flag.appendChild(child);
            }
            return flag;
        }
        function compile (node, vm) {
            var reg = /\{\{(.*)\}\}/;
            // 节点类型为元素
            if (node.nodeType === 1) {
                var attr = node.attributes;
                // 解析属性
                for (var i = 0; i < attr.length; i++) {
                    if (attr[i].nodeName == 'v-model') {
                        var name = attr[i].nodeValue; // 获取v-model绑定的属性名
                        node.addEventListener('input', function (e) {
                            // 给相应的data属性赋值，进而触发该属性的set方法
                            vm[name] = e.target.value;
                        });
                        node.value = vm[name]; // 将data的值赋给该node
                        node.removeAttribute('v-model');
                    }
                }
                new Watcher(vm, node, name, 'input');
            }
            // 节点类型为text
            if (node.nodeType === 3) {
                if (reg.test(node.nodeValue)) {
                    var name = RegExp.$1; // 获取匹配到的字符串
                    name = name.trim();
                    new Watcher(vm, node, name, 'text');
                }
            }
        }

        function Watcher (vm, node, name, nodeType) {
        //  this为watcher函数
            Dep.target = this;
        //  console.log(this);
            this.name = name;
            this.node = node;
            this.vm = vm;
            this.nodeType = nodeType;
            this.update();
            Dep.target = null;
        }
        Watcher.prototype = {
            update: function () {
                this.get();
                if (this.nodeType == 'text') {
                    this.node.nodeValue = this.value;
                }
                if (this.nodeType == 'input') {
                    this.node.value = this.value;
                }
            },
            // 获取daa中的属性值
            get: function () {
                this.value = this.vm[this.name]; // 触发相应属性的get
            }
        }
        function Dep () {
            this.subs = []
        }
        Dep.prototype = {
            addSub: function(sub) {
                this.subs.push(sub);
            },
            notify: function() {
                this.subs.forEach(function(sub) {
                    sub.update();
                });
            }
        };
        function Vue (options) {
            this.data = options.data;
            var data = this.data;
            observe(data, this);
            var id = options.el;
            var dom = nodeToFragment(document.getElementById(id), this);
            // 编译完成后，将dom返回到app中
            document.getElementById(id).appendChild(dom);
        }
        var vm = new Vue({
            el: 'app',
            data: {
                text: 'hello world'
            }
        });
    </script>
</body>
</html>
```


### 参考资料
- [简单理解MVVM--实现Vue的MVVM模式](https://zhuanlan.zhihu.com/p/38296857)
- [被误解的 MVC](https://blog.devtang.com/2015/11/02/mvc-and-mvvm/)
- [Vue.js中的MVVM](https://juejin.im/post/5b2f0769e51d45589f46949e)
- [Vue.js的响应式系统原理](https://juejin.im/post/5b82b174518825431079d473)
- [Vue技术揭秘](https://ustbhuangyi.github.io/vue-analysis/data-driven/)
- [实现双向绑定Proxy比defineproperty优劣如何](https://www.jianshu.com/p/2df6dcddb0d7)
- [使用proxy实现一个双向绑定](https://juejin.im/post/5dc267b15188255f6d42bd1a)
