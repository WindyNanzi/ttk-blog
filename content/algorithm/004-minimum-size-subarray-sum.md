# 长度最小的子数组

[力扣题目链接](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)

**描述**

给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的 连续 子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

示例：

输入：s = 7, nums = [2,3,1,2,4,3] 输出：2 解释：子数组 [4,3] 是该条件下的长度最小的子数组。

**本题推荐采用「滑动窗口」的方式解决**

左指针，右指针包含着一个区间，这个区间的数组和，大于等于 target

最小区间长度由当前区间长度与历史最小区间长度做对比

```javascript
var minSubArrayLen2 = function (target, nums) {
  const len = nums.length;
  let left = 0,
    right = 0,
    sum = 0,
    res = len + 1;

  while (right < len) {
    sum += nums[right];
    if (sum >= target) {
      while (sum - nums[left] >= target) {
        sum -= nums[left];
        left++;
      }
      res = Math.min(res, right - left + 1);

      if (res === 1) {
        return 1;
      }
    }

    right++;
  }

  // 初始化时 res = len + 1, 遍历数组结束，res 值未改动说明整个数组和未到达 target
  return res === len + 1 ? 0 : res;
};

console.log(minSubArrayLen2(7, [2, 3, 1, 2, 4, 3]));
```

## 拓展题目 - 水果成篮

**水果成篮**

[力扣题目链接](https://leetcode-cn.com/problems/fruit-into-baskets/)

**题目描述**

原题目不太容易理解，换个描述方式：

给定一个数组，找出其中最长的子数组的长度。这个子数组应该满足这个条件：包含至多两种不同的值。。

示例：

输入 fruits = [2,3,3,2,4,3] 输出：4 解释：子数组 [2,3,3,2] 是该条件下的长度最小的子数组。

输入 fruits = [3,3,3,1,2,1,1,2,3,3,4] 输出：5 解释：子数组 [1,2,1,1,2] 是该条件下的长度最小的子数组。

```javascript
/**
 * @param {number[]} fruits
 * @return {number}
 */
var totalFruit = function (fruits) {
  // repeat 用来记录在出现新元素时，新元素前重复出现的元素长度
  // 如 arr = [0,1,1,6,6,1] 我们需要从 arr[1] 来计算，
  // 当快指针 right 走到 3，(arr[3]) 时，
  // 此时慢指针 left 应该对应 3 - 2 = 1，即 arr[1]
  // 这样可以省去 while 循环找到 left
  let left = 0,
    max = 0,
    repeat = 1;
  const len = fruits.length;
  let types = [];

  for (let right = 0; right < len; right++) {
    if (types.includes(fruits[right])) {
      repeat = fruits[right] === fruits[right - 1] ? repeat + 1 : 1;
      continue;
    }
    if (types.length < 2) {
      types.push(fruits[right]);
      // 前面两个元素的重复不计入
      repeat = 1;
    } else {
      max = Math.max(max, right - left);
      types = [fruits[right - 1], fruits[right]];
      left = right - repeat;
      repeat = 1;
    }
  }

  return Math.max(max, len - left);
};
```
