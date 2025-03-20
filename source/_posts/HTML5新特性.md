---
title: HTML5新特性
date: 2017-08-07 12:00:27
category: HTML
---
#### 1. 语义化标签
以前我们都是使用`<div>`标签布局，div标签的语义不清晰，html5为了规范这一块，给出了一系列的标签。
```html
<header></header>     头部区域标签，块级标签
<footer></footer>     底部区域标签，块级标签
<nav></nav>           导航区域标签，块级标签
<aside></aside>       侧边栏区域标签，块级标签
<section></section>   定义 section，块级标签
<article></article>   文章段落标签，块级标签
<summary></summary>   定义 details 元素的标题，块级标签
<detailes></detailes> 定义元素的细节，块级标签
<mark></mark>         标记记号标签，内联标签
<time></time>         时间区域标签，内联标签
```


<br/>
#### 2. 表单新类型
`<input>`表单标签的新类型
```html
<input type="email" />  e-mail 地址的输入域
<input type="number" /> 数字输入域
<input type="url" />    URL 地址的输入域
<input type="range" />  range 类型显示为滑动条，默认value值是1~100的限定范围
<input type="range" name="points" min="1" max="10" />  可以通过min属性和max属性自定义范围
<input type="search" /> 用于搜索域
<input type="color" />  用于定义选择颜色
<input type="tel" />    电话号码输入域
<input type="date" />   date类型为时间选择器
```

`input`新增的新属性
- `placeholder`: string, 文本框的默认提示，在用户输入后消失
- `required`: boolean, 要求文本框不能为空
- `pattern`: regex, 用于验证值的正则
- `min`, `max`: 设置元素的最大最小值
- `step`: 输入域规定的数字间隔
- `width`, `height`: 宽高
- `autofocus`: boolean, 页面加载时，域自动获得焦点
- `multiple`: booelan, 规定元素可选择多个值



<br/>
#### 3. 视频和音频
`<audio>`支持的音频格式有 mp3, Wav, Ogg。
`<video>`支持 mp4, WebM, Ogg。
```html
<audio src="1.mp3" id="audio"></audio>
<video width="600" height="400" id="video" controls="controls">
  <source src="video/jieda2.mp4" type="audio/mp4"></source>
</video>
```
视频和音频常用的方法
- `play()`  开始播放
- `pause()` 暂停播放
- `load()`  重新加载音频/视频

视频和视频常用的属性
- `controls` 是否显示播放/暂停控件
- `defaultPlaybackRate` 设置默认播放速度
- `duration` 返回当前音频/视频的长度(以秒计)
- `ended` 返回音频/视频是否已结束
- `loop` 设置或返回音频/视频是否应在结束时重新播放
- `muted` 设置或返回音频/视频是否静音
- `networkState` 返回音频/视频的当前网络状态
- `src` 设置或返回音频/视频元素的当前来源
- `volume` 设置或返回音频/视频的音量
- `readyState` 返回音频/视频当前的就绪状态
- `played` 表示音频/视频已播放部分的 TimeRanges 对象


<br/>
#### 4. canvas
`canvas` 元素用于在网页上绘制图形,canvas标签本身只是个图型容器，需要使用javaScript脚本来绘制图形。


<br/>
#### 5. SVG
SVG是指可伸缩的矢量图形，SVG 也是一种使用 XML 描述 2D 图形的语言。我们可以为某个元素附加 JavaScript 事件处理器。在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。


<br/>
#### 6. 拖放(Drag和Drop)
在h5之前实现拖拽功能，用的是`onmousedown`，获取当前的一些信息，然后在`onmousemove`时不断更新拖拽对象的`left`和`top`值，最后在`onmouseup`时对拖拽对象彻底复制，并释放后一系列的程序操作。

h5出来后，不需要再模拟，因为已经有了标准的事件api
```js
<div id="draggable" class="draggable" draggable="true">
		draggable
</div>

var dragEl = document.getElementById('draggable');
var l = null, t = null;

dragEl.ondragstart = function (e) { // 准备推拽时
  l = e.clientX - this.offsetLeft, t = e.clientY - this.offsetTop;	
}

dragEl.ondrag = function (e) {  // 拖拽进行时
  var x = e.clientX, y = e.clientY;				
  this.style.left = x - l + 'px';
  this.style.top = y - t + 'px';
  console.log(x, y, l , t)
}

dragEl.ondragend = function (e) {   // 拖拽结束时
  var x = e.clientX, y = e.clientY;			
  this.style.left = x - l + 'px';
  this.style.top = y - t + 'px';
}
```

<br/>
#### 7. 地理位置
```js
navigator.geolocation.getCurrentPosition(successPos)
function successPos (pos){
	console.log('定位时间：',pos.timestamp)
	console.log('经度：',pos.coords.longitude)
	console.log('纬度：',pos.coords.latitude)
	console.log('海拔：',pos.coords.altitude)
	console.log('速度：',pos.coords.speed)
}
```

<br/>
#### 8. 离线存储
HTML5，通过创建 cache manifest 文件，可以创建 web 应用的离线版本


<br/>
#### 9. Web存储
`localStorage` 没有时间限制的数据存储.
`sessionStorage` 网页还没有关闭的情况下的存储，网页窗口关闭，则数据销毁。
```js
localStorage.setItem('key', 'val')  // 存储数据
localStorage.getItem('key')         // 取数据
localStorage.removeItem('key')      // 删除数据
localStorage.clear()                // 删除所有数据
localStorage.key(index)             // 获取某个索引数据

sessionStorage.setItem('key', 'val')// 存储数据
sessionStorage.getItem('key')       // 取数据
sessionStorage.removeItem('key')    // 删除数据
```

<br/>
#### 10. WebSocket
websocket事件
- Socket.onopen 连接建立时触发
- Socket.onmessage 客户端接收服务端数据时触发
- Socket.onerror 通信发生错误时触发
- Socket.onclose 连接关闭时触发

<br/>
#### 11. Web Workers
web worker 是运行在后台的 JavaScript，独立于其他脚本，不会影响页面的性能。您可以继续做任何愿意做的事情。

<br/>
#### 参考资料
- [HTML5的新特性概述（上）](https://juejin.im/post/5be8d817e51d457f7a4aba13)
- [HTML5新特性概述(下)](https://juejin.im/post/5bea349a518825170d1a9db1)