---
title: 官方教你手写一个100行代码的Webpack
date: 2021-12-22 15:08:59
category: NodeJS
---
> Webpack如何实现打包功能？<br/>最近看文章刷到这个[官方教学视频](https://www.youtube.com/watch?v=Gc9-7PBqOC8&list=LLHK1mTHpwrUeYgF5gu-Kd4g)，666啊，建议先进去看一看！


<br/>

### 1. 打包文件分析
首先webpack构建出的`bundle.js`长这样。整个代码是一个自执行函数，函数接收的是一个数组，数组的每一项是一个模块，它们也被一个函数包裹起来。
```js
(function(modules) {
  // 模拟require语句
  function _webpack_require__() {
  }
  // 执行存放所有模块数组中的第0个模块
  _webpack_require__[0]
})([/* 存放所有模块的数组 */module0, module1])

```

webpack如何处理`import`和`require`?
bundle.js能直接运行在浏览器中的原因在于输出的文件中定义了一个`_webpack_require__`函数，来模拟Node.js.中的`require`语句

<br/>

### 2. 实现一个简单的webpack
Webpack通过入口文件逐层遍历到模块依赖，进行代码分析，转换，最终生成可在浏览器运行的打包后的代码。
- 解析入口文件，获取AST
- 从AST中找到import生成，找出所有依赖模块
- AST转换为可执行的code
- 递归生成所有依赖项，生成依赖关系图
- 重写require函数，输出bundle（一个立即执行函数，一个require函数，所有module）
```js
const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const babel = require('babel-core')

let ID = 0

/* 
 * 解析文件，生成这个模块的code, 提取依赖
 * accept a path to a file, read its contents, and extract its dependencies
 */
function createAsset (filePath) {
  // 读取文件，生成ast
  const content = fs.readFileSync(filePath, 'utf-8')
  const ast = babylon.parse(content, {
    sourceType: 'module'
  })

  // 读取代码中的import声明，获取这个模块的依赖模块
  const dependencies = []
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value)
    }
  })

  // 将模块代码用babel-preset-env转一下
  const id = ID++
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['env']
  })

  return {
    id, // moduleId
    filePath, // filePath
    dependencies, // 模块依赖的模块
    code // 模块代码
  }
}


/*
 * 从入口文件，递归生成所有依赖
 * Now that we can extract the dependencies of a single module, we are going to
 * start by extracting the dependencies of the entry file.
 */
function createGraph (entry) {
  // entry: the main file of our application
  const mainAsset = createAsset(entry)
  const queue = [mainAsset]

  for (const asset of queue) {
    const dirname = path.dirname(asset.filePath)

    asset.mapping = {}
    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath)
      const child = createAsset(absolutePath)
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }
  return queue
}


/*
 * 生成bundle.js的code
 */
function bundle (graph) {
  let modules = ''

  // 传送module，使用了CommonJS的模块标准，他们需要require, module, exports这3个可用的方法
  // 因为浏览器不支持，所以我们会自己实现它

  // the code of each module wrapped with a function
  // This is because modules should be scoped
  // Defining a variable in on module shouldn't affect others of the global scope

  // When we transpile our modules, use the CommonJS module system
  // They expect a `require`, a `module` and an `exports` objects to be available
  // Those are not normally available in the browser 
  // so we will implement them and inject them into our function wrappers

  // For the second value, we stringify the mapping between a module and its dependencies. 
  // This is an object that looks like this:
  // { './relative/path': 1 }
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
    ],`
  })


  // 立即执行函数
  // 定义`require()`
  const result = `
    (function (modules) {
      function require(id) {
        const [fn, mapping] = modules[id]

        function localRequire (relativePath) {
          return require(mapping[relativePath])
        }

        const module = { exports: {} }

        fn(localRequire, module, module.exports)
        
        return module.exports
      }
      require(0)
    })({${modules}})
  `
  return result
}


const graph = createGraph('./entry.js')
const result = bundle(graph)
console.log(result)
```

我们写一个demo，执行`node bundle.js`
```js
// entry.js
import message from './message.js'
console.log(message)

// message.js
import { name } from './name.js'
export default `hello ${name}`

// name.js
export const name = '123'
```

输出的result，把代码放到浏览器控制台，执行后输出`hello 123`
```js
(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id]

    // lcoalRequire(relativePath) = require(moduleId)
    function localRequire (relativePath) {
      return require(mapping[relativePath])
    }

    // 定义module, moduleExport，执行模块内的代码，返回module.exports
    // 因此 require(id) 返回值是模块的module.exports
    const module = { exports: {} }
    fn(localRequire, module, module.exports)
    return module.exports
  }
  require(0)
})(
  {
    0: [
      function (require, module, exports) {
        "use strict";
        var _message = require("./message.js");
        var _message2 = _interopRequireDefault(_message);
        function _interopRequireDefault(obj) { 
          return obj && obj.__esModule ? obj : { default: obj }
        }
        console.log(_message2.default);
      },
      {"./message.js":1}
    ],
  1: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _name = require("./name.js");
      exports.default = "hello " + _name.name;
    },
    {"./name.js":2}
  ],
  2: [
    function (require, module, exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var name = exports.name = '111';
    },
    {}
  ],
})
```

### 参考资料
- [官方视频](https://www.youtube.com/watch?v=Gc9-7PBqOC8&list=LLHK1mTHpwrUeYgF5gu-Kd4g)
- [代码仓库](https://github.com/ronami/minipack/blob/master/src/minipack.js)
- [Webpack原理-输出文件分析](https://imweb.io/topic/5a4cce35a192c3b460fce39b)