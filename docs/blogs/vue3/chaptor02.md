---
title: vue3（二）：基础语法
date: 2022-01-05
sidebar: 'auto'
categories: Vue3
tags:
  - vue3
  - 前端  
public: true
---


## setup函数
setup中不能使用this，因为它不会找到组件实例，setup的调用在data、computed、methods等解析之前。

1、 参数：
- props（父组件传递过来的属性）：直接使用即可
- context：包含三个属性attrs（所有非prop的属性）、slots（父组件传递过来的插槽）、emit（内部组件需要发出事件）
  
2、 返回值：可以在模板template中使用，通过setup的返回值来替代data选项
```vue
<script>
export default {
  setup(props, {attrs, slots, emit}) {
      ...
  }
}
</script>
```

## Reactive API
原理：proxy劫持 ，使用reactive函数处理以后，数据再次被使用时就会进行依赖收集，当数据改变时，所有收集到的依赖都是进行对应的响应式操作。
```vue
<template>
  <div>
    <h2>{{ state.counter }}</h2>
    <button @click="increment">+</button>
  </div>
</template>

<script>
export default {
  setup() {
    const state = reactive({
      counter: 0,
    });
    /** 这里的counter不是响应式的 */
    //   const increment = () => {
    //       counter++
    //   }
    const increment = () => {
      state.counter++;
    };
    return {
      state,
      increment,
    };
  }
}
</script>
```

## ref API
传入必须是一个数组或对象类型。

ref API返回的是一个可变的响应式对象，该对象作为一个响应式的引用维护着它内部的值。
它内部的值是在ref的value属性中维护的。
```vue
<template>
  <div>
      <!-- 当我们在模板中使用的时候，它会自动进行解析 -->
    <h2>{{ counter }}</h2>
    <button @click="increment">+</button>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    let counter = ref(0);
    const increment = () => {
      counter.value++;
    };
    return {
      counter,
      increment,
    }
  },
}
</script>
```
ref自动解包：这个解包是一个浅层解包；如果外层包裹的是reactive可响应式对象，那么内容的ref可解包。
```vue
<template>
  <div>
      <!-- 不会被解析 -->
    <h2>{{ info.counter }}</h2>
      <!-- 会被解析 -->
    <h2>{{ info.counter.value }}</h2>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    let counter = ref(0)
    const info = {
        counter
    },
    return {
      info,
    }
  },
}
</script>


<template>
  <div>
      <!-- 会被解析 -->
    <h2>{{ info.counter }}</h2>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  setup() {
    let counter = ref(0)
    const info = reactive({
        counter
    });
    return {
      info,
    };
  },
};
</script>
```
## readonly
readonly会返回原生对象的只读代理，它依然是一个proxy，这是一个proxy的set方法被劫持，并且不能对其进行修改。
```vue
 <template>
  <div>
    <button @click="updateState">+</button>
  </div>
</template>

<script>
import { reactive ,readonly } from "vue";
export default {
  setup() {
    const info = reactive({
        name: 'why'
    });
    const readylyInfo = readonly(info);
    const updateState = () => {
        readylyInfo.name = 'corderwhy'
    };
    return {
      updateState
    };
  },
}
</script>
```
> 改变值会报警告。

## toRefs、toref
toRefs对reactive返回的对象中的属性都转成ref
toRef对其中一个属性进行转换ref，建立链接
```vue
<template>
  <div>
    <h2>{{name}}</h2>
    <h2>{{age}}</h2>
    <button @click="updateState">+</button>
  </div>
</template>

<script>
import { reactive, toRefs, toRef } from "vue";
export default {
  setup() {
    const info = reactive({
      name: 'why',
      age: 18
    })
    
    let {name, age} = toRefs(info)
    let name = toRef(info, 'Name')

    function updateState () {
      age.value++
    }

    return {
      name,
      age,
      updateState
    }
  },
};
</script>
```

## customRef
创建自定义ref，并对其依赖项进行跟踪和更新触发进行显示控制。

customRef( function(track, trigger) )
并且返回一个带有get和set的对象

例子：ref实现
```vue
import { customRef } from "vue";
// 自定义ref
export default function (value) {
    // track: 什么时候收集依赖
    // trigger: 什么时候触发依赖进行更新
    return customRef((track, trigger) => {
        return {
            get () {
                track()
                return value
            },
            set (newValue) {
                value = newValue
                trigger()
            }
        }
    })
}
```
例子：双向绑定属性进行节流
```vue
import { customRef } from "vue";
// 自定义ref
export default function (value) {
    let timer = null
    // track: 什么时候收集依赖
    // trigger: 什么时候触发依赖进行更新
    return customRef((track, trigger) => {
        return {
            get () {
                track()
                return value
            },
            set (newValue) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    value = newValue
                    trigger()
                }, 1000)
            }
        }
    })
}

// 使用
import debounce from './hock/bounce'
export default {
  setup () {
    const message = debounce('hello world')

    return {
      message
    }
  }
}
```
## coumputed
```vue
<template>
  <div>
    <h2>{{fullName}}</h2>
  </div>
</template>

<script>
import {ref, computed} from 'vue'
export default {
  setup () {
    const firstName = ref('corder')
    const lastName = ref('why')
    // 传入一个getter，返回的是一个ref对象
    const fullName = computed(() => firstName.value + lastName.value)
    // 传入一个对象，含有setter和getter
    const fullName = computed({
      get: () => {
        firstName.value + lastName.value
      },
      set: (newValue) => {
        firstName.value = newValue
      }
    })
    return {
      fullName
    }
  }
}
</script>
```
## watchEffect
watchEffect：自动收集响应式的依赖, 会立即执行

**清除侦听**

**清除副作用：** 比如在开发中需要在侦听函数中执行网络请求，但是网络请求还没有达到的时候，我们九停止了侦听，那么侦听器被再次执行了，那么上一次的网络请求应该被取消掉，这个时候就可以清除上一次的副作用。
```vue
<template>
  <div>
    <h2>{{ message }}</h2>
    <button @click="changeMsg">改变message</button>
  </div>
</template>

<script>
// watchEffect：自动收集响应式的依赖, 会立即执行
import { ref, watchEffect} from 'vue'
export default {
  setup () {
    const message = ref(5)

    // 基本使用
    // watchEffect(() => {
    //   console.log(message.value)
    // })

    // 停止侦听
    const stop = watchEffect(() => {
      console.log(message.value)
    })
    
    // 清除副作用
    const stop = watchEffect((onInvalidate) => {
      // 这里的参数onInvalidate是一个函数
      onInvalidate(() => {
        // 在这个函数中清除额外的副作用
        request.cancel()
      })
      console.log(message.value);
    });
    
    // 执行时机
    watchEffect(() => {
      console.log(title.value)
    }, {
      // 默认pre提前执行，post为DOM挂载后执行
      flush: 'post'
    })

    
    const changeMsg = function () {
      message.value++
      if (message.value > 10) {
        stop()
      }
    }

    return {
      message,
      changeMsg
    }
  }
}
</script>
```
## watch
watch需要侦听特定的数据源，并在回调函数中执行副作用。

默认情况下是惰性的，只有当被侦听的源发生变化才会执行回调。

常用于侦听ref对象，如果是reactive需要进行某种转换。

1. 侦听watch，传入一个reactive对象
```javascript
    const info = reactive({
      name: 'why',
      age: 18
    })

    watch(() => info.name, (newVal, oldVal) => {
      console.log('olfVal', oldVal, 'newVla', newVal)
    })  
                // 语法糖写法
    watch(() => return {...info}, (newVal, oldVal) => {
      console.log('olfVal', oldVal, 'newVla', newVal)
    })  
```
2. 传入一个ref对象
```javascript
    const name = ref('kobe')

    watch(name, (newVal, oldVal) => {
      console.log('olfVal', oldVal, 'newVla', newVal)
    }) 
```
3. 监听多个数据源
```javascript
    watch([() -> ({...info}), name], ([newInfo, newVal], [oldInfo, newVal]) => {
      console.log(newInfo, oldVal, oldInfo, newVal)
    })  
```
4. 监听选项
   
```javascript
   watch([() -> ({...info}), name], ([newInfo, newVal], [oldInfo, newVal]) => {
   console.log(newInfo, oldVal, oldInfo, newVal)
   }, {deep: true, immediate: true})
```
源码内：几个if...else来判断watch监听的类型，分别是isRef，isReactive，isArray，isFunction
isReactive直接返回的是一个reactive对象，传入getter函数则会获得value的值本身（源码内是交给callWithErrorHandling处理）
isArray源码中是进行遍历的

## 获取DOM节点
```vue
<template>
  <div>
    <h2 ref="title">hhhh</h2>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
export default {
  setup() {
    const title = ref(null)

    watchEffect(() => {
      console.log(title.value)
    }, {
      // 默认pre提前执行，post为DOM挂载后执行
      flush: 'post'
    })

    return {
      title
    }
  },
};
</script>
```
## 插槽
### 具名插槽
```vue
    <div>
        <div class="header">
            <slot name="header"></slot>
        </div>
        <div class="main">
            <slot name="main"></slot>
        </div>
        <div class="footer">
            <slot name="footer"></slot>
        </div>
    </div>
                // 使用
    <my-slot-bar>
      <template v-slot:header>
        <button>我是header</button>
      </template>

      <template v-slot:main>
        <h2>我是main</h2>
      </template>

      <template v-slot:footer>
        <i>我是footer</i>
      </template>
                // 动态插槽名
      <template v-slot:[footer]>
        <i>我是footer</i>
      </template>
                // 语法糖
      <template #header>
        <i>我是footer</i>
      </template>
    </my-slot-bar>
```
若不带name则会默认有一个default

### 作用域插槽
在vue中，父级模板内的内容都是在父级作用域中编译的；子级模板内的内容都是在子级作用域中编译的。

作用域插槽：一个组件被用来渲染一个数组元素时，我们使用插槽，并且希望插槽中没有显示每项的内容。
```vue
// slot组件
<template>
    <div>
       <template v-for="(item, index) in names" :key="item">
           <slot :item="item" :index="index"></slot>
       </template>
    </div>
</template>
// 父组件
    <my-slot-bar :names="names">
        <template v-slot="slotProps">
            <button>{{slotProps.item}}--{{slotProps.index}}</button>
        </template>
    </my-slot-bar>
// 简写：独占默认插槽
    <my-slot-bar :names="names" v-slot="slotProps">
      <button>{{ slotProps.item }}--{{ slotProps.index }}</button>
    </my-slot-bar>
```
## vue3已经移除了$children属性，保留了$parent,$root和$refs
## 生命周期
每个组件都会经历创建，挂载，更新，销毁的过程。
1. beforeCreated：组件还未创建出来，初始化事件和生命周期，向created过程中会初始化，创建出来一个组件实例。
2. created：初始化注入和响应性
3. beforeMount：挂载完成之前
4. mounted：挂载到DOM上完成
5. beforeUpdate：数据发生变化
6. updated：虚拟DOM重新渲染
7. beforeUnmounted：准备销毁
8. unmounted：真正销毁


