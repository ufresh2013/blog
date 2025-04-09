---
title: Canvas实现白板功能
date: 2018-10-06 15:56:08
category:
- HTML
---
### 1. 元素
- canvas元素
canvas是一个可以使用JS来绘制图形的HTML元素。canvas标签只有两个属性——width和height。
```js
<canvas id="tutorial" width="150" height="150"></canvas>
```
- 渲染上下文
canvas元素创造了一个固定大小的画布，它公开了一个或多个渲染上下文，用来绘制和处理要展示的内容。
```js
var canvas = document.getElementById('tutorial');
var ctx    = canvas.getContext('2d'); 
```
- 坐标
画布的起点为左上角(坐标(0, 0))，所有元素的位置都相对于原点定位。
<img src="1.png" style="padding-top:20px; max-width: 380px">


### 2. 绘制
#### 2.1 矩形
```js
ctx.fillRect(x, y, width, height)     绘制一个填充的矩形
ctx.strokeRect(x, y, width, height)   绘制一个矩形的边框
ctx.clearRect(x, y, width, height)    清除指定矩形区域，让清除部分完全透明
```

#### 2.2 圆弧
画一个以(x,y)为圆心的radius为半径的圆，从startAngle开始到endAngle结束，按照anticlockwise给定的方向(默认顺时针)生成。
```js
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
```


根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点。
```js
ctx.acrTo(x1, y1, x2, y2, radius)
```

#### 2.3 路径
路径是通过不同颜色和宽度的线段/曲线相连形成的不同形状的店的集合。绘制图形的步骤：①创建路径起点；②使用画图命令画出路径；③封闭路径；④通过描边或填充路径来渲染图形。
```js
ctx.beginPath()   新建路径
ctx.moveTo(x,y)   将笔触移动到(x,y)上
ctx.lineTo(x,y)   绘制一条从当前位置到(x,y)的直线
ctx.closePath()   闭合路径
ctx.stroke()      绘制路径
ctx.fill()        填充路径
```

#### 2.4 贝塞尔曲线
二次贝塞尔曲线, cplx,cply为一个控制点, x,y为结束点
```js
quadraticCurveTo(cplx, cply, x, y)
```

三次贝塞尔曲线, cplx,cply为控制点1, cp2x,cp2y为控制点2, x,y为结束点
```js
bezierCurveTo(cplx, cply, cp2x, cp2y, x, y)
```
<img src="2.png" style="padding-top:20px; max-width: 380px">


### 3. 使用样式和颜色
#### 3.1 描边，填充
```js
ctx.fillStyle = color               设置图形的填充颜色
ctx.strokeStyle = color             设置图形轮廓的颜色
ctx.globalAlpha = transparencyValue 设置canvas里所有图形的透明度

// 线型
lineWidth = 1                       设置线条宽度      
lineCap = 'butt/round/square'       设置线条末端样式
lineJoin = 'round/bevel/miter'      设定线条与线条间接合处的样式
miterLimit = 1                      限制两条线相交时交接处最大长度
getLineDash()                       返回当前虚线样式
setLineDash([4, 2])                 设置当前虚线样式，接受一个数组来指定线段与间隙的交替
lineDashOffset = value              设置虚线样式的起始偏移量
```

#### 3.2 渐变
我们可以用线性或径向的渐变来填充或描边。新建一个`canvasGradient`对象，并且赋给`fillStyle或strokeStyle`属性。
```js
// 创建canvasGradient对象
var lineargradient = ctx.createLinearGradient(x1, y1, x2, y2);
var radialgradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);

// 添加任意多个色标
lineargradient.addColorStop(0, '#000');
lineargradient.addColorStop(1, '#fff');

// assign gradients to fill and stroke styles
ctx.fillStyle = lineargradient;
ctx.strokeStyle = lineargradient;

// draw shapes
```

#### 3.3 图案样式
图案的应用和渐变很像，创建出一个pattern后，赋给`fillStyle或strokeStyle`属性即可。
```js
var img = new Image();
img.src = 'someimage.png';
var ptrn = ctx.createPattern(img, type)
// type可选repeat, repeat-x, repeat-y, no-repeat
```

#### 3.4 阴影
```js
ctx.shadowOffsetX = float   设定阴影在X轴的延伸距离
ctx.shadowOffsetY = float   设定阴影在Y轴的延伸距离
ctx.shadowBlur    = float   设定阴影的模糊程度
ctx.shadowColor   = color   设定阴影颜色
ctx.font = '123';
ctx.fillStyle = '#000';
ctx.fillText('Sample String', 5, 30);
```



### 4. 文本和图片
```js
ctx.font = '10px sans-serif';
ctx.textAlign = 'start/end/left/right/center';
ctx.textBaseline = 'top/hanging/middle/alphabetic/ideographic/bottom';
ctx.direction = 'ltr/rtl/inherit';

ctx.fillText(text, x, y, maxWdith)    在指定的(x,y)位置填充指定文本，绘制的最大宽度可选
ctx.strokeText(text, x, y, maxWidth)  在指定的(x,y)位置绘制指定文本，绘制的最大宽度可选

// 预测量文本宽度
var text = ctx.measureText('foo');
text.width // 16
```

```js
drawImage(image, x, y)                                              绘制图片
drawImage(image, x, y, width, height)                               绘制图片(缩放)
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight3) 切片
```
<img src="3.jpg" style="padding-top:20px; max-width: 380px">


### 5. 变形 
#### 5.1 状态的保存和恢复
Canvas状态存储在栈中，每当`save()`方法被调用后，当前的状态就被推送到栈中。你可以调用任意多次`save`方法，每一次调用`restore`方法，上一个保存的状态就从栈中弹出，所有设定都恢复。

一个绘画状态包括：①当前应用的变形(移动、旋转、缩放)；②strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation 的值； ③当前的裁切路径
```js
ctx.save()    保存canvas状态
ctx.restore() 恢复canvas状态
```

#### 5.2 移动，旋转，变形，缩放
```js
ctx.translate(x, y)   [移动]移动canvas和它的原点到一个不同的位置
ctx.rotate(angle)     [旋转]以原点为中心旋转canvas
ctx.scale(x, y)       [缩放]对形状，位图进行缩小或者放大，x, y默认值为1
ctx.transform(m11, m12, m21, m22, dx, dy) [变形]
ctx.transform(水平方向的缩放，水平方向的倾斜偏移，竖直方向的缩放，竖直方向的倾斜偏移，水平方向的移动，竖直方向的移动)

```
<img src="4.png" style="padding-top:20px; max-width: 380px">



### 6. 其它
#### 6.1 动画
保存canvas状态, 清空canvas, 重绘动画帧。[高级动画示例](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Advanced_animations)

#### 6.2 颜色选择器
像素操作: `ctx.getImageData(left, top, width, height)`
```js
var img = new Image();
img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
};
var color = document.getElementById('color');
function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  var rgba = 'rgba(' + data[0] + ',' + data[1] +
             ',' + data[2] + ',' + (data[3] / 255) + ')';
  color.style.background =  rgba;
  color.textContent = rgba;
}
canvas.addEventListener('mousemove', pick);
```

#### 6.3 图片灰度和反相颜色
在场景中写入像素数据: `ctx.putImageData(myImageData, dx, dy)`
```js
var img = new Image();
img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
img.onload = function() {
  draw(this);
};

function draw(img) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  var data = imageData.data;
    
  var invert = function() {
    for (var i = 0; i < data.length; i += 4) {
      data[i]     = 225 - data[i];     // red
      data[i + 1] = 225 - data[i + 1]; // green
      data[i + 2] = 225 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  var grayscale = function() {
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  var invertbtn = document.getElementById('invertbtn');
  invertbtn.addEventListener('click', invert);
  var grayscalebtn = document.getElementById('grayscalebtn');
  grayscalebtn.addEventListener('click', grayscale);
}
```

#### 6.4 把canvas保存为图片
```js
canvas.toDataURL('image/png', quality)        创建一个png图片,0-1的品质量,1最好
canvas.toBlob(callback, type, encoderOptions) 创建一个画布中代表图片的Blob对象
```

#### 6.5 websocket实现白板功能 
- 绘制线条，直线，椭圆，矩形(可选择画笔粗细，线条颜色，填充颜色)
- 写字，输入框中输入确定后显示在画布上
- 橡皮檫，清空画布
- 撤销，恢复功能(再执行最近一次操作)

```js
function repaint(ctx, strokes) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (strokes === undefined) {
    return false;
  }
  strokes.map((stroke) => {
    const { strokeColor, width, graphType } = stroke;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = width;

    const startX = stroke.data[0].x;
    const startY = stroke.data[0].y;
    const { x, y } = stroke.data[stroke.data.length - 1];

    ctx.beginPath();
    if (graphType === 'pencil') {
      for (let i = 0; i < stroke.data.length; i++) {
        const prev = stroke.data[i - 1];
        const current = stroke.data[i];
        if (prev !== undefined) {
          ctx.moveTo(prev.x, prev.y);
        }
        ctx.lineTo(current.x, current.y);
      }
    } else if (graphType === 'line') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    } else if (graphType === 'circle') {
      // const radii = Math.sqrt((startX - x) * (startX - x) + (startY - y) * (startY - y));
      // ctx.arc(startX, startY, radii, 0, Math.PI * 2, false);
      // 椭圆
      ctx.save();
      const o1 = (startX + x) / 2;
      const o2 = (startY + y) / 2;
      const a = Math.abs((x - startX) / 2);
      const b = Math.abs((y - startY) / 2);
      const r = (a > b) ? a : b;
      const ratioX = a / r;
      const ratioY = b / r;
      ctx.scale(ratioX, ratioY);
      ctx.arc(o1 / ratioX, o2 / ratioY, r, 0, 2 * Math.PI, false);
      ctx.restore();

    } else if (graphType === 'square') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, startY);
      ctx.lineTo(x, y);
      ctx.lineTo(startX, y);
      ctx.lineTo(startX, startY);
    } else if (graphType === 'rubber') {
      for (let i = 0; i < stroke.data.length; i++) {
        const { x, y } = stroke.data[i];
        // 操作清除像素
        const size = 2;
        ctx.strokeStyle = '#000000';
        ctx.clearRect(x - size * 10 ,  y - size * 10 , size * 20 , size * 20);
      }
    } else if (graphType === 'text') {
      ctx.font = "16px Microsoft YaHei";
      ctx.fillStyle = strokeColor;
      ctx.fillText(stroke.text, startX, startY);
    }
    ctx.stroke();
    ctx.closePath();
  });
}
export default class WhiteBoard {
  constructor(options) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.strokeColor = '#000';
    this.lineWidth = 2; // 线的宽度
    this.graphType = 'pencil';
    this.strokes = [];
    this.redo = [];
    this.textSite = {};
    const { wid, token } = options;
    const ws = `ws://live.ngrok.elitemc.cn:8000/ws/whiteboard-${wid}?token=${token}`;
    this.socket = new WebSocket(ws);
    this.init();
  }
  init = () => {
    const { canvas, ctx } = this;
    canvas.onmousedown = (event) => {
      this.isDrawing = true;
      const x = event.clientX - canvas.getBoundingClientRect().x;
      const y = event.clientY - canvas.getBoundingClientRect().y;

      // 在该坐标上设置文本框
      if (this.graphType === 'text') {
        this.showTextBox(x, y);
      } else {
        this.addPoint(x, y, true);
      }

      // 如果是橡皮檫，清空画布，重绘，显示橡皮檫
      if (this.graphType === 'rubber') {
        this.showRubber(x, y);
      }
    };
    canvas.onmousemove = (event) => {
      const x = event.clientX - canvas.getBoundingClientRect().x;
      const y = event.clientY - canvas.getBoundingClientRect().y;

      if (this.graphType === 'text') {
        return false;
      }
      // 记录操作,并重绘
      if (this.isDrawing) {
        this.addPoint(x, y);
      }

      // 如果是橡皮檫，清空画布，重绘，显示橡皮檫
      if (this.graphType === 'rubber') {
        this.showRubber(x, y);
      }
    };
    canvas.onmouseup = () => {
      this.isDrawing = false;
      if (this.graphType === 'text') {
        return false;
      } else {
        this.sendStrokes();
      }
    };
    canvas.onmouseleave = () => {
      this.isDrawing = false;
      if (this.graphType === 'rubber') {
        // 隐藏橡皮檫
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.repaint();
      }
    };
  }
  showTextBox = (x, y) => {
    const textElem = document.getElementById('text');
    textElem.style.display = 'block';
    textElem.style.top = y + 'px';
    textElem.style.left = x + 'px';
    this.textSite = { x, y };
  }
  showRubber = (x, y) => {
    // 如果是橡皮檫，清空画布，重绘，显示橡皮檫
    const { ctx } = this;
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.repaint();

    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    const size = 2;
    ctx.moveTo(x - size * 10 , y - size * 10 );
    ctx.lineTo(x + size * 10 , y - size * 10 );
    ctx.lineTo(x + size * 10 , y + size * 10 );
    ctx.lineTo(x - size * 10 , y + size * 10 );
    ctx.lineTo(x - size * 10 , y - size * 10 );
    ctx.stroke();
  }
  sendStrokes = () => {
    this.socket.send(JSON.stringify({ kind: 1, points: this.strokes }));
  }
  addPoint = (x, y, newStroke, str) => {
    const p = { x, y };
    const { graphType } = this;
    if (graphType === 'text') {
      const d = { data: [p], text: str, strokeColor: this.strokeColor, graphType: this.graphType };
      this.strokes.push(d);
    } else if (newStroke) {
      const d = { data: [p], strokeColor: this.strokeColor, width: this.lineWidth, graphType: this.graphType };
      this.strokes.push(d);
    } else if (graphType === 'pencil' || graphType === 'rubber') {
      this.strokes[this.strokes.length - 1].data.push(p);
    } else if (graphType === 'line' || graphType === 'circle' || graphType === 'square') {
      this.strokes[this.strokes.length - 1].data[1] = p;
    }
    this.repaint();
  }
  repaint = () => {
    // 清空再重绘
    repaint(this.ctx, this.strokes);
  }
  // 设置画笔粗细
  setLineWidth = (width) => {
    this.lineWidth = width;
  }
  // 设置类型 {pencil, line, circle, square, rubber, text}
  setGraphType = (graphType) => {
    this.graphType = graphType;
  }
  // 设置画笔颜色
  setGraphColor = (color) => {
    this.strokeColor = color;
  }
  // 清空
  clear = () => {
    this.strokes = [];
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.sendStrokes();
  }
  // 撤销
  cancelOneStep = () => {
    if (this.strokes.length > 0) {
      this.redo.push(this.strokes[this.strokes.length - 1]);
      this.strokes.pop();
      this.repaint();
      this.sendStrokes();
    }
  }
  // 恢复：再执行最近依次操作
  redoStep = () => {
    if (this.redo.length > 0) {
      this.strokes.push(this.redo[this.redo.length - 1]);
      this.redo.pop();
      this.repaint();
      this.sendStrokes();
    }
  }
}

export class ClientBoard {
  constructor(options) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    const { wid, token } = options;
    const ws = `ws://live.ngrok.elitemc.cn:8000/ws/whiteboard-${wid}?token=${token}`;
    this.socket = new WebSocket(ws);
    this.socket.onmessage = (event) => {
      const messages = event.data.split('\n');
      messages.map((data) => {
        this.onMessage(JSON.parse(data));
      })
    }
    this.socket.onopen = (event) => {
      // console.log(event);
    }
  }
  onMessage = (message) => {
    repaint(this.ctx, message.points);
  }
}

```