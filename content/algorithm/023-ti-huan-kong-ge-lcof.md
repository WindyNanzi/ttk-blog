# 替换空格

[力扣题目链接](https://leetcode-cn.com/problems/ti-huan-kong-ge-lcof/)

## 描述
请实现一个函数，把字符串 s 中的每个空格替换成"%20"。

输入：s = "We are happy."
输出："We%20are%20happy."



## 代码
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function(s) {
  let res = ''

  for(let i = 0; i< s.length; i++) {
    if(s[i] !== ' ') {
      res += s[i]
    }else {
      res += '%20'
    }
  }

  return res
}
```
