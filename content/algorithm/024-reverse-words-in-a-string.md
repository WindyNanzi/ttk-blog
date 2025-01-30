# 颠倒字符串中的单词

[力扣题目链接](https://leetcode-cn.com/problems/reverse-words-in-a-string/)

## 描述
给你一个字符串 s ，颠倒字符串中 单词 的顺序。

单词 是由非空格字符组成的字符串。s 中使用至少一个空格将字符串中的 单词 分隔开。

返回 单词 顺序颠倒且 单词 之间用单个空格连接的结果字符串。

注意：输入字符串 s中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。

## 示例
```
输入：s = "the sky is blue"
输出："blue is sky the"

输入：s = "  hello world  "
输出："world hello"
解释：颠倒后的字符串中不能存在前导空格和尾随空格。

输入：s = "a good   example"
输出："example good a"
解释：如果两个单词间有多余的空格，颠倒后的字符串需要将单词间的空格减少到仅有一个。
```

## 代码
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  const newS = s.trim()
  const len = newS.length
  const arr = []

  let i = 0
  while(i < len) {
    let temp = ''

    while(newS[i] !== ' ' && newS[i] !== ' ' && i < len) {
      temp += newS[i]
      i++
    }

    if(temp !== '') {
      arr.unshift(temp)
    } else {
      i++
    }
  }
  console.log(arr.join(' '))
  return arr.join(' ')
}


reverseWords("  hello world  ")
reverseWords("a good   example")
```

双指针法
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  const strArr = Array.from(s)
  removeExtraSpaces(strArr)

  reverse(strArr)

  let start = 0
  for(let end = 0; end <= strArr.length; end++) {
    if(isBlankSpace(strArr[end]) || end === strArr.length){
      reverse(strArr, start, end - 1)
      start = end + 1
    }
  }

  // console.log(strArr.join(''))
  return strArr.join('')
}

/**
 * 判断是否为空格
 * @param {String} char 
 * @returns Boolean
 */
function isBlankSpace(char) {
  return char === ' ' || char === ' '
}

/**
 * 移除多余空格
 * @param {Array} arr 
 */
function removeExtraSpaces(arr) {
  let fast = 0, slow = 0
  const len = arr.length

  // 清除前面的空格与多余空格
  while(fast < len) {
    if(isBlankSpace(arr[fast]) && (fast === 0 || isBlankSpace(arr[fast - 1]))) {
      fast ++
    } else {
      arr[slow] = arr[fast]
      fast ++
      slow ++
    }
  }
 
  // 清除最后一个空格
  if(isBlankSpace(arr[slow - 1])) { slow -- }

  // 数组的真实长度
  arr.length = slow
}

/**
 * 反转数组中的指定位置的元素
 * @param {Arrray} arr 
 * @param {Number} start 
 * @param {Number} end 
 */
function reverse(arr, start = 0, end = arr.length - 1) {
  while(start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]]
    start ++
    end --
  }
}
```
