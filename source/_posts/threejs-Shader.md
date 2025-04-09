---
title: 理解 Shader
date: 2024-12-02 23:12:23
category: Other
---
### 1. 点线面体
我们绘制一个宽高`1*1`的平面，开启线框模式 *`wireframe: true`*。
```js
const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({
    color: 0x0ca678,
    wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

你会发现默认的平面由4个顶点，2个三角形组成。
顶点连成线、线组成三角形、三角形组成几何体，立方体、球体等亦是如此。

<img src="1.jpg" style="max-width:250px">

打印几何体 *`console.log(geometry)`*
<img src="2.jpg" style="max-width:500px">


可以看到attributes携带的每个顶点的数据，里面包含


#### 1.1 `position` 
顶点坐标
<img src="3.jpg" style="max-width:500px">




#### 1.2 `uv` 纹理坐标
u从左到右增加，v从下到上增加，范围是左下角(0,0)到右上角(1,1)，借助uv就能把纹理图片贴到3D物体上。`uv`是每个片元的数值，左下角 vUv 为 (0.0, 0.0) 所以对应的 vUv.x=vUv.y=0.0。同理左上角就是 (0.0, 1.0)、右下角 (1.0, 0.0)、右上角 (1.0, 1.0)、最中间 (0.5, 0.5)。

<img src="4.jpg" style="max-width:500px">

可以看到立方体每个面都有各自的 (0,0)-(1,1) uv 值。
<img src="5.jpg" style="max-width:500px">


#### 1.3 `normal`



### 2. ShaderMaterial
使用`ShaderMaterial`来创建几何体, 并通过设置`vertexShader` 和 `fragmentShader`来实现自定义shader材质，由`GPU`分别对每个顶点、每个片元独立执行，并且每个顶点或片元都不知道其他顶点或片元的数据。
在顶点着色器里需要设置`gl_Position`,`gl_PointSize(可选)` 顶点位置，在片元着色器里需要设置`gl_FragColor`片元/像素颜色。
```js
const vertex = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;
const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment
});
```


#### 2.1 VertexShader 顶点着色器
Vertex Shader 用于定位几何体的顶点，它的工作原理是发送顶点位置、网格变换（position、旋rotation和 scale等）、摄像机信息（position、rotation、fov 等）, GPU 将按照 Vertex Shader 中的指令处理这些信息，然后将顶点投影到 2D 空间中渲染成 Canvas。

最简单的顶点着色器也要设置这一串东西，以确保三维空间的物体呈现在二维屏幕上。
```js
const vertex = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
```
**如何理解这一行代码？**
将顶点坐标`position`变成`vec4`四维向量，`* modelMatrix`将模型原本坐标变成世界坐标里适当的位置和大小，实现想要的场景；再`* viewMatrix`视图矩阵实现物体相基于相机的位置，这两步可以简写为`modelViewMatrix`，最后再`* projectionMatrix`变换到裁剪空间，变成二维屏幕上渲染的效果。

这里的变量`modelViewMatrix`, `projectionMatrix`, `position`都是`shaderMatrial`内置可以直接拿来用的。`uv`, `normal`则可以在顶点着色器里直接使用。




#### 2.3 FragmentShader 片元着色器
Fragment Shader 在 Vertex Shader 之后执行，它的作用是为几何体的每个可见像素进行着色。








### 参考资料
- [手把手带你入门 Three.js Shader 系列（一）](https://juejin.cn/post/7233359844974182437)
- [Three.js 进阶之旅：Shader着色器入门](https://juejin.cn/post/7158032481302609950)