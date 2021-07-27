---
title: Date
date: 2020-05-06 10:12:42
category: JS
---
### 1. Date对象
`Date()`构造函数有四种基本形式
- **没有参数** : 如果没有输入任何参数，Date构造器会依据系统设置的当前时间来创建一个Date对象
```js
new Date()
```

- **Unix时间戳** : 一个整数值，表示自1970年1月1日 00:00:00 UTC以来的毫秒数。注意时间戳仅精确到秒。如
```js
new Date(value)
```

- **时间戳字符串** : 表示日期的字符串值。如果要用日期字符串参数，则需要用全球都能接受的格式，其中一种格式是ISO 8601扩展格式，其中小时、分钟、秒、毫秒都是可选的。
```js
/* ISO 8601 Extended format
  YYYY：4位数年份
  MM：两位数月份(即 1月为01,12月为12)
  DD：两位数的日期(0到31)
  -：日期分隔符
  T：表示开始时间
  HH：24位小时数（0到23）
  mm：分钟（0到59）
  ss：秒（0到59）
  sss：毫秒（0到999）
  :：时间分隔符
  Z：如果存在Z，则日期将设置为UTC，如果Z不存在，则为本地时间。
*/
new Date(`YYYY-MM-DDTHH:mm:ss:sssZ`)
```


- **分别提供日期时间的每一个成员**
注意：如果数值大于合理范围时（如monthIndex = 13, minutes = 70），相邻的数值会被调整
```js
new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)

new Date(2013, 13, 1) 
// 相当于 new Date(2014, 1, 1)

new Date(2013, 2, 1, 0, 70)
// 相当于 new Date(2013, 2, 1, 1, 10)
```

参数| 含义
---|:--:|---:
year | 表示年份的整数值，0-99会被映射至1900-1999年，其他值代表实际年份
monthIndex | 表示月份的整数值，从0（ 1月 ）到11（ 12月 ）
day | 可选，表示一个月中的第几天的整数值，从1开始。默认值为1
hours | 可选，表示小时的整数值（24小时制）。默认值为0
minutes | 可选，表示分钟的整数值。默认值为0
secondes | 可选，表示秒的整数值。默认值为0
millseconds | 可选，表示毫秒的整数值。默认值为0


<br/>
### 2. 方法
由于存在时区的概念，JS里有两个时间：本地时间和协调世界时(UTC时间)。
- *本地时间* 是指你的计算机所在的时区
- *UTC* 是格林威治标准时间(GMT)的同义词


JS中的每个日期方法都是本地时间，只有指定UTC，才能获取UTC时间。中国处于东八区，与UTC时间相差8小时，UTC时间00:00:00的时候，我们的时间是08:00:00

```js
new Date('2020-11-11')
// Wed Nov 11 2020 08:00:00 GMT+0800 (中国标准时间)
```

方法 | 含义
---|:--:|---:
`Date.now()` | 返回自1970-1-1 00:00:00 UTC至今所经过的毫秒数
`Date.UTC()` | 接受构造函数最长形式的参数相同的参数，返回从1970-1-1 00:00:00开始所经过的毫秒数
`Date.parse()` | 解析一个表示日期的字符串，返回从1970-1-1 00:00:00所经过的毫秒数(不推荐使用)
*Getter 本地时间* | 
`Date.prototype.getFullYear()` |  返回年份(四位数字)
`Date.prototype.getMonth()` | 返回月份(0~11)
`Date.prototype.getDate()` | 返回月份中的第几天(1~31)
`Date.prototype.getDay()` | 返回星期中的第几天(0~6)
`Date.prototype.getHours()` | 返回小时(0~23)
`Date.prototype.getMinutes()` | 返回分钟(0~59)
`Date.prototype.getSeconds()` | 返回秒数(0~59)
`Date.prototype.getMilliseconds()` | 返回毫秒(0~999)
`Date.prototype.getTime()` | 返回从1970-1-1 00:00:00所经过的毫秒数
`Date.prototype.getTimezoneOffset` | 返回当前时区的时区偏移
*Setter 本地时间* |
`Date.prototype.setFullYear()` |  设置年份(四位数字)
`Date.prototype.setMonth()` | 设置月份(0~11)
`Date.prototype.setDate()` | 设置月份中的第几天(1~31)
`Date.prototype.setHours()` | 设置小时(0~23)
`Date.prototype.setMinutes()` | 设置分钟(0~59)
`Date.prototype.setSeconds()` | 设置秒数(0~59)
`Date.prototype.setMilliseconds()` | 设置毫秒(0~999)
`Date.prototype.setTime()` | 指定时间戳来设置日期对象的时间
*Getter 世界时间* |
`Date.prototype.getUTCFullYear()` |  返回年份(四位数字)
`Date.prototype.getUTCMonth()` | 返回月份(0~11)
`Date.prototype.getUTCDate()` | 返回月份中的第几天(1~31)
`Date.prototype.getUTCDay()` | 返回星期中的第几天(0~6)
`Date.prototype.getUTCHours()` | 返回小时(0~23)
`Date.prototype.getUTCMinutes()` | 返回分钟(0~59)
`Date.prototype.getUTCSeconds()` | 返回秒数(0~59)
`Date.prototype.getUTCMilliseconds()` | 返回毫秒(0~999)
`Date.prototype.getUTCTime()` | 返回从1970-1-1 00:00:00所经过的毫秒数
*Setter 世界时间* |
`Date.prototype.setUTCFullYear()` |  设置年份(四位数字)
`Date.prototype.setUTCMonth()` | 设置月份(0~11)
`Date.prototype.setUTCDate()` | 设置月份中的第几天(1~31)
`Date.prototype.setUTCHours()` | 设置小时(0~23)
`Date.prototype.setUTCMinutes()` | 设置分钟(0~59)
`Date.prototype.setUTCSeconds()` | 设置秒数(0~59)
`Date.prototype.setUTCMilliseconds()` | 设置毫秒(0~999)
*Conversion getter* | 返回值
`Date.prototype.toDateString()` | Wed May 06 2020
`Date.prototype.toISOString()` | 2020-05-06T06:17:38.124Z
`Date.prototype.toJSON()` | 2020-05-06T06:17:38.124Z
`Date.prototype.toLocaleDateString()` | 2020/5/6
`Date.prototype.toLocaleString()` | 2020/5/6 下午2:17:38
`Date.prototype.toLocaleTimeString()` | 下午2:17:38
`Date.prototype.toString()` | Wed May 06 2020 14:17:38 GMT+0800 (中国标准时间)
`Date.prototype.toTimeString()` | 14:17:38 GMT+0800 (中国标准时间)
`Date.prototype.toUTCString()` | Wed, 06 May 2020 06:17:38 GMT
`Date.prototype.valueOf()` | 1588745858124



<br/>
### 3. 常用方法
- 校验日期格式

- 时间戳
```js
// 当前时间戳
const seconds = Math.floor(Date.now() / 1000)

// 指定日期转时间戳
const seconds = 

// 时间戳转日期
```

- 时间格式化
```js
const 

```

- 根据日期获取区间
```js
// 获取日期所在周区间

// 获取日期所在月区间

// 获取日期所在年

```

- 计算时间差
```js
var start = new Date('2020-01-02')
var end = new Date('2020-01-03')
var elapsed = end.getTime() - start.getTime()
```

- 比较日期

- 从一个日期添加/减去增量

- UTC，本地时间转换


<br/>
### 参考资料
- [需要知道的JS的日期的知识，都在这了](https://juejin.im/post/5d12b308f265da1b7c612746)
- [【译】你可能不需要Moment.js](https://juejin.im/post/5b9f4df66fb9a05d2e1b8f02#heading-13)
- https://github.com/iamkun/dayjs/blob/dev/src/index.js