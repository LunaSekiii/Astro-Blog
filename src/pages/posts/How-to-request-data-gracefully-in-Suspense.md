---
layout: "../../layouts/MarkdownPost.astro"
title: "如何在Suspense中优雅地请求数据"
pubDate: 2023-04-23
description: "在React的Suspense中，根据数据请求Promise的状态加载子组件，或直接使用react-cache缓存请求"
author: "LunaSeki"
cover:
    url: "/cover1.png"
    square: "/cover1.png"
    alt: "cover"
tags: ["React", "Promise"]
theme: "light"
featured: true
---

**如果你比较赶时间，可以直接看[结果](#conclusion)**

---

## 什么是 Sunpense

[Suspense](https://react.docschina.org/reference/react/Suspense) 是 React 中的一个组件，直译过来有*悬挂*的意思，能够将其包裹的**异步**组件挂起，直到**组件加载完成**后再渲染

### 懒加载

在 React 组件挂载的过程中，一般是等所有的组件都加载好后一起挂载到 Dom 上，
如果出现了较大的组件，就会拖慢网页整体的加载速度，特别是在 SPA 上会出现长时间的白屏，影响用户体验

于是，React 提供了`lazy` Api，用于延迟加载某个组件，这样就不会拖慢其他组件的加载速度

给 React 上的 `lazy` 方法传入一个返回 Promise 或类 Promise 对象的函数，即可实现对 Promise 的结果的懒加载

恰好，ES 中的**动态引入**`import()`就会返回一个 Promise，因此我们可将其写成匿名函数的返回值，并作为参数传给`lazy`，下面代码就对组件进行了懒加载

```javascript
// 对Component进行懒加载
const LazyComponent = React.lazy(() => import("./Component"));
```

### 挂起

但是通过`lazy`得出的组件直接使用的话会在加载时报错，还需要在外面包裹一层 Suspense 组件才能够正常使用

```javascript
// 懒加的载子组件
const SubComponent = React.lazy(() => import("./SubComponent"));

// 用Suspense包裹的组件会被挂起，加载完成后再挂载
function MainComponent() {
	return <Suspense fallback={<div>Loading......</div>}>
        <SubComponent>
    </Suspense>;
}
```

渲染时，React 会先将 Suspense 的 fallback 中的内容挂载，并将子组件挂起，等待加载完成后就挂载，并将 fallback 卸载
例如上面的代码，会在 SubComponent 加载时显示 Loading......，等待 Subcomponent 加载完成后显示子组件内容

### 懒加载组件的加载过程

为啥直接使用会懒加载的组件报错呢？我们输出一下`lazy`返回的对象看看：
![lazy返回对象 | inline](https://s2.loli.net/2023/04/23/e7TKDQqJxp6m39I.png)

原来这个对象并不是我们熟悉的组件，而是拥有状态（status）和结果（result）的高阶对象，直接使用当然会报错啦

那么问题来了，React 为什么要返回这个对象而不是返回一个普通的组件呢？

**这是为了通知 Suspense 组件！**

简单地说，Suspense 组件会尝试渲染子组件，假如子组件未加载完成，则会转而渲染 fallback 里的内容

那么 Suspense 又是如何判断子组件是否加载完成的呢？对了，**就是通过捕获子组件异常！**

子组件有三种状态：

1. 加载中，抛出加载中的 Promise
2. 加载完成，正常返回结果
3. 加载异常，抛出错误

Suspense 会尝试加载子组件，并通[componentDidCatch](https://react.docschina.org/reference/react/Component#componentdidcatch)过对抛出的异常进行捕获，大概加载流程为：

![Suspense加载流程 | inline](https://s2.loli.net/2023/04/23/ZRH693xLivSamAN.png)

这样，通过对未加载完成的子组件不断尝试加载，就能够实现“挂起”这一过程

## 对需要请求数据的组件使用 Suspense

现在我们知道，需要将子组件加载的状态**通知 Suspense** 才能够实**等待 ajax 请求**后再加载组件的效果，所以普通使用 ajax 发起请求是无法做到的

### react-cache

react-cache 是 React 官方的处理数据副作用方案，里面提供了一个方法`unstable_createResource`，用于创建一个类似懒加载组件的对象

你可以访问这个对象上的`read`方法，若访问的数据不存在，则动态加载，并抛出 Promise,若数据存在，则正常返回数据。听起来是不是和懒加载很像？

```javascript
import getURL from "./api"; //一个封装的请求，返回一个Promise
import { unstable_createResource } from "react-cache";

// 类似import(),传入一个返回值为PRomise的函数，生成一个拥有状态的对象
const myData = unstable_createResource(() => {
	getURL();
});
```

```javascript
// 在子组件中使用
function SubComponent() {
	const data = myData.read();
	return <div>{data}</div>;
}
```

这样，父组件中包裹子组件的 Suspense 就能**像检测懒加载组件一样**检测子组件数据加载的状态，从而展示 fallback 或子组件了

但是，react-cache 其实是一种数据缓存方案，使用 LRU（当缓存空间满时，优先清理最近最少使用的数据）策略缓存数据，能够根据不同的参数缓存请求的结果，并供组件调用，如下

```javascript
import getURL from "./api";
import { unstable_createResource } from "react-cache";

const myData = unstable_createResource(
	(param1, param2) => {
		getURL(param1, param2);
	},
	(param1, param2) => param1 + param2
);
```

`unstable_createResource`接受了两个参数

1. 第一个是产生 Promise 的函数，可以将参数传入匿名函数后再传入请求数据的函数（有点套娃，但是这样传参方便了函数内部复用请求）
2. 第二个参数是个哈希函数，作用是接受与前面函数同样的参数，然后生成一串识别码给函数本身查询数据是否存在（缓存）

这样,使用时就能`read`方法传递不同的参数，对于缓存一些高频使用的接口的数据非常有用

如果你只是想初始化时请求、不想使用缓存，或者单纯的不想引入更多库，那么可以手写一个**能够通知 Suspense**的函数

<div id="conclusion"/>

### 自己写一个加工函数

从上面两个例子可以知道，要通知 Suspense 函数，则必须要根据 Promise 状态进行不同的操作

为了简化，我们的加工函数就不自己创建 Promise 了，而是在外面创建后对 Promise 进行加工

```javascript
// 创建函数，接受一个promise
function wrapPromise(promise) {
	let status = 0;
	let result;
	// 调用promise，并在回调中更改加工函数中的状态
	const callPromise = promise.then(
		(res) => {
			status = 1;
			result = res;
		},
		(err) => {
			status = -1;
			result = err;
		}
	);
	// 返回一个对象，只需要提供read方法
	return {
		read() {
			switch (status) {
				case 0:
					throw callPromise;
				case 1:
					return result;
				case -1:
					throw result;
			}
		},
	};
}
```

这样，子组件通过调用加工函数返回的对象上的`read`方法，即可根据请求的状态优雅地加载组件了

```javascript
// 获取加工后的对象
const data = wrapPromise(promise);

// 在子组件中使用
function SubComponent() {
	const data = myData.read();
	return <div>{data}</div>;
}
```

## 请求数据的时机

有了 Suspense 和加工函数，我们还要知道该在什么地方调用加工函数

-   在子组件中调用`warpPromise`然后请求？

    这是不行的，因为 Suspense 更改渲染的组件时会进行组件的重新挂载操作，相当于子组件中的所有操作都重新运行一遍。
    重新运行的加工函数又会重新调用 Promise 并返回全新的对象，里面的`read`方法也会继续抛出错误，从而使得 Suspense **一直渲染 fallback 中的内容**

-   在文件最外层调用？

    这是可行的，组件内可以正常访问到外面的数据。但是数据写死了不太好控制，只能够做一些初始化请求

-   在父组件中调用？

    在父组件中调用，然后通过 prop 传递给子组件，这是可行的。并且还可以结合其他 Hook，进行灵活地操作

## 结论

要优雅地在 Suspense 中请求数据，其实只要实现通过抛出异常通知 Suspense 即可

实际开发中通过 promise.then 直接操控自定义的加载遮罩也比较常见，也不必强行使用 Suspense

但是如果需要对数据进行缓存，那么在使用 react-cache 时顺手用上 Suspense 就更方便了
