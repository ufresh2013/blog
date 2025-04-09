---
title: Sass常用命令
date: 2018-11-06 17:57:46
category:
- CSS
---
Sass是一款强化CSS的辅助功能，它在CSS语法上增加了变量，嵌套，混合，导入等功能。 你还可以通过函数进行颜色值与属性值得运算，使用控制指令(control directives)等高级功能。


### 1. 编译sass
--watch 监听
--style 解析后的css是什么排版格式 nested / expanded / compact / compressed(压缩)
```
sass input.scss output.scss
sass --watch input.scss:output.scss
sass --watch app/sass:public/stylesheets
```



### 2. 导入sass
- 导入局部文件
@import 规则规则不需要指明被导入文件的全名，可以省略 .sass 或 .scss 文件后缀。
如果需要导入sass文件，但又不希望将其编译为CSS，只需在文件名前添加下划线，这样会告诉sass不要编译这些文件。导入语句中不需要添加下划线。
```
@import "colors"
```
导入的其实是 _colors.scss

- CSS规则内导入
@import 文件导入到一个CSS规则内
```
// _blue-theme.scss
aside{ background: blue }

// main.scss
.container{ @import "blue-theme" }
.contaienr{
  aside{ background: blue }
}
```


### 3. 变量
- *$*
定义变量，变量支持块级作用域，嵌套规则内定义的变量只能在嵌套规则内使用(局部变量)。将局部变量转换为全局变量可添加`!global`声明。
```
$blue: #4788C7;
$border: 1px solid $blue;
.nav{
  border: $border;
}
```

- *&*
表示父选择器，常用于添加伪类
```
article a {
  &:hover { color: red }
}
```
  跟随后缀生成复合的选择器
  ```
  #main { &-sidebar{ color: red }}
  #main-sidebar{ color: red }
  ```

- *@minxin, @include*
混合器，实现大段样式的重用。
```
@mixin rounded-corners{ border-radius: 5px }
notice{ @include rounded-corners }
```
  混合器传参
  ```
  @mixin link-colors($normal, $hover){
    color: $normal;
    &:hover{ color: $hover };
  }
  a{ @inclue link-color($normal: blue, $hover: red) }
  ```

- *%*
占位符选择器，必须使用@extend指令调用。

- *@extend*
在设计网页时常常会遇到这样的情况：一个元素使用的样式与另一个元素完全相同，但又添加了额外的样式。我们通常会在HTML中给元素定义两个class，一个通用样式，一个特殊样式。如:
```
<div class="error seriousError">Oh! Crash<div>
```
  使用`@extend`将一个选择器下的所有样式继承给另一个选择器。
  ```
  .error{
    color: red;
  }
  .serioutsErro{
    @extend .error;
    border-width: 3px;
  }
  .hoverlink{
    @extend a:hover
  }
  ```



### 4. 其它语法
- *!default*
默认变量值，如果这个变量被声明赋值了，那就用声明的值，否则用这个默认值。(很像!important的对立面)
```
$blue: #4788C7 !default;
```

- *.classA{ @extend .classB }* 
使用选择器继承来精简CSS
```
.error{ background: red }
.seriousError{ @extend .error }
```

- *属性嵌套*
为了便于管理有相同命名空间的属性，sass允许将属性嵌套在命名空间中。
```
a{
  font: {
    size: 14px;
    weight: normal;
  }
}
```


### 5. SassScript
#### 5.1 Interactive Shell
SassScript可作用于任何属性，允许属性使用变量、算数运算等额外功能。在命令行中输入`sass -i`，可以输入想要测试的SassScript查看输出结果。
```
$ sass -i
>> 1px + 1px
2px
```


#### 5.2 变量与运算
- **支持的数据类型**
  数字(10,10px)，字符串，颜色(blue, #fff)，布尔值(true, false)，控制(null)，数组(10px 20px, Arial, sans-serif)，maps(key1: value1, key2: value2)

- **插值语句** 
  用*`#{}`*插值语句将变量包裹
  ```
    $name: foo;
    p.#{name}{
      color:blue;
    }
    font-size: ${$font-size}/${$line-height}
  ```
- **运算**
  `width: 10px/8px`

- **颜色值运算**
```
  #010203 + #040506 = #050709
  #010203 * 2 = #020406
  
  // 必须拥有相同的alpha值才能运算，算术运算不会作用于alpha值
  rgba(255,0,0,0.75) + rgba(0,255,0,0.75) = rgba(255,255,0,0.75) 

  // alpha值可以通过opacity或transparentize两个函数进行调整
  $red: rgba(255,0,0,0.5)
  opacity($red, 0.3)           = rgba(255,0,0,0.5)
  transparentize($red, 0.25)   = rgba(255,0,0,0.25)
```


#### 5.3 @media
@media可以使用SassScript代替条件的名称或值
```
$media: screen;
$feature: max-width;
$value: 576px;
@media #{$media} and ($feature: $value){
  .sidebar{ width: 500px }
}
```


#### 5.4 @if
当@if的表达式返回值不是false或null时，条件成立，输出{}内的代码。
```
$type: monster;
p{
  @if type == ocean{
    color: blue;
  } @else if $type == monster{
    color: green;
  } @else{
    color: black;
  }
}
```


#### 5.5 @for, @each
```
@for $i from 1 through 3{
  .item-#{$i}{
    width: 2em * $i;
  }
}

@each $animal in puma, sea-slug, egret, salamander{
  .#{$animal}-icon{
    background: url('/images/#{$animal}.png')
  }
}

@each $animal, $color, $cursor in (puma, black, default),
                                  (sea-slug, blue, pointer),
                                  (egret, white, move) {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
    border: 2px solid $color;
    cursor: $cursor;
  }
}
```


#### 5.6 @while
```
$i: 6;
@while $i>0{
  .item-#{$i}{ width: 2em * $i}
  $i: $i -2
}
```


#### 5.7 @function
```
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n){
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar{ width: grid-width(5) }
```

#### 6. 其他
#### 6.1 calc在less编译时被计算
`{width: calc(100% - 30px)}`Less会把这个当成运算式去执行，解析成`{width: calc(70%)}`。改变写法:
```
div{ width: calc(~"100% - 30px")}
```