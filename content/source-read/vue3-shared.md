## 阅读笔记 | Vue3 工具函数

### 1. 文章信息

- 链接：[初学者也能看懂的 Vue3 源码中那些实用的基础工具函数](https://juejin.cn/post/6994976281053888519)
- 作者：[若川](https://juejin.cn/user/1415826704971918)

​

### 2. 文章概述

本期源码共读，主要是阅读了在 `Vue3` 项目中 `shared` 板块的部分工具函数。链接中的文章很热心的给出了源码在线阅读的链接：[github1s packages/shared/src/index.ts](https://link.juejin.cn/?target=https%3A%2F%2Fgithub1s.com%2Fvuejs%2Fvue-next%2Fblob%2Fmaster%2Fpackages%2Fshared%2Fsrc%2Findex.ts)，这使得读者在不想调试的情况下，很容易阅读到源码配合文章食用。若川很详细的逐一介绍了源码文件中的每一个函数的功能，并给出了函数的使用案例，某些函数的注释中，还伴有知识点的拓展。
​

### 3. 心得

- 这部分的源码本身不是那么难理解，相比于阅读源码，我个人觉得阅读作者对源码的注释会让人收获更多。比如 `NO`，`NOOP` 这类型的工具函数，非常的简单，若川在注释中提到了这种函数的优点是**方便判断**和**容易压缩**。这便是从工程角度出发对这种简单函数的思考。我认为这种类型的函数是出于工程实践中为了代码风格统一化（比如说函数式编程），规范化，而创建的函数。**它们的使用场景应当多以引用这个函数变量形式出现: **`**const fun = obj.fun || NOOP**`**，而不是调用，执行这个函数的形式出现: **`**const a = NO()**`**。**开发者在碰到兼容处理时，不需要再创建一个新的匿名函数用于返回特定的值，而是直接引用。我想，这种函数同样减轻了代码运行时的内存。
- `isSet`，`isMap` ，`isPromise` 等这类型的函数在平时的业务中较少接触到（没大公司工作经验，就本人工作经验而言 🤷‍♂️），研发成员之间没有研发会议总结的话，只出现个一两次估计不会为其创建一个方法，而是在业务开发时顺手进行一次判断，即使项目的`util`中存在，也可能只是个别成员在维护使用。这就是框架源码与业务源码的在功能开发时的区别。我们可以参考工具类的书写形式，封装出本项目业务中，常用的工具函数。

```typescript
const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  }) as any;
};

const camelizeRE = /-(\w)/g;
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
```

- `cacheStringFunction`
  这个函数在整个文件中相较其他函数更难理解一点，不过确实有其实用之处。该函数是闭包的一个很好的实例。
  从函数用途来说：它接受一个函数`fn1`作为参数，返回一个函数`fn2`。`fn1` 接收了`string a`并返回 `string b`，`fn2` 同样接收了`string a`也返回了`string b`。
  `cacheStringFunction` 的作用就是在创建了一个私有的 `map` 对象，用来缓存经过 `fn1` 函数处理过的 `string`, `fn1` 处理一个 `sting` ，`map` 中便添加一个对应的 `key`和经过处理的`value`。`fn2` 的作用便是当再以想 `fn1` 的方式来取值时，可以直接取 `map` 在已经缓存的值，减少了一步 `fn1` 的计算时间，提升了代码执行效率。属于经典的以空间换时间。在我们平时的开发业务中，是可以借鉴学习的。

### 4. 结语

初写阅读笔记，不足之处望多建议。😉
