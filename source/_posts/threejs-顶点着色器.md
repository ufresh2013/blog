---
title: Shader顶点着色器
date: 2024-12-04 23:01:11
category: ThreeJS
---

### 1. 旋转顶点
让所有顶点绕 x 轴旋转 45°
```js
// glsl-rotation-3d
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;
  float PI = 3.1415925;
  vec3 axis = vec3(1.0, 0.0, 0.0);
  float angle = PI / 4.0;
  vec3 newPos = rotate(position, axis, angle);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
```

### 2. 扭麻花
```js
vUv = uv;
vec3 axis = vec3(1.0, 0.0, 0.0);
float angle = position.x + uTime;
vec3 newPos = rotate(position, axis, angle);
gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
```

### 参考资料
- [手把手带你入门 Three.js Shader 系列（八）](https://juejin.cn/post/7340909611098554409)