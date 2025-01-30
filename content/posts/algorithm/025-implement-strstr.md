# 实现 strStr()

[力扣题目链接](https://leetcode-cn.com/problems/implement-strstr/)

## 描述
实现 strStr() 函数。

给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。

 

说明：

当 needle 是空字符串时，我们应当返回什么值呢？这是一个在面试中很好的问题。

对于本题而言，当 needle 是空字符串时我们应当返回 0 。这与 C 语言的 strstr() 以及 Java 的 indexOf() 定义相符。


## 示例
```
输入：haystack = "hello", needle = "ll"
输出：2

输入：haystack = "aaaaa", needle = "bba"
输出：-1

输入：haystack = "aaabaaaaaab", needle = "aaaab"
输出：6

输入：haystack = "mississippi", needle = "issipi"
输出：-1
```

## 思路
我做这道题的基本思路应该来源于知乎中搜索的 KMP，其基本思路是将目标字符串构建成一个有穷状态机，然后遍历源字符串中的字符，当满足状态时，返回其索引


## 代码
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
  if(needle === '') { return 0 }

  const dp = KMP(needle)

  const M = needle.length
  let status = 0
  for(let i = 0; i< haystack.length; i++) {
    status = dp[status][haystack.charCodeAt(i)]
    if(status === M) {
      return i - M + 1
    }
  }

  return -1
};


/**
 * @param {String} str 
 */
function KMP(str) {
  const len = str.length
  const dp = Array.from(new Array(len), () => new Array(256).fill(0))
  // 默认遇到第一个字母时，状态为 1
  dp[0][str.charCodeAt(0)] = 1

  // 设立一个影子状态，它主要用于在字符串中更新那些重复出现的字符在遇到各个字符的状态，如 'abacadabe'：
  // 在状态 7，即匹配到 abacada 时，a 遇到 a 则状态 转为 1,a 遇到 b 则状态 转为 8...
  // 在状态 8，即匹配到 abacadab 时，a 遇到 a 则状态 转为 3,a 遇到 e 则状态 转为 9...
  let X = 0
  for(let status = 1; status < len; status++) {
    // 当前状态下，遇到的其他字符时状态的转变情况（主要是应对重复出现的字符）
    // 这个 X 表示的是，上一次匹配到这个字符时的状态，通常 X 为 0，情况在下方说明
    // 如 'abcbc', 第二次匹配到 b 时，X = 0，因为此时的 X 是由 0 状态下的遇到 b，自然为 0
    // 如 'ababc', 第二次匹配到 b 时，X = 2，因为此时的 X 是由 1 状态（上一个字符是a, X的状态变成了 1）下的遇到 b，自然为 2
    for(let i = 0; i < 256; i++) {
      dp[status][i] = dp[X][i]
    }
    
    // 当前匹配字符遇到下一个匹配字符的情况时 状态 +1
    dp[status][str.charCodeAt(status)] = status + 1


    // 仅当遇到从0状态开始的重复字符时，X 才会改变，否则 X 为 0，这也就是其他状态遇到首字符时，状态一般变为1的原因
    // 除非重复的字串较多，如 'abcdabcde'，否则X 一般情况下为 0
    X = dp[X][str.charCodeAt(status)]
    console.log(X)
  }

  return dp
}
```


## 状态机辅助代码
为了方便看到各个阶段字符的状态变化，写一个打印状态机的函数：
```javascript
function logKMPObj(str) {
  const dp = KMP(str)

  const map = {}

  dp.forEach((_, i) => {
    const key = `${i}:${ str[i - 1] || '_' }`
    
    map[key] = {}
    dp[i].forEach((val, idx) => {
      if(val !== 0) {
        map[key][String.fromCharCode(idx)] = val
      }
    })
  })

  console.log(map)
}


logKMPObj('issipi')

```


上述代码执行的 console.log 结果如下：
```javascript
{
  '0:_': { i: 1 },  // 开始时，遇到字符 i, 则状态变为 1
  '1:i': { i: 1, s: 2 }, // 在状态为1，即匹配到 'i' 时，遇到字符i，则状态变为1，遇到字符s则，状态变为2
  '2:s': { i: 1, s: 3 }, // 在状态为2，即匹配到 'is' 时，遇到字符i，则状态变为1，遇到字符s则，状态变为3
  '3:s': { i: 4 }, //...
  '4:i': { i: 1, p: 5, s: 2 },
  '5:p': { i: 6 }
}
```
