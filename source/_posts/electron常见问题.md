---
title: Electron碰到的问题
date: 2019-09-19 11:33:36
category: NodeJS
---
> 项目使用create-react-app搭建，本地开发时候，先跑起一个WebServer，再用electron加载`localhost:8000`页面，走的是http协议。打包后，因为访问的是本地文件，走的是file协议。因此会出现不少问题...


<br/>
### 1. 渲染进程使用Node模块
Node. js 的所有 内置模块 都在Electron中可用， 第三方 node 模块中也完全支持。渲染进程除了额外能够使用node模块的能力外，与普通网页没有什么区别
```html
<html>
<body>
<script>
  const { app } = require('electron').remote
  console.log(app.getVersion())
</script>
</body>
</html>
```

<br/>

### 2. 请求 url 为绝对路径
```js
const host =
  process.env.NODE_ENV === 'development' ? '' : 'http://v3.yingliboke.cn/api';
```

<br/>
### 3. 路由失效

一开始用的 React-router 的 `<BrowserRouter>`打开后，页面一片空白。要使用`<HashRouter>`，并设置`hashType: 'noslash'` -> `index.html#liveroom`。

```js
// Router.js
import { HashRouter, Route } from 'react-router-dom';

export default function AppRouter() {
  return (
    <HashRouter hashType="noslash">
      <Route exact path="/" component={Login} />
      <Route path="/liveroom" component={Liveroom} />
    </HashRouter>
  );
}
```

electron 入口文件，打包后可以直接进入liveroom路由
```js
let startUrl;
if (isDev) {
  startUrl = 'http://localhost:8000#liveroom';
  mainWindow.loadURL(startUrl);
} else {
  startUrl = url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: false,
    hash: 'liveroom'
  });
  mainWindow.loadURL(startUrl);
}
```

<br/>
### 4. window.location不可用

当使用 api(如 webContents.loadURL 和 webContents.back) 来修改导航的时候，这个事件将不会发出，它也不会在页内发生跳转。
使用`did-navigate-in-page`事件可以监听到 —— 点击锚链接或更新 window.location.hash。调用 event.preventDefault() 可以默认事件。

```js
// Page navigate
mainWindow.webContents.on('did-navigate-in-page', (event, url) => {
  const before = mainWindow.webContents.getURL();
  if (!isDev && before !== url) {
    // 要跳转的url和当前url不同时，才跳转
    event.preventDefault();
    const hash = url.split('#')[1];
    const startUrl = require('url').format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: false,
      hash
    });
    mainWindow.loadURL(startUrl);
  }
});
```

在代码中统一使用修改 hash 值，进行路由跳转

```js
window.location.hash = 'liveroom';
```

<br/>

### 5. 首次进入页面白屏

在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁：

```js
const { BrowserWindow } = require('electron');
let win = new BrowserWindow({ show: false });
win.once('ready-to-show', () => {
  win.show();
});
```

这个事件通常在 did-finish-load 事件之后发出，但是页面有许多远程资源时，它可能会在 did-finish-load 之前发出事件。


<br/>
### 6. frameless窗口设置拖动区域

注意，mac 关闭了 devTool 拖动才能生效

```css
.div {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
```


<br/>
### 7. 打开新窗口
需要全局定义一个`win`变量来存储所有新窗口，不然关闭窗口会报错。
```js
let win = {};
ipcMain.on('newwin', (event, value) => {
  const { width, height, minWidth, minHeight, hash } = value;
  win[hash] = new BrowserWindow({
    width,
    height,
    minHeight,
    minWidth,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true //设置此处
    }
  });

  let startUrl;
  if (isDev) {
    startUrl = `http://localhost:8000#${hash}`;
  } else {
    startUrl = url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: false,
      hash
    });
  }
  win[hash].loadURL(startUrl);
  win[hash].on('closed', () => {
    win[hash] = null;
  });
});
```

渲染进程中打开新窗口
```js
ipcRenderer.send('newwin', {
  width,
  height,
  minWidth,
  minHeight,
  hash,
});
```


<br/>
### 8. 多个窗口之间通信
这里记录一个需求：打开了一个新窗口，在新窗口点击一个按钮时，会自动关闭该窗口，并在主窗口显示一个小弹窗。
```js
// electron入口文件
ipcMain.on('close-newwin', (event, value) => {
  const { type } = JSON.parse(value);
  // 监听窗口向主进程发送消息，收到消息后，向父窗口的渲染进程发消息
  mainWindow.webContents.send('newmsg', value);
  win[type].close();
});
```




<br/>
### 9. 关闭窗口二次确认框
关闭窗口时，弹出自定义弹框。
```js
// electron入口文件
// 阻止默认close事件，先渲染进程发送弹出确认框的消息
mainWindow.on('close', e => {
  e.preventDefault();
  const url = mainWindow.webContents.getURL();
  mainWindow.webContents.send('confirm-close-app', url);
});


// 接收渲染进程的close-app消息，收到则关闭app
ipcMain.on('close-app', (event, value) => {
  mainWindow = null;
  app.exit();
});
```

渲染进程中，监听confirm-close-app
```js
componentDidMount() {
  const { ipcRenderer } = window.electron;
    ipcRenderer.on('confirm-close-app', (event, arg) => {
      if (flag) {
        // 显示弹窗
        // ...
      } else {
        // 关闭窗口
        ipcRenderer.send('close-app', 'close');
      }
    });
}
```



<br/>
### 参考资料
- [Routing doesn't work on packaged Electron app using ReactJS and reach-router](https://stackoverflow.com/questions/54011027/routing-doesnt-work-on-packaged-electron-app-using-reactjs-and-reach-router)
- [How do I move a frameless window in Electron without using -webkit-app-region](https://stackoverflow.com/questions/44818508/how-do-i-move-a-frameless-window-in-electron-without-using-webkit-app-region)
- [Frameless window not draggable - Mac OSX](https://stackoverflow.com/questions/33505485/frameless-window-not-draggable-mac-osx)
