---
layout: post
title: 翻译： ECMAScript 6 in WebKit
description: Webkit对ES6支持的一篇介绍文章
category: blog
---


### 翻译自[Webkit blog](https://webkit.org/blog/4054/es6-in-webkit/)

> 原作时间：Oct 13, 2015 by Saam Barati @saambarati
翻译时间：Apr 11, 2016



[ES6](http://www.ecma-international.org/ecma-262/6.0/index.html) 为JavaScript带来了许多新的有趣的特性。ES6总结了JavaScript过去的一些缺点，并且加入了一些更易于理解语义的新特性。`let`和`const`就是其中的例子，它们都是块级作用域的声明，所以不易导致像对`var`关键字作用域的错误理解这样的常见错误。ES6同样还包含一些使JavaScript idioms(译注: idioms,俗语)看上去更加自然的特性。举个例子， [箭头函数(arrow functions)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)使得写出一个带有this词法的小函数变得简单了，这是JavaScript程序员经常做的。`class`关键字使得写出在程序中经常出现的面向对象的代码更加容易。[解构语法(Destructuring syntax)](http://www.2ality.com/2015/03/destructuring-algorithm.html)有助于在足够大的JavaScript程序中消除样板式的代码。我们WebKit团队真的为ES6感到激动并且在努力地实现它，在 Safari 9  iOS 9 中你将可以使用一些不错的ES6特性:

   - Classes
   - Promises
   - Map, Set, WeakMap, WeakSet, for…of loops
   - Symbols
   - 和一些其他优秀的特性
   
你可以运行最新的[WebKit nightly build](https://webkit.org/nightly/)去尝试更多的ES6新特性。我们最近实现了：


   - let, const, and class block scoping
   - Much of the Reflect API
   - A large part of the current module specification
   - Tail calls
   - Default parameter values
   - Default destructuring values
   - Arrow functions
   - Some of the internationalization API
   - 更多

如果你对我们的ES6实现感兴趣并且在尝试使用ES6，下载[WebKit nightly build](https://webkit.org/nightly/)。你可以通过向我们报告你发现的bug来帮助我们修复bug。而且，如果你(对，就是你)愿意为Webkit加入一些新的特性又或者是修复一些bug，我很乐意帮你开始第一步。你可以联系我的twitter: [@saambarati](https://twitter.com/saambarati)。你可以总是去打扰[@jonathandavis](https://twitter.com/jonathandavis)，无论是什么问题。

---

### 翻译笔记:

#### 1. 关于块级作用域和函数级作用域的比较

```
{
	let a=10;
    var b=2;
}

a; // ReferenceError: a is not defined
b; //2
```
代码来自[es6标准入门](http://www.ruanyifeng.com/blog/2014/04/ecmascript_6_primer.html)

node在ubuntu上启用支持es6`node --use-strict $(node --v8-options | grep harm | awk '{print $1}' | xargs) file.js`


#### 2. 箭头函数
本文中关于箭头函数的原文是：
>arrow functions make it easy to write small functions that have a lexically bound this;

关于lexically this的解释
> Lexical this

>Until arrow functions, every new function defined its own this value (a new object in case of a constructor, undefined in strict mode function calls, the context object if the function is called as an "object method", etc.). This proved to be annoying with an object-oriented style of programming.

```
function Person() {
  // The Person() constructor defines `this` as an instance of itself.
  this.age = 0;

  setInterval(function growUp() {
    // In non-strict mode, the growUp() function defines `this` 
    // as the global object, which is different from the `this`
    // defined by the Person() constructor.
    this.age++;
  }, 1000);
}

var p = new Person();```

>In ECMAScript 3/5, this issue was fixed by assigning the value in this to a variable that could be closed over.

```
function Person() {
  var self = this; // Some choose `that` instead of `self`. 
                   // Choose one and be consistent.
  self.age = 0;

  setInterval(function growUp() {
    // The callback refers to the `self` variable of which
    // the value is the expected object.
    self.age++;
  }, 1000);
}
```


>Alternatively, a bound function could be created so that the proper this value would be passed to the growUp() function.

>Arrow functions capture the this value of the enclosing context, so the following code works as expected.

```
function Person(){
  this.age = 0;

  setInterval(() => {
    this.age++; // |this| properly refers to the person object
  }, 1000);
}

var p = new Person();
```

### 3. 解构型语法一例

`let [x, y] = ['a', 'b']; // x = 'a'; y = 'b'`