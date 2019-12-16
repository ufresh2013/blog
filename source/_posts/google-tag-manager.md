---
title: Google-tag-manager设置
date: 2018-08-16 17:49:23
category: 其他
---

### 1. 登录
进入[Google tag官网](https://marketingplatform.google.com/about/tag-manager/)
<br/>

### 2. 新建容器
一个账号可拥有多个容器，一个容器放一个广告，页面左上角可切换容器。
- 进入跟踪代码 管理tab
- 点击右上角 + 创建容器
- 设置容器名称和容器使用位置
<br/>


### 3. 新建代码
页面添加`<div id="vip"></div>`，代码类型选择*自定义HTML*，通过js设置#vip的innerHTML
```
<style>
.my-theme-vip{
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  background: #e2f1ff;
  color: #4788C7;
  padding: 0 25px;
  position: relative;
}
.my-theme-vip a{
  display: inline-block;
  width: auto;
  padding: 0 20px;
  font-size: 14px;
  letter-spacing: 0.3px;
  height: 38px;
  line-height: 38px;
  border-radius: 3px;
  cursor: pointer;
  background: #fff;
  color: #4788C7;
  border: 1px solid $blue;
  position: absolute;
  right: 25px;
  top: 11px;
  text-decoration: none;
}
.my-theme-vip a:hover{
  background: #f7fbfe;
  color: #4788C7;
  text-decoration: none;
}
</style>
<script>
document.getElementById('vip').innerHTML= '<div class="my-theme-vip">一个学分的价格， 学习完整的MBA课程<a class="my-theme-vip-enter" href="/vip/card">加入会员</a></div>'
</script>
```
- 设置触发器: All Pages 网页浏览
<br/>


### 4. 提交发布
- 安装Google跟踪管理器: 将代码复制到你的网站上。
  关闭调试url上添加`&gtm_debug=`
  修改`f=document.getElmentById('vip')`,`f.appendChild(j,f)`
```
<div id="vip"></div>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementById('vip'),
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl+'&gtm_debug=';f.appendChild(j,f);
		})(window,document,'script','dataLayer','GTM-TGWQQRB');</script>
```

- 提交: 填写版本名称，版本说明
- 预览
- 发布
{% raw %}
<div id="vip"></div>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementById('vip'),
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl+'&gtm_debug=';f.appendChild(j,f);
})(window,document,'script','dataLayer','GTM-TGWQQRB');</script>
<!-- End Google Tag Manager -->
{% endraw %}
<br/>

### 参考资料
- [GA小站](https://www.ichdata.com/google-tag-manager-series.html)
- [Google tag manager官网](https://marketingplatform.google.com/about/tag-manager/)