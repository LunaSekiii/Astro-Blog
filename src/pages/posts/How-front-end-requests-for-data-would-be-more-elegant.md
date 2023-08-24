---
layout: "../../layouts/MarkdownPost.astro"
title: "前端这样请求数据会更加优雅"
pubDate: 2023-08-24
description: ""
author: "LunaSeki"
cover:
    url: "/cover6.png"
    square: "/cover6.png"
    alt: "cover"
tags: ["前端", "React", "zustand"]
theme: "light"
featured: true
---

## 前言

相信同学们经常遇到需要请求页面数据并渲染的需求，如果直接在组件的生命周期内渲染的话，可能会遇到一些问题，比如：

1. react 的函数式组件中，`useEffect`在开发模式下会强制执行两遍，目的是确保组件能正确清理**副作用**（也就是说开发模式下放在 useEffect 内的请求会执行两遍）
2. 请求数据到请求成功之间会有数据无法访问的情况，我们可能要对加载中状态的组件做特殊处理
3. 请求部分的代码和组件耦合度较高，如果需要对数据进行更复杂的处理，则会增加组件的复杂度，不好维护
4. 请求部分的代码如果需要复用，则难度较高
   ...

于是，我们可以把请求数据这个动作放到一个更好维护的地方——状态管理

## 把数据请求和状态管理放在一起有什么用

1. 使得代码的内聚程度更高
2. 让组件的可维护性更强
3. 数据的请求动作可以复用
4. 组件数据的加载状态可以在父组件进行渲染，也可以做类似 react 的`suspense`的加载组件

## 代码示例

这里我们选用 react 和状态管理库 zustand 来做示例

### 首先，我们先做一个数据展示组件，将数据从一般的`useEffect`中请求移到从组件的参数获取

```tsx
// DataPresentationElement.tsx
export default function DataPresentationElement({data: DataType}){
    return (
        <div>
            <p> {data.data1} </P>
            <p> {data.data2} </p>
            {/* 使用数据... */}
        </div>
    )
}
```

这么看，组件内部的数据获取逻辑被提取出来之后变成纯函数了，看起来就挺好维护的 🤣（也不一定是纯函数，要是你还有其他功能的话就不一定了，不过也可以将其他逻辑提取出来）

### 然后，我们可以在状态管理中定义数据 state 以及数据获取 action 了

```tsx
// useMyData.tsx
import { create } from "zustand";

type UseMyData = {
    data?: Mydata;
    getData: async() => Promise<void>
}

const useMyData = create((set)=>({
    data: undefined,
    getData: ()=>{
        const newData = await getDataFunc();
        set(()=>({data: newData}))
    }
}))

export default useMyData;
```

如果看不懂也没关系，可以理解为在状态管理中写了相应的 state 和 action，用于储存数据和请求数据，放到其他库也是一样的逻辑

### 然后在父组件请求数据以及渲染数据展示组件就行

```tsx
// MainComponent.tsx
import useMyData from "./useMyData";
import { shallow } from "zustand/shallow";
import DataPresentationElement from "./DataPresentationElement";

export default function MainComponent() {
	const { data, getData } = useMyData(
		(state) => ({
			data: state.data,
			getData: state.getData,
		}),
		shallow
	);

	useEffect(() => {
		getData();
	}, []);

	if (data) return <DataPresentationElement data={data} />;
	return <div>loading...</div>;
}
```

这样，数据的获取与 loading 处理之类的逻辑就提升到了父组件里，整个数据获取与展示的流程变得更加清晰与灵活

这里选择 zstand 的原因有挺大程度是比较轻量，对于作用范围小的数据也可以单独封装并和组件放在一起 😎

## 实际运用

有同学可能会说，这样父组件的逻辑不是乱起来了吗？而且写的代码好像更多了

其实，这个所谓的“父组件”可以包裹在原组件外的一层组件，要调用的时候直接调用这层包裹组件即可，从使用方面来说其实没什么区别。并且在修改数据获取功能时，可以在包裹组件中修改；要修改数据展示时，可以直接修改原来的组件，**维护其实更加方便了**。

其次，这样写的另一个好处是**数据获取变得灵活**了。比如可以在用户进入页面后把相邻页面的数据提前加载好，可以提升用户的体验。如果有些数据比较常用，可以在打开页面时、或者首页数据请求完成后，直接获取好想要的数据，而不必等待组件加载时在获取。

在实际使用中，大家可以根据项目的情况把数据获取放到合适的地方，以提升用户的体验、提高代码的可维护性
