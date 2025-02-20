---
title: 树、二叉树、二叉搜索树
date: 2019-10-19 12:03:15
category: LeetCode
---
### 1. 数据结构
- 树: parentNode, childrenNode
- 二叉树：儿子节点只有两个 - 左节点、右节点
- 二叉搜索树：左子树上所有结点的值均小于它的根节点的值；右子树上所有结点的值均大于它的根节点的值。查询和操作都是`O(logn)`

节点定义
```js
function TreeNode (val) {
  this.val = val
  this.left = null
  this.right = null
}
```

### 2. 树的遍历
树的解法一般都是递归
#### 2.1 前序遍历
先访问当前节点，然后左节点，右节点
```js
const preorder = node => {
  if (!node) return
  path.push(node.val)
  preorder(node.left)
  preorder(node.right)
}
```

#### 2.2 中序遍历
```js
const inorder = node => {
  if (!node) return
  inorder(node.left)
  path.push(node.val)
  inorder(node.right)
}
```

#### 2.3 后序遍历
```js
const backorder = node => {
  if (!node) return
  backorder(node.left)
  backorder(node.right)
  path.push(node.val)
}
```


### 3. LeetCode
#### 爬楼梯

#### 括号生成等问题