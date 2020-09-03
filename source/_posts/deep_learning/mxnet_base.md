---
title: 'MXNet框架基础'
date: 2020-09-03 15:44:00
categories: 深度学习
tags: [深度学习,MXNet]
mathjax: true
---

&emsp;&emsp;之前一直用caffe来训练模型，深度学习还没有系统的学，前阵子在网上看到了这本书，感觉讲的比较详细，像我这样机器学习不太懂的人也能看懂，而且还有代码实现，所以打算用它来系统地学一遍深度学习，做个笔记记录一下。
&emsp;&emsp;**本文内容引用自[《动手学深度学习》](https://zh.d2l.ai/)**
MXNet是一个开源的深度学习框架，它是AWS（亚⻢逊云计算服务）首选的深度学习框架。
# 安装MXNet
**CPU版本**：
```
pip install mxnet
```
**GPU版本**：
&emsp;&emsp;使用`pip search mxnet`找到对应CUDA版本的包，然后`pip install 包名`安装。

|CUDA版本|MXNet包名|
|:---:|:---:|
|CUDA-7.5|mxnet-cu75|
|CUDA-8.0|mxnet-cu80|
|CUDA-9.0|mxnet-cu90|
|CUDA-9.1|mxnet-cu91|
|CUDA-9.2|mxnet-cu92|
|CUDA-10.0|mxnet-cu100|
|CUDA-10.1|mxnet-cu101|
|CUDA-10.2|mxnet-cu102|

# 数据操作
&emsp;&emsp;在深度学习中，我们通常会频繁地对数据进行操作。作为动手学深度学习的基础，本节将介绍如何对内存中的数据进行操作。
&emsp;&emsp;在MXNet中，NDArray是一个类，也是存储和变换数据的主要工具。如果你之前用过NumPy，你会发现NDArray和NumPy的多维数组非常类似。然而，NDArray提供GPU计算和自动求梯度等更多功能，这些使NDArray更加适合深度学习。
## 创建NDArray
&emsp;&emsp;首先从MXNet导入ndarray模块。这里的nd是ndarray的缩写形式。
```python
from mxnet import nd
```
&emsp;&emsp;然后我们用arange函数创建一个行向量。
```python
x = nd.arange(12)
print(x)
```
结果：
>[ 0.  1.  2.  3.  4.  5.  6.  7.  8.  9. 10. 11.]
<NDArray 12 @cpu(0)>

&emsp;&emsp;这时返回了一个NDArray实例,其中包含了从0开始的12个连续整数。从打印x时显示的属性<NDArray 12 @cpu(0)>可以看出,它是⻓度为12的一维数组,且被创建在CPU使用的内存上。其中“@cpu(0)”里的0没有特别的意义,并不代表特定的核。

&emsp;&emsp;我们可以通过shape属性来获取NDArray实例的形状。
```python
print(x.shape)
```
结果：
>(12,)

&emsp;&emsp;我们也能够通过size属性得到NDArray实例中元素(element)的总数。
```python
print(x.size)
```
结果：
>12

&emsp;&emsp;下面使用reshape函数把行向量x的形状改为(3, 4),也就是一个3行4列的矩阵,并记作X。除了形状改变之外,X中的元素保持不变。
```python
x = x.reshape((3, 4))
print(x)
print(x.shape)
print(x.size)
```
结果：
>\[[ 0.  1.  2.  3.]
 [ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]]
<NDArray 3x4 @cpu(0)>
(3, 4)
12

&emsp;&emsp;注意x属性中的形状发生了变化。上面x.reshape((3,4))也可写成x.reshape((-1,4))或x.reshape((3,-1))。由于x的元素个数是已知的,这里的-1是能够通过元素个数和其他维度的大小推断出来的。

&emsp;&emsp;接下来,我们创建一个各元素为0,形状为(2, 3, 4)的张量。实际上,之前创建的向量和矩阵都是特殊的张量。
```python
print(nd.zeros((2, 3, 4)))
```
结果：
>\[\[[0. 0. 0. 0.]
  [0. 0. 0. 0.]
  [0. 0. 0. 0.]]
>
>\[[0. 0. 0. 0.]
  [0. 0. 0. 0.]
  [0. 0. 0. 0.]]]
<NDArray 2x3x4 @cpu(0)>

&emsp;&emsp;类似地,我们可以创建各元素为1的张量。
```python
print(nd.ones((3, 4)))
```
结果：
>\[[1. 1. 1. 1.]
 [1. 1. 1. 1.]
 [1. 1. 1. 1.]]
<NDArray 3x4 @cpu(0)>

&emsp;&emsp;有些情况下,我们需要随机生成NDArray中每个元素的值。下面我们创建一个形状为(3,4)的NDArray。它的每个元素都随机采样于均值为0、标准差为1的正态分布。
```python
print(nd.random.normal(0, 1, shape=(3, 4)))
```
结果：
>\[[ 2.2122064   0.7740038   1.0434403   1.1839255 ]
 [ 1.8917114  -1.2347414  -1.771029   -0.45138445]
 [ 0.57938355 -1.856082   -1.9768796  -0.20801921]]
<NDArray 3x4 @cpu(0)>

&emsp;&emsp;我们也可以通过Python的列表(list)指定需要创建的NDArray中每个元素的值。
```python
y = nd.array([[2, 1, 4, 3], [1, 2, 3, 4], [4, 3, 2, 1]])
print(y)
```
结果：
>[[2. 1. 4. 3.]
 [1. 2. 3. 4.]
 [4. 3. 2. 1.]]
<NDArray 3x4 @cpu(0)>

## 运算
&emsp;&emsp;NDArray支持大量的运算符(operator)。例如,我们可以对之前创建的两个形状为(3,4)的NDArray做按元素加法。所得结果形状不变。
```python
print(x + y)
```
结果：
>\[[ 2.  2.  6.  6.]
 [ 5.  7.  9. 11.]
 [12. 12. 12. 12.]]
<NDArray 3x4 @cpu(0)>

&emsp;&emsp;按元素乘法:
```python
print(x * y)
```
&emsp;&emsp;按元素除法:
```python
print(x / y)
```
结果：
>\[[ 0.  1.  8.  9.]
 [ 4. 10. 18. 28.]
 [32. 27. 20. 11.]]
<NDArray 3x4 @cpu(0)>
>
>\[[ 0.    1.    0.5   1.  ]
 [ 4.    2.5   2.    1.75]
 [ 2.    3.    5.   11.  ]]
<NDArray 3x4 @cpu(0)>

&emsp;&emsp;按元素做指数运算:
```python
print(y.exp())
```
结果：
>\[[ 7.389056   2.7182817 54.59815   20.085537 ]
 [ 2.7182817  7.389056  20.085537  54.59815  ]
 [54.59815   20.085537   7.389056   2.7182817]]
<NDArray 3x4 @cpu(0)>

&emsp;&emsp;除了按元素计算外,我们还可以使用dot函数做矩阵乘法。下面将x与y的转置做矩阵乘法。由于x是3行4列的矩阵,y转置为4行3列的矩阵,因此两个矩阵相乘得到3行3列的矩阵。
```python
print(nd.dot(x, y.T))
```
结果：
>\[[ 18.  20.  10.]
 [ 58.  60.  50.]
 [ 98. 100.  90.]]
<NDArray 3x3 @cpu(0)>

&emsp;&emsp;我们也可以将多个NDArray连结(concatenate)。下面分别在行上(维度0,即形状中的最左边元素)和列上(维度1,即形状中左起第二个元素)连结两个矩阵。可以看到,输出的第一个NDArray在维度0的⻓度(6)为两个输入矩阵在维度0的⻓度之和(3 + 3),而输出的第二个NDArray在维度1的⻓度(8)为两个输入矩阵在维度1的⻓度之和(4 + 4)。
```python
print(nd.concat(x, y, dim=0))
print(nd.concat(x, y, dim=1))
```
结果：
>\[[ 0.  1.  2.  3.]
 [ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]
 [ 2.  1.  4.  3.]
 [ 1.  2.  3.  4.]
 [ 4.  3.  2.  1.]]
<NDArray 6x4 @cpu(0)>
>
>\[[ 0.  1.  2.  3.  2.  1.  4.  3.]
 [ 4.  5.  6.  7.  1.  2.  3.  4.]
 [ 8.  9. 10. 11.  4.  3.  2.  1.]]
<NDArray 3x8 @cpu(0)>

&emsp;&emsp;使用条件判断式可以得到元素为0或1的新的NDArray。以X == Y为例,如果X和Y在相同位置的条件判断为真(值相等),那么新的NDArray在相同位置的值为1;反之为0。
```python
print(x == y)
```
结果：
>\[[0. 1. 0. 1.]
 [0. 0. 0. 0.]
 [0. 0. 0. 0.]]
<NDArray 3x4 @cpu(0)>

&emsp;&emsp;对NDArray中的所有元素求和得到只有一个元素的NDArray。
```python
print(x.sum())
```
结果：
>[66.]
<NDArray 1 @cpu(0)>

&emsp;&emsp;我们可以通过asscalar函数将结果变换为Python中的标量。下面例子中x的$L_2$范数结果同上例一样是单元素NDArray,但最后结果变换成了Python中的标量。
```python
print(x.norm())
print(x.norm().asscalar())
```
结果：
>[22.494442]
<NDArray 1 @cpu(0)>
22.494442

&emsp;&emsp;我们也可以把Y.exp()、X.sum()、X.norm()等分别改写为nd.exp(Y)、nd.sum(X)、nd.norm(X)等。

## 广播机制
&emsp;&emsp;前面我们看到如何对两个形状相同的NDArray做按元素运算。当对两个形状不同的NDArray按元素运算时,可能会触发广播(broadcasting)机制:先适当复制元素使这两个NDArray形状相同后再按元素运算。
&emsp;&emsp;先定义两个NDArray。
```python
A = nd.arange(3).reshape((3, 1))
B = nd.arange(2).reshape((1, 2))
```
&emsp;&emsp;由于A和B分别是3行1列和1行2列的矩阵,如果要计算A + B,那么A中第一列的3个元素被广播(复制)到了第二列,而B中第一行的2个元素被广播(复制)到了第二行和第三行。如此,就可以对2个3行2列的矩阵按元素相加。
```python
print(A, B)
print(A + B)
```
结果：
>\[[0.]
 [1.]
 [2.]]
<NDArray 3x1 @cpu(0)> 
\[[0. 1.]]
<NDArray 1x2 @cpu(0)>
>
>\[[0. 1.]
 [1. 2.]
 [2. 3.]]
<NDArray 3x2 @cpu(0)>

## 索引
&emsp;&emsp;在NDArray中,索引(index)代表了元素的位置。NDArray的索引从0开始逐一递增。例如,一个3行2列的矩阵的行索引分别为0、1和2,列索引分别为0和1。

&emsp;&emsp;在下面的例子中,我们指定了NDArray的行索引截取范围[1:3]。依据左闭右开指定范围的惯例,它截取了矩阵X中行索引为1和2的两行。
```python
print(x)
print(x[1:3])
print(x[1:3, :])
print(x[1:3, 1:3])
print(x[:, 1:3])
```
结果：
>\[[ 0.  1.  2.  3.]
 [ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]]
<NDArray 3x4 @cpu(0)>
>
>\[[ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]]
<NDArray 2x4 @cpu(0)>
>
>\[[ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]]
<NDArray 2x4 @cpu(0)>
>
>\[[ 5.  6.]
 [ 9. 10.]]
<NDArray 2x2 @cpu(0)>
>
>\[[ 1.  2.]
 [ 5.  6.]
 [ 9. 10.]]
<NDArray 3x2 @cpu(0)>

&emsp;&emsp;我们可以指定NDArray中需要访问的单个元素的位置,如矩阵中行和列的索引,并为该元素重新赋值。
```python
x[1, 2] = 9
print(x)
```
结果：
>\[[ 0.  1.  2.  3.]
 [ 4.  5.  9.  7.]
 [ 8.  9. 10. 11.]]
<NDArray 3x4 @cpu(0)>

&emsp;&emsp;我们也可以截取一部分元素,并为它们重新赋值。在下面的例子中,我们为行索引为1的每一列元素重新赋值。
```python
x[1:2, :] = 12
print(x)
```
结果：
>\[[ 0.  1.  2.  3.]
 [12. 12. 12. 12.]
 [ 8.  9. 10. 11.]]
<NDArray 3x4 @cpu(0)>

## 运算的内存开销
&emsp;&emsp;在前面的例子里我们对每个操作新开内存来存储运算结果。举个例子,即使像`y = x + y`这样的运算,我们也会新开内存,然后将Y指向新内存。为了演示这一点,我们可以使用Python自带的id函数:如果两个实例的ID一致,那么它们所对应的内存地址相同;反之则不同。
```python
before = id(y)
y = y + x
print(id(y) == before)
```
结果：
>False

&emsp;&emsp;如果想指定结果到特定内存,我们可以使用前面介绍的索引来进行替换操作。在下面的例子中,我们先通过zeros_like创建和Y形状相同且元素为0的NDArray,记为z。接下来,我们把x+y的结果通过[:]写进Z对应的内存中。
```python
z = y.zeros_like()
before = id(z)
z[:] = x + y
print(id(z) == before)
```
结果：
>True

&emsp;&emsp;实际上,上例中我们还是为`x + y`开了临时内存来存储计算结果,再复制到Z对应的内存。如果想避免这个临时内存开销,我们可以使用运算符全名函数中的out参数。
```python
nd.elemwise_add(x, y, out=z)
print(id(z) == before)
z = x + y
print(id(z) == before)
```
结果：
>True
False

&emsp;&emsp;如果X的值在之后的程序中不会复用,我们也可以用`x[:] = x + y`或者`x += y`来减少运算的内存开销。
```python
before = id(z)
z += y
print(id(z) == before)
```
结果：
>True

## NDArray和NumPy相互变换
&emsp;&emsp;我们可以通过array函数和asnumpy函数令数据在NDArray和NumPy格式之间相互变换。下面将NumPy实例变换成NDArray实例。
```python
import numpy as np
p = np.ones((2, 3))
d = nd.array(p)
print(d)
```
结果：
>\[[1. 1. 1.]
 [1. 1. 1.]]
<NDArray 2x3 @cpu(0)>

&emsp;&emsp;再将NDArray实例变换成NumPy实例。
```python
p = d.asnumpy()
print(p)
```
结果：
>\[[1. 1. 1.]
 [1. 1. 1.]]

