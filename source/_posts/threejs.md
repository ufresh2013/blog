---
title: Three.js 从入门到入门
date: 2024-12-02 23:01:11
category: Other
---

### 1. 基本组成
#### 1.1 场景 Scene
- *`new Three.Scene()`* 新建场景
- *`add(objects)`* 添加物体(包括点point、线line、面triangle、体-由多个面组成)
- *`add(light)`* 添加灯光



#### 1.2 照相机 Camera
- *`new Three.PerspectiveCamera(视野角度, 长宽比, 近截面, 远截面)`* 新建透视摄像机
- *`lookAt(mesh.position)`* 设置相机指向
- *`updateProjectionMatrix()`* 修改相机的视野角度, 长宽比, 近截面, 远截面后，需要调用这个方法重新计算投影矩阵



#### 1.3 渲染器 Renderer
照相机将场景中的物体投影在渲染器上，画面显示在`canvas`画布上，`canvas`挂载在`renderer.domElement`这一div上。
- new Three.WebGLRenderer()
- setSize
- setPixelRatio
- render(scene, camera)
- shadowMap.enabled
- shadowMap.type
- antialias: true 抗锯齿

```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
```





### 2. 物体
#### 2.1 网格 Mesh
`Mesh`表示场景中的点线面体，这些物体都是由`geometry`几何体和`material`材质组成。
```js
// 创建mesh
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);
```







#### 2.2 材料 Material
- new MeshBasicMaterial({ color, wireframe, map })
  - color: 材质颜色
  - wireframe: 将材质渲染为线框
  - map: 使用贴图

其他材质：
  - `MeshPhysicalMaterial`物理网络材质
  - `MeshMatcapMaterial`适用于光照场景
  - `MeshStandardMaterial`: 
    - roughness: 材质的粗糙程度，0表示平滑的镜面反射，1表示完全漫反射
    - metalness:

```js
// 1. 图片贴图：textureLoader
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const material = new THREE.MeshBasicMaterial({ map: alphaTexture })

// 2. 环境贴图： RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = environmentMap
  scene.environment = environmentMap
})


// 3. 艺术字
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  const textGeometry = new TextGeometry('hello world', {
    font,
    size: 0.5,
    height: 0.2
  })
  textGeometry.center()
  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)
})
```



#### 2.3 几何体 Geometry
- BoxGeometry
- BufferGeometry
- PlaneGeometry
将信息（例如顶点位置，面索引，法线，颜色，uv和任何自定义属性）存储在buffers（Float32Array, BufferAttribute）中。

```js
// 创建一个矩形. 在这里我们左上和右下顶点被复制了两次。
// 因为在两个三角面片里，这两个顶点都需要被用到。
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array( [
  -1.0, -1.0,  1.0,
  1.0, -1.0,  1.0,
  1.0,  1.0,  1.0,

  1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0, -1.0,  1.0
] );

// itemSize = 3 因为每个顶点都是一个三元组。
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh( geometry, material );
```

几何体的属性和方法
- attributes 几何体相应的buffer
- position 设置位置
- scale 缩放
- rotation 旋转
- translate 移动
- lookAt 设置朝向


#### 2.4 变换 transform
变化mesh的属性，坐标轴`AxesHelp()`辅助实现
- position 位置
- rotation 旋转
- scale 缩放

```js
mesh.scale.set(radius, radius, radius)
mesh.rotation.x = 1
mesh.position.x = 1
mesh.position.copy(mesh2.position)
```

#### 2.5 组合 Group
将多个物体放入一个组合中做旋转，会以组合中心整体旋转。一个物体可以放进多个`Group`中（可以做太阳系效果）




### 3. 光
灯光和材质紧密相关。
#### 3.1 光线 Light 
```js
// AmbientLight 环境光，均匀的照亮场景中的所有物体
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)

// PointLight 点光源，从一个点向各个方向发射的光源
const pointLight = new THREE.PointLight(0xffffff, 50)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// DirectionLight 平行光，模拟太阳光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, - 1)
```

#### 3.2 阴影 Shadow 
```js
// 开启Renderer的阴影效果
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 定义mesh / light是否投射阴影，是否接收阴影
pointLight.castShadow = true
mesh.receiveShadow = true

// 设置shadow的属性
mesh.shadow.mapSize.width = 256 // 阴影贴图的宽度
mesh.shadow.mapSize.height = 256 // 阴影贴图的高度
mesh.shadow.camera.far = 7
```

 

### 4. 运动
#### 4.1 计时器 Clock
`Clock` 用于跟踪时间
- new THREE.Clock()
- clock.getElapsedTime() 获取时钟运行的总时长
- clock.start() 启动时钟
- clock.stop() 停止时钟
- clock.getDelta() 获取`.oldTime`设置后到当前的秒数
- clock.oldTime 存储最后一次调用`start`, `getElapsedTime`, `getDelta`的时间

使用`requestAnimationFrame`, `Three.Clock`, `getElapsedTime`改变物体的position实现动画循环。
如下面代码所示，动画的更新应该依赖`elapsedTime`, 而不是单纯的叠加，*来解决不同设备刷新率不同的问题*。

```js
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  mesh.rotation.y = elapsedTime; // right
  mesh.rotation.y += 1 // wrong
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
```

#### 4.2 帧率检测 Stat
```js
import Stat from 'three/examples/jsm/libs/stats.module'

const stat = new Stat()
document.body.append(stat.dom)

const tick = () => {
  stat.update()
}
```

### 5. 鼠标交互
#### 5.1 交互 OrbitControls 
```js
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
```

#### 5.2 鼠标拾取 Raycaster 
`Raycaster`光线投射，通过在场景中发射一条从相机出发并穿过鼠标点击位置的射线，我们可以检测到射线与哪些对象相交，从而实现用户与3D对象的交互。
```js
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
​
function onMouseClick(event) {
  // 将鼠标位置转换为归一化设备坐标(NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  // 通过相机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera);
  // 计算物体和射线的交点
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    // 如果有交点，更改第一个交点物体的颜色
    intersects[0].object.material.color.set(0xff0000);
  }
}
​
window.addEventListener('click', onMouseClick);
window.addEventListener('mousemove', onMouseClick);
```


### 5. 其他



#### 4.3 窗口事件
```js
window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
```

#### 4.4 调试工具 debug ui 
使用`lil-gui`包
```js
import GUI from 'lil-gui'

const gui = new GUI()
```



#### 4.5 加载blender model
```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025)
  scene.add(gltf.scene)

  // Animation
  mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[2])
  action.play()
})
```


### 5. 物理世界 cannon.js
`cannon.js` 3d物理引擎, 官网：https://schteppe.github.io/cannon.js/


#### 5.1 World 物理世界
- new CANNON.World() 建立物理世界
- world.broadphase 设置默认检测碰撞方式
- world.allowSleep 
- world.gravity.set(0, -9.82, 0)
```js
import * as CANNON from 'cannon-es'

// 创建一个重力为-9.82 m²/s 的物理世界
const world = new CANNNON.World()
word.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)
```



#### 5.2 Body 物体
建立物体 new CANNON.Body()
```js
const objectsToUpdate = [] // 存储需要更新的物理对象和对应的three.js对象
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
})
const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  mesh.castShadow = true
  mesh.scale.set(radius, radius, radius)
  mesh.position.copy(position)
  scene.add(mesh)

  // cannon.js body
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0,3,0),
    shape,
    material: defaultMaterial
  })
  body.position.copy(position)
  world.addBody(body)
  objectsToUpdate.push({ mesh, body })
}
```

#### 5.3 地板
```js
// 创建一个质量为0的地板，形状为平面，添加到物理世界
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) 
world.addBody(floorBody)
```


#### 5.4 更新物理世界
```js
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update physics
  world.step(1 / 60, deltaTime, 3)


  // 将cannon.js物体与three.js物体关联起来
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion)
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
```


#### 5.5 移除物体
```js
for(const object of objectsToUpdate) {
  world.removeBody(object.body)
  scene.remove(object.mesh)
}

objectsToUpdate.splice(0, objectsToUpdate.length)
```
-





### 其他常见画面
- particles 粒子， 17-particles-final
- galaxy 星系, 18-galaxy-generator-final
- scroll 滚动效果 19-scroll-based-animation-final
- *Axes-helper 坐标辅助线*


### 参考资料
- [B站 Three.js Jounery]()
- [B站 进华 three.js教程-从入门到入门]()