---
title: 🤔 二分查找 
date: 2021-08-19 11:09:25
category: LeetCode
---
> 在 42 亿个有序数据中用**二分查找**一个数据，最多需要比较 32 次。二分查找是一个时间复杂度为 O(logn) 的算法。logn 非常“恐怖”，即便 n 非常非常大，对应的 logn 也很小。


### 1. 二分查找 Binary
二分查找针对的是一个有序的数据集合，每次都通过跟区间的中间元素对比，将待查找的区间缩小为之前的一半，直到找到要查找的元素，或者区间被缩小为 0。

- 被查找区间的大小变化
n, n/2, n/4, n/8 ... n/2^k

- 使用场景
  - 目标函数单调性（单调递增或者递减）
  - 存在上下界
  - 能够通过索引访问

<br/>

### 2.代码模板
LeetCode里关于二分查找的题木，几乎可以套用这个代码模板。
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

### 3. LeetCode题目
主要包括这3类 **(点击查看完整代码)**


1. 简单的有序数组中查找元素

类型 | LeetCode题目
---|:--:|
有序数组中不存在重复元素 | [704. 二分查找](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/704.%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE.md)
查找第一个值，最后一个等于给定值的元素 | [34.在排序数组中查找元素的第一个和最后一个位置](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/34.%E5%9C%A8%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E6%9F%A5%E6%89%BE%E5%85%83%E7%B4%A0%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%92%8C%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E4%BD%8D%E7%BD%AE.md)  <br/> [Offer53.在排序数组中查找数字I](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/Offer53-%E5%9C%A8%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E6%9F%A5%E6%89%BE%E6%95%B0%E5%AD%97I.md)
查找第一个大于等于给定值的元素、查找最后一个小于等于给定值的元素 | [35.搜索插入位置](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/35.%E6%90%9C%E7%B4%A2%E6%8F%92%E5%85%A5%E4%BD%8D%E7%BD%AE.md)

2. 用于旋转后的、二维的有序数组

类型 | LeetCode题目
---|---:
旋转后的有序数组 | [33.搜索旋转排序数组](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/33.%E6%90%9C%E7%B4%A2%E6%97%8B%E8%BD%AC%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84.md)<br/> [81.搜索旋转排序数组 II]()<br/> [153.寻找旋转排序数组中的最小值](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/33.%E6%90%9C%E7%B4%A2%E6%97%8B%E8%BD%AC%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84.md)
有序的二维数组 | [74.搜索二维矩阵](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/74.%E6%90%9C%E7%B4%A2%E4%BA%8C%E7%BB%B4%E7%9F%A9%E9%98%B5.md)
多个有序数组 | [4.寻找两个正序数组的中位数](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)

3. 二分查找也适合用在“近似”查找问题

[69.x的平方根](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/69.x%20%E7%9A%84%E5%B9%B3%E6%96%B9%E6%A0%B9.md)、 [367.有效的完全平方数](https://github.com/ufresh2013/-algorithm015/blob/master/BinarySearch/367.%E6%9C%89%E6%95%88%E7%9A%84%E5%AE%8C%E5%85%A8%E5%B9%B3%E6%96%B9%E6%95%B0.md)

<br/>

### 4. 例题
下面是两条有代表性的，其他的点链接刷
##### LeetCode 34.在排序数组中查找元素的第一个和最后一个位置
```js
const binarySearch = (nums, target, lower) => {
  let left = 0, right = nums.length - 1, ans = nums.length
  while (left <= right) {
    const mid = right + ((right - left) >> 1)
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

##### LeetCode 69.x的平方根
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