---
title: vue(二)
date: 2021-10-30
sidebar: 'auto'
categories: Vue
tags: 
    - vue
    - 前端
public: true
---

## 四、模块化

常见的模块化规范：CommonJS、AMD、CMD、ES6里的Modules

#### CommonJS：

```js
   // 导出
   module.exports = {
       flag: true,
       test(a, b) {
           return a + b
       }
   }
   // 导入
   let {flag, test} = require('./aaa.js')
   let _ma = require('./aaa.js')
   let flage = _ma.flag
```

#### ES6模块化：

`export` 和 `import`

注意：script标签内需要设置属性

```js
// 导出
<script type="Module">
    let flag = true
	function sum(num1, num2) {
        return num1 + num2
    }
	// 方式一
    export {flag, sum}
    // 方式二
    export let height = 1.88
    // 方式三
    export function  sum(num1, num2) {
       return num1 + num2
    }
	// export defaule(只能有一个,导入者自己命名)
	const address = '北京市'
    export address
    // 此时的导入
    import add from '../add.js'
</script>

// 导入
<script>
    import {flag} from './aaa.js'
	// 统一全部导入
	import * as aaa from './aaa.js'
</script>
```



## 五、webpack

#### 概述

webpack是一个静态模块化打包工具。

**webpack依赖于node.js，node自带了软件包管理工具。**



#### 和grunt/glup对比

grunt/glup核心是task, 如果工程模块化简单，则使用进行简单的合并、压缩。

grunt/gulp更强调的是前端流程的自动化，模块化不是它的核心。

webpack更加强调模块化开发管理，而文件压缩合并、预处理等功能，是他附带的功能。



### webpack安装

node版本：10.13.0

- #### webpack全局安装和卸载

webpak安装：`npm install webpack@3.6.0 -g`

webpack卸载：`npm uninstall webpack -g`

- #### webpack局部安装 

```js
npm install webpack@3.6.0 --save-dev
```

--save-dev  是开发时依赖，项目打包后不需要继续使用。



### webpack使用

```js
webpack ./src/main.js ./dist/bundle.js
```

- 创建文件目录，src 和 dist，打包后的文件放在dist文件夹内
- 使用模块化导入导出，最后的html文件只需要引入dist文件夹内打包好的就可。



### webpack配置

1. 创建webpack.config.js文件

```js
// 为了动态获取打包后的路径, path 在node包里面 -- 看下面一段代码 装包
const path = require('path')

moudle.exports = {
    // 入口和出口
    entry: './src/main.js',
    output: {
        // path：动态获取路径
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}
```

2. node包

```js
// 初始化--生成
npm init

// 生成的文件可能有中文 / 符号  可以改名 
meetwebpack 

... 后面全部回车, 一路通过. OK就行  
... 生成 package.json文件

// package.json文件里面也有依赖的文件  
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/67920c526b344c5a8f8bf4e1b538ce2b.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/a7482c4623f948e5924a2ed3e5dcc13e.png)




3. package.json文件

```js
"version" -- 版本号  

// 本地安装webpack (之前是全局安装)  -- 开发时依赖  运行时依赖
npm install webpack@3.6.0 --save-dev

// 开发时依赖 (本地安装webpack后, 重新打开package.json文件会出现)
"devDependencies": {  
    "webpack": "^3.6.0"  
}

// 使用vue之后, 会有 (运行时依赖)
"dependencise": {
    "webpack": "^3.6.0"  
}

---

// 执行脚本的配置
"scripts": {
    "test": '',    
    "build": "webpack" 
}

npm run test
npm run build	// 执行本地的webpack
```



### CSS Less Img ES6转Es5 Vue 处理

>loader使用过程：
>
>1. 使用npm安装
>2. 在webpack.config.js中的module关键字下进行配置

- #### CSS的loader

main.js

```js
// 1. 使用commonjs的模块化规范  
const {add, mul} = require('./js/mathUtils.js')

// 2. 使用ES6的模块化的规范 
import {name, age} from "./js/info"

// 3. 依赖CSS文件  
require('./css/normal.css')
```

终端安装css-loader

```js
npm install css-loader@2.0.2 --save-dev
```

webpack.config.js

```js
const path = require('path')

module.exports = {
    // 入口和出口
    entry: './src/main.js',
    output: {
        // path：动态获取路径
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    // 添加如下内容
    module: {
        rules: [
            {
                test: /\.css$/,
                // css-loader只复制加载不负责解析
                use: [ 'css-loader' ]
            }
        ]
    }
}
```

然后再次打包！发现还是没有背景，因为css-loader只复制加载不负责解析

再次去官方安装style-loader

```js
npm install style-loader@0.23.1 --save-dev
```

然后在刚才添加的module里面添加

```js
    module: {
        rules: [
            {
                test: /\.css$/,
                // style-loader负责将样式添加到DOM中
                // 这里添加，使用多个loader时，是从右向左
                use: [ 'style-loader','css-loader' ]
            }
        ]
    }
```

- #### less文件处理

main.js

```js
// 1. 使用commonjs的模块化规范  
const {add, mul} = require('./js/mathUtils.js')

// 2. 使用ES6的模块化的规范 
import {name, age} from "./js/info"

// 3. 依赖CSS文件  
require('./css/normal.css')

// 4. 依赖less文件
require('./css/special.less')
```

终端安装less-loader

```js
npm install --save-dev less-loader@4.1.0 less@3.9.0
```

webpack.config.js

```js
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader','css-loader' ]
            },
            // 添加如下内容
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ]
    }
```

- #### 图片文件处理

安装url-loader

```js
npm install --save-dev url-loader@1.1.2
```

webpack.config.js

```js
    output: {
        // path：动态获取路径
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        // 文件打包好以后从哪里找
        publicPath: 'dist/'
    },

rules: [
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 当加载的图片小于limit时，会将图片编译成base64字符串形式
                            // 当加载的图片大于limit时，需要安装file-loader模块进行加载
                            limit: 8186   // (图片小于8kb)
                        }
                    }
                ]
            }
        ]
```

安装file-loader

```js
npm install file-loader@3.0.1 --save-dev
```

修改文件名

为防止重复：img/name.hash:8.ext	（8为hash值）,在webpack.config.js中添加如下内容。

```js
    options: {
     // 当加载的图片小于limit时，会将图片编译成base64字符串形式
     // 当加载的图片大于limit时，需要安装file-loader模块进行加载
             limit: 12000,
              name: 'img/[name].[hash:8].[ext]'
     },
```

- #### ES6语法处理

使用babel对应的loader

```js
npm install --save-dev babel-loader@7.1.5 babel-core@6.26.3 babel-preset-es2015@6.24.1
```

webpack.config.js

```js
   {
                test: /\.js$/,
                // exclude: 排除
                // include：包含
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            }
```



### 配置vue

安装运行依赖

```js
npm install vue --save 
```

main.js

```js
import Vue from 'vue'
new Vue({
     el: '#app',
     data:{
         message: 'Hello World'
     }
 })
```

**vue两个版本：**

runtime-only ：代码中不允许出现template

runtime-compiler：可以有template，因为有compiler可以编译解析

如果报这种错误：
![在这里插入图片描述](https://img-blog.csdnimg.cn/fc778ca7520f4b13a4f6a98b59871830.png)



**第一种版本解决方案：**

在webpack.config.js配置如下代码

```js
module.exports = {
    resolve: {
        // alias:别名
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
```

#### 

### vue最终使用方案

抽离页面：

main.js

```js
import App from './vue/App.vue'
new Vue({
     el: '#app',
    template: '<App></App>',
     data:{

     },
    methods:{

    },
    components:{
         App
    }
 })

```

App.vue

```vue
<template>
  <div>
    <div><h2>这里是vue</h2></div>
    <button @click="btnClick">点我</button>
    <h2 class="title">{{message}}</h2>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      message: 'Hello World'
    }
  },
  methods: {
    btnClick() {
      console.log('vue的button')
    }
  }
}
</script>

<style scoped>
.title {
  color: pink;
}
</style>
```

然后

1. 安装vue-loader 和 vue-template-compiler

```js
npm install vue-loader@15.4.2 vue-template-compiler@2.5.21 --save-dev
```

2. 配置webapck.config.js

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }
        ]
    }
}
```

3. 由于vue-loader的14版本以上需要安装plugin所以，我们去package.json中把vue-loader改成@13.0.0版本，然后运行`npm install`



## 六、webpack-plugin

loader：转换某些类型的模块，是一个转换器。

plugin：插件，是webpack本身的扩展，是一个扩展器。

> **使用过程：**
>
> 1. 通过npm安装需要使用的plugins
> 2. 在webpack.config.js中的<u>plugins</u>中配置插件

### - 添加版权的plugin

```js
const webpack = require('webpack')


moudule.exports = {
    ...
   plugins: [
        new webpack.BannerPlugin('最终版权归汪汪所有')
    ]
}
```

### - 打包HTML的plugin

发布时需要将index.html打包到dist文件夹下----HtmlWebpackPlugin

它可以自动生成index.html文件，也可以将打包的js文件，自动通过script标签插入到body中。

- 安装HtmlWebpackPlugin插件

```js
npm install html-webpack-plugin@3.2.0 --save-dev
```

- 修改webpack.config.js内的内容

```js
const htmlWebpackPlugin = require('html-webpack-plugin')

pluginsL [
    new htmlWebpackPlugin({
        template: 'index.html'
    })
]
```

此外需要删除之前在output中添加的publicPath属性，将根目录下的index.html文件改成只有div，
![在这里插入图片描述](https://img-blog.csdnimg.cn/76d0e63ff7d34388bf014afe08170a04.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_7,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/e39f1a7f981243d3b910134e896072d3.png)



### - js压缩的plugin

uglifyjs-webpack-plugin插件

- 安装插件

```js
npm install uglifyjs-webpack-plugin@1.1.1 --save-dev
```

- 修改webpack.config.js的配置

```js
const uglifyWebpackPlugin = require('uglifyjs-webpack-plugin')

    plugins: [
        new uglifyWebpackPlugin()
    ]
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/319a5455e14142ca9f9c029955ecd52b.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_11,color_FFFFFF,t_70,g_se,x_16)




### - dev-server 的搭建

1. ###### 安装

```js
npm install --save-dev webpack-dev-serve@2.9.1
```

devserver选项本身属性：

- contentBase:为哪个文件夹提供服务，默认是根文件夹
- port：端口号
- inline：页面实时刷新
- historyApiFallback：在SPA页面中，依赖HTML5的history模式

2. ###### 配置webpack.config.js

```js
// 修改webpack.config.js文件
module.exports = {
    ...
    devServer: {
        contentBase: './dist',
        inline: true
    }
}

// package.json文件中再配置一个scripts,  open参数表示直接打开浏览器 
"scripts": {
    ...
    "dev": "webpack-dev-server --open" 
}
```



### - webpack配置文件的分离

很多配置开发时需要, 发布时不需要,反之一样, 所以要做分离

1. 在build文件夹中, 建立一个base.config.js文件 --> 公共配置
2. 在build文件夹中, 建立一个dev.config.js文件 --> 开发配置
3. 在build文件夹中, 建立一个prod.config.js文件 --> 发布配置
4. 复制webpack.config.js文件内容 -> 上面三个文件
5. 按照区分 --> 进行文件夹内配置的删除
6. 装一个插件

```js
npm install webpack-merge --save-dev 
```

详情见：https://www.bilibili.com/video/av59594689?p=89 (9m)



## 七、Vue-cli
![在这里插入图片描述](https://img-blog.csdnimg.cn/27fef8aa3cfb4dc7abe0d6d54b210039.png)



CLI 是(Command-Line Interface) 命令行界面, 俗称脚手架
Vue CLI是官方发布的vue.js项目脚手架, 可以快速搭建vue开发环境以及webpack配置

Vue CLI 使用前提 - 安装node 安装webpack

### Vue-cli的使用

vue --version 查看vue版本

npm uninstall @vue/cli -g 卸载

npm install -g @vue/cli 安装

```js
// 安装Vue脚手架 
npm install -g @vue/cli  

// 上面安装的是Vue CLI3.0版本, 想要按照Vue CLI2的方式初始化项目时需要进行下列的命令 
// 拉取2.x模板
// 'vue init' 的运行效果将会跟 'vue-cli@2.x' 相同
npm install -g @vue/cli-init  

// Vue CLI2初始化项目  project -> 项目名称 英文
vue init webpack my-project

// Vue CLI3初始化项目 project -> 项目名称 英文
vue create my-project
```

### vue-cli 2

```js
// 创建Vue CLI2项目
vue init webpack vuecli2   

? Project name vuecli2 --> 项目名字
? Project description test vue cli2 --> 项目描述  
? Author  huqinxue --> 作者
? Vue build --> 详解看下面一段
? Install vue-router? (Y/n)  Y
? Use ESlint to lint your code? (Y/n) Y
  ? Pick an ESLint preset --> 选择ESlint的规范 Standard  
? Set up unit tests (Y/n)  --> 单元测试 
? Setup e2e tests with Nightwatch? (Y/n)  --> 端对端测试 
? Yes, use NPM
  Yes, use Yarn
```

#### 目录结构解析

![在这里插入图片描述](https://img-blog.csdnimg.cn/d9c720fa426248be9177dbbf5cf0443e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_15,color_FFFFFF,t_70,g_se,x_16)


#### runtime-compiler和runtime-only的区别?
![在这里插入图片描述](https://img-blog.csdnimg.cn/a6358c0bdec247bf994856e275c53871.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_20,color_FFFFFF,t_70,g_se,x_16)



－　**runtime-compiler的过程：**

template -》ast（抽象语法树）-》render -》虚拟DOM -》真实DOM

－　**runtime-only的过程：**（性能更高）

render -》vDOM -》真实DOM

==尽量使用runtime-complier==

```js
rebder函数的使用 (runtiome-only)

-- 使用方式一: 
return createElement('标签', '相关数据对象, 可不传', ['内容数组']) 

new Vue({
    el: "#app",
    render: (createElement) => {
        //render函数基本使用
        return createElement('div', {class: 'box'}, ['codewhy']) 
        //嵌套render函数
        return createElement('div', {class: 'box'}, ['codewhy', createElement('h2', ['标题啊'])]) 
    }
})

-- 使用方式二: 传入一个组件对象  
const cpn = Vue.component('cpn', {
    template: '<div>我是cpn组件</div>',
    data () {
        return {
            
        }
    }
})

new Vue({
    el: "#app",
    render: (createElement) => {
        return createElement(cpn) 
    }
})
```

**.vue中的文件里的template是被谁处理的？**

答：被vue-template-compiler解析成了render函数。



### vue-cli 3
![在这里插入图片描述](https://img-blog.csdnimg.cn/5afdb839dee14acb8d6299752be0c9c0.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_19,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/e0529b74bca24ad59afeb4b8b2ab3178.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d8f0198d66b24ffda72ce5a4bd8d63c3.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5LiN5oCV56eD5aS055qE56iL5bqP5aqb,size_18,color_FFFFFF,t_70,g_se,x_16)



#### vue-cli 3 和 vue-cli 2的区别

3 是基于 webpack 4 打造，2还是 webapck 3
3 的设计原则是“0配置”，移除的配置文件根目录下的，build和config等目录
3 提供了 vue ui 命令，提供了可视化配置，更加人性化
移除了static文件夹，新增了public文件夹，并且index.html移动到public中

```js
// 创建vue-cli 3
vue create my-project

? Please pick a preset:
> default (babel, eslint)
> Manually select features //手动选择功能
```

defalut路线：

```js
// 用哪个下载依赖
Pick the package manager to use when installing dependencies: 
  Use Yarn
> Use NPM
  
Vue CLI v3.0.0-alpha.5
✨  reating project in E:\git\note\my-project. // 创建项目
�  Initializing git repository... // 初始化git库
⚙  Installing CLI plugins. This might take a while... // 安装脚手架插件  

其实这个过程中还会判断你对npm/yarn源的连接速度，询问你是否切换至淘宝镜像
Your connection to the the default npm registry seems to be slow.
Use https://registry.npm.taobao.org for faster installation? 
 
完成之后我们可以看到除node_modules之外的目录结构变成了
│  package-lock.json
│  package.json
├─public
│      favicon.ico
│      index.html
└─src
    │  App.vue
    │  main.js
    ├─assets
    │      logo.png
    └─components
            HelloWorld.vue
```

Manually select feature路线

```js
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>( ) TypeScript
 ( ) Progressive Web App (PWA) Support
 ( ) Router
 ( ) Vuex
 ( ) CSS Pre-processors
 ( ) Linter / Formatter --> ESLint
 ( ) Unit Testing
 ( ) E2E Testing

PS: 空格选中/反选 回车确认 
 
看到可以自由组合现在所需的功能了。
创建的过程中会询问配置文件保存位置是config.js还是package.json，但是其中也是一些简单的配置

// 这些配置文件存放方式  
? Where do you prefer placing config for Bable, PostCSS, ESLint, etc,> (Use arrow keys)  
> In dedicated config files  --> 单独存放到一个文件   
  In package.json

// 刚刚自定义的配置是否需要保存一个模板 (下次会在创建后出现)  
// 可以删除的, 在.vuerc文件里  
// 文件后面有rc (run command 运行终端的意思)  
? Save this as a preset for future projects? (Y/n)
...

// 用哪个下载依赖
Pick the package manager to use when installing dependencies: 
  Use Yarn
> Use NPM
```

脚手架会默认创建git文件，里面是创建项目的全部。
