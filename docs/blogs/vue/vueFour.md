---
title: vue(四)
date: 2021-11-02
sidebar: 'auto'
categories: Vue
tags: 
    - vue
    - 前端
public: true
---

## 十、VueX

是Vue应用程序开发的状态管理模式。

采用**集中式存储管理**应用的所有组件的状态。

状态管理模式：多个组件共享的变量全部存储在一个对象里面，将这个对象放在顶层Vue实例，让其他组件可以使用。

VueX是响应式的。

##### 管理什么状态？

需要在多个页面共享的状态。比如用户状态、地理位置、头像、商品收藏、购物车中的物品等



#### 多页面的状态管理

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-eJKEPjIw-1630630927177)(C:\Users\HeJingWang\Downloads\未命名文件 (2)\].png)](https://img-blog.csdnimg.cn/3b2dea9836b342dfadce2e6e3d98f598.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_7,color_FFFFFF,t_70,g_se,x_16)


1. 安装VueX：

```js
npm install vuex --save
```

2. 新建一个文件夹store,创建index.js

index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

// 1. 安装插件
Vue.use(Vuex)

// 2. 创建对象
const store = new Vuex.Store({
  // 保存状态
  state: { },
  mutations: { },
  actions: { },
  getters: { },
  modules: { }
})

// 3. 导出store共享
export default store

// 4. 去main.js里面导入并挂载

// 5. 挂载后会给Vue.prototype.$store = store
```

main.js

```js
import Vue from 'vue'
import App from './App'
import store from "./store";

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
```

3. 使用

```js
<h2>{{$store.state.counter}}</h2>
```

### Vuex核心：

- State
- Getters
- Mutation
- Action
- Moudule
![在这里插入图片描述](https://img-blog.csdnimg.cn/295204686eb747afa51e41d855a10f9a.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_14,color_FFFFFF,t_70,g_se,x_16)





#### vuex的state

单一状态树（单一数据源），保存状态相关信息

```js
const store = new Vuex.Store({
  // 保存状态
  state: { 
  	counter: 0
  },
  mutations: { },
  actions: { },
  getters: { },
  modules: { }
})
```

使用值

```html
<h2>{{$store.state.counter}}</h2>
```



#### vuex的mutations

定义一些方法修改state里面的状态。vuex的store状态更新唯一方式。

Mutations包括两部分：

- 字符串的事件类型（type）
- 回调函数，回调函数的参数第一个参数state，第二个参数为传递过来的参数（payload）

```js
const store = new Vuex.Store({
  state: {
      counter: 100
  },
  mutations: {
      // 事件类型：increment，回调函数参数state
    increment(state) {
      state.counter++
    },
    incrementCount(state, count) {
      state.counter += count
    },
  }
})
```

使用

this.$store.commit('方法名')

```js
this.$store.commit('increment')
this.$store.commit('increment'， 15)
```

##### 提交风格：

- 上述代码都是commit普通提交风格
- type类型提交

```js
this.$store.commit({
    type: 'increment',
    // 这里的count传递的是整个对象
    count: 值
})
```

##### Mutations的响应规则：

Vuex的store中的state是响应式的, 当state中的数据发生改变时, Vue组件会自动更新.

**必须遵守一些Vuex对应的规则:**

1. 提前在store中初始化好所需的属性.
2. 当给state中的对象添加新属性时, 使用下面的方式:
   1. 方式一: 使用`Vue.set(要修改的对象， 索引值， 修改后的值)`
   2. 方式二: 用心对象给旧对象重新赋值

**响应式原理：**

添加到state里的属性会被添加至响应式系统中，而响应式系统会监听属性的变化，当属性发生变化时，会通知所有界面中用到这些属性的地方，让界面发生刷新。

```js
updateInfo(state) {
      // 添加属性：Vue.set(要修改的对象， 索引值， 修改后的值)
      Vue.set(state.info, 'address', 'China')
      // 删除属性做不到响应式
      // delete state.info.age
      // 删除的话使用Vue.delete
      Vue.delete(state.info, 'age')
  }
```

##### Mutations常量类型 - 概念

**考虑下面的问题**

- 在mutation中, 我们定义了很多事件类型(也就是其中的方法名称).
  当我们的项目增大时, Vuex管理的状态越来越多, 需要更新状态的情况越来越多, 那么意味着Mutation中的方法越来越多.
- 方法过多, 使用者需要花费大量的经历去记住这些方法, 甚至是多个文件间来回切换, 查看方法名称, 甚至如果不是复制的时候, 可能还会出现写错的情况

**如何避免上述的问题**
在各种Flux实现中, 一种很常见的方案就是使用常量替代Mutation事件的类型.我们可以将这些常量放在一个单独的文件中, 方便管理以及让整个app所有的事件类型一目了然.

**具体怎么做**
我们可以创建一个文件: mutation-types.js, 并且在其中定义我们的常量.
定义常量时, 我们可以使用ES2015中的风格, 使用一个常量来作为函数的名称.

```js
// 新建一个文件 mutation-types.js 
export const UPDATE_INFO = 'UPDATE_INFO'
```

```js
// index.js 内容
import * as type from './mutation-types'

Vue.use(Vuex)

const store = new Vuxe.Store({
    state: {
        info: {
            name: 'qiuqiu', age: 18
        }
    },
    mutations: {
        [UPDATE_INFO] (state, payload) {
            state.info = {...state.info, 'sex': payload.sex}
        }
    }
})
```

```js
// App.vue内容
import {UPDATE_INFO} from './mutation-types'

export default {
    name: 'App',
    methods: {
        this.$store.commit(UPDATE_INFO, {sex: '女'});
    }
}
```

Mutations必须是同步函数原因：devtools将不能更好的追踪数据的变化。



#### vuex的Getter

数据经过某种变换显示的，类似于计算属性

getter的使用三种形式：

1. 普通形式，只有一个参数state

```js
const store = new Vuex.Store({
  state: {
    student: [
      {id: 110, name: 'why', age: 18},
      {id: 111, name: 'Janes', age: 22},
      {id: 112, name: 'corder', age: 30},
      {id: 113, name: 'su', age: 55}
    ]
  },
  getters: {
    filterAge(state) {
      return state.student.filter(value => value.age > 20)
    }
})
```

2. 两个参数，第一个state，第二个Getters本身

```js
filterAgeLength(state, getters) {
      return getters.filterAge.length
  }
```

3. 传入一个自定义参数，需要通过return函数获取参数

```js
    moreAges(state) {
      return age => {
        return state.student.filter(value => value.age > age)
      }
    }
```

使用

```html
<p>{{$store.getters.filterAge}}</p>
// 若有自定义参数则是
<p>{{$store.getters.moreAges(8)}}</p>
```



#### vuex的Action

类似于Mutation，但是是用来代替Mutation进行异步操作的。

**Action基本操作**

```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        addCount (state) {
            state.count++
        }
    },
    actions: {
        // 默认参数 context 上下文,这里的context代表了store
        // 所用数据修改都要在mutations中, 所以在actions中异步后, 也要去mutations中修改 
        // 在mutations中修改, 才能被devtools监控到
        addCount (context) {
            context.commit('addCount');
        }
    }
})
```

调用

```js
// 调用actions中的方法, 使用的是 dispatch
this.$store.dispatch('addCount');
```

**Action返回Promise**

```js
  actions: {
    // context: 上下文,这里的context则相当于store
    aUpdateInfo(context, payload) {
      return new Promise(((resolve, reject) => {
        setTimeout(() => {
          // 这里修改state数据必须要通过Mutation,所以需要去调用Mutation
          context.commit('updateInfo')
          console.log(payload);
          resolve('data success')
        }, 1000)
      }))
    }
  }
```

```js
    updateInfo() {
      this.$store
        .dispatch('aUpdateInfo', 'data')
        .then(res => {
          console.log(res);
        })
    }
```



#### vuex的Moudule

划分模块，针对不同模块进行不同的操作然后保存。

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  getters: { ... },
  actions: { ... }
}
const moduleB = {
  state: { ... },
  mutations: { ... },
  getters: { ... },
  actions: { ... }
}
            
const store = new Vuex.store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```

- 子模块里的store

```js
const moduleA = {
  state: {
    name: 'zs'
  }
}

// 使用
<h2>{{$store.state.a.name}}</h2>
```

- 子模块里的mutations

```js
const moduleA = {
  state: {
    name: 'zs'
  },
  mutations: {
    updateName(state, payload) {
       // 会先从store里面找，找不到就去模块里面
      state.name = payload
    }
  }
}
```

```js
updateName() {
     this.$store.commit('updateName', 'su')
}
```

- 子模块里的getters，这里可以有三个参数（state, getters, rootState）

```js
 getters: {
    fullName(state) {
      return state.name + '111'
    },
    fullName2(state, getters) {
      return getters.fullName + '222'
    },
    fullName3(state, getters, rootState) {
      return getters.fullName2 + rootState.counter
    }
  }
```

```js
<h2>{{$store.getters.fullName}}</h2>
<h2>{{$store.getters.fullName2}}</h2>
<h2>{{$store.getters.fullName3}}</h2>
```

- 子模块里的actions

```js
  actions: {
    aUpdateName(context) {
      setTimeout(() => {
        context.commit('updateName', 'wangwu')
      }, 1000)
    },
        
     // context参数完整写法,上述用了ES6的对象解构
    aUpdateName({state, commit, payload})
  }
```

```js
    aUpdateName() {
      this.$store.dispatch('aUpdateName')
    }
```



### 项目解构

```js
components文件夹  
store文件夹
  - index.js        -> 组装模块并导出 store的文件
  - actions.js      -> 根级别的 actions
  - mutations.js    -> 根级别的 mutations
  - modules            
      - aaaa.js     -> a模块  
      - bbbb.js     -> b模块 
```



## 十一、axios

### JSONP

在前端开发中, 我们一种常见的网络请求方式就是JSONP
使用JSONP最主要的原因往往是为了解决跨域访问的问题.
JSONP的原理是什么呢?
JSONP的核心在于通过script标签的src来帮助我们请求数据.
原因是我们的项目部署在domain1.com服务器上时, 是不能直接访问domain2.com服务器上的资料的.
这个时候, 我们利用script标签的src帮助我们去服务器请求到数据, 将数据当做一个javascript的函数来执行, 并且执行的过程中传入我们需要的json.
所以, 封装jsonp的核心就在于我们监听window上的jsonp进行回调时的名称.

##### JSONP封装

```js
let count = 1;
export default function originPJSONP (option) {
    // 1. 从传入的option中提取URL
    const url = option.url;
    
    // 2. 在body中添加script标签  
    const body = document.getElementsByTagName('body')[0];
    const script = document.createElement('script);
    
    // 3. 内部生成一个不重复的callback
    const callback = 'jsonp' + count++
    
    // 4. 监听window上的jsonp调用 
    return new Promise((resolve, reject) => {
        try {
            window[callback] = function (result) {
                body.removeChild(script);
                resolve(result);
            }
            const params = handleParam(option.data);
            script.src = url + '?callback=' + callback + params;
            body.appendChild(script);
        } catch (e) {
            body.removeChild(script);
            reject(e);
        } 
    }) 
}
```

```js
funciton handleParam (data) {
    let url = '';
    for (let key in data) {
        let value = data[key] !== undefinded ? data[key] : 
        url += '&${key}=${encodeURIComponent(value)}'
    }
    return url
}
```

### axios的特点

- 能够发送XMLHttpRequests请求
- 在node.js中发送http请求
- 支持Promise API
- 拦截请求和响应
- 转换请求和响应数据

### axios的使用

支持多种请求方式:

- axios(config)
- axios.request(config)
- axios.get(url, [config])
- axios.delete(url, [config])
- axios.head(url, [ config])
- axios.post(url, [data, [config]])
- axios.put(url, [data, [config]])
- axios.patch(url, [ data, [ config]])

1. #### 安装axios依赖

```js
npm install axios --save
```

2. #### axios的基本使用

```js
// main.js里面引入axios
import axios from "axios";

// 直接在main.js使用
axios({
  url: 'http://123.207.32.32:8000/home/multidata',
  method: 'GET'
}).then(res => {
  console.log(res.data.data);
})

axios({
  // 等同于：http://123.207.32.32:8000/home/data?type=pop&page=1
  url: 'http://123.207.32.32:8000/home/data',
  params: {
    type: 'pop',
    page: 1
  },
  method: 'GET'
}).then(res => {
  console.log(res);
})
```



### axios发送并发请求

axios.all，可以放入多个请求的数组。

axios.all可以将数组[res1, res2]展开为res1，res2

```js
// 并发请求
axios.all([axios(), axios()]).then(res => {
  
})
```

例子：

```js
axios.all([axios({
  url: 'http://123.207.32.32:8000/home/multidata'
}), axios({
  url: 'http://123.207.32.32:8000/home/data',
  params: {
    type: 'pop',
    page: 1
  }
})]).then(res => {
  console.log(res[0]);
  console.log(res[1]);
})
// 或者
.then(axios.spread((res1, res2) => {
  console.log(res1);
}))
```



### axios全局配置

```js
axios.defaults.baseURL = '123.207.32.32:8000'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 5000
```

[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-6f6ThREL-1630630927178)(C:\Users\HeJingWang\AppData\Roaming\Typora\typora-user-images\image-20210822214839397.png)]



### axios的实例和模块封装

实例

```js
// 创建对应的axios实例
const instance1 = axios.create({
  baseURL: 'http://123.207.32.32:8000',
  timeout: 5000
})
instance1({
  url: '/home/multidata'
}).then(res => {
  console.log(res);
})
instance1({
  url: '/home/data',
  params: {
    type: 'pop',
    page: 1
  }
}).then(res => {
  console.log(res);
})

const instance2 = axios.create({
  baseURL: '',
  timeout: 1000
  // headers: {}
})
```

==在使用第三方框架的时候一定不可以有太强的依赖，最好进行封装。==

封装

```js
1. 创建一个新的文件夹network
2. 新建一个request.js
3. request.js内容（封装好的组件）

import axios from "axios";
export function request (config) {
    // 1. 创建axios的实例 
    const instance = axios.create({
        baseURL: 'http://111.222.33.44',
        timeout: 5000
    })
    // 2. 发送真正的网络请求
    // 返回的 instancel(config)就是一个promise
    return instancel(config)
}

4. 使用
request({
  url: '/home/multidata'
}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
})

```



### axios拦截器

axios提供了拦截器，用于我们在发送每次请求或者得到相应后，进行对应的处理

```js
export function request (config) {
    // 1. 创建axios的实例 
    const instance = axios.create({
        baseURL: 'http://111.222.33.44',
        timeout: 5000
    })
    
    // 2. axios拦截器 
    // config可以随便命名
    instance.interceptiors.request.use(config => {
        // 不返回, 调用的时候会进入err
        return config
    }, err => {      // 发送都没成功
        console.log(err);
    })
    
    // 3. 发送真正的网络请求
    return instancel(config)
}
```

**拦截器中做什么**

- 请求成功

1. 过滤一些信息
2. 每次请求后, 会展示loding图标
3. 某些网络请求(登录的token), 必须携带某一些特殊的信息

- 响应拦截

```js
instance.interceptors.resques.use(res => {
    return config
}, err => {
    console.log(err);
})
```