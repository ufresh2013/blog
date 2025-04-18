---
title: 字符串匹配
date: 2022-01-13 10:26:58
---
单模式串匹配：一个串跟一个串进行匹配 - BF, RK, BM, KMP算法
多模式串匹配：一个串中同时查找多个串 - Trie树和AC自动机

我们在字符串A中查找字符串B，那字符串A就是主串，字符串B就是模式串。主串的长度记作n，模式串的长度记作m。

需求：这是一个简单的搜索功能，在你输入一段字符后会得到后端返回的搜索结果，此时需要将你输入的字符串在搜索结果中变色。

### 1. BF算法
Brute Force，暴力匹配算法，在主串中，检查起始位置分别是 0,1,2...n-m 且长度为 m 的 n-m+1个子串，看有没有跟模式串匹配的。
<img src="1.jpg" />

在极端情况下主串是`'aaa...aaa(n个a)'`，模式串是`'aaaab'`，我们每次都要对比m个字符，对比n-m+1次，最坏情况的时间复杂度是O(n*m)



### 2. RK算法
BF算法只是简单粗暴地对两个字符串的所有字符依次比较，而RK算法比较的是两个字符串的[ 哈希值 ]。

每一个字符串都可以通过某种哈希算法，转换成一个整型数，`hashcode = hash(string)`。生成hashcode的算法很多，比如：按位相加。把a当做1，b当做2，c当做3...然后把字符串的所有字符相加，相加结果就是它的hashcode。

```js
bce = 2 + 3 + 5 = 10
```
这个算法虽然简单，却很可能产生hash冲突。比如bce, bec, cbe的hashcode是一样的。由于存在hash冲突的可能，我们还需要像BF算法那样，对两个字符串逐个字符比较，最终判断出两个字符串匹配。

理想情况下，RK算法的时间复杂度是O(n)。极端情况下，哈希算法大量冲突，时间复杂度退化为O(m*n)。



### 3. BM算法
BM算法核心思想是，利用模式串本身的特点，在模式串中某个字符与主串不能匹配的时候，将模式串往后多华东几位，以此来减少不必要的字符比较，提高匹配的效率。

当遇到不匹配的字符时，有什么固定的规律，可以将模式串往后多滑动几位呢？BM算法，就是在寻找这种规律。

- 坏字符串规则
- 好后缀规则



### 4. KMP算法
在模式串和主串匹配过程中，把不能匹配的那个字符仍然叫做 坏字符，把已经匹配的那段字符叫做 好前缀。


### 5. Trie数
如何实现搜索引擎的搜索关键词提示功能？

Trie树的本质，就是利用字符串质检的公用前缀，将重复的前缀合并在一起。
Ttie树主要有两个操作，一个是将字符串集合构造成Trie数。另一个是在Trie树种查询一个字符串。

实际上Trie只是不适合精确匹配查找，比较适合的是查找前缀匹配的字符串。Trie数可以应用到自动输入补全，比如输入法自动补全功能，IDE代码编辑器自动补全功能，浏览器网址输入的自动补全。


### 6. AC自动机
很多支持用户发表文本内容的网站，如BBS，大都有敏感词过滤功能，用来过滤掉用户输入的一些内容。通过维护一个敏感词的字典，当用户输入一段文字内容后，通过字符串匹配算法，来查找用户输入的这段文字，是否包含敏感词，如果有，就用`***`替代掉。

多模式串匹配算法，就是在多个模式串和一个主串之间做匹配，也就是在一个主串中查找多个模式串。

- [什么是字符串匹配算法？](https://mp.weixin.qq.com/s/67uf7pRxXh7Iwm7MMpqJoA)
- [一个需求引发的算法及优化(KMP算法)](https://juejin.im/post/5a30c011f265da43333e63b9)