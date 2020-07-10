<div class="waifu">
	<div class="waifu-tips"></div>
	<canvas id="live2d" height="{{ theme.live2d.height }}" style="width:{{ theme.live2d.width }}px;" ></canvas>
	<div class="waifu-tool">
		<i class="fa fa-commenting" ></i>
		<i class="fa fa-camera" ></i>
		<i class="fa fa-chevron-down" ></i>
	</div>
</div>
<script type="text/javascript" src="{{ url_for(theme.js) }}/live2d.js"></script>
<script>
	loadlive2d('live2d', "{{ theme.live2d.model }}");
</script>
<script type="text/javascript" src="{{ url_for(theme.js) }}/waifu.js"></script>
