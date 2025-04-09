---
title: BOM - 访问浏览器的功能
date: 2019-02-26 17:41:17
category: Browser
---
### 1. 简介
BOM提供了很多对象，用于访问浏览器的功能，这些功能与网页内容无关。


### 2. 窗口关系 & iframe
在浏览器中，`window`对象既是JS访问浏览器窗口的一个接口，又是JS规定的`Global`对象。如果页面包含iframe，则每个iframe都拥有自己的`window`对象，并且保存在`frames`集合中。

- *top*
`top`对象始终指向最外层的框架，也就是浏览器窗口。
你可以通过`top.frames[0]`, `top.frame["topFrame"]`, `window.top.frames[0]`来引用topFframe。

- *window*
`window`对象指向了那个框架的特定实例，而非最高层的框架。

- *parent*
`parent`对象始终指向当前框架的直接上层框架。
在`redFrame`代码中，通过`window.parent.parent.frames[0]`引用`topFrame`

- *self*
`self`始终指向`window`, 它和`window`可以互换使用

```html
<frameset>
  <frame src="top.htm" name="topFrame"></frame>
  <frame src="left.htm" name="leftFrame"></frame>
  <frame src="right.htm" name="rightFrame"></frame>
</frameset>

// rightFrame中又包含了两个iframe
<frameset>
  <frame src="red.htm" name="redFrame"></frame>
  <frame src="blue.htm" name="blueFrame"></frame>
</frameset>
```

<img src="1.png" style="max-width:350px">



### 3. 窗口属性
- 浏览器相对于屏幕左边和上边的位置
```js
var leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX;
var topPost = (typeof window.screenTop == "number") ? window.screenTop : window.screenY;
```

- 页面视口的大小（注: 无法确定浏览器窗口的大小）
```js
var pageWidth = window.innerWidth,
    pageHeight = window.innerHeight;
if (typeof pageWidth != "number"){
  if (document.compatMode == "CSS1Compat"){
      pageWidth = document.documentElement.clientWidth;
      pageHeight = document.documentElement.clientHeight;
  } else {
      pageWidth = document.body.clientWidth;
      pageHeight = document.body.clientHeight;
  }
}

```



### 4. 打开新窗口
```
window.open(url, 窗口目标，特性字符串，一个表示新页面是否取代浏览器历史记录中当前加载页面的布尔值)
```

- *窗口目标*
这个参数可以是下列任何一个特殊的窗口名称*`_self`, `_parent`, `_top`, `_blank`*，也可以指定具体值。
```
// 如果有一个叫topFrame的窗口就会在该窗口或框架加载这个url
window.open("http://www.baidu.com", "topFrame")

// 在新标签页打开url
window.open("https://www.baidu.com", "_blank")
```

- *特性字符串*
在当前窗口打开一个弹出窗口
```
window.open("http://www.baidu.com", null, "height=400,width=400,top=10,left=10,resizeable=yes")
```
设置|值|说明
---|:--:|---:
fullscreen | yes/no | 浏览器窗口是否最大化(限IE)
height     | 数值    | 新窗口的高度，不能小于100
width      | 数值    | 新窗口的宽度，不能小于100
top        | 数组    | 新窗口的上坐标，不能是负值
left       | 数组    | 新窗口的左坐标，不能是负值
location   | yes/no | 是否在浏览器窗口中显示地址栏(可能会被禁用)
menubar    | yes/no | 是否在浏览器窗口显示菜单栏
resizable  | yes/no | 是否可以拖动浏览器窗口的边框改变其大小
scrollbars | yes/no | 是否允许滚动
status     | yes/no | 是否在浏览器窗口中显示状态栏
toolbar    | yes/no | 是否在浏览器窗口中显示工具栏

- *其他操作*
```js
var a = window.open("http://www.baidu.com", null, "height=400,width=400,top=10,left=10");
a.resizeTo(500, 500)  // 调整大小
a.moveTo(100, 100)    // 移动位置
a.close()             // 关闭新打开的窗口
```


### 5. location
#### 5.1 查询URL参数
`location`是最有用的BOM对象之一，可以通过`window.location`和`document.location`访问。它不仅保存着当前文档的信息，还将它解析为独立的片段。

属性名|例子|说明
---|:--:|---:
hash      | "#contents"             | 返回URL中的hash(#号后的字符)
host      | `"www.baidu.com:80"`    | 返回服务器名称的端口号
hostname  | `"www.baidu.com"`       | 返回不带端口号的服务器名称
href      | `"http://www.baidu.com"`| 返回当前页面的完整URL
pathname  | "/dashboard/"           | 返回URL的目录或文件名
port      | "8080"                  | 返回UR中的端口号
protocol  | "http:"                 | 返回页面使用的协议 `http:`或`https:`
search    | "?q=javascript"         | 返回URL的查询字符串，以`?`开头

- *解析查询字符串*
```js
function getQueryStringArgs(){
  var qs = (location.search.length > 0 ? location.serach.substring(1) : "");
      args = {};
      items = qs.length ? qs.split("&") : [];
      
  for (var i = 0; i < items.length; i++){
    var item = items[i].split("=");
    var name = decodeURIComponent(item[0]);
    var val = decodeURIComponent(item[1]);
    args[name] = val;
  }

  return args;  
}
alert(args["q"])  // "javascript"
```


#### 5.2 修改URL
- 在当前页面打开新URL(并在浏览器的历史记录中生成一条记录)
```js
location.assign("http://www.baidu.com")

// 与assign效果一样
window.location = "http://www.baidu.com";
location.href = "http://www.baidu.com"
```

- 将hash,search, hostname, pathname, port设置为新值来改变URL
只有修改`hash`属性，页面不会以新URL重新加载。
```js
// 假设原始url为"http://www.baidu.com/dashboard"
// url修改为"http://www.baidu.com/dashboard/#section1"
location.hash = "#section1";          

// url修改为"http://www.baidu.com/dashboard?q=javascript"
location.search = "?q=javascript";

// url修改为"http://www.yahoo.com/dashboard"
location.hostname = "www.yahoo.com";

// url修改为"http://www.baidu.com/mydir"
location.pathname = "mydir";

// url修改为"http://www.baidu.com:8000/dashboard"
location.port = 8000;
```
通过上面任何一种方式修改URL后，浏览器的历史记录都会生成一条新记录。

- 当前页面加载新URL，但是不会再历史记录中生成新记录。用户不能回到前一个页面
```js
location.replace("http://www.baidu.com")
```

- 重新加载当前页面
```js
location.reload();     // 可能从缓存中加载
location.reload(true); // 从服务器重新加载
```



### 6. navigator
#### 6.1 检查插件
在浏览器中，可以使用`plugins`数组，检查浏览器中是否安装了特定的插件。
```js
// 非IE浏览器
function hasPlugin(name){
  name = name.toLowerCase();
  for(var i = 0; i < navigator.plugins.length; i++){
    if(navigator.plugins[i].name.toLowerCase().indexOf(name) > -1){
      return true;
    }
  }
  return false;
}

// IE浏览器
function hasIEPlugin(name){
  try {
    new ActiveXObject(name);
    return true;
  } catch (ex){
    return false;
  }
}

function hasFlash(){
  var result = hasPlugin("Flash");
  if (!result){
    result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
  }
  return result;
}
```



#### 6.2 判断浏览器类型
```js
function getExploreName(){
  var userAgent = navigator.userAgent;
  if(userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1){
    return 'Opera';
  }else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1){
    return 'IE';
  }else if(userAgent.indexOf("Edge") > -1){
    return 'Edge';
  }else if(userAgent.indexOf("Firefox") > -1){
    return 'Firefox';
  }else if(userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1){
    return 'Safari';
  }else if(userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1){
    return 'Chrome';
  }else if(!!window.ActiveXObject || "ActiveXObject" in window){
    return 'IE>=11';
  }else{
    return 'Unkonwn';
  }
}
```


### 7. screen
表示浏览器窗口外部的显示器的信息，如像素宽高。


### 8. history
`history`对象保存着用户上网的历史记录。出于安全考虑，开发人员无法得知用户浏览过的URL。但是使用`go()`方法可以在用户的历史记录中任意跳转。

```js
history.go(-1);   // 后退一页
history.go(1);    // 前进一页
history.go(2);    // 前进两页

 // 跳转到历史记录中 最近的 包含改字符串的地址，可能前进可能后退
history.go("wrox.com") 
```



### 6. 其他
- setTimeout, clearTimeout
- setInterval, clearInterval
- 系统对话框 alert(), confirm(), prompt()
- 显示打印对话框 window.print()
- 显示查找对话框 window.find()
- 可能被浏览器禁用的方法
```
window.moveTo(0, 0)         将窗口移动到屏幕左上角
window.moveBy(0, 100)       将窗口向下移动100像素
window.resizeTo(100, 100)   将窗口调整到100 * 100
```


### 参考资料
- 《Javscript高级程序设计》 第八章 BOM
- 《Javascript高级程序设计》第九章 客户端监测
- [JS 获得浏览器类型和版本](https://segmentfault.com/a/1190000007640795)