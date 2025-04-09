---
title: React Class 组件 & 组件传值 & 生命周期
date: 2019-06-21 17:23:14
category: JS
---

### 1. 常用组件

组件允许你将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思。组件，从概念上类似于 Javascript 函数。它接受任意的入参(props)，并返回用于描述页面展示内容的 React 元素。

```js
// DOM标签
const element = <div>hello</div>;

// 自定义组件
const element1 = <Welcome name="Sara"></Welocme>

// class组件
class Welcome extends React.Component {
  render() {
    return <h1>hello, {this.props.name}</h1>
  }
}

// 函数组件: 定义组件最简单的方式就是编写javascript函数
function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
    </div>
  )
}
```

#### 1.1 条件渲染

- 与运算符 &&

```js
function Mailbox(props) {
  const unreadMessage = props.unreadMessage;
  return (
    <div>
      {unreadMessage.length > 0 && (
        <h2>you have {unreadMessage.length} unread message.</h2>
      )}
    </div>
  );
}
```

- 三目运算符

```js
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutBtn />
      ) : (
        <LoginBtn />
      )}
    </div>
  )
}
```

#### 1.2 列表渲染

*`Array.map`*实现列表渲染，key 帮助 React 识别哪些元素改变了，比如被添加或删除。数组元素中使用的 key 在其兄弟节点之间应该是独一无二的。然而，它们不需要是全局唯一的，当我们生成两个不同的数组时，我们可以使用相同的 key。

```js
function NumberList(props) {
  const items = props.items;
  return (
    <ul>
      {items.map(item, index) =>
        <li key={item.id}>{item.text}</li>
      }
    </ul>
  )
}
```

#### 1.3 表单组件

表单元素的工作方式和其他的 DOM 元素有些不同，表单元素通常会保持一些内部的 state。

```html
// 表单元素状态由使用者维护 <input type="text" value={this.state.value}
onChange={(e) => this.setState({ value: e.target.value })} />

<select value="{this.state.value}" onChange="{this.handleChange}">
  <option value="1">1</option>
  <option value="1">1</option>
</select>

// 表单元素状态DOM自身维护 <input type="text" ref={node => this.input = node} />
```



#### 1.4 props.children

有些组件无法提前知道它们子组件的具体内容。通过*`props.children`*可以将他们的子组件渲染到结果中。

```js
function FancyBorder(props) {
  return <div className={'FancyBorder-' + props.color}>{props.children}</div>;
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1>welcome</h1>
      <p>Thank for coming!</p>
    </FancyBorder>
  );
}
```

#### 1.5 React.lazy 与 Suspense

`React.lazy`能让你像渲染常规组件一样处理动态引入。你可以将`Suspense`组件置于懒加载组件之上的任何位置，`fallback`属性接受任何在组件加载过程中你想展示的 React 元素。

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
        <AnotherComponent />
      </Suspense>
    </div>
  );
}
```

配合 React Router,基于路由进行代码分割

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Route>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
)
```


#### 1.6 Fragments
React常常是一个组件返回多个元素，Fragments允许你将子列表分组，而无需向DOM添加额外节点。
```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
    </React.Fragment>
  )
}

// 短语法：空标签
return (
<>
<td>hello</td>
<td>world</td>
</>
)

````


#### 1.7 高阶组件
- 在挂载时，想DataSource添加一个更改侦听器
- 在侦听器内部，当数据源发生变化时，调用setState
- 在卸载时，删除侦听器
```js
const CommentListWithSubscription = withSubscription(
  CommonList,
  (DataSource) => DataSource.getComments()
)

function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectData(DataSource, props)
      }
    }

    componentDidMount() {
      DataSoure.addChangeListener(this.handleChange)
    }

    componentWillUnmout() {
      DataSource.removeChangeListener(this.handleChange)
    }

    handleChange = () =>{
      this.setState({
        data: selectData(DataSource, this.props)
      })
    }

    return() {
      return <WrappedComponent data={this.state.data} {...this.props}>
    }
  }
}
````


#### 1.8 在一个模块中导出多个多组件

### 2. 结合redux
| 展示组件 | 容器组件
---|:--:|---:
定义         | 不关心数据来源和如何变化，传入什么就渲染什么  | 监听redux store变化并过滤出要显示的数据
作用         | 描述如何展示（骨架、样式）| 描述如何运行（数据获取、状态更新）
直接使用Redux | 否                    | 是
数据来源      | props                 | 监听Redux state
数据修改      | 从props调用回调函数     | 向Redux派发actions
调用方式      | 手动                  | 通常由React Redux生成

#### 2,1 无状态组件

使用函数式无状态组件，如果需要使用本地 state, 生命周期方法，性能优化，可以将它们转成 class。
技术上你可以直接使用`store.subscribe()`来编写容器组件，但不建议这样做，应使用 React Redux 的`connect()`方法生成容器组件。

```js
const Todo = ({ onClick, completed, text }) => (
  <li onClick={onClick} style={{ color: completed ? 'green' : 'red' }}>
    {text}
  </li>
);

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map((todo, index) => (
      <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
    ))}
  </ul>
);

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a
      href=""
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};
```


#### 2.2 有状态组件
有状态组件，就是使用`store.subscribe()`从Redux state树中读取部分数据，并通过props来把这些数据提供给要渲染的组件。但建议使用React Redux库的`connect()`来生成，这个方法做了避免了很多不必要的重复渲染。
```js
class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Header />
  }
}
```


#### 2.3 全局组件
通过`Message.error('错误')`来显示组件。


### 3. 组件传值
#### 3.1 共同父组件
状态提升，将多个组件中需要共享的state向上移动到他们的最近共同父组件中，便可实现共享state

```js
class Parent extends React.Component {
  state = {
    scale : ''
  }

  handleChange(val) => {
    this.setState({scale: val})
  }

  render() {
    const { scale } = this.state;
    return (
      <ChildOne scale={scale} onScaleChange={this.handleChange} />
      <ChildTwo scale={scale} onScaleChange={this.handleChange} />
    )
  }
}
```

使用下面技巧，可以减少 props 的传递

```js
function Page(props) {
  const { user } = props;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={useLink} />;
}
```


#### 3.2 Context 公用属性
React中数据是通过props属性自上而下(由父及子)进行传递的，但这种做法对于某些类型的属性而言是极其繁琐的（如：地区偏好，UI主题），这些属性是应用程序中许多组件都需要的。Context提供了一种在组件之间共享此值的方式，而不必显示地通过组件树的逐层传递props。



#### 3.3 Refs
将DOM Refs暴露给父组件。你希望在父组件汇总引用子节点的DOM节点。
不能Ref高阶组件（connect到redux的HOC组件），ref出来的会是高阶组件，不是本组件。
```js
class Child extends React.Component{
  state = {
    visible: false,
  }

showModal() {
this.setState({
visible: true,
})
}

render() {
return (
<>
{ this.state.visible && <div>modal</div>}
</>
)
}
}

class Parent extends React.Component{
constructor(props){
super(props);
this.myRef = React.createRef()
}

handleClick = () => {
// 调用子组件方法
const node = this.myRef.current;
node.showModal();
}

render() {
return (
<>
<button onClick={handleClick}>触发子组件方法</button>
<Child ref={this.myRef} />
</>
)
}
}

```




### 4. 生命周期
#### 4.1 挂载
当组件实例被创建并插入DOM中时，其生命周期调用顺序如下
- constructor
- getDerivedStateFromProps
- render
- componentDidMount


#### 4.2 更新
当组件的props或state发生变化时会触发更新。组件更新的生命周期调用顺序如下
- getDerivedStateFromProps 
- shouldComponentUpdate 
- render 
- getSnapshotBeforeUpdate 
- componentDidUpdate



#### 4.3 卸载
当组件从DOM中移除之前，会调用
- compoenntWillMount

### 参考资料
https://github.com/xitu/gold-miner/blob/master/TODO/our-best-practices-for-writing-react-components.md
https://juejin.im/post/5a73d6435188257a6a789d0d
- [React新生命周期--getDerivedStateFromProps](https://www.jianshu.com/p/50fe3fb9f7c3)
```
