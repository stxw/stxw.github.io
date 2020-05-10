---
title: 'shell教程'
date: 2020-05-10 22:30:26
tags: [linux]
published: true
hideInList: false
feature: 
isTop: false
---
@[TOC]

# 简介
&emsp;&emsp;shell是操作系统内核之外的指令解析器，是一个程序，同时是一种命令语言和程序设计语言。是处于操作人员和操作系统接口之间的一层封装，用于方便操作人员使用计算机。
用途：
1. 用于计算机的启动、常用程序的运行等脚本。
2. 作为配置文件。
3. 处理文本文件。

&emsp;&emsp;常用的shell：sh、bash。

# shell脚本
&emsp;&emsp;将多行命令封装进一个文本文件里，执行一个shell脚本即可执行多个shell命令。
&emsp;&emsp;shell的第一行用于指定脚本解释器的路径，方法是`#!解释器的路径`，比如指定为/bin/sh的代码如下：
```shell
#!/bin/sh
```

## 执行方式
&emsp;&emsp;shell有两种执行方式，第一种是`脚本解释器 shell文件`，第二种是`./shell文件`。使用第二种方式时，要确保shell文件有可执行权限。

## 注释
### 单行注释
&emsp;&emsp;shell脚本里用#来表示单行注释，如果使用第一种方式执行shell，第一行的`#!`也是注释；如果用第二种方式执行shell，第一行的`#!`则不是注释。
```shell
#!/bin/sh

# 这是一个注释
ls -l # 这也是一个注释
```
### 多行注释
1. 方法一
```shell
: '
echo "这是一个注释"
echo "这也是注释"
echo "这还是注释"
'
```
**注意**：注释的开头的`:`和`'`之间有一个空格，不然会报错。

2. 方法二
```shell
:<< 字符
echo "这是一个注释"
echo "这也是注释"
echo "这还是注释"
字符
```
&emsp;&emsp;这里的字符上下两个要相同，否则注释无法结束。


