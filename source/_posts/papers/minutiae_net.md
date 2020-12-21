---
title: 'Robust Minutiae Extractor:Integrating Deep Networks and Fingerprint Domain Knowledge'
date: 2020-12-21 16:25:00
categories: 论文解读
tags: [论文, 深度学习, 指纹识别]
mathjax: true
---

[论文下载链接](/documnets/MinutiaeNet.pdf)

# Abstract（摘要）
&emsp;&emsp;提出了一个基于深度神经网络的全自动指纹细节点提取器。
* **CoarseNet**: 粗糙的网络，基于卷积神经网络和指纹领域知识，估计细节点位置和方向。
* **FineNet**: 精细的网络，基于细节点的分数热力图对候选细节点位置进一步改善。

&emsp;&emsp;由于缺乏基于细节点标注的指纹数据集，本文提出的细节点检测方法将有助于训练基于网络的指纹匹配算法。

# Introduction（介绍）
&emsp;&emsp;**传统方法**：主要利用指纹领域知识和手工特征提取细节点。在质量好的指纹图像上效果好，但是在质量差的指纹上效果不好，尤其是滚动指纹。
&emsp;&emsp;提出了一个新的框架，结合指纹领域知识的深度神经网络来提取细节点。
