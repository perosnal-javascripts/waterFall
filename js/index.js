function WaterFall(el, gap = 10, width = "unset", height = "unset", backgroundColor = "unset") {
	this.el = el;
	this.images = [];
	this.gap = gap; // 定义每一列之间的间隙 为10像素
	this.wrapperWidth = width;
	this.wrapperHeight = height;
	this.backgroundColor = backgroundColor;

	this.init(el, width, height, backgroundColor);
}

WaterFall.prototype.init = function () {
	this.setEleCss(this.el, this.wrapperWidth, this.wrapperHeight, this.backgroundColor);
	this.waterFall();
	// 这里使用bind函数改变loadmore内部this的指向，使它一直指向WaterFall,否则它会指向el
	// this.bindEvent(this.el, "scroll", this.loadmore.bind(this), false);
};

/**
 *
 * @param {Node} el 绑定的元素
 * @param {String} eventType 事件类型
 * @param {Function} func 事件监听函数
 * @param {Boolean} options 官方的options
 */
WaterFall.prototype.bindEvent = function (el, eventType, func, options) {
	el.addEventListener(eventType, func, options);
};

WaterFall.prototype.getClient = function () {
	const { width, height, x, y, top, right, bottom, left } = this.el.getBoundingClientRect();

	return {
		width: width || window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		height: height || window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
		x,
		y,
		top,
		right,
		bottom,
		left
	};
};

WaterFall.prototype.waterFall = function () {
	// 1、 确定列数  = 页面的宽度 / 图片的宽度
	var wrapperWidth = this.getClient().width;
	var itemWidth = this.el.children[0].offsetWidth;
	var columns = parseInt(wrapperWidth / (itemWidth + this.gap));
	var arr = [];

	// 遍历节点
	for (var i = 0; i < this.el.children.length; i++) {
		if (i < columns) {
			// 2、 确定第一行
			this.el.children[i].style.top = 0;
			this.el.children[i].style.left = (itemWidth + this.gap) * i + "px";
			arr.push(this.el.children[i].offsetHeight);
		} else {
			// 其他行
			// 3、 找到数组中最小高度  和 它的索引
			var minHeight = arr[0];
			var index = 0;
			for (var j = 0; j < arr.length; j++) {
				if (minHeight > arr[j]) {
					minHeight = arr[j];
					index = j;
				}
			}
			// 4、 设置下一行的第一个盒子位置
			// top值就是最小列的高度 + gap
			this.el.children[i].style.top = arr[index] + this.gap + "px";
			// left值就是最小列距离左边的距离
			this.el.children[i].style.left = this.el.children[index].offsetLeft + "px";

			// 5、 修改最小列的高度
			// 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
			arr[index] = arr[index] + this.el.children[i].offsetHeight + this.gap;
		}
	}
};

// 当加载到第30张的时候
WaterFall.prototype.loadmore = function (data) {
	if (this.el.scrollTop + this.getClient().height >= this.el.children[this.el.children.length - 1].offsetTop) {
		console.log(
			// this.getClient().height + getScrollTop(),
			this.el.children[this.el.children.length - 1].offsetTop,
			this.getClient().height,
			this.el.scrollTop,
			this.el.scrollHeight
		);

		for (var i = 0; i < data.length; i++) {
			var div = document.createElement("div");
			div.style.position = "absolute";
			div.style.boxShadow = "2px 2px 2px #999";
			div.innerHTML = '<img src="' + data[i] + '" alt="">';
			this.el.appendChild(div);
		}
		this.waterFall();
	}
};

WaterFall.prototype.setEleCss = function (el, width, height, backgroundColor) {
	el.style.width = width;
	el.style.height = height;
	el.style.backgroundColor = backgroundColor;
	el.style.overflow = "auto";
	el.style.position = "relative";

	for (var i = 0; i < this.el.children.length; i++) {
		this.el.children[i].style.boxShadow = "2px 2px 2px #999";
		this.el.children[i].style.position = "absolute";
	}
};

// scrollTop兼容性处理
const getScrollTop = function () {
	return window.pageYOffset || document.documentElement.scrollTop;
};

// 页面尺寸改变时实时触发
window.onresize = function () {
	this.waterFall();
};
