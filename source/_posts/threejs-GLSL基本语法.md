---
title: Shader GLSL语法
date: 2024-12-02 23:12:24
category: Other
---
> 着色器是一种使用*`GLSL`*语言编写的运行在*`GPU`*上的程序。是屏幕上呈现画面前的最后一步，用它可以实现对先前渲染结果进行修改（如颜色、位置），从而实现高级的渲染效果。在 `Three.js` 中，需要使用 `GLSL` 语言来编写着色器，全称是 `OpenGL Shading Language`，意为 `OpenGL` 中的着色语言。


### 1. 变量数据类型
- `float` 浮点数
- `int` 整数
- `bool` 布尔值
- `vec2` 二维向量
- `vec3` 三维向量
- `vec4` 四维向量
- `mat3`
- `mat4`
- `sampler2D`
- `samplerCube`

*`vec`*向量类型，可以分别看成由 `(x,y)`、`(x,y,z)`或`(r,g,b)`、`(x,y,z,w)`或(`r,g,b,a)` 等分量组成，vec3 可以由 vec2+float 创建、vec4 可以由 vec3+float、vec2+vec2 等不同方式创建，比较灵活。

GLSL 里 rgb 范围都是 0.0-1.0，而非一般的 0-255。黑色为`(0.0,0.0,0.0)`、白色为`(1.0,1.0,1.0)`、红色为`(1.0,0.0,0.0)`。
如果设置的颜色值小于0.0会被截取到0.0，大于1.0会被截取到1.0。
```js
float alpha = 0.5;
int num = 10;
bool flag = true;

vec2 a = vec2(1.0, 0.0);
// a.x=1.0 a.y=0.0
a.x = 2.0;
a.y = 0.5;

vec2 a = vec2(1.0);
// a.x=1.0 a.y=1.0

// 向量之间或向量与浮点数之间的加减乘除四则运算是基于每个分量单独计算
vec2 a = vec2(1.0) + vec2(0.1, 0.2);
// a.x=1.1 a.y=1.2
vec2 a = vec2(1.0) * 2.0;
// a.x=2.0 a.y=2.0

vec3 b = vec3(1.0, 2.0, 0.0);
// b.x=1.0 b.y=2.0 b.z=0.0
// b.r=1.0 b.g=2.0 b.b=0.0
b.z = 3.0;

vec4 c = vec4(1.0, 1.0, 1.0, 1.0);
// c.x=c.y=c.z=c.w=1.0
// c.r=c.g=c.b=c.a=1.0
c.r = 0.9
c.g = 0.0;
c.b = 0.0;

vec3 d = vec3(vec2(0.5), 1.0);
vec4 e = vec4(vec3(1.0), 1.0);
vec4 e = vec4(vec2(0.3), vec2(0.1));
```



### 2. 修饰符
GLSL约定俗成地将 `attribute`变量用`a`开头如`aRadom`，`uniform`的用`u`开头如`uTime`，`varying`的用`v`开头如`vUv`.

#### 2.1 attribute 顶点相关值
`attributes` 修饰符表明这个数据在每个顶点上都不同。内置的attribute有
- `attribute vec3 position` 顶点坐标
- `attribute vec3 normal` 法线向量
- `attribute vec2 uv`  纹理坐标
- `attribute float aRandom` 每个顶点不同的随机值


#### 2.2 uniform 统一值
`uniform`修饰符，表示所有线程都传入的、统一的值。内置的uniforms
- `uniform mat4 modelMatrix`
- `uniform mat4 modelViewMatrix`
- `uniform mat4 projectionMatrix`
- `uniform mat4 viewMatrix`
- `uniform mat3 normalMatrix`
- `uniform vec3 cameraPosition`


#### 2.3 varying 传递值
如果顶点着色器的变量想在片元着色器里使用，就需要借助`varying`来传递。
```js
// Vertex shader
attribute vec2 uv;
varing vec2 vUv;

void main() {
  vUv = uv;
}

// Fragment Shader
varying vec2 vUV;
void main() {
  gl_FragColor = vec4(vUv, 1.0, 1.0);
}
```




### 3. 内置函数
#### 3.1 运算函数
- *`abs(x)`*：取 x 的绝对值
- *`radians(x)`*：角度转弧度（弧度是圆的半径和圆心角所对应的弧长之比）
- *`degrees(x)`*：弧度转角度
- *`sin(x)`*：正弦函数，传入值为弧度。还有 cos 余弦函数、tan 正切函数、asin 反正弦、acos反余弦、atan 反正切等
- *`pow(x,y)`*：x^y
- *`exp(x)`*：e^x
- *`exp2(x)`*：2^x
- *`log(x)`*：logex
- *`log2(x)`*：log2x
- *`sqrt(x)`*：x√，根号x
- *`inversesqr(x)`*：1 / x√ , 根号x的倒数
- *`sign(x)`*：x>0 返回 1.0，x<0 返回 -1.0，否则返回 0.0
- *`ceil(x)`*：返回大于或者等于 x 的整数
- *`floor(x)`*：返回小于或者等于 x 的整数
- *`fract(x)`*：返回 x-floor(x) 的值
- *`mod(x,y)`*：取x除以y的余数
- *`min(x,y)`*：获取 x、y 中小的那个
- *`max(x,y)`*：获取 x、y 中大的那个
- *`dFdx(p)`*：p 在 x 方向上的偏导数
- *`dFdy(p)`*：p 在 y 方向上的偏导数
- *`fwidth(p)`*：p 在 x 和 y 方向上的偏导数的绝对值之和
- *`step(x, a)`*：x < a返回 0.0，否则返回 1.0。常用于生成阶梯效果
- *`smoothstep(t1, t2, x)`*: 在t1到t2之间平滑过度，小于t1时返回0，大于t2时返回1。常用于实现颜色渐变、物体平滑移动
- *`mix(colorA, colorB, a)`*：返回`colorA * (1−a) + colorB * a`。 颜色函数，常用于混合colorA和colorB, a是混合系数，范围为0到1。当a为0时，混合后的值等于x；当a为1时，混合后的值等于y；当a在0到1之间时，混合后的值是x和y的线性插值。实现颜色渐变、透明度混合


#### 3.2 几何函数
- *`length(vec2 p)`*: 计算向量的长度
- *`distance(vec2 p0, vec2 p1)`*: 计算两向量之间的距离
- *`dot(vec2 x, vec2 y)`*: 计算两个向量的点积
- *`cross(x,y)`*：返回向量 xy 的差积
- *`normalize(x)`*：返回与 x 向量方向相同，长度为 1 的向量




#### 3.3 noise噪声
noise 函数能使相邻的点（一维、二维、三维的点都行）产生相近的数值，而不是 random 随机函数那种每个位置的数值都和附近无关的效果。


### 4. 片元着色器
`uv`是每个片元的数值，左下角 vUv 为 (0.0, 0.0) 所以对应的 vUv.x=vUv.y=0.0。同理左上角就是 (0.0, 1.0)、右下角 (1.0, 0.0)、右上角 (1.0, 1.0)、最中间 (0.5, 0.5)。*

#### 4.1 颜色效果
##### 4.1.1 颜色渐变
```js
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv.x, 0.0, 0.0, 1.0);
}
```

##### 4.1.2 颜色突变
```js
float color = step(0.5, vUv.x); // 改成0.3, 突变的位置也会随之改变
gl_FragColor = vec4(vec3(color), 1.0);
```


##### 4.1.3 熟悉的青红、蓝粉效果
```js
gl_FragColor = vec4(vUv, 0.0, 1.0); // 青红
gl_FragColor = vec4(vUv, 1.0, 1.0); // 蓝粉

```

##### 4.1.4 条纹效果
重复条纹效果要用`fract`，返回x.floor() - x的值。
```js
// 取vUv.x * 3.0小数，< 0.5返回0，>0.5返回1
float color = step(0.5, fract(vUv.x * 3.0))
gl_FragColor = vec4(vec3(color), 1.0); 
```



##### 4.1.5 指定颜色渐变、突变、重复渐变、条纹效果
```js
vec3 color1 = vec3(1.0, 1.0, 0.0); // 黄色
vec3 color2 = vec3(0.0, 1.0, 1.0); // 青色
float mixer = vUv.x; // 渐变
// float mixer = step(0.5, vUv.x); // 突变
// float mixer = fract(vUv.x * 3.0); // 重复渐变
// float mixer = step(0.5, fract(vUv.x * 3.0)); // 条纹
vec3 color = mix(color1, color2, mixer);
gl_FragColor = vec4(color, 1.0);
```





#### 4.2. 绘制图形
##### 4.2.1 圆形
```js
float dist = length(vUv - vec2(0.5)); // 将整体坐标移到正中心
float radius = 0.5;
float color = step(radius, dist);
gl_FragColor = vec4(vec3(color), 1.0);
```


##### 4.2.2 半径动态变化的圆
```js
varying vec2 vUv;
uniform float uTime;

void main() {
  float dist = length(vUv - vec2(0.5)); // 将整体坐标移到正中心
  float radius = 0.5 * (sin(uTime) * 0.5 + 0.5);
  vec3 color = vec3(step(radius, dist));
  gl_FragColor = vec4(color, 1.0);
}
```


##### 4.2.3 一组多个，半径动态变化的圆
```js
varying vec2 vUv;
uniform float uTime;

void main() {
  // 先重复 uv，再居中，再绘制圆形
  float dist = length(fract(vUv * 5.0) - vec2(0.5));
  // 半径大小随时间周期变化
  float radius = 0.5 * (sin(uTime + vUv.x + vUv.y) * 0.5 + 0.5);
  vec3 color = vec3(step(radius, dist));
  gl_FragColor = vec4(color, 1.0);
}
```

##### 4.2.4 径向条纹(动画)
```js
varying vec2 vUv;
uniform float uTime;

void main() {
  // 先居中，后重复，再绘制圆形
  float dist = fract(length(vUv - vec2(0.5)) * 5.0);
  // 动画效果
  // float dist = fract((length(vUv - vec2(0.5)) /0.707 - uTime * 0.5) * 5.0);
  float radius = 0.5;
  vec3 color = vec3(step(radius, dist));
  gl_FragColor = vec4(color, 1.0);
}
```

##### 4.2.5 指定颜色的圆形
```js
vec3 color1 = vec3(1.0, 1.0, 0.0);
vec3 color2 = vec3(0.0, 1.0, 1.0); 
float mixer = length(vUv - vec2(0.5)); // 圆形渐变
// mixer = step(0.25, mixer); // 圆形
vec3 color = mix(color1, color2, mixer);
gl_FragColor = vec4(color, 1.0);
```


##### 4.2.6 对角线渐变
```js
vec3 color1 = vec3(1.0, 1.0, 0.0);
vec3 color2 = vec3(0.0, 1.0, 1.0); 
float mixer = (vUv.x + vUv.y) / 2.0;
vec3 color = mix(color1, color2, mixer);
// mixer = step(0.5, mixer); // 对角线突变
// vec3 color = vec3(mixer); // 黑白渐变
gl_FragColor = vec4(color, 1.0);
```

##### 4.2.7 棋盘格
```js
vec3 color1 = vec3(0.0, 0.0, 0.0);
vec3 color2 = vec3(0.0, 1.0, 1.0);
float mask1 = step(0.5, fract(vUv.x * 3.0));
float mask2 = step(0.5, fract(vUv.y * 3.0));
float mixer = abs(mask1 - mask2);
vec3 color = mix(color1, color2, mixer);
gl_FragColor = vec4(color, 1.0);
```


### 参考资料
- [The Books of Shaders](https://thebookofshaders.com/)
- [Three.js 进阶之旅：Shader着色器入门](https://juejin.cn/post/7158032481302609950)
- [更多GLSL内置函数]()