---
title: Electron + creact-react-app + ant-design搭建项目
date: 2019-08-05 16:57:09
category: NodeJS
---

```shell
# Electron可以简单地理解为
Electron = nodejs + chrome内核
```
因为内置chrome内核，所以开发者可以用html/css/js来构建页面，这一部分运行在*渲染进程*中。
因为内置nodejs环境，所以可以访问计算机本地的资源：读写磁盘文件、创建进程、本地通知，这一部分运行在*主进程*中。


<br/>
### 1. 搭建应用
目标：搭建一个Electron + create-react-app + dva + react-router + antd的应用。

```shell
# 使用create-react-app脚手架
create-react-app my-app
cd my-app
npm start
npm run eject

# 安装electron
npm install electron --save

# 修改pakcage.json
"main": "public/electron.js",
"homepage": ".",
"scripts": {
  "electron-dev": "ELECTRON_START_URL=http://localhost:3000 electron ."
  "electron": "electron .",
}

```


<br/>

### 2. 添加electron启动文件
创建electron启动文件`/public/electron.js`，有两点修改：
- 定义开发环境下`mainWindow.loadURL('http://localhost:3000')`,发布环境下则加载 `build/index.html` 文件。
- 定义`new BrowserWindow`的`webPreferences`属性，指定预加载的js文件(`./public/renderer.js`)
```js
// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
const pkg = require('./package.json')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    autoHideMenuBar: true,
    fullscreenable: false,
    webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true, // 不集成 Nodejs
        webSecurity: false,
        preload: path.join(__dirname, './public/renderer.js') 
        // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })

  // and load the index.html of the app.
  // 这里要注意一下，这里是让浏览器窗口加载网页。
  // 如果是开发环境，则url为http://localhost:3000（package.json中配置）
  // 如果是生产环境，则url为build/index.html
  const startUrl = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
  });
  // 加载网页之后，会创建`渲染进程`
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```


<br/>
### 3. 调试运行
```shell
# 本地运行，运行electron，
npm run start
npm run electron-dev

# 生产环境运行
npm run build
npm run electron
```

<br/>
### 4. 在React App里调用electron API
所有Electron的API都会被指派给一种进程类型。许多API只能被用于主进程或渲染进程，但有一些可以同时在上述两种进程中使用。
- 新建 `/public/renderer.js` 文件，该文件在electron入口文件里定义为预加载文件。通过require的方式获取electron及其他API，暴露electron API
```js
const electron = require('electron')

// 第三方Electron api
var ZegoLiveRoom = require("zegoliveroom/ZegoLiveRoom.js");
var ZEGOCONSTANTS = require("zegoliveroom/ZegoConstant.js");
var zegoClient = new ZegoLiveRoom();

function init() {
  zegoClient.initSDK(config)
}

global.zego = {
  init,
}
```
- 在React中调用
```js
// src/App.js
const electron = window.electron;
const zego = window.zego;

export default class App extends React.Component(){
  componentDidMount() {
    zego.init()
  }

  render() {
    return <div>hell</div>
  }
}
```



<br/>
### 参考资料
- [使用create-react-app编写Electron app](https://www.jianshu.com/p/5e41663825c6)
- [Electron 无边框窗口的拖动](https://www.jianshu.com/p/96327b044e85)
- [Electron中BrowserWindow对象的所有可设置项](https://www.jianshu.com/p/0387bd0f8a70)