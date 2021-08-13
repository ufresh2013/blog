---
title: Hooks
date: 2021-07-29 12:41:48
category: React
---
### 1. Hooks
任何一个组件，可以用*`Class`*来写，也可以用*`Hook`*来写。*`Hook`*是函数，用起来更轻，`Hook`是React函数组件的副效应解决方案，用来为函数组件引入副效应。


<br/>

### 2. 常用钩子
纯函数只进行数据计算，那些不涉及计算的操作（比如存储数据、改变应用状态）。Hooks将这些操作称为“副效应”，通过`useEffect`执行，常见的副效应有：获取数据、事件监听、改变DOM

<img src="1.jpg" style="width: 300px">

有时候，我们不希望`useEffect()`每次渲染都执行，这时可以使用它的第二个参数，使用一个数组指定副效应函数的依赖项，只有依赖项发生变化，才会重新渲染。

```js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App(props) {
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await axios('https://hn.algolia.com/api/v1/search?query=redux');
    setData(result.data);
  }, [props.name]);

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}></li>
      ))}
    </ul>
  );
}

export default App;
```

#### 2.1 useContext
组件之间共享状态
```js
const AppContext = React.createContext({})
const Navbar = () => {
  const { username } = useContext(AppContext)
}
const Message = () => {
  const { username } = useContext(AppContext)
}
function App () {
  return <AppContext.Provider value={{ username: 'superman' }}>
    <Navbar />
    <Message />
  </AppContext>
}
```

#### 2.2 useReducer
useReducer 接受的第一个参数是一个函数，我们可以认为它就是一个 reducer。第二个参数是state的初始值
```js
const DemoUseReducer = ()=>{
  /* number为更新后的state值,  dispatchNumer 为当前的派发函数 */
  const [ number , dispatchNumer ] = useReducer((state,action)=>{
    const { payload , name  } = action
    /* return的值为新的state */
    switch(name){
      case 'add':
        return state + 1
      case 'sub':
        return state - 1 
      case 'reset':
        return payload       
    }
    return state
  },0)
  return <div>
    当前值：{ number }
    { /* 派发更新 */ }
    <button onClick={()=>dispatchNumer({ name:'add' })} >增加</button>
    <button onClick={()=>dispatchNumer({ name:'sub' })} >减少</button>
    <button onClick={()=>dispatchNumer({ name:'reset' ,payload:666 })} >赋值</button>
    { /* 把dispatch 和 state 传递给子组件  */ }
    <MyChildren  dispatch={ dispatchNumer } State={{ number }} />
  </div>
}

```

#### 2.3 实现一个useState
```js
const states = []
let index = 0

function useState (initialState) {
  const curIndex = index
  states[curIndex] = state[curIndex] || initialState

  function setState (newState) {
    states[curIndex] = newState
    render()
  }

  index++
  return [state[curIndex], setState]
}
```


#### 2.4 实现一个useEffect
```js
const allDeps = []
let index = 0

function useEffect (callback, deps =[]) {
  if (!allDeps[index]) {
    // 首次渲染: 赋值 + 调用回调函数
    allDeps[index] = deps
    effectCursor++
    callback()
    return
  }

  const curIndex = index
  const curDeps = allDeps[curIndex]

  // 检查依赖项是否发生变化，发生变化需要重新render
  const isChanged = curDeps.some((dep, idx) => dep !== deps[idx])

  if (isChanged) {
    callback()
    allDeps[curIndex] = deps
  }

  index++
}
```

#### 2.5 useRef
用来获取`dom`元素
```js
const demo = () => {
  const dom = useRef(null)
  const handleSubmit = () => {
    console.log(dom.current) // 获取当前dom元素
  }
  return (
    <div>
      <div ref={dom}>表单组件</div>
      <button onClick={handleSubmit}></button>
    </div>
  )
}

```

#### 2.6 useMemo, useCallback

#### 2.7 useLayoutEffect
useEffect执行顺序: 组件更新挂载完成 -> 浏览器 dom 绘制完成 -> 执行 useEffect 回调。
useLayoutEffect 执行顺序: 组件更新挂载完成 ->  执行 useLayoutEffect 回调-> 浏览器dom绘制完成。
所以说 useLayoutEffect 代码可能会阻塞浏览器的绘制 。
```js
const DemoUseLayoutEffect = () => {
  const target = useRef()
  useLayoutEffect(() => {
    /*我们需要在dom绘制之前，移动dom到制定位置*/
    const { x ,y } = getPositon() /* 获取要移动的 x,y坐标 */
    animate(target.current,{ x,y })
  }, []);
  return (
    <div >
      <span ref={ target } className="animate"></span>
    </div>
  )
}

```


<br/>

### 7. Hooks vs Class
#### 1. 不需要this
Hooks不需要写`this`，代码更加简洁

#### 2. 可以捕捉瞬时`props`, `value`
*捕捉瞬时`props`*： 点击按钮 3 秒后`alert`父级传入的用户名。那么当点击按钮后的 3 秒内，父级修改了`this.state.user`，class组件弹出的是修改后的名字，Hooks组件弹出的是修改前的组件。
*捕捉瞬时`value`*： 在点击 Send 按钮后，再次修改输入框的值，3 秒后的输出依然是 点击前输入框的值。这说明 Hooks 同样具有 capture value 的特性。
```js
import React, { useState } from "react";
import ReactDOM from "react-dom";

function MessageThread() {
  const [message, setMessage] = useState('');

  const showMessage = () => {
    alert('You said: ' + message);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MessageThread />, rootElement);
  ```

#### 3. 更简洁的生命周期函数
  - `props`发生变化时，希望执行副作用，需要再`componentDidMount`,`componentDidUpdate`两个声明周期写一样的逻辑。（Vue同理，要在mounted, watch props写两个逻辑）。而Hooks中`useEffect = componentDidMount + componentDidUpdate`
    
  - 添加定时器，清除定时器需要再`componentWillMount`, `componentWillMount`两个生命周期里写，而Hooks可以在`useEffect`集中处理。

  - React16引入Fiber机制，一定程度影响了生命周期的调用。渲染有两个阶段：`reconciliation` 和 `commit` 。前者过程是可以打断的，后者不能暂停，会一直更新界面直到完成。React16新的生命周期弃用了`componentWillMount`、`componentWillReceiveProps`，`componentWillUpdate`



#### 4. 逻辑复用更加清晰
```js
import React, { useEffect, useState } from 'react'

function usePosition () {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    setX(clientX)
    setY(clientY)
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  })

  return [{ x, y}]
}

function Index () {
  const [position] = usePosition()
  return <div>x: {position.x}, y: {position.y}</div>
}

export default Index
```


<br/>

### 8. Mixins vs Hooks
mixins不能互相消费和使用状态，但是Hook可以。Hook实现了mixin的功能，但是避免了mixin带来的两个主要问题：
- 允许相互传递状态
- 明确指出逻辑来自哪里