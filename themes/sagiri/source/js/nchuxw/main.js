window.onload = function () {
	var pathname = window.location.pathname;
	if(pathname != "/") {
		// document.getElementById("main").scrollIntoView();
		$('html, body').animate({
			scrollTop: $("#main").offset().top - 50
        }, 500);
	}
}
