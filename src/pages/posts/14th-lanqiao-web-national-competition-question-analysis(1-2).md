---
layout: "../../layouts/MarkdownPost.astro"
title: "14届蓝桥Web国赛详解（1-2）"
pubDate: 2023-06-11
description: ""
author: "LunaSeki"
cover:
    url: "/cover2.png"
    square: "/cover2.png"
    alt: "cover"
tags: ["前端", "JavaScript", "css"]
theme: "light"
featured: true
---

这次国赛感觉难度和省赛差不多，比的就是谁能在规定时间做完（做不完咧！一小时做完前四题还以为稳了，结果第五题复刻网站摸了两个小时……）

文章写的不熟练，所以可能比较啰嗦……有需要的可以直接看题解

---

## 植物灌溉

### 题目

#### 介绍

朋友花园内的植物严重缺⽔，急需你的帮助，让我们⽤⽬前 CSS3 中新增的 Grid 布局去完成灌溉任务吧！

#### 准备

开始答题前，需要先打开本题的项⽬代码⽂件夹，⽬录结构如下：

├── css  
├── images  
└── index.html

其中：

-   images 是图⽚⽂件夹。
-   css/style.css 是需要补充样式的⽂件。
-   index.html 是主⻚⾯。

在浏览器中预览 index.html ⻚⾯效果如下：  
![原始效果 | inline](https://s2.loli.net/2023/06/11/RdjAVzMGgoDPFSx.png)

#### 目标

请使⽤ Grid 布局中的 grid-area 属性完善 css/style.css 中的 TODO 代码，帮助你的朋友顺利完成植物灌溉，最终实现下图效果  
![目标效果 | inline](https://s2.loli.net/2023/06/11/WiEPdb9pfVCtwuQ.png)

提示：

```css
grid-area: grid-row-start / grid-column-start / grid-row-end / grid-column-end;
grid-area: 1 / 2 / 3 / 4;
```

### 分析

刚开始我还以为是像之前的水果盘子一样是用 css 布局排列元素就行，结果当我看到 html 结构的时候给我整不会了

```html
<div class="app-box">
	<div class="overlay">
		<!-- 这部分plot有25个，对应页面中25个格子 -->
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
		<span class="plot"></span>
	</div>
	<div class="plants">
		<!-- 植物的图片 -->
		<div class="plant">
			<div class="bg"></div>
		</div>
	</div>
	<div class="garden">
		<!-- 水的图片 -->
		<div class="treatment">
			<div class="bg"></div>
		</div>
	</div>
</div>
```

很显然，我们只要排列水的图片和植物图片对应即可，但是和之前不同，不再是多个元素排列，而是单个元素通过背景的`repeat`产生的效果

根据提示，我们只需要通过调整水的元素的`grid-area`属性去使元素的大小和植物元素的大小重合即可

#### grid-area

复习一下`grid-area`属性，有两种用法，两种的前提都是父元素为 grid 布局，且配置了相应的属性

1. 通过 grid 行列线设置范围

    例如这个 5×5 的 grid，从上往下数和从左往右数都是六条线（下标从 1 开始）  
    ![grid行列线 | inline](https://s2.loli.net/2023/06/11/c5se4mJaM73wzbf.png)

    而`grid-area`可以设置四个值，分别是

    - grid-row-start：从第几条横向的线开始显示
    - grid-column-start：从第几条纵的向线开始显示
    - grid-row-end：到第几条横向的线停止显示，或竖跨几行
    - grid-column-end：到第几条纵向的线停止显示，或横跨几行

    四个值之间用 `/` 隔开

    例如 `grid-area: 1 / 2 / 3 / 4;`就是从第一行到第二行（1-3 条线），从第二列到第三列（1-4 条线），就是下图的效果  
    ![grid示例 | inline](https://s2.loli.net/2023/06/11/213nrmCTMDsVYyG.png)

    其实后两个属性可以用 `span` 加上数字代替，代表跨越多少行，如 `span 1`代表跨越一行

2. 设置布局名字

    前提是父组件设置了`grid-template-areas`属性，通过名字已经划分好了网格，子组件上直接把`grid-area`属性设置成对应的名字即可

### 题解

在 style.css 文件中，我们可以看到题目以及给我们提供了修改的位置，正是包裹水的图片的类

```css
/* TODO 待补充代码 */
.treatment {
}
/* 以下代码不需要修改 */
```

只需设置`grid-area`属性即可

```css
.treatment {
	grid-area: 1 / 2 / 4 / 6;
}
```

或

```css
.treatment {
	grid-area: 1 / 2 / span 3 / span 4;
}
```

完成，效果如图  
![done | inline](https://s2.loli.net/2023/06/11/I7jDvobQFw2mqEM.png)

    其实，打开控制台就能看到植物组件上也有个 grid-area 属性，和答案一模一样……

## 萌宠小玩家

### 题目

#### 介绍

萌宠⼩玩家是⼀款宠物养成类游戏，玩家在游戏中，可以通过给宠物换⾐服、跟它玩、吃零⻝跟宠物进⾏互动交流。在萌宠⼩玩家中，玩家可以体验到养成宠物的乐趣，同时也可以结交新朋友，分享⾃⼰的养宠⼼得，是⼀款适合所有年龄段玩家的休闲娱乐游戏。

#### 准备

开始答题前，需要先打开本题的项⽬代码⽂件夹，⽬录结构如下：

├── css  
├── effect.gif  
├── images  
├── index.html  
└── js  
└── index.js

其中：

-   index.html 是主⻚⾯。
-   css 是存放项⽬样式的⽂件夹。
-   images 是存放项⽬图⽚的⽂件夹。
-   effect.gif 是项⽬完成后的效果图。
-   js/index.js 是需要补充代码的 js ⽂件。

在浏览器中预览 index.html ⻚⾯效果如下：

![原始效果 ](https://s2.loli.net/2023/06/11/NtfpcCOMHVExZQq.png)

#### 目标

请在 js/index.js ⽂件中补全代码，具体需求如下：

1. 完善 verifyName ⽅法，在点击穿⾐服、不穿⾐服、跟它玩、吃零⻝按钮（四个按钮均已绑定点击
   事件）时，如果宠物昵称输⼊框（ id=nickname ）的值不存在，则显示报错信息
   （ id=vail_name ）元素；如果该值存在，则将其赋给宠物实例（ pet ）的 name 属性，并隐藏报
   错信息（ id=vail_name ）元素。
2. 如果宠物昵称存在，则点击穿⾐服、不穿⾐服、跟它玩、吃零⻝按钮（四个按钮均已绑定点击事
   件）均会记录不同的⽇志。现在需要完善 showLog ⽅法，实现宠物互动记录。 showLog ⽅法的参
   数 record 表示要记录的互动消息。最多记录 10 条最新的互动消息，并将最新的互动消息记录在
   最上⾯。每⼀条⽇志都应添加到⽇志列表元素（ id=list ）中，DOM 结构如下：

```html
// DOM 结构必须按照此写法
<div id="list">
	<!-- 最新的互动在最上⾯且只能记录10条 -->
	<div>第 2 次互动：你喂⼩蓝吃了零⻝，体重 +1kg</div>
	<div>第 1 次互动：你喂⼩蓝吃了零⻝，体重 +1kg</div>
</div>
```

最终效果可参考⽂件夹下⾯的 gif 图，图⽚名称为 effect.gif（提示：可以通过 VS Code 或者浏览器预览 gif 图⽚）。  
![目标效果 | inline](https://s2.loli.net/2023/06/11/motZVD8uJ975Kzy.gif)

### 分析

题目考察 js 的 dom 操作，考点比较常规

1. 验证是否输入宠物名
   题目已经为我们选择好了 dom 元素，只需要检测 input 的 value 是否为空即可
   至于报错信息元素的显隐，通过对 value 的判断设置`display`样式即可

2. 显示日志
   题目同样为我们选择了 dom 元素，只需创建一个 div 元素并设置为日志容器的子元素即可
   题目还要求只显示最新的 10 条记录，那么届可以通过元素的`childElementCount`属性检测子元素数量，再按顺序删除最早的元素即可

### 题解

第一个 TODO，对应要求 1

```javascript
// 验证宠物名称，如果存在则把名称赋值给当前实例
  verifyName() {
    // TODO:  待补充代码
    let name = nickname.value;
    // name exist
    if(name){
      vail_name.style.display="none"
      pet.name = name;
    }
    // nameless
    else{
      vail_name.style.display="inherit"
    }
  }
```

第二个 TODO，对应要求 2

```javascript
// 记录日志
  showLog(record) {
    // TODO:  待补充代码
    while(list.childElementCount > 9){
      list.removeChild(list.children[0])
    }
    let newLog = document.createElement("div");
    newLog.innerText = record
    list.appendChild(newLog)
  }
```

最近有点忙先写了前两题，后续的最近有空会更新的(~~没更记得催我~~)

---
