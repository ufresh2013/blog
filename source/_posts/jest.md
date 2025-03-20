---
title: 🤔 Jest运行前端单元测试
date: 2022-04-24 16:17:45
category: NodeJS
---

单元测试是对软件中的最小可测试单元在与软件其他部分相隔离的情况下进行的代码级测试。这里的最小可测试单元，通常指函数、接口。它们有明确的输入和输出，为了保证代码逻辑正确，我们需要列举所有输入，并检查它们的输出是否符合预期，来完成单测。

问题来了，前端都是UI组件，可以做单测吗？怎么测？要测什么？

其实为一个前端应用做单元测试和为函数、接口做测试，并没有什么明显的区别。想象一下，把用户的点击行为作为输入，把组件渲染出来的HTML作为输出，不就可以验证代码的正确性了吗！

所以，前端的单测用例，大概是这样的：
-   加载一个UI组件
-   检查组件渲染出来的HTML 是否符合预期
-   触发点击事件
-   检查是否调用了接口，调用参数是否正确
-   设定接口返回的数据
-   接口数据返回后，检查组件渲染出来的 HTML 是否符合预期
```js
import { mount } from '@vue/test-utils'
import api from '@src/api.js'
import Login from '../src/Login.vue'

describe('登录组件', () =>{
  const wrapper = mount(Login)

  it('点击登陆按钮', async() => {
    // 提前定义服务端返回内容
    jest
      .spyOn(api, 'login')
      .mockImplementation(() => {
          return Promise.resolve({ status: true })
      })

    // 模拟用户操作
    await wrapper.find('.button').trigger('click')

    // 检查调用API,调用参数是否正确
    expect(api.login.mock.calls[0][0]).toEqual({
      userName: 'Mike',
      passwork: '123456'
    })

    // 检查页面是否正常显示
    expect(wrapper.text()).toBe('登录成功')
  })
})
```

有非常多的工具和框架，可以辅助我们完成上述的单元测试，本文以 Jest 为例，讲一下前端单元测试如何编写和执行。


<br/>


### 1. Jest简介
Jest 是 Facebook 开源的一套用来创建、执行测试用例的 JavaScript 测试库。它提供一个独立的、具有浏览器上下文的Node进程来执行单元测试，同时集成了断言、Mock、Stub等 API 用于编写测试用例。为了说明白 Jest 是：
-   如何加载UI组件（项目代码）？
-   如何触发用户点击行为？
-   如何获取页面HTML？
-   如何检查一个函数有没有被调用，以什么样的参数被调用？

下面，我们实现一个简易版的 Jest !

<br/>

### 2.实现Jest

假设我们要跑一条单测用例，它是一个断言语句
```js
test.spec.jsexpect(2 + 2).toBe(4)
```

为了判断这条单测能否通过，我们需要
-   通过 `fs.readFile` 拿到 `test.spec.js` 里的代码片段 `code`
-   执行 `eval(code)`，代码片段 `code` 被执行
-   `try catch` 一下 `eval(code)`，没有报错则表示单测通过，catch 到 error 则表示单测不通过

```js
// index.js
const fs = require('fs');

async function runTest (testFile) {
  const code = await fs.promises.readFile(testFile, 'utf8');
  try {
    eval(code);
    console.log('Test Success')
  } catch (error) {
    console.log(`Test Fail: ${error.message}`)
  }
}

runTest('./test.spec.js')
```

<br/>

### 3.实现Expect
现在，我们在命令行里跑一下 `node index.js` , 会提示 `Test Fail: expect is not defined`。 代码片段被执行了，但是此时 node 环境里还没有 `expect` 方法，我们定义一个 `expect` 方法用于断言。
```js
// index.js
const fs = require('fs');

const expect = (received) => ({
  toBe: (expected) => {
    if (received !== expected) {
      throw new Error(`Expected ${expected} but received ${received}.`);
    }
    return true;
  },
});

async function runTest (testFile) {
  const code = await fs.promises.readFile(testFile, 'utf8');
  try {
    eval(code);
    console.log('Test Success')
  } catch (error) {
    console.log(`Test Fail: ${error.message}`)
  }
}

runTest('./test.spec.js')
```

当测试用例为`expect(2 + 2).toBe(4)`，执行 `node index.js`，可以看到打印出来的是 `Test Success`

我们把测试用例改成`expect(2 + 2).toBe(3)`，执行 `node index.js`，可以看到打印出来的是 `Test Fail : Expected 3 but received 4`

看，一个简易版 Jest 就跑起来了！!


可以看到，在 Node 环境里执行 `eval(code)`，当 `code` 是原生 JS 代码时，非常顺畅没有问题。但要知道，我们要跑的 `code` 是项目代码文件，那都是一堆是 `.vue` 文件, `.ts` 文件，里面有很多 Node 不支持的语法，如 `JSX, TypeScript,  Vue 模板`。

为了使 `eval(code)` 顺利执行，我们需要将项目代码转化成原生JS。至于怎么转化，这里就不详细解释。实际项目中，通过配置 `jest.config.js` 的 `tranform` 属性，Jest会帮我们完成转化。

```js
// jest.config.js
module.exports = {
    transform: {
        '.*\\.(vue)$': '@vue/vue3-jest', // 用@vue/vue3-jest将.vue文件里的代码编译成原生JS
        '^.+\\.js$': 'babel-jest', // 用babel-jest将.js文件里的代码编译成原生JS
        '^.+\\.ts$': 'ts-jest', // 用ts-jest将.ts文件里的代码编译成原生JS
    },
}
```
拿到了原生 JS 代码，也不代表 `eval(code)`可以顺利执行。前端代码中往往包含了大量的 `DOM` 操作。这些浏览器提供的 API 需要在 node 环境内提前定义好，才能保证 `eval(code)`顺利执行。

Jest 也在 Node 进程里内置了 `JSDom`，它会将` document` 对象、 `window` 对象、 其他 `DOM API`注入 `Node.js` 环境里，这样我们就可以在 V8 的上下文中编译和执行 js 代码。


有了上面的基础后，我们可以开始测试 UI 组件了!


<br/>


### 4.组件测试: Vue Util Test

文章开头说到：“把用户的点击行为作为输入，把组件渲染出来的HTML作为输出，是可以验证前端代码的正确性的。”

如何模拟输入？如何获取输出？

测试 UI 组件大多需要将它们挂载到 `DOM` (虚拟或真实) 上，才能完全断言它们是否正常工作。这里我们要用到 `Vue Test Utils`。它是 Vue 官方的偏底层的组件测试库，它允许在node进程里挂载 Vue 组件，模拟输入（用户点击， `prop`和注入），获取输出（当前组件渲染出来的HTML）。

你可以通过 `mount` 方法挂载组件，被挂载的组件会返回一个包裹器 `wrapper`。`wrapper`会暴露一系列 API，用于模拟用户点击行为，获取组件渲染出来的HTML。

`Vue Utils Test`提供的API示例如下
```
import { mount } from '@vue/test-utils'
import Login from './Login.vue'

// 挂载组件，得到Login组件的包裹器 wrapper
const wrapper = mount(Login)

// 模拟用户交互
wrapper.find('.button').trigger('click')

// 获取组件渲染出来的HTML
wrapper.html()
wrapper.text()

// nextTick
await Vue.nextTick()
```

运行环境准备好了，可以挂载Vue组件，可以模拟点击，可以获取组件渲染出来的HTML。

终于我们要写测试用例了!


<br/>

### 5.编写测试用例

测试用例，也称为驱动代码，用来调用被测代码，它是一个 输入数据 和 预计输出 的集合。

输入：
-   用户的点击行为、键盘操作
-   服务端返回的数据
-   需要判断的全局变量

输出：
-   页面显示
-   调用的JSAPI
-   调用参数

可以看到这个测试用例包含了这些要素
```js
import { mount } from '@vue/test-utils'
import api from '@src/api.js'
import Login from '../src/Login.vue'

describe('登录组件', () =>{
  // 挂载要测试的组件
  const wrapper = mount(Login)

  it('点击登陆按钮', async() => {
    // 【输入】提前定义服务端返回内容
    jest
        .spyOn(api, 'login')
        .mockImplementation(() => {
            return Promise.resolve({ status: true })
        })

    // 【输入】模拟用户点击
    await wrapper.find('.button').trigger('click')

    // 【输出】检查调用API,调用参数是否正确
    expect(api.login.mock.calls[0][0]).toEqual({
        userName: 'Mike',
        passwork: '123456'
    })

    // 【输出】检查页面是否正常显示
    expect(wrapper.text()).toBe('登录成功')
  })
})
```


<br/>

### 6.实现Mock
除了检查页面内容是否正确，服务端请求有没有发出去，发出去的参数是怎样的，也是一个很重要的检查内容。要想拿到这写输出数据，需要用到Mock。Mock的三个特性，能帮助我们完成这项检查
-   擦除函数的实际实现
-   设置函数返回值
-   捕获函数调用情况

<br/>

#### 6.1 jest.fn

为了捕获函数的调用情况，我们要用到`jest.fn`，它是一个高阶函数，它接收一个函数，并记录这个函数被调用时的参数,  this，函数返回值，并返回这个函数。

我们用 `jest.fn `包裹函数 `add `，一旦 `add `被调用，访问 `add.mock可以得到`该函数的调用情况，从而实现断言。

我们实现一个 jest.fn , 执行`node index.js` 来看看函数调用情况是怎样被记录的。
```js
// 实现一个jest.fn
// index.js
const jest = {
  fn: impl => {
    const mockFn = function(...args) {
      // Store the arguments used
      mockFn.mock.calls.push(args);
      mockFn.mock.instances.push(this);
      try {
        const value = impl.apply(this, args); // call impl, passing the right this
        mockFn.mock.results.push({ type: 'return', value });
        return value; // return the value
      } catch (value) {
        mockFn.mock.results.push({ type: 'throw', value });
        throw value; // re-throw the error
      }
    }

    mockFn.mock = {
      calls: [],
      instances: [],
      results: []
    }

    // 加个mockImplementation方法
    return mockFn
  }
}

// 用jest.fn包裹add函数
const add = jest.fn((x, y) => x + y)

// 调用add时，add.mock会记录调用时的参数，this值，返回值
add(2, 2)
console.log(add.mock)
// { calls: [[2, 2]], instances: [Window], results: [{ type: 'return', value: 4}] }
```

<br/>

#### 6.2 jest.spyOn

可是实际中，`jest.fn`并不常用。我们想监听的是写在项目里的方法的调用情况。

这时，我们需要用 `jest.spyOn`，`jest.spyOn(object, methodName)` 给现有对象里的函数添加 mock，当对象里的函数被调用时，访问 `object[methodName].mock` 可以获取该函数的调用情况。

实现jest.spyOn，要跟着一起敲，敲完就懂了
```js
jest.spyOn = (obj, prop) => {
  // 保留原始的obj[prop]
  const originFunc = obj[prop]

  // 给obj[prop]方法包裹一层jest.fn，并赋值替换
  obj[prop] = jest.fn(obj[prop])

  // mockRestore: 提供复原obj[prop]的方法
  obj[prop].mockRestore = () => (obj[prop] = originFunc)
  return obj[prop]
}

const api = {
  add: (x, y) => x + y
}

jest.spyOn(api, 'add')
api.add(2,2)
console.log(api.add.mock)
// { calls: [[2, 2]], instances: [Window], results: [{ type: 'return', value: 4}] }
```

有了这个方法，我们要mock项目代码里的方法，就可以这样写

```js
import api from '@src/api'jest.spyOn(api, 'login')
```

单测执行时，任意一个地方调用了api.login，它的调用情况就会被记录下来。

<br/>

#### 6.3 jest.fn.mockImplementation

除了监听函数的调用情况，很多时候，我们还希望可以直接指定函数的返回值。

这个时候，就要用到 `mockImplementation`。 我们需要改写一下前面定义的 jest.fn，给要返回出去的高阶函数，加上`mockImplementation` 方法，用于改变原函数的值。

```js
// 加个mockImplementation方法mockFn.mockImplementation = newImpl => (impl = newImpl)
```

`jest.fn.mockImplementation` 完整代码如下

```js
const jest = {
    fn: impl => {
        const mockFn = function(...args) {
            // Store the arguments used
            mockFn.mock.calls.push(args);
            mockFn.mock.instances.push(this);
            try {
                const value = impl.apply(this, args); // call impl, passing the right this
                mockFn.mock.results.push({ type: 'return', value });
                return value; // return the value
            } catch (value) {
                mockFn.mock.results.push({ type: 'throw', value });
                throw value; // re-throw the error
            }
        }

        mockFn.mock = {
            calls: [],
            instances: [],
            results: []
        }

        // 加个mockImplementation方法
        mockFn.mockImplementation = newImpl => (impl = newImpl)
        return mockFn
    }
}

jest.spyOn = (obj, prop) => {
    // 保留原始的obj[prop]
    const originFunc = obj[prop]

    // 给obj[prop]方法包裹一层jest.fn，并赋值替换
    obj[prop] = jest.fn(obj[prop])

    // mockRestore: 提供复原obj[prop]的方法
    obj[prop].mockRestore = () => (obj[prop] = originFunc)
    return obj[prop]
}

const api = {
    add: (x, y) => x + y
}

jest.spyOn(api, 'add').mockImplementation(() => 100)
api.add(2,2)
console.log(api.add.mock)
// 可以看到api.add()返回的值总是100
// { calls: [[2, 2]], instances: [Window], results: [{ type: 'return', value: 100}] }
```

到这里，几乎所有我们想要的输入输出都拿到了，单测也跑起来了


<br/>

### 7. 配置Stub
但还有一个问题，单测往往会跑到一些外部函数。而这个外部函数，在单元测试执行环境里未被实现，且是我们不感兴趣的代码，为了不影响自身逻辑的测试，我们可以用一个假的函数来代替真实的函数A，这就是stub。

一个 stub 就是简单的一段替身代码。stub在屏蔽与当前单元测试无关行为方面很有用，起到了隔离和补齐的作用，使被测代码能够独立编译、运行。

常见需要被stub的代码：
-   HTTP请求返回值
-   css文件、图片、字体文件
-   JSDom没有提供的浏览器API，如Worker, Canvas
-   其他可以忽略掉的组件，方法等等

实际项目中，可以通过配置 jest.config.js 中的 `moduleNameMapper `属性来指定你要 stub 的代码。


```js
// jest.config.js
module.exports = {
    moduleNameMapper: {
        '\\.(css|less|sass|scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/file-mock.js',
        '@src/api': '<rootDir>/api-mock.js'
    },
}

// file-mock.js
module.exports = 'file-stub'

// api-mock.js
module.exports = {
    getUserInfo: () => {
        return Promise.resolve({
            username: 'Mike'
        })
    },
    // ...
}
```

End.
