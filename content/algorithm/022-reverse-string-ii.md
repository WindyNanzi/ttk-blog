# 反转字符串 2

[力扣题目链接](https://leetcode-cn.com/problems/reverse-string-ii/)

## 描述
给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 字符中的前 k 个字符。

- 如果剩余字符少于 k 个，则将剩余字符全部反转。
- 如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样。

## 示例

输入：s = "abcdefg", k = 2
输出："bacdfeg"


输入：s = "abcd", k = 2
输出："bacd"

## 代码
```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var reverseStr = function(s, k) {
  let len = s.length, needRever = true, count = 0, temp = '', res = ''
  
  for(let i = 0; i < len; i++) {
    if(needRever) {
      temp = s[i] + temp
    }else{
      temp = temp + s[i]
    }
    count ++
    if(count % k === 0) {
      needRever = !needRever
    }
    if(count % (k * 2) === 0) {
      res += temp
      temp = ''
    }
  }
  res += temp

  return res
}
```
