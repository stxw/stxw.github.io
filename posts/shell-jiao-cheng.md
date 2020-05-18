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


# shell命令相关知识
## 别名
&emsp;&emsp;给命令取其他名字，用来简化带参数的命令，比如使用`alias ll='ls -l'`命令来给`ls -l`取一个`ll`的别名，以后就可以用`ll`来代替`ls -l`了。
&emsp;&emsp;如果是在终端输入`alias`命令后取的别名，在终端退出后别名就会失效，下次开启终端后，需要再执行一次`alias`命令才能使用别名。如果想要在每次开启终端后都能使用别名，需要把`alias`命令写入~/.bashrc文件里。

## 模式匹配
&emsp;&emsp;请参考[正则表达式](#正则表达式)。

## 输入输出重定向
&emsp;&emsp;一般在终端运行的命令会将当前终端作为标准输入和标准输出，如果想用一个文件去替换终端，作为该命令的标准输入或标准输出，则需要用到输入输出重定向。
&emsp;&emsp;输入重定向用`< 重定向文件名`表示输入重定向，比如将in.txt文件作为./a.out的输入：
```shell
./a.out < in.txt
```
&emsp;&emsp;输出重定向与输入重定向类似，用`> 重定向文件名`表示，比如将./a.out的输出写入out.txt文件中：
```shell
./a.out > out.txt
```

## 管道
&emsp;&emsp;用`|`表示，即将前一条命令的执行结果，利用管道传给下一条命令，作为下一条命令的输入，比如查看test.cpp文件里所有包含`printf`的行可以使用以下命令：
```sh
cat test.cpp | grep 'printf'
```

## 变量
&emsp;&emsp;变量是一段内存名字。shell变量常用大写英文字符表示。
### 声明
&emsp;&emsp;shell变量可以用`declare`来声明。设定属性的选项：
* -a&emsp;声明下标数组 (如果支持)
* -A&emsp;声明关联数组 (如果支持)
* -i&emsp;声明整型变量
* -r&emsp;声明只读变量
* -n&emsp;声明指向一个以其值为名称的变量的引用
* -x&emsp;声明一个变量，并将变量导出，有关导出的内容会在下文的[环境变量](#环境变量)里解释。
* -t&emsp;声明带有`trace'(追踪)属性的变量
* -l&emsp;将变量在赋值时转为小写
* -u&emsp;将变量在赋值时转为大写

&emsp;&emsp;如果在声明变量时，不指定任何属性，则默认为声明一个字符串类型的变量。
```shell
#声明一个下标数组
declare -a MY_ARRAY

#声明一个整型变量
declare -i MY_INT

#声明一个只读变量，并将其初始化为'123'
declare -r MY_READ_ONLY='123'

#声明一个变量，并将变量导出
declare -x MY_EXPORT

#声明一个字符串变量
declare MY_STRING
```
&emsp;&emsp;其实，字符串类型的变量不用`declare`声明也可以赋值或者使用，相当于一个空字符串。
```shell
xxx@xxx:~$ echo "MY_VAR=${MY_VAR};" #在没有用`declare`声明时，使用'MY_VAR'变量
MY_VAR=;
xxx@xxx:~$ MY_VAR=123 #在没有用`declare`声明时，给'MY_VAR'变量赋值
xxx@xxx:~$ echo "MY_VAR=${MY_VAR};"
MY_VAR=123;
```

### 使用
语法：`$变量名`或`${变量名}`
```shell
echo $VAR
echo ${VAR}
```
&emsp;&emsp;推荐使用加大括号的方式，可以增强代码的可读性。

### 赋值
语法：`变量名=给变量赋的值`
&emsp;&emsp;赋值和初始化时等号两边不要加空格。
&emsp;&emsp;只读变量初始化后不能再赋值了。

### 释放
语法：`unset 变量名`
```shell
xxx@xxx:~$ VAR=123
xxx@xxx:~$ echo "VAR=${VAR};"
VAR=123;
xxx@xxx:~$ unset VAR
xxx@xxx:~$ echo "VAR=${VAR};"
VAR=;
```
&emsp;&emsp;变量VAR在释放之前的值是123，在释放之后是一个空字符串。

### 局部变量(local variable)
&emsp;&emsp;局部变量是用户自定义的变量，`declace`不加`-x`声明的变量都是局部变量。局部变量只在当前shell进程中有效，其父shell进程和其创建的子shell进程都无法使用。

### 环境变量(global variable)
&emsp;&emsp;环境变量也叫全局变量。与局部变量不同，当前shell进程在创建子shell进程时，会将环境变量复制给子shell进程，使其成为子进程的环境变量，而当前shell进程的局部变量不会复制。
&emsp;&emsp;可以用`export`将局部变量导出为环境变量，语法：`export 要导出的局部变量名`。
&emsp;&emsp;下面，用两个例子来说明环境变量和局部变量的区别。假设当前目录下有一个test.sh脚本，里面只有一条`echo`命令，如下：
```shell
echo "VAR=${VAR};"
```
**第一个例子**
&emsp;&emsp;首先在终端中声明一个名称为VAR的局部变量，然后用bash执行test.sh脚本，结果如下：
```shell
xxx@xxx:~$ declare VAR='123'
xxx@xxx:~$ bash ./test.sh
VAR=;
```
&emsp;&emsp;在这个例子中，当前终端可以当做一个shell进程，执行`bash ./test.sh`命令会创建一个子shell进程，然后用创建的子shell进程去解析test.sh里的命令。因为VAR是一个局部变量，所以在创建子shell进程时，不会将VAR变量复制给子shell进程，所以子shell进程执行test.sh后输出的VAR是一个空字符串。

**第二个例子**
&emsp;&emsp;首先在终端中声明一个名称为VAR的局部变量，先将VAR用`export`导出为环境变量，然后再用bash执行test.sh脚本，结果如下：
```shell
xxx@xxx:~$ declare VAR='123'
xxx@xxx:~$ export VAR
xxx@xxx:~$ bash ./test.sh 
VAR=123;
```
&emsp;&emsp;与第一个例子不同的地方是VAR被导出成了环境变量，当前终端在创建子shell进程的时候会将VAR复制，成为子shell进程的环境变量，所以输出的VAR是字符串'123'。

***
&emsp;&emsp;可以用`env`、`export`、`set`命令来查看当前shell进程的环境变量。
&emsp;&emsp;常用的环境变量：
* **HOME**：home目录路径
* **PWD**：当前目录路径
* **LOGNAME**：当前用户用户名
* **PATH**：shell命令的存放路径，每个路径用引号分隔，用于shell寻找命令。


## 后台切换
&emsp;&emsp;在命令后面加一个`&`可以将该命令切换到后台工作，这样不用等待该命令结束就可以执行下一条命令了。
```
./a.out &
ls -l
```
&emsp;&emsp;上面这个例子，假设`./a.out`需要执行10秒，如果不加`&`，则`ls -l`需要等10秒后，也就是`./a.out`执行结束后才能运行，加了`&`就不需要等待`./a.out`结束就能运行`ls -l`了。
&emsp;&emsp;使用这种切换到后台的进程，在终端退出后就会结束，如果想在退出终端后，后台进程任然继续运行，需要用到`nohup`命令。
```
nohup ./a.out &
```
&emsp;&emsp;使用`nohup`命令会将切换到后台的进程的输出写入到当前目录的nohup.out文件里。

## 特殊字符
### 双引号
&emsp;&emsp;双引号用来使shell将空格、制表符和其他大多数特殊字符当做普通字符来处理。举个栗子：
```shell
touch aaa bbb
touch "aaa bbb"
```
&emsp;&emsp;没加双引号时，`aaa`和`bbb`之间的空格表示命令参数分隔符，`touch`命令会创建两个文件“aaa”和“bbb”。
&emsp;&emsp;加了双引号时，`aaa`和`bbb`之间的空格表示普通字符，与a和b的意义相同，`touch`命令只会创建一个文件“aaa bbb”。

### 单引号
&emsp;&emsp;作用与双引号类似，区别是双引号只能将空格、制表符等部分特殊符号当普通字符来处理，而单引号可以作用于所有字符。比如`$`符号(用于引用变量)加了双引号还是特殊字符，加单引号则表示普通字符。
```shell
echo $PATH
echo "$PATH"
echo '$PATH'
```
&emsp;&emsp;上面的三行命令，第一行和第二行的作用相同，都是输出PATH变量，第三行命令只会输出字符串“$PATH”。

### 反引号
&emsp;&emsp;反引号用于使shell将字符串当做命令来处理。举个例子：
```shell
echo ls -l
echo `ls -l`
```
&emsp;&emsp;第一行命令会将字符串“ls -l”输出，第二行命令则会先执行`ls -l`命令，然后用`echo`命令将`ls -l`的执行结果输出。

### 反斜杠
&emsp;&emsp;转义字符，将反斜杠后面的字符当做普通字符来处理。
```shell
touch aaa\ bbb
```
&emsp;&emsp;上面命令里的空格被转义为普通字符，执行命令后会创建一个“aaa bbb”文件。

### 分号
&emsp;&emsp;可以在一行执行多条命令，分号表示一条命令的结束。
```shell
echo "hello world"; ls -la;
```

### 空格、制表符、换行符
&emsp;&emsp;当做空白。

### 其他符号
1. **\*\?\[\]\!**：用于模式匹配,见[正则表达式](#正则表达式)
2. **<>**：用于输入输出重定向，见[输入输出重定向](#输入输出重定向)。
3. **|**：用于使用管道，见[管道](#管道)。
4. **$**：用于引用变量，见[变量](#变量)。
5. **&**：将命令放到后台运行，见[后台切换](#后台切换)。
6. **#**：在shell脚本里表示单行注释，见[单行注释](#单行注释)。
7. **()**：用于创建成组的命令。
8. **{}**：用于创建命令块。
























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
