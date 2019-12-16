---
title: XHR：实现一个Axios
date: 2019-06-26 14:06:28
category: Browser
---

### 1. Ajax
#### 1.1 发送请求
创建XHR对象后，用的第一个方法是open()，open方法不会真正发送请求，而只是启动一个请求已备发送。
```js
var xhr = new XMLHttpRequest();
xhr.open('get', 'example.php', false);
xhr.setRequestHeader('MyHeader', 'MyValue');
xhr.send(null);
```

<br/>
#### 1.2 监听请求状态
XHR的*`readyState`*属性，表示请求/响应过程的当前活动阶段。只要readyState属性的值由一个值变成另一个值，都会触发一次*`readystatechange`*事件。
- 0: 未初始化，尚未调用open()方法
- 1: 启动，已经调用open()方法，但尚未调用send()方法
- 2: 发送，已经调用send()方法， 当尚未接收到响应
- 3: 接收，已经接收到部分响应数据
- 4: 完成，已经接收到全部响应数据，而且已经可以在客户端使用了。



<br/>
#### 1.3 读取返回内容
请求发出后，javascript代码会等到服务器响应之后再继续执行。在收到响应后，*`xhr.readyState == 4`*, 响应的数据会自动填充XHR对象的属性。相关属性
- xhr.responseText: 作为响应主题被返回的文本
- xhr.responseXML: 如果响应的内容类型是text/xml, application/xml，这个属性中将保存包含着响应数据的XML DOM文档
- xhr.status: 响应的HTTP状态
- xhr.statusText: HTTP状态的说明

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4){
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
      alert(xhr.responseText)
    } else {
      alert("Request was unsuccessful:" + xhr.status )
    }
  }
}
```


<br/>
#### 1.4 取消请求
在接收到响应之前，还可以调用*`xhr.abort()`*方法来取消异步请求。


<br/>
#### 1.5 设置请求头
默认情况下，在发送XHR请求的同时，会发送下列头部信息。
- Accept: 浏览器能够处理的内容类型
- Accept-Charset: 浏览器能够显示的字符集
- Accept-Encoding: 浏览器能够处理的压缩编码
- Accept-Language: 浏览器当前设置的语言
- Connection: 浏览器与服务器之间连接的类型
- Cookie: 当前页面设置的任何cookie
- Host: 发出请求的页面所在的域
- Referer: 发出请求的页面的URI
- User-Agent: 浏览器的用户代理字符串

有的浏览器允许开发人员重写默认的头部信息，有的浏览器不允许这样做。建议使用自定义的头部字段，否则有可能会影响服务器的响应。
```js
// 设置请求头
xhr.setRequestHeader('myHeader', 'myValue');

// 获取响应头部信息
var myHeader = xhr.getResponseHeader('myHeader');
var allHeaders = xhr.getAllResponseHeaders();  // 返回多行文本内容
```


<br/>
#### 1.5 GET/POST
- GET请求
GET请求，将查询字符串参数追加到url的末尾，查询字符串的每个参数key,value都需使用*`encodeURIComponent()`*进行编码。所有键值对需由 & 分隔。
```js
// 对于';/?:@&=+$,#这些字符，在encodeURIComponent中统统会被编码。
function addURLParam(url, key, value) {
  url += (url.indexOf("?") == -1 ? "?" : "&");
  url += encodeURIComponent(key) + '=' + encodeURILComponent(value);
  return url
}

var url = 'example.php';
url = addURLParam(url, "name", "Nicholas");
url = addURLParam(url, "book", "Marketing");

xhr.open('get', url, false);
```

- POST请求
POST请求把数据作为请求的主体提交，数据通过`xhr.send(data)`传入。
```js
// formData
// Content-type: application/x-www-form-urlencoded
var data = new FormData();
data.append('name', 'Nicholas');
var xhr = new XMLHttpRequest();
xhr.open('post', 'postexample.php', false);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send(data);

// json
```

<br/>
#### 1.6 进度事件
- loadstart: 在接收到响应数据的第一字节时触发
- error: 在请求发生错误时触发
- abort: 调用abort()后触发
- load: 在接收到完整的响应数据时触发
- loadend: 通信完成，或触发error, abort, load事件后触发
- progress: 在接收响应期间持续不断地触发。事件会收到一个event对象，其target属性是xhr对象，包含着三个额外的属性: 

*`lengthComputable`* 进度信息是否可用的布尔值,
*`position`* 已经接收到的字节数, 
*`totalSize`* 根据Content-length响应头部确定的预期字节数。
```js
xhr.onprogress = function(event) {
  var divStatus = document.getElementById('status');
  if (event.lengthComputable) {
    divStatus.innerHTML = "Received" + event.position + "of" + event.totalSize + "bytes";
  }
}
```

<br/>
#### 1.7 跨域请求
##### 1.7.1 CORS
CORS(Cross-Origin Resource Sharing, 跨源资源共享), 在发送请求时，附加一个Origin请求头，值为请求页面的源信息(协议，域名和端口)，以便服务器根据这个头部信息来决定是否给予响应。
```js
"Origin", "http://www.nczonline.net"

// Firefox, safari, chrome无需额外编写代码，就可以触发CORS行, IE要用XDR对象
// xhr.open()里传入绝对url
xhr.open("get", "http://www.somewhere-else.com/page/", true);
```
如果服务器认为这个请求可以接受，就在*`Access-Control-Allow-Origin`*头部中返回相同的源信息。注意：请求和响应都不包含cookie信息。
```
Access-Control-Allow-Origin: http://www.nczonline.net
```
CORS存在一些安全限制
- 不能使用setRequestHeader()设置自定义头部
- 不能发送和接收cookie
- 调用getAllResponseHeaders()方法总会返回空字符串


<br/>
##### 1.7.2 Preflighted Request
CORS 通过一种叫做 Preflighted Requests 的透明服务器验证机制*支持开发人员使用自定义的头部、 GET 或 POST 之外的方法，以及不同类型的主体内容*。在使用下列高级选项来发送请求时，就会向服务 器发送一个 Preflight 请求。这种请求使用 OPTIONS 方法，发送下列头部。
```
Origin:与简单的请求相同。
Access-Control-Request-Method:请求自身使用的方法。
Access-Control-Request-Headers:(可选)自定义的头部信息，多个头部以逗号分隔。
```
服务器通过响应中返回如下头部
```
Access-Control-Allow-Origin:与简单的请求相同。
Access-Control-Allow-Methods:允许的方法，多个方法以逗号分隔。
Access-Control-Allow-Headers:允许的头部，多个头部以逗号分隔。
Access-Control-Max-Age:应该将这个 Preflight 请求缓存多长时间(以秒表示)。
```

<br/>
##### 1.7.3 withCredentials
默认情况下，跨源资源不提供凭据(cookie, HTTP认证，SSL证明)。通过将*`withCredential`*属性设为true, 可以指定某个请求应该发送凭证。如果服务端接受凭据的请求，会用下面的HTTP头部来响应。
```
Access-Control-Allow-Credentials: true
```
如果服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给 JavaScript(于是，responseText 中将是空字符串，status 的值为 0，而且会调用 onerror()事件处 理程序)。
```js
function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr){
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined"){
    xhr = new XDomainRequest();
    xhr.open(method, url); 
  } else {
    xhr = null;
  }
  return xhr; 
}
var request = createCORSRequest("get","http://www.somewhere-else.com/page/"); 
request.send();
```

<br/>
##### 1.7.4 其他跨域技术


<br/>
### 2. 实现Axios
用Promise实现一个简单的axios
```js
function Axios(obj){
  const { url, method, data } = obj;
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return 
      }

      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(xhr.statuText)
      }
    }
    xhr.send(data);
  })
}
```
使用的时候就可以用`.then()`
```js
const obj = {
  url: 'https://cnodejs.org/api/v1/topics',
  method: 'GET',
  data: ''
}

axios(obj)
  .then((response) => {
    console.log(response)
  })
  .catch((error) => {
    console.log(error)
  })

```

### 参考资料
- [JS: 用 Promise 写一个 axios](https://www.jianshu.com/p/874350b5aee7)
- 《Javascript高级程序设计》XMLHttpRequest
- [如何实现一个HTTP请求库——axios源码阅读与分析](https://juejin.im/post/5aedd4a2f265da0b9d781b85)
- [axios如何利用promise无痛刷新token](https://juejin.im/post/5d5ccdd75188255625591357)