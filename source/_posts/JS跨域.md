---
title: JS跨域
date: 2018-11-06 17:57:46
tags: JS
category:
- JS
---
### 1. 同源策略
为什么会出现跨域？因为存在同源策略。

> 同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。（同源: 如果两个页面的协议，端口和域名都相同，则两个页面具有相同的源。）

<br/>
#### 1.1 受同源策略约束的交互
- *dom同源策略*
  禁止对不同源页面DOM进行操作。这里主要场景是iframe跨域的情况，不同域名的iframe是限制互相访问的。
- *XmlHttpRequest同源策略*
  禁止使用XHR对象向不同源的服务器地址发起HTTP请求。
<br/>

#### 1.2 可执行的跨源访问
- `<script src="..."></script> ` 标签嵌入跨域脚本 
- `<link rel="stylesheet" href="...">` 标签嵌入CSS
- `<img>`嵌入图片
- `<video> 和 <audio>` 嵌入多媒体资源。
- `<object>, <embed> 和 <applet>`的插件
- `@font-face` 引入的字体
- `<frame> 和 <iframe>` 载入的任何资源。站点可以使用X-Frame-Options消息头来阻止这种形式的跨域交互。
- `CORS`跨域资源共享机制，允许跨域访问

<br/>
### 2. 跨域解决方案
#### 2.1 CORS
CORS 跨域资源共享，它允许浏览器向跨域服务器，发出XMLHttpRequest请求，从而克服ajax只能同源使用的限制。

整个CORS通信过程，由浏览器自动完成，对开发者来说，CORS通信与ajax没有差别。浏览器一旦发现ajax请求跨源，会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。*浏览器将CORS请求分成两类：简单请求和非简单请求*

<br/>
##### 2.1.1 CORS简单请求
简单请求需满足两个条件
```
1、请求方法是以下三种之一
HEAD
GET
POST

2、HTTP的头部信息不超过以下几种
Accept
Accept-Language
Content-Language
Last-Event-ID
Content-Type：限三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
```
对于简单请求，浏览器直接发出CORS请求，并在头信息中，增加`Origin`字段
```
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
```
如果`Origin`指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应，回应头信息中没有`Access-Control-Allow-Origin`字段，就知道错了，从而抛出一个错误，被`XMLHttpRequest`的`onerror`回调函数捕获。

如果`Origin`指定的源在许可范围内，服务器返回的响应，会多出几个头信息字段。
```
Access-Control-Allow-Origin: http://api.bob.com  // 接受哪些域名的请求
Access-Control-Allow-Credentials: true           // 是否允许发送cookie
Access-Control-Expose-Headers: FooBar            // 可选
```


<br/>
##### 2.1.2 CORS非简单请求
对服务器有特殊要求的请求，如请求方法是`PUT`或`DELETE`,或`Content-Type`字段类型是`application/json`。
```
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

非简单请求，会在正式通信之前，增加一次HTTP查询请求，称为“预检”（preflight）。
*预检请求*用的请求方法是`OPTIONS`，表示这个请求是用来询问的。
```
// 预检请求的头信息
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT

// 指定浏览器CORS请求会额外发送的头信息字段
Access-Control-Request-Headers: X-Custom-Header 
Host: api.alice.com
```


服务器收到“预检”请求号，检查了`Origin, Access-Control-Request-Method 和 Access-Control-Request-Headers`字段后，确定允许跨域请求，做出回应。
```
HTTP/1.1 200 OK
// 服务器回应的CORS相关字段
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Max-Age: 1728000
```

如果服务器否定了“预检”请求，会返回一个正常的HTTP回应，但没有任何CORS相关的头信息字段。浏览器会认定服务器不同意预检请求，因此触发一个错误，被`XMLHttpRequest`的`onerror`回调函数捕获。


<br/>
##### 2.1.3 withCredentials
CORS请求默认不发送Cookie和HTTP认证信息。如果要把cookie发到服务器，服务器需要指定`Access-Control-Allow-Credentials`字段。
```
Access-Control-Allow-Credentials: true
```

开发者必须在ajax请求中打开`withCredentials`属性。
```
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

注意，如果要发送Cookie，`Access-Control-Allow-Origin`不能设为星号，必须指定明确的，与请求网页一致的域名。同时，Cookie仍遵循同源政策，跨源(原网页代码中)的`document.cookie`无法读取服务器域名下的Cookie。

<br/>
#### 2.2 JSONP
动态增加来一个script标签，请求来自服务器的一段js并执行。（只能get请求）
```
<script type="text/javascript">
    // script加载完成后执行该代码
    var functionHandler = function(data){
        console.log(data);
    }
    // 请求中可以增加参数
    var url = 'http://xxx.com/xxxx?prams=xxx&callback=functionHandler';
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script); 
</script>
```

服务器返回的script文件内容
```
functionHandler(data)
```


<br/>
#### 2.3 服务器代理
在服务器端配置好代理，浏览器端就不会出现跨域的问题
在开发阶段比较常实现
devsever的proxy就是用来该原理
在devsever中配置代理，原指向devserver的请求被代理到目标地址，在服务器中http请求没有跨域限制，所以解决了浏览器js跨域的问题

<br/>
#### 2.4 document.domain
修改`document.domain`实现子域不同的页面进行跨域交互。`document.domain`存放的是载入文档的服务器的主机名，可以手动设置这个属性，但只能设置成当前域名或上级域名，如id.qq.com, qq.com。
```
document.domain = 顶级域名
```



<br/>
#### 2.5 window.name
`window.name`利用同一窗体下加载不同的页面，window.name的值不会清除，达到传递数据的效果。（数据大小支持到2MB）。具体操作需要3个页面
```
a 域名下的 origin page
a 域名下的 proxy page
b 域名下的 data page
```

a 域名下origin page 通过动态的iframe 加载 data page, data page中设置了window.name = data数据。

可是此时 origin page的域名与data page域名不一致，浏览器限制交互，所以需要将iframe跳转到proxy page（即iframe的scr值设置为proxy page）。此时iframe与 origin page同源，可以操作获取到iframe 的window.name中的数据，获取完毕后销毁iframe。

这样origin page就可以获取到非同源下的 data page数据。

a域名下的 origin page
```
<script type="text/javascript">
    var a=document.getElementsByTagName("button")[0];
    a.onclick=function(){                               
        var inf=document.createElement("iframe");       //创建iframe
        inf.src="http://www.b.com/data.html"+"?h=5"     //加载数据页www.b.com/data.html?h=5
        var body=document.getElementsByTagName("body")[0];
        body.appendChild(inf);                          //引入a页面

        inf.onload=function(){
            inf.src='http://www.a.com/proxy.html'       //iframe加载完成，加载www.a.com域下边的空白页proxy.html
            console.log(inf.contentWindow.name)        //输出window.name中的数据
            body.removeChild(inf)                      //清除iframe
        }
    }
</script>
```

b域名下 data page
```
<script>
    // var str = window.location.href.substr(-1,1);      //获取url中携带的参数值h=5
    // 因为已经是b域名下的页面了，可以通过请求各种b域名下的数据再设置window.name的值
    window.name = 'some data'
</script>
```


### 参考资料
- [js跨域](https://www.xiaolai.cc/2018/11/02/js%E8%B7%A8%E5%9F%9F/)
- [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)