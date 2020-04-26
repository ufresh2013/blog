---
title: v-model
date: 2019-12-20 11:00:02
category: Vue
---
### 1. v-model的奇怪使用方法
```html
<!-- form.vue-->
<template>
    <org v-model="org"></org>
</template>

<script>
    import org from './org'

    export default {
        data () {
            return {
                org: ''
            }
        }
    }
</script>

```

```html
<!-- org.vue -->
<template>
    <input type="text" :value="value" @input="handleInput">
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
                default: ''
            }
        },
        methods: {
            handleInput (e) {
                this.$emit('input', val)
            }
        }
    }
</script>
```

- 父组件(index.vue)中的org实例上的`v-model`如何响应？



```js
this.$emit('input', val)
this.$emit('update:page')
```


- https://blog.csdn.net/WangYangsea/article/details/94474476
- https://juejin.im/post/5d70aed76fb9a06b04721ec3