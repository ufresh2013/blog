---
title: Unity 仿星露谷
date: 2024-12-30 15:39:26
categories: 动画/3D
---

### 资源
- 素材：https://itch.io/  https://shubibubi.itch.io/cozy-farm
- 课程资料：https://www.sikiedu.com/course/1789?ff=b_siki
- 教学视频：https://www.bilibili.com/video/BV1TC4y1B7VZ?spm_id_from=333.788.player.switch&vd_source=2afb712305742eec14a61ccd3d5b51c9&p=9
- unity版本: 2023.0

### 项目目录
- Assets
  - Prefabs
  - Scenes
  - Sprites
    - Palettes
  - Animations

Scene
- Main Camera: size可以改变视野大小
- Player
- Grid - Tilemap

<br/>

### 1. 角色移动
1. 导入资源
将 char1.png(资源是已经切好片的) 放入 Sprites 文件夹 - Pixels Per Unit: 16 - Filter Mode: Point - Compression: None
2. 角色移动
添加Player到场景中 - 添加并绑定绑定Player.cs 
3. 添加动画
将资源 char1_0 至 char1_7 全选，拖到Player上，会自动创建一个动画动态机, 保存为 Player_Walk_Down.anim 到 Animations 文件夹（上下左右移动的动画都创建上）
4. 动画状态机: 
  - Animations 文件夹下会自动生成一个 Player.controller，双击进入这个文件
  - 创建一个空状态: create state - empty 为 EmptyState，右击设置为默认状态 Set as Layer Default State 
  - 创建一个混合动画: 根据参数值确定播放哪个动画
    - create state: Blend Tree 为 Walk , 双击Walk进入编辑状态，BlenType 选 2D Simple Directional 
    - Parameters: 添加2个float参数为 horizontal 和 vertical, Inspector里的Parameters也设置上
    - Motion: 添加4个Motion Field - 将Animation的动画拖进Motion
      Player_Walk_Down: 0 -1 1
      Player_Walk_Left: -1 0 1
      Player_Walk_Right: 1 0 1
      Player_Walk_Up: 0 1 1
  - 状态切换
    - 回到Base Layer，Make Transition 让 EmptyState 和 Walk 两个状态相互可切换。Parameters添加boolean值 isWalking
    - 点击中间的连线: 添加condition设置isWalking值。设置Settings - Transition Duration(s): 0; Has Exit Time: false
  - 增加代码控制
    ```js
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class Player : MonoBehaviour
    {
        public float speed = 3; 
        private Animator anim;
        private void Awake()
        {
            anim = GetComponent<Animator>();
        }

        void Update()
        {
            float x = Input.GetAxisRaw("Horizontal");
            float y = Input.GetAxisRaw("Vertical");
            Vector2 direction = new Vector2(x, y);

            // 动画
            if (direction.magnitude > 0) {
                anim.SetBool("isWalking", true);
                anim.SetFloat("horizontal", x);
                anim.SetFloat("vertical", y);
            } else {
                anim.SetBool("isWalking", false);
            }
            
            // 位移
            transform.Translate(direction * speed * Time.deltaTime);
        }
    }
    ```
5. 改变静止状态下朝向问题
  - 打开Animation面板，选中场景中的Player -  create new clip: Player_Idle_Down - 将Char1_0图片拖到0帧处（上下左右朝向的动画都创建上）
  - 创建混合树
    - create state: Blend Tree 为 Idol , 双击Idol进入编辑状态，BlenType 选 2D Simple Directional 
    - Parameters 为 horizontal 和 vertical
    - Motion: 添加4个Motion Field - 将Animation的动画拖进Motion
      Player_Idol_Down: 0 -1 1
      Player_Idol_Left: -1 0 1
      Player_Idol_Right: 1 0 1
      Player_Idol_Up: 0 1 1
  - 删除emptyState, 替换为Idol为默认状态，重新设置连线的condition

<br/>

### 2. 瓦片地图
1. 导入资源
  - 将 tiles.png(每个贴图都是16 * 16px的大小) 放入 Assets/Sprites, Pixels Per Unit:16, Filter Mode: Point, Compression: None
  - 更改切图方式: Open Sprite Editor - Slice: Group By Cell Size 16 * 16 - 点击slice
2. 添加地图 + 调色板
  - 创建瓦片地图：create 2D Object - TileMap - Rectangile（页面会多了很多小格子，每个都是 1m * 1m的大小）
  - 创建瓦片地图调色板：Window - 2D - Tile Palette，Create New Tile Pattle: Ground 保存在Assets/Sprites/Palettes，将整个tiles.png拖入调色板，保存到 Assets/Sprites/Palettes
  - 调色板绘制地图工具：铅笔-选中色块绘制到地图上，块复制，填充，选取色块
  - 地图层级分类
    点击场景中的Player, Sorting Layer - Add Sorting Layer, 把下面的这几层添加上
    - Layer1: Env_Background: 背景
    - Env_Ground_Bottom：地面底层
    - Env_Ground_Top：地面顶层
    - Env_Building：放置建筑物
    - Interactable: 可以交互的瓦片地图，种植
    - Game: 主角，npc

    在Grid下创建4个瓦片地图，分别对应层级Background, Env_Ground_Bottom, Env_Ground_Top,Interactable

3. 绘制地图
  - Env_Background: 绘制纯绿色草地
  - Env_Ground_Bottom：绘制悬崖地形
  - Env_Ground_Top：地面顶层
  - Env_Building：放置建筑物
    - 导入buildings.png，放置房子House, 给House Add Component - Physics 2D - Polygon Collider - 点击Edit Collider编辑多边形碰撞器每个点的位置
    - 增加Player和House的碰撞检测：给Player设置刚体 - Add Component - Righdbody 2D - Gravity Scale: 0 - Constraints - Freeze Rotation-Z: 勾选（碰撞时不会被改变朝向）; 给Player添加Box Collider
  - Interactable: 可以交互的瓦片地图，种植
  - Game: 主角，npc

<br/>



### 3. 背包物品
#### 3.1 种子拾起
1. 导入资源：导入 crops_all.png - 编辑Grid By Cell Size 16 * 16 Slice - Pixels Per Unit: 32
2. 种子预制件：将萝卜种子图片放入场景为Seed_Carrot，将它拖入Assets/Prefabs，会自动变成Prefab。添加Box Collider 2D, Is Trigger: true；添加标签Tag: Pickable
  ```c#
  // Player.cs
  // 种子拾起
  private void OnTriggerEnter2D(Collider2D collision)
  {
      if (collision.tag == "Pickable")
      {
          Destroy(collision.gameObject);
      }
  }
  ```


#### 3.2 背包保存物品
1. 创建数据的三个类
  - InventoryData 仓库信息 `List<SlotData>`
  - SlotData 物品信息包含 ItemData, count
  - ItemData 物品信息类
    - itemType
    - itemSprite
    - itemPrefab
    - maxCount
  ```c#
  // InventoryData.cs
  using System.Collections;
  using System.Collections.Generic;
  using UnityEngine;

  [CreateAssetMenu()]
  public class InventoryData : ScriptableObject
  {
      public List<SlotData> slotList;
  }


  // SlotData.cs
  using System;
  using System.Collections;
  using System.Collections.Generic;
  using UnityEngine;

  [Serializable]
  public class SlotData
  {
      public ItemData item;
      public int count = 0;
  }



  // ItemData.csusing System.Collections;
  using System.Collections.Generic;
  using UnityEngine;

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
      public ItemType type= ItemType.None;
      public Sprite sprite;
      public GameObject prefab;
      public int maxCount = 1;
  }
  ```

2. 创建Resources用来保存数据
  - 创建Assets/Resources/Data文件夹，在Data文件夹里
  - create ItemData: Seed_Carrot, Seed_Tomato 设置好参数
  - create InventoryData: Backpack 用来管理背包的物品信息

3. 物品管理逻辑 
场景中create empty，挂载Assets/Scripts/Manager/InventoryMananger.cs，用来初始化物品字段、背包数据，处理物品拾取逻辑

4. 绘制背包
- 场景中 create UI Panel, 设置Canvas - UI Scale Mode: Scale With Screen Size - Reference Resolution: 1920 * 1080 
- 设置Panel: BackpackUI，移除Image组件，在BackpackUI下添加背包素材 create Image: Bg_Frame, Bg_Right, Bg_Left 调整大小
- 添加物品网格栏: create empty - add component - Grid Layout Group: SlotGrid - 在它下面添加24个网格照片的Prefab: SlotUI，调整Cell Size和Spacing。在SlotUI下添加Image和Text(这里需要引入TMP资源)，物品照片和物品数量。添加关闭按钮Button组件
- 给BackpackUI添加脚本Assets/UI.cs，控制显示隐藏 & 数据显示
```c#

```