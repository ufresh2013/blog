---
title: React Hooks 用法
date: 2025-01-29 12:41:48
category: React
---
> React 新官网阅读笔记

### 1. 保持组件纯粹
一个组件必须是纯粹的，不应该让外部变量污染组件，错误示例
```js
// 受guest影响，多次调用这个组件，会产生不同的JSX，不能这样写
let guest = 0;

function Cup() {
  guest = guest + 1;
  return <h2>{guest}</h2>;
}
```

<br/>

### 2. UI Tree
在进行初次渲染时, React 会调用根组件。
后续的渲染，如果更新后的组件是同一个组件，React 在原组件上更新触发。如果是别的组件，会渲染新的组件。
对 React 来说重要的是组件在 UI 树中的位置,而不是在 JSX 中的位置


<br/>

### 3. Hooks
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
ref.current // 0
```


<br/>

### 3. 组件传值
对标vue
- props: 父子组件传值
- computed: 组件内直接计算值，每次渲染都会拿到最新的重新计算
- context: useContext
- vuex: useReducer
- provide/inject: context和reducer结合