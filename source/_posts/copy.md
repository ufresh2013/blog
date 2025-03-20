---
title: Blob, toBlob, FileReader 文件操作 & 复制
date: 2024-08-16 22:44:14
category: HTTP
---

### 1. Blob
Blob表示不可变的原始数据，可以是二进制数据或文本数据。



#### 1.1 下载文件
*`new Blob()`*创建一个Blob对象可以方便地将数据转换为文件形式，并通过*`URL.createObjectURL`*生成临时URL用于下载或显示。
```js
document.getElementById('downloadBtn').addEventListener('click', () => {
  const content = '这是一个通过Blob创建的文本文件。';
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'example.txt';
  document.body.appendChild(a);
  a.click();

  // 释放URL对象
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
});
```

<br/>

#### 1.2 上传文件
```js
document.getElementById('uploadBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) return

  // 创建FormData对象, 上传文件
  const formData = new FormData();
  formData.append('image', file);
  fetch('https://example.com/upload', {
    method: 'POST',
    body: formData,
  })
});
```

<br/>

#### 1.3 大文件的分段下载
大文件分段下载，跟大文件上传时要切片的初心一样，是为了“快”。利用 HTTP 请求头 *`Range`*控制下载片段，能够同时下载一个大文件的多个片段，然后组装起来，那将能够充分利用我们的网络资源，加速下载。
ps: 实现*暂停下载*，则是取消所有未完成的请求。
```js
// 并发分段下载
axios.get(linkUrl, {
  headers: {
    Range: `bytes=${start}-${end}`,
    responseType: 'blob'
  }
})

// 合并分段
const blobs = await Promise.all(tasks)
const blob = new Blob(
  blobs.map(blob => blob.data),
  { type: mime }
)

// 保存为文件，见1.1 下载文件
```



<br/>

### 2. toBlob
`HTMLCanvasElement.toBlob(callback, type, quality)` 方法创造 Blob 对象，用以展示 canvas 上的图片；这个图片文件可以被缓存或保存到本地。
- `callback`: 回调函数，可获得一个单独的 Blob 对象参数
- `type`: string, 指定图片格式，默认为 image/png。
  - text/plain - 纯文本文档
  - text/html - html文档
  - text/javascript - js文件
  - text/css - css文件
  - application/json - json文件
  - application/pdf - pdf文件
  - application/xml - xml文件
  - image/jpeg - jpeg图像
  - image/png - png图像
  - image/gif - gif图像
  - image/svg+xml - svg图像
  - audio/mpeg - mp3文件
  - video/mpeg - mp4文件
- `quality`: Number 类型，值在 0 与 1 之间，当请求图片格式为 image/jpeg 或者 image/webp 时用来指定图片展示质量。
- *`canvasHTMLElement.toBlob`*可以用来实现复制效果
```js
function copyBlob(blob: Blob | null): void {
  if (!blob) return
  if (!navigator.clipboard || !navigator.clipboard.write) return
  const data = [new ClipboardItem({ [blob.type]: blob })]
  navigator.clipboard.write(data)
}
```

<br/>

#### 2.1 复制 canvas / svg 为图片
```js
async function getChartBlob(title: string | null): Promise<Blob | null> {
  return new Promise(resolve => {
    const chartDiv = document.getElementById(`chart-container`) as HTMLElement
    const svgElement = chartDiv.querySelector('svg') as SVGElement
    const svgXML = new XMLSerializer().serializeToString(svgElement)
    const chartWidth = svgElement.clientWidth * 1.5
    const chartHeight = svgElement.clientHeight * 1.5

    // 创建一个新的canvas元素
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = chartWidth + 32
    canvas.height = title
      ? chartHeight + 66 // 图表标题占34px
      : chartHeight + 32

    // 创建一个新的Image对象
    const image = new Image()
    image.src = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgXML)
    image.onload = () => {
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      if (title) {
        context.fillStyle = 'rgba(13,13,13,0.9)'
        context.font = '14px Arial'
        const textWidth = context.measureText(title).width
        const x = (canvas.width - textWidth) / 2
        context.fillText(title, x, 30)
      }
      context.drawImage(image, 16, title ? 50 : 16, chartWidth, chartHeight)

      // 将canvas图像转换为图片文件
      canvas.toBlob(
        async blob => {
          return resolve(blob)
        },
        'image/png',
        0.5
      )
    }
  })
}

// 复制svg图表
const res = await getChartBlob('图表标题')
copyBlob(res)
```

<br/>

#### 2.2 复制 div 为图片
```js
import html2canvas from 'html2canvas'

export async function getTableBlob(): Promise<Blob | null> {
  return new Promise(async resolve => {
    const table = document.getElementsByClassName('base-table')[0] as HTMLElement

    // 将图片数据URL放到粘贴板上
    const canvas = await html2canvas(table)
    canvas.toBlob(
      async blob => {
        resolve(blob)
      },
      'image/png',
      0.9
    )
  })
}

const res = await getTableBlob()
copyBlob(res)
```

<br/>

#### 2.3 复制文本
```js
export function copyText(text: string){
  const tempEl = document.createElement('textarea')
  tempEl.value = text
  document.body.appendChild(tempEl)
  tempEl.select()
  document.execCommand('copy')
  document.body.removeChild(tempEl)
}
```

### 3. FileReader
#### 3.1 读取文件文本内容
```js
document.getElementById('textFileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      document.getElementById('textContent').textContent = e.target.result;
    };

    reader.onerror = (e) => {
      alert('文件读取失败！');
    };

    reader.readAsText(file);
  }
});
```

<br/>

#### 3.2 读取图片并预览
```js
document.getElementById('imageFileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = '预览图片';
      img.width = 300;
      document.getElementById('imagePreview').appendChild(img);
    };

    reader.onerror = () => {
      alert('图片加载失败！');
    };

    reader.readAsDataURL(file);
  } else {
    alert('请选择一张图片文件。');
  }
});
```

<br/>

### 参考资料
- [前端Blob、File、FileReader、ArrayBuffer傻傻分不清](https://juejin.cn/post/7444467218070323210?searchId=20241229213222203B42E54AFE0FF45949)