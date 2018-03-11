---
layout: post
title: JavaScript笔试面试题
description: 
category: blog
---


**2.JavaScript的数据类型都有什么？**
基本数据类型：String,boolean,Number,Undefined, Null
引用数据类型：Object(Array,Date,RegExp,Function)
那么问题来了，如何判断某变量是否为数组数据类型？
方法一.判断其是否具有“数组性质”，如slice()方法。可自己给该变量定义slice方法，故有时会失效
方法二.obj instanceof Array 在某些IE版本中不正确
方法三.方法一二皆有漏洞，在ECMA Script5中定义了新方法Array.isArray(), 保证其兼容性，最好的方法如下：

  
      if(typeof Array.isArray==="undefined")  {          
            Array.isArray = function(arg){
          return Object.prototype.toString.call(arg)==="[object Array]"
      };  
    

**5.设置一个已知ID的DIV的html内容为xxxx，字体颜色设置为黑色(不使用第三方框架)**

        var dom = document.getElementById(“ID”);
        dom.innerHTML = “xxxx”
        dom.style.color = “#000”      

**6.当一个DOM节点被点击时候，我们希望能够执行一个函数，应该怎么做？**
 
直接在DOM里绑定事件：```<div onclick=”test()”></div>```
 在JS里通过onclick绑定：```xxx.onclick = test```
 通过事件添加进行绑定：```xxx.addEventListener(‘click’, test)```

那么问题来了，Javascript的事件流模型都有什么？
“事件冒泡”：事件开始由最具体的元素接受，然后逐级向上传播
“事件捕捉”：事件由最不具体的节点先接收，然后逐级向下，一直到最具体的
“DOM事件流”：三个阶段：事件捕捉，目标阶段，事件冒泡


**7.什么是Ajax和JSON，它们的优缺点。**
Ajax是异步JavaScript和XML，用于在Web页面中实现异步数据交互。
优点：
　可以使得页面不重载全部内容的情况下加载局部内容，降低数据传输量
　避免用户不断刷新或者跳转页面，提高用户体验

缺点：
　对搜索引擎不友好（
　要实现ajax下的前后退功能成本较大
　可能造成请求数的增加
　跨域问题限制

JSON是一种轻量级的数据交换格式，ECMA的一个子集
优点：轻量级、易于人的阅读和编写，便于机器（JavaScript）解析，支持复合数据类型（数组、对象、字符串、数字）


**12.已知数组var stringArray = [“This”, “is”, “Baidu”, “Campus”]，Alert出”This is Baidu Campus”。**
答案：alert(stringArray.join(“”))
已知有字符串foo=”get-element-by-id”,写一个function将其转化成驼峰表示法”getElementById”。

          function combo(msg){
          var arr=msg.split("-");
          for(var i=1;i<arr.length;i++){
             arr[i]=arr[i].charAt(0).toUpperCase()+arr[i].substr(1,arr[i].length-1);
          }
          msg=arr.join("");
          return msg;
          }    

**14.输出今天的日期，以YYYY-MM-DD的方式，比如今天是2014年9月26日，则输出2014-09-26**

        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        month = month<10?'0'+month:month;
        var date = d.getDate();
        date = date<10?'0'+date:date;
        console.log(year + '-' + month + '-' + date);

**17.foo = foo||bar ，这行代码是什么意思？为什么要这样写？**
答案：if(!foo) foo = bar; //如果foo存在，值不变，否则把bar的值赋给foo。
短路表达式：作为”&&”和”||”操作符的操作数表达式，这些表达式在进行求值时，只要最终的结果已经可以确定是真或假，求值过程便告终止，这称之为短路求值。

26.Javascript中callee和caller的作用？
答案：
caller是返回一个对函数的引用，该函数调用了当前函数；
callee是返回正在被执行的function函数，也就是所指定的function对象的正文。
**那么问题来了？**如果一对兔子每月生一对兔子；一对新生兔，从第二个月起就开始生兔子；假定每对兔子都是一雌一雄，试问一对兔子，第n个月能繁殖成多少对兔子？（使用callee完成）
          
    var result=[];
    function fn(n){  
    //典型的斐波那契数列
       if(n==1){
            return 1;
       }else if(n==2){
               return 1;
       }else{
        if(result[n]){
                return result[n];
        }else{
                
    //argument.callee()表示fn()
                result[n]=arguments.callee(n-1)+arguments.callee(n-2);
                return result[n];
        }
      }
    }
[来源](http://blog.jobbole.com/78738/)