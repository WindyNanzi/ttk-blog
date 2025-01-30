# 移除元素

[力扣题目链接](https://leetcode-cn.com/problems/remove-element/submissions/)

**描述**

给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。

不要使用额外的数组空间，你必须仅使用 $O(1)$ 额外空间并原地修改输入数组。

元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

示例 1: 给定 nums = [3,2,2,3], val = 3, 函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。 你不需要考虑数组中超出新长度后面的元素。

示例 2: 给定 nums = [0,1,2,2,3,0,4,2], val = 2, 函数应该返回新的长度 5, 并且 nums 中的前五个元素为 0, 1, 3, 0, 4。

你不需要考虑数组中超出新长度后面的元素。

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let left = 0,
    right = nums.length;

  // 由于不需要考虑超出新长度后面的元素，因此可以以此做优化
  /**
   * 在左指针下标小于右指针下标情况下
   * 假如左指针的值等于 val, 则将右指针的值赋给左指针，并将右指针向左移动
   * 否则，左指针向右移动，这样，两个指针合计走的长度正好是数组的长度
   * 恰好左指针下标往左，全是符合条件的元素
   */
  while (left < right) {
    if (nums[left] === val) {
      nums[left] = nums[right - 1];
      right--;
    } else {
      left++;
    }
  }
  return left;
};

console.log(removeElement([3, 2, 2, 3], 3)); // 2
```
