---
title: React16
date: 2021-08-03 13:19:16
category: React
---
> 浏览网页时，有两种情况会制约快速响应，
1. **CPU瓶颈**：当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
2. **IO瓶颈**：发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

<br/>

### 1. CPU瓶颈
主流浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次。

在每16.6ms时间内，需要完成：*JS脚本执行 -----  样式布局 ----- 样式绘制*

当JS执行时间过长，超出了16.6ms，这一帧里就没有时间执行样式布局和样式绘制，导致页面掉帧卡顿。

为了解决这个问题，React将同步的更新变成可中断的异步更新。在浏览器每一帧的时间中，预留5ms给JS线程用来更新组件。当预留的时间不够用时，React将线程控制权交还给浏览器使其有时间渲染UI，然后等待下一帧到来继续被中断的工作。

<br/>

### 2. IO瓶颈
React实现了Suspense (opens new window)功能及配套的hook——useDeferredValue

<br/>

### 3. 老的React15
React15架构可以分为两层：**Reconciler（协调器）**负责找出变化的组件；**Renderer（渲染器）**负责将变化的组件渲染到页面上。当调用*`this.setState`*、*`this.forceUpdate`*、*`ReactDOM.render`*触发更新时, React会
- 调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM
- 将虚拟DOM和上次更新时的虚拟DOM对比
- 通过对比找出本次更新中变化的虚拟DOM
- 通知Renderer将变化的虚拟DOM渲染到页面上
- Renderer将变化的组件渲染在当前宿主环境。

一旦更新，React都会递归更新子组件。由于递归执行，一旦开始了，中途就无法中断。

<br/>

### 4. React16
React16架构可以分为三层：
- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

<br/>

### 5. Fiber
每个`Fiber节点`对应一个`React Element`，保存了该组件的类型、DOM节点信息、本次更新中该组件改变的状态，要执行的工作。
```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag; // 组件的类型 Function/Class/Host
  this.key = key; // key属性
  this.elementType = null; // 
  this.type = null;
  this.stateNode = null; // Fiber对应的真实DOM节点

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null; // 指向父级Fiber节点
  this.child = null; // 指向子Fiber节点
  this.sibling = null; // 指向右边第一个兄弟Fiber节点
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```
举个例子
```js
function App () {
  return <div>i am <span>monkey</span></div>
}
```
对应的`Fiber`数结构
<img src="1.jpg"/>


*JSX与Fiber的关系*
JSX是一种描述当前组件内容的数据结构，他不包含组件schedule、reconcile、render所需的相关信息。

比如如下信息就不包括在JSX中：
- 组件在更新中的优先级
- 组件的state
- 组件被打上的用于Renderer的标记
这些内容都包含在Fiber节点中。



<br/>

### 6. 双缓存
那么Fiber树和页面呈现的DOM树有什么关系，React又是如何更新DOM的呢？

当我们用canvas绘制动画，每一帧绘制前都会调用`ctx.clearRect`清除上一帧的画面。如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。这种在内存中构建并直接替换的技术叫做*双缓存*。

<br/>



### 参考资料
- [React技术揭秘](https://react.iamkasong.com/)