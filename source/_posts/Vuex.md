---
title: Vuex
date: 2019-10-25 11:48:17
category: Vue
---
> 当多个视图依赖同一状态，来自不同视图的行为需要变更同一状态。我们可以把组件的共享状态抽取出来，以一个全局单例模式管理，任何组件都能获取状态或者触发行为。

Q: 什么时候用Vuex？
A: 多个组件依赖于同一状态时，如用户信息，菜单权限

Q: 获取Vuex中的state
```js
// 获取state状态

// 批量获取state状态
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState(['price', 'number']),
		total () {
			return this.$store.state.total
		}
	}
}

// getters: 从state中派生一些状态

```

Q: 从state中派生一些状态：`getters`和`mapGetters`
```js
const store = new Vuex.store({
	state: {
		price: 10,
		number: 10
	},
	getters: {
		total: state => {
			return state.price * state.number
		}
	}
}) 
```

### 1. 基本用法
```js
const store = new Vue.Store({
	state: {
		count: 0
	},
	mutations: {
		increment (state) {
			state.count++;
		}
	}
})

// 通过store.commit mutations触发状态变更
store.commit('increment')





```


#### 1.1 state 
- Vuex通过store选项，提供了一种机制将状态从根组件注入到每一个子组件中。
在子组件中，读取store状态最简单的方法就是在`computed`中返回。
也可以用`mapState`辅助函数帮助我们生成计算属性。
```js
import { mapState } from 'vuex';

const Counte = {
	template: '<div>{{ count }}</div>',
	computed: {
		// count() {
		//     return this.$store.state.count
		// },
		...mapState({
				count: state => state.count,
				// 为了能够使用 this 获取局部状态，必须使用常规函数
				countPlusLocalState (state) {
						return state.count + this.localCount
				}
		})
	},
	methods: {
			addCount() {
					this.$store.commit('increment')
			}
	}
}
```

#### 2. getter
- 从store中的state中派生出一些状态，可以在store中定义getter
像计算属性一样，getter的返回值会根据它的依赖被缓存起来，而且只有它的依赖值发生了改变才会被重新计算。
```js
getters: {
    doneTodos: state => {
        return state.todos.filter(todo => todo.done)
    }
}

computed: {
    doneTodos() {
        return this.$store.getters.doneTodos
    }
}
```

#### 3. mutation
更改vuex的store的唯一方法是提交mutation。它接受state作为第一个参数。你可以向store.coomit传入额外的参数
```js
mutations: {
    increment (state, payload) {
        state.count += payload.amount
    }
}

store.commit('increment', { amount: 10})
```


#### 4. action
Action函数接受一个与store实例具有相同方法和属性的context对象，因此你可以调用`context.commit`提交一个mutation，或者通过`context.state`和`context.getters`来获取state和getters。

```js
actions: {
    increment ({ commit }) {
        commit('increment')
    }
}

store.dispatch('increment')
```

store.dispatch可以处理被触发的action的处理函数返回的Promise，并且store.dispatch仍旧返回Promise。
```js
actions: {
    actionA({ commit }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('someNutation');
                resolve()
            }, 1000)
        })
    },
    actionB ({ dispatch, commit }) {
        return dispatch('actionA').then(() => {
            commit('someOtherMutation')
        })
    }
}

store.dispatch('actionA').then(() => {
    // ...
})
```


利用async/await，组合action
```js
actions: {
    async actionA({ commit }) {
        commit('gotData', await getData())
    },
    async actionB({ dispatch, commit }) { 
        await dispatch('actionA')
        commit('gotOtherData', await getOtherData())
    }
}

```

#### 5. Module
Vuex允许我们将store分割成模块，每个模块拥有自己的state, mutation, action, getter，甚至是嵌套子模块
```js
const moduleA = {
    state: {},
    mutations: {},
    actions: {},
    getters: {}
}

const store = new Vue.Store({
    modules: {
        a: moduleA,
        // ...
    }
})
```

模块内部的mutation和getter，接收的第一个参数是模块的局部状态对象
模块内部的action，局部状态通过context.state暴露出来，根节点状态则为context.rootState
```js
const moduleA = {
    actions: {
        increment({ state, commit, rootState }) {
            console.log(state.count);
            console.log(rootState.count)
        }
    }
}

```


#### 6. 表单处理
假设治理的obj是在计算属性返回的一个属于Vuex store的对象，在用户输入时，v-model会试图直接修改obj.message。在严格模式中，由于这个修改不是在mutation函数中执行的，这里会抛出一个错误。
```html
<input v-model="obj.message" />
```

解决方法：给`<input>`中绑定value，然后监听input的change事件，在事件回调中调用action
```html
<input :value="message" @input="updateMessage">
```

```js
computed: {
    ...mapState({
        message: state => state.obj.message
    })
},
methods: {
    updateMessage (e) {
        this.$store.commit('updateMessage', e.target.value)
    }
}

// mutation
mutations: {
    updateMessage (state, message) {
        state.obj.message = message
    }
}
```

或者使用setter属性，同步更新store数据
```js
computed: {
    message: {
        get () {
            return this.$store.state.obj.message
        },
        set (value) {
            this.$store.commit('updateMessage', value)
        }
    }
}
```

- 将状态和状态变更事件分布到各个子模块中



- [Vuex面试题汇总](https://juejin.cn/post/6844903993374670855)
