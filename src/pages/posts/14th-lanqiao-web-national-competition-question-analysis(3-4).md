---
layout: "../../layouts/MarkdownPost.astro"
title: "14届蓝桥Web国赛详解（3-4）"
pubDate: 2023-06-13
description: "element-ui组件封装、js高精度计算"
author: "LunaSeki"
cover:
    url: "/cover3.png"
    square: "/cover3.png"
    alt: "cover"
tags: ["前端", "JavaScript", "element-ui", "vue"]
theme: "light"
featured: true
---

蓝桥解析第二篇，都挺简单的

———

## element-ui 轮播图组件⼆次封装

### 题目

#### 介绍

element-ui 的轮播图指示点样式默认为⻓条状，在某些场景下不⼀定符合设计的要求。如果在某个项⽬中我们需要使⽤⾃定义的指示点，在每个⽤到轮播图的位置都去写⼀份⾃定义指示点的逻辑显然是没有必要的，因此我们可以对组件进⾏⼆次封装。

本题需要⼆次封装⼀个⾃定义指示点的 element-ui 轮播图组件

#### 准备

开始答题前，需要先打开本题的项⽬代码⽂件夹，⽬录结构如下：  
├── css  
│ └── style.css  
├── effect.gif  
├── element-ui-2.15.10  
│ ├── element-ui.min.js  
│ └── index.css  
├── images  
├── index.html  
├── js  
│ ├── http-vue-loader.min.js  
│ └── vue.min.js  
└── my-carousel.vue

其中：  
css/style.css 是样式⽂件。  
effect.gif 是⻚⾯最终的效果图。  
element-ui-2.15.10 是 element-ui 组件库的代码。  
images 是图⽚⽂件夹。  
index.html 是主⻚⾯。  
js/vue.min.js 是 vue ⽂件。  
js/http-vue-loader.min.js ⽤于加载 .vue ⽂件的库。  
my-carousel.vue 是待补充的轮播图组件代码。

请通过 VS Code 中的 live server 插件启动本项⽬，让项⽬运⾏起来，效果如下：

![项目原始效果|inline](https://s2.loli.net/2023/06/13/oxVdFHfN9KXg8kj.png)

## 目标

请在 my-carousel.vue ⽂件中补全代码，具体需求如下：

1.  修改 template 模版和 script 脚本内容，使⻚⾯展示与图⽚数量对应的指示点，并使指示点的样式变化和轮播图切换同步（例如当展示到第四张图⽚时，就给第四个指示点添加 .active 类）。效果如下：

![项目效果|inline](https://s2.loli.net/2023/06/13/z5FeJwGtKI9LRDh.png)

2.  当⽤户点击某个指示点时，将轮播图切换到指示点对应的图⽚。

    最终效果可参考⽂件夹下⾯的 gif 图，图⽚名称为 effect.gif（提示：可以通过 VS Code 或者浏览器预览
    gif 图⽚）。
    实现上述功能所需的 API 如下：

    Carousel 事件参数：

    | 事件名称 | 说明             | 回调参数                           |
    | -------- | ---------------- | ---------------------------------- |
    | change   | 幻灯片切换时触发 | 目前激活的幻灯片索引，原幻灯片索引 |

    使用示例：

    ```javascript
    <template>
     <el-carousel ... @change="onCarouselChange"> ... </el-carousel>
    </template>
    <script>
    module.exports = {
        ...
        methods: {
            onCarouselChange(index) {
                // 该⽅法会在轮播图切换⾄第⼆⻚时打印1，第三⻚时打印2，以此类推
                console.log(index);
            },
        },
    };
    </script>
    ```

    Carousel 方法：

    | 方法名        | 说明           | 参数                            |
    | ------------- | -------------- | ------------------------------- |
    | setActiveItem | 手动切换幻灯片 | 需要切换的幻灯片索引，从 0 开始 |

    使用示例：

    ```javascript
    <template>
    <el-carousel ... ref="carousel"> ... </el-carousel>
    </template>
    <script>
    module.exports = {
        ...
        methods: {
            // 调⽤该⽅法会使轮播图跳转⾄第⼀⻚
            setActive() {
                this.$refs.carousel.setActiveItem(0);
            },
        },
    };
    </script>
    ```

最终效果可参考下⾯的 gif 图:

![最终效果|big](https://s2.loli.net/2023/06/13/fVtET7b28iGX1pd.gif)

### 分析

经典的 vue2 功能考核，分三部解决即可

1.  修改模板，让点根据图片的数量显示

    先在代码里找到指示点的位置

    ```html
    <ul class="points">
    	<li class="point active"></li>
    	<li class="point"></li>
    </ul>
    ```

    可以看到指示点采用类名为 point 的 li 元素表示，而选中的指示点样式使用 active 类表示，这里使用`v-for`指令遍历图片的数组即可

    ```html
    <ul class="points">
    	<li v-for="(__, index) in images" :key="index" class="point"></li>
    </ul>
    ```

    注意，这里`v-for`要拿到 index，后面绑定事件的时候要用到

2.  图片切换改变活动的指示点

    要改变指示点的样式，我当时想到的最简单的方法是把指示点的 class 变成响应式的，并在 data 中建立一个数组与之对应，图片改变时修改数组即可

    a. 先在 data 里设置个数组，因为默认显示的是第一张图片，我们就可以偷懒只设置第一个位置的 class 为"point active"

    ```javascript
    data() {
        return {
            classList: ["point active"],
        };
    },
    ```

    b. 修改元素的 class，使之与 classList 数组绑定

    ```html
    <ul class="points">
    	<li
    		v-for="(__, index) in images"
    		:key="index"
    		:class="classList[index] || 'point'"
    	></li>
    </ul>
    ```

    这样写的意思就是，当 classList 数组对应的位置没有定义时为 undefind，使用`||`运算符就能在前面为 undefind 时返回后面的字符串'point'
    这样就实现了根据 classList 改变 li 的 class 的功能，接下来要修改 li 的样式只需修改 classList 即可

    c. 绑定图片切换事件

    题目给出了 Carousel 组件的 change 事件用法，我们先绑定个事件

    ```html
    <el-carousel
    	indicator-position="none"
    	arrow="never"
    	height="85vh"
    	@change="changeImage"
    >
    	...
    </el-carousel>
    ```

    然后在 method 里添加一个 changeIname 方法，由于这个方法能够接受激活的幻灯片索引作为参数，于是可以在这个方法里修改 classList，就能实现修改激活的指示点

    ```javascript
    methods: {
    	changeImage(index) {
    		this.classList = [];
    		this.classList[index] = "point active";
    	},
    }
    ```

    这样，每次图片切换时会触发 changeImage 方法并传入索引，就能够根据变化的索引修改指示点的样式，实现指示点激活与图片同步的功能

3.  给指示点添加点击事件

    题目告诉我们 Carousel 上有 setActiveItem 方法，能够传入指定索引修改激活的图片

    a. 先写一个方法，接受索引然后调用 setActiveItem 方法

    ```javascript
    methods: {
        clickPoint(i) {
            this.$refs.carousel.setActiveItem(i);
        },
    },
    ```

    这里使用了$refs，要事先在 carousel 上绑定 ref 为"carousel"才能使用

    b. 在指示点上添加事件，传入索引即可

    ```html
    <li
    	v-for="(__, index) in images"
    	:key="index"
    	:class="classList[index] || 'point'"
    	@click="
            () => {
                clickPoint(index);
            }
        "
    ></li>
    ```

    由于要传入参数，直接写函数会把函数的返回值赋值给 click 事件，所以先用箭头函数包裹一层

    这里传入了遍历 images 时获得的索引，就能根据点击的指示点索引切换对应图片了

由于 carousel 的 setActiveItem 方法修改激活图片之后还会调用一次 change 事件，所以激活指示点的切换功能就不用另外实现了

### 题解

```html
<template>
	<div class="main">
		<!-- TODO: 请修改以下代码实现指示点的正确渲染 -->
		<el-carousel
			indicator-position="none"
			arrow="never"
			height="85vh"
			ref="carousel"
			@change="changeImage"
		>
			<el-carousel-item v-for="image in images" :key="image">
				<img :src="image" />
			</el-carousel-item>
		</el-carousel>
		<ul class="points">
			<li
				v-for="(__, index) in images"
				:key="index"
				:class="classList[index] || 'point'"
				@click="
					() => {
						clickPoint(index);
					}
				"
			></li>
		</ul>
	</div>
</template>

<script>
	module.exports = {
		props: {
			images: {
				type: Array,
				default: () => [],
			},
		},
		// TODO: 请在下面补充代码实现指示点的正确渲染以及点击指示点切换图片的功能
		data() {
			return {
				classList: ["point active"],
			};
		},
		methods: {
			changeImage(index) {
				this.classList = [];
				this.classList[index] = "point active";
			},
			clickPoint(index) {
				this.$refs.carousel.setActiveItem(index);
			},
		},
	};
</script>
```

## 抢红包啦

### 题目

#### 介绍

⼩蓝想给同学们发⼀个红包，慰劳⼤家学习前端的⾟苦，可是到了开红包这⼀步，⼤家收到的红包⾦额列表竟然⼀⽚空⽩，这可急坏了⼩蓝，快来帮⼩蓝解决这个问题吧！

#### 准备

开始答题前，需要先打开本题的项⽬代码⽂件夹，⽬录结构如下：  
├── css  
├── effect.gif  
├── images  
├── index.html  
└── js  
├── index.js  
└── randomAllocation.js

其中：  
index.html 是主⻚⾯。  
images 是图⽚⽂件夹。  
css 是样式⽂件夹。  
js/index.js 是项⽬的 js ⽂件。  
js/randomAllocation.js 是需要补充代码的 js ⽂件。  
effect.gif 是项⽬完成的效果图。

在浏览器中预览 index.html ⻚⾯效果如下：

![预览效果](https://s2.loli.net/2023/06/13/bxOTv1mir5N89BX.png)

#### 目标

⽬前存在的问题是：输⼊⾦额和红包个数，点击开红包后原本需要展示的红包⾦额列表出现⼀⽚空⽩。  
请实现 js/randomAllocation.js ⽂件中 randomAllocation 函数，修复此问题。

randomAllocation 函数共接收⼆个参数，参数 total 为红包总⾦额，参数 n 为红包个数。抽取到的红包的最⼩⾦额为 0.01 元，且最多保留两位⼩数。每次发放红包的个数为 n ，每个红包的⾦额随机，最终将本次抽取的所有红包⾦额组成数组返回。需要注意的是，要确保 n 个红包的⾦额加起来必须等于总⾦额 total 。

> 例：总⾦额为 100 元的 10 个红包，函数的返回结果可能如下：  
> // 示例 1  
> `[23.34, 71.1, 4.97, 0.28, 0.26, 0.01, 0.01, 0.01, 0.01, 0.01]`  
> // 示例 2  
> `[60.81, 15.26, 12.68, 6.75, 2.66, 0.06, 1.16, 0.3, 0.12, 0.2]`

最终效果可参考下⾯的 gif 图：  
![效果预览](https://s2.loli.net/2023/06/13/R8hNLGxqT3Ebr4U.gif)

### 分析

这题考察的是 JavaScript 的高精度计算，题目要我们写一个函数，将一个金额随机分成若干份，并且要精确到两位小数

-   定义变量

    -   curMoney 当前剩余的金额，最开始等于总金额，每次分完红包减去分的红包金额
    -   curNum 当前剩余的待分红包份数，最开始等于总红包份数，每次分完一个红包减一

-   随机分红包分成若干份

    使用 `Math.random() * curMoney`即可根据当前剩余的金额随机分配红包，但是这样做有可能导致剩余金额不够分，不能满足最小抽到 0.01 元的要求

    可以改进一下，使用`Math.random()*(curMoney-curNum*0.01-0.01)+0.01`，可以保证剩下的红包金额满足每个红包最小 0.01 元

-   保持两位小数

    可以调用 Number 实例上的`toFixed`方法，例如`num.toFixed(2)`将变量格式化到两位小数

    但是这样计算可能不够准确，因为`toFixed`是通过四舍五入计算的，多次舍入可能会造成误差，并且 js 本身的小数计算是浮点形式的，对于小数部分要特殊处理

    于是我们采用另一种方法——把数字放大 100 倍，并且每次随机的结果都取整即可，计算整数简单多了

    随机分配变成这样`Math.round(Math.random()*(curMoney-curNum-1)+1)`，避免了 curMoney 做四则运算时可能造成的误差

-   数据处理

    对于每次得到的数据 num 进行`(num*0.01).toFixed(2)`处理就行了……吗？

    不行！因为`toFixed`处理后的数据是字符串，直接放到数组里返回判题大概率会寄（我也是写解析的时候才发现的，直接一题的分没了呜呜呜呜...）

    要使用`Number()`强制转换格式才行

    完成上述步骤后将所有的数据 push 到数组里返回即可

### 题解

```javascript
function randomAllocation(total, n) {
	//  TODO: 待补充代码
	let curMoney = total * 100;
	let curNum = n;
	let onceMoney = 0;
	let ans = [];
	while (curNum-- > 1) {
		// 保证当前金额和剩余金额大于等于0.01
		onceMoney = Math.round(Math.random() * (curMoney - curNum - 1) + 1);
		curMoney -= onceMoney;
		ans.push(Number((onceMoney * 0.01).toFixed(2)));
	}
	ans.push(Number((curMoney * 0.01).toFixed(2)));
	return ans;
}
```

---

谁懂啊，写着题解发现一道题寄了，喜提国四了这下。。

下一题是仿写网站，没啥技术含量，当时不懂事直接写了两个小时。。要是下次再参加打死都不写这个题型了
