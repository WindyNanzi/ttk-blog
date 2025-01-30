# 阅读笔记 | vue-dev-server

> 若川-源码共读活动-第 11 期

## 1. 前言

我记得去年刚刚入职新公司的时候，公司的 `webpack` 还是 3.x 版本，启动项目时，需要花费接近 9 分钟，热更新需要 9 - 12 秒 🧐。后来冒着风险的情况下，我给 `webpack` 升级。参照别人的教程一步步来，顺手去掉原来项目 webpack.config.js 中埋下的小坑，给 `webpack` 升级到了 4.x。启动项目变成了 2 分钟左右，热更新变成了 2 秒左右。但感觉仍然是比较慢的。
那时候，vite 已经出了，于是去体验了一番，确实觉得很快，流畅，丝滑。不过没有想过去了解它的原理，借着这次川哥源码共读活动，阅读了 `vue-dev-server`，算是大致了解了一下原始的思想。这样简短的库看着相对没那么费力，还能有所收获。不知道川哥是怎么了解到这种库的，真是有心了。
话说毕业后，变得越来越懒于思考和学习了，或许是命运或许是真的实力不行，呆过的两家公司都不咋样，它们给予我了一些项目经验，我却很少在工作中感受到团队荣誉感与个人成就感。我能很清楚的知道自己在不断滑向「混吃等死」这个让人焦虑的结局，却也麻木的对此无感。参加川哥的源码共读活动，已是现在我浮躁的生活状态中为数不多还在觉得自己还算是有一点点努力的劲头，虽然我并不看好它能为我的生活带来更多的改变，不过，看到自己写的没人看的文章量一点点慢慢增加，也算一点点心灵慰藉吧。
​

![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640358508671-61482a3f-a6c1-4393-8a92-7316fb6b4d5b.png#clientId=ua5ef8cb8-ca95-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=444&id=u5012de9e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=700&originWidth=720&originalType=url&ratio=1&rotation=0&showTitle=false&size=717559&status=done&style=none&taskId=ucbfcdf07-2d54-4a1b-9799-755452af2e2&title=&width=457)

## 2. 概要

我读过 `vue-dev-server` 源码并手打了大部分代码之后，又去看了 vite 的部分代码想看看有什么练习。看得脑阔疼 🥲。弃之。简言之，`vue-dev-server` 或许是 vite 的原始想法吧，它可以解析 `.js` 文件与 `.vue` 文件。并且不需要将代码打包编译，而是通过 http 请求的方式来获取文件，或许正因为是这样，大大增加了项目的启动速度。而 vite 则在 `vue-dev-server` 的基础之上又做了更多的东西。

## 3. 正文

### 3.1 原理

我认为 `vue-dev-server` 源码中比较核心的有 3 个地方：

1. `<script type='module'></script>`： 保证了在浏览器上可以导入各个模块。`import` 语句会发起 http 文件请求，node 框架起的服务器处理这些请求。
1. `@vue/component-compiler`：它保证了 `.vue` 文件可以被正确编译，同时也可以通过一定处理生成 `SourceMap`
1. `recast`: 可以将 js 代码解析为 AST（抽象语法树），并在此基础之上对代码节点进行一定的操作。通过一定的处理可以保证如 `import Vue from 'vue'` 这样在浏览器无法正确识别的语句能够被正确执行。

**​**

### 3.2 流程

代码涉及的文件相对较多，不过拆分为较大的流程模块来说，还是比较清晰的。

### 3.3 源码分析

#### 3.3.1 启动

启动没什么特别需要说明的，用 koa 和用 express 都很像，区别在于对静态资源路径的处理。需要提的是项目执行 `yarn test` 命令时，专门 `cd test` 然后启动服务，为的就是方便静态资源路径的处理，它对应了 `process.cwd()` 这行语句。

```javascript
const app = new Koa();
const root = process.cwd();
app.use(vueMiddleware());
app.use(KoaStatic(root, { extensions: ['html'] }));
```

#### 3.3.2 LRU cache

`vue-dev-server` 中专门用到一个库 `lru-cache`。在 `vueMiddleware` 中，它主要负责缓存部分文件请求返回的对象，下次再次访问这个文件的时候，便会在缓存中询问一遍，假如文件没有更新，那就返回缓存中的对象。
采用 `lru-cache` 应该是出于性能考虑，缓存文件数量太大，性能与内存也吃不消，而 最近最久未使用 也符合页面逻辑处理。它在应用中应该是这样一种场景，当项目中的文件请求已经超过了 500，那么最近最久为使用的文件会被优先踢出缓存中，这符合开发的习惯。

```javascript
cache = new LRU({
  max: 500,
  length: (n, key) => n * 2 + key.length,
});
```

文件对象缓存逻辑与获取缓存逻辑。获取时，会通过 `fs.stat` 经过了 `util.promisify` 后的函数获取到文件更新时间，假若文件更新了，那么获取缓存失败，这时会进行对该路径文件进行额外处理，生成新的缓存对象。

```javascript
// 源码中实例：
out = await tryCache(key);
if (!out) {
  const result = await readSource(request);
  out = transfromModuleImports(result.source);
  cacheData(key, out, result.updateTime);
}

// 存储
function cacheData(key, data, updateTime) {
  const old = cache.peek(key);

  // 存储基本为文本，所以可以对比
  if (old != data) {
    cache.set(key, data);
    if (updateTime) time[key] = updateTimeTime;
    return true;
  } else return false;
}

// 获取
async function tryCache(key, checkUpdateTime = true) {
  const data = cache.get(key);

  if (checkUpdateTime) {
    const cacheUpdateTime = time[key];
    // 获取文件的更新时间 stat 是 fs.stat 通过 util.promisify 后的函数
    const fileUpdateTime = (
      await stat(path.resolve(root, key.replace(/^\//, '')))
    ).mtime.getTime();
    if (cacheUpdateTime < fileUpdateTime) return null;
  }

  return data;
}
```

#### 3.3.3 vueMiddleware 请求处理：

实际上就是对文件请求做了一下分类处理，根据请求的文件路径，判断它到底属于是什么样的文件，然后对其进行相应的处理。
下面的代码是仿照源码用 Koa 写的一个翻版，语法上其实只有细微差别，需要注意的是：

1.  `await next()` ，不加这个 await , 静态资源会找不到
1.  在判断是否是请求 npm package 类型时，获取文件缓存对象时的语句是：`tryCache(key, false)` ，结合上边 `tryCache` 源码，可知道这样就不会去关心文件的更新时间了，很合理，因为 node_modules 路径下的文件是基本不会改动的。

```javascript
import parseUrl from 'parseurl';

const FILE_VUE = 'FILE_VUE';
const FILE_JS = 'FILE_JS';
const NPM_MODULE = 'NPM_MODULE';

function getReqTypeByReqPath(path) {
  if (path.endsWith('.vue')) {
    return FILE_VUE;
  } else if (path.endsWith('.js')) {
    return FILE_JS;
  } else if (path.startsWith('/__modules/')) {
    return NPM_MODULE;
  } else {
    return path;
  }
}

return async ({ request, response }, next) => {
  const reqType = getReqTypeByReqPath(request.path);
  const key = parseUrl(request).pathname;
  let out;
  switch (reqType) {
    case FILE_VUE:
      out = await tryCache(key);

      if (!out) {
        // Bundle Single-File Component
        const result = await bundleSFC(request);
        out = result;
        cacheData(key, out, result.updateTime);
      }

      send(response, out.code, 'application/javascript');
      break;
    case FILE_JS:
      out = await tryCache(key);
      if (!out) {
        const result = await readSource(request);
        out = transfromModuleImports(result.source);
        cacheData(key, out, result.updateTime);
      }

      send(response, out, 'application/javascript');
      break;
    case NPM_MODULE:
      const pkg = request.path.replace(/^\/__modules\//, '');
      out = await tryCache(key, false);
      if (!out) {
        out = (await loadPkg(pkg)).toString();
        cacheData(key, out, false);
      }

      send(response, out, 'application/javascript');
      break;
    default:
      await next();
  }
};
```

#### 3.3.4 transfromModuleImports

在 `yarn test` 命令执行后，实际上是把 test 目录作为了静态资源目录，再启动了服务器。这时我们访问 `localhost:3000` ，实际上访问的 html 文件是 test 目录下的 index.html:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Vue Dev Server</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import './main.js';
    </script>
  </body>
</html>
```

代码十分简短，js 代码只有一句，`import './main.js'` 它被放在 `<script type="module">` 下，这是浏览器中 js 能操作模块化语句的重要原因，此时假如再服务端代码打断点，可以发现断点会进入到对 js 文件的处理方法当中，说明 import 语句会对服务器文件发起请求，这就是 `vue-dev-server` 的核心原理之一。
以下代码是对 js 文件请求的处理：

```javascript
out = await tryCache(key);
if (!out) {
  const result = await readSource(request);
  out = transfromModuleImports(result.source);
  cacheData(key, out, result.updateTime);
}

send(response, out, 'application/javascript');
```

假如缓存中没有，则去 `readSource` , 实际这个方法功能就是拿取对应文件中的代码并转为字符串，请求中包含了路径，所以可以根据请求路径映射到对应文件路径。重点说说 `transfromModuleImports` 方法。以下是源码：

```javascript
const recast = require('recast');
const isPkg = require('validate-npm-package-name');

function transformModuleImports(code) {
  const ast = recast.parse(code);
  recast.types.visit(ast, {
    visitImportDeclaration(path) {
      const source = path.node.source.value;
      if (!/^\.\/?/.test(source) && isPkg(source)) {
        path.node.source = recast.types.builders.literal(
          `/__modules/${source}`,
        );
      }
      this.traverse(path);
    },
  });
  return recast.print(ast).code;
}

exports.transformModuleImports = transformModuleImports;
```

实际上这段源码并不容易读懂，尤其是我英语底子这么差，而 `recast` 文档中许多名词借助翻译工具并不是那么翻译得那么准确。借助了川哥写的文章【1】了解到，这玩意就是处理了 npm 包，比如 `import './main.js'` ，`main.js` 代码如下：

```javascript
import Vue from 'vue';
import App from './test.vue';

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

其中的 `import Vue form 'vue'` 是无法被浏览器正确解读的，**浏览器里的导入模块语句的 **`**from**`** 后边需要以 **`**/**`** or **`**./**`** or **`**../**`** 开头**
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640361345580-e5272553-ca94-4f1b-a450-5a5ec5a0ff93.png#clientId=ua5ef8cb8-ca95-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=309&id=Yx5MU&margin=%5Bobject%20Object%5D&name=image.png&originHeight=617&originWidth=1300&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56300&status=done&style=none&taskId=uf0438060-eeb9-429b-853b-f1b1d08bed8&title=&width=650)
所以 `transformModuleImports` 就是干了这么一件事，判断了 import 语句中， 不以 `/` or `./` or `../` 开头的且符合 npm 包命名规范的。给它加个前缀 `/__modules/`，返回这样处理后的代码：
​![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640407672371-48ce44fd-4d0f-4fe0-bef9-6336fe3c0fdc.png#clientId=ua5ef8cb8-ca95-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=220&id=JUxUf&margin=%5Bobject%20Object%5D&name=image.png&originHeight=259&originWidth=526&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22637&status=done&style=none&taskId=u164f4a0e-3280-43a8-92df-5a59d728117&title=&width=447)
这样处理后的代码，浏览器能正确执行了，而以`/__modules/`开头的文件请求会被转到对 npm 包的处理：`loadPkg` 方法。
由于在了解 `recast` 的过程中，想到有没有其他语义化更好的 ast npm 包，或者说中文文章相关介绍得要更多一些的包。这样我来改造时，也就更理解这个机制了。还真让我给找到了，虽然我还不知道它具体有多大能耐，不过在改造时确实挺好用的。**GoGoCode。**
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640409520016-e68b7a91-bcdf-41a0-98bb-0f648d2b2af2.png#clientId=ua5ef8cb8-ca95-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=446&id=YxsUa&margin=%5Bobject%20Object%5D&name=image.png&originHeight=892&originWidth=1860&originalType=binary&ratio=1&rotation=0&showTitle=false&size=265076&status=done&style=none&taskId=u51b789a0-d358-449d-a481-96d78545a0b&title=&width=930)
一款国人开发的 AST 代码转换工具，由阿里妈妈团队开发。语法简洁清晰，文档对国人友好。我们用它来改造 `transformModuleImports` 方法，只需要这样就行：

```javascript
import $ from 'gogocode';
import isPkg from 'validate-npm-package-name';

export function transfromModuleImports(code) {
  // 创建 ast
  const ast = $(code);
  // 有条件的替换 $_$1 表示变量 1，
  ast.replace(`import $_$1 from '$_$2'`, (match) => {
    // match 大概长这样 { 1: {...}, 2: {...} }
    // match[2] 对应着 $_$2
    const source = match[2][0].value;
    if (!/^\.\/?/.test(source) && isPkg(source)) {
      return `import $_$1 from '/__modules/${source}'`;
    } else {
      return `import $_$1 from '$_$2'`;
    }
  });

  // 生成代码字符串
  return ast.generate();
}
```

官网中介绍它还有其他许多厉害的功能，比如教你如何把 vue2 项目升级为 vue3 等，我觉得是个很不错的库。
​

#### 3.3.5 loadPkg

其实 `loadPkg` 代码还是很容易能看懂的，因为 `vue-dev-server` 只是个半成品，甚至只能说是个玩具，所以 `loadPkg` 实际上只处理了 `vue` 这个包（拿到 `vue`项目打包编译后针对浏览器的那个 js 文件） 其他包根本没管。😃
源码中需要注意的是怎么通过** 字符串**`**vue**`，拿到\*\* **`**vue**`** 模块 \*\*所在的路径，用的方法是 `require.resolve` 查询`vue`模块的完整路径，再通过 `path.dirname` 模块所在文件夹的路径，最后返回指定的 js 文件。而其他模块在这个项目中未作任何处理，不过方法应该是类似的，只是需要做好兼容适配处理。

```javascript
const fs = require('fs');
const path = require('path');
const readFile = require('util').promisify(fs.readFile);

async function loadPkg(pkg) {
  if (pkg === 'vue') {
    const dir = path.dirname(require.resolve('vue'));
    const filepath = path.join(dir, 'vue.esm.browser.js');
    return readFile(filepath);
  } else {
    // TODO
    // check if the package has a browser es module that can be used
    // otherwise bundle it with rollup on the fly?
    throw new Error('npm imports support are not ready yet.');
  }
}

exports.loadPkg = loadPkg;
```

在我重写时，想把所有文件都写成 ESModule 的形式，使用 import 语法，而不是 require 语法。发现不知道咋解决 `require.resolve`，最终通过查阅【2】发现可以使用以下语法来替代原来的`require`（`import.meta.resolve` 无效，或者是我用的方式有问题，我没找到解决方案）:
​![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640411911669-ef8c0292-9ff9-4149-b4b2-e8e226b126cf.png#clientId=ua5ef8cb8-ca95-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=237&id=u30d64ed6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=474&originWidth=931&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52329&status=done&style=none&taskId=ud3351dd0-e7e6-4d94-b6dc-a77749fa968&title=&width=465.5)

```javascript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
```

上边的代码，生成的 `require` 同样有 `resolve` 方法，于是，重写的代码可以被正确执行了。在周边的文章中了解到它其实和 cjs 中的 `require` 功能似乎是差不多的，这让我想起之前源码阅读第 3 期中想到的一个问题：

> 假如在 package.json 配置了 "type": "module" 时，此时，在 js 文件中使用 import('../package.json') 时，是无法 像 require 函数一样去解析 json 文件的，如何方便的获取到 package.json 的字段数据呢？

这在当时，采用了 `fs.readFileSync` + `JSON.parse` 的方法，那么现在看来，似乎又有了新的方法，构造出来的 `require` 是可以直接解析 json 文件的。看起来似乎是个不错的替代方案。不过也有人指出【3】这样的写法， Webpack 与 Rollup 并不知道该怎么处理 createRequire 的类型。所以在具体项目中使用还需慎重。
​

#### 3.3.6 bundleSFC

实际上对 `.vue` 文件的处理来源于 `@vue/component-compiler` 这个包提供的 api ，不论是编译出的代码亦或是 `sourcemap`, 假如要深入了解的话，估计又是一篇大文章，因此没做更多研究，重写时，这个方法照搬着使用。

## 4. 心得

本次文章在技术方面还是有些新的收获：

1. 了解了 `vue-dev-server` 的工作思想：利用了 `<script type='module'></script>` 的特性，借助 `import` 会发起文件请求这个特点，搭建服务器，处理不同类型的文件请求。
1. 大学时接触过编译原理，AST，时隔两年，再次以一种别样的方式被我使用。虽然只是浅层次的了解和 API 调用，但是从业前端以来，未曾想过自己会运用到相关的东西，平时仅仅是远远观望。gogocode 显然有比较大的潜力和研究价值。
1. 了解了一个在 ESModule 中替代使用 `require` 的 方法，虽然这个方法貌似还有未知的缺陷。
1. 了解了几个新的 npm 库和一些新见到的 nodejs 模块 api

​

拖延了一个星期再加几天，其实阅读这篇源码没那么费时间，不过，确实比较的懒和颓废呢。好算是最后模仿着重写了一遍，而且总结成自己能看懂的文章。在写文章时，听到川哥说起，「有同学读了 vue 发布的源码，优化了公司项目发布流程，获得了公司的微创新奖，1000 块钱」。那期我也花了较长时间，为了了解原理，我还重新用 ESModule 写了一遍后放到了 github 上，不过没在公司中使用。总体而言我觉得这事挺好的，虽然我断定我现在的公司肯定不会这么干，不过有所行动，本身就是一种值得鼓励的行为。我总是想的太多，而做的太少了。
![](https://cdn.nlark.com/yuque/0/2021/jpeg/283876/1640417508771-6c62a1bb-c1a7-4100-ba8e-89409187873b.jpeg#clientId=u30695093-2b40-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=452&id=u611d15b9&margin=%5Bobject%20Object%5D&originHeight=1920&originWidth=1440&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8e0e1c28-e625-49ac-bd41-f0f864dcdef&title=&width=339)

## 5. 引用

1. [《尤雨溪几年前开发的“玩具 vite”，才 100 多行代码，却十分有助于理解 vite 原理》](https://juejin.cn/post/7021306258057592862)
1. [do-require-resolve-for-es-modules](https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules)
1. [【译】Node 模块之战：为什么 CommonJS 和 ES Module 不能共存](https://zhuanlan.zhihu.com/p/179038296)​
