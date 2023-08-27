---
layout: "../../layouts/MarkdownPost.astro"
title: "TS的数据结构使用实战（队列）"
pubDate: 2023-08-26
description: "本系列文章会从实践的角度去讲解一些常用的数据结构在ts中的应用实例，因为要保证数据结构的通用性，把数据结构和数据本身的类型分离开，所以就会用到ts的泛型。
本文讲的是队列在ts中的实战。"
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

## [队列（Queue）](https://zh.wikipedia.org/zh-hans/%E9%98%9F%E5%88%97)

队列是一种常见的数据结构，它遵循先进先出（FIFO）的原则。我们可以使用泛型类来实现一个通用的队列数据结构。

<p align=center><img src="https://s2.loli.net/2023/08/26/q4xt8FGupyIY1PT.png" alt="image.png" width="80%" /></p>

队列简单来说就是“一头进一头出”的数据结构，这样的结构可以帮助我们处理一些对顺序有要求的问题，比如 bfs 就要用到队列。队列需要提供`enqueue`（从队尾插入数据）、`dequeue`（从队头取出数据）、`peek`（查看队头数据）、`iseEmpty`（队列判空）、`size`（获取队列长度）等方法。

## 队列的类式实现

队列的类式实现很简单，利用类的私有属性存储数据，并暴露相应的操作方法即可：

```ts
class Queue<T> {
	private items: T[];

	constructor() {
		this.items = [];
	}

	enqueue(item: T) {
		this.items.push(item);
	}

	dequeue(): T | undefined {
		return this.items.shift();
	}

	peek(): T | undefined {
		return this.items[0];
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}
}
```

使用泛型类  `Queue<T>`，我们可以在队列中存储不同类型的元素，并在编译时确保元素类型的一致性。这样，我们就可以避免在运行时出现类型错误。

## 队列的函数式实现

队列的函数式实现则利用函数的闭包，实现只返回队列的操作方法而不暴露数据的需求：

```ts
type Queue<T> = {
	enqueue: (item: T) => void;
	dequeue: () => T | undefined;
	peek: () => T | undefined;
	isEmpty: () => boolean;
	size: () => number;
};

function newQueue<T>(): Queue<T> {
	let items: T[] = [];
	return {
		enqueue: (item: T) => {
			items.push(item);
		},
		dequeue: () => items.shift(),
		peek: () => items[0],
		isEmpty: () => items.length === 0,
		size: () => items.length,
	};
}
```

这两种方法都比较简单，大家根据实际需求以及自己的喜好选择即可

---

本系列文章比较注重实战，提供实战代码，并为想要了解原理的同学提供了相应链接，大家直接点击文章中的链接跳转即可。
