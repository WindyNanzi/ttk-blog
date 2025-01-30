# 在项目中使用vuepress搭建文档

> 文章由掘金迁移过来

## 前言

<br />随着项目规模越来越大，虽然所在公司前端团队的人数不算多，但还是不可避免的重复造轮子。很多弹窗啦，多选按钮组，特定样式的表格，乃至业务组件。以为项目里没有，费劲巴拉的做出来后，发现有人早早写了个组件放在不知名的地方....由是萌生了打造属于项目的组件库文档的想法，个人觉得属于项目的组件库文档还是有几个不错的意义的：<br />

- 对前端开发言，减少了沟通成本，减少了重复造组件轮子的几率
- 可以拿已有的组件文档和UI/UX部门与产品部门商(si)讨(bi)，在提新需求，与需求变更时，可以参照已有组件设计
- 对于项目，甚至公司而言，也容易形成具有独特风格，统一风格的产品


<br />为啥不是 `vitepress` ，公司还在用 `vue2.x`，项目里用的都是2的语法，不方便移植<br />
<br />为啥不用`storybook`，英文不好<br />
<br />那么废话不多说，说白了也就是想折腾折腾，打工人的无奈罢了。接下来进入正题。<br />

## 环境


- node 包管理工具：推荐 `yarn`，在我们安装 `vuepress` 的主题后，跑起来不容易出错。
- vuepress：`vuepress@1.8.2`， 就是当前最新版本
- 主题：在这里推荐两个`vuepress`主题 
   - `vuepress-theme-reco`，我在项目里用的就是这个主题，功能比较齐全
   - `vuepress-theme-hope`，看起来非常棒，功能非常多，但是没玩明白，还是大学生（华东师范大学）写的，没拉下脸去问，哈哈


<br />接下来开始讲讲我在公司的项目中是如何使用 `vuepress`搭建组件文档项目的。当然基本安装，基本配置什么的，移步官网：[vuepress](https://vuepress.vuejs.org/zh/guide/)，[vuepress-theme-reco](https://vuepress-reco-doc.now.sh/)<br />

## `vuepress` 引入  `ant-design-vue`

<br />`vuepress` 中是可以书写 `vue` 的，而且 组件文档的核心就是能写出代码案例，所以，需要能展示出组件，就需要引入项目中的UI组件库，我们公司使用的是 `ant-design-vue`，这里以 `ant-design-vue`举例。代码案例后边会讲。<br />
<br />以下问题，可能不止是 `ant-design-vue` ，`iview`，`element-ui`，也可能会碰到。按照教程，在 `enhanceApp.js` 中加入如下代码：<br />

```javascript
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

export default ({ Vue }) => {
  Vue.use(Antd)
}
```

<br />在 `vuepress`中应该就可以使用 `ant-design-vue`里边的组件了。可是，启动项目后发现会报这样的错误，`Cannot find module 'core-js/library/fn/xxx/xxx'`：<br />
<br />![](https://cdn.nlark.com/yuque/0/2022/webp/283876/1642582501964-0a9a964f-c9a3-4115-9e1a-bdd68ba88ada.webp#clientId=uc998efac-a9ba-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u8fc3bf41&margin=%5Bobject%20Object%5D&originHeight=497&originWidth=965&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8c062542-08ec-423a-9522-e41f6c2ef5e&title=)<br />
<br />这里查询了 [issues](https://github.com/zpfz/vuepress-theme-antdocs/issues/5#issuecomment-753821394)，和大佬进行了一定的讨论，原因呢应该是 UI 组件中依赖的`core-js`包和`vuepress`所依赖的`core-js`包版本不兼容造成的。大佬附带了解决方案，需要在`vuepress`配置文件`config.js`中进行如下配置：<br />

```javascript
module.exports = {
    chainWebpack: config => {
    	config.resolve.alias.set('core-js/library/fn', 'core-js/features')
    }
}
```


## 在 `markdown` 中使用 `vue`

<br />基本的用法可以移步官网：[在 Markdown 中 使用 Vue](https://vuepress.vuejs.org/zh/guide/using-vue.html#%E4%BD%BF%E7%94%A8%E7%BB%84%E4%BB%B6)。<br />
<br />下面说说可能遇到的坑：<br />
<br />比如我们书写如下的md的代码：<br />

```markdown
**一行加粗的文本**

<a-card title='card标题'>
	<a-button>一段没被加粗的文本</a-button>
</a-card>
```

<br />它会被渲染成这样：<br />
<br />![](https://cdn.nlark.com/yuque/0/2022/webp/283876/1642582514494-16580f9a-8b53-48f5-9168-54704e6bb5a2.webp#clientId=uc998efac-a9ba-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=uabf9c0cc&margin=%5Bobject%20Object%5D&originHeight=288&originWidth=958&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u89660323-19d7-4d4a-9635-84750539101&title=)<br />
<br />这是由于 `vuepress` 的未知原因造成的，在 [issuse](https://github.com/vuejs/vuepress/issues/2112#issuecomment-575717273) 中给出了解决方案。**就是在外层包裹一层 **`**div**`**:**<br />

```markdown
**一行加粗的文本**

<div>
    <a-card title='card标题'>
    	<a-button>一段没被加粗的文本</a-button>
    </a-card>
</div>
```

<br />就能显示正常了：<br />![](https://cdn.nlark.com/yuque/0/2022/webp/283876/1642582526664-814891dc-4b78-427d-8d9a-03bb1ced6f7c.webp#clientId=uc998efac-a9ba-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u9bce8d90&margin=%5Bobject%20Object%5D&originHeight=241&originWidth=933&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1e1a5672-d004-4902-8577-429ae87536e&title=)<br />

## 引入项目中的 `vue` 组件


-  引入：我们需要拿到具体项目中书写的组件，docs文件夹不会放在src文件夹下吧。首先需要在 `config.js` 中配置项目源码的别名： <br />在获取组件的文件中即可通过`import Loading from '@src/components/Loading'`的方式引入组件 
```javascript
const path = require('path')

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@src': path.resolve(__dirname, '../../src/'),
            }
        }
    }
}
```

-  注册：**在 **`**enhanceApp.js**`** 中，使用语法**`**Vue.component('组件名', component)**`**即可在 **`**vuepress**`** 全局注册组件, 如：**`**Vue.component('Loading',Loading)**`。由于项目中注册的组件可能会有许多，而且 `enhanceApp.js` 的功能不止注册组件，因此推荐把组件存入数组，引入到 `enhanceApp.js` 中后集中注册：  
```javascript
import components from './config/component'

export default ({ Vue }) => {
    components.forEach(({name, component}) => Vue.component(name, component))
}
```


## 编写组件案例

<br />推荐两个插件：<br />

- `vuepress-plugin-demo-code`
- `vuepress-plugin-demo-container`


<br />我使用的是 `vuepress-plugin-demo-container`，用法相对而言还算简单，虽然样式没那么符合我的心意，但是基本功能是有的。基本用法参照 [快速上手 | Demo Container](https://docs.chenjianhui.site/vuepress-plugin-demo-container/zh/started.html)<br />
<br />大概长这样：<br />![](https://cdn.nlark.com/yuque/0/2022/webp/283876/1642582541640-54cfa08f-6dca-468a-8d79-0edb87c3f408.webp#clientId=uc998efac-a9ba-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u46a34999&margin=%5Bobject%20Object%5D&originHeight=380&originWidth=1013&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8f2f1f37-8a31-4060-bc9c-1f529603fc7&title=)<br />

## 在 `vuepress` 中使用 `sass`

<br />由于项目中的 vue 组件都使用了 sass 样式预处理器，因此想正常引入组件，vuepress 还需要安装 `node-sass`，`sass-loader`，他可能会出现如下问题：<br />
<br />![](https://cdn.nlark.com/yuque/0/2022/webp/283876/1642582550439-eb9b54e0-a669-4483-bb71-58767560af39.webp#clientId=uc998efac-a9ba-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=uaadab39d&margin=%5Bobject%20Object%5D&originHeight=427&originWidth=777&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uaaaa0b78-ca7e-42f3-9709-018a1d3595d&title=)<br />
<br />参考 `vuepress` 中的 [issues](https://github.com/vuejs/vuepress/issues/1757#issuecomment-547890089)，高版本的`node-sass`，`sass-loader`与`vuepress`版本并不兼容，这个bug在最新版中也没解决。可行的版本是：`node-sass@4.14.1`，`sass-loader@7.3.1`。<br />
<br />由于我司正在使用的`node-sass`，`sass-loader`恰好版本不算高，所以不会出现上边的错误，这样就可以尝试把文档项目植入到现有项目中了。假如小伙伴们项目中使用的`node-sass`与`sass-loader`版本不满足条件，可以尝试这个 [issues](https://github.com/vuejs/vuepress/issues/1757#issuecomment-597438131) 的讨论中尝试几个点赞量较高的解决方案。<br />

## 在 `vuepress` 使用全局 `sass` 变量

<br />既然在项目中都使用了 `sass` 了，那自然避免不了使用 `sass` 变量，在组件文档中的全局 `sass` 样式变量文件和具体项目中的`sass`样式变量文件区分开。比如叫做 `_variables.scss` ，其内容为：<br />

```scss
@import '../../../src/style/common_variables.scss'
```

<br />这样就能够获取到项目中所有的`sass`变量，而且即使项目中的全局`sass`变量更新后，也不需要对这个文件进行维护了。<br />
<br />然后，需要在`config.js`中进行如下的配置：<br />

```javascript
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@styles': path.resolve(__dirname, './styles')
            }
        }
    },
    scss: {
        data: `
        @import "@styles/_variables.scss";
        `
    }
}
```


-  `@styles`是样式文件夹路径的别名 
-  这块的配置这里参照了 stackoverflow 网站上的问答：[import-global-sass-variables-into-vuepress-components](https://stackoverflow.com/questions/60009780/import-global-sass-variables-into-vuepress-components)<br />![](https://cdn.nlark.com/yuque/0/2022/webp/283876/1642582566158-11e5f993-ba10-4151-80c4-f4552646b1c4.webp#clientId=uc998efac-a9ba-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u4c4fbaa5&margin=%5Bobject%20Object%5D&originHeight=653&originWidth=897&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u716d2b53-a283-4c89-8a89-bcc2d44da42&title=)



## 引入 `vuepress-theme-reco` 主题

<br />假如直接通过当前的 `package.json`， 使用 yarn 命令安装依赖，有时候项目启动后会出现一个玄学bug:<br />`global is not defined`，这个bug貌似是由于lock文件造成的。需要删除项目中的`package-lock.json`，<br />`yarn.lock` 文件，最好再删除 node_modules 文件夹，**使用yarn安装依赖**。<br />

## Unknown Custom Element - <v-#####>

<br />在 `vuepress` 中存在这样的bug：有时候浏览器中 `VueDevtools`插件 打开的时候，页面会报这个错误，导致页面渲染错误，而这个bug到目前版本仍然未得到修复，因此需要在 `enhanceApp.js` 中插入下面的代码，参考 [issues](https://github.com/vuejs/vuepress/issues/1173#issuecomment-470534176)<br />

```javascript
import pageComponents from '@internal/page-components'

export default ({Vue}) => {
  Object.entries(pageComponents).forEach(([name, component]) =>  Vue.component(name, component))
}
```
