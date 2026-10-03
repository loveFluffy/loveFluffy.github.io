//======== 竖屏时横向翻页 ========//
const c = document.querySelector('.content');
const pw = () => c.clientWidth;

const portraitMQ = window.matchMedia('(orientation: portrait)');

let locked = false;
let acc = 0;
const THRESHOLD = 40;
const LOCK_MS = 400;

/* ---------- 翻页逻辑 ---------- */
function go(dir) {
	const current = Math.round(c.scrollLeft / pw());
	const max = Math.round((c.scrollWidth - c.clientWidth) / pw());
	const target = Math.max(0, Math.min(current + dir, max));
	if (target === current) return;
	locked = true;
	c.scrollTo({ left: target * pw(), behavior: 'smooth' });
	setTimeout(() => { locked = false; }, LOCK_MS);
}

/* ---------- 滚轮 ---------- */
function onWheel(e) {
	// 触控板横向滑动：放行，交给原生滚动
	if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

	e.preventDefault();
	if (locked) return;

	acc += e.deltaY;
	if (Math.abs(acc) < THRESHOLD) return;
	go(acc > 0 ? 1 : -1);
	acc = 0;
}

/* ---------- 键盘 ---------- */
function onKeydown(e) {
	if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
	if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
}

/* ---------- 根据方向绑定 / 解绑 ---------- */
function applyOrientation() {
	if (portraitMQ.matches) {
		// 竖屏：启用自定义翻页
		c.addEventListener('wheel', onWheel, { passive: false });
		document.addEventListener('keydown', onKeydown);
	} else {
		// 横屏：移除，交回浏览器原生
		c.removeEventListener('wheel', onWheel);
		document.removeEventListener('keydown', onKeydown);
	}
}

applyOrientation();

// 监听方向变化（旋转屏幕 / 窗口大小改变）
// 兼容旧浏览器：addListener / removeListener
if (portraitMQ.addEventListener) {
	portraitMQ.addEventListener('change', applyOrientation);
} else {
	portraitMQ.addListener(applyOrientation);
}




//======== 计算视窗宽度，直接把px数值写入 ========//
// 上面已经定义过了
// const c = document.querySelector('.content');
//function syncPageWidth() {
//// 读可视宽度（不含滚动条），写成 px
//c.style.setProperty('--page-w', c.clientWidth + 'px');
//}
//syncPageWidth();
//window.addEventListener('resize', syncPageWidth);
//window.addEventListener('orientationchange', syncPageWidth);
//window.addEventListener('load', syncPageWidth);