---
layout: post
title: JavaScript 权威指南阅读笔记
description:
category: blog
---

## 词法结构

### 字符集

JavaScript 使用Unicode字符集.

### 大小写区分

JavaScript 区分大小写, 只能用onclick 属性. HTML 不区分, 故可以使用onClick 属性.

### 空格

虽然 JavaScript 会忽略空格, 但请务必认真对待空格的使用, 以提高代码可阅读性和可维护性为首要.

### 标识符

表示变量或者函数名, 以字母、下划线、美元符开始.
基本规则:
- 以已经存在的代码命名为基准
- 个人习惯`变量名使用下划线`、`主要函数使用驼峰`、`工具函数使用下划线`、`Jquery 对象使用美元符开始` my_var MyImportClass my_util $var
- 特殊变量`常量大写`、`模板变量TEM_topic`

注意不要使用保留字作为变量名:

```js
// bad
const superman = {
  default: { clark: 'kent' },
  private: true,
};

// good
const superman = {
  defaults: { clark: 'kent' },
  hidden: true,
};
```
对象属性使用

## 类型、值和变量

### 基本类型和对象类型

基本类型: 直接存取

- 字符串
- 数值
- 布尔类型
- null
- undefined

对象类型: 通过引用

- 数组对象
- 函数对象
- 内置基本对象: Date、正则等

### 对常量使用const、对普通变量使用let代替var

const 和 let都是块级作用域

```js
// const 和 let 只存在于它们被定义的区块内。
{
  let a = 1;
  const b = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
```

使用字面值创建对象

```js
// bad
const item = new Object();
// good
const item = {};
```

### 不直接使用`hasOwnProperty, propertyIsEnumerable, and isPrototypeOf`这些Object.prototype方法

> Why? These methods may be shadowed by properties on the object in question - consider { hasOwnProperty: false } - or, the object may be a null object (Object.create(null)).

```js
// bad
console.log(object.hasOwnProperty(key));

// good
console.log(Object.prototype.hasOwnProperty.call(object, key));

// best
const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.
/* or */
const has = require('has');
…
console.log(has.call(object, key));
```
