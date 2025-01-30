# 阅读笔记 | update-notifier

> 水一期笔记 😶

## 1. 前言

- 链接：[update-notifier 检测 npm 包是否更新](https://www.yuque.com/ruochuan12/notice/p6)
- 作者：[若川](https://juejin.cn/user/1415826704971918)

​

## 2. 概要

阅读的源码是 `update-notifier` 这个 npm 包的源码。我理解的这个包的使用场景应该是在项目以开发环境启动的时候，会去检查一下某些 npm 是否会更新，而且根据当前用户的安装方式 `yarn` or `npm` 进行更新提示。 不过我在实际项目中没有用过这功能，也不是很能 get 到这个包的一些个用法。花了一段时间去看，中途不懂也查看了其他同学的笔记，没啥想法，但也花了一段时间。随手模仿个极简版的更新提示代码水一期笔记吧，证明自己没完全摸鱼 🤪
​

## 3. 正文

### 3.1 源码原理

其实我认为原理就是拿到最新的版本号与当前版本做对比，然后进行通知。不过源码进行了一系列优化与兼容操作。

1. 检查是否传入了要检查的 npm 包的 name 与 version
1. 使用 `configstore` npm 包对传入的 name 生成对应的本地缓存文件，存储最新一次检查的时间
1. 检查是否应该在当前运行环境下，执行查询最新版本查询
1. 创建一个子进程，用子进程来查询最新版本，使用到了 `latest-version` 这个包，使用 `await latestVersion(name)` 可以根据包名称拿到这个包的最新版本号，并将信息存入到之前 `configstore` 创建的本地文件当中
1. 拿取本地缓存文件信息，使用 `semver` 包的 `semver.gt` 方法判断最新版本号是否大于当前传入版本号，然后进行通知。

我比较疑惑的是，第 4 步是个异步操作，而第 5 步执行时，第 4 步还未查询到信息并将信息填入缓存文件。这就使得第一次运行代码时，不会出现任何通知。我想作者应该是出于性能优化和具体使用场景方面，所以使用了子进程和缓存文件吧。由于没有了解过其具体的场景，不是很能 get 到。
​

### 3.2 做个简单的玩具

了解了大概原理后，我觉得源码中核心的两个包其实就俩：

- `latest-update`: 获取某个包的最新版本号
- `semver`: 提供一些版本号的工具方法

咱们做个极简的 van♂ 具：
**index.js**

```javascript
import boxen from 'boxen'; // 美化控制台输出
import chalk from 'chalk';
import latestVersion from 'latest-version';
import semver from 'semver';

export default async (pkg = {}) => {
  const { name, version: currentVersion } = pkg;

  if (!name || !currentVersion) {
    throw new Error('pkg.name and pkg.version required');
  }

  const latest = await latestVersion(name); // 获取最新版本号

  const isNeedNotify = semver.gt(latest, currentVersion); // 判断是否需要提示

  if (isNeedNotify) {
    const message = boxen(
      `You can update the package '${name}' version from ${chalk.dim(
        currentVersion,
      )} to ${chalk.green(latest)}`,
      {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      },
    );
    console.log(message);
  }
};
```

**example.js**

```javascript
import updateNotifierToy from './index.js';

updateNotifierToy({
  name: 'uuid',
  version: '3.0.0',
});
```

结果：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/283876/1639364926266-3342f38a-8f43-429b-9b85-1b4d49e2d165.png#clientId=u02710f59-d21a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=422&id=u98dd27b5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=844&originWidth=2059&originalType=binary&ratio=1&rotation=0&showTitle=false&size=100211&status=done&style=none&taskId=uf90c2097-8240-4a27-9fe6-f8620a375d2&title=&width=1029.5)

## 4. 心得

就酱 🧐
