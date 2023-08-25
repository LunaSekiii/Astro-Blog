---
layout: "../../layouts/MarkdownPost.astro"
title: "TS的数据结构使用实战（栈）"
pubDate: 2023-08-25
description: ""
author: "LunaSeki"
cover:
    url: "/cover7.png"
    square: "/cover7.png"
    alt: "cover"
tags: ["前端", "typescript", "数据结构"]
theme: "light"
featured: true
---

## 引言

在 TypeScript 中，[泛型](https://zh.wikipedia.org/wiki/%E6%B3%9B%E5%9E%8B%E7%BC%96%E7%A8%8B)是一项强大的特性，它可以帮助我们编写通用的、类型安全的代码。泛型是一种参数化类型的机制，它可以在定义函数、类或接口时使用，以增加代码的通用性。通过使用泛型，我们可以编写能够适用于不同类型的代码，从而提高代码的可复用性和灵活性。泛型还可以帮助我们在编译时捕获类型错误，提供更好的类型安全性。

而[数据结构](https://zh.wikipedia.org/zh-sg/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)，可以说是编程、计算机相关工作从业者的基本功。数据结构可通过[编程语言](https://zh.wikipedia.org/wiki/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80 "编程语言")所提供的[数据类型](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B "数据类型")、[引用](https://zh.wikipedia.org/wiki/%E5%8F%83%E7%85%A7 "引用")及其他操作加以实现。

本系列文章会从实践的角度去讲解一些常用的数据结构在 ts 中的应用实例，因为要保证数据结构的**通用性**，把数据结构和数据本身的类型分离开，所以就会用到 ts 的泛型。

## [栈（Stack）](https://www.ruanyifeng.com/blog/2013/11/stack.html)

栈是一种常见的数据结构，它遵循先进后出（LIFO）的原则。在实现一个通用的栈数据结构时，我们可以使用泛型类来定义栈。

<p align=center><img src="https://s2.loli.net/2023/08/25/j5H7s4M2to3FOwu.png" alt="栈.png" width="80%" /></p>

如图所示，栈只支持从一头对数据进行操作，并提供`Push`（推入，从栈顶插入一个数据）、`Pop`（弹出，从栈顶移出一个数据）、`Peek`（获取栈顶的数据，并不修改数据）、`isEmpty`（判断栈是否为空）、`size`（获取栈的长度）等方法

## 栈的类式实现

下面是一个简单的栈类的实现：

```ts
class Stack<T> {
	private items: T[];

	constructor() {
		this.items = [];
	}

	push(item: T) {
		this.items.push(item);
	}

	pop(): T | undefined {
		return this.items.pop();
	}

	peek(): T | undefined {
		return this.items[this.items.length - 1];
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}
}
```

通过使用泛型类  `Stack<T>`，我们可以灵活地在栈中存储不同类型的元素。同时，我们可以在编译时检查传入的元素类型是否与栈的类型一致，从而减少类型错误的发生。

## 栈的函数式实现

当然，现在大家都喜欢函数式编程，于是这里提供了函数版本的栈：

```ts
type Stack<T> = {
	push: (item: T) => void;
	pop: () => T | undefined;
	peek: () => T | undefined;
	isEmpty: () => boolean;
	size: () => number;
};

function newStack<T>(): Stack<T> {
	let items: T[] = [];
	return {
		push: (item: T) => {
			items.push(item);
		},
		pop: () => items.pop(),
		peek: () => items[items.length - 1],
		isEmpty: () => items.length === 0,
		size: () => items.length,
	};
}
```

写惯了函数式组件的同学看这个版本可能比较顺眼 😆，原理就是用闭包去代替私有属性去储存数据罢了，还是比较好理解的

---

感觉这个系列内容比较多~~比较容易水文章~~，所以打算按照数据结构写，然后整理在一个合集里，大家感兴趣的可以关注一下 😋
