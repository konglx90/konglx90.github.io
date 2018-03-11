---
layout: post
title: 斐波那契数列的四种生成方式
description:
category: blog
---



### 简介
>**费波那契数列**（[意大利语](https://zh.wikipedia.org/wiki/%E6%84%8F%E5%A4%A7%E5%88%A9%E8%AF%AD)：Successione di Fibonacci），又译**费波拿契数**、**斐波那契数列**、**费氏数列**、**黄金分割数列**。
在[数学](https://zh.wikipedia.org/wiki/%E6%95%B8%E5%AD%B8)上，**费波那契数列**是以[递归](https://zh.wikipedia.org/wiki/%E9%80%92%E5%BD%92)的方法来定义：
![F_0=0](https://upload.wikimedia.org/math/1/2/2/1221e9d9d36b7a0f2316b6a7a711920b.png)
![F_1=1](https://upload.wikimedia.org/math/5/f/7/5f7ecb7615ac05255f6e6a5012230216.png)
![F_n = F_{n-1}+ F_{n-2}](https://upload.wikimedia.org/math/1/a/4/1a4da05124f61db47a4805b411ff8c3b.png)（n≧2）
用文字来说，就是费波那契数列由0和1开始，之后的费波那契系数就由之前的两数相加。首几个费波那契系数是（[![OEIS](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/OEISicon_light.svg/14px-OEISicon_light.svg.png)](https://zh.wikipedia.org/wiki/OEIS) [A000045](https://oeis.org/A000045)）：
[0](https://zh.wikipedia.org/wiki/0), [1](https://zh.wikipedia.org/wiki/1), [1](https://zh.wikipedia.org/wiki/1), [2](https://zh.wikipedia.org/wiki/2), [3](https://zh.wikipedia.org/wiki/3), [5](https://zh.wikipedia.org/wiki/5), [8](https://zh.wikipedia.org/wiki/8), [13](https://zh.wikipedia.org/wiki/13), [21](https://zh.wikipedia.org/wiki/21), [34](https://zh.wikipedia.org/wiki/34), [55](https://zh.wikipedia.org/wiki/55), [89](https://zh.wikipedia.org/wiki/89), [144](https://zh.wikipedia.org/wiki/144), [233](https://zh.wikipedia.org/wiki/233)……
**特别指出**：[0](https://zh.wikipedia.org/wiki/0)不是第一项，而是第零项。
[来自维基百科](https://zh.wikipedia.org/wiki/%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%91%E6%95%B0%E5%88%97)

### 解法1: 递归法

```py
def fib1(n):
    """递归法， 复杂度高"""
    if n==1 or n==2:
        return 1
    else:
        return fib1(n-1)+fib1(n-2)
```

### 解法2: 迭代法

```py
def fib2(n):
    """迭代法， 复杂度一般"""
    if n==1 or n==2:
        return 1
    first = 1
    second = 1
    temp = 0
    for i in xrange(n-2):
        temp = first + second
        first, second = second, temp
    return temp

fibs = [0, 1]numZS = input('How many Fibonacci numbers do you want? ')
for i in range(numZS-2): fibs.append(fibs[-2] + fibs[-1])
print fibs
```

### 解法3: 通项公式法

```py
def fib3(n):
    """通项法， 复杂度极低， 但在计算机上有精度问题"""
    import math
    sqrt_5 = math.sqrt(5)
    return int(sqrt_5/5.0*(((1+sqrt_5)/2.0)**n-((1-sqrt_5)/2.0)**n))
```

### 解法4: 矩阵乘法

```py
def fib4(n):

    """矩阵乘法， 复杂度低， 无精度问题， Ok"""
    t = [[1, 1], [1, 0]]
    two(n, t)
    return t[0][0]

def two(n, t):
    """计算2维矩阵的辅助函数"""
    if n == 1:
        n = 2
    for i in range(n-2):
        t[0][0], t[0][1], t[1][0], t[1][1] = t[0][0]+t[0][1], t[0][0], t[1][0]+t[1][1], t[1][0]
```
