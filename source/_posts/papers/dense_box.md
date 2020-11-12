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
1. 应用了严格的负样本挖掘。
2. 使用多任务学习，将landmark定位集成到系统中。

作者两个方面的贡献：
1. 证明了，一个单一的FCN，如果精心设计和优化，可以非常准确并且高效地检测多个不同的目标。
2. 证明了，在多任务学习中结合landmark定位，DenseBox可以进一步提高目标检测的准确性。

实验数据库：MALF人脸检测和KITTI汽车检测。

# Related Work（相关工作）
## 传统方法
1. 手工提取特征（HOG，SIFT，Fisher Vector）
2. 建立目标模型（PSM，DPM），推测是选出目标候选区域
3. 利用分类器分类（SVM）

## 神经网络
1. 1994 Vaillant等人提出用卷积神经网络来做人脸检测。
2. 1996～1998 Rowley等人提出用神经网络来检测图像金字塔的正脸。

具有借鉴意义，与DenseBox的设计有相似的地方。

## 深度卷积神经网络
1. **OverFeat**：
2. **MultiBox**：用一个网络来生成多个候选区域，然后用R-CNN对候选区域进行目标检测。
3. **YOLO**：

&emsp;&emsp;大部分最新的方法都依赖于R-CNN，但是将检测分成两个阶段会造成模型对小尺寸的人脸和复杂外观变化的人脸遗忘，导致其在人脸检测等检测任务中的性能较差。
&emsp;&emsp;YOLO和Fast R-CNN将候选边界框和分类结合到一个或两个阶段中。

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

&emsp;&emsp;如果一张图像中包含多个人脸，只将正中心区域的作为正样本，其他作为负样本。

## Model Design（模型设计）
![](/images/paper/dense_box/fig_3.png)
&emsp;&emsp;主干部分来源于VGG19，包含12个卷积层。
&emsp;&emsp;输出部分包括4个1×1的卷积层，作用相当于全连接层，前两个用于预测分类分数，后两个用于预测边界框。

**多层次特征融合**：conv3_4输出的特征映射，每个像素的感受野是48×48，有利于检测局部细节，conv4_4的感受野是118×118，能利用到全局的特征，将这两种特征结合有利于最终的检测。

## Multi-Task Training（多任务训练）
&emsp;&emsp;网络包含两个训练任务，一个是训练分类分数，一个是训练边界框。
&emsp;&emsp;训练使用的损失函数都是$L2$损失函数，不用其他的函数是因为简单的$L2$损失函数的训练效果还不错。
$$
L_{cls}(\hat{y}, y^\*) = ||\hat{y} - y^\*||^2 \\\\
L_{loc}(\hat{d}, d^\*) = \sum_{i\in\{tx,ty,bx,by\}}||\hat{d_i} - d_i^\*||^2
$$

### Balance Sampling（平衡样本）
&emsp;&emsp;负样本在所有样本中占主导地位，如果简单地在小批量中使用所有负样本，将会使预测偏向于负样本。

&emsp;&emsp;**忽略灰度区域**：将正负样本交界处的样本忽略，不参加训练。如果一个样本2个像素半径范围内有正样本，则看做是灰度区域，这部分区域用$f_{ign} = 1$表示。

&emsp;&emsp;**困难样本挖掘**：困难样本是训练效果差的样本，训练时增加困难样本被选中的概率。训练时将所有样本的损失值按从大到小排序，将前1%的样本作为困难样本，用于训练的样本一半从困难样本选择，另一半从其他样本中随机选择，被选中样本用$f_{sel} = 1$表示。

&emsp;&emsp;**损失掩码**：
![](/images/paper/dense_box/eq_3.png)
![](/images/paper/dense_box/eq_4.png)

$M(\hat{t_i})$表示负样本的损失掩码。
$\[y^*>0\]$表示边界框的损失值只考虑负样本。
$\lambda_{loc}$是两个损失值的平衡因子，在这里设为3。

&emsp;&emsp;**其他细节**：
* 正块：在特定的尺度下选取的块，中心部分包含一个目标。
* 随机块：在随机尺度下随机选取的块。

训练时，正块和随机块选取的比例是1:1。然后加入了镜像、颜色抖动、线性变换增强方法。
训练的参数：
优化策略：小批量SGD
batch size：10
学习率：初始0.001，每迭代10万次乘0.1。
动量：0.9
权重衰减：0.0005

###  Refine with Landmark Localization（用landmark定位优化）
![](/images/paper/dense_box/fig_4.png)

在DenseBox网络中加入landmark的回归，然后将其与用于分类的conv5_2结合，可以增强模型的检测性能。
相当于给分类增加一个约束，可以让分类的部分学的更好。
![](/images/paper/dense_box/eq_5.png)

$\lambda_{det}$和$\lambda_{lm}$是平衡因子，在这里设置成1和0.5。
