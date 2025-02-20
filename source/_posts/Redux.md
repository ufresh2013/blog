---
title: 实现一个Redux + React-Redux
date: 2024-10-25 11:48:17
category: React
---

### 1. 适用场景
从组件角度出发
- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

发生上面情况时，如果不使用 Redux 或者其他状态管理工具，不按照一定规律处理状态的读写，代码很快就会变成一团乱麻。你需要一种机制，可以在同一个地方查询状态、改变状态、传播状态的变化。
(适用场景：多交互、多数据源、数据需要统一保存(如多个chat)、用户之间可以协作)


<br/>

### 2. Redux是怎么做的？
首先，所有的状态，都保存在一个对象里。
- *`store`*：保存数据的地方
- *`state`*: 是store当前时刻的快照，可以通过`store.getState()`获得
- *`action`*: 是一个对象 `const action = { type: 'ADD_TODO'， payload: 1 }`，表示当前要执行的操作
- *`dispatch`*: 是发出Action的唯一办法
- *`reduer`*: store收到action后，必须给出一个全新的state，这样view才发生变化。这种state的计算过程就叫reducer。Reducer 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。
```js
// 必须是全新的对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
```
- *`subscribe`*: Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

<br/>

*整个流程如下：*
让用户发出action，Reducer函数算出新的State, View重新渲染。
```js
const defaultState = 0;
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD':
      return state + action.payload;
    default: 
      return state;
  }
};

// store.dispatch触发reduer的自动执行
const state = reducer(1, {
  type: 'ADD',
  payload: 2
});
```

<br/>

### 3. 实现一个Redux
```js
// store
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  };

  dispatch({});
  return { getState, dispatch, subscribe };
};

```

<br/>

### 4. 视图更新
数据和操作数据的逻辑有了，剩下的问题就是，计算出新的state后，怎么触发视图更新？
这时需要用到`React-Redux`，`React-Redux`需要解决两个问题：
- state对象如何转化为组件的参数
- 用户发出的Action如何从UI组件传出去


#### 4.1 获取state
使用`<Provide />`组件，让所有组件都能拿到`state`
```js
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// 组件内获取state
componentDidMount() {
  const { store } = this.context;
}
```

<br/>

#### 4.2 connect
Redux提供 *`connect`*方法，让组件变成能响应state变化的组件。
```js
import { connect } from 'react-redux'
const VisibleTodoList = connect()(TodoList);
```

`connect`方法接收两个参数，mapStateToProps 和 mapDispatchToProps

<br/>

#### 4.3 mapStateToProps
会将state映射到组件的props上。
mapStateToProps会订阅 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
```js
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```

#### 4.4 mapDispatchToProps

#### 4.5 整个流程
- 纯UI组件
```js
class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>Increase</button>
      </div>
    )
  }
}
```

- connect生成能响应state的组件
```js
function mapStateToProps(state) {
  return {
    value: state.count
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction)
  }
}

// Action Creator
const increaseAction = { type: 'increase' }

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

```

<br/>


### 5. 实现一个React-Redux


<br/>

### 参考资料
- [Vuex框架原理与源码分析](https://tech.meituan.com/2017/04/27/vuex-code-analysis.html)
- [Redux 入门教程](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
