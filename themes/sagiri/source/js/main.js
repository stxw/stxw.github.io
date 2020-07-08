const stxw = {
	load_to_main: function(){
		var pathname = window.location.pathname;
		var pre_pathname = sessionStorage.getItem("pre_pathname");
		var cur_st = $(document).scrollTop();
		if(pathname != "/" && cur_st < 10 && pathname != pre_pathname)
		{
			$('html, body').animate({
				scrollTop: $("#main").offset().top - 50
			}, 500);
		}
		sessionStorage.setItem("pre_pathname", pathname);
	}
}

$(function(){
	if(window.CONFIG.load_to_main){
		stxw.load_to_main();
	}
})
