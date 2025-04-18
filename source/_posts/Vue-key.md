---
title: Vue Dom Diff(v-for为什么要加key)
date: 2019-12-16 08:52:44
category: JS
---
> key 的作用主要是给 VNode 添加唯一标识，通过这个 key，可以更快找到新旧 VNode 的变化，从而进一步操作。

### 1. 原生DOM vs 虚拟DOM
这是一个性能 vs. 可维护性的取舍。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。针对任何一个 benchmark，我都可以写出比任何框架更快的手动优化，但是那有什么意义呢？在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。



#### 虚拟DOM的作用
虚拟DOM就是一个用来描述真实DOM的javaScript对象。

Virtual DOM的主要思想就是模拟DOM的树状结构，在内存中创建保存映射DOM信息的节点数据。视图需要更新时，先对节点数据进行diff后得到差异结果后，再一次性对DOM进行批量更新操作。

- 跟踪视图状态，比较前后两次DOM更新真实DOM，减少操作DOM的范围
- 跨平台使用：浏览器渲染，服务器渲染，小程序等




### 2. Diff算法
- 使用`h()`函数创建JS对象(VNode)描述真实DOM
- 创建`patch()`比较新旧两个VNode
    - `patch(oldVNode, newVnode)`
    - 按层级diff，而非深度优先遍历
    - 比较新旧节点是否相同节点（key, sel相同），如果不是相同节点，删除之前的，重新渲染；如果是相同节点，判断VNode是否有text，有直接更新text文本内容
    - 新老节点有children属性且不等，走updateChildren
- 把变化的内容更新到真实DOM树



#### *2.1 按层级diff，而非深度优先遍历*
UI中很少出现DOM的层级结构因为交互而产生更新。因此VirtualDOM的diff策略是在新旧节点树之间按层级进行diff得到差异，而非传统的按深度遍历搜索。
<img src="1.png">



#### *2.2 不同类型的节点，会创建新的VirtualDom替换旧的*
VirtualDOM中的节点数据对应的是一个原生DOM节点，或者vue/react中的一个组件。不同类型的节点往往相差很大，当节点类型发生改变时，则不进行子树的比较，直接创建新类型的VirtualDOM，替换旧节点。
<img src="2.png">

```js
// snabbdom.js
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function patch(oldVnode, vnode) {
    // ...
    // 相同类型的Vnode，比较后更新
    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode)
    } else {
    // 不同类型的Vnode，创建新的节点，替换旧的节点
        elm = oldVnode.elm
        parent = api.parentNode(elm)
        createElm(vnode)
        if (parent !== null) {
            api.insertBefore(parent, vnode.elm, api.nextSibling(elm))
            removeVnodes(parent, [oldVnode])
        }
    }

    // ...
}
```



#### *2.3 新旧节点都有children且不等，走updateChildren*
- oldStartVnode/newStartVnode(旧开始节点/新开始节点)相同
- oldEndVnode/newEndVnode(旧结束节点/新结束节点)相同
- oldStartVnode/newEndVnode(旧开始节点/新结束节点)相同
- oldEndVnode/newStartVnode(旧结束节点/新开始节点)相同
- 特殊情况当1,2,3,4的情况都不符合的时候就会执行,在oldVnodes里面寻找跟newStartVnode一样的节点然后位移到oldStartVnode,若没有找到在就oldStartVnode创建一个



#### 优化列表更新性能
当被diff的节点处于同一层级时，可以执行 插入、移动和删除三种操作。同时提供用户设置key属性的方式调整排序。
<img src="3.png">

下面看看snabbdom怎么处理这个*`key`*值。
(snabbdom仅有300行代码，被vue2.0收入来实现DOM比较和更新)

#### 列表头插入元素
发现oldCh里没有当前newCh中的节点，将新节点插入到oldStartVnode的前边。
<img src="4.png" style="max-width: 500px; margin-top: 20px">




#### 列表重新排序
如果oldCh中有这个key值，就对旧节点进行更新，再将其插入到当前的oldStartVnode的前面。
```js
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch
    for( i = beginIdex; i < endIdx; ++i) {
        ch = children[i]
        if (ch != null) {
            key = ch.key
            if (key !== undefined) {
                map[key] = i
            }
        }
    }
    return map
}

function updateChild(parentElm, oldVnode, vnode) {
    var oldCh = oldVnode.children
    var ch = vnode.children

    var oldStartIdx = 0, newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];

    var oldKeyToIdx; // { key1: index1, key2: index2 } key值: 在旧列表中的索引
    var idxInOld;
    var elmToMove;

    while (oldStartIdx <= oldEndInx && newStartIdx <= newEndIdx) {
        if (sameVnode(...)) {

        } else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            }

            idxInOld = oldKeyToIdx(newStartVnode.key)

            if (isUndef(idxInOld)) {
                // 旧列表没有这个key
                // insertBefore(parentNode, newNode, referenceNode)
                api.insertBefore(parentElm, createElm(newStartVnode), oldStartVnode.elm)
                newStartVnode = newCh[++newStartIdx]
            } else {
                // 旧列表有这个key
                elmToMove = oldCh[idxInOld] // 找到要移动的elem
                oldCh[idxInOld] = undefined
                api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm)
            }
        }
    }
}
```



### 3. Key
*v-for为什么要加Key?*
- Diff操作更加快速
- Diff操作更加准确（避免渲染错误）

#### 3.1 Diff操作更加快速
当递归DOM节点的子元素时，Vue会同时遍历两个子元素的列表，当产生差异时，生成一个DOM操作。
在列表末尾新增元素时，变更开销比较小。Vue遍历列表，发现前两个元素没变，然后插入第三个元素。
在列表头部插入时，Vue依次遍历下来，会针对每个子元素都生成了DOM操作。

**明明移动节点就可以解决问题，却变成了DOM节点不断地删除和重建！**
```html
<ul>
    <li>first</li>
    <li>second</li>
</ul>

<ul>
    <li>zero</li>
    <li>first</li>
    <li>second</li>
</ul>
```
这种情况多数出现在`v-for`。
出现`v-for`时， Vue会认为又有更新列表的操作了！
**这个列表DOM更新的性能问题又要出现了！**
这时，控制台会提醒我们: 加个*`key`*啊！！！！！

```html
<ul>
    <li key="1">first</li>
    <li key="2">second</li>
</ul>

<ul>
    <li key="0">zero</li>
    <li key="1">first</li>
    <li key="2">second</li>
</ul>

```
`key`这个属性不是给用户用的，而是给Vue自己用的。Vue需要判断，对数组中的每一项，到底是新建一个元素加入到页面中，还是更新原来的元素。从而避免组件被不必要地重建。


#### 3.2 避免渲染错误
因为没有设置key,默认都是undefined,所以节点都是相同的,更新了text的内容但还是沿用了之前的dom,所以实际上a->z(a原本打勾的状态保留了,只改变了text)






### 4. 注意
- 开发者可以通过key prop来暗示哪些子元素在不同的渲染下能保持稳定。Key应该具有稳定，可预测，以及列表内唯一的特质。不稳定的key(通过`Math.random()`生成的)会导致许多组件实例和DOM节点被不必要地重新创建，可能会导致性能下降和子组件中的状态丢失。
- 【真实情景】上传多张发票，上传后自动识别发票数据，用户可以修改数据。点击图片，切换发票数据的修改。这时需要给`<form>`添加`key`值，否则在切换时，Vue会认为这是同一个组件。会把一些校验提示带到下一个发票表单。



### 参考资料
- [探索Virtual DOM的前世今生](https://juejin.im/post/5b0638a9f265da0db53bbb6d)
- [React Diff算法](https://zh-hans.reactjs.org/docs/reconciliation.html)
- [snabbdom](https://github.com/snabbdom/snabbdom)
- [让虚拟DOM和DOM-diff不再成为你的绊脚石](https://juejin.im/post/5c8e5e4951882545c109ae9c)
- [React 实践心得：key 属性的原理和用法](https://fed.taobao.org/blog/taofed/do71ct/react-key/?spm=taofed.blogs.blog-list.9.29eb5ac8BdaVc1)
- [网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？](https://www.zhihu.com/people/111111-80-11-31)