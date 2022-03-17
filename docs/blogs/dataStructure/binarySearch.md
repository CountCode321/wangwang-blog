---
title: 二分查找
date: 2022-02-15
sidebar: 'auto'
categories: dataStructure
tags:
    - 数据结构
    - 二分
public: true
---
在有序数组中查找某一个值
1. 迭代写法
```typescript
function binarySearch(array: number[], target: number) {
    let i = 0, j = array.length - 1
    while (i <= j) {
        let mid = i + ((j - i) >> 1)
        if (array[mid] === target) {
            return mid
        } else if (target < array[mid]) {
            j = mid - 1
        } else {
            i = mid + 1
        }
    }
    return - 1
}
```
2. 递归写法
```typescript
function binarySearch(array: number[], target) {
    return binarySearchRange(array, target, 0, array.length - 1)
}
function binarySearchRange(array: number[], target: number, start, end) {
    if (start <= end) {
        let mid = start + ((end - start) >> 1)
        if (array[mid] === target) {
            return mid
        } else if (array[mid] > target) {
            binarySearchRange(array, target, start, mid - 1)
        } else {
            binarySearchRange(array, target, mid + 1, end)
        }
    }
    return -1
}
```
### 例题：在只有 1 和 2 两种元素的 nums 中里面找到 1 的最后一个位置
```typescript
function binarySearch(array: number[]): number {
    let i = 0, j = array.length - 1
    let index = -1
    while (i <= j) {
        let mid = i + ((j - i) >> 1)
        if (array[mid] === 1) {
            index = mid
            i = mid + 1
        } else {
            j = mid - 1
        }
    }
    return index
}
```
### 例题：找出有序数组中插入 value 的位置
- 方法一：寻找比 value 大的第一个元素的索引
```typescript
function findInsertIndex(array: number[], insertVal: number): number {
    let i = 0, j = array.length - 1, index = array.length
    while (i <= j) {
        let mid = i + ((j - i) >> 1)
        if (array[mid] > insertVal) {
            index = mid 
            j = mid - 1
        } else {
            i = mid + 1
        }
    }
    return index
}
```
> 注意：这里的初值为 array.length 考虑到边界，value 比最大的值还大
- 方法二：寻找比 value 小的最后一个元素的索引
```typescript
function findInsertIndex(array: number[], insertVal) {
    let i = 0, j = array.length- 1, index = -1
    while (i <= j) {
        let mid = i + ((j - i) >> 1)
        if (array[mid] < insertVal) {
            index = mid
            i = mid + 1
        } else {
            j = mid - 1
        }
    }
    return index + 1
}
```
### leetcode34: 在排序数组中查找元素的第一个和最后一个位置
```typescript
function searchRange(array: number[], target: number): number[] {
    let res = []
    let i = 0, j = array.length - 1
    // 寻找第一个位置
    while (i <= j) {
        let mid = i + ((j - i) >> 1)
        if (array[mid] >= target) {
            res[0] = mid
            j = mid - 1
        } else {
            i = mid + 1
        }
    }
    // 寻找最后一个位置
    i = 0, j = array.length - 1
    while (i <= j) {
        let mid = i + ((j - i) >> 1)
        if (array[mid] <= target) {
            res[1] = mid
            i = mid + 1
        } else {
            j = mid - 1
        }
    }
    for (let i = 0; i < 2; i++) {
        res[i] = (res[i] === undefined || array[res[i]] !== target ? -1 : res[i])
    }
    return res
}
```