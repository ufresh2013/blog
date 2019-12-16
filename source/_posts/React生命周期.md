---
title: React生命周期
date: 2019-07-31 15:39:12
category: React
---
> 生命周期，hook函数，允许你在特定阶段执行一些方法的函数。

<br/>
### 1. 什么时候开始调用?
有状态组件，定义组件时并不会触发任何的生命周期函数，真正的生命周期开始于组件被渲染至页面中。无状态组件(纯函数)，因为没有继承`React.Component`，所以无法获得各种生命周期函数，也无法访问state，但能访问作为参数传入的props。


*Question*
当MyComponent组件渲染到页面上时，MyButton组件的生命周期函数会开始调用吗？

*Answer*
`<MyButton />`语法，是JSX语法，实际是转化为`React.createElement(MyButton, null)`的函数调用，返回一个React元素，也就是一个虚拟DOM节点（DOM节点的描述）s，实际是一个纯粹的object对象，基本由key, props, ref, type组成。当我们把React元素传递给`ReactDOM.render`方法，并告诉它在页面上渲染的位置，它才会给我们返回组件的实例(instance)。仅仅生成一个React元素是不会触发声明周期函数调用的。

```js
import MyButton from './Button';
import React from 'react';
import ReactDOM from 'react-dom';

class MyComponent extends React.Component{
  render() {
    // <MyButton>的生命周期函数会开始调用吗？
    const button = <MyButton />
    return <div>hello</div>
  }
}

ReactDOM.render(<MyComponent>, document.getElementById('app'))
```



<br/>


### 2. 三个阶段
#### 2.1 挂载
当组件实例被创建并插入DOM中时，其生命周期调用顺序如下
- constructor
- getDerivedStateFromProps
- render
- componentDidMount

<br/>
#### 2.2 更新
当组件的props或state发生变化时会触发更新。组件更新的生命周期调用顺序如下
- getDerivedStateFromProps 
- shouldComponentUpdate 
- render 
- getSnapshotBeforeUpdate 
- componentDidUpdate


<br/>
#### 2.3 卸载
当组件从DOM中移除之前，会调用
- compoenntWillMount

<br/>
<img src="1.png" />

<br/>
### 3. 生命周期函数
#### 3.1 constructor
在React中，构造函数仅用于：
- 通过给`this.state`赋值对象来初始化内部state（避免将props的值赋值给state）
- 为事件处理函数绑定实例



<br/>
#### 3.2 getDerivedStateFromProps
会在调用render方法之前调用，它会返回一个对象来更新state，如果返回null则不更新任何内容。
```js
static getDerivedStateFromProps(props, state)
```


<br/>
#### 3.3 render


<br/>
#### 3.4 componentDidMount
`componentDidMount`会在组件挂载后(插入DOM树中)立即调用。

当这个函数被调用时，就意味着可以访问组件的原生DOM。此时不仅能访问当前组件的原生DOM，还能访问当前组件子组件的原生DOM。网络请求获取数据，依赖于DOM节点的第三方插件初始化，应在这里执行。

<img src="3.png" />
<br/>
`componentWillMount`和`render`的调用顺序是
```
A -> A.0 -> A.0.0 -> A.0.1 -> A.1 -> A.2.
```

`componentDidMount`的调用顺序是
```
A.2 -> A.1 -> A.0.1 -> A.0.0 -> A.0 -> A
```





<br/>
#### 3.5 shouldComponentUpdate
可以将`this.props`与`nextProps`，以及`this.state`与`nextState`进行比较，并返回false以告知React可以跳过更新，默认为true。

不要企图依靠此方法来阻止渲染，因为这可能产生bug。你应该考虑使用内置的`PureComponent`组件, 来减少不必要的更新。
```js
shouldComponentUpdate(nextProps, nextState)

```

<br/>
#### 3.6 componentWillUnmount
当组件从DOM中移除之前，会调用`compoenntWillMount`。在此方法中执行必要的清理操作，例如，清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等。


<br/>
### 5. 其他
#### 5.1 this.setState

<br/>
#### 5.2 this.forceUpdate
默认情况下，当组件的state或props发生变化时，组件将重新渲染。如果render()方法依赖于其他数据，则可以调用forceUpdate()强制让组件重新渲染。
```js
this.forceUpdate(callback)
```

<br/>
#### 5.3 Component.defaultProps
`defaultProps`可以为Class组件添加默认props。用于props未赋值，但又不能为null的情况。

constructor的下一生命周期，是getDefaultProps 和 getInitialState，这两个函数只在es5语法中才暴露出来，在es6中通过两个赋值函数实现了同样的效果。
```js
class App extends React.Component{
  constructor(props) {
    super(props);
    // es6中的 this.state = {} 相当于es5中的 getInitialState
    this.state = {
      counts: 0
    }
  }

  render() {
    return <div>{this.props.name}</div>
  }
}

// es6中的 defaultProps 相当于 es5中的 getDefaultProps
App.defaultProps = { name: 'default' }
```

*Question*
设置了`App.defaultProps = { name: 'default' }`后, `<App name={null} />` 和 `<App name={undefined} />`两种状况下，this.props.name的输出值是多少？

*Answer*
1.null  2. default

<br/>
### 参考资料
- [React.Component](https://react.docschina.org/docs/react-component.html)
- [生命周期图谱](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- [深入React的生命周期(上)：出生阶段(Mount)](https://zhuanlan.zhihu.com/p/30757059)
- [深入React的生命周期(下)：更新(Update)](https://zhuanlan.zhihu.com/p/30971608)
