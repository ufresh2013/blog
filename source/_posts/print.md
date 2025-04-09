---
title: 打印
date: 2020-04-15 14:35:59
category: Browser
---
### 1. 打印接口
弹出打印预览的窗口，通过页面生成pdf用于打印预览
```js
window.print();
document.execCommand('print');

window.addEventListener('beforeprint', ()=> {
  document.body.innerHTML = '正在打印...';
});
window.addEventListener('afterprint', ()=> {
  document.body.innerHTML = '打印完成...';
});
```



### 2. 打印样式
在link上加上`media="print"`来标识这是打印机才会应用的样式。
```html
<link href="/print.css" media="print" rel="stylesheet" />
```

```css
/* 媒体查询能实现同样的效果 */
@media print {
  h1 { font-size: 20px; }
}
```


### 3. 组件实现
打印会把`document`下所有可见元素打印出来。如果希望页面上不相关的东西不要出现在打印中，可以创建一个iframe,把要打印的dom和样式表都丢进去，再调用iframe的打印事件。引用组件*`<print ref="print">打印内容</print>`*，等内容加载完后，调用*`this.$refs.print()`*打印。

组件默认纵向打印，如果要横向打印，设置`direction="landscape"`。

注意：如果打印内容有异步请求的内容，图片，要等所有内容都请求后，才能调用print方法。
```html
<!-- print.vue -->
<template>
  <div style="position: relative">
    <div class="printFrame">
      <slot></slot>
    </div>
    <iframe id="printFrame"></iframe>
  </div>
</template>

<script>
function createIframe(direction) {
  // addLinkToIframe
  const iframe = document.getElementById('printFrame');
  const iframeDoc = iframe.contentWindow.document;
  const linkList = document.getElementsByTagName('link');
  const linkNode = Array.prototype.slice.call(linkList, 0);
  linkNode.forEach(link => iframeDoc.write(link.outerHTML));

  // addStyleToIframe
  const styleList = document.getElementsByTagName('style');
  const styleNode = Array.prototype.slice.call(styleList, 0);
  styleNode.forEach(style => iframeDoc.write(`<style>${style.innerHTML}</style>`));

  // 设置横向纵向打印
  iframeDoc.write(`<style>
    @media print{
      @page{
        size:A4 ${direction}
      }
      .printFrame div {
        width: ${direction === 'portrait' ? '1200px' : '950px'}
      }
    }
    </style>
    <body></body>
  `);

  return iframe;
}

export default {
  props: {
    direction: {
      type: String,
      default: 'portrait',
    },
  },
  methods: {
    // 打印
    print() {
      const printFrame = document.getElementById('printFrame').contentWindow;
      const str = document.getElementsByClassName('printFrame')[0].innerHTML;
      document.getElementById('printFrame').contentDocument.documentElement.getElementsByTagName('body')[0].innerHTML = str;
      printFrame.document.close();
      printFrame.focus();
      setTimeout(() => {
        printFrame.print();
      }, 300);
    },
  },
  mounted() {
    createIframe(this.direction);
  },
};
</script>

<style scoped>
.printFrame{
  display: none;
}
#printFrame{
  position: absolute;
  top: -9999px;
  left: -2000px;
}
</style>
```



### 4. 打印表格
表格太长的时候，实现分页功能，每个分页都带表头。且可自定义页头页尾
```html
<table class="print-table">
  <thead>
    <tr>
      <th>表头1</th>
      <th>表头2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>2</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td></td>
      <td>每页页尾内容</td>
    </tr>
  </tfoot>
</table>

<style lang="less" scoped>
.print-table{
  display: table;
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
}
</style>
```



### 5. 生成条形码
用jsBarCode生成条形码图片
```html
<img ref="barcode" id="barcode">
```

```js
import jsBarCode from 'jsbarcode';

jsBarCode(this.$refs.barcode, 'YF123456', {
  format: 'CODE128',
  displayValue: true,
  fontSize: 30,
  height: 100,
});
```


### 6. 分页符
```html
<div style="page-break-before:left"></div>
```


### 参考资料
- [window.print —— 浏览器打印扫盲](https://juejin.im/post/5b371a8a6fb9a00e5326f06c)