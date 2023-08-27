---
layout: "../../layouts/MarkdownPost.astro"
title: "TS的数据结构使用实战（链表）"
pubDate: 2023-08-27
description: "本系列文章会从实践的角度去讲解一些常用的数据结构在ts中的应用实例，因为要保证数据结构的通用性，把数据结构和数据本身的类型分离开，所以就会用到ts的泛型。
本文讲的是链表在ts中的实战。"
author: "LunaSeki"
cover:
    url: "/cover7.png"
    square: "/cover7.png"
    alt: "cover"
tags: ["前端", "typescript", "数据结构"]
theme: "light"
featured: false
---

## 引言

在 TypeScript 中，[泛型](https://zh.wikipedia.org/wiki/%E6%B3%9B%E5%9E%8B%E7%BC%96%E7%A8%8B)是一项强大的特性，它可以帮助我们编写通用的、类型安全的代码。泛型是一种参数化类型的机制，它可以在定义函数、类或接口时使用，以增加代码的通用性。通过使用泛型，我们可以编写能够适用于不同类型的代码，从而提高代码的可复用性和灵活性。泛型还可以帮助我们在编译时捕获类型错误，提供更好的类型安全性。

而[数据结构](https://zh.wikipedia.org/zh-sg/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)，可以说是编程、计算机相关工作从业者的基本功。数据结构可通过[编程语言](https://zh.wikipedia.org/wiki/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80 "编程语言")所提供的[数据类型](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B "数据类型")、[引用](https://zh.wikipedia.org/wiki/%E5%8F%83%E7%85%A7 "引用")及其他操作加以实现。

本系列文章会从实践的角度去讲解一些常用的数据结构在 ts 中的应用实例，因为要保证数据结构的**通用性**，把数据结构和数据本身的类型分离开，所以就会用到 ts 的泛型。

[## 链表（Linked List）](https://zh.wikipedia.org/zh-hans/%E9%93%BE%E8%A1%A8)

链表是一种常见的数据结构，它由一系列节点组成，根据节点关系的不同，链表又分为单向链表和双向链表。

-   单向链表：每个节点包含一个值和指向下一个节点的指针。
    ![LinkedList.png](https://s2.loli.net/2023/08/27/6CsGjap5ZVIo7Aq.png)
-   双向链表：在单向链表的基础上，每个节点还增加一个指向上一个节点的指针。

通过使用泛型类和泛型接口，我们可以构建一个通用的单向链表数据结构。

## 链表的类式实现

链表的实现主要是维护一个链表头节点，然后对链表的各种操作都是以头节点为入口，遍历所有节点而进行操作的。所有数据节点像链子一样联系在一起，所以这个数据结构叫做链表。

```ts
class ListNode<T> {
	value: T;
	next: ListNode<T> | null;

	constructor(value: T) {
		this.value = value;
		this.next = null;
	}
}

class LinkedList<T> {
	private head: ListNode<T> | null;

	constructor() {
		this.head = null;
	}

	add(value: T) {
		const newNode = new ListNode(value);

		if (!this.head) {
			this.head = newNode;
		} else {
			let current = this.head;
			while (current.next) {
				current = current.next;
			}
			current.next = newNode;
		}
	}

	remove(value: T) {
		if (!this.head) {
			return;
		}

		if (this.head.value === value) {
			this.head = this.head.next;
			return;
		}

		let current = this.head;
		while (current.next) {
			if (current.next.value === value) {
				current.next = current.next.next;
				return;
			}
			current = current.next;
		}
	}

	print() {
		let current = this.head;
		while (current) {
			console.log(current.value);
			current = current.next;
		}
	}
}
```

通过使用泛型类  `ListNode<T>`  和  `LinkedList<T>`，我们可以创建一个可以存储任意类型元素的链表。使用泛型约束，我们可以限制节点的值为特定类型，确保链表中的元素类型一致。

## 链表的函数式实现

链表的函数式实现与栈、队列的实现很像，都是把数据利用闭包存储，再返回数据的操作方法。

```ts
type ListNode<T> = {
	value: T;
	next: ListNode<T> | null;
};

type LinkedList<T> = {
	add: (value: T) => void;
	remove: (value: T) => void;
	print: () => void;
};

function newLinkedList<T>(): LinkedList<T> {
	let head: ListNode<T> | null = null;

	return {
		add: (value: T) => {
			const newNode: ListNode<T> = {
				value: value,
				next: null,
			};

			if (!head) {
				head = newNode;
			} else {
				let current = head;
				while (current.next) {
					current = current.next;
				}
				current.next = newNode;
			}
		},

		remove: (value: T) => {
			if (!head) {
				return;
			}

			if (head.value === value) {
				head = head.next;
				return;
			}

			let current = head;
			while (current.next) {
				if (current.next.value === value) {
					current.next = current.next.next;
					return;
				}
				current = current.next;
			}
		},

		print: () => {
			let current = head;
			while (current) {
				console.log(current.value);
				current = current.next;
			}
		},
	};
}
```

这样，一个链表的函数式实现（也可以叫工厂函数）就完成了

---

本系列文章比较注重实战，提供实战代码，并为想要了解原理的同学提供了相应链接，大家直接点击文章中的链接跳转即可。如果觉得文章有帮助，可以关注一下专栏噢~~
