# 设计链表

[力扣题目链接](https://leetcode-cn.com/problems/design-linked-list/)

## 描述

题意：

在链表类中实现这些功能：

get(index)：获取链表中第 index 个节点的值。如果索引无效，则返回-1。

addAtHead(val)：在链表的第一个元素之前添加一个值为 val 的节点。插入后，新节点将成为链表的第一个节点。

addAtTail(val)：将值为 val 的节点追加到链表的最后一个元素。

addAtIndex(index,val)：在链表中的第 index 个节点之前添加值为 val 的节点。如果 index 等于链表的长度，则该节点将附加到链表的末尾。如果 index 大于链表长度，则不会插入节点。如果 index 小于 0，则在头部插入节点。

deleteAtIndex(index)：如果索引 index 有效，则删除链表中的第 index 个节点。

## 测试用例

```javascript
MyLinkedList linkedList = new MyLinkedList();

linkedList.addAtHead(1);

linkedList.addAtTail(3);

linkedList.addAtIndex(1,2);   //链表变为1-> 2-> 3

linkedList.get(1);            //返回2

linkedList.deleteAtIndex(1);  //现在链表是1-> 3

linkedList.get(1);            //返回3

```

## 代码

> 即单纯去设计一个链表，需要考虑好各种操作的边界条件，比如删除了头节点，头节点的位置需要改变

```javascript
var MyLinkedList = function () {
  this.head = null;
  this.tail = null;
  this.length = 0;
};

/**
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function (index) {
  let node = this.head;
  while (node) {
    if (index === 0) {
      return node.val;
    }
    index--;
    node = node.next;
  }
  return -1;
};

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function (val) {
  if (!this.head) {
    this.head = { val, next: null };
    this.tail = this.head;
  } else {
    this.head = { val, next: this.head };
  }
  this.length++;
};

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function (val) {
  if (!this.tail) {
    this.head = { val, next: null };
    this.tail = this.head;
  } else {
    this.tail.next = { val, next: null };
    this.tail = this.tail.next;
  }
  this.length++;
};

/**
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function (index, val) {
  const len = this.length;
  if (index > len) {
    return;
  } else if (index === len) {
    this.addAtTail(val);
  } else if (index <= 0) {
    this.addAtHead(val);
  } else {
    let node = this.head;
    while (index > 1) {
      node = node.next;
      index--;
    }
    node.next = { val, next: node.next };
    this.length++;
  }
};

/**
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function (index) {
  if (index < 0 || index >= this.length) {
    return;
  } else if (index === 0 && this.head) {
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.length--;
  } else {
    let node = this.head;
    const isDeleteTail = index === this.length - 1;
    while (node && index > 1) {
      node = node.next;
      index--;
    }
    if (node) {
      if (isDeleteTail) {
        this.tail = node;
      }
      node.next = node.next.next;
      this.length--;
    }
  }
};
```
