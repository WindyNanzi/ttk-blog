# 有序数组的平方

[力扣题目链接](https://leetcode-cn.com/problems/squares-of-a-sorted-array/)

**描述**

给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

示例 1： 输入：nums = [-4,-1,0,3,10] 输出：[0,1,9,16,100] 解释：平方后，数组变为 [16,1,0,9,100]，排序后，数组变为 [0,1,9,16,100]

示例 2： 输入：nums = [-7,-3,2,3,11] 输出：[4,9,9,49,121]

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  // 依旧是双指针，一个从左，一个从右，逐一判断即可
  let left = 0,
    right = nums.length;
  const arr = [];
  while (left < right) {
    if (nums[left] + nums[right - 1] > 0) {
      arr.unshift(Math.pow(nums[right - 1], 2));
      right--;
    } else {
      arr.unshift(Math.pow(nums[left], 2));
      left++;
    }
  }
  return arr;
};

console.log(sortedSquares([-7, -3, 2, 3, 11]));
```
