---
layout: post
title: 归并排序
description: 归并排序的Python实现
category: blog
---

```py
# -*- coding: utf-8 -*-
from collections import deque

def merge_sort(lst):
    """
    """
    if len(lst) <= 1:
        return lst

    def merge(left, right):
        merged,left,right = deque(),deque(left),deque(right)
        while left and right:
            merged.append(left.popleft() if left[0] <= right[0] else right.popleft())  # deque popleft is also O(1)
        merged.extend(right if right else left)
        return list(merged)

    middle = int(len(lst) // 2)
    left = merge_sort(lst[:middle])
    right = merge_sort(lst[middle:])
    return merge(left, right)


def merge_sort2(lst):
    """
    """
    if len(lst) <= 1:
        return lst

    def merge(left, right):
        x = 0
        y = 0
        z_list = []
        while (len(left)>x and len(right)>y):
            if left[x] > right[y]:
                z_list.append(right[y])
                y += 1
            else:
                z_list.append(left[x])
                x += 1
        if len(left) != x:
            z_list = z_list + left[x-len(left)-1:]
        if len(right) != y:
            z_list = z_list + right[x-len(right)-1:]
        return z_list


    middle = int(len(lst) // 2)
    left = merge_sort2(lst[:middle])
    right = merge_sort2(lst[middle:])
    return merge(left, right)

if __name__ == "__main__":
    print merge_sort([1, 6, 2, 12, 14, 3, 45, 3, 17])
    print merge_sort2([1, 5, 16, 4])

```
