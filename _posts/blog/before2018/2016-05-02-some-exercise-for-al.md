---
layout: post
title: 算法题目
description:
category: blog
---

### 16-04-14-T-01

> 两数之和：
 给定一个整型数组，是否可以找出使其和为某个特定值(不能使用额外的数组等)？

*分析： 对所给条件分析有一个问题。所给数组是否为有序数组(这回影响到解题)？，假如从较难的角度来考虑，所给数组是无序的。*

*方法一： 复杂度为O(n<sup>2</sup>)的两个for循环，这个显然不是面试官期待的答案。*

*方法二： 分析排好序的数组可以做出怎样的处理， 给定两个首尾指针，通过向中间移动指针，当指针找到所求值或者相遇即结束。*

Python 实现方法一O(n<sup>2</sup>)(方法均通过所给的测试用例)

```
# -*- coding: utf-8 -*-
# 16-04-14-T-01
def find(value, a_list):
    """
    TestCase for find
    >>> find(26, [12,14])
    True
    >>> find(40, [14, 15, 16, 4, 6, 5])
    False
    >>> find(1, [1])
    False
    >>> find(1, [])
    False
    """
    for i in range(len(a_list))[:-1]:
        for j in range(i+1, len(a_list)):
            if a_list[i] + a_list[j] == value:
                return True
    return False

if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
```

Python 实现方法二O(nlogn)

```
def find(value, a_list):
    a_list = sorted(a_list)
    l = len(a_list)
    if a_list is None or l < 2:
        return False
    first_index = 0
    last_index = l - 1
    while first_index < last_index:
        if a_list[first_index] + a_list[last_index] == value:
            return True
        elif a_list[first_index] + a_list[last_index] < value:
            first_index += 1
        else:
            last_index += 1
    return False
```
### 16-04-14-T-02
> 两数之和续：
给定一个整型数组，是否能找出两个数使其和为指定的某个值？注：整型数组中不存在相同的数，可以使用额外的数组等，求时间复杂度为O(n)的算法。

*分析：使用<value, index>哈希表（字典），因为哈希表的查找哈希值的时间复杂度为O(1)。*

```
# -*- coding: utf-8 -*-
def find(value, a_list):
    # 现将列表变为<value, index>字典
    if a_list is None or len(a_list) < 2:
        return False
    d = {}
    for i in range(len(a_list)):
        d[a_list[i]] = i
    # 第二次遍历
    for i in a_list:
        # 排除自己本身
        if(value-i in d and value != 2*i):
            return True
    return False
if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
```

> 两数之和三：
给定一个整型数组，是否能找出两个数使其和为指定的某个值？注：整型数组中可能存在相同的数，可以使用额外的数组等，求时间复杂度为O(n)的算法。

*分析： 加上记录数字出现次数的字典和对两个相同数字的处理*

```
# -*- coding: utf-8 -*-
def find(value, a_list):
    # 现将列表变为<value, index>字典
    if a_list is None or len(a_list) < 2:
        return False
    d = {}
    for i in range(len(a_list)):
        if d.has_key(a_list[i]):
            d[a_list[i]] = d[a_list[i]] + 1
        else:
            d[a_list[i]] = 1
    # 第二次遍历
    for i in a_list:
        if d.has_key(value-i):
        # 排除自己本身
            x = value == i*2
            if(not (x and d[i] == 1)):
                return True
    return False
if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
```

>数组旋转 ：返回将一维数组向右旋转k个位置的结果。比如，一维数组{1,2,3,4,5}，k=2时，返回结果{4,5,1,2,3}。要求常数级空间复杂度，允许修改原有数组。

*因为题目要求使用常数级的空间复杂度，考虑使用一个临时变量，一个一个旋转； 也可以观察一下规律利用三次reserve操作， 第一次将全部reserve， 然后的两次分别将前k个和以后的的reserve即可。*

方法一： 一个一个旋转O(k*n)

```py
# -*- coding:utf-8 -*-
def xuan_zhuang(step, a_list):
    """
    TestCase for xuan_zhuang
    >>> xuan_zhuang(1, [1,2,3,4,5])
    [5, 1, 2, 3, 4]
    >>> xuan_zhuang(2, [1,2,3,4,5])
    [4, 5, 1, 2, 3]
    """
    l = len(a_list)
    while step:
        temp = a_list[l-1]
        for i in range(1, l)[::-1]:
            a_list[i] = a_list[i-1]
        a_list[0] = temp
        step -= 1
    return a_list

if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)

```

方法二： 降低复杂度O(n)

```py
# -*- coding:utf-8 -*-
def xuan_zhuang(step, a_list):
    """
    TestCase for xuan_zhuang
    >>> xuan_zhuang(1, [1,2,3,4,5])
    [5, 1, 2, 3, 4]
    >>> xuan_zhuang(2, [1,2,3,4,5])
    [4, 5, 1, 2, 3]
    >>> xuan_zhuang(7, [1,2,3,4,5])
    [4, 5, 1, 2, 3]
    """
    step %= len(a_list)
    res(a_list, 0, len(a_list)-1)
    res(a_list, 0, step-1)
    res(a_list, step, len(a_list)-1)
    return a_list
def res(a_list, start, end):
    """
    辅助函数， 反向
    题目的要求是常数级空间复杂度， 要自己写res()
    """
    if len(a_list)<2 or start >= end:
        return
    middle = (start + end + 1) / 2
    for i in range(start, middle):
        temp = a_list[i]
        a_list[i] = a_list[end-(i-start)]
        a_list[end-(i-start)] = temp

def res2(a_list, start, end):
    """
    version_2 of res, 反转数组
    >>> res2([1,2,3,4,5,6,7,8,9,10], 0, 9)
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    >>> res2([1,2], 0, 1)
    [2, 1]
    >>> res2([1], 0, 0)
    [1]
    """
    if len(a_list) < 2 or start >= end:
        return a_list
    while end-start > 0:
        a_list[start], a_list[end]= a_list[end], a_list[start]
        start += 1
        end -= 1
    return a_list

if __name__ == "__main__":
    import doctest
    doctest.testmod(verbose=True)
```

### 16-04-24-T-01
>Reverse Vowels of a String
** Total Accepted: **2041** Total Submissions: **5427** Difficulty: **Easy**
Write a function that takes a string as input and reverse only the vowels of a string.
**Example 1:**Given s = "hello", return "holle".
**Example 2:**Given s = "leetcode", return "leotcede".

```py
# -*- coding: utf-8 -*-
class Solution(object):
    def reverseVowels(self, s):
        """
        :type s: str
        :rtype: str
        """
        """采用两指针法
        """
        vowels = ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]
        left_index = 0
        right_index = len(s) - 1
        l = list(s)

        while left_index < right_index:
            if s[left_index] in vowels:
                if s[right_index] in vowels:
                    l[left_index], l[right_index] = l[right_index], l[left_index]
                    left_index += 1
                    right_index -= 1
                else:
                    right_index -= 1
            else:
                left_index += 1
        return "".join(l)
```

### 16-04-24-T-02
>Reverse String
  ** Total Accepted: **4928** Total Submissions: **8245** Difficulty: **Easy**
Write a function that takes a string as input and returns the string reversed.
**Example:**Given s = "hello", return "olleh".

Python

```
class Solution(object):
    def reverseString(self, s):
        """
        :type s: str
        :rtype: str
        """
        return "".join(reversed(s))
```

Java

```
public class Solution {
    public String reverseString(String s) {
        StringBuffer sb = new StringBuffer();
        int n = s.length();
        for(int i = n-1;i >= 0;i--){
            sb.append(s.charAt(i));
        }
        return sb.toString();
    }
}
```

###16-04-25-T-01
>343. Integer Break
  ** Total Accepted: **4197** Total Submissions: **10340** Difficulty: **Medium**
Given a positive integer *n*, break it into the sum of **at least** two positive integers and maximize the product of those integers. Return the maximum product you can get.
For example, given *n* = 2, return 1 (2 = 1 + 1); given *n* = 10, return 36 (10 = 3 + 3 + 4).
**Note**: you may assume that *n* is not less than 2.


O(n<sup>2</sup>)

```py
# -*- coding: utf-8 -*-
class Solution(object):
    def integerBreak(self, n):
        """
        :type n: int
        :rtype: int
        """
        dp = [1] * (n+1)
        for i in xrange(1, n+1):
            for j in xrange(1, i+1):
                if i+j <= n:
                    dp[i+j] = max(max(dp[i], i)*max(dp[j], j), dp[i+j])
        return dp[n]
```

### 16-04-25-T-02
>342. Power of Four
  **Total Accepted: **6687** Total Submissions: **19952** Difficulty: **Easy**
Given an integer (signed 32 bits), write a function to check whether it is a power of 4.**Example:**Given num = 16, return true.Given num = 5, return false.
**Follow up**: Could you solve it without loops/recursion?
**Credits:**Special thanks to @yukuairoy  for adding this problem and creating all test cases.

方法一

```py
# -*- coding: utf-8 -*-
class Solution(object):
    def isPowerOfFour(self, num):
        """
        :type num: int
        :rtype: bool
        """
        if num == 1:
            return True
        ans = 1
        while ans < num:
            ans *= 4
            if ans == num:
                return True
        return False
```

方法二：无循环

```
# -*- coding: utf-8 -*-
class Solution(object):
    def isPowerOfFour(self, num):
        """
        1. 转换成二进制只有首位是1是2的幂
        2. 满足1.的前提下， 从右往左数，1处在奇数位
        :param num:
        :return:
        """
        if self.isPowerOfTwo(num):
            s = bin(num)
            return len(s) % 2 != 0
        else:
            return False

    def isPowerOfTwo(self, num):
        return num > 0 and (not (num & (num - 1)))

c = Solution()

print c.isPowerOfFour(-2147483648)
print c.isPowerOfFour(31)
print c.isPowerOfTwo(16)

```
