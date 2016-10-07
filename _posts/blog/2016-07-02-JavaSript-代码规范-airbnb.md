---
layout: post
title: JavaScript 代码规范
description: 
category: blog
---

- [1.0] 对常量使用const、对普通变量使用let代替var

const 和 let都是块级作用域

```
// const 和 let 只存在于它们被定义的区块内。
{
let a = 1;
const b = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
```

###Array

- [2.1] 使用字面值创建数组

```
// bad
const items = new Array();

// good
const items = [];
```

- [2.2] 使用数组的push方法, 而不是直接直接添加

```
const someStack = [];

// bad
someStack[someStack.length] = 'abracadabra';

// good
someStack.push('abracadabra');
```

- [2.3] 使用...复制数组

```
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

### Strings
- [3.1] 使用单引号''代替双引号"", 因为HTML使用双引号

### Function

- [4.1] 使用函数声明而不是函数表达式

> 为什么?因为函数声明是可命名的,所以他们在调用栈中更容易被识别。此外,函数声明会把整个
函数提升(hoisted),而函数表达式只会把函数的引用变量名提升。这条规则使得箭头函数可以
取代函数表达式。

```
// bad
const foo = function () {
};

// good
function foo() {
}
```

- [4.2] 永远不要在一个非函数代码块( if 、 while 等)中声明一个函数,把那个函数赋给一个变量。浏
览器允许你这么做,但它们的解析表现不一致。

- [4.3] 不要使用 arguments 。可以选择 rest 语法 ... 替代

- [4.4] 直接给函数的参数指定默认值,不要使用一个变化的函数参数

```
// really bad
function handleThings(opts) {
  // No! We shouldn't mutate function arguments.
  // Double bad: if opts is falsy it'll be set to an object which may
  // be what you want but it can introduce subtle bugs.
  opts = opts || {};
  // ...
}

// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
  // ...
}

// good
function handleThings(opts = {}) {
  // ...
}
```

### Properties

- [5.1] 使用点操作符获取属性(可读性)

```
const luke = {
  jedi: true,
  age: 28,
};

// bad
const isJedi = luke['jedi'];

// good
const isJedi = luke.jedi;
```

- [5.2] 当通过变量访问属性时使用中括号 [] (可用性)

避免类似`no-name`、`2`等属性
```
const luke = {
  jedi: true,
  age: 28,
};

function getProp(prop) {
  return luke[prop];
}

const isJedi = getProp('jedi');

### Hoisting

[JavaScript Scoping and Hoisting](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)
```

- [6.1] var 声明会被提升至该作用域的顶部,但它们赋值不会提升。 let 和 const 被赋予了一种称为
「暂时性死区(Temporal Dead Zones, TDZ) 」的概念。这对于了解为什么 type of 不再安全相当
重要。

```
// we know this wouldn't work (assuming there
// is no notDefined global variable)
function example() {
  console.log(notDefined); // => throws a ReferenceError
}

// creating a variable declaration after you
// reference the variable will work due to
// variable hoisting. Note: the assignment
// value of `true` is not hoisted.
function example() {
  console.log(declaredButNotAssigned); // => undefined
  var declaredButNotAssigned = true;
}

// the interpreter is hoisting the variable
// declaration to the top of the scope,
// which means our example could be rewritten as:
function example() {
  let declaredButNotAssigned;
  console.log(declaredButNotAssigned); // => undefined
  declaredButNotAssigned = true;
}

// using const and let
function example() {
  console.log(declaredButNotAssigned); // => throws a ReferenceError
  console.log(typeof declaredButNotAssigned); // => throws a ReferenceError
  const declaredButNotAssigned = true;
}
```

- [6.2] 匿名函数表达式的变量名会被提升,但函数内容并不会

```
function example() {
  console.log(anonymous); // => undefined

  anonymous(); // => TypeError anonymous is not a function

  var anonymous = function () {
    console.log('anonymous function expression');
  };
}
```

- [6.3] 命名的函数表达式的变量名会被提升,但函数名和函数函数内容并不会

```
function example() {
  console.log(named); // => undefined

  named(); // => TypeError named is not a function

  superPower(); // => ReferenceError superPower is not defined

  var named = function superPower() {
    console.log('Flying');
  };
}

// the same is true when the function name
// is the same as the variable name.
function example() {
  console.log(named); // => undefined

  named(); // => TypeError named is not a function

  var named = function named() {
    console.log('named');
  }
}
```

- [6.4] 函数声明的名称和函数体都会被提升

```
function example() {
  superPower(); // => Flying

  function superPower() {
    console.log('Flying');
  }
}
```

### Comparison Operators & Equality

- [7.1]  Use === and !== over == and !=

- [7.2] 条件表达式例如 if 语句通过抽象方法 ToBoolean 强制计算它们的表达式并且总是遵守下面的
规则:
	+ Objects evaluate to true
	+ Undefined evaluates to false
	+ Null evaluates to false
	+ Booleans evaluate to the value of the boolean
	+ Numbers evaluate to false if +0, -0, or NaN, otherwise true
	+ Strings evaluate to false if an empty string '', otherwise true

```
if ([0] && []) {
  // true
  // an array (even an empty one) is an object, objects will evaluate to true
}
```

- [7.3] Use shortcuts

```
// bad
if (name !== '') {
  // ...stuff...
}

// good
if (name) {
  // ...stuff...
}

// bad
if (collection.length > 0) {
  // ...stuff...
}

// good
if (collection.length) {
  // ...stuff...
}
```

### Comments

- [8.1] Use /** ... */ for multi-line comments. Include a description, specify types and values for all parameters and return values.

```
// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
function make(tag) {

  // ...stuff...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed in tag name
 *
 * @param {String} tag
 * @return {Element} element
 */
function make(tag) {

  // ...stuff...

  return element;
}
```

- [8.2] Use // FIXME: to annotate problems.

```
class Calculator extends Abacus {
  constructor() {
    super();

    // FIXME: shouldn't use a global here
    total = 0;
  }
}
```

- [8.3] Use // TODO: to annotate solutions to problems.

```
class Calculator extends Abacus {
  constructor() {
    super();

    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

### Type Casting & Coercion

- [9.1] Strings:

```
// => this.reviewScore = 9;

// bad
const totalScore = this.reviewScore + ''; // invokes this.reviewScore.valueOf()

// bad
const totalScore = this.reviewScore.toString(); // isn't guaranteed to return a string

// good
const totalScore = String(this.reviewScore);
```

- [9.2] Numbers: Use Number for type casting and parseInt always with a radix for parsing strings

```
const inputValue = '4';

// bad
const val = new Number(inputValue);

// bad
const val = +inputValue;

// bad
const val = inputValue >> 0;

// bad
const val = parseInt(inputValue);

// good
const val = Number(inputValue);

// good
const val = parseInt(inputValue, 10);
```
