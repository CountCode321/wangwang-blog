---
title: JS深拷贝和浅拷贝
date: 2021-11-06
sidebar: 'auto'
categories: JavaScript
tags: 
    - JavaScript
    - 深拷贝
    - 浅拷贝
public: true
---

## 深拷贝和浅拷贝
简单来说 就是B复制A，A变化，如果B跟着变化了就是浅拷贝；如果B未变化就是深拷贝。

### 基本和引用类型的存储地址
1. 基本数据类型名字和值都存储在栈内存中。
```js
var a = 1;
b = a;
b = 2;
console.log(b);     // 2
```
2. 引用数据类型，名字存储在栈内存中，值存储在堆内存中，但是栈内存会提供一个引用的地址指向堆内存中的值。<br>

若a为数组，b复制了a，那么b复制的就是a的引用地址，如果a发生了变化，b的值也会受影响，因为b和a指向的是同一个地址。这就是浅拷贝，如果想要实现深拷贝，就需要给b开辟一个新的内存地址。

### 实现浅拷贝
1. 使用for...in 只复制第一层的浅拷贝
```js
// 只复制了第一层的浅拷贝
function simpleCopy(obj1) {
    var obj2 = Array.isArray(obj1)? [] : {}
    for (let i in obj1) {
        obj2[i] = obj1[i]
    }
    return obj2
}
var obj1 = {
    a: 1,
    b: 2,
    c: {
        d: 3
    }
}
var obj2 = simpleCopy(obj1)
obj2.a = 3
obj2.c.d = 4
console.log(obj1.a)
console.log(obj1.c.d)
console.log(obj2.c.d)
```
2. 使用`Object.assign()`
```js
var obj = {
    a: 1,
    b: 2
}
var obj1 = Object.assign(obj)
obj1.a = 3
console.log(obj.a)   // 3
```
3. 直接用 = 赋值
```js
let a = [0, 1, 2, 3, 4]
b = a
a[0] = 1
console.log(b[0])   // 1
```
### 实现深拷贝的方法
1. 递归方法
```js
function deepClone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}    
let a=[1,2,3,4],
    b=deepClone(a);
a[0]=2;
console.log(a,b);
```
![运行结果](https://img-blog.csdnimg.cn/img_convert/ffac76309e3265d096b4f0bb3c6f0836.png)

2. 通过JSON对象来实现深拷贝
```js
function deepClone2(obj) {
    var newObj = JSON.stringify(obj),
        resObj = JSON.parse(newObj)
    return resObj
}
```
无法对对象中方法的深拷贝，会显示undefined

3. 手动实现深拷贝
```js
let obj1 = {
    a: 1,
    b: 2
}
let obj2 = {
    a: obj1.a,
    b: obj2.b
}
obj2.a = 3
console.log(obj1.a)     // 1
console.log(obj2.a)     // 3
```

4. 如果对象的value是基本类型的话，可以用`Object.assign()`来实现，但是需要赋值给一个空对象
```js
var obj = {
    a: 1,
    b: 2
}
var obj1 = Object.assign({}, obj);
obj1.a = 3
console.log(obj.a)  // 1
```
5. 使用扩展运算符实现深拷贝
当value是基本数据类型时，可以使用扩展运算符进行深拷贝。
当value是引用类型时，使用扩展运算符进行的是浅拷贝。
```js
var car = { brand: 'BMW', price: '38000', length: '5米'}
var car1 = { ...car, price: '50000' }
console.log(car)    // {brand: "BMW", price: "38000", length: "5米"}
console.log(car1)   // {brand: "BMW", price: "50000", length: "5米"}
```
