---
title: CANNON.js物理世界
date: 2024-12-02 23:01:12
category: ThreeJS
---
`cannon.js` 3d物理引擎,
- 官网：https://schteppe.github.io/cannon.js/


### 1. World 物理世界
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



### 2. Body 物体
- 建立物体
  - new CANNON.Body()
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

### 3. 地板
```js
// 创建一个质量为0的地板，形状为平面，添加到物理世界
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) 
world.addBody(floorBody)
```


### 4. 更新物理世界
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


### 5. 移除物体
```js
for(const object of objectsToUpdate) {
  world.removeBody(object.body)
  scene.remove(object.mesh)
}

objectsToUpdate.splice(0, objectsToUpdate.length)
```
-