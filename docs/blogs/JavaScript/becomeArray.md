---
title: JS数组扁平化
date: 2021-10-25
sidebar: 'auto'
categories: JavaScript
tags: 
    - 数组
    - 扁平化
    - JS
public: true
---

### 数组拍平也称数组扁平化，就是将数组里面的数组打开，最后合并为一个数组。
### 方法一：递归
```js
// var arr = [1,2,[3,4,5,[6,7,8],9],10,[11,12]];
function flat(arr) {
    if (Object.prototype.toString.call(arr) != "[object Array]") {return false}
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            res = res.concat(flat(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }
    return res;
}
```
### 方法二：扩展运算符
只降低一个维度
```js
function flat(arr) {
	if (Object.prototype.toString.call(arr) != "[object Array]") {return false}
    let res = [];
    arr.map(value => {
        if (value instanceof Array) {
            res.push(...value);
        } else {
            res.push(value);
        }
    })
    return res;
}
//[1, 2, 3, 4, 5, Array(3), 9, 10, 11, 12]
```
### 方法三：递归+扩展运算符
降低N个维度
```js
    if (Object.prototype.toString.call(arr) != "[object Array]") {return false}
    let res = [];
    arr.map(value => {
        if (value instanceof Array) {
            res.push(...flat(value));
        } else {
            res.push(value);
        }
    })
    return res;
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```
### 方法四：递归+reduce
```js
    if (Object.prototype.toString.call(arr) != "[object Array]") {return false}
    let res = arr.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur)? flat(cur): cur);
    }, [])
    return res
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```
### 方法五：toString+split
```js
    let res = arr.toString().split(',').map(value => parseInt(value))
    return res
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```
### 方法六：原生flat
```js
return arr.flat()
// [1, 2, 3, 4, 5, Array(3), 9, 10, 11, 12]
```
### 方法七：while+some+apply
```js
    while (arr.some(value => Array.isArray(value))) {
        arr = [].concat.apply([],arr)
    }
    return arr
    // [1, 2, 3, 4, 5, Array(3), 9, 10, 11, 12]
```
### 方法八
```js
    return [].concat(...arr.map(x => Array.isArray(x)? flat(x): x))
   // [1, 2, 3, 4, 5, Array(3), 9, 10, 11, 12]
```
