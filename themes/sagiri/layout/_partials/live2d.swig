<div class="waifu">
	<div class="waifu-tips"></div>
	<canvas id="live2d" height="{{ theme.live2d.height }}" style="width:{{ theme.live2d.width }}px;" ></canvas>
	<div class="waifu-tool">
		<span class="fui-chat"></span>
		<span class="fui-user"></span>
		<span class="fui-photo"></span>
		<span class="fui-home"></span>
	</div>
</div>
<script type="text/javascript" src="{{ url_for(theme.js) }}/live2d.js"></script>
<script>
	loadlive2d('live2d', "{{ theme.live2d.model }}");
</script>