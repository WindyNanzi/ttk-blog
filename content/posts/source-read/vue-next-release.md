# 阅读笔记 | vue-next 是如何发布的

## 1. 前言

- 链接：[Vue 3.2 发布了，那尤雨溪是怎么发布 Vue.js 的？](https://juejin.cn/post/6997943192851054606)
- 作者：[若川](https://juejin.cn/user/1415826704971918)

​

本片文章参考以上链接的文章，由于从未了解过 `npm` 包的发布流程，平时也没有造轮子分享的欲望，所以从未了解过各个大佬们是如何对造成的轮子进行版本维护和发布的。本次阅读源码的过程中便希望能搞清楚一点，单单观看的记忆还是稍显浅薄，于是自己也跟着敲了一遍，实现了一个较小体积模拟这样一个发布流程的小项目：[【github】mini-release](https://github.com/WindyNanzi/mini-release) 中途还是了解了一些之前未曾涉及的知识点。
以下是项目运行的一点点小成果：

**dry 模式下执行 **`**release.js**`** 脚本：**
![release-dry.gif](https://cdn.nlark.com/yuque/0/2021/gif/283876/1638460574984-7b2baf78-639f-4fe0-9dc0-711f22aafc6f.gif#clientId=ub0b1b93a-7ba0-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=bW0MP&margin=%5Bobject%20Object%5D&name=release-dry.gif&originHeight=487&originWidth=1141&originalType=binary&ratio=1&rotation=0&showTitle=false&size=336728&status=done&style=none&taskId=u15295741-77de-40e1-a71c-21b3295b433&title=)
**直接执行 **`**release.js**`** 脚本：**
![release.gif](https://cdn.nlark.com/yuque/0/2021/gif/283876/1638460598269-06953b53-67ec-432c-8148-0314b556b516.gif#clientId=ub0b1b93a-7ba0-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ZQvyB&margin=%5Bobject%20Object%5D&name=release.gif&originHeight=487&originWidth=1141&originalType=binary&ratio=1&rotation=0&showTitle=false&size=994144&status=done&style=none&taskId=u6bd70c20-e611-446a-b7ee-e6ae87f8560&title=)

## 2. 概要

本次阅读的源码是 [vue-next](https://github.com/vuejs/vue-next) 项目下的 `scripts/release.js` 文件。若想在线阅读，则可以通过这个网址：[github1s.com/vuejs/vue-next](https://github1s.com/vuejs/vue-next/blob/master/scripts/release.js)。在 [vue-next](https://github.com/vuejs/vue-next) 的 `package.json` 中存在这样的配置：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1638535200843-75e69dea-f59a-47c4-9860-e7d351792dcb.png#clientId=ubcde2e02-28f4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=234&id=u5144d575&margin=%5Bobject%20Object%5D&name=image.png&originHeight=468&originWidth=1056&originalType=binary&ratio=1&rotation=0&showTitle=false&size=106822&status=done&style=none&taskId=ue7b795ee-a8e1-42bf-9ed9-31e4966344e&title=&width=528)
在阅读源码后可以了解到这其实就是尤大为了方便 `vue-next` 项目打包发版而写的脚本。
这里稍微提一句 `vue-next` 的项目目录结构和我自己工作中遇到的不一样，而且它采用了 `Monorepo` 的管理机制，我对这个了解较少，只能简单的描述为将 `vue-next` 项目又拆分成了各个小项目来管理（放在 `packages` 目录下），这些小项目的版本都跟随母项目变化而变化。
所以在我重新写了一遍简略版本的 `release.js` 之后，发现这个文件中有一大块代码其实就是在干一件事：**把 **`vue-next` **母项目和其 **`packages`** 目录下的子项目中的 **`package.json` **文件中的版本号改成目标版本号。**🤪
​

## 3. 正文

在这里我们给出 `vue-next` 发布的大致流程图，它基本对应着 `release.js` 中的 `main` 函数：
其实除了 `vue-next`，在开发 `npm` 包，或者是在咱们自己项目发版啊，打 `tag` 打包啊，也可以参照这个流程来进行调整写出脚本。
​
![](https://cdn.nlark.com/yuque/0/2022/jpeg/283876/1644416282759-assets/web-upload/186ceb85-bffd-490e-852e-75da421962a2.jpeg)

### 3.1 `import.mate.url` 与 `fileURLToPath`

1. 由于想自己动手，实现一个简略的发布流程，于是参照着 `release.js` 安装了几个 `npm` 包
1. 发现最新的安装包已经变成了以 ES6 Module 形式导出，和之前不一样了所以我在 `package.json` 中添加了属性 `"type": "module"`
1. 加完之后，发现按照 `release.js` 的源码，无法使用 `require` 和 `import` 的方式获取 `package.json` ,从而无法获取当前是什么版本了，那我还怎么确认发布版本号
1. 经搜索询问后发现 `release.js` 源码中就给出了解决方案，就是通过 `fs` 模块拿到 `package.json` 文件后通过 `JSON.parse` 解析
1. 在实现过程中遇到一个困难，因为我发现源码中通过`__dirname` 获取当前文件所在路径而去获取 `package.json` 的绝对路径，**而在 **`**package.json**`** 配置了**`**"type": "module"**`** 之后根本 tm 拿不到！**
1. 在翻阅 [stackoverflow](https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl) 之后发现，需要通过两个 api 间接获得 `__dirname` 变量：

![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1638538964125-d3cd6c9e-9a43-4b14-b2a1-d5432c4b1267.png#clientId=ubcde2e02-28f4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=341&id=u19472a04&margin=%5Bobject%20Object%5D&name=image.png&originHeight=682&originWidth=998&originalType=binary&ratio=1&rotation=0&showTitle=false&size=77408&status=done&style=none&taskId=u7d1744de-d58b-4735-b878-e38dfb1cfcb&title=&width=499)

```javascript
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
// 拿到当前文件所在文件夹路径
const __dirname = resolve(dirname(__filename));
// 获取当前版本
const { version: currentVersion } = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
);
```

### 3.2 确认发布版本号

#### 3.2.1 semver: 语义化版本管理工具

先明确一个简单的概念，之前一直不太懂：

1. 我们经常能见到的版本号长这样：`x.y.z`，如 1.2.14
1. `x` 表示主版本，英文用 `major` 表示
1. `y` 表示次版本，英文用 `minor` 表示
1. `z` 表示补丁版本，英文用 `patch` 表示

​

拿到当前版本后，可以通过 `semver` 包来进行版本管理，我们会用到它提供几个方法：

```javascript
import semver from 'semver';

const version = '0.1.0';
// semver.inc 方法根据传入的版本号和升级类型，得到目标版本号
const inc = (releaseType) => semver.inc(version, releaseType);
inc('patch'); // '0.1.0' -> '0.1.1'
inc('minor'); // '0.1.0' -> '0.2.0'
inc('major'); // '0.1.0' -> '1.0.0'

// semver.valid 方法会校验传入的版本号是否符合规范
semver.valid('0.1.2'); // ture
semver.valid('wdcc.ss@'); // false
```

#### 3.2.2 prompt: 用于和用户交互

有了管理版本的工具后，需要用到和用户交互的工具让用户来选择、自定义目标版本号，以及二次确认是否真的要发布。使用 `npm` 中的 `enquirer` 包即可满足我们的要求。它提供一个 `prompt` 方法，我们利用它可以和终端进行简单交互：
**选择：**

```javascript
import enquirer from 'enquirer';
const { prompt } = enquirer; // 注意，enquirer 中未提供 export prompt 的语句，不能直接解构获取

const versionIncrements = ['patch', 'minor', 'major'];

const { release } = await prompt({
  type: 'select',
  name: 'release',
  message:
    '选择发布的版本号，patch 表示补丁版本， minor 表示次版本， major 表示主版本',
  choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom']),
});
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1638542856587-d1d0d098-f4fa-423b-9de0-5429d6b5caa9.png#clientId=ubcde2e02-28f4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=193&id=u7b42e83a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=386&originWidth=1310&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49510&status=done&style=none&taskId=ub59e84c3-3d8e-4ec0-82ac-c7f42cd0d92&title=&width=655)
**确认：**

```javascript
const { yes } = await prompt({
  type: 'confirm',
  name: 'yes',
  message: `确定发布版本：${targetVersion}?`,
});
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1638542933863-f017d109-f9e9-4989-be10-9117dd065bca.png#clientId=ubcde2e02-28f4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=206&id=uf610a139&margin=%5Bobject%20Object%5D&name=image.png&originHeight=411&originWidth=1337&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56470&status=done&style=none&taskId=ueba4e5e3-b4e3-4aa3-8cd6-807b59088f0&title=&width=668.5)

### 3.3 更新版本号

更新版本号这个流程在 `vue-next` 项目 `release.js` 中的执行顺序在单元测试之后，不过放在这讲是为了知识点和其他流程区分开。
在 `vue-next` 项目中，写了三个方法用于更新版本号，分别是 `updateVersions`，`updatePackage` ，`updateDeps` 。核心方法是 `updatePackage`，给出 `vue-next` 的源码：

```javascript
function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json'); // 拿到要更改的 package.json 路径
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')); // 读取 package.json 为对象
  pkg.version = version; // 更改 version
  updateDeps(pkg, 'dependencies', version); // 更改 dependencies
  updateDeps(pkg, 'peerDependencies', version); // 更改 peerDependencies
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n'); // 将更改后的对象回写到对应的 package.json 路径
}
```

​`updateVersions` 相当于调用 `updatePackage` 的入口。
`updateDeps` 相当于对 `updatePackage` 细节的补充。  
**​**

**步骤：**

1. 拿到要更改的 package.json 路径
1. 读取 package.json 为对象 pkg
1. 更改 pkg 的 version 为目标版本号，相当于：`pkg.version = targetVersion`
1. 假若子项目比如 `@vue/compiler-core` 这个包，又依赖了子项目 `@vue/shared` 这个包，那么 `@vue/compiler-core` 这个包下的 `package.json` 的 `dependencies` 中，`@vue/shared` 的版本号也要改为目标版本号。 `peerDependencies` 同理。
   相当于：`pkg.dependencies['@vue/shared'] = targetVersion`
1. 将处理完毕的 pkg 对象转为 JSON 字符串回写到要更改的 package.json 路径中

### 3.3 单元测试，打包，生成 changelog, 发布包，推送代码

这些流程其实大致上都差不多，本质上是将命令行中执行的东西，放在了 js 文件中。

#### 3.3.1 chalk

为了方便了解打包过程的信息，可以通过 `chalk` 包对终端文字进行高亮等样式处理，让不同的过程信息显示更明显。其用法比较简单，有些类似于 `jquery` 的链式调用：

```javascript
import chalk from 'chalk';

console.log(chalk.bold.yellow('hello world'));

// 控制台输出加粗-高亮的 hello world
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1638543697115-0929995d-ed7f-45e3-8117-01c8cfd990a1.png#clientId=ubcde2e02-28f4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=255&id=u241bc126&margin=%5Bobject%20Object%5D&name=image.png&originHeight=509&originWidth=1218&originalType=binary&ratio=1&rotation=0&showTitle=false&size=99032&status=done&style=none&taskId=u95acd666-ab6f-46b0-9bce-a2636c703fa&title=&width=609)

#### 3.3.2 execa

`execa` 是发布流程中重要的工具，它可以为我们执行命令行，也可以执行 `shell` 文件。它暴露一个同名方法 `execa` 。它本质相当于杂糅了`node` 中的 `child_process.execFile` 和 `child_process.spawn`。其简单用法如下：

```javascript
// a.cmd
echo hello world

/*********/

// a.js
import { execa } from 'execa'

const main = async () => {
	const r1 = await execa('node', ['-p', '1+2']) //相当于执行 node -p 1+2
  console.log(r1.stdout) // 3

  const r2 = await execa('a.cmd') //相对于执行 a.cmd
  console.log(r2.stdout) // hello world
}

main()

```

#### 3.3.3 执行单元测试，打包，生成 changelog

```javascript
// package.json

{
	"scripts": {
    "release": "node scripts/release.js",
    "build": "node scripts/build.js",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "test": "jest"
  },
}
```

```javascript
import { execa } from 'execa';
import chalk from 'chalk';

const step = (msg) => console.log(chalk.bold.cyan(msg));

step('🍇 单元测试...');
await execa('yarn', ['test']); //执行单元测试，vue-next 中是执行了脚本文件
step('🍇 单元测试完成');

step('🍋 打包...');
await execa('yarn', ['build']); // 命令行执行 node scripts/build.js
step('🍋 打包完成！');

step('🍍 生成 changelog...');
await execa('yarn', ['changelog']);
step('🍍 生成 changelog 完成');
```

####

3.3.4 发布，推送代码
无非也就是使用 `execa` 执行 `git` 的 `diff` , `tag` , `add` ,`commit` , `push` 等命令，用于提交文件变更和代码推送。发布包也就是执行 `yarn publish` 的操作。

## 4. 心得

- 本次阅读源码，配合着实操，了解了许多流程方面的东西和实用的工具。
- 对 `node` 和 `package.json` 的了解增加了一些，亲历亲为更能感受到自己知识的匮乏。
- 总体来说较有收获，感谢源码共读活动发起人若川。💐
- 代码成功跑成后，看到 github 上成功打了 tag，略有兴奋感。😃

![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1638549557348-376d6de0-9684-418b-ade4-67ced16aec93.png#clientId=u4b90a0b2-0050-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=430&id=u0efe2d10&margin=%5Bobject%20Object%5D&name=image.png&originHeight=860&originWidth=1168&originalType=binary&ratio=1&rotation=0&showTitle=false&size=95898&status=done&style=none&taskId=ubbdc625c-db27-44ac-ab22-2000be1ac77&title=&width=584)
