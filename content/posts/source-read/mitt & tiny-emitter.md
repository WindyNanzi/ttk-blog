# 阅读笔记 | mitt & tiny-emitter

> 若川-源码共读活动-第 8 期

## 1. 前言

了解到 `mitt` 这个短小精美的库是在 `vite` 刚出不久之后，想尝试一下 `vue3` 的新语法，在途中发现在新语法中跨组件通讯相对困难。通过上网查阅，了解到了这个库。便在自己用来体验 `vue3` 的项目中使用了它：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1639535739620-4f00a09c-029e-4047-bb06-01634526536a.png#clientId=u46be77dc-79a5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=176&id=uea7e2105&margin=%5Bobject%20Object%5D&name=image.png&originHeight=244&originWidth=1032&originalType=binary&ratio=1&rotation=0&showTitle=false&size=51066&status=done&style=none&taskId=uf078859d-ecb8-4eb6-b672-ac509dd796f&title=&width=744)
在较为小型的项目中，或者想开发基于 `vue3` 的组件或工具，我觉得这个库是挺不错的。当时网友便说这个库很小且易读，所以当时便去阅读了一下源码。如今又在若川大佬的源码阅读活动中看见它的身影，也算是略有缘分吧。
​

## 2. 概要

`mitt` 和 `tiny-emitter` 俩库做的事情其实差不多：
**构造了一个事件的调度中心：**

1. **自定义并绑定事件**
1. **触发已定义的事件**
1. **解除已绑定的事件**

​

当然它们也略有不同：

1. `mitt` 的源码使用了 typescript，采用了 es6 的语法，而 `tiny-emitter` 使用的是 es5 的语法
1. `mitt` 使用了 ESModule 进行模块导出，而 `tiny-emitter` 则是 CommonJS
1. `mitt` 中定义了通配符 `*` 事件，而 `tiny-emitter` 中则是定义了 `once` 事件
1. `mitt` 中的 `on` 方法仅需要传递 事件类型与事件句柄两个参数，而 `tiny-emitter` 中还可以额外传递一个句柄上下文的参数。

​

总体而言，我更喜欢 `mitt` 这个库，它的源码相较 `tiny-emitter` 更为简洁易读（假如抛开 typescript 的学习成本）。
​

在若川大佬对第 8 期阅读源码的介绍中，谈到阅读 `mitt` , `tiny-emitter` 是希望去了解「发布-订阅 」设计模式。若非要较真的话，有人也说这是 「观察者」设计模式，不过不妨碍，主要还是需要知道它们的应用场景。
​

## 3. 正文

### 3.1 聊聊类似的

主要讲讲 `mitt` ,其实两个库都差不多。阅读源码可以了解到，一个事件是可以绑定`on`多个句柄的，在事件触发`emit`时，按绑定时序依次执行绑定的事件句柄，从文字上可能不太方便理解。但是使用过 `jquery` 的同学也许会见过如下的代码：

```javascript
// 实际场景不建议这样绑定事件 😯

var btn1 = $('#btn1');
btn1.on('click', fn1);
// ... 面条...
btn1.on('click', fn2);
```

当我们使用 `jquery` 为 DOM 元素绑定事件的时候，其实也是可以为同一个事件类型绑定多个句柄的。
这其实和 `vue` 中的双向绑定有着异曲同工之妙，`vue` data 中的一个属性变化，会引起页面多个与之绑定的 DOM 元素发生变化，这可以视为`vue` data 的属性，实际上维护了多个可以引起 DOM 元素变化的句柄。其实面试官常爱问的，`vue` 双向绑定的原理，其中有一条就是「发布-订阅」模式。

### 3.2 mitt 源码

由于`mitt`源码并不算长，咱可以直接搬过来。其实源码 `index.ts` 很多一部分代码是为了类型约束。比如通配符事件句柄类型，通配符事件句柄列表类型...。我们可以不用特别关心这些东西，而专注于逻辑本身：

```javascript
export default function mitt(all = new Map()) {
  return {
    all,
    // 绑定
    on(type, handle) {
      const handles = all.get(type);
      if (handles) {
        handles.push(handle);
      } else {
        all.set(type, [handle]);
      }
    },
    // 解绑
    off(type, handle) {
      const handles = all.get(type) || [];
      const idx = handles.indexOf(handle);
      if (idx > -1) {
        handles.remove(idx);
      } else {
        all.set(type, []);
      }
    },
    // 触发
    emit(type, evt) {
      const handles = all.get(type) || [];
      handles.forEach((handle) => handle(evt));

      // 通配符事件，表示所有事件都会触发它
      const wildcardHandlers = all.get('*');
      wildcardHandlers.forEach((handle) => handle(type, evt));
    },
  };
}
```

实际上 `mitt` 中 `emitt` 方法长这样：

```typescript
function emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
  let handlers = all!.get(type);
  if (handlers) {
    (handlers as EventHandlerList<Events[keyof Events]>)
      .slice()
      .map((handler) => {
        handler(evt!);
      });
  }

  handlers = all!.get('*');
  if (handlers) {
    (handlers as WildCardEventHandlerList<Events>).slice().map((handler) => {
      handler(type, evt!);
    });
  }
}
```

上边这个 `mitt` 方法中，我有两个地方不太理解：

1. 为什么 `handles` 要调用 `slice` 方法
1. 为什么 `handles` 要使用 `map` 方法而不是 `forEach` 方法来执行数组中的事件句柄，因为`forEach` 执行效率比 `map` 要快些，也兼具可读性

​

~~第一个问题我通过查询 git 记录了解到，可能存在某种情况，~~`~~emit~~`~~ 方法执行时，若数组中的方法还为执行完，此时又执行了 ~~`~~off~~`~~ 方法，那就会导致了可能会有事件句柄未能被执行，所以需要一个新的数组保存所有的句柄。我个人觉得这种情况相对极端，只存在异步操作频繁的时候吧。~~
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1639556214366-5924ade3-bc36-4939-b5d5-9a65905db014.png#clientId=ud976c969-2d07-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=391&id=ufdda9eec&margin=%5Bobject%20Object%5D&name=image.png&originHeight=535&originWidth=1019&originalType=binary&ratio=1&rotation=0&showTitle=false&size=50009&status=done&style=none&taskId=u7382f2a7-6ba9-4f6d-9a11-80b955d372d&title=&width=745.5)
显然这样明显的问题很早就有人考虑到了，在查询 git 记录之前，也可以根据关键字在 `issues` 中进行搜索，可能会更有效率的找到答案。
[https://github.com/developit/mitt/pull/109](https://github.com/developit/mitt/pull/109)
大意就是：

1. `slice` 是为了防止事件句柄前面的语句对句柄移除后，句柄数组下标改动，可能造成跳过部分句柄的执行
1. `map` 则是为了代码更好压缩？[https://github.com/developit/mitt/pull/110](https://github.com/developit/mitt/pull/110)

![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1639560606930-c3900a84-2b0d-453d-9359-e879b9c1ee21.png#clientId=ud976c969-2d07-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=426&id=u63d4e6e3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=690&originWidth=1164&originalType=binary&ratio=1&rotation=0&showTitle=false&size=76733&status=done&style=none&taskId=ubbdeac85-5bc7-402f-8dd1-c1d85507d5c&title=&width=718)

若川大佬直接指出 [@simonezhou(simonezhou)](/simonezhou) 同学的 [笔记](https://www.yuque.com/simonezhou/kb/lww7bx) 中也找到了这样写的答案。真是很厉害呀 👍
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1639560524444-ce77c7a9-c238-44dd-a4d2-5d5d3c85c1c8.png#clientId=ud976c969-2d07-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=304&id=u6c9f7986&margin=%5Bobject%20Object%5D&name=image.png&originHeight=607&originWidth=1432&originalType=binary&ratio=1&rotation=0&showTitle=false&size=66994&status=done&style=none&taskId=u476b0b0c-9b7a-4474-94b6-5e534373066&title=&width=716)

## 4. 心得

本想再聊聊「发布-订阅」模式，不过发现自己在平时的开发中鲜有用到各类设计模式。虽然有大佬说「设计模式不是银弹」，不过掌握其思想在某些情况下确实能起到意想不到的作用吧。其实很多情况下，我比较更倾向于将复杂的逻辑抽象与封装，让一个个功能变得单一化，容易管理和观看，基本可以解决很多问题。`mitt` 和 `tiny-emitter` 则是更高纬度的抽象思考，只有更喜欢去思考，更喜欢将想法付诸在行动上，对代码以持之以恒的去繁化简，封装，单一化，语义化，才能打造出合适的「设计模式」吧。
一点心得，不知所言。🦁
