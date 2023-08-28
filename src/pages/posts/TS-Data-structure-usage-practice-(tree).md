---
layout: "../../layouts/MarkdownPost.astro"
title: "TS的数据结构使用实战（树）"
pubDate: 2023-08-28
description: "本系列文章会从实践的角度去讲解一些常用的数据结构在ts中的应用实例，因为要保证数据结构的通用性，把数据结构和数据本身的类型分离开，所以就会用到ts的泛型。
本文讲的是树在ts中的实战。"
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

## [树（Tree）](<https://zh.wikipedia.org/zh-hans/%E6%A0%91_(%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)>)

树是一种非常常见的数据结构，它由一系列节点组成，每个节点可以有零个或多个子节点。

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9c9e3d94e154ba1b083b9fd6807a42b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=300&h=282&e=png&a=1&b=fbfbfb" alt="tree.png" width="50%" /></p>

树的种类又很多，以下是维基百科中给出的树的种类：

> -   无序树：树中任意节点的子节点之间没有顺序关系，这种树称为无序树，也称为自由树。
> -   有序树：树中任意节点的子节点之间有顺序关系，这种树称为有序树；
>     -   [二叉树](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%8F%89%E6%A0%91 "二叉树")：每个节点最多含有两个子树的树称为二叉树；
>         -   [完全二叉树](https://zh.wikipedia.org/wiki/%E5%AE%8C%E5%85%A8%E4%BA%8C%E5%8F%89%E6%A0%91 "完全二叉树")：对于一棵二叉树，假设其深度为 d（d>1）。除了第 d 层外，其它各层的节点数目均已达最大值，且第 d 层所有节点从左向右连续地紧密排列，这样的二叉树被称为完全二叉树；
>             -   [满二叉树](https://zh.wikipedia.org/wiki/%E6%BB%A1%E4%BA%8C%E5%8F%89%E6%A0%91 "满二叉树")：所有叶节点都在最底层的完全二叉树；
>         -   [平衡二叉树](https://zh.wikipedia.org/wiki/%E5%B9%B3%E8%A1%A1%E4%BA%8C%E5%8F%89%E6%A0%91 "平衡二叉树")（[AVL 树](https://zh.wikipedia.org/wiki/AVL%E6%A0%91 "AVL树")）：当且仅当任何节点的两棵子树的高度差不大于 1 的二叉树；
>         -   [排序二叉树](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E4%BA%8C%E5%85%83%E6%A8%B9 "排序二元树")([二叉查找树](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%8F%89%E6%9F%A5%E6%89%BE%E6%A0%91 "二叉查找树")（英语：Binary Search Tree))：也称二叉搜索树、有序二叉树；
>     -   [霍夫曼树](https://zh.wikipedia.org/wiki/%E9%9C%8D%E5%A4%AB%E6%9B%BC%E6%A0%91 "霍夫曼树")：[带权路径](https://zh.wikipedia.org/w/index.php?title=%E5%B8%A6%E6%9D%83%E8%B7%AF%E5%BE%84&action=edit&redlink=1 "带权路径（页面不存在）")最短的二叉树称为哈夫曼树或最优二叉树；
>     -   [B 树](https://zh.wikipedia.org/wiki/B%E6%A0%91 "B树")：一种对读写操作进行优化的自平衡的二叉查找树，能够保持数据有序，拥有多于两个子树。

其实树的种类不止这些，但是核心的数据结构是相同的，区别只是树的维护、操作方法不同，在实际应用中，树的维护和操作方法会因树的类型和要求而异，以满足特定的需求和性能要求。

我们选用相对简单的二叉树来演示如何在 TS 中实现。

## 二叉树的类式实现

二叉树的数据存储有点像我们前面讲过的链表，本身只存储根元素（root）的信息，在通过节点之间的关系去操作数据。

```ts
interface BinaryTreeNode<T> {
	value: T;
	left: BinaryTreeNode<T> | null;
	right: BinaryTreeNode<T> | null;
}

class BinaryTree<T> {
	private root: BinaryTreeNode<T> | null;

	constructor() {
		this.root = null;
	}

	add(value: T) {
		const newNode: BinaryTreeNode<T> = {
			value: value,
			left: null,
			right: null,
		};

		if (!this.root) {
			this.root = newNode;
		} else {
			this.addNode(this.root, newNode);
		}
	}

	private addNode(node: BinaryTreeNode<T>, newNode: BinaryTreeNode<T>) {
		if (newNode.value < node.value) {
			if (node.left === null) {
				node.left = newNode;
			} else {
				this.addNode(node.left, newNode);
			}
		} else {
			if (node.right === null) {
				node.right = newNode;
			} else {
				this.addNode(node.right, newNode);
			}
		}
	}

	// 其他二叉树的操作方法
	// ...
}
```

通过使用泛型接口  `TreeNode<T>`  和泛型类  `Tree<T>`，我们可以构建一个通用的树数据结构。泛型约束可以确保树节点的值为特定类型，避免不正确的操作。

## 二叉树的函数式实现

函数式实现也是类似的方式，将树的根节点存储在闭包中，并返回树的操作方法供使用。

```ts
type BinaryTreeNode<T> = {
	value: T;
	left: BinaryTreeNode<T> | null;
	right: BinaryTreeNode<T> | null;
};

type BinaryTree<T> = {
	add: (value: T) => void;
	// 其他二叉树的操作方法
	// ...
};

function newBinaryTree<T>(): BinaryTree<T> {
	let root: BinaryTreeNode<T> | null = null;

	function add(value: T) {
		const newNode: BinaryTreeNode<T> = {
			value: value,
			left: null,
			right: null,
		};

		if (!root) {
			root = newNode;
		} else {
			addNode(root, newNode);
		}
	}

	function addNode(node: BinaryTreeNode<T>, newNode: BinaryTreeNode<T>) {
		if (newNode.value < node.value) {
			if (node.left === null) {
				node.left = newNode;
			} else {
				addNode(node.left, newNode);
			}
		} else {
			if (node.right === null) {
				node.right = newNode;
			} else {
				addNode(node.right, newNode);
			}
		}
	}

	return {
		add,
		// 其他二叉树的操作方法
		// ...
	};
}
```

这样，一个简单二叉树的函数式实现（工厂函数）就完成了。

---

本系列暂时完结*★,°*:.☆(￣ ▽ ￣)/$:_.°★_ 。
