---
layout: "../../layouts/MarkdownPost.astro"
title: "react中D3(v7)的最佳实践"
pubDate: 2023-08-21
description: "在react的函数式组件中使用D3js的最佳实践，可以实现以react周期控制数据动态展示的功能"
author: "LunaSeki"
cover:
    url: "/cover5.png"
    square: "/cover5.png"
    alt: "cover"
tags: ["前端", "React", "D3"]
theme: "light"
featured: true
---

[D3.js](https://d3js.org/)是一款非常好用的数据可视化 js 库，能够帮助我们非常方便地将数据可视化地展示。

<p align=center><img src="https://s2.loli.net/2023/08/21/N832ozDPefp1yhk.png" alt="logo.svg" width="30%" /></p>

D3 与 echart 这些数据可视化库的区别是 D3 更加的底层，没有基于组件的方法调用，而是提供基于元素的 api 供操作（类似 JQuery），因此 D3 的灵活度非常高，能够帮助我们完成许多定制程度较高的可视化任务。

在学习 D3 的过程中，我查找到的 D3 与 react 结合使用的资料大部分都有点过时，不是**D3 的版本比较低**就是**react 的版本比较低**，要对照最新版本的文档才能使用，比较麻烦。

因此，我根据自己的使用经历总结了 D3(v7)与 react 的函数式组件结合使用的基本方法，方便大家参考。

---

## 元素的选择

D3 需要我们选中若干个元素才能进行操作，选择器与 JQuery 的使用类似（没学过 JQuery 也没关系，其实就是 css 的元素选择器罢了），用法如下:

```js
// 选择一个（第一个）div元素
const myDiv = d3.select("div");
// 选择所有的类为"my-svg"的元素
const mySVG = d3.selectAll(".mysvg");
```

是不是很简单，但是在 react 中，我们最好不要直接用元素名、类名、Id 进行元素的选择，因为在 react 中组件是可以被复用的。如果一个页面中同一个组件出现多次，并且这个组件使用类名选择元素进行操作的话，那么这几个组件之间就会互相干扰，甚至报错。

所以，我们可以**使用 react 的 ref 进行元素选择**，从而精确控制元素：

```tsx
export default function D3() {
	const svgElement = useRef<SVGSVGElement>(null);
	return <svg ref={svgElement} />;
}
```

使用元素时，只需给选择器传入 ref 的 current 即可

## 元素的初始化

我们前面使用了一个 svg 元素作为 D3 的操作元素，那么我们只要对 svg 进行初始化即可

这里要注意，对 svg 的初始化操作只需要在组件挂载时执行一次（就是类组件的 componentDidMount()生命周期），所以我们选择把这个操作放在没有依赖的 useEffect 中执行，并写好清理函数（提高程序的健壮性，并且 useEffect 在开发环境会默认执行两遍，不清理副作用将影响开发）

```tsx
// 这里用state存储D3包裹的svg元素，方便我们后续操作
const [svg, setSvg] =
	useState<d3.Selection<SVGSVGElement | null, unknown, null, undefined>>();

useEffect(() => {
	const svg = d3
		.select(svgElement.current)
		.attr("width", 500)
		.attr("height", 500);
	// 初始化svg,并存到state中
	setSvg(svg);
	// 清理函数，将svg中的元素清空，防止重复添加
	return () => {
		svg?.selectChildren().remove();
		setSvg(undefined);
	};
}, []);
```

当然，就这样还不够，可以用一个简单的条形图模拟实际场景

有以下数据：

`data = [277, 140, 281, 284, 177]`

我们可以在初始化时将数据进行展示:

```tsx
const [svg, setSvg] =
	useState<d3.Selection<SVGSVGElement | null, unknown, null, undefined>>();
const [barCharts, setBarCharts] =
	useState<
		d3.Selection<SVGRectElement, number, SVGSVGElement | null, unknown>
	>();
const [text, setText] =
	useState<
		d3.Selection<SVGTextElement, number, SVGSVGElement | null, unknown>
	>();
useEffect(() => {
	const svg = d3
		.select(svgElement.current)
		.attr("width", 500)
		.attr("height", 500);
	setSvg(svg);
	const barCharts = svg
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", (__, i) => i * 50)
		.attr("y", (d) => 500 - d)
		.attr("width", 40)
		.attr("height", (d) => d)
		.attr("fill", "blue")
		.on("mouseover", function (d, i) {
			d3.select(this).attr("fill", "red");
		})
		.on("mouseout", function (d, i) {
			d3.select(this).attr("fill", "blue");
		});
	setBarCharts(barCharts);
	const text = svg
		.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.text((d) => d)
		.attr("x", (__, i) => i * 50 + 5)
		.attr("y", (d) => 500 - d + 30)
		.attr("fill", "white");
	setText(text);
	return () => {
		svg?.selectChildren().remove();
		setSvg(undefined);
	};
}, []);
```

效果如下：

![静态数据演示效果|inline](https://s2.loli.net/2023/08/21/AWhMBPr5D3n2z86.gif)

## 数据更新

光是展示静态数据就没必要使用 react 了，直接使用 D3 一套做完不香吗？

我们现在让 data 动起来，那么我们必须针对 data 对图像进行更新才能实现动态数据展示的效果

方法很简单，用 useEffect 把 data 当作依赖即可：

```tsx
useEffect(() => {
	barCharts
		?.data(data)
		.transition()
		.duration(1000)
		.attr("y", (d) => 500 - d)
		.attr("height", (d) => d);
	text?.data(data)
		.transition()
		.duration(1000)
		.text((d) => d)
		.attr("y", (d) => 500 - d + 30);
}, [barCharts, data, text]);
```

效果如下：

![动态数据演示|inline](https://s2.loli.net/2023/08/21/ynN48RoIGXbqpf1.gif)

怎么样，是不是效果还不错，这样根据 data 的变化，我们能很方便地在 react 中使用 D3 展示数据了

如果你觉得代码太多，可以把这些内容封装成一个 hook，暴露出一个 setData 供修改数据就行啦
