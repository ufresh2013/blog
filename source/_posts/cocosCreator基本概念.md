---
title: CocossCreator Script
date: 2024-12-18 21:48:19
---

### 1. cc类
将装饰器 ccclass 应用在类上时，此类称为 cc 类。cc 类注入了额外的信息以控制 Cocos Creator 对该类对象的序列化、编辑器对该类对象的展示等。

#### 1.1 `property`
属性装饰器 property 可以被应用在 cc 类的属性或访问器上
```js
class MyClass {
  @property(Node)
  targetNode: Node= null;
}
```

#### 1.2 生命周期
onLoad
onEnable
start
update
lateUpdate
onDisable
onDestroy


### 2. 脚本使用
#### 2.1 访问节点
```js
// 获取组件所在节点
start() {
  const node = this.node;
  node.setPosition(0, 0, 0);
}

// 获取同一节点上的其他组件
this.getComponent('OtherNode') // 传入的参数是一个类名

// 获取其他节点，通过property传入
@property(Node)
private payer = null
```


#### 2.2 更改节点
```js
// 激活/关闭节点：被激活的节点，每帧都会执行update方法
this.node.active = boolean

// 更改节点的父节点
this.node.parent = parentNode;
// or
this.node.removeFromParent();
parentNode.addChild(this.node);

// 获取子节点
this.node.children

// 变换节点
this.node.setPosition(1,1,1)
this.node.position = new Vec3(1,1,1)
this.node.setRotation(1,1,1)
this.node.setScale(1,1,1)
```


#### 2.3 创建/销毁节点
- `instantiate` 克隆场景中的已有节点
- `Pretab` 预制件，用于存储一些可以复用的场景对象，它可以包含节点、组件以及组件上的数据。如射击游戏里的子弹
```js
// 创建节点
const node = new Node('box')

// 克隆节点
@property(Prefab)
private bullet: Prefab = null
const node = instantiate(this.bullet)

// 将节点添加到场景
const scene = director.getScene()
scene.addChild(node)

// 销毁节点
node.destory()
```




#### 3. 加载和切换场景
引擎同时只会运行一个场景，当切换场景时，默认会将场景内所有节点和其他实例销毁。如果我们需要用一个组件控制所有场景的加载，或在场景之间传递参数数据，就需要将该组件所在节点标记为「常驻节点」
```js
// 加载场景
director.loadScene("MyScene", () => {});

// 预加载场景
director.preloadScene("MyScene", () => {});

// 设置为常驻场景
director.addPersistRootNode(myNode);

// 取消一个节点的常驻属性
director.removePersistRootNode(myNode);
```


### 4. 资源
当引擎在加载场景时，会先自动加载场景关联到的资源，这些资源如果再关联其它资源，其它也会被先被加载，等加载全部完成后，场景加载才会结束。
Texture2D、SpriteFrame、AnimationClip、Prefab



### 5. 事件
#### 5.1 EventTarget
自定义事件的监听和发射
```js
import { EventTarget } from 'cc';
const eventTarget = new EventTarget();
eventTarget.on(type, func, target?);
eventTarget.emit(type, ...args);
```


### 6. 物理系统
#### 6.1 分组和掩码
- 配置碰撞矩阵：Project - Project Settings - Physics - Add group
- 给碰撞体添加碰撞组件：
Cocos支持三种碰撞组件：盒碰撞组件（BoxCollider2D）、圆形碰撞组件（CircleCollider2D） 和 多边形碰撞组件（PolygonCollider2D）
- 设置碰撞组件分组Group，通过碰撞矩阵设置不同分组碰撞的可能性

#### 6.2 碰撞器 & 触发器
- 碰撞体：用于定义需要进行物理碰撞的物体形状
- 刚体：它可以使游戏对象的运动方式受物理控制
  - `Group`
  - `Type`
    - `STATIC`: 静态刚体在大多数情况下用于一些始终停留在一个地方，不会轻易移动的游戏物体
    - `DYNAMIC`：动力学刚体，可以通过力的作用运动物体
    - `KINEMATIC`：不会像动力学刚体一样响应力和碰撞，通常用于表达电梯这类平台运动的物体。它与静态刚体类似，不同的地方在于移动的运动刚体会对其他对象施加摩擦力，并在接触时唤醒其他刚体。
  - `Is Trigger`: 是否启用触发器模式
    `true`: *触发器*，只用于碰撞检测触发事件
    `false`: *碰撞器*，可以结合刚体产生碰撞效果
  - 触发事件: 可以由触发器和另一个触发器/碰撞器产生。
    - `onTriggerEnter`
    - `onTriggerStay`
    - `onTriggerExit`
    ```js
    // 监听触发事件
    import { BoxCollider, ITriggerEvent } from 'cc'

    public start() {
      const collider = this.node.getComponent(BoxCollider)
      collider.on('onTriggerEnter', this.onTriggerEnter, this)
    }

    private onTriggerEnter(event: ITriggerEvent) {
      console.log(event.type)
    }
    ```
  - 碰撞事件: 碰撞事件需要由两个碰撞器产生，并且至少有一个是动力学刚体。
    - `onCollisionEnter`
    - `onCollisionStay`
    - `onCollisionExit`



### 4. 项目目录
- assets 存放游戏资源
  - library, local, temp 临时生成的文件夹，可删除，删除后cocos会自动生成
  - 
- script 存放脚本


### 参考资料
- [Cocos Creator官网文档](https://docs.cocos.com/creator/3.8/manual/zh/scripting/life-cycle-callbacks.html)