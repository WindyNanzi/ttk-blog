# 在 vue2 中使用 composition-api 踩坑

## 前言

如何在 vue2 中使用 vue3 语法中的 composition-api , 这里主要是依赖于 [antfu](https://github.com/antfu) 大神开发的 npm 包 `@vue/composition-api`，尤大也计划将这个包添加到 vue2.7 版本中<br />
<br />简单的 `Vue.use` 之后，即可在 Vue2 项目当中使用 composition-api 的大部分语法。在目前的开发实践当中，总结了部分踩坑经历，后续也会持续更新<br />

## 数组

<br />经过实践，使用 `reactive` 包裹的数组不是总是响应式的，使用`computed` 来计算依靠 `reactice` 包裹的数组时，也无法达到预期的响应式效果：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/283876/1643276638364-fff9c99a-912f-46d1-979d-e8c75a96d6a9.png#clientId=u073d049b-56b9-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=707&id=u6f5a40b9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=884&originWidth=1170&originalType=binary&ratio=1&rotation=0&showTitle=false&size=120353&status=done&style=none&taskId=u63f0f8c9-1919-408c-aa56-41c6c0e8987&title=&width=936)<br />所以建议在开发实践中使用 `ref` 包裹数组<br />

##  .value

<br />使用 composition-api 中的 `ref` 语法，开发时总是会忘了在获取，设置值的时候给变量加上 `.value` ，然后在报错后再修正这个错误，`.value` 这种语法也是被许多开发者所诟病的<br />
<br />在一次 [antfu](https://github.com/antfu) 做的分享当中，他提及到一个技巧，也就是使用 `unref` 这个函数，这个函数的源码如下：<br />

```javascript
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
```

<br />使用这个函数，我们可以无脑的套在变量上获取它的值，而无须在意它是否是经过 `ref` 或者 `computed` 处理过的变量。有时候一个变量经过多次 `ref` 等处理，这个函数就十分有用。我们只需要关注在设置值的时候添加 `.value`<br />

## store 与 router

<br />在 vue2 中，很多情况下，都需要使用到 `$router`，`$store` 的情况。但是在 `vue2` 中需要通过 `this` 来访问。但是在 `setup` 中是没法轻易使用 `this` 的，所以需要额外处理一下<br />
<br />实际上也相对简单：<br />

```javascript
import router from '@/router/index.js';
import store from '@/store/index.js';

/** 获取 router: 即 this.$router */
export const useRouter = () => router;

/** 获取 route: 即 this.$route */
export const useRoute = () => router.currentRoute;

/** 获取 store: 即 this.$store */
export const useStore = () => store;

/** 获取 getters */
export const useGetters = () => store.getters;



///////////   使用    ///////////
const router = useRouter()
router.push({...})

const getters = useGetters()
const getUser = computed(() => getters.getUser)
```

<br />以上代码中的 `router` 与 `store` ，都是在项目`mian.js` 中引入的 `router` 与 `store`对象，它们分别由 `new VueRouter()` 和 `new Vuex.store()` 创建，在当前实践中，可以正确无误的达到我们的需求。
