---
title: 数据结构与算法总览
date: 2019-03-14 13:58:11
category: LeetCode
---
> LeetCode JS题解: https://github.com/ufresh2013/-algorithm015

### 1. 时间复杂度、空间复杂度
`O(1)`: 哈希表(JS对象)，根据key就可以直接拿到val
`O(n)`: 大多数遍历，比如数数，从1数到100
`O(n²)`:双重循环，比如排序(冒泡、选择)，每个元素都需要其他元素比较放置
`O(logn)`: 二分查找/二叉树搜索，每次查找的范围都/2
`O(nlogn)`: 快排
`O(2^n)`: 递归


### 参考资料
- [如何理解算法时间复杂度的表示法，例如 O(n²)、O(n)、O(1)、O(nlogn) 等？](https://www.zhihu.com/question/21387264)