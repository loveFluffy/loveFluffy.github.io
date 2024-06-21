function scrolltoShow(elem) {
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
		elem.style.visibility = "visible";
	} else {
		elem.style.visibility = "hidden";
	}
}
// When the user scrolls down, show the button
window.onscroll = function () { scrolltoShow(document.getElementById("backtotop")) };
