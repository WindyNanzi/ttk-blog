# 有效的字母异位词

[力扣题目链接](https://leetcode-cn.com/problems/valid-anagram/)

## 描述

给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

示例 1: 输入: s = "anagram", t = "nagaram" 输出: true

示例 2: 输入: s = "rat", t = "car" 输出: false

说明: 你可以假设字符串只包含小写字母。

## 代码

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) {
    return false;
  }

  const map = {};

  for (let i = 0; i < s.length; i++) {
    if (Reflect.has(map, s[i])) {
      map[s[i]] += 1;
    } else {
      map[s[i]] = 1;
    }

    if (Reflect.has(map, t[i])) {
      map[t[i]] -= 1;
    } else {
      map[t[i]] = -1;
    }
  }

  for (const val in map) {
    if (map[val] !== 0) {
      return false;
    }
  }

  return true;
};
```
