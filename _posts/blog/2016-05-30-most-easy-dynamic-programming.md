---
layout: post
title: 动态规划最简单的两道题
description:
category: blog
---


爬楼梯

```
# -*- coding: utf-8 -*-
def pa(n):
    """
    动态规划: 爬楼梯
    """
    if n == 1 or n==2:
        return n
    sum1 = 1
    sum2 = 1
    for i in range(1, n-1):
        temp = sum2
        sum2 = sum2 + sum1
        sum1 = temp
    print sum2

if __name__ == "__main__":
    pa(3)
    pa(4)
    pa(5)
    pa(6)
    pa(7)
    pa(120)
```

迷宫

```
#-*- coding: utf-8 -*-
def find_place_num(n, m):
    """

    """
    if n==1 or m==1:
        return 1
    else:
        return find_place_num(n-1, m) + find_place_num(n, m-1)


if __name__ == "__main__":
    print find_place_num(1, 1)
    print find_place_num(1, 2)
    print find_place_num(2, 1)
    print find_place_num(2, 2)
    print find_place_num(3, 4)
```