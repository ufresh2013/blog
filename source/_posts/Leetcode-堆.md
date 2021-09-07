---
title: 堆
date: 2021-08-22 15:47:10
category: LeetCode
---
> 假设我们有10 亿个搜索关键词，如何能快速获取到Top 10的关键词呢? 
如何实现定时器SetTimeout? 按照任务设定的执行时间，如何快速地拿到最先执行的任务？
借助于堆(Heap)这种数据结构，快速获取数据流中最大值，最小值。


<br/>

### 1. 堆(Heap)
堆是一种特殊的树。只要满足这两点，它就是一个堆
- 堆是一个完全二叉树。
  完全二叉树要求，除了最后一层，其他层的节点个数都是满的，最后一层的节点都靠左排列。
- 堆中每个节点的值都必须大于等于(或小于等于)其子树中每个节点的值
  对于每个节点的值都大于等于子树中每个节点值的堆，我们叫做**大顶堆**
  对于每个节点的值都小于等于子树中每个节点值的堆，我们叫做**小顶堆**
 
大顶堆和小顶堆，就是我们想要的数据结构。它总是保持着堆顶元素是最大/最小的。这里假设我们已经实现了*大顶堆*和*小顶堆*，它允许初始化一个数组，对数组中的元素进行堆排序。向堆中插入新元素，获取堆顶元素的时间复杂度只要 O(nlogn)，并且还是原地排序算法。
```js
// 实现堆的代码在下面
class Heap {
  constructor (nums) {} // 接受一个数组，一开始对nums进行堆排序
  insert (num) {} // 往堆里插入元素
  removeMax () {} // 获取堆顶元素
}
```

堆的初始化，插入元素，获取堆顶元素的方法都有了。Leetcode题就是简单地对数组进行堆排序，然后取值了。

<br/>

### 2. 相关LeetCode题目
包括查找数组中的最大K个数，最小K个数。
- [215.数组中的第K个最大元素](https://github.com/ufresh2013/-algorithm015/blob/master/Heap/215.%E6%95%B0%E7%BB%84%E4%B8%AD%E7%9A%84%E7%AC%ACK%E4%B8%AA%E6%9C%80%E5%A4%A7%E5%85%83%E7%B4%A0.md) 
- [347.前K个高频元素](https://github.com/ufresh2013/-algorithm015/blob/master/Heap/692.%E5%89%8DK%E4%B8%AA%E9%AB%98%E9%A2%91%E5%85%83%E7%B4%A0.md) 
- [692.前K个高频单词](https://github.com/ufresh2013/-algorithm015/blob/master/Heap/692.%E5%89%8DK%E4%B8%AA%E9%AB%98%E9%A2%91%E5%8D%95%E8%AF%8D.md) 
- [Offer40.最小的K个数](https://github.com/ufresh2013/-algorithm015/blob/master/Heap/Offer40.%E6%9C%80%E5%B0%8F%E7%9A%84k%E4%B8%AA%E6%95%B0.md) 


<br/>

#### **Offer40.最小的K个数**
```js
class MinHeap {
  constructor (nums) {} // 接受一个数组，一开始对nums进行堆排序
  insert (num) {} // 往堆里插入元素
  removeMax () {} // 获取堆顶元素
}

var getLeastNumbers = function(arr, k) {
  const heap = new MinHeap(arr)
  const result = []
  while (k > 0) {
    result.push(heap.removeMin())
    k--
  }
  return result
}
```
但是，`MinHeap`最小堆怎么实现呢？由于JS没有堆这种基础数据，我们要自己手动实现堆。

<br/>

### 3. JS如何实现堆
#### 3.1 如何表示一个堆
完全二叉树适合用数组来存储。我们不需要存储左右子节点的指针，单纯通过数组的下标，就可以找到一个节点的左右子节点和父节点。
```js
    7
  /   \
  5     6
/ \   /  \
4  2  1

// 用数组存储堆的例子
// 下标为i的节点, 其左子节点的下标是 i * 2，其右子节点的下标是 i * 2 + 1, 其父节点下标为 Math.floor(i / 2)
[undefined, 7, 5, 6, 4, 2, 1]
```


#### 3.2 实现大顶堆
```js
/* 
- 往堆中插入一个元素
【 从下往上的堆化方法 】插入后使其重新满足堆的特性，这个过程，叫做堆化(heapify)。把节点放在最后，如果不满足子节点小于等于父节点的大小关系，就互换两个节点，一直重复这个过程，直到满足这种大小关系。

- 删除堆顶元素
任何节点的值都大于等于（或小于等于）子树节点的值，我们可以发现，堆顶元素就是堆中数据的最大值或最小值。
【 从上往下的堆化方法 】我们把最后一个节点放到堆顶，然后利用同样的父子节点对比方法。对于不满足父子节点关系的，互换两个节点，并重复进行这个过程。
*/
const swap = (arr, idx1, idx2) => {
  const temp = arr[idx1]
  arr[idx1] = arr[idx2]
  arr[idx2] = temp
}

class MaxHeap {
  constructor (arr) {
    this.arr = [] // 从下标1开始存储数据
    this.count = 0 // 堆已经存储的数据个数
    arr.forEach(v => this.insert(v))
  }

  insert (data) {
    this.count++
    this.arr[this.count] = data
    let i = this.count
    // 把节点放在最后，对比当前节点与父节点的关系，如果不满足，则互换节点
    while ((i / 2 | 0) > 0 && this.arr[i] > this.arr[(i / 2 | 0)]) { // 自下往上堆化
      swap(this.arr, i, (i / 2 | 0))
      i = i / 2 | 0
    }
  }

  removeMax () {
    const heapify = (arr, n, i) => {
      while (true) { // 自上往下堆化
        let maxPos = i
        if (i*2 <= n && arr[i] < arr[i*2]) maxPos = i*2
        if (i*2+1 <= n && arr[maxPos] < arr[i*2+1]) maxPos = i*2+1
        if (maxPos == i) break
        swap(arr, i, maxPos)
        i = maxPos
      }
    }

    if (this.count === 0) return -1 // 堆中没有数据
    const max = this.arr[1]
    this.arr[1] = this.arr[this.count]
    this.count--
    heapify(this.arr, this.count, 1)
    return max
  }
}
```

<br/>

#### 3.3 实现小顶堆
```js
const swap = (arr, idx1, idx2) => {
  const temp = arr[idx1]
  arr[idx1] = arr[idx2]
  arr[idx2] = temp
}

class MinHeap {
  constructor (arr) {
    this.arr = [] // 从下标1开始存储数据
    this.count = 0 // 堆已经存储的数据个数
    arr.forEach(v => this.insert(v)) // 建堆
  }

  insert (data) {
    this.count++
    this.arr[this.count] = data
    let i = this.count
    // 把节点放在最后，对比当前节点与父节点的关系，如果不满足，则互换节点
    while (i/2|0 > 0 && this.arr[i] < this.arr[i/2|0]) {
      swap(this.arr, i, (i / 2 | 0))
      i = i / 2 | 0
    }
  }
  
  removeMin () {
    const heapify = (arr, n, i) => {
      while (true) { // 自上往下堆化
        let maxPos = i
        if (i*2 <= n && arr[i] > arr[i*2]) maxPos = i*2
        if (i*2+1 <= n && arr[maxPos] > arr[i*2+1]) maxPos = i*2+1
        if (maxPos == i) break
        swap(arr, i, maxPos)
        i = maxPos
      }
    }

    if (this.count === 0) return -1 // 堆中没有数据
    const min = this.arr[1]
    this.arr[1] = this.arr[this.count]
    this.count--
    heapify(this.arr, this.count, 1)
    return min
  }
}
```
<br/>