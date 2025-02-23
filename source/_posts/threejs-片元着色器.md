---
title: Shader片元着色器
date: 2024-12-04 23:01:11
category: 草稿
---
> `uv`是每个片元的数值，左下角 vUv 为 (0.0, 0.0) 所以对应的 vUv.x=vUv.y=0.0。同理左上角就是 (0.0, 1.0)、右下角 (1.0, 0.0)、右上角 (1.0, 1.0)、最中间 (0.5, 0.5)。*

### 1. 颜色效果
#### 1.1 颜色渐变
```js
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv.x, 0.0, 0.0, 1.0);
}
```

#### 1.2 颜色突变
```js
float color = step(0.5, vUv.x); // 改成0.3, 突变的位置也会随之改变
gl_FragColor = vec4(vec3(color), 1.0);
```


#### 1.3 熟悉的青红、蓝粉效果
```js
gl_FragColor = vec4(vUv, 0.0, 1.0); // 青红
gl_FragColor = vec4(vUv, 1.0, 1.0); // 蓝粉

```

#### 1.4 条纹效果
重复条纹效果要用`fract`，返回x.floor() - x的值。
```js
// 取vUv.x * 3.0小数，< 0.5返回0，>0.5返回1
float color = step(0.5, fract(vUv.x * 3.0))
gl_FragColor = vec4(vec3(color), 1.0); 
```



#### 1.5 指定颜色渐变、突变、重复渐变、条纹效果
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



<br/>

### 2. 绘制图形
#### 2.1 圆形
```js
float dist = length(vUv - vec2(0.5)); // 将整体坐标移到正中心
float radius = 0.5;
float color = step(radius, dist);
gl_FragColor = vec4(vec3(color), 1.0);
```


#### 2.2 半径动态变化的圆
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


#### 2.3 一组多个，半径动态变化的圆
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

#### 2.4 径向条纹(动画)
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

#### 2.5 指定颜色的圆形
```js
vec3 color1 = vec3(1.0, 1.0, 0.0);
vec3 color2 = vec3(0.0, 1.0, 1.0); 
float mixer = length(vUv - vec2(0.5)); // 圆形渐变
// mixer = step(0.25, mixer); // 圆形
vec3 color = mix(color1, color2, mixer);
gl_FragColor = vec4(color, 1.0);
```


#### 2.6 对角线渐变
```js
vec3 color1 = vec3(1.0, 1.0, 0.0);
vec3 color2 = vec3(0.0, 1.0, 1.0); 
float mixer = (vUv.x + vUv.y) / 2.0;
vec3 color = mix(color1, color2, mixer);
// mixer = step(0.5, mixer); // 对角线突变
// vec3 color = vec3(mixer); // 黑白渐变
gl_FragColor = vec4(color, 1.0);
```

#### 2.7 棋盘格
```js
vec3 color1 = vec3(0.0, 0.0, 0.0);
vec3 color2 = vec3(0.0, 1.0, 1.0);
float mask1 = step(0.5, fract(vUv.x * 3.0));
float mask2 = step(0.5, fract(vUv.y * 3.0));
float mixer = abs(mask1 - mask2);
vec3 color = mix(color1, color2, mixer);
gl_FragColor = vec4(color, 1.0);
```