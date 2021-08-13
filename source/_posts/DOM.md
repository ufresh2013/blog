---
title: DOM 如何生成？提供了哪些API？
date: 2018-10-07 10:03:16
category: Browser
---

### 0. DOM
从网络传给渲染引擎的HTML文件字节流是无法直接被渲染引擎理解的，所以要将其转化为渲染引擎能够理解的内部结构，这个结构就是 DOM。*DOM 是表述 HTML 的内部数据结构。*
- 从页面视角看，DOM是生成页面的基础数据结构
- 从 JavaScript 脚本视角来看，DOM 提供给 JavaScript 脚本操作的接口，通过这套接口，JavaScript 可以对 DOM 结构进行访问，从而改变文档的结构、样式和内容
- 从安全视角来看，DOM 是一道安全防护线，一些不安全的内容在 DOM 解析阶段就被拒之门外了。

<br/>

#### *DOM树如何生成？*
在渲染引擎内部，有一个叫 **HTML 解析器（HTMLParser**）的模块，它的职责就是负责将 HTML 字节流转换为 DOM 结构。
具体的流程如下：
- 网络进程接收到响应头后，如果`content-type是text/html`, 那么浏览器就会判断这是一个 HTML 类型的文件，然后为该请求选择或者创建一个渲染进程
- 渲染进程准备好之后，网络进程接收到数据后，将数据传递给渲染进程。渲染进程则把数据交给**HTML解析器**（ HTML 解析器并不是等整个文档加载完成之后再解析的，而是网络进程加载了多少数据，HTML 解析器便解析多少数据。）
- 通过分词器将字节流转换成Token
<img src="6.jpg">
- 将Token解析为DOM节点，并将DOM节点添加到DOM树中
<img src="7.jpg" style="width: 600px">


<br/>


#### *JS会阻塞DOM生成吗？* —— 会
- 解析到*`内嵌<script>脚本`*标签时，渲染引擎判断这是一段脚本，此时 HTML 解析器就会暂停 DOM 的解析，因为接下来的 JavaScript 可能要修改当前已经生成的 DOM 结构。
```html
<html>
<body>
    <div>1</div>
    <script>
      let div1 = document.getElementsByTagName('div')[0]
      div1.innerText = 'time.geekbang'
    </script>
    <div>test</div>
</body>
</html>
```
- 解析到*`<scirpt>文件`*时，执行流程还是一样的，会暂停整个DOM的解析，先下载这个JS文件，然后执行JS代码
- *`async`* 或 *`defer`* 来标记代码

  - *`async`* 一旦加载完成，会立即执行；
  - *`defer`* 在 DOMContentLoaded 事件之前执行。

    - *`onload`* 页面上所有的DOM，样式表，脚本，图片，flash都已经加载完成了。
    - *`DOMContentLoaded`* 仅DOM加载完成，不包括样式表，图片，flash。

- 预解析操作：当渲染引擎收到字节流之后，会开启一个预解析线程，用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。


<br/>

#### *CSS会阻塞DOM生成吗？* —— 会
JS代码出现了 `div1.style.color = ‘red'` 的语句，它是用来操纵 CSSOM 的，所以在执行之前，需要先解析js语句之上所有的 CSS 样式。所以如果代码里引用了外部的 CSS 文件，那么在执行js之前，还需要等待外部的 CSS 文件下载完成，并解析生成 CSSOM 对象之后，才能执行。
```html
<html>
  <head>
    <style src='theme.css'></style>
  </head>
<body>
  <div>1</div>
  <script>
      let div1 = document.getElementsByTagName('div')[0]
      div1.innerText = 'time.geekbang' //需要DOM
      div1.style.color = 'red'  //需要CSSOM
  </script>
  <div>test</div>
</body>
</html>
```


#### *DOM什么时候渲染？*

#### *为什么操作DOM很慢？*


<br/>

### 1. Node
DOM是针对HTML和XML文档的一个API。DOM描述了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。每一段标记都可以通过树中的一个节点来表示。
<img src="1.png" style="max-width:250px">

<br/>

#### 1.1 节点类型
JS中的所有节点类型都继承自Node类型，除了IE，其他浏览器都可以访问这个类型。每个节点都有一个`nodeType`属性，由12个数值常量来表示。
```
Node.ELEMENT_NODE           | 1
Node.ATTRIBUTE_NODE         | 2
Node.TEXT_NODE              | 3
Node.CDATA_SECTION_NODE     | 4
Node.ENTITY_REFERENCE_NODE  | 5
Node.ENTITY_NODE            | 6
Node.PROCESSING_INSTRUCTION_NODE | 7 
Node.COMMENT_NODE           | 8
Node.DOCUMENT_NODE          | 9
Node.DOCUMENT_TYPE_NODE     | 10
Node.DOCUMENT_FRAGMENT_NODE | 11
Node.NOTATION_NODE          | 12
```
要了解节点的信息，可以使用`nodeName`和`nodeValue`属性。


<br/>

#### 1.2 节点关系
每一个节点都有一个`childNodes`属性，其中保存着一个`NodeList`对象。`NodeList`是一种类数组对象，用于保存一组有序的节点，它实际上基于DOM结构动态执行查询的结果。DOM结构的变化能自动反映在`NodeList`对象中。
```
someNode.childNodes[0]      // 子节点
someNode.childNodes.item(1)
someNode.hasChildNodes()    // 是否有子节点

someNode.parentNode         // 父节点
someNode.previousSibling    // 前一个同胞节点
someNode.nextSibling        // 后一个同胞节点
someNode.fistChild == someNode.childNodes[0]  // 第一个子节点
someNode.lastChild          // 最后一个子节点
```

`document.getElementById('myList').childNodes`,IE会任务`<ul>`有三个`<li>`子节点。其他浏览器会认为，`<ul>`有3个`<li>`元素和4个文本节点(li元素之间的空白符)。这意味着，如果需要通过childNodes遍历子节点时，要检查nodeType属性是否为1(元素节点)。
```html
<ul id="myList">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
<ul id="myList"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
```

<br/>

#### 1.3 操作节点
- *appendChild*
用于向`childNodes`列表的末尾添加一个节点。
```
someNode.appendChild(newNode);
console.log(someNode.lastChild = newNode) // true
```

- *insertBefore*
把节点放在`childNodes`列表中某个特定位置上。插入节点后，被插入的节点会变成参照节点的前一个同胞节点(previousSibling)
```
someNode.insertBoefore(newNode, someNode.firstChild) // 插入后成为第一个节点
someNode.insertBefore(newNode, someNode.lastChild) // 插入后成为倒数第二个节点
```

- *replaceChild*
将要替换的节点从文档树中移出，同时要插入的节点占据位置。要使用上面这几个方法必须先取得父节点`parentNode`。
```
someNode.replaceChild(newNode, someNode.firstChild) // 替换第一个节点
```

- *removeChild*
移除节点
```
someNode.removeChild(someNode.firstChild) // 移除第一个节点
```

- *cloneNode*
创建调用这个方法的节点的一个完全相同的副本，接受一个布尔值参数，表示是否执行深复制。
```
myList.cloneNode(true)  // 复制节点和整个子节点数
myList.cloneNode(false) // 只复制节点本身
```




<br/>
<br/>
### 2. Document
`document`对象是`HTMLDocument`的一个实例，表示整个HTML页面。而且，document对象是window对象的属性，可以作为全局对象来访问。

<br/>
#### 2.1 文档信息
```
document.documentElement // 指向<html>元素
document.body     // 指向<body>元素
document.title    // 文档标题
document.URL      // 完整的url
document.domain   // 域名
document.referrer // 来源页面的URL

document.title = '首页'
document.domain = 'wrox.com'

document.anchors  // 文档中所有带name属性的<a>元素
document.forms    // 文档中所有<form>元素
document.images   // 文档中所有<img>元素
document.links    // 文档中所有带href的<a>元素
```
`document.domain`是可以设置的，但由于安全限制，如果url中包含一个子域名，`p2p.wrox.com`可以把`domain`设置为`wrox.com`。当页面中包含来自其它子域的iframe时， 通过将每个页面的`document.domain`设置为相同的值，这些页面就可以互相访问对方包含的Javascript对象。


<br/>
#### 2.2 查找元素
- *document.getElement*
会返回一个`HTMLCollection`对象，该对象与`NodeList`非常相似。
```
document.getElementById()

document.getElementsByTagName()
document.getElementsByTagName("*")
document.getElementsByTagName('img')[0].src

document.getElementsByName()  // 常见取得表单选项
document.getElementsByName('color')
<input type="raido" name="color">

document.getElementById('list').getElementsByTagName('li')
```


- *querySelector*
接受一个CSS选择符，返回与该模式匹配的第一个元素，没有则返回null。
IE 8+, Firefox 3.5+, Safari 3.1+, Chrome和Opera 10+都支持`querySelector()和querySelectorAll()`。
```js
document.querySelector("#myDiv");
document.querySelector(".selected");
document.querySelector("img.button");
```


- *querySelectorAll*
接受一个CSS选择符，返回一个NodeList实例。
```js
docuemnt.getElementById("myDiv").querySelectorAll("em");
docuemnt.querySelectorAll(".selected");
docuemnt.querySelectorAll("p strong");
```

- *根据关系查找元素*
```
childElementCount      // 返回子元素的个数
firstElementChild      // 指向第一个子元素
lastELementChild       // 指向最后一个子元素
previousElementSibling // 指向前一个同辈元素
nextElementSibling     // 指向后一个同辈元素
```


<br/>
#### 2.5 文档写入
将输出流写入到网页的能力: `write(), writeIn(), open(), close()`。如果在文档结束后再调用`document.write()`，那么输出的内容将会重写整个页面。
```
document.write("<strong>" + (newDate()).toString() + "</strong>");
document.write("<script type=\"text/javascript\" src=\"file.js\">" + "<\/script>");
```




<br/>
<br/>
### 3. Element
Element类型用于表现XML或HTML元素，提供了对元素标签名、子节点及特性的访问。

#### 3.1 HTML元素
- 元素属性
```
element.nodeType    // 元素类型
element.nodeName    // 元素的标签名，也可以使用element.tagName
element.nodeValue   // 元素的值
element.parentNode  // 可能是Document或Element
```

- HTMLElement子元素
所有HTML元素都由HTMLElement类型表示，每种元素都有与之对应的特性和方法。
```
// 只列举少量
HTMLAnchorElement, HTMLBRElement, HTMLButtonElement, HTMLTableColElement, 
HTMLDivElement,HTMLFormElement,  HTMLFrameElement, HTMLFrameSetElement, 
HTMLHeadingElement, HTMLHeadElement, HTMLImageElement, HTMLInputElement, 
HTMLLabelElement, HTMLLIElement, HTMLMetaElement, HTMLOListElement, 
HTMLOptionElement, HTMLParagraphElement, HTMLScriptElement, HTMLStyleElement,
HTMLTableElement
```

<br/>
#### 3.2 元素特性
- 获取元素特性
开发人员经常直接使用元素的属性，只有在取自定义特性值的情况下，才会使用`getAttribute()`方法。
```js
<div id="myDiv" class="bd" my_attr="hello!" style="display:none" onclick="f()"></div>
var div = document.getElementById('myDiv');
div.id                       // "myDiv"
div.className                // "bd"
div.style                    // 返回一个对象
div.onclick                  // 返回一个JS函数 || null
div.getAttribute('id')       // "myDiv"
div.getAttribute('class')    // "bd"
div.getAttribute('my_attr')  // "hello!"
div.getAttribute('style')    // 返回的是CSS文本
div.getAttribute('onclick')  // 返回相应代码的字符串
```

- 设置/删除元素特性
```js
div.setAttribute(key, val)
div[key] = val;  // 自定义的属性不会生效
div.removeAttribute(key)
```

- element.attributes
将DOM结构序列化为HTML字符串，遍历元素特性
```js
var arr = [];
for ( var i = 0; i < element.attributes.length; i++ ){
  var key = element.attributes[i].nodeName;
  var val = element.attributes[i].nodeValue;
  arr.push(key + '=' + val);
}
```

<br/>
#### 3.3 创建元素
```js
var div = document.createElement("div");
// var div = document.createDocumentFragment();
// 文档片段不会被添加到文档树中
div.id = "myDiv";
div.className = "box";

// 创建文本节点
var textNode1 = document.createTextNode("hello");
var textNode2 = document.createTextNode("!!!");
div.appendChild(textNode1);
div.appendChild(textNode2);

// normalize()能将相邻文本节点合并
div.normalize();  // div.firstChild.nodeValue == "hello!!!"
document.body.appendChild(div);
```

<br/>
#### 3.4 文本节点
Text节点具有以下特征
- nodeType = 3
- nodeName = "#text"
- nodeValue = 具体文本
- parentNode是一个element，文本节点没有子节点

通过`nodeValue`属性或`data`属性访问文本节点中包含的文本。
- appendData(text): 将text添加到节点的末尾
- deleteData(offset, count): 从offset指定的位置开始删除count个字符
- insertData(offset, text): 在offset指定的位置插入text
- replaceData(offset, count, text): 用text替换offset+count为止的文本
- splitText(offset): 从offset位置将当前文本节点分成两个文本节点
- substringData(offset, count): 提取offset+count处的字符串

```js
// 修改文本
<div>hello!</div>
div.firstChild.nodeValue = "Some other message"
div.firstChild.nodeValue = "<strong></strong>"  // 会被转义
```

<br/>
### 4. DOM操作技术
#### 4.1 动态添加js/css
- 添加js
```js
var script = document.creatElement('script');
script.type = "text/javascript";
script.src = "client.js";
// script.text = "function sayHi(){ alert('hi'); }"
document.body.appendChild(script);
```
怎么知道脚本加载完成了？

- 添加css
```js
var link = document.createElement('link');
link.rel = "stylesheet";
link.type = "text/css";
link.href = "style.css";
var head = document.getElementsByTagName('head')[0];
head.appendChild(link);

// cssText
var style = document.createElement('style');
var css = "body{background-color: red}";
if(style.styleSheet){
    style.styleSheet.cssText = css;
}else{
    style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName('head')[0].appendChild(style);
``` 

#### 4.2 操作表格
createTHead() / deleteTHead()  : 创建/删除`<thead>`元素
createTFoot() / deleteTFoot()  : 创建/删除`<tfoot>`元素
createCaption() / deleteTFoot(): 创建/删除`<caption>`元素
*rows*
保存着`<tbody>`元素中行的HTMLCollection。你可以用`deleteRow(pos)`删除行，`insertRow(pos)`插入行

*cells*
保存着`<tr>`元素中单元格的HTMLCollection。你可以用`deleteCell(pos)`删除指定位置单元格，`insertCell(post)`向cells指定位置插入一个单元格

```js
var table = document.createElement('table');
var tbody = document.createElement('tbody');
table.appendChild(tbody);

tbody.insertRow(0);
tbody.rows[0].insertCell(0);
tbody.rows[0].cells[0].appendChild(document.createTextNode("123"));
tbody.rows[0].insertCell(1);
tbody.rows[0].cells[1].appendChild(document.createTextNode("456"))
```

<br/>
#### 4.3 减少DOM操作
`NodeList, NamedNodeMap 和 HTMLCollection`这三个集合都是动态的。当文档结构发生变化时，它们都会得到更新。从本质上，所有NodeList对象都是在访问DOM文档时实时运行的查询。

下列代码会导致无限循环。每次循环对条件`i < divs.length`求值，意味着会运行取得所有`<div>`元素的查询。DOM操作往往是JS程序中开销最大的部分，*访问NodeList导致的问题最多*。NodeList是“动态的”，每次访问NodeList对象，都会运行一次查询，有鉴于此，最好就是尽量减少DOM操作。
```js
var divs = document.getElementsByTagName("div");
for ( var i = 0; i < divs.length; i++ ){
  div = document.createElement("div");
  document.body.appendChld(div);
}
```

### 5. HTML5
#### 5.1 class
- document.getElementsByClassName
```js
document.getElementsByClassName("username current")
document.getElementById("myDiv").getElementsByClassName("selected")
```

- classList
className是一个字符串，HTML5新增了操作类名的方法，通过classList添加、删除和替换类名
```js
div.classList.remove("disabled")
div.classList.add("current")
div.classList.contains("bd")

// 列表存在已经给定的值，删除它；列表中没有给定的值，添加它
div.classList.toggle("user")   
```

<br/>
#### 5.2 focus()
`document.activeElement`始终会引用DOM中当前获得焦点的元素。默认情况下，文档刚刚加载完时，document.activeElement保存的是document.body元素
```js
var button = document.getElementById("myButton");
button.focus()
console.log(document.activeElement === button)  // true
console.log(docuemnt.hasFocus())                // true
```

<br/>
#### 5.3 其他
- document.readyState
document.readyState === "loading" 正在加载文档
document.readyState === "complete" 已经加载完文档

<br/>
- data-
为元素提供与渲染无无关的信息，要添加前缀data-
`<div class="myDiv" data-appID="12345" data-myname="Nicholas"><div>`
```js
var div = document.getElementById("myDiv");

// 获取值
var appId = div.dataset.appId;
// 设置值
div.dataset.appId = "23456";
// 判断有无值
if (div.dataset.myname){}
```

<br/>
- contains()
检查某个节点是不是另一个节点的后代。 `compareDocumentPosition()`也能确定节点间的关系，支持IE9+。返回1-无关， 2-位于参考节点前， 4- 位于参考节点后， 8-包含， 16-被包含。
```js
document.documentElement.contains(document.body)  // true
document.documentElement.compareDocumentPosition(document.body)
```

<br/>
- 插入标记
1. innerHTML
直接插入HTML字符串。通过innerHTML插入script元素并不会执行其中的脚本，但是支持通过innerHTML插入style元素。
```js
div.innerHTML = "hello & welcome, <p>reader!</p>"
console.log(div.innerHTML)
```

2. outerHTML
返回调用它的元素及所有子节点的HTML标签
```js
div.outerHTML = "hello & welcome, <p>reader!</p>"
console.log(div.outerHTML)
```

3. insertAdjacentHTML
接受两个参数：插入位置和要插入的HTML文本。
```js
// 作为前一个同辈元素插入
element.insertAdjacentHTML('beforebegin', '<p>hello</p>')

// 作为后一个同辈元素插入
element.insertAdjacentHTML('afterend', '<p>hello</p>')

// 作为第一个子元素插入
element.insertAdjacentHTML('afterbegin', '<p>hello</p>')

// 最为最后一个子元素插入
element.insertAdjacentHTML('beforeend', '<p>hello</p>')
```
在使用innerHTML, outerHTML, insertAdjacentHTML()方法时，最好先手工删除药别替换的元素的所有事件程序和js对象属性。设置innerHTML或outerHTML时，就会创建一个HTML解析器。不可避免地，创建和销毁HTML解析器会带来性能损失。所以在插入大量新HTML标记时，可以先通过多次DOM操作再指定它们之间的关系。
```js
var itemsHtml = "";
for( var i = 0; i < 10; i++){
  itemsHtml += "<li>" + i + "</li>"
}
ul.innerHTML = itesHTML;
```

<br/>
- 插入文本
innerText和outeText不是HTML5的属性。但IE4, safari, opera, chrome支持innerText, firefox虽然不支持，但支持作用类似的textContent。

<br/>
- 滚动 
scrollIntoView()
通过滚动浏览器窗口或某个容器元素，调用元素可以出现在视口中。
```js
document.form[0].scrollIntoView()
```

<br/>
<br/>
### 6.2 DOM2和DOM3
#### 6.1 style
行内style对象，包含着通过HTML的style特性指定的所有样式信息，但不包含与外部样式表或嵌入样式表层叠而来的样式。
```js
var div = document.getElementById("id");
div.style.backgroundColor = "red";

// 访问style特性中的CSS代码
div.style.cssText = "width: 25px; height: 100px; background-color: green";
div.style.length
div.style.getPropertyValue(propertyName)
div.style.setProperty(propertyName, value, priority)
div.style.removeProperty(propertyName)
div.style.item(index)  // 返回给定位置的CSS属性的名称
```


<br/>
#### 6.2 getComputedStyle
getComputedStyle()方法接受两个参数：要计算样式的元素和一个伪元素字符串(:after, 可以是null)。返回一个CSSStyleDeclaration对象，其中包含当前元素的所有计算的样式。
```js
var myDiv = document.getElementById('myDiv');
var computedStyle = document.defaultView.getComputedStyle(myDiv, null); 

// IE不支持getComputedStyle，但有类似的方法myDiv.currentStyle
// var computedStyle = myDiv.currentStyle;
computedStyle.width;
computedStyle.height;
computedStyle.backgroundColor;
```


<br/>
#### 6.3 CSSStylesSheet
向现有样式表中添加新规则
```js
function insertRule(sheet, selectorText, cssText, position){
  if (sheet.insertRule){
    sheet.insertRule(selectorText + "{" + cssText + "}", position);
  } else if (sheet.addRule){
    sheet.addRule(selectorText, cssText, position);
  }
}
insertRule(document.styleSheets[0], "body", "background-color: silver", 0);
```

向现在样式表删除规则
```js
function deleteRule(sheet, index){
  if (sheet.deleteRule){
    sheet.deleteRule(index);
  } else if (sheet.removeRule){
    sheet.removeRule(index);
  }
}
deleteRule(document.styleSheets[0], 0);
```

<br/>
#### 6.4 offsetHeight, clientHeight, scrollHeight
*offsetHeight*
通过下列4个属性获取元素的偏移量: offsetHeight, offsetWidth, offsetLeft, offsetTop。要想知道某个元素在页面上的偏移量，将这个元素的offsetLeft和offsetTop与其offsetParent的相同属性相加，如此循环直至根元素，就可以得到一个基本准确的值。
<img src="3.png" style="max-width:350px; margin-top:20px">

```js
function getElementTop(element){
  var actuaTop = element.offsetTop;
  var current = element.offsetParent;

  while( current !== null ){
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  
  return actualLeft;
}
```

<br/>
*clientHeight*
元素内容及其内边距所占据的空间大小: clientWidth 和 clientHeight。最常用到的是，确定浏览器视口大小，可以使用document.documentElement 或 document.body 的 clientWidth 和 clientHeight。
<img src="4.png" style="max-width:350px; margin-top:20px">
```js
document.body.clientWidth || document.documentElement.clientWidth
```

<br/>
*scrollHeight*
scrollHeight: 元素内容的总高度
scrollWidth: 元素内容的总宽度
scrollLeft: 被隐藏在内容区域左侧的像素数，设置这个属性可以改变元素的滚动位置
scrollTop: 被隐藏在内容区域上方的像素数， 设置这个属性可以改变元素的滚动位置
<img src="5.png" style="max-width:350px; margin-top: 20px">

在确定文档的总高度时，必须取得 scrollWidth/clientWidth 和 scrollHeight/clientHeight 中的最大值。
```js
// 文档总高度
var docHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
```


<br/>
#### 6.5 getBoundingClientRect
给出了元素在页面中相对视口的位置，包含4个属性: left, top, right, bottom。`-scrollTop`是为了防止调用这个函数时窗口被滚动了。

如果不支持`getBoundingClientRect()`方法，就使用`offsetHeight`一层层计算。
```js
function getBoundingClientRect(element){
  if (typeof arguments.callee.offset != "number"){
    var scrollTop = document.documentElement.scrollTop;
    var temp = document.createElement("div");
    temp.style.cssText = "position:absolute;left:0;top:0;"; document.body.appendChild(temp);
    arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop; document.body.removeChild(temp);
    temp = null;
  }

  var rect = element.getBoundingClientRect();
  var offset = arguments.callee.offset;
  return {
      left: rect.left + offset,
      right: rect.right + offset,
      top: rect.top + offset,
      bottom: rect.bottom + offset
  }; 
}
```
<br/>
