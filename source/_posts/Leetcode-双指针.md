---
title: 🤔 双指针 
date: 2021-08-19 11:52:56
category: LeetCode
---
### 1. 双指针 TwoPoints
双指针，是指用两个变量在线性结构上遍历而解决的问题。双指针算法是基于暴力解法的优化。
- 对于数组，指两个变量在数组上相向移动解决的问题
- 对于链表，指两个变量在链表上同向移动解决的问题，也称为「快慢指针」问题



### 2. 题目类型
类型 | LeetCode题目
---|---:
左右指针夹逼   | 1.两数之和、125.验证回文串、11.盛最多水的容器、15.三数之和、 18.四数之和
快慢指针      | 141.环形链表、202.快乐数




### 3. 左右指针夹逼
左右指针分别指向左右两端，根据情况向中间移动。适用于**两数之和**，**三数之和**，**四数之和**, **盛最多水的容器**这样的LeetCode题目，先对数组进行排序，然后左右夹逼求值。



#### 1. 两数之和
给定一个有序整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那两个整数，并返回它们的数组下标。
```js
var twoSum = function(nums, target) {
  for (let i = 0; i < nums.length; i++ ) {
    for(let j = i + 1; j < nums.length; j++ ) {
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
};
```



#### 15. 三数之和
给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

- 暴力：三重循环，使用Set进行判重（会超出时间限制）
```js
const threeSum = nums => {
  if (nums === null || nums.length < 2) {
    return []
  }
  nums = nums.sort()
  const result = []
  const resultSet = new Set() // 用作判重
  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const temp = [nums[i], nums[j], nums[k]]
          if (!resultSet.has(temp.join())) {
            result.push(temp)
            resultSet.add(temp.join())
          }
        }
      }
    }
  }
  return result
}
```



#### 125.验证回文串
```js
var isPalindrome = function (str) {
  str = str.replace(/[^0-9a-zA-Z]/g, '').toLowerCase()
  let l = 0, r = str.length - 1 // 头尾指针
  while (l < r) { 
    if (str[l] != str[r]) {
      return false
    }
    l++
    r--
  }
  return true
}
```



#### 11.盛最多水的容器
左右指针分别指向左右两端，总是移动数字较小的那个指针，得出最大值
```js
const maxArea = height => {
  let i = 0; // 左指针
  let j = height.length - 1; // 右指针
  let area = 0;
  while(i < j) {
    area = Math.max(Math.min(height[i], height[j]) * (j - i), area)
    if (height[i] < height[j]) {
      i++
    } else {
      j--
    }
  }
  return area
};
```
时间复杂度：O(n)



#### 15.三数之和
枚举k，k确定后，让 `nums[i] + nums[j] + nums[k] = 0`。
因为k右侧的数组始终是单调递增的，双指针i j一个在头，一个在尾。如果`sum < 0`, 左指针i往右移。如果`sum > 0`, 右指针j往左移
```js
// -4 -1 -1 -1 0 1 2
// k  i            j
const threeSum = nums => {
  let arr = []
  nums = nums.sort()

  for (let k = 0; k < nums.length - 2; k++) {
    if (nums[k] > 0) break;
    if (k > 0 && nums[k] == nums[k - 1]) continue; // 跳过重复的k值
    let i = k + 1
    let j = nums.length - 1

    while (i < j) {
      const sum = nums[k] + nums[i] + nums[j]
      if (sum === 0) {
        arr.push([nums[k], nums[i], nums[j]])
        while(i < j && nums[i] === nums[++i]) {}
        while(i < j && nums[j] === nums[--j]) {}
      } else if (sum < 0) {
        while(i < j && nums[i] === nums[++i]) {}
      } else {
        while(i < j && nums[j] === nums[--j]) {}
      }
    }
  }

  return arr
};
```
- 夹逼法：排序之后，双指针进行左右夹逼
枚举k，k确定后，让 `nums[i] + nums[j] + nums[k] = 0`。

-4 -1 -1 -1 0 1 2
k  i            j

因为k右侧的数组始终是单调递增的，双指针i j一个在头，一个在尾。如果`sum < 0`, 左指针i往右移。如果`sum > 0`, 右指针j往左移
```js
const threeSum = nums => {
  let arr = []
  nums = nums.sort()

  for (let k = 0; k < nums.length - 2; k++) {
    if (nums[k] > 0) break;
    if (k > 0 && nums[k] == nums[k - 1]) continue; // 跳过重复的k值
    let i = k + 1
    let j = nums.length - 1

    while (i < j) {
      const sum = nums[k] + nums[i] + nums[j]
      if (sum === 0) {
        arr.push([nums[k], nums[i], nums[j]])
        while(i < j && nums[i] === nums[++i]) {}
        while(i < j && nums[j] === nums[--j]) {}
      } else if (sum < 0) {
        while(i < j && nums[i] === nums[++i]) {}
      } else {
        while(i < j && nums[j] === nums[--j]) {}
      }
    }
  }

  return arr
};
```



### 4. 快慢指针
链表中使用快慢指针一般用于判断是否为环形链表

#### 141.环形链表
给定一个链表，判断链表中是否有环。使用O(1)内存解决此问题。
```js
var hasCycle = function(head) {
  if (!head || !head.next) return false
  let slow = head
  let fast = head.next
  while (slow !== fast) {
    if (!fast || !fast.next) return false
    slow = slow.next
    fast = fast.next.next
  }
  return true
}
```



#### 202.快乐数
- 找到快乐数
- 没有快乐数，形成环路，造成死循环
创建快慢指针，慢指针每次走一步，快指针每次走两步。当快慢指针相遇，表示有环路，该数不是快乐数
```js
const getNext = n => {
  return n.toString().split('').map(v => v ** 2).reduce((a, b) => a + b)
}

const isHappy = n => {
  let show = n
  let fast = getNext(n)
  while (fast !== 1 && fast !== slow) {
    slow = getNext(slow)
    fast = getNext(getNext(fast))
  }
  return fast === 1
}
```