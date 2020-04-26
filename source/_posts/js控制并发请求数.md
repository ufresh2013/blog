---
title: js控制并发请求数
date: 2020-02-22 18:51:13
category: Bug
---
### 1. Bug
碰到一个图片列表，部分图片请求失败的bug，处理了一波请求失败要怎么显示。
准备回家搞完最后一点，结果回家之后，网速变慢了，打开一看，请求失败的图片更多了。

<img src="3.jpg" style="max-width: 100px">

仔细一看，http status为*canceled*，时间都在30s之后。
也就是说，不是图片加载不出来，而是一时间并发请求太多，请求堵塞，导致后面的请求超时，导致最终被取消。
**（ 浏览器限制同一域名同一时间只能有6个并发请求 ）**

<img src="2.png">


<img src="1.png">


<br/>
### 2. 为什么平时批量请求图片没问题
这次的图片是通过XHR请求，获取图片的base64内容。我们一般会给XHR设置一个超时时间，而平时用的`<img src>`没有人为的超时限制，只有服务器明确返回请求失败，才算失败。

<br/>
### 3. 解决
这时我们需要实现一个并发控制函数，保证每次最多只有6个请求，无论哪一个先执行完，都会继续执行下一个，直到所有请求完成。
```js
/*
 * @params list {Array} 等待请求的队列
 * @params limit {Number} 控制的并发数量最大数
 * @params asyncHandle {Function} 对list每一项的请求函数，必须return Promise来继续进行请求
 * @return {Promise} 返回一个 Promise 确认所有数据是否迭代完成
 */
let mapLimit = (list, limit, asyncHandle) => {
    let recursion = (arr) => {
        return asyncHandle(arr.shift())
            .then(() => {
                if (arr.length !== 0) {
                    return recursion(arr) // 数组未迭代完，继续请求
                }
            })
    }
    let listCopy = [].concat(list)
    let asyncList = [] // 正在进行的所有并发异步操作
    while (limit--) {
        asyncList.push(recursion(listCopy))
    }
    return Promise.all(asyncList) // 所有并发异步操作都完成后，本次并发控制迭代完成
}
```

<br/>
### 参考资料
- [15行代码实现并发控制](https://github.com/SunshowerC/blog/issues/2)