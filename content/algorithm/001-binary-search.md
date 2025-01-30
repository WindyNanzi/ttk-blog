# 二分查找

[力扣题目链接](https://leetcode-cn.com/problems/binary-search/)

**描述**

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1

```javascript
var search = function (nums, target) {
  let begin = 0,
    end = nums.length - 1;

  while (begin <= end) {
    const mid = parseInt((begin + end) / 2);
    if (target < nums[mid]) {
      end = mid - 1;
    } else if (target > nums[mid]) {
      begin = mid + 1;
    } else if (target === nums[mid]) {
      return mid;
    }
  }
  return -1;
};
```
