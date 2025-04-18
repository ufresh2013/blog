---
title: 位运算符
date: 2021-09-29 12:04:14
category: LeetCode
---

---
### 1. 位操作符
位运算符的优先级小于加减运算的优先级
操作数只能为整型或字符型数据

- *&*
与，参与运算的两数各对应的二进位相与。只有对应的两个二进位均为1时，结果位才位1，否则为0
```c
9 & 5 = 1
  00001001
& 00000101
= 00000001
```

- *|*
或，参与运算的两数各对应的二进位相或。只要对应的两个二进位有一个为1时，结果位就为1
```c
9 | 5 = 13
  00001001
| 00000101
= 00001101
```

- *^*
异或，参与运算的两数各对应的二进位相异或，当两对应的二进位相异时，结果为1
```c
9 ^ 5 = 12
  00001001
^ 00000101
= 00001100
```

- *~*
求反，对参与运算的各二进位按位求反
```c
~1001 = 0110
```

- *<<*
左移运算符，左移n位就是乘以2的n次方。把`<<`左边的运算数的各二进位全部左移若干位，右`<<`右边的数指定移动的位数，高位丢弃，低位补0.
```c
1 << 4 = 16
(-1) << 4 = -16
```

- *>>*
右移运算符，右移n位就是除以2的n次方。
```js
16 >> 3 = 2
(-16) >> 3 = 2
```


### 2. leetcode
- #### 只出现一次的数字
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。你的算法应该具有线性时间复杂度，不使用额外空间来实现。
```js
// 除了某个元素只出现一次以外，其余每个元素均出现两次
// 2 ^ 3 ^ 2 ^ 4 ^ 4 => 2 ^ 2 ^ 4 ^ 4 ^ 3 => 3
var singleNumber = function(nums) {
  let a = nums[0];
  for (let i = 1; i < nums.length; i++) {
    a ^= nums[i];
  }
  return a;
};
```

- #### 位1的个数
输入一个无符号整数，返回其二进制表达式中字位数为1的个数(汉明重量)
```js
// 输入：00000000000000000000000000001011
// 输出：3
var hammingWeight = function(n) {
    // 循环右移，判断二进制最低位数是不是1
    let a = 0;
    for(let i = 0; i < 32; i++) {
        if (n & 1 === 1) {
            a++
        }
        n>>=1
    }
    return a;
};
```

- #### 2的幂
给定一个整数(32位有符号整数)，请编写一个函数来判断它是否是2的幂次方
```js
var isPowerOfTwo = function(n) {
  // 2的幂一定大于0
  // 2的幂用二进制表示，一定只有一位数用1，n = 000100, n-1 = 000011, n&(n-1) = 000000 =0
  // 非2的幂 n = 001100 , n-1 = 001011, n&(n-1) != 0
  return (n > 0) && (n & (n - 1)) === 0;
};
```


- #### 4的幂
给定一个整数(32位有符号整数)，请编写一个函数来判断它是否是4的幂次方
```js
var isPowerOfFour = function(num) {
  if (num === 1) return true;
  let a = 4;
  while (a !== 0) {
    if (num === a) {
      return true;
    } else {
      a <<= 2
    }
  }
  return false;
};
```

- #### 找不同
给定两个字符串s和t，它们只包含小写字母。字符串t由s随机重排，然后再随机位置添加一个字母。找出在t中被添加的字母。
```js
// 通过text.charCodeAt() 获取字符的unicode编码，sum(t) - sum(s),找到不同的值的编码，
// 通过String.fromCharCode(num)获取字符串
var findTheDifference = function(s, t) {
    let total = 0
    t.split('').forEach(function(item){
        total += item.charCodeAt()
    });
    s.split('').forEach(function(item){
        total -= item.charCodeAt()
    })
    return String.fromCharCode(total);
};

// 将所有字符串异或起来
var findTheDifference = function(s, t) {
  let total = 0
  let str = s + t;
  str.split('').forEach(function(key) {
    total ^= key.charCodeAt();
  });
  return String.fromCharCode(total);
}
```

- #### 二进制链表转整数
给你一个单链表的引用结点 head。链表中每个结点的值不是 0 就是 1。已知此链表是一个整数数字的二进制表示形式。请返回该链表所表示数字的 十进制值 。
```js
var getDecimalValue = function(head) {
    let total = head.val;
    while(head.next !== null) {
        head = head.next
        total = total * 2 + head.val
    }
    return total
};
```


- #### 实现加法
不使用运算符`+`和`-`，计算两整数a, b之和



### 参考资料
- https://juejin.im/post/5a5886bef265da3e38496fd5
- https://www.jianshu.com/p/3d92fe1c34af