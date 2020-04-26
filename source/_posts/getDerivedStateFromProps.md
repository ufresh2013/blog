---
title: React 你可能不需要派生的state
date: 2019-07-24 10:45:11
category: Bug
---
### 1. 实现需求
- 子组件是个弹框
- 父组件通过props可以控制弹框出现
- 弹框内有一个关闭按钮，可以令弹窗消失


<br/>
### 2. 出现Bug
使用*`getDerivedStateFromProps`* 让组件在props变化时更新state。但实际上只要腹肌重新渲染时，这个生命周期函数就会重新调用，不管 *`props`* 有没有变化。因此会出现下面的bug。

操作                | props   |  state
---|:--:|---:
父组件点击显示弹窗    | true    | true
子组件关闭弹窗后      | true    | false
父组件执行render函数  | ture    | true   (此时，没有点击显示弹窗，弹窗会自动弹出)


如果父组件重新渲染，在子组件修改的所有state都会丢失。这时，`visible`不是一个单一来源的值，导致state没有正确渲染。直接将props直接复制到state是不安全的。任何数据，都应保证只有一个数据来源，而且避免直接复制它。[官方示例](https://codesandbox.io/s/mz2lnkjkrx)


<br/>
### 3. 解决方法
#### 3.1 完全可受控组件
从组件里删除state，变量只受`props`控制，调用父组件方法修改值。
```js
function EmailInput(props) {
  return <Input onChange={props.onChange} value={props.email} />
}
```


<br/>
#### 3.2 有key的非可控组件
让组件自己存储临时的email state，但组件可以从`props`接收初始值，但更改之后的值就与props无关。
```js
class EmailInput extends React.Component {
  state = { email: this.props.defaultEmail }

  handleChange = event => {
    this.setState({ email: event.target.value })
  }

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />
  }
}

```

当父组件需要改变state的值时，我们可以使用`key`这个特殊的React属性。当`key`变化时，React会创建一个新的而不是更新一个既有的组件。每次key变化，表单里的所有组件都会用新的初始值重新创建。大部分情况下，这是处理state的最好办法。

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
>
```


<br/>
#### 3.3 getDerivedStateFromProps
但有时组件初始化的开销太大，一个麻烦但可行的方案是在`getDerivedStateFromPorps`观察`userID`的变化。这样可以确认state的值，是通过父组件修改的，再做对应的处理。
```js
class EmailInput extends React.Component {
  state = {
    email: this.props.defaultEmail,
    prePropUserID: this.props.userID
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userID !== state.prevPropsUserID) {
      return {
        email: props.defaultEmail,
        prevPropsUserID: props.userID
      }
    }
    return null;
  }
}
```


<br/>
#### 3.4 ref调用子组件方法
注意，不能ref高阶组件(connect到redux的组件)


<br/>
### 参考文档
- [React文档-你可能不需要使用派生state](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)
