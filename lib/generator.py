# -*- coding: utf-8 -*-
"""斐波那契的生成器"""

def fib_print():
    """普通版的斐波那契"""
    a, b = 0, 1
    while True:
        print b
        a, b = b, a+b

def fib_yield():
    a, b = 0, 1
    while True:
        yield b
        a, b = b, a+b

if __name__ == "__main__":
    # fib_print() # 危险
    #for i in fib_yield():
    #    print i
    fib = fib_yield()
    print fib.next()
    print fib.next()
    print fib.next()
