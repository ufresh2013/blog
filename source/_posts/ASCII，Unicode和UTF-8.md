---
title: 字符集和字符编码
date: 2019-02-16 17:57:46
category: Other
---
一直听说`ASCII`, `Unicode`, `UTF-8`这些词，但是不知道具体意思。痛定思痛，决定总结一下。


### 1. 历史渊源
#### 1.1 ASCII码
我们知道，在计算机内部，所有的信息最终都表示为一个二进制的字符串。每一个二进制位(bit)有0和1两种状态，因此8个二进制位可以组合出`256`中状态，这被称为一个字节(byte)。

上世纪60年代，美国制定了一套字符编码，对英语字符与二进制之间的关系，做了统一规定。这被称为`ASCII码(American Standard Code for Information Interchange)`，一直沿用至今。ASCII码一共规定了128个字符的编码。比如空格是32(二进制00100000)，大写的字母A是65(二进制01000001)。这128个符号，只占用了一个字节的后面7位，最前面的1位统一规定为0。


#### 1.2 GBK
后来，世界各地都开始使用计算机，但是很多国家用的不是英文，他们的字母里有很多是`ASCII`里没有的。等到中国人民用计算机之后，发现没有中文怎么办呢？

中国人的解决方案是：小于127号的还是继续使用，并且用2个大于127字节表示一个中文字符。在这些编码里，我们还把数学符号、罗马希腊的字母、日本的假名们都编进去了，连在ASCII里本来就有的数字、标点、字母都统统重新编了两个字节长的编码，这就是常说的 *全角* 字符，而原来在127号以下的那些就叫 *半角* 字符了。

这套编码方案被称为`GBK`标准。中国的程序员看到这一系列汉字编码的标准是好的，于是把它通称为`DBCS`(Double Byte Charecter Set 双字节字符集)。


#### 1.3 Unicode
但是每个国家都搞自己的字符编码，自己只能看自己，别人的看不来，这不符合web开放的文化啊。

正在这时一个叫ISO（国际标准化组织）的国际组织决定解决这个问题。他们采用的方法很简单：废了所有地区性编码方案，重新搞了一个包括了地球上所有文化、所有字母和符号的编码！他们打算叫它"Universal Multiple-Octet Coded Character Set"，简称UCS, 俗称`Unicode`。

`Unicode`开始制定时，计算机的存储器容量极大地发展了，空间不再成为问题。于是ISO就直接规定必须用**两个字节**， 16位来统一表示所有的字符，对于ASCII里那些“半角字符”， 也将其长度由原来的8位扩展至16位。这种大气的方案使得保存英文文本时会浪费多一倍的空间。


#### 1.4 UFT-8
**Unicode有两个严重的问题**: 1. 怎样区别Unicode和ASCII？计算机怎么知道2个字节为1个字符，还是1个字节为1个字符。2. 计算机大部分内容还是英文，Unicode的编码方式很浪费空间。


Unicode在很长一段时间内无法推广。直到互联网的出现，强烈要求出现统一的编码方式。`UTF-8`就是互联网上使用最广的一种Unicode的实现方式。UTF-8最大的一个特点，就是它是一种*变长的编码方式*。它可以使用1~4个字节表示一个符号。UTF-8的编码规则很简单，只有两条：

- 对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英文字母，UTF-8编码和ASCII码是相同的。

- 对于n字节的符号(n > 1)， 第一个字节的前n位都设为1， 第n+1位设为0，后面字节的前两位一律设为10.剩下的没有提及的二进制位，全部为这个符号的unicode码。

```
Unicode符号范围       | UTF-8编码方式
(十六进制)            | 二进制
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```


#### 1.5. Charset and Encoding
所以, 字符集和字符编码，你可以这样理解
- *`Charset(Character set) 字符集`*
是对字符抽象表示的集合。包括世界上各种文字、符号。

- *`Encoding(Character Encoding) 字符编码`*
建立字符集合和计算机系统对应的规则。简单来说就是，将字符转化为计算机可识别的二进制编码的规则。

```
<meta http-equiv=Content-Type content="text/html;charset=utf-8">
```

 
### 2. 乱码
编码A和编码B采用不同方式来编码，当一个文件使用编码A在只有编码B的设备上解码，就会出现乱码。


### 3. 转义字符
所有编程语言，都拥有转义字符。

*出现转义字符的原因*
- 使用转义字符来表示没有现成文字代号的字符，如回车，换行，ASCII里的控制字符。
- 一些特定的字符在语言中被定义为特殊用途，失去了原来的意义。

*转义字符的作用*
- 用于表示不能直接显示的字符
- 将有特殊意义的字符转换回它原来的意义
- 处于网站安全，在数据写入数据库前，都会使用转义字符对一些敏感字符转义



#### 3.1 C
所有ASCII码都可以用`\`加8进制数字来表示。C中定义了一些字母前加`\`来表示常见的，不能显示的ASCII字符，成为转义字符。

转义字符|意义|ASCII码值(十进制)
---|:--:|---:
\a|响铃|007
\b|退格|008
\f|换页|012
\n|换行|010
\r|回车|013
\t|水平制表（跳到下一个tab）位置|009
\v|垂直制表|011
`\\`|代表一个反斜线字符`\`|092
\'|代表一个单引号|039
\"|代表一个双引号字符|034
\?|代表一个问号|063
\0|空字符()|000
\ddd|1到3位八进制数所代表的任意字符|三位八进制
\xhh|1到2位十六进制所代表的任意字符|二位十六进制


#### 3.1 html
HTML中`<`, `>`, `&`等有特殊含义(<>用于标签符，&用于转义)，常用

显示|说明|实体名称
---|:--:|:--:
<	| 小于 	|`&lt;`
`>`	| 大于 |`&gt;`
&	| &符号|`&amp;`
"	| 双引号|`&quot;`
 	|不断行的空白格|`&nbsp;`


#### 3.2 js
`\`反斜杠用来在文本字符串中插入特殊字符。
```
var txt = "We are the so-called \"Vikings\" from the north."
```
代码|输出
---|:--:|
\' |单引号
\" |双引号
\& |和号
`\\` |反斜杠
\n |换行符
\r |回车符



### 4. URL编码函数
世界上有英文字母的网址`“http://www.baidu.com”`,但是没有希腊字母的网址`“http://www.aβγ.com”`。这是因为网络标准RFC 1738做了硬性规定：
> "...Only alphanumerics [0-9a-zA-Z], the special characters "$-_.+!*'()," [not including the quotes - ed], and reserved characters used for their reserved purposes may be used unencoded within a URL."

只有字母和数字[0-9a-zA-Z],一些特殊符号`$-_.+!*'(),`(不包括双引号),以及某些保留字，才可以不经过编码直接用于URL。这意味着，如果URL中有汉字，就必须编码后使用。但麻烦的是，RFC1738没有规定具体的编码方法，于是有了编码函数。


#### 4.1 浏览器编码
当网址路径中包含汉字，`GET`和`POST`查询字符串中包含汉字时
```
http://www.haoroom.con/search?keywords=您好
```
编码方法由网页的编码决定
```
<meta http-equiv="Content-Type" content="text/html;charset=xxxx">
```


#### 4.2 escape
`escape()`已被弃用，它的作用是返回字符的Unicode编码值。对应的解码函数是`unescape`。
```
javascript:escape("春节");
// "%u6625%u8282"

javascript:escape("hello word");
// "hello%20word"
```

无论网页的原始编码是什么，一旦被javascript编码，都会变成Unicode字符。也就是，Javascript的输入和输出都是unicode字符。
```
javascript:escape("\u6625\u8282");
// "%u6625%u8282"

javascript:unescape("%u6625%u8282");
// "春节"

javascript:unescape("\u6625\u8282");
// "春节"
```
其次，`escape()`不对`+`编码。但是，网页在提交表单的时候，如果有空格，则会被转化为`+`字符。服务器处理数据的时候，会把`+`号处理成空格。所以，使用的时候要小心。



#### 4.3 encodeURI
对整个URI进行编码。除了常见的符号外， 对特殊符号`';/?:@&=+$,#`不进行编码。编码后，输出符号是`UTF-8`形式，并且在每个字节上前加上`%`。对应的解码函数是`decodeURI`。

```
encodeURI('https://www.baidu.com/s?wd=中文')
// "https://www.baidu.com/s?wd=%E4%B8%AD%E6%96%87"
```

需要注意的是，它不对单引号`'`编码。


#### 4.4 encodeURIComponent
对于`';/?:@&=+$,#`，这些在`encodeURI`中不被编码的符号，在`encodeURIComponent`中统统会被编码。对应的解码函数是`decodeURIComponent`。
```
encodeURIComponent("https://www.baidu.com/s?wd=中文")
// "https%3A%2F%2Fwww.baidu.com%2Fs%3Fwd%3D%E4%B8%AD%E6%96%87"
```



### 5. ES6字符串
ES6加强了对Unicode的支持，并且扩展了字符串对象。

#### 5.1 UTF-16码位
在ES6出现前，Javascript字符串一直基于16位字符编码(UTF-16)进行构建。过去16位足以包含任何字符，直到Unicode引入扩展字符集，编码规则才不得不进行更改。为此，`UTF-16`引入了代理对，规定了用两个16位编码单元表示一个码位。
因此，字符串里的字符有两种:
- 一种是由一个编码单元16位表示的BMP字符
- 另一种是由两个编码单元32位表示的辅助平面字符。

```
"\uD842\uDFB7"
// "𠮷"

"\u0061"
// "a"
```


#### 5.2 codePointAt
`codePointAt`方法接受编码单元的位置而非字符位置作为参数，返回与字符串中给定位置对应的码位。
```
let text = "𠮷a";
console.log(text.charCodeAt(0)) // 55362
console.log(text.charCodeAt(1)) // 57271
console.log(text.charCodeAt(2)) // 97

// codePointAt能够正确处理4个字节储存的字符，返回一个字符的码点。
console.log(text.codePointAt(0)) // 134071
console.log(text.codePointAt(1)) // 57271
console.log(text.codePointAt(2)) // 97
```

检测一个字符占用的编码单元数量
```
function is32Bit(c){
	return c.codePointAt(0) > 0xFFFF;
}
```


#### 5.3 fromCodePoint
根据指定的码位生成一个字符。
```
String.fromCodePoint(134071) // "𠮷"
```


#### 5.4 normalize
如果我们要对不同字符进行排序或对比，一定先把它们标准化为同一种形式。
```
text.normalize()
```




### 参考资料
- [ASCII，Unicode和UTF-8 (Charset and Encoding)](http://chunge2016.online/2017/05/19/ASCII%EF%BC%8CUnicode%E5%92%8CUTF-8-Charset-and-Encoding/)
- [字符编码中ASCII、Unicode和UTF-8的区别](https://www.cnblogs.com/liupp123/articles/8023861.html)
- [转义字符](https://baike.baidu.com/item/%E8%BD%AC%E4%B9%89%E5%AD%97%E7%AC%A6/86397?fr=aladdin)
- [url的三个js编码函数escape(),encodeURI(),encodeURIComponent()简介](https://www.haorooms.com/post/js_escape_encodeURIComponent)
- [字符串的扩展](http://es6.ruanyifeng.com/?search=char&x=0&y=0#docs/string#%E5%AD%97%E7%AC%A6%E7%9A%84-Unicode-%E8%A1%A8%E7%A4%BA%E6%B3%95)
- 《深入理解ES6》第二章 字符串和正则表达式