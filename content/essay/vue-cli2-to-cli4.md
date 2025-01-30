# 记一次 vue 项目由 cli2 升级至 cli4

## 1. 前言
公司一直在使用的都是 vue-cli2 构建的项目，我对 cli2 构建的项目结构并不是那么熟悉。因为在更早之前，上一家公司的 vue 项目则是基于的掘金大神「花裤衩」写的 vue-element-admin 项目继续开发的。由于项目经历很少，而且在工作中基本从事的是增删改查的操作。所以对工程构建方面的内容了解得并不那么多。<br />这造成了我在刚入职新公司时，看到项目构建需要10分钟，热更新需要10多秒时，我第一个想法，并不是给 cli2 升级，而是给 webpack 升级。在那时行动力还算较强的我马上就去做了这件事😐... 经过一番折腾和文章查阅。我将webpack 升级到 3.x，热更新速度得到了大幅提升，但是构建速度还是一言难尽。`hard-source-webpack-plugin` 虽然可以大幅提升构建速度，但是似乎会让热更新变慢，我最终放弃了构建速度的提升。<br />说回到现在，一次偶然的文章阅读【1】，让我回味过来，原来新公司项目完全是由 cli2 搭建的，目录结构不能说是一模一样，只能说是完全一致。这让我重新有了升级项目的想法，或许这并不能直接为我带来利益，就当是练练手吧。<br />升级至 cli4 的过程没有像上次升级 webpack3.x 那样花很多时间，因为 cli4 自己把 webpack 和 babel 给包含了，这让我减轻了许多工作量。以至于到项目成功启动之后，我不禁感慨要是当时再多些项目经验，或许去年升级项目没必要费那么多事儿。<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640849133681-86afa977-e164-4c41-a1ed-4198e99bbce8.png#clientId=u5299f4a2-8223-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=227&id=uf02d59ed&margin=%5Bobject%20Object%5D&name=image.png&originHeight=281&originWidth=880&originalType=binary&ratio=1&rotation=0&showTitle=false&size=40405&status=done&style=none&taskId=ub12d2bc7-4ec5-4bf8-8e0b-52bfe7deb65&title=&width=712)<br />

## 2. 项目环境
我发现不知道为什么，我写文章时喜欢说一些口水话，其实这些话基本没人看。不过 whatever, 文章本身也没多少人看。🐶<br />在介绍流程和排坑的过程前，需要提一嘴我们的项目环境。其他未知的坑咱也管不着了。🐶<br />

### 2.1 cli2 项目结构
我公司的项目结构和这基本一致，多了个 `jsconfig.json` 和 `.keep` ，不过无关紧要，基本上都是一样的。起初我一直以为是公司大佬自己配置，搭建的。👀
```
config/
build/
src/
static/
.eslintignore
.eslintrc.js
.editorconfig
package.json
index.html
.postcssrc.js
.gitignore
```


### 2.2 cli4 项目结构
```
public/
src/
.browserslistrc
.editorconfig
.eslintrc.js
.gitignore
babel.config.js
package.json
```


### 2.3 辅助工具
#### 2.3.1 babel
#### 2.3.2 Vuex
#### 2.3.3 VueRouter
#### 2.3.4 ESLint：代码风格采用的是 `standard`
#### 2.3.5 css预编译工具：node-sass

<br />UI 框架我们用的是 ant-design-vue，不过其实和它关系没那么大。会影响按需加载，不过也还好，比较容易解决。<br />

## 3. 流程与坑
### 3.1 使用 vue-cli4 创建新项目，**这一步很重要！！！**


> 注意，假如项目中使用了** node-sass**，会有一个经典问题：下载不下来。<br />假如遇到了，在创建好一半的项目中，删除 node_modules 文件夹，在更目录下执行命令：
> `npm config set sass_binary_site [https://npm.taobao.org/mirrors/node-sass/](https://npm.taobao.org/mirrors/node-sass/)`

执行命令后先不着急，等把 package.json 修改后再 yarn or npm i

​<br />

1. 首先需要下载 vue-cli4，假如本地有之前版本的 vue-cli 版本工具，那就先卸载了它，重新安装一下。
1. 使用命令行 `vue create` 或者 `vue ui` 来创建新项目。推荐使用 `vue ui`，可视化，大概长这样：<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640853381628-d5fe1947-3e19-496b-8622-875d74a6be6c.png#clientId=u5299f4a2-8223-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=466&id=ufafc1500&margin=%5Bobject%20Object%5D&name=image.png&originHeight=932&originWidth=1860&originalType=binary&ratio=1&rotation=0&showTitle=false&size=107567&status=done&style=none&taskId=u47c1285a-89c8-4b3c-81f8-652dccbeca7&title=&width=930)
1. 为了方便配置展示，我们这里使用 `vue-create` 命令后进行的配置选项。<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640853320083-d772c738-06b2-4a92-8445-a7b08d48c328.png#clientId=u5299f4a2-8223-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=338&id=ua72ae614&margin=%5Bobject%20Object%5D&name=image.png&originHeight=583&originWidth=1241&originalType=binary&ratio=1&rotation=0&showTitle=false&size=74138&status=done&style=none&taskId=u9ef80b05-5b9a-456d-b4ec-bf40cb7f786&title=&width=719.5)​

---

下边这些配置也可以搜索其他更详细的文章介绍【2】。

   1. `Please pick a preset`，就是问我们选择预设制是什么，有3个选项：`vue2` 项目默认配置，`vue3` 项目默认配置和手动配置。这里我们选择手动配置：`Manually select features`。
   1. `Check the features needed for your project`，也就是问我们需要什么插件，项目里用到啥就选。记得选 `Choose Vue version` , 既然是 cli2, 我们肯定用的也是 vue2.x 了。  
   1. `Choose a Version of Vue.js that you want to start the project with`，选2🐶
   1. `Use history mode for router`，是不是用history模式来创建路由。看项目之前怎么用，就怎么选。
   1. `Pick a CSS pre-processor` 选 css 预编译器，我们项目是 node-sass
   1. `Pick a linter / formatter config`，**选择哪个ESLint自动化代码格式化检测，这玩意很重要，别选错了。**我一开始以为项目既然是咱们自己搭建的，所以这 ESLint 配置基本也是自个弄得，所以一开始选了** **`ESLint with error prevention only`（只配置 ESLint 官方推荐配置），结果弄了几次都会报一大堆错。🥲这块格式化的问题可以问问创建项目的人原来选的什么，也可以尝试在 package.json 中发掘点信息。比如我们项目使用了`ESLint + Standard`（通用规范），那 package.json 中的依赖里可以看到有 `eslint-plugin-standard`。
   1. `Pick additional lint features`，选择校验时机，这里我选的是保存，提交修复时都会校验。因为项目中也是这样。
   1. `Where do you prefer placing for Babel, ESlint, etc.?`，就是问我们更倾向于在哪保存这些插件的配置。假如项目里存在 `.babelrc` 的文件时，就选保存在各自的配置文件中就行。`In dedicated config files`
   1. `Save this as a preset for future projects?` 是否当前配置保存成为一个预设配置，这样以后用 `vue create` 命令就可以直接选这个配置了。 no!🙂

​

**再次强调这一步配置很重要！！配错了会浪费大量时间调整奇奇怪怪的报错！！**<br />**再次强调这一步配置很重要！！配错了会浪费大量时间调整奇奇怪怪的报错！！**<br />**再次强调这一步配置很重要！！配错了会浪费大量时间调整奇奇怪怪的报错！！👀**<br />**​**<br />
### 3.2 项目文件的迁移

- 原有项目 src 文件夹下的所有文件都放到新项目中的 src 文件夹下，新项目的 src 记得先清空
- 原有项目 static 文件夹下的所有文件都放到新项目中的 public 文件夹下，新项目的 public 记得先清空。
- 原有项目根目录下的 index.html 也放到 public 下
- 各个配置文件， 如 `.eslintrc.js`, `.eslintignor`, `.editorconfig` 等都复制粘贴到根目录下。除了`.babelrc` (或者 babel.config.js) 。babel 更新较大，如果没啥大问题，就先用新的配置就行，假如跑起来有这方面的问题，stackoverflow。🐶另外 `postcss`也不用，似乎集成了。

​<br />
### 3.3 package.json 的改动
#### 3.3.1 scripts

- 这块其实就是配置一些命令行脚本，要是原来项目启动项目用的是 `npm run dev`, 那新项目就把 scripts 中的 `serve` 改成 `dev`，后边的东西别动。
- 其他的命令行，那得看你们项目里边的配置了，原封不动拿过来应该没问题。

​<br />
#### 3.3.2 dependencies
新项目的 dependencies 自己带有4个依赖：`core-js`，`vue`，`vue-router`，`vuex`。这4个依赖我们不要动它，把原有项目里 dependencies 下其他的依赖复制过来（版本号也复制过来）即可。<br />

#### 3.3.3 devDependencies
本地开发依赖。也就是打包生成的代码不需要的依赖，但是能辅助我们开发的依赖。新项目中这部分基本不用动。除非，之前的项目 package.json 中的 scripts 下有其他命令，而且这些命令中出现了 devDependencies 下的包名，这意味着有研发同学为了项目整体的效能、模块大小分析或者其他方面，而引入了新的本地开发依赖，所以你需要将这个依赖也搬过来。<br />

#### 3.3.4 gitHooks
cli2 中，npm 针对 git commit 前做了一个钩子配置，用的是 `husky` ， 在新项目中那就是 `gitHooks`，不用动。<br />​<br />
#### 3.3.5 lint-staged
实际上 `gitHooks` 中， `pre-commit` 就是执行的它，它可以在我们 git commit 前只 lint（校验）想要 commit 的文件，**前提是你不是这样配置的：**
```json
"lint-staged": {
  "*.{js,jsx,vue}": [
    // 新项目这默认的话是 "vue-cli-service lint"
    "eslint --ext .js,.vue src", 
    "git add"
  ]
}
```
这个命令 `eslint --ext .js,.vue src` 有坑！eslint 学得不行👀，所以老项目里 `husky` 里怎么弄的 lint 命令，我就给它搬过来了，这是个坑！它实际上的意思是在 src 目录下，检查所有 .js, .vue 文件的代码规范。那 `lint-staged` 就没有任何意义咯... ，这样你提交代码时会检查项目中 src 文件下所有代码，太慢了。所以这块最好别动。<br />​<br />
### 3.4 vue.config.js
创建 vue.config.js 放在根目录下，它可以帮我们配置更多的东西。它的用途很大，更详细与具体的可以参看网上的相关文章，官方配置参考：[配置参考](https://cli.vuejs.org/zh/config/)。在我们项目当中，主要需要用它来进行「全局 `scss` 变量」，「路径别名」，「热更新」等基础配置。<br />​<br />
```javascript
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 是否使用包含运行时编译器的 Vue 构建版本。
	// 设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  // runtimeCompiler: true, 
  devServer: {
    proxy: 'http://localhost:8080', // 本地服务
    public: 'localhost:8080'
  },
  css:  {
    loaderOptions: {
      scss: {
        prependData: `@import "@/style/global.scss";` // 添加全局 scss 变量
      }
    }
  },
  chainWebpack: (config) => {
    const alias = config.resolve.alias
    alias.set('@', resolve('src')) // 设置项目 src 路径别名为 @
  }
}
```

这里需要提一句 `runtimeCompiler` 配置，它可以在项目运行时，成功将 `<template>` 字符串编译成 vue 组件。原官方文档中也有提到：[运行时-编译器-vs-只包含运行时](https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6)。这个配置打开的话，`main.js` 中的：

```javascript
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640933880244-28352384-faaf-4cf6-8396-ed0d4cf5a807.png#clientId=u0b54d8f0-07ec-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=162&id=uc683564d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=144&originWidth=657&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14004&status=done&style=none&taskId=u725e0595-18d9-4883-80a1-be049fec85c&title=&width=741)<br />就不会报错了，否则，我们应当写成这样的模式：
```javascript
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
```
这个配置假如原来的项目中存在这样的别名设置时，建议是打开的（因为可能有多个地方用到了 template 选项，假如用的地方少，可以挨个改）：

```json
'vue$': 'vue/dist/vue.esm.js'
```
### 
### 3.5 静态文件处理
在基本配置处理好之后，我们可以着手改动一些代码文件。在「项目文件迁移」中，我们将老项目 static 文件夹下的文件全部移动到了新项目 public 文件夹下。这时候需要对代码文件做如下改动：

1. 假如原先使用了类似 `@/../static/**/*.js` 这样形式从 static 文件夹导入 js  模块的语法，都需要改成从 public 文件夹下导入了：`@/../public/**/*.js`
1. 我们可能还会在 static 文件夹下放入一些 css 文件，还有一些 字体文件，图片，logo 等。它们通常不以 import 形式引入或者相对路径来引入。而是以绝对路径来引入，cli2项目中通常以这种形式出现：`src='/static/**/*.png'` 。这块静态资源的处理，折腾了我一段时间。<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1640941206597-26a7744f-2ca8-4c84-93a9-913db841d4ea.png#clientId=u0b54d8f0-07ec-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=310&id=ud87827ec&margin=%5Bobject%20Object%5D&name=image.png&originHeight=458&originWidth=977&originalType=binary&ratio=1&rotation=0&showTitle=false&size=67250&status=done&style=none&taskId=u3e9a52a5-278a-4a61-8bfa-6f90e78306f&title=&width=660.5)<br />cli4 官方文档是这么介绍它的，通过 `yarn build` 生成的 dist 目录，我发现，dist 下完全是把 public 文件夹下的文件复制了过来。<br />所以，我们需要将项目中引用绝对路径获取静态资源路径由 `src='/static/**/*.png'`  改为 `src='/**/*.png'` 的形式。

​<br />
### 3.6 ant-design-vue
cli2 升级到 cli4 之后，ant-design-vue 的按需配置也经行了变动，这块参照[官网](https://www.antdv.com/docs/vue/use-with-vue-cli-cn/)配置就行，babel.config.js：
```shell
yarn add babel-plugin-import --dev
```
```json
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "import", {
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        style: "css"
      }
    ]
  ]
}
```
​<br />
### 3.7 安装依赖，运行，打包
至此改造得差不多了，我们只需要安装依赖，然后运行。这里还是推荐 yarn ，或者 pnpm（没用过，不过广受好评）安装，关于 `node-sass` 安装失败的问题，解决方案在 「3.1 使用 vue-cli4 创建新项目...」 中已经提到了。运行，和打包时，可能会出现一大堆关于 lint 的报错。第一次出现时，不要慌，慌也没用.....。这是因为启动时自动执行了 lint 命令，原有的项目中可能有许多不符合新版本规范的文件，而 lint 命令中不包含 `--fix` 选项，所以会有很多错误。绝大多数错误是可以通过 `yarn lint --fix` 选项修复的，运行这个命令后，假如没有 error ，再 `yarn dev` or `yarn serve` 就能成功启动项目了，假若还是存在问题，那需要针对错误的文件和 lint error 信息单独核对修改。可以参考ESLint 中文网的命令介绍改动现有代码：[ESLint 规则](http://eslint.cn/docs/rules/)。<br />打包时也可能会出现 lint 错误，这个问题我没搞太清楚，但是执行第二遍打包命令后就会好了。<br />
<br />假如还有其他疑问，也可以参考一下这篇文章：[vue-cli2的项目升级到vue-cli4做了哪些事情](https://blog.liuyunzhuge.com/2019/12/19/vue-cli2%E7%9A%84%E9%A1%B9%E7%9B%AE%E5%8D%87%E7%BA%A7%E5%88%B0vue-cli4%E5%81%9A%E4%BA%86%E5%93%AA%E4%BA%9B%E4%BA%8B%E6%83%85/)。我就是在这篇文章启发下，才有了升级项目的念头。不过过程和他的有一些差异。<br />

## 4. 后记
流程跑通之后还需要多测试几次，不论是 `yarn dev` or `yarn build` 。都需要多试几次，和原项目进行比对。确保大方向上基本没什么问题后可以建立新仓库了。🤖<br />	其实这篇文章是打算出成上下篇的，这篇作为上篇将 cli2 升级到 cli4 , 下篇再将项目由 vue2 升级为 vue3，但是实践起来有些难度，或许要暂告一段落了。不过也找到一些不错的东西，假如你想在 vue2 中使用 vue3 的一些 api，或许可以尝试一下 [antfu](https://www.zhihu.com/people/antfu) 大佬写的一个插件 [@vue/composition-api](https://github.com/vuejs/composition-api/blob/main/README.zh-CN.md) ，连尤大也称赞过。<br />写这篇文章时，搜索各类文章都发现大家在使用的都是 cli4 ，vite 等工具了，不禁感慨自己过去的一年似乎又是被前端日新月异的时代浪潮拍到了队尾。希望这篇文章能帮助到有需要的有缘人吧。🐶<br />​<br />
## 5. 参考
【1】：[vue-cli2的项目升级到vue-cli4做了哪些事情](https://blog.liuyunzhuge.com/2019/12/19/vue-cli2%E7%9A%84%E9%A1%B9%E7%9B%AE%E5%8D%87%E7%BA%A7%E5%88%B0vue-cli4%E5%81%9A%E4%BA%86%E5%93%AA%E4%BA%9B%E4%BA%8B%E6%83%85/)<br />【2】：[vue.config.js 的完整配置（超详细）！](https://juejin.cn/post/6886698055685373965)
