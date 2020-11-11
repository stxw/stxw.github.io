---
title: 'DenseBox: Unifying Landmark Localization with End to End Object Detection'
date: 2020-11-10 16:00:00
categories: 论文解读
tags: [论文, 深度学习, 目标检测]
mathjax: true
---

[论文下载链接](/documnets/densebox.pdf)

# Abstract（摘要）
&emsp;&emsp;**DenseBox**：一个用于做目标检测，统一的端到端的FCN框架，通过检测目标在图像中的所有可能的位置和尺度，直接预测目标的边界框和类别的置信度。

# Introduction（介绍）
已有的目标检测方法：
* **传统方法**：滑动窗口 + 手工提取的特征  --->  目标的位置和尺度
* **FCN**：滑动窗口 + 卷积神经网络提取的特征  --->  目标的位置和尺度
* **R-CNN**：比一般基于FCN的目标检测方法准确率更高的方法，
	包括两个阶段:
	- 第一个阶段：使用区域提出的方法，生成图像中所有可能的候选边界框。
	- 第二个阶段：用一个CNN分类器对每个候选区域分类。</ul>R-CNN缺点：<ul>
	- 难以检测到小的目标，比如人脸和远处的车辆。因为取块以后的区域分辨率低，并且没有利用到全局的信息。
	- 两个阶段不能联合优化，难以进行端到端的训练。

作者的研究方向：只用一个FCN，在目标检测上能做到什么程度。所以就设计了DenseBox。
**DenseBox**：类似于许多现有的滑动窗口式FCN检测框架，但是，是专门为检测小尺度和遮挡严重下的物体设计的。
训练时加入的两个优化：
1. 应用了严格的负样本采样技术。
2. 使用多任务学习，将landmark定位集成到系统中。

作者两个方面的贡献：
1. 证明了，一个单一的FCN，如果精心设计和优化，可以非常准确并且高效地检测多个不同的目标。
2. 证明了，在多任务学习中结合landmark定位，DenseBox可以进一步提高目标检测的准确性。

实验数据库：MALF人脸检测和KITTI汽车检测。

# Related Work（相关工作）


# DenseBox for Detection（DenseBox用于检测）
&emsp;&emsp;用单个卷积神经网络同时输出多个预测边界框和分类置信度。
&emsp;&emsp;输入：大小为$m \times n$的图像。
&emsp;&emsp;输出：大小为$\frac{m}{4} \times \frac{n}{4}$的5通道特征映射，1个通道用来预测分类置信度，其他4个通道用来预测边界框。

目标边界框左上角坐标：$p_t = (x_t, y_t)$
目标边界框右下角坐标：$p_b = (x_b, y_b)$

输出的特征映射中坐标为$(x_i, y_i)$的像素i输出为
$$
\hat{t_i} = \{ \hat{s}, \hat{dx^t}, \hat{dy^t}, \hat{dx^b}, \hat{dy^b} \}_i
$$

* $\hat{s}$：像素i是一个目标的置信度。
* $\hat{dx^t}, \hat{dy^t}, \hat{dx^b}, \hat{dy^b}$：像素i离上下左右四个边界框的距离。
$$
\hat{dx^t} = x_i - x_t \\\\
\hat{dy^t} = y_i - y_t \\\\
\hat{dx^b} = x_i - x_b \\\\
\hat{dy^b} = y_i - y_b \\\\
$$

最后将输出map的每个像素转化为一个边界框，对分数超过阈值的边界框进行非最大抑制。

## Ground Truth Generation（训练标签）
&emsp;&emsp;为了减少训练时间，作者将训练的图片裁剪缩放成大小为240×240的图片，每张图片中心有一个大约50个像素高的人脸。
&emsp;&emsp;标签是大小为60×60的边界框对应的5通道map，被下采样了4倍。
![](/images/paper/dense_box/fig_2.png)

&emsp;&emsp;第1个通道用于分类，将人脸正中心半径为$r_c$的圆形区域作为分类的正样本，$r_c$的大小根据边界框的大小来调整，比例因子是0.3，在圆形区域内的标签值设为1，其他区域作为负样本，值设为0。
&emsp;&emsp;其他4个通道用于标记边界框大小，表示像素离上下左右四个边界框的距离。

&emsp;&emsp;如果一张图像中包含多个人脸，只将最靠近正中心的作为正样本，其他作为父样本。

## Model Design（模型设计）
![](/images/paper/dense_box/fig_3.png)

## Multi-Task Training（多任务训练）

### Balance Sampling（平衡样本）

### 