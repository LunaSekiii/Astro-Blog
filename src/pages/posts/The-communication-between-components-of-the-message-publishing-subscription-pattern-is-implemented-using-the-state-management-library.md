---
layout: "../../layouts/MarkdownPost.astro"
title: "手撕发布订阅模式组件通信——基于状态管理实现"
pubDate: 2023-06-16
description: "The communication between components of the message publishing subscription pattern is implemented using the state management library使用状态管理库实现消息发布订阅模式的组件间通信功能"
author: "LunaSeki"
cover:
    url: "/cover4.jpg"
    square: "/cover4.jpg"
    alt: "cover"
tags: ["前端", "React", "zustand"]
theme: "light"
featured: true
---

最近写项目时突发奇想，用状态管理库实现了一个消息订阅与发布的 hook，感觉还挺好玩的  
加上 zustand 这个库用法也比较灵活，就顺便写了篇博客 😆

---

## PubSub

相信同学们都用过 pubsub-js 这个库，非父子组件之间通过消息发布/订阅模式通信可以不用考虑组件之间的关系，而是采用对某个消息名的订阅、发布的方式传递信息，非常方便。

消息订阅与发布模式有三个主要功能：

### 消息订阅

给 subscribe 方法传入两个参数

1. 事件名
2. 订阅的触发函数，当有相同事件名的发布消息时触发该函数

```javascript
subscribe("event-name", (props) => {
	//todos
});
```

### 消息发布

给 publish 方法传入两个参数

1. 事件名
2. 触发订阅事件的参数

```javascript
publish("event-name", psops);
```

简单的说，此处发布的事件如果已经被订阅过，那么这次发布消息时传递的参数传给订阅的触发函数，并运行一次触发函数

### 小结

有点绕？那我们不妨把消息订阅、发布模式当成订阅报纸试试

比如下面这张图，有三个订阅者去报社订阅报纸  
![subscribe](https://s2.loli.net/2023/06/15/H9uIxte6Y3851Ej.png)  
订阅报纸的时候订阅者要向报社说明要订哪一份**报纸**（对应事件名），还有自己的**地址**（订阅事件），方便报社将报纸送给自己

接下来，当有人想发布消息时，就会去报社刊登消息
![publish](https://s2.loli.net/2023/06/15/lcMxo6D5IfZdvVw.png)  
比如图中的发布者，选择在“B 日报”上发布“信息 1”，那么报社会将“信息 1”刊登在“B 日报”上，并根据订阅者预留的地址，将该信息送到订阅了这份报纸的订阅者手上（对应消息发布时会将**发布**时携带**的数据**作为参数**传入**每个**订阅**传入**的函数**）

很简单吧，无论有多少个订阅者订阅了同一份报纸，只要有人发布消息，那么报社就会将这份消息传递到每一个订阅者手上

### unsubscribe

能够订阅消息，自然也能够取消订阅，毕竟不取消订阅，每次有新信息就会被打扰，肯定是不行的~~

```javascript
unsubscribe(token);
```

这里的 token 是订阅的时候返回的一个标识，用于唯一地标识当前这个订阅，这样在取消订阅时直接传入这个 token 就行了

## 实现原理

通过上面的样例我们可以很容易推出，我们需要一个容器来存储不同的**消息**和每个消息对应的若干个**订阅事件**。  
这样，当消息发布时就可以去找对应的消息，将该消息的事件逐个运行就行了

### 消息的存储

那么，我们该如何存储消息呢？  
在 js 中，最合适的存储结构应该就是对象了吧，key 值为消息名，value 就可以用来存储事件，例如

```javascript
{
    message1: events,
    message2: events,
    message3: events,
    // ...
}
```

### 事件的存储

由于一个消息可能存在多个订阅，我们可以用数组来存储，迭代数组即可运行事件

我们也可以用链表来存储事件，每个事件里有一个 function 存储订阅的函数，还有一个 next 存储下一个事件，这样的话每个事件里只需存储第一个事件就能够遍历剩下的所有事件了  
![链表](https://s2.loli.net/2023/06/15/V1Pj5OxF937AKtp.png)

### 消息发布流程

经过上述过程，订阅的事件已经存储在对象的 value 中了  
当有事件发布时，我们先用事件名去寻找对象中有无对应的 key，如果有则遍历这个 key 对应的 value 中的事件

怎么样，是不是很简单？但是，还有一个问题——怎么保证组件间共用一个“报社”呢？

### 跨组件通信

在主流的前端框架中，把组件模块化是很常见的做法，如果我们只是简单把上面的功能实现成简单的 hook，并不能提提供组件间的通信，因为每个组件调用 hook 获取的都是独立的数据，不能实现组件间通信的要求  
比如组件 A 调用一个 hook，组件 B 调用同一个 hook，此时 A、B 组件的数据是各自独立的（一般来说），A 修改了其中的数据 B 也不能读取到

仔细看看需求，我们就能知道——我们需要一个**单例模式**的容器帮助我们存储事件，并提供给每个组件访问！

单例模式能够保证不同组件访问的“容器空间”是同一个，即组件 A、组件 B 都对同一个空间里的数据进行操作，从而实现通信功能  
那么这个东西在哪呢？

其实在 Vue2 里，那个挂载到 Vue 上的事件总线（bus）就是一个很好的例子，不同的组件都能够从 Vue 上获取到事件总线并与之通信  
但是在 Vue3 或者 React18 里，挂载到一个全局都能访问的地方也不太方便，那我们不妨考虑把事件放到同为单例模式的**状态管理**组件上

## 用 Zustand 实现消息订阅/发布

这里我使用的是 React18 以及一个状态管理库 Zustand 实现的，zustand 是一个比较轻（个人感觉）的状态管理库，比较适合数据不算复杂的场景，非常的灵活

### 基本用法

简单讲一下 zustand 的基本用法，详细的可以去看看文档，挺简单的

先创建一个 useStore 文件，使用 zustand 的 create 方法即可创建一个状态管理 hook

```javascript
// useStore.ts
import { create } from "zustand";

const useStore = create((set, get) => ({
    val1:1;
    val2:"abc"
    changeVal1: (newVal1)=>{
        set(()=>{val1:newVal1})
        }
    getVal2: ()=>{
        return get().val2;
    }
}));

export default useStore;
```

可以看到，给 create 传入的是一个函数，这个函数接受两个方法 set 和 get

-   set 用于给**状态中的方法**提供修改**状态中的数据**的功能，比如 changeVal1 里就使用了 set 修改了 val1 的数据
-   get 用于给**状态中的方法**提供获取**状态中的数据**的功能，比如 getVal2 里就使用了 get 获取到 val2 的数据

这样，在其他组件中像正常的 hook 一样调用就行

```javascript
import useStore from "useStore";
const component = () => {
	const changeValue1 = useStore((state) => state.changeVal1);
	const getVal2 = useStore((state) => state.getVal2);
};
```

这样就能够获取到状态中的数据了，而且由于状态管理库的特性，每个组件读取到的数据是共用的

那么接下来就可以在 zustand 上实现状态管理了

### 类型定义

这里选用单链进行订阅事件的存储，你可以试试用数组实现

我们先对事件进行定义，其中 func 是订阅时传入的函数，next 是下一个事件

```typescript
interface Event {
	func: Function;
	next: Event | null;
}
```

然后定义储存不同订阅事件的对象，其中事件名为字符串形式，而 value 就是上面的 Event 了

```typescript
interface Events {
	[event: string]: Event;
}
```

最后，我们再定义状态的类型，events 就是上面的事件存储对象，再定义三个操作事件的方法（方法类型可以先写完函数再定义就比较方便），类型定义就完成了

```typescript
interface PubSubStore {
	events: Events;
	subscribe: (mes: string, func: Function) => void;
	publish: (mes: string, args: Array<any>) => void;
	unSubscribe: (mes: string, func: Function) => void;
}
```

### 创建状态

代码不太好分开讲，这里先把实际代码放上来

```typescript
// useEvents.ts
...
const useEvents = create<PubSubStore>((set, get) => ({
	events: {},
	subscribe: (mes, func) => {
        // 当有新订阅时，先封装一个事件的对象
		let newSub: Event = {
			func,
			next: null,
		};
		let events = get().events;
        // 如果消息的事件为空，则直接插入就行
		if (!events[mes]) events[mes] = newSub;
        // 事件不为空，遍历单链，把事件插入到链表尾部
		else {
			let event = events[mes];
			let firstEvent = event;
			while (event.next) {
				event = event.next;
			}
			event.next = newSub;
			events[mes] = firstEvent;
		}
		set(() => ({ events: events }));
	},
	publish: (mes, args) => {‘
    // 消息发布，先获取消息的事件
		let events = get().events;
		if (!events[mes]) return;
		let event: Event | null = events[mes];
        // 遍历所有事件
		while (event != null) {
            // 异常捕获，防止传参不正确出问题
			try {
				event.func(...args);
			} catch (e) {
				console.log("public error", mes, event.func, args);
			}
			event = event.next;
		}
	},
	unSubscribe: (mes, func) => {
        // 删除订阅，也是遍历所有事件
		let events = get().events;
		if (!events[mes]) return;
		let event: Event | null = events[mes];
		while (event && Object.is(event.func, func)) {
			event = event.next;
		}
		let firstEvent = event;
		let next = event?.next || null;
        // 遍历链表，比较事件
		while (next != null) {
			if (Object.is(next.func, func)) {
				// 这里可以使用断言，因为next不为null时event必然不为null
				next = next.next;
				event!.next = next;
			}
			event = next;
			next = next?.next || null;
		}
		if (!firstEvent) {
			delete events[mes];
		} else events[mes] = firstEvent;
		set(() => ({
			events: events,
		}));
	},
}));
...
```

写的有点烂，不过大概功能还是实现了

主要功能是维护一个 events 对象，当有事件订阅时，把订阅的回调放到对应事件的链表上  
当有消息发布时，对链表进行遍历并调用，这里还做了个异常捕获，防止报错找不到原因在哪  
最后就是取消订阅时，对指定事件上的链表进行调用，碰到相同的回调就删除

这里值得讲一下，由于为了偷懒就没为每次订阅生成 token，所以删除的时候就不能通过 token 删除了，只能传入**原函数**进行删除

为什么强调**原函数**呢，是因为我使用了`Object.is()`方法比较两个函数是否相等（React 的副作用同款判断条件），这个比较方法只会对同一个引用的两个对象返回 true，所以大家使用的时候要注意以下几点：

1. 在组件内普通写的方法在组件更新前后不是同一个函数
2. 可以写在组件外面，这样组件更新前后还是同一个函数，但是这样不方便对组件中的数据进行操作
3. 既然是 React 副作用同款比较方法，那么可以采用 React 的同款方案对函数进行缓存即可，这里可以使用`useCallback`把函数包裹，这样订阅的更新就不会太频繁了
4. 无论如何，事件的订阅与取消订阅需要成对地出现在副作用中，不然就大概率会出现问题  
   原因是写在`useEffect`中的话有订阅必然有取消订阅，不会堆积一堆未取消的冗余订阅，而且限制了订阅的频率，如果直接写在组件中，那么每次更新都会产生一次订阅，非常的不规范

### 使用示例

有了 useEvents，那我们就能够在组件里使用了

首先是订阅事件组件

```tsx
import { useEffect, useCallback, useState } from "react";
import useEvents from "useEvents";

const Component1 = () => {
	const [count, setCount] = useState(0);
	const add = useCallback(
		(num) => {
			setCount((count) => count + num);
		},
		[setCount]
	);
	const subEvent = useEvents((state) => state.subscribe);
	const unSubEvent = useEvents((state) => state.unSubscribe);
	useEffect(() => {
		subEvent("add", add);
		return () => {
			unSubEvent("add", add);
		};
	}, [add]);
	return <div>{count}</div>;
};
```

然后是发布事件的组件

```tsx
import { useEffect, useCallback, useState } from "react";
import useEvents from "useEvents";

const Component2 = () => {
	const pubEvent = useEvents((state) => state.publish);
	const add = () => {
		pubEvent("add", [1]);
	};
	return <input type='button' value='add' onClock={add} />;
};
```

当按钮被点击的时候，就会通知订阅的组件 "add" 1，实现了一个消息订阅/发布的流程

---

写的有点糙了，不过项目里用起来没啥问题 🤣
