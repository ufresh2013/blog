---
title: 动态规划
date: 2021-08-23 15:54:29
category: LeetCode
---

### 1. 动态规划 Dynamic Program
1. dp公式: dp[i] = max(nums[i], nums[i] + dp[i-1])
2. 最大子序和 = 当前元素自身最大，或者 包含之前元素后最大
```js
var maxSubArray = function (nums) {
  for (let i = 1; i < nums.length; i++) {
    // nums[i] 代表 dp[i]
    nums[i] = Math.max(nums[i], nums[i] + nums[i-1])
  }
  return Math.max(...nums)
}
```