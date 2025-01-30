# 两数之和

[力扣题目链接](https://leetcode-cn.com/problems/two-sum/)

## 描述
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

你可以想出一个时间复杂度小于 $O(n2)$ 的算法吗？

## 示例
```javascript
twoSum([2, 7, 11, 15], 9) // [0, 1]
twoSum([3, 2, 4], 6) // [0, 2]
twoSum([3, 3], 6) // [0, 1]
```

## 代码
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const map = new Map()

  for(let i = 0; i < nums.length; i++) {
    const newTarget = target - nums[i]
    if(map.has(newTarget)) {
      return [map.get(newTarget), i]
    }
    if(!map.has(nums[i])) {
      map.set(nums[i], i)
    }
  }
};
```
