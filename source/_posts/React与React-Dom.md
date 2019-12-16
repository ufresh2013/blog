---
title: React与React-Dom API
date: 2019-08-07 17:29:45
category: React
---
#### 1. React API
React是React库的入口，通过script, import等方法，可以获得React的顶层API。
```js
import React from 'react'
```

#### 1.1 定义组件
使用React组件可以将UI拆分为独立且复用的代码片段，每部分都可独立维护。你可以通过`React.Component` 或 `React.PureComponent` 来定义React组件。
```js
class Greeting extends React.Component {
  render() {
    return <h1>{this.props.name}</h1>
  }
}
```

如果你的函数组件在给定相同props的情况下渲染相同的结果，那么你可以通过将其包装在`React.memo`中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
```js
const MyComponent = React.memo(function MyComponent(props){
  // ...
})
``` 

#### 1.2 创建元素
我们一般使用JSX来编写UI组件。实际上，每个JSX元素都是调用`React.createElement()`的语法糖。如果你使用了JSX，就不需要调用这个方法。
```js
// 创建元素
React.createElement(type, [props], [...children])

// 克隆元素
React.cloneElement(element, [props], [...children])

// 验证对象是否为React元素
React.isValidElement(object)

// 提供了用于处理this.props.children不透明数据结构的方法
React.Children.map(children, function([thisArg]))
```


#### 1.3 Fragments
`<React.Fragment></React.Fragment>`，简写语法`<></>`，组件能够在不额外创建DOM元素的情况下，让render()方法返回多个元素。

#### 1.5 Refs
`React.createRef`创建一个能够通过ref属性附加到React元素的ref
React.forwardRef

#### 1.6 Suspense
使得组件可以等待某些操作结束后，再进行渲染。
React.lazy
React.Suspense


#### 1.7 Hook


<br/>
### 2. React-Dom API