# 移除链表元素

[力扣题目链接](https://leetcode-cn.com/problems/remove-linked-list-elements/)

**描述**

题意：删除链表中等于给定值 val 的所有节点。

示例 1：

输入：head = [1,2,6,3,4,5,6], val = 6

输出：[1,2,3,4,5]

示例 2：

输入：head = [], val = 1

输出：[]

示例 3：

输入：head = [7,7,7,7], val = 7

输出：[]

## 构造一个新链表

```javascript
var removeElements = function (head, val) {
  const newHead = { val: null, next: null };
  let temp = newHead;

  while (head) {
    if (head.val !== val) {
      temp.next = { val: head.val, next: null };
      temp = temp.next;
    }
    head = head.next;
  }

  return newHead.next;
};
```

## 在原链表上直接更改

**不推荐**

```javascript
var removeElements = function (head, val) {
  let temp = { val: null, next: head },
    current = head;
  while (head && head.val) {
    if (head.val === val) {
      temp.next = head.next;
      current = head.next;
      head = head.next;
    } else {
      break;
    }
  }

  while (current.next) {
    if (current.next.val === val) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }
  return temp.next;
};
```
