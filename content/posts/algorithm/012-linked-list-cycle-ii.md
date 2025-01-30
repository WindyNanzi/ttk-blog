# 环形链表 II

[力扣题目链接](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

## 描述

题意： 给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

为了表示给定链表中的环，使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

说明：不允许修改给定的链表。

有环的链表：
![](https://cdn.nlark.com/yuque/0/2022/png/283876/1647587183103-assets/web-upload/9f89582b-e09c-491b-9d41-739ee33a9677.png)

## 思路

此处参照 leetcode 官方给出的解体思路:

如下图所示，设链表中环外部分的长度为 $a$。$slow$ 指针进入环后，又走了 $b$ 的距离与 $fast$ 相遇。此时，$fast$ 指针已经走完了环的 $n$ 圈，因此它走过的总距离为 $a+n(b+c)+b=a+(n+1)b+nc$。

![](https://cdn.nlark.com/yuque/0/2022/png/283876/1647930414743-assets/web-upload/1eb4ae5a-cef2-47bc-bfad-6a73755060e5.png)

根据题意，任意时刻，$fast$ 指针走过的距离都为 $slow$ 指针的 2 倍。因此，我们有

$$
  a+(n+1)b+nc=2(a+b) \implies a=c+(n-1)(b+c)
$$

有了 $a=c+(n-1)(b+c)$ 的等量关系，我们会发现：从相遇点到入环点的距离加上 $n-1$ 圈的环长，恰好等于从链表头部到入环点的距离。

因此，当发现 $slow$ 与 $fast$ 相遇时，我们再额外使用一个指针 $ptr$。起始，它指向链表头部；随后，它和 $slow$ 每次向后移动一个位置。最终，它们会在入环点相遇。

## 代码

```javascript
var detectCycle = function (head) {
  if (head === null) {
    return null;
  }
  let slow = head,
    fast = head;
  while (fast !== null) {
    slow = slow.next;
    if (fast.next !== null) {
      fast = fast.next.next;
    } else {
      return null;
    }
    if (fast === slow) {
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      return ptr;
    }
  }
  return null;
};
```
