---
layout: post
title: 翻译： React and the economics of dynamic web interfaces
description: React和动态网页的效率 by Nicholas C. Zakas
category: blog
---


原创翻译：React 和动态网页的效率

>Posted at January 26, 2016 by Nicholas C. Zakas
原文：[React and the economics of dynamic web interfaces](https://www.nczonline.net/blog/2016/01/react-and-the-economics-of-dynamic-web-interfaces/)

我从2000年开始从事web开发， 一路上我见证了许多库和框架的兴起与沉寂。Ajax与jQuery几乎同时兴起， 紧接着几年后Backbone时代的来临， 而React则是开始于大约两年前。所有的这些流行的技术给构建动态网页带来了新的实现。jQuery使得浏览器的抽象更加清晰，以及告诉我们CSS选择器的重要性。Backbone为客户端的架构引入的许多新的概念，React使得可以创建UI组件来代替模板(templates)。

有足够多的博客、 讨论、视频录音告诉web开发者React是如何工作的以及它的好处。 大量关于虚拟DOM、嵌入式HTML、JSX里的javascript、组织UI组件，这些都是React里有趣的技术， 然而我认为这些技术还不足以使React如此流行。经过一番调查，我意识到React之所以如此强大是因为它从根本上改变了我们多年来工作的方式(changes an equation)。一个观念上的改变远比实现它的技术要影响深远的多。

##### The economics of dynamic web interfaces

在浏览器中， 从文档对象模型(DOM)出现到被大规模采纳，web开发者就形成了一个共识：DOM是慢的。避免更新DOM的内容，否则你将得到对文档的重绘与回流(repaint and reflow)。总之，动态更新网页确实会有成本， 消耗的成本可以分为以下几点：

1.  性能(Performance) - 重绘与回流会是改变DOM变得缓慢。
2.  效率(Efficiency) - 失去引用的节点可能会造成内存泄露(memory leaks)。
3.  复杂(Complexity) - 对于不同场景，必须正确地分离与重连事件处理器(make sure you're detaching and reattaching event handlers in the correct spots)。

你停下来仔细思考一下，更新DOM的成本是如此之高以至于你需要在获得足够大的回报时更新DOM才有价值`When you stop and look at it this way, the cost of updating the DOM is high enough that the value you get from that cost needs to be sufficiently high to justify the cost. `。或者你可以试着降低更新DOM的，我们尝试几种方法来降低成本：

- 只做出小的修改。大的修改会变慢，坚持小的修改你会快好多。
- 对于大的改变，将DOM节点从文档中分离，做出修改之后将节点放回文档中。这样可以避免重绘和回流。
- 使用较高级别的时间代理监听，这样你就不会意外删除具有重要时间处理器的节点。`Use event delegation to listen for events at a high level so you won't accidentally remove a node that has an important event handler.`

这些方法可以缓解更新DOM时的消耗， 但是并没有在根本上改变那个方程。`Each of these approaches chips away at the cost of updating the DOM but doesn't do anything to fundamentally change the equation.`在这个世界上，你不会希望一条命令会多次重新渲染(re-render)整个页面，这无疑会造成不好的用户体验。这正是React带来的改变。

##### React 改变了这个方程

众所周知， React解决了许多问题。它为你管理事件处理器，确保它们在正确的时间和节点上创建和分离(attached and detached)，高效地创建和销毁DOM结构，使用虚拟DOM有差异的决定修改哪个组件。所有的这些技术改变了过去的方程：更新DOM变快了。


作者注：`(Yes, there is some debate[1] as to whether React is as fast as people claim or not. That's really not important for this discussion, as it's the idea of DOM updates being fast that is important).`

这个方程的改变对我们开发Web应用有着连锁的反应(ripple effect)。当我第一次看到React路由系统时我就认定了这一点。 使用React路由器, 一个基本的前提是URL改变时会被History API的状态拦截， 然后整个视图会被重新渲染. 在使用React之前 你不会考虑动态渲染整个页面, 那样太慢了.确保整个页面的完整性的代价太高了, 而且经常会出现bug.于是我们会坚持只渲染页面中较小的部分。

自从有了React， 你不用犹犹豫豫地渲染整个界面， 因为大多数情况下你不可能会重新渲染所有的页面。你只需要渲染需要渲染的部分。每次渲染的成本会基本保持与需要改变的部分一致， 以至于渲染整个页面和部分不会有太大的差别。它们都是一样的高效操作。