---
title: 排序算法
date: 2022-01-22
sidebar: 'auto'
categories: dataStructure
tags:
    - 数据结构
    - 排序
public: true
---

>稳定：如果有大幅度的swap，一定不是稳定。
>定义：排序后的相同元素的相对位置不能改变。

三个稳定排序：归并排序、冒泡排序、插入排序
## 快速排序
时间复杂度：O(nlogn)，空间：O(logn)，非稳定排序，是冒泡的升级版。

当数组本来是有序的时候快排会弱化成冒泡。

思路：选一个基准值，将比基准值小的都放在基准值前，比基准值大的放在基准值后面，以同样的方式递归向下进行排序。所以整体是分治策略。
先划分后递归
```typescript
function quickSort(array: number[]) {
    quickSortRange(array, 0, array.length - 1)
}

function quickSortRange(array: number[], start: number, end: number) {
    if (start < end) {
        let index: number = findIndex(array, start, end)
        quickSortRange(array, start, index - 1)
        quickSortRange(array, index + 1, end)
    }
}

function findIndex(array: number[], start: number, end: number): number {
    let i = start
    for (let j = start; j < end; j++) {
        if (array[j] <= array[end]) {
            swap(array, j, i)
            i++
        }
    }
    swap(array, i, end)
    return i
}

function swap(array: number[], i: number, j: number) {
    let temp: number = array[i]
    array[i] = array[j]
    array[j] = temp
} 
```
## 归并排序
时间复杂度：O(nlogn)，空间：O(nlogn)，稳定性排序。

先递归后合并
```typescript
function mergeSort(array:number[]) {
    mergeSortRange(array, 0, array.length - 1)
}

function mergeSortRange(array:number[], start:number, end:number) {
    if (start < end) {
        // let mid = start + (end - start) / 2 注意使用这个可能会出现小数的问题，所以推荐使用移位
        let mid = start + ((end - start) >> 1) // 右移一位/2,左移一位*2,位运算的优先级最低
        mergeSortRange(array, start, mid)
        mergeSortRange(array, mid + 1, end)
        merge(array, start, mid, mid + 1, end)
    }
}

function merge(array:number[], s1:number, e1:number, s2:number, e2:number) {
    let res = []
    let i = s1, j = s2
    while (i <= e1 && j <= e2) {
        if (array[i] < array[j]) {
            res.push(array[i++])
        } else {
            res.push(array[j++])
        }
    }
    while (i <= e1) {
        res.push(array[i++])
    }
    while (j <= e2) {
        res.push(array[j++])
    }
    for (let k = 0; k < res.length; k++) {
        array[s1 + k] = res[k]
    }
}
```
## 选择排序
时间复杂度：O(n^2)，空间: O(1)
```typescript
function selectSort(array:number[]) {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j
            }
        }
        swap(array, minIndex, i)
    }
}

function swap(array:number[], i:number, j:number) {
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
}
```
## 冒泡排序
时间复杂度：O(n^2)，空间复杂度：O(1)，稳定。
```typescript
function bubbleSort(array:number[]) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1)
            }
        }
    } 
}
function swap(array:number[], i:number, j:number) {
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
}
```
## 堆排序
时间复杂度：O(nlogn)，空间：O(1)
```javascript
function heapSort(array) {
  // 1. 建堆
  for (let i = (array.length >> 1) - 1; i >= 0; i--) {
    adjust(array, i, array.length)
  }
  // 2. 交换
  for (let i = array.length - 1; i > 0; i--) {
    swap(array, 0, i)
    adjust(array, 0, i)
  }
}
function adjust(array, root, len) {
  let lChild = root * 2 + 1
  let rChild = lChild + 1
  let maxIndex = lChild
  if (rChild < len && array[rChild] > array[lChild]) {
    maxIndex = rChild
  }
  if (maxIndex < len && array[root] < array[maxIndex]) {
    swap(array, root, maxIndex)
    adjust(array, maxIndex, len)
  }
}
function swap(array, i, j) {
  let temp = array[i]
  array[i] = array[j]
  array[j] = temp
}
```
## 堆排序
时间复杂度：O(nlogn)，空间：O(1)
```javascript
function heapSort(array) {
  // 1. 建堆
  for (let i = (array.length >> 1) - 1; i >= 0; i--) {
    adjust(array, i, array.length)
  }
  // 2. 交换
  for (let i = array.length - 1; i > 0; i--) {
    swap(array, 0, i)
    adjust(array, 0, i)
  }
}
function adjust(array, root, len) {
  let lChild = root * 2 + 1
  let rChild = lChild + 1
  let maxIndex = lChild
  if (rChild < len && array[rChild] > array[lChild]) {
    maxIndex = rChild
  }
  if (maxIndex < len && array[root] < array[maxIndex]) {
    swap(array, root, maxIndex)
    adjust(array, maxIndex, len)
  }
}
function swap(array, i, j) {
  let temp = array[i]
  array[i] = array[j]
  array[j] = temp
}
```
## 插入排序
时间复杂度：O（n^2）
```javascript
function insertSort(array) {
  for (let i = 0; i < array.length; i++) {
    let idx = 0, num = array[i]
    // 找这个数字插入的位置：找到第一个大于array[i]的位置
    while (idx <= i && array[idx] < num) {
      idx++
    }
    // 往后挪，挪到idx就截止
    for (let j = i; j > idx; j--) {
      array[j] = array[j - 1]
    }
    array[idx] = num
  }
}
```

