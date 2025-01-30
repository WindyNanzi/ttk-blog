# 两个数组的交集

[力扣题目链接](https://leetcode-cn.com/problems/intersection-of-two-arrays/)

## 描述

给定两个数组 nums1 和 nums2 ，返回 它们的交集 。输出结果中的每个元素一定是 唯一 的。我们可以 不考虑输出结果的顺序

## 代码

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  const set = new Set();
  for (const num of nums1) {
    if (nums2.includes(num)) {
      set.add(num);
    }
  }

  return Array.from(set);
};
```
