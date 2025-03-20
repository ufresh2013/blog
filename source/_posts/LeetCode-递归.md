---
title: 🤔 深度优先搜索、广度优先搜索
date: 2020-08-23 15:54:29
category: LeetCode
---

### 1. 代码模板
- 每个节点有且仅访问一次
- 访问节点的顺序不同可分为BFS, DFS

#### 1.1 递归通用模板
```js
const recursion = (level, params) {
  // recursion terminator 终止条件
  if (level > MAX_LEVEL) {
    process_result
    return
  }

  // process current level
  process(level, params)
  // drill down
  recursion(level + 1, parms)
  // clean current level status if need
}
```


#### 1.1 DFS 深度优先搜索
```js
// 递归写法
const visited = new Set()
const dfs = node => {
  if (visited.has(node)) return
  visited.add(node)
  dfs(node.left)
  dfs(node.right)
}

// 非递归写法
const dfs = (node) => {
  if (!node) return
  const visited = []
  const stack = node
  while (stack.length > 0) {
    const node = stack.pop()
    visited.push(node)
    process(node)

    const nodes = generate_related_nodes(node)
    stack.push(nodes)
  } 
}
```


#### 1.2 BFS 广度优先搜索
```js
const bfs = (root) => {
  const result = []
  const queue = [root]
  while (queue.length > 0) {
    const level = []
    const n = queue.length
    for (let i = 0; i < n; i++) {
      const node = queue.pop()
      level.push(node.val)
      if (node.left) queue.unshift(node.left)
      if (node.right) queue.unshift(node.right)
    }
    result.push(level)
  }
  return result
}
```


### 2. 用途
#### 2.1 子集
#### 2.2 组合
#### 2.3 排列