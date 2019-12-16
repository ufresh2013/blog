---
title: React
date: 2019-05-29 17:27:47
category: React
---

> 传统DOM操作关注太多细节；应用程序状态分散在各处，难以追踪和维护。为了解决这些问题，React提供了以下方案来解决这些问题：1. **允许用组件描述UI**，解决UI细节问题； 2. **单向数据流**，以state为基础来产生UI，始终整体刷新。


<br/>
### 1. React组件
React组件可以理解为一个纯函数`props + state = View`。React组件尽量无状态，所需数据通过props获取。
```js
// 表单元素状态由使用者维护
<input
  type="text"
  value={this.state.value}
  onChange={evt => this.setState({ value: evt.target.value })}
/>

// 表单元素状态DOM自身维护
<input
  type="text"
  ref={node => this.input = node}
/>
```



<br/>
### 2. JSX
与vue自定义的一套模板不同，jsx不是模板语言，只是一种语法糖 —— 在js代码中直接写HTML标记。当遇到*`<`*就当HTML解析,遇到*`{`*就当js解析。
```js
// jsx本身也是表达式
const props = {firstName: 'Ben', lastName:'Mike'};
const element = <h1>hello, world</h1>;

// 表达式作为子元素
const element = <li>{props.message}</li>;

// 在属性中可以使用表示式
<MyComponent foo={ 1 + 2 + 3 } />
<Greeting {...props} />
```


<br/>
### 3. 生命周期
**constructor**
标准js类的构造函数，用于初始化内部状态。
```js
export default class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
}
```

**getDerivedStateFromProps**
从props初始化内部state状态可使用（不推荐使用），每次render都会调用

**getSnapshotBeforeUpdate**
在页面render之前调用，state已更新，但真实DOM未更新，用来获取render之前的DOM状态

**componentDidMount**
UI渲染完成后调用，只执行一次，此处可以发起ajax请求

**componentDidUpdate**
每次UI更新时被调用，props有修改的时候，可以捕获从而根据props数据发请求

**componentWillUnmount**
组件移除时被调用，资源释放，如消除setInterval

<br/>


<br/>
### 4. Virtual DOM
Virtual DOM是jsx的运行基础。React组件在内部维护了一套Virtual DOM的状态，这套虚拟状态最终会映射到真实的DOM节点。虚拟DOM状态发生变化时，会diff Virtual DOM, 最小化真实DOM的修改。

虚拟DOM的两个假设： 组件的DOM结构是相对稳定的；类型相同的兄弟节点可以被唯一标识。

<br/>
### 5. 组件复用
组件复用的两种形式：高阶组件和函数作为子组件。

高阶组件
是对已有组件的封装，接受组件作为参数，返回新的组件。高阶组件可以自己获取外部资源，处理后传递给组件。这时候，这个组件的数据就有两个来源，一个是父组件props，一个是高阶组件传进来的数据。（待填坑）

<br/>
### 6. Context API
共享全局状态, 根节点提供所有的上下文数据，子节点通过context API获取全局状态。当Provider的值发生变化时，下面所有Consumer都会发生变化。

