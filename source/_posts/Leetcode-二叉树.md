---
title: 二叉树
date: 2021-08-19 12:03:15
---
### 1. 二叉树遍历
节点定义
```js
function TreeNode (val) {
  this.val = val
  this.left = null
  this.right = null
}
```

#### 1.1 前序遍历
先访问当前节点，然后左节点，右节点
```js
const preorder = node => {
  if (!node) return
  path.push(node.val)
  preorder(node.left)
  preorder(node.right)
}
```

#### 1.2 中序遍历
```js
const inorder = node => {
  if (!node) return
  inorder(node.left)
  path.push(node.val)
  inorder(node.right)
}
```

#### 1.3 后序遍历
```js
const backorder = node => {
  if (!node) return
  backorder(node.left)
  backorder(node.right)
  path.push(node.val)
}
```
