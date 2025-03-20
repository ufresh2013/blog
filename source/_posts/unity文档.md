---
title: Unity Script
date: 2024-12-30 15:39:26
---

### 1. 重要的类
GameObject：表示可以存在于场景中的对象的类型。
MonoBehaviour：基类，默认情况下，所有 Unity 脚本都派生自该类。
Object：Unity 可以在编辑器中引用的所有对象的基类。
Transform：提供多种方式来通过脚本处理游戏对象的位置、旋转和缩放，以及与父和子游戏对象的层级关系。
Vectors：用于表达和操作 2D、3D 和 4D 点、线和方向的类。
Quaternion：表示绝对或相对旋转的类，并提供创建和操作它们的方法。
ScriptableObject：可用于保存大量数据的数据容器。
Time（以及帧率管理）：Time 类用于测量和控制时间，并管理项目的帧率。
Mathf：一组常见的数学函数，包括三角函数、对数函数以及游戏和应用开发中常用的其他函数。
Random：提供简便的方法来生成各种常用类型的随机值。
Debug：用于可视化编辑器中的信息，这些信息可以帮助您了解或调查项目运行时发生的情况。
Gizmos 和 Handles：用于在 Scene 视图和 Game 视图绘制线条和形状以及交互式手柄和控件。


#### 1.1 MonoBehaviour
基类，默认情况下，所有 Unity 脚本都派生自该类。为了连接到 Unity 的内部架构，你创建的类需要继承`MonoBehaviour`用于添加到到游戏对象的上。
- 创建一个在Inspector里可编辑的字段：定义一个`public`变量
- 隐藏在Inspector里显示，添加`[HideInInspectors]`
```c#
using UnityEngine;
using System.Collections;

public class MainPlayer : MonoBehaviour 
{
  // 创建一个在Inspector里可编辑的字段
  public string myName;
  
  void Start () 
  {
      Debug.Log("I am alive and my name is " + myName);
  }
}
```
- 生命周期函数
([更多事件函数: 动画更新循环，Rendering, 帧之间， Editor操作](https://docs.unity.cn/cn/current/Manual/ExecutionOrder.html))
  - 加载
    - Awake: 在任何 Start 函数之前并在实例化预制件之后调用
    - OnEnable: 在启用对象后立即调用
    - Start: 仅当启用脚本实例后，才会在第一次帧更新之前调用 Start
  - 更新
    - FixedUpdate: 在每次物理更新之前都会调用一个称为 FixedUpdate 的单独事件函数
    - Update: 每帧调用一次 Update
    - LateUpdate: 每帧调用一次 LateUpdate
  - 销毁
    - OnDestroy: 对象存在的最后一帧完成所有帧更新之后
    - OnApplicationQuit: 在退出应用程序之前在所有游戏对象上调用此函数 
    - OnDisable: 行为被禁用或处于非活动状态时



<br/>

#### 1.2 GameObject
用于表示任何可以存在于场景中的事物
属性
- `gameObject.tag`
- `gameObject.transform`
- `gameObject.transform.position = new Vector3(1,1,0)`
- `gameObject.enabled`
- `gameObject.layer`

方法
- `gameObject.GetComponent<Animator>()`获取附加在游戏对象上类型为Type的组件
- `gameObject.GetComponentInChildren<Image>()`深度首次搜索返回 GameObject 或其任何子项中类型为 type 的组件
- `gameObject.AddComponent(SphereCollider)`将组件添加到该游戏对象上
- `gameObject.setActive(bool)`激活/停用

静态方法
- `GameObject.Find("MainHeroCharacter")`按name查找GameObject
- `GameObject.FindWithTag("Chef")`返回一个tag为 Chef 的活动 GameObject。如果未找到 GameObject，则返回 null。
- `GameObject.FindGameObjectsWithTag("Stove")`返回标签为 Stove 的活动 GameObjects 的数组

静态函数
- `Instantiate(prefab, position, rotation, parent)` 实例化预制件
- `Destory(gameObject)`移除

```c#
// 获取外部游戏对象
public GameObject House;

// 获取 & 销毁
private void OnTriggerEnter2D(Collider2D collision)
{
  Destroy(collision.gameObject);
  Destroy(this)
}
```



#### 1.3 Vector
Vector2、Vector3 和 Vector4 类来处理 2D、3D 和 4D 矢量
```c#
var heading = target.position - player.position;
var distance = heading.magnitude; // 向量长度
var direction = heading / distance; // 向量归一化
```


#### 1.4 ScriptableObject
`ScriptableObject` 是一个可独立于类实例来保存大量数据的数据容器。`ScriptableObject` 不能附加到游戏对象上。正确的做法是需要将它们保存为项目中的资源。


1. 新增数据
定义数据类型，在Assets - create ItemData, create BackpackData创建数据，并在Inspector面板初始化数据。
```c#
// ItemData.cs
public enum ItemType
{
    None,
    Seed_Carrot,
    Seed_Tomato,
    Hoe
}
[CreateAssetMenu()]
public class ItemData: ScriptableObject
{
    public ItemType type = ItemType.None;
    public Sprite sprite;
    public GameObject prefab;
    public int maxCount = 1;
}

// SlotData.cs
[Serializable]
public class SlotData
{
  public ItemData item;
  public int count = 0;
  public void Add(int num = 1)
  {
    this.count += num;
  }
}

// BackpackData.cs
[CreateAssetMenu()]
public class BackpackData : ScriptableObject
{
    public List<SlotData> slotList;
}
```

2. 获取数据
通过 `Resources.Load` 函数，可访问 Assets 文件夹中处于任意位置的名为“Resources”的文件夹中的所有资源。 可以存在多个“Resources”文件夹，加载对象时，将对每个文件夹进行检查。
```c#
// 获取数据
public BackpackData backpack;
private void Awake()
{
  ItemData[] itemDataArray = Resources.LoadAll<ItemData>("Data");
  backpack = Resources.Load<BackpackData>("Data/Backpack");
}

// 增删数据
public void AddToBackpack(ItemType type)
{
  foreach(SlotData slotData in backpack.slotList)
  {
    if (slotData.item.type == type)
    {
      slotData.Add(); // 此处可以更新UI
      return;
    }
  }
}
```

#### 1.5 transform
```js
transform.Translate(direction * speed * Time.deltaTime); // 位移
```

#### 1.6 Time

#### 1.7 Canvas
EventSystem 是专门为UI服务的
- `EventSystem.current.IsPointerOverGameObject()` 判断鼠标是否在物体上
<br/>


<br/>

### 2. 动画
`Animator`动画
`Animator Controller`动画状态机，负责跟踪当前应该播放哪个剪辑以及动画应该何时改变或混合在一起。
`Animator组件`


### 3. Tilemap

### 4. 事件
#### 4.1 物理事件
物理引擎将通过调用该对象的脚本上的事件函数来报告对象的碰撞情况。 函数。对象的碰撞体配置为触发器（即，碰撞体只检测某物何时进入而不进行物理反应）时，将调用相应的 、 和  函数。
- 碰撞器
  - OnCollisionEnter
  - OnCollisionStay
  - OnCollisionExit
- 触发器
  - OnTriggerEnter
  - OnTriggerStay
  - OnTriggerExit
- Collision参数碰撞体

#### 4.2 点击事件
绑定点击事件的3种方法
- 添加button按钮
- add component: event trigger

#### 4.3 监听鼠标键盘事件
Input.GetAxis 与以下默认轴之一配合使用： “Horizontal”和“Vertical”映射到游戏杆（D、D、D、D 和箭头键）。 “Mouse X”和“Mouse Y”映射到鼠标增量。 “Fire1”、“Fire2”、“Fire3”映射到 Cmd、Cmd、Cmd 键和三个鼠标或游戏杆按钮。 
```c#
private void FixedUpdate() 
{
  float x = Input.GetAxisRaw("Horizontal");
  float y = Input.GetAxisRaw("Vertical");
  direction = new Vector2(x, y); // 上下左右方向
}
```

#### 4.4 拖拽物品
实现拖拽物品，并跟随鼠标移动
`EventSystem.current.IsPointerOverGameObject()` 判断鼠标是否在物体上
```c#
private void Update()
{
  Vector2 position;
  RectTransformUtilty.ScreenPointToLocalPointInRectangle(
    gameObject,
    Input.mousePosition,
    null,
    out position
  );
  gameObject.anchoredPosition = position;
}

```

<br/>

### 6. Attributes
- `[Serializable]`
- `[[CreateAssetMenu(fileName, menuName, order)]`
对 ScriptableObject 派生类型进行标记，使其自动列在 Assets/Create 子菜单中，以便能够轻松创建该类型的实例并将其作为“.asset”文件存储在项目中。
- `[HideInInspector]`使变量不显示在 Inspector 中

Inspector
- `[Header("测试字符串")]`
- `[Space(10)]`




### 7. 动画编辑器

### 参考文档
- [unity文档](https://docs.unity.cn/cn/current/Manual/ExecutionOrder.html)