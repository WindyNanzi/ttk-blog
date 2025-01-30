# 四数相加II

[力扣题目链接](https://leetcode-cn.com/problems/4sum-ii/)

## 描述

给定四个包含整数的数组列表 A , B , C , D ,计算有多少个元组 (i, j, k, l) ，使得 A[i] + B[j] + C[k] + D[l] = 0。

为了使问题简单化，所有的 A, B, C, D 具有相同的长度 N，且 0 ≤ N ≤ 500 。所有整数的范围在 -2^28 到 2^28 - 1 之间，最终结果不会超过 2^31 - 1 。


## 示例
```javascript
fourSumCount([1,2],[-2,-1],[-1,2],[0,2]) // 2

// 解释
// (0,0,0,1) -> nums1[0] + nums2[0] + nums3[0] + nums4[1] = 1 -2 -1 + 2 = 0
// (1,1,0,0) -> nums1[1] + nums2[1] + nums3[0] + nums4[0] = 2 -1 -1 + 0 = 0

```

## 代码
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @param {number[]} nums4
 * @return {number}
 */
var fourSumCount = function(nums1, nums2, nums3, nums4) {
  const map = new Map()
  const len = nums1.length

  for(let i = 0; i< len; i++) {
    for(let j = 0; j < len; j++) {
      const key = nums1[i] + nums2[j]
      if(map.has(key)) {
        map.set(key, map.get(key)+1)
      }else {
        map.set(key, 1)
      }
    }
  }

  let count = 0;
  for(let i = 0; i< len; i++) {
    for(let j = 0; j < len; j++) {
      const key = nums3[i] + nums4[j]
      if(map.has(-key)) {
        count += map.get(-key)
      }
    }
  }

  return count
}
```
