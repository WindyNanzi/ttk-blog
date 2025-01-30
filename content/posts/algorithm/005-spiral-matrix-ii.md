# 螺旋矩阵 II

[力扣题目链接](https://leetcode-cn.com/problems/spiral-matrix-ii/)

**描述**

给定一个正整数 n，生成一个包含 1 到 $n^2$ 所有元素，且元素按顺时针顺序螺旋排列的正方形矩阵。

示例:

输入: 3 输出:
[
[ 1, 2, 3 ],
[ 8, 9, 4 ],
[ 7, 6, 5 ]
]

## 有穷状态机解法

```javascript
/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function (n) {
  const res = Array.from(new Array(n), () => new Array(n).fill(0));
  let status = 'R';
  // 构建状态机
  const STATUS_MAP = {
    R: 'B',
    B: 'L',
    L: 'T',
    T: 'R',
  };

  let i = 0,
    j = 0,
    k = 0;
  const max = n ** 2;
  while (k < max) {
    k++;
    if (i < n && res[i][j] === 0) {
      res[i][j] = k;
      switch (status) {
        case 'R':
          j++;
          break;
        case 'B':
          i++;
          break;
        case 'L':
          j--;
          break;
        case 'T':
          i--;
          break;
      }
    } else {
      k--;
      // 碰到拐点
      switch (status) {
        case 'R':
          j--; // 向右的先向左
          i++; // 再向下
          break;
        case 'B':
          i--; // 向下的先向上
          j--; // 再向左
          break;
        case 'L':
          j++; // 向左的先向右
          i--; // 再向上
          break;
        case 'T':
          i++; // 向上的先向下
          j++; // 再向右
          break;
      }
      status = STATUS_MAP[status];
    }
  }
  return res;
};

generateMatrix(4);
```
