---
title: 二分查找
date: 2021-08-19 11:09:25
category: LeetCode
---
### 1. 二分查找
二分查找针对一个有序的数据集合，每次都通过跟区间的中间元素对比，将待查找的区间缩小为之前的一半，直到找到要查找的元素，或者区间被缩小为 0。

- 被查找区间的大小变化
n, n/2, n/4, n/8 ... n/2^k

- 使用场景
  - 目标函数单调性（单调递增或者递减）
  - 存在上下界
  - 能够通过索引访问

<br/>

### 2.代码模板
对应 704.二分查找
```js
var binarySearch = function(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while(left <= right) {
    let mid = left + ((right - left) >> 1) // 相当于 Math.floor(left + (right - left) / 2)
    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
};
```
<br/>

### 3. LeetCode题目类型

1. 简单的有序数组中查找元素

类型 | LeetCode题目
---|---:
有序数组中不存在重复元素 | 704. 二分查找
查找给定值的第一个元素，最后一个元素 | 34.在排序数组中查找元素的第一个和最后一个位置<br/> Offer53.在排序数组中查找数字I
查找第一个大于等于给定值的元素、<br/>查找最后一个小于等于给定值的元素 | 35.搜索插入位置

2. 用于旋转后的、二维的有序数组

类型 | LeetCode题目
---|---:
旋转后的有序数组 | 33.搜索旋转排序数组<br/> 81.搜索旋转排序数组 II<br/> 153.寻找旋转排序数组中的最小值
有序的二维数组 | 74.搜索二维矩阵
多个有序数组 | 4.寻找两个正序数组的中位数

3. “近似”查找问题
- 69.x的平方根
- 367.有效的完全平方数
<br/>

### 4. 例题
##### 34.在排序数组中查找元素的第一个和最后一个位置
```js
const binarySearch = (nums, target, lower) => {
  let left = 0, right = nums.length - 1, ans = nums.length
  while (left <= right) {
    const mid = left + ((right - left) >> 1)
    // lower为true时，找最左一个位置，nums[mid] === target时，让right往下减，最后找到最左侧的索引
    // lower为false时，找最后一个位置, nums[mid] === target, 让left往上加，最后找到大于target的索引
    if (nums[mid] > target || (lower && nums[mid] >= target))  {
      ans = mid
      right = mid - 1
    } else {
      left = mid + 1
    }
  }
  return ans
}

const searchRange = (nums, target) => {
  let ans = [-1, -1]
  const leftIdx = binarySearch(nums, target, true)
  const rightIdx = binarySearch(nums, target, false) - 1
  if (nums[leftIdx] === target && nums[rightIdx] === target && leftIdx >= 0 && rightIdx < nums.length) {
    ans = [leftIdx, rightIdx]
  }
  return ans
}
```

<br/>

##### 69.x的平方根
计算并返回 x 的平方根，其中 x 是非负整数。
```js
// 查找近似问题
// y = x ^ 2, x > 0时，抛物线在y轴右侧单调递增，且有上下界
var mySqrt = (x) => {
  if (x === 0 || x === 1) return x
  let left = 1, right = x, mid = 1
  while (left <= right) {
    // >> 1 位运算代替 除2 取整 操作
    mid = left + ((right - left) >> 1)
    if (mid * mid === x) {
      return mid
    } else if (mid * mid > x) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }
  return right
}
```