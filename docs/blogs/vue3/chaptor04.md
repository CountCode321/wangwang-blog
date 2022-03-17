---
title: vue3（四）：组件开发+补充语法
date: 2022-01-12
sidebar: 'auto'
categories: Vue3
tags:
    - vue3
    - 前端  
public: true
---
## 模板语法
Vue有基于HTML的模板语法，也支持jsx的开发模式。

在模板中，允许开发者以声明式的方式将DOM和底层组件实例的数据绑定在一起。

在底层的实现中，Vue将模板编译成虚拟DOM渲染函数。

## 条件渲染
多个元素切换的时候可以考虑使用template

v-show不支持template

## v-for为啥必须要写key？

key主要用在Vue的虚拟DOM算法，在新旧nodes对比时识别VNodes。

如果不使用key，Vue会使用一种最大限度减少动态元素并且尽可能的尝试修改/复用相同类型元素的算法。

如果使用key，它会基于key的变化重新排列元素顺序，并且会移除/销毁key不存在的元素。

## diff算法
VNnode是虚拟节点，存在于内存中的JS对象。

template-》VNode-》真实DNode

例如：
```javascript
<div class="title" style="font-size: 30px">哈哈哈</div>
const vnode = {
    type: "div",
    props: {
        class: "title",
        style: {
            "font-size": "30px",
            color: "red"
        }
    },
    children: "哈哈哈"
}
```
大量的元素形成VNode Tree。

虚拟DOM的最大优点是为了跨平台，性能高。

diff算法：

> 新的VNodes和旧的VNodes对比

有key调用pathKeyedChildren方法。

无key调用pathUnKeyedChildren方法。

**无key：**

源码中一开始就会进行判断，主要是用一个patchFlag来判断。

**对于无key**，会创建两个数组，第一个数组是旧VNode，第二个数组是新的VNode，然后获取两个数组长度，会取数组长度最小的遍历，因为最大的会越界。

然后用for循环遍历，从旧的取一个，新的取一个，进行对比（源码中调用path），对比内容类型更新，如果旧VNode长度大于新的对比遍历完了后就删掉，新的多就创建再挂载。

**有key**: 操作多，性能高。

1.创建两个数组，数组一为旧VNode，数组二为新VNode，从头部开始while循环遍历，判断旧的和新的type和key是否相同。当遇到不相同的时候就用break跳出循环。进行步骤2

2.从尾部开始遍历，新建两个数组，数组1从尾部开始取值，数组2也是从尾部取值，再次while循环对比，遇到不同的时候break。进行步骤3。

3.如果旧节点遍历完毕，依然有新节点，那么就是新增挂载（调用mount）。

4.如果新节点遍历完毕，还有节点，就是删除（调用unmount）。

5.如果旧节点是无序，尽可能在旧节点里面找到新列表里面对应的节点，将这个节点放到对应的位置。

## 计算属性 VS methods
计算属性有缓存的，即当我们多次使用时，只会执行一次。

计算属性会随着依赖的数据改变时，会重新计算后再缓存下来。

如果数据不改变，计算属性不会重新计算。

如何缓存？

和响应式原理有关。

### 侦听器watch
默认情况下，侦听器watch只能针对侦听的数据本身的改变（内部的改变是不会发改变的）。

深度侦听：旧值将和新值相同就是浅拷贝。
```javascript
data() {
    return {
        info: { name: 'why', age: 18 }
    }
},
watch: {
    info: {
        handler: function (newInfo, oldInfo) {
            // ...
    },
        deep: true, // 这一句可以省略
        immediate: true // 立即执行
    }
}
```
监听对象的属性
```javascript
watch: {
    '对象.属性': function(newVal, oldVal) {
    // ...
    }
}
$watch

created() {
    this.$watch('侦听的属性', (newVal, oldVal) => {
// ...
    }, {
        deep: true,
        immediate: true
    })

```

实际开发应用：

子组件监听父组件传递过来的数据的变化。

## v-model
```vue
<input v-model="message"></input>
等价于
<input :value="message" @input="searchText = $event.target.value" />
```

源码理解：

运用指令_vmodelText，调用addEventListern监听change

修饰符：

.lazy  .trim .keyup

## 父子组件通信：
父组件传递给子组件：通过props属性

子组件传递给父组件：通过$emit触发事件

非props的Attribute

常见的是class、style、id属性等

一、组件有根节点：自动传递到根节点的Attribute中。

二、禁用Attribute继承和多根节点

禁用根节点：
```javascript
export default {
  inheritAttrs: false
}
```
访问所有的非props的属性：$attrs
```vue
<div :class="$attrs.class"></div>
```
多根节点：需要手动指定绑定的属性
```vue
<h2 :id="$attrs.abc"></h2>
```
### 子传父
vue3中必须要emits提前注册需要传给父组件的事件
```javascript
exports defaults {
  emits: ["add", "sub"],
  // 也有对象写法，对象写法主要是为了进行参数的验证。
  emits: {
    addN: (arg1, arg2 ... ) => {
      if (arg1 > 10) {
        return true
      }
      return false
    }
}
```
### 非父子组件之间的通信
#### 1. Provide / Inject（子孙之间） 
   
非父子组件之间共享数据。
- 父组件通过provide选项来提供数据
- 子组件通过inject选项来使用数据
  
基本使用：
```javascript
// 父组件
export default {
  provide: {
    name: "why",
    age: 18,
  }
}
```
```javascript
// 子组件
export default {
  // 需要在这里注入
  inject: ["name", "age"]
}
```
注意：
- 如果provide内想要拿到data内的值需要将provide写成函数，返回对象
```javascript
  provide: {
    // 这里的this指向script标签，为undefined
    length: this.names.length,
  },
  provide () {
    // 这里的this指向provide
    return {
        length: this.names.length
    }
  },
  data() {
    return {
      names: ["abc", "cba", "nba"],
    }
  },
```
- 如果provide内的数据想要是响应式的，引入computed
```javascript
// 父组件
import { computed } from 'vue'
  
export defaults {
    provide () {
    return {
       length: computed(() => this.names.length)
    }
  }
  // computed返回的是一个对象，值保存在对象里的value
}
```
```javascript

// 子组件
<div>HomeComponent: {{ length.value }}</div>
export defaults {
        inject: ["length"]
}
```
#### 2. Mitt全局事件总线
   vue3移除了$on、$off、$once，如果需要使用全局事件总线，要通过第三方库：
- 官方推荐：mitt 或 tiny-emitter
  
使用过程：
1. 安装
```javascript
npm install mitt
```
2. 封装 eventBus.js
```javascript
import mitt from 'mitt'
const emmiter = mitt()
export default emmiter
```
3. 发射事件
- 引入
```javascript
import emmiter from "./utils/eventBus";
```
- 事件
```vue
<button @click="btnClick"></button>
```
- 发射
```javascript
export default {
  methods: {
    btnClick() {
      console.log("about按钮打印");
      emmiter.emit("why", { name: "why", age: 18 });
    }
  }
}
```
4. 监听发射事件
- 引入
```javascript
import emmiter from "./utils/eventBus";
```
- 引入
```javascript
export default {
  created() {
    emmiter.on(WHY_EVENT, (info) => {
      console.log(info)
    })
  }
}
```
5. 移除事件
```javascript
emmiter.off(事件，回调函数)
```
总结：

1. 安装mitt
2. 封装mitt
3. 引入mitt
4. 发射：.emit(事件， 参数)
5. 监听：.on(事件， 回调函数)