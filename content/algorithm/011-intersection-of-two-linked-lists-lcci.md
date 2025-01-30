# 链表相交

[力扣题目链接](https://leetcode-cn.com/problems/intersection-of-two-linked-lists-lcci/)

## 描述

给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。

题目数据 保证 整个链式结构中不存在环。

注意，函数返回结果后，链表必须 保持其原始结构 。

进阶：你能否设计一个时间复杂度 O(n) 、仅用 O(1) 内存的解决方案？

## 测试用例

```javascript
getIntersectionNode([4, 1, 8, 4, 5], [5, 0, 1, 8, 4, 5]); // 8

getIntersectionNode([2, 6, 4], [1, 5]); // null
```

## 思路

**注意**

这里判断两个链表是否相交是判断相交点的内存地址是否相等，而不是是否存在相同的值

本题采用了 https://leetcode-cn.com/problems/intersection-of-two-linked-lists-lcci/solution/mian-shi-ti-0207-lian-biao-xiang-jiao-sh-b8hn/ 的题解思路

**采取了双指针解决问题**

1. 假设 A 链表长度为 a， B 链表长度为 b， 相交的结点距离链表尾部长度为 c
2. 使指针 1 从 A 开始遍历，再从 B 开始遍历，找到相交点时，走过的距离为 a + (b - c)
3. 使指针 2 从 B 开始遍历，再从 A 开始遍历，找到相交点时，走过的距离为 b + (a - c)
4. 此时有等式成立： a + (b - c) = b + (a - c)
5. 当 c 大于 0，则说明存在交点
6. 当 c 等于 0，则说明指针 1 与 指针 2 共同走过 a + b 的距离，都指向为 null，不存在交点

## 代码

```javascript
/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  let A = headA,
    B = headB;

  while (A !== B) {
    A = A === null ? headB : A.next;
    B = B === null ? headA : B.next;
  }

  return A;
};
```
