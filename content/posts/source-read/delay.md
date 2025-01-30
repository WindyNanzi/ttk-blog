# 阅读笔记 | delay

> 若川-源码共读活动-第 18 期

## 1. 前言

进入年末，人开始变得有些倦怠，其实我常常在精神内耗：为什么有许多人有那么多努力的动力呢？到底是自身的兴趣使然，还是拥有足够的正反馈，亦或是被责任、欲望推着向前走。这常常让我陷入更深度的焦虑，反而更提不起学习的兴趣了。正如这 delay 函数一样，我总是会 delay 很多事情，计划。
不过无妨的。哈哈。
![p252339694.webp](https://cdn.nlark.com/yuque/0/2022/webp/283876/1642663627638-a209bd77-7f30-4808-94f8-91fcb31ba694.webp#clientId=u32514bb5-4f9a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=349&id=u9b39f317&margin=%5Bobject%20Object%5D&name=p252339694.webp&originHeight=619&originWidth=600&originalType=binary&ratio=1&rotation=0&showTitle=false&size=64326&status=done&style=none&taskId=ua00cd8a8-e671-4fc0-b8d6-373a2c116b2&title=&width=338)

## 2. 概要

我没有仔细了解整个 delay 的所有功能，只挑了其中较为感兴趣的地方，比如，怎么让它取消。我觉得这也是 delay 这个 npm 包的一个关键功能所在了吧，这种思路可以学习借鉴，或许在自己封装一些异步函数的时候也能用得到。
​

## 3. 正文

### 3.1 功能

在 delay 的 [npm 页面](https://www.npmjs.com/package/delay) 上有两段描述 delay 函数作用的代码块，第一段是说，可以让后边的代码在 100 ms 后执行：

```javascript
const delay = require('delay');

(async () => {
  bar();
  await delay(100);
  // Executed 100 milliseconds later
  baz();
})();
```


  第二段是说，假如我原打算 1000ms 后，拿取到 value: 'Done'，可是中间出于某种原因，我不打算 1000ms 后拿了，我可以取消了这个延时，提前拿到 value: 'Done'。


```javascript
const delay = require('delay');

(async () => {
  const delayedPromise = delay(1000, { value: 'Done' });

  setTimeout(() => {
    delayedPromise.clear();
  }, 500);

  // 500 milliseconds later
  console.log(await delayedPromise);
  //=> 'Done'
})();
```

  上边两块也就是我相对来说比较感兴趣的。十分简洁，虽然感觉在目前的业务中没有什么运营场景，或许以后有些用处呢？比如故意多加几行 `await delay(500)`, 以后甲方提出性能优化时一个一个删除（不是🤫

​

### 3.2 实现

[delay 源码](https://github.com/sindresorhus/delay/blob/main/index.js) 非常简短精炼，不过就实现上边那俩功能而言，许多代码是为了处理兼容，异常的代码。我不是非常关心，这样要实现上边两个功能，代码即可缩水到几行：

```javascript
const NOOP = () => {};

const delay = (ms = 0, { value } = {}) => {
  let doSomeThing = NOOP;
  let timer = null;

  const delayPromise = new Promise((resolve) => {
    doSomeThing = () => {
      resolve(value);
    };
  }).catch((err) => {
    console.log(err);
  });

  timer = setTimeout(doSomeThing, ms);

  delayPromise.clear = () => {
    clearTimeout(timer);
    timer = null;
    doSomeThing();
  };
  return delayPromise;
};

export { delay };

export default delay;
```

这段实现借鉴了 delay 源码中的想法，即：

1. 利用闭包创建一个`let`变量用于指向一个 `Promise`中用于执行 `resolve`的函数。
1. 闭包创建另一个`let`变量 `timer`用于储存定时器。这也就保证了延时可以被取消这一功能。
1. 将取消延时执行的函数挂载到闭包创建的 `Promise` 后，返回 `Promise`即可。

​

## 4. 心得

delay 源码中，正文总结那段关于闭包的使用，与对`Promise`的理解使用，是值得借鉴和揣摩的。在比较特殊的异步代码中，我们或可尝试他这种用法。
