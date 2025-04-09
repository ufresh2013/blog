---
title: 快速开始Edx-H版开发
date: 2019-05-09 13:52:44
category: Work
---
### 1. 前提
要快速入门edx，首先你可以体验一下英荔商学院，
- 阿里云生产服  https://www.elitemba.cn/
- 腾讯云测试服 lms http://www.eliteu.xyz/
- 腾讯云测试服 cms http://studio.eliteu.xyz/


同时还可以
- 通过edx官方文档进一步了解  http://docs.edx.org/
- 其他用edx搭建的网站：http://www.xuetangx.com/ , https://www.edx.org


了解edx H版前，你需要掌握一些基本知识
- Docker https://docs.docker.com/ 
- git    https://git-scm.com/book/zh/v2
- React  https://react.docschina.org/
- Sass   https://www.sass.hk/




### 2. 安装启动
#### 2.1 安装项目
这里假设你已经完成安装，如果没有，[前往安装](https://github.com/edx/devstack)。
拉取公司最新代码，修改配置文件。每个文件夹对应一个git仓库
```shell
└── devstack  
└── ecommerce       # 单课购买        https://github.com/e-ducation/ecommerce
└── edx-membership  # 会员购买        https://github.com/e-ducation/edx-membership
└── edx-platform    
    # lms学习平台, cms创建课程平台      https://github.com/e-ducation/edx-platform
└── eliteu-payments # 微信支付宝支付   https://github.com/e-ducation/eliteu-payments
```





#### 2.1 启动项目
```shell
cd devstack
make dev.up   # 启动项目
```
启动服务后，每个服务都可以在`localhost`的特定端口被访问(`docker ps`查看所有url)
```
Service           URL
E-commerce        http://localhost:18130/dashboard/
LMS               http://localhost:18000/
Studio/CMS        http://localhost:18010/
```
本地环境会自动创建一个超级用户
```
Email: edx@example.com
Username: edx
Password: edx
```
LMS还提供了不同身份的账号
```
Username    Email                   Password
audit	      audit@example.com       edx
honor	      honor@example.com       edx
staff	      staff@example.com       edx
verified	  verified@example.com    edx
```
有了这些url和账号密码，你可以在本地把业务流程都走一遍：
创建课程，使用优惠券购买单课，会员购买，课程学习——习题，讨论，维基，教师面板等



#### 2.2 常用命令
使用`make`命令可以查看所有make命令，下面列举一些常用操作。[更多命令查看](https://github.com/edx/devstack)

- *修改配置文件*
通过`make <service>-shell`进入容器
```shell
# 进入lms容器
make lms-shell

# 进入lms-shell后，你可以修改各种配置文件
/edx/app/edxapp/lms.env.json
/edx/app/edxapp/lms.auth.json
/edx/app/edxapp/cms.env.json
/edx/app/edxapp/cms.auth.json
```



- *查看日志*
```shell
# 查看运行中的容器的日志
make logs

# 查看特定的容器的日志
make lms-logs
make discovery-logs
```

- *编译静态资源*
```shell
# 编译lms静态资源
make lms-static  

# 只编译normal-theme(英荔的主题包)
make lms-shell
paver update_assets --theme-dirs=/edx/app/edxapp/edx-platform/themes --themes=normal-theme

# 自动编译sass文件
make lms-shell
paver watch_assets --td /edx/app/edxapp/edx-platform/themes --t normal-theme

# 如果在执行paver命令时遇到了异常，加上--settings=devstack_docker查看报错信息
paver update_assets --settings=devstack_docker
```

- *更新数据库*
```shell
make lms-shell
paver update_db

# 只更新lms的某个app
# 更新/edx-platform/lms/djangoapps/badges, appname为badges
make lms-shell
source /edx/app/edxapp/edxapp_env
cd /edx/app/edxapp/edx-platform
./manage.py <lms/cms> makemigrations <appname> --settings=devstack_docker
./manage.py <lms/cms> migrate <appname> --settings=devstack_docker
```

- *重启服务*
```shell
# service可取值: discovery, ecommerce, lms, studio
docker-compose restart <service>

# 或者直接使用make命令
make lms-restart
```

- *停止所有服务*
```shell
make stop
```





### 3. 代码修改
前端代码修改主要包括
- 主题样式
根据设计稿，响应式布局，一个页面兼容pc，手机，需考虑中英文两种情况。兼容到IE11

- 浏览器兼容
js不生效，样式兼容

- 翻译修改
翻译未包，修改英文文案

- 新增页面
教授介绍页，membership会员介绍页，会员购买页(微信支付宝)，课程简介html编写等

- 修改功能
①登录账号可输入邮箱，变为可输入手机+邮箱；
②绑定手机
③生成证书图片；
④接入微信sdk实现转发课程详情页显示链接头像，等等

- 协助后端解决bug




### 4. 配置主题
先阅读[官方文档](https://edx.readthedocs.io/projects/edx-installing-configuring-and-running/en/latest/configuration/changing_appearance/theming/index.html)，了解主题包如何创建，修改，配置。

*主题包可以放什么文件 ？*
To override the files that constitute the default Open edX theme, you create replacements for one or more of those files, place them in the file paths that are constructed and named in parallel to the default file locations, configure your Open edX instance to use the files in your theme’s directories instead of the default locations, and then compile the theme.
(EdX first looks for files in your theme directories, and uses any file that matches the exact file path and file name of a default UI file.)
```shell
/edx-platform/lms/static/images
/edx-platform/lms/static/sass
/edx-platform/lms/templates

# 想要覆盖上面的文件，需要在主题包里创建对应的文件
/themes/normal-theme/lms/static
/themes/normal-theme/lms/sass
/themes/normal-theme/lms/templates
```


*添加主题包*
在`/edx-platform/themes`新建一个文件夹`normal-theme`
```
normal-theme
    ├── README.rst
    ├─── lms
    |     ├── static
    |     |      └── images
    |     |      |     └── logo.png
    |     |      |
    |     |      └── sass
    |     |            └── partials
    |     |                   └── base
    |     |                        └── _variables.scss
    |     |
    |     └── templates
    |             └── footer.html
    |             └── header.html
```


*修改配置文件*
```shell
# 进入文件目录
make lms-shell
cd /edx/app/edxapp
LMS	         /edx/app/edxapp/lms.env.json
Studio       /edx/app/edxapp/cms.env.json
E-commerce   /edx/etc/ecommerce.yml

# 修改配置项
"ENABLE_COMPREHENSIVE_THEMING": true,
"COMPREHENSIVE_THEME_DIRS": [
  "/edx/app/edxapp/edx-platform/themes"
],
"THEME_NAME": "normal-theme",

# 重启服务
docker-compose restart lms

# 编译静态资源
make lms-static

# 进入`localhost:18000/admin`,进入Site themes, 添加site themes。保存后，访问0.0.0.0:18000即生效。
Site:
Domain name: 0.0.0.0:18000
Display name: normal-theme
Theme dir name: normal-theme
```



### 5. 主题修改
改edx主题是一件非常痛苦的事件。每改一个地方，需要执行一次编译命令，才能看到效果。快则1分钟，慢则20分钟。同时，edx的模板层层嵌套，同一个className会应用到多个页面，牵一发动全身。加上className又长又乱，css也是没啥章法，`border-box`与`content-box`混用，样式乱加`!important`，很多时候你不得不再强制加一个`!important`去覆盖它。加上本身没有使用任何基础库，因此衍生出很多兼容问题。

- 值得高兴的是，大部分页面都已经完成了样式调整。
- 开发环境走了另一套编译，你无需执行edx的编译命令，就可以看到修改效果。
- 如果有新增的需求，你需要遵循一些设计规范。



#### 5.1 sass编译
先确保安装了[Sass](https://www.sass.hk/install/)
```shell
# edx-platform编译
# 注意，当编译不是主题包里面的sass文件时，依然要走edx的编译命令 make lms-static
cd edx-platform/themes/normal-theme/lms/static/
sass --watch sass:css --no-cache


# edx-membership编译
cd edx-membership/membership/static/membership/
sudo sass --watch sass:css --no-cache
```


edx不同页面引用了不同的css文件，因此产生了很多入口文件，具体见`/edx-platform/lms/static/sass`，里面没有以`_`开头的文件都是一个入口文件。

当你需要新增一个入口文件，应当先将其对应的css文件`/edx-platform/lms/static/css`转换为scss文件，复制到`normal-theme/lsm/static/sass/default`。入口文件，应先引用该文件，代表着先引用了edx原有样式。然后你可以把你的修改放进`normal-theme/lsm/static/sass/modify`文件。

当edx升级版本时，你需要更新`/default`的内容。而你额外的修改将得到保留。当然如果发生了翻天覆地的变动，就另说。
```shell
normal-theme/lsm/static/sass
    ├─── bootstrap
    |     ├── lms-main.scss  # 入口文件
    ├─── default             # edx原有样式
    |     ├── _lms-course.scss
    |     ├── _lms-discussion-bootstrap.scss
    |     ├── _lms-main-v1.scss
    |     ├── _lms-main-v2.scss
    |     ├── _lms-main.scss
    ├─── discussion
    |     ├── lms-discussion-bootstrap.scss  # 入口文件
    ├─── modify
    |     ├── lms
    |     |      └── course            # 课程相关
    |     |      └── footer            
    |     |      └── page              
    |     |      └── _extras.scss      # 集合了header,footer,iconfont,base,alert等共用规则，所有入口文件均可先引用这一文件
    |     |      └── _variables.scss   # 定义sass变量
    ├─── lms-course.scss     # 入口文件
    ├─── lms-main-v1.scss    # 入口文件
    ├─── lms-main-v2.scss    # 入口文件
```



#### 5.2 一些规范
- *适配要求*
pc响应式布局，兼容ipad，手机，兼容IE11
图片资源pc使用二倍图，手机使用三倍图
pc设计稿尺寸1400px\*auto (内容1200px\*auto), 手机设计稿尺寸375px*auto
```css

/* 兼容ipad */
@media screen and (max-width:768px){}

/* 兼容手机，考虑了部分手机横屏的情况 */
@media screen and (max-width:767px){}
```





- *变量*
更多变量查看 `/edx-platform/themes/normal-theme/lms/static/sass/modify/lms/_variables.scss`，设计稿有时不会100%按这个标准，此时应优先使用这些变量。
```css
/* 主色调 */ 
$primary: #4788C7;

/* 字体颜色: 标题，正文，注释，placeholder */ 
$title: #2E313C;
$font: #656D78;
$note: #AAB2BD;
$placeholder: #ccd1d9;
$font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica,Tahoma，Arial, "PingFang SC", "Hiragino Sans GB", 
"Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei",SimHei，sans-serif;

/* border */
$border:#b6dcfe;
$border-gray: #f5f7fa;
$border-radius: 3px;

/* 正文字体统一为14px */
```


- *通用样式*
查看`/edx-platform/themes/normal-theme/lms/static/sass/modify/lms/page/_base.scss`，这个文件定义了button, input, select, `<a>`的样式。开发时应统一使用这些变量。
```sass
@extend %btn-my-primary;
@extend %btn-my-white;
@extend %btn-my-disable;

@extend %input-my;
@extend %input-my-checkbox;
@extend %input-my-radio;
```



- *避免修改外层div的class样式*
edx所有页面均被下面两个`<div>`包裹，注意不要轻易修改、新增这两个className的样式，不然其他页面都会发生变动。
```html
<div class="window-wrap">
  <div class="content-wrapper"></div>
</div>
```
  除了这两个className，页面里面也有很多很多很多共用的className。
  修改sass的时候，应当在外面包一个专属这个页面的className，避免影响到其他页面
  ```css
  /edx-platform/themes/normal-theme/lms/static/sass/modify/lms/page/_login.scss

  /* 只对login-register下的h2生效 */
  .login-register{
    h2{}
  }
  ```



- *替换icon*
icon使用雪碧图替换，具体查看`/edx-platform/themes/normal-theme/lms/static/sass/modify/lms/page/_iconfont.scss`


#### 5.3 替换templates
如果需要修改/templates，需把原来的模板文件复制一份，放到主题下，在其基础上修改。
当模板里需要添加图片需使用
```html
<img src="${static.url("images/logo.svg")} ">
```
Note that the code snippet ${static.url("images/logo.svg")} directs Mako to leverage the comprehensive theming system, which will first check to see if your custom theme contains the file “logo.svg”, and if so, then this is the image file that will be sent to the browser. 

All image files and other “static assets” are pre-processed using an open source utility named Paver that consolidates the files into a caching area located in `/edx/var/edxapp/staticfiles` whereupon each file is individually optimized.





### 6. edx前端技术选型
Edx前端囊括了展示给用户的所有东西，主要包括用Python渲染的views，用js写的页面交互，和css样式。

*Edx相关技术*
- Test: React components can be tested in isolation with unit tests using `Jest` and `Enzyme`.
- ES6
- Babel
- ESLint
- npm
- GreenKeeper
- webpack
- AMD(异步模块定义）
- Sass
- JWT
- Axios
- React and Redux
当构建新UI的时候，应当使用React。但是现在绝大部分没有使用。上次edx年会说，2019年底会完成向react转移。



*一些新React App仓库*
Account页  https://github.com/edx/frontend-app-account
Profile页  https://github.com/edx/frontend-app-profile

- 环境变量通过webpack.config中process.env配置
- 没有发现使用了UI库
- 使用redux,axios,mock
- 卡在了`Access to XMLHttpRequest at ’http://localhost:18000/api/user/v1/accounts/edx' from origin ‘http://localhost:1997’ has been blocked by CORS policy: Request header field use-jwt-cookie is not allowed by Access-Control-Allow-Headers in preflight response.” `
slack回复需更新master分支devstack。
- 一些已经多个react app用到的包
@edx/frontend-auth  统一处理登录
@edx/edx-bootstrap
@edx/frontend-component-footer



*publisher-frontend*
https://github.com/edx/publisher-frontend

```
路由                    对应组件              功能
/courses/new           CreateCourse         新建课程，填写org, title, price,
/courses/:id/rerun     CreateCourseRun
/instructors/new       CreateStaffer        新建Staff,填写name,organization_id, bio, major_works
/instructors/:uuid     EditStaffer
/                      CourseDashboard      列表course name, course number, owner, modified
/courses/:id           EditCourse           编辑课程 title, description, what will you learn, primary subject,course-image, about-video-link
```





### 参考文档
- [edx官方文档](http://docs.edx.org/)
- [edx主题包官方文档](https://edx.readthedocs.io/projects/edx-installing-configuring-and-running/en/latest/configuration/changing_appearance/theming/index.html)
- [安装edx H版](https://github.com/edx/devstack)
- [How To Change the Open edX Logo](https://blog.lawrencemcdaniel.com/how-to-change-the-open-edx-logo/)
- [OEP-11: Front End Technology Standards](https://open-edx-proposals.readthedocs.io/en/latest/oep-0011-bp-FED-technology.html)