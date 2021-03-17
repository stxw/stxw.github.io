---
title: 'linuxmint搭建stm32开发环境'
date: 2021-03-16 21:00:00
categories: 学习笔记
tags: [嵌入式, arm, linux]
---

# 先说两句
&emsp;&emsp;最近公司要做一个单片机上的项目，虽然之前学过一点点，不过当时只会写“hello world”级别的代码。感觉这东西挺好玩的，趁着晚上下班没事学一下，随便记录一下开发环境的搭建过程。
&emsp;&emsp;开发板是`STM32F407G-DISC1`，大学搞飞控的时候买的，~~当时我在团队里面是划水的~~。之前是在win10系统开发，现在换了linuxmint系统，要重新学一下怎么搭环境，主要是参考大佬的 <https://blog.csdn.net/u010000843/article/details/114531922> 这篇博客搭的。用到的工具先列一下吧：

| 工具 | 介绍 |
| :--- | :----|
| vscodium | vscode完全开源版的IDE，和vscode很像 |
| STM32CubeMX | ST公司的代码自动生成工具 |
| gcc-arm-none-eabi | arm平台的GNU编译器 |
| openocd | 开源的烧录调试工具 |

&emsp;&emsp;好的，接下来就开始吧。

# 开发工具安装
## vscodium
&emsp;&emsp;去GitHub上下载，地址：<https://github.com/vscodium/vscodium/releases>。建议不要装1.5x版本的，代码提示经常加载不出来，vscode也是一样。

## STM32CubeMX
&emsp;&emsp;ST官网上下载安装就好了，[传送门](https://www.st.com/zh/development-tools/stm32cubemx.html)。

## gcc-arm-none-eabi
&emsp;&emsp;这个在arm官网上有，[传送门](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads)，下载后解压到你喜欢的某个路径下，然后把里面的`bin`目录添加到`PATH`环境变量里。方法如下：
```shell
$ vi ~/.bashrc

# 打开.bashrc后把下面这两句添加到里面
GCC_ARM_NONE_EABI_HOME="" # 这里写gcc-arm-none-eabi解压后的路径
export PATH="${GCC_ARM_NONE_EABI_HOME}/bin:$PATH"

# 保存退出后让PATH生效
$ source ~/.bashrc
```

## openocd
&emsp;&emsp;用apt安装：
```shell
$ sudo apt-get install openocd
```

# 生成工程代码

