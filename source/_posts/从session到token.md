---
title: Session, token与OAuth
date: 2019-02-16 17:57:46
category: Basic
---
### 1. Web登录的本质
由于**HTTP是无状态协议**，所以服务端需要记录用户状态时，就需要某种机制来识别具体的用户，这个机制就是*`Session`*。

<br/>
### 2. cookie和Session
常用的会话跟踪技术是cookie和session
cookie是存储在客户端，session是存储在server端
可以说，cookie是一种补足http协议无状态的机制

一个cookie的设置分为4步
- 客户端发送http请求
- 服务器响应http请求 set-cookies response
- 客户端发送http请求 包含cookie头部 发送到服务器端
- 服务器返回一个http response

<br/>
<img src="1.png" style="max-width: 500px" />

session 是用服务器来保持状态的。专门为用户开辟存储空间，session被创建后会保存在服务器中，其中session ID则发送给客户端，客户端下次发送请求携带session ID，服务器则会查询该ID 找到对应的session读取信息。

在使用session机制保持持久化登陆的实现上可以将sessionID保存在 cookie、header、URL中，客户端带着sessionID过来，服务器根据这个sessionID判断是否存在当前会话。




所以， *`Session`*是在服务端保存的一个数据结构，用来跟踪用户的状态，这个数据可以保存在集群、数据库、文件中。
*`Cookie`*是客户端保存用户信息的一种机制，用来记录用户的一些信息，也是实现Session的其中一环。


<br/>
### 3. 从Session到token
Session的问题在于，扩展性不好。如果是服务器集群，或跨域的服务导向架构，就要求session数据共享，单点登录。服务器需要保存并管理所有人的session id, 这是一个巨大的开销。*可以不保存这些Session ID吗？*

比如，对数据做一个签名。用HMAC-SHA256算法，加上一个只有我知道的密钥，对数据做一个签名，**把这个数据和签名一起作为`token`**，由于密钥别人不知道，就无法伪造token了。
<br/>
<img src="2.png" style="max-width: 300px">
<br/>
这个token服务器不保存，只有小F把token发过来的时候，再用同样的HMAC-SHA256算法和同样的密钥，对数据再计算一次签名，和token中的签名做比较.如果相同，我们就知道小F已经登录过了，并且可以直接去到小F的user id。如果不相同，数据部分肯定被人篡改过，就可以告诉发送者: 对不起，没有认证。

这样一来，服务器就不保存session id了，它只是生成token, 验证token，用CPU的计算时间换取了session的存储空间。

<br/>
### 3. JWT
`JWT(JSON Web Token)`是目前最流行的跨域认证解决方案。
<img src="3.png" />

JWT大致长这样，它是一个很长的字符串，中间用`.`分隔成三部分。JWT不仅用于认证，也可以用于交换信息。有效使用JWT，可以降低服务器查询数据库的次数。
```
Header(头部).Payload(负载).Signature(签名)
```

<br/>
#### 3.1 *`Header`*
Header描述JWT的元数据, `alg`表示签名的算法，默认是HMAC SHA156。 `typ`表示这个token的类型，统一写为`JWT`。
```
{ "alg": "HS256", "typ": "JWT"}
```
<br/>

#### 3.2 *`Payload`*
Payload用于存放实际需要传递的数据。JWtT规定了7个官方字段。除了官方字段，你还可以定义私有字段，JWT默认是不加密的，所以不要把秘密信息放在这里。
```
iss (issuer)：签发人
exp (expiration time)：过期时间
sub (subject)：主题
aud (audience)：受众
nbf (Not Before)：生效时间
iat (Issued At)：签发时间
jti (JWT ID)：编号
```


<br/>
#### 3.3 *`Signature`*
Signature是对前两部分的签名。


<br/>

### 4. OAuth
[OAuth](http://www.rfcreader.com/#rfc6749) 是一个关于授权(authorization)的开放网络标准。OAuth在“客户端”与“服务提供商”之间，设置了一个授权层。“客户端”登录授权层以后，获取token，“服务提供商”根据token的权限范围和有效期，向“客户端”开放用户储存的资料。OAuth有以下几种常用模式：
<br/>

#### 4.1 Resource Owner Password Credentials Grant(资源所有者密码凭据认可)
小A直接提供用户名和密码，让"信用卡管家"向“网易认证中心”请求token。
<br/>


#### 4.2 Implicit Grant(隐式许可)
小A用网易账号登录，确认授权后，会重定向到“信用卡管家”网站，同时捎带一个`token`。信用卡管家就可以用这个token，来访问网易开放的资源。
<br/>
<img src="4.png">
<br/>


#### 4.3 Authorization Code Grant(授权码许可)
小A用网易账号登录的时候，网易认证中心不直接发token，而是发一个授权码`(authorization code)`。当“信用卡管理中心”取到这个code以后，在后台再次访问网易认证中心，这一次才拿到了真正的token。

授权码模式是功能最完整，流程最严密的授权模式。
<br/>
<img src="5.png">


#### 4.4 解析jwt



<br/>
### 参考资料
- [干掉状态: 从session到token](https://mp.weixin.qq.com/s?__biz=MzAxOTc0NzExNg==&mid=2665513566&idx=1&sn=a2688cadbe9c8042ff1abbdf04a8bd5e&chksm=80d67a1db7a1f30b28b93ed2ab29edfbf982b780433e4bfd178e3cc52cb1f9100cc8f923db4f&scene=21#wechat_redirect)
- [从密码到token](https://mp.weixin.qq.com/s?__biz=MzAxOTc0NzExNg==&mid=2665513744&idx=1&sn=93d0db97cfd67422bcd21c8afd00f495&chksm=80d67b53b7a1f24537fdc7c10eb2783357c1f8c65ad55601a722216d2293ae3fb7b1c16e5449&scene=21#wechat_redirect)
- [Cookie和Session有什么区别？](https://www.zhihu.com/question/19786827)
- [The OAuth 2.0 Authorization Framework](http://www.rfcreader.com/#rfc6749)
- [cookie与session实现持久化登陆](https://www.xiaolai.cc/2019/04/23/cookie/)
- [前后端分离使用 Token 登录解决方案](https://juejin.im/post/5b7ea1366fb9a01a0b319612)