---
title: 'shell脚本基础知识'
date: 2020-05-10 22:30:26
categories: 学习笔记
tags: [linux,shell]
---

# 简介
## shell
&emsp;&emsp;shell是操作系统内核之外的指令解析器，是一个程序，同时是一种命令语言和程序设计语言。是处于操作人员和操作系统接口之间的一层封装，用于方便操作人员使用计算机。
用途：
1. 用于计算机的启动、常用程序的运行等脚本。
2. 作为配置文件。
3. 处理文本文件。

&emsp;&emsp;常用的shell：sh、bash。

## shell脚本
&emsp;&emsp;将多行命令封装进一个文本文件里，执行一个shell脚本即可执行多个shell命令。
&emsp;&emsp;shell的第一行用于指定脚本解释器的路径，方法是`#!解释器的路径`，比如指定为/bin/sh的代码如下：
```shell
#!/bin/sh
```

# 执行方式
&emsp;&emsp;shell有两种执行方式，第一种是`脚本解释器 shell文件`，第二种是`./shell文件`。使用第二种方式时，要确保shell文件有可执行权限。
```shell
bash ./test.sh  # 第一种方式
./test.sh  # 第二种方式
```

# 注释
## 单行注释
&emsp;&emsp;shell脚本里用#来表示单行注释，如果使用第一种方式执行shell，第一行的`#!`也是注释；如果用第二种方式执行shell，第一行的`#!`则不是注释。
```shell
#!/bin/sh

# 这是一个注释
ls -l # 这也是一个注释
```
## 多行注释
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


# 别名
&emsp;&emsp;给命令取其他名字，用来简化带参数的命令，比如使用`alias ll='ls -l'`命令来给`ls -l`取一个`ll`的别名，以后就可以用`ll`来代替`ls -l`了。
&emsp;&emsp;如果是在终端输入`alias`命令后取的别名，在终端退出后别名就会失效，下次开启终端后，需要再执行一次`alias`命令才能使用别名。如果想要在每次开启终端后都能使用别名，需要把`alias`命令写入~/.bashrc文件里。

# 输入输出
## 输出
&emsp;&emsp;echo命令用于将字符输出到标准输出，语法：`echo [可选项] 要输出的字符串...`，可选项有两个：
* -n ：输出后不换行，默认会换一行。
* -e ：输出前解析转义字符（类似`\n`之类的），默认不解析。

```shell
xxx@xxx:~$ echo 'abc!'   # 输出后会换一行
abc!
xxx@xxx:~$ echo -n 'abc!'   # 输出后不换行
abc!xxx@xxx:~$ 

xxx@xxx:~$ echo 'abc\nabc'  # 不解析转义字符，将\n当做普通字符串输出
abc\nabc
xxx@xxx:~$ echo -e 'abc\nabc'  # 解析转义字符，将\n当做换行符输出
abc
abc
xxx@xxx:~$ 
```

&emsp;&emsp;cat命令用于将文件的内容输出到标准输出，语法：`cat 要输出的文件`。

## 输入
&emsp;&emsp;read命令会从标准输入中读取字符串，保存到变量中，语法：`read 保存输入的变量`。
```shell
xxx@xxx:~$ read VAR
abc   # 输入的字符串
xxx@xxx:~$ echo ${VAR}
abc
xxx@xxx:~$ 
```
&emsp;&emsp;也可以用read命令将读取的字符串保存到多个变量中，语法：`read 变量1 变量2 ...`。read命令读取到空格就换一个变量来保存字符串，读取到回车停止读取。
```shell
xxx@xxx:~$ read VAR1 VAR2
abc 123  # 输入的字符串
xxx@xxx:~$ echo ${VAR1}
abc
xxx@xxx:~$ echo ${VAR2}
123
xxx@xxx:~$ 
```
&emsp;&emsp;用read将输入保存到变量时，如果想将空格当做普通字符保存到变量中，可以在空格前加一个反斜杠来转义。
```shell
xxx@xxx:~$ read VAR1 VAR2
abc\ 123 xyz       
xxx@xxx:~$ echo ${VAR1}
abc 123
xxx@xxx:~$ echo ${VAR2}
xyz
xxx@xxx:~$ 
```
&emsp;&emsp;当用来保存输入的变量是最后一个变量的时候，即使不加反斜杠来转义，也会把空格当做普通字符来处理。
```shell
xxx@xxx:~$ read VAR1 VAR2
abc 123 xyz
xxx@xxx:~$ echo ${VAR1}
abc
xxx@xxx:~$ echo ${VAR2}
123 xyz  # 变量VAR2是最后一个保存输入的变量
xxx@xxx:~$   # 所以“123”和“xyz”之间的空格，即使不加反斜杠，也当做普通字符处理
```
&emsp;&emsp;如果后面的变量还没有用到，read就读取到了换行，那么，没用到的变量会赋值为空字符串。
```shell
xxx@xxx:~$ VAR1=xyz
xxx@xxx:~$ VAR2=123
xxx@xxx:~$ read VAR1 VAR2
abc
xxx@xxx:~$ echo ${VAR1}
abc
xxx@xxx:~$ echo ${VAR2} # 变量VAR2原来是123，现在是空字符串。

xxx@xxx:~$ 
```


## 文件重定向
&emsp;&emsp;一个进程启动时，默认会打开3个文件描述符。
* 0 标准输入　STDIN_FILENO
* 1 标准输出　STDOUT_FILENO
* 2 标准错误　STDERR_FILENO

&emsp;&emsp;一般在终端运行的命令会将当前终端作为标准输入、标准输出和标准错误，如果想用一个文件去替换终端，作为该命令的标准输入、标准输出或者标准错误，则需要用到输入输出重定向。输入输出重定向的语法如下：
* `commad 0<file` ：将file文件作为commad命令的标准输入，0可以省略。
* `commad 1>file` ：将commad命令的标准输出重定向到file文件，会覆盖file文件原来的内容，用`>>`替换`>`就不会覆盖，会将标准输出追加到file文件里。1也可以省略，效果是一样的。
* `commad 2>file` ：将commad命令的标准错误重定向到file文件，覆盖写入，用`>>`表示追加，这里2不可以省略。
* `commad 1>file 2>&1` ：将commad命令的标准输出和标准错误都重定向到file文件，会覆盖file文件原来的内容，用`>>`表示追加，前面的1可以省略。

```shell
./a.out <in.txt    # 将in.txt文件作为./a.out的输入
./a.out >out.txt   # 将./a.out的标准输出重定向到out.txt文件中，覆盖写入
./a.out >>out.txt   # 将./a.out的标准输出重定向到out.txt文件中，追加写入
./a.out 2>out.txt   # 将./a.out的标准错误重定向到out.txt文件中，覆盖写入
```

# 管道
&emsp;&emsp;用`|`表示，即将前一条命令的执行结果，利用管道传给下一条命令，作为下一条命令的输入，比如查看test.cpp文件里所有包含`printf`的行可以使用以下命令：
```sh
cat test.cpp | grep 'printf'
```

# 变量
&emsp;&emsp;变量是一段内存名字。shell里只有字符串和整数两种类型的变量。shell变量常用大写英文字符表示。
## 声明
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

## 使用
语法：`$变量名`或`${变量名}`
```shell
echo ${VAR}
echo ${VAR}
```
&emsp;&emsp;推荐使用加大括号的方式，可以增强代码的可读性。

## 赋值
语法：`变量名=给变量赋的值`
&emsp;&emsp;赋值和初始化时等号两边不要加空格。
&emsp;&emsp;只读变量初始化后不能再赋值了。

## 释放
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

## 局部变量
&emsp;&emsp;局部变量(local variable)是用户自定义的变量，`declace`不加`-x`声明的变量都是局部变量。局部变量只在当前shell进程中有效，其父shell进程和其创建的子shell进程都无法使用。

## 环境变量
&emsp;&emsp;环境变量(global variable)也叫全局变量。与局部变量不同，当前shell进程在创建子shell进程时，会将环境变量复制给子shell进程，使其成为子进程的环境变量，而当前shell进程的局部变量不会复制。
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

## 特殊变量
* **$0**：用于保存的是当前运行的可执行文件的名字。
* **$1~9**：用于保存给shell脚本或者shell脚本里的函数传的参数，一共有9个。
* **$#**：用于保存传的参数个数，\$0不在计数范围内。
* **$\***：以单个字符串的形式保存传的参数，即\$1~9，不包括\$0。
* **$@**：以字符串数组的形式保存传的参数，不包括\$0。
* **$?**：用于保存上一条命令或者函数的返回值，值为0表示正常退出。
* **$$**：当前shell进程的PID。
* **$!**：用于保存上一个放到后台运行的进程的PID，注意，不是前台进程。
* **$-**：显示shell使用的当前选项，与set命令功能相同。(这个没弄懂)

# 后台切换
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

# 特殊字符
## 双引号
&emsp;&emsp;双引号用来使shell将空格、制表符和其他大多数特殊字符当做普通字符来处理。举个栗子：
```shell
touch aaa bbb
touch "aaa bbb"
```
&emsp;&emsp;没加双引号时，`aaa`和`bbb`之间的空格表示命令参数分隔符，`touch`命令会创建两个文件“aaa”和“bbb”。
&emsp;&emsp;加了双引号时，`aaa`和`bbb`之间的空格表示普通字符，与a和b的意义相同，`touch`命令只会创建一个文件“aaa bbb”。

## 单引号
&emsp;&emsp;作用与双引号类似，区别是双引号只能将空格、制表符等部分特殊符号当普通字符来处理，而单引号可以作用于所有字符。比如`$`符号(用于引用变量)加了双引号还是特殊字符，加单引号则表示普通字符。
```shell
echo ${PATH}
echo "${PATH}"
echo '${PATH}'
```
&emsp;&emsp;上面的三行命令，第一行和第二行的作用相同，都是输出PATH变量，第三行命令只会输出字符串“$PATH”。

## 反引号
&emsp;&emsp;反引号用于使shell将字符串当做命令来处理。举个例子：
```shell
echo ls -l
echo `ls -l`
```
&emsp;&emsp;第一行命令会将字符串“ls -l”输出，第二行命令则会先执行`ls -l`命令，然后用`echo`命令将`ls -l`的执行结果输出。

## 反斜杠
&emsp;&emsp;转义字符，将反斜杠后面的字符当做普通字符来处理。
```shell
touch aaa\ bbb
```
&emsp;&emsp;上面命令里的空格被转义为普通字符，执行命令后会创建一个“aaa bbb”文件。

## 分号
&emsp;&emsp;可以在一行执行多条命令，分号表示一条命令的结束。
```shell
echo "hello world"; ls -la;
```

## 空格、制表符、换行符
&emsp;&emsp;当做空白。

## 其他符号
1. **\*\?\[\]\!**：用于模式匹配,见[正则表达式](#正则表达式)
2. **<>**：用于输入输出重定向，见[文件重定向](#文件重定向)。
3. **|**：用于使用管道，见[管道](#管道)。
4. **$**：用于引用变量，见[变量](#变量)。
5. **&**：将命令放到后台运行，见[后台切换](#后台切换)。
6. **#**：在shell脚本里表示单行注释，见[单行注释](#单行注释)。
7. **()**：用于创建成组的命令。
8. **{}**：用于创建命令块。

# 模式匹配
&emsp;&emsp;请参考[正则表达式](#正则表达式)，（我还没写\尴尬）。


# 表达式运算
## 运算符
&emsp;&emsp;shell里的运算符基本跟c语言的一样
* 基本运算符：+、-、*、/(加减乘除)、%(取模)
* 逻辑运算符：&&、||、!(与或非)
* 位运算符：&(与)、|(或)、^(异或)、~(取反)、<<(位左移)、>>(位右移)
* 赋值运算符：=、+=、*=、/=、%=、&=、|=、^|、<<=、.....

## 格式
&emsp;&emsp;shell里用`$[表达式]`表示中括号里的是表达式，也可以用`$((表达式))`来表示，推荐使用中括号的形式。
&emsp;&emsp;**注意**：shell里只能对整形变量进行表达式运算，不能对字符串类型的变量进行表达式运算
```shell
xxx@xxx:~$ declare -i VAR1=123
xxx@xxx:~$ declare -i VAR2=111
xxx@xxx:~$ echo $[VAR1 + VAR2]
234
```

## expr命令
&emsp;&emsp;也可以用expr命令来进行表达式运算，expr命令支持的运算符有：|、&、<、<=、=、!=、>=、+、-、*、/、%。语法：`expr 表达式`，举个栗子：
```shell
xxx@xxx:~$ expr 123 + 111  # 加法运算
234
xxx@xxx:~$ VAR1=333
xxx@xxx:~$ VAR2=234
xxx@xxx:~$ expr ${VAR1} - ${VAR2}  # 变量１减变量２
99
xxx@xxx:~$ expr ${VAR1} \* ${VAR2}  # 变量１乘变量２
77922
xxx@xxx:~$ expr ${VAR1} / ${VAR2}  # 变量１除变量２
1
```
&emsp;&emsp;**注意**：运算符两边都有一个空格。部分运算符前面要加个`\`来转义，比如*、&、(、>。
&emsp;&emsp;还可以用小括号来组成更复杂的表达式。
```shell
xxx@xxx:~$ expr 12 \* \( 34 - 26 \)  # 乘号和小括号前都要加\
96
xxx@xxx:~$ declare -i VAR1=413
xxx@xxx:~$ declare -i VAR2=34
xxx@xxx:~$ expr ${VAR1} % \( ${VAR2} - 21 \) 
10
```
&emsp;&emsp;expr还可以进行简单的字符串运算，支持的有：
* **字符串 : 正则表达式**： 在字符串中由给定正则表达式决定的锚定模式匹配。
* **match 字符串 正则表达式**：与“字符串 : 正则表达式”相同。
* **substr 字符串 位置 长度**：从某个位置开始，截取指定长度的子串，位置由 1 开始计数。
* **index 字符串 字符**：字符串中第一次出现指定字符的位置，如果不存在该字符，则输出0。
* **length 字符串**：字符串的长度。

```shell
xxx@xxx:~$ expr substr 'this is a test' 2 8
his is a
xxx@xxx:~$ expr length 'this is a test'
14
xxx@xxx:~$ expr index 'this is a test' s
4
```
&emsp;&emsp;expr命令会将计算结果输出到标准输出，如果想将结果保存到变量里，可以用反引号来实现。
```shell
xxx@xxx:~$ VAR=`expr 23 \* 42`
xxx@xxx:~$ echo ${VAR}
966
```

# 条件判断
&emsp;&emsp;shell里可以用test命令进行条件判断。语法：`test 表达式`或者`[ 表达式 ]`(注意这里中括号和表达式之间的空格不能省)。
&emsp;&emsp;可以通过查看变量\$?的值，来判断表达式是否成立，如果成立，test命令返回值为0，变量\$?的值也是0，如果不成立，则值为非0。test命令可以进行的条件判断包括以下几种。

## 字符串判断
* **-z 字符串**：字符串的长度为 0
* **-n 字符串**：字符串长度非零
* **字符串**：等价于`-n 字符串`
* **字符串1 = 字符串2**：字符串相等
* **字符串1 != 字符串2**：字符串不相等

```shell
xxx@xxx:~$ VAR=''
xxx@xxx:~$ [ -z ${VAR} ] # 判断字符串${VAR}长度是否为0
xxx@xxx:~$ echo $?  # 查看test命令的返回值
0
xxx@xxx:~$ VAR='abc'
xxx@xxx:~$ [ -z ${VAR} ]
xxx@xxx:~$ echo $?
1
xxx@xxx:~$ [ ${VAR} = 'abc' ] # 判断字符串${VAR}是否等于'abc'
xxx@xxx:~$ echo $?
0
xxx@xxx:~$ [ ${VAR} = '123' ]
xxx@xxx:~$ echo $?
1
```

## 整数判断
* **整数1 -eq 整数2**：整数1与整数2相等
* **整数1 -ge 整数2**：整数1大于或等于整数2
* **整数1 -gt 整数2**：整数1大于整数2
* **整数1 -le 整数2**：整数1小于或等于整数2
* **整数1 -lt 整数2**：整数1小于整数2
* **整数1 -ne 整数2**：整数1和整数2不相等

## 文件判断
* **-e 文件**：文件存在
* **-d 文件**：文件存在且为目录
* **-f 文件**：文件存在且为普通文件
* **-r 文件**：文件存在且有可读权限
* **-w 文件**：文件存在且有可写权限
* **-x 文件**：文件存在且有可执行（或搜索）权限
* **-b 文件**：文件存在且为块特殊文件
* **-c 文件**：文件存在且为字符特殊文件
* **-g 文件**：文件存在且被设置了 set-group-ID 位
* **-g 文件**：文件存在且为有效组ID 所有
* **-h 文件**：文件存在且为一个符号链接（与 -L 相同）
* **-L 文件**：文件存在且为一个符号链接（与 -h 相同）
* **-k 文件**：文件存在且被设置粘着位
* **-O 文件**：文件存在且为有效用户ID 所有
* **-p 文件**：文件存在且为命名管道
* **-s 文件**：文件存在且其大小大于零
* **-S 文件**：文件存在且为套接字
* **-u 文件**：文件存在且被设置了 set-user-ID 位
* **-t FD**：文件描述符 FD 在某个终端打开
* **文件1 -ef 文件2**：文件1 和文件2 拥有相同的设备编号与 inode 编号
* **文件1 -nt 文件2**：文件1 在修改时间上新于文件2
* **文件1 -ot 文件2**：文件1 比文件2 更旧

## 逻辑判断
* **! 表达式**：表达式为假
* **表达式1 -a 表达式2**：表达式1 与表达式2 皆为真
* **表达式1 -o 表达式2**：表达式1 或表达式2 为真

# 分支结构
## if语句
&emsp;&emsp;直接上语法：
```shell
if 条件1
then
	条件1成立时执行的命令
elif 条件2
then
	条件1不成立，且条件2成立时执行的命令
else
	条件1和条件2都不成立时执行的命令
fi # 结束if语句
```
&emsp;&emsp;这里的条件一般是一条shell命令，比如`test`、`gcc`等。如果命令的返回值为0，则条件成立。
&emsp;&emsp;小实验：
```shell
xxx@xxx:~/code/shell$ cat shell.sh 
#!/bin/sh

if [ ${1} -gt ${2} ]  # 判断${1}是否大于${2}
then
	echo 'num_1 > num_2'
elif [ ${1} -eq ${2} ]  # 判断${1}是否等于${2}
then
	echo 'num_1 = num_2'
else
	echo 'num_1 < num_2'
fi

xxx@xxx:~/code/shell$ ./shell.sh 12 12
num_1 = num_2
xxx@xxx:~/code/shell$ ./shell.sh 12 11
num_1 > num_2
xxx@xxx:~/code/shell$ ./shell.sh 12 13
num_1 < num_2
```

## case语句
&emsp;&emsp;语法：
```shell
case 字符串 in
模式1)
	# 模式1能匹配字符串时执行的命令
	;; # 表示结束
模式2)
	# 模式2能匹配字符串时执行的命令
	;; # 结束
*)
	# 以上模式都不匹配时执行的命令
	;; # 结束
esac # 结束case语句
```
&emsp;&emsp;case语句只能对字符串进行判断，这里的模式是指正则表达式。
