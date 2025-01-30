# 赎金信

[力扣题目链接](https://leetcode-cn.com/problems/4sum-ii/)

## 描述

给你两个字符串：ransomNote 和 magazine ，判断 ransomNote 能不能由 magazine 里面的字符构成。

如果可以，返回 true ；否则返回 false 。

magazine 中的每个字符只能在 ransomNote 中使用一次。

## 代码
```javascript
/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function(ransomNote, magazine) {
  let m = ransomNote.length, n = magazine.length

  if(m > n) { return false }

  const charMap = { }

  for(let i = 0; i < m; i++) {
    if(charMap[ransomNote[i]]) {
      charMap[ransomNote[i]] += 1
    }else {
      charMap[ransomNote[i]] = 1
    }
  }


  for(let i = 0; i < n; i++) {
    if(charMap[magazine[i]]) {
      charMap[magazine[i]] -= 1
      m --
      if(m === 0) {
        return true
      }
      if(charMap[magazine[i]] === 0) {
        Reflect.deleteProperty(charMap, magazine[i])
      }
    }
  }

  return false
}
```
