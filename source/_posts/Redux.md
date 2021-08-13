---
title: Redux
date: 2019-02-28 15:06:04
category: React
---
> 应用中所有的state都以一个对象树的形式储存在一个单一的store中。唯一修改state的办法就是触发action，有一个描述发生什么的对象。为了描述action如何改变state树，你需要编写reducers。

- redux基本用法？
- react-redux实现原理？
- redux-saga是什么？
- reducer为什么是纯函数？
- 为什么有了action, 还有独立一个reducer？
- redux, flux, mobx

<br/>

### 1. 核心概念
- Store : 一个纯js对象，描述应用的state
- Action :一个普通Javascript对象，用来描述发生了什么
```js
{ type: 'ADD_TODO', text: 'Build your data' }
{ type: 'TOGGLE_TODO', index: 1 }
```

- Reducer : 是一个接收state和action, 并返回新的state的纯函数。保持reducer纯净很重要，永远不要在reducer里做这些操作: ① 修改传入参数; ② 执行有副作用的操作，如API请求和路由跳转；③ 调用非纯函数，如`Date.now()`或`Math.random()`
```js
function todo(state=[], action){
  switch (action.type){
    case 'ADD_TODO':
      // 不能使用Object.assign(state, {...})，因为它会改变第一个参数的值
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false,
          }
        ]
      })
    
    case 'TOGGLE_TODO':
      // 形成一个新的数组
      return state.map(
        (item, index) => 
          action.index == index ? { text: item.text, completed: !item.completed } : item
      )
    
    default:
      return state
  }
}
```


<br/>
### 2. 三个原则
- 单一数据源
*`state -> DOM ; store -> APP`*
全局只有一个唯一的store, 所有的组件状态都可以放在外部store中。所有节点的更新都通过Store完成。组件之间的通信不再依赖组件的层级结构。
<img src="1.png" style="max-width: 500px">


<br/>
- state是只读的
*`(state, action) => new state`* 
唯一改变state的方法就是触发action。视图和网络请求都不能直接修改state。点击按钮后，会形成一个action，这个action会被dispatche到Reducer。Reducer处理这个action，返回一个新的store。store的变化，会触发UI的变化。
<img src="2.png" style="max-width: 400px">
<br/>


- 使用纯函数来执行修改
更新store的reducer是一个纯函数，输出结果由参数决定。




<br/>

### 3. Redux API
*createStore(reducer)*
创建一个store
```js
import { createStore } from 'redux';
import todoApp from './reducers';
let store = createStore(todoApp);
```
*store.getState()*
获取store的数据

*store.dispatch(action)*
用户点击一个按钮，产生一个action，dispatch将这个action传递给reducer，来更新store

*store.subscribe(callback)*
监听store的变化，变化后执行回调函数


```js
import { createStore } from 'redux';

// 定义reducer
function counter(state = 0, action){
  switch (action.type){
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// 创建store来存放应用的状态(store是一个纯js对象)
// API 是 { subscribe, dispatch, getState }
let store = createStore(counter);

// 监听store的变化，变化后执行回调函数
store.subscribe(() => {
  // 获取store里的数据
  console.log(store.getState())
});

store.dispatch({ type: 'INCREMENT' })
```


*combineReducers*
系统中有多个reduer，可以使用`combineReducers`整合在一起。
```js
import { combineReducers } from 'redux';
function todos( state = [], action) {
  // ...
  return nextState;
}

function visibleTodoFilter(state = 'SHOW_ALL', action) {
  // ...
  return nextState;
}

export default combineReducers({
  todos,
  visibleTodoFilter
})
```

<br/>

*bindActionCreators*
创建action，同时把它dispatch出去。不需要知道store， dispatch在哪, 就能触发dispatch。
```js
function addTodoWithDispatch(text){
  const action = {
    type: ADD_TODO,
    text
  }
  dispatch(action)
}

// 另一种写法
const boundAddTodo = text => dispatch(addTodo(text))
```


<br/>

### 3. React-redux
React-Redux是基于 容器组件和展示组件相分离 的开发思想。大部分组件都是展示型的，但一般需要少数的几个容器组件把它们和Redux store连接起来。

<br/>

#### 3.3 connect工作原理
```js
// 传递redux state
cosnt mapStateToProps = state => {
  return {
    todos: state.todos
  }
}

// 分发action
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}

// 最后通过connect()，将<TodoList>与redux联系起来
import { connect } from 'react-redux';

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList;
```

#### 3.4 传入store
```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```
（这里还不太懂）
示例：https://www.redux.org.cn/docs/basics/ExampleTodoList.html








<br/>

### 4. Redux异步请求
一般情况下，每个API请求都需要dispatch至少三种action:
- 通知reducer请求开始的action
- 通知reducer请求成功的action
- 通知reducer请求失败的action




<br/>

### 5. 组织action和reducer
- 所有action放一个文件，会无限扩展
- action，reducer分开，在action中发请求，在reducer中做处理，实现业务逻辑时需要来回切换
建议单个action和reducer放在同一个文件
```js
import { COUNTER_PLUS_ONE } from './counter';

export function counterPlusOne(){
  return { type: COUNTER_PLUS_ONE }
}

export function reducer(state, action){
  switch (action.type){
    case COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      }
    
    default:
      return state;
  }
}
```


<img src="4.png" style="max-width:500px">

<br/>
### 6. redux-saga
<img src="3.png" style="max-width:400px">


### 7. dva




### 参考资料
- [Redux](https://www.redux.org.cn/)
- [Redux-sage](https://redux-saga-in-chinese.js.org/)
- [Dva](https://dvajs.com/)
- [Redux 简明教程](https://github.com/kenberkeley/redux-simple-tutorial)
- [Redux 进阶教程](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/redux-advanced-tutorial.md)
- [容器组件和展示组件相分离](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [简述React中无状态组件和有状态组件的区别](https://segmentfault.com/a/1190000016774551)