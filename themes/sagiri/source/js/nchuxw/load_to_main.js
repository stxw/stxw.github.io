window.onload = function () {
	var pathname = window.location.pathname;
	if(pathname != "/") {
		document.getElementById("main").scrollIntoView();
	}
}
