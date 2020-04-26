---
title: shell命令
date: 2019-12-13 17:37:21
---
1. find
find [路径] [选项] [操作]

```s
find ./ -name '*.vue'               # 当前目录
find ant-design-vue -name '*.vue'   # chak    
``` 

选项 
-name 根据文件名查找
-type 按文件类型查找
-maxdepth n 限制最大子目录数