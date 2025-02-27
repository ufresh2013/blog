---
title: React Hooks 用法
date: 2025-01-29 12:41:48
category: React
---
> 这是一份React Hooks 新官网笔记。
不得不感叹 React 的函数组件加上 Hooks（hooks本质上也是一个函数），寥寥几个api就满足了前端页面所有逻辑交互。Vue啊Vue，掉队了啊

<br/>

### 1. React 哲学
#### 1.1 组件是个纯函数
一个组件必须是纯粹的，React 的函数组件只应该做一件事情：返回组件的 HTML 代码，而没有其他的功能。不应该让外部变量污染组件
```js
// 🔴错误示例：受guest影响，多次调用这个组件，会产生不同的JSX，不能这样写
let guest = 0;

function Cup() {
  guest = guest + 1;
  return <h2>{guest}</h2>;
}
```

<br/>

#### 1.2 Hooks
React Hooks 的意思是，组件写成纯函数，如果需要外部功能和副作用（组件状态state、具有副作用的操作,如获取数据、事件监听、改变DOM），就用钩子把外部代码"钩"进来。
Hooks本身也是一个函数。一个应用由一个个纯函数链接而成。
真的好像AI神经网络，应用由一个个节点（神经元）连接起来，每个神经元之间都可以看作是一个函数`a = f(b)`。纯函数有助于机器理解，所以react就是为AI生成代码作铺垫？

<br/>


#### 1.3 UI Tree
树是表示实体之间关系的常见方式，它们经常用于建模 UI。*把React组件之间的嵌套关系，看作一棵UI Tree。*

顶级组件会影响其下所有组件的渲染性能，而叶子组件通常会频繁重新渲染。识别它们有助于理解和调试渲染性能问题。

- 初次渲染时, React 会调用根组件。
- 后续的渲染，如果更新后的组件是同一个组件，React 在原组件上更新触发。如果是别的组件，会渲染新的组件。

对 React 来说重要的是组件在 UI 树中的位置,而不是在 JSX 中的位置


<br/>

### 2. Hooks
#### 2.1 useState
- state 变量：用于保存渲染间的数据。
- state setter 函数：更新变量并触发 React 再次渲染组件。
```js
const [index, setIndex] = useState(0);
```

- *快照的状态*
每次渲染，React都会为你提供这次渲染的一张state快照。`setScore`会请求一个新的重新渲染，但不会在已运行的代码中更改`score`的值。所以第二次调用 `setScore(score + 1)` 时，`score` 仍然是 0。
```js
const [score, setScore] = useScore(0)
setScore(score + 1) // score = 0
setScore(score + 1) // 此时 score = 0
setTimeout(() => {
  alert(score) // score 依然是 0
})

// 可以用更新函数处理
setScore(n => n + 1) // 此时 n = 1
```

- 更新对象state
需要用一个全新的对象来更新
```js
const [person, setPerson] = useState({ name: 'Niki' });

// 使用...创建新对象,注意展开语法是浅层的：它的复制深度只有一层
setPerson({ ...person, name: 'other' })

// 使用Immer更简洁
setPerson(person => { person.name = 'other' })
```

- 更新数组state
  - 不能使用: push、unshift, pop, shift, splice, arr[i] = ,reverse, sort
  - 可以用: concat, [...arr], filter, slice, map
  - 更新数组内的对象
  ```js
  // wrong: 虽然数组是新的，但是其内部元素本身和元素组是相同的
  const nextList = [...list]
  nextList[0].name = 'abc'
  setMyList(nextList)

  // right: 需要用map来替换
  setMyList(list.map(v => v.id === 1 ? { ...a, name: 'abc' } : v));
  ```

- *等同于computed*
每次新渲染，`selectedItem`都会从新数据中算出来
```js
const [items, setItems] = useState(initialItems);
const [selectedId, setSelectedId] = useState(0);
const selectedItem = items.find(item =>
  item.id === selectedId
);
```

- 谨慎把props作为state的初始值
如果父组件更新了props， color state变量不会被更新
```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
}
```

<br/>

#### 2.2 useReducer
状态更新逻辑复杂时，把`useSstate`迁移到`useReducer`，把它们整合到一个外部函数中。
```js
import { useReducer } from 'react';
const initialTasks = [{id: 0, text: '参观卡夫卡博物馆', done: true}];

function tasksReducer(tasks, action) {
  if (action.type === 'add') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
      },
    ];
  }
}
function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({ type: 'add', text })
  }
}
```

<br/>

#### 2.3 useContext
Context 允许父组件向其下层无论多深的任何组件提供信息
```js
import { createContext, useContext } from 'react';

const LevelContext = createContext(1); // 创建context
const level = useContext(LevelContext); // 把 context 传递给 useContext hook来读取它

export default function Section({ level, children }) {
  return (
    {/* 在父组件中，用 context.Provider来为子组件提供context */}
    <LevelContext.Provider value={level}>
      {children}
    </LevelContext.Provider>
  );
}

// 在子组件中，用useContext来读取它
const level = useContext(LevelContext);
```

<br/>

#### 2.4 Reducer + Context
结合reducer和Context，*相当于vue里的provide和inject*
state 存在于顶层组件中，由 useReducer 进行管理。子组件可以轻松获取获取 state数据 和 dispatch。
```js
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

// 组件中获取task和dispatch
const dispatch = useContext(TasksDispatchContext);
const tasks = useContext(TasksContext);
```
也可以再封装一层
```js
export function useTasks() {
  return useContext(TasksContext);
}
export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
const tasks = useTasks();
const dispatch = useTasksDispatch();
```


<br/>

#### 2.5 useRef
和state一样，React会在每次渲染时保留ref, 但设置state会重新渲染组件，ref不会。
当你希望组件“记住”某些信息，但又不想让这些信息 触发新的渲染 时，你可以使用 ref 。
```js
// ref会返回这样一个对象 { current: 0 } ，current表示当前值
const ref = useRef(0); 
function handleClick() {
  ref.current = ref.current + 1;
  alert('你点击了 ' + ref.current + ' 次！'); // 1, 2, 3...
}
```
`ref`可以指向任何值，常用于存储和操作DOM元素
```js
import { useRef } from 'react';

const myRef = useRef(null);

// 将ref传递给DOM节点
<div ref={myRef}>

// 访问DOM
myRef.current.scrollIntoView();
```

<br/>

#### 2.6 useCallback
在多次渲染中缓存函数，避免不必要的渲染。
第二个参数是函数内部需要用到的依赖值
```js
const handleSubmit = useCallback((orderDetails) => {
  post('/product/' + productId + '/buy', {
    referrer,
    orderDetails,
  });
}, [productId, referrer]);
```

<br/>


#### 2.7 useMemo
在每次重新渲染的时候能够缓存计算的结果。
```js
const cachedValue = useMemo(calculateValue, dependencies)
```




<br/>

### 3. Effect
允许你指定由渲染本身，而不是特定交互引起的副作用，如用于渲染的网络请求、对DOM节点进行操作
- 执行时机
```js
useEffect(() => {
  // 这里的代码会在每次渲染后执行
});

useEffect(() => {
  // 这里的代码只会在组件挂载后执行
  window.addEventListener('scroll', handleScroll);

  // 清理函数: 每次重新执行Effect前，组件被卸载时，都会调用清理函数
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

useEffect(() => {
  //这里的代码只会在每次渲染后，并且 a 或 b 的值与上次渲染不一致时执行
}, [a, b]);
```

- 清理函数`return () => {}`，常用于
  - 取消订阅
  - 重置初始值
  - 取消或者对正在进行中的异步操作作标记

- 你可能不需要effect
  1. 能`computed`计算出来的数据，不需要放进`useEffect`
  ```js
    const [firstName, setFirstName] = useState('Taylor');
    const [lastName, setLastName] = useState('Swift');

    // 🔴 避免：多余的 state 和不必要的 Effect
    useEffect(() => {
      setFullName(firstName + ' ' + lastName);
    }, [firstName, lastName]);
    
    // ✅ 非常好：在渲染期间进行计算
    const fullName = firstName + ' ' + lastName;
  ```

  2. 有条件的`computed`, 使用`useMemo`代替`useEffect`
  ```js
  // 🔴 避免：多余的 state 和不必要的 Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行 getFilteredTodos()
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  ```

  3. 当props变化需要调整state时，不需要放进`useEffect`
  ```js
  function List({ items }) {
    const [isReverse, setIsReverse] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // 🔴 避免：当 prop 变化时，在 Effect 中调整 state
    useEffect(() => {
      setSelection(null);
    }, [items]);

    // ✅ 非常好：在渲染期间计算所需内容
    const selection = items.find(item => item.id === selectedId) ?? null;
  }
  ```

<br/>

<br/>

### 4. API
#### 4.1 forwardRef
允许父节点访问子组件里的DOM元素
```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        编辑
      </button>
    </form>
  );
}
```

<br/>

#### 4.2 lazy
声明一个组件
```js
import MarkdownPreview from './MarkdownPreview.js';
```

声明一个懒加载的 React 组件
```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

<br/>


#### 4.3 memo
允许你的组件在 props 没有改变的情况下跳过重新渲染。
使用 memo 将组件包装起来，以获得该组件的一个 记忆化 版本。通常情况下，只要该组件的 props 没有改变，这个记忆化版本就不会在其父组件重新渲染时重新渲染。
```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

<br/>

<br/>

### 参考资料
- [React官网](https://react.docschina.org/)