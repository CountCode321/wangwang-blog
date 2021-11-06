---
title: vue(一)
date: 2021-10-28
sidebar: 'auto'
categories: Vue
tags: 
    - vue
    - 前端
public: true
---

# VUE
## 一、概述

#### **vue特点：**

- **渐进式框架**：可以将Vue作为应用的一部分，带来更丰富的交互体验。如Core + Vue + router + Vuex
- **解耦视图**
- **可复用的组件**
- **前端路由技术**
- **状态管理**
- **虚拟DOM**


## 二、VUE基础

```vue
<div id="app">{{message}}</div>
<script>
	const app = new Vue({
        el: '#app',
        data:{
            message: 'Hello Vue'
        }
    })
</script>
```



#### 1、vue实例的options对象

- #### el    

类型：string | HTMLElement ， 挂载到元素

```vue
const app = new({
	el: '#app'
})
```

- #### data

类型Object | Function （组件中必须是一个函数）， Vue实例对应的数据

```js
const app = new({
	el: '#app',
    data: {
        msg: 'hello',
        movies: ['fsd', 'dasd']
    }
})
```

- #### methods

类型{[key:string]：Function} ， 定义方法

```vue
const app = new({
	el: '#app',
    data: {
        msg: 'hello',
        movies: ['fsd', 'dasd']
    },
	methods: {
		add() {...}
		sub:function() {....}
}
})
```

- #### computed

计算属性，使用: 需要将多个数据结合起来进行显示的时候

==计算属性会进行缓存，多次使用的话只会计算一次==

```vue
/* books: [
      {id: 101, name: "JS深入浅出", price: 90},
      {id: 102, name: "ES6深入浅出", price: 120},
      {id: 103, name: "Node深入浅出", price: 142},
      {id: 104, name: "C++深入浅出", price: 36},
   ]
*/ 

computed: {
   totalPrice:function () {
   let s =this.books.reduce((prev, cur) => {
          return prev + cur.price
    }, 0)
    return s
 }
}
// 显示
    <h2>{{totalPrice}}</h2>
```

**computed存在setter和getter**

一般来说不用set，因为我们要拿的是只读属性。

```vue
computed:function() {
	set:function(newValue) {
		...
	},
	get:function() {
		return this.firstName + ' ' + this.lastName
	}
}
```

- #### filters

过滤器

```vue
/* filters:{
	 showPrice() {
		...
	}
} */
<h2>{{totalPrice | showPrice}}</h2>
```



#### 2、vue指令

- #### v-for

循环遍历数据

```vue
<!-- 获取数组： -->
v-for=“（value，index）”
<!-- 获取对象：-->
v-for=“（value，key，index）”
```

==官方推荐, 使用v-for的时候, 加上一个 key属性
key的作用是为了高效的更新虚拟DOM
key要具有唯一性, 不然就没意义==

```vue
<li v-for="(item, index) in names" :key="item">{{index + 1}} - {{item}}</li>
```

- #### v-on

v-on：click=“ ”；绑定事件，简写：@click

若调用时想要获取event，则写为$event

```vue
<button v-on:click="add"></button>
```

**v-on修饰符**

| 修饰符               | 作用                     | 实际调用                |
| -------------------- | ------------------------ | ----------------------- |
| .stop                | 阻止事件冒泡             | event.stopPropagation() |
| .prevent             | 阻止默认事件             | event.preventDefault()  |
| {keyCode I keyAlias} | 监听某个键盘的键帽       | -                       |
| .native              | 监听组件根元素的原生事件 | -                       |
| .once                | 只触发一次回调           | -                       |

```vue
    <!-- 1. .stop的使用 -->
    <div @click="clickDiv">
        aaaa
        <button @click.stop="clickBtn">btn</button>
    </div>

    <!-- 2. .prevent的使用 -->
    <form action="baidu">
        <input type="submit" @click.prevent="submit">
    </form>

    <!-- 3. -->
    <input type="text" @keyup.enter="keyup">
```

- #### v-once

后面不需要跟任何表达式
表示元素和组件只渲染一次, 不会随着数据的改变而变化

```vue
<h2 v-once>{{msg}}</h2>
```

- #### v-html

后面往往跟一个string类型
会将string的html解析出来并渲染

```vue
// url: '<a href="http://www.baidu.com">baidu</a>'
<h2 v-html="url"></h2>
```

- #### v-text

与Mustache相似, 一般不用, 不灵活

```vue
<h2 v-text="message"></h2>
```

- #### v-pre

用于跳过这个元素和它子元素的编译过程, 用于显示原本的Mustache语法

- #### v-cloak

在某些情况下, 我们浏览器可能会直接显示出未编译的Mustache标签

- #### v-bind

作用: 动态绑定属性

```vue
<img v-bind:src="imgURL" alt="">
```

语法糖简写：**：**

：src    、   ：href

> **动态绑定class：**
>
> 1)  对象语法
>
> ```vue
> 1. <h2 v-bind:class="{类名1：bool，类名2：bool}">{{message}}</h2>
> 2. 实际开发中：
> /* data :{
> 		active:'active'
> 		isActive:true
> } */
> <h2 :class="{active: isActive}"></h2>
> 3. 
> /*  getClass() {
>         return {active: this.isActive}
>    }
> */
> <h2 :class="getClass()">{{message}}</h2>
> 
> ```
>
> 2）数组语法
>
> ```js
> 1. <h2 v-bind:class="[类名1，类名2]">{{message}}</h2>
> 2.
> /*  getClass() {
>          return [this.isActive]
>     }
>     */
> <h2 :class="getClass()">{{message}}</h2>
> ```
>
> **动态绑定style属性：**
>
> 1) 对象语法
>
> ```vue
> <h2 :style="{fontSize: font + 'px'}"></h2>
> ```

- #### v-if 、 v-else 、v-else-if

解决复用：使用key，并且key的值不一样

- #### v-show

  当条件为false的时
  v-if: 指令的元素, 不会渲染到dom中
  v-show: dom增加一个行内样式display: none

- #### v-model

绑定表单

==v-model实现双向绑定的原理：**v-bind绑定value属性和v-on绑定input事件**==

```vue
<div id="app">
    <input type="text" :value="message" @input="message = $event.target.value">
    {{message}}
</div>

cosnt app = new Vue({
    el: '#app',
    data: {
        message: '你好'
    }
})
```

###### v-model结合radio的使用

```js
<div id="app">
    <label for="male">
        <inout type="radio" id="male" value="男" v-model="sex">男
    </label>
    <label for="male">
        <inout type="radio" id="female" value="女" v-model="sex">nv
    </label>
    <h2>您选择的性别是: {{sex}}</h2>
</div>

cosnt app = new Vue({
    el: '#app',
    data: {
        sex: '男'
    }
})
```

###### v-model结合checkbox的使用

- 单选框

```vue
<div id="app">
    <label for="agree">
        <input type="checkbox" id="agree" v-model="isAgree">同意协议
    </label>
    <button :disabled="!isAgree">下一步</button>
</div>

    const app = new Vue({
        el: '#app',
        data: {
            isAgree: false
        })
```

- 多选框

```vue
 <input type="checkbox" value="篮球" v-model="hobbies">篮球
 <input type="checkbox" value="乒乓球" v-model="hobbies">乒乓球
 <input type="checkbox" value="羽毛球球" v-model="hobbies">羽毛球球
 <input type="checkbox" value="足球" v-model="hobbies">足球

const app = new Vue({
        el: '#app',
        data: {
            hobbies: []
        })
```

###### v-model结合select使用

- 下拉框单选

v-model绑定的是一个值
当选中option中一个时, 会将它对应的value赋值到mySelect中

```vue
<select v-model="mySelect">
    <option value="apple">苹果<option>
    <option value="orange">橘子<option>
    <option value="banana">香蕉<option>
</select>
<p>您最喜欢的水果: {{mySelect}}</p>
```

- 下拉框多选

v-model绑定的是一个数组
当选择多个值时,会将选中的option对应的value添加到数组mySelect中

```vue
<select v-model="mySelect" multiple>
    <option value="apple">苹果<option>
    <option value="orange">橘子<option>
    <option value="banana">香蕉<option>
</select>
<p>您最喜欢的水果: {{mySelect}}</p>
```

###### 值绑定(推荐)

含义: 动态的给value赋值
1 在前面的value中的值, 都是在定义input的时候直接给定的
2 但真实开发中, input的值可能是从网络获取或定义在data中的
3 可以通过v-bind:value动态的给value绑定值

```vue
   <label v-for="item in originFruits" :for="item">
        <input type="checkbox" :value="item" :id="item" v-model="checkFruits">{{item}}
    </label>

  const app = new Vue({
        el: '#app',
        data: {
            originFruits: ["苹果", "香蕉", "橘子", "榴莲", "荔枝"],
            checkFruits: []
        })
```

##### 修饰符

- lazy修饰符

前景: v-model默认是在input事件中实时同步输入框的数据的 (容易同步的过于频繁 )
作用: 可以让数据只有在失去焦点或回车时才会更新

```vue
<input type="text" v-model.lazy="输入">
```

- number修饰符

前景: 默认情况下, 在输入框中无论输入字母还是数字, 都会被当做字符串类型进行处理
作用: 当做数字类型进行处理

- trim修饰符

前景: 输入的内容首位容易有空格
作用: 可以过滤掉内容左右两边的空格



#### 3.、MVVM

Model View View Model

![在这里插入图片描述](https://img-blog.csdnimg.cn/b857fb6e8f3e4a97874c2d482ff3b47d.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_20,color_FFFFFF,t_70,g_se,x_16)


**M： Model 数据模型**

数据层
数据可能是固定的思数据, 更多的是来自服务器, 从网络上请求下来的数据



**V: View 视图模板**

视觉层
在前端开发中, 通常是DOM层
作用: 是给用户展示各种信息



**VM： View-Model 视图模型**

视图模型层
是View和Model沟通的桥梁
一方面实现了Data Binding (数据绑定), 讲Model的改变实时的反应到View中
另一方面实现了DOM Listener (DOM监听), 当DOM发生一些时间 (点击, 滚动, touch等) 时, 可以监听到, 并在需要的情况下改变对应的Data



#### 4、Vue的生命周期

![在这里插入图片描述](https://img-blog.csdnimg.cn/2d22ba83c56649be97289aa3237b5ff8.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_20,color_FFFFFF,t_70,g_se,x_16)


#### 5、插值操作-mustache语法

##### mustache语法可以进行运算

- Mustache语法 (双大括号)
- 可以直接写变量
- 可以写简单的表达式

```vue
<h2>{{firstName + ' ' + lastName}}</h2>
<h2>{{firstName}} {{lastName}}</h2>
<h2>{{counter * 2}}</h2>
```

------

## 三、组件化开发

#### 组件的使用三步骤：

##### 1. 创建组件构造器  

调用Vue.extend( ) 方法

##### 2. 注册组件（全局注册、局部注册）

Vue.component( ) 方法 

 Vue.component('组件标签名',组件构造器)

##### 3. 使用组件

在Vue实例的作用范围内使用

<组件名></组件名>

```vue
<!-- 3. 组件的使用 -->
<div id="app">
    <my-cpn></my-cpn>
</div>

<script>
	// 1. 创建组件构造器对象
    const cpnConstructor = Vue.extend({
        template: `
            <div>
                <h2>我是标题</h2>
                <p>我是内容，哈哈哈哈</p>
            </div>`
    })
    // 2. 注册组件
    // Vue.component('组件标签名',组件构造器)
    Vue.component('my-cpn',cpnConstructor)
</script>
```

**创建组件构造器时有语法糖：**

Vue为了简化注册组件的过程, 提供了注册的语法塘, 省去了调用Vue.extend()的步骤. 而是可以直接使用一个对象来代替

```vue
// 全局组件
Vue.component('xxx', {
    template: '
    <div>
        哈哈哈哈
    </div>
    '
})

// 内部会自动调用Vue.extend()


// 局部组件
const app = new Vue({
    el: '#app',
    data: {
        meassage: '哈哈哈'
    },
    components: {
        'cpn': {
            template: '
                <div>
                    哈哈哈哈
                </div>
            '
        }
    }
})
```





### 全局组件和局部组件

- 全局组件（意味着可以在多个vue实例中使用）

```vue
上述代码
```

- 局部组件（用的最多）

  在vue实例的options里面添加一个components

  components: {

  ​	标签名：构造器名

  }

  ```vue
  <div id="app">
      <cpn></cpn>
  </div>
  
  const cpnC = Vue.extend({
          template: `
              <div>
                  <h2>Hello World</h2>
              </div>
          `
      })
  
  const app = new Vue({
          el: '#app',
          data: {
  
          },
          components: {
              // cpn使用组件时的标签名, cpnC是组件构造器
              cpn: cpnC
          }
  	})
  ```

### 父与子组件

在父组件中注册组件并使用组件

```vue
<!-- 子组件 -->
const cpnC1 = Vue.extend({
        template: `
            <div>
                <h2>我是标题</h2>
                <p>我是内容，哈哈哈哈</p>
            </div>
        `
    })

<!-- 父组件 -->
const cpnC2 = Vue.extend({
        template: `
            <div>
                <h2>我是标题2</h2>
                <!-- 父组件中使用 -->
                <cpn1></cpn1>
                <p>我是内容，呵呵呵呵</p>
            </div>
        `,
		<!-- 父组件中注册 -->
        components: {
            cpn1: cpnC1
        }
    })

```

父子组件的错误用法: 以子标签的形式在Vue实例中使用

1. 因为当子组件注册到父组件的components时, Vue会编译好父组件的模块
2. 该模块的内容已经决定了父组件将要渲染的HTML (相当于父组件中已经有子组件中的内容了)



#### 父传子通信props

- 写法一：数组方式（不推荐）

```vue
<div id="app">
  <cpn :books1="books"></cpn>
</div>

<template id="cpn1">
    <div>
        <h2>这是标题</h2>
        <h3>{{books1[0]}}</h3>
    </div>
</template>

const cpn = Vue.extend({
        template: '#cpn1',
        props: ['books1']
    })

    const app = new Vue({
        el: '#app',
        data: {
            books:["钢铁是怎样炼成的", "朝花夕拾", "su"]
        },
        components: {
            cpn
        }
    })
```

- 写法二

```vue
<div id="app">
    // 在使用组件的时候绑定
    // 不支持驼峰命名  cMovies要写成c-movies
    <cpm :c-movies="movies" :c-message="message"></cpn>
</div>

<template id="cpn">
    <div>
        <li v-for="item in cMovies">{{item}}</li>
        <h2>{{cMessage}}</h2>
    </div>
</template>


const cpn = {
    template: '#cpn',
    // 把数组里的当变量来看了
    props: {
        // 类型限制 
        // cMovies: Array,
        // cMeesage: String,
        
        // 类型限制 + 提供一些默认值 or  required表示必传值,不然报错
        cMessage: {
            type: String,
            default: '哈',
            required: true
        },  
        cMovies: {
            type: Array, // 对象or数组类型的时候, 默认值必须是个函数
            default() {
                return {}
            }
        }
    }
    data () {
        return {}
    }
}

const app = new Vue({
    el: '#app',
    data: {
        meassage: '哈哈哈',
        movies: ['哈喽', '嗨', '哟哟']
    },
    components: {
        cpn
    }
})
```



#### 子传父自定义事件

this.$emit 发射事件

```vue
// 父组件模板
<div id="app">
    // 2.父组件监听一个事件
    // 不能写驼峰
    <cpm @itemclick="cpnClick"></cpn>
</div>

// 子组件模板
<template id="cpn">
    <div>
        <button v-for="item in categories" 
                @click="btnClick(item)">
            {{item.name}}
        </button>
    </div>
</template>


// 子组件
const cpn = {
    template: '#cpn',
    data() {
        return {
            categories: [
                {id: 'aaaa', name: '热门推荐'},
                {id: 'bbbb', name: '手机数码'},
                {id: 'cccc', name: '家用家电'},
                {id: 'dddd', name: '电脑办公'},
            ]
        }
    },
    methods: {
        btnClick(item) {
            // 要把item传给父组件
            // 1. 发送一个事件 (自定义事件)
            // 会把item当成默认的传到父组件去
            this.$emit('itemclick', item)
        ]
    }
}

// 父组件
const app = new Vue({
    el: '#app',
    data: {
        meassage: '哈哈哈'
    },
    components: {
        cpn
    },
    methods: {
        // 3. 父组件监听的事件 
        cpnClick(item) {
            console.log('成功了', item);
        }
    }
```



#### 父子组件通信-双向绑定

```vue
<div id="app">
    <cpn :number1="num1" :number2="num2" @num1change="num1change"></cpn>
</div>

<template id="cpn">
    <div>
        <h2>{{number1}}</h2>
        <input type="text" :value="dnumber1" @input="numqInput">
        <h2>{{dnumber1}}</h2>
    </div>
</template>

const app = new Vue({
        el: '#app',
        data: {
            num1: 1,
            num2: 0
        },
        methods: {
            num1change(value) {
                this.num1 = parseInt(value)
            }
        },
        components: {
            cpn: {
                template: '#cpn',
                props: {
                    number1: Number,
                    number2: Number
                },
                data() {
                    return {
                        dnumber1: this.number1,
                        dnumber2: this.number2
                    }
                },
                methods: {
                    numqInput(event) {
                        this.dnumber1 = event.target.value
                        this.$emit('num1change', this.dnumber1)
                    }
                }
            }
        }
    })
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-rUOOskdz-1630630927158)(C:\Users\HeJingWang\Desktop\秋招准备\vue\无标题.png)\]](https://img-blog.csdnimg.cn/7ba6870efa8e4a359a81b48457ad05a2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_19,color_FFFFFF,t_70,g_se,x_16)




可以通过watch监听,watch和data并列

```js
watch(newValue, oldValue) {
    ...
}
```



#### 父访问子  

- $children: 拿所有子组件
- $refs: 拿指定的子组件

```vue
<div id="app">
    // 必须加一个 ref="名字"
    <cpn ref="aaa"></cpn>
    <button @click="btnClick">按钮</button>
</div>

const app = new Vue({
        el: '#app',
        data: {
            message: '你好呀'
        },
        methods: {
            btnClick() {
                // 1. 通过$children 调用了showMessage方法
                this.$children[0].showMessage()
                // 2. 使用$refs(推荐) => 默认是一个空对象
             	this.$refs.aaa.showMessage()
            }
        },
        components: {
            cpn: {
                template: '#cpn',
                methods: {
                    showMessage() {
                        console.log('showMessage')
                    }
                }
            }
        }
    })
```



#### 子访问父

- $parent: 上一级父组件
- $root: 根组件

```vue
<div id="app">
    <cpm></cpn>
</div>

<template id="cpn">
    <div>
        <ccpn></ccpn>
    </div>
</template>

<template id="ccpn">
    <div>
        <h2>我是子组件</h2>
        <button @click="btnClick">按钮</button>
    </div>
</template>

const app = new Vue({
    el: '#app',
    data: {
        meassage: '哈哈哈'
    },

    components: {
        cpn: {
            template: "#cpn",
            data() {
               return {
                   name: '我是cpn的name'
               } 
            },
            conmponents: {
                ccpn: {
                    template: '#ccpn',
                    btnClick() {
                        // 1. 访问父组件$parent
                        // 不建议这么写, 一层套一层 复用性太差
                        console.log(this.$parent);  
                        console.log(this.$parent.name);  // 我是cpn的name
                        
                        // 2. 访问根组件 $root
                        console.log(this.$root.meassage);   // 哈哈哈
                    } 
                }
            }
        }
    }
})
```



### 插槽slot

组件的插槽为了让封装的组件更加具有扩展性。

抽取共性，保留不同。

#### 基本使用

1. 插槽的基本使用 <slot></slot>
2. 插槽的默认值 button <slot><button>按钮</button></slot>
3. 如果有多个值同时放入到组件进行替换时, 一起作为替换元素

```vue
<div id="app">
    <!-- 使用默认值替换 -->
    <cpn></cpn>
    <!-- 插槽替换的元素 -->
    <cpn><span>这是替换的内容呀</span></cpn>
    <!-- 多个元素 -->
    <cpn>
        <div>第一个元素</div>
        <p>第二个元素</p>
    </cpn>
</div>

<template id="cpn">
    <div>
        <div>这个是标题</div>
        <p>这个是内容</p>
        <!-- 放入插槽 -->
        <slot>默认值元素</slot>
    </div>
</template>

const app = new Vue({
    el: '#app',
    data: {
        meassage: '哈哈哈'
    },
    components: {
        cpn: {
            template: '#cpn'
        }
    }
})
```

#### 具名插槽

在多个插槽的情况下, 替换制定插槽的内容

```vue
<div id="app">
    <cpn><span slot="center">sususu</span></cpn>
</div>

<template id="cpn">
    <div>
       <h2>我是组件</h2>
        <slot name="left"><span>left</span></slot>
        <slot name="center"><span>center</span></slot>
        <slot name="right"><span>right</span></slot>
    </div>

</template>
```

#### 作用域插槽

父组件替换插槽的标签，但是内容由子组件来提供。

```vue
需求: 
1. 子组件中包括一组数据, num: ['1', '2', '3', '4', '5']
2. 需要在多个界面展示 
   某些界面是以水平方向展示
   某些界面是以列表形式展示
   某些界面直接展示一个数组 
3. 内容在子组件, 希望父组件告诉我们如何展示, 怎么办?
   利用slot作用域插槽就行了
   
<div id="app">
    <cpm></cpn> 
    <cpm>
        // 2. 获取子组件中的num
        <template slot-scope="slot">
            // 根据之前的起名来取  如 slot.aaa
            <span  v-for="item in slot.data">{{item}}</span>
        </template>
    </cpn> 
    <cpm></cpn> 
</div>

<template id="cpn">
    <div>
        // 1. slot定义  'data'可以随便起名 如 :aaa="num"
        <slot :data="num">
            <ul>
                <li v-for="item in num">{{item}}</li>
            </ul>
        </slot>
    </div>
</template>

const app = new Vue({
    el: '#app',
    data: {
        message: '哈哈哈'
    },
    components: {
        cpn: {
            template: '#cpn',
            data() {
                return {
                    num: ['1', '2', '3', '4', '5']
                }
            }
        }
    }
})
```