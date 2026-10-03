//======== 回到页面顶部按钮 ========//

function scrolltoShow(elem) {
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
		elem.style.visibility = "visible";
	} else {
		elem.style.visibility = "hidden";
	}
}
// When the user scrolls down, show the button
window.onscroll = function () { scrolltoShow(document.getElementById("backtotop")) };




//======== 目录自动高亮且随文本滚动而滚动 ========//

(function () {
	'use strict';

	var toc = document.querySelector('.toc');
	if (!toc) return;

	// 1. 建立 id -> link 映射
	var linkMap = {};
	toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
		var id = decodeURIComponent(link.getAttribute('href').slice(1));
		linkMap[id] = link;
	});

	// 2. 只遍历 h3 / h4 / h5，且目录里存在对应链接
	var headings = [];
	document.querySelectorAll('h3[id], h4[id], h5[id]').forEach(function (h) {
		if (linkMap[h.id]) {
			headings.push({ el: h, link: linkMap[h.id] });
		}
	});

	if (headings.length === 0) return;

	// 3. 基准线
	var OFFSET = 100;
	var ticking = false;

	// 4. 让高亮项在目录容器内可见
	function scrollTocToActive(activeLink) {
		var tocRect = toc.getBoundingClientRect();
		var linkRect = activeLink.getBoundingClientRect();

		// 高亮项当前在目录容器内的位置
		var linkOffsetInToc = linkRect.top - tocRect.top + toc.scrollTop;

		// 目标：让高亮项的中点和目录容器的中点对齐
		var target = linkOffsetInToc - tocRect.height / 2 + linkRect.height / 2;

		// 边界处理：不要滚到负数，也不要超出最大可滚范围
		var maxScroll = toc.scrollHeight - toc.clientHeight;
		target = Math.max(0, Math.min(target, maxScroll));

		toc.scrollTo({
			top: target,
			behavior: 'smooth'
		});
	}

	function updateActive() {
		var currentIndex = 0;

		for (var i = 0; i < headings.length; i++) {
			var rect = headings[i].el.getBoundingClientRect();
			if (rect.top <= OFFSET) {
				currentIndex = i;
			} else {
				break;
			}
		}

		// 滚到底部强制高亮最后一个
		if (window.innerHeight + window.pageYOffset >=
			document.documentElement.scrollHeight - 5) {
			currentIndex = headings.length - 1;
		}

		for (var j = 0; j < headings.length; j++) {
			headings[j].link.classList.toggle('active', j === currentIndex);
		}

		// 5. 目录同步滚动
		scrollTocToActive(headings[currentIndex].link);

		ticking = false;
	}

	window.addEventListener('scroll', function () {
		if (!ticking) {
			window.requestAnimationFrame(updateActive);
			ticking = true;
		}
	});

	window.addEventListener('resize', updateActive);
	updateActive();
})();