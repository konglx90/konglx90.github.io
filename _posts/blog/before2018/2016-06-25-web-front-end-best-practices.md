---
layout: post
title: web 前端开发最佳实践
description:
category: blog
---

### 什么是前端开发

从职责上讲， 前端的UI到后端的数据交互都属于前端开发范畴。

### 前端技能

>基本的计算机科学知识+HTML+CSS+Javascript+跨平台实践+前端框架+调试工具+Python/PHP/Node

### 规范的前端代码

1. W3C的语言规范、开发中使用的原则和解释引擎行为

2. 格式规范同一

	-  命名：HTML里的id、class 名， JavaScript里的函数和变量名
	- 代码缩进
	- 空格与空行的使用
	- 代码的注释

3. 高性能

	- 网页的加载速度： 后端处理请求时间、代码文件从服务器端传输时间、HTML与CSS组合展现的时间、JavaScript加载和运行时间。
	- 页面的交互响应

4. 高安全性

### 高效Web前端开发

- 前端代码的组织结构： 模块化
- 代码文件的命名

前端代码重构——提高前端代码的可维护性和性能：

- 删除无用代码： 开发时可以注意精简代码和删除无用的代码
- 前端代码规范化： css 独立文件化、调整代码缩进层级、更改不推荐标签(如<center\>、<b\>等)、统一命名规则、js中集中定义局部变量、改全局变量为局部变量
- 整理基础类库、如UI插件的统一
- 前端代码模块化， css和js的模块化
- 提高页面加载性能， 将不影响首页加载的js放到页面加载后加载、删除初始的隐藏区域，改为js动态加载、给静态文件设置缓存、使用css Sprite， 合并压缩css和js代码后发布

Web 前端性能分析： YSlow、PageSpeed

代码和资源的合并与压缩： 合并可以减少http请求，压缩可以减少请求的数据总量： gzip、js、css、图片， 使用gulp等

### 前端代码基本命名规范

- 添加必要的注释
- HTML里 id使用下划线( _ )连接、class使用中划线( - )，如果class名称仅作为
js调用的钩子， 可以在名称前添加js, 如"js-active"
- css 名称取用html里的名称， 如果多个选择器具有同样的样式声明， 每个选择器应该独占一行

```css
h1,
h2 {
	font-size: 12px;
}

```

- [js命名规范](http://www.cnblogs.com/hustskyking/p/javascript-spec.html)

### HTML

禁用脚本时的自动跳转
`<noscript><meta http-equiv="refresh" content="0"; url="/baidu.html?from=noscript"></noscript>`

添加必要的<meta>标签
